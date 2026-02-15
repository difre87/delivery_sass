<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        $branches = Branch::query()
            ->forCompany($company->id)
            ->withCount(['shipments'])
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Branches/Index', [
            'branches' => $branches,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
        ]);

        Branch::create([
            ...$validated,
            'company_id' => $company->id,
        ]);

        return redirect()->route('branches.index')->with('status', 'Agence créée avec succès.');
    }

    public function update(Request $request, Branch $branch): RedirectResponse
    {
        $this->ensureBranchBelongsToCurrentCompany($request, $branch);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
        ]);

        $branch->update($validated);

        return redirect()->route('branches.index')->with('status', 'Agence mise à jour.');
    }

    public function destroy(Request $request, Branch $branch): RedirectResponse
    {
        $this->ensureBranchBelongsToCurrentCompany($request, $branch);

        if ($branch->shipments()->count() > 0) {
            return redirect()->route('branches.index')
                ->withErrors(['delete' => 'Impossible de supprimer une agence qui a des livraisons associées.']);
        }

        $branch->delete();

        return redirect()->route('branches.index')->with('status', 'Agence supprimée.');
    }

    private function ensureBranchBelongsToCurrentCompany(Request $request, Branch $branch): void
    {
        abort_if(
            $branch->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
