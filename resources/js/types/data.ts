// Navigation items
export const navItems = [
    { label: 'Modules', href: '#modules' },
    { label: 'Tarifs', href: '#pricing' },
    { label: 'Intégrations', href: '#integrations' },
    { label: 'FAQ', href: '#faq' },
];

// Features list
export const features = [
    {
        title: 'Exploitation livraisons',
        description:
            'Planifie les tournées, assigne chauffeurs et véhicules, et suis chaque livraison en temps réel.',
    },
    {
        title: 'Bordereaux intelligents',
        description:
            'Génère automatiquement les bordereaux avec QR code, preuve de livraison et historique complet.',
    },
    {
        title: 'Gestion du parc',
        description:
            'Centralise véhicules, entretiens, disponibilités et alertes de maintenance.',
    },
    {
        title: 'Kilométrage & carburant',
        description:
            'Saisis les relevés odomètre, contrôle la consommation et calcule le coût réel par tournée.',
    },
    {
        title: 'Pilotage multi-sociétés',
        description:
            'Architecture SaaS multi-tenant pour isoler les données et gérer plusieurs entreprises.',
    },
    {
        title: 'Rentabilité & KPI',
        description:
            'Visualise marge, km à vide, retards et performance opérationnelle par client ou période.',
    },
];

// Stats displayed in hero section
export const stats = [
    { label: 'Livraisons', value: 'Suivi en continu' },
    { label: 'Parc roulant', value: 'Vue centralisée' },
    { label: 'Coûts', value: 'Analyse par tournée' },
];

// Customer testimonials
export const testimonials = [
    {
        quote:
            'On a réduit nos kilomètres à vide en 3 semaines grâce à la vue tournée + carburant.',
        author: 'Nadia B.',
        role: 'Responsable exploitation, TransExpress',
    },
    {
        quote:
            'Les bordereaux unifiés ont supprimé nos erreurs de facturation et accéléré la clôture mensuelle.',
        author: 'Karim L.',
        role: 'Directeur opérationnel, FastColis',
    },
    {
        quote:
            'Le modèle SaaS multi-sociétés nous permet de piloter plusieurs entités sans mélange de données.',
        author: 'Julien M.',
        role: 'CEO, LogiFleet Group',
    },
];

// Available integrations
export const integrations = [
    'Paiement manuel',
    'API REST',
    'Webhooks',
    'Exports CSV/Excel',
    'Email & SMS',
    'Stockage S3',
];

// Proof logos - customer companies
export const proofLogos = [
    'TransExpress',
    'FastColis',
    'LogiFleet',
    'UrbanDrop',
    'CargoLink',
];

// Proof statistics
export const proofStats = [
    { label: 'Livraisons à l\'heure', value: '+24%' },
    { label: 'Coût carburant / km', value: '-17%' },
    { label: 'Marge opérationnelle', value: '+18%' },
];

// Frequently Asked Questions
export const faqs = [
    {
        q: 'Est-ce que chaque entreprise a ses données isolées ?',
        a: 'Oui. Chaque compte travaille dans sa propre société avec isolation multi-tenant.',
    },
    {
        q: 'Puis-je commencer sans installer une app mobile native ?',
        a: 'Oui. Une interface web/PWA suffit pour lancer les opérations chauffeurs rapidement.',
    },
    {
        q: 'Le SaaS gère-t-il la facturation des clients finaux ?',
        a: 'Oui, avec calcul des coûts, génération des lignes et exports pour la comptabilité.',
    },
    {
        q: 'Peut-on connecter un système externe ?',
        a: 'Oui, via API et webhooks pour synchroniser commandes, clients et statuts.',
    },
];

// Animation variants for Framer Motion
export const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
} as const;

// Utility function to format plan prices
export const formatPrice = (plan: { price_cents: number }) => {
    if (plan.price_cents === 0) {
        return 'Gratuit';
    }

    return `${(plan.price_cents / 100).toLocaleString('fr-FR')}€`;
};
