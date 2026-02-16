import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Icons } from '@/Components/Icons';
import Button from '@/Components/Button';
import { useState } from 'react';
import { useCurrency } from '@/hooks/useCurrency';

export default function PlansIndex({ plans, currentSubscription, currentPlan }) {
    const { formatCents } = useCurrency();
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const { post, processing } = useForm();

    const handleSubscribe = (planId) => {
        if (confirm('Êtes-vous sûr de vouloir changer de plan ?')) {
            post(route('subscriptions.store'), {
                data: { plan_id: planId },
                onSuccess: () => {
                    setSelectedPlanId(null);
                }
            });
        }
    };

    const getPlanFeatures = (plan) => {
        try {
            return typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features || [];
        } catch {
            return [];
        }
    };

    const getIntervalLabel = (interval) => {
        return interval === 'month' ? '/mois' : interval === 'year' ? '/an' : '';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Plans & Tarifs" />

            <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 shadow-lg"
                    >
                        <Icons.Currency className="h-8 w-8 text-white" />
                        <div className="text-left">
                            <h1 className="text-2xl font-bold text-white">Plans & Tarifs</h1>
                            <p className="text-sm text-white/90">Choisissez le plan adapté à vos besoins</p>
                        </div>
                    </motion.div>
                </div>

                {/* Current Plan Info */}
                {currentPlan && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-emerald-600">Plan Actuel</p>
                                <h3 className="mt-1 text-2xl font-bold text-emerald-900">{currentPlan.name}</h3>
                                <p className="mt-1 text-sm text-emerald-700">
                                    {formatCents(currentPlan.price_cents)}{getIntervalLabel(currentPlan.interval)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
                                <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
                                <span className="text-sm font-semibold text-emerald-600">
                                    {currentSubscription.status === 'trialing' ? 'Période d\'essai' : 'Actif'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Plans Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan, index) => {
                        const features = getPlanFeatures(plan);
                        const isCurrentPlan = currentPlan?.id === plan.id;
                        const isPopular = plan.slug === 'professional' || plan.slug === 'pro';

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all hover:shadow-xl ${
                                    isCurrentPlan
                                        ? 'border-emerald-400 ring-4 ring-emerald-100'
                                        : isPopular
                                        ? 'border-amber-400 ring-4 ring-amber-100'
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                {/* Popular Badge */}
                                {isPopular && !isCurrentPlan && (
                                    <div className="absolute -right-10 top-6 rotate-45 bg-gradient-to-r from-amber-400 to-orange-500 px-12 py-1 text-center text-xs font-bold uppercase text-white shadow-lg">
                                        Populaire
                                    </div>
                                )}

                                {/* Current Badge */}
                                {isCurrentPlan && (
                                    <div className="absolute -right-10 top-6 rotate-45 bg-gradient-to-r from-emerald-500 to-teal-600 px-12 py-1 text-center text-xs font-bold uppercase text-white shadow-lg">
                                        Actuel
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Plan Header */}
                                    <div className={`mb-6 rounded-xl p-4 ${
                                        isCurrentPlan
                                            ? 'bg-gradient-to-br from-emerald-50 to-teal-50'
                                            : isPopular
                                            ? 'bg-gradient-to-br from-amber-50 to-orange-50'
                                            : 'bg-slate-50'
                                    }`}>
                                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                        <div className="mt-3 flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-slate-900">
                                                {formatCents(plan.price_cents).split(',')[0]}
                                            </span>
                                            <span className="text-lg text-slate-600">{getIntervalLabel(plan.interval)}</span>
                                        </div>
                                        {plan.trial_days > 0 && (
                                            <p className="mt-2 text-xs font-semibold text-emerald-600">
                                                🎁 {plan.trial_days} jours d'essai gratuit
                                            </p>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <ul className="mb-6 space-y-3">
                                        {features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                                                    isCurrentPlan
                                                        ? 'bg-emerald-100'
                                                        : isPopular
                                                        ? 'bg-amber-100'
                                                        : 'bg-slate-100'
                                                }`}>
                                                    <Icons.Check className={`h-3 w-3 ${
                                                        isCurrentPlan
                                                            ? 'text-emerald-600'
                                                            : isPopular
                                                            ? 'text-amber-600'
                                                            : 'text-slate-600'
                                                    }`} />
                                                </div>
                                                <span className="text-sm text-slate-700">{feature}</span>
                                            </li>
                                        ))}
                                        
                                        {/* Limits */}
                                        {plan.max_drivers && (
                                            <li className="flex items-start gap-3">
                                                <Icons.Drivers className={`mt-0.5 h-5 w-5 ${
                                                    isCurrentPlan ? 'text-emerald-500' : 'text-slate-400'
                                                }`} />
                                                <span className="text-sm text-slate-700">
                                                    Jusqu'à <strong>{plan.max_drivers}</strong> livreurs
                                                </span>
                                            </li>
                                        )}
                                        {plan.max_vehicles && (
                                            <li className="flex items-start gap-3">
                                                <Icons.Fleet className={`mt-0.5 h-5 w-5 ${
                                                    isCurrentPlan ? 'text-emerald-500' : 'text-slate-400'
                                                }`} />
                                                <span className="text-sm text-slate-700">
                                                    Jusqu'à <strong>{plan.max_vehicles}</strong> véhicules
                                                </span>
                                            </li>
                                        )}
                                    </ul>

                                    {/* CTA Button */}
                                    <Button
                                        className="w-full"
                                        variant={isCurrentPlan ? 'outline' : isPopular ? 'primary' : 'secondary'}
                                        disabled={isCurrentPlan || processing}
                                        loading={processing && selectedPlanId === plan.id}
                                        onClick={() => {
                                            setSelectedPlanId(plan.id);
                                            handleSubscribe(plan.id);
                                        }}
                                    >
                                        {isCurrentPlan ? 'Plan Actuel' : 'Choisir ce plan'}
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
                >
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                <Icons.Alert className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900">Informations importantes</h4>
                            <ul className="mt-2 space-y-1 text-sm text-blue-700">
                                <li>• Vous pouvez changer de plan à tout moment</li>
                                <li>• Le changement prend effet immédiatement</li>
                                <li>• Aucun frais de résiliation</li>
                                <li>• Support client disponible 7j/7</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
