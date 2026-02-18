<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyBranchController extends Controller
{
    use LogsActivity;

    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $subscription = $company->subscription;
        $plan = $subscription?->plan;

        $branches = Branch::query()
            ->forCompany($company->id)
            ->withCount(['shipments', 'users'])
            ->orderBy('is_active', 'desc')
            ->orderBy('name')
            ->get();

        $activeBranchesCount = $branches->where('is_active', true)->count();

        $canAddMore = true;
        $limitReached = false;
        
        if ($plan && $plan->max_branches !== null) {
            $canAddMore = $activeBranchesCount < $plan->max_branches;
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
            'currentCount' => $activeBranchesCount,
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

        static::logCreated('branches', $branch, "Création de l'agence {$branch->name}");

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

        $oldValues = $branch->only(['name', 'address', 'city', 'country']);

        $branch->update($validated);

        $newValues = $branch->only(['name', 'address', 'city', 'country']);

        static::logUpdated('branches', $branch, $oldValues, $newValues, "Modification de l'agence {$branch->name}");

        return redirect()->route('settings.branches', ['company' => $company->slug])->with('status', 'Agence mise à jour.');
    }

    public function destroy(Request $request, string $company, string $branchId): RedirectResponse
    {
        $branch = Branch::findOrFail($branchId);
        $this->ensureBranchBelongsToCurrentCompany($request, $branch);

        // Vérifier qu'il reste au moins une agence active
        $company = $request->user()->currentCompany;
        $activeBranchCount = Branch::forCompany($company->id)->where('is_active', true)->count();
        
        if ($activeBranchCount <= 1) {
            return redirect()->route('settings.branches', ['company' => $company->slug])
                ->withErrors(['delete' => 'Impossible de désactiver la dernière agence active.']);
        }

        // Soft delete: désactiver au lieu de supprimer
        $branchName = $branch->name;
        $branch->update(['is_active' => false]);

        static::logDeleted('branches', $branch, "Désactivation de l'agence {$branchName}");

        return redirect()->route('settings.branches', ['company' => $company->slug])->with('status', 'Agence désactivée avec succès.');
    }

    public function restore(Request $request, string $company, string $branchId): RedirectResponse
    {
        $branch = Branch::findOrFail($branchId);
        $this->ensureBranchBelongsToCurrentCompany($request, $branch);

        $company = $request->user()->currentCompany;
        $subscription = $company->subscription;
        $plan = $subscription?->plan;

        // Vérifier la limite du plan pour les agences actives
        if ($plan && $plan->max_branches !== null) {
            $activeBranchCount = Branch::forCompany($company->id)->where('is_active', true)->count();
            if ($activeBranchCount >= $plan->max_branches) {
                return redirect()->back()->withErrors([
                    'limit' => "Limite d'agences actives atteinte pour votre plan ({$plan->name}). Mettez à niveau pour réactiver plus d'agences."
                ]);
            }
        }

        $branchName = $branch->name;
        $branch->update(['is_active' => true]);

        static::logCustomAction('reactivated', 'branches', "Réactivation de l'agence {$branchName}", $branch, null);

        return redirect()->route('settings.branches', ['company' => $company->slug])->with('status', 'Agence réactivée avec succès.');
    }

    private function ensureBranchBelongsToCurrentCompany(Request $request, Branch $branch): void
    {
        abort_if(
            $branch->company_id !== $request->user()->current_company_id,
            404
        );
    }
}
