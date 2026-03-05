"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Sparkles, Accessibility, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export function Values() {
    const t = useTranslations("home")

    const values = [
        {
            id: "innovation",
            icon: <Sparkles className="h-10 w-10 text-educational" />,
            title: t("values.innovation.title"),
            description: t("values.innovation.description"),
        },
        {
            id: "accessibility",
            icon: <Accessibility className="h-10 w-10 text-primary" />,
            title: t("values.accessibility.title"),
            description: t("values.accessibility.description"),
        },
        {
            id: "security",
            icon: <ShieldCheck className="h-10 w-10 text-energetic" />,
            title: t("values.security.title"),
            description: t("values.security.description"),
        },
    ]

    return (
        <section className="py-24 bg-slate-50/50">
            <div className="container px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-neutral-100/50 hover:shadow-md transition-shadow"
                        >
                            <div className="mb-6 bg-slate-50 p-4 rounded-2xl">
                                {value.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-primary">{value.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
