import { createClient } from "@/lib/supabase/server";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

// Marketing components
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import HowItWorks from "@/components/marketing/HowItWorks";
import SchoolsSection from "@/components/marketing/SchoolsSection";
import Testimonials from "@/components/marketing/Testimonials";
import AboutSection from "@/components/marketing/AboutSection";
import CtaSection from "@/components/marketing/CtaSection";
import NgoBanner from "@/components/marketing/NgoBanner";

import { setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  try {
    const { locale } = await params;
    setRequestLocale(locale);

    // Try to get Supabase client, but don't fail the whole page if it fails
    let user = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch (error) {
      console.warn('Supabase client initialization failed:', error);
      // Continue without user data - page should still work
    }

    // Supabase session is available in 'user' variable if needed

    return (
      <>
        <Hero />
        <Features />
        <HowItWorks />
        <SchoolsSection />
        <Testimonials />
        <AboutSection />
        <NgoBanner />
        <CtaSection />
      </>
    );
  } catch (error) {
    console.error('HomePage error:', error);
    // Fallback rendering if something goes wrong
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">FreeGeny</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
}


