import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const sectionTitles = {
    clients: 'Clients',
    shipments: 'Livraisons',
    routes: 'Tournées',
    fleet: 'Flotte',
    fuel: 'Carburant',
    settings: 'Paramètres société',
};

export default function Placeholder({ section }) {
    const title = sectionTitles[section] ?? 'Module';

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-slate-800">{title}</h2>}
        >
            <Head title={title} />

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm text-slate-600">
                    Cette section est prête dans la navigation et servira de base pour implémenter les écrans métier.
                </p>
            </div>
        </AuthenticatedLayout>
    );
}
