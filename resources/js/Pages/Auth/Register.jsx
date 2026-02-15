import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

const fieldMotion = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            title="Créer un compte"
            subtitle="Ouvre ton espace SaaS et configure ta première société de livraison."
        >
            <Head title="Inscription" />

            <form onSubmit={submit} className="space-y-4">
                <motion.div variants={fieldMotion} initial="hidden" animate="visible" transition={{ delay: 0.08 }}>
                    <InputLabel htmlFor="name" value="Nom complet" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-400 focus:ring-emerald-400"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </motion.div>

                <motion.div variants={fieldMotion} initial="hidden" animate="visible" transition={{ delay: 0.14 }}>
                    <InputLabel htmlFor="email" value="Email professionnel" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-400 focus:ring-emerald-400"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </motion.div>

                <motion.div variants={fieldMotion} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-400 focus:ring-emerald-400"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </motion.div>

                <motion.div variants={fieldMotion} initial="hidden" animate="visible" transition={{ delay: 0.26 }}>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmer le mot de passe"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-400 focus:ring-emerald-400"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </motion.div>

                <motion.div
                    variants={fieldMotion}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.32 }}
                    className="flex items-center justify-between gap-4 pt-2"
                >
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        J’ai déjà un compte
                    </Link>

                    <PrimaryButton
                        className="rounded-lg bg-emerald-500 px-5 py-2.5 text-xs hover:bg-emerald-600 focus:bg-emerald-600 focus:ring-emerald-500 active:bg-emerald-700"
                        disabled={processing}
                    >
                        Créer mon compte
                    </PrimaryButton>
                </motion.div>
            </form>
        </GuestLayout>
    );
}
