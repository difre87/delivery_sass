<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AutoAssignsBranch;
use App\Models\Branch;
use App\Models\Driver;
use App\Models\RecurringDispatchRun;
use App\Models\Shipment;
use App\Models\Vehicle;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecurringDispatchRunController extends Controller
{
    use AutoAssignsBranch, LogsActivity;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $currentBranchId = $request->user()->current_branch_id;

        $recurringRuns = RecurringDispatchRun::query()
            ->forCompany($company->id)
            ->when($currentBranchId, function ($query) use ($currentBranchId) {
                $query->where(function ($q) use ($currentBranchId) {
                    $q->where('branch_id', $currentBranchId)
                      ->orWhereNull('branch_id'); // Inclure les tournées sans agence spécifique
                });
            })
            ->with(['branch:id,name', 'driver:id,name', 'vehicle:id,plate_number'])
            ->withCount('shipments')
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        $branches = Branch::query()
            ->forCompany($company->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $drivers = Driver::query()
            ->where('company_id', $company->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $vehicles = Vehicle::query()
            ->forCompany($company->id)
            ->orderBy('plate_number')
            ->get(['id', 'plate_number']);

        $shipments = Shipment::query()
            ->forCompany($company->id)
            ->when($currentBranchId, fn($query) => $query->where('branch_id', $currentBranchId))
            ->whereNotIn('status', ['delivered', 'canceled'])
            ->with([
                'client:id,name', 
                'senderAddress:id,street,city,postal_code', 
                'recipientAddress:id,street,city,postal_code'
            ])
            ->orderByDesc('id')
            ->get([
                'id', 
                'reference', 
                'tracking_number', 
                'recipient_name',
                'recipient_phone',
                'recipient_address',
                'client_id',
                'sender_address_id',
                'recipient_address_id',
                'status'
            ]);

        return Inertia::render('Routes/Recurring', [
            'recurringRuns' => $recurringRuns,
            'branches' => $branches,
            'drivers' => $drivers,
            'vehicles' => $vehicles,
            'shipments' => $shipments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'frequency' => 'required|in:daily,weekly,monthly',
            'weekdays' => 'nullable|array',
            'weekdays.*' => 'integer|min:1|max:7',
            'monthdays' => 'nullable|array',
            'monthdays.*' => 'integer|min:1|max:31',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'driver_id' => 'nullable|exists:drivers,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'default_start_time' => 'nullable|date_format:H:i',
            'default_end_time' => 'nullable|date_format:H:i',
            'default_status' => 'required|in:planned,in_progress,completed',
            'is_active' => 'boolean',
            'shipment_ids' => 'nullable|array',
            'shipment_ids.*' => 'exists:shipments,id',
        ]);

        $recurringRun = RecurringDispatchRun::create(
            $this->withCompanyAndBranch(
                collect($validated)->except('shipment_ids')->toArray(),
                $request
            )
        );

        if (isset($validated['shipment_ids'])) {
            $recurringRun->shipments()->sync($validated['shipment_ids']);
        }

        static::logCreated('recurring_dispatch_runs', $recurringRun, "Création de la tournée récurrente '{$recurringRun->name}'");

        return redirect()
            ->route('routes.recurring.index', ['company' => $request->user()->currentCompany->slug])
            ->with('status', 'Tournée récurrente créée avec succès.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $company, RecurringDispatchRun $recurringDispatchRun): RedirectResponse
    {
        $this->ensureRecurringRunBelongsToCurrentCompany($request, $recurringDispatchRun);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'frequency' => 'required|in:daily,weekly,monthly',
            'weekdays' => 'nullable|array',
            'weekdays.*' => 'integer|min:1|max:7',
            'monthdays' => 'nullable|array',
            'monthdays.*' => 'integer|min:1|max:31',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'branch_id' => 'nullable|exists:branches,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'default_start_time' => 'nullable|date_format:H:i',
            'default_end_time' => 'nullable|date_format:H:i',
            'default_status' => 'required|in:planned,in_progress,completed',
            'is_active' => 'boolean',
            'shipment_ids' => 'nullable|array',
            'shipment_ids.*' => 'exists:shipments,id',
        ]);

        $oldValues = $recurringDispatchRun->only(['name', 'frequency', 'is_active']);

        $recurringDispatchRun->update(collect($validated)->except('shipment_ids')->toArray());

        if (isset($validated['shipment_ids'])) {
            $recurringDispatchRun->shipments()->sync($validated['shipment_ids']);
        }

        $newValues = $recurringDispatchRun->only(['name', 'frequency', 'is_active']);

        static::logUpdated('recurring_dispatch_runs', $recurringDispatchRun, $oldValues, $newValues, "Modification de la tournée récurrente '{$recurringDispatchRun->name}'");

        return redirect()
            ->route('routes.recurring.index', ['company' => $request->user()->currentCompany->slug])
            ->with('status', 'Tournée récurrente mise à jour.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $company, RecurringDispatchRun $recurringDispatchRun): RedirectResponse
    {
        $this->ensureRecurringRunBelongsToCurrentCompany($request, $recurringDispatchRun);

        $name = $recurringDispatchRun->name;
        $recurringDispatchRun->delete();

        static::logDeleted('recurring_dispatch_runs', $recurringDispatchRun, "Suppression de la tournée récurrente '{$name}'");

        return redirect()
            ->route('routes.recurring.index', ['company' => $request->user()->currentCompany->slug])
            ->with('status', 'Tournée récurrente supprimée.');
    }

    /**
     * Toggle active status
     */
    public function toggle(Request $request, string $company, RecurringDispatchRun $recurringDispatchRun): RedirectResponse
    {
        $this->ensureRecurringRunBelongsToCurrentCompany($request, $recurringDispatchRun);

        $recurringDispatchRun->update(['is_active' => !$recurringDispatchRun->is_active]);

        $status = $recurringDispatchRun->is_active ? 'activée' : 'désactivée';
        
        static::logUpdated('recurring_dispatch_runs', $recurringDispatchRun, ['is_active' => !$recurringDispatchRun->is_active], ['is_active' => $recurringDispatchRun->is_active], "Tournée récurrente '{$recurringDispatchRun->name}' {$status}");

        return redirect()
            ->route('routes.recurring.index', ['company' => $request->user()->currentCompany->slug])
            ->with('status', "Tournée récurrente {$status}.");
    }

    private function ensureRecurringRunBelongsToCurrentCompany(Request $request, RecurringDispatchRun $recurringDispatchRun): void
    {
        abort_if(
            $recurringDispatchRun->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
