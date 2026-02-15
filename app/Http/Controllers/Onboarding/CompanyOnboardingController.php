<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CompanyOnboardingController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        
        if ($user?->companies()->exists()) {
            $company = $user->currentCompany ?? $user->companies()->first();
            return redirect()->route('dashboard', ['company' => $company->slug]);
        }

        return Inertia::render('Onboarding/Company');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug !== '' ? $baseSlug : 'company';
        $suffix = 1;

        while (Company::where('slug', $slug)->exists()) {
            $slug = sprintf('%s-%d', $baseSlug !== '' ? $baseSlug : 'company', $suffix);
            $suffix++;
        }

        $company = null;

        DB::transaction(function () use ($user, $validated, $slug, &$company): void {
            // Créer la société avec 14 jours d'essai
            $company = Company::create([
                'name' => $validated['name'],
                'slug' => $slug,
                'trial_ends_at' => now()->addDays(14),
            ]);

            $company->users()->attach($user->id, ['role' => 'owner']);

            // Créer une agence par défaut
            $defaultBranch = Branch::create([
                'company_id' => $company->id,
                'name' => 'Siège Social',
                'address' => null,
                'phone' => null,
                'email' => null,
            ]);

            // Assigner l'utilisateur à l'agence par défaut
            $defaultBranch->users()->attach($user->id, ['is_default' => true]);

            $user->forceFill([
                'current_company_id' => $company->id,
                'current_branch_id' => $defaultBranch->id,
            ])->save();
        });

        return redirect()->route('dashboard', ['company' => $company->slug]);
    }
}
