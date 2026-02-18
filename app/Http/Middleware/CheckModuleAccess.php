<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModuleAccess
{
    /**
     * Mapping des routes vers les modules
     */
    protected array $routeModuleMap = [
        'dashboard' => 'dashboard',
        'shipments.*' => 'shipments',
        'packages.*' => 'packages',
        'clients.*' => 'clients',
        'drivers.*' => 'drivers',
        'vehicles.*' => 'vehicles',
        'dispatch.*' => 'dispatch',
        'waybills.*' => 'waybills',
        'invoices.*' => 'invoices',
        'fuel.*' => 'fuel',
        'tracking.*' => 'tracking',
        'reports.*' => 'reports',
        'settings.*' => 'settings',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ?string $module = null): Response
    {
        $user = $request->user();

        // Si pas d'utilisateur, laisser passer (géré par auth)
        if (!$user) {
            return $next($request);
        }

        // Déterminer le module
        if (!$module) {
            $module = $this->getModuleFromRoute($request);
        }

        // Si pas de module trouvé, laisser passer
        if (!$module) {
            return $next($request);
        }

        // Vérifier l'accès
        if (!$user->hasAccessToModule($module)) {
            abort(403, "Vous n'avez pas accès au module: " . ($user::AVAILABLE_MODULES[$module] ?? $module));
        }

        return $next($request);
    }

    /**
     * Détermine le module depuis la route
     */
    protected function getModuleFromRoute(Request $request): ?string
    {
        $routeName = $request->route()?->getName();

        if (!$routeName) {
            return null;
        }

        foreach ($this->routeModuleMap as $pattern => $module) {
            if (fnmatch($pattern, $routeName)) {
                return $module;
            }
        }

        return null;
    }
}
