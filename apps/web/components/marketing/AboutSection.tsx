"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Heart, Globe, Lightbulb, Users } from "lucide-react"

const VALUES = [
    { icon: Heart, title: "Passion", desc: "Chaque enfant mérite une éducation de qualité, peu importe où il vit." },
    { icon: Globe, title: "Accessibilité", desc: "Entièrement gratuit, disponible dans 38+ pays et 50+ langues." },
    { icon: Lightbulb, title: "Innovation", desc: "Les dernières recherches en psychologie, au service de la pédagogie." },
    { icon: Users, title: "Communauté", desc: "Parents, enseignants et experts collaborent pour l'avenir des enfants." },
]

export default function AboutSection() {
    const ref = useRef<HTMLDivElement>(null)
    const [vis, setVis] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.15 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <section id="about" className="py-28 lg:py-36 px-6 overflow-hidden">
            <div id="parents" className="absolute top-0 pointer-events-none" />
            <div id="ngo" className="absolute top-1/2 pointer-events-none" />
            <div ref={ref} className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
                    {/* Left: content */}
                    <div className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <span className="inline-block rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground mb-5">
                            Notre vision
                        </span>
                        <h2 className="font-heading text-4xl leading-tight text-foreground md:text-5xl mb-6 text-balance">
                            L{"'"}éducation de demain, <span className="text-primary">construite aujourd{"'"}hui.</span>
                        </h2>
                        <p className="text-lg leading-relaxed text-muted-foreground mb-12 max-w-lg">
                            Nous sommes une équipe de pédagogues, psychologues et ingénieurs unis par
                            la conviction que l{"'"}apprentissage doit être un pur moment de plaisir.
                        </p>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {VALUES.map((v, i) => (
                                <div
                                    key={v.title}
                                    className={`group flex gap-4 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                                    style={{ transitionDelay: `${300 + i * 100}ms` }}
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <v.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground mb-1">{v.title}</h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: image */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-foreground/10 bg-accent/10">
                            <Image
                                src="/images/feature-tablet.jpg"
                                alt="Enfant utilisant l'application FreeGeny sur tablette"
                                width={640}
                                height={480}
                                className="w-full object-cover !opacity-100"
                                unoptimized
                            />
                        </div>
                        {/* Accent blur */}
                        <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    )
}
