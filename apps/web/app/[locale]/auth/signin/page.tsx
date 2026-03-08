'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ArrowRight, Eye, EyeOff, Mail, Lock, User,
  Sparkles, BookOpen, Globe, Users, GraduationCap, Building2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import LoadingOverlay from '@/components/auth/LoadingOverlay';
import LottieAnimation from '@/components/auth/LottieAnimation';
import animationData from '@/public/lottie/education.json';

// ─── Types ───────────────────────────────────────────────────────────────────

type UserRole = 'PARENT' | 'TEACHER' | 'NGO';
type AuthMode = 'login' | 'signup';

interface RoleOption {
  id: UserRole;
  labelKey: string;
  icon: React.FC<{ className?: string }>;
}

// ─── Social Providers ────────────────────────────────────────────────────────

const SOCIAL_PROVIDERS = [
  {
    id: 'google' as const,
    label: 'Google',
    disabled: false,
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.85 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.67 2.86c.86-2.6 3.29-4.55 6.15-4.55z" />
      </svg>
    ),
  },
  {
    id: 'facebook' as const,
    label: 'Facebook',
    disabled: false,
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'apple' as const,
    label: 'Apple',
    disabled: true, // Bientôt disponible — icône visible, bouton désactivé
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
];

// ─── Role options ─────────────────────────────────────────────────────────────

const ROLES: RoleOption[] = [
  { id: 'PARENT', labelKey: 'roles.parent', icon: Users },
  { id: 'TEACHER', labelKey: 'roles.teacher', icon: GraduationCap },
  { id: 'NGO', labelKey: 'roles.ngo', icon: Building2 },
];

// ─── Dashboard redirect by role ───────────────────────────────────────────────

function getDashboardPath(role: UserRole | string | undefined, locale: string): string {
  switch (role) {
    case 'TEACHER': return `/${locale}/ecole/dashboard`;
    case 'NGO':
    case 'ORGANIZATION': return `/${locale}/ngo`;
    default: return `/${locale}/parent`;
  }
}

// ─── Sign In Content (using useSearchParams) ────────────────────────────────

function SignInContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'fr';
  const t = useTranslations('auth');
  const router = useRouter();
  const isRTL = locale === 'ar';

  // Detect initial mode from URL param (?mode=signup)
  const initialMode: AuthMode = searchParams?.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('PARENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === 'login';

  // ─── Social OAuth ────────────────────────────────────────────────────────────

  const handleSocialLogin = useCallback(async (providerId: string) => {
    if (providerId === 'apple') return; // Disabled

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(`/${locale}/parent`)}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: providerId as 'google' | 'facebook',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || `Erreur avec ${providerId}`);
      setLoading(false);
    }
  }, [locale]);

  // ─── Email Auth ──────────────────────────────────────────────────────────────

  const handleEmailAuth = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const userRole = data.user?.user_metadata?.role;
        router.push(getDashboardPath(userRole, locale));
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
            },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });
        if (error) throw error;
        router.push(`/${locale}/auth/verify-email`);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  }, [email, password, fullName, role, isLogin, locale, router]);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <LoadingOverlay isVisible={loading} message={t('connecting')} />

      <div
        className={`min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 flex`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* ── Left panel: Form ── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-6">

            {/* Logo & Title */}
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {isLogin
                  ? (t('welcomeBack') || 'Bon retour !')
                  : (t('createAccount') || 'Créer un compte')}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {isLogin
                  ? (t('loginSubtitle') || 'Connectez-vous pour continuer')
                  : (t('signupSubtitle') || 'Rejoignez FreeGeny dès maintenant')}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            {/* Social Providers */}
            <div className="grid grid-cols-3 gap-3">
              {SOCIAL_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleSocialLogin(provider.id)}
                  disabled={loading || provider.disabled}
                  title={
                    provider.disabled
                      ? (t('comingSoon') || 'Bientôt disponible')
                      : `Continuer avec ${provider.label}`
                  }
                  className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-3 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <provider.icon />
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">
                  {t('orEmail') || 'Ou continuer avec email'}
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">

              {/* Full name (signup only) */}
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    {t('fullName') || 'Nom complet'}
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="fullName"
                      type="text"
                      required={!isLogin}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                      placeholder={t('fullNamePlaceholder') || 'Votre nom complet'}
                    />
                  </div>
                </div>
              )}

              {/* Role selector (signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('roleSelection') || 'Je suis…'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const isActive = role === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRole(r.id)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${isActive
                            ? 'border-violet-600 bg-violet-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-violet-300'
                            }`}
                        >
                          <Icon className={`h-5 w-5 ${isActive ? 'text-violet-600' : 'text-gray-400'}`} />
                          <span className={`text-[11px] font-semibold ${isActive ? 'text-violet-700' : 'text-gray-600'}`}>
                            {t(r.labelKey) || r.id}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('email') || 'Email'}
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="vous@exemple.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('password') || 'Mot de passe'}
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={isLogin ? undefined : 8}
                    className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="••••••••"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot password (login only) */}
              {isLogin && (
                <div className="flex items-center justify-end">
                  <Link
                    href={`/${locale}/auth/forgot-password`}
                    className="text-sm font-medium text-violet-600 hover:text-violet-500 transition-colors"
                  >
                    {t('forgotPassword') || 'Mot de passe oublié ?'}
                  </Link>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-violet-500/40 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    {isLogin
                      ? (t('signIn') || 'Se connecter')
                      : (t('createAccount') || 'Créer un compte')}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>

            {/* Switch mode */}
            <p className="text-center text-sm text-gray-600">
              {isLogin
                ? (t('noAccount') || 'Pas encore de compte ?')
                : (t('hasAccount') || 'Déjà un compte ?')}{' '}
              <button
                type="button"
                onClick={() => setMode(isLogin ? 'signup' : 'login')}
                className="font-semibold text-violet-600 hover:text-violet-500 transition-colors"
              >
                {isLogin
                  ? (t('signUpFree') || "S'inscrire gratuitement")
                  : (t('signIn') || 'Se connecter')}
              </button>
            </p>

            {/* Legal */}
            <p className="text-center text-xs text-gray-400">
              {t('legalText') || 'En continuant, vous acceptez nos'}{' '}
              <Link href={`/${locale}/terms`} className="underline hover:text-gray-600">
                {t('terms') || 'CGU'}
              </Link>
              {' & '}
              <Link href={`/${locale}/privacy`} className="underline hover:text-gray-600">
                {t('privacy') || 'Politique de confidentialité'}
              </Link>
            </p>
          </div>
        </div>

        {/* ── Right panel: Animation ── */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 max-w-lg text-center">
            <div className="w-80 h-80 mx-auto mb-8">
              <LottieAnimation animationData={animationData} className="w-full h-full" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              {t('quote') || 'Chaque enfant est un génie qui sommeille'}
            </h2>
            <p className="text-lg text-white/80">
              {t('quoteSubtext') || "FreeGeny transforme chaque moment en opportunité d'apprendre, de grandir et de s'émerveiller."}
            </p>

            <div className="mt-8 flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">38+</div>
                <div className="text-sm text-white/70 flex items-center gap-1 justify-center">
                  <Globe className="h-4 w-4" /> {t('trustItems.countries') || 'Pays'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10k+</div>
                <div className="text-sm text-white/70 flex items-center gap-1 justify-center">
                  <Sparkles className="h-4 w-4" /> {t('trustItems.learners') || 'Élèves'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-white/70 flex items-center gap-1 justify-center">
                  <BookOpen className="h-4 w-4" /> {t('trustItems.exercises') || 'Exercices'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Default Export (with Suspense wrapper) ──────────────────────────────────

export default function SignInPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
