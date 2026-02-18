<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $subscription = $user?->currentCompany?->currentSubscription();

        // Charger les agences de l'utilisateur avec l'agence courante
        $userBranches = $user && $user->current_company_id
            ? $user->branches()
                ->where('branches.company_id', $user->current_company_id)
                ->select('branches.id', 'branches.name', 'branches.is_active')
                ->get()
            : collect();

        $currentBranch = $user && $user->current_branch_id
            ? $user->currentBranch?->only(['id', 'name'])
            : null;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'currentCompany' => $user?->currentCompany?->only(['id', 'name', 'slug', 'trial_ends_at', 'currency']),
                'currentBranch' => $currentBranch,
                'userBranches' => $userBranches,
                'currentSubscription' => $subscription
                    ? [
                        ...$subscription->only([
                            'id',
                            'status',
                            'trial_ends_at',
                            'renews_at',
                            'ends_at',
                            'plan_id',
                        ]),
                        'plan_name' => $subscription->plan?->name,
                      ]
                    : null,
            ],
            'permissions' => $user && $user->current_company_id ? [
                'canAccessSettings' => Gate::allows('access-settings'),
                'canManageUsers' => Gate::allows('manage-users'),
                'canManageBranches' => Gate::allows('manage-branches'),
                'canManageCompanySettings' => Gate::allows('manage-company-settings'),
                'canManageDrivers' => Gate::allows('manage-drivers'),
                'canManageFleet' => Gate::allows('manage-fleet'),
                'canManageRoutes' => Gate::allows('manage-routes'),
                'canManageClients' => Gate::allows('manage-clients'),
                'canViewShipments' => Gate::allows('view-shipments'),
                'canManageShipments' => Gate::allows('manage-shipments'),
                'canAccessAnalytics' => Gate::allows('access-analytics'),
                'isSuperAdmin' => $user?->is_super_admin ?? false,
                'allowedModules' => $user->allowed_modules ?? array_keys(\App\Models\User::AVAILABLE_MODULES),
            ] : [
                'isSuperAdmin' => $user?->is_super_admin ?? false,
                'allowedModules' => [],
            ],
            'flash' => [
                'status' => $request->session()->get('status'),
            ],
        ];
    }
}
