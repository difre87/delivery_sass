import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { useEffect } from 'react';

export default function Toast({ 
    message, 
    type = 'success',
    duration = 3000,
    onClose
}) {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const types = {
        success: {
            bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
            icon: Icons.Check,
            iconBg: 'bg-white/20',
        },
        error: {
            bg: 'bg-gradient-to-r from-rose-500 to-red-500',
            icon: Icons.Alert,
            iconBg: 'bg-white/20',
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
            icon: Icons.Info,
            iconBg: 'bg-white/20',
        },
    };

    const config = types[type] || types.success;
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`
                ${config.bg}
                fixed top-4 right-4 z-50
                flex items-center gap-3
                rounded-xl px-4 py-3 pr-12
                text-white shadow-2xl
                max-w-md
            `}
        >
            <div className={`${config.iconBg} rounded-lg p-1.5`}>
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold">{message}</p>
            
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition-colors hover:bg-white/20"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </motion.div>
    );
}
