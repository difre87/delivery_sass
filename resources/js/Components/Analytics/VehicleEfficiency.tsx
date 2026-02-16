import { motion } from 'framer-motion';

interface Vehicle {
    id: number;
    plate_number: string;
    make?: string;
    model?: string;
    deliveries: number;
    distance_km: number;
    fuel_cost: number;
    efficiency_score: number;
}

export default function VehicleEfficiency({ vehicles }: { vehicles: Vehicle[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">
                    Efficacité des véhicules
                </h3>
                <p className="text-sm text-slate-600">
                    Performance par véhicule
                </p>
            </div>

            <div className="space-y-4">
                {vehicles.map((vehicle, index) => (
                    <motion.div
                        key={vehicle.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50/30"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-slate-900">
                                    {vehicle.plate_number}
                                    {vehicle.make && vehicle.model && (
                                        <span className="ml-2 text-xs text-slate-500">
                                            {vehicle.make} {vehicle.model}
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-slate-500">{vehicle.deliveries} livraisons</p>
                            </div>
                            <div className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                                vehicle.efficiency_score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                vehicle.efficiency_score >= 60 ? 'bg-amber-100 text-amber-700' :
                                'bg-rose-100 text-rose-700'
                            }`}>
                                {vehicle.efficiency_score}%
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500">Distance</p>
                                <p className="font-semibold text-slate-900">{vehicle.distance_km} km</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Carburant</p>
                                <p className="font-semibold text-slate-900">{(vehicle.fuel_cost / 100).toFixed(2)} €</p>
                            </div>
                        </div>

                        {/* Efficiency bar */}
                        <div className="mt-3">
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${vehicle.efficiency_score}%` }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                    className={`h-full rounded-full ${
                                        vehicle.efficiency_score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                                        vehicle.efficiency_score >= 60 ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                                        'bg-gradient-to-r from-rose-400 to-rose-600'
                                    }`}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
