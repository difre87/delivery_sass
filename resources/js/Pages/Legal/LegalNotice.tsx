import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function LegalNotice() {
    return (
        <>
            <Head title="Mentions Légales" />

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
                            Mentions Légales
                        </h1>
                        <p className="mt-4 text-slate-400">
                            Dernière mise à jour : 16 février 2026
                        </p>

                        <div className="mt-12 space-y-8 text-slate-300">
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">1. Éditeur du Site</h2>
                                <div className="leading-relaxed space-y-2">
                                    <p><strong className="text-white">Raison sociale :</strong> Delivery SaaS SAS</p>
                                    <p><strong className="text-white">Forme juridique :</strong> Société par Actions Simplifiée</p>
                                    <p><strong className="text-white">Capital social :</strong> 10 000 €</p>
                                    <p><strong className="text-white">Siège social :</strong> 123 Avenue de la République, 75011 Paris, France</p>
                                    <p><strong className="text-white">RCS :</strong> Paris B 123 456 789</p>
                                    <p><strong className="text-white">SIRET :</strong> 123 456 789 00012</p>
                                    <p><strong className="text-white">N° TVA intracommunautaire :</strong> FR 12 123456789</p>
                                    <p><strong className="text-white">Email :</strong> <a href="mailto:contact@delivery-saas.com" className="text-emerald-400 hover:text-emerald-300">contact@delivery-saas.com</a></p>
                                    <p><strong className="text-white">Téléphone :</strong> +33 1 23 45 67 89</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">2. Directeur de la Publication</h2>
                                <div className="leading-relaxed space-y-2">
                                    <p><strong className="text-white">Nom :</strong> Jean Dupont</p>
                                    <p><strong className="text-white">Qualité :</strong> Président</p>
                                    <p><strong className="text-white">Email :</strong> <a href="mailto:direction@delivery-saas.com" className="text-emerald-400 hover:text-emerald-300">direction@delivery-saas.com</a></p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">3. Hébergement</h2>
                                <div className="leading-relaxed space-y-2">
                                    <p><strong className="text-white">Hébergeur :</strong> OVH SAS</p>
                                    <p><strong className="text-white">Siège social :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
                                    <p><strong className="text-white">Téléphone :</strong> +33 9 72 10 10 07</p>
                                    <p><strong className="text-white">Site web :</strong> <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">www.ovh.com</a></p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">4. Propriété Intellectuelle</h2>
                                <p className="leading-relaxed mb-4">
                                    L'ensemble du contenu de ce site (structure, textes, logos, images, vidéos, etc.) est la propriété exclusive de Delivery SaaS SAS ou de ses partenaires. Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord écrit de Delivery SaaS SAS.
                                </p>
                                <p className="leading-relaxed">
                                    Les marques et logos affichés sur le site sont des marques déposées de Delivery SaaS SAS ou de sociétés tierces. Toute utilisation non autorisée de ces marques est interdite.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">5. Protection des Données Personnelles</h2>
                                <p className="leading-relaxed mb-4">
                                    Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.
                                </p>
                                <p className="leading-relaxed mb-4">
                                    Pour exercer ces droits, vous pouvez contacter notre Délégué à la Protection des Données (DPO) :
                                </p>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li><strong className="text-white">Email :</strong> <a href="mailto:dpo@delivery-saas.com" className="text-emerald-400 hover:text-emerald-300">dpo@delivery-saas.com</a></li>
                                    <li><strong className="text-white">Courrier :</strong> DPO - Delivery SaaS, 123 Avenue de la République, 75011 Paris</li>
                                </ul>
                                <p className="leading-relaxed mt-4">
                                    Pour plus d'informations, consultez notre <Link href="/privacy-policy" className="text-emerald-400 hover:text-emerald-300">Politique de Confidentialité</Link>.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
                                <p className="leading-relaxed">
                                    Le site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur. Pour plus d'informations, consultez notre Politique de Cookies.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">7. Responsabilité</h2>
                                <p className="leading-relaxed mb-4">
                                    Delivery SaaS SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
                                </p>
                                <p className="leading-relaxed">
                                    Delivery SaaS SAS décline toute responsabilité pour tout dommage direct ou indirect pouvant résulter de l'accès au site ou de l'utilisation du site et de ses informations.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">8. Liens Hypertextes</h2>
                                <p className="leading-relaxed">
                                    Le site peut contenir des liens hypertextes vers d'autres sites. Delivery SaaS SAS n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">9. Droit Applicable</h2>
                                <p className="leading-relaxed">
                                    Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">10. Médiation</h2>
                                <p className="leading-relaxed mb-4">
                                    Conformément à l'article L.616-1 du Code de la consommation, en cas de litige, vous pouvez recourir gratuitement au service de médiation :
                                </p>
                                <div className="leading-relaxed space-y-2">
                                    <p><strong className="text-white">Médiateur :</strong> Médiateur de la Consommation</p>
                                    <p><strong className="text-white">Site web :</strong> <a href="https://www.mediateur-consommation.fr" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">www.mediateur-consommation.fr</a></p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">11. Contact</h2>
                                <p className="leading-relaxed">
                                    Pour toute question concernant les présentes mentions légales, vous pouvez nous contacter à l'adresse : <a href="mailto:legal@delivery-saas.com" className="text-emerald-400 hover:text-emerald-300">legal@delivery-saas.com</a>
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
