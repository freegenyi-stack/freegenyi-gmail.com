"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, ShieldCheck, Users } from "lucide-react";

export default function SignUpClient({ locale }: { locale: string }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
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
        setError(null);

        try {
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();

            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        role: 'PARENT',
                    },
                    emailRedirectTo: `${window.location.origin}/api/auth/callback`,
                }
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                setSuccess(true);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-4 py-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Vérifiez votre boîte mail</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Nous avons envoyé un lien de confirmation à <span className="font-semibold text-foreground">{email}</span>.
                </p>
                <button
                    onClick={() => router.push(`/${locale}/auth/signin`)}
                    className="text-primary font-semibold text-sm hover:underline"
                >
                    Retour à la connexion
                </button>
            </div>
        );
    }

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
                    <label className="block text-sm font-medium text-foreground mb-1">Nom d'utilisateur</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="appearance-none rounded-xl relative block w-full px-4 py-3 pl-10 border border-input bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
                            placeholder="mon_pseudo"
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

            {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium animate-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
                En vous inscrivant, vous acceptez nos Termes et notre Politique de Confidentialité.
            </p>
        </form>
    );
}
