import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { locales, rtlLocales } from '@/lib/i18n/config';
import ClientLayout from '@/components/ClientLayout';
import AccessibilityToolbar from '@/components/ui/AccessibilityToolbar';
import { ClientProviders } from '@/components/Providers/ClientProviders';
import { Outfit, Bricolage_Grotesque, Alexandria, Cairo, Tajawal, Scheherazade_New, Lateef, Aref_Ruqaa } from 'next/font/google';
import '../globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  variable: '--font-alexandria',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
  weight: ['200', '300', '400', '500', '700', '800', '900'],
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

  unstable_setRequestLocale(locale);

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    messages = {};
  }

  const isRTL = rtlLocales.includes(locale as any);

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning className={`${outfit.variable} ${bricolage.variable} ${alexandria.variable} ${cairo.variable} ${tajawal.variable} ${scheherazade.variable} ${lateef.variable} ${arefRuqaa.variable}`}>
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
