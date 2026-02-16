import { Link, usePage } from '@inertiajs/react';
import { Icons } from './Icons';
import { motion } from 'framer-motion';

export default function TrialBanner() {
    const { auth } = usePage().props;
    const { currentCompany, currentSubscription } = auth;

    // Si l'utilisateur a un abonnement actif, ne pas afficher la bannière
    if (currentSubscription && currentSubscription.status === 'active') {
        return null;
    }

    // Si la société n'a pas de trial_ends_at, ne pas afficher la bannière
    if (!currentCompany?.trial_ends_at) {
        return null;
    }

    const trialEndsAt = new Date(currentCompany.trial_ends_at);
    const now = new Date();
    const daysLeft = Math.ceil((trialEndsAt - now) / (1000 * 60 * 60 * 24));

    // Si l'essai est terminé, ne pas afficher (un middleware devrait gérer ça)
    if (daysLeft < 0) {
        return null;
    }

    const getBannerColor = () => {
        if (daysLeft <= 3) return 'from-rose-500 to-pink-600';
        if (daysLeft <= 7) return 'from-amber-500 to-orange-600';
        return 'from-emerald-500 to-teal-600';
    };

    const getIcon = () => {
        if (daysLeft <= 3) return Icons.AlertCircle;
        if (daysLeft <= 7) return Icons.Clock;
        return Icons.Sparkles;
    };

    const Icon = getIcon();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${getBannerColor()} p-6 text-white shadow-xl`}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white blur-2xl" />
            </div>

            <div className="relative flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">
                            {daysLeft <= 3 ? '⚠️ Période d\'essai bientôt terminée' : 
                             daysLeft <= 7 ? '⏰ Période d\'essai en cours' : 
                             '🎉 Période d\'essai gratuite'}
                        </h3>
                        <p className="mt-1 text-sm text-white/90">
                            {daysLeft > 0 ? (
                                <>
                                    Il vous reste <span className="font-bold">{daysLeft} jour{daysLeft > 1 ? 's' : ''}</span> d'essai gratuit.
                                    {!currentSubscription && ' Choisissez un plan pour continuer après l\'essai.'}
                                </>
                            ) : (
                                <>Votre période d'essai se termine aujourd'hui.</>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={route('plans.index')}
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-white/90 hover:shadow-xl"
                    >
                        <Icons.TrendUp className="h-4 w-4" />
                        Choisir un plan
                    </Link>
                </div>
            </div>

            {/* Progress bar */}
            <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, Math.min(100, (daysLeft / 14) * 100))}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-white shadow-lg"
                />
            </div>
        </motion.div>
    );
}
