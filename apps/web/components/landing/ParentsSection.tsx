"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { LayoutDashboard, LineChart, MessageCircle, Library, Shield, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function ParentsSection() {
    const t = useTranslations("navigation")
    const tCommon = useTranslations("common")

    const icons = {
        dashboard: <LayoutDashboard className="h-8 w-8 text-primary" />,
        progress: <LineChart className="h-8 w-8 text-primary" />,
        communication: <MessageCircle className="h-8 w-8 text-primary" />,
        resources: <Library className="h-8 w-8 text-primary" />,
        security: <Shield className="h-8 w-8 text-primary" />
    }

    const dropdown = t.raw("menu.parents.dropdown") as Record<string, string>
    const items = Object.entries(dropdown)
        .filter(([key]) => key !== "description")
        .map(([key, value]) => ({
            key,
            title: value,
            icon: icons[key as keyof typeof icons] || <LayoutDashboard className="h-8 w-8 text-primary" />
        }))

    return (
        <section id="parents" className="py-24 bg-white">
            <div className="container px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-primary">{t("menu.parents.main")}</h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-[2.5rem] p-10 border border-neutral-100 bg-slate-50/50 hover:bg-white transition-all hover:-translate-y-2 hover:shadow-xl"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-white w-fit shadow-sm group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-primary">{item.title}</h3>
                            <p className="text-muted-foreground mb-6">
                                {t("menu.parents.dropdown.description", { title: item.title })}
                            </p>
                            <Button variant="ghost" asChild className="gap-2 p-0 h-auto font-bold text-lg hover:bg-transparent hover:text-primary">
                                <Link href="/parents">
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
