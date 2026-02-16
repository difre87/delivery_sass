import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Icons } from '@/Components/Icons';

export default function Show({ waybill }) {
    const page = usePage<any>();
    const { currentCompany } = page.props.auth;
    const [updatingItem, setUpdatingItem] = useState(null);

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-700 border-gray-300',
            issued: 'bg-blue-100 text-blue-700 border-blue-300',
            in_progress: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            completed: 'bg-green-100 text-green-700 border-green-300',
            cancelled: 'bg-red-100 text-red-700 border-red-300',
        };
        return colors[status] || colors.draft;
    };

    const getItemStatusColor = (status) => {
        const colors = {
            pending: 'bg-gray-100 text-gray-700',
            picked_up: 'bg-blue-100 text-blue-700',
            delivered: 'bg-green-100 text-green-700',
            failed: 'bg-red-100 text-red-700',
        };
        return colors[status] || colors.pending;
    };

    const getStatusLabel = (status) => {
        const labels = {
            draft: 'Brouillon',
            issued: 'Émis',
            in_progress: 'En cours',
            completed: 'Terminé',
            cancelled: 'Annulé',
        };
        return labels[status] || status;
    };

    const getItemStatusLabel = (status) => {
        const labels = {
            pending: 'En attente',
            picked_up: 'Collecté',
            delivered: 'Livré',
            failed: 'Échec',
        };
        return labels[status] || status;
    };

    const handleMarkAsIssued = () => {
        if (confirm('Confirmer l\'émission de ce bordereau ?')) {
            router.post(route('waybills.mark-issued', { company: currentCompany.slug, waybillId: waybill.id }));
        }
    };

    const handleMarkAsInProgress = () => {
        if (confirm('Marquer ce bordereau comme en cours ?')) {
            router.post(route('waybills.mark-in-progress', { company: currentCompany.slug, waybillId: waybill.id }));
        }
    };

    const handleMarkAsCompleted = () => {
        if (confirm('Marquer ce bordereau comme terminé ?')) {
            router.post(route('waybills.mark-completed', { company: currentCompany.slug, waybillId: waybill.id }));
        }
    };

    const handleDownloadPdf = () => {
        window.open(route('waybills.pdf', { company: currentCompany.slug, waybillId: waybill.id }), '_blank');
    };

    const handleDelete = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce bordereau ?')) {
            router.delete(route('waybills.destroy', { company: currentCompany.slug, waybillId: waybill.id }));
        }
    };

    const updateItemStatus = (itemId, status) => {
        setUpdatingItem(itemId);
        router.post(
            route('waybills.items.update', { company: currentCompany.slug, waybillId: waybill.id, item: itemId }),
            { status },
            {
                onFinish: () => setUpdatingItem(null),
            }
        );
    };

    const progressPercentage = waybill.total_shipments > 0
        ? Math.round((waybill.completed_shipments / waybill.total_shipments) * 100)
        : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                            <Icons.Clipboard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {waybill.waybill_number}
                            </h2>
                            <p className="text-sm text-gray-600">Bordereau de livraison</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={route('waybills.index', { company: currentCompany.slug })}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            Retour
                        </a>
                    </div>
                </div>
            }
        >
            <Head title={`Bordereau ${waybill.waybill_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Waybill Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100"
                            >
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Informations du bordereau
                                        </h3>
                                        <span className={`px-4 py-2 rounded-lg border font-medium ${getStatusColor(waybill.status)}`}>
                                            {getStatusLabel(waybill.status)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Date</label>
                                            <p className="mt-1 text-gray-900 flex items-center gap-2">
                                                <Icons.Calendar className="w-4 h-4 text-purple-600" />
                                                {new Date(waybill.date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        {waybill.dispatch_run && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Tournée</label>
                                                <p className="mt-1 text-gray-900 flex items-center gap-2">
                                                    <Icons.Routes className="w-4 h-4 text-purple-600" />
                                                    {waybill.dispatch_run.run_number}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Chauffeur</label>
                                            <p className="mt-1 text-gray-900 flex items-center gap-2">
                                                <Icons.Drivers className="w-4 h-4 text-purple-600" />
                                                {waybill.driver?.name}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Véhicule</label>
                                            <p className="mt-1 text-gray-900 flex items-center gap-2">
                                                <Icons.Truck className="w-4 h-4 text-purple-600" />
                                                {waybill.vehicle?.plate_number} - {waybill.vehicle?.make} {waybill.vehicle?.model}
                                            </p>
                                        </div>

                                        {waybill.departure_time && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Heure de départ</label>
                                                <p className="mt-1 text-gray-900 flex items-center gap-2">
                                                    <Icons.Clock className="w-4 h-4 text-purple-600" />
                                                    {waybill.departure_time}
                                                </p>
                                            </div>
                                        )}

                                        {waybill.return_time && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Heure de retour</label>
                                                <p className="mt-1 text-gray-900 flex items-center gap-2">
                                                    <Icons.Clock className="w-4 h-4 text-purple-600" />
                                                    {waybill.return_time}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {waybill.notes && (
                                        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                                            <label className="text-sm font-medium text-gray-500">Notes</label>
                                            <p className="mt-1 text-gray-900">{waybill.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Progress */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100"
                            >
                                <div className="p-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Progression</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Envois livrés</span>
                                            <span className="font-semibold text-gray-900">
                                                {waybill.completed_shipments} / {waybill.total_shipments}
                                            </span>
                                        </div>
                                        
                                        <div className="relative">
                                            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progressPercentage}%` }}
                                                    transition={{ duration: 0.5, delay: 0.2 }}
                                                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                                                />
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xs font-bold text-gray-700">
                                                    {progressPercentage}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Shipments List */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100"
                            >
                                <div className="p-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                        Liste des envois ({waybill.items?.length || 0})
                                    </h3>

                                    <div className="space-y-4">
                                        {waybill.items?.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                                            >
                                                {/* Sequence Number */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                                        {item.sequence_number}
                                                    </div>
                                                </div>

                                                {/* Shipment Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-gray-900">
                                                            {item.shipment?.tracking_number}
                                                        </span>
                                                        <span className="text-gray-600">•</span>
                                                        <span className="text-gray-700">
                                                            {item.shipment?.client?.name}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                        <span className="flex items-center gap-1">
                                                            <Icons.MapPin className="w-4 h-4" />
                                                            {item.shipment?.sender_address?.city}
                                                        </span>
                                                        <span>→</span>
                                                        <span className="flex items-center gap-1">
                                                            <Icons.MapPin className="w-4 h-4" />
                                                            {item.shipment?.recipient_address?.city}
                                                        </span>
                                                    </div>

                                                    {item.delivery_notes && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            Note: {item.delivery_notes}
                                                        </p>
                                                    )}

                                                    {/* Timestamps */}
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                                        {item.picked_up_at && (
                                                            <span>
                                                                Collecté: {new Date(item.picked_up_at).toLocaleString('fr-FR')}
                                                            </span>
                                                        )}
                                                        {item.delivered_at && (
                                                            <span>
                                                                Livré: {new Date(item.delivered_at).toLocaleString('fr-FR')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Badge & Actions */}
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getItemStatusColor(item.status)}`}>
                                                        {getItemStatusLabel(item.status)}
                                                    </span>

                                                    {waybill.status === 'in_progress' && item.status !== 'delivered' && item.status !== 'failed' && (
                                                        <div className="flex gap-1">
                                                            {item.status === 'pending' && (
                                                                <button
                                                                    onClick={() => updateItemStatus(item.id, 'picked_up')}
                                                                    disabled={updatingItem === item.id}
                                                                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                                                                >
                                                                    Collecter
                                                                </button>
                                                            )}
                                                            {item.status === 'picked_up' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => updateItemStatus(item.id, 'delivered')}
                                                                        disabled={updatingItem === item.id}
                                                                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                                                                    >
                                                                        Livrer
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateItemStatus(item.id, 'failed')}
                                                                        disabled={updatingItem === item.id}
                                                                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                                                                    >
                                                                        Échec
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar - Actions */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 sticky top-6"
                            >
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions</h3>
                                    
                                    <div className="space-y-3">
                                        {/* Download PDF */}
                                        <button
                                            onClick={handleDownloadPdf}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            <Icons.Download className="w-5 h-5" />
                                            <span>Télécharger PDF</span>
                                        </button>

                                        {/* Status Actions */}
                                        {waybill.status === 'draft' && (
                                            <button
                                                onClick={handleMarkAsIssued}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                                            >
                                                <Icons.Check className="w-5 h-5" />
                                                <span>Émettre</span>
                                            </button>
                                        )}

                                        {waybill.status === 'issued' && (
                                            <button
                                                onClick={handleMarkAsInProgress}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-all"
                                            >
                                                <Icons.Clock className="w-5 h-5" />
                                                <span>Démarrer</span>
                                            </button>
                                        )}

                                        {waybill.status === 'in_progress' && (
                                            <button
                                                onClick={handleMarkAsCompleted}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
                                            >
                                                <Icons.Check className="w-5 h-5" />
                                                <span>Terminer</span>
                                            </button>
                                        )}

                                        {/* Edit */}
                                        {waybill.status === 'draft' && (
                                            <a
                                                href={route('waybills.edit', { company: currentCompany.slug, waybillId: waybill.id })}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                                            >
                                                <Icons.FileText className="w-5 h-5" />
                                                <span>Modifier</span>
                                            </a>
                                        )}

                                        {/* Delete */}
                                        {(waybill.status === 'draft' || waybill.status === 'cancelled') && (
                                            <button
                                                onClick={handleDelete}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all"
                                            >
                                                <Icons.Trash className="w-5 h-5" />
                                                <span>Supprimer</span>
                                            </button>
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
