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

export default function InvoicesIndex({ invoices, stats, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const statusOptions = [
        { value: '', label: 'Tous les statuts' },
        { value: 'draft', label: 'Brouillon' },
        { value: 'sent', label: 'Envoyée' },
        { value: 'paid', label: 'Payée' },
        { value: 'overdue', label: 'En retard' },
        { value: 'cancelled', label: 'Annulée' },
    ];

    const getStatusBadge = (status) => {
        const variants = {
            draft: 'default',
            sent: 'info',
            paid: 'success',
            overdue: 'danger',
            cancelled: 'warning',
        };
        
        const labels = {
            draft: 'Brouillon',
            sent: 'Envoyée',
            paid: 'Payée',
            overdue: 'En retard',
            cancelled: 'Annulée',
        };

        return <Badge variant={variants[status]}>{labels[status]}</Badge>;
    };

    const handleSearch = () => {
        router.get(route('invoices.index'), 
            { search, status },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDelete = (invoice) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
            router.delete(route('invoices.destroy', invoice.id));
        }
    };

    const columns = [
        { 
            key: 'invoice_number', 
            label: 'Numéro', 
            render: (invoice) => (
                <Link
                    href={route('invoices.show', invoice.id)}
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                    {invoice.invoice_number}
                </Link>
            )
        },
        { 
            key: 'client', 
            label: 'Client',
            render: (invoice) => invoice.client?.name || 'N/A'
        },
        { 
            key: 'invoice_date', 
            label: 'Date',
            render: (invoice) => new Date(invoice.invoice_date).toLocaleDateString('fr-FR')
        },
        { 
            key: 'due_date', 
            label: 'Échéance',
            render: (invoice) => invoice.due_date 
                ? new Date(invoice.due_date).toLocaleDateString('fr-FR')
                : 'N/A'
        },
        { 
            key: 'total', 
            label: 'Montant',
            render: (invoice) => (
                <span className="font-semibold text-gray-900">
                    {parseFloat(invoice.total).toFixed(2)} €
                </span>
            )
        },
        { 
            key: 'status', 
            label: 'Statut',
            render: (invoice) => getStatusBadge(invoice.status)
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (invoice) => (
                <div className="flex items-center space-x-2">
                    <Link
                        href={route('invoices.show', invoice.id)}
                        className="text-emerald-600 hover:text-emerald-700"
                    >
                        <Icons.Eye className="h-5 w-5" />
                    </Link>
                    <a
                        href={route('invoices.pdf', invoice.id)}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-700"
                    >
                        <Icons.Download className="h-5 w-5" />
                    </a>
                    <button
                        onClick={() => handleDelete(invoice)}
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
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Factures
                    </h2>
                    <Link href={route('invoices.create')}>
                        <Button
                            variant="primary"
                            icon={Icons.Plus}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600"
                        >
                            Nouvelle facture
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Factures" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-100">Total</p>
                                    <p className="mt-2 text-3xl font-bold">{parseFloat(stats.total).toFixed(2)} €</p>
                                </div>
                                <Icons.Currency className="h-12 w-12 text-blue-200" />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-100">Payé</p>
                                    <p className="mt-2 text-3xl font-bold">{parseFloat(stats.paid).toFixed(2)} €</p>
                                </div>
                                <Icons.Check className="h-12 w-12 text-green-200" />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-100">En attente</p>
                                    <p className="mt-2 text-3xl font-bold">{parseFloat(stats.pending).toFixed(2)} €</p>
                                </div>
                                <Icons.Clock className="h-12 w-12 text-amber-200" />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-100">En retard</p>
                                    <p className="mt-2 text-3xl font-bold">{parseFloat(stats.overdue).toFixed(2)} €</p>
                                </div>
                                <Icons.Alert className="h-12 w-12 text-red-200" />
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
                                placeholder="Numéro ou client..."
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
                            data={invoices.data}
                            emptyIcon={Icons.FileText}
                            emptyMessage="Aucune facture trouvée"
                        />

                        {/* Pagination */}
                        {invoices.links && invoices.links.length > 3 && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex space-x-2">
                                    {invoices.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                                link.active
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
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
