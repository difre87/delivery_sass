import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import { Icons } from '@/Components/Icons';
import { useCurrency } from '@/hooks/useCurrency';

export default function ShowInvoice({ invoice }) {
    const { format: formatCurrency } = useCurrency();
    const page = usePage<any>();
    const { currentCompany } = page.props.auth;
    
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

        return <Badge variant={variants[status]} size="lg">{labels[status]}</Badge>;
    };

    const handleMarkAsPaid = () => {
        if (confirm('Marquer cette facture comme payée ?')) {
            router.post(route('invoices.mark-paid', { company: currentCompany.slug, invoiceId: invoice.id }));
        }
    };

    const handleSend = () => {
        if (confirm('Envoyer cette facture au client ?')) {
            router.post(route('invoices.send', { company: currentCompany.slug, invoiceId: invoice.id }));
        }
    };

    const handleDelete = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
            router.delete(route('invoices.destroy', { company: currentCompany.slug, invoiceId: invoice.id }));
        }
    };

    const handleStatusChange = (newStatus) => {
        router.patch(route('invoices.update', { company: currentCompany.slug, invoiceId: invoice.id }), {
            status: newStatus,
            notes: invoice.notes,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Facture {invoice.invoice_number}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Créée le {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <a
                            href={route('invoices.pdf', { company: currentCompany.slug, invoiceId: invoice.id })}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                variant="secondary"
                                icon={Icons.Download}
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                                Télécharger PDF
                            </Button>
                        </a>
                        {invoice.status !== 'paid' && (
                            <Button
                                onClick={handleMarkAsPaid}
                                variant="primary"
                                icon={Icons.Check}
                                className="bg-gradient-to-r from-green-600 to-emerald-600"
                            >
                                Marquer comme payée
                            </Button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Facture ${invoice.invoice_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Invoice Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                            >
                                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
                                    <div className="absolute inset-0 bg-grid-white/10"></div>
                                    <div className="relative">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">
                                                    {invoice.company?.name || 'Votre Entreprise'}
                                                </h3>
                                                {invoice.company?.address && (
                                                    <p className="mt-2 text-sm text-blue-100">
                                                        {invoice.company.address}<br />
                                                        {invoice.company.postal_code} {invoice.company.city}
                                                    </p>
                                                )}
                                                {invoice.company?.email && (
                                                    <p className="mt-1 text-sm text-blue-100">
                                                        {invoice.company.email}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                {getStatusBadge(invoice.status)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <h4 className="text-sm font-semibold uppercase text-gray-500">
                                                Facturé à
                                            </h4>
                                            <div className="mt-2">
                                                <p className="font-semibold text-gray-900">
                                                    {invoice.client?.name}
                                                </p>
                                                {invoice.client?.email && (
                                                    <p className="text-sm text-gray-600">
                                                        {invoice.client.email}
                                                    </p>
                                                )}
                                                {invoice.client?.phone && (
                                                    <p className="text-sm text-gray-600">
                                                        {invoice.client.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold uppercase text-gray-500">
                                                Détails de la facture
                                            </h4>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Date :</span>
                                                    <span className="font-medium text-gray-900">
                                                        {new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Échéance :</span>
                                                    <span className="font-medium text-gray-900">
                                                        {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                                {invoice.paid_at && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Payée le :</span>
                                                        <span className="font-medium text-green-600">
                                                            {new Date(invoice.paid_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Invoice Items */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                            >
                                <div className="p-6">
                                    <h4 className="mb-4 text-lg font-semibold text-gray-900">Articles</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="border-b-2 border-gray-200">
                                                <tr>
                                                    <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                                                        Description
                                                    </th>
                                                    <th className="pb-3 text-right text-sm font-semibold text-gray-700">
                                                        Qté
                                                    </th>
                                                    <th className="pb-3 text-right text-sm font-semibold text-gray-700">
                                                        Prix unitaire
                                                    </th>
                                                    <th className="pb-3 text-right text-sm font-semibold text-gray-700">
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {invoice.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="py-4 text-sm text-gray-900">
                                                            {item.description}
                                                            {item.shipment && (
                                                                <span className="ml-2 text-xs text-gray-500">
                                                                    (Ref: {item.shipment.tracking_number})
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 text-right text-sm text-gray-900">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="py-4 text-right text-sm text-gray-900">
                                                            {formatCurrency(item.unit_price)}
                                                        </td>
                                                        <td className="py-4 text-right font-medium text-gray-900">
                                                            {formatCurrency(item.total)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-6 space-y-2 border-t-2 border-gray-200 pt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">Sous-total :</span>
                                            <span className="font-semibold text-gray-900">
                                                {formatCurrency(invoice.subtotal)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">
                                                TVA ({invoice.tax_rate}%) :
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {formatCurrency(invoice.tax_amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t-2 border-gray-200 pt-2 text-xl">
                                            <span className="font-bold text-gray-900">Total :</span>
                                            <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                                {formatCurrency(invoice.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Notes */}
                            {invoice.notes && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                                >
                                    <div className="p-6">
                                        <h4 className="mb-2 text-lg font-semibold text-gray-900">Notes</h4>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                            {invoice.notes}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Actions */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                            >
                                <div className="p-6">
                                    <h4 className="mb-4 text-lg font-semibold text-gray-900">Actions</h4>
                                    <div className="space-y-3">
                                        {invoice.status === 'draft' && (
                                            <Button
                                                onClick={handleSend}
                                                variant="primary"
                                                icon={Icons.Mail}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                                            >
                                                Envoyer au client
                                            </Button>
                                        )}
                                        {invoice.status !== 'paid' && (
                                            <Button
                                                onClick={handleMarkAsPaid}
                                                variant="primary"
                                                icon={Icons.Check}
                                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                                            >
                                                Marquer comme payée
                                            </Button>
                                        )}
                                        <a
                                            href={route('invoices.pdf', { company: currentCompany.slug, invoiceId: invoice.id })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Button
                                                variant="secondary"
                                                icon={Icons.Download}
                                                className="w-full"
                                            >
                                                Télécharger PDF
                                            </Button>
                                        </a>
                                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                                            <Button
                                                onClick={() => handleStatusChange('cancelled')}
                                                variant="secondary"
                                                icon={Icons.Alert}
                                                className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                                            >
                                                Annuler la facture
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handleDelete}
                                            variant="danger"
                                            icon={Icons.Trash}
                                            className="w-full"
                                        >
                                            Supprimer
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Status History */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="overflow-hidden bg-white shadow-lg sm:rounded-2xl"
                            >
                                <div className="p-6">
                                    <h4 className="mb-4 text-lg font-semibold text-gray-900">Statut</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Statut actuel :</span>
                                            {getStatusBadge(invoice.status)}
                                        </div>
                                        {invoice.status === 'draft' && (
                                            <p className="text-xs text-gray-500">
                                                La facture est en brouillon. Envoyez-la au client pour la finaliser.
                                            </p>
                                        )}
                                        {invoice.status === 'sent' && (
                                            <p className="text-xs text-gray-500">
                                                La facture a été envoyée au client. En attente de paiement.
                                            </p>
                                        )}
                                        {invoice.status === 'paid' && invoice.paid_at && (
                                            <p className="text-xs text-green-600">
                                                Payée le {new Date(invoice.paid_at).toLocaleDateString('fr-FR')}
                                            </p>
                                        )}
                                        {invoice.status === 'overdue' && (
                                            <p className="text-xs text-red-600">
                                                La facture est en retard. Date d'échéance dépassée.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
