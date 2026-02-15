import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FormInput from '@/Components/FormInput';
import Button from '@/Components/Button';
import Alert from '@/Components/Alert';
import { Icons } from '@/Components/Icons';

export default function CompanySettings({ company, flash }) {
    const [logoPreview, setLogoPreview] = useState(
        company.logo ? `/storage/${company.logo}` : null
    );

    const tabs = [
        { name: 'Entreprise', href: route('settings.company'), current: true },
        { name: 'Agences', href: route('settings.branches'), current: false },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: company.name || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        city: company.city || '',
        postal_code: company.postal_code || '',
        country: company.country || '',
        tax_id: company.tax_id || '',
        registration_number: company.registration_number || '',
        website: company.website || '',
        currency: company.currency || 'EUR',
        logo: null,
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('settings.company.update'), {
            forceFormData: true,
            preserveScroll: true,
            transform: (data) => {
                // Remove email from the data before sending
                const { email, ...dataToSend } = data;
                return dataToSend;
            },
            onSuccess: () => {
                // Reload to get updated company data including in shared props
                router.reload({ only: ['company'] });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Paramètres de l'entreprise
                    </h2>
                </div>
            }
        >
            <Head title="Paramètres de l'entreprise" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Tabs Navigation */}
                    <div className="mb-6">
                        <nav className="flex space-x-4 border-b border-slate-200">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`
                                        px-4 py-2 text-sm font-medium border-b-2 transition-colors
                                        ${tab.current
                                            ? 'border-emerald-500 text-emerald-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                        }
                                    `}
                                >
                                    {tab.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {flash?.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <Alert
                                type="success"
                                message={flash.success}
                                dismissible
                            />
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Logo Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-6">
                                <div className="absolute inset-0 bg-grid-white/10"></div>
                                <div className="relative">
                                    <Icons.Building className="mb-2 h-8 w-8 text-white/90" />
                                    <h3 className="text-xl font-semibold text-white">
                                        Logo de l'entreprise
                                    </h3>
                                    <p className="mt-1 text-sm text-emerald-100">
                                        Téléchargez le logo de votre entreprise (max 2MB)
                                    </p>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center space-x-6">
                                    <div className="flex-shrink-0">
                                        {logoPreview ? (
                                            <div className="relative h-32 w-32 overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-md">
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="h-full w-full object-contain p-2"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                                                <Icons.Building className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                                            <Icons.Upload className="mr-2 h-4 w-4" />
                                            Choisir une image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="mt-2 text-xs text-gray-500">
                                            PNG, JPG ou SVG (max. 2MB)
                                        </p>
                                        {errors.logo && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.logo}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Company Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-6">
                                <div className="absolute inset-0 bg-grid-white/10"></div>
                                <div className="relative">
                                    <Icons.Info className="mb-2 h-8 w-8 text-white/90" />
                                    <h3 className="text-xl font-semibold text-white">
                                        Informations générales
                                    </h3>
                                    <p className="mt-1 text-sm text-emerald-100">
                                        Informations de base sur votre entreprise
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-6 p-6 md:grid-cols-2">
                                <FormInput
                                    label="Nom de l'entreprise"
                                    icon={Icons.Building}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    required
                                />
                                <FormInput
                                    label="Email"
                                    type="email"
                                    icon={Icons.Mail}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                    required
                                    disabled
                                    helperText="L'email est celui de votre compte utilisateur"
                                />
                                <FormInput
                                    label="Téléphone"
                                    icon={Icons.Phone}
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    error={errors.phone}
                                    placeholder="+33 1 23 45 67 89"
                                />
                                <FormInput
                                    label="Site web"
                                    icon={Icons.Globe}
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    error={errors.website}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </motion.div>

                        {/* Preferences */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-6">
                                <div className="absolute inset-0 bg-grid-white/10"></div>
                                <div className="relative">
                                    <Icons.Settings className="mb-2 h-8 w-8 text-white/90" />
                                    <h3 className="text-xl font-semibold text-white">
                                        Préférences
                                    </h3>
                                    <p className="mt-1 text-sm text-violet-100">
                                        Paramètres régionaux et préférences d'affichage
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-6 p-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Devise
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Icons.Currency className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <select
                                            value={data.currency}
                                            onChange={(e) => setData('currency', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        >
                                            <option value="EUR">Euro (€) - EUR</option>
                                            <option value="USD">Dollar américain ($) - USD</option>
                                            <option value="GBP">Livre sterling (£) - GBP</option>
                                            <option value="MAD">Dirham marocain (DH) - MAD</option>
                                            <option value="CHF">Franc suisse (CHF) - CHF</option>
                                            <option value="CAD">Dollar canadien ($) - CAD</option>
                                            <option value="XOF">Franc CFA (FCFA) - XOF</option>
                                        </select>
                                    </div>
                                    {errors.currency && (
                                        <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
                                    )}
                                    <p className="mt-2 text-xs text-slate-500">
                                        La devise utilisée pour l'affichage des montants
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Address Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-6">
                                <div className="absolute inset-0 bg-grid-white/10"></div>
                                <div className="relative">
                                    <Icons.MapPin className="mb-2 h-8 w-8 text-white/90" />
                                    <h3 className="text-xl font-semibold text-white">
                                        Adresse
                                    </h3>
                                    <p className="mt-1 text-sm text-teal-100">
                                        Adresse physique de votre entreprise
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-6 p-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <FormInput
                                        label="Adresse"
                                        icon={Icons.MapPin}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        error={errors.address}
                                        placeholder="123 Rue de la Livraison"
                                    />
                                </div>
                                <FormInput
                                    label="Ville"
                                    icon={Icons.Building}
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    error={errors.city}
                                    placeholder="Paris"
                                />
                                <FormInput
                                    label="Code postal"
                                    icon={Icons.MapPin}
                                    value={data.postal_code}
                                    onChange={(e) => setData('postal_code', e.target.value)}
                                    error={errors.postal_code}
                                    placeholder="75001"
                                />
                                <div className="md:col-span-2">
                                    <FormInput
                                        label="Pays"
                                        icon={Icons.Globe}
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        error={errors.country}
                                        placeholder="France"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Legal Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-6">
                                <div className="absolute inset-0 bg-grid-white/10"></div>
                                <div className="relative">
                                    <Icons.FileText className="mb-2 h-8 w-8 text-white/90" />
                                    <h3 className="text-xl font-semibold text-white">
                                        Informations légales
                                    </h3>
                                    <p className="mt-1 text-sm text-cyan-100">
                                        Numéros d'identification et documents officiels
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-6 p-6 md:grid-cols-2">
                                <FormInput
                                    label="Numéro TVA"
                                    icon={Icons.FileText}
                                    value={data.tax_id}
                                    onChange={(e) => setData('tax_id', e.target.value)}
                                    error={errors.tax_id}
                                    placeholder="FR12345678901"
                                />
                                <FormInput
                                    label="Numéro SIRET"
                                    icon={Icons.FileText}
                                    value={data.registration_number}
                                    onChange={(e) =>
                                        setData('registration_number', e.target.value)
                                    }
                                    error={errors.registration_number}
                                    placeholder="123 456 789 00010"
                                />
                            </div>
                        </motion.div>

                        {/* Delivery Settings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
                                <div className="absolute inset-0 bg-grid-white/10"></div>
                                <div className="relative">
                                    <Icons.Truck className="mb-2 h-8 w-8 text-white/90" />
                                    <h3 className="text-xl font-semibold text-white">
                                        Paramètres de livraison
                                    </h3>
                                    <p className="mt-1 text-sm text-blue-100">
                                        Configuration spécifique à votre activité de livraison
                                    </p>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/50 p-6">
                                    <div className="flex items-start">
                                        <Icons.Info className="mr-3 h-6 w-6 flex-shrink-0 text-blue-600" />
                                        <div>
                                            <h4 className="font-semibold text-blue-900">
                                                Configuration avancée
                                            </h4>
                                            <p className="mt-1 text-sm text-blue-700">
                                                Les paramètres de livraison avancés (zones de
                                                livraison, modèles de tarification, horaires
                                                d'ouverture, types de véhicules autorisés,
                                                restrictions de poids et volume) sont gérés dans
                                                les sections dédiées :
                                            </p>
                                            <ul className="mt-3 space-y-2 text-sm text-blue-700">
                                                <li className="flex items-center">
                                                    <Icons.MapPin className="mr-2 h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">Routes</span>
                                                    <span className="mx-2">→</span>
                                                    Zones de livraison et itinéraires
                                                </li>
                                                <li className="flex items-center">
                                                    <Icons.Truck className="mr-2 h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">Flotte</span>
                                                    <span className="mx-2">→</span>
                                                    Types de véhicules et capacités
                                                </li>
                                                <li className="flex items-center">
                                                    <Icons.Users className="mr-2 h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">Clients</span>
                                                    <span className="mx-2">→</span>
                                                    Tarification et conditions spéciales
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex justify-end"
                        >
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                icon={Icons.Save}
                                disabled={processing}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 shadow-lg transition-all hover:shadow-xl"
                            >
                                {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </Button>
                        </motion.div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
