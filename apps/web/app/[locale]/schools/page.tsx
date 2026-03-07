import { getTranslations } from "next-intl/server";
import { setRequestLocale } from 'next-intl/server';
import SchoolsClient from "./SchoolsClient";
import { CheckCircle2, GraduationCap, LineChart, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale });
    return {
        title: "Pour les Écoles - FreeGeny",
        description: "Transformez votre salle de classe avec notre solution éducative clé en main.",
    };
}

const FEATURES = [
    { icon: LineChart, title: "Tableau de bord enseignant", desc: "Suivez la progression de chaque élève en temps réel." },
    { icon: Zap, title: "Aligné sur les programmes", desc: "Exercices conçus pour respecter les standards nationaux." },
    { icon: GraduationCap, title: "Formation incluse", desc: "Accompagnement pédagogique pour la prise en main." },
    { icon: ShieldCheck, title: "100% RGPD", desc: "Les données de vos élèves sont strictement confidentielles." },
];

export default async function SchoolsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-6 overflow-hidden bg-muted/30">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary font-semibold text-sm">
                            <GraduationCap className="h-4 w-4" /> Solution Écoles & Enseignants
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight font-heading leading-tight">
                            L{"'"}apprentissage interactif, <span className="text-transparent bg-clip-text bg-gradient-premium">clé en main.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                            Équipez votre établissement avec la plateforme leader de l{"'"}éducation ludique. Suivi personnalisé, exercices adaptés et motivation garantie.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            {FEATURES.map(f => (
                                <div key={f.title} className="flex gap-3 items-start">
                                    <div className="mt-1 h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                                        <f.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-foreground">{f.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Form Component */}
                    <div className="relative z-10">
                        <div className="absolute -inset-1 bg-gradient-premium rounded-[2rem] blur-lg opacity-20" />
                        <SchoolsClient />
                    </div>
                </div>
            </section>
        </div>
    );
}
