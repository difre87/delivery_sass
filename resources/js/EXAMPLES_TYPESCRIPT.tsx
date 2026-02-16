/**
 * EXEMPLE D'UTILISATION DES TYPES TYPESCRIPT
 * 
 * Ce fichier montre des exemples d'utilisation des types TypeScript
 * dans les composants React/Inertia
 */

import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useAuth, useUser, useCurrentCompany } from '@/hooks/usePage';
import { Client, PaginatedData, PageProps } from '@/types';
import { ButtonProps } from '@/types/components';

// ============================================
// EXEMPLE 1: Page avec props typées
// ============================================

interface ClientsPageProps extends Record<string, unknown> {
    clients: PaginatedData<Client>;
    stats: {
        total: number;
        active: number;
    };
}

export default function ClientsExample({ clients, stats }: PageProps<ClientsPageProps>) {
    // Utilisation des hooks typés
    const auth = useAuth();
    const user = useUser();
    const company = useCurrentCompany();

    return (
        <AuthenticatedLayout
            header={<h1>Clients - {company?.name}</h1>}
        >
            <Head title="Clients" />
            
            <div>
                <p>Connecté en tant que : {user.name}</p>
                <p>Total clients : {stats.total}</p>
                <p>Clients actifs : {stats.active}</p>
                
                <div>
                    {clients.data.map((client) => (
                        <div key={client.id}>
                            <h3>{client.name}</h3>
                            <p>{client.email}</p>
                            {/* TypeScript connaît toutes les propriétés de Client */}
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// ============================================
// EXEMPLE 2: Composant Button typé
// ============================================

export function ExampleButton({ variant = 'primary', children, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`btn btn-${variant}`}
        >
            {children}
        </button>
    );
}

// ============================================
// EXEMPLE 3: Fonction avec types génériques
// ============================================

function mapPaginatedData<T, R>(
    paginatedData: PaginatedData<T>,
    mapper: (item: T) => R
): PaginatedData<R> {
    return {
        ...paginatedData,
        data: paginatedData.data.map(mapper),
    };
}

// Utilisation:
// const mappedClients = mapPaginatedData(clients, (client) => ({
//     id: client.id,
//     fullName: client.name,
//     contactEmail: client.email,
// }));

// ============================================
// EXEMPLE 4: Type guard pour vérifier les types
// ============================================

function isClient(obj: any): obj is Client {
    return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}

// Utilisation:
// if (isClient(someData)) {
//     // TypeScript sait maintenant que someData est un Client
//     console.log(someData.email);
// }

// ============================================
// EXEMPLE 5: Props avec types optionnels
// ============================================

interface CardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export function Card({ title, subtitle, children, footer, className = '' }: CardProps) {
    return (
        <div className={`card ${className}`}>
            <div className="card-header">
                <h2>{title}</h2>
                {subtitle && <p>{subtitle}</p>}
            </div>
            <div className="card-body">
                {children}
            </div>
            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </div>
    );
}

// ============================================
// EXEMPLE 6: Utilisation de l'autocomplétion
// ============================================

// Maintenant VS Code vous suggère automatiquement:
// - Les propriétés disponibles sur les objets (client., user., etc.)
// - Les props requises pour chaque composant
// - Les types de retour des fonctions
// - Les erreurs de typage avant l'exécution

// Exemples d'autocomplétion:
// user. → VS Code suggère: id, name, email, currentCompany, etc.
// client. → VS Code suggère: id, name, code, email, phone, address, etc.
// <Button → VS Code suggère les props: variant, icon, loading, disabled, etc.
