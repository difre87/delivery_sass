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

        return redirect()->route('clients.index')->with('status', 'Client créé avec succès.');
    }

    public function update(ClientUpdateRequest $request, Client $client): RedirectResponse
    {
        $this->ensureClientBelongsToCurrentCompany($request, $client);

        $client->update($request->validated());

        return redirect()->route('clients.index')->with('status', 'Client mis à jour.');
    }

    public function destroy(Request $request, Client $client): RedirectResponse
    {
        $this->ensureClientBelongsToCurrentCompany($request, $client);

        $client->delete();

        return redirect()->route('clients.index')->with('status', 'Client supprimé.');
    }

    private function ensureClientBelongsToCurrentCompany(Request $request, Client $client): void
    {
        abort_if(
            $client->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
