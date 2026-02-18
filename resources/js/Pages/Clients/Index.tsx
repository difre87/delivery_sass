import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import FormTextarea from '@/Components/FormTextarea';
import FormCheckbox from '@/Components/FormCheckbox';
import Button from '@/Components/Button';
import DataTable from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Toast from '@/Components/Toast';
import { Icons } from '@/Components/Icons';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const initialCreateForm = {
    name: '',
    code: '',
    email: '',
    phone: '',
    notes: '',
    is_active: true,
};

const initialEditForm = {
    name: '',
    code: '',
    email: '',
    phone: '',
    branch_id: '',
    notes: '',
    is_active: true,
};

export default function ClientsIndex({ clients, branches = [] }) {
    const page = usePage<any>();
    const { currentCompany } = page.props.auth;
    const flash = page.props.flash;
    const [editingClientId, setEditingClientId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deletingClient, setDeletingClient] = useState<any>(null);

    const createForm = useForm(initialCreateForm);
    const editForm = useForm(initialEditForm);

    const rows = clients?.data ?? [];
    const pagination = useMemo(() => clients?.links ?? [], [clients]);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('clients.store', { company: currentCompany.slug }), {
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            },
        });
    };

    const startEdit = (client) => {
        setEditingClientId(client.id);
        setShowCreateForm(false);
        editForm.setData({
            name: client.name ?? '',
            code: client.code ?? '',
            email: client.email ?? '',
            phone: client.phone ?? '',
            branch_id: client.branch_id ?? '',
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

        editForm.patch(route('clients.update', { company: currentCompany.slug, clientId: editingClientId }), {
            onSuccess: () => cancelEdit(),
        });
    };

    const deleteClient = (client) => {
        setDeletingClient(client);
    };

    const confirmDelete = () => {
        if (!deletingClient) return;
        router.delete(route('clients.destroy', { company: currentCompany.slug, clientId: deletingClient.id }), {
            onSuccess: () => setDeletingClient(null),
            onError: () => setDeletingClient(null)
        });
    };

    const columns = [
        {
            key: 'name',
            label: 'Nom',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-bold text-white shadow-lg">
                        {row.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900">{row.name}</span>
                </div>
            ),
        },
        {
            key: 'code',
            label: 'Code',
            render: (row) => (
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {row.code || '—'}
                </span>
            ),
        },
        {
            key: 'branch',
            label: 'Agence',
            render: (row) => (
                row.branch ? (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {row.branch.name}
                    </span>
                ) : (
                    <span className="text-slate-400">—</span>
                )
            ),
        },
        {
            key: 'email',
            label: 'Email',
            render: (row) => (
                <a href={`mailto:${row.email}`} className="flex items-center gap-2 text-slate-600 hover:text-emerald-600">
                    {row.email && <Icons.Currency className="h-4 w-4" />}
                    {row.email || '—'}
                </a>
            ),
        },
        {
            key: 'phone',
            label: 'Téléphone',
            render: (row) => row.phone || '—',
        },
        {
            key: 'is_active',
            label: 'Statut',
            render: (row) => (
                <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                        row.is_active
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                    }`}
                >
                    <span className={`h-2 w-2 rounded-full ${row.is_active ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                    {row.is_active ? 'Actif' : 'Inactif'}
                </span>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 shadow-lg">
                            <Icons.Clients className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold leading-tight text-slate-900">
                                Gestion des Clients
                            </h2>
                            <p className="text-sm text-slate-600">
                                {rows.length} client{rows.length > 1 ? 's' : ''} enregistré{rows.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={route('export.clients', { company: currentCompany.slug })}
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
                                setEditingClientId(null);
                            }}
                        >
                            {showCreateForm ? 'Annuler' : 'Nouveau client'}
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Clients" />

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

                {/* Formulaire de création */}
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
                                <h3 className="text-lg font-bold text-slate-900">Créer un nouveau client</h3>
                            </div>

                            <form onSubmit={submitCreate} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <FormInput
                                        label="Nom du client"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        error={createForm.errors.name}
                                        placeholder="Ex: Transport Dupont"
                                        required
                                        icon={Icons.Clients}
                                        helperText={null}
                                    />

                                    <FormInput
                                        label="Code client"
                                        value={createForm.data.code}
                                        onChange={(e) => createForm.setData('code', e.target.value)}
                                        error={createForm.errors.code}
                                        placeholder="Généré automatiquement"
                                        disabled
                                        helperText="Le code sera généré automatiquement au format CL-YYYY-NNNN"
                                        icon={null}
                                    />

                                    <FormInput
                                        label="Email"
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        error={createForm.errors.email}
                                        placeholder="contact@example.com"
                                        helperText={null}
                                        icon={null}
                                    />

                                    <FormInput
                                        label="Téléphone"
                                        value={createForm.data.phone}
                                        onChange={(e) => createForm.setData('phone', e.target.value)}
                                        error={createForm.errors.phone}
                                        placeholder="+33 1 23 45 67 89"
                                        helperText={null}
                                        icon={null}
                                    />
                                </div>

                                <FormTextarea
                                    label="Notes"
                                    value={createForm.data.notes}
                                    onChange={(e) => createForm.setData('notes', e.target.value)}
                                    error={createForm.errors.notes}
                                    rows={3}
                                    placeholder="Informations complémentaires..."
                                />

                                <div className="flex items-center justify-between rounded-xl bg-white/70 p-4">
                                    <FormCheckbox
                                        label="Client actif"
                                        description="Le client peut recevoir des livraisons"
                                        checked={createForm.data.is_active}
                                        onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                    />

                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setShowCreateForm(false)}
                                            icon={null}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            icon={Icons.Check}
                                            isLoading={createForm.processing}
                                        >
                                            Créer le client
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Formulaire de modification */}
                <AnimatePresence>
                    {editingClientId && (
                        <motion.section
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-white to-indigo-50 p-6 shadow-xl"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-lg">
                                    <Icons.Settings className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Modifier le client</h3>
                            </div>

                            <form onSubmit={submitEdit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <FormInput
                                        label="Nom du client"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        error={editForm.errors.name}
                                        required
                                        icon={Icons.Clients}
                                        helperText={null}
                                    />

                                    <FormInput
                                        label="Code client"
                                        value={editForm.data.code}
                                        onChange={(e) => editForm.setData('code', e.target.value)}
                                        error={editForm.errors.code}
                                        disabled
                                        helperText="Le code client ne peut pas être modifié"
                                        icon={null}
                                    />

                                    <FormInput
                                        label="Email"
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                        error={editForm.errors.email}
                                        helperText={null}
                                        icon={null}
                                    />

                                    <FormInput
                                        label="Téléphone"
                                        value={editForm.data.phone}
                                        onChange={(e) => editForm.setData('phone', e.target.value)}
                                        error={editForm.errors.phone}
                                        icon={null}
                                        helperText={null}
                                    />

                                    <FormSelect
                                        label="Agence"
                                        value={editForm.data.branch_id}
                                        onChange={(e) => editForm.setData('branch_id', e.target.value)}
                                        error={editForm.errors.branch_id}
                                        options={[
                                            { value: '', label: 'Sélectionner une agence...' },
                                            ...branches.map(branch => ({ value: branch.id, label: branch.name }))
                                        ]}
                                    />
                                </div>

                                <FormTextarea
                                    label="Notes"
                                    value={editForm.data.notes}
                                    onChange={(e) => editForm.setData('notes', e.target.value)}
                                    error={editForm.errors.notes}
                                    rows={3}
                                />

                                <div className="flex items-center justify-between rounded-xl bg-white/70 p-4">
                                    <FormCheckbox
                                        label="Client actif"
                                        description="Le client peut recevoir des livraisons"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                    />

                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={cancelEdit}
                                            icon={null}
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

                {/* Liste des clients */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="mb-4 flex items-center gap-3">
                        <Icons.Clients className="h-5 w-5 text-slate-600" />
                        <h3 className="text-lg font-bold text-slate-900">Liste des clients</h3>
                    </div>

                    <DataTable
                        columns={columns}
                        data={rows}
                        emptyMessage="Aucun client enregistré. Créez-en un pour commencer !"
                        emptyIcon={Icons.Clients}
                        actions={(row) => (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEdit(row)}
                                    icon={null}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => deleteClient(row)}
                                    icon={null}
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

            <ConfirmDialog
                isOpen={!!deletingClient}
                title="Supprimer le client"
                message={`Êtes-vous sûr de vouloir supprimer le client "${deletingClient?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeletingClient(null)}
            />
        </AuthenticatedLayout>
    );
}
