import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Icons } from '@/Components/Icons';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Toast from '@/Components/Toast';

export default function Branches({ branches, canAddMore, limitReached }) {
    const { auth, flash, errors } = usePage<any>().props;
    const currentCompany = auth.currentCompany;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [deletingBranch, setDeletingBranch] = useState<any>(null);

    const createForm = useForm({
        name: '',
        address: '',
        phone: '',
        email: '',
    });

    const editForm = useForm({
        name: '',
        address: '',
        phone: '',
        email: '',
    });

    const tabs = [
        { name: 'Entreprise', href: route('settings.company', { company: currentCompany.slug }) },
        { name: 'Agences', href: route('settings.branches', { company: currentCompany.slug }), current: true },
    ];

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('settings.branches.store', { company: currentCompany.slug }), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.patch(route('settings.branches.update', { company: currentCompany.slug, branchId: editingBranch.id }), {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingBranch(null);
                editForm.reset();
            },
        });
    };

    const openEditModal = (branch) => {
        setEditingBranch(branch);
        editForm.setData({
            name: branch.name,
            address: branch.address || '',
            phone: branch.phone || '',
            email: branch.email || '',
        });
        setShowEditModal(true);
    };

    const handleDelete = (branch) => {
        setDeletingBranch(branch);
    };

    const confirmDelete = () => {
        if (deletingBranch) {
            router.delete(route('settings.branches.destroy', { company: currentCompany.slug, branchId: deletingBranch.id }));
            setDeletingBranch(null);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Gestion des Agences
                </h2>
            }
        >
            <Head title="Agences" />

            {/* Flash Message Toast */}
            <AnimatePresence>
                {flash?.status && (
                    <Toast 
                        message={flash.status} 
                        type="success"
                        onClose={() => router.reload({ only: [] })}
                    />
                )}
                {errors?.delete && (
                    <Toast 
                        message={errors.delete} 
                        type="error"
                        onClose={() => router.reload({ only: [] })}
                    />
                )}
                {errors?.limit && (
                    <Toast 
                        message={errors.limit} 
                        type="error"
                        onClose={() => router.reload({ only: [] })}
                    />
                )}
            </AnimatePresence>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Tabs Navigation */}
                    <div className="mb-6 border-b border-slate-200 bg-white px-6 pt-6 rounded-t-xl">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`
                                        whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                                        ${tab.current
                                            ? 'border-emerald-500 text-emerald-600'
                                            : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                        }
                                    `}
                                >
                                    {tab.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Page Content */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-b-xl">
                        <div className="p-6 text-slate-900">
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Mes Agences
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Gérez vos différentes agences et succursales
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    disabled={!canAddMore}
                                    className={`
                                        inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition
                                        ${canAddMore
                                            ? 'bg-emerald-600 hover:bg-emerald-700'
                                            : 'bg-slate-300 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <Icons.Plus className="h-4 w-4" />
                                    Nouvelle Agence
                                </button>
                            </div>

                            {limitReached && (
                                <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
                                    <div className="flex items-center gap-2">
                                        <Icons.AlertCircle className="h-5 w-5 text-amber-600" />
                                        <p className="text-sm font-medium text-amber-800">
                                            Limite d'agences atteinte. Passez à un plan supérieur pour ajouter plus d'agences.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Branches Grid */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {branches.map((branch) => (
                                    <motion.div
                                        key={branch.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-emerald-100 p-2">
                                                    <Icons.Building className="h-5 w-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900">{branch.name}</h4>
                                                    <p className="text-xs text-slate-500">ID: {branch.id}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {branch.address && (
                                            <p className="mt-3 text-sm text-slate-600">{branch.address}</p>
                                        )}

                                        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                                            {branch.phone && (
                                                <div className="flex items-center gap-1">
                                                    <Icons.Phone className="h-3 w-3" />
                                                    {branch.phone}
                                                </div>
                                            )}
                                            {branch.email && (
                                                <div className="flex items-center gap-1">
                                                    <Icons.Mail className="h-3 w-3" />
                                                    {branch.email}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span>{branch.shipments_count} livraisons</span>
                                                <span>{branch.users_count} utilisateurs</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(branch)}
                                                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                                                >
                                                    <Icons.Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(branch)}
                                                    className="rounded-md p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition"
                                                >
                                                    <Icons.Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {branches.length === 0 && (
                                <div className="text-center py-12">
                                    <Icons.Building className="mx-auto h-12 w-12 text-slate-400" />
                                    <h3 className="mt-2 text-sm font-medium text-slate-900">Aucune agence</h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Commencez par créer votre première agence
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                        >
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                Nouvelle Agence
                            </h3>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Nom de l'agence *
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        required
                                    />
                                    {createForm.errors.name && (
                                        <p className="mt-1 text-sm text-rose-600">{createForm.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.address}
                                        onChange={(e) => createForm.setData('address', e.target.value)}
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Téléphone
                                        </label>
                                        <input
                                            type="tel"
                                            value={createForm.data.phone}
                                            onChange={(e) => createForm.setData('phone', e.target.value)}
                                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={createForm.data.email}
                                            onChange={(e) => createForm.setData('email', e.target.value)}
                                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50"
                                    >
                                        {createForm.processing ? 'Création...' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && editingBranch && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowEditModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                        >
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                Modifier l'Agence
                            </h3>
                            <form onSubmit={handleEdit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Nom de l'agence *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        required
                                    />
                                    {editForm.errors.name && (
                                        <p className="mt-1 text-sm text-rose-600">{editForm.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.address}
                                        onChange={(e) => editForm.setData('address', e.target.value)}
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Téléphone
                                        </label>
                                        <input
                                            type="tel"
                                            value={editForm.data.phone}
                                            onChange={(e) => editForm.setData('phone', e.target.value)}
                                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={editForm.data.email}
                                            onChange={(e) => editForm.setData('email', e.target.value)}
                                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={!!deletingBranch}
                title="Supprimer l'agence"
                message={deletingBranch ? `Êtes-vous sûr de vouloir supprimer l'agence "${deletingBranch.name}" ? Cette action est irréversible.` : ''}
                confirmText="Supprimer"
                onConfirm={confirmDelete}
                onCancel={() => setDeletingBranch(null)}
            />
        </AuthenticatedLayout>
    );
}
