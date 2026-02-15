<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
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
        if ($request->user()?->companies()->exists()) {
            return redirect()->route('dashboard');
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

        DB::transaction(function () use ($user, $validated, $slug): void {
            $company = Company::create([
                'name' => $validated['name'],
                'slug' => $slug,
            ]);

            $company->users()->attach($user->id, ['role' => 'owner']);

            $user->forceFill([
                'current_company_id' => $company->id,
            ])->save();
        });

        return redirect()->route('dashboard');
    }
}
