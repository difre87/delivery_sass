import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import DataTable from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import Alert from '@/Components/Alert';
import { Icons } from '@/Components/Icons';
import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CRUDLayout({
    title,
    icon: Icon,
    iconGradient = 'from-emerald-500 to-teal-600',
    data,
    columns,
    createForm: CreateForm,
    editForm: EditForm,
    onDelete,
    emptyMessage,
    children,
}) {
    const flash = usePage().props.flash;
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const rows = data?.data ?? [];
    const pagination = useMemo(() => data?.links ?? [], [data]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`rounded-xl bg-gradient-to-br ${iconGradient} p-2.5 shadow-lg`}>
                            {Icon && <Icon className="h-6 w-6 text-white" />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold leading-tight text-slate-900">{title}</h2>
                            <p className="text-sm text-slate-600">
                                {rows.length} élément{rows.length > 1 ? 's' : ''} enregistré{rows.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        icon={Icons.Plus}
                        onClick={() => {
                            setShowCreateForm(!showCreateForm);
                            setEditingId(null);
                        }}
                    >
                        {showCreateForm ? 'Annuler' : 'Nouveau'}
                    </Button>
                </div>
            }
        >
            <Head title={title} />

            <div className="space-y-6">
                {flash?.status && <Alert type="success" message={flash.status} />}

                {/* Formulaire de création */}
                <AnimatePresence>
                    {showCreateForm && CreateForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <CreateForm onCancel={() => setShowCreateForm(false)} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Formulaire d'édition */}
                <AnimatePresence>
                    {editingId && EditForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <EditForm editingId={editingId} onCancel={() => setEditingId(null)} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Liste */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="mb-4 flex items-center gap-3">
                        {Icon && <Icon className="h-5 w-5 text-slate-600" />}
                        <h3 className="text-lg font-bold text-slate-900">Liste</h3>
                    </div>

                    <DataTable
                        columns={columns}
                        data={rows}
                        emptyMessage={emptyMessage}
                        emptyIcon={Icon}
                        actions={(row) => (
                            <>
                                <Button size="sm" variant="outline" onClick={() => setEditingId(row.id)}>
                                    Modifier
                                </Button>
                                {onDelete && (
                                    <Button size="sm" variant="danger" onClick={() => onDelete(row)}>
                                        Supprimer
                                    </Button>
                                )}
                            </>
                        )}
                    />

                    {pagination.length > 3 && (
                        <div className="mt-6">
                            <Pagination links={pagination} />
                        </div>
                    )}
                </motion.section>

                {children}
            </div>
        </AuthenticatedLayout>
    );
}
