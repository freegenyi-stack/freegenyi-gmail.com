import { createClient } from "@/lib/supabase/server";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

// Marketing components
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import HowItWorks from "@/components/marketing/HowItWorks";
import SchoolsSection from "@/components/marketing/SchoolsSection";
import Testimonials from "@/components/marketing/Testimonials";
import AboutSection from "@/components/marketing/AboutSection";
import CtaSection from "@/components/marketing/CtaSection";
import NgoBanner from "@/components/marketing/NgoBanner";

import { unstable_setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
}


