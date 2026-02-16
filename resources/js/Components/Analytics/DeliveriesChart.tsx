import { motion } from 'framer-motion';

interface DeliveryData {
    date: string;
    count: number;
}

export default function DeliveriesChart({ data }: { data: DeliveryData[] }) {
    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        Livraisons effectuées
                    </h3>
                    <p className="text-sm text-slate-600">
                        Nombre de livraisons par jour
                    </p>
                </div>
                <div className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    +8.3%
                </div>
            </div>
            
            <div className="relative h-[300px]">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 pr-2">
                    <span>{maxCount}</span>
                    <span>{Math.round(maxCount / 2)}</span>
                    <span>0</span>
                </div>

                {/* Chart bars */}
                <div className="ml-12 flex h-full items-end justify-between gap-2">
                    {data.map((item, index) => {
                        const height = (item.count / maxCount) * 100;
                        return (
                            <div key={index} className="flex flex-1 flex-col items-center gap-2">
                                <div className="group relative flex w-full items-end justify-center">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ delay: index * 0.05, duration: 0.5 }}
                                        className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:from-blue-600 hover:to-blue-500"
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block">
                                        <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-xl">
                                            <div className="font-semibold">
                                                {item.count} livraisons
                                            </div>
                                            <div className="text-slate-300">
                                                {new Date(item.date).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500">
                                    {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}
