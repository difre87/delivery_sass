import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const statusOptions = ['active', 'maintenance', 'inactive'];
const typeOptions = ['motorcycle', 'car', 'van', 'truck'];

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
    const flash = usePage().props.flash;
    const [editingVehicleId, setEditingVehicleId] = useState(null);

    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);

    const rows = vehicles?.data ?? [];
    const pagination = useMemo(() => vehicles?.links ?? [], [vehicles]);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('fleet.store'), { onSuccess: () => createForm.reset() });
    };

    const startEdit = (vehicle) => {
        setEditingVehicleId(vehicle.id);
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
        editForm.patch(route('fleet.update', editingVehicleId), { onSuccess: () => cancelEdit() });
    };

    const deleteVehicle = (vehicle) => {
        if (!confirm(`Supprimer le véhicule "${vehicle.plate_number}" ?`)) return;
        router.delete(route('fleet.destroy', vehicle.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-slate-800">Flotte</h2>}
        >
            <Head title="Flotte" />

            <div className="space-y-6">
                {flash?.status && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.status}
                    </div>
                )}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Nouveau véhicule</h3>
                    <form onSubmit={submitCreate} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Plaque</label>
                            <input
                                value={createForm.data.plate_number}
                                onChange={(e) => createForm.setData('plate_number', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm"
                                required
                            />
                            {createForm.errors.plate_number && <p className="mt-1 text-xs text-rose-600">{createForm.errors.plate_number}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Type</label>
                            <select value={createForm.data.type} onChange={(e) => createForm.setData('type', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm">
                                {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Agence</label>
                            <select value={createForm.data.branch_id} onChange={(e) => createForm.setData('branch_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm">
                                <option value="">Aucune</option>
                                {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Marque</label>
                            <input value={createForm.data.make} onChange={(e) => createForm.setData('make', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Modèle</label>
                            <input value={createForm.data.model} onChange={(e) => createForm.setData('model', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Année</label>
                            <input type="number" value={createForm.data.year} onChange={(e) => createForm.setData('year', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Carburant</label>
                            <input value={createForm.data.fuel_type} onChange={(e) => createForm.setData('fuel_type', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Statut</label>
                            <select value={createForm.data.status} onChange={(e) => createForm.setData('status', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm">
                                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Odomètre (km)</label>
                            <input type="number" min="0" value={createForm.data.current_odometer} onChange={(e) => createForm.setData('current_odometer', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                            <button type="submit" disabled={createForm.processing} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Créer</button>
                        </div>
                    </form>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Liste véhicules</h3>
                    {rows.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">Aucun véhicule.</p>
                    ) : (
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="px-3 py-2">Plaque</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Agence</th><th className="px-3 py-2">Statut</th><th className="px-3 py-2">Odomètre</th><th className="px-3 py-2">Actions</th></tr></thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rows.map((vehicle) => (
                                        <tr key={vehicle.id}>
                                            <td className="px-3 py-2 font-medium text-slate-900">{vehicle.plate_number}</td>
                                            <td className="px-3 py-2 text-slate-600">{vehicle.type || '-'}</td>
                                            <td className="px-3 py-2 text-slate-600">{vehicle.branch?.name || '-'}</td>
                                            <td className="px-3 py-2 text-slate-600">{vehicle.status}</td>
                                            <td className="px-3 py-2 text-slate-600">{vehicle.current_odometer ?? vehicle.odometer_km ?? 0} km</td>
                                            <td className="px-3 py-2"><div className="flex items-center gap-3"><button type="button" onClick={() => startEdit(vehicle)} className="text-xs font-semibold text-emerald-700">Modifier</button><button type="button" onClick={() => deleteVehicle(vehicle)} className="text-xs font-semibold text-rose-700">Supprimer</button></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {pagination.map((link, index) => (
                            <Link key={`${link.label}-${index}`} href={link.url || '#'} preserveScroll className={`rounded-md border px-3 py-1.5 text-xs ${link.active ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                </section>

                {editingVehicleId && (
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">Modifier véhicule</h3>
                        <form onSubmit={submitEdit} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Plaque</label><input value={editForm.data.plate_number} onChange={(e) => editForm.setData('plate_number', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Type</label><select value={editForm.data.type} onChange={(e) => editForm.setData('type', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm">{typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}</select></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Agence</label><select value={editForm.data.branch_id} onChange={(e) => editForm.setData('branch_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm"><option value="">Aucune</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Marque</label><input value={editForm.data.make} onChange={(e) => editForm.setData('make', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Modèle</label><input value={editForm.data.model} onChange={(e) => editForm.setData('model', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Année</label><input type="number" value={editForm.data.year} onChange={(e) => editForm.setData('year', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Carburant</label><input value={editForm.data.fuel_type} onChange={(e) => editForm.setData('fuel_type', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Statut</label><select value={editForm.data.status} onChange={(e) => editForm.setData('status', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm">{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Odomètre (km)</label><input type="number" min="0" value={editForm.data.current_odometer} onChange={(e) => editForm.setData('current_odometer', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2"><button type="button" onClick={cancelEdit} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Annuler</button><button type="submit" disabled={editForm.processing} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Enregistrer</button></div>
                        </form>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
