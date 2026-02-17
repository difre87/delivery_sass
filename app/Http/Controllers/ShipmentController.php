<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShipmentStoreRequest;
use App\Http\Requests\ShipmentUpdateRequest;
use App\Models\Branch;
use App\Models\Client;
use App\Models\Package;
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
        $currentBranchId = $request->user()->current_branch_id;

        $shipments = Shipment::query()
            ->forCompany($company->id)
            ->with(['client:id,name', 'branch:id,name', 'packages:id,shipment_id,tracking_number,reference,description,type'])
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

        // Get available packages (not assigned to any shipment yet)
        $availablePackages = Package::query()
            ->forCompany($company->id)
            ->where('branch_id', $currentBranchId)
            ->whereNull('shipment_id')
            ->where('status', 'pending')
            ->orderByDesc('id')
            ->get(['id', 'tracking_number', 'reference', 'description', 'type']);

        return Inertia::render('Shipments/Index', [
            'shipments' => $shipments,
            'clients' => $clients,
            'branches' => $branches,
            'availablePackages' => $availablePackages,
        ]);
    }

    public function store(ShipmentStoreRequest $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;

        $shipment = Shipment::create([
            ...$request->validated(),
            'company_id' => $company->id,
        ]);

        // Associate selected packages with the shipment
        if ($request->has('package_ids') && is_array($request->package_ids)) {
            Package::query()
                ->forCompany($company->id)
                ->whereIn('id', $request->package_ids)
                ->whereNull('shipment_id')
                ->update([
                    'shipment_id' => $shipment->id,
                    'status' => 'in_transit',
                ]);
        }

        return redirect()->route('shipments.index', ['company' => $company->slug])->with('status', 'Livraison créée avec succès.');
    }

    public function update(ShipmentUpdateRequest $request, string $company, Shipment $shipment): RedirectResponse
    {
        $this->ensureShipmentBelongsToCurrentCompany($request, $shipment);
        $companyModel = $request->user()->currentCompany;

        $shipment->update($request->validated());

        // Sync packages if provided
        if ($request->has('package_ids')) {
            $newPackageIds = is_array($request->package_ids) ? $request->package_ids : [];
            
            // Remove packages that are no longer selected (set shipment_id to null and status to pending)
            Package::query()
                ->where('shipment_id', $shipment->id)
                ->whereNotIn('id', $newPackageIds)
                ->update([
                    'shipment_id' => null,
                    'status' => 'pending',
                ]);
            
            // Add newly selected packages
            Package::query()
                ->forCompany($companyModel->id)
                ->whereIn('id', $newPackageIds)
                ->where(function ($query) use ($shipment) {
                    $query->whereNull('shipment_id')
                        ->orWhere('shipment_id', $shipment->id);
                })
                ->update([
                    'shipment_id' => $shipment->id,
                    'status' => 'in_transit',
                ]);
        }

        return redirect()->route('shipments.index', ['company' => $companyModel->slug])->with('status', 'Livraison mise à jour.');
    }

    public function destroy(Request $request, string $company, Shipment $shipment): RedirectResponse
    {
        $this->ensureShipmentBelongsToCurrentCompany($request, $shipment);

        $shipment->delete();

        $companyModel = $request->user()->currentCompany;
        return redirect()->route('shipments.index', ['company' => $companyModel->slug])->with('status', 'Livraison supprimée.');
    }

    private function ensureShipmentBelongsToCurrentCompany(Request $request, Shipment $shipment): void
    {
        abort_if(
            $shipment->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
