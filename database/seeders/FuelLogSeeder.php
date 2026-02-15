<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Vehicle;
use App\Models\FuelLog;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class FuelLogSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $vehicles = Vehicle::where('company_id', $company->id)
            ->where('status', 'active')
            ->get();
        
        $faker = Faker::create('fr_FR');
        $fuelLogs = [];

        $fuelTypes = ['diesel' => 12.5, 'gasoline' => 14.0, 'electric' => 2.5];
        $stations = [
            'Total Maroc', 'Afriquia', 'Shell', 'Petrom', 'Vivo Energy',
            'Winxo', 'Libya Oil', 'Oilibya'
        ];

        // Créer 5-15 entrées de carburant par véhicule
        foreach ($vehicles as $vehicle) {
            $numEntries = rand(5, 15);
            $currentOdometer = $vehicle->odometer_km - ($numEntries * rand(200, 500));

            for ($i = 0; $i < $numEntries; $i++) {
                $filledAt = now()->subDays(rand(1, 180));
                $volumeLiters = $faker->randomFloat(2, 30, 80);
                $pricePerLiterCents = (int)(($fuelTypes[$vehicle->fuel_type] ?? 12.5) * 100);
                $totalCents = (int)($volumeLiters * $pricePerLiterCents);
                $currentOdometer += rand(200, 500);

                $fuelLogs[] = [
                    'company_id' => $company->id,
                    'vehicle_id' => $vehicle->id,
                    'driver_id' => null,
                    'delivery_route_id' => null,
                    'filled_at' => $filledAt,
                    'station_name' => $faker->randomElement($stations),
                    'volume_liters' => $volumeLiters,
                    'price_per_liter_cents' => $pricePerLiterCents,
                    'total_cents' => $totalCents,
                    'odometer_km' => $currentOdometer,
                    'notes' => $faker->optional(0.2)->sentence(),
                    'created_at' => $filledAt,
                    'updated_at' => $filledAt,
                ];
            }
        }

        // Trier par date
        usort($fuelLogs, function($a, $b) {
            return $a['filled_at'] <=> $b['filled_at'];
        });

        // Insertion par lots
        foreach (array_chunk($fuelLogs, 100) as $chunk) {
            FuelLog::insert($chunk);
        }

        $this->command->info('✅ ' . count($fuelLogs) . ' entrées de carburant créées avec succès!');
    }
}
