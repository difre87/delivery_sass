<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Client;
use App\Models\Address;
use App\Models\Shipment;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ShipmentSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $clients = Client::where('company_id', $company->id)->where('is_active', true)->get();
        $addresses = Address::where('company_id', $company->id)->get();
        $faker = Faker::create('fr_FR');

        // Vérifier qu'on a assez d'adresses
        if ($addresses->count() < 2) {
            $this->command->error('❌ Pas assez d\'adresses pour créer des envois!');
            return;
        }

        $statuses = [
            'draft' => 15,
            'pending' => 20,
            'ready' => 15,
            'in_transit' => 20,
            'delivered' => 25,
            'cancelled' => 5,
        ];

        $shipments = [];

        // Créer 200 envois
        for ($i = 1; $i <= 200; $i++) {
            $client = $clients->random();
            
            // Prendre 2 adresses différentes au hasard
            $senderAddress = $addresses->random();
            $recipientAddress = $addresses->where('id', '!=', $senderAddress->id)->random();

            // Choisir un statut selon la pondération
            $status = $this->getWeightedStatus($statuses);
            
            $createdDate = now()->subDays($faker->numberBetween(1, 90));
            $scheduledFor = $faker->optional(0.7)->dateTimeBetween($createdDate, now()->addDays(10));
            
            $pickedUpAt = null;
            $deliveredAt = null;
            
            if (in_array($status, ['in_transit', 'delivered'])) {
                // Pickup date must be in the past for these statuses
                $pickupEnd = now()->subHours(2);
                $pickedUpAt = $faker->dateTimeBetween($createdDate, $pickupEnd);
            }
            
            if ($status === 'delivered' && $pickedUpAt) {
                $deliveredAt = $faker->dateTimeBetween($pickedUpAt, now());
            }

            $shipment = [
                'company_id' => $company->id,
                'client_id' => $client->id,
                'sender_address_id' => $senderAddress->id,
                'recipient_name' => $faker->name(),
                'recipient_phone' => $faker->phoneNumber(),
                'recipient_address_id' => $recipientAddress->id,
                'reference' => $faker->optional(0.6)->bothify('REF-####-????'),
                'status' => $status,
                'scheduled_for' => $scheduledFor,
                'picked_up_at' => $pickedUpAt,
                'delivered_at' => $deliveredAt,
                'distance_km' => $faker->randomFloat(2, 5, 200),
                'cost_cents' => $faker->numberBetween(500, 5000),
                'price_cents' => $faker->numberBetween(800, 8000),
                'notes' => $faker->optional(0.3)->sentence(),
                'created_at' => $createdDate,
                'updated_at' => now(),
            ];

            $shipments[] = $shipment;
        }

        // Insertion par lots
        foreach (array_chunk($shipments, 100) as $chunk) {
            Shipment::insert($chunk);
        }

        $this->command->info('✅ ' . count($shipments) . ' envois créés avec succès!');
    }

    private function getWeightedStatus(array $weights): string
    {
        $totalWeight = array_sum($weights);
        $random = rand(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($weights as $status => $weight) {
            $currentWeight += $weight;
            if ($random <= $currentWeight) {
                return $status;
            }
        }
        
        return array_key_first($weights);
    }
}
