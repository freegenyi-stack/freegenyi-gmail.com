"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from '@/lib/validations/auth-schema'
import PasswordStrengthMeter from './PasswordStrengthMeter'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { GraduationCap, Users, Building2 } from 'lucide-react'

interface AuthFormProps {
    mode: 'login' | 'signup'
    onSubmit: (data: LoginInput | SignupInput) => Promise<void>
    onToggleMode: () => void
    onForgotPassword?: () => void
    loading?: boolean
}

export default function AuthForm({
    mode,
    onSubmit,
    onToggleMode,
    onForgotPassword,
    loading = false
}: AuthFormProps) {
    const t = useTranslations('auth')
    const [showPassword, setShowPassword] = useState(false)

    const schema = mode === 'login' ? loginSchema : signupSchema

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<LoginInput | SignupInput>({
        resolver: zodResolver(schema),
        defaultValues: mode === 'login' ? {
            email: typeof window !== 'undefined' ? localStorage.getItem('lastEmail') || '' : '',
            role: (typeof window !== 'undefined' ? localStorage.getItem('lastRole') || 'PARENT' : 'PARENT') as any
        } : {}
    })

    const password = watch('password')
    const role = watch('role' as any)
    const isLogin = mode === 'login'

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full">
            {/* First Name (signup only) */}
            {!isLogin && (
                <div className="flex flex-col gap-1">
                    <label htmlFor="firstName" className="text-xs sm:text-sm font-bold text-foreground/80">
                        {t('firstNameLabel')}
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        {...register('firstName' as any)}
                        className="w-full px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-[20px] border-2 border-border bg-white
             font-semibold text-xs sm:text-base text-foreground transition-all duration-300
             focus:outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(var(--primary),0.1)]
             focus:scale-[1.01]"
                        placeholder={t('firstNamePlaceholder')}
                    />
                    {(errors as any).firstName && (
                        <span className="text-xs text-red-500 font-semibold">{(errors as any).firstName.message}</span>
                    )}
                </div>
            )}

            {/* Last Name (signup only) */}
            {!isLogin && (
                <div className="flex flex-col gap-1">
                    <label htmlFor="lastName" className="text-xs sm:text-sm font-bold text-foreground/80">
                        {t('lastNameLabel')}
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        {...register('lastName' as any)}
                        className="w-full px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-[20px] border-2 border-border bg-white
             font-semibold text-xs sm:text-base text-foreground transition-all duration-300
             focus:outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(var(--primary),0.1)]
             focus:scale-[1.01]"
                        placeholder={t('lastNamePlaceholder')}
                    />
                    {(errors as any).lastName && (
                        <span className="text-xs text-red-500 font-semibold">{(errors as any).lastName.message}</span>
                    )}
                </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs sm:text-sm font-bold text-foreground/80">
                    {t('emailLabel')}
                </label>
                <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="w-full px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-[20px] border-2 border-border bg-white
           font-semibold text-xs sm:text-base text-foreground transition-all duration-300
           focus:outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(var(--primary),0.1)]
           focus:scale-[1.01]"
                    placeholder={t('emailPlaceholder')}
                />
                {errors.email && (
                    <span className="text-xs text-red-500 font-semibold">{errors.email.message}</span>
                )}
            </div>

            {/* Role Selection (Login only - based on user request) */}
            {isLogin && (
                <div className="flex flex-col gap-3 py-2">
                    <label className="text-xs sm:text-sm font-bold text-foreground/80">
                        {t('roleSelection')}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'PARENT', label: t('roles.parent'), icon: Users },
                            { id: 'TEACHER', label: t('roles.teacher'), icon: GraduationCap },
                            { id: 'NGO', label: t('roles.ngo'), icon: Building2 }
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setValue('role' as any, item.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300",
                                    role === item.id || (!role && item.id === 'PARENT')
                                        ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                                        : "border-border bg-white hover:border-primary/50"
                                )}
                            >
                                <item.icon className={cn("h-6 w-6", (role === item.id || (!role && item.id === 'PARENT')) ? "text-primary" : "text-muted-foreground")} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
                            </button>
                        ))}
                        <input type="hidden" {...register('role' as any)} />
                    </div>
                </div>
            )}

            {/* Password */}
            <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-xs sm:text-sm font-bold text-foreground/80">
                    {t('passwordLabel')}
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        {...register('password')}
                        className="w-full px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-[20px] border-2 border-border bg-white
             font-semibold text-xs sm:text-base text-foreground transition-all duration-300
             focus:outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(var(--primary),0.1)]
             focus:scale-[1.01] pr-10 sm:pr-12"
                        placeholder={t('passwordPlaceholder')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff className="h-4 sm:h-5 w-4 sm:w-5" /> : <Eye className="h-4 sm:h-5 w-4 sm:w-5" />}
                    </button>
                </div>
                {errors.password && (
                    <span className="text-xs text-red-500 font-semibold">{errors.password.message}</span>
                )}
                {!isLogin && password && <PasswordStrengthMeter password={password} />}
            </div>

            {/* Forgot Password (login only) */}
            {isLogin && onForgotPassword && (
                <div className="flex justify-end -mt-0.5">
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-xs sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                        {t('forgotPassword')}
                    </button>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-[20px] font-extrabold text-sm sm:text-base
         shadow-[0_4px_0_hsl(var(--primary)/0.7),0_15px_35px_rgba(var(--primary),0.3)]
         hover:shadow-[0_6px_0_hsl(var(--primary)/0.7),0_20px_45px_rgba(var(--primary),0.4)]
         hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none
         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
         mt-1 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <span className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('processing')}
                    </>
                ) : (
                    mode === 'login' ? t('loginButton') : t('signupButton')
                )}
            </button>

            {/* Toggle Mode */}
            <div className="text-center mt-1 sm:mt-1">
                <span className="text-xs sm:text-xs text-[#64748B] font-semibold">
                    {isLogin ? t('noAccount') : t('hasAccount')}{' '}
                </span>
                <button
                    type="button"
                    onClick={onToggleMode}
                    className="text-xs sm:text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                >
                    {isLogin ? t('signupLink') : t('signinLink')}
                </button>
            </div>
        </form>
    )
}
