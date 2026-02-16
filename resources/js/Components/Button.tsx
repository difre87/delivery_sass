import { motion } from 'framer-motion';

export default function Button({ 
    children, 
    variant = 'primary', 
    size = 'md',
    icon: Icon = null,
    isLoading = false,
    className = '', 
    ...props 
}) {
    const variants = {
        primary: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40',
        secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200',
        danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-700 hover:to-red-700 shadow-lg shadow-rose-500/30',
        outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...props}
            disabled={isLoading || props.disabled}
            className={`
                inline-flex items-center justify-center gap-2 rounded-xl font-bold
                transition-all duration-200
                disabled:cursor-not-allowed disabled:opacity-50
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
        >
            {isLoading ? (
                <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Chargement...</span>
                </>
            ) : (
                <>
                    {Icon && <Icon className="h-5 w-5" />}
                    {children}
                </>
            )}
        </motion.button>
    );
}
