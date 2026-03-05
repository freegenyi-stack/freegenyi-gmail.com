import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
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

import { unstable_setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);

  // TEMPORARILY DISABLED: Allow access to home page even when authenticated
  // Users complained they couldn't access anything
  /*
  if (session?.user?.role) {
    const role = session.user.role as string;
    switch (role) {
      case 'PARENT':
        redirect(`/${locale}/parent`);
        break;
      case 'TEACHER':
        redirect(`/${locale}/ecole/dashboard`);
        break;
      case 'NGO':
        redirect(`/${locale}/ngo`);
        break;
      case 'ORGANIZATION':
        redirect(`/${locale}/organization`);
        break;
      default:
        redirect(`/${locale}/parent`);
    }
  }
  */

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <SchoolsSection />
      <Testimonials />
      <AboutSection />
      <CtaSection />
    </>
  );
}


