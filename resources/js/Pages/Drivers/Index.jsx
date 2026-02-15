import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import FormCheckbox from '@/Components/FormCheckbox';
import Button from '@/Components/Button';
import DataTable from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import Alert from '@/Components/Alert';
import Badge from '@/Components/Badge';
import { Icons } from '@/Components/Icons';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initialForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
    is_active: true,
    vehicle_id: '',
};

const currentVehicle = (driver) => driver.vehicle_assignments?.[0]?.vehicle ?? null;

export default function DriversIndex({ drivers, vehicles = [] }) {
    const flash = usePage().props.flash;
    const [editingDriverId, setEditingDriverId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [assigningDriverId, setAssigningDriverId] = useState(null);

    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);
    const assignForm = useForm({ vehicle_id: '' });

    const rows = drivers?.data ?? [];
    const pagination = useMemo(() => drivers?.links ?? [], [drivers]);

    const vehicleOptions = [
        { value: '', label: 'Aucun véhicule' },
        ...vehicles.map(v => ({ 
            value: v.id, 
            label: v.make && v.model 
                ? `${v.plate_number} - ${v.make} ${v.model}` 
                : v.plate_number 
        }))
    ];

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('drivers.store'), {
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            },
        });
    };

    const startEdit = (driver) => {
        setEditingDriverId(driver.id);
        setShowCreateForm(false);
        editForm.setData({
            name: driver.name ?? '',
            email: driver.email ?? '',
            phone: driver.phone ?? '',
            password: '',
            is_active: Boolean(driver.is_active),
            vehicle_id: currentVehicle(driver)?.id ?? '',
        });
    };

    const cancelEdit = () => {
        setEditingDriverId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingDriverId) return;
        editForm.patch(route('drivers.update', editingDriverId), {
            onSuccess: () => cancelEdit(),
        });
    };

    const deleteDriver = (driver) => {
        if (!confirm(`Retirer le livreur "${driver.name}" ?`)) return;
        router.delete(route('drivers.destroy', driver.id));
    };

    const startAssign = (driver) => {
        setAssigningDriverId(driver.id);
        assignForm.setData('vehicle_id', currentVehicle(driver)?.id ?? '');
    };

    const cancelAssign = () => {
        setAssigningDriverId(null);
        assignForm.reset();
    };

    const submitAssign = (e) => {
        e.preventDefault();
        if (!assigningDriverId) return;
        assignForm.post(route('drivers.assign', assigningDriverId), {
            onSuccess: () => cancelAssign(),
        });
    };

    const unassign = (driver) => {
        if (!confirm(`Retirer le véhicule de "${driver.name}" ?`)) return;
        router.delete(route('drivers.unassign', driver.id));
    };

    const columns = [
        {
            key: 'name',
            label: 'Livreur',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white shadow-lg">
                        {row.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'phone',
            label: 'Téléphone',
            render: (row) => row.phone || '—',
        },
        {
            key: 'vehicle',
            label: 'Véhicule',
            render: (row) => {
                const vehicle = currentVehicle(row);
                return vehicle ? (
                    <div className="flex items-center gap-2">
                        <Icons.Fleet className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold text-slate-700">{vehicle.plate_number}</span>
                    </div>
                ) : (
                    <span className="text-slate-400">Non assigné</span>
                );
            },
        },
        {
            key: 'is_active',
            label: 'Statut',
            render: (row) => (
                <Badge variant={row.is_active ? 'success' : 'default'}>
                    <span className={`h-2 w-2 rounded-full ${row.is_active ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                    {row.is_active ? 'Actif' : 'Inactif'}
                </Badge>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 shadow-lg">
                            <Icons.Drivers className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold leading-tight text-slate-900">
                                Gestion des Livreurs
                            </h2>
                            <p className="text-sm text-slate-600">
                                {rows.length} livreur{rows.length > 1 ? 's' : ''} enregistré{rows.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        icon={Icons.Plus}
                        onClick={() => {
                            setShowCreateForm(!showCreateForm);
                            setEditingDriverId(null);
                        }}
                    >
                        {showCreateForm ? 'Annuler' : 'Nouveau livreur'}
                    </Button>
                </div>
            }
        >
            <Head title="Livreurs" />

            <div className="space-y-6">
                {flash?.status && <Alert type="success" message={flash.status} />}

                {/* Formulaire de création */}
                <AnimatePresence>
                    {showCreateForm && (
                        <motion.section
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-white to-indigo-50 p-6 shadow-xl"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-lg">
                                    <Icons.Plus className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Créer un nouveau livreur</h3>
                            </div>

                            <form onSubmit={submitCreate} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <FormInput
                                        label="Nom complet"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        error={createForm.errors.name}
                                        placeholder="Ex: Jean Dupont"
                                        required
                                        icon={Icons.Drivers}
                                    />

                                    <FormInput
                                        label="Email"
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        error={createForm.errors.email}
                                        placeholder="jean@example.com"
                                        required
                                    />

                                    <FormInput
                                        label="Téléphone"
                                        value={createForm.data.phone}
                                        onChange={(e) => createForm.setData('phone', e.target.value)}
                                        error={createForm.errors.phone}
                                        placeholder="+33 6 12 34 56 78"
                                    />

                                    <FormInput
                                        label="Mot de passe"
                                        type="password"
                                        value={createForm.data.password}
                                        onChange={(e) => createForm.setData('password', e.target.value)}
                                        error={createForm.errors.password}
                                        placeholder="••••••••"
                                        required
                                    />

                                    <FormSelect
                                        label="Véhicule initial"
                                        value={createForm.data.vehicle_id}
                                        onChange={(e) => createForm.setData('vehicle_id', e.target.value)}
                                        error={createForm.errors.vehicle_id}
                                        options={vehicleOptions}
                                        icon={Icons.Fleet}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-white/70 p-4">
                                    <FormCheckbox
                                        label="Livreur actif"
                                        description="Le livreur peut être assigné à des tournées"
                                        checked={createForm.data.is_active}
                                        onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                    />

                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setShowCreateForm(false)}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            icon={Icons.Check}
                                            isLoading={createForm.processing}
                                        >
                                            Créer le livreur
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Formulaire de modification */}
                <AnimatePresence>
                    {editingDriverId && (
                        <motion.section
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50 p-6 shadow-xl"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-2 shadow-lg">
                                    <Icons.Settings className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Modifier le livreur</h3>
                            </div>

                            <form onSubmit={submitEdit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <FormInput
                                        label="Nom complet"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        error={editForm.errors.name}
                                        required
                                        icon={Icons.Drivers}
                                    />

                                    <FormInput
                                        label="Email"
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                        error={editForm.errors.email}
                                        required
                                    />

                                    <FormInput
                                        label="Téléphone"
                                        value={editForm.data.phone}
                                        onChange={(e) => editForm.setData('phone', e.target.value)}
                                        error={editForm.errors.phone}
                                    />

                                    <FormInput
                                        label="Nouveau mot de passe"
                                        type="password"
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                        error={editForm.errors.password}
                                        placeholder="Laisser vide pour ne pas changer"
                                    />

                                    <FormSelect
                                        label="Véhicule"
                                        value={editForm.data.vehicle_id}
                                        onChange={(e) => editForm.setData('vehicle_id', e.target.value)}
                                        error={editForm.errors.vehicle_id}
                                        options={vehicleOptions}
                                        icon={Icons.Fleet}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-white/70 p-4">
                                    <FormCheckbox
                                        label="Livreur actif"
                                        description="Le livreur peut être assigné à des tournées"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                    />

                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={cancelEdit}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            icon={Icons.Check}
                                            isLoading={editForm.processing}
                                        >
                                            Enregistrer
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Attribution de véhicule */}
                <AnimatePresence>
                    {assigningDriverId && (
                        <motion.section
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-xl"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-lg">
                                    <Icons.Fleet className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Attribuer un véhicule</h3>
                            </div>

                            <form onSubmit={submitAssign} className="space-y-4">
                                <FormSelect
                                    label="Sélectionner un véhicule"
                                    value={assignForm.data.vehicle_id}
                                    onChange={(e) => assignForm.setData('vehicle_id', e.target.value)}
                                    error={assignForm.errors.vehicle_id}
                                    options={vehicleOptions.filter(v => v.value !== '')}
                                    icon={Icons.Fleet}
                                    required
                                />

                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={cancelAssign}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        icon={Icons.Check}
                                        isLoading={assignForm.processing}
                                    >
                                        Attribuer
                                    </Button>
                                </div>
                            </form>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Liste des livreurs */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="mb-4 flex items-center gap-3">
                        <Icons.Drivers className="h-5 w-5 text-slate-600" />
                        <h3 className="text-lg font-bold text-slate-900">Liste des livreurs</h3>
                    </div>

                    <DataTable
                        columns={columns}
                        data={rows}
                        emptyMessage="Aucun livreur enregistré. Créez-en un pour commencer !"
                        emptyIcon={Icons.Drivers}
                        actions={(row) => (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEdit(row)}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => startAssign(row)}
                                >
                                    Véhicule
                                </Button>
                                {currentVehicle(row) && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => unassign(row)}
                                    >
                                        Retirer
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => deleteDriver(row)}
                                >
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
        </AuthenticatedLayout>
    );
}
