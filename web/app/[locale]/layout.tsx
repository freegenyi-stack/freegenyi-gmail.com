import type { Metadata } from "next";
import { Caveat, Great_Vibes } from "next/font/google";
import { readexPro, cairo, amiri, reemKufi, outfit, playfair } from "./fonts";
import "./globals.css";
import { RegionProvider } from "@/context/RegionContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import ThemeModal from "@/components/ThemeModal";
import { ChatProvider } from "@/context/ChatContext";
import ChatPanel from "@/components/ChatPanel";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "FreeGeny | L'excellence éducative libérée",
  description: "Plateforme premium d'éducation sur-mesure pour révéler le génie de votre enfant.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${readexPro.variable} ${cairo.variable} ${amiri.variable} ${reemKufi.variable} ${outfit.variable} ${playfair.variable} ${caveat.variable} ${greatVibes.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-white">
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <RegionProvider>
              <ChatProvider>
                {children}
                <ThemeModal />
                <ChatPanel />
                <Toaster position="top-right" richColors />
              </ChatProvider>
            </RegionProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
