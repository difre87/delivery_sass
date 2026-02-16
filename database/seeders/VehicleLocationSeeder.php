<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Vehicle;
use App\Models\VehicleLocation;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class VehicleLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();

        foreach ($companies as $company) {
            $vehicles = $company->vehicles;

            if ($vehicles->isEmpty()) {
                continue;
            }

            // Coordinates around Paris
            $parisLat = 48.8566;
            $parisLon = 2.3522;

            foreach ($vehicles as $vehicle) {
                // Generate 10 recent locations for each vehicle (simulating movement)
                for ($i = 10; $i >= 0; $i--) {
                    $recordedAt = Carbon::now()->subMinutes($i * 3);

                    // Simulate movement around Paris
                    $latOffset = (rand(-100, 100) / 1000); // ±0.1 degrees
                    $lonOffset = (rand(-100, 100) / 1000);
                    $latitude = $parisLat + $latOffset;
                    $longitude = $parisLon + $lonOffset;

                    // Random speed (0-80 km/h)
                    $speed = rand(0, 80);
                    
                    // Determine status based on speed
                    $status = $speed > 5 ? 'moving' : ($speed > 0 ? 'idle' : 'stopped');
                    
                    // Random heading (0-360)
                    $heading = rand(0, 360);

                    VehicleLocation::create([
                        'company_id' => $company->id,
                        'vehicle_id' => $vehicle->id,
                        'driver_id' => null,
                        'dispatch_run_id' => null,
                        'latitude' => $latitude,
                        'longitude' => $longitude,
                        'altitude' => rand(30, 150),
                        'speed' => $speed,
                        'heading' => $heading,
                        'accuracy' => rand(5, 20),
                        'address' => $this->generateMockAddress($latitude, $longitude),
                        'status' => $status,
                        'battery_level' => rand(20, 100),
                        'engine_on' => $speed > 0,
                        'recorded_at' => $recordedAt,
                    ]);
                }
            }
        }

        $this->command->info('Vehicle locations seeded successfully!');
    }

    /**
     * Generate a mock address based on coordinates
     */
    private function generateMockAddress($lat, $lon): string
    {
        $streets = [
            'Avenue des Champs-Élysées',
            'Rue de Rivoli',
            'Boulevard Haussmann',
            'Avenue Montaigne',
            'Rue du Faubourg Saint-Honoré',
            'Boulevard Saint-Germain',
            'Rue de la Paix',
            'Avenue Victor Hugo',
        ];

        $street = $streets[array_rand($streets)];
        $number = rand(1, 200);

        return "{$number} {$street}, 75001 Paris, France";
    }
}
