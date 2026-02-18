import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Icons } from '@/Components/Icons';
import { motion } from 'framer-motion';

export default function AdminDashboard({ stats, recent_companies, recent_users }) {
    const formatCurrency = (cents) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(cents / 100) + ' €';
    };

    const statCards = [
        {
            title: 'Utilisateurs',
            value: stats.total_users,
            icon: Icons.Users,
            color: 'from-blue-500 to-blue-600',
            href: route('admin.users'),
        },
        {
            title: 'Sociétés',
            value: stats.total_companies,
            icon: Icons.Building,
            color: 'from-emerald-500 to-emerald-600',
            href: route('admin.companies'),
        },
        {
            title: 'Abonnements Actifs',
            value: stats.active_subscriptions,
            icon: Icons.Currency,
            color: 'from-amber-500 to-amber-600',
            href: route('admin.plans'),
        },
        {
            title: 'Revenu Total',
            value: formatCurrency(stats.total_revenue),
            icon: Icons.BarChart,
            color: 'from-purple-500 to-purple-600',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">🔐 Super Admin Dashboard</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Gestion globale de la plateforme
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Super Admin Dashboard" />

            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        const content = (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all hover:shadow-xl"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                                {stat.title}
                                            </p>
                                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 shadow-lg`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );

                        return stat.href ? (
                            <Link key={index} href={stat.href}>
                                {content}
                            </Link>
                        ) : (
                            <div key={index}>{content}</div>
                        );
                    })}
                </div>

                {/* Recent Companies & Users */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Companies */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Sociétés Récentes</h3>
                            <Link
                                href={route('admin.companies')}
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Voir tout →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recent_companies.map((company) => (
                                <div
                                    key={company.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-900">{company.name}</p>
                                        <p className="text-xs text-slate-500">{company.owner?.email}</p>
                                    </div>
                                    <div className="text-right">
                                        {company.current_subscription && (
                                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                                                {company.current_subscription.plan?.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Users */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Utilisateurs Récents</h3>
                            <Link
                                href={route('admin.users')}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Voir tout →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recent_users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                                >
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 font-bold text-white shadow-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                    </div>
                                    {user.is_super_admin && (
                                        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
                                            Super Admin
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
