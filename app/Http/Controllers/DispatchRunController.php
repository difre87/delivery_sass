<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AutoAssignsBranch;
use App\Http\Requests\DispatchRunStoreRequest;
use App\Http\Requests\DispatchRunUpdateRequest;
use App\Models\Branch;
use App\Models\DispatchRun;
use App\Models\Shipment;
use App\Models\User;
use App\Models\Vehicle;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DispatchRunController extends Controller
{
    use AutoAssignsBranch, LogsActivity;

    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        $runs = DispatchRun::query()
            ->forCompany($company->id)
            ->with(['branch:id,name', 'driver:id,name', 'vehicle:id,plate_number', 'shipments:id,reference,tracking_number'])
            ->withCount('shipments')
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $branches = Branch::query()
            ->forCompany($company->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $vehicles = Vehicle::query()
            ->forCompany($company->id)
            ->orderBy('plate_number')
            ->get(['id', 'plate_number']);

        $drivers = \App\Models\Driver::query()
            ->where('company_id', $company->id)
            ->where('is_active', true)
            ->with(['vehicleAssignments' => fn($query) => 
                $query->whereNull('ends_at')
                      ->with('vehicle:id,plate_number,make,model')
                      ->latest()
            ])
            ->orderBy('name')
            ->get(['id', 'name']);

        $shipments = Shipment::query()
            ->forCompany($company->id)
            ->whereNotIn('status', ['delivered', 'canceled'])
            ->orderByDesc('id')
            ->get(['id', 'reference', 'tracking_number', 'recipient_name', 'status']);

        return Inertia::render('Routes/Index', [
            'runs' => $runs,
            'branches' => $branches,
            'vehicles' => $vehicles,
            'drivers' => $drivers,
            'shipments' => $shipments,
        ]);
    }

    public function store(DispatchRunStoreRequest $request, string $company): RedirectResponse
    {
        $validated = $request->validated();

        $dispatchRun = DispatchRun::create(
            $this->withCompanyAndBranch(
                collect($validated)->except('shipment_ids')->toArray(),
                $request
            )
        );

        $dispatchRun->shipments()->sync($validated['shipment_ids'] ?? []);

        static::logCreated('dispatch_runs', $dispatchRun, "Création de la tournée du {$dispatchRun->date} avec {$dispatchRun->shipments()->count()} livraisons");

        return redirect()->route('routes.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Tournée créée avec succès.');
    }

    public function update(DispatchRunUpdateRequest $request, string $company, DispatchRun $dispatchRun): RedirectResponse
    {
        $this->ensureDispatchRunBelongsToCurrentCompany($request, $dispatchRun);

        $validated = $request->validated();

        $oldValues = $dispatchRun->only(['date', 'status', 'branch_id', 'driver_id', 'vehicle_id', 'start_time', 'end_time']);
        $oldShipmentIds = $dispatchRun->shipments()->pluck('id')->toArray();

        $dispatchRun->update(collect($validated)->except('shipment_ids')->toArray());
        $dispatchRun->shipments()->sync($validated['shipment_ids'] ?? []);

        $newValues = $dispatchRun->only(['date', 'status', 'branch_id', 'driver_id', 'vehicle_id', 'start_time', 'end_time']);
        $newShipmentIds = $dispatchRun->shipments()->pluck('id')->toArray();

        $changes = array_merge($oldValues, ['shipment_ids' => $oldShipmentIds]);
        $newChanges = array_merge($newValues, ['shipment_ids' => $newShipmentIds]);

        static::logUpdated('dispatch_runs', $dispatchRun, $changes, $newChanges, "Modification de la tournée du {$dispatchRun->date}");

        return redirect()->route('routes.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Tournée mise à jour.');
    }

    public function destroy(Request $request, string $company, DispatchRun $dispatchRun): RedirectResponse
    {
        $this->ensureDispatchRunBelongsToCurrentCompany($request, $dispatchRun);

        $date = $dispatchRun->date;
        $dispatchRun->delete();

        static::logDeleted('dispatch_runs', $dispatchRun, "Suppression de la tournée du {$date}");

        return redirect()->route('routes.index', ['company' => $request->user()->currentCompany->slug])->with('status', 'Tournée supprimée.');
    }

    private function ensureDispatchRunBelongsToCurrentCompany(Request $request, DispatchRun $dispatchRun): void
    {
        abort_if(
            $dispatchRun->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
