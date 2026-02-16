import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import MiniChart from '@/Components/MiniChart';
import TrialBanner from '@/Components/TrialBanner';
import { Icons } from '@/Components/Icons';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useCurrency } from '@/hooks/useCurrency';

const statusLabel = (value) => String(value ?? '').replaceAll('_', ' ');

const formatDateTime = (value) => {
    if (!value) return 'Date non définie';
    return new Date(value).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
};

export default function Dashboard({ stats, kpis, recentShipments, recentFuelLogs }) {
    const { currentCompany, currentSubscription } = usePage().props.auth;
    const { formatCents } = useCurrency();
    
    const grossMargin = (kpis.revenue_month_cents ?? 0) - (kpis.cost_month_cents ?? 0);
    const marginRate = (kpis.revenue_month_cents ?? 0) > 0
        ? Math.round((grossMargin / kpis.revenue_month_cents) * 100)
        : 0;

    const topCards = [
        { 
            label: 'Clients actifs', 
            value: stats.clients, 
            icon: Icons.Clients,
            color: 'cyan',
            trend: 'up',
            trendValue: '+12%'
        },
        { 
            label: 'Livraisons ouvertes', 
            value: stats.shipments_open, 
            icon: Icons.Shipments,
            color: 'amber',
            trend: 'up',
            trendValue: '+8%'
        },
        { 
            label: 'Tournées du jour', 
            value: stats.routes_today, 
            icon: Icons.Routes,
            color: 'indigo',
        },
        { 
            label: 'Véhicules actifs', 
            value: stats.vehicles_active, 
            icon: Icons.Fleet,
            color: 'emerald',
        },
    ];

    const quickLinks = [
        { label: 'Nouveau client', href: route('clients.index') },
        { label: 'Nouvelle livraison', href: route('shipments.index') },
        { label: 'Planifier tournée', href: route('routes.index') },
        { label: 'Ajouter livreur', href: route('drivers.index') },
    ];

    // Données simulées pour le graphique (à remplacer par de vraies données)
    const weeklyData = [45, 52, 48, 61, 58, 69, 73];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 shadow-lg">
                        <Icons.Dashboard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-slate-900">
                            {currentCompany ? `Pilotage - ${currentCompany.name}` : 'Pilotage'}
                        </h2>
                        <p className="text-sm text-slate-600">
                            Vue opérationnelle quotidienne de ton activité livraison
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Trial Banner */}
                <TrialBanner />

                {/* Hero Section - Carte de bienvenue */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 p-8 text-white shadow-2xl"
                >
                    {/* Patterns d'arrière-plan */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-teal-300 blur-3xl" />
                    </div>

                    <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr]">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                <Icons.ChartBar className="h-4 w-4" />
                                Centre de contrôle
                            </div>
                            <h3 className="mt-4 text-4xl font-bold leading-tight">
                                Ton exploitation,<br />sans angle mort.
                            </h3>
                            <p className="mt-3 max-w-2xl text-base text-emerald-50">
                                Surveille les performances, les coûts carburant et le niveau d'activité 
                                de la flotte en un coup d'œil. Prends des décisions éclairées.
                            </p>
                            
                            <div className="mt-6 flex flex-wrap gap-3">
                                {quickLinks.map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className="group inline-flex items-center gap-2 rounded-xl bg-white/95 px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-lg transition hover:bg-white hover:shadow-xl hover:scale-105"
                                        >
                                            <Icons.Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Carte de rentabilité */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-xl"
                        >
                            <div className="flex items-center gap-2">
                                <Icons.Currency className="h-5 w-5 text-emerald-50" />
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-50">
                                    Rentabilité mensuelle
                                </p>
                            </div>
                            <p className="mt-4 text-4xl font-bold">{formatCents(grossMargin)}</p>
                            <p className="mt-2 text-sm text-emerald-100">
                                {marginRate}% de marge brute sur le CA livré
                            </p>
                            
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-emerald-100">Progression</span>
                                    <span className="font-bold">{marginRate}%</span>
                                </div>
                                <div className="relative h-3 overflow-hidden rounded-full bg-white/20">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(Math.max(marginRate, 0), 100)}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-3 rounded-full bg-gradient-to-r from-white to-emerald-200 shadow-lg"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <MiniChart data={weeklyData} color="emerald" />
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Cartes statistiques principales */}
                <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {topCards.map((card, index) => (
                        <StatCard
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            trend={card.trend}
                            trendValue={card.trendValue}
                            delay={index * 0.1}
                        />
                    ))}
                </section>

                {/* Section Performance et Abonnement */}
                <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <Icons.ChartBar className="h-5 w-5 text-emerald-600" />
                            <h3 className="text-base font-bold text-slate-900">Performance mensuelle</h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Livrées</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{kpis.delivered_month}</p>
                                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                                    <Icons.TrendUp className="h-3 w-3" />
                                    <span>+15% vs mois dernier</span>
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Carburant</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{formatCents(kpis.fuel_cost_month_cents)}</p>
                                <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                                    <Icons.TrendUp className="h-3 w-3" />
                                    <span>Budget surveillé</span>
                                </div>
                            </div>
                            <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm transition hover:shadow-md">
                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Marge brute</p>
                                <p className="mt-2 text-3xl font-bold text-emerald-800">{formatCents(grossMargin)}</p>
                                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                                    <Icons.Check className="h-3 w-3" />
                                    <span>Objectif atteint</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <Icons.Settings className="h-5 w-5 text-indigo-600" />
                            <h3 className="text-base font-bold text-slate-900">Abonnement</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-xl border border-indigo-200 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Plan actif</p>
                                <p className="mt-1 text-lg font-bold text-slate-900">{currentSubscription?.plan_name ?? 'Aucun plan'}</p>
                            </div>
                            <div className="rounded-xl border border-indigo-200 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Statut</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-lg font-bold text-slate-900">{statusLabel(currentSubscription?.status || 'inactif')}</p>
                                </div>
                            </div>
                            <div className="rounded-xl bg-indigo-100 p-3">
                                <div className="flex gap-2">
                                    <Icons.Alert className="h-4 w-4 flex-shrink-0 text-indigo-600 mt-0.5" />
                                    <p className="text-xs text-indigo-800 leading-relaxed">
                                        <strong>Conseil :</strong> Maintiens la flotte et les tournées à jour pour obtenir des KPI fiables.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Section Activité récente */}
                <section className="grid gap-6 xl:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Icons.Shipments className="h-5 w-5 text-amber-600" />
                                <h3 className="text-base font-bold text-slate-900">Dernières livraisons</h3>
                            </div>
                            <Link
                                href={route('shipments.index')}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Voir tout →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentShipments.length === 0 ? (
                                <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
                                    <Icons.Shipments className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-500">Aucune livraison pour le moment</p>
                                </div>
                            ) : (
                                recentShipments.map((shipment, index) => (
                                    <motion.div
                                        key={shipment.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.05 }}
                                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 p-2">
                                                <Icons.Location className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {shipment.reference || `EXP-${shipment.id}`}
                                                </p>
                                                <p className="text-xs text-slate-600">{shipment.recipient_name}</p>
                                                <p className="text-xs text-slate-500">
                                                    <Icons.Clock className="inline h-3 w-3 mr-1" />
                                                    {formatDateTime(shipment.scheduled_for || shipment.delivered_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase text-slate-700 shadow-sm">
                                            {statusLabel(shipment.status)}
                                        </span>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Icons.Fuel className="h-5 w-5 text-rose-600" />
                                <h3 className="text-base font-bold text-slate-900">Derniers pleins carburant</h3>
                            </div>
                            <Link
                                href={route('fuel.index')}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Voir tout →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentFuelLogs.length === 0 ? (
                                <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
                                    <Icons.Fuel className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-500">Aucun plein enregistré</p>
                                </div>
                            ) : (
                                recentFuelLogs.map((fuelLog, index) => (
                                    <motion.div
                                        key={fuelLog.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.05 }}
                                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-rose-300 hover:bg-rose-50/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-gradient-to-br from-rose-400 to-red-500 p-2">
                                                <Icons.Fuel className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {fuelLog.station_name || 'Station non renseignée'}
                                                </p>
                                                <p className="text-xs text-slate-600">{fuelLog.volume_liters} Litres</p>
                                                <p className="text-xs text-slate-500">
                                                    <Icons.Clock className="inline h-3 w-3 mr-1" />
                                                    {formatDateTime(fuelLog.filled_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">{formatCents(fuelLog.total_cents)}</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
