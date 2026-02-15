<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Client;
use App\Models\Address;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $faker = Faker::create('fr_FR');

        $moroccanCities = [
            'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger',
            'Salé', 'Meknès', 'Oujda', 'Kenitra', 'Agadir',
            'Tétouan', 'Temara', 'Safi', 'Mohammedia', 'Khouribga'
        ];

        $addresses = [];

        // Créer 100 adresses génériques pour l'entreprise
        // Ces adresses seront utilisées par les shipments
        for ($i = 0; $i < 100; $i++) {
            $city = $faker->randomElement($moroccanCities);

            $addresses[] = [
                'company_id' => $company->id,
                'label' => $faker->optional(0.7)->randomElement(['Bureau', 'Entrepôt', 'Magasin', 'Domicile']),
                'contact_name' => $faker->name(),
                'contact_phone' => $faker->optional(0.8)->phoneNumber(),
                'line1' => $faker->streetAddress(),
                'line2' => $faker->optional(0.3)->secondaryAddress(),
                'city' => $city,
                'state' => $faker->optional(0.5)->randomElement(['Grand Casablanca', 'Rabat-Salé-Kénitra', 'Marrakech-Safi', 'Fès-Meknès', 'Tanger-Tétouan-Al Hoceïma']),
                'postal_code' => $faker->postcode(),
                'country_code' => 'MA',
                'latitude' => $faker->latitude(30, 35),
                'longitude' => $faker->longitude(-10, -5),
                'created_at' => now()->subDays($faker->numberBetween(1, 180)),
                'updated_at' => now(),
            ];
        }

        // Insertion par lots pour optimiser
        foreach (array_chunk($addresses, 500) as $chunk) {
            Address::insert($chunk);
        }

        $this->command->info('✅ ' . count($addresses) . ' adresses créées avec succès!');
    }
}
