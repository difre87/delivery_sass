import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icons } from '@/Components/Icons';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import Button from '@/Components/Button';
import DataTable from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import Toast from '@/Components/Toast';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Badge from '@/Components/Badge';

const roleOptions = [
    { value: 'owner', label: 'Propriétaire' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Employé' },
];

const initialForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'staff',
    branch_ids: [],
    allowed_modules: [],
};

export default function UsersIndex({ users, branches = [], availableModules = {} }) {
    const { flash, auth } = usePage().props as any;
    const currentCompany = auth.user.current_company;
    const [editingUserId, setEditingUserId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    const tabs = [
        { name: 'Entreprise', href: route('settings.company', { company: currentCompany.slug }) },
        { name: 'Agences', href: route('settings.branches', { company: currentCompany.slug }) },
        { name: 'Utilisateurs', href: route('settings.users', { company: currentCompany.slug }), current: true },
    ];

    const createForm = useForm(initialForm);
    const editForm = useForm(initialForm);

    const rows = users?.data ?? [];
    const pagination = users?.links ?? [];

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('settings.users.store', { company: currentCompany.slug }), {
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            }
        });
    };

    const startEdit = (user) => {
        setEditingUserId(user.id);
        setShowCreateForm(false);
        editForm.setData({
            name: user.name ?? '',
            email: user.email ?? '',
            password: '',
            password_confirmation: '',
            role: user.pivot?.role ?? 'staff',
            branch_ids: (user.branches ?? []).map(b => b.id),
            allowed_modules: user.allowed_modules ?? [],
        });
    };

    const cancelEdit = () => {
        setEditingUserId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingUserId) return;
        editForm.patch(route('settings.users.update', { company: currentCompany.slug, user: editingUserId }), {
            onSuccess: () => cancelEdit()
        });
    };

    const deleteUser = (user) => {
        setDeletingUser(user);
    };

    const confirmDelete = () => {
        if (!deletingUser) return;
        router.delete(route('settings.users.destroy', { company: currentCompany.slug, user: deletingUser.id }), {
            onFinish: () => setDeletingUser(null)
        });
    };

    const toggleBranch = (form, branchId) => {
        const currentIds = form.data.branch_ids ?? [];
        const nextIds = currentIds.includes(branchId)
            ? currentIds.filter(id => id !== branchId)
            : [...currentIds, branchId];
        form.setData('branch_ids', nextIds);
    };

    const toggleModule = (form, moduleKey) => {
        const currentModules = form.data.allowed_modules ?? [];
        const nextModules = currentModules.includes(moduleKey)
            ? currentModules.filter(m => m !== moduleKey)
            : [...currentModules, moduleKey];
        form.setData('allowed_modules', nextModules);
    };

    const isOwner = (form) => form.data.role === 'owner';

    const getRoleLabel = (role) => {
        const option = roleOptions.find(r => r.value === role);
        return option ? option.label : role;
    };

    const columns = [
        { key: 'name', label: 'Nom' },
        { key: 'email', label: 'Email' },
        {
            key: 'role',
            label: 'Rôle',
            render: (user) => (
                <Badge variant={user.pivot?.role === 'owner' ? 'emerald' : user.pivot?.role === 'manager' ? 'blue' : 'gray'}>
                    {getRoleLabel(user.pivot?.role)}
                </Badge>
            )
        },
        {
            key: 'branches',
            label: 'Agences',
            render: (user) => (
                <div className="flex flex-wrap gap-1">
                    {user.branches && user.branches.length > 0 ? (
                        user.branches.map(branch => (
                            <span key={branch.id} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                {branch.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-400">Aucune agence</span>
                    )}
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (user) => (
                <>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(user)}
                    >
                        Modifier
                    </Button>
                    {user.id !== auth.user.id && (
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => deleteUser(user)}
                        >
                            Retirer
                        </Button>
                    )}
                </>
            )
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestion des utilisateurs
                </h2>
            }
        >
            <Head title="Utilisateurs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Tabs Navigation */}
                    <div className="mb-6">
                        <nav className="flex space-x-4 border-b border-slate-200">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`
                                        px-4 py-2 text-sm font-medium border-b-2 transition-colors
                                        ${tab.current
                                            ? 'border-emerald-500 text-emerald-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                        }
                                    `}
                                >
                                    {tab.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

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

                        {/* Header */}
                        <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
                                <Icons.Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Utilisateurs</h1>
                                <p className="text-sm text-slate-500">Gérez les utilisateurs de votre compagnie</p>
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => { setShowCreateForm(true); setEditingUserId(null); }}>
                        <Icons.Plus className="mr-2 h-4 w-4" />
                        Ajouter un utilisateur
                    </Button>
                </div>

                {/* Create Form */}
                <AnimatePresence>
                    {showCreateForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <form onSubmit={submitCreate} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">Nouvel utilisateur</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Nom complet"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        error={createForm.errors.name}
                                        required
                                    />
                                    <FormInput
                                        label="Email"
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        error={createForm.errors.email}
                                        required
                                    />
                                    <FormInput
                                        label="Mot de passe"
                                        type="password"
                                        value={createForm.data.password}
                                        onChange={(e) => createForm.setData('password', e.target.value)}
                                        error={createForm.errors.password}
                                        required
                                    />
                                    <FormInput
                                        label="Confirmer le mot de passe"
                                        type="password"
                                        value={createForm.data.password_confirmation}
                                        onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                                        error={createForm.errors.password_confirmation}
                                        required
                                    />
                                    <FormSelect
                                        label="Rôle"
                                        value={createForm.data.role}
                                        onChange={(e) => createForm.setData('role', e.target.value)}
                                        options={[
                                            { value: '', label: 'Sélectionner...' },
                                            ...roleOptions
                                        ]}
                                        error={createForm.errors.role}
                                        required
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Agences <span className="text-gray-400">(sélectionnez au moins une)</span>
                                    </label>
                                    <div className="space-y-2 rounded-lg border border-gray-200 p-3 max-h-40 overflow-y-auto">
                                        {branches.length > 0 ? (
                                            branches.map((branch) => (
                                                <label key={branch.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={createForm.data.branch_ids.includes(branch.id)}
                                                        onChange={() => toggleBranch(createForm, branch.id)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{branch.name}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">Aucune agence disponible</p>
                                        )}
                                    </div>
                                    {createForm.errors.branch_ids && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.branch_ids}</p>
                                    )}
                                </div>

                                {/* Modules Access */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Modules accessibles 
                                        {isOwner(createForm) && <span className="text-emerald-600 ml-2">(Propriétaire : accès complet automatique)</span>}
                                        {!isOwner(createForm) && <span className="text-gray-400 ml-2">(laisser vide pour accès complet)</span>}
                                    </label>
                                    <div className="space-y-2 rounded-lg border border-gray-200 p-3 max-h-60 overflow-y-auto">
                                        {Object.entries(availableModules).map(([key, label]) => (
                                            <label 
                                                key={key} 
                                                className={`flex items-center gap-2 p-2 rounded ${
                                                    isOwner(createForm) 
                                                        ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                                                        : 'cursor-pointer hover:bg-blue-50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isOwner(createForm) || createForm.data.allowed_modules.includes(key)}
                                                    onChange={() => !isOwner(createForm) && toggleModule(createForm, key)}
                                                    disabled={isOwner(createForm)}
                                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                                                />
                                                <span className="text-sm text-gray-700">{String(label)}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {createForm.errors.allowed_modules && (
                                        <p className="mt-1 text-sm text-red-600">{createForm.errors.allowed_modules}</p>
                                    )}
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <Button type="submit" disabled={createForm.processing}>
                                        {createForm.processing ? 'Création...' : 'Créer l\'utilisateur'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowCreateForm(false);
                                            createForm.reset();
                                        }}
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit Form */}
                <AnimatePresence>
                    {editingUserId && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <form onSubmit={submitEdit} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">Modifier l'utilisateur</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Nom complet"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        error={editForm.errors.name}
                                        required
                                    />
                                    <FormInput
                                        label="Email"
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                        error={editForm.errors.email}
                                        required
                                    />
                                    <FormInput
                                        label="Nouveau mot de passe"
                                        type="password"
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                        error={editForm.errors.password}
                                        placeholder="Laisser vide pour ne pas changer"
                                    />
                                    <FormInput
                                        label="Confirmer le mot de passe"
                                        type="password"
                                        value={editForm.data.password_confirmation}
                                        onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
                                        error={editForm.errors.password_confirmation}
                                    />
                                    <FormSelect
                                        label="Rôle"
                                        value={editForm.data.role}
                                        onChange={(e) => editForm.setData('role', e.target.value)}
                                        options={[
                                            { value: '', label: 'Sélectionner...' },
                                            ...roleOptions
                                        ]}
                                        error={editForm.errors.role}
                                        required
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Agences
                                    </label>
                                    <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-3 max-h-40 overflow-y-auto">
                                        {branches.length > 0 ? (
                                            branches.map((branch) => (
                                                <label key={branch.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.data.branch_ids.includes(branch.id)}
                                                        onChange={() => toggleBranch(editForm, branch.id)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{branch.name}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">Aucune agence disponible</p>
                                        )}
                                    </div>
                                </div>

                                {/* Modules Access */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Modules accessibles 
                                        {isOwner(editForm) && <span className="text-emerald-600 ml-2">(Propriétaire : accès complet automatique)</span>}
                                        {!isOwner(editForm) && <span className="text-gray-400 ml-2">(laisser vide pour accès complet)</span>}
                                    </label>
                                    <div className="space-y-2 rounded-lg border border-gray-200 p-3 max-h-60 overflow-y-auto">
                                        {Object.entries(availableModules).map(([key, label]) => (
                                            <label 
                                                key={key} 
                                                className={`flex items-center gap-2 p-2 rounded ${
                                                    isOwner(editForm) 
                                                        ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                                                        : 'cursor-pointer hover:bg-blue-50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isOwner(editForm) || editForm.data.allowed_modules.includes(key)}
                                                    onChange={() => !isOwner(editForm) && toggleModule(editForm, key)}
                                                    disabled={isOwner(editForm)}
                                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                                                />
                                                <span className="text-sm text-gray-700">{String(label)}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {editForm.errors.allowed_modules && (
                                        <p className="mt-1 text-sm text-red-600">{editForm.errors.allowed_modules}</p>
                                    )}
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <Button type="submit" disabled={editForm.processing}>
                                        {editForm.processing ? 'Mise à jour...' : 'Mettre à jour'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={cancelEdit}>
                                        Annuler
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Users Table */}
                <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                    <DataTable
                        columns={columns}
                        data={rows}
                        emptyMessage="Aucun utilisateur"
                        emptyIcon={Icons.Users}
                        actions={null}
                    />
                </div>

                {/* Pagination */}
                {pagination.length > 0 && <Pagination links={pagination} />}
                    </div>
                </div>
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={!!deletingUser}
                title="Retirer l'utilisateur"
                message={`Êtes-vous sûr de vouloir retirer ${deletingUser?.name} de la compagnie ? Il perdra l'accès à toutes les données.`}
                confirmText="Retirer"
                cancelText="Annuler"
                onConfirm={confirmDelete}
                onCancel={() => setDeletingUser(null)}
            />
        </AuthenticatedLayout>
    );
}
