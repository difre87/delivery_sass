import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Pagination({ links = [] }) {
    if (links.length <= 3) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center justify-center gap-2"
        >
            {links.map((link, index) => {
                const isActive = link.active;
                const isDisabled = !link.url;
                
                return (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url || '#'}
                        preserveScroll
                        className={`
                            group relative inline-flex items-center justify-center min-w-[40px] px-4 py-2.5
                            rounded-xl text-sm font-bold transition-all duration-200
                            ${isActive 
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105' 
                                : isDisabled
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
                            }
                            ${isDisabled ? 'pointer-events-none' : ''}
                        `}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </motion.div>
    );
}
