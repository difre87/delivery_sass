<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Driver;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DriverSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $faker = Faker::create('fr_FR');

        $firstNames = [
            'Mohammed', 'Ahmed', 'Youssef', 'Hassan', 'Omar',
            'Fatima', 'Aicha', 'Khadija', 'Zineb', 'Salma',
            'Karim', 'Mehdi', 'Amine', 'Rachid', 'Said'
        ];

        $lastNames = [
            'Alami', 'Bennani', 'El Fassi', 'Idrissi', 'Tazi',
            'Benjelloun', 'Ghazi', 'Lazrak', 'Berrada', 'Kettani',
            'Chraibi', 'Sekkat', 'Lahlou', 'Amrani', 'Senhaji'
        ];

        // Créer 15 chauffeurs avec leurs utilisateurs
        for ($i = 1; $i <= 15; $i++) {
            $firstName = $faker->randomElement($firstNames);
            $lastName = $faker->randomElement($lastNames);
            $fullName = $firstName . ' ' . $lastName;
            $email = strtolower($firstName) . '.' . strtolower($lastName) . $i . '@expressdelivery.ma';

            // Créer l'utilisateur pour le chauffeur
            $user = User::create([
                'name' => $fullName,
                'email' => $email,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'current_company_id' => $company->id,
            ]);

            // Lier l'utilisateur à l'entreprise
            $user->companies()->attach($company->id, [
                'role' => 'driver',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Créer le profil chauffeur
            Driver::create([
                'company_id' => $company->id,
                'user_id' => $user->id,
                'name' => $fullName,
                'phone' => '+212 ' . $faker->numberBetween(6, 7) . $faker->numerify('## ## ## ##'),
                'license_number' => 'MA-' . $faker->numerify('########'),
                'license_expires_at' => $faker->dateTimeBetween('+6 months', '+3 years'),
                'is_active' => $faker->boolean(90), // 90% actifs
                'created_at' => now()->subDays($faker->numberBetween(30, 365)),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('✅ 15 chauffeurs créés avec leurs comptes utilisateurs!');
    }
}
