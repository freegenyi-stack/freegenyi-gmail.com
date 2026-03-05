import { Heart } from "lucide-react"

const LINKS = {
    Produit: [
        { label: "Application", href: "#features" },
        { label: "Parents", href: "#testimonials" },
        { label: "Ecoles", href: "#schools" },
        { label: "Organisations", href: "#" },
    ],
    Entreprise: [
        { label: "Notre vision", href: "#about" },
        { label: "Méthode", href: "#how" },
        { label: "Contact", href: "#contact" },
        { label: "Blog", href: "#" },
    ],
    Legal: [
        { label: "Confidentialité", href: "#" },
        { label: "Conditions", href: "#" },
        { label: "Cookies", href: "#" },
        { label: "RGPD", href: "#" },
    ],
}

export default function Footer() {
    return (
        <footer id="contact" className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-10">
                <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <a href="#" className="mb-5 inline-flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                                <span className="font-heading text-base text-primary-foreground">F</span>
                            </div>
                            <span className="font-heading text-xl text-foreground">
                                Free<span className="text-primary">Geny</span>
                            </span>
                        </a>
                        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                            Notre mission : rendre l{"'"}éducation accessible, engageante et
                            amusante pour chaque enfant, partout dans le monde.
                        </p>

                        {/* Social */}
                        <div className="mt-6 flex gap-2">
                            {["X", "Li", "Ig", "Yt"].map((s) => (
                                <a
                                    key={s}
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-primary"
                                    aria-label={s}
                                >
                                    {s}
                                </a>
                            ))}
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
                                        <a
                                            href={l.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        2025 FreeGeny. Tous droits réservés. Fait avec
                        <Heart className="h-3 w-3 fill-destructive text-destructive" />
                        pour les enfants du monde.
                    </p>
                    <div className="flex gap-5">
                        <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">Confidentialité</a>
                        <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
