"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, CheckCircle2 } from "lucide-react"

const CHECKLIST = [
    "Tableau de bord enseignant",
    "Rapports individuels par élève",
    "Aligné sur les programmes scolaires",
    "Gestion des classes et groupes",
    "Support technique dédié",
    "Formation pédagogique incluse",
]

const STATS = [
    { value: "2 500+", label: "Ecoles" },
    { value: "150K+", label: "Eleves" },
    { value: "+32%", label: "Progression" },
    { value: "100%", label: "RGPD" },
]

export default function SchoolsSection() {
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
        <section id="schools" className="py-28 lg:py-36 px-6">
            <div ref={ref} className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
                    {/* Image side */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-foreground/10 bg-accent/10">
                            <Image
                                src="/images/classroom.jpg"
                                alt="Salle de classe moderne utilisant FreeGeny"
                                width={640}
                                height={440}
                                className="w-full object-cover !opacity-100"
                                unoptimized
                            />
                        </div>

                        {/* Stats bar */}
                        <div className="mt-6 grid grid-cols-4 gap-3">
                            {STATS.map((s) => (
                                <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
                                    <p className="font-heading text-lg text-foreground">{s.value}</p>
                                    <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Text side */}
                    <div className={`transition-all duration-700 delay-200 ${vis ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
                        <span className="inline-block rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground mb-5">
                            Pour les écoles
                        </span>
                        <h2 className="font-heading text-3xl leading-tight text-foreground md:text-4xl lg:text-5xl mb-5 text-balance">
                            Transformez votre salle de classe.
                        </h2>
                        <p className="text-lg leading-relaxed text-muted-foreground mb-10 max-w-md">
                            Une solution clé en main pour intégrer l{"'"}apprentissage ludique dans votre programme pédagogique.
                        </p>

                        <ul className="mb-10 flex flex-col gap-3">
                            {CHECKLIST.map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                                    <span className="text-sm font-medium text-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href="/schools"
                            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:gap-3 hover:shadow-xl hover:shadow-primary/30"
                        >
                            🏫 Demander une démo pour mon école
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
