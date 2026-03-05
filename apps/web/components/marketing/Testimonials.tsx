"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"

const REVIEWS = [
    {
        name: "Marie Dupont",
        role: "Maman de 2 enfants",
        initials: "MD",
        text: "Mes enfants adorent FreeGeny ! Ils ne se rendent même pas compte qu'ils apprennent. C'est devenu notre rituel du soir.",
        stars: 5,
    },
    {
        name: "Prof. Ahmed Benali",
        role: "Enseignant, Ecole Pasteur",
        initials: "AB",
        text: "J'utilise FreeGeny en classe depuis 6 mois. Les résultats sont bluffants : +30% de motivation et des scores en hausse constante.",
        stars: 5,
    },
    {
        name: "Sophie Laurent",
        role: "Directrice pédagogique",
        initials: "SL",
        text: "L'approche scientifique est remarquable. Chaque activité est pensée pour maximiser l'apprentissage tout en gardant le plaisir intact.",
        stars: 5,
    },
]

export default function Testimonials() {
    const ref = useRef<HTMLDivElement>(null)
    const [vis, setVis] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.1 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <section id="testimonials" className="py-28 lg:py-36 px-6 bg-muted/40">
            <div ref={ref} className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-16 max-w-2xl">
                    <span className={`inline-block rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground mb-5 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        Témoignages
                    </span>
                    <h2 className={`font-heading text-4xl leading-tight text-foreground md:text-5xl text-balance transition-all duration-700 delay-100 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        Des milliers de familles, <span className="text-primary">une même passion.</span>
                    </h2>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {REVIEWS.map((r, i) => (
                        <div
                            key={r.name}
                            className={`group flex flex-col justify-between rounded-3xl border border-border bg-card p-8 transition-all duration-700 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/15 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{ transitionDelay: `${200 + i * 100}ms` }}
                        >
                            {/* Stars */}
                            <div>
                                <div className="mb-5 flex gap-0.5">
                                    {Array.from({ length: r.stars }).map((_, j) => (
                                        <Star key={j} className="h-4 w-4 fill-secondary text-secondary" />
                                    ))}
                                </div>
                                <p className="text-foreground leading-relaxed">{r.text}</p>
                            </div>

                            {/* Author */}
                            <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <span className="text-xs font-bold text-primary">{r.initials}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                                    <p className="text-xs text-muted-foreground">{r.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
