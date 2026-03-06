'use client';
// Recompilation trigger

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { BookOpen, Sparkles, Globe, ArrowLeft } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import AuthForm from '@/components/auth/AuthForm';
import SocialButtons from '@/components/auth/SocialButtons';
import { createClient } from '@/lib/supabase/client';
import LoadingOverlay from '@/components/auth/LoadingOverlay';
import type { LoginInput, SignupInput } from '@/lib/validations/auth-schema';

const TRUST_ITEMS = [
  {
    icon: BookOpen,
    textKey: "trustItems.certified",
  },
  {
    icon: Globe,
    textKey: "trustItems.countries",
  },
  {
    icon: Sparkles,
    textKey: "trustItems.learners",
  },
]

export default function SignUpPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'fr';
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('auth');

  const handleAuthSubmit = async (data: LoginInput | SignupInput) => {
    setLoading(true);

    try {
      if (mode === 'login') {
        // Redirect to signin page logic or handle it here
        const loginData = data as LoginInput;
        const supabase = createClient();

        let loginEmail = loginData.email;

        // Handle username login
        if (!loginEmail.includes('@')) {
          const { data: userData, error: userError } = await supabase
            .from('User')
            .select('email')
            .eq('username', loginEmail)
            .single();

          if (userError || !userData) {
            throw new Error("User not found with this username");
          }
          loginEmail = userData.email;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginData.password,
        });

        if (error) throw error;

        router.push(`/${locale}/parent`);
      } else {
        const signupData = data as SignupInput;
        const supabase = createClient();

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              username: signupData.username,
              firstName: signupData.firstName,
              lastName: signupData.lastName,
              role: 'PARENT', // Default role for this form
            },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          }
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          alert("✨ Inscription réussie ! Vérifiez votre email pour confirmer.");
          setMode('login');
        }
      }
    } catch (error: any) {
      console.error(error);
      alert("🚨 Erreur : " + (error.message || "Une erreur inattendue est survenue."));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'microsoft' | 'facebook' | 'linkedin') => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error(error);
      alert("❌ Social login failed: " + error.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    alert("ℹ️ Password reset is temporarily unavailable.");
  };

  return (
    <>
      <LoadingOverlay isVisible={loading} message={t('connecting')} />

      <div className="flex min-h-screen bg-background font-sans">
        {/* Left panel - Illustration & branding - Hidden on mobile */}
        <div className="relative hidden w-full lg:w-1/2 flex-col justify-center overflow-hidden bg-primary p-12 lg:flex">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/classroom.jpg"
              alt={t('illustrationAlt')}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-primary/40" />
          </div>

          <div className="relative z-10 flex flex-col gap-8">
            {/* Top - decorative dots */}
            <div className="flex gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </div>

            {/* Center - Big quote/message */}
            <div className="flex flex-col gap-4">
              <blockquote className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl lg:leading-[1.1]">
                {t('quote') || "L'éducation est la clé de la liberté."}
              </blockquote>
              <p className="max-w-md text-base lg:text-lg leading-relaxed text-white/90 font-medium">
                Rejoignez FreeGeny et offrez à votre enfant une expérience d'apprentissage unique et personnalisée.
              </p>
            </div>

            {/* Trust items - now moved up closer to the quote */}
            <div className="flex flex-col gap-3">
              {TRUST_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.textKey} className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 border border-white/5">
                      <Icon className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-sm font-semibold text-white/90">{t(item.textKey)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right panel / Main panel - Auth form */}
        <div className="flex w-full lg:w-1/2 flex-col items-center lg:items-start justify-center h-screen px-4 sm:px-6 lg:pl-16 lg:pr-8 relative bg-white">
          {/* Mobile green accent at top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary lg:hidden" />

          <AuthCard
            title={mode === 'login' ? t('loginWelcome') : t('signupTitle')}
            subtitle={mode === 'login' ? t('loginSubtitle') : t('signupSubtitle')}
          >
            <AuthForm
              mode={mode}
              onSubmit={handleAuthSubmit}
              onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')}
              onForgotPassword={handleForgotPassword}
              loading={loading}
            />

            {/* Divider */}
            <div className="flex items-center gap-3 my-1 sm:my-1 opacity-60">
              <div className="h-px bg-black/10 flex-1" />
              <span className="text-xs font-extrabold text-[#64748B] uppercase tracking-widest">
                {t('or')}
              </span>
              <div className="h-px bg-black/10 flex-1" />
            </div>

            {/* Social Buttons */}
            <SocialButtons
              onSocialLogin={handleSocialLogin}
              loading={loading}
            />

            {/* Legal Footer */}
            <div className="mt-2 sm:mt-2 text-xs text-[#64748B]/70 font-semibold px-2 sm:px-4 text-center">
              {t('legalText')}{' '}
              <a href={`/${locale}/terms`} className="text-[#334155] font-extrabold hover:text-primary transition-colors">
                {t('terms')}
              </a>{' '}
              &{' '}
              <a href={`/${locale}/privacy`} className="text-[#334155] font-extrabold hover:text-primary transition-colors">
                {t('privacy')}
              </a>
            </div>
          </AuthCard>
        </div>
      </div>
    </>
  );
}
