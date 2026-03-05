"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Menu, X, ArrowRight } from "lucide-react"

export default function Navbar() {
    const t = useTranslations('navigation')
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const NAV_LINKS = [
        { href: "#features", label: t('features') || "Fonctionnalités" },
        { href: "#how", label: t('method') || "Méthode" },
        { href: "#schools", label: t('schools') || "Écoles" },
        { href: "#testimonials", label: t('testimonials') || "Témoignages" },
    ]

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-card/80 backdrop-blur-xl shadow-sm border-b border-border"
                    : "bg-transparent"
                }`}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary transition-transform duration-300 group-hover:scale-105">
                        <span className="font-heading text-base text-primary-foreground tracking-tight">F</span>
                    </div>
                    <span className="font-heading text-xl tracking-tight text-foreground">
                        Free<span className="text-primary">Geny</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 lg:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden items-center gap-3 lg:flex">
                    <Link
                        href="/auth"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {t('login') || "Se connecter"}
                    </Link>
                    <Link
                        href="/auth"
                        className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:shadow-lg hover:shadow-primary/25"
                    >
                        {t('getStarted') || "Commencer"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    type="button"
                    className="lg:hidden rounded-lg p-2 text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </nav>

            {/* Mobile menu */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="mx-4 mb-4 rounded-2xl bg-card border border-border p-4 shadow-xl">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="mt-3 border-t border-border pt-3">
                        <Link
                            href="/auth"
                            className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                            onClick={() => setMobileOpen(false)}
                        >
                            {t('getStartedFree') || "Commencer gratuitement"}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
