<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyBranchController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $subscription = $company->subscription;
        $plan = $subscription?->plan;

        $branches = Branch::query()
            ->forCompany($company->id)
            ->withCount(['shipments', 'users'])
            ->orderBy('name')
            ->get();

        $canAddMore = true;
        $limitReached = false;
        
        if ($plan && $plan->max_branches !== null) {
            $canAddMore = $branches->count() < $plan->max_branches;
            $limitReached = !$canAddMore;
        }

        return Inertia::render('Settings/Branches', [
            'branches' => $branches,
            'plan' => $plan ? [
                'name' => $plan->name,
                'max_branches' => $plan->max_branches,
            ] : null,
            'canAddMore' => $canAddMore,
            'limitReached' => $limitReached,
            'currentCount' => $branches->count(),
        ]);
    }

    public function store(Request $request, string $company): RedirectResponse
    {
        $company = $request->user()->currentCompany;
        $subscription = $company->subscription;
        $plan = $subscription?->plan;

        // Vérifier la limite du plan
        if ($plan && $plan->max_branches !== null) {
            $currentCount = Branch::forCompany($company->id)->count();
            if ($currentCount >= $plan->max_branches) {
                return redirect()->back()->withErrors([
                    'limit' => "Limite d'agences atteinte pour votre plan ({$plan->name}). Mettez à niveau pour ajouter plus d'agences."
                ]);
            }
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
        ]);

        $branch = Branch::create([
            ...$validated,
            'company_id' => $company->id,
        ]);

        // Assigner automatiquement l'utilisateur actuel à la nouvelle agence
        $request->user()->branches()->attach($branch->id, ['is_default' => false]);

        return redirect()->route('settings.branches', ['company' => $company->slug])->with('status', 'Agence créée avec succès.');
    }

    public function update(Request $request, string $company, string $branchId): RedirectResponse
    {
        $branch = Branch::findOrFail($branchId);
        $this->ensureBranchBelongsToCurrentCompany($request, $branch);
        
        $company = $request->user()->currentCompany;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
        ]);

        $branch->update($validated);

        return redirect()->route('settings.branches', ['company' => $company->slug])->with('status', 'Agence mise à jour.');
    }

    public function destroy(Request $request, string $company, string $branchId): RedirectResponse
    {
        $branch = Branch::findOrFail($branchId);
        $this->ensureBranchBelongsToCurrentCompany($request, $branch);

        // Vérifier qu'il reste au moins une agence
        $company = $request->user()->currentCompany;
        $branchCount = Branch::forCompany($company->id)->count();
        
        if ($branchCount <= 1) {
            return redirect()->route('settings.branches', ['company' => $company->slug])
                ->withErrors(['delete' => 'Impossible de supprimer la dernière agence.']);
        }

        if ($branch->shipments()->count() > 0) {
            return redirect()->route('settings.branches', ['company' => $company->slug])
                ->withErrors(['delete' => 'Impossible de supprimer une agence qui a des livraisons associées.']);
        }

        if ($branch->users()->count() > 0) {
            return redirect()->route('settings.branches', ['company' => $company->slug])
                ->withErrors(['delete' => 'Impossible de supprimer une agence qui a des utilisateurs assignés. Réassignez-les d\'abord.']);
        }

        $branch->delete();

        return redirect()->route('settings.branches', ['company' => $company->slug])->with('status', 'Agence supprimée.');
    }

    private function ensureBranchBelongsToCurrentCompany(Request $request, Branch $branch): void
    {
        abort_if(
            $branch->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
