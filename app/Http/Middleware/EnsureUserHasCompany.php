<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasCompany
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        // Les super admins n'ont pas besoin de société
        if ($user->is_super_admin) {
            return $next($request);
        }

        if ($user->current_company_id && $user->companies()->whereKey($user->current_company_id)->exists()) {
            return $next($request);
        }

        $firstCompany = $user->companies()->first();

        if (! $firstCompany) {
            return redirect()->route('onboarding.company.create');
        }

        $user->forceFill([
            'current_company_id' => $firstCompany->id,
        ])->save();

        return $next($request);
    }
}
