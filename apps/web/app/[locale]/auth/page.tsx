import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * /auth → redirige vers /auth/signin (formulaire unifié)
 * Plus de doublon de formulaire ici.
 */
export default async function AuthPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    redirect(`/${locale}/auth/signin`);
}
