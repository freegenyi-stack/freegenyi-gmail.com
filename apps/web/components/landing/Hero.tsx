"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlayCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
    const t = useTranslations("home")
    const tCommon = useTranslations("common")

    return (
        <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
            {/* Background blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-educational/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />

            <div className="container relative px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 max-w-2xl"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-primary">
                            {t("hero.title")}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {t("hero.subtitle")}
                        </p>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <Button size="lg" variant="premium" className="h-14 px-8 text-lg rounded-2xl group">
                                {t("hero.cta")}
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl gap-2">
                                <PlayCircle className="h-5 w-5" />
                                {tCommon("watchDemo")}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Hero image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex-1 relative w-full aspect-square max-w-[500px]"
                    >
                        <div className="absolute inset-0 bg-gradient-premium rounded-3xl rotate-3 opacity-20 blur-xl" />
                        <div className="relative bg-white border border-neutral-100 rounded-3xl p-4 shadow-2xl overflow-hidden h-full flex items-center justify-center">
                            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-50">
                                <Image
                                    src="/images/hero-children.jpg"
                                    alt="Enfants apprenant avec FreeGeny"
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                    sizes="(max-width: 1024px) 100vw, 500px"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
