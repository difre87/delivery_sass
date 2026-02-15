<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Shipment;
use App\Models\Waybill;
use App\Models\WaybillItem;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class WaybillSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $drivers = Driver::where('company_id', $company->id)->where('is_active', true)->get();
        $vehicles = Vehicle::where('company_id', $company->id)->where('status', 'active')->get();
        $faker = Faker::create('fr_FR');

        if ($drivers->isEmpty() || $vehicles->isEmpty()) {
            $this->command->warn('⚠️  Pas assez de chauffeurs ou véhicules actifs pour créer des bordereaux');
            return;
        }

        $statuses = ['draft', 'issued', 'in_progress', 'completed', 'cancelled'];
        $waybills = [];
        $waybillItems = [];

        // Créer 30 bordereaux
        for ($i = 1; $i <= 30; $i++) {
            $driver = $drivers->random();
            $vehicle = $vehicles->random();
            $date = $faker->dateTimeBetween('-3 months', '+1 week');
            $status = $faker->randomElement($statuses);
            
            $waybillNumber = 'BR-' . date('Y', $date->getTimestamp()) . '-' . str_pad($i, 4, '0', STR_PAD_LEFT);

            $departureTime = $faker->time('H:i:s');
            $returnTime = null;
            if (in_array($status, ['completed'])) {
                $returnTime = $faker->time('H:i:s', strtotime($departureTime) + rand(14400, 28800)); // 4-8h après
            }

            $waybillId = Waybill::insertGetId([
                'company_id' => $company->id,
                'dispatch_run_id' => null,
                'driver_id' => $driver->id,
                'vehicle_id' => $vehicle->id,
                'shipment_id' => null, // Will link multiple via waybill_items
                'number' => $waybillNumber,
                'qr_token' => \Str::uuid(),
                'status' => $status,
                'date' => $date,
                'departure_time' => $departureTime,
                'return_time' => $returnTime,
                'issued_at' => in_array($status, ['issued', 'in_progress', 'completed']) ? $date : null,
                'notes' => $faker->optional(0.3)->sentence(),
                'total_shipments' => 0, // Sera mis à jour après
                'completed_shipments' => 0, // Sera mis à jour après
                'created_at' => $date,
                'updated_at' => now(),
            ]);

            // Ajouter 3-10 envois au bordereau
            $numShipments = rand(3, 10);
            $shipments = Shipment::where('company_id', $company->id)
                ->whereIn('status', ['pending', 'ready', 'in_transit', 'delivered'])
                ->inRandomOrder()
                ->limit($numShipments)
                ->get();

            $completedCount = 0;
            $sequenceNumber = 1;

            foreach ($shipments as $shipment) {
                // Déterminer le statut de l'item selon le statut du bordereau
                $itemStatus = 'pending';
                if ($status === 'in_progress') {
                    $itemStatus = $faker->randomElement(['pending', 'picked_up', 'delivered']);
                } elseif ($status === 'completed') {
                    $itemStatus = $faker->randomElement(['delivered', 'delivered', 'delivered', 'failed']);
                }

                if ($itemStatus === 'delivered') {
                    $completedCount++;
                }

                $pickedUpAt = null;
                $deliveredAt = null;
                
                if (in_array($itemStatus, ['picked_up', 'delivered']) && $date < now()) {
                    $pickedUpAt = $faker->dateTimeBetween($date, 'now');
                }
                if ($itemStatus === 'delivered' && $pickedUpAt) {
                    $deliveredAt = $faker->dateTimeBetween($pickedUpAt, 'now');
                }

                $waybillItems[] = [
                    'waybill_id' => $waybillId,
                    'shipment_id' => $shipment->id,
                    'sequence_number' => $sequenceNumber++,
                    'status' => $itemStatus,
                    'picked_up_at' => $pickedUpAt,
                    'delivered_at' => $deliveredAt,
                    'delivery_notes' => $faker->optional(0.2)->sentence(),
                    'signature_url' => $itemStatus === 'delivered' ? 'signatures/' . $faker->uuid() . '.png' : null,
                    'created_at' => $date,
                    'updated_at' => now(),
                ];
            }

            // Mettre à jour les compteurs
            Waybill::where('id', $waybillId)->update([
                'total_shipments' => count($shipments),
                'completed_shipments' => $completedCount,
            ]);

            $waybills[] = $waybillNumber;
        }

        // Insertion des items
        if (!empty($waybillItems)) {
            foreach (array_chunk($waybillItems, 100) as $chunk) {
                WaybillItem::insert($chunk);
            }
        }

        $this->command->info('✅ ' . count($waybills) . ' bordereaux créés avec ' . count($waybillItems) . ' envois!');
    }
}
