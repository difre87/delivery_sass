import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const statusOptions = [
    'draft',
    'scheduled',
    'assigned',
    'in_transit',
    'delivered',
    'canceled',
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

const statusLabel = (status) => status?.replace('_', ' ');

export default function ShipmentsIndex({ shipments, clients, branches = [] }) {
    const flash = usePage().props.flash;
    const [editingShipmentId, setEditingShipmentId] = useState(null);

    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);

    const rows = shipments?.data ?? [];
    const pagination = useMemo(() => shipments?.links ?? [], [shipments]);

    const submitCreate = (e) => {
        e.preventDefault();

        createForm.post(route('shipments.store'), {
            onSuccess: () => createForm.reset(),
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

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-slate-800">Livraisons</h2>}
        >
            <Head title="Livraisons" />

            <div className="space-y-6">
                {flash?.status && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.status}
                    </div>
                )}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Nouvelle livraison</h3>
                    <form onSubmit={submitCreate} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Agence</label>
                            <select
                                value={createForm.data.branch_id}
                                onChange={(e) => createForm.setData('branch_id', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Aucune</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">N° de suivi</label>
                            <input
                                value={createForm.data.tracking_number}
                                onChange={(e) => createForm.setData('tracking_number', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            {createForm.errors.tracking_number && (
                                <p className="mt-1 text-xs text-rose-600">{createForm.errors.tracking_number}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Client</label>
                            <select
                                value={createForm.data.client_id}
                                onChange={(e) => createForm.setData('client_id', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Sans client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Destinataire</label>
                            <input
                                value={createForm.data.recipient_name}
                                onChange={(e) => createForm.setData('recipient_name', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            />
                            {createForm.errors.recipient_name && (
                                <p className="mt-1 text-xs text-rose-600">{createForm.errors.recipient_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Téléphone</label>
                            <input
                                value={createForm.data.recipient_phone}
                                onChange={(e) => createForm.setData('recipient_phone', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Adresse destinataire</label>
                            <textarea
                                value={createForm.data.recipient_address}
                                onChange={(e) => createForm.setData('recipient_address', e.target.value)}
                                rows={2}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Référence</label>
                            <input
                                value={createForm.data.reference}
                                onChange={(e) => createForm.setData('reference', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Statut</label>
                            <select
                                value={createForm.data.status}
                                onChange={(e) => createForm.setData('status', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>{statusLabel(status)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Prévue pour</label>
                            <input
                                type="datetime-local"
                                value={createForm.data.scheduled_for}
                                onChange={(e) => createForm.setData('scheduled_for', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Distance (km)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={createForm.data.distance_km}
                                onChange={(e) => createForm.setData('distance_km', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Coût (centimes)</label>
                            <input
                                type="number"
                                min="0"
                                value={createForm.data.cost_cents}
                                onChange={(e) => createForm.setData('cost_cents', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Prix (centimes)</label>
                            <input
                                type="number"
                                min="0"
                                value={createForm.data.price_cents}
                                onChange={(e) => createForm.setData('price_cents', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Notes</label>
                            <textarea
                                value={createForm.data.notes}
                                onChange={(e) => createForm.setData('notes', e.target.value)}
                                rows={3}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                Créer la livraison
                            </button>
                        </div>
                    </form>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Liste livraisons</h3>

                    {rows.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">Aucune livraison pour le moment.</p>
                    ) : (
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                                        <th className="px-3 py-2">Référence</th>
                                        <th className="px-3 py-2">Tracking</th>
                                        <th className="px-3 py-2">Agence</th>
                                        <th className="px-3 py-2">Client</th>
                                        <th className="px-3 py-2">Destinataire</th>
                                        <th className="px-3 py-2">Statut</th>
                                        <th className="px-3 py-2">Prévue</th>
                                        <th className="px-3 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rows.map((shipment) => (
                                        <tr key={shipment.id}>
                                            <td className="px-3 py-2 font-medium text-slate-900">{shipment.reference || `EXP-${shipment.id}`}</td>
                                            <td className="px-3 py-2 text-slate-600">{shipment.tracking_number || '-'}</td>
                                            <td className="px-3 py-2 text-slate-600">{shipment.branch?.name || '-'}</td>
                                            <td className="px-3 py-2 text-slate-600">{shipment.client?.name || '-'}</td>
                                            <td className="px-3 py-2 text-slate-600">{shipment.recipient_name}</td>
                                            <td className="px-3 py-2">
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-600">
                                                    {statusLabel(shipment.status)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-slate-600">
                                                {shipment.scheduled_for
                                                    ? new Date(shipment.scheduled_for).toLocaleString('fr-FR')
                                                    : '-'}
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(shipment)}
                                                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteShipment(shipment)}
                                                        className="text-xs font-semibold text-rose-700 hover:text-rose-800"
                                                    >
                                                        Supprimer
                                                    </button>
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
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url || '#'}
                                preserveScroll
                                className={`rounded-md border px-3 py-1.5 text-xs ${
                                    link.active
                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </section>

                {editingShipmentId && (
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">Modifier la livraison</h3>
                        <form onSubmit={submitEdit} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Agence</label>
                                <select
                                    value={editForm.data.branch_id}
                                    onChange={(e) => editForm.setData('branch_id', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">Aucune</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">N° de suivi</label>
                                <input
                                    value={editForm.data.tracking_number}
                                    onChange={(e) => editForm.setData('tracking_number', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                {editForm.errors.tracking_number && (
                                    <p className="mt-1 text-xs text-rose-600">{editForm.errors.tracking_number}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Client</label>
                                <select
                                    value={editForm.data.client_id}
                                    onChange={(e) => editForm.setData('client_id', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">Sans client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>{client.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Destinataire</label>
                                <input
                                    value={editForm.data.recipient_name}
                                    onChange={(e) => editForm.setData('recipient_name', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Téléphone</label>
                                <input
                                    value={editForm.data.recipient_phone}
                                    onChange={(e) => editForm.setData('recipient_phone', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Adresse destinataire</label>
                                <textarea
                                    value={editForm.data.recipient_address}
                                    onChange={(e) => editForm.setData('recipient_address', e.target.value)}
                                    rows={2}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Référence</label>
                                <input
                                    value={editForm.data.reference}
                                    onChange={(e) => editForm.setData('reference', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Statut</label>
                                <select
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>{statusLabel(status)}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Prévue pour</label>
                                <input
                                    type="datetime-local"
                                    value={editForm.data.scheduled_for}
                                    onChange={(e) => editForm.setData('scheduled_for', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Distance (km)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editForm.data.distance_km}
                                    onChange={(e) => editForm.setData('distance_km', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Coût (centimes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editForm.data.cost_cents}
                                    onChange={(e) => editForm.setData('cost_cents', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Prix (centimes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editForm.data.price_cents}
                                    onChange={(e) => editForm.setData('price_cents', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Notes</label>
                                <textarea
                                    value={editForm.data.notes}
                                    onChange={(e) => editForm.setData('notes', e.target.value)}
                                    rows={3}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
