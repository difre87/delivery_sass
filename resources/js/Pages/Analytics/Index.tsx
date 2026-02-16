import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Icons } from '@/Components/Icons';
import { useState } from 'react';
import RevenueChart from '@/Components/Analytics/RevenueChart';
import DeliveriesChart from '@/Components/Analytics/DeliveriesChart';
import PerformanceMetrics from '@/Components/Analytics/PerformanceMetrics';
import TopClientsTable from '@/Components/Analytics/TopClientsTable';
import VehicleEfficiency from '@/Components/Analytics/VehicleEfficiency';
import DriverPerformance from '@/Components/Analytics/DriverPerformance';
import { useCurrency } from '@/hooks/useCurrency';

interface AnalyticsData {
    overview: {
        total_revenue: number;
        total_deliveries: number;
        avg_delivery_time: number;
        customer_satisfaction: number;
        on_time_percentage: number;
        fuel_efficiency: number;
    };
    revenue_trend: Array<{ date: string; amount: number }>;
    deliveries_trend: Array<{ date: string; count: number }>;
    top_clients: Array<{
        id: number;
        name: string;
        total_spent: number;
        deliveries_count: number;
        growth_rate: number;
    }>;
    vehicle_stats: Array<{
        id: number;
        registration: string;
        deliveries: number;
        distance_km: number;
        fuel_cost: number;
        efficiency_score: number;
    }>;
    driver_stats: Array<{
        id: number;
        name: string;
        deliveries: number;
        on_time_rate: number;
        avg_rating: number;
    }>;
}

export default function Analytics({ analytics }: { analytics: AnalyticsData }) {
    const page = usePage<any>();
    const { currentCompany } = page.props.auth;
    const { formatCents } = useCurrency();
    
    const [dateRange, setDateRange] = useState('30d');
    const [selectedMetric, setSelectedMetric] = useState('all');

    const dateRanges = [
        { value: '7d', label: '7 derniers jours' },
        { value: '30d', label: '30 derniers jours' },
        { value: '90d', label: '90 derniers jours' },
        { value: '1y', label: '1 an' },
        { value: 'custom', label: 'Personnalisé' },
    ];

    const metrics = [
        { value: 'all', label: 'Toutes les métriques' },
        { value: 'revenue', label: 'Revenus' },
        { value: 'deliveries', label: 'Livraisons' },
        { value: 'efficiency', label: 'Efficacité' },
    ];

    // KPIs Cards
    const kpiCards = [
        {
            title: 'Revenu total',
            value: formatCents(analytics.overview.total_revenue),
            change: '+12.5%',
            trend: 'up',
            icon: Icons.Currency,
            color: 'emerald',
        },
        {
            title: 'Livraisons',
            value: analytics.overview.total_deliveries.toLocaleString(),
            change: '+8.3%',
            trend: 'up',
            icon: Icons.Shipments,
            color: 'blue',
        },
        {
            title: 'Temps moyen',
            value: `${Math.round(analytics.overview.avg_delivery_time)}min`,
            change: '-5.2%',
            trend: 'up',
            icon: Icons.Clock,
            color: 'amber',
        },
        {
            title: 'À l\'heure',
            value: `${analytics.overview.on_time_percentage}%`,
            change: '+3.1%',
            trend: 'up',
            icon: Icons.CheckCircle,
            color: 'cyan',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-2.5 shadow-lg">
                            <Icons.BarChart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold leading-tight text-slate-900">
                                Analytics & Reporting
                            </h2>
                            <p className="text-sm text-slate-600">
                                Analyses détaillées de votre activité
                            </p>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600">
                        <Icons.Download className="h-4 w-4" />
                        Exporter
                    </button>
                </div>
            }
        >
            <Head title="Analytics & Reporting" />

            <div className="space-y-6">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Date Range */}
                        <div className="flex items-center gap-2">
                            <Icons.Calendar className="h-5 w-5 text-slate-400" />
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="rounded-lg border-slate-200 py-1.5 pl-3 pr-10 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                {dateRanges.map((range) => (
                                    <option key={range.value} value={range.value}>
                                        {range.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Metric Filter */}
                        <div className="flex items-center gap-2">
                            <Icons.Filter className="h-5 w-5 text-slate-400" />
                            <select
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                                className="rounded-lg border-slate-200 py-1.5 pl-3 pr-10 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                {metrics.map((metric) => (
                                    <option key={metric.value} value={metric.value}>
                                        {metric.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Refresh Button */}
                        <button className="ml-auto flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            <Icons.RefreshCw className="h-4 w-4" />
                            Actualiser
                        </button>
                    </div>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiCards.map((kpi, index) => (
                        <motion.div
                            key={kpi.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-${kpi.color}-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100`} />
                            
                            <div className="relative">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`rounded-xl bg-${kpi.color}-100 p-2.5`}>
                                        <kpi.icon className={`h-5 w-5 text-${kpi.color}-600`} />
                                    </div>
                                    <span className={`flex items-center gap-1 text-sm font-semibold ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {kpi.trend === 'up' ? '↑' : '↓'} {kpi.change}
                                    </span>
                                </div>
                                
                                <h3 className="text-sm font-medium text-slate-600">
                                    {kpi.title}
                                </h3>
                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {kpi.value}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <RevenueChart data={analytics.revenue_trend} />
                    <DeliveriesChart data={analytics.deliveries_trend} />
                </div>

                {/* Performance Metrics */}
                <PerformanceMetrics metrics={analytics.overview} />

                {/* Charts Row 2 */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <VehicleEfficiency
                        vehicles={analytics.vehicle_stats.map(vehicle => ({
                            ...vehicle,
                            plate_number: vehicle.registration
                        }))}
                    />
                    <DriverPerformance drivers={analytics.driver_stats} />
                </div>

                {/* Top Clients Table */}
                <TopClientsTable clients={analytics.top_clients} />
            </div>
        </AuthenticatedLayout>
    );
}
