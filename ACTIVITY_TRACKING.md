# Système de Tracking/Audit d'Activités

## État de l'intégration

### ✅ INTÉGRATION COMPLÈTE (10/10) 🎉

Tous les controllers principaux ont été intégrés avec succès!

#### Controllers Haute Priorité (5/5) ✅

1. **DriverController** ✅
   - store(): Log création chauffeur avec nom
   - update(): Log modifications avec comparaison old/new values
   - destroy(): Log désactivation avec nom du chauffeur

2. **VehicleController** ✅
   - store(): Log création véhicule avec plaque
   - update(): Log modifications avec comparaison old/new values
   - destroy(): Log suppression avec plaque

3. **ClientController** ✅
   - store(): Log création client avec nom
   - update(): Log modifications avec comparaison old/new values
   - destroy(): Log suppression avec nom du client

4. **ShipmentController** ✅
   - store(): Log création livraison avec ID et client
   - update(): Log modifications (statut, adresse, packages)
   - destroy(): Log suppression avec ID de livraison

5. **WaybillController** ✅
   - store(): Log création bordereau avec numéro et nombre de livraisons
   - update(): Log modifications (statut: draft, issued, in_progress, completed)
   - destroy(): Log suppression avec numéro de bordereau

#### Controllers Priorité Moyenne (3/3) ✅

6. **InvoiceController** ✅
   - store(): Log création facture avec numéro et client
   - update(): Log modifications (statut: draft, sent, paid, overdue)
   - destroy(): Log suppression avec numéro de facture

7. **PackageController** ✅
   - store(): Log création colis avec tracking number
   - update(): Log modifications (statut, livraison associée)
   - destroy(): Log suppression avec tracking number

8. **DispatchRunController** ✅
   - store(): Log création tournée avec date et nombre de livraisons
   - update(): Log modifications (statut, horaires, livraisons assignées)
   - destroy(): Log suppression avec date de tournée

#### Controllers Priorité Basse (2/2) ✅

9. **FuelLogController** ✅
   - store(): Log enregistrement plein carburant avec volume et véhicule
   - update(): Log modifications (volume, montant, kilométrage)
   - destroy(): Log suppression avec véhicule

10. **CompanyBranchController** ✅
    - store(): Log création d'agence avec nom
    - update(): Log modifications (nom, adresse, ville)
    - destroy(): Log suppression avec nom d'agence

### 📊 Statistiques Finales

- **Controllers intégrés: 10/10 (100%)** ✅
- **Controllers haute priorité: 5/5 (100%)** ✅
- **Controllers moyenne priorité: 3/3 (100%)** ✅
- **Controllers basse priorité: 2/2 (100%)** ✅
- **Aucune erreur de compilation** ✅

### ✨ Fonctionnalités Complètes

Le système de tracking permet d'enregistrer toutes les actions des utilisateurs sur les différents modules de l'application. Cela permet de :
- Suivre qui a fait quoi et quand
- Auditer les modifications de données
- Identifier les problèmes de sécurité
- Générer des rapports d'activité
- Se conformer aux réglementations (RGPD, etc.)

## Architecture

### 1. Table `activity_logs`

```sql
- id: ID unique
- user_id: Utilisateur qui a effectué l'action (nullable)
- company_id: Compagnie concernée
- branch_id: Agence concernée (nullable)
- action: Type d'action (created, updated, deleted, viewed, exported, etc.)
- module: Module concerné (drivers, vehicles, clients, shipments, etc.)
- subject_type: Type de modèle (Model class)
- subject_id: ID du modèle
- description: Description lisible de l'action
- properties: JSON avec old_values, new_values, attributes
- ip_address: Adresse IP de l'utilisateur
- user_agent: User agent du navigateur
- created_at, updated_at
```

### 2. Modèle `ActivityLog`

Situé dans `app/Models/ActivityLog.php`

**Relations** :
- `user()` - Utilisateur qui a effectué l'action
- `company()` - Compagnie
- `branch()` - Agence
- `subject()` - Modèle concerné (polymorphic)

**Scopes** :
- `forCompany($companyId)` - Filtrer par compagnie
- `byUser($userId)` - Filtrer par utilisateur
- `inModule($module)` - Filtrer par module
- `withAction($action)` - Filtrer par action
- `betweenDates($start, $end)` - Filtrer par période

### 3. Trait `LogsActivity`

Situé dans `app/Traits/LogsActivity.php`

**Méthodes disponibles** :

```php
// Log général
LogsActivity::logActivity($action, $module, $description, $subject, $properties);

// Raccourcis
LogsActivity::logCreated($module, $subject, $description);
LogsActivity::logUpdated($module, $subject, $oldValues, $newValues, $description);
LogsActivity::logDeleted($module, $subject, $description);
LogsActivity::logViewed($module, $subject, $description);
LogsActivity::logExported($module, $description, $properties);
LogsActivity::logCustomAction($action, $module, $description, $subject, $properties);
```

## Utilisation

### 1. Dans un contrôleur

```php
<?php

namespace App\Http\Controllers;

use App\Traits\LogsActivity;

class DriverController extends Controller
{
    use LogsActivity;

    public function store(Request $request)
    {
        $driver = Driver::create($validated);
        
        // Log l'activité
        static::logCreated('drivers', $driver, "Création du chauffeur {$driver->name}");
        
        return redirect()->route('drivers.index');
    }

    public function update(Request $request, Driver $driver)
    {
        $oldValues = $driver->getOriginal();
        $driver->update($validated);
        $newValues = $driver->getAttributes();
        
        // Log l'activité
        static::logUpdated(
            'drivers', 
            $driver, 
            $oldValues, 
            $newValues, 
            "Modification du chauffeur {$driver->name}"
        );
        
        return redirect()->route('drivers.index');
    }

    public function destroy(Request $request, Driver $driver)
    {
        $driverName = $driver->name;
        $driver->delete();
        
        // Log l'activité
        static::logDeleted('drivers', $driver, "Suppression du chauffeur {$driverName}");
        
        return redirect()->route('drivers.index');
    }

    public function index(Request $request)
    {
        // Log la consultation
        static::logViewed('drivers', null, 'Consultation de la liste des chauffeurs');
        
        $drivers = Driver::paginate();
        return Inertia::render('Drivers/Index', ['drivers' => $drivers]);
    }
}
```

### 2. Log d'export

```php
public function export(Request $request)
{
    $drivers = Driver::all();
    
    // Log l'export
    static::logExported('drivers', 'Export CSV des chauffeurs', [
        'count' => $drivers->count(),
        'format' => 'csv',
    ]);
    
    return response()->download($file);
}
```

### 3. Log d'action personnalisée

```php
// Assigner un véhicule à un chauffeur
static::logCustomAction(
    'assigned',
    'drivers',
    "Assignation du véhicule {$vehicle->plate_number} au chauffeur {$driver->name}",
    $driver,
    [
        'vehicle_id' => $vehicle->id,
        'vehicle_plate' => $vehicle->plate_number,
    ]
);

// Changer le statut d'une expédition
static::logCustomAction(
    'status_changed',
    'shipments',
    "Changement de statut de {$oldStatus} à {$newStatus}",
    $shipment,
    [
        'old_status' => $oldStatus,
        'new_status' => $newStatus,
    ]
);
```

## Interface d'administration

### Route
```
GET /{company}/activity-logs
```

**Permission requise** : `can:access-analytics`

### Fonctionnalités

- **Statistiques** :
  - Total d'activités
  - Activités aujourd'hui
  - Activités cette semaine

- **Filtres** :
  - Par utilisateur
  - Par module
  - Par action
  - Par date
  - Recherche textuelle

- **Affichage** :
  - Date/heure avec temps relatif
  - Utilisateur et agence
  - Badge coloré selon l'action
  - Module
  - Description
  - Pagination (50 résultats par page)

### Couleurs des actions

- **created** : Vert (création)
- **updated** : Bleu (modification)
- **deleted** : Rouge (suppression)
- **viewed** : Gris (consultation)
- **exported** : Violet (export)

## Modules à tracker

Voici la liste des modules recommandés à tracker :

| Module | Actions à logger |
|--------|------------------|
| **drivers** | created, updated, deleted, viewed, assigned, unassigned |
| **vehicles** | created, updated, deleted, viewed, assigned, unassigned |
| **clients** | created, updated, deleted, viewed, exported |
| **shipments** | created, updated, deleted, viewed, status_changed, exported |
| **packages** | created, updated, deleted, viewed |
| **routes** | created, updated, deleted, viewed, started, completed |
| **waybills** | created, updated, deleted, viewed, issued, completed, exported |
| **invoices** | created, updated, deleted, viewed, sent, paid, exported |
| **fuel** | created, updated, deleted, viewed, exported |
| **branches** | created, updated, deleted |
| **users** | created, updated, deleted, role_changed |
| **settings** | updated |

## Exemples d'intégration par module

### Drivers (✅ Déjà intégré)

```php
// DriverController.php
use LogsActivity;

public function store() {
    $driver = Driver::create($validated);
    static::logCreated('drivers', $driver, "Création du chauffeur {$driver->name}");
}

public function update() {
    $oldValues = $driver->getOriginal();
    $driver->update($validated);
    $newValues = $driver->getAttributes();
    static::logUpdated('drivers', $driver, $oldValues, $newValues);
}

public function destroy() {
    $name = $driver->name;
    $driver->delete();
    static::logDeleted('drivers', $driver, "Suppression du chauffeur {$name}");
}
```

### Vehicles (À intégrer)

```php
// VehicleController.php
use LogsActivity;

public function store() {
    $vehicle = Vehicle::create($validated);
    static::logCreated('vehicles', $vehicle, "Création du véhicule {$vehicle->plate_number}");
}
```

### Clients (À intégrer)

```php
// ClientController.php
use LogsActivity;

public function store() {
    $client = Client::create($validated);
    static::logCreated('clients', $client, "Création du client {$client->name}");
}
```

## Bonnes pratiques

### 1. Toujours logger les actions CRUD

```php
public function store() {
    $model = Model::create($data);
    static::logCreated('module_name', $model);
    // ...
}
```

### 2. Logger les changements de statut

```php
$oldStatus = $shipment->status;
$shipment->update(['status' => 'delivered']);
static::logCustomAction('status_changed', 'shipments', 
    "Statut changé de {$oldStatus} à delivered", $shipment);
```

### 3. Logger les exports avec métadonnées

```php
static::logExported('drivers', 'Export CSV des chauffeurs', [
    'count' => $count,
    'format' => 'csv',
    'filters' => $request->only(['search', 'status']),
]);
```

### 4. Logger les consultations importantes

```php
// Ne pas logger chaque requête GET, seulement les consultations importantes
static::logViewed('shipment', $shipment, "Consultation de l'expédition #{$shipment->id}");
```

### 5. Ne pas logger les informations sensibles

```php
// ❌ Mauvais
static::logUpdated('users', $user, ['password' => 'old_hash'], ['password' => 'new_hash']);

// ✅ Bon
$oldValues = $user->getOriginal();
unset($oldValues['password']);
$newValues = $user->getAttributes();
unset($newValues['password']);
static::logUpdated('users', $user, $oldValues, $newValues);
```

## Maintenance

### Nettoyage des vieux logs

```php
// Supprimer les logs de plus de 90 jours
ActivityLog::where('created_at', '<', now()->subDays(90))->delete();
```

### Créer une commande artisan

```php
// app/Console/Commands/CleanOldActivityLogs.php
php artisan make:command CleanOldActivityLogs

public function handle()
{
    $days = 90;
    $deleted = ActivityLog::where('created_at', '<', now()->subDays($days))->delete();
    $this->info("Supprimé {$deleted} logs de plus de {$days} jours.");
}
```

### Ajouter dans le scheduler

```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->command('activity-logs:clean')->monthly();
}
```

## Sécurité et RGPD

### Anonymisation des données

Si un utilisateur demande la suppression de ses données :

```php
ActivityLog::where('user_id', $userId)->update([
    'user_id' => null,
    'description' => '[Utilisateur supprimé] ' . $log->description,
    'ip_address' => null,
    'user_agent' => null,
]);
```

### Rétention des données

Définir une politique de rétention :
- Logs opérationnels : 90 jours
- Logs de sécurité : 1 an
- Logs d'audit : 3 ans (selon réglementation)

## Performance

### Index recommandés

Les index suivants sont déjà créés dans la migration :

```sql
INDEX (company_id, created_at)
INDEX (user_id, created_at)
INDEX (module, action)
INDEX (subject_type, subject_id)
```

### Pagination

Toujours paginer les résultats (50 par défaut).

### Archivage

Pour les grandes bases de données, considérer l'archivage :

```sql
CREATE TABLE activity_logs_archive LIKE activity_logs;
INSERT INTO activity_logs_archive SELECT * FROM activity_logs WHERE created_at < '2025-01-01';
DELETE FROM activity_logs WHERE created_at < '2025-01-01';
```

---

**Date de création** : 17 février 2026  
**Version** : 1.0  
**Auteur** : System
