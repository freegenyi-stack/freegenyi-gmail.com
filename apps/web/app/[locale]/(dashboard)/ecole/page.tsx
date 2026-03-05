import { redirect } from 'next/navigation';

export default async function EcolePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    redirect(`/${locale}/ecole/dashboard`);
}
