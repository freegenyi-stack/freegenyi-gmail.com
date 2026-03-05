"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Users, GraduationCap, Globe2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Publics() {
    const t = useTranslations("home")
    const tCommon = useTranslations("common")

    const publics = [
        {
            id: "parents",
            icon: <Users className="h-12 w-12 text-primary" />,
            title: t("publics.parents"),
            color: "bg-primary/5",
        },
        {
            id: "schools",
            icon: <GraduationCap className="h-12 w-12 text-educational" />,
            title: t("publics.schools"),
            color: "bg-educational/5",
        },
        {
            id: "ongs",
            icon: <Globe2 className="h-12 w-12 text-energetic" />,
            title: t("publics.ongs"),
            color: "bg-energetic/5",
        },
    ]

    return (
        <section className="py-24">
            <div className="container px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-primary">{t("publics.title", "Une solution pour chaque acteur")}</h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {publics.map((pub, index) => (
                        <motion.div
                            key={pub.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "group relative overflow-hidden rounded-[2.5rem] p-10 border transition-all hover:-translate-y-2 hover:shadow-2xl",
                                pub.color,
                                "border-neutral-100"
                            )}
                        >
                            <div className="mb-8 p-6 rounded-3xl bg-white w-fit shadow-sm group-hover:scale-110 transition-transform">
                                {pub.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-6 text-primary">{pub.title}</h3>
                            <Button variant="ghost" className="gap-2 p-0 h-auto font-bold text-lg hover:bg-transparent hover:text-primary">
                                {tCommon("learnMore")}
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}


