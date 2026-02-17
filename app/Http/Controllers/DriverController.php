<?php

namespace App\Http\Controllers;

use App\Http\Requests\DriverStoreRequest;
use App\Http\Requests\DriverUpdateRequest;
use App\Http\Requests\DriverVehicleAssignRequest;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $currentBranchId = $request->user()->current_branch_id;

        // Récupérer les drivers directement de la table drivers
        $drivers = \App\Models\Driver::query()
            ->where('company_id', $company->id)
            ->where('is_active', true) // Ne montrer que les drivers actifs
            ->when($currentBranchId, fn($query) => $query->where('branch_id', $currentBranchId))
            ->with([
                'branch:id,name',
                'vehicleAssignments' => fn ($query) => $query
                    ->whereNull('ends_at')
                    ->latest('starts_at')
                    ->with('vehicle:id,plate_number,make,model'),
            ])
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $vehicles = Vehicle::query()
            ->forCompany($company->id)
            ->orderBy('plate_number')
            ->get(['id', 'plate_number', 'make', 'model']);

        return Inertia::render('Drivers/Index', [
            'drivers' => $drivers,
            'vehicles' => $vehicles,
        ]);
    }

    public function store(DriverStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $companyId = $request->user()->current_company_id;
        $branchId = $request->user()->current_branch_id;

        // Créer l'entrée dans la table drivers
        $driver = \App\Models\Driver::create([
            'company_id' => $companyId,
            'branch_id' => $branchId,
            'user_id' => null, // Pas d'utilisateur associé
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'identity_document_type' => $validated['identity_document_type'] ?? null,
            'identity_document_number' => $validated['identity_document_number'] ?? null,
            'license_type' => $validated['license_type'] ?? null,
            'license_number' => $validated['license_number'] ?? null,
            'license_expires_at' => $validated['license_expires_at'] ?? null,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);
        
        // Assigner le véhicule directement via la table vehicle_assignments
        if (isset($validated['vehicle_id'])) {
            \App\Models\VehicleAssignment::create([
                'driver_id' => $driver->id,
                'vehicle_id' => $validated['vehicle_id'],
                'starts_at' => now(),
                'ends_at' => null,
            ]);
        }

        return redirect()->route('drivers.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Livreur créé avec succès.');
    }

    public function update(DriverUpdateRequest $request, string $company, \App\Models\Driver $driver): RedirectResponse
    {
        $this->ensureDriverBelongsToCurrentCompany($request, $driver);
        $validated = $request->validated();

        // Mettre à jour le driver
        $driver->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'identity_document_type' => $validated['identity_document_type'] ?? null,
            'identity_document_number' => $validated['identity_document_number'] ?? null,
            'license_type' => $validated['license_type'],
            'license_number' => $validated['license_number'],
            'license_expires_at' => $validated['license_expires_at'],
            'is_active' => (bool) $validated['is_active'],
        ]);
        
        // Gérer l'assignation du véhicule
        // Terminer les assignations précédentes
        $driver->vehicleAssignments()->whereNull('ends_at')->update(['ends_at' => now()]);
        
        // Créer une nouvelle assignation si un véhicule est spécifié
        if (isset($validated['vehicle_id'])) {
            \App\Models\VehicleAssignment::create([
                'driver_id' => $driver->id,
                'vehicle_id' => $validated['vehicle_id'],
                'starts_at' => now(),
                'ends_at' => null,
            ]);
        }

        return redirect()->route('drivers.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Livreur mis à jour.');
    }

    public function destroy(Request $request, string $company, \App\Models\Driver $driver): RedirectResponse
    {
        $this->ensureDriverBelongsToCurrentCompany($request, $driver);

        // Terminer toutes les assignations de véhicules
        $driver->vehicleAssignments()->whereNull('ends_at')->update(['ends_at' => now()]);
        
        // Désactiver le livreur
        $driver->update(['is_active' => false]);
        
        // Ou supprimer complètement (décommenter si on veut vraiment supprimer)
        // $driver->delete();

        return redirect()->route('drivers.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Livreur retiré de la compagnie.');
    }

    public function assign(DriverVehicleAssignRequest $request, string $company, \App\Models\Driver $driver): RedirectResponse
    {
        $this->ensureDriverBelongsToCurrentCompany($request, $driver);

        // Terminer les assignations précédentes
        $driver->vehicleAssignments()->whereNull('ends_at')->update(['ends_at' => now()]);
        
        // Créer une nouvelle assignation
        \App\Models\VehicleAssignment::create([
            'driver_id' => $driver->id,
            'vehicle_id' => $request->validated('vehicle_id'),
            'starts_at' => now(),
            'ends_at' => null,
        ]);

        return redirect()->route('drivers.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Véhicule attribué au livreur.');
    }

    public function unassign(Request $request, string $company, \App\Models\Driver $driver): RedirectResponse
    {
        $this->ensureDriverBelongsToCurrentCompany($request, $driver);

        $driver->vehicleAssignments()->whereNull('ends_at')->update(['ends_at' => now()]);

        return redirect()->route('drivers.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Véhicule retiré du livreur.');
    }

    private function ensureDriverBelongsToCurrentCompany(Request $request, \App\Models\Driver $driver): void
    {
        $companyId = $request->user()->current_company_id;

        abort_if(
            $driver->company_id !== $companyId,
            404
        );
    }
}
