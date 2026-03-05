"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Heart, Instagram, Youtube, Facebook } from "lucide-react"

// X (Twitter) Icon component
function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )
}

export function Footer() {
    const t = useTranslations('footer')

    const LINKS = {
        Produit: [
            { label: t('product.app') || "Application", href: "/app" },
            { label: t('product.parents') || "Parents", href: "/parents" },
            { label: t('product.schools') || "Écoles", href: "/schools" },
            { label: t('product.ngos') || "ONG", href: "/ongs" },
        ],
        Entreprise: [
            { label: t('about.mission') || "Notre vision", href: "/mission" },
            { label: t('about.methodology') || "Méthode", href: "/methodology" },
            { label: t('about.contact') || "Contact", href: "/contact" },
            { label: t('about.news') || "Actualités", href: "/news" },
        ],
        Legal: [
            { label: t('legal.privacy') || "Confidentialité", href: "/privacy" },
            { label: t('legal.terms') || "Conditions", href: "/terms" },
            { label: t('legal.cookiePreferences') || "Cookies", href: "/cookie-preferences" },
            { label: t('legal.accessibility') || "Accessibilité", href: "/accessibility" },
        ],
    }

    return (
        <footer id="contact" className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-10">
                <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="mb-5 inline-flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                                <span className="font-heading text-base text-primary-foreground">F</span>
                            </div>
                            <span className="font-heading text-xl text-foreground">
                                Free<span className="text-primary">Geny</span>
                            </span>
                        </Link>
                        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                            {t('baseline') || "Notre mission : rendre l'éducation accessible, engageante et amusante pour chaque enfant, partout dans le monde."}
                        </p>

                        {/* Social */}
                        <div className="mt-6 flex gap-2">
                            <a
                                href="https://instagram.com/freegeny"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-primary"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="https://youtube.com/@freegeny"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-primary"
                                aria-label="YouTube"
                            >
                                <Youtube className="h-4 w-4" />
                            </a>
                            <a
                                href="https://x.com/freegeny"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-primary"
                                aria-label="X"
                            >
                                <XIcon className="h-4 w-4" />
                            </a>
                            <a
                                href="https://facebook.com/freegeny"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-primary"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(LINKS).map(([cat, items]) => (
                        <div key={cat}>
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                                {cat}
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {items.map((l) => (
                                    <li key={l.label}>
                                        <Link
                                            href={l.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        {new Date().getFullYear()} FreeGeny. {t('rights') || "Tous droits réservés."} Fait avec
                        <Heart className="h-3 w-3 fill-destructive text-destructive" />
                        pour les enfants du monde.
                    </p>
                    <div className="flex gap-5">
                        <Link href="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-primary">
                            {t('legal.privacy') || "Confidentialité"}
                        </Link>
                        <Link href="/terms" className="text-xs text-muted-foreground transition-colors hover:text-primary">
                            {t('legal.terms') || "Conditions"}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
