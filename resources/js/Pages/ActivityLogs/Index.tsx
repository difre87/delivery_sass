import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps, ActivityLog, PaginatedData } from '@/types';
import { Icons } from '@/Components/Icons';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityLogsPageProps extends PageProps {
    logs: PaginatedData<ActivityLog>;
    stats: {
        total: number;
        today: number;
        this_week: number;
    };
    modules: string[];
    actions: string[];
    users: Array<{ id: number; name: string }>;
    filters: {
        user_id?: number;
        module?: string;
        action?: string;
        start_date?: string;
        end_date?: string;
        search?: string;
    };
}

export default function Index({ logs, stats, modules, actions, users, filters }: ActivityLogsPageProps) {
    const { auth } = usePage<PageProps>().props;
    const currentCompany = auth.currentCompany;

    const [search, setSearch] = useState(filters.search || '');
    const [selectedModule, setSelectedModule] = useState(filters.module || '');
    const [selectedAction, setSelectedAction] = useState(filters.action || '');
    const [selectedUser, setSelectedUser] = useState(filters.user_id?.toString() || '');

    const applyFilters = () => {
        router.get(
            route('activity-logs.index', { company: currentCompany?.slug }),
            {
                search,
                module: selectedModule,
                action: selectedAction,
                user_id: selectedUser,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const resetFilters = () => {
        setSearch('');
        setSelectedModule('');
        setSelectedAction('');
        setSelectedUser('');
        router.get(route('activity-logs.index', { company: currentCompany?.slug }));
    };

    const getActionColor = (action: string) => {
        const colors = {
            created: 'bg-green-100 text-green-800',
            updated: 'bg-blue-100 text-blue-800',
            deleted: 'bg-red-100 text-red-800',
            viewed: 'bg-gray-100 text-gray-800',
            exported: 'bg-purple-100 text-purple-800',
        };
        return colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'created':
                return <Icons.Plus className="h-4 w-4" />;
            case 'updated':
                return <Icons.Pencil className="h-4 w-4" />;
            case 'deleted':
                return <Icons.Trash className="h-4 w-4" />;
            case 'viewed':
                return <Icons.Eye className="h-4 w-4" />;
            case 'exported':
                return <Icons.Download className="h-4 w-4" />;
            default:
                return <Icons.Activity className="h-4 w-4" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Journal d'activité
                    </h2>
                </div>
            }
        >
            <Head title="Journal d'activité" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Icons.Activity className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">
                                                Total
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {stats.total.toLocaleString()}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Icons.Calendar className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">
                                                Aujourd'hui
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {stats.today.toLocaleString()}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Icons.ChartBar className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">
                                                Cette semaine
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {stats.this_week.toLocaleString()}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtres */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Recherche
                                    </label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Rechercher..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Utilisateur
                                    </label>
                                    <select
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Tous</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Module
                                    </label>
                                    <select
                                        value={selectedModule}
                                        onChange={(e) => setSelectedModule(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Tous</option>
                                        {modules.map((module) => (
                                            <option key={module} value={module}>
                                                {module}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Action
                                    </label>
                                    <select
                                        value={selectedAction}
                                        onChange={(e) => setSelectedAction(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Toutes</option>
                                        {actions.map((action) => (
                                            <option key={action} value={action}>
                                                {action}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end space-x-2">
                                    <button
                                        onClick={applyFilters}
                                        className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Filtrer
                                    </button>
                                    <button
                                        onClick={resetFilters}
                                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des logs */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Date/Heure
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Utilisateur
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Action
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Module
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {logs.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <Icons.Activity className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Aucune activité enregistrée
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.data.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <div>
                                                        {new Date(log.created_at).toLocaleString('fr-FR')}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {formatDistanceToNow(new Date(log.created_at), {
                                                            addSuffix: true,
                                                            locale: fr,
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <div className="font-medium text-gray-900">
                                                        {log.user?.name || 'Système'}
                                                    </div>
                                                    {log.branch && (
                                                        <div className="text-xs text-gray-500">
                                                            {log.branch.name}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getActionColor(
                                                            log.action
                                                        )}`}
                                                    >
                                                        {getActionIcon(log.action)}
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <span className="font-mono text-xs">
                                                        {log.module}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {log.description}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {logs.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    {logs.prev_page_url && (
                                        <button
                                            onClick={() => router.visit(logs.prev_page_url!)}
                                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Précédent
                                        </button>
                                    )}
                                    {logs.next_page_url && (
                                        <button
                                            onClick={() => router.visit(logs.next_page_url!)}
                                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Suivant
                                        </button>
                                    )}
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Affichage de{' '}
                                            <span className="font-medium">{logs.from}</span> à{' '}
                                            <span className="font-medium">{logs.to}</span> sur{' '}
                                            <span className="font-medium">{logs.total}</span>{' '}
                                            résultats
                                        </p>
                                    </div>
                                    <div>
                                        <nav
                                            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                            aria-label="Pagination"
                                        >
                                            {logs.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        link.url && router.visit(link.url)
                                                    }
                                                    disabled={!link.url}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-indigo-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                                    } ${
                                                        !link.url
                                                            ? 'cursor-not-allowed opacity-50'
                                                            : ''
                                                    } ${
                                                        index === 0
                                                            ? 'rounded-l-md'
                                                            : ''
                                                    } ${
                                                        index === logs.links.length - 1
                                                            ? 'rounded-r-md'
                                                            : ''
                                                    } border border-gray-300`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
