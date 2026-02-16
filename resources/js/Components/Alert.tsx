import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';

export default function Alert({ 
    type = 'success', 
    message, 
    onClose = null,
    className = '' 
}) {
    const types = {
        success: {
            bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
            border: 'border-emerald-200',
            text: 'text-emerald-800',
            icon: Icons.Check,
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        error: {
            bg: 'bg-gradient-to-r from-rose-50 to-red-50',
            border: 'border-rose-200',
            text: 'text-rose-800',
            icon: Icons.Alert,
            iconBg: 'bg-rose-100',
            iconColor: 'text-rose-600',
        },
        warning: {
            bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
            border: 'border-amber-200',
            text: 'text-amber-800',
            icon: Icons.Alert,
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: Icons.Alert,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
    };

    const config = types[type] || types.success;
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className={`
                        rounded-2xl border-2 ${config.border} ${config.bg} p-4 shadow-lg
                        ${className}
                    `}
                >
                    <div className="flex items-start gap-4">
                        <div className={`rounded-xl ${config.iconBg} p-2`}>
                            <Icon className={`h-5 w-5 ${config.iconColor}`} />
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-semibold ${config.text}`}>
                                {message}
                            </p>
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className={`rounded-lg p-1 transition hover:bg-black/5 ${config.text}`}
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
