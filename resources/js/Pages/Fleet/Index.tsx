import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import Button from '@/Components/Button';
import DataTable from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Toast from '@/Components/Toast';
import Badge from '@/Components/Badge';
import { Icons } from '@/Components/Icons';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'maintenance', label: 'En maintenance' },
    { value: 'inactive', label: 'Inactif' },
];

const typeOptions = [
    { value: 'motorcycle', label: '🏍️ Moto' },
    { value: 'car', label: '🚗 Voiture' },
    { value: 'van', label: '🚐 Camionnette' },
    { value: 'truck', label: '🚚 Camion' },
];

const initialForm = {
    branch_id: '',
    type: 'van',
    plate_number: '',
    make: '',
    model: '',
    year: '',
    fuel_type: '',
    status: 'active',
    current_odometer: 0,
};

export default function FleetIndex({ vehicles, branches = [] }) {
    const flash = usePage<any>().props.flash;
    const currentCompany = usePage<any>().props.auth.currentCompany;
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deletingVehicle, setDeletingVehicle] = useState<any>(null);

    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);

    const rows = vehicles?.data ?? [];
    const pagination = useMemo(() => vehicles?.links ?? [], [vehicles]);

    const branchOptions = [
        { value: '', label: 'Aucune agence' },
        ...branches.map(b => ({ value: b.id, label: b.name }))
    ];

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('fleet.store', { company: currentCompany.slug }), { 
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            }
        });
    };

    const startEdit = (vehicle) => {
        setEditingVehicleId(vehicle.id);
        setShowCreateForm(false);
        editForm.setData({
            branch_id: vehicle.branch_id ?? '',
            type: vehicle.type ?? 'van',
            plate_number: vehicle.plate_number ?? '',
            make: vehicle.make ?? '',
            model: vehicle.model ?? '',
            year: vehicle.year ?? '',
            fuel_type: vehicle.fuel_type ?? '',
            status: vehicle.status ?? 'active',
            current_odometer: vehicle.current_odometer ?? vehicle.odometer_km ?? 0,
        });
    };

    const cancelEdit = () => {
        setEditingVehicleId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingVehicleId) return;
        editForm.patch(route('fleet.update', { company: currentCompany.slug, vehicle: editingVehicleId }), { onSuccess: () => cancelEdit() });
    };

    const deleteVehicle = (vehicle) => {
        setDeletingVehicle(vehicle);
    };

    const confirmDelete = () => {
        if (deletingVehicle) {
            router.delete(route('fleet.destroy', { company: currentCompany.slug, vehicle: deletingVehicle.id }));
            setDeletingVehicle(null);
        }
    };

    const columns = [
        {
            key: 'plate_number',
            label: 'Véhicule',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-lg shadow-lg">
                        {row.type === 'motorcycle' ? '🏍️' : row.type === 'car' ? '🚗' : row.type === 'van' ? '🚐' : '🚚'}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{row.plate_number}</p>
                        <p className="text-xs text-slate-500">{row.make} {row.model}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (row) => (
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {typeOptions.find(t => t.value === row.type)?.label || row.type}
                </span>
            ),
        },
        {
            key: 'year',
            label: 'Année',
            render: (row) => row.year || '—',
        },
        {
            key: 'odometer',
            label: 'Kilométrage',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Icons.Routes className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold">{row.current_odometer || row.odometer_km || 0} km</span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Statut',
            render: (row) => (
                <Badge variant={row.status === 'active' ? 'success' : row.status === 'maintenance' ? 'warning' : 'default'}>
                    <span className={`h-2 w-2 rounded-full ${row.status === 'active' ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                    {statusOptions.find(s => s.value === row.status)?.label || row.status}
                </Badge>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 shadow-lg">
                            <Icons.Fleet className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold leading-tight text-slate-900">
                                Gestion de la Flotte
                            </h2>
                            <p className="text-sm text-slate-600">
                                {rows.length} véhicule{rows.length > 1 ? 's' : ''} enregistré{rows.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={route('export.vehicles', { company: currentCompany.slug })}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md"
                        >
                            <Icons.Download className="h-4 w-4" />
                            <span>Exporter CSV</span>
                        </a>
                        <Button
                            variant="primary"
                            icon={Icons.Plus}
                            onClick={() => {
                                setShowCreateForm(!showCreateForm);
                                setEditingVehicleId(null);
                            }}
                        >
                            {showCreateForm ? 'Annuler' : 'Nouveau véhicule'}
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Flotte" />

            <div className="space-y-6">
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

                <AnimatePresence>
                    {showCreateForm && (
                        <motion.section
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-xl"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-lg">
                                    <Icons.Plus className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Ajouter un véhicule</h3>
                            </div>

                            <form onSubmit={submitCreate} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <FormInput
                                        label="Plaque d'immatriculation"
                                        value={createForm.data.plate_number}
                                        onChange={(e) => createForm.setData('plate_number', e.target.value)}
                                        error={createForm.errors.plate_number}
                                        placeholder="AA-123-BB"
                                        required
                                        icon={Icons.Fleet}
                                    />

                                    <FormSelect
                                        label="Type de véhicule"
                                        value={createForm.data.type}
                                        onChange={(e) => createForm.setData('type', e.target.value)}
                                        error={createForm.errors.type}
                                        options={typeOptions}
                                    />

                                    <FormSelect
                                        label="Agence"
                                        value={createForm.data.branch_id}
                                        onChange={(e) => createForm.setData('branch_id', e.target.value)}
                                        error={createForm.errors.branch_id}
                                        options={branchOptions}
                                    />

                                    <FormInput
                                        label="Marque"
                                        value={createForm.data.make}
                                        onChange={(e) => createForm.setData('make', e.target.value)}
                                        error={createForm.errors.make}
                                        placeholder="Ex: Renault"
                                    />

                                    <FormInput
                                        label="Modèle"
                                        value={createForm.data.model}
                                        onChange={(e) => createForm.setData('model', e.target.value)}
                                        error={createForm.errors.model}
                                        placeholder="Ex: Master"
                                    />

                                    <FormInput
                                        label="Année"
                                        type="number"
                                        value={createForm.data.year}
                                        onChange={(e) => createForm.setData('year', e.target.value)}
                                        error={createForm.errors.year}
                                        placeholder="2024"
                                    />

                                    <FormInput
                                        label="Type de carburant"
                                        value={createForm.data.fuel_type}
                                        onChange={(e) => createForm.setData('fuel_type', e.target.value)}
                                        error={createForm.errors.fuel_type}
                                        placeholder="Diesel, Essence, Électrique"
                                        icon={Icons.Fuel}
                                    />

                                    <FormSelect
                                        label="Statut"
                                        value={createForm.data.status}
                                        onChange={(e) => createForm.setData('status', e.target.value)}
                                        error={createForm.errors.status}
                                        options={statusOptions}
                                    />

                                    <FormInput
                                        label="Kilométrage actuel"
                                        type="number"
                                        min="0"
                                        value={createForm.data.current_odometer}
                                        onChange={(e) => createForm.setData('current_odometer', e.target.value)}
                                        error={createForm.errors.current_odometer}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 rounded-xl bg-white/70 p-4">
                                    <Button type="button" variant="secondary" onClick={() => setShowCreateForm(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" variant="primary" icon={Icons.Check} isLoading={createForm.processing}>
                                        Créer le véhicule
                                    </Button>
                                </div>
                            </form>
                        </motion.section>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {editingVehicleId && (
                        <motion.section
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-white to-teal-50 p-6 shadow-xl"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 p-2 shadow-lg">
                                    <Icons.Settings className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Modifier le véhicule</h3>
                            </div>

                            <form onSubmit={submitEdit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <FormInput
                                        label="Plaque d'immatriculation"
                                        value={editForm.data.plate_number}
                                        onChange={(e) => editForm.setData('plate_number', e.target.value)}
                                        error={editForm.errors.plate_number}
                                        required
                                        icon={Icons.Fleet}
                                    />

                                    <FormSelect
                                        label="Type"
                                        value={editForm.data.type}
                                        onChange={(e) => editForm.setData('type', e.target.value)}
                                        error={editForm.errors.type}
                                        options={typeOptions}
                                    />

                                    <FormSelect
                                        label="Agence"
                                        value={editForm.data.branch_id}
                                        onChange={(e) => editForm.setData('branch_id', e.target.value)}
                                        error={editForm.errors.branch_id}
                                        options={branchOptions}
                                    />

                                    <FormInput
                                        label="Marque"
                                        value={editForm.data.make}
                                        onChange={(e) => editForm.setData('make', e.target.value)}
                                        error={editForm.errors.make}
                                    />

                                    <FormInput
                                        label="Modèle"
                                        value={editForm.data.model}
                                        onChange={(e) => editForm.setData('model', e.target.value)}
                                        error={editForm.errors.model}
                                    />

                                    <FormInput
                                        label="Année"
                                        type="number"
                                        value={editForm.data.year}
                                        onChange={(e) => editForm.setData('year', e.target.value)}
                                        error={editForm.errors.year}
                                    />

                                    <FormInput
                                        label="Type de carburant"
                                        value={editForm.data.fuel_type}
                                        onChange={(e) => editForm.setData('fuel_type', e.target.value)}
                                        error={editForm.errors.fuel_type}
                                        icon={Icons.Fuel}
                                    />

                                    <FormSelect
                                        label="Statut"
                                        value={editForm.data.status}
                                        onChange={(e) => editForm.setData('status', e.target.value)}
                                        error={editForm.errors.status}
                                        options={statusOptions}
                                    />

                                    <FormInput
                                        label="Kilométrage"
                                        type="number"
                                        min="0"
                                        value={editForm.data.current_odometer}
                                        onChange={(e) => editForm.setData('current_odometer', e.target.value)}
                                        error={editForm.errors.current_odometer}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 rounded-xl bg-white/70 p-4">
                                    <Button type="button" variant="secondary" onClick={cancelEdit}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" variant="primary" icon={Icons.Check} isLoading={editForm.processing}>
                                        Enregistrer
                                    </Button>
                                </div>
                            </form>
                        </motion.section>
                    )}
                </AnimatePresence>

                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <div className="mb-4 flex items-center gap-3">
                        <Icons.Fleet className="h-5 w-5 text-slate-600" />
                        <h3 className="text-lg font-bold text-slate-900">Liste des véhicules</h3>
                    </div>

                    <DataTable
                        columns={columns}
                        data={rows}
                        emptyMessage="Aucun véhicule enregistré. Ajoutez-en un pour commencer !"
                        emptyIcon={Icons.Fleet}
                        actions={(row) => (
                            <>
                                <Button size="sm" variant="outline" onClick={() => startEdit(row)}>
                                    Modifier
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => deleteVehicle(row)}>
                                    Supprimer
                                </Button>
                            </>
                        )}
                    />

                    {pagination.length > 3 && (
                        <div className="mt-6">
                            <Pagination links={pagination} />
                        </div>
                    )}
                </motion.section>
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={!!deletingVehicle}
                title="Supprimer le véhicule"
                message={deletingVehicle ? `Êtes-vous sûr de vouloir supprimer le véhicule "${deletingVehicle.plate_number}" ? Cette action est irréversible.` : ''}
                confirmText="Supprimer"
                onConfirm={confirmDelete}
                onCancel={() => setDeletingVehicle(null)}
            />
        </AuthenticatedLayout>
    );
}

