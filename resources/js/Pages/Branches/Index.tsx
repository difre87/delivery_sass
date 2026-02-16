import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icons } from '@/Components/Icons';
import FormInput from '@/Components/FormInput';
import FormTextarea from '@/Components/FormTextarea';
import Button from '@/Components/Button';
import DataTable from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import Alert from '@/Components/Alert';
import Badge from '@/Components/Badge';

const initialForm = { 
    name: '', 
    address: '', 
    city: '', 
    country: 'Maroc' 
};

export default function BranchesIndex({ branches }) {
    const flash = usePage().props.flash;
    const [editingBranchId, setEditingBranchId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    
    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);
    
    const rows = branches?.data ?? [];
    const pagination = useMemo(() => branches?.links ?? [], [branches]);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('branches.store'), { 
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            } 
        });
    };

    const startEdit = (branch) => {
        setEditingBranchId(branch.id);
        editForm.setData({
            name: branch.name ?? '',
            address: branch.address ?? '',
            city: branch.city ?? '',
            country: branch.country ?? 'Maroc',
        });
    };

    const cancelEdit = () => {
        setEditingBranchId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingBranchId) return;
        editForm.patch(route('branches.update', editingBranchId), { onSuccess: () => cancelEdit() });
    };

    const deleteBranch = (branch) => {
        if (!confirm(`Supprimer l'agence "${branch.name}" ?`)) return;
        router.delete(route('branches.destroy', branch.id));
    };

    const columns = [
        { 
            key: 'name', 
            label: 'Nom',
            render: (branch) => (
                <div className="font-medium text-slate-900">{branch.name}</div>
            )
        },
        { 
            key: 'city', 
            label: 'Ville',
            render: (branch) => branch.city || '-'
        },
        { 
            key: 'address', 
            label: 'Adresse',
            render: (branch) => (
                <div className="max-w-xs truncate text-slate-600">
                    {branch.address || '-'}
                </div>
            )
        },
        { 
            key: 'shipments_count', 
            label: 'Livraisons',
            render: (branch) => (
                <Badge color="blue">{branch.shipments_count || 0}</Badge>
            )
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Agences" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
                                <Icons.Settings className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Agences</h1>
                                <p className="text-sm text-slate-600">Gestion des agences / succursales</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        leftIcon={showCreateForm ? null : <Icons.Plus className="h-4 w-4" />}
                    >
                        {showCreateForm ? 'Annuler' : 'Nouvelle Agence'}
                    </Button>
                </div>

                {/* Flash Message */}
                {flash?.status && (
                    <Alert type="success" onClose={() => router.reload({ only: [] })}>
                        {flash.status}
                    </Alert>
                )}

                {/* Create Form */}
                <AnimatePresence>
                    {showCreateForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/30 shadow-lg">
                                <div className="border-b border-purple-200 bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Icons.Settings className="h-5 w-5 text-white" />
                                        <h3 className="font-semibold text-white">Nouvelle Agence</h3>
                                    </div>
                                </div>
                                <form onSubmit={submitCreate} className="p-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormInput
                                            label="Nom de l'Agence"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            error={createForm.errors.name}
                                            required
                                            placeholder="Agence Centre-Ville"
                                        />

                                        <FormInput
                                            label="Ville"
                                            value={createForm.data.city}
                                            onChange={(e) => createForm.setData('city', e.target.value)}
                                            error={createForm.errors.city}
                                            placeholder="Casablanca"
                                        />

                                        <div className="md:col-span-2">
                                            <FormTextarea
                                                label="Adresse"
                                                value={createForm.data.address}
                                                onChange={(e) => createForm.setData('address', e.target.value)}
                                                error={createForm.errors.address}
                                                rows={2}
                                                placeholder="123 Avenue Mohammed V, Quartier Maarif"
                                            />
                                        </div>

                                        <FormInput
                                            label="Pays"
                                            value={createForm.data.country}
                                            onChange={(e) => createForm.setData('country', e.target.value)}
                                            error={createForm.errors.country}
                                            placeholder="Maroc"
                                        />
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
                                            Créer l'Agence
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Form */}
                <AnimatePresence>
                    {editingBranchId && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/30 shadow-lg">
                                <div className="border-b border-purple-200 bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Icons.Settings className="h-5 w-5 text-white" />
                                        <h3 className="font-semibold text-white">Modifier l'Agence</h3>
                                    </div>
                                </div>
                                <form onSubmit={submitEdit} className="p-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormInput
                                            label="Nom de l'Agence"
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            error={editForm.errors.name}
                                            required
                                        />

                                        <FormInput
                                            label="Ville"
                                            value={editForm.data.city}
                                            onChange={(e) => editForm.setData('city', e.target.value)}
                                            error={editForm.errors.city}
                                        />

                                        <div className="md:col-span-2">
                                            <FormTextarea
                                                label="Adresse"
                                                value={editForm.data.address}
                                                onChange={(e) => editForm.setData('address', e.target.value)}
                                                error={editForm.errors.address}
                                                rows={2}
                                            />
                                        </div>

                                        <FormInput
                                            label="Pays"
                                            value={editForm.data.country}
                                            onChange={(e) => editForm.setData('country', e.target.value)}
                                            error={editForm.errors.country}
                                        />
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

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={rows}
                    emptyMessage="Aucune agence enregistrée. Créez votre première agence !"
                    emptyIcon={Icons.Settings}
                    actions={(branch) => (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(branch)}
                            >
                                Modifier
                            </Button>
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => deleteBranch(branch)}
                            >
                                Supprimer
                            </Button>
                        </>
                    )}
                />

                {/* Pagination */}
                {pagination.length > 0 && <Pagination links={pagination} />}
            </div>
        </AuthenticatedLayout>
    );
}
