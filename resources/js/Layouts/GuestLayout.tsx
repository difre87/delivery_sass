import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';

const panelMotion: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: 'easeInOut' },
    },
};

export default function GuestLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950">
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.17),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.15),transparent_35%)]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-2">
                <motion.div
                    variants={panelMotion}
                    initial="hidden"
                    animate="visible"
                    className="hidden px-10 py-12 lg:flex lg:flex-col lg:justify-between"
                >
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10 fill-current text-emerald-300" />
                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                                Fleetigo
                            </span>
                        </Link>

                        <h2 className="mt-8 max-w-md text-4xl font-semibold leading-tight text-white">
                            Pilote tes livraisons comme une vraie tour de controle.
                        </h2>
                        <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300">
                            Bordereaux, tournées, carburant, KPI et facturation dans un seul espace SaaS multi-tenant.
                        </p>
                    </div>

                    <div className="grid max-w-md grid-cols-2 gap-3">
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-400">Suivi</p>
                            <p className="mt-2 text-sm font-semibold text-white">Livraisons en temps réel</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-400">Coûts</p>
                            <p className="mt-2 text-sm font-semibold text-white">Km et carburant maîtrisés</p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center justify-center px-6 py-10">
                    <motion.div
                        variants={panelMotion}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                        className="w-full max-w-md rounded-2xl border border-white/15 bg-white px-7 py-8 shadow-2xl shadow-slate-950/30"
                    >
                        <motion.div variants={panelMotion} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="mb-7">
                            <Link href="/" className="inline-flex items-center gap-2 text-slate-700 lg:hidden">
                                <ApplicationLogo className="h-8 w-8 fill-current text-emerald-600" />
                                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                                    Fleetigo
                                </span>
                            </Link>
                            <h1 className="mt-4 text-2xl font-semibold text-slate-900">{title}</h1>
                            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
                        </motion.div>
                        <motion.div variants={panelMotion} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                            {children}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
