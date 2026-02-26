import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icons } from '@/Components/Icons';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import FormCheckbox from '@/Components/FormCheckbox';
import Button from '@/Components/Button';
import DataTable from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import Toast from '@/Components/Toast';
import Badge from '@/Components/Badge';
import ConfirmDialog from '@/Components/ConfirmDialog';

const statusOptions = [
    { value: 'planned', label: 'Planifiée', color: 'blue' },
    { value: 'in_progress', label: 'En Cours', color: 'amber' },
    { value: 'completed', label: 'Terminée', color: 'emerald' },
];

const initialCreateForm = { 
    driver_id: '', 
    vehicle_id: '', 
    date: '', 
    status: 'planned', 
    shipment_ids: [] 
};

const initialEditForm = { 
    branch_id: '', 
    driver_id: '', 
    vehicle_id: '', 
    date: '', 
    status: 'planned', 
    shipment_ids: [] 
};

const getDateInputValue = (value) => (value ? String(value).slice(0, 10) : '');
const shipmentLabel = (shipment) => shipment.reference || shipment.tracking_number || `EXP-${shipment.id}`;

const getStatusConfig = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
};

export default function RoutesIndex({ runs, branches = [], vehicles = [], drivers = [], shipments = [] }) {
    const { flash, auth } = usePage().props as any;
    const [editingRunId, setEditingRunId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deletingRun, setDeletingRun] = useState(null);
    
    const createForm = useForm(initialCreateForm);
    const editForm = useForm(initialEditForm);
    
    const rows = runs?.data ?? [];
    const pagination = useMemo(() => runs?.links ?? [], [runs]);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('routes.store', { company: auth.user.current_company.slug }), { 
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            } 
        });
    };

    const startEdit = (run) => {
        setEditingRunId(run.id);
        editForm.setData({
            branch_id: run.branch_id ?? '',
            driver_id: run.driver_id ?? '',
            vehicle_id: run.vehicle_id ?? '',
            date: getDateInputValue(run.date),
            status: run.status ?? 'planned',
            shipment_ids: (run.shipments ?? []).map((shipment) => shipment.id),
        });
    };

    const cancelEdit = () => {
        setEditingRunId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingRunId) return;
        editForm.patch(route('routes.update', { company: auth.user.current_company.slug, dispatchRun: editingRunId }), { onSuccess: () => cancelEdit() });
    };

    const deleteRun = (run) => {
        setDeletingRun(run);
    };

    const confirmDelete = () => {
        if (!deletingRun) return;
        router.delete(route('routes.destroy', { company: auth.user.current_company.slug, dispatchRun: deletingRun.id }), {
            onFinish: () => setDeletingRun(null)
        });
    };

    const toggleShipment = (form, shipmentId) => {
        const currentIds = form.data.shipment_ids ?? [];
        const nextIds = currentIds.includes(shipmentId)
            ? currentIds.filter((id) => id !== shipmentId)
            : [...currentIds, shipmentId];
        form.setData('shipment_ids', nextIds);
    };

    const columns = [
        { 
            key: 'id', 
            label: 'Tournée',
            render: (run) => (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-sm">
                        <Icons.Routes className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-slate-900">
                        Tournée #{run.id}
                    </span>
                </div>
            )
        },
        { 
            key: 'date', 
            label: 'Date',
            render: (run) => new Date(run.date).toLocaleDateString('fr-FR', { 
                weekday: 'short', 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            })
        },
        { 
            key: 'driver', 
            label: 'Chauffeur',
            render: (run) => run.driver?.name || '-'
        },
        { 
            key: 'vehicle', 
            label: 'Véhicule',
            render: (run) => run.vehicle?.plate_number || '-'
        },
        { 
            key: 'branch', 
            label: 'Agence',
            render: (run) => run.branch?.name || '-'
        },
        { 
            key: 'shipments', 
            label: 'Livraisons',
            render: (run) => (
                <div className="flex items-center gap-2">
                    <Icons.Shipments className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-slate-700">
                        {run.shipments_count ?? run.shipments?.length ?? 0}
                    </span>
                </div>
            )
        },
        { 
            key: 'status', 
            label: 'Statut',
            render: (run) => {
                const config = getStatusConfig(run.status);
                return <Badge variant={config.color}>{config.label}</Badge>;
            }
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tournées
                </h2>
            }
        >
            <Head title="Tournées" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg">
                                <Icons.Routes className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Tournées</h1>
                                <p className="text-sm text-slate-600">Planification et gestion des itinéraires</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        leftIcon={showCreateForm ? null : <Icons.Plus className="h-4 w-4" />}
                    >
                        {showCreateForm ? 'Annuler' : 'Nouvelle Tournée'}
                    </Button>
                </div>

                {/* Flash Message Toast */}
                <AnimatePresence>
                    {flash?.status && (
                        <Toast 
                            message={flash.status} 
                            type="success"
                            onClose={() => router.reload({ only: [] })}
                        />
                    )}
                </AnimatePresence>

                {/* Create Form */}
                <AnimatePresence>
                    {showCreateForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-white to-rose-50/30 shadow-lg">
                                <div className="border-b border-rose-200 bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Icons.Routes className="h-5 w-5 text-white" />
                                        <h3 className="font-semibold text-white">Nouvelle Tournée</h3>
                                    </div>
                                </div>
                                <form onSubmit={submitCreate} className="p-6">
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        <FormInput
                                            label="Date"
                                            type="date"
                                            value={createForm.data.date}
                                            onChange={(e) => createForm.setData('date', e.target.value)}
                                            error={createForm.errors.date}
                                            required
                                        />

                                        <FormSelect
                                            label="Chauffeur"
                                            value={createForm.data.driver_id}
                                            onChange={(e) => {
                                                const driverId = e.target.value;
                                                const selectedDriver = drivers.find(d => d.id == driverId);
                                                const assignedVehicle = selectedDriver?.vehicle_assignments?.[0]?.vehicle;
                                                
                                                createForm.setData({
                                                    ...createForm.data,
                                                    driver_id: driverId,
                                                    vehicle_id: assignedVehicle?.id || ''
                                                });
                                            }}
                                            error={createForm.errors.driver_id}
                                            required
                                            icon={Icons.Drivers}
                                            options={[
                                                { value: '', label: 'Choisir un chauffeur' },
                                                ...drivers.map(d => {
                                                    const vehicle = d.vehicle_assignments?.[0]?.vehicle;
                                                    const vehicleInfo = vehicle ? ` - ${vehicle.plate_number}` : ' (sans véhicule)';
                                                    return { value: d.id, label: `${d.name}${vehicleInfo}` };
                                                })
                                            ]}
                                        />

                                        <FormSelect
                                            label="Véhicule"
                                            value={createForm.data.vehicle_id}
                                            onChange={(e) => createForm.setData('vehicle_id', e.target.value)}
                                            error={createForm.errors.vehicle_id}
                                            icon={Icons.Fleet}
                                            disabled
                                            className="bg-slate-50"
                                            options={[
                                                { value: '', label: 'Aucun véhicule' },
                                                ...vehicles.map(v => ({ value: v.id, label: v.plate_number }))
                                            ]}
                                        />

                                        <FormSelect
                                            label="Statut"
                                            value={createForm.data.status}
                                            onChange={(e) => createForm.setData('status', e.target.value)}
                                            error={createForm.errors.status}
                                            options={statusOptions.map(s => ({ value: s.value, label: s.label }))}
                                        />

                                        <div className="md:col-span-2 lg:col-span-3">
                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                                                Livraisons à Inclure
                                            </label>
                                            <div className="max-h-60 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                                {shipments.length === 0 ? (
                                                    <p className="text-center text-sm text-slate-500">Aucune livraison disponible</p>
                                                ) : (
                                                    shipments.map((shipment) => (
                                                        <FormCheckbox
                                                            key={shipment.id}
                                                            label={`${shipmentLabel(shipment)} - ${shipment.recipient_name}`}
                                                            description=""
                                                            checked={(createForm.data.shipment_ids ?? []).includes(shipment.id)}
                                                            onChange={() => toggleShipment(createForm, shipment.id)}
                                                        />
                                                    ))
                                                )}
                                            </div>
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
                                            Créer la Tournée
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Form */}
                <AnimatePresence>
                    {editingRunId && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-white to-rose-50/30 shadow-lg">
                                <div className="border-b border-rose-200 bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Icons.Routes className="h-5 w-5 text-white" />
                                        <h3 className="font-semibold text-white">Modifier la Tournée</h3>
                                    </div>
                                </div>
                                <form onSubmit={submitEdit} className="p-6">
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        <FormInput
                                            label="Date"
                                            type="date"
                                            value={editForm.data.date}
                                            onChange={(e) => editForm.setData('date', e.target.value)}
                                            error={editForm.errors.date}
                                            required
                                        />

                                        <FormSelect
                                            label="Chauffeur"
                                            value={editForm.data.driver_id}
                                            onChange={(e) => {
                                                const driverId = e.target.value;
                                                const selectedDriver = drivers.find(d => d.id == driverId);
                                                const assignedVehicle = selectedDriver?.vehicle_assignments?.[0]?.vehicle;
                                                
                                                editForm.setData({
                                                    ...editForm.data,
                                                    driver_id: driverId,
                                                    vehicle_id: assignedVehicle?.id || ''
                                                });
                                            }}
                                            error={editForm.errors.driver_id}
                                            required
                                            icon={Icons.Drivers}
                                            options={[
                                                { value: '', label: 'Choisir un chauffeur' },
                                                ...drivers.map(d => {
                                                    const vehicle = d.vehicle_assignments?.[0]?.vehicle;
                                                    const vehicleInfo = vehicle ? ` - ${vehicle.plate_number}` : ' (sans véhicule)';
                                                    return { value: d.id, label: `${d.name}${vehicleInfo}` };
                                                })
                                            ]}
                                        />

                                        <FormSelect
                                            label="Véhicule"
                                            value={editForm.data.vehicle_id}
                                            onChange={(e) => editForm.setData('vehicle_id', e.target.value)}
                                            error={editForm.errors.vehicle_id}
                                            icon={Icons.Fleet}
                                            disabled
                                            className="bg-slate-50"
                                            options={[
                                                { value: '', label: 'Aucun véhicule' },
                                                ...vehicles.map(v => ({ value: v.id, label: v.plate_number }))
                                            ]}
                                        />

                                        <FormSelect
                                            label="Agence"
                                            value={editForm.data.branch_id}
                                            onChange={(e) => editForm.setData('branch_id', e.target.value)}
                                            error={editForm.errors.branch_id}
                                            options={[
                                                { value: '', label: 'Aucune agence' },
                                                ...branches.map(b => ({ value: b.id, label: b.name }))
                                            ]}
                                        />

                                        <FormSelect
                                            label="Statut"
                                            value={editForm.data.status}
                                            onChange={(e) => editForm.setData('status', e.target.value)}
                                            error={editForm.errors.status}
                                            options={statusOptions.map(s => ({ value: s.value, label: s.label }))}
                                        />

                                        <div className="md:col-span-2 lg:col-span-3">
                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                                                Livraisons Assignées
                                            </label>
                                            <div className="max-h-60 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                                {shipments.length === 0 ? (
                                                    <p className="text-center text-sm text-slate-500">Aucune livraison disponible</p>
                                                ) : (
                                                    shipments.map((shipment) => (
                                                        <FormCheckbox
                                                            key={shipment.id}
                                                            label={`${shipmentLabel(shipment)} - ${shipment.recipient_name}`}
                                                            description=""
                                                            checked={(editForm.data.shipment_ids ?? []).includes(shipment.id)}
                                                            onChange={() => toggleShipment(editForm, shipment.id)}
                                                        />
                                                    ))
                                                )}
                                            </div>
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
                    emptyMessage="Aucune tournée enregistrée. Créez votre première tournée !"
                    emptyIcon={Icons.Routes}
                    actions={(run) => (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(run)}
                            >
                                Modifier
                            </Button>
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => deleteRun(run)}
                            >
                                Supprimer
                            </Button>
                        </>
                    )}
                />

                {/* Pagination */}
                {pagination.length > 0 && <Pagination links={pagination} />}
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={!!deletingRun}
                title="Supprimer la tournée"
                message={`Êtes-vous sûr de vouloir supprimer la tournée #${deletingRun?.id} ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                onConfirm={confirmDelete}
                onCancel={() => setDeletingRun(null)}
            />
        </AuthenticatedLayout>
    );
}
