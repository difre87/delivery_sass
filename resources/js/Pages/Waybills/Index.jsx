import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import { Icons } from '@/Components/Icons';

export default function WaybillsIndex({ waybills, stats, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const statusOptions = [
        { value: '', label: 'Tous les statuts' },
        { value: 'draft', label: 'Brouillon' },
        { value: 'issued', label: 'Émis' },
        { value: 'in_progress', label: 'En cours' },
        { value: 'completed', label: 'Terminé' },
        { value: 'cancelled', label: 'Annulé' },
    ];

    const getStatusBadge = (status) => {
        const variants = {
            draft: 'default',
            issued: 'info',
            in_progress: 'warning',
            completed: 'success',
            cancelled: 'danger',
        };
        
        const labels = {
            draft: 'Brouillon',
            issued: 'Émis',
            in_progress: 'En cours',
            completed: 'Terminé',
            cancelled: 'Annulé',
        };

        return <Badge variant={variants[status]}>{labels[status]}</Badge>;
    };

    const handleSearch = () => {
        router.get(route('waybills.index'), 
            { search, status },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDelete = (waybill) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce bordereau ?')) {
            router.delete(route('waybills.destroy', waybill.id));
        }
    };

    const columns = [
        { 
            key: 'number', 
            label: 'Numéro', 
            render: (waybill) => (
                <Link
                    href={route('waybills.show', waybill.id)}
                    className="font-semibold text-purple-600 hover:text-purple-700"
                >
                    {waybill.number}
                </Link>
            )
        },
        { 
            key: 'driver', 
            label: 'Chauffeur',
            render: (waybill) => waybill.driver?.name || 'N/A'
        },
        { 
            key: 'vehicle', 
            label: 'Véhicule',
            render: (waybill) => waybill.vehicle 
                ? `${waybill.vehicle.registration_number}`
                : 'N/A'
        },
        { 
            key: 'date', 
            label: 'Date',
            render: (waybill) => waybill.date 
                ? new Date(waybill.date).toLocaleDateString('fr-FR')
                : 'N/A'
        },
        { 
            key: 'shipments', 
            label: 'Expéditions',
            render: (waybill) => (
                <span className="font-medium">
                    {waybill.completed_shipments} / {waybill.total_shipments}
                </span>
            )
        },
        { 
            key: 'progress', 
            label: 'Progression',
            render: (waybill) => {
                const percentage = waybill.total_shipments > 0 
                    ? Math.round((waybill.completed_shipments / waybill.total_shipments) * 100)
                    : 0;
                return (
                    <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-600">{percentage}%</span>
                    </div>
                );
            }
        },
        { 
            key: 'status', 
            label: 'Statut',
            render: (waybill) => getStatusBadge(waybill.status)
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (waybill) => (
                <div className="flex items-center space-x-2">
                    <Link
                        href={route('waybills.show', waybill.id)}
                        className="text-purple-600 hover:text-purple-700"
                    >
                        <Icons.Eye className="h-5 w-5" />
                    </Link>
                    <a
                        href={route('waybills.pdf', waybill.id)}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-700"
                    >
                        <Icons.Download className="h-5 w-5" />
                    </a>
                    <button
                        onClick={() => handleDelete(waybill)}
                        className="text-red-600 hover:text-red-700"
                    >
                        <Icons.Trash className="h-5 w-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Bordereaux de livraison
                    </h2>
                    <Link href={route('waybills.create')}>
                        <Button
                            variant="primary"
                            icon={Icons.Plus}
                            className="bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                            Nouveau bordereau
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Bordereaux" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-100">Total</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                                </div>
                                <Icons.Clipboard className="h-12 w-12 text-purple-200" />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-100">En cours</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.in_progress}</p>
                                </div>
                                <Icons.Clock className="h-12 w-12 text-amber-200" />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-100">Terminés</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.completed}</p>
                                </div>
                                <Icons.Check className="h-12 w-12 text-green-200" />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-100">Expéditions</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.total_shipments}</p>
                                </div>
                                <Icons.Shipments className="h-12 w-12 text-blue-200" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 rounded-2xl bg-white p-6 shadow-lg"
                    >
                        <div className="grid gap-4 md:grid-cols-3">
                            <FormInput
                                label="Rechercher"
                                placeholder="Numéro ou chauffeur..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                icon={Icons.Search}
                            />
                            <FormSelect
                                label="Statut"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                options={statusOptions}
                                icon={Icons.Filter}
                            />
                            <div className="flex items-end">
                                <Button onClick={handleSearch} className="w-full">
                                    Filtrer
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <DataTable
                            columns={columns}
                            data={waybills.data}
                            emptyIcon={Icons.Clipboard}
                            emptyMessage="Aucun bordereau trouvé"
                        />

                        {/* Pagination */}
                        {waybills.links && waybills.links.length > 3 && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex space-x-2">
                                    {waybills.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                                link.active
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
