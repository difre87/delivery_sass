import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { DeliveryTruckIllustration } from '@/Components/Illustrations';

interface Plan {
    id: number;
    name: string;
    slug: string;
    price_cents: number;
    currency: string;
    interval: string;
    trial_days: number;
    max_drivers: number | null;
    max_vehicles: number | null;
    features: string[];
}

interface WelcomeProps {
    auth: {
        user: any;
    };
    canLogin?: boolean;
    canRegister?: boolean;
    plans: Plan[];
}

export default function Welcome({ auth, plans = [] }: WelcomeProps) {
    // Formater le prix en euros
    const formatPrice = (cents: number) => {
        return (cents / 100).toFixed(0);
    };

    // Déterminer le plan populaire (celui du milieu généralement)
    const popularPlanIndex = Math.floor(plans.length / 2);

    return (
        <>
            <Head title="Delivery SaaS" />

            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                {/* Background decoration */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -top-[40%] left-[10%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute right-[15%] top-[20%] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />
                    <div className="absolute bottom-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
                </div>

                {/* Header */}
                <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400">
                                <svg className="h-6 w-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">Delivery SaaS</span>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a 
                                href="#features" 
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
                            >
                                Fonctionnalités
                            </a>
                            <a 
                                href="#pricing" 
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
                            >
                                Tarifs
                            </a>
                            <a 
                                href="#testimonials" 
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
                            >
                                Témoignages
                            </a>
                        </nav>

                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                                    >
                                        Inscription
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="mx-auto max-w-7xl px-6 pt-32 pb-20">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center min-h-[80vh]">
                        {/* Left Column - Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                </span>
                                <span className="text-sm font-medium text-emerald-200">Solution complète de livraison</span>
                            </div>

                            <h1 className="text-5xl font-bold leading-tight text-white lg:text-7xl">
                                Optimisez vos
                                <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    livraisons
                                </span>
                                en temps réel
                            </h1>
                            
                            <p className="mt-6 text-xl leading-relaxed text-slate-300">
                                Plateforme SaaS complète pour gérer votre flotte, optimiser vos tournées 
                                et maximiser votre rentabilité. Suivi en temps réel, analytics avancés et 
                                gestion multi-sociétés.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Sans engagement</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Setup en 5 minutes</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Support 7j/7</span>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
                                    >
                                        <span>Accéder au dashboard</span>
                                        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
                                        >
                                            <span>Démarrer gratuitement</span>
                                            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-700 bg-slate-800/50 px-8 py-4 text-lg font-semibold text-slate-200 backdrop-blur transition-all hover:border-slate-600 hover:bg-slate-800"
                                        >
                                            <span>Se connecter</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Right Column - Illustration */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative">
                                {/* Glow effects */}
                                <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 blur-3xl"></div>
                                
                                {/* Main card */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 p-8 shadow-2xl backdrop-blur"
                                >
                                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
                                    <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

                                    <div className="relative">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-emerald-200">Livraison en cours</p>
                                                <p className="text-xs text-slate-400">Suivi temps réel</p>
                                            </div>
                                            <div className="rounded-full bg-emerald-400/15 px-3 py-1">
                                                <span className="text-xs font-semibold text-emerald-200">En route</span>
                                            </div>
                                        </div>

                                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur">
                                            <DeliveryTruckIllustration />
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-3">
                                            <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                                                <p className="text-xs uppercase tracking-wide text-slate-400">Distance</p>
                                                <p className="mt-1 text-lg font-bold text-white">24.5 km</p>
                                            </div>
                                            <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                                                <p className="text-xs uppercase tracking-wide text-slate-400">ETA</p>
                                                <p className="mt-1 text-lg font-bold text-white">18 min</p>
                                            </div>
                                            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 backdrop-blur">
                                                <p className="text-xs uppercase tracking-wide text-emerald-200">Statut</p>
                                                <p className="mt-1 text-lg font-bold text-emerald-200">✓ OK</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </main>

                {/* Section Fonctionnalités */}
                <section id="features" className="mx-auto max-w-7xl px-6 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white lg:text-5xl">
                            Fonctionnalités complètes
                        </h2>
                        <p className="mt-4 text-xl text-slate-400">
                            Tout ce dont vous avez besoin pour gérer vos livraisons efficacement
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                ),
                                title: "Gestion des tournées",
                                description: "Planifiez et optimisez vos tournées de livraison avec un système intelligent de routage.",
                                color: "emerald"
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                ),
                                title: "Suivi temps réel",
                                description: "Suivez vos véhicules et livraisons en temps réel avec notifications instantanées.",
                                color: "cyan"
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                ),
                                title: "Analytics avancés",
                                description: "Tableaux de bord détaillés avec KPIs, rapports personnalisés et prévisions.",
                                color: "blue"
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ),
                                title: "Gestion financière",
                                description: "Facturation automatique, suivi des coûts et analyse de rentabilité par client.",
                                color: "amber"
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                ),
                                title: "Multi-utilisateurs",
                                description: "Gestion des rôles et permissions pour votre équipe avec accès sécurisé.",
                                color: "purple"
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                ),
                                title: "Application mobile",
                                description: "App native pour chauffeurs avec scan de colis et preuve de livraison photo.",
                                color: "pink"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${feature.color}-500/10`}>
                                    <svg className={`h-6 w-6 text-${feature.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {feature.icon}
                                    </svg>
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                                <p className="mt-2 text-slate-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Section Tarifs */}
                <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white lg:text-5xl">
                            Tarifs simples et transparents
                        </h2>
                        <p className="mt-4 text-xl text-slate-400">
                            Choisissez le plan adapté à la taille de votre flotte
                        </p>
                    </motion.div>

                    {plans.length > 0 ? (
                        <div className="grid gap-8 lg:grid-cols-3">
                            {plans.map((plan, index) => {
                                const isPopular = index === popularPlanIndex;
                                
                                return (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.15 }}
                                        className={`relative rounded-3xl border p-8 ${
                                            isPopular
                                                ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 shadow-2xl shadow-emerald-500/25'
                                                : 'border-white/10 bg-white/5'
                                        }`}
                                    >
                                        {isPopular && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                <span className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-1 text-sm font-semibold text-white">
                                                    Populaire
                                                </span>
                                            </div>
                                        )}
                                        
                                        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                                        <p className="mt-2 text-slate-400">
                                            {plan.max_vehicles 
                                                ? `Jusqu'à ${plan.max_vehicles} véhicules` 
                                                : 'Véhicules illimités'}
                                        </p>
                                        
                                        <div className="mt-6">
                                            <span className="text-5xl font-bold text-white">{formatPrice(plan.price_cents)}€</span>
                                            <span className="text-slate-400">/{plan.interval === 'month' ? 'mois' : 'an'}</span>
                                        </div>

                                        {plan.trial_days > 0 && (
                                            <p className="mt-2 text-sm text-emerald-400">
                                                {plan.trial_days} jours d'essai gratuit
                                            </p>
                                        )}

                                        <ul className="mt-8 space-y-4">
                                            {plan.features && plan.features.map((feature, fIndex) => (
                                                <li key={fIndex} className="flex items-start gap-3">
                                                    <svg className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-slate-300">{feature}</span>
                                                </li>
                                            ))}
                                            {plan.max_drivers && (
                                                <li className="flex items-start gap-3">
                                                    <svg className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-slate-300">Jusqu'à {plan.max_drivers} chauffeurs</span>
                                                </li>
                                            )}
                                            {plan.max_vehicles && (
                                                <li className="flex items-start gap-3">
                                                    <svg className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-slate-300">Jusqu'à {plan.max_vehicles} véhicules</span>
                                                </li>
                                            )}
                                        </ul>

                                        <Link
                                            href={route('register')}
                                            className={`mt-8 block rounded-xl py-3 text-center font-semibold transition-all ${
                                                isPopular
                                                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/50'
                                                    : 'border border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-800'
                                            }`}
                                        >
                                            Commencer
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-400">Aucun plan disponible pour le moment.</p>
                        </div>
                    )}
                </section>

                {/* Section Témoignages */}
                <section id="testimonials" className="mx-auto max-w-7xl px-6 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white lg:text-5xl">
                            Ils nous font confiance
                        </h2>
                        <p className="mt-4 text-xl text-slate-400">
                            Découvrez comment nos clients optimisent leurs livraisons
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                quote: "Nous avons réduit nos coûts de carburant de 23% en seulement 2 mois grâce à l'optimisation des tournées.",
                                author: "Sarah Dubois",
                                role: "Directrice Opérations",
                                company: "TransExpress",
                                avatar: "SD"
                            },
                            {
                                quote: "Le suivi en temps réel a transformé notre relation client. Nos clients adorent savoir exactement où est leur colis.",
                                author: "Marc Laurent",
                                role: "CEO",
                                company: "FastColis",
                                avatar: "ML"
                            },
                            {
                                quote: "Interface intuitive, support réactif. Notre équipe a été opérationnelle en moins d'une journée.",
                                author: "Julie Martin",
                                role: "Responsable Logistique",
                                company: "UrbanDelivery",
                                avatar: "JM"
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                
                                <p className="text-lg text-slate-300 italic">"{testimonial.quote}"</p>
                                
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 font-bold text-slate-950">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{testimonial.author}</p>
                                        <p className="text-sm text-slate-400">{testimonial.role} • {testimonial.company}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 py-16">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid gap-12 md:grid-cols-4">
                            {/* Logo & Description */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400">
                                        <svg className="h-6 w-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold text-white">Delivery SaaS</span>
                                </div>
                                <p className="text-slate-400 mb-6 max-w-md">
                                    La solution complète de gestion de livraisons pour optimiser vos tournées, 
                                    suivre vos véhicules en temps réel et améliorer votre efficacité opérationnelle.
                                </p>
                            </div>

                            {/* Produit */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">Produit</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#features" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                            Fonctionnalités
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#pricing" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                            Tarifs
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#testimonials" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                            Témoignages
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Légal */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">Légal</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link 
                                            href={route('legal.terms')} 
                                            className="text-slate-400 hover:text-emerald-400 transition-colors"
                                        >
                                            CGU
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('legal.notice')} 
                                            className="text-slate-400 hover:text-emerald-400 transition-colors"
                                        >
                                            Mentions légales
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('legal.privacy')} 
                                            className="text-slate-400 hover:text-emerald-400 transition-colors"
                                        >
                                            Confidentialité
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-slate-400">
                            © 2026 Delivery SaaS. Tous droits réservés.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
