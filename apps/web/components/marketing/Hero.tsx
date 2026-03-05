"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const ran = useRef(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting && !ran.current) {
                    ran.current = true
                    const dur = 2000
                    const t0 = performance.now()
                    const tick = (now: number) => {
                        const p = Math.min((now - t0) / dur, 1)
                        setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
                        if (p < 1) requestAnimationFrame(tick)
                    }
                    requestAnimationFrame(tick)
                }
            },
            { threshold: 0.5 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [target])

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    )
}

const TRUST = [
    "UNESCO", "UNICEF", "Google for Education", "MIT Media Lab", "Khan Academy",
    "UNESCO", "UNICEF", "Google for Education", "MIT Media Lab", "Khan Academy",
]

export default function Hero() {
    return (
        <section id="app" className="relative min-h-screen overflow-hidden pt-24 lg:pt-0">
            {/* Dot pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 lg:flex-row lg:gap-20 lg:px-8">
                {/* ---- Left column ---- */}
                <div className="flex-1 py-12 lg:py-0">
                    {/* Pill */}
                    <div className="animate-reveal mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-secondary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Disponible dans 60+ langues
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="animate-reveal delay-100 font-heading text-5xl leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                        <span className="text-balance">Apprendre en jouant,{" "}</span>
                        <span className="relative inline-block text-primary">
                            grandir
                            <svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 200 12"
                                fill="none"
                            >
                                <path
                                    d="M2 8.5C50 2 150 2 198 8.5"
                                    stroke="hsl(var(--secondary))"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>{" "}
                        <span className="text-balance">en s{"'"}amusant.</span>
                    </h1>

                    <p className="animate-reveal delay-200 mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground lg:text-xl">
                        FreeGeny transforme chaque leçon en aventure. Des puzzles, des jeux
                        et des défis conçus par des experts en psychologie de l{"'"}enfant.
                    </p>

                    {/* CTA */}
                    <div className="animate-reveal delay-300 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <a
                            href="./onboarding"
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:gap-3 hover:shadow-2xl hover:shadow-primary/30"
                        >
                            Essayer gratuitement
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                        <button
                            type="button"
                            className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-transparent px-6 py-4 text-base font-medium text-foreground transition-all hover:bg-muted hover:border-primary/20"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                <Play className="h-3.5 w-3.5 ml-0.5" />
                            </span>
                            Voir la démo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="animate-reveal delay-400 mt-14 flex gap-10 border-t border-border pt-8">
                        <div>
                            <p className="font-heading text-3xl text-foreground lg:text-4xl">
                                <Counter target={500} suffix="K+" />
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">Enfants actifs</p>
                        </div>
                        <div>
                            <p className="font-heading text-3xl text-foreground lg:text-4xl">
                                <Counter target={38} suffix="+" />
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">Pays</p>
                        </div>
                        <div>
                            <p className="font-heading text-3xl text-foreground lg:text-4xl">
                                4.9
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">Note moyenne</p>
                        </div>
                    </div>
                </div>

                {/* ---- Right column: image ---- */}
                <div className="relative flex-1">
                    <div className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl shadow-foreground/10 lg:rounded-[2rem] bg-accent">
                        <Image
                            src="/images/hero-kids-learning.jpg"
                            alt="Enfants apprenant avec FreeGeny"
                            fill
                            className="object-cover !opacity-100"
                            priority
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Floating card */}
                        <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-card/90 p-5 shadow-xl backdrop-blur-md border border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                                    <span className="text-lg" role="img" aria-label="Graduation cap">&#127891;</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Progression quotidienne
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        +12 puzzles résolus aujourd{"'"}hui
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                                <div className="h-full w-3/4 rounded-full bg-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Glow */}
                    <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />
                    <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                </div>
            </div>

            {/* Trust marquee */}
            <div className="relative overflow-hidden border-t border-border bg-card/50 py-6">
                <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Ils nous font confiance
                </p>
                <div className="flex animate-marquee">
                    {TRUST.map((name, i) => (
                        <span
                            key={`${name}-${i}`}
                            className="mx-10 shrink-0 whitespace-nowrap text-sm font-semibold text-muted-foreground/40"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}
