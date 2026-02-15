import { motion } from 'framer-motion';

export default function Badge({ 
    children, 
    variant = 'default',
    size = 'md',
    className = '' 
}) {
    const variants = {
        default: 'bg-slate-100 text-slate-700',
        success: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm',
        warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm',
        danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-sm',
        info: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm',
        primary: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
    };

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 rounded-full font-bold uppercase
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
        >
            {children}
        </span>
    );
}
