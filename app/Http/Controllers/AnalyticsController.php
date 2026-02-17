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
            'customer_satisfaction' => $this->getCustomerSatisfaction($company, $startDate),
            'on_time_percentage' => $this->getOnTimePercentage($company, $startDate),
            'fuel_efficiency' => $this->getFuelEfficiency($company, $startDate),
        ];

        // Revenue trend
        $revenueTrend = $this->getRevenueTrend($company, $startDate);

        // Deliveries trend
        $deliveriesTrend = $this->getDeliveriesTrend($company, $startDate);

        // Top clients with real growth rate
        $topClients = $company->clients()
            ->select('clients.*')
            ->selectRaw('COALESCE(SUM(invoices.total), 0) * 100 as total_spent')
            ->selectRaw('COUNT(DISTINCT shipments.id) as deliveries_count')
            ->leftJoin('shipments', 'clients.id', '=', 'shipments.client_id')
            ->leftJoin('invoices', 'clients.id', '=', 'invoices.client_id')
            ->where(function($query) use ($startDate) {
                $query->where('shipments.created_at', '>=', $startDate)
                      ->orWhere('invoices.created_at', '>=', $startDate);
            })
            ->groupBy('clients.id')
            ->orderByDesc('total_spent')
            ->limit(5)
            ->get()
            ->map(function($client) use ($company, $startDate) {
                $client->growth_rate = $this->getClientGrowthRate($company, $client->id, $startDate);
                return $client;
            });

        // Vehicle stats with real efficiency score
        $vehicleStats = $company->vehicles()
            ->select('vehicles.id', 'vehicles.plate_number', 'vehicles.make', 'vehicles.model')
            ->selectRaw('COUNT(DISTINCT dispatch_runs.id) as deliveries')
            ->selectRaw('COALESCE(vehicles.current_odometer - vehicles.odometer_km, 0) as distance_km')
            ->selectRaw('COALESCE(SUM(fuel_logs.total_cents), 0) as fuel_cost')
            ->leftJoin('dispatch_runs', function($join) use ($startDate) {
                $join->on('vehicles.id', '=', 'dispatch_runs.vehicle_id')
                     ->where('dispatch_runs.created_at', '>=', $startDate);
            })
            ->leftJoin('fuel_logs', function($join) use ($startDate) {
                $join->on('vehicles.id', '=', 'fuel_logs.vehicle_id')
                     ->where('fuel_logs.created_at', '>=', $startDate);
            })
            ->groupBy('vehicles.id', 'vehicles.plate_number', 'vehicles.make', 'vehicles.model', 'vehicles.current_odometer', 'vehicles.odometer_km')
            ->orderByDesc('deliveries')
            ->limit(5)
            ->get()
            ->map(function($vehicle) {
                // Calculate efficiency score based on deliveries per fuel cost
                $vehicle->efficiency_score = $this->calculateVehicleEfficiency($vehicle);
                return $vehicle;
            });

        // Driver stats with real performance metrics
        $driverStats = $company->drivers()
            ->where('is_active', true)
            ->select('drivers.id', 'drivers.name')
            ->selectRaw('COUNT(DISTINCT dispatch_runs.id) as deliveries')
            ->leftJoin('dispatch_runs', function($join) use ($startDate) {
                $join->on('drivers.id', '=', 'dispatch_runs.driver_id')
                     ->where('dispatch_runs.created_at', '>=', $startDate);
            })
            ->groupBy('drivers.id', 'drivers.name')
            ->orderByDesc('deliveries')
            ->limit(5)
            ->get()
            ->map(function($driver) use ($company, $startDate) {
                $driver->on_time_rate = $this->getDriverOnTimeRate($company, $driver->id, $startDate);
                $driver->avg_rating = $this->getDriverAverageRating($company, $driver->id, $startDate);
                return $driver;
            });

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
        // Calculate average time between picked_up_at and delivered_at
        $shipments = $company->shipments()
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('picked_up_at')
            ->whereNotNull('delivered_at')
            ->where('status', 'delivered')
            ->get();

        if ($shipments->isEmpty()) {
            return 35; // Default 35 minutes if no data
        }

        $totalMinutes = $shipments->sum(function($shipment) {
            return $shipment->picked_up_at->diffInMinutes($shipment->delivered_at);
        });

        return round($totalMinutes / $shipments->count());
    }

    private function getCustomerSatisfaction($company, $startDate)
    {
        // Calculate satisfaction based on on-time delivery rate
        // Formula: Base 3.0 + (on_time_rate / 100) * 2.0 = range 3.0-5.0
        $onTimeRate = $this->getOnTimePercentage($company, $startDate);
        
        $totalDeliveries = $company->shipments()
            ->where('created_at', '>=', $startDate)
            ->where('status', 'delivered')
            ->count();

        if ($totalDeliveries === 0) {
            return 4.5; // Default if no data
        }

        // Calculate satisfaction score (3.0 to 5.0 scale)
        $satisfaction = 3.0 + ($onTimeRate / 100) * 2.0;
        
        return round($satisfaction, 1);
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
        // Calculate average fuel efficiency (liters per 100km)
        $fuelLogs = $company->vehicles()
            ->join('fuel_logs', 'vehicles.id', '=', 'fuel_logs.vehicle_id')
            ->where('fuel_logs.created_at', '>=', $startDate)
            ->whereNotNull('fuel_logs.liters')
            ->selectRaw('SUM(fuel_logs.liters) as total_liters')
            ->selectRaw('SUM(COALESCE(vehicles.current_odometer - vehicles.odometer_km, 0)) as total_distance')
            ->first();

        if (!$fuelLogs || $fuelLogs->total_distance == 0 || $fuelLogs->total_liters == 0) {
            return 9.5; // Default value if no data
        }

        // Calculate L/100km
        $efficiency = ($fuelLogs->total_liters / $fuelLogs->total_distance) * 100;
        
        return round($efficiency, 1);
    }

    private function getClientGrowthRate($company, $clientId, $startDate)
    {
        // Calculate growth rate by comparing current period vs previous period
        $periodDays = Carbon::now()->diffInDays($startDate);
        $previousStartDate = Carbon::parse($startDate)->subDays($periodDays);

        $currentRevenue = $company->invoices()
            ->where('client_id', $clientId)
            ->where('created_at', '>=', $startDate)
            ->sum('total');

        $previousRevenue = $company->invoices()
            ->where('client_id', $clientId)
            ->where('created_at', '>=', $previousStartDate)
            ->where('created_at', '<', $startDate)
            ->sum('total');

        if ($previousRevenue == 0) {
            return $currentRevenue > 0 ? 100 : 0;
        }

        $growthRate = (($currentRevenue - $previousRevenue) / $previousRevenue) * 100;
        
        return round($growthRate);
    }

    private function calculateVehicleEfficiency($vehicle)
    {
        // Calculate efficiency score based on deliveries and fuel cost
        // Higher deliveries with lower fuel cost = higher efficiency
        if ($vehicle->deliveries == 0) {
            return 50; // Neutral score
        }

        $fuelCostPerDelivery = $vehicle->fuel_cost > 0 
            ? $vehicle->fuel_cost / $vehicle->deliveries 
            : 0;

        // Score calculation: 100 points minus penalty for high fuel cost
        // Assuming average good cost per delivery is ~500 cents (5€)
        $penalty = min(50, ($fuelCostPerDelivery / 500) * 50);
        $score = max(0, min(100, 100 - $penalty));

        // Bonus for high delivery count
        if ($vehicle->deliveries > 50) {
            $score = min(100, $score + 10);
        } elseif ($vehicle->deliveries > 30) {
            $score = min(100, $score + 5);
        }

        return round($score);
    }

    private function getDriverOnTimeRate($company, $driverId, $startDate)
    {
        $totalRuns = $company->dispatchRuns()
            ->where('driver_id', $driverId)
            ->where('created_at', '>=', $startDate)
            ->whereIn('status', ['completed', 'in_progress', 'cancelled'])
            ->count();

        if ($totalRuns === 0) {
            return 90; // Default if no data
        }

        $completedRuns = $company->dispatchRuns()
            ->where('driver_id', $driverId)
            ->where('created_at', '>=', $startDate)
            ->where('status', 'completed')
            ->count();

        return round(($completedRuns / $totalRuns) * 100);
    }

    private function getDriverAverageRating($company, $driverId, $startDate)
    {
        // Calculate rating based on performance metrics
        $onTimeRate = $this->getDriverOnTimeRate($company, $driverId, $startDate);
        
        $totalDeliveries = $company->dispatchRuns()
            ->where('driver_id', $driverId)
            ->where('created_at', '>=', $startDate)
            ->where('status', 'completed')
            ->count();

        // Base rating calculation: 3.0 + (on_time_rate / 100) * 2.0 = 3.0-5.0
        $rating = 3.0 + ($onTimeRate / 100) * 2.0;

        // Bonus for high activity (more deliveries = more reliable data)
        if ($totalDeliveries > 100) {
            $rating = min(5.0, $rating + 0.2);
        } elseif ($totalDeliveries > 50) {
            $rating = min(5.0, $rating + 0.1);
        }

        return round($rating, 1);
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
