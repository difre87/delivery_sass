import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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
    const flash = usePage().props.flash;
    const [editingFuelLogId, setEditingFuelLogId] = useState(null);
    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);
    const rows = fuelLogs?.data ?? [];
    const pagination = useMemo(() => fuelLogs?.links ?? [], [fuelLogs]);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('fuel.store'), { onSuccess: () => createForm.reset() });
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
        if (!confirm(`Supprimer le plein #${log.id} ?`)) return;
        router.delete(route('fuel.destroy', log.id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-slate-800">Carburant</h2>}>
            <Head title="Carburant" />
            <div className="space-y-6">
                {flash?.status && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{flash.status}</div>}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Nouveau plein</h3>
                    <form onSubmit={submitCreate} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Véhicule</label><select value={createForm.data.vehicle_id} onChange={(e) => createForm.setData('vehicle_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required><option value="">Choisir</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.plate_number}</option>)}</select></div>
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Tournée</label><select value={createForm.data.dispatch_run_id} onChange={(e) => createForm.setData('dispatch_run_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm"><option value="">Aucune</option>{runs.map((run) => <option key={run.id} value={run.id}>#{run.id} - {new Date(run.date).toLocaleDateString('fr-FR')}</option>)}</select></div>
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Date / heure</label><input type="datetime-local" value={createForm.data.filled_at} onChange={(e) => createForm.setData('filled_at', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Litres</label><input type="number" step="0.01" min="0.01" value={createForm.data.volume_liters} onChange={(e) => createForm.setData('volume_liters', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Montant (centimes)</label><input type="number" min="0" value={createForm.data.total_cents} onChange={(e) => createForm.setData('total_cents', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Odomètre (km)</label><input type="number" min="0" value={createForm.data.odometer_km} onChange={(e) => createForm.setData('odometer_km', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Station</label><input value={createForm.data.station_name} onChange={(e) => createForm.setData('station_name', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                        <div className="md:col-span-2 lg:col-span-3"><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Notes</label><textarea value={createForm.data.notes} onChange={(e) => createForm.setData('notes', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                        <div className="md:col-span-2 lg:col-span-3 flex justify-end"><button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Créer</button></div>
                    </form>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Historique carburant</h3>
                    {rows.length === 0 ? <p className="mt-4 text-sm text-slate-500">Aucun enregistrement.</p> : (
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="px-3 py-2">Date</th><th className="px-3 py-2">Véhicule</th><th className="px-3 py-2">Litres</th><th className="px-3 py-2">Montant</th><th className="px-3 py-2">Odomètre</th><th className="px-3 py-2">Actions</th></tr></thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rows.map((log) => (
                                        <tr key={log.id}>
                                            <td className="px-3 py-2 text-slate-700">{new Date(log.filled_at).toLocaleString('fr-FR')}</td>
                                            <td className="px-3 py-2 text-slate-700">{log.vehicle?.plate_number || '-'}</td>
                                            <td className="px-3 py-2 text-slate-700">{log.volume_liters} L</td>
                                            <td className="px-3 py-2 text-slate-700">{(log.total_cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                                            <td className="px-3 py-2 text-slate-700">{log.odometer_km || '-'} km</td>
                                            <td className="px-3 py-2"><div className="flex gap-3"><button type="button" onClick={() => startEdit(log)} className="text-xs font-semibold text-emerald-700">Modifier</button><button type="button" onClick={() => deleteFuelLog(log)} className="text-xs font-semibold text-rose-700">Supprimer</button></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">{pagination.map((link, index) => <Link key={`${link.label}-${index}`} href={link.url || '#'} preserveScroll className={`rounded-md border px-3 py-1.5 text-xs ${link.active ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>
                </section>

                {editingFuelLogId && (
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">Modifier plein</h3>
                        <form onSubmit={submitEdit} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Véhicule</label><select value={editForm.data.vehicle_id} onChange={(e) => editForm.setData('vehicle_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required><option value="">Choisir</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.plate_number}</option>)}</select></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Tournée</label><select value={editForm.data.dispatch_run_id} onChange={(e) => editForm.setData('dispatch_run_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm"><option value="">Aucune</option>{runs.map((run) => <option key={run.id} value={run.id}>#{run.id} - {new Date(run.date).toLocaleDateString('fr-FR')}</option>)}</select></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Date / heure</label><input type="datetime-local" value={editForm.data.filled_at} onChange={(e) => editForm.setData('filled_at', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Litres</label><input type="number" step="0.01" min="0.01" value={editForm.data.volume_liters} onChange={(e) => editForm.setData('volume_liters', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Montant (centimes)</label><input type="number" min="0" value={editForm.data.total_cents} onChange={(e) => editForm.setData('total_cents', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Odomètre (km)</label><input type="number" min="0" value={editForm.data.odometer_km} onChange={(e) => editForm.setData('odometer_km', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Station</label><input value={editForm.data.station_name} onChange={(e) => editForm.setData('station_name', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                            <div className="md:col-span-2 lg:col-span-3"><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Notes</label><textarea value={editForm.data.notes} onChange={(e) => editForm.setData('notes', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2"><button type="button" onClick={cancelEdit} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Annuler</button><button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Enregistrer</button></div>
                        </form>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
