# Système de Contrôle d'Accès aux Modules

## Vue d'ensemble

Le système de contrôle d'accès aux modules permet de définir quels modules de l'application sont accessibles à chaque utilisateur. Cela permet une gestion fine des permissions au-delà des simples rôles (owner, manager, staff).

## Modules Disponibles

Les modules suivants peuvent être activés/désactivés pour chaque utilisateur :

| Module | Clé | Description |
|--------|-----|-------------|
| Tableau de bord | `dashboard` | Vue d'ensemble et statistiques |
| Expéditions | `shipments` | Gestion des expéditions |
| Colis | `packages` | Gestion des colis |
| Clients | `clients` | Gestion des clients |
| Chauffeurs | `drivers` | Gestion des chauffeurs |
| Véhicules | `vehicles` | Gestion de la flotte |
| Course & Feuilles de route | `dispatch` | Planification des courses |
| Lettres de voiture | `waybills` | Gestion des lettres de voiture |
| Factures | `invoices` | Gestion de la facturation |
| Carburant | `fuel` | Suivi des pleins de carburant |
| Suivi GPS | `tracking` | Tracking GPS en temps réel |
| Rapports | `reports` | Rapports et analytics |
| Paramètres | `settings` | Configuration de la société |

## Configuration

### Base de données

La table `users` contient une colonne `allowed_modules` de type JSON qui stocke la liste des modules autorisés.

```sql
ALTER TABLE users ADD COLUMN allowed_modules JSON NULL;
```

### Modèle User

La constante `User::AVAILABLE_MODULES` définit tous les modules disponibles.

```php
use App\Models\User;

// Liste complète des modules
$modules = User::AVAILABLE_MODULES;

// Vérifier l'accès
if ($user->hasAccessToModule('shipments')) {
    // L'utilisateur a accès au module expéditions
}
```

## Règles d'accès

### Super Admin
- A accès à **TOUS** les modules sans restriction
- `allowed_modules` est ignoré

### Owner (Propriétaire)
- A accès à **TOUS** les modules par défaut
- `allowed_modules` est ignoré

### Manager et Staff
- Si `allowed_modules` est `NULL` ou vide : accès à **TOUS** les modules (rétrocompatibilité)
- Si `allowed_modules` contient une liste : accès uniquement aux modules listés

## Utilisation

### Lors de la création d'un utilisateur

```php
$user = User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => Hash::make('password'),
    'allowed_modules' => ['dashboard', 'shipments', 'clients'], // Uniquement ces 3 modules
]);
```

### Mise à jour des modules

```php
$user->update([
    'allowed_modules' => ['dashboard', 'shipments', 'packages', 'drivers'],
]);
```

### Vérification dans les contrôleurs

Le middleware `CheckModuleAccess` vérifie automatiquement l'accès en fonction du nom de la route.

```php
// Dans web.php - applique automatiquement le middleware
Route::middleware(['auth', 'module'])->group(function () {
    Route::get('/shipments', [ShipmentController::class, 'index'])->name('shipments.index');
});

// Ou manuellement dans le contrôleur
if (!$user->hasAccessToModule('shipments')) {
    abort(403, 'Accès refusé au module Expéditions');
}
```

### Vérification dans le frontend

Les modules autorisés sont passés dans `auth.permissions.allowedModules` :

```tsx
import { usePage } from '@inertiajs/react';

const { auth } = usePage().props;
const allowedModules = auth.permissions.allowedModules || [];

// Vérifier l'accès
if (allowedModules.includes('shipments')) {
    // Afficher le lien vers les expéditions
}

// Cacher les éléments de menu non autorisés
const menuItems = [
    { name: 'Expéditions', module: 'shipments', href: '/shipments' },
    { name: 'Clients', module: 'clients', href: '/clients' },
].filter(item => allowedModules.includes(item.module));
```

## Middleware

Le middleware `CheckModuleAccess` :
1. Détecte automatiquement le module depuis le nom de la route
2. Vérifie si l'utilisateur a accès au module
3. Retourne 403 si accès refusé

Mapping des routes vers les modules :

```php
'dashboard' => 'dashboard',
'shipments.*' => 'shipments',
'packages.*' => 'packages',
'clients.*' => 'clients',
// etc.
```

## Interface utilisateur

### Formulaire de création/modification d'utilisateur

Le formulaire dans **Paramètres > Utilisateurs** affiche :

1. **Informations de base** : Nom, Email, Mot de passe
2. **Rôle** : Owner / Manager / Staff
3. **Branches** : Sélection multiple des branches accessibles
4. **Modules** : Checkboxes pour sélectionner les modules autorisés

Les checkboxes des modules sont :
- Désactivées pour les **Owners** (accès complet automatique)
- Activées pour les **Managers** et **Staff**
- Cochées par défaut (accès complet si aucune sélection)

## Migration depuis l'ancien système

Les utilisateurs existants ont `allowed_modules = NULL`, ce qui leur donne accès à tous les modules (rétrocompatibilité).

Pour restreindre l'accès :

```sql
-- Exemple : Limiter un utilisateur spécifique
UPDATE users 
SET allowed_modules = '["dashboard", "shipments", "clients"]' 
WHERE id = 123;

-- Exemple : Donner accès complet explicite
UPDATE users 
SET allowed_modules = NULL 
WHERE role = 'owner';
```

## Bonnes pratiques

1. **Owners** : Ne pas limiter les modules, ils ont besoin d'un accès complet
2. **Managers** : Donner accès aux modules de gestion opérationnelle
3. **Staff** : Limiter aux modules nécessaires à leur fonction
4. **Nouveau utilisateur** : Par défaut, donner accès complet, puis ajuster selon les besoins
5. **Documentation** : Informer l'utilisateur des restrictions lors de la création du compte

## Exemples de configuration

### Chauffeur (Staff)
```json
["dashboard", "shipments", "packages", "dispatch"]
```

### Gestionnaire de flotte (Manager)
```json
["dashboard", "drivers", "vehicles", "fuel", "tracking"]
```

### Comptable (Manager)
```json
["dashboard", "invoices", "clients", "reports"]
```

### Commercial (Staff)
```json
["dashboard", "clients", "shipments", "packages"]
```

### Dispatching (Staff)
```json
["dashboard", "shipments", "drivers", "vehicles", "dispatch", "tracking"]
```

## Dépannage

### L'utilisateur ne voit pas un module

1. Vérifier `allowed_modules` dans la base de données
2. Vérifier le rôle de l'utilisateur
3. Vérifier si le middleware est appliqué sur la route
4. Vérifier les logs pour les erreurs 403

### Tous les modules sont visibles malgré les restrictions

- Vérifier si l'utilisateur est **Owner** ou **Super Admin**
- Ces rôles outrepassent les restrictions de modules

### Le frontend affiche le module mais le backend refuse l'accès

- Le middleware backend est la source de vérité
- Synchroniser la logique frontend avec le mapping du middleware
