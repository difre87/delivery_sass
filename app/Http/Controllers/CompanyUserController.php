<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class CompanyUserController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $currentBranchId = $request->user()->current_branch_id;

        // Récupérer les utilisateurs de la compagnie avec leurs branches
        $users = User::query()
            ->whereHas('companies', fn($query) => $query->where('companies.id', $company->id))
            ->with([
                'branches' => fn($query) => $query
                    ->where('company_id', $company->id)
                    ->select('branches.id', 'branches.name'),
                'companies' => fn($query) => $query
                    ->where('companies.id', $company->id)
                    ->select('companies.id'),
            ])
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        // Récupérer les branches pour les sélecteurs
        $branches = Branch::query()
            ->where('company_id', $company->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Settings/Users', [
            'users' => $users,
            'branches' => $branches,
            'availableModules' => \App\Models\User::AVAILABLE_MODULES,
        ]);
    }

    public function store(Request $request, string $company): RedirectResponse
    {
        $companyModel = $request->user()->currentCompany;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', Rule::in(['owner', 'manager', 'staff'])],
            'branch_ids' => ['nullable', 'array'],
            'branch_ids.*' => ['integer', Rule::exists('branches', 'id')->where('company_id', $companyModel->id)],
            'allowed_modules' => ['nullable', 'array'],
            'allowed_modules.*' => ['string', Rule::in(array_keys(\App\Models\User::AVAILABLE_MODULES))],
        ]);

        // Créer l'utilisateur
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'allowed_modules' => $validated['allowed_modules'] ?? null,
        ]);

        // Attacher à la compagnie
        $user->companies()->attach($companyModel->id, ['role' => $validated['role']]);

        // Attacher aux branches
        if (!empty($validated['branch_ids'])) {
            foreach ($validated['branch_ids'] as $branchId) {
                $user->branches()->attach($branchId, ['is_default' => false]);
            }
            
            // Définir la première branche comme branche par défaut
            $user->update(['current_branch_id' => $validated['branch_ids'][0]]);
        }

        // Définir la compagnie actuelle
        $user->update(['current_company_id' => $companyModel->id]);

        return redirect()
            ->route('settings.users', ['company' => $companyModel->slug])
            ->with('status', 'Utilisateur créé avec succès.');
    }

    public function update(Request $request, string $company, User $user): RedirectResponse
    {
        $companyModel = $request->user()->currentCompany;
        
        // Vérifier que l'utilisateur appartient à la compagnie
        abort_unless(
            $user->companies()->where('companies.id', $companyModel->id)->exists(),
            403,
            'Cet utilisateur n\'appartient pas à votre compagnie.'
        );

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', Rule::in(['owner', 'manager', 'staff'])],
            'branch_ids' => ['nullable', 'array'],
            'branch_ids.*' => ['integer', Rule::exists('branches', 'id')->where('company_id', $companyModel->id)],
            'allowed_modules' => ['nullable', 'array'],
            'allowed_modules.*' => ['string', Rule::in(array_keys(\App\Models\User::AVAILABLE_MODULES))],
        ]);

        // Mettre à jour l'utilisateur
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'allowed_modules' => $validated['allowed_modules'] ?? null,
        ]);

        // Mettre à jour le mot de passe si fourni
        if (!empty($validated['password'])) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        // Mettre à jour le rôle
        $user->companies()->updateExistingPivot($companyModel->id, ['role' => $validated['role']]);

        // Synchroniser les branches
        if (isset($validated['branch_ids'])) {
            // Récupérer les IDs des branches de cette compagnie
            $companyBranchIds = $companyModel->branches()->pluck('id')->toArray();
            
            // Détacher l'utilisateur de toutes les branches de cette compagnie
            $user->branches()->detach($companyBranchIds);
            
            // Attacher les nouvelles branches
            foreach ($validated['branch_ids'] as $branchId) {
                $user->branches()->attach($branchId, ['is_default' => false]);
            }
        }

        return redirect()
            ->route('settings.users', ['company' => $companyModel->slug])
            ->with('status', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy(Request $request, string $company, User $user): RedirectResponse
    {
        $companyModel = $request->user()->currentCompany;
        
        // Vérifier que l'utilisateur appartient à la compagnie
        abort_unless(
            $user->companies()->where('companies.id', $companyModel->id)->exists(),
            403,
            'Cet utilisateur n\'appartient pas à votre compagnie.'
        );

        // Empêcher la suppression de son propre compte
        if ($user->id === $request->user()->id) {
            return redirect()
                ->route('settings.users', ['company' => $companyModel->slug])
                ->withErrors(['delete' => 'Vous ne pouvez pas supprimer votre propre compte.']);
        }

        // Récupérer les IDs des branches de cette compagnie
        $companyBranchIds = $companyModel->branches()->pluck('id')->toArray();
        
        // Détacher l'utilisateur de toutes les branches de cette compagnie
        $user->branches()->detach($companyBranchIds);
        
        // Détacher de la compagnie
        $user->companies()->detach($companyModel->id);

        return redirect()
            ->route('settings.users', ['company' => $companyModel->slug])
            ->with('status', 'Utilisateur retiré de la compagnie.');
    }
}
