import ApplicationLogo from '@/Components/ApplicationLogo';
import BranchSwitcher from '@/Components/BranchSwitcher';
import Dropdown from '@/Components/Dropdown';
import { Icons } from '@/Components/Icons';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { user, currentCompany } = usePage().props.auth;
    const navigation = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: Icons.Dashboard,
        },
        {
            name: 'Clients',
            href: route('clients.index'),
            active: route().current('clients.*'),
            icon: Icons.Clients,
        },
        {
            name: 'Livreurs',
            href: route('drivers.index'),
            active: route().current('drivers.*'),
            icon: Icons.Drivers,
        },
        {
            name: 'Livraisons',
            href: route('shipments.index'),
            active: route().current('shipments.*'),
            icon: Icons.Shipments,
        },
        {
            name: 'Tournées',
            href: route('routes.index'),
            active: route().current('routes.*'),
            icon: Icons.Routes,
        },
        {
            name: 'Flotte',
            href: route('fleet.index'),
            active: route().current('fleet.*'),
            icon: Icons.Fleet,
        },
        {
            name: 'Carburant',
            href: route('fuel.index'),
            active: route().current('fuel.*'),
            icon: Icons.Fuel,
        },
        {
            name: 'Factures',
            href: route('invoices.index'),
            active: route().current('invoices.*'),
            icon: Icons.FileText,
        },
        {
            name: 'Bordereaux',
            href: route('waybills.index'),
            active: route().current('waybills.*'),
            icon: Icons.Clipboard,
        },
        
        {
            name: 'Paramètres',
            href: route('settings.company'),
            active: route().current('settings.*'),
            icon: Icons.Settings,
        },
        {
            name: 'Profil',
            href: route('profile.edit'),
            active: route().current('profile.*'),
            icon: Icons.Profile,
        },
        {
            name: 'Upgrade Plan',
            href: route('plans.index'),
            active: route().current('plans.*'),
            icon: Icons.Currency,
            badge: 'Pro',
            highlight: true,
        },
    ];

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="admin-theme min-h-screen bg-slate-50">
            {/* Sidebar Desktop */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200/70 bg-white/95 backdrop-blur-xl lg:flex lg:flex-col">
                {/* Logo */}
                <div className="border-b border-slate-200/70 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-lg">
                            <ApplicationLogo className="h-7 w-7 fill-current text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                                Delivery SaaS
                            </p>
                            <p className="text-sm font-semibold text-slate-700">
                                Operations Cockpit
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {navigation.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                        item.highlight
                                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50'
                                            : item.active
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                                        item.active || item.highlight ? 'text-white' : 'text-slate-400'
                                    }`} />
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && (
                                        <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase backdrop-blur-sm">
                                            {item.badge}
                                        </span>
                                    )}
                                    {item.active && !item.highlight && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="ml-auto h-2 w-2 rounded-full bg-white"
                                        />
                                    )}
                                    {item.highlight && (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-white"
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Company Info */}
                <div className="border-t border-slate-200/70 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-4">
                    <div className="rounded-xl bg-white p-3 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Société active
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-900">
                            {currentCompany?.name ?? 'Non configurée'}
                        </p>
                        {currentCompany && (
                            <div className="mt-2 flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs text-emerald-600 font-medium">Active</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {showingNavigationDropdown && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
                            onClick={() => setShowingNavigationDropdown(false)}
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl lg:hidden"
                        >
                            <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3"
                                    onClick={() => setShowingNavigationDropdown(false)}
                                >
                                    <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-lg">
                                        <ApplicationLogo className="h-7 w-7 fill-current text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                                            Delivery SaaS
                                        </p>
                                        <p className="text-sm font-semibold text-slate-700">Navigation</p>
                                    </div>
                                </Link>
                            </div>
                            <nav className="space-y-1 px-3 py-4">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setShowingNavigationDropdown(false)}
                                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                                item.active
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top Bar */}
                <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowingNavigationDropdown((previous) => !previous)}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:shadow lg:hidden"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {currentCompany && (
                                <motion.span
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 shadow-sm sm:inline-flex"
                                >
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-bold text-emerald-700">
                                        {currentCompany.name}
                                    </span>
                                </motion.span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Branch Switcher */}
                            <BranchSwitcher />

                            {/* Notifications Button */}
                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                            </button>

                            {/* User Dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-xl">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                                        >
                                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="hidden sm:inline">{user.name}</span>
                                            <svg
                                                className="h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Page Header */}
                {header && (
                    <motion.header
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 pt-6 sm:px-6 lg:px-8"
                    >
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-6 py-5 shadow-sm">
                            {header}
                        </div>
                    </motion.header>
                )}

                {/* Main Content */}
                <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
