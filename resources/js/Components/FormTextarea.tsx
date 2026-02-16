import { motion } from 'framer-motion';

export default function FormTextarea({ 
    label, 
    error, 
    className = '', 
    ...props 
}) {
    return (
        <div className={className}>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                {label}
                {props.required && <span className="ml-1 text-rose-500">*</span>}
            </label>
            <textarea
                {...props}
                className={`
                    w-full rounded-xl border-2 bg-white px-4 py-3 text-sm font-medium text-slate-900
                    transition-all duration-200
                    ${error 
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100' 
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                    }
                    placeholder:text-slate-400
                    disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
                    hover:border-slate-300
                `}
            />
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-600"
                >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </motion.p>
            )}
        </div>
    );
}
