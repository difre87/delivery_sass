import { motion } from 'framer-motion';
import { Icons } from '@/Components/Icons';
import { useCurrency } from '@/hooks/useCurrency';

interface Client {
    id: number;
    name: string;
    total_spent: number;
    deliveries_count: number;
    growth_rate: number;
}

export default function TopClientsTable({ clients }: { clients: Client[] }) {
    const { formatCents } = useCurrency();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        Top Clients
                    </h3>
                    <p className="text-sm text-slate-600">
                        Clients les plus actifs ce mois
                    </p>
                </div>
                <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    Voir tout →
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Client
                            </th>
                            <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Livraisons
                            </th>
                            <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Dépenses
                            </th>
                            <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Croissance
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client, index) => (
                            <motion.tr
                                key={client.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                            >
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-cyan-100">
                                            <Icons.Clients className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{client.name}</p>
                                            <p className="text-xs text-slate-500">ID: {client.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-right">
                                    <span className="font-semibold text-slate-900">{client.deliveries_count}</span>
                                </td>
                                <td className="py-4 text-right">
                                    <span className="font-semibold text-slate-900">
                                        {formatCents(client.total_spent)}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                                        client.growth_rate >= 0 
                                            ? 'bg-emerald-100 text-emerald-700' 
                                            : 'bg-rose-100 text-rose-700'
                                    }`}>
                                        {client.growth_rate >= 0 ? '↑' : '↓'}
                                        {Math.abs(client.growth_rate)}%
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
