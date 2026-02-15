import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function CompanyOnboarding() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('onboarding.company.store'));
    };

    return (
        <>
            <Head title="Créer ma société" />

            <div className="relative min-h-screen overflow-hidden bg-slate-950">
                <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.12),transparent_35%)]"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">
                            Setup SaaS
                        </p>
                        <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                            Configure ta société et active ton espace opérationnel
                        </h1>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
                            Cette étape initialise ton tenant: livraisons, flotte, bordereaux, utilisateurs et abonnement seront isolés dans cette société.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-200">
                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                                Données isolées
                            </span>
                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                                Setup en 1 minute
                            </span>
                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                                Prêt pour l’exploitation
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="w-full rounded-2xl border border-white/15 bg-white p-7 shadow-2xl shadow-slate-950/30"
                    >
                        <h2 className="text-xl font-semibold text-slate-900">Créer ma société</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Tu pourras ensuite ajouter clients, chauffeurs et véhicules.
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nom de la société" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-400 focus:ring-emerald-400"
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ex: Delivery Pro Services"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <PrimaryButton
                                disabled={processing}
                                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-xs hover:bg-emerald-600 focus:bg-emerald-600 focus:ring-emerald-500 active:bg-emerald-700"
                            >
                                {processing ? 'Création...' : 'Créer la société'}
                            </PrimaryButton>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
