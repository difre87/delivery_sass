import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const initialForm = {
    name: '',
    code: '',
    email: '',
    phone: '',
    notes: '',
    is_active: true,
};

export default function ClientsIndex({ clients }) {
    const flash = usePage().props.flash;
    const [editingClientId, setEditingClientId] = useState(null);

    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);

    const rows = clients?.data ?? [];

    const pagination = useMemo(() => clients?.links ?? [], [clients]);

    const submitCreate = (e) => {
        e.preventDefault();

        createForm.post(route('clients.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const startEdit = (client) => {
        setEditingClientId(client.id);
        editForm.setData({
            name: client.name ?? '',
            code: client.code ?? '',
            email: client.email ?? '',
            phone: client.phone ?? '',
            notes: client.notes ?? '',
            is_active: client.is_active,
        });
    };

    const cancelEdit = () => {
        setEditingClientId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();

        if (!editingClientId) return;

        editForm.patch(route('clients.update', editingClientId), {
            onSuccess: () => cancelEdit(),
        });
    };

    const deleteClient = (client) => {
        if (!confirm(`Supprimer le client "${client.name}" ?`)) return;

        router.delete(route('clients.destroy', client.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-slate-800">Clients</h2>}
        >
            <Head title="Clients" />

            <div className="space-y-6">
                {flash?.status && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.status}
                    </div>
                )}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Nouveau client</h3>
                    <form onSubmit={submitCreate} className="mt-4 grid gap-3 md:grid-cols-2">
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Nom
                            </label>
                            <input
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            />
                            {createForm.errors.name && (
                                <p className="mt-1 text-xs text-rose-600">{createForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Code
                            </label>
                            <input
                                value={createForm.data.code}
                                onChange={(e) => createForm.setData('code', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            {createForm.errors.code && (
                                <p className="mt-1 text-xs text-rose-600">{createForm.errors.code}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Email
                            </label>
                            <input
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Téléphone
                            </label>
                            <input
                                value={createForm.data.phone}
                                onChange={(e) => createForm.setData('phone', e.target.value)}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Notes
                            </label>
                            <textarea
                                value={createForm.data.notes}
                                onChange={(e) => createForm.setData('notes', e.target.value)}
                                rows={3}
                                className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between">
                            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={createForm.data.is_active}
                                    onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                Client actif
                            </label>

                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                Créer le client
                            </button>
                        </div>
                    </form>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">Liste clients</h3>

                    {rows.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">Aucun client pour le moment.</p>
                    ) : (
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                                        <th className="px-3 py-2">Nom</th>
                                        <th className="px-3 py-2">Code</th>
                                        <th className="px-3 py-2">Email</th>
                                        <th className="px-3 py-2">Téléphone</th>
                                        <th className="px-3 py-2">Statut</th>
                                        <th className="px-3 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rows.map((client) => (
                                        <tr key={client.id}>
                                            <td className="px-3 py-2 font-medium text-slate-900">{client.name}</td>
                                            <td className="px-3 py-2 text-slate-600">{client.code || '-'}</td>
                                            <td className="px-3 py-2 text-slate-600">{client.email || '-'}</td>
                                            <td className="px-3 py-2 text-slate-600">{client.phone || '-'}</td>
                                            <td className="px-3 py-2">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${
                                                        client.is_active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    {client.is_active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(client)}
                                                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteClient(client)}
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

                {editingClientId && (
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">Modifier le client</h3>
                        <form onSubmit={submitEdit} className="mt-4 grid gap-3 md:grid-cols-2">
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Nom
                                </label>
                                <input
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="mt-1 text-xs text-rose-600">{editForm.errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Code
                                </label>
                                <input
                                    value={editForm.data.code}
                                    onChange={(e) => editForm.setData('code', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                {editForm.errors.code && (
                                    <p className="mt-1 text-xs text-rose-600">{editForm.errors.code}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Téléphone
                                </label>
                                <input
                                    value={editForm.data.phone}
                                    onChange={(e) => editForm.setData('phone', e.target.value)}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Notes
                                </label>
                                <textarea
                                    value={editForm.data.notes}
                                    onChange={(e) => editForm.setData('notes', e.target.value)}
                                    rows={3}
                                    className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-center justify-between">
                                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    Client actif
                                </label>

                                <div className="flex gap-2">
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
                            </div>
                        </form>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
