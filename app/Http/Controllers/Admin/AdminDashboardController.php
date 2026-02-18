<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'total_companies' => Company::count(),
            'active_subscriptions' => Subscription::whereIn('status', ['active', 'trialing'])->count(),
            'total_revenue' => Subscription::whereIn('status', ['active', 'trialing'])
                ->join('plans', 'subscriptions.plan_id', '=', 'plans.id')
                ->sum('plans.price_cents'),
        ];

        $recent_companies = Company::with(['owner', 'currentSubscription.plan'])
            ->latest()
            ->limit(10)
            ->get();

        $recent_users = User::latest()
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_companies' => $recent_companies,
            'recent_users' => $recent_users,
        ]);
    }

    public function companies(Request $request): Response
    {
        $query = Company::with(['owner', 'currentSubscription.plan', 'users']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $companies = $query->latest()->paginate(20);

        return Inertia::render('Admin/Companies', [
            'companies' => $companies,
        ]);
    }

    public function users(Request $request): Response
    {
        $query = User::with('companies');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(20);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function plans(): Response
    {
        $plans = Plan::withCount([
            'subscriptions as active_subscriptions_count' => function ($query) {
                $query->whereIn('status', ['active', 'trialing']);
            },
        ])->orderBy('sort_order')->get();

        return Inertia::render('Admin/Plans', [
            'plans' => $plans,
        ]);
    }
}
