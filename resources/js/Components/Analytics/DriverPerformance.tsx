import { motion } from 'framer-motion';
import { Icons } from '@/Components/Icons';

interface Driver {
    id: number;
    name: string;
    deliveries: number;
    on_time_rate: number;
    avg_rating: number;
}

export default function DriverPerformance({ drivers }: { drivers: Driver[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">
                    Performance des livreurs
                </h3>
                <p className="text-sm text-slate-600">
                    Top livreurs du mois
                </p>
            </div>

            <div className="space-y-4">
                {drivers.map((driver, index) => (
                    <motion.div
                        key={driver.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/30"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold">
                                    {driver.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{driver.name}</p>
                                    <p className="text-xs text-slate-500">{driver.deliveries} livraisons</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Icons.Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-slate-900">{driver.avg_rating.toFixed(1)}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">À l'heure</span>
                                <span className="font-semibold text-slate-900">{driver.on_time_rate}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${driver.on_time_rate}%` }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
