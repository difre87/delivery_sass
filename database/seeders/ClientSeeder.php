<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Client;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $faker = Faker::create('fr_FR');

        $clients = [];

        // Créer 60 clients
        for ($i = 1; $i <= 60; $i++) {
            $clients[] = [
                'company_id' => $company->id,
                'name' => $faker->boolean(60) 
                    ? $faker->company()
                    : $faker->firstName() . ' ' . $faker->lastName(),
                'code' => 'CLI-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'email' => $faker->unique()->safeEmail(),
                'phone' => $faker->phoneNumber(),
                'notes' => $faker->optional(0.3)->sentence(),
                'is_active' => $faker->boolean(95), // 95% actifs
                'created_at' => now()->subDays($faker->numberBetween(1, 180)),
                'updated_at' => now()->subDays($faker->numberBetween(0, 30)),
            ];
        }

        Client::insert($clients);

        $this->command->info('✅ 60 clients créés avec succès!');
    }
}
