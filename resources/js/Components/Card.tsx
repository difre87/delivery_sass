import { motion } from 'framer-motion';

export default function Card({ 
    title,
    subtitle,
    icon: Icon,
    iconColor = 'from-emerald-500 to-teal-600',
    children,
    actions,
    className = '' 
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
        >
            {(title || Icon) && (
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {Icon && (
                                <div className={`rounded-xl bg-gradient-to-br ${iconColor} p-2 shadow-lg`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                            )}
                            <div>
                                {title && (
                                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                                )}
                                {subtitle && (
                                    <p className="text-sm text-slate-600">{subtitle}</p>
                                )}
                            </div>
                        </div>
                        {actions && <div className="flex items-center gap-2">{actions}</div>}
                    </div>
                </div>
            )}
            <div className="p-6">{children}</div>
        </motion.div>
    );
}
