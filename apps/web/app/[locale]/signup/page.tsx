import { getTranslations } from "next-intl/server";
import { setRequestLocale } from 'next-intl/server';
import SignUpClient from "./SignUpClient";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale });
    return {
        title: "Créez l'espace famille - FreeGeny",
        description: "Inscription gratuite en 30 secondes pour les parents.",
    };
}

export default async function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-md w-full space-y-8 z-10 bg-card p-10 rounded-3xl shadow-2xl border border-border">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-foreground font-heading tracking-tight">
                        Créez l{"'"}espace famille en <span className="text-primary text-transparent bg-clip-text bg-gradient-premium">30 secondes</span>.
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground font-medium">
                        Rejoignez-nous aujourd{"'"}hui. <span className="font-semibold text-foreground">Aucun paiement demandé pour le moment.</span>
                    </p>
                </div>

                <SignUpClient locale={locale} />
            </div>
        </div>
    );
}
