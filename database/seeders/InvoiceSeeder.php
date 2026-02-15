<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Shipment;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $clients = Client::where('company_id', $company->id)->where('is_active', true)->get();
        $faker = Faker::create('fr_FR');

        $statuses = ['draft', 'sent', 'paid', 'overdue'];
        $invoices = [];
        $invoiceItems = [];

        // Créer 40 factures
        for ($i = 1; $i <= 40; $i++) {
            $client = $clients->random();
            $invoiceDate = $faker->dateTimeBetween('-6 months', 'now');
            $dueDate = (clone $invoiceDate)->modify('+30 days');
            $status = $faker->randomElement($statuses);
            
            // Si paid, ajouter une date de paiement
            $paidAt = null;
            if ($status === 'paid') {
                $paidAt = $faker->dateTimeBetween($invoiceDate, $dueDate);
            }

            $invoiceNumber = 'INV-' . date('Y', $invoiceDate->getTimestamp()) . '-' . str_pad($i, 5, '0', STR_PAD_LEFT);

            $invoiceId = Invoice::insertGetId([
                'company_id' => $company->id,
                'client_id' => $client->id,
                'invoice_number' => $invoiceNumber,
                'invoice_date' => $invoiceDate,
                'due_date' => $dueDate,
                'status' => $status,
                'subtotal' => 0, // Sera calculé après
                'tax_rate' => 20.00,
                'tax_amount' => 0, // Sera calculé après
                'total' => 0, // Sera calculé après
                'paid_at' => $paidAt,
                'notes' => $faker->optional(0.3)->sentence(),
                'created_at' => $invoiceDate,
                'updated_at' => now(),
            ]);

            // Ajouter 1-5 lignes de facture (envois)
            $numItems = rand(1, 5);
            $clientShipments = Shipment::where('company_id', $company->id)
                ->where('client_id', $client->id)
                ->where('status', 'delivered')
                ->inRandomOrder()
                ->limit($numItems)
                ->get();

            $subtotal = 0;
            foreach ($clientShipments as $shipment) {
                $quantity = 1;
                $unitPrice = $faker->randomFloat(2, 50, 300);
                $total = $quantity * $unitPrice;
                $subtotal += $total;

                $invoiceItems[] = [
                    'invoice_id' => $invoiceId,
                    'shipment_id' => $shipment->id,
                    'description' => "Livraison - {$shipment->tracking_number}",
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total' => $total,
                    'created_at' => $invoiceDate,
                    'updated_at' => now(),
                ];
            }

            // Mettre à jour les totaux
            $taxAmount = $subtotal * 0.20;
            $total = $subtotal + $taxAmount;

            Invoice::where('id', $invoiceId)->update([
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total' => $total,
            ]);

            $invoices[] = $invoiceNumber;
        }

        // Insertion des items
        if (!empty($invoiceItems)) {
            foreach (array_chunk($invoiceItems, 100) as $chunk) {
                InvoiceItem::insert($chunk);
            }
        }

        $this->command->info('✅ ' . count($invoices) . ' factures créées avec ' . count($invoiceItems) . ' lignes!');
    }
}
