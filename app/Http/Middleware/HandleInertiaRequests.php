<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
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
                ->select('branches.id', 'branches.name')
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
            'flash' => [
                'status' => $request->session()->get('status'),
            ],
        ];
    }
}
