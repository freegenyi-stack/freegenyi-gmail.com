"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export default function SignUpClient({ locale }: { locale: string }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const getPasswordStrength = () => {
        let str = 0;
        if (password.length > 5) str += 1;
        if (password.length > 8) str += 1;
        if (/[A-Z]/.test(password)) str += 1;
        if (/[0-9]/.test(password)) str += 1;
        return str;
    };

    const strength = getPasswordStrength();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // TODO: Implémentation réelle de l'inscription via Supabase / NextAuth
        // Pour l'instant, on simule une attente puis redirection vers l'onboarding
        setTimeout(() => {
            setIsLoading(false);
            router.push(`/${locale}/onboarding`);
        }, 1200);
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-xl relative block w-full px-4 py-3 pl-10 border border-input bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
                            placeholder="parent@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Mot de passe</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-xl relative block w-full px-4 py-3 pl-10 border border-input bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {password && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                        <div className="flex gap-1 h-1.5 w-full">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength >= level
                                            ? strength < 2
                                                ? "bg-red-500"
                                                : strength < 3
                                                    ? "bg-yellow-500"
                                                    : "bg-green-500"
                                            : "bg-muted"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className={`text-xs font-medium flex items-center gap-1 ${strength < 2 ? "text-red-500" : strength < 3 ? "text-yellow-600" : "text-green-600"
                            }`}>
                            {strength < 2 && "Trop faible"}
                            {strength === 2 && "Moyen"}
                            {strength >= 3 && <><ShieldCheck className="h-3.5 w-3.5" /> Sécurisé</>}
                        </p>
                    </div>
                )}
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading || password.length < 5}
                    className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">
                            Créer mon espace gratuit
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    )}
                </button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
                En vous inscrivant, vous acceptez nos Termes et notre Politique de Confidentialité.
            </p>
        </form>
    );
}
