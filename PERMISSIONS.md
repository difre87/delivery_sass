# Système de Permissions

## Vue d'ensemble

Le système de permissions est basé sur les rôles utilisateurs dans la compagnie. Chaque utilisateur a un rôle spécifique (owner, manager, staff) dans la table pivot `company_user`.

## Rôles

### 👑 Owner (Propriétaire)
- **Accès complet** à toutes les fonctionnalités
- Peut gérer les paramètres de la compagnie
- Peut créer/modifier/supprimer des agences
- Peut gérer tous les utilisateurs

> **Note** : Le rôle legacy `admin` est automatiquement traité comme `owner` pour rétrocompatibilité.

### 👔 Manager (Gestionnaire)
- **Accès opérationnel** complet
- Peut gérer les clients, chauffeurs, véhicules, tournées, expéditions
- Peut accéder aux analytics et rapports
- Peut gérer les utilisateurs (mais pas les paramètres de compagnie ni les agences)
- **Ne peut pas** modifier les paramètres de la compagnie
- **Ne peut pas** gérer les agences

### 👤 Staff (Personnel)
- **Accès lecture seule** aux expéditions
- Peut voir les expéditions, colis, feuilles de route
- **Ne peut pas** créer, modifier ou supprimer de données
- **Ne peut pas** accéder aux paramètres, analytics ou exports

## Permissions Disponibles

| Permission | Owner | Manager | Staff | Description |
|-----------|-------|---------|-------|-------------|
| `access-settings` | ✅ | ✅ | ❌ | Accéder à la section Paramètres |
| `manage-users` | ✅ | ✅ | ❌ | Gérer les utilisateurs de la compagnie |
| `manage-branches` | ✅ | ❌ | ❌ | Créer/modifier/supprimer des agences |
| `manage-company-settings` | ✅ | ❌ | ❌ | Modifier les paramètres de la compagnie |
| `manage-drivers` | ✅ | ✅ | ❌ | Gérer les chauffeurs |
| `manage-fleet` | ✅ | ✅ | ❌ | Gérer les véhicules et carnets de carburant |
| `manage-routes` | ✅ | ✅ | ❌ | Gérer les tournées et feuilles de route |
| `manage-clients` | ✅ | ✅ | ❌ | Gérer les clients et factures |
| `view-shipments` | ✅ | ✅ | ✅ | Voir les expéditions et colis |
| `manage-shipments` | ✅ | ✅ | ❌ | Créer/modifier/supprimer des expéditions |
| `access-analytics` | ✅ | ✅ | ❌ | Accéder aux analytics et statistiques |

## Implémentation Backend

### 1. Policy (app/Policies/CompanyPolicy.php)
La logique métier des permissions. Chaque méthode vérifie le rôle de l'utilisateur dans la compagnie courante.

```php
public function manageDrivers(User $user): bool
{
    $role = $this->getUserRole($user);
    return in_array($role, ['owner', 'manager']);
}
```

### 2. Gates (app/Providers/AppServiceProvider.php)
Enregistrement des permissions Laravel.

```php
Gate::define('manage-drivers', [CompanyPolicy::class, 'manageDrivers']);
```

### 3. Middleware (app/Http/Middleware/CheckPermission.php)
Protection des routes.

```php
Route::get('/drivers', [DriverController::class, 'index'])
    ->middleware('can:manage-drivers');
```

### 4. Inertia Props (app/Http/Middleware/HandleInertiaRequests.php)
Partage des permissions avec le frontend.

```php
'permissions' => [
    'canManageDrivers' => Gate::allows('manage-drivers'),
    // ...
]
```

## Utilisation Frontend

### Vérifier une permission dans une page

```typescript
import { PageProps } from '@/types';

export default function DriversIndex({ auth, permissions }: PageProps<{ drivers: PaginatedData<Driver> }>) {
    return (
        <>
            {permissions?.canManageDrivers && (
                <Button onClick={openCreateModal}>
                    Créer un chauffeur
                </Button>
            )}
        </>
    );
}
```

### Masquer un lien de navigation

```typescript
{permissions?.canManageFleet && (
    <NavigationLink href={route('fleet.index')}>
        Flotte
    </NavigationLink>
)}
```

## Routes Protégées

Toutes les routes suivantes sont protégées par les permissions :

- **Clients** → `manage-clients`
- **Chauffeurs** → `manage-drivers`
- **Véhicules & Carburant** → `manage-fleet`
- **Tournées & Feuilles de route** → `manage-routes`
- **Expéditions (création/modification)** → `manage-shipments`
- **Colis** → `manage-shipments`
- **Factures** → `manage-clients`
- **Analytics** → `access-analytics`
- **Exports CSV** → Permission correspondante au domaine
- **Paramètres/Compagnie** → `manage-company-settings`
- **Paramètres/Agences** → `manage-branches`
- **Paramètres/Utilisateurs** → `manage-users`

## Tests Recommandés

### Test en tant que Owner
1. Créer un utilisateur avec le rôle "owner"
2. Vérifier l'accès à tous les menus
3. Vérifier la possibilité de créer/modifier/supprimer dans toutes les sections

### Test en tant que Manager
1. Créer un utilisateur avec le rôle "manager"
2. Vérifier l'accès aux opérations (clients, chauffeurs, tournées, etc.)
3. Vérifier l'impossibilité d'accéder aux paramètres de compagnie et agences
4. Vérifier l'accès à la gestion des utilisateurs

### Test en tant que Staff
1. Créer un utilisateur avec le rôle "staff"
2. Vérifier l'accès en lecture seule aux expéditions
3. Vérifier l'absence des boutons de création/modification
4. Vérifier l'erreur 403 lors de tentatives d'accès aux routes protégées

## Notes Importantes

- Les permissions sont **toujours vérifiées côté backend** (middleware)
- Le frontend masque les éléments UI pour améliorer l'expérience utilisateur
- Un utilisateur peut avoir des rôles différents dans différentes compagnies
- Les permissions sont toujours évaluées par rapport à la compagnie courante (`current_company_id`)
- Lors du changement d'agence, les permissions restent les mêmes (basées sur le rôle dans la compagnie)
