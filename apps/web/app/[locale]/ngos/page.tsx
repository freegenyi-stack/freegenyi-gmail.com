import { getTranslations } from "next-intl/server";
import { setRequestLocale } from 'next-intl/server';
import NgosClient from "./NgosClient";
import { Globe2, Heart, Lightbulb, Users } from "lucide-react";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale });
    return {
        title: "Notre Engagement ONG - FreeGeny",
        description: "Bénéficiez d'un accès gratuit et illimité pour équiper votre association éducative.",
    };
}

const VALUES = [
    { icon: Heart, title: "L'égalité des chances", desc: "Chaque enfant a le droit d'apprendre." },
    { icon: Globe2, title: "Impact global", desc: "Soutien aux communautés mal desservies." },
    { icon: Users, title: "Puissance du collectif", desc: "Equiper les bénévoles avec les bons outils." },
    { icon: Lightbulb, title: "Innovation", desc: "Technologies au service de la solidarité." },
];

export default async function NgosPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="min-h-screen bg-background">
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-6 overflow-hidden bg-primary/5">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-2 text-primary font-semibold text-sm shadow-sm">
                            <Heart className="h-4 w-4" /> Solidarité Numérique
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight font-heading leading-tight">
                            Gratuit pour <br /><span className="text-transparent bg-clip-text bg-gradient-premium">ceux qui aident.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                            Notre engagement est simple : offrir un accès premium, illimité et gratuit à toutes les ONG et associations dédiées à l{"'"}éducation des enfants.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            {VALUES.map(v => (
                                <div key={v.title} className="flex gap-3 items-start p-4 rounded-2xl bg-card border border-border shadow-sm">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <v.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-foreground">{v.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 w-full max-w-md mx-auto lg:max-w-none">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-[2rem] blur-xl opacity-50" />
                        <NgosClient />
                    </div>
                </div>
            </section>
        </div>
    );
}
