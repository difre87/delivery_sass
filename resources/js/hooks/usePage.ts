import { usePage as useInertiaPage } from '@inertiajs/react';
import { PageProps } from '../types';

export function usePage<T extends Record<string, unknown> = Record<string, unknown>>() {
    return useInertiaPage<PageProps<T>>();
}

export function useAuth() {
    const page = usePage() as any;
    return page.props.auth;
}

export function useUser() {
    const page = usePage() as any;
    return page.props.auth.user;
}

export function useCurrentCompany() {
    const page = usePage() as any;
    return page.props.auth.currentCompany;
}

export function useFlash() {
    const page = usePage() as any;
    return page.props.flash;
}

export function useErrors() {
    const page = usePage() as any;
    return page.props.errors || {};
}
