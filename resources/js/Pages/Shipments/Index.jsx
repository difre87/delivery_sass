import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icons } from '@/Components/Icons';
import FormInput from '@/Components/FormInput';
import FormTextarea from '@/Components/FormTextarea';
import FormSelect from '@/Components/FormSelect';
import Button from '@/Components/Button';
import DataTable from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import Alert from '@/Components/Alert';
import Badge from '@/Components/Badge';

const statusOptions = [
    { value: 'draft', label: 'Brouillon', color: 'slate' },
    { value: 'scheduled', label: 'Planifiée', color: 'blue' },
    { value: 'assigned', label: 'Assignée', color: 'purple' },
    { value: 'in_transit', label: 'En Transit', color: 'amber' },
    { value: 'delivered', label: 'Livrée', color: 'emerald' },
    { value: 'canceled', label: 'Annulée', color: 'rose' },
];

const initialForm = {
    branch_id: '',
    tracking_number: '',
    client_id: '',
    recipient_name: '',
    recipient_phone: '',
    recipient_address: '',
    reference: '',
    status: 'draft',
    scheduled_for: '',
    distance_km: '',
    cost_cents: '',
    price_cents: '',
    notes: '',
};

const getStatusConfig = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
};

export default function ShipmentsIndex({ shipments, clients, branches = [] }) {
    const flash = usePage().props.flash;
    const [editingShipmentId, setEditingShipmentId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);

    const rows = shipments?.data ?? [];
    const pagination = useMemo(() => shipments?.links ?? [], [shipments]);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('shipments.store'), {
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            },
        });
    };

    const startEdit = (shipment) => {
        setEditingShipmentId(shipment.id);
        editForm.setData({
            branch_id: shipment.branch_id ?? '',
            tracking_number: shipment.tracking_number ?? '',
            client_id: shipment.client_id ?? '',
            recipient_name: shipment.recipient_name ?? '',
            recipient_phone: shipment.recipient_phone ?? '',
            recipient_address: shipment.recipient_address ?? '',
            reference: shipment.reference ?? '',
            status: shipment.status ?? 'draft',
            scheduled_for: shipment.scheduled_for ? shipment.scheduled_for.slice(0, 16) : '',
            distance_km: shipment.distance_km ?? '',
            cost_cents: shipment.cost_cents ?? '',
            price_cents: shipment.price_cents ?? '',
            notes: shipment.notes ?? '',
        });
    };

    const cancelEdit = () => {
        setEditingShipmentId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingShipmentId) return;
        editForm.patch(route('shipments.update', editingShipmentId), {
            onSuccess: () => cancelEdit(),
        });
    };

    const deleteShipment = (shipment) => {
        if (!confirm(`Supprimer la livraison "${shipment.reference || `EXP-${shipment.id}`}" ?`)) return;
        router.delete(route('shipments.destroy', shipment.id));
    };

    const columns = [
        { 
            key: 'reference', 
            label: 'Référence',
            render: (shipment) => (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                        <Icons.Shipments className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-slate-900">
                        {shipment.reference || `EXP-${shipment.id}`}
                    </span>
                </div>
            )
        },
        { 
            key: 'tracking_number', 
            label: 'N° Suivi',
            render: (shipment) => (
                <span className="font-mono text-xs text-slate-600">
                    {shipment.tracking_number || '-'}
                </span>
            )
        },
        { 
            key: 'branch', 
            label: 'Agence',
            render: (shipment) => shipment.branch?.name || '-'
        },
        { 
            key: 'client', 
            label: 'Client',
            render: (shipment) => shipment.client?.name || '-'
        },
        { 
            key: 'recipient', 
            label: 'Destinataire',
            render: (shipment) => (
                <div>
                    <div className="font-medium text-slate-900">{shipment.recipient_name}</div>
                    {shipment.recipient_phone && (
                        <div className="text-xs text-slate-500">{shipment.recipient_phone}</div>
                    )}
                </div>
            )
        },
        { 
            key: 'status', 
            label: 'Statut',
            render: (shipment) => {
                const config = getStatusConfig(shipment.status);
                return <Badge color={config.color}>{config.label}</Badge>;
            }
        },
        { 
            key: 'scheduled_for', 
            label: 'Prévue pour',
            render: (shipment) => shipment.scheduled_for 
                ? new Date(shipment.scheduled_for).toLocaleString('fr-FR', { 
                    day: '2-digit', 
                    month: 'short', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })
                : '-'
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Livraisons" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                                <Icons.Shipments className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Livraisons</h1>
                                <p className="text-sm text-slate-600">Gestion des expéditions et livraisons</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        leftIcon={showCreateForm ? null : <Icons.Plus className="h-4 w-4" />}
                    >
                        {showCreateForm ? 'Annuler' : 'Nouvelle Livraison'}
                    </Button>
                </div>

                {/* Flash Message */}
                {flash?.status && (
                    <Alert type="success" onClose={() => router.reload({ only: [] })}>
                        {flash.status}
                    </Alert>
                )}

                {/* Create Form */}
                <AnimatePresence>
                    {showCreateForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/30 shadow-lg">
                                <div className="border-b border-amber-200 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Icons.Shipments className="h-5 w-5 text-white" />
                                        <h3 className="font-semibold text-white">Nouvelle Livraison</h3>
                                    </div>
                                </div>
                                <form onSubmit={submitCreate} className="p-6">
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        <FormSelect
                                            label="Agence"
                                            value={createForm.data.branch_id}
                                            onChange={(e) => createForm.setData('branch_id', e.target.value)}
                                            error={createForm.errors.branch_id}
                                            options={[
                                                { value: '', label: 'Aucune' },
                                                ...branches.map(b => ({ value: b.id, label: b.name }))
                                            ]}
                                        />

                                        <FormInput
                                            label="N° de Suivi"
                                            value={createForm.data.tracking_number}
                                            onChange={(e) => createForm.setData('tracking_number', e.target.value)}
                                            error={createForm.errors.tracking_number}
                                            placeholder="TRK-2024-XXXXX"
                                        />

                                        <FormSelect
                                            label="Client"
                                            value={createForm.data.client_id}
                                            onChange={(e) => createForm.setData('client_id', e.target.value)}
                                            error={createForm.errors.client_id}
                                            options={[
                                                { value: '', label: 'Sans client' },
                                                ...clients.map(c => ({ value: c.id, label: c.name }))
                                            ]}
                                        />

                                        <FormInput
                                            label="Destinataire"
                                            value={createForm.data.recipient_name}
                                            onChange={(e) => createForm.setData('recipient_name', e.target.value)}
                                            error={createForm.errors.recipient_name}
                                            required
                                            placeholder="Nom du destinataire"
                                        />

                                        <FormInput
                                            label="Téléphone"
                                            type="tel"
                                            value={createForm.data.recipient_phone}
                                            onChange={(e) => createForm.setData('recipient_phone', e.target.value)}
                                            error={createForm.errors.recipient_phone}
                                            placeholder="+33 6 12 34 56 78"
                                        />

                                        <FormInput
                                            label="Référence"
                                            value={createForm.data.reference}
                                            onChange={(e) => createForm.setData('reference', e.target.value)}
                                            error={createForm.errors.reference}
                                            placeholder="REF-XXXXX"
                                        />

                                        <div className="md:col-span-2 lg:col-span-3">
                                            <FormTextarea
                                                label="Adresse de Livraison"
                                                value={createForm.data.recipient_address}
                                                onChange={(e) => createForm.setData('recipient_address', e.target.value)}
                                                error={createForm.errors.recipient_address}
                                                rows={2}
                                                placeholder="Adresse complète du destinataire"
                                            />
                                        </div>

                                        <FormSelect
                                            label="Statut"
                                            value={createForm.data.status}
                                            onChange={(e) => createForm.setData('status', e.target.value)}
                                            error={createForm.errors.status}
                                            options={statusOptions.map(s => ({ value: s.value, label: s.label }))}
                                        />

                                        <FormInput
                                            label="Prévue pour"
                                            type="datetime-local"
                                            value={createForm.data.scheduled_for}
                                            onChange={(e) => createForm.setData('scheduled_for', e.target.value)}
                                            error={createForm.errors.scheduled_for}
                                        />

                                        <FormInput
                                            label="Distance (km)"
                                            type="number"
                                            step="0.01"
                                            value={createForm.data.distance_km}
                                            onChange={(e) => createForm.setData('distance_km', e.target.value)}
                                            error={createForm.errors.distance_km}
                                            placeholder="0.00"
                                        />

                                        <FormInput
                                            label="Coût (€)"
                                            type="number"
                                            step="0.01"
                                            value={createForm.data.cost_cents ? (createForm.data.cost_cents / 100).toFixed(2) : ''}
                                            onChange={(e) => createForm.setData('cost_cents', Math.round(parseFloat(e.target.value || 0) * 100))}
                                            error={createForm.errors.cost_cents}
                                            placeholder="0.00"
                                        />

                                        <FormInput
                                            label="Prix (€)"
                                            type="number"
                                            step="0.01"
                                            value={createForm.data.price_cents ? (createForm.data.price_cents / 100).toFixed(2) : ''}
                                            onChange={(e) => createForm.setData('price_cents', Math.round(parseFloat(e.target.value || 0) * 100))}
                                            error={createForm.errors.price_cents}
                                            placeholder="0.00"
                                        />

                                        <div className="md:col-span-2 lg:col-span-3">
                                            <FormTextarea
                                                label="Notes"
                                                value={createForm.data.notes}
                                                onChange={(e) => createForm.setData('notes', e.target.value)}
                                                error={createForm.errors.notes}
                                                rows={3}
                                                placeholder="Instructions spéciales, remarques..."
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowCreateForm(false)}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={createForm.processing}
                                            loading={createForm.processing}
                                        >
                                            Créer la Livraison
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Form */}
                <AnimatePresence>
                    {editingShipmentId && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/30 shadow-lg">
                                <div className="border-b border-amber-200 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Icons.Shipments className="h-5 w-5 text-white" />
                                        <h3 className="font-semibold text-white">Modifier la Livraison</h3>
                                    </div>
                                </div>
                                <form onSubmit={submitEdit} className="p-6">
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        <FormSelect
                                            label="Agence"
                                            value={editForm.data.branch_id}
                                            onChange={(e) => editForm.setData('branch_id', e.target.value)}
                                            error={editForm.errors.branch_id}
                                            options={[
                                                { value: '', label: 'Aucune' },
                                                ...branches.map(b => ({ value: b.id, label: b.name }))
                                            ]}
                                        />

                                        <FormInput
                                            label="N° de Suivi"
                                            value={editForm.data.tracking_number}
                                            onChange={(e) => editForm.setData('tracking_number', e.target.value)}
                                            error={editForm.errors.tracking_number}
                                        />

                                        <FormSelect
                                            label="Client"
                                            value={editForm.data.client_id}
                                            onChange={(e) => editForm.setData('client_id', e.target.value)}
                                            error={editForm.errors.client_id}
                                            options={[
                                                { value: '', label: 'Sans client' },
                                                ...clients.map(c => ({ value: c.id, label: c.name }))
                                            ]}
                                        />

                                        <FormInput
                                            label="Destinataire"
                                            value={editForm.data.recipient_name}
                                            onChange={(e) => editForm.setData('recipient_name', e.target.value)}
                                            error={editForm.errors.recipient_name}
                                            required
                                        />

                                        <FormInput
                                            label="Téléphone"
                                            type="tel"
                                            value={editForm.data.recipient_phone}
                                            onChange={(e) => editForm.setData('recipient_phone', e.target.value)}
                                            error={editForm.errors.recipient_phone}
                                        />

                                        <FormInput
                                            label="Référence"
                                            value={editForm.data.reference}
                                            onChange={(e) => editForm.setData('reference', e.target.value)}
                                            error={editForm.errors.reference}
                                        />

                                        <div className="md:col-span-2 lg:col-span-3">
                                            <FormTextarea
                                                label="Adresse de Livraison"
                                                value={editForm.data.recipient_address}
                                                onChange={(e) => editForm.setData('recipient_address', e.target.value)}
                                                error={editForm.errors.recipient_address}
                                                rows={2}
                                            />
                                        </div>

                                        <FormSelect
                                            label="Statut"
                                            value={editForm.data.status}
                                            onChange={(e) => editForm.setData('status', e.target.value)}
                                            error={editForm.errors.status}
                                            options={statusOptions.map(s => ({ value: s.value, label: s.label }))}
                                        />

                                        <FormInput
                                            label="Prévue pour"
                                            type="datetime-local"
                                            value={editForm.data.scheduled_for}
                                            onChange={(e) => editForm.setData('scheduled_for', e.target.value)}
                                            error={editForm.errors.scheduled_for}
                                        />

                                        <FormInput
                                            label="Distance (km)"
                                            type="number"
                                            step="0.01"
                                            value={editForm.data.distance_km}
                                            onChange={(e) => editForm.setData('distance_km', e.target.value)}
                                            error={editForm.errors.distance_km}
                                        />

                                        <FormInput
                                            label="Coût (€)"
                                            type="number"
                                            step="0.01"
                                            value={editForm.data.cost_cents ? (editForm.data.cost_cents / 100).toFixed(2) : ''}
                                            onChange={(e) => editForm.setData('cost_cents', Math.round(parseFloat(e.target.value || 0) * 100))}
                                            error={editForm.errors.cost_cents}
                                        />

                                        <FormInput
                                            label="Prix (€)"
                                            type="number"
                                            step="0.01"
                                            value={editForm.data.price_cents ? (editForm.data.price_cents / 100).toFixed(2) : ''}
                                            onChange={(e) => editForm.setData('price_cents', Math.round(parseFloat(e.target.value || 0) * 100))}
                                            error={editForm.errors.price_cents}
                                        />

                                        <div className="md:col-span-2 lg:col-span-3">
                                            <FormTextarea
                                                label="Notes"
                                                value={editForm.data.notes}
                                                onChange={(e) => editForm.setData('notes', e.target.value)}
                                                error={editForm.errors.notes}
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={cancelEdit}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={editForm.processing}
                                            loading={editForm.processing}
                                        >
                                            Enregistrer
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={rows}
                    emptyMessage="Aucune livraison enregistrée. Créez votre première livraison !"
                    emptyIcon={Icons.Shipments}
                    actions={(shipment) => (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(shipment)}
                            >
                                Modifier
                            </Button>
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => deleteShipment(shipment)}
                            >
                                Supprimer
                            </Button>
                        </>
                    )}
                />

                {/* Pagination */}
                {pagination.length > 0 && <Pagination links={pagination} />}
            </div>
        </AuthenticatedLayout>
    );
}
