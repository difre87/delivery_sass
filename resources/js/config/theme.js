// Configuration des thèmes et couleurs pour l'application

export const theme = {
    colors: {
        primary: {
            gradient: 'from-emerald-600 to-teal-600',
            light: 'from-emerald-50 to-teal-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            bg: 'bg-emerald-50',
        },
        secondary: {
            gradient: 'from-slate-600 to-slate-700',
            light: 'from-slate-50 to-slate-100',
            border: 'border-slate-200',
            text: 'text-slate-700',
            bg: 'bg-slate-50',
        },
        success: {
            gradient: 'from-emerald-500 to-teal-500',
            light: 'from-emerald-50 to-teal-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            bg: 'bg-emerald-50',
        },
        warning: {
            gradient: 'from-amber-500 to-orange-500',
            light: 'from-amber-50 to-orange-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
            bg: 'bg-amber-50',
        },
        danger: {
            gradient: 'from-rose-500 to-red-500',
            light: 'from-rose-50 to-red-50',
            border: 'border-rose-200',
            text: 'text-rose-700',
            bg: 'bg-rose-50',
        },
        info: {
            gradient: 'from-cyan-500 to-blue-500',
            light: 'from-cyan-50 to-blue-50',
            border: 'border-cyan-200',
            text: 'text-cyan-700',
            bg: 'bg-cyan-50',
        },
        indigo: {
            gradient: 'from-indigo-500 to-purple-600',
            light: 'from-indigo-50 to-purple-50',
            border: 'border-indigo-200',
            text: 'text-indigo-700',
            bg: 'bg-indigo-50',
        },
    },
    
    pageThemes: {
        clients: {
            icon: 'from-cyan-500 to-blue-600',
            form: 'from-white to-cyan-50',
            border: 'border-cyan-200',
        },
        drivers: {
            icon: 'from-indigo-500 to-purple-600',
            form: 'from-white to-indigo-50',
            border: 'border-indigo-200',
        },
        shipments: {
            icon: 'from-amber-500 to-orange-600',
            form: 'from-white to-amber-50',
            border: 'border-amber-200',
        },
        routes: {
            icon: 'from-rose-500 to-pink-600',
            form: 'from-white to-rose-50',
            border: 'border-rose-200',
        },
        fleet: {
            icon: 'from-emerald-500 to-teal-600',
            form: 'from-white to-emerald-50',
            border: 'border-emerald-200',
        },
        fuel: {
            icon: 'from-red-500 to-rose-600',
            form: 'from-white to-red-50',
            border: 'border-red-200',
        },
    },

    statusColors: {
        active: 'success',
        inactive: 'secondary',
        pending: 'warning',
        completed: 'success',
        canceled: 'danger',
        draft: 'secondary',
        scheduled: 'info',
        assigned: 'indigo',
        in_transit: 'warning',
        delivered: 'success',
        maintenance: 'warning',
    },
};

export const getStatusColor = (status) => {
    const colorKey = theme.statusColors[status] || 'secondary';
    return theme.colors[colorKey];
};

export const getPageTheme = (page) => {
    return theme.pageThemes[page] || theme.pageThemes.clients;
};
