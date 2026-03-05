import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

export default async function SchoolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
    unstable_setRequestLocale(locale);
    const t = await getTranslations('navigation.menu.schools');

    return (
        <div className="container py-10">
            <h1 className="text-4xl font-bold mb-4">{t('main')}</h1>
            <p className="text-xl text-muted-foreground">
                Welcome to the Schools section. Content coming soon.
            </p>
        </div>
    );
}
