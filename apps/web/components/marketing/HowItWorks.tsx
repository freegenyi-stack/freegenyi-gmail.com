"use client"

import { useEffect, useRef, useState } from "react"
import { Download, UserPlus, Sparkles, Rocket } from "lucide-react"

const STEPS = [
    {
        icon: Download,
        num: "01",
        title: "Téléchargez",
        desc: "Gratuit sur iOS et Android. Installation en quelques secondes.",
    },
    {
        icon: UserPlus,
        num: "02",
        title: "Créez un profil",
        desc: "Renseignez l'âge et les centres d'intérêt de votre enfant.",
    },
    {
        icon: Sparkles,
        num: "03",
        title: "Explorez",
        desc: "L'app propose des activités adaptées au niveau de votre enfant.",
    },
    {
        icon: Rocket,
        num: "04",
        title: "Progressez",
        desc: "Suivez les progrès en temps réel et célébrez chaque victoire.",
    },
]

export default function HowItWorks() {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <section id="how" className="relative py-28 lg:py-36 px-6 bg-primary">
            <div ref={ref} className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className={`inline-block rounded-full border border-primary-foreground/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground/70 mb-5 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        Comment ça marche
                    </span>
                    <h2 className={`mx-auto max-w-xl font-heading text-4xl leading-tight text-primary-foreground md:text-5xl text-balance transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        Prêt en 4 étapes simples.
                    </h2>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((s, i) => (
                        <div
                            key={s.num}
                            className={`group relative rounded-2xl bg-primary-foreground/10 backdrop-blur-sm p-8 text-center transition-all duration-700 hover:bg-primary-foreground/15 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{ transitionDelay: `${200 + i * 120}ms` }}
                        >
                            {/* Number */}
                            <span className="absolute top-4 right-5 font-heading text-5xl text-primary-foreground/10">
                                {s.num}
                            </span>

                            <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground text-primary shadow-lg">
                                <s.icon className="h-7 w-7" />
                            </div>

                            <h3 className="mb-2 text-lg font-bold text-primary-foreground">
                                {s.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-primary-foreground/70">
                                {s.desc}
                            </p>

                            {/* Connector arrow (desktop) */}
                            {i < STEPS.length - 1 && (
                                <div className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                                    <svg width="32" height="16" fill="none" viewBox="0 0 32 16">
                                        <path d="M0 8h28m0 0l-6-6m6 6l-6 6" stroke="hsl(var(--primary-foreground))" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
