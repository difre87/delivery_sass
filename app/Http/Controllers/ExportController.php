<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Driver;
use App\Models\Shipment;
use App\Models\Vehicle;
use App\Models\FuelLog;
use App\Models\Invoice;
use App\Models\Waybill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ExportController extends Controller
{
    /**
     * Export clients to CSV
     */
    public function clients()
    {
        $clients = Client::where('company_id', auth()->user()->currentCompany->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'clients_' . date('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        $callback = function() use ($clients) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for proper UTF-8 encoding in Excel
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            // Headers
            fputcsv($file, [
                'ID',
                'Nom',
                'Email',
                'Téléphone',
                'Adresse',
                'Code Postal',
                'Ville',
                'Date de création',
            ], ';');

            // Data
            foreach ($clients as $client) {
                fputcsv($file, [
                    $client->id,
                    $client->name,
                    $client->email ?? '',
                    $client->phone ?? '',
                    $client->address ?? '',
                    $client->postal_code ?? '',
                    $client->city ?? '',
                    $client->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Export drivers to CSV
     */
    public function drivers()
    {
        $drivers = Driver::where('company_id', auth()->user()->currentCompany->id)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'chauffeurs_' . date('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($drivers) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            fputcsv($file, [
                'ID',
                'Nom',
                'Email',
                'Téléphone',
                'Numéro de permis',
                'Type de permis',
                'Statut',
                'Date de création',
            ], ';');

            foreach ($drivers as $driver) {
                fputcsv($file, [
                    $driver->id,
                    $driver->name,
                    $driver->email ?? '',
                    $driver->phone ?? '',
                    $driver->license_number ?? '',
                    $driver->license_type ?? '',
                    $driver->status ?? 'active',
                    $driver->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Export shipments to CSV
     */
    public function shipments()
    {
        $shipments = Shipment::with(['client', 'driver'])
            ->where('company_id', auth()->user()->currentCompany->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'livraisons_' . date('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($shipments) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            fputcsv($file, [
                'ID',
                'Numéro de suivi',
                'Client',
                'Chauffeur',
                'Adresse de livraison',
                'Ville',
                'Statut',
                'Coût (centimes)',
                'Prix (centimes)',
                'Date de création',
            ], ';');

            foreach ($shipments as $shipment) {
                fputcsv($file, [
                    $shipment->id,
                    $shipment->tracking_number ?? '',
                    $shipment->client->name ?? '',
                    $shipment->driver->name ?? '',
                    $shipment->delivery_address ?? '',
                    $shipment->delivery_city ?? '',
                    $shipment->status ?? '',
                    $shipment->cost_cents ?? 0,
                    $shipment->price_cents ?? 0,
                    $shipment->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Export vehicles to CSV
     */
    public function vehicles()
    {
        $vehicles = Vehicle::where('company_id', auth()->user()->currentCompany->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'vehicules_' . date('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($vehicles) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            fputcsv($file, [
                'ID',
                'Immatriculation',
                'Marque',
                'Modèle',
                'Type',
                'Capacité (kg)',
                'Statut',
                'Date de création',
            ], ';');

            foreach ($vehicles as $vehicle) {
                fputcsv($file, [
                    $vehicle->id,
                    $vehicle->registration ?? '',
                    $vehicle->make ?? '',
                    $vehicle->model ?? '',
                    $vehicle->type ?? '',
                    $vehicle->capacity_kg ?? '',
                    $vehicle->status ?? 'available',
                    $vehicle->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Export fuel logs to CSV
     */
    public function fuelLogs()
    {
        $fuelLogs = FuelLog::with(['vehicle', 'driver'])
            ->where('company_id', auth()->user()->currentCompany->id)
            ->orderBy('date', 'desc')
            ->get();

        $filename = 'carburant_' . date('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($fuelLogs) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            fputcsv($file, [
                'ID',
                'Date',
                'Véhicule',
                'Chauffeur',
                'Litres',
                'Montant (centimes)',
                'Prix au litre',
                'Kilométrage',
                'Station',
                'Notes',
            ], ';');

            foreach ($fuelLogs as $log) {
                fputcsv($file, [
                    $log->id,
                    $log->date->format('d/m/Y'),
                    $log->vehicle->registration ?? '',
                    $log->driver->name ?? '',
                    $log->liters ?? 0,
                    $log->amount_cents ?? 0,
                    $log->liters > 0 ? round(($log->amount_cents / 100) / $log->liters, 2) : 0,
                    $log->odometer ?? '',
                    $log->station ?? '',
                    $log->notes ?? '',
                ], ';');
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Export invoices to CSV
     */
    public function invoices()
    {
        $invoices = Invoice::with('client')
            ->where('company_id', auth()->user()->currentCompany->id)
            ->orderBy('invoice_date', 'desc')
            ->get();

        $filename = 'factures_' . date('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($invoices) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            fputcsv($file, [
                'ID',
                'Numéro',
                'Client',
                'Date',
                'Date d\'échéance',
                'Montant (centimes)',
                'Statut',
                'Date de création',
            ], ';');

            foreach ($invoices as $invoice) {
                fputcsv($file, [
                    $invoice->id,
                    $invoice->invoice_number ?? '',
                    $invoice->client->name ?? '',
                    $invoice->invoice_date ? $invoice->invoice_date->format('d/m/Y') : '',
                    $invoice->due_date ? $invoice->due_date->format('d/m/Y') : '',
                    $invoice->total_amount_cents ?? 0,
                    $invoice->status ?? '',
                    $invoice->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Export waybills to CSV
     */
    public function waybills()
    {
        $waybills = Waybill::with(['client', 'driver'])
            ->where('company_id', auth()->user()->currentCompany->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'bordereaux_' . date('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($waybills) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            fputcsv($file, [
                'ID',
                'Numéro',
                'Client',
                'Chauffeur',
                'Statut',
                'Date de création',
            ], ';');

            foreach ($waybills as $waybill) {
                fputcsv($file, [
                    $waybill->id,
                    $waybill->waybill_number ?? '',
                    $waybill->client->name ?? '',
                    $waybill->driver->name ?? '',
                    $waybill->status ?? '',
                    $waybill->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}
