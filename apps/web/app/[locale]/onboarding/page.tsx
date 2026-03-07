import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { setRequestLocale } from 'next-intl/server';

export default async function OnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <OnboardingWizard />;
}
