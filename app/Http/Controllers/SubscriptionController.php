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

        // Convertir les prix selon la devise de la société
        $companyCurrency = $company?->currency ?? 'EUR';
        $plans = $plans->map(function ($plan) use ($companyCurrency) {
            $plan->price_cents = $this->convertCurrency($plan->price_cents, 'EUR', $companyCurrency);
            return $plan;
        });

        // Convertir aussi le prix du plan actuel si présent
        $currentPlan = $currentSubscription?->plan;
        if ($currentPlan) {
            $currentPlan->price_cents = $this->convertCurrency($currentPlan->price_cents, 'EUR', $companyCurrency);
        }

        return Inertia::render('Plans/Index', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
            'currentPlan' => $currentPlan,
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

    /**
     * Convertir un montant en centimes d'une devise vers une autre
     * Taux de change approximatifs (en production, utiliser une API de taux de change)
     */
    private function convertCurrency(int $amountCents, string $fromCurrency, string $toCurrency): int
    {
        if ($fromCurrency === $toCurrency) {
            return $amountCents;
        }

        // Taux de conversion depuis EUR (base)
        $rates = [
            'EUR' => 1.0,
            'USD' => 1.10,      // 1 EUR = 1.10 USD
            'GBP' => 0.86,      // 1 EUR = 0.86 GBP
            'MAD' => 11.00,     // 1 EUR = 11 MAD
            'CHF' => 0.95,      // 1 EUR = 0.95 CHF
            'CAD' => 1.45,      // 1 EUR = 1.45 CAD
            'XOF' => 656.0,     // 1 EUR = 656 XOF (Franc CFA)
        ];

        $convertedAmount = 0;

        // Conversion: EUR -> devise cible
        if ($fromCurrency === 'EUR' && isset($rates[$toCurrency])) {
            $convertedAmount = (int) round($amountCents * $rates[$toCurrency]);
        }
        // Conversion: devise source -> EUR -> devise cible
        elseif (isset($rates[$fromCurrency]) && isset($rates[$toCurrency])) {
            $inEur = $amountCents / $rates[$fromCurrency];
            $convertedAmount = (int) round($inEur * $rates[$toCurrency]);
        }
        // Si devise non supportée, retourner le montant original
        else {
            return $amountCents;
        }

        // Arrondir le Franc CFA aux 100 FCFA les plus proches pour des prix plus propres
        if ($toCurrency === 'XOF') {
            // Arrondir aux 10000 centimes (100 FCFA) les plus proches
            $convertedAmount = (int) (round($convertedAmount / 10000) * 10000);
        }

        return $convertedAmount;
    }
}

