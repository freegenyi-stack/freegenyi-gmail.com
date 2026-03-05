import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { unstable_setRequestLocale } from 'next-intl/server';

export default async function OnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    unstable_setRequestLocale(locale);

    return <OnboardingWizard />;
}
