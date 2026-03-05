"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { SOCIAL_PROVIDERS } from "./SocialIcons"

interface AuthFormProps {
    mode?: 'login' | 'register'
}

export default function AuthForm({ mode: initialMode = 'login' }: AuthFormProps) {
    const t = useTranslations('auth')
    const [mode, setMode] = useState<'login' | 'register'>(initialMode)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const isLogin = mode === "login"

    return (
        <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
                <Link href="/" className="mb-8 inline-flex items-center gap-2.5 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary transition-transform duration-300 group-hover:scale-105">
                        <span className="font-heading text-lg text-primary-foreground tracking-tight">F</span>
                    </div>
                    <span className="font-heading text-2xl tracking-tight text-foreground">
                        Free<span className="text-primary">Geny</span>
                    </span>
                </Link>

                <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {isLogin ? (t('welcomeBack') || "Content de vous revoir") : (t('joinAdventure') || "Rejoignez l'aventure")}
                </h1>
                <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                    {isLogin
                        ? (t('loginSubtitle') || "Connectez-vous pour continuer l'apprentissage.")
                        : (t('signupSubtitle') || "Créez un compte et commencez l'expérience FreeGeny.")}
                </p>
            </div>

            {/* Social providers */}
            <div className="grid grid-cols-5 gap-2.5">
                {SOCIAL_PROVIDERS.map((provider) => {
                    const Icon = provider.icon
                    return (
                        <button
                            key={provider.id}
                            type="button"
                            className="group flex items-center justify-center rounded-xl border border-border bg-card py-3 transition-all duration-200 hover:border-primary/30 hover:bg-accent hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Se connecter avec ${provider.label}`}
                        >
                            <Icon />
                        </button>
                    )
                })}
            </div>

            {/* Divider */}
            <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground tracking-wider">
                        {t('orEmail') || "ou par email"}
                    </span>
                </div>
            </div>

            {/* Email form */}
            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault()
                }}
            >
                {/* Name field (register only) */}
                {!isLogin && (
                    <div className="relative">
                        <label htmlFor="name" className="sr-only">{t('fullName') || "Nom complet"}</label>
                        <div className={`relative flex items-center rounded-xl border bg-card transition-all duration-200 ${focusedField === "name" ? "border-primary shadow-sm shadow-primary/10" : "border-border"
                            }`}>
                            <User className="ml-4 h-4.5 w-4.5 text-muted-foreground shrink-0" />
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setFocusedField("name")}
                                onBlur={() => setFocusedField(null)}
                                placeholder={t('fullName') || "Nom complet"}
                                className="w-full bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                autoComplete="name"
                            />
                        </div>
                    </div>
                )}

                {/* Email field */}
                <div className="relative">
                    <label htmlFor="email" className="sr-only">{t('email') || "Adresse email"}</label>
                    <div className={`relative flex items-center rounded-xl border bg-card transition-all duration-200 ${focusedField === "email" ? "border-primary shadow-sm shadow-primary/10" : "border-border"
                        }`}>
                        <Mail className="ml-4 h-4.5 w-4.5 text-muted-foreground shrink-0" />
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="votre@email.com"
                            className="w-full bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                            autoComplete="email"
                        />
                    </div>
                </div>

                {/* Password field */}
                <div className="relative">
                    <label htmlFor="password" className="sr-only">{t('password') || "Mot de passe"}</label>
                    <div className={`relative flex items-center rounded-xl border bg-card transition-all duration-200 ${focusedField === "password" ? "border-primary shadow-sm shadow-primary/10" : "border-border"
                        }`}>
                        <Lock className="ml-4 h-4.5 w-4.5 text-muted-foreground shrink-0" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField(null)}
                            placeholder={isLogin ? (t('password') || "Mot de passe") : (t('createPassword') || "Créez un mot de passe")}
                            className="w-full bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="mr-3 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Forgot password */}
                {isLogin && (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                        >
                            {t('forgotPassword') || "Mot de passe oublié ?"}
                        </button>
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    className="group mt-1 flex w-full items-center justify-center gap-2.5 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:gap-3.5 hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    {isLogin ? (t('signIn') || "Se connecter") : (t('createAccount') || "Créer mon compte")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
            </form>

            {/* Toggle mode */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
                {isLogin ? (t('noAccount') || "Pas encore de compte ?") : (t('hasAccount') || "Vous avez déjà un compte ?")} {" "}
                <button
                    type="button"
                    onClick={() => setMode(isLogin ? "register" : "login")}
                    className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                    {isLogin ? (t('signUpFree') || "S'inscrire gratuitement") : (t('signIn') || "Se connecter")}
                </button>
            </p>

            {/* Terms */}
            {!isLogin && (
                <p className="mt-4 text-center text-xs text-muted-foreground leading-relaxed">
                    {t('termsText') || "En créant un compte, vous acceptez nos"}{" "}
                    <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
                        {t('termsLink') || "Conditions d'utilisation"}
                    </a>
                    {" et notre "}
                    <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                        {t('privacyLink') || "Politique de confidentialité"}
                    </a>.
                </p>
            )}
        </div>
    )
}
