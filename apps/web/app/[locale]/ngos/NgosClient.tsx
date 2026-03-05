"use client";

import { useState } from "react";
import { submitNgoRequest } from "./actions";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, CheckCircle2, Mail, MessageSquare, Loader2, HeartHandshake } from "lucide-react";

export default function NgosClient() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await submitNgoRequest(formData);

        setIsLoading(false);

        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            setSuccess(true);
        }
    }

    if (success) {
        return (
            <div className="bg-card p-10 rounded-3xl shadow-2xl border border-border text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div>
                    <h3 className="text-3xl font-extrabold text-foreground tracking-tight font-heading">Requête bien reçue !</h3>
                    <p className="text-muted-foreground mt-4 leading-relaxed text-lg">
                        <strong>Merci pour votre engagement envers l{"'"}éducation.</strong><br />
                        Notre équipe examine votre demande. Nous vous enverrons un lien d{"'"}accès unique sous 48h.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card p-8 md:p-10 rounded-3xl shadow-2xl border border-border space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Faites votre demande gratuite</h3>

            {error && (
                <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-foreground">Nom de l'organisation *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HeartHandshake className="h-4 w-4 text-muted-foreground" /></div>
                        <input name="organizationName" type="text" required placeholder="Les Enfants de l'Éducation" className="w-full px-4 py-3 pl-10 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-foreground">Site web / Réseaux sociaux *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Globe className="h-4 w-4 text-muted-foreground" /></div>
                        <input name="website" type="text" required placeholder="www.mon-association.org" className="w-full px-4 py-3 pl-10 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                        <label className="text-sm font-semibold text-foreground">Email de contact *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-muted-foreground" /></div>
                            <input name="contactEmail" type="email" required placeholder="contact@association.org" className="w-full px-4 py-3 pl-10 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-foreground">Votre mission principale *</label>
                    <div className="relative">
                        <textarea name="mission" required rows={2} placeholder="Soutenir la scolarisation dans les zones rurales..." className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-foreground">Comment comptez-vous utiliser FreeGeny ? *</label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none"><MessageSquare className="h-4 w-4 text-muted-foreground" /></div>
                        <textarea name="intendedUse" required rows={3} placeholder="Mettre des tablettes à disposition dans notre centre d'accueil..." className="w-full px-4 py-3 pl-10 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
                    </div>
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Soumettre ma demande <ArrowRight className="h-5 w-5 ml-2" /></>}
            </Button>

            <div className="text-center rounded-xl bg-muted/50 p-3 mt-4">
                <p className="text-xs text-muted-foreground font-medium">
                    Nous traiterons votre requête sous 48h. Si validée, vous recevrez la totalité de notre plateforme sans frais.
                </p>
            </div>
        </form>
    );
}
