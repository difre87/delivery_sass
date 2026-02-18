<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AutoAssignsBranch;
use App\Http\Requests\FuelLogStoreRequest;
use App\Http\Requests\FuelLogUpdateRequest;
use App\Models\DispatchRun;
use App\Models\FuelLog;
use App\Models\Vehicle;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FuelLogController extends Controller
{
    use AutoAssignsBranch, LogsActivity;

    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $currentBranchId = $request->user()->current_branch_id;

        $fuelLogs = FuelLog::query()
            ->forCompany($company->id)
            ->where('branch_id', $currentBranchId)
            ->with(['vehicle:id,plate_number', 'dispatchRun:id,date'])
            ->orderByDesc('filled_at')
            ->paginate(10)
            ->withQueryString();

        $vehicles = Vehicle::query()
            ->forCompany($company->id)
            ->orderBy('plate_number')
            ->get(['id', 'plate_number']);

        $runs = DispatchRun::query()
            ->forCompany($company->id)
            ->orderByDesc('date')
            ->get(['id', 'date']);

        return Inertia::render('Fuel/Index', [
            'fuelLogs' => $fuelLogs,
            'vehicles' => $vehicles,
            'runs' => $runs,
        ]);
    }

    public function store(FuelLogStoreRequest $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        $validated = $request->validated();
        $volumeLiters = (float) $validated['volume_liters'];
        $totalCents = (int) $validated['total_cents'];
        $pricePerLiterCents = $volumeLiters > 0 ? (int) round($totalCents / $volumeLiters) : 0;

        $fuelLog = FuelLog::create(
            $this->withCompanyAndBranch([
                ...$validated,
                'price_per_liter_cents' => $pricePerLiterCents,
                'liters' => $validated['liters'] ?? $validated['volume_liters'],
                'amount' => $validated['amount'] ?? ($validated['total_cents'] / 100),
            ], $request)
        );

        static::logCreated('fuel_logs', $fuelLog, "Enregistrement d'un plein de {$volumeLiters}L pour le véhicule {$fuelLog->vehicle->plate_number}");

        return redirect()->route('fuel.index')->with('status', 'Plein carburant enregistré.');
    }

    public function update(FuelLogUpdateRequest $request, string $company, FuelLog $fuelLog): RedirectResponse
    {
        $this->ensureFuelLogBelongsToCurrentCompany($request, $fuelLog);

        $validated = $request->validated();
        $volumeLiters = (float) $validated['volume_liters'];
        $totalCents = (int) $validated['total_cents'];
        $pricePerLiterCents = $volumeLiters > 0 ? (int) round($totalCents / $volumeLiters) : 0;

        $oldValues = $fuelLog->only(['vehicle_id', 'filled_at', 'volume_liters', 'total_cents', 'odometer_km']);

        $fuelLog->update([
            ...$validated,
            'price_per_liter_cents' => $pricePerLiterCents,
            'liters' => $validated['liters'] ?? $validated['volume_liters'],
            'amount' => $validated['amount'] ?? ($validated['total_cents'] / 100),
        ]);

        $newValues = $fuelLog->only(['vehicle_id', 'filled_at', 'volume_liters', 'total_cents', 'odometer_km']);

        static::logUpdated('fuel_logs', $fuelLog, $oldValues, $newValues, "Modification du plein carburant pour {$fuelLog->vehicle->plate_number}");

        return redirect()->route('fuel.index')->with('status', 'Plein carburant mis à jour.');
    }

    public function destroy(Request $request, string $company, FuelLog $fuelLog): RedirectResponse
    {
        $this->ensureFuelLogBelongsToCurrentCompany($request, $fuelLog);

        $vehiclePlate = $fuelLog->vehicle->plate_number;
        $fuelLog->delete();

        static::logDeleted('fuel_logs', $fuelLog, "Suppression du plein carburant pour {$vehiclePlate}");

        return redirect()->route('fuel.index')->with('status', 'Plein carburant supprimé.');
    }

    private function ensureFuelLogBelongsToCurrentCompany(Request $request, FuelLog $fuelLog): void
    {
        abort_if(
            $fuelLog->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
