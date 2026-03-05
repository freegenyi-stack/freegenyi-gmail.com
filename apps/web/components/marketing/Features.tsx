"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Gamepad2, Brain, Users, Palette, BarChart3, ShieldCheck } from "lucide-react"

const FEATURES = [
    {
        icon: Gamepad2,
        title: "Jeux immersifs",
        desc: "Des aventures captivantes où chaque niveau enseigne une nouvelle compétence de manière invisible.",
    },
    {
        icon: Brain,
        title: "Ancré dans la science",
        desc: "Plus de 50 bases psychologiques intégrées pour un apprentissage profond et durable.",
    },
    {
        icon: Users,
        title: "Espace famille",
        desc: "Un tableau de bord parental intuitif pour suivre chaque étape du parcours éducatif.",
    },
    {
        icon: Palette,
        title: "Adaptatif",
        desc: "Le contenu évolue automatiquement selon le rythme et les préférences de chaque enfant.",
    },
    {
        icon: BarChart3,
        title: "Rapports détaillés",
        desc: "Des insights clairs sur les forces, les progrès et les prochaines étapes.",
    },
    {
        icon: ShieldCheck,
        title: "100% sans pub",
        desc: "Un environnement sécurisé, sans publicité ni achat intégré. Jamais.",
    },
]

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])
    return { ref, visible }
}

export default function Features() {
    const { ref, visible } = useInView()

    return (
        <section id="mission" className="relative py-28 lg:py-36 px-6 overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/60 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div ref={ref} className="relative mx-auto max-w-7xl">
                {/* Header row with image */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
                    <div className="max-w-2xl">
                        <span className={`inline-block rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground mb-5 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                            Fonctionnalités
                        </span>
                        <h2 className={`font-heading text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl text-balance transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                            Tout pour apprendre,{" "}
                            <span className="text-primary">rien que du plaisir.</span>
                        </h2>
                    </div>

                    {/* Floating image */}
                    <div className="relative h-48 w-72 shrink-0 overflow-hidden rounded-2xl shadow-xl bg-accent/10">
                        <Image
                            src="/images/feature-puzzles.jpg"
                            alt="Puzzles éducatifs colorés"
                            fill
                            className="object-cover !opacity-100"
                            unoptimized
                            sizes="288px"
                        />
                    </div>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((f, i) => (
                        <div
                            key={f.title}
                            className={`group flex flex-col gap-4 bg-card p-8 lg:p-10 transition-all duration-700 hover:bg-accent/40 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{ transitionDelay: `${150 + i * 80}ms` }}
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <f.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
