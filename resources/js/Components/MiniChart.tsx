import { motion } from 'framer-motion';

export default function MiniChart({ data, color = 'emerald' }) {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const colorVariants = {
        emerald: 'stroke-emerald-500',
        cyan: 'stroke-cyan-500',
        amber: 'stroke-amber-500',
        indigo: 'stroke-indigo-500',
    };

    const strokeColor = colorVariants[color] || colorVariants.emerald;

    return (
        <svg
            viewBox={`0 0 ${data.length * 10} 40`}
            className="h-12 w-full"
            preserveAspectRatio="none"
        >
            <motion.polyline
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={strokeColor}
                points={data
                    .map((value, i) => {
                        const x = i * 10;
                        const y = 35 - ((value - min) / range) * 30;
                        return `${x},${y}`;
                    })
                    .join(' ')}
            />
        </svg>
    );
}
