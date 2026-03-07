import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('navigation.menu.pricing');

    return (
        <div className="container py-10">
            <h1 className="text-4xl font-bold mb-4">{t('main')}</h1>
            <p className="text-xl text-muted-foreground">
                Welcome to the Pricing section. Content coming soon.
            </p>
        </div>
    );
}
