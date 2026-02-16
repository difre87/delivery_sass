import { motion } from 'framer-motion';
import { Icons } from '@/Components/Icons';

interface Metrics {
    avg_delivery_time: number;
    customer_satisfaction: number;
    on_time_percentage: number;
    fuel_efficiency: number;
}

export default function PerformanceMetrics({ metrics }: { metrics: Metrics }) {
    const performanceCards = [
        {
            title: 'Temps moyen de livraison',
            value: `${Math.round(metrics.avg_delivery_time)} min`,
            target: '30 min',
            percentage: Math.min(100, (30 / metrics.avg_delivery_time) * 100),
            icon: Icons.Clock,
            color: 'amber',
        },
        {
            title: 'Satisfaction client',
            value: `${metrics.customer_satisfaction}/5`,
            target: '5/5',
            percentage: (metrics.customer_satisfaction / 5) * 100,
            icon: Icons.Star,
            color: 'yellow',
        },
        {
            title: 'Livraisons à l\'heure',
            value: `${metrics.on_time_percentage}%`,
            target: '100%',
            percentage: metrics.on_time_percentage,
            icon: Icons.CheckCircle,
            color: 'emerald',
        },
        {
            title: 'Efficacité carburant',
            value: `${metrics.fuel_efficiency.toFixed(1)} L/100km`,
            target: '8 L/100km',
            percentage: Math.min(100, (8 / metrics.fuel_efficiency) * 100),
            icon: Icons.Fuel,
            color: 'rose',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">
                    Indicateurs de performance
                </h3>
                <p className="text-sm text-slate-600">
                    Métriques clés de votre activité
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {performanceCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`rounded-lg bg-${card.color}-100 p-2`}>
                                <card.icon className={`h-5 w-5 text-${card.color}-600`} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-600">{card.title}</p>
                                <p className="text-lg font-bold text-slate-900">{card.value}</p>
                            </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Objectif: {card.target}</span>
                                <span className={`font-semibold text-${card.color}-600`}>
                                    {Math.round(card.percentage)}%
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${card.percentage}%` }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                    className={`h-full rounded-full bg-gradient-to-r from-${card.color}-400 to-${card.color}-600`}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
