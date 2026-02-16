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
import ConfirmDialog from '@/Components/ConfirmDialog';
import Toast from '@/Components/Toast';
import { useCurrency } from '@/hooks/useCurrency';

const initialForm = {
    vehicle_id: '',
    dispatch_run_id: '',
    filled_at: '',
    station_name: '',
    volume_liters: '',
    total_cents: '',
    odometer_km: '',
    notes: '',
    receipt_photo: '',
};

export default function FuelIndex({ fuelLogs, vehicles = [], runs = [] }) {
    const flash = usePage<any>().props.flash;
    const currentCompany = usePage<any>().props.auth.currentCompany;
    const { formatCents, symbol } = useCurrency();
    const [editingFuelLogId, setEditingFuelLogId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deletingFuelLog, setDeletingFuelLog] = useState<any>(null);
    
    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);
    
    const rows = fuelLogs?.data ?? [];
    const pagination = useMemo(() => fuelLogs?.links ?? [], [fuelLogs]);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('fuel.store'), { 
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            } 
        });
    };

    const startEdit = (log) => {
        setEditingFuelLogId(log.id);
        editForm.setData({
            vehicle_id: log.vehicle_id ?? '',
            dispatch_run_id: log.dispatch_run_id ?? '',
            filled_at: log.filled_at ? log.filled_at.slice(0, 16) : '',
            station_name: log.station_name ?? '',
            volume_liters: log.volume_liters ?? '',
            total_cents: log.total_cents ?? '',
            odometer_km: log.odometer_km ?? '',
            notes: log.notes ?? '',
            receipt_photo: log.receipt_photo ?? '',
        });
    };

    const cancelEdit = () => {
        setEditingFuelLogId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingFuelLogId) return;
        editForm.patch(route('fuel.update', editingFuelLogId), { onSuccess: () => cancelEdit() });
    };

    const deleteFuelLog = (log) => {
        setDeletingFuelLog(log);
    };

    const confirmDelete = () => {
        if (deletingFuelLog) {
            router.delete(route('fuel.destroy', deletingFuelLog.id));
            setDeletingFuelLog(null);
        }
    };

    const columns = [
        { 
            key: 'filled_at', 
            label: 'Date & Heure',
            render: (log) => (
                <div>
                    <div className="font-medium text-slate-900">
                        {new Date(log.filled_at).toLocaleDateString('fr-FR', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                        })}
                    </div>
                    <div className="text-xs text-slate-500">
                        {new Date(log.filled_at).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </div>
                </div>
            )
        },
        { 
            key: 'vehicle', 
            label: 'Véhicule',
            render: (log) => (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-400 to-rose-500 text-white shadow-sm">
                        <Icons.Fleet className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-slate-900">
                        {log.vehicle?.plate_number || '-'}
                    </span>
                </div>
            )
        },
        { 
            key: 'station', 
            label: 'Station',
            render: (log) => log.station_name || '-'
        },
        { 
            key: 'volume', 
            label: 'Volume',
            render: (log) => (
                <div className="flex items-center gap-2">
                    <Icons.Fuel className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-slate-900">
                        {parseFloat(log.volume_liters).toFixed(2)} L
                    </span>
                </div>
            )
        },
        { 
            key: 'total', 
            label: 'Montant',
            render: (log) => (
                <div className="flex items-center gap-1">
                    <Icons.Currency className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-slate-900">
                        {formatCents(log.total_cents)}
                    </span>
                </div>
            )
        },
        { 
            key: 'price_per_liter', 
            label: 'Prix/L',
            render: (log) => {
                const pricePerLiter = log.total_cents / 100 / parseFloat(log.volume_liters);
                return (
                    <span className="text-sm text-slate-600">
                        {pricePerLiter.toFixed(3)} {symbol}/L
                    </span>
                );
            }
        },
        { 
            key: 'odometer', 
            label: 'Odomètre',
            render: (log) => log.odometer_km 
                ? `${parseInt(log.odometer_km).toLocaleString()} km`
                : '-'
        },
    ];

    // Calculate statistics
    const stats = useMemo(() => {
        const totalVolume = rows.reduce((sum, log) => sum + parseFloat(log.volume_liters || 0), 0);
        const totalCost = rows.reduce((sum, log) => sum + (log.total_cents || 0), 0);
        const avgPricePerLiter = totalVolume > 0 ? totalCost / 100 / totalVolume : 0;
        
        return {
            totalVolume: totalVolume.toFixed(2),
            totalCost: (totalCost / 100).toFixed(2),
            avgPricePerLiter: avgPricePerLiter.toFixed(3),
            count: rows.length,
        };
    }, [rows]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Carburant
                </h2>
            }
        >
            <Head title="Carburant" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-rose-500 shadow-lg">
                                <Icons.Fuel className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Carburant</h1>
                                <p className="text-sm text-slate-600">Suivi des pleins et consommation</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={route('export.fuel', { company: currentCompany.slug })}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md"
                        >
                            <Icons.Download className="h-4 w-4" />
                            <span>Exporter CSV</span>
                        </a>
                        <Button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            leftIcon={showCreateForm ? null : <Icons.Plus className="h-4 w-4" />}
                        >
                            {showCreateForm ? 'Annuler' : 'Nouveau Plein'}
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                {rows.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-red-50 p-2">
                                    <Icons.Fuel className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600">Volume Total</p>
                                    <p className="text-xl font-bold text-slate-900">{stats.totalVolume} L</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-emerald-50 p-2">
                                    <Icons.Currency className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600">Coût Total</p>
                                    <p className="text-xl font-bold text-slate-900">{stats.totalCost} {symbol}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-amber-50 p-2">
                                    <Icons.Fuel className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600">Prix Moyen/L</p>
                                    <p className="text-xl font-bold text-slate-900">{stats.avgPricePerLiter} {symbol}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <Icons.Fuel className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600">Nb. Pleins</p>
                                    <p className="text-xl font-bold text-slate-900">{stats.count}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                            <div className="overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-white to-red-50/30 shadow-lg">
                                <div className="border-b border-red-200 bg-gradient-to-r from-red-400 to-rose-500 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Icons.Fuel className="h-5 w-5 text-white" />
                                        <h3 className="font-semibold text-white">Nouveau Plein</h3>
                                    </div>
                                </div>
                                <form onSubmit={submitCreate} className="p-6">
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        <FormSelect
                                            label="Véhicule"
                                            value={createForm.data.vehicle_id}
                                            onChange={(e) => createForm.setData('vehicle_id', e.target.value)}
                                            error={createForm.errors.vehicle_id}
                                            required
                                            icon={Icons.Fleet}
                                            options={[
                                                { value: '', label: 'Choisir un véhicule' },
                                                ...vehicles.map(v => ({ value: v.id, label: v.plate_number }))
                                            ]}
                                        />

                                        <FormSelect
                                            label="Tournée (optionnel)"
                                            value={createForm.data.dispatch_run_id}
                                            onChange={(e) => createForm.setData('dispatch_run_id', e.target.value)}
                                            error={createForm.errors.dispatch_run_id}
                                            icon={Icons.Routes}
                                            options={[
                                                { value: '', label: 'Aucune tournée' },
                                                ...runs.map(r => ({ 
                                                    value: r.id, 
                                                    label: `Tournée #${r.id} - ${new Date(r.date).toLocaleDateString('fr-FR')}` 
                                                }))
                                            ]}
                                        />

                                        <FormInput
                                            label="Date & Heure"
                                            type="datetime-local"
                                            value={createForm.data.filled_at}
                                            onChange={(e) => createForm.setData('filled_at', e.target.value)}
                                            error={createForm.errors.filled_at}
                                            required
                                        />

                                        <FormInput
                                            label="Volume (Litres)"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={createForm.data.volume_liters}
                                            onChange={(e) => createForm.setData('volume_liters', e.target.value)}
                                            error={createForm.errors.volume_liters}
                                            required
                                            placeholder="0.00"
                                            icon={Icons.Fuel}
                                        />

                                        <FormInput
                                            label={`Montant (${symbol})`}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={createForm.data.total_cents ? (Number(createForm.data.total_cents) / 100).toFixed(2) : ''}
                                            onChange={(e) => createForm.setData('total_cents', String(Math.round(parseFloat(e.target.value || '0') * 100)))}
                                            error={createForm.errors.total_cents}
                                            required
                                            placeholder="0.00"
                                            icon={Icons.Currency}
                                        />

                                        <FormInput
                                            label="Odomètre (km)"
                                            type="number"
                                            min="0"
                                            value={createForm.data.odometer_km}
                                            onChange={(e) => createForm.setData('odometer_km', e.target.value)}
                                            error={createForm.errors.odometer_km}
                                            placeholder="Kilométrage actuel"
                                        />

                                        <div className="md:col-span-2 lg:col-span-3">
                                            <FormInput
                                                label="Station Service"
                                                value={createForm.data.station_name}
                                                onChange={(e) => createForm.setData('station_name', e.target.value)}
                                                error={createForm.errors.station_name}
                                                placeholder="Nom de la station"
                                            />
                                        </div>

                                        <div className="md:col-span-2 lg:col-span-3">
                                            <FormTextarea
                                                label="Notes"
                                                value={createForm.data.notes}
                                                onChange={(e) => createForm.setData('notes', e.target.value)}
                                                error={createForm.errors.notes}
                                                rows={2}
                                                placeholder="Remarques, détails supplémentaires..."
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
                                            Enregistrer le Plein
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
                    emptyMessage="Aucun plein enregistré. Commencez à suivre votre consommation !"
                    emptyIcon={Icons.Fuel}
                    actions={(log) => (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(log)}
                            >
                                Modifier
                            </Button>
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => deleteFuelLog(log)}
                            >
                                Supprimer
                            </Button>
                        </>
                    )}
                />

                {/* Pagination */}
                {pagination.length > 0 && <Pagination links={pagination} />}

                {/* Edit Form */}
                <AnimatePresence>
                    {editingFuelLogId && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-white to-red-50/30 shadow-lg">
                                <div className="border-b border-red-200 bg-gradient-to-r from-red-400 to-rose-500 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Icons.Fuel className="h-5 w-5 text-white" />
                                        <h3 className="font-semibold text-white">Modifier le Plein</h3>
                                    </div>
                                </div>
                                <form onSubmit={submitEdit} className="p-6">
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        <FormSelect
                                            label="Véhicule"
                                            value={editForm.data.vehicle_id}
                                            onChange={(e) => editForm.setData('vehicle_id', e.target.value)}
                                            error={editForm.errors.vehicle_id}
                                            required
                                            icon={Icons.Fleet}
                                            options={[
                                                { value: '', label: 'Choisir un véhicule' },
                                                ...vehicles.map(v => ({ value: v.id, label: v.plate_number }))
                                            ]}
                                        />

                                        <FormSelect
                                            label="Tournée (optionnel)"
                                            value={editForm.data.dispatch_run_id}
                                            onChange={(e) => editForm.setData('dispatch_run_id', e.target.value)}
                                            error={editForm.errors.dispatch_run_id}
                                            icon={Icons.Routes}
                                            options={[
                                                { value: '', label: 'Aucune tournée' },
                                                ...runs.map(r => ({ 
                                                    value: r.id, 
                                                    label: `Tournée #${r.id} - ${new Date(r.date).toLocaleDateString('fr-FR')}` 
                                                }))
                                            ]}
                                        />

                                        <FormInput
                                            label="Date & Heure"
                                            type="datetime-local"
                                            value={editForm.data.filled_at}
                                            onChange={(e) => editForm.setData('filled_at', e.target.value)}
                                            error={editForm.errors.filled_at}
                                            required
                                        />

                                        <FormInput
                                            label="Volume (Litres)"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={editForm.data.volume_liters}
                                            onChange={(e) => editForm.setData('volume_liters', e.target.value)}
                                            error={editForm.errors.volume_liters}
                                            required
                                            icon={Icons.Fuel}
                                        />

                                        <FormInput
                                            label={`Montant (${symbol})`}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={editForm.data.total_cents ? (Number(editForm.data.total_cents) / 100).toFixed(2) : ''}
                                            onChange={(e) => editForm.setData('total_cents', String(Math.round(parseFloat(e.target.value || '0') * 100)))}
                                            error={editForm.errors.total_cents}
                                            required
                                            icon={Icons.Currency}
                                        />

                                        <FormInput
                                            label="Odomètre (km)"
                                            type="number"
                                            min="0"
                                            value={editForm.data.odometer_km}
                                            onChange={(e) => editForm.setData('odometer_km', e.target.value)}
                                            error={editForm.errors.odometer_km}
                                        />

                                        <div className="md:col-span-2 lg:col-span-3">
                                            <FormInput
                                                label="Station Service"
                                                value={editForm.data.station_name}
                                                onChange={(e) => editForm.setData('station_name', e.target.value)}
                                                error={editForm.errors.station_name}
                                            />
                                        </div>

                                        <div className="md:col-span-2 lg:col-span-3">
                                            <FormTextarea
                                                label="Notes"
                                                value={editForm.data.notes}
                                                onChange={(e) => editForm.setData('notes', e.target.value)}
                                                error={editForm.errors.notes}
                                                rows={2}
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
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={!!deletingFuelLog}
                title="Supprimer le plein"
                message={deletingFuelLog ? `Êtes-vous sûr de vouloir supprimer le plein #${deletingFuelLog.id} ? Cette action est irréversible.` : ''}
                confirmText="Supprimer"
                onConfirm={confirmDelete}
                onCancel={() => setDeletingFuelLog(null)}
            />
        </AuthenticatedLayout>
    );
}
