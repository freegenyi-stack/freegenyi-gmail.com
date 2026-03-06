import Image from "next/image"
import type { Metadata } from "next"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"
import AuthFormInspiration from "@/components/auth/AuthFormInspiration"
import { BookOpen, Sparkles, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Connexion - FreeGeny",
    description: "Connectez-vous ou créez un compte FreeGeny pour commencer l'aventure éducative.",
}

export default async function AuthPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    unstable_setRequestLocale(locale);
    const t = await getTranslations('auth')

    const TRUST_ITEMS = [
        {
            icon: BookOpen,
            text: t('trustItems.certified') || "Programmes certifiés par des experts en pédagogie",
        },
        {
            icon: Globe,
            text: t('trustItems.countries') || "Disponible dans plus de 38 pays",
        },
        {
            icon: Sparkles,
            text: t('trustItems.learners') || "Plus de 500 000 enfants apprennent chaque jour",
        },
    ]

    return (
        <div className="flex min-h-screen">
            {/* Left panel - Illustration & branding */}
            <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-primary p-12 lg:flex">
                {/* Center - Big quote/message */}
                <div className="flex flex-col gap-6">
                    <blockquote className="font-heading text-4xl font-bold leading-tight tracking-tight text-primary-foreground xl:text-5xl">
                        {t('quote') || "Chaque enfant est un génie qui sommeille."}
                    </blockquote>
                    <p className="max-w-md text-lg leading-relaxed text-primary-foreground/70">
                        {t('quoteSubtext') || "FreeGeny transforme chaque moment en opportunité d'apprendre, de grandir et de s'émerveiller."}
                    </p>
                </div>

                <div className="relative z-10 flex flex-col gap-12">
                    {/* Top - decorative dots */}
                    <div className="flex gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
                        <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground/30" />
                        <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground/15" />
                    </div>

                    {/* Trust items */}
                    <div className="flex flex-col gap-4">
                        {TRUST_ITEMS.map((item) => {
                            const Icon = item.icon
                            return (
                                <div key={item.text} className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 border border-white/5">
                                        <Icon className="h-4.5 w-4.5 text-secondary" />
                                    </div>
                                    <span className="text-sm font-semibold text-white/90">{item.text}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Right panel - Auth form */}
            <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12 relative">
                {/* Back to home link */}
                <div className="absolute top-4 left-4">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour à l'accueil
                    </Link>
                </div>

                <AuthFormInspiration />
            </div>
        </div>
    )
}

