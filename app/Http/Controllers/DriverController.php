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
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        // Récupérer les utilisateurs ayant le rôle 'driver' via la table pivot
        $drivers = User::query()
            ->whereHas('companies', fn ($query) => 
                $query->where('companies.id', $company->id)
                      ->where('company_user.role', 'driver')
            )
            ->with(['vehicleAssignments' => fn ($query) => $query
                ->whereNull('ends_at')
                ->latest('starts_at')
                ->with('vehicle:id,plate_number,make,model')])
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

        $driver = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
            'current_company_id' => $companyId,
        ]);

        $driver->companies()->attach($companyId, ['role' => 'driver']);
        
        // Créer aussi l'entrée dans la table drivers
        \App\Models\Driver::create([
            'company_id' => $companyId,
            'user_id' => $driver->id,
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'license_number' => $validated['license_number'] ?? null,
            'license_expires_at' => $validated['license_expires_at'] ?? null,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);
        
        $this->assignVehicle($driver, $validated['vehicle_id'] ?? null);

        return redirect()->route('drivers.index')->with('status', 'Livreur créé avec succès.');
    }

    public function update(DriverUpdateRequest $request, User $driver): RedirectResponse
    {
        $this->ensureDriverBelongsToCurrentCompany($request, $driver);
        $validated = $request->validated();

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'type' => 'driver',
            'is_active' => (bool) $validated['is_active'],
        ];

        if (! empty($validated['password'])) {
            $payload['password'] = Hash::make($validated['password']);
        }

        $driver->update($payload);
        $this->assignVehicle($driver, $validated['vehicle_id'] ?? null);

        return redirect()->route('drivers.index')->with('status', 'Livreur mis à jour.');
    }

    public function destroy(Request $request, User $driver): RedirectResponse
    {
        $this->ensureDriverBelongsToCurrentCompany($request, $driver);

        $driver->vehicleAssignments()->whereNull('ends_at')->update(['ends_at' => now()]);
        $driver->companies()->detach($request->user()->current_company_id);
        $driver->update(['is_active' => false]);

        return redirect()->route('drivers.index')->with('status', 'Livreur retiré de la compagnie.');
    }

    public function assign(DriverVehicleAssignRequest $request, User $driver): RedirectResponse
    {
        $this->ensureDriverBelongsToCurrentCompany($request, $driver);

        $this->assignVehicle($driver, $request->validated('vehicle_id'));

        return redirect()->route('drivers.index')->with('status', 'Véhicule attribué au livreur.');
    }

    public function unassign(Request $request, User $driver): RedirectResponse
    {
        $this->ensureDriverBelongsToCurrentCompany($request, $driver);

        $driver->vehicleAssignments()->whereNull('ends_at')->update(['ends_at' => now()]);

        return redirect()->route('drivers.index')->with('status', 'Véhicule retiré du livreur.');
    }

    private function assignVehicle(User $driver, ?int $vehicleId): void
    {
        $driver->vehicleAssignments()->whereNull('ends_at')->update(['ends_at' => now()]);

        if (! $vehicleId) {
            return;
        }

        VehicleAssignment::query()
            ->where('vehicle_id', $vehicleId)
            ->whereNull('ends_at')
            ->update(['ends_at' => now()]);

        VehicleAssignment::create([
            'driver_id' => $driver->id,
            'vehicle_id' => $vehicleId,
            'starts_at' => now(),
        ]);
    }

    private function ensureDriverBelongsToCurrentCompany(Request $request, User $driver): void
    {
        $companyId = $request->user()->current_company_id;

        abort_if(
            $driver->type !== 'driver' ||
            ! $driver->companies()->where('companies.id', $companyId)->exists(),
            404
        );
    }
}
