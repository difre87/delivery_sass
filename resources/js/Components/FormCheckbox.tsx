import { motion } from 'framer-motion';

export default function FormCheckbox({ 
    label, 
    description,
    className = '', 
    ...props 
}) {
    return (
        <div className={className}>
            <label className="group flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center">
                    <input
                        type="checkbox"
                        {...props}
                        className="
                            peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-300
                            bg-white transition-all duration-200
                            checked:border-emerald-500 checked:bg-emerald-500
                            hover:border-slate-400
                            focus:ring-4 focus:ring-emerald-100
                            disabled:cursor-not-allowed disabled:bg-slate-100
                        "
                    />
                    <svg
                        className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="flex-1">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                        {label}
                    </span>
                    {description && (
                        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                    )}
                </div>
            </label>
        </div>
    );
}
