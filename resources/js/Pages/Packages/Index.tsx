import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Icons } from '@/Components/Icons';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Toast from '@/Components/Toast';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';

const typeLabels = {
    standard: 'Standard',
    fragile: 'Fragile',
    perishable: 'Périssable',
    document: 'Document',
};

const typeColors = {
    standard: 'blue' as const,
    fragile: 'yellow' as const,
    perishable: 'red' as const,
    document: 'gray' as const,
};

const statusLabels = {
    pending: 'En attente',
    in_transit: 'En transit',
    delivered: 'Livré',
    returned: 'Retourné',
    lost: 'Perdu',
};

const statusColors = {
    pending: 'gray' as const,
    in_transit: 'blue' as const,
    delivered: 'green' as const,
    returned: 'yellow' as const,
    lost: 'red' as const,
};

export default function Index({ packages, filters }) {
    const { auth, flash, errors } = usePage<any>().props;
    const currentCompany = auth.currentCompany;
    const [deletingPackage, setDeletingPackage] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const deletePackage = (pkg) => {
        setDeletingPackage(pkg);
    };

    const confirmDelete = () => {
        if (deletingPackage) {
            router.delete(route('packages.destroy', { company: currentCompany.slug, packageId: deletingPackage.id }));
            setDeletingPackage(null);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('packages.index', { company: currentCompany.slug }), { search: searchQuery }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        router.get(route('packages.index', { company: currentCompany.slug }), {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-slate-800">
                        Gestion des Colis
                    </h2>
                    <Link href={route('packages.create', { company: currentCompany.slug })}>
                        <Button variant="primary" icon={Icons.Plus}>
                            Nouveau Colis
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Colis" />

            {/* Flash Messages */}
            <AnimatePresence>
                {flash?.status && (
                    <Toast 
                        message={flash.status} 
                        type="success"
                        onClose={() => router.reload({ only: [] })}
                    />
                )}
            </AnimatePresence>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Rechercher par n° de suivi, référence, description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                            <Button type="submit" variant="primary" icon={Icons.Search}>
                                Rechercher
                            </Button>
                            {(filters.search) && (
                                <Button type="button" variant="outline" onClick={clearFilters}>
                                    Réinitialiser
                                </Button>
                            )}
                        </form>
                    </div>

                    {/* Packages List */}
                    <div className="overflow-hidden rounded-xl bg-white shadow">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            N° de Suivi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Expédition
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Poids
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Dimensions
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {packages.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-500">
                                                <Icons.Shipments className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                                                <p className="font-medium">Aucun colis trouvé</p>
                                                <p className="mt-1">
                                                    {filters.search
                                                        ? 'Essayez de modifier vos critères de recherche'
                                                        : 'Commencez par créer votre premier colis'}
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        packages.data.map((pkg) => (
                                            <tr key={pkg.id} className="hover:bg-slate-50">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center">
                                                        <Icons.Shipments className="mr-2 h-5 w-5 text-slate-400" />
                                                        <div>
                                                            <div className="font-medium text-slate-900">
                                                                {pkg.tracking_number}
                                                            </div>
                                                            {pkg.reference && (
                                                                <div className="text-xs text-slate-500">
                                                                    Réf: {pkg.reference}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {pkg.shipment ? (
                                                        <div className="text-sm">
                                                            <div className="font-medium text-slate-900">
                                                                {pkg.shipment.reference || `EXP-${pkg.shipment.id}`}
                                                            </div>
                                                            <div className="text-slate-500">
                                                                {pkg.shipment.recipient_name}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs truncate text-sm text-slate-900">
                                                        {pkg.description || '-'}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <Badge variant={typeColors[pkg.type]}>
                                                        {typeLabels[pkg.type]}
                                                    </Badge>
                                                    {pkg.is_fragile && (
                                                        <Badge variant="yellow" className="ml-1">
                                                            Fragile
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                    {pkg.weight_kg ? `${pkg.weight_kg} kg` : '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                    {pkg.length_cm && pkg.width_cm && pkg.height_cm
                                                        ? `${pkg.length_cm} × ${pkg.width_cm} × ${pkg.height_cm} cm`
                                                        : '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <Badge variant={statusColors[pkg.status]}>
                                                        {statusLabels[pkg.status]}
                                                    </Badge>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={route('packages.edit', { company: currentCompany.slug, packageId: pkg.id })}
                                                            className="text-emerald-600 hover:text-emerald-900"
                                                        >
                                                            <Icons.Edit className="h-5 w-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => deletePackage(pkg)}
                                                            className="text-rose-600 hover:text-rose-900"
                                                        >
                                                            <Icons.Trash className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {packages.data.length > 0 && (
                            <div className="border-t border-slate-200 bg-white px-6 py-4">
                                <Pagination links={packages.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={!!deletingPackage}
                title="Supprimer le colis"
                message={deletingPackage ? `Êtes-vous sûr de vouloir supprimer le colis "${deletingPackage.tracking_number}" ? Cette action est irréversible.` : ''}
                confirmText="Supprimer"
                onConfirm={confirmDelete}
                onCancel={() => setDeletingPackage(null)}
            />
        </AuthenticatedLayout>
    );
}
