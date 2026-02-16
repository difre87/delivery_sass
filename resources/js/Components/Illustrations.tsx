import { motion } from 'framer-motion';

// Illustration: Camion de livraison avec animation
export const DeliveryTruckIllustration = () => (
    <svg viewBox="0 0 600 400" className="w-full h-full">
        <defs>
            <linearGradient id="truckGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
        </defs>

        {/* Ciel et fond */}
        <rect x="0" y="0" width="600" height="280" fill="#0f172a" />
        
        {/* Étoiles scintillantes */}
        <motion.circle
            cx="80" cy="40" r="2" fill="#22d3ee"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
            cx="150" cy="60" r="1.5" fill="#34d399"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle
            cx="480" cy="50" r="2" fill="#22d3ee"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.circle
            cx="520" cy="80" r="1.5" fill="#34d399"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.8, repeat: Infinity }}
        />

        {/* Bâtiments en arrière-plan */}
        <g opacity="0.4">
            <rect x="30" y="180" width="80" height="100" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="40" y="190" width="15" height="20" fill="#22d3ee" opacity="0.3" />
            <rect x="65" y="190" width="15" height="20" fill="#22d3ee" opacity="0.3" />
            <rect x="40" y="220" width="15" height="20" fill="#22d3ee" opacity="0.3" />
            <rect x="65" y="220" width="15" height="20" fill="#22d3ee" opacity="0.3" />
            
            <rect x="450" y="150" width="100" height="130" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="465" y="165" width="18" height="25" fill="#34d399" opacity="0.3" />
            <rect x="495" y="165" width="18" height="25" fill="#34d399" opacity="0.3" />
            <rect x="465" y="200" width="18" height="25" fill="#34d399" opacity="0.3" />
            <rect x="495" y="200" width="18" height="25" fill="#34d399" opacity="0.3" />
        </g>

        {/* Route */}
        <rect x="0" y="280" width="600" height="120" fill="url(#roadGradient)" />
        
        {/* Lignes de route animées */}
        <motion.line
            x1="0" y1="340" x2="100" y2="340"
            stroke="#64748b" strokeWidth="3" strokeDasharray="20,30"
            animate={{ x1: [0, 600], x2: [100, 700] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Camion de livraison avec animation de rebond */}
        <motion.g
            animate={{ 
                y: [0, -8, 0],
                x: [0, 5, 0]
            }}
            transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {/* Ombre du camion */}
            <ellipse cx="300" cy="315" rx="70" ry="8" fill="#000" opacity="0.2" />
            
            {/* Corps du camion */}
            <rect x="240" y="260" width="100" height="45" rx="5" fill="url(#truckGradient)" />
            
            {/* Cabine */}
            <path d="M 240 260 L 240 240 L 270 235 L 290 235 L 290 260 Z" fill="url(#truckGradient)" />
            
            {/* Fenêtres */}
            <rect x="245" y="242" width="20" height="15" rx="2" fill="#0f172a" opacity="0.6" />
            <rect x="270" y="240" width="15" height="15" rx="2" fill="#0f172a" opacity="0.6" />
            
            {/* Détails lumineux */}
            <circle cx="335" cy="270" r="3" fill="#fbbf24" opacity="0.8" />
            <rect x="242" y="262" width="5" height="3" rx="1" fill="#fbbf24" opacity="0.8" />
            
            {/* Roues */}
            <circle cx="265" cy="305" r="12" fill="#1e293b" stroke="#334155" strokeWidth="3" />
            <circle cx="265" cy="305" r="6" fill="#64748b" />
            
            <circle cx="320" cy="305" r="12" fill="#1e293b" stroke="#334155" strokeWidth="3" />
            <circle cx="320" cy="305" r="6" fill="#64748b" />
            
            {/* Colis dans le camion */}
            <rect x="250" y="270" width="15" height="15" rx="2" fill="#f59e0b" opacity="0.7" />
            <rect x="270" y="270" width="15" height="15" rx="2" fill="#f59e0b" opacity="0.7" />
            <rect x="290" y="270" width="15" height="15" rx="2" fill="#f59e0b" opacity="0.7" />
            <rect x="310" y="270" width="15" height="15" rx="2" fill="#f59e0b" opacity="0.7" />
        </motion.g>

        {/* Panneaux de localisation animés */}
        <motion.g
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            <circle cx="120" cy="200" r="8" fill="#22d3ee" opacity="0.3" />
            <circle cx="120" cy="200" r="4" fill="#22d3ee" />
            <line x1="120" y1="200" x2="120" y2="280" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
        </motion.g>

        <motion.g
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        >
            <circle cx="420" cy="220" r="8" fill="#34d399" opacity="0.3" />
            <circle cx="420" cy="220" r="4" fill="#34d399" />
            <line x1="420" y1="220" x2="420" y2="280" stroke="#34d399" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
        </motion.g>

        {/* Moto de livraison rapide - Traverse l'écran */}
        <motion.g
            animate={{ 
                x: [-100, 700],
                y: [0, -5, 0, -3, 0]
            }}
            transition={{ 
                x: { duration: 4, repeat: Infinity, ease: "linear" },
                y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
            }}
        >
            {/* Ombre de la moto */}
            <motion.ellipse 
                cx="80" cy="295" rx="25" ry="4" 
                fill="#000" opacity="0.3"
                animate={{ scaleX: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
            />
            
            {/* Roues de la moto */}
            <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
                style={{ originX: "50px", originY: "285px" }}
            >
                <circle cx="50" cy="285" r="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <line x1="50" y1="277" x2="50" y2="293" stroke="#475569" strokeWidth="1.5" />
                <line x1="42" y1="285" x2="58" y2="285" stroke="#475569" strokeWidth="1.5" />
            </motion.g>
            
            <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
                style={{ originX: "95px", originY: "285px" }}
            >
                <circle cx="95" cy="285" r="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <line x1="95" y1="277" x2="95" y2="293" stroke="#475569" strokeWidth="1.5" />
                <line x1="87" y1="285" x2="103" y2="285" stroke="#475569" strokeWidth="1.5" />
            </motion.g>

            {/* Corps de la moto */}
            <path d="M 50 285 L 65 270 L 85 268 L 95 285" 
                  fill="#f97316" stroke="#ea580c" strokeWidth="2" />
            
            {/* Réservoir */}
            <ellipse cx="72" cy="268" rx="12" ry="8" fill="#fb923c" stroke="#ea580c" strokeWidth="1.5" />
            
            {/* Guidon */}
            <path d="M 85 268 L 88 262 L 92 262" 
                  stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <path d="M 85 268 L 88 262 L 84 262" 
                  stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            
            {/* Siège */}
            <ellipse cx="70" cy="265" rx="10" ry="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            
            {/* Conducteur (casque) */}
            <circle cx="82" cy="255" r="7" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.5" />
            <ellipse cx="84" cy="254" rx="3" ry="4" fill="#0f172a" opacity="0.6" />
            
            {/* Corps du conducteur */}
            <path d="M 82 262 L 80 270 L 75 275" 
                  stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 82 262 L 88 268" 
                  stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            
            {/* Colis sur le dos */}
            <rect x="76" y="260" width="8" height="8" rx="1" fill="#10b981" stroke="#059669" strokeWidth="1" />
            <line x1="78" y1="262" x2="82" y2="266" stroke="#f8fafc" strokeWidth="0.5" />
            <line x1="82" y1="262" x2="78" y2="266" stroke="#f8fafc" strokeWidth="0.5" />
            
            {/* Phare avant */}
            <motion.circle 
                cx="100" cy="275" r="2" 
                fill="#fbbf24"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 0.3, repeat: Infinity }}
            />
            
            {/* Lignes de vitesse */}
            <motion.g
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
            >
                <line x1="30" y1="270" x2="20" y2="270" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                <line x1="35" y1="278" x2="25" y2="278" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                <line x1="32" y1="285" x2="22" y2="285" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </motion.g>
        </motion.g>
    </svg>
);

// Illustration: Dashboard avec graphiques
export const DashboardIllustration = () => (
    <svg viewBox="0 0 500 350" className="w-full h-full">
        <defs>
            <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="chartGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#10b981" opacity="0.8" />
                <stop offset="100%" stopColor="#22d3ee" opacity="0.8" />
            </linearGradient>
        </defs>

        {/* Fond */}
        <rect width="500" height="350" fill="#0f172a" rx="12" />

        {/* Cartes de statistiques */}
        <motion.g
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Carte 1 */}
            <rect x="20" y="20" width="140" height="80" rx="8" fill="url(#cardGradient)" stroke="#334155" strokeWidth="1" />
            <text x="35" y="45" fill="#94a3b8" fontSize="12" fontWeight="600">Livraisons</text>
            <text x="35" y="70" fill="#f8fafc" fontSize="24" fontWeight="bold">1,247</text>
            <motion.text
                x="35" y="90" fill="#10b981" fontSize="11"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                +12.5% ↗
            </motion.text>

            {/* Carte 2 */}
            <rect x="180" y="20" width="140" height="80" rx="8" fill="url(#cardGradient)" stroke="#334155" strokeWidth="1" />
            <text x="195" y="45" fill="#94a3b8" fontSize="12" fontWeight="600">Revenus</text>
            <text x="195" y="70" fill="#f8fafc" fontSize="24" fontWeight="bold">€42.8K</text>
            <motion.text
                x="195" y="90" fill="#22d3ee" fontSize="11"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
                +8.2% ↗
            </motion.text>

            {/* Carte 3 */}
            <rect x="340" y="20" width="140" height="80" rx="8" fill="url(#cardGradient)" stroke="#334155" strokeWidth="1" />
            <text x="355" y="45" fill="#94a3b8" fontSize="12" fontWeight="600">Véhicules</text>
            <text x="355" y="70" fill="#f8fafc" fontSize="24" fontWeight="bold">24/28</text>
            <text x="355" y="90" fill="#94a3b8" fontSize="11">En route</text>
        </motion.g>

        {/* Graphique principal */}
        <motion.g
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <rect x="20" y="120" width="460" height="210" rx="8" fill="url(#cardGradient)" stroke="#334155" strokeWidth="1" />
            <text x="35" y="145" fill="#f8fafc" fontSize="14" fontWeight="600">Performance des livraisons</text>
            
            {/* Axes du graphique */}
            <line x1="50" y1="160" x2="50" y2="310" stroke="#334155" strokeWidth="2" />
            <line x1="50" y1="310" x2="460" y2="310" stroke="#334155" strokeWidth="2" />
            
            {/* Barres animées */}
            {[
                { x: 80, height: 80, delay: 0 },
                { x: 130, height: 110, delay: 0.1 },
                { x: 180, height: 90, delay: 0.2 },
                { x: 230, height: 130, delay: 0.3 },
                { x: 280, height: 100, delay: 0.4 },
                { x: 330, height: 140, delay: 0.5 },
                { x: 380, height: 120, delay: 0.6 },
                { x: 430, height: 145, delay: 0.7 },
            ].map((bar, i) => (
                <motion.rect
                    key={i}
                    x={bar.x}
                    y={310 - bar.height}
                    width="30"
                    height={bar.height}
                    rx="4"
                    fill="url(#chartGradient)"
                    initial={{ height: 0, y: 310 }}
                    animate={{ height: bar.height, y: 310 - bar.height }}
                    transition={{ duration: 0.8, delay: bar.delay, ease: "easeOut" }}
                />
            ))}
            
            {/* Labels */}
            <text x="85" y="325" fill="#64748b" fontSize="10">Lun</text>
            <text x="135" y="325" fill="#64748b" fontSize="10">Mar</text>
            <text x="185" y="325" fill="#64748b" fontSize="10">Mer</text>
            <text x="235" y="325" fill="#64748b" fontSize="10">Jeu</text>
            <text x="285" y="325" fill="#64748b" fontSize="10">Ven</text>
            <text x="335" y="325" fill="#64748b" fontSize="10">Sam</text>
            <text x="385" y="325" fill="#64748b" fontSize="10">Dim</text>
        </motion.g>
    </svg>
);

// Illustration: Réseau de livraison
export const NetworkIllustration = () => (
    <svg viewBox="0 0 500 400" className="w-full h-full">
        <defs>
            <radialGradient id="nodeGradient">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
            </radialGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Fond */}
        <rect width="500" height="400" fill="#0f172a" rx="12" />

        {/* Centre de distribution (hub principal) */}
        <motion.g
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            <circle cx="250" cy="200" r="30" fill="url(#nodeGradient)" filter="url(#glow)" />
            <circle cx="250" cy="200" r="20" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <path d="M 240 195 L 245 205 L 260 185" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>

        {/* Nœuds de livraison */}
        {[
            { cx: 100, cy: 80, delay: 0 },
            { cx: 400, cy: 80, delay: 0.2 },
            { cx: 80, cy: 250, delay: 0.4 },
            { cx: 420, cy: 250, delay: 0.6 },
            { cx: 150, cy: 340, delay: 0.8 },
            { cx: 350, cy: 340, delay: 1 },
        ].map((node, i) => (
            <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: node.delay, duration: 0.5 }}
            >
                {/* Ligne de connexion animée */}
                <motion.line
                    x1="250" y1="200"
                    x2={node.cx} y2={node.cy}
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.3"
                    animate={{ strokeDashoffset: [0, -10] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Particule qui voyage */}
                <motion.circle
                    r="3"
                    fill="#22d3ee"
                    animate={{
                        cx: [250, node.cx],
                        cy: [200, node.cy],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: node.delay,
                        ease: "easeInOut"
                    }}
                />
                
                {/* Nœud */}
                <circle cx={node.cx} cy={node.cy} r="15" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
                <circle cx={node.cx} cy={node.cy} r="6" fill="#22d3ee" />
            </motion.g>
        ))}

        {/* Texte central */}
        <text x="250" y="260" textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="600">
            Hub Central
        </text>
        <text x="250" y="278" textAnchor="middle" fill="#94a3b8" fontSize="11">
            6 destinations actives
        </text>
    </svg>
);

// Illustration: Optimisation de route
export const RouteOptimizationIllustration = () => (
    <svg viewBox="0 0 500 400" className="w-full h-full">
        <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
        </defs>

        {/* Fond carte */}
        <rect width="500" height="400" fill="url(#mapGradient)" rx="12" />

        {/* Grille de carte stylisée */}
        <g opacity="0.1">
            {[...Array(10)].map((_, i) => (
                <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="#64748b" strokeWidth="1" />
            ))}
            {[...Array(8)].map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 50} x2="500" y2={i * 50} stroke="#64748b" strokeWidth="1" />
            ))}
        </g>

        {/* Routes */}
        <motion.path
            d="M 50 350 Q 150 250, 200 200 T 350 100 Q 400 70, 450 80"
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="500"
            initial={{ strokeDashoffset: 500 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Points d'arrêt */}
        {[
            { x: 50, y: 350, label: 'A', delay: 0 },
            { x: 200, y: 200, label: 'B', delay: 0.4 },
            { x: 350, y: 100, label: 'C', delay: 0.8 },
            { x: 450, y: 80, label: 'D', delay: 1.2 },
        ].map((point, i) => (
            <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: point.delay, duration: 0.5 }}
            >
                <circle cx={point.x} cy={point.y} r="20" fill="#10b981" opacity="0.2" />
                <circle cx={point.x} cy={point.y} r="12" fill="#10b981" />
                <text
                    x={point.x}
                    y={point.y + 5}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="14"
                    fontWeight="bold"
                >
                    {point.label}
                </text>
            </motion.g>
        ))}

        {/* Véhicule en mouvement */}
        <motion.g
            animate={{
                offsetDistance: ["0%", "100%"],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
            }}
            style={{
                offsetPath: "path('M 50 350 Q 150 250, 200 200 T 350 100 Q 400 70, 450 80')",
            }}
        >
            <circle r="8" fill="#22d3ee" filter="url(#glow)" />
        </motion.g>

        {/* Info panel */}
        <motion.g
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
        >
            <rect x="20" y="20" width="180" height="100" rx="8" fill="#1e293b" fillOpacity="0.9" stroke="#334155" strokeWidth="1" />
            <text x="35" y="45" fill="#f8fafc" fontSize="13" fontWeight="600">Optimisation route</text>
            <text x="35" y="65" fill="#10b981" fontSize="11">✓ Distance: 42.3 km</text>
            <text x="35" y="82" fill="#22d3ee" fontSize="11">✓ Temps: 38 min</text>
            <text x="35" y="99" fill="#f59e0b" fontSize="11">✓ Économie: 23%</text>
        </motion.g>
    </svg>
);

// Illustration: Gestion de flotte
export const FleetManagementIllustration = () => (
    <svg viewBox="0 0 500 350" className="w-full h-full">
        <defs>
            <linearGradient id="vehicleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
        </defs>

        {/* Fond */}
        <rect width="500" height="350" fill="#0f172a" rx="12" />

        {/* Titre */}
        <text x="20" y="35" fill="#f8fafc" fontSize="18" fontWeight="600">Flotte en temps réel</text>

        {/* Véhicules avec statuts */}
        {[
            { x: 50, y: 100, status: 'active', label: 'VH-001', progress: 75 },
            { x: 50, y: 170, status: 'active', label: 'VH-002', progress: 45 },
            { x: 50, y: 240, status: 'maintenance', label: 'VH-003', progress: 0 },
            { x: 270, y: 100, status: 'active', label: 'VH-004', progress: 90 },
            { x: 270, y: 170, status: 'inactive', label: 'VH-005', progress: 0 },
            { x: 270, y: 240, status: 'active', label: 'VH-006', progress: 30 },
        ].map((vehicle, i) => (
            <motion.g
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
            >
                {/* Carte véhicule */}
                <rect
                    x={vehicle.x}
                    y={vehicle.y}
                    width="200"
                    height="50"
                    rx="8"
                    fill="#1e293b"
                    stroke={vehicle.status === 'active' ? '#10b981' : vehicle.status === 'maintenance' ? '#f59e0b' : '#475569'}
                    strokeWidth="2"
                />
                
                {/* Icône véhicule */}
                <rect
                    x={vehicle.x + 15}
                    y={vehicle.y + 15}
                    width="30"
                    height="20"
                    rx="3"
                    fill={vehicle.status === 'active' ? 'url(#vehicleGradient)' : '#475569'}
                />
                
                {/* Label */}
                <text
                    x={vehicle.x + 55}
                    y={vehicle.y + 23}
                    fill="#f8fafc"
                    fontSize="12"
                    fontWeight="600"
                >
                    {vehicle.label}
                </text>
                
                {/* Statut */}
                <text
                    x={vehicle.x + 55}
                    y={vehicle.y + 38}
                    fill={vehicle.status === 'active' ? '#10b981' : vehicle.status === 'maintenance' ? '#f59e0b' : '#94a3b8'}
                    fontSize="10"
                >
                    {vehicle.status === 'active' ? 'En route' : vehicle.status === 'maintenance' ? 'Maintenance' : 'Arrêté'}
                </text>
                
                {/* Barre de progression */}
                {vehicle.progress > 0 && (
                    <>
                        <rect
                            x={vehicle.x + 130}
                            y={vehicle.y + 20}
                            width="60"
                            height="4"
                            rx="2"
                            fill="#334155"
                        />
                        <motion.rect
                            x={vehicle.x + 130}
                            y={vehicle.y + 20}
                            width={vehicle.progress * 0.6}
                            height="4"
                            rx="2"
                            fill="url(#vehicleGradient)"
                            initial={{ width: 0 }}
                            animate={{ width: vehicle.progress * 0.6 }}
                            transition={{ delay: i * 0.1 + 0.3, duration: 1, ease: "easeOut" }}
                        />
                        <text
                            x={vehicle.x + 160}
                            y={vehicle.y + 38}
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="10"
                        >
                            {vehicle.progress}%
                        </text>
                    </>
                )}
            </motion.g>
        ))}

        {/* Statistiques résumées */}
        <motion.g
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
        >
            <rect x="20" y="300" width="460" height="35" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <circle cx="50" cy="318" r="6" fill="#10b981" />
            <text x="65" y="322" fill="#f8fafc" fontSize="12">4 actifs</text>
            
            <circle cx="160" cy="318" r="6" fill="#f59e0b" />
            <text x="175" y="322" fill="#f8fafc" fontSize="12">1 maintenance</text>
            
            <circle cx="310" cy="318" r="6" fill="#475569" />
            <text x="325" y="322" fill="#f8fafc" fontSize="12">1 arrêté</text>
        </motion.g>
    </svg>
);

// Illustration: Analytics & Rapports
export const AnalyticsIllustration = () => (
    <svg viewBox="0 0 450 300" className="w-full h-full">
        <defs>
            <linearGradient id="pieGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="pieGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="pieGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
        </defs>

        {/* Fond */}
        <rect width="450" height="300" fill="#0f172a" rx="12" />

        {/* Graphique circulaire animé */}
        <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Segment 1 - 50% */}
            <motion.path
                d="M 150 150 L 150 70 A 80 80 0 0 1 230 150 Z"
                fill="url(#pieGradient1)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            />
            
            {/* Segment 2 - 30% */}
            <motion.path
                d="M 150 150 L 230 150 A 80 80 0 0 1 126 218 Z"
                fill="url(#pieGradient2)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            />
            
            {/* Segment 3 - 20% */}
            <motion.path
                d="M 150 150 L 126 218 A 80 80 0 0 1 150 70 Z"
                fill="url(#pieGradient3)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            />
            
            {/* Centre */}
            <circle cx="150" cy="150" r="45" fill="#0f172a" />
            <text x="150" y="145" textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="bold">
                €127K
            </text>
            <text x="150" y="162" textAnchor="middle" fill="#94a3b8" fontSize="11">
                Total
            </text>
        </motion.g>

        {/* Légende */}
        <motion.g
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
        >
            <rect x="270" y="70" width="150" height="160" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            
            <circle cx="285" cy="90" r="6" fill="url(#pieGradient1)" />
            <text x="300" y="95" fill="#f8fafc" fontSize="12" fontWeight="500">Livraisons</text>
            <text x="385" y="95" fill="#10b981" fontSize="12" fontWeight="600">50%</text>
            
            <circle cx="285" cy="125" r="6" fill="url(#pieGradient2)" />
            <text x="300" y="130" fill="#f8fafc" fontSize="12" fontWeight="500">Express</text>
            <text x="385" y="130" fill="#22d3ee" fontSize="12" fontWeight="600">30%</text>
            
            <circle cx="285" cy="160" r="6" fill="url(#pieGradient3)" />
            <text x="300" y="165" fill="#f8fafc" fontSize="12" fontWeight="500">Spéciaux</text>
            <text x="385" y="165" fill="#f59e0b" fontSize="12" fontWeight="600">20%</text>
            
            <line x1="280" y1="185" x2="410" y2="185" stroke="#334155" strokeWidth="1" />
            
            <text x="285" y="205" fill="#94a3b8" fontSize="11">Total revenus</text>
            <text x="285" y="220" fill="#f8fafc" fontSize="16" fontWeight="600">€127,450</text>
        </motion.g>

        {/* Mini indicateurs KPI */}
        <motion.g
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
        >
            <rect x="20" y="250" width="410" height="35" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            
            <text x="35" y="268" fill="#94a3b8" fontSize="10">↗ Croissance</text>
            <text x="35" y="280" fill="#10b981" fontSize="11" fontWeight="600">+18.2%</text>
            
            <text x="160" y="268" fill="#94a3b8" fontSize="10">⚡ Satisfaction</text>
            <text x="160" y="280" fill="#22d3ee" fontSize="11" fontWeight="600">94.5%</text>
            
            <text x="295" y="268" fill="#94a3b8" fontSize="10">📦 Livraisons</text>
            <text x="295" y="280" fill="#f59e0b" fontSize="11" fontWeight="600">3,247</text>
        </motion.g>
    </svg>
);
