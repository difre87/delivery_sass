import Checkbox from '@/Components/Checkbox';
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

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            title="Connexion"
            subtitle="Accède à ton espace entreprise pour gérer les opérations de livraison."
        >
            <Head title="Connexion" />

            {status && (
                <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <motion.div variants={fieldMotion} initial="hidden" animate="visible" transition={{ delay: 0.08 }}>
                    <InputLabel htmlFor="email" value="Email professionnel" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-400 focus:ring-emerald-400"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </motion.div>

                <motion.div variants={fieldMotion} initial="hidden" animate="visible" transition={{ delay: 0.14 }}>
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-400 focus:ring-emerald-400"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </motion.div>

                <motion.div variants={fieldMotion} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-slate-600">
                            Se souvenir de moi
                        </span>
                    </label>
                </motion.div>

                <motion.div
                    variants={fieldMotion}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.26 }}
                    className="flex items-center justify-between gap-4 pt-2"
                >
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            Mot de passe oublié ?
                        </Link>
                    )}

                    <PrimaryButton
                        className="rounded-lg bg-emerald-500 px-5 py-2.5 text-xs hover:bg-emerald-600 focus:bg-emerald-600 focus:ring-emerald-500 active:bg-emerald-700"
                        disabled={processing}
                    >
                        Se connecter
                    </PrimaryButton>
                </motion.div>

                <motion.p
                    variants={fieldMotion}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.32 }}
                    className="pt-2 text-center text-sm text-slate-600"
                >
                    Pas encore de compte ?{' '}
                    <Link
                        href={route('register')}
                        className="font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        Créer un espace
                    </Link>
                </motion.p>
            </form>
        </GuestLayout>
    );
}
