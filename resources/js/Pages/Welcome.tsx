import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
    navItems,
    features,
    stats,
    testimonials,
    integrations,
    proofLogos,
    proofStats,
    faqs,
    fadeInUp,
    formatPrice,
} from '../types/data';

export default function Welcome({ auth, plans = [], flash }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const currentSubscription = auth.currentSubscription;
    const hasCompany = Boolean(auth.currentCompany);

    return (
        <>
            <Head title="Delivery SaaS" />

            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
                {/* Background decoration */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -top-[40%] left-[10%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute right-[15%] top-[20%] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />
                    <div className="absolute bottom-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
                </div>

                <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/5">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/25">
                                <svg className="h-6 w-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-300">Delivery SaaS</p>
                                <h1 className="mt-0.5 text-sm font-semibold text-white sm:text-base">
                                    Plateforme de gestion
                                </h1>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setMenuOpen((value) => !value)}
                            className="inline-flex rounded-md border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 md:hidden"
                        >
                            Menu
                        </button>

                        <div className="hidden items-center gap-6 md:flex">
                            <nav className="flex items-center gap-4 text-sm text-slate-300">
                                {navItems.map((item) => (
                                    <a key={item.href} href={item.href} className="transition hover:text-white">
                                        {item.label}
                                    </a>
                                ))}
                            </nav>

                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-400/20"
                                    >
                                        Accéder au dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                                        >
                                            Démarrer
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="border-t border-white/10 md:hidden"
                            >
                                <div className="space-y-2 px-6 py-3">
                                    {navItems.map((item) => (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="block rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                                        >
                                            {item.label}
                                        </a>
                                    ))}

                                    <div className="mt-2 flex flex-col gap-2">
                                        {auth.user ? (
                                            <Link
                                                href={route('dashboard')}
                                                onClick={() => setMenuOpen(false)}
                                                className="rounded-md border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200"
                                            >
                                                Accéder au dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    href={route('login')}
                                                    onClick={() => setMenuOpen(false)}
                                                    className="rounded-md px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                                                >
                                                    Connexion
                                                </Link>
                                                <Link
                                                    href={route('register')}
                                                    onClick={() => setMenuOpen(false)}
                                                    className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950"
                                                >
                                                    Démarrer
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                <div className="mx-auto max-w-7xl px-6 pb-8 pt-24 lg:px-8">
                    <main className="space-y-20">
                        {flash?.status && (
                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100"
                            >
                                {flash.status}
                            </motion.div>
                        )}

                        <section className="grid h-screen items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-xl">
                                <p className="inline-flex rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                                    SaaS multi-tenant pour transporteurs, coursiers et 3PL
                                </p>
                                <h2 className="mt-5 bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-5xl font-bold leading-tight text-transparent sm:text-7xl">
                                    Augmente ta marge livraison
                                </h2>
                                <p className="mt-6 text-lg leading-relaxed text-slate-300">
                                    Centralise exploitation, bordereaux, flotte, kilométrage et carburant pour{' '}
                                    <span className="font-semibold text-emerald-300">réduire les coûts</span>,{' '}
                                    <span className="font-semibold text-cyan-300">améliorer la ponctualité</span> et{' '}
                                    <span className="font-semibold text-blue-300">professionnaliser ton service</span>.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-2.5 text-xs">
                                    <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 font-medium text-slate-100 backdrop-blur">
                                        <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Setup rapide
                                    </span>
                                    <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 font-medium text-slate-100 backdrop-blur">
                                        <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Données isolées
                                    </span>
                                    <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 font-medium text-slate-100 backdrop-blur">
                                        <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Rentabilité en temps réel
                                    </span>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                                        >
                                            Continuer
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                            href={route('register')}
                                            className="rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                                        >
                                            Démarrer l'essai
                                        </Link>
                                            <Link
                                                href={route('login')}
                                                className="rounded-md border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
                                            >
                                                Se connecter
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 shadow-2xl shadow-emerald-900/20"
                                >
                                    <div className="pointer-events-none absolute -right-12 -top-10 h-36 w-36 rounded-full bg-emerald-400/20 blur-2xl" />
                                    <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />

                                    <div className="relative">
                                        <p className="text-sm font-medium text-emerald-200">Cockpit opérationnel</p>

                                        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 p-4">
                                            <div className="flex items-center justify-between text-xs text-slate-400">
                                                <span>Vue opérationnelle live</span>
                                                <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-emerald-200">
                                                    +12 livraisons / h
                                                </span>
                                            </div>

                                            <svg viewBox="0 0 520 280" className="mt-3 h-52 w-full">
                                                <defs>
                                                    <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                                                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
                                                    </linearGradient>
                                                    <linearGradient id="warehouseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                        <stop offset="0%" stopColor="#e2e8f0" />
                                                        <stop offset="100%" stopColor="#94a3b8" />
                                                    </linearGradient>
                                                </defs>

                                                <polygon points="60,185 210,110 360,185 210,260" fill="#0f172a" stroke="#334155" />
                                                <path
                                                    d="M110 185 C 165 145, 250 155, 300 130 C 332 114, 365 112, 404 124"
                                                    fill="none"
                                                    stroke="url(#roadGradient)"
                                                    strokeWidth="11"
                                                    strokeLinecap="round"
                                                />
                                                <circle cx="140" cy="171" r="9" fill="#34d399" />
                                                <circle cx="268" cy="151" r="9" fill="#22d3ee" />
                                                <circle cx="385" cy="128" r="9" fill="#34d399" />

                                                <polygon points="314,88 390,52 463,90 387,126" fill="#1e293b" stroke="#475569" />
                                                <polygon points="314,88 314,150 387,188 387,126" fill="#334155" stroke="#64748b" />
                                                <polygon points="387,126 463,90 463,154 387,188" fill="url(#warehouseGradient)" stroke="#64748b" />
                                                <rect x="404" y="116" width="16" height="32" fill="#0f172a" />
                                                <rect x="332" y="108" width="38" height="24" rx="3" fill="#22d3ee" fillOpacity="0.45" />

                                                <g transform="translate(218 146)">
                                                    <rect x="0" y="0" width="58" height="28" rx="6" fill="#f8fafc" />
                                                    <rect x="38" y="7" width="12" height="10" rx="2" fill="#0f172a" />
                                                    <circle cx="12" cy="28" r="6" fill="#0f172a" />
                                                    <circle cx="45" cy="28" r="6" fill="#0f172a" />
                                                </g>
                                                <polygon points="229,139 247,131 265,139 247,147" fill="#10b981" />

                                                <g fill="#f8fafc">
                                                    <path d="M126 158l6-16 6 16h-4v10h-4v-10z" />
                                                    <path d="M254 138l6-16 6 16h-4v10h-4v-10z" />
                                                    <path d="M372 116l6-16 6 16h-4v10h-4v-10z" />
                                                </g>
                                            </svg>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            {stats.map((item) => (
                                                <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
                                                    <p className="text-[11px] uppercase tracking-wide text-slate-400">{item.label}</p>
                                                    <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                                                </div>
                                            ))}
                                            <div className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 p-3">
                                                <p className="text-[11px] uppercase tracking-wide text-emerald-200">Marge</p>
                                                <p className="mt-1 text-sm font-semibold text-white">+18% ce mois</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
                                            Illustration produit: bordereaux, tournées et coûts consolidés sur une seule vue.
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </section>

                        <section>
                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                className="rounded-2xl border border-white/10 bg-white/5 p-6"
                            >
                                <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                                    Déjà utilisé par des équipes de livraison
                                </p>
                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                    {proofLogos.map((logo, index) => (
                                        <motion.div
                                            key={logo}
                                            variants={fadeInUp}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ delay: 0.06 * index }}
                                            className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-3 text-center text-sm font-semibold text-slate-200"
                                        >
                                            {logo}
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                    {proofStats.map((item, index) => (
                                        <motion.div
                                            key={item.label}
                                            variants={fadeInUp}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ delay: 0.08 * index }}
                                            className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 p-4"
                                        >
                                            <p className="text-xl font-semibold text-white">{item.value}</p>
                                            <p className="mt-1 text-xs uppercase tracking-wide text-emerald-200">
                                                {item.label}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        <section id="modules">
                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                className="flex items-end justify-between gap-4"
                            >
                                <h3 className="text-2xl font-semibold text-white">Modules inclus</h3>
                                <p className="text-sm text-slate-400">MVP prêt pour scaler en SaaS</p>
                            </motion.div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {features.map((feature, index) => (
                                    <motion.article
                                        key={feature.title}
                                        variants={fadeInUp}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ delay: 0.08 * index }}
                                        className="rounded-xl border border-white/10 bg-white/5 p-5"
                                    >
                                        <h4 className="text-base font-semibold text-white">{feature.title}</h4>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{feature.description}</p>
                                    </motion.article>
                                ))}
                            </div>
                        </section>

                        <section id="pricing">
                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                className="flex items-end justify-between gap-4"
                            >
                                <h3 className="text-2xl font-semibold text-white">Plans SaaS</h3>
                                <p className="text-sm text-slate-400">Facturation mensuelle</p>
                            </motion.div>

                            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                                {plans.map((plan, index) => (
                                    <motion.article
                                        key={plan.id}
                                        variants={fadeInUp}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ delay: 0.1 * index }}
                                        className={`rounded-xl border p-6 ${
                                            plan.slug === 'pro'
                                                ? 'border-emerald-300/40 bg-emerald-300/10'
                                                : 'border-white/10 bg-white/5'
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-white">{plan.name}</p>
                                        <p className="mt-2 text-sm text-slate-300">{plan.features?.[0] || 'Plan SaaS'}</p>
                                        <p className="mt-4 text-3xl font-semibold text-white">
                                            {formatPrice(plan)}
                                            {plan.price_cents > 0 && (
                                                <span className="text-sm font-normal text-slate-400"> / mois</span>
                                            )}
                                        </p>
                                        <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                                            {plan.max_drivers
                                                ? `${plan.max_drivers} chauffeurs max`
                                                : 'Chauffeurs illimités'}
                                            {' - '}
                                            {plan.max_vehicles
                                                ? `${plan.max_vehicles} véhicules max`
                                                : 'Véhicules illimités'}
                                        </p>
                                        {plan.trial_days > 0 && (
                                            <p className="mt-2 text-xs text-emerald-200">{plan.trial_days} jours d'essai</p>
                                        )}
                                        <ul className="mt-4 space-y-2 text-sm text-slate-200">
                                            {(plan.features || []).map((item) => (
                                                <li key={item}>• {item}</li>
                                            ))}
                                        </ul>
                                        <div className="mt-5">
                                            {!auth.user ? (
                                                <Link
                                                    href={route('register')}
                                                    className="inline-flex rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                                                >
                                                    Commencer
                                                </Link>
                                            ) : currentSubscription?.plan_id === plan.id ? (
                                                <span className="inline-flex rounded-md border border-emerald-300/35 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-100">
                                                    Plan actuel
                                                </span>
                                            ) : hasCompany ? (
                                                <Link
                                                    as="button"
                                                    method="post"
                                                    href={route('subscriptions.store')}
                                                    data={{ plan_id: plan.id }}
                                                    className="inline-flex rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                                                >
                                                    Choisir ce plan
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={route('onboarding.company.create')}
                                                    className="inline-flex rounded-md border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
                                                >
                                                    Créer ma société
                                                </Link>
                                            )}
                                        </div>
                                    </motion.article>
                                ))}
                            </div>

                            {auth.user && currentSubscription && hasCompany && (
                                <motion.div
                                    variants={fadeInUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    className="mt-5"
                                >
                                    <Link
                                        as="button"
                                        method="delete"
                                        href={route('subscriptions.destroy')}
                                        className="inline-flex rounded-md border border-rose-300/30 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/10"
                                    >
                                        Résilier l'abonnement actuel
                                    </Link>
                                </motion.div>
                            )}
                        </section>

                        <section>
                            <motion.h3
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                className="text-2xl font-semibold text-white"
                            >
                                Témoignages clients
                            </motion.h3>
                            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                                {testimonials.map((item, index) => (
                                    <motion.article
                                        key={item.author}
                                        variants={fadeInUp}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ delay: 0.08 * index }}
                                        className="rounded-xl border border-white/10 bg-white/5 p-5"
                                    >
                                        <p className="text-sm leading-relaxed text-slate-200">"{item.quote}"</p>
                                        <p className="mt-4 text-sm font-semibold text-white">{item.author}</p>
                                        <p className="text-xs text-slate-400">{item.role}</p>
                                    </motion.article>
                                ))}
                            </div>
                        </section>

                        <section className="grid gap-8 lg:grid-cols-2">
                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <h3 id="integrations" className="text-2xl font-semibold text-white">Intégrations</h3>
                                <p className="mt-2 text-sm text-slate-300">
                                    Branche ta stack existante et synchronise tes flux sans ressaisie.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {integrations.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <h3 id="faq" className="text-2xl font-semibold text-white">FAQ</h3>
                                <div className="mt-4 space-y-3">
                                    {faqs.map((item, index) => (
                                        <motion.article
                                            key={item.q}
                                            variants={fadeInUp}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ delay: 0.07 * index }}
                                            className="rounded-lg border border-white/10 bg-white/5 p-4"
                                        >
                                            <p className="text-sm font-semibold text-white">{item.q}</p>
                                            <p className="mt-2 text-sm text-slate-300">{item.a}</p>
                                        </motion.article>
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        <motion.section
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-8 text-center"
                        >
                            <h3 className="text-2xl font-semibold text-white">Prêt à lancer ton SaaS de livraison ?</h3>
                            <p className="mx-auto mt-3 max-w-2xl text-sm text-emerald-100">
                                Crée ton espace, configure ta société et commence à piloter tes tournées, bordereaux et coûts dès aujourd'hui.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                                    >
                                        Ouvrir le dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                                        >
                                            Démarrer maintenant
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md border border-emerald-300/35 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/10"
                                        >
                                            Accéder à mon compte
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.section>
                    </main>

                    <motion.footer
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="mt-16 border-t border-white/10 py-8"
                    >
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-white">Delivery SaaS</p>
                                <p className="mt-1 text-xs text-slate-400">
                                    Plateforme de gestion des livraisons pour entreprises de transport.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                                <a href="#modules" className="transition hover:text-white">
                                    Modules
                                </a>
                                <a href="#pricing" className="transition hover:text-white">
                                    Tarifs
                                </a>
                                <a href="#faq" className="transition hover:text-white">
                                    FAQ
                                </a>
                                <a href="#integrations" className="transition hover:text-white">
                                    Intégrations
                                </a>
                                <Link href={route('login')} className="transition hover:text-white">
                                    Connexion
                                </Link>
                            </div>
                        </div>
                    </motion.footer>
                </div>
            </div>
        </>
    );
}
