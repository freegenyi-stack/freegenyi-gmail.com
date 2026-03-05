"use client"

import * as React from "react"
import { Hero } from "@/components/landing/Hero"
import { Values } from "@/components/landing/Values"
import { Publics } from "@/components/landing/Publics"
import { FAQ } from "@/components/landing/FAQ"

import { ParentsSection } from "@/components/landing/ParentsSection"
import { SchoolsSection } from "@/components/landing/SchoolsSection"
import { OngsSection } from "@/components/landing/OngsSection"
import { PricingSection } from "@/components/landing/PricingSection"

export default function LandingPage() {
    return (
        <>
            <main className="flex-grow">
                <Hero />
                <Values />
                <ParentsSection />
                <SchoolsSection />
                <OngsSection />
                <PricingSection />
                <Publics />
                <FAQ />
            </main>
        </>
    )
}
