<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleStoreRequest;
use App\Http\Requests\VehicleUpdateRequest;
use App\Models\Branch;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        $vehicles = Vehicle::query()
            ->forCompany($company->id)
            ->with('branch:id,name')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $branches = Branch::query()
            ->forCompany($company->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Fleet/Index', [
            'vehicles' => $vehicles,
            'branches' => $branches,
        ]);
    }

    public function store(VehicleStoreRequest $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        $validated = $request->validated();

        $odometer = (int) ($validated['current_odometer'] ?? $validated['odometer_km'] ?? 0);

        Vehicle::create([
            ...$validated,
            'odometer_km' => $odometer,
            'current_odometer' => $odometer,
            'company_id' => $company->id,
        ]);

        return redirect()->route('fleet.index', ['company' => $company->slug])->with('status', 'Véhicule créé avec succès.');
    }

    public function update(VehicleUpdateRequest $request, string $company, Vehicle $vehicle): RedirectResponse
    {
        $this->ensureVehicleBelongsToCurrentCompany($request, $vehicle);

        $validated = $request->validated();
        $odometer = (int) ($validated['current_odometer'] ?? $validated['odometer_km'] ?? 0);

        $vehicle->update([
            ...$validated,
            'odometer_km' => $odometer,
            'current_odometer' => $odometer,
        ]);

        return redirect()->route('fleet.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Véhicule mis à jour.');
    }

    public function destroy(Request $request, string $company, Vehicle $vehicle): RedirectResponse
    {
        $this->ensureVehicleBelongsToCurrentCompany($request, $vehicle);

        $vehicle->delete();

        return redirect()->route('fleet.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Véhicule supprimé.');
    }

    private function ensureVehicleBelongsToCurrentCompany(Request $request, Vehicle $vehicle): void
    {
        abort_if(
            $vehicle->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
