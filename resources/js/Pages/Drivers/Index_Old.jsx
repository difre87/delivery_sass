import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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
    const [assigningDriverId, setAssigningDriverId] = useState(null);

    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);
    const assignForm = useForm({ vehicle_id: '' });

    const rows = drivers?.data ?? [];
    const pagination = useMemo(() => drivers?.links ?? [], [drivers]);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('drivers.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const startEdit = (driver) => {
        setEditingDriverId(driver.id);
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

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-slate-800">Livreurs</h2>}
        >
            <Head title="Livreurs" />

            <div className="space-y-6">
                {flash?.status && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.status}
                    </div>
                )}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Nouveau livreur</h3>
                    <form onSubmit={submitCreate} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Nom</label>
                            <input value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</label>
                            <input type="email" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required />
                            {createForm.errors.email && <p className="mt-1 text-xs text-rose-600">{createForm.errors.email}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Téléphone</label>
                            <input value={createForm.data.phone} onChange={(e) => createForm.setData('phone', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Mot de passe</label>
                            <input type="password" value={createForm.data.password} onChange={(e) => createForm.setData('password', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Véhicule initial</label>
                            <select value={createForm.data.vehicle_id} onChange={(e) => createForm.setData('vehicle_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm">
                                <option value="">Aucun</option>
                                {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.plate_number}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                <input type="checkbox" checked={createForm.data.is_active} onChange={(e) => createForm.setData('is_active', e.target.checked)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                                Livreur actif
                            </label>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                            <button type="submit" disabled={createForm.processing} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Créer</button>
                        </div>
                    </form>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Liste livreurs</h3>
                    {rows.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">Aucun livreur.</p>
                    ) : (
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                                        <th className="px-3 py-2">Nom</th>
                                        <th className="px-3 py-2">Email</th>
                                        <th className="px-3 py-2">Téléphone</th>
                                        <th className="px-3 py-2">Véhicule actuel</th>
                                        <th className="px-3 py-2">Statut</th>
                                        <th className="px-3 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rows.map((driver) => (
                                        <tr key={driver.id}>
                                            <td className="px-3 py-2 font-medium text-slate-900">{driver.name}</td>
                                            <td className="px-3 py-2 text-slate-600">{driver.email}</td>
                                            <td className="px-3 py-2 text-slate-600">{driver.phone || '-'}</td>
                                            <td className="px-3 py-2 text-slate-600">{currentVehicle(driver)?.plate_number || '-'}</td>
                                            <td className="px-3 py-2">
                                                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${driver.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {driver.is_active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <button type="button" onClick={() => startEdit(driver)} className="text-xs font-semibold text-emerald-700">Modifier</button>
                                                    <button type="button" onClick={() => startAssign(driver)} className="text-xs font-semibold text-indigo-700">Attribuer véhicule</button>
                                                    {currentVehicle(driver) && <button type="button" onClick={() => unassign(driver)} className="text-xs font-semibold text-amber-700">Retirer véhicule</button>}
                                                    <button type="button" onClick={() => deleteDriver(driver)} className="text-xs font-semibold text-rose-700">Retirer</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {pagination.map((link, index) => (
                            <Link key={`${link.label}-${index}`} href={link.url || '#'} preserveScroll className={`rounded-md border px-3 py-1.5 text-xs ${link.active ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                </section>

                {editingDriverId && (
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">Modifier livreur</h3>
                        <form onSubmit={submitEdit} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Nom</label><input value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</label><input type="email" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Téléphone</label><input value={editForm.data.phone} onChange={(e) => editForm.setData('phone', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Nouveau mot de passe (optionnel)</label><input type="password" value={editForm.data.password} onChange={(e) => editForm.setData('password', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" /></div>
                            <div><label className="text-xs font-medium uppercase tracking-wide text-slate-500">Véhicule</label><select value={editForm.data.vehicle_id} onChange={(e) => editForm.setData('vehicle_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm"><option value="">Aucun</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.plate_number}</option>)}</select></div>
                            <div className="flex items-end"><label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={editForm.data.is_active} onChange={(e) => editForm.setData('is_active', e.target.checked)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" /> Livreur actif</label></div>
                            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2"><button type="button" onClick={cancelEdit} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Annuler</button><button type="submit" disabled={editForm.processing} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Enregistrer</button></div>
                        </form>
                    </section>
                )}

                {assigningDriverId && (
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">Attribuer un véhicule</h3>
                        <form onSubmit={submitAssign} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="w-full sm:max-w-sm">
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Véhicule</label>
                                <select value={assignForm.data.vehicle_id} onChange={(e) => assignForm.setData('vehicle_id', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 text-sm" required>
                                    <option value="">Choisir</option>
                                    {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.plate_number}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={cancelAssign} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Annuler</button>
                                <button type="submit" disabled={assignForm.processing} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Attribuer</button>
                            </div>
                        </form>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
