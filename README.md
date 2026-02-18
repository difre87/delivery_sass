# Fleetigo - Solution de Gestion de Flotte et de Livraison

## 🚚 À propos de Fleetigo

Fleetigo est une plateforme SaaS complète de gestion de flotte et de livraison conçue pour les entreprises de transport et de logistique. Elle offre une solution tout-en-un pour gérer vos opérations de livraison, votre flotte de véhicules, vos chauffeurs et bien plus encore.

### ✨ Fonctionnalités principales

- **Multi-agences** : Gestion de plusieurs agences avec isolation des données
- **Gestion des expéditions** : Suivi complet des livraisons et colis
- **Gestion de flotte** : Suivi des véhicules, carburant, maintenance
- **Gestion des chauffeurs** : Permis, assignations, suivi d'activité
- **Clients** : Base de données clients avec historique
- **Factures** : Génération et suivi de facturation
- **Lettres de voiture** : Gestion documentaire complète
- **Suivi GPS** : Tracking en temps réel des véhicules
- **Rapports et Analytics** : Tableaux de bord et statistiques détaillées
- **Multi-devises** : Support de 7 devises (EUR, USD, GBP, MAD, CHF, CAD, XOF)
- **Système de modules** : Contrôle d'accès granulaire par utilisateur
- **Plans et abonnements** : Système de tarification flexible

### 🏗️ Technologies utilisées

- **Backend** : Laravel 11 (PHP 8.2+)
- **Frontend** : React 18 + TypeScript + Inertia.js
- **Styling** : Tailwind CSS + Framer Motion
- **Base de données** : MySQL / SQLite
- **PDF** : DomPDF pour génération de documents
- **Maps** : Google Maps API pour géolocalisation

## 🚀 Installation

### Prérequis

- PHP 8.2 ou supérieur
- Composer
- Node.js 18+ et npm
- MySQL ou SQLite

### Étapes d'installation

```bash
# Cloner le repository
git clone https://github.com/votre-repo/fleetigo.git
cd fleetigo

# Installer les dépendances PHP
composer install

# Installer les dépendances JavaScript
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# Puis exécuter les migrations
php artisan migrate --seed

# Compiler les assets
npm run dev

# Lancer le serveur de développement
php artisan serve
```

## 📚 Documentation

La documentation complète est disponible dans les fichiers suivants :

- `MODULE_ACCESS.md` - Système de contrôle d'accès aux modules
- `BRANCH_AUTO_ASSIGNMENT.md` - Assignation automatique des agences
- `CLIENTS_BY_BRANCH.md` - Gestion des clients par agence
- `SUPER_ADMIN.md` - Système d'administration

## 🔐 Compte Super Admin

Un compte super admin est créé par défaut :
- **Email** : admin@fleetigo.com
- **Mot de passe** : admin123456

⚠️ **Important** : Changez ce mot de passe en production !

## 📝 Structure du projet

```
fleetigo/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Concerns/
│   │   │   │   ├── AutoAssignsBranch.php
│   │   │   │   └── RequiresCompany.php
│   │   │   ├── ClientController.php
│   │   │   ├── ShipmentController.php
│   │   │   ├── PackageController.php
│   │   │   ├── DriverController.php
│   │   │   ├── VehicleController.php
│   │   │   └── ...
│   │   └── Middleware/
│   │       ├── CheckModuleAccess.php
│   │       ├── EnsureSuperAdmin.php
│   │       └── ...
│   └── Models/
│       ├── Client.php
│       ├── Shipment.php
│       ├── Package.php
│       ├── Driver.php
│       ├── Vehicle.php
│       └── ...
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Clients/
│   │   │   ├── Shipments/
│   │   │   ├── Packages/
│   │   │   ├── Drivers/
│   │   │   └── ...
│   │   ├── Components/
│   │   └── Layouts/
│   └── views/
├── database/
│   └── migrations/
└── routes/
    └── web.php
```

## 🧪 Tests

```bash
# Exécuter les tests
php artisan test

# Tests avec couverture
php artisan test --coverage
```

## 🌍 Multi-devises

Fleetigo supporte 7 devises avec conversion automatique :
- EUR (Euro) - Devise de base
- USD (Dollar américain)
- GBP (Livre sterling)
- MAD (Dirham marocain)
- CHF (Franc suisse)
- CAD (Dollar canadien)
- XOF (Franc CFA)

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

---

**Fleetigo** - Simplifiez la gestion de votre flotte 🚚✨

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
