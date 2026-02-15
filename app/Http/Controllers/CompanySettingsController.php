<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanySettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $company = $request->user()->currentCompany;

        return Inertia::render('Settings/Company', [
            'company' => [
                'name' => $company->name ?? '',
                'email' => $request->user()->email ?? '',
                'phone' => $company->phone ?? '',
                'currency' => $company->currency ?? 'EUR',
                'address' => $company->address ?? '',
                'city' => $company->city ?? '',
                'postal_code' => $company->postal_code ?? '',
                'country' => $company->country ?? '',
                'tax_id' => $company->tax_id ?? '',
                'registration_number' => $company->registration_number ?? '',
                'website' => $company->website ?? '',
                'logo' => $company->logo_path ?? null,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $company = $request->user()->currentCompany;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'currency' => ['required', 'string', 'in:EUR,USD,GBP,MAD,CHF,CAD,XOF'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:100'],
            'tax_id' => ['nullable', 'string', 'max:50'],
            'registration_number' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo_path'] = $path;
        }

        $company->update($validated);

        return back()->with('success', 'Paramètres mis à jour avec succès.');
    }
}
