import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="Politique de Confidentialité" />

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
                            <span className="text-lg font-bold text-white">Fleetigo</span>
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
                            Politique de Confidentialité
                        </h1>
                        <p className="mt-4 text-slate-400">
                            Dernière mise à jour : 16 février 2026
                        </p>

                        <div className="mt-12 space-y-8 text-slate-300">
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                                <p className="leading-relaxed mb-4">
                                    Fleetigo SAS (ci-après « nous », « notre » ou « la Société ») s'engage à protéger la confidentialité et la sécurité de vos données personnelles. Cette Politique de Confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
                                </p>
                                <p className="leading-relaxed">
                                    En utilisant notre plateforme Fleetigo, vous acceptez les pratiques décrites dans cette politique.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">2. Responsable du Traitement</h2>
                                <div className="leading-relaxed space-y-2">
                                    <p><strong className="text-white">Fleetigo SAS</strong></p>
                                    <p>123 Avenue de la République, 75011 Paris, France</p>
                                    <p>Email : <a href="mailto:dpo@fleetigo.com" className="text-emerald-400 hover:text-emerald-300">dpo@fleetigo.com</a></p>
                                    <p>SIRET : 123 456 789 00012</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">3. Données Collectées</h2>
                                <p className="leading-relaxed mb-4">
                                    Nous collectons différents types de données personnelles selon votre utilisation de nos services :
                                </p>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.1 Données d'Identification</h3>
                                <ul className="space-y-2 list-disc list-inside mb-4">
                                    <li>Nom et prénom</li>
                                    <li>Adresse email</li>
                                    <li>Numéro de téléphone</li>
                                    <li>Adresse postale</li>
                                    <li>Identifiant de connexion</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Données d'Entreprise</h3>
                                <ul className="space-y-2 list-disc list-inside mb-4">
                                    <li>Raison sociale</li>
                                    <li>SIRET / SIREN</li>
                                    <li>Numéro de TVA intracommunautaire</li>
                                    <li>Coordonnées de facturation</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Données de Paiement</h3>
                                <ul className="space-y-2 list-disc list-inside mb-4">
                                    <li>Informations bancaires (traitées par notre prestataire de paiement sécurisé Stripe)</li>
                                    <li>Historique des transactions</li>
                                    <li>Factures</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.4 Données d'Utilisation</h3>
                                <ul className="space-y-2 list-disc list-inside mb-4">
                                    <li>Logs de connexion</li>
                                    <li>Adresse IP</li>
                                    <li>Type de navigateur et système d'exploitation</li>
                                    <li>Pages visitées et temps passé sur le site</li>
                                    <li>Données de géolocalisation (si autorisé)</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.5 Données Métiers</h3>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Informations sur vos chauffeurs et véhicules</li>
                                    <li>Données de tournées et d'itinéraires</li>
                                    <li>Informations de livraison et expéditions</li>
                                    <li>Statistiques de performance</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">4. Finalités du Traitement</h2>
                                <p className="leading-relaxed mb-4">
                                    Nous utilisons vos données personnelles pour les finalités suivantes :
                                </p>
                                <ul className="space-y-3 list-disc list-inside">
                                    <li><strong className="text-white">Gestion de votre compte :</strong> Création, authentification et gestion de votre profil utilisateur</li>
                                    <li><strong className="text-white">Fourniture des services :</strong> Accès à la plateforme, gestion des tournées, suivi en temps réel, génération de rapports</li>
                                    <li><strong className="text-white">Facturation et paiement :</strong> Traitement des abonnements, émission de factures, gestion des paiements</li>
                                    <li><strong className="text-white">Support client :</strong> Réponse à vos demandes d'assistance et résolution des problèmes techniques</li>
                                    <li><strong className="text-white">Amélioration des services :</strong> Analyse des données d'utilisation pour optimiser notre plateforme</li>
                                    <li><strong className="text-white">Communication :</strong> Envoi de notifications, mises à jour produit et informations importantes</li>
                                    <li><strong className="text-white">Sécurité :</strong> Prévention de la fraude, détection des anomalies et protection de la plateforme</li>
                                    <li><strong className="text-white">Conformité légale :</strong> Respect des obligations légales et réglementaires</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">5. Base Légale du Traitement</h2>
                                <p className="leading-relaxed mb-4">
                                    Conformément au RGPD, nous traitons vos données sur les bases légales suivantes :
                                </p>
                                <ul className="space-y-3 list-disc list-inside">
                                    <li><strong className="text-white">Exécution du contrat :</strong> Le traitement est nécessaire pour fournir les services que vous avez souscrits</li>
                                    <li><strong className="text-white">Consentement :</strong> Pour certaines communications marketing (avec possibilité de retrait à tout moment)</li>
                                    <li><strong className="text-white">Intérêt légitime :</strong> Pour améliorer nos services et assurer la sécurité de la plateforme</li>
                                    <li><strong className="text-white">Obligation légale :</strong> Pour respecter les obligations comptables, fiscales et réglementaires</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">6. Destinataires des Données</h2>
                                <p className="leading-relaxed mb-4">
                                    Vos données personnelles peuvent être partagées avec :
                                </p>
                                <ul className="space-y-3 list-disc list-inside">
                                    <li><strong className="text-white">Personnel autorisé :</strong> Nos employés ayant besoin d'accéder aux données dans le cadre de leurs fonctions</li>
                                    <li><strong className="text-white">Prestataires de services :</strong>
                                        <ul className="ml-6 mt-2 space-y-1 list-circle list-inside">
                                            <li>Hébergement : OVH (France)</li>
                                            <li>Paiement : Stripe (conforme RGPD)</li>
                                            <li>Support client : Zendesk (conforme RGPD)</li>
                                            <li>Analytics : Google Analytics (anonymisé)</li>
                                        </ul>
                                    </li>
                                    <li><strong className="text-white">Autorités légales :</strong> En cas d'obligation légale ou de demande judiciaire</li>
                                </ul>
                                <p className="leading-relaxed mt-4">
                                    Tous nos sous-traitants sont liés par des accords de confidentialité et respectent le RGPD.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">7. Transferts de Données</h2>
                                <p className="leading-relaxed mb-4">
                                    Vos données sont principalement hébergées en France (Union Européenne). Si des transferts hors UE sont nécessaires, nous utilisons :
                                </p>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Les clauses contractuelles types approuvées par la Commission Européenne</li>
                                    <li>Des mécanismes de certification (Privacy Shield, etc.)</li>
                                    <li>Des garanties appropriées pour assurer un niveau de protection équivalent au RGPD</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">8. Durée de Conservation</h2>
                                <p className="leading-relaxed mb-4">
                                    Nous conservons vos données personnelles pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :
                                </p>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li><strong className="text-white">Compte actif :</strong> Pendant toute la durée de votre abonnement</li>
                                    <li><strong className="text-white">Après résiliation :</strong> 3 mois pour permettre une réactivation</li>
                                    <li><strong className="text-white">Données de facturation :</strong> 10 ans (obligation légale comptable)</li>
                                    <li><strong className="text-white">Logs de connexion :</strong> 1 an (obligation légale)</li>
                                    <li><strong className="text-white">Données marketing :</strong> 3 ans à compter du dernier contact</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">9. Vos Droits</h2>
                                <p className="leading-relaxed mb-4">
                                    Conformément au RGPD, vous disposez des droits suivants :
                                </p>
                                <ul className="space-y-3 list-disc list-inside">
                                    <li><strong className="text-white">Droit d'accès :</strong> Obtenir la confirmation que vos données sont traitées et y accéder</li>
                                    <li><strong className="text-white">Droit de rectification :</strong> Corriger vos données inexactes ou incomplètes</li>
                                    <li><strong className="text-white">Droit à l'effacement :</strong> Demander la suppression de vos données dans certaines conditions</li>
                                    <li><strong className="text-white">Droit à la limitation :</strong> Restreindre le traitement de vos données</li>
                                    <li><strong className="text-white">Droit à la portabilité :</strong> Recevoir vos données dans un format structuré et les transférer à un autre responsable</li>
                                    <li><strong className="text-white">Droit d'opposition :</strong> Vous opposer au traitement de vos données pour des motifs légitimes</li>
                                    <li><strong className="text-white">Droit de retirer votre consentement :</strong> À tout moment pour les traitements basés sur le consentement</li>
                                    <li><strong className="text-white">Droit de réclamation :</strong> Déposer une plainte auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés)</li>
                                </ul>
                                <p className="leading-relaxed mt-4">
                                    Pour exercer ces droits, contactez-nous à : <a href="mailto:dpo@delivery-saas.com" className="text-emerald-400 hover:text-emerald-300">dpo@delivery-saas.com</a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">10. Sécurité des Données</h2>
                                <p className="leading-relaxed mb-4">
                                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
                                </p>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Chiffrement des données sensibles (SSL/TLS, chiffrement en base de données)</li>
                                    <li>Authentification à deux facteurs (2FA) disponible</li>
                                    <li>Sauvegardes régulières et redondantes</li>
                                    <li>Contrôle d'accès strict aux données (principe du moindre privilège)</li>
                                    <li>Surveillance et détection des intrusions</li>
                                    <li>Mises à jour de sécurité régulières</li>
                                    <li>Formation du personnel à la protection des données</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">11. Cookies et Technologies Similaires</h2>
                                <p className="leading-relaxed mb-4">
                                    Notre site utilise des cookies pour améliorer votre expérience. Nous utilisons :
                                </p>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">11.1 Cookies Essentiels</h3>
                                <p className="leading-relaxed mb-4">
                                    Nécessaires au fonctionnement du site (authentification, préférences, panier). Ces cookies ne peuvent pas être désactivés.
                                </p>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">11.2 Cookies Analytiques</h3>
                                <p className="leading-relaxed mb-4">
                                    Utilisés pour comprendre comment vous utilisez notre site (Google Analytics). Vous pouvez les refuser via les paramètres de cookies.
                                </p>

                                <h3 className="text-xl font-semibold text-white mb-3 mt-6">11.3 Cookies Marketing</h3>
                                <p className="leading-relaxed mb-4">
                                    Pour personnaliser les publicités (si applicable). Nécessitent votre consentement.
                                </p>

                                <p className="leading-relaxed mt-4">
                                    Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur ou notre bannière de cookies.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">12. Modifications de la Politique</h2>
                                <p className="leading-relaxed">
                                    Nous nous réservons le droit de modifier cette Politique de Confidentialité à tout moment. Les modifications seront effectives dès leur publication sur cette page. Nous vous informerons des changements importants par email ou via une notification sur la plateforme.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">13. Mineurs</h2>
                                <p className="leading-relaxed">
                                    Nos services sont destinés aux professionnels et ne sont pas conçus pour les personnes de moins de 18 ans. Nous ne collectons pas sciemment de données personnelles auprès de mineurs.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">14. Contact</h2>
                                <p className="leading-relaxed mb-4">
                                    Pour toute question concernant cette Politique de Confidentialité ou l'exercice de vos droits :
                                </p>
                                <div className="leading-relaxed space-y-2">
                                    <p><strong className="text-white">Délégué à la Protection des Données (DPO)</strong></p>
                                    <p>Email : <a href="mailto:dpo@fleetigo.com" className="text-emerald-400 hover:text-emerald-300">dpo@fleetigo.com</a></p>
                                    <p>Courrier : DPO - Fleetigo SAS, 123 Avenue de la République, 75011 Paris, France</p>
                                    <p>Téléphone : +33 1 23 45 67 89</p>
                                </div>
                                <p className="leading-relaxed mt-4">
                                    <strong className="text-white">CNIL :</strong> Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la CNIL sur <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">www.cnil.fr</a>
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
                                    <span className="text-xl font-bold text-white">Fleetigo</span>
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
                            © 2026 Fleetigo. Tous droits réservés.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
