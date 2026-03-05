"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { School, BookOpen, Users, BarChart3, ArrowRight } from "lucide-react"

export function SchoolsSection() {
    const t = useTranslations("navigation")
    const tCommon = useTranslations("common")

    const icons = {
        management: <School className="h-8 w-8 text-educational" />,
        curriculum: <BookOpen className="h-8 w-8 text-educational" />,
        teachers: <Users className="h-8 w-8 text-educational" />,
        analytics: <BarChart3 className="h-8 w-8 text-educational" />
    }

    const dropdown = t.raw("menu.schools.dropdown") as Record<string, string>
    const items = Object.entries(dropdown)
        .filter(([key]) => key !== "description")
        .map(([key, value]) => ({
            key,
            title: value,
            icon: icons[key as keyof typeof icons] || <School className="h-8 w-8 text-educational" />
        }))

    return (
        <section id="schools" className="py-24 bg-slate-50/50">
            <div className="container px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-educational">{t("menu.schools.main")}</h2>
                    <div className="w-24 h-1.5 bg-educational mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-[2.5rem] p-10 border border-neutral-100 bg-white hover:-translate-y-2 hover:shadow-xl transition-all"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-educational/5 w-fit shadow-sm group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-educational">{item.title}</h3>
                            <p className="text-muted-foreground mb-6">
                                {t("menu.schools.dropdown.description", { title: item.title })}
                            </p>
                            <Button variant="ghost" asChild className="gap-2 p-0 h-auto font-bold text-lg hover:bg-transparent hover:text-educational">
                                <Link href="/schools">
                                    {tCommon("learnMore")}
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
