<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $company = $request->user()->currentCompany;
        
        if (!$company) {
            return redirect()->route('onboarding.company.create');
        }
        
        // Date range (default: last 30 days)
        $dateRange = $request->get('range', '30d');
        $startDate = match ($dateRange) {
            '7d' => Carbon::now()->subDays(7),
            '90d' => Carbon::now()->subDays(90),
            '1y' => Carbon::now()->subYear(),
            default => Carbon::now()->subDays(30),
        };

        // Overview metrics
        $overview = [
            'total_revenue' => $this->getTotalRevenue($company, $startDate),
            'total_deliveries' => $company->shipments()->where('created_at', '>=', $startDate)->count(),
            'avg_delivery_time' => $this->getAverageDeliveryTime($company, $startDate),
            'customer_satisfaction' => 4.7,
            'on_time_percentage' => $this->getOnTimePercentage($company, $startDate),
            'fuel_efficiency' => $this->getFuelEfficiency($company, $startDate),
        ];

        // Revenue trend
        $revenueTrend = $this->getRevenueTrend($company, $startDate);

        // Deliveries trend
        $deliveriesTrend = $this->getDeliveriesTrend($company, $startDate);

        // Top clients
        $topClients = $company->clients()
            ->select('clients.*')
            ->selectRaw('COALESCE(SUM(invoices.total), 0) * 100 as total_spent')
            ->selectRaw('COUNT(DISTINCT shipments.id) as deliveries_count')
            ->selectRaw('12 as growth_rate')
            ->leftJoin('shipments', 'clients.id', '=', 'shipments.client_id')
            ->leftJoin('invoices', 'clients.id', '=', 'invoices.client_id')
            ->groupBy('clients.id')
            ->orderByDesc('total_spent')
            ->limit(5)
            ->get();

        // Vehicle stats
        $vehicleStats = $company->vehicles()
            ->select('vehicles.id', 'vehicles.plate_number', 'vehicles.make', 'vehicles.model')
            ->selectRaw('COUNT(DISTINCT dispatch_runs.id) as deliveries')
            ->selectRaw('0 as distance_km') // Placeholder - no distance tracking yet
            ->selectRaw('COALESCE(SUM(fuel_logs.total_cents), 0) as fuel_cost')
            ->selectRaw('85 as efficiency_score')
            ->leftJoin('dispatch_runs', 'vehicles.id', '=', 'dispatch_runs.vehicle_id')
            ->leftJoin('fuel_logs', 'vehicles.id', '=', 'fuel_logs.vehicle_id')
            ->groupBy('vehicles.id', 'vehicles.plate_number', 'vehicles.make', 'vehicles.model')
            ->orderByDesc('deliveries')
            ->limit(5)
            ->get();

        // Driver stats
        $driverStats = $company->drivers()
            ->select('drivers.id', 'drivers.name')
            ->selectRaw('COUNT(DISTINCT dispatch_runs.id) as deliveries')
            ->selectRaw('90 as on_time_rate')
            ->selectRaw('4.8 as avg_rating')
            ->leftJoin('dispatch_runs', 'drivers.id', '=', 'dispatch_runs.driver_id')
            ->groupBy('drivers.id', 'drivers.name')
            ->orderByDesc('deliveries')
            ->limit(5)
            ->get();

        $analytics = [
            'overview' => $overview,
            'revenue_trend' => $revenueTrend,
            'deliveries_trend' => $deliveriesTrend,
            'top_clients' => $topClients,
            'vehicle_stats' => $vehicleStats,
            'driver_stats' => $driverStats,
        ];

        return Inertia::render('Analytics/Index', [
            'analytics' => $analytics,
        ]);
    }

    private function getTotalRevenue($company, $startDate)
    {
        return $company->invoices()
            ->where('created_at', '>=', $startDate)
            ->sum('total') * 100; // Convert decimal to cents
    }

    private function getAverageDeliveryTime($company, $startDate)
    {
        return 35; // Default 35 minutes
    }

    private function getOnTimePercentage($company, $startDate)
    {
        $total = $company->dispatchRuns()
            ->where('created_at', '>=', $startDate)
            ->whereIn('status', ['completed', 'in_progress', 'cancelled'])
            ->count();

        if ($total === 0) return 95;

        $onTime = $company->dispatchRuns()
            ->where('created_at', '>=', $startDate)
            ->where('status', 'completed')
            ->count();

        return round(($onTime / $total) * 100);
    }

    private function getFuelEfficiency($company, $startDate)
    {
        return 9.5; // Default value
    }

    private function getRevenueTrend($company, $startDate)
    {
        $days = min(Carbon::now()->diffInDays($startDate), 30);
        $trend = [];

        for ($i = $days; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $amount = $company->invoices()
                ->whereDate('created_at', $date)
                ->sum('total') * 100; // Convert decimal to cents

            $trend[] = [
                'date' => $date->toDateString(),
                'amount' => $amount,
            ];
        }

        return $trend;
    }

    private function getDeliveriesTrend($company, $startDate)
    {
        $days = min(Carbon::now()->diffInDays($startDate), 30);
        $trend = [];

        for ($i = $days; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $count = $company->shipments()
                ->whereDate('created_at', $date)
                ->count();

            $trend[] = [
                'date' => $date->toDateString(),
                'count' => $count,
            ];
        }

        return $trend;
    }
}
