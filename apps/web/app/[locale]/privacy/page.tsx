import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
    setRequestLocale(locale);
    const tFooter = await getTranslations('footer');
    const tPages = await getTranslations('pages');

    return (
        <div className="container py-20">
            <h1 className="text-4xl font-bold mb-8">{tFooter('legal.privacy')}</h1>
            <div className="bg-slate-50 rounded-xl p-8 border">
                <h2 className="text-2xl font-semibold mb-4">{tPages('comingSoon')}</h2>
                <p className="text-muted-foreground text-lg">
                    {tPages('description')}
                </p>
            </div>
        </div>
    );
}
