"use client"

import { ArrowRight } from "lucide-react"

export default function CtaSection() {
    return (
        <section id="pricing" className="py-28 lg:py-36 px-6">
            <div className="mx-auto max-w-5xl">
                <div className="relative overflow-hidden rounded-[2rem] bg-primary px-8 py-20 text-center md:px-16 md:py-28">
                    {/* Decorative circles */}
                    <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary-foreground/5" />
                    <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-primary-foreground/5" />
                    <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/[0.03]" />

                    <div className="relative">
                        <h2 className="mx-auto max-w-2xl font-heading text-3xl leading-tight text-primary-foreground md:text-5xl lg:text-6xl text-balance">
                            Rejoignez l{"'"}aventure éducative.
                        </h2>
                        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-primary-foreground/75">
                            Plus d{"'"}un demi-million d{"'"}enfants apprennent déjà avec FreeGeny.
                            Offrez la meilleure expérience éducative, gratuitement.
                        </p>

                        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <a
                                href="./onboarding"
                                className="group inline-flex items-center gap-2 rounded-full bg-card px-8 py-4 text-base font-semibold text-primary shadow-xl transition-all hover:gap-3 hover:shadow-2xl"
                            >
                                Commencer maintenant
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </a>
                            <a
                                href="#contact"
                                className="inline-flex items-center justify-center rounded-full border border-primary-foreground/25 bg-transparent px-8 py-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                            >
                                Nous contacter
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
