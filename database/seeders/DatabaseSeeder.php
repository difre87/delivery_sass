<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🚀 Démarrage du seeding de la base de données...');
        $this->command->newLine();

        // 1. Plans de souscription
        $this->command->info('📋 Création des plans de souscription...');
        $this->call(PlanSeeder::class);
        $this->command->newLine();

        // 2. Entreprise de démonstration + utilisateurs
        $this->command->info('🏢 Création de l\'entreprise de démonstration...');
        $this->call(CompanyDemoSeeder::class);
        $this->command->newLine();

        // 3. Clients
        $this->command->info('👥 Création des clients...');
        $this->call(ClientSeeder::class);
        $this->command->newLine();

        // 4. Adresses
        $this->command->info('📍 Création des adresses...');
        $this->call(AddressSeeder::class);
        $this->command->newLine();

        // 5. Chauffeurs
        $this->command->info('🚗 Création des chauffeurs...');
        $this->call(DriverSeeder::class);
        $this->command->newLine();

        // 6. Véhicules
        $this->command->info('🚚 Création des véhicules...');
        $this->call(VehicleSeeder::class);
        $this->command->newLine();

        // 7. Envois
        $this->command->info('📦 Création des envois...');
        $this->call(ShipmentSeeder::class);
        $this->command->newLine();

        // 8. Logs de carburant
        $this->command->info('⛽ Création des logs de carburant...');
        $this->call(FuelLogSeeder::class);
        $this->command->newLine();

        // 9. Factures
        $this->command->info('💰 Création des factures...');
        $this->call(InvoiceSeeder::class);
        $this->command->newLine();

        // 10. Bordereaux
        $this->command->info('📋 Création des bordereaux...');
        $this->call(WaybillSeeder::class);
        $this->command->newLine();

        $this->command->info('✨ Seeding terminé avec succès!');
        $this->command->newLine();
        $this->command->info('📧 Connexion admin: admin@expressdelivery.ma');
        $this->command->info('🔑 Mot de passe: password');
        $this->command->newLine();
    }
}
