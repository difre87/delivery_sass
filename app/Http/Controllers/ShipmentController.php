<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShipmentStoreRequest;
use App\Http\Requests\ShipmentUpdateRequest;
use App\Models\Branch;
use App\Models\Client;
use App\Models\Shipment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        $shipments = Shipment::query()
            ->forCompany($company->id)
            ->with(['client:id,name', 'branch:id,name'])
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $clients = Client::query()
            ->forCompany($company->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $branches = Branch::query()
            ->forCompany($company->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Shipments/Index', [
            'shipments' => $shipments,
            'clients' => $clients,
            'branches' => $branches,
        ]);
    }

    public function store(ShipmentStoreRequest $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;

        Shipment::create([
            ...$request->validated(),
            'company_id' => $company->id,
        ]);

        return redirect()->route('shipments.index')->with('status', 'Livraison créée avec succès.');
    }

    public function update(ShipmentUpdateRequest $request, Shipment $shipment): RedirectResponse
    {
        $this->ensureShipmentBelongsToCurrentCompany($request, $shipment);

        $shipment->update($request->validated());

        return redirect()->route('shipments.index')->with('status', 'Livraison mise à jour.');
    }

    public function destroy(Request $request, Shipment $shipment): RedirectResponse
    {
        $this->ensureShipmentBelongsToCurrentCompany($request, $shipment);

        $shipment->delete();

        return redirect()->route('shipments.index')->with('status', 'Livraison supprimée.');
    }

    private function ensureShipmentBelongsToCurrentCompany(Request $request, Shipment $shipment): void
    {
        abort_if(
            $shipment->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
