<?php

namespace App\Http\Controllers;

use App\Http\Requests\DispatchRunStoreRequest;
use App\Http\Requests\DispatchRunUpdateRequest;
use App\Models\Branch;
use App\Models\DispatchRun;
use App\Models\Shipment;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DispatchRunController extends Controller
{
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
            ->orderBy('name')
            ->get(['id', 'name']);

        $vehicles = Vehicle::query()
            ->forCompany($company->id)
            ->orderBy('plate_number')
            ->get(['id', 'plate_number']);

        $drivers = User::query()
            ->whereHas('companies', fn ($query) => 
                $query->where('companies.id', $company->id)
                      ->where('company_user.role', 'driver')
            )
            ->orderBy('name')
            ->get(['users.id', 'users.name']);

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

    public function store(DispatchRunStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $dispatchRun = DispatchRun::create([
            ...collect($validated)->except('shipment_ids')->toArray(),
            'company_id' => $request->user()->current_company_id,
        ]);

        $dispatchRun->shipments()->sync($validated['shipment_ids'] ?? []);

        return redirect()->route('routes.index')->with('status', 'Tournée créée avec succès.');
    }

    public function update(DispatchRunUpdateRequest $request, DispatchRun $dispatchRun): RedirectResponse
    {
        $this->ensureDispatchRunBelongsToCurrentCompany($request, $dispatchRun);

        $validated = $request->validated();

        $dispatchRun->update(collect($validated)->except('shipment_ids')->toArray());
        $dispatchRun->shipments()->sync($validated['shipment_ids'] ?? []);

        return redirect()->route('routes.index')->with('status', 'Tournée mise à jour.');
    }

    public function destroy(Request $request, DispatchRun $dispatchRun): RedirectResponse
    {
        $this->ensureDispatchRunBelongsToCurrentCompany($request, $dispatchRun);

        $dispatchRun->delete();

        return redirect()->route('routes.index')->with('status', 'Tournée supprimée.');
    }

    private function ensureDispatchRunBelongsToCurrentCompany(Request $request, DispatchRun $dispatchRun): void
    {
        abort_if(
            $dispatchRun->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
