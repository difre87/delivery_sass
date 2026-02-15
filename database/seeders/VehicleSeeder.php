<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $faker = Faker::create('fr_FR');

        $vehicleTypes = [
            ['make' => 'Peugeot', 'model' => 'Partner', 'capacity_kg' => 650, 'capacity_m3' => 3.3, 'fuel_type' => 'diesel'],
            ['make' => 'Renault', 'model' => 'Kangoo', 'capacity_kg' => 600, 'capacity_m3' => 3.0, 'fuel_type' => 'diesel'],
            ['make' => 'Citroën', 'model' => 'Berlingo', 'capacity_kg' => 625, 'capacity_m3' => 3.3, 'fuel_type' => 'diesel'],
            ['make' => 'Mercedes', 'model' => 'Sprinter', 'capacity_kg' => 1200, 'capacity_m3' => 10.5, 'fuel_type' => 'diesel'],
            ['make' => 'Ford', 'model' => 'Transit', 'capacity_kg' => 1100, 'capacity_m3' => 9.5, 'fuel_type' => 'diesel'],
            ['make' => 'Volkswagen', 'model' => 'Crafter', 'capacity_kg' => 1300, 'capacity_m3' => 11.0, 'fuel_type' => 'diesel'],
            ['make' => 'Fiat', 'model' => 'Ducato', 'capacity_kg' => 1050, 'capacity_m3' => 8.5, 'fuel_type' => 'diesel'],
            ['make' => 'Iveco', 'model' => 'Daily', 'capacity_kg' => 1400, 'capacity_m3' => 12.0, 'fuel_type' => 'diesel'],
        ];

        $moroccoCities = ['A', 'B', 'D', 'WW', 'WJ', 'WK'];
        $vehicles = [];

        // Créer 25 véhicules
        for ($i = 1; $i <= 25; $i++) {
            $vehicleData = $faker->randomElement($vehicleTypes);
            $year = $faker->numberBetween(2018, 2025);
            $registrationYear = $faker->numberBetween($year, 2025);
            $cityCode = $faker->randomElement($moroccoCities);
            $plateNumber = $cityCode . '-' . $faker->numberBetween(10000, 99999);

            $vehicles[] = [
                'company_id' => $company->id,
                'plate_number' => $plateNumber,
                'make' => $vehicleData['make'],
                'model' => $vehicleData['model'],
                'year' => $year,
                'fuel_type' => $vehicleData['fuel_type'],
                'capacity_kg' => $vehicleData['capacity_kg'],
                'capacity_m3' => $vehicleData['capacity_m3'],
                'odometer_km' => $faker->numberBetween(10000, 250000),
                'status' => $faker->randomElement(['active', 'active', 'active', 'maintenance', 'inactive']),
                'created_at' => now()->subDays($faker->numberBetween(30, 365)),
                'updated_at' => now()->subDays($faker->numberBetween(0, 30)),
            ];
        }

        Vehicle::insert($vehicles);

        $this->command->info('✅ 25 véhicules créés avec succès!');
    }
}
