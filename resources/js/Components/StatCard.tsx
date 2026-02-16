import { motion } from 'framer-motion';

export default function StatCard({ 
    label, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'emerald',
    delay = 0 
}) {
    const colorVariants = {
        emerald: {
            bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            text: 'text-emerald-600',
            lightBg: 'bg-emerald-50',
            border: 'border-emerald-200',
        },
        cyan: {
            bg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
            text: 'text-cyan-600',
            lightBg: 'bg-cyan-50',
            border: 'border-cyan-200',
        },
        amber: {
            bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
            text: 'text-amber-600',
            lightBg: 'bg-amber-50',
            border: 'border-amber-200',
        },
        indigo: {
            bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
            text: 'text-indigo-600',
            lightBg: 'bg-indigo-50',
            border: 'border-indigo-200',
        },
        rose: {
            bg: 'bg-gradient-to-br from-rose-500 to-pink-600',
            text: 'text-rose-600',
            lightBg: 'bg-rose-50',
            border: 'border-rose-200',
        },
    };

    const colors = colorVariants[color] || colorVariants.emerald;

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-white p-6 shadow-sm transition-shadow hover:shadow-xl`}
        >
            {/* Gradient accent */}
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${colors.bg} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`} />
            
            <div className="relative">
                <div className="flex items-start justify-between">
                    <div className={`rounded-xl ${colors.lightBg} p-3`}>
                        {Icon && <Icon className={`h-6 w-6 ${colors.text}`} />}
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                            trend === 'up' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-rose-100 text-rose-700'
                        }`}>
                            {trend === 'up' ? '↑' : '↓'} {trendValue}
                        </div>
                    )}
                </div>
                
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                    {value}
                </p>
            </div>
        </motion.article>
    );
}
