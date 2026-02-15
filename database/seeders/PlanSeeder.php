<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'price_cents' => 3900, // 39€/mois
                'currency' => 'EUR',
                'interval' => 'month',
                'trial_days' => 14,
                'max_drivers' => 5,
                'max_vehicles' => 20,
                'max_branches' => 1,
                'features' => [
                    'Gestion des clients',
                    'Gestion des envois (basique)',
                    'Gestion des chauffeurs',
                    'Gestion de la flotte',
                    'Support email',
                    'Tableau de bord',
                    'Max 5 utilisateurs',
                    'Max 100 envois/mois',
                    'Max 50 clients',
                    '1 agence',
                ],
                'sort_order' => 1,
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'price_cents' => 9900, // 99€/mois
                'currency' => 'EUR',
                'interval' => 'month',
                'trial_days' => 14,
                'max_drivers' => 20,
                'max_vehicles' => 50,
                'max_branches' => 3,
                'features' => [
                    'Tout Starter +',
                    'Gestion des envois (avancée)',
                    'Tournées automatiques',
                    'Bordereaux de livraison',
                    'Facturation clients',
                    'Gestion du carburant',
                    'Support prioritaire (email + chat)',
                    'Tableau de bord avancé',
                    'Rapports standards',
                    'Max 15 utilisateurs',
                    'Max 500 envois/mois',
                    'Max 200 clients',
                    'Jusqu\'à 3 agences',
                ],
                'sort_order' => 2,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'price_cents' => 29900, // 299€/mois
                'currency' => 'EUR',
                'interval' => 'month',
                'trial_days' => 30,
                'max_drivers' => null,
                'max_vehicles' => null,
                'max_branches' => null,
                'features' => [
                    '✨ TOUS les modules inclus',
                    'Utilisateurs illimités',
                    'Véhicules illimités',
                    'Chauffeurs illimités',
                    'Envois illimités',
                    'Clients illimités',
                    'Agences illimitées',
                    'Tournées optimisées (IA)',
                    'Suivi GPS temps réel',
                    'Rapports personnalisés',
                    'Analytics avancés',
                    'API complète',
                    'Multi-branches',
                    'Intégrations tierces',
                    'Support 24/7',
                    'Account manager dédié',
                ],
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }
    }
}
