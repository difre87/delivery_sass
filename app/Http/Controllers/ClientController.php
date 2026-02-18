<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\AutoAssignsBranch;
use App\Http\Requests\ClientStoreRequest;
use App\Http\Requests\ClientUpdateRequest;
use App\Models\Client;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    use LogsActivity, AutoAssignsBranch;

    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $currentBranchId = $request->user()->current_branch_id;

        $clients = Client::query()
            ->forCompany($company->id)
            ->when($currentBranchId, fn($q) => $q->where('branch_id', $currentBranchId))
            ->with('branch:id,name')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        // Récupérer les branches pour les sélecteurs
        $branches = \App\Models\Branch::query()
            ->where('company_id', $company->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'branches' => $branches,
        ]);
    }

    public function store(ClientStoreRequest $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;

        $client = Client::create(
            $this->withCompanyAndBranch($request->validated(), $request)
        );

        static::logCreated('clients', $client, "Création du client {$client->name}");

        return redirect()->route('clients.index', ['company' => $company->slug])->with('status', 'Client créé avec succès.');
    }

    public function update(ClientUpdateRequest $request, string $clientId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $clientModel = Client::where('company_id', $company->id)
            ->where('id', $clientId)
            ->firstOrFail();

        $oldValues = $clientModel->only(['name', 'email', 'phone', 'address', 'city', 'postal_code', 'country']);

        $clientModel->update($request->validated());

        $newValues = $clientModel->only(['name', 'email', 'phone', 'address', 'city', 'postal_code', 'country']);

        static::logUpdated('clients', $clientModel, $oldValues, $newValues, "Modification du client {$clientModel->name}");

        return redirect()->route('clients.index', ['company' => $company->slug])->with('status', 'Client mis à jour.');
    }

    public function destroy(Request $request, string $clientId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $clientModel = Client::where('company_id', $company->id)
            ->where('id', $clientId)
            ->firstOrFail();

        $clientName = $clientModel->name;
        $clientModel->delete();

        static::logDeleted('clients', $clientModel, "Suppression du client {$clientName}");

        return redirect()->route('clients.index', ['company' => $company->slug])->with('status', 'Client supprimé.');
    }
}
