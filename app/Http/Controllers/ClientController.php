<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClientStoreRequest;
use App\Http\Requests\ClientUpdateRequest;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        $clients = Client::query()
            ->forCompany($company->id)
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
        ]);
    }

    public function store(ClientStoreRequest $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;

        Client::create([
            ...$request->validated(),
            'company_id' => $company->id,
        ]);

        return redirect()->route('clients.index', ['company' => $company->slug])->with('status', 'Client créé avec succès.');
    }

    public function update(ClientUpdateRequest $request, string $clientId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $clientModel = Client::where('company_id', $company->id)
            ->where('id', $clientId)
            ->firstOrFail();

        $clientModel->update($request->validated());

        return redirect()->route('clients.index', ['company' => $company->slug])->with('status', 'Client mis à jour.');
    }

    public function destroy(Request $request, string $clientId): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        
        $clientModel = Client::where('company_id', $company->id)
            ->where('id', $clientId)
            ->firstOrFail();

        $clientModel->delete();

        return redirect()->route('clients.index', ['company' => $company->slug])->with('status', 'Client supprimé.');
    }
}
