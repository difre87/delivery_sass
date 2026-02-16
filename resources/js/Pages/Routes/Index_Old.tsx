import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const statusOptions = ['planned', 'in_progress', 'completed'];
const initialForm = { branch_id: '', driver_id: '', vehicle_id: '', date: '', status: 'planned', shipment_ids: [] };
const getDateInputValue = (value) => (value ? String(value).slice(0, 10) : '');
const shipmentLabel = (shipment) => shipment.reference || shipment.tracking_number || `EXP-${shipment.id}`;

export default function RoutesIndex({ runs, branches = [], vehicles = [], drivers = [], shipments = [] }) {
    const flash = usePage().props.flash;
    const [editingRunId, setEditingRunId] = useState(null);
    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);
    const rows = runs?.data ?? [];
    const pagination = useMemo(() => runs?.links ?? [], [runs]);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('routes.store'), { onSuccess: () => createForm.reset() });
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
        editForm.patch(route('routes.update', editingRunId), { onSuccess: () => cancelEdit() });
    };

    const deleteRun = (run) => {
        if (!confirm(`Supprimer la tournée #${run.id} ?`)) return;
        router.delete(route('routes.destroy', run.id));
    };

    const toggleShipment = (form, shipmentId) => {
        const currentIds = form.data.shipment_ids ?? [];
        const nextIds = currentIds.includes(shipmentId)
            ? currentIds.filter((id) => id !== shipmentId)
            : [...currentIds, shipmentId];

        form.setData('shipment_ids', nextIds);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-slate-800">Tournées</h2>}>
            <Head title="Tournées" />
            <div className="space-y-6">
                {flash?.status && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{flash.status}</div>}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Nouvelle tournée</h3>
                    <form onSubmit={submitCreate} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Date</label><input type="date" value={createForm.data.date} onChange={(e) => createForm.setData('date', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Driver</label><select value={createForm.data.driver_id} onChange={(e) => createForm.setData('driver_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required><option value="">Choisir</option>{drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}</select></div>
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Véhicule</label><select value={createForm.data.vehicle_id} onChange={(e) => createForm.setData('vehicle_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm"><option value="">Aucun</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.plate_number}</option>)}</select></div>
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Agence</label><select value={createForm.data.branch_id} onChange={(e) => createForm.setData('branch_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm"><option value="">Aucune</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></div>
                        <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Statut</label><select value={createForm.data.status} onChange={(e) => createForm.setData('status', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm">{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Livraisons du jour</label>
                            <div className="mt-2 max-h-44 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                                {shipments.length === 0 && <p className="text-xs text-slate-500">Aucune livraison disponible.</p>}
                                {shipments.map((shipment) => (
                                    <label key={shipment.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={(createForm.data.shipment_ids ?? []).includes(shipment.id)}
                                            onChange={() => toggleShipment(createForm, shipment.id)}
                                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span>{shipmentLabel(shipment)} - {shipment.recipient_name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 flex justify-end"><button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Créer</button></div>
                    </form>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Liste tournées</h3>
                    {rows.length === 0 ? <p className="mt-4 text-sm text-slate-500">Aucune tournée.</p> : (
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="px-3 py-2">Date</th><th className="px-3 py-2">Driver</th><th className="px-3 py-2">Véhicule</th><th className="px-3 py-2">Agence</th><th className="px-3 py-2">Livraisons</th><th className="px-3 py-2">Statut</th><th className="px-3 py-2">Actions</th></tr></thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rows.map((run) => (
                                        <tr key={run.id}>
                                            <td className="px-3 py-2 text-slate-700">{new Date(run.date).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-3 py-2 text-slate-700">{run.driver?.name || '-'}</td>
                                            <td className="px-3 py-2 text-slate-700">{run.vehicle?.plate_number || '-'}</td>
                                            <td className="px-3 py-2 text-slate-700">{run.branch?.name || '-'}</td>
                                            <td className="px-3 py-2 text-slate-700">{run.shipments_count ?? run.shipments?.length ?? 0}</td>
                                            <td className="px-3 py-2 text-slate-700">{run.status}</td>
                                            <td className="px-3 py-2"><div className="flex gap-3"><button type="button" onClick={() => startEdit(run)} className="text-xs font-semibold text-emerald-700">Modifier</button><button type="button" onClick={() => deleteRun(run)} className="text-xs font-semibold text-rose-700">Supprimer</button></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">{pagination.map((link, index) => <Link key={`${link.label}-${index}`} href={link.url || '#'} preserveScroll className={`rounded-md border px-3 py-1.5 text-xs ${link.active ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>
                </section>

                {editingRunId && (
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">Modifier tournée</h3>
                        <form onSubmit={submitEdit} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Date</label><input type="date" value={editForm.data.date} onChange={(e) => editForm.setData('date', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Driver</label><select value={editForm.data.driver_id} onChange={(e) => editForm.setData('driver_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required><option value="">Choisir</option>{drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}</select></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Véhicule</label><select value={editForm.data.vehicle_id} onChange={(e) => editForm.setData('vehicle_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm"><option value="">Aucun</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.plate_number}</option>)}</select></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Agence</label><select value={editForm.data.branch_id} onChange={(e) => editForm.setData('branch_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm"><option value="">Aucune</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Statut</label><select value={editForm.data.status} onChange={(e) => editForm.setData('status', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm">{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Livraisons assignées</label>
                                <div className="mt-2 max-h-44 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                                    {shipments.length === 0 && <p className="text-xs text-slate-500">Aucune livraison disponible.</p>}
                                    {shipments.map((shipment) => (
                                        <label key={shipment.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={(editForm.data.shipment_ids ?? []).includes(shipment.id)}
                                                onChange={() => toggleShipment(editForm, shipment.id)}
                                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span>{shipmentLabel(shipment)} - {shipment.recipient_name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2"><button type="button" onClick={cancelEdit} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Annuler</button><button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Enregistrer</button></div>
                        </form>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
