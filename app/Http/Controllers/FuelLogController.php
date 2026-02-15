<?php

namespace App\Http\Controllers;

use App\Http\Requests\FuelLogStoreRequest;
use App\Http\Requests\FuelLogUpdateRequest;
use App\Models\DispatchRun;
use App\Models\FuelLog;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FuelLogController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        $fuelLogs = FuelLog::query()
            ->forCompany($company->id)
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

        FuelLog::create([
            ...$validated,
            'company_id' => $company->id,
            'price_per_liter_cents' => $pricePerLiterCents,
            'liters' => $validated['liters'] ?? $validated['volume_liters'],
            'amount' => $validated['amount'] ?? ($validated['total_cents'] / 100),
        ]);

        return redirect()->route('fuel.index')->with('status', 'Plein carburant enregistré.');
    }

    public function update(FuelLogUpdateRequest $request, FuelLog $fuelLog): RedirectResponse
    {
        $this->ensureFuelLogBelongsToCurrentCompany($request, $fuelLog);

        $validated = $request->validated();
        $volumeLiters = (float) $validated['volume_liters'];
        $totalCents = (int) $validated['total_cents'];
        $pricePerLiterCents = $volumeLiters > 0 ? (int) round($totalCents / $volumeLiters) : 0;

        $fuelLog->update([
            ...$validated,
            'price_per_liter_cents' => $pricePerLiterCents,
            'liters' => $validated['liters'] ?? $validated['volume_liters'],
            'amount' => $validated['amount'] ?? ($validated['total_cents'] / 100),
        ]);

        return redirect()->route('fuel.index')->with('status', 'Plein carburant mis à jour.');
    }

    public function destroy(Request $request, FuelLog $fuelLog): RedirectResponse
    {
        $this->ensureFuelLogBelongsToCurrentCompany($request, $fuelLog);

        $fuelLog->delete();

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
