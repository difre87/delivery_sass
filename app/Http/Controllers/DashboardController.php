<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\RequiresCompany;
use App\Models\FuelLog;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class DashboardController extends Controller
{
    use RequiresCompany;

    public function __invoke(Request $request): Response|SymfonyResponse
    {
        // Vérifier que l'utilisateur a une société
        if ($redirect = $this->ensureHasCompany($request)) {
            return $redirect;
        }

        $company = $request->user()->currentCompany;

        $currentMonth = now()->startOfMonth();

        $stats = [
            'clients' => $company->clients()->count(),
            'shipments_open' => $company->shipments()
                ->whereIn('status', ['draft', 'scheduled', 'assigned', 'in_transit'])
                ->count(),
            'routes_today' => $company->deliveryRoutes()
                ->whereDate('route_date', now()->toDateString())
                ->count(),
            'vehicles_active' => $company->vehicles()
                ->where('status', 'active')
                ->count(),
        ];

        $kpis = [
            'delivered_month' => $company->shipments()
                ->where('status', 'delivered')
                ->where('delivered_at', '>=', $currentMonth)
                ->count(),
            'fuel_cost_month_cents' => (int) $company->fuelLogs()
                ->where('filled_at', '>=', $currentMonth)
                ->sum('total_cents'),
            'revenue_month_cents' => (int) $company->shipments()
                ->where('delivered_at', '>=', $currentMonth)
                ->sum('price_cents'),
            'cost_month_cents' => (int) $company->shipments()
                ->where('delivered_at', '>=', $currentMonth)
                ->sum('cost_cents'),
        ];

        $recentShipments = Shipment::query()
            ->forCompany($company->id)
            ->latest('id')
            ->limit(5)
            ->get(['id', 'reference', 'recipient_name', 'status', 'scheduled_for', 'delivered_at']);

        $recentFuelLogs = FuelLog::query()
            ->forCompany($company->id)
            ->latest('filled_at')
            ->limit(5)
            ->get(['id', 'filled_at', 'volume_liters', 'total_cents', 'station_name']);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'kpis' => $kpis,
            'recentShipments' => $recentShipments,
            'recentFuelLogs' => $recentFuelLogs,
        ]);
    }
}
