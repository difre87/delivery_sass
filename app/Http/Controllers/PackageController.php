<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AutoAssignsBranch;
use App\Models\Package;
use App\Models\Shipment;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    use LogsActivity, AutoAssignsBranch;

    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $currentBranchId = $request->user()->current_branch_id;

        $packages = Package::query()
            ->forCompany($company->id)
            ->where('branch_id', $currentBranchId)
            ->with(['shipment', 'branch'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('tracking_number', 'like', "%{$search}%")
                        ->orWhere('reference', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('type'), function ($query, $type) {
                $query->where('type', $type);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Packages/Index', [
            'packages' => $packages,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Packages/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;

        $validated = $request->validate([
            'reference' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'in:standard,fragile,perishable,document'],
            'weight_kg' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'length_cm' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'width_cm' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'height_cm' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'value_cents' => ['nullable', 'integer', 'min:0'],
            'declared_value_cents' => ['nullable', 'integer', 'min:0'],
            'requires_signature' => ['sometimes', 'boolean'],
            'is_fragile' => ['sometimes', 'boolean'],
            'is_hazardous' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        // Generate reference if not provided
        if (empty($validated['reference'])) {
            $validated['reference'] = 'PKG-' . strtoupper(substr(uniqid(), -8));
        }

        $package = Package::create([
            ...$this->withCompanyAndBranch($validated, $request),
            'status' => 'pending', // Status initial: en attente d'assignation à une livraison
            'requires_signature' => $validated['requires_signature'] ?? false,
            'is_fragile' => $validated['is_fragile'] ?? false,
            'is_hazardous' => $validated['is_hazardous'] ?? false,
        ]);

        static::logCreated('packages', $package, "Création du colis {$package->tracking_number}");

        return redirect()->route('packages.index', ['company' => $company->slug])
            ->with('status', 'Colis créé avec succès.');
    }

    public function edit(Request $request, string $packageId): Response
    {
        $company = $request->user()->currentCompany;
        $package = Package::forCompany($company->id)->with('shipment')->findOrFail($packageId);

        $shipments = Shipment::query()
            ->forCompany($company->id)
            ->whereIn('status', ['draft', 'pending', 'in_transit'])
            ->latest()
            ->get(['id', 'reference', 'tracking_number', 'recipient_name']);

        return Inertia::render('Packages/Edit', [
            'package' => $package,
            'shipments' => $shipments,
        ]);
    }

    public function update(Request $request, string $packageId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        $package = Package::forCompany($company->id)->findOrFail($packageId);

        $validated = $request->validate([
            'shipment_id' => ['required', 'exists:shipments,id'],
            'reference' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'in:standard,fragile,perishable,document'],
            'weight_kg' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'length_cm' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'width_cm' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'height_cm' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'value_cents' => ['nullable', 'integer', 'min:0'],
            'declared_value_cents' => ['nullable', 'integer', 'min:0'],
            'requires_signature' => ['boolean'],
            'is_fragile' => ['boolean'],
            'is_hazardous' => ['boolean'],
            'status' => ['required', 'in:pending,in_transit,delivered,returned,lost'],
            'notes' => ['nullable', 'string'],
        ]);

        // Verify shipment belongs to company
        Shipment::forCompany($company->id)->findOrFail($validated['shipment_id']);

        $oldValues = $package->only(['shipment_id', 'status', 'type', 'weight_kg', 'reference', 'description']);

        $package->update($validated);

        $newValues = $package->only(['shipment_id', 'status', 'type', 'weight_kg', 'reference', 'description']);

        static::logUpdated('packages', $package, $oldValues, $newValues, "Modification du colis {$package->tracking_number}");

        return redirect()->route('packages.index', ['company' => $company->slug])
            ->with('status', 'Colis mis à jour avec succès.');
    }

    public function destroy(Request $request, string $packageId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        $package = Package::forCompany($company->id)->findOrFail($packageId);

        $trackingNumber = $package->tracking_number;
        $package->delete();

        static::logDeleted('packages', $package, "Suppression du colis {$trackingNumber}");

        return redirect()->route('packages.index', ['company' => $company->slug])
            ->with('status', 'Colis supprimé avec succès.');
    }
}
