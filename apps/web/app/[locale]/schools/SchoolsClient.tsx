"use client";

import { useState } from "react";
import { submitSchoolRequest } from "./actions";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, CheckCircle2, ChevronDown, Mail, Phone, User, Loader2 } from "lucide-react";

export default function SchoolsClient() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await submitSchoolRequest(formData);

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
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-foreground">Demande envoyée !</h3>
                    <p className="text-muted-foreground mt-2 leading-relaxed">
                        Merci pour l{"'"}intérêt que vous portez à FreeGeny. Notre équipe éducative vous contactera très rapidement pour organiser votre démo personnalisée.
                    </p>
                </div>
                <Button variant="outline" onClick={() => setSuccess(false)} className="rounded-full">
                    Faire une autre demande
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card p-8 md:p-10 rounded-3xl shadow-2xl border border-border space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">Parlons de votre école</h3>

            {error && (
                <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-foreground">Je suis *</label>
                        <div className="relative">
                            <select name="role" required className="appearance-none w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none focus:border-primary">
                                <option value="">Mon rôle...</option>
                                <option value="Principal">Chef d'établissement / Directeur</option>
                                <option value="Teacher">Enseignant</option>
                                <option value="IT">Responsable Informatique</option>
                                <option value="Other">Autre</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-foreground">Nom de l'école *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building className="h-4 w-4 text-muted-foreground" /></div>
                            <input name="schoolName" type="text" required placeholder="Lycée Pasteur" className="w-full px-4 py-3 pl-10 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-foreground">Nom et Prénom *</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-4 w-4 text-muted-foreground" /></div>
                        <input name="contactName" type="text" required placeholder="Ahmed Benabdelkader" className="w-full px-4 py-3 pl-10 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-foreground">Email pro *</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-muted-foreground" /></div>
                            <input name="email" type="email" required placeholder="direction@ecole.com" className="w-full px-4 py-3 pl-10 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-foreground">Téléphone</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-muted-foreground" /></div>
                            <input name="phone" type="tel" placeholder="+213 6 00 00 00 00" className="w-full px-4 py-3 pl-10 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-foreground">Je souhaite... *</label>
                    <div className="relative">
                        <select name="requestType" required className="appearance-none w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none">
                            <option value="Demo">Planifier une démo de la plateforme</option>
                            <option value="Brochure">Recevoir une brochure détaillée</option>
                            <option value="Call">Être rappelé par un conseiller pédagogique</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Envoyer ma demande <ArrowRight className="h-5 w-5 ml-2" /></>}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
                Vos informations sont traitées de manière sécurisée et ne seront jamais partagées à des tiers.
            </p>
        </form>
    );
}
