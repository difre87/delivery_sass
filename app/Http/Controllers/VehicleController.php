<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AutoAssignsBranch;
use App\Http\Requests\VehicleStoreRequest;
use App\Http\Requests\VehicleUpdateRequest;
use App\Models\Branch;
use App\Models\Vehicle;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    use LogsActivity, AutoAssignsBranch;

    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $currentBranchId = $request->user()->current_branch_id;

        $vehicles = Vehicle::query()
            ->forCompany($company->id)
            ->when($currentBranchId, fn($q) => $q->where('branch_id', $currentBranchId))
            ->with('branch:id,name')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $branches = Branch::query()
            ->forCompany($company->id)
            ->where('is_active', true)
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

        $vehicle = Vehicle::create([
            ...$this->withCompanyAndBranch($validated, $request),
            'odometer_km' => $odometer,
            'current_odometer' => $odometer,
        ]);

        static::logCreated('vehicles', $vehicle, "Création du véhicule {$vehicle->plate_number}");

        return redirect()->route('fleet.index', ['company' => $company->slug])->with('status', 'Véhicule créé avec succès.');
    }

    public function update(VehicleUpdateRequest $request, string $company, Vehicle $vehicle): RedirectResponse
    {
        $this->ensureVehicleBelongsToCurrentCompany($request, $vehicle);

        $validated = $request->validated();
        $odometer = (int) ($validated['current_odometer'] ?? $validated['odometer_km'] ?? 0);

        $oldValues = $vehicle->only(['plate_number', 'make', 'model', 'year', 'vin', 'odometer_km', 'current_odometer', 'branch_id', 'status']);

        $vehicle->update([
            ...$validated,
            'odometer_km' => $odometer,
            'current_odometer' => $odometer,
        ]);

        $newValues = $vehicle->only(['plate_number', 'make', 'model', 'year', 'vin', 'odometer_km', 'current_odometer', 'branch_id', 'status']);

        static::logUpdated('vehicles', $vehicle, $oldValues, $newValues, "Modification du véhicule {$vehicle->plate_number}");

        return redirect()->route('fleet.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Véhicule mis à jour.');
    }

    public function destroy(Request $request, string $company, Vehicle $vehicle): RedirectResponse
    {
        $this->ensureVehicleBelongsToCurrentCompany($request, $vehicle);

        $plateNumber = $vehicle->plate_number;
        $vehicle->delete();

        static::logDeleted('vehicles', $vehicle, "Suppression du véhicule {$plateNumber}");

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
