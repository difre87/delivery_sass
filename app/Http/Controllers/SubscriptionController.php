<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->currentCompany;
        $currentSubscription = $company?->currentSubscription();
        
        $plans = Plan::active()
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Plans/Index', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
            'currentPlan' => $currentSubscription?->plan,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plan_id' => ['required', 'integer', 'exists:plans,id'],
        ]);

        /** @var Plan $plan */
        $plan = Plan::active()->findOrFail($validated['plan_id']);
        $company = $request->user()->currentCompany;

        if (! $company) {
            return redirect()
                ->route('onboarding.company.create')
                ->with('status', 'Créez d’abord votre société pour choisir un abonnement.');
        }

        $current = $company->currentSubscription();

        if ($current && $current->plan_id === $plan->id) {
            return back()->with('status', 'Ce plan est déjà actif.');
        }

        DB::transaction(function () use ($company, $plan): void {
            $now = Carbon::now();

            Subscription::query()
                ->where('company_id', $company->id)
                ->current()
                ->update([
                    'status' => 'canceled',
                    'canceled_at' => $now,
                    'ends_at' => $now,
                ]);

            $trialEndsAt = $plan->trial_days > 0 ? $now->copy()->addDays($plan->trial_days) : null;

            Subscription::create([
                'company_id' => $company->id,
                'plan_id' => $plan->id,
                'status' => $trialEndsAt ? 'trialing' : 'active',
                'starts_at' => $now,
                'trial_ends_at' => $trialEndsAt,
                'renews_at' => $trialEndsAt ?? $this->nextRenewalDate($now, $plan->interval),
                'meta' => [
                    'source' => 'self_service',
                ],
            ]);
        });

        return back()->with('status', 'Abonnement mis à jour avec succès.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $company = $request->user()->currentCompany;

        if (! $company) {
            return redirect()->route('onboarding.company.create');
        }

        $current = $company->currentSubscription();

        if (! $current) {
            return back()->with('status', 'Aucun abonnement actif à résilier.');
        }

        $now = Carbon::now();

        $current->update([
            'status' => 'canceled',
            'canceled_at' => $now,
            'ends_at' => $now,
        ]);

        return back()->with('status', 'Abonnement résilié.');
    }

    private function nextRenewalDate(Carbon $from, string $interval): ?Carbon
    {
        return match ($interval) {
            'month' => $from->copy()->addMonth(),
            'year' => $from->copy()->addYear(),
            default => null,
        };
    }
}
