import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import type { PageProps } from './types';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Extend Window interface
declare global {
    interface Window {
        inertiaProps: PageProps | null;
        route: typeof route;
    }
}

// Variable globale pour stocker les props courantes
window.inertiaProps = null;

// Patch global pour injecter automatiquement le paramètre company dans les routes
const originalRoute = window.route;
window.route = function(name, params, absolute) {
    // Si params n'est pas un objet, on le transforme
    if (params !== undefined && typeof params !== 'object') {
        absolute = params;
        params = {};
    }
    
    params = params || {};
    
    // Récupérer le slug de la société depuis les props Inertia
    const companySlug = window.inertiaProps?.auth?.currentCompany?.slug;
    
    // Injecter automatiquement le paramètre company s'il n'est pas fourni
    if (companySlug && !params.company && name !== 'onboarding.company.create' && name !== 'onboarding.company.store') {
        params = { company: companySlug, ...params };
    }
    
    return originalRoute(name, params, absolute);
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        
        // Mettre à jour les props globales immédiatement
        window.inertiaProps = props.initialPage.props as any;

        // Créer un wrapper pour mettre à jour les props de manière synchrone
        const AppWrapper = (appProps: any) => {
            // Mettre à jour les props avec useEffect pour garantir la mise à jour avant le rendu des enfants
            useEffect(() => {
                if (appProps?.initialPage?.props) {
                    window.inertiaProps = appProps.initialPage.props as any;
                }
            }, [appProps]);

            // Aussi mettre à jour de manière synchrone
            if (appProps?.initialPage?.props) {
                window.inertiaProps = appProps.initialPage.props as any;
            }

            return <App {...appProps} />;
        };

        root.render(<AppWrapper {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
