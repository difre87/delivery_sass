# Système Super Admin

## Vue d'ensemble

Le système super admin permet à des utilisateurs privilégiés de gérer l'ensemble de la plateforme, incluant toutes les sociétés, utilisateurs, plans et abonnements.

## Configuration

### 1. Promouvoir un utilisateur en Super Admin

Utilisez la commande Artisan pour promouvoir un utilisateur existant :

```bash
php artisan user:make-super-admin email@example.com
```

### 2. Accès Super Admin

Une fois promu, l'utilisateur aura accès à :
- Dashboard admin : `/admin/dashboard`
- Gestion des sociétés : `/admin/companies`
- Gestion des utilisateurs : `/admin/users`
- Gestion des plans : `/admin/plans`

### 3. Menu de navigation

Le menu "Super Admin" apparaît automatiquement dans la sidebar pour les utilisateurs ayant le privilège `is_super_admin`.

## Fonctionnalités

### Dashboard Admin
- **Statistiques globales** : Nombre total d'utilisateurs, sociétés, abonnements actifs
- **Revenu total** : Somme des revenus de tous les abonnements actifs
- **Sociétés récentes** : Liste des 10 dernières sociétés créées
- **Utilisateurs récents** : Liste des 10 derniers utilisateurs inscrits

### Gestion des Sociétés
- Voir toutes les sociétés de la plateforme
- Rechercher par nom ou email
- Voir les abonnements et propriétaires

### Gestion des Utilisateurs
- Voir tous les utilisateurs
- Rechercher par nom ou email
- Identifier les super admins

### Gestion des Plans
- Voir tous les plans d'abonnement
- Statistiques d'abonnements par plan

## Sécurité

### Middleware `super-admin`
Le middleware `EnsureSuperAdmin` protège toutes les routes admin :
- Vérifie que l'utilisateur est authentifié
- Vérifie le flag `is_super_admin`
- Retourne une erreur 403 si l'accès est refusé

### Base de données
- Champ `is_super_admin` dans la table `users`
- Type : `boolean`, défaut : `false`
- Migration : `2026_02_17_235500_add_is_super_admin_to_users_table.php`

## Fichiers créés

### Backend
- `database/migrations/2026_02_17_235500_add_is_super_admin_to_users_table.php` - Migration
- `app/Console/Commands/MakeSuperAdmin.php` - Commande Artisan
- `app/Http/Middleware/EnsureSuperAdmin.php` - Middleware de protection
- `app/Http/Controllers/Admin/AdminDashboardController.php` - Contrôleur admin

### Frontend
- `resources/js/Pages/Admin/Dashboard.tsx` - Page dashboard super admin

### Configuration
- `bootstrap/app.php` - Enregistrement du middleware
- `routes/web.php` - Routes admin
- `app/Http/Middleware/HandleInertiaRequests.php` - Permission `isSuperAdmin`
- `resources/js/Layouts/AuthenticatedLayout.tsx` - Menu Super Admin

## Utilisation

1. **Créer le premier super admin**
   ```bash
   php artisan user:make-super-admin votre-email@example.com
   ```

2. **Se connecter avec ce compte**

3. **Accéder au dashboard admin**
   - Cliquer sur "Super Admin" dans la sidebar
   - Ou naviguer vers `/admin/dashboard`

4. **Gérer la plateforme**
   - Voir les statistiques globales
   - Gérer les sociétés et utilisateurs
   - Superviser les abonnements

## Notes importantes

- ⚠️ **Attention** : Les super admins ont un accès total à la plateforme
- 🔒 **Sécurité** : Limitez le nombre de super admins
- 📊 **Monitoring** : Les actions des super admins devraient être loggées (à implémenter)
- 🔑 **Production** : Utilisez des comptes sécurisés avec authentification forte (2FA recommandé)

## Évolutions futures possibles

- [ ] Gestion CRUD complète des sociétés depuis l'admin
- [ ] Gestion CRUD complète des plans
- [ ] Logs d'activité des super admins
- [ ] Export de données (CSV, Excel)
- [ ] Statistiques avancées et graphiques
- [ ] Notifications admin
- [ ] Système de tickets support
- [ ] Gestion des paiements et factures
- [ ] Authentification à deux facteurs (2FA) obligatoire
