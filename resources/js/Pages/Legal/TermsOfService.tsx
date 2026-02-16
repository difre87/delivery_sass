import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
    return (
        <>
            <Head title="Conditions Générales d'Utilisation" />

            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                {/* Header */}
                <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400">
                                <svg className="h-6 w-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">Delivery SaaS</span>
                        </Link>

                        <Link
                            href="/"
                            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
                        >
                            Retour
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="mx-auto max-w-4xl px-6 pt-32 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-bold text-white lg:text-5xl">
                            Conditions Générales d'Utilisation
                        </h1>
                        <p className="mt-4 text-slate-400">
                            Dernière mise à jour : 16 février 2026
                        </p>

                        <div className="mt-12 space-y-8 text-slate-300">
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">1. Objet</h2>
                                <p className="leading-relaxed">
                                    Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions d'utilisation de la plateforme Delivery SaaS (ci-après « la Plateforme »), ainsi que les droits et obligations des utilisateurs.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">2. Définitions</h2>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li><strong className="text-white">Utilisateur :</strong> Toute personne physique ou morale utilisant la Plateforme.</li>
                                    <li><strong className="text-white">Client :</strong> Utilisateur ayant souscrit à un abonnement payant.</li>
                                    <li><strong className="text-white">Services :</strong> Ensemble des fonctionnalités proposées par la Plateforme.</li>
                                    <li><strong className="text-white">Compte :</strong> Espace personnel créé par l'Utilisateur sur la Plateforme.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">3. Acceptation des CGU</h2>
                                <p className="leading-relaxed">
                                    L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. L'Utilisateur reconnaît avoir pris connaissance des CGU et les accepter sans réserve.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">4. Inscription et Compte</h2>
                                <p className="leading-relaxed mb-4">
                                    L'accès à certaines fonctionnalités de la Plateforme nécessite la création d'un Compte. L'Utilisateur s'engage à :
                                </p>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Fournir des informations exactes, complètes et à jour</li>
                                    <li>Conserver la confidentialité de ses identifiants de connexion</li>
                                    <li>Ne pas créer de compte au nom d'un tiers sans autorisation</li>
                                    <li>Informer immédiatement la Plateforme de toute utilisation non autorisée de son compte</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">5. Services et Abonnements</h2>
                                <p className="leading-relaxed mb-4">
                                    La Plateforme propose différents plans d'abonnement avec des fonctionnalités variables. Les caractéristiques de chaque plan sont décrites sur la page des tarifs.
                                </p>
                                <p className="leading-relaxed">
                                    Les tarifs sont indiqués en euros TTC. La Plateforme se réserve le droit de modifier ses tarifs à tout moment, sous réserve d'en informer les Clients au moins 30 jours avant l'application des nouveaux tarifs.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">6. Période d'Essai</h2>
                                <p className="leading-relaxed">
                                    Une période d'essai gratuite peut être proposée pour certains plans. À l'issue de cette période, le Client sera automatiquement facturé selon le plan choisi, sauf annulation explicite avant la fin de la période d'essai.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">7. Paiement et Facturation</h2>
                                <p className="leading-relaxed mb-4">
                                    Les paiements sont effectués par carte bancaire ou tout autre moyen de paiement proposé par la Plateforme. Les abonnements sont renouvelés automatiquement selon la périodicité choisie (mensuelle ou annuelle).
                                </p>
                                <p className="leading-relaxed">
                                    Les factures sont disponibles dans l'espace Client et envoyées par email. En cas de défaut de paiement, la Plateforme se réserve le droit de suspendre ou résilier l'accès aux Services.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">8. Résiliation</h2>
                                <p className="leading-relaxed mb-4">
                                    Le Client peut résilier son abonnement à tout moment depuis son espace Client. La résiliation prendra effet à la fin de la période d'abonnement en cours. Aucun remboursement ne sera effectué pour la période déjà payée.
                                </p>
                                <p className="leading-relaxed">
                                    La Plateforme se réserve le droit de résilier un compte en cas de violation des présentes CGU, après notification et mise en demeure restée sans effet.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">9. Propriété Intellectuelle</h2>
                                <p className="leading-relaxed">
                                    Tous les éléments de la Plateforme (logiciels, textes, images, design, etc.) sont protégés par le droit d'auteur et appartiennent à la Plateforme ou à ses partenaires. Toute reproduction ou utilisation non autorisée est interdite.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">10. Données et Sécurité</h2>
                                <p className="leading-relaxed">
                                    Les données des Clients sont stockées de manière sécurisée. La Plateforme met en œuvre toutes les mesures techniques et organisationnelles nécessaires pour garantir la sécurité et la confidentialité des données. Pour plus d'informations, consultez notre Politique de Confidentialité.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">11. Responsabilité</h2>
                                <p className="leading-relaxed mb-4">
                                    La Plateforme s'efforce d'assurer la disponibilité et la fiabilité des Services, mais ne peut garantir une disponibilité à 100%. La Plateforme décline toute responsabilité en cas de :
                                </p>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Interruption temporaire des Services pour maintenance</li>
                                    <li>Perte de données résultant d'une faute de l'Utilisateur</li>
                                    <li>Dommages indirects ou immatériels</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">12. Modifications des CGU</h2>
                                <p className="leading-relaxed">
                                    La Plateforme se réserve le droit de modifier les présentes CGU à tout moment. Les Utilisateurs seront informés de toute modification significative. L'utilisation continue de la Plateforme après modification vaut acceptation des nouvelles CGU.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">13. Loi Applicable et Juridiction</h2>
                                <p className="leading-relaxed">
                                    Les présentes CGU sont régies par le droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux français seront seuls compétents.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">14. Contact</h2>
                                <p className="leading-relaxed">
                                    Pour toute question concernant les présentes CGU, vous pouvez nous contacter à l'adresse : <a href="mailto:legal@delivery-saas.com" className="text-emerald-400 hover:text-emerald-300">legal@delivery-saas.com</a>
                                </p>
                            </section>
                        </div>
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="border-t border-white/10 py-16">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid gap-12 md:grid-cols-4">
                            {/* Logo & Description */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400">
                                        <svg className="h-6 w-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold text-white">Delivery SaaS</span>
                                </div>
                                <p className="text-slate-400 mb-6 max-w-md">
                                    La solution complète de gestion de livraisons pour optimiser vos tournées, 
                                    suivre vos véhicules en temps réel et améliorer votre efficacité opérationnelle.
                                </p>
                            </div>

                            {/* Produit */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">Produit</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/#features" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                            Fonctionnalités
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/#pricing" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                            Tarifs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/#testimonials" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                            Témoignages
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Légal */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">Légal</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link 
                                            href={route('legal.terms')} 
                                            className="text-slate-400 hover:text-emerald-400 transition-colors"
                                        >
                                            CGU
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('legal.notice')} 
                                            className="text-slate-400 hover:text-emerald-400 transition-colors"
                                        >
                                            Mentions légales
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href={route('legal.privacy')} 
                                            className="text-slate-400 hover:text-emerald-400 transition-colors"
                                        >
                                            Confidentialité
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-slate-400">
                            © 2026 Delivery SaaS. Tous droits réservés.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
