"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
    const t = useTranslations("home")

    // Ensure returns an array even if key is missing or returns a string
    const rawFaqItems = t.raw("faq.items");
    const faqItems = Array.isArray(rawFaqItems) ? rawFaqItems : [];

    return (
        <section className="py-24 bg-slate-50/50">
            <div className="container px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("faq.title")}</h2>
                    <div className="w-24 h-1.5 bg-gradient-premium mx-auto rounded-full" />
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-white px-6 rounded-2xl mb-4 border border-neutral-100 shadow-sm">
                            <AccordionTrigger className="text-left text-lg font-semibold py-6 hover:no-underline">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base pb-6">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
