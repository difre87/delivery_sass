import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import MiniChart from '@/Components/MiniChart';
import { Icons } from '@/Components/Icons';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

const formatCurrency = (cents) => {
    const amount = (cents ?? 0) / 100;

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(amount);
};

const statusLabel = (value) => String(value ?? '').replaceAll('_', ' ');

const formatDateTime = (value) => {
    if (!value) return 'Date non définie';
    return new Date(value).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
};

export default function Dashboard({ stats, kpis, recentShipments, recentFuelLogs }) {
    const { currentCompany, currentSubscription } = usePage().props.auth;
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
        { label: '+ Nouveau client', href: route('clients.index'), icon: Icons.Plus },
        { label: '+ Nouvelle livraison', href: route('shipments.index'), icon: Icons.Plus },
        { label: '+ Planifier une tournée', href: route('routes.index'), icon: Icons.Plus },
        { label: '+ Ajouter un livreur', href: route('drivers.index'), icon: Icons.Plus },
    ];

    // Données simulées pour le graphique (à remplacer par de vraies données)
    const weeklyData = [45, 52, 48, 61, 58, 69, 73];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                        {currentCompany ? `Pilotage - ${currentCompany.name}` : 'Pilotage'}
                    </h2>
                    <p className="text-sm text-slate-600">Vue opérationnelle quotidienne de ton activité livraison</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                <section className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white shadow-lg">
                    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                        <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100">Centre de contrôle</p>
                            <h3 className="mt-2 text-3xl font-semibold leading-tight">Ton exploitation, sans angle mort.</h3>
                            <p className="mt-2 max-w-2xl text-sm text-emerald-50">
                                Surveille les performances, les coûts carburant et le niveau d’activité de la flotte en un coup d’œil.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {quickLinks.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-white"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/25 bg-white/10 p-4 backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.16em] text-emerald-50">Rentabilité mensuelle</p>
                            <p className="mt-2 text-3xl font-semibold">{formatCurrency(grossMargin)}</p>
                            <p className="mt-1 text-xs text-emerald-100">
                                {marginRate}% de marge brute sur le chiffre d’affaires livré
                            </p>
                            <div className="mt-4 h-2.5 rounded-full bg-white/20">
                                <div
                                    className="h-2.5 rounded-full bg-white"
                                    style={{ width: `${Math.min(Math.max(marginRate, 0), 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {topCards.map((card) => (
                        <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${card.tone} ${card.color}`}>
                                {card.label}
                            </div>
                            <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Performance mensuelle</h3>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Livrées</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{kpis.delivered_month}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Carburant</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(kpis.fuel_cost_month_cents)}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-emerald-50 p-4">
                                <p className="text-xs uppercase tracking-wide text-emerald-700">Marge brute</p>
                                <p className="mt-2 text-2xl font-semibold text-emerald-800">{formatCurrency(grossMargin)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Abonnement</h3>
                        <div className="mt-4 space-y-3">
                            <div className="rounded-lg border border-slate-200 p-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Plan</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{currentSubscription?.plan_name ?? 'Aucun plan'}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 p-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Statut</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{statusLabel(currentSubscription?.status || 'inactif')}</p>
                            </div>
                            <p className="text-xs text-slate-500">
                                Conseil: maintiens la flotte et les tournées à jour pour obtenir des KPI fiables.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Dernières livraisons</h3>
                        <div className="mt-4 space-y-2">
                            {recentShipments.length === 0 ? (
                                <p className="text-sm text-slate-500">Aucune livraison pour le moment.</p>
                            ) : (
                                recentShipments.map((shipment) => (
                                    <div key={shipment.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{shipment.reference || `EXP-${shipment.id}`}</p>
                                            <p className="text-xs text-slate-500">{shipment.recipient_name}</p>
                                            <p className="text-xs text-slate-500">{formatDateTime(shipment.scheduled_for || shipment.delivered_at)}</p>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-700">
                                            {statusLabel(shipment.status)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Derniers pleins carburant</h3>
                        <div className="mt-4 space-y-2">
                            {recentFuelLogs.length === 0 ? (
                                <p className="text-sm text-slate-500">Aucun plein enregistré.</p>
                            ) : (
                                recentFuelLogs.map((fuelLog) => (
                                    <div key={fuelLog.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{fuelLog.station_name || 'Station non renseignée'}</p>
                                            <p className="text-xs text-slate-500">{fuelLog.volume_liters} L</p>
                                            <p className="text-xs text-slate-500">{formatDateTime(fuelLog.filled_at)}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-800">{formatCurrency(fuelLog.total_cents)}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
