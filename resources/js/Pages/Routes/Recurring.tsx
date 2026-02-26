import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icons } from '@/Components/Icons';
import FormInput from '@/Components/FormInput';
import FormSelect from '@/Components/FormSelect';
import FormCheckbox from '@/Components/FormCheckbox';
import FormTextarea from '@/Components/FormTextarea';
import Button from '@/Components/Button';
import DataTable from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import Toast from '@/Components/Toast';
import Badge from '@/Components/Badge';
import ConfirmDialog from '@/Components/ConfirmDialog';

const frequencyOptions = [
    { value: 'daily', label: 'Quotidienne', color: 'blue' },
    { value: 'weekly', label: 'Hebdomadaire', color: 'purple' },
    { value: 'monthly', label: 'Mensuelle', color: 'amber' },
];

const statusOptions = [
    { value: 'planned', label: 'Planifiée', color: 'blue' },
    { value: 'in_progress', label: 'En Cours', color: 'amber' },
    { value: 'completed', label: 'Terminée', color: 'emerald' },
];

const weekdayOptions = [
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' },
    { value: 7, label: 'Dimanche' },
];

const initialCreateForm = {
    name: '',
    description: '',
    frequency: 'daily',
    weekdays: [] as number[],
    monthdays: [] as number[],
    start_date: '',
    end_date: '',
    company_id: '',
    branch_id: '',
    driver_id: '',
    vehicle_id: '',
    default_start_time: '08:00',
    default_end_time: '17:00',
    default_status: 'planned',
    is_active: true,
    shipment_ids: [] as number[],
};

const initialEditForm = {
    name: '',
    description: '',
    frequency: 'daily',
    weekdays: [] as number[],
    monthdays: [] as number[],
    start_date: '',
    end_date: '',
    company_id: '',
    branch_id: '',
    driver_id: '',
    vehicle_id: '',
    default_start_time: '08:00',
    default_end_time: '17:00',
    default_status: 'planned',
    is_active: true,
    shipment_ids: [] as number[],
};

const getDateInputValue = (value: any) => (value ? String(value).slice(0, 10) : '');

const getFrequencyConfig = (frequency: string) => {
    return frequencyOptions.find(f => f.value === frequency) || frequencyOptions[0];
};

const getStatusConfig = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
};

const getVariantFromColor = (color: string): string => {
    const map: { [key: string]: string } = {
        'blue': 'info',
        'purple': 'info',
        'amber': 'warning',
        'emerald': 'success',
        'slate': 'default',
    };
    return map[color] || 'default';
};

const formatWeekdays = (weekdays: number[] | null) => {
    if (!weekdays || weekdays.length === 0) return '-';
    return weekdays.map(d => weekdayOptions.find(w => w.value === d)?.label.slice(0, 3)).join(', ');
};

const formatMonthdays = (monthdays: number[] | null) => {
    if (!monthdays || monthdays.length === 0) return '-';
    return monthdays.sort((a, b) => a - b).join(', ');
};

export default function RecurringRoutesIndex({ recurringRuns, branches = [], drivers = [], vehicles = [], shipments = [] }: any) {
    const page = usePage<any>();
    const { flash, auth } = page.props;
    const { currentCompany, user } = auth;
    
    const [editingRunId, setEditingRunId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deletingRun, setDeletingRun] = useState<any>(null);
    const [createMonthdayInput, setCreateMonthdayInput] = useState('');
    const [editMonthdayInput, setEditMonthdayInput] = useState('');
    const [createShipmentSearch, setCreateShipmentSearch] = useState('');
    const [editShipmentSearch, setEditShipmentSearch] = useState('');

    const createForm = useForm(initialCreateForm);
    const editForm = useForm(initialEditForm);

    const rows = recurringRuns?.data ?? [];
    const pagination = useMemo(() => recurringRuns?.links ?? [], [recurringRuns]);

    const openCreateForm = () => {
        createForm.setData({
            ...initialCreateForm,
            company_id: currentCompany.id,
            branch_id: user.current_branch_id || '',
        });
        setShowCreateForm(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('routes.recurring.store', { company: currentCompany.slug }), {
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            }
        });
    };

    const startEdit = (run: any) => {
        setEditingRunId(run.id);
        editForm.setData({
            name: run.name || '',
            description: run.description || '',
            frequency: run.frequency || 'daily',
            weekdays: run.weekdays || [],
            monthdays: run.monthdays || [],
            start_date: getDateInputValue(run.start_date),
            end_date: getDateInputValue(run.end_date),
            company_id: run.company_id || '',
            branch_id: run.branch_id || '',
            driver_id: run.driver_id || '',
            vehicle_id: run.vehicle_id || '',
            default_start_time: run.default_start_time || '08:00',
            default_end_time: run.default_end_time || '17:00',
            default_status: run.default_status || 'planned',
            is_active: run.is_active ?? true,
            shipment_ids: (run.shipments ?? []).map((s: any) => s.id),
        });
    };

    const cancelEdit = () => {
        setEditingRunId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRunId) return;
        editForm.patch(route('routes.recurring.update', { company: currentCompany.slug, recurringDispatchRun: editingRunId }), {
            onSuccess: () => cancelEdit()
        });
    };

    const toggleActive = (run: any) => {
        router.post(route('routes.recurring.toggle', { company: currentCompany.slug, recurringDispatchRun: run.id }));
    };

    const deleteRun = (run: any) => {
        setDeletingRun(run);
    };

    const confirmDelete = () => {
        if (!deletingRun) return;
        router.delete(route('routes.recurring.destroy', { company: currentCompany.slug, recurringDispatchRun: deletingRun.id }), {
            onSuccess: () => setDeletingRun(null),
        });
    };

    const renderWeekdayCheckboxes = (form: any) => {
        return (
            <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Jours de la semaine
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                    {weekdayOptions.map(day => (
                        <label key={day.value} className="flex cursor-pointer items-center space-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-blue-300 hover:bg-blue-50">
                            <input
                                type="checkbox"
                                checked={form.data.weekdays.includes(day.value)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        form.setData('weekdays', [...form.data.weekdays, day.value]);
                                    } else {
                                        form.setData('weekdays', form.data.weekdays.filter((d: number) => d !== day.value));
                                    }
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">{day.label.slice(0, 3)}</span>
                        </label>
                    ))}
                </div>
                {form.errors.weekdays && (
                    <p className="mt-1 text-sm text-red-600">{form.errors.weekdays}</p>
                )}
            </div>
        );
    };

    const renderMonthdayInput = (form: any, inputValue: string, setInputValue: (value: string) => void) => {
        const addMonthday = () => {
            const day = parseInt(inputValue);
            if (day >= 1 && day <= 31 && !form.data.monthdays.includes(day)) {
                form.setData('monthdays', [...form.data.monthdays, day].sort((a, b) => a - b));
                setInputValue('');
            }
        };

        const removeMonthday = (day: number) => {
            form.setData('monthdays', form.data.monthdays.filter((d: number) => d !== day));
        };

        return (
            <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Jours du mois (1-31)
                </label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        min="1"
                        max="31"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMonthday())}
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Ex: 1, 15, 30..."
                    />
                    <Button type="button" onClick={addMonthday} variant="secondary" size="sm">
                        Ajouter
                    </Button>
                </div>
                {form.data.monthdays.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {form.data.monthdays.map((day: number) => (
                            <span key={day} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                {day}
                                <button type="button" onClick={() => removeMonthday(day)} className="hover:text-blue-900">
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                {form.errors.monthdays && (
                    <p className="mt-1 text-sm text-red-600">{form.errors.monthdays}</p>
                )}
            </div>
        );
    };

    // Fonction pour filtrer les colis
    const filterShipments = (searchTerm: string) => {
        if (!searchTerm.trim()) return shipments;
        
        const term = searchTerm.toLowerCase();
        return shipments.filter((s: any) => 
            s.reference?.toLowerCase().includes(term) ||
            s.tracking_number?.toLowerCase().includes(term) ||
            s.recipient_name?.toLowerCase().includes(term) ||
            s.recipient_phone?.toLowerCase().includes(term) ||
            s.recipient_address?.toLowerCase().includes(term) ||
            s.client?.name?.toLowerCase().includes(term) ||
            s.senderAddress?.street?.toLowerCase().includes(term) ||
            s.senderAddress?.city?.toLowerCase().includes(term) ||
            s.recipientAddress?.street?.toLowerCase().includes(term) ||
            s.recipientAddress?.city?.toLowerCase().includes(term)
        );
    };

    // Composant de sélection de colis amélioré
    const renderShipmentSelector = (form: any, searchTerm: string, setSearchTerm: (value: string) => void) => {
        const filteredShipments = filterShipments(searchTerm);
        const selectedCount = form.data.shipment_ids.length;
        const totalCount = shipments.length;

        const toggleAll = () => {
            if (selectedCount === filteredShipments.length) {
                // Désélectionner tous les colis filtrés
                const filteredIds = filteredShipments.map((s: any) => s.id);
                form.setData('shipment_ids', form.data.shipment_ids.filter((id: number) => !filteredIds.includes(id)));
            } else {
                // Sélectionner tous les colis filtrés
                const allIds = [...new Set([...form.data.shipment_ids, ...filteredShipments.map((s: any) => s.id)])];
                form.setData('shipment_ids', allIds);
            }
        };

        const getStatusBadge = (status: string) => {
            const configs: any = {
                pending: { label: 'En attente', color: 'bg-slate-100 text-slate-700' },
                picked_up: { label: 'Collecté', color: 'bg-blue-100 text-blue-700' },
                in_transit: { label: 'En transit', color: 'bg-amber-100 text-amber-700' },
                out_for_delivery: { label: 'En livraison', color: 'bg-purple-100 text-purple-700' },
                delivered: { label: 'Livré', color: 'bg-emerald-100 text-emerald-700' },
                failed: { label: 'Échec', color: 'bg-red-100 text-red-700' },
                canceled: { label: 'Annulé', color: 'bg-slate-100 text-slate-700' },
            };
            const config = configs[status] || { label: status, color: 'bg-slate-100 text-slate-700' };
            return (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
                    {config.label}
                </span>
            );
        };

        return (
            <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Colis à inclure dans la tournée (optionnel)
                </label>

                {/* Barre de recherche et actions */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1">
                        <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un colis (référence, destinataire, adresse...)"
                            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            type="button" 
                            onClick={toggleAll} 
                            variant="secondary" 
                            size="sm"
                        >
                            {selectedCount === filteredShipments.length && filteredShipments.length > 0 ? 'Tout désélectionner' : 'Tout sélectionner'}
                        </Button>
                        {selectedCount > 0 && (
                            <span className="text-sm font-medium text-blue-600">
                                {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                {/* Liste des colis */}
                <div className="max-h-96 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
                    {filteredShipments.length === 0 ? (
                        <div className="py-8 text-center">
                            <Icons.Package className="mx-auto h-12 w-12 text-slate-300" />
                            <p className="mt-2 text-sm font-medium text-slate-500">
                                {searchTerm ? 'Aucun colis ne correspond à votre recherche' : 'Aucun colis disponible'}
                            </p>
                        </div>
                    ) : (
                        filteredShipments.map((shipment: any) => {
                            const isSelected = form.data.shipment_ids.includes(shipment.id);
                            return (
                                <label
                                    key={shipment.id}
                                    className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 bg-white p-3 transition ${
                                        isSelected 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                form.setData('shipment_ids', [...form.data.shipment_ids, shipment.id]);
                                            } else {
                                                form.setData('shipment_ids', form.data.shipment_ids.filter((id: number) => id !== shipment.id));
                                            }
                                        }}
                                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {shipment.reference || shipment.tracking_number}
                                                </p>
                                                {shipment.status && (
                                                    <div className="mt-1">
                                                        {getStatusBadge(shipment.status)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {(shipment.client?.name || shipment.recipient_name) && (
                                            <div className="text-sm text-slate-600">
                                                {shipment.client?.name && (
                                                    <p>📤 <span className="font-medium">Exp:</span> {shipment.client.name}</p>
                                                )}
                                                {shipment.recipient_name && (
                                                    <p>📥 <span className="font-medium">Dest:</span> {shipment.recipient_name}</p>
                                                )}
                                            </div>
                                        )}
                                        {(shipment.senderAddress || shipment.recipient_address || shipment.recipientAddress) && (
                                            <div className="text-xs text-slate-500">
                                                {shipment.senderAddress && (
                                                    <p className="truncate">
                                                        🔼 {shipment.senderAddress.street}, {shipment.senderAddress.postal_code} {shipment.senderAddress.city}
                                                    </p>
                                                )}
                                                {(shipment.recipient_address || shipment.recipientAddress) && (
                                                    <p className="truncate">
                                                        🔽 {shipment.recipient_address || `${shipment.recipientAddress?.street}, ${shipment.recipientAddress?.postal_code} ${shipment.recipientAddress?.city}`}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </label>
                            );
                        })
                    )}
                </div>

                {/* Résumé */}
                {selectedCount > 0 && (
                    <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                        <p className="font-medium">
                            ✓ {selectedCount} colis sélectionné{selectedCount > 1 ? 's' : ''} sur {totalCount}
                        </p>
                    </div>
                )}

                {form.errors.shipment_ids && (
                    <p className="text-sm text-red-600">{form.errors.shipment_ids}</p>
                )}
            </div>
        );
    };

    const columns = [
        {
            key: 'name',
            label: 'Nom',
            render: (run: any) => (
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${run.is_active ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        <Icons.Routes className={`h-5 w-5 ${run.is_active ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{run.name}</p>
                        {run.description && (
                            <p className="text-sm text-slate-500">{run.description}</p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'frequency',
            label: 'Fréquence',
            render: (run: any) => {
                const config = getFrequencyConfig(run.frequency);
                return (
                    <div className="space-y-1">
                        <Badge variant={getVariantFromColor(config.color)}>{config.label}</Badge>
                        {run.frequency === 'weekly' && run.weekdays && (
                            <p className="text-xs text-slate-500">{formatWeekdays(run.weekdays)}</p>
                        )}
                        {run.frequency === 'monthly' && run.monthdays && (
                            <p className="text-xs text-slate-500">Jours: {formatMonthdays(run.monthdays)}</p>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'details',
            label: 'Détails',
            render: (run: any) => (
                <div className="space-y-1 text-sm">
                    <p className="text-slate-600">
                        <span className="font-medium">Chauffeur:</span> {run.driver?.name || 'Non assigné'}
                    </p>
                    <p className="text-slate-600">
                        <span className="font-medium">Agence:</span> {run.branch?.name || 'Toutes'}
                    </p>
                    {run.default_start_time && (
                        <p className="text-slate-600">
                            <span className="font-medium">Horaires:</span> {run.default_start_time} - {run.default_end_time}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'shipments',
            label: 'Colis',
            render: (run: any) => (
                <div className="flex items-center gap-2">
                    {run.shipments_count > 0 ? (
                        <div className="flex items-center gap-1.5">
                            <Icons.Package className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-slate-900">{run.shipments_count}</span>
                            <span className="text-xs text-slate-500">colis</span>
                        </div>
                    ) : (
                        <span className="text-sm text-slate-400">Aucun</span>
                    )}
                </div>
            ),
        },
        {
            key: 'period',
            label: 'Période',
            render: (run: any) => (
                <div className="space-y-1 text-sm">
                    <p className="text-slate-600">
                        <span className="font-medium">Début:</span> {new Date(run.start_date).toLocaleDateString('fr-FR')}
                    </p>
                    {run.end_date && (
                        <p className="text-slate-600">
                            <span className="font-medium">Fin:</span> {new Date(run.end_date).toLocaleDateString('fr-FR')}
                        </p>
                    )}
                    {run.last_generated_at && (
                        <p className="text-xs text-slate-500">
                            Dernière: {new Date(run.last_generated_at).toLocaleDateString('fr-FR')}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Statut',
            render: (run: any) => (
                <div className="flex items-center gap-2">
                    <Badge variant={run.is_active ? 'success' : 'default'}>
                        {run.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (run: any) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        onClick={() => toggleActive(run)}
                        variant="ghost"
                        size="sm"
                        title={run.is_active ? 'Désactiver' : 'Activer'}
                    >
                        {run.is_active ? (
                            <Icons.Pause className="h-4 w-4" />
                        ) : (
                            <Icons.Play className="h-4 w-4" />
                        )}
                    </Button>
                    <Button onClick={() => startEdit(run)} variant="ghost" size="sm" title="Éditer">
                        <Icons.Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => deleteRun(run)} variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" title="Supprimer">
                        <Icons.Trash className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Tournées Récurrentes - Fleetigo" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">🔄 Tournées Récurrentes</h1>
                        <p className="mt-1 text-slate-600">
                            Automatisez vos tournées régulières (quotidiennes, hebdomadaires, mensuelles)
                        </p>
                    </div>
                    <Button onClick={openCreateForm} size="lg">
                        <Icons.Plus className="h-5 w-5" />
                        Nouvelle Tournée Récurrente
                    </Button>
                </div>

                {/* Toast */}
                <AnimatePresence>
                    {flash?.status && <Toast message={flash.status} onClose={() => {}} />}
                </AnimatePresence>

                {/* Info Box */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex gap-3">
                        <Icons.Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div className="text-sm text-blue-900">
                            <p className="font-semibold">Comment ça fonctionne ?</p>
                            <p className="mt-1">
                                Les tournées récurrentes sont générées automatiquement chaque jour par le système.
                                Vous pouvez aussi lancer manuellement : <code className="rounded bg-blue-100 px-2 py-1 font-mono">php artisan dispatch:generate-recurring</code>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <DataTable 
                    columns={columns} 
                    data={rows} 
                    emptyIcon={Icons.Routes}
                    emptyMessage="Aucune tournée récurrente configurée"
                    actions={null}
                />

                {/* Pagination */}
                {pagination.length > 3 && <Pagination links={pagination} />}

                {/* Create Form Modal */}
                <AnimatePresence>
                    {showCreateForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                            >
                                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                                    <h2 className="text-2xl font-bold text-slate-900">Nouvelle Tournée Récurrente</h2>
                                    <button onClick={() => setShowCreateForm(false)} className="rounded-lg p-2 hover:bg-slate-100">
                                        <Icons.X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={submitCreate} className="space-y-6 p-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormInput
                                            label="Nom de la tournée"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            error={createForm.errors.name}
                                            required
                                            placeholder="Ex: Collecte quotidienne - Zone Nord"
                                        />

                                        <FormSelect
                                            label="Fréquence"
                                            value={createForm.data.frequency}
                                            onChange={(e) => createForm.setData('frequency', e.target.value as any)}
                                            error={createForm.errors.frequency}
                                            required
                                            options={[
                                                { value: '', label: 'Choisir une fréquence' },
                                                ...frequencyOptions.map(f => ({ value: f.value, label: f.label }))
                                            ]}
                                        />
                                    </div>

                                    <FormTextarea
                                        label="Description (optionnelle)"
                                        value={createForm.data.description}
                                        onChange={(e) => createForm.setData('description', e.target.value)}
                                        error={createForm.errors.description}
                                        rows={2}
                                        placeholder="Décrivez cette tournée récurrente..."
                                    />

                                    {/* Fréquence spécifique */}
                                    {createForm.data.frequency === 'weekly' && renderWeekdayCheckboxes(createForm)}
                                    {createForm.data.frequency === 'monthly' && renderMonthdayInput(createForm, createMonthdayInput, setCreateMonthdayInput)}

                                    <FormSelect
                                        label="Agence"
                                        value={createForm.data.branch_id}
                                        onChange={(e) => createForm.setData('branch_id', e.target.value)}
                                        error={createForm.errors.branch_id}
                                        options={[
                                            { value: '', label: 'Toutes les agences' },
                                            ...branches.map((b: any) => ({ value: b.id, label: b.name }))
                                        ]}
                                    />

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormInput
                                            type="date"
                                            label="Date de début"
                                            value={createForm.data.start_date}
                                            onChange={(e) => createForm.setData('start_date', e.target.value)}
                                            error={createForm.errors.start_date}
                                            required
                                        />

                                        <FormInput
                                            type="date"
                                            label="Date de fin (optionnelle)"
                                            value={createForm.data.end_date}
                                            onChange={(e) => createForm.setData('end_date', e.target.value)}
                                            error={createForm.errors.end_date}
                                        />
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormSelect
                                            label="Chauffeur"
                                            value={createForm.data.driver_id}
                                            onChange={(e) => createForm.setData('driver_id', e.target.value)}
                                            error={createForm.errors.driver_id}
                                            options={[
                                                { value: '', label: 'Aucun chauffeur' },
                                                ...drivers.map((d: any) => ({ value: d.id, label: d.name }))
                                            ]}
                                        />

                                        <FormSelect
                                            label="Véhicule"
                                            value={createForm.data.vehicle_id}
                                            onChange={(e) => createForm.setData('vehicle_id', e.target.value)}
                                            error={createForm.errors.vehicle_id}
                                            options={[
                                                { value: '', label: 'Aucun véhicule' },
                                                ...vehicles.map((v: any) => ({ value: v.id, label: v.plate_number }))
                                            ]}
                                        />
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-3">
                                        <FormInput
                                            type="time"
                                            label="Heure de début"
                                            value={createForm.data.default_start_time}
                                            onChange={(e) => createForm.setData('default_start_time', e.target.value)}
                                            error={createForm.errors.default_start_time}
                                        />

                                        <FormInput
                                            type="time"
                                            label="Heure de fin"
                                            value={createForm.data.default_end_time}
                                            onChange={(e) => createForm.setData('default_end_time', e.target.value)}
                                            error={createForm.errors.default_end_time}
                                        />

                                        <FormSelect
                                            label="Statut par défaut"
                                            value={createForm.data.default_status}
                                            onChange={(e) => createForm.setData('default_status', e.target.value as any)}
                                            error={createForm.errors.default_status}
                                            options={statusOptions.map(s => ({ value: s.value, label: s.label }))}
                                        />
                                    </div>

                                    {/* Sélection des colis */}
                                    {renderShipmentSelector(createForm, createShipmentSearch, setCreateShipmentSearch)}

                                    <FormCheckbox
                                        label="Tournée active"
                                        description="La tournée sera générée automatiquement si active"
                                        checked={createForm.data.is_active}
                                        onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                    />

                                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
                                        <Button type="button" onClick={() => setShowCreateForm(false)} variant="secondary">
                                            Annuler
                                        </Button>
                                        <Button type="submit" disabled={createForm.processing}>
                                            {createForm.processing ? 'Création...' : 'Créer la tournée récurrente'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Edit Form Modal */}
                <AnimatePresence>
                    {editingRunId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                            >
                                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                                    <h2 className="text-2xl font-bold text-slate-900">Modifier Tournée Récurrente</h2>
                                    <button onClick={cancelEdit} className="rounded-lg p-2 hover:bg-slate-100">
                                        <Icons.X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={submitEdit} className="space-y-6 p-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormInput
                                            label="Nom de la tournée"
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            error={editForm.errors.name}
                                            required
                                        />

                                        <FormSelect
                                            label="Fréquence"
                                            value={editForm.data.frequency}
                                            onChange={(e) => editForm.setData('frequency', e.target.value as any)}
                                            error={editForm.errors.frequency}
                                            required
                                            options={[
                                                { value: '', label: 'Choisir une fréquence' },
                                                ...frequencyOptions.map(f => ({ value: f.value, label: f.label }))
                                            ]}
                                        />
                                    </div>

                                    <FormTextarea
                                        label="Description (optionnelle)"
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        error={editForm.errors.description}
                                        rows={2}
                                    />

                                    {editForm.data.frequency === 'weekly' && renderWeekdayCheckboxes(editForm)}
                                    {editForm.data.frequency === 'monthly' && renderMonthdayInput(editForm, editMonthdayInput, setEditMonthdayInput)}

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormInput
                                            type="date"
                                            label="Date de début"
                                            value={editForm.data.start_date}
                                            onChange={(e) => editForm.setData('start_date', e.target.value)}
                                            error={editForm.errors.start_date}
                                            required
                                        />

                                        <FormInput
                                            type="date"
                                            label="Date de fin (optionnelle)"
                                            value={editForm.data.end_date}
                                            onChange={(e) => editForm.setData('end_date', e.target.value)}
                                            error={editForm.errors.end_date}
                                        />
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormSelect
                                            label="Agence"
                                            value={editForm.data.branch_id}
                                            onChange={(e) => editForm.setData('branch_id', e.target.value)}
                                            error={editForm.errors.branch_id}
                                            options={[
                                                { value: '', label: 'Toutes les agences' },
                                                ...branches.map((b: any) => ({ value: b.id, label: b.name }))
                                            ]}
                                        />

                                        <FormSelect
                                            label="Chauffeur"
                                            value={editForm.data.driver_id}
                                            onChange={(e) => editForm.setData('driver_id', e.target.value)}
                                            error={editForm.errors.driver_id}
                                            options={[
                                                { value: '', label: 'Aucun chauffeur' },
                                                ...drivers.map((d: any) => ({ value: d.id, label: d.name }))
                                            ]}
                                        />
                                    </div>

                                    <FormSelect
                                        label="Véhicule"
                                        value={editForm.data.vehicle_id}
                                        onChange={(e) => editForm.setData('vehicle_id', e.target.value)}
                                        error={editForm.errors.vehicle_id}
                                        options={[
                                            { value: '', label: 'Aucun véhicule' },
                                            ...vehicles.map((v: any) => ({ value: v.id, label: v.plate_number }))
                                        ]}
                                    />

                                    <div className="grid gap-6 md:grid-cols-3">
                                        <FormInput
                                            type="time"
                                            label="Heure de début"
                                            value={editForm.data.default_start_time}
                                            onChange={(e) => editForm.setData('default_start_time', e.target.value)}
                                            error={editForm.errors.default_start_time}
                                        />

                                        <FormInput
                                            type="time"
                                            label="Heure de fin"
                                            value={editForm.data.default_end_time}
                                            onChange={(e) => editForm.setData('default_end_time', e.target.value)}
                                            error={editForm.errors.default_end_time}
                                        />

                                        <FormSelect
                                            label="Statut par défaut"
                                            value={editForm.data.default_status}
                                            onChange={(e) => editForm.setData('default_status', e.target.value as any)}
                                            error={editForm.errors.default_status}
                                            options={statusOptions.map(s => ({ value: s.value, label: s.label }))}
                                        />
                                    </div>

                                    {/* Sélection des colis */}
                                    {renderShipmentSelector(editForm, editShipmentSearch, setEditShipmentSearch)}

                                    <FormCheckbox
                                        label="Tournée active"
                                        description="La tournée sera générée automatiquement si active"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                    />

                                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
                                        <Button type="button" onClick={cancelEdit} variant="secondary">
                                            Annuler
                                        </Button>
                                        <Button type="submit" disabled={editForm.processing}>
                                            {editForm.processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation */}
                <ConfirmDialog
                    isOpen={!!deletingRun}
                    onCancel={() => setDeletingRun(null)}
                    onConfirm={confirmDelete}
                    title="Supprimer cette tournée récurrente ?"
                    message={`Êtes-vous sûr de vouloir supprimer "${deletingRun?.name}" ? Cette action est irréversible.`}
                    confirmText="Supprimer"
                    variant="danger"
                />
            </div>
        </AuthenticatedLayout>
    );
}
