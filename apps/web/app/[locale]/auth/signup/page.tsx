import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * /auth/signup → redirige vers /auth/signin?mode=signup
 * Le formulaire unifié gère login ET signup en un seul endroit.
 */
export default async function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/auth/signin?mode=signup`);
}
