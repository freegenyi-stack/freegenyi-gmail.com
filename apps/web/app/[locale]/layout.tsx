import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, rtlLocales } from '@/lib/i18n/config';
import ClientLayout from '@/components/ClientLayout';
import AccessibilityToolbar from '@/components/ui/AccessibilityToolbar';
import { ClientProviders } from '@/components/Providers/ClientProviders';
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic, Scheherazade_New, Lateef, Aref_Ruqaa } from 'next/font/google';
import '../globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-ibm-plex',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const scheherazade = Scheherazade_New({
  subsets: ['arabic', 'latin'],
  variable: '--font-scheherazade',
  weight: ['400', '700'],
  display: 'swap',
});

const lateef = Lateef({
  subsets: ['arabic', 'latin'],
  variable: '--font-lateef',
  weight: ['400'],
  display: 'swap',
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ['arabic', 'latin'],
  variable: '--font-arefruqaa',
  weight: ['400', '700'],
  display: 'swap',
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    messages = {};
  }

  const isRTL = rtlLocales.includes(locale as any);

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${ibmPlexArabic.variable} ${scheherazade.variable} ${lateef.variable} ${arefRuqaa.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders>
            <ClientLayout isRTL={isRTL}>
              {children}
              <AccessibilityToolbar />
            </ClientLayout>
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
