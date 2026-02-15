<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CompanyDemoSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer le plan Business
        $businessPlan = Plan::where('slug', 'business')->first();

        // Créer une entreprise de démonstration
        $company = Company::create([
            'name' => 'Express Delivery Pro',
            'slug' => 'express-delivery-pro',
            'email' => 'contact@expressdelivery.ma',
            'phone' => '+212 5 22 48 56 78',
            'address' => '123 Avenue Mohammed V, Quartier des Affaires',
            'city' => 'Casablanca',
            'postal_code' => '20250',
            'country' => 'Maroc',
            'registration_number' => 'RC-123456-2020',
            'tax_id' => 'IF-45678901',
            'website' => 'https://expressdelivery.ma',
        ]);

        $this->command->info("✅ Entreprise créée: {$company->name}");

        // Créer une souscription active
        Subscription::create([
            'company_id' => $company->id,
            'plan_id' => $businessPlan->id,
            'status' => 'active',
            'starts_at' => now(),
            'renews_at' => now()->addMonth(),
            'trial_ends_at' => null,
        ]);

        $this->command->info("✅ Souscription Business créée pour {$company->name}");

        // Créer un utilisateur admin
        $admin = User::create([
            'name' => 'Admin Demo',
            'email' => 'admin@expressdelivery.ma',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'current_company_id' => $company->id,
        ]);

        // Attacher l'utilisateur à l'entreprise
        $admin->companies()->attach($company->id, [
            'role' => 'admin',
        ]);

        $this->command->info("✅ Admin créé: {$admin->email} (password: password)");

        // Créer quelques utilisateurs supplémentaires
        $users = [
            [
                'name' => 'Marie Dubois',
                'email' => 'marie@expressdelivery.ma',
                'role' => 'manager',
            ],
            [
                'name' => 'Pierre Martin',
                'email' => 'pierre@expressdelivery.ma',
                'role' => 'dispatcher',
            ],
            [
                'name' => 'Sophie Bernard',
                'email' => 'sophie@expressdelivery.ma',
                'role' => 'member',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'current_company_id' => $company->id,
            ]);

            $user->companies()->attach($company->id, [
                'role' => $userData['role'],
            ]);

            $this->command->info("✅ Utilisateur créé: {$user->email}");
        }
    }
}
