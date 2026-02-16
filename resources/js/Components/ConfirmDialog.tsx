import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import Button from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    onConfirm,
    onCancel,
    variant = 'danger'
}: ConfirmDialogProps) {
    const variants = {
        danger: {
            icon: Icons.Alert,
            iconBg: 'bg-rose-100',
            iconColor: 'text-rose-600',
            confirmVariant: 'danger' as const
        },
        warning: {
            icon: Icons.Alert,
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            confirmVariant: 'primary' as const
        },
        info: {
            icon: Icons.Check,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            confirmVariant: 'primary' as const
        }
    };

    const config = variants[variant];
    const Icon = config.icon;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                />

                {/* Dialog */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                >
                    <div className="p-6">
                        {/* Icon */}
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-50 to-red-50">
                            <Icon className={`h-6 w-6 ${config.iconColor}`} />
                        </div>

                        {/* Title */}
                        <h3 className="mt-4 text-center text-lg font-bold text-slate-900">
                            {title}
                        </h3>

                        {/* Message */}
                        <p className="mt-2 text-center text-sm text-slate-600">
                            {message}
                        </p>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3">
                            <Button
                                variant="secondary"
                                onClick={onCancel}
                                className="flex-1"
                            >
                                {cancelText}
                            </Button>
                            <Button
                                variant={config.confirmVariant}
                                onClick={onConfirm}
                                className="flex-1"
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
