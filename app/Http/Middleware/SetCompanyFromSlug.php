<?php

namespace App\Http\Middleware;

use App\Models\Company;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCompanyFromSlug
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Si pas d'utilisateur connecté, continuer
        if (!$user) {
            return $next($request);
        }

        // Récupérer le slug de la société depuis l'URL
        $companySlug = $request->route('company');

        
        
        if (!$companySlug) {
            // Si pas de slug dans l'URL, rediriger vers la société actuelle ou la première
            $currentCompany = $user->currentCompany ?? $user->companies()->first();
            
            if (!$currentCompany) {
                return redirect()->route('onboarding.company.create');
            }
            
            // Construire la nouvelle URL avec le slug
            $newUrl = '/' . $currentCompany->slug . $request->getPathInfo();
            return redirect($newUrl);
        }

        // Trouver la société par slug et vérifier que l'utilisateur y a accès
        $company = Company::where('slug', $companySlug)
            ->whereHas('users', fn($q) => $q->where('users.id', $user->id))
            ->first();

        if (!$company) {
            abort(403, 'Vous n\'avez pas accès à cette société.');
        }

        // Mettre à jour la société actuelle de l'utilisateur si nécessaire
        if ($user->current_company_id !== $company->id) {
            $user->forceFill(['current_company_id' => $company->id])->save();
        }
        
        // Keep the in-memory relation in sync for this request.
        $user->setRelation('currentCompany', $company);

        // S'assurer que l'utilisateur a une agence active
        if (!$user->current_branch_id) {
            $firstBranch = $user->branches()
                ->whereHas('company', fn($q) => $q->where('companies.id', $company->id))
                ->first();

            if ($firstBranch) {
                $user->forceFill(['current_branch_id' => $firstBranch->id])->save();
            }
        }

        return $next($request);
    }
}
