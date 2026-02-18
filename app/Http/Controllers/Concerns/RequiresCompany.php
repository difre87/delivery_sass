<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

trait RequiresCompany
{
    /**
     * Ensure the user has a current company, redirect appropriately if not
     */
    protected function ensureHasCompany(Request $request): ?Response
    {
        $user = $request->user();
        $company = $user->currentCompany;

        // Si l'utilisateur est super admin sans société, rediriger vers le dashboard admin
        if ($user->is_super_admin && !$company) {
            return redirect()->route('admin.dashboard');
        }

        // Si pas de société, rediriger vers l'onboarding
        if (!$company) {
            return redirect()->route('onboarding.company.create');
        }

        return null;
    }
}
