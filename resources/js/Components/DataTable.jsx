import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';

export default function DataTable({ 
    columns = [], 
    data = [], 
    emptyMessage = "Aucune donnée disponible",
    emptyIcon: EmptyIcon,
    actions,
    striped = false,
}) {
    if (data.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                {EmptyIcon && <EmptyIcon className="mx-auto h-16 w-16 text-slate-300 mb-4" />}
                <p className="text-sm font-semibold text-slate-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {actions && (
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-600">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {data.map((row, rowIndex) => (
                            <motion.tr
                                key={rowIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: rowIndex * 0.03 }}
                                className={`
                                    transition-colors duration-150
                                    ${striped && rowIndex % 2 === 1 ? 'bg-slate-50/50' : ''}
                                    hover:bg-emerald-50/50
                                `}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                    >
                                        {column.render ? column.render(row) : row[column.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex items-center justify-end gap-2">
                                            {actions(row)}
                                        </div>
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
