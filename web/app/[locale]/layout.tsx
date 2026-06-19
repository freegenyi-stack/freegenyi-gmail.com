import type { Metadata } from "next";
import { Caveat, Great_Vibes } from "next/font/google";
import { readexPro, cairo, amiri, reemKufi, outfit, playfair, inter, ibmPlexSansArabic } from "./fonts";
import "./globals.css";
import { RegionProvider } from "@/context/RegionContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import ThemeModal from "@/components/ThemeModal";
import AppShell from "@/components/AppShell";
import MaintenanceGate from "@/components/admin/MaintenanceGate";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // ── Titles per language ──────────────────────────────────────────────────
  const titles: Record<string, string> = {
    fr: "FreeGeny | L'excellence éducative libérée",
    en: "FreeGeny | Educational excellence unleashed",
    ar: "فريجيني | التميّز التعليمي بلا حدود",
    es: "FreeGeny | La excelencia educativa liberada",
    de: "FreeGeny | Bildungsexzellenz befreit",
    it: "FreeGeny | L'eccellenza educativa liberata",
    pt: "FreeGeny | A excelência educativa libertada",
    nl: "FreeGeny | Onderwijskundige excellentie bevrijd",
    da: "FreeGeny | Pædagogisk ekspertise frigjort",
    sv: "FreeGeny | Utbildningsexcellens frigjord",
    no: "FreeGeny | Pedagogisk ekspertise frigjort",
    fi: "FreeGeny | Koulutuksellinen huippuosaaminen vapautettu",
    pl: "FreeGeny | Wyzwolona doskonałość edukacyjna",
    cs: "FreeGeny | Uvolněná vzdělávací excelence",
    ko: "FreeGeny | 해방된 교육적 우수성",
    ja: "FreeGeny | 解放された教育的卓越性",
    zh: "FreeGeny | 解放的教育卓越性",
    ms: "FreeGeny | Kecemerlangan pendidikan yang dibebaskan",
    ta: "FreeGeny | விடுதலையான கல்வி சிறப்பு",
    ga: "FreeGeny | Sárcháilíocht oideachais saor",
    mi: "FreeGeny | Te teitei hinengaro whakawātea",
    ro: "FreeGeny | Excelența educațională eliberată",
    af: "FreeGeny | Onderwysuitmuntendheid bevry",
    zu: "FreeGeny | Ukuphakama kwemfundo okukhululiwe",
    xh: "FreeGeny | Ubuqaqawuli bemfundo obukhululiweyo",
    id: "FreeGeny | Keunggulan pendidikan yang dibebaskan",
    hi: "FreeGeny | \u092e\u0941\u0915\u094d\u0924 \u0936\u0948\u0915\u094d\u0937\u093f\u0915 \u0909\u0924\u094d\u0915\u0943\u0937\u094d\u091f\u0924\u093e",
    tr: "FreeGeny | \u00d6zg\u00fcrle\u015ftirilmi\u015f e\u011fitim m\u00fckemmeliyeti",
    th: "FreeGeny | \u0e04\u0e27\u0e32\u0e21\u0e40\u0e1b\u0e47\u0e19\u0e40\u0e25\u0e34\u0e28\u0e17\u0e32\u0e07\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32\u0e17\u0e35\u0e48\u0e1b\u0e25\u0e14\u0e1b\u0e25\u0e48\u0e2d\u0e22\u0e41\u0e25\u0e49\u0e27",
    vi: "FreeGeny | S\u1ef1 xu\u1ea5t s\u1eafc gi\u00e1o d\u1ee5c \u0111\u01b0\u1ee3c gi\u1ea3i ph\u00f3ng",
    ku: "FreeGeny | Bilindahiya perwerdehy\u00ea ya azadkir\u00ee",
    be: "FreeGeny | \u0412\u044b\u0437\u0432\u0430\u043b\u0435\u043d\u0430\u044f \u0430\u0434\u0443\u043a\u0430\u0446\u044b\u0439\u043d\u0430\u044f \u0432\u044b\u0434\u0430\u0442\u043d\u0430\u0441\u0446\u044c",
    uk: "FreeGeny | \u0417\u0432\u0456\u043b\u044c\u043d\u0435\u043d\u0430 \u043e\u0441\u0432\u0456\u0442\u043d\u044f \u0434\u043e\u0441\u043a\u043e\u043d\u0430\u043b\u0456\u0441\u0442\u044c",
    ru: "FreeGeny | \u041e\u0441\u0432\u043e\u0431\u043e\u0436\u0434\u0451\u043d\u043d\u043e\u0435 \u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0435 \u043f\u0440\u0435\u0432\u043e\u0441\u0445\u043e\u0434\u0441\u0442\u0432\u043e",
    el: "FreeGeny | \u0391\u03c0\u03b5\u03bb\u03b5\u03c5\u03b8\u03b5\u03c1\u03c9\u03bc\u03ad\u03bd\u03b7 \u03b5\u03ba\u03c0\u03b1\u03b9\u03b4\u03b5\u03c5\u03c4\u03b9\u03ba\u03ae \u03b1\u03c1\u03b9\u03c3\u03c4\u03b5\u03af\u03b1",
    hu: "FreeGeny | Felszabad\u00edtott oktat\u00e1si kiv\u00e1l\u00f3s\u00e1g",
  };

  const descriptions: Record<string, string> = {
    fr: "Plateforme premium d'éducation sur-mesure pour révéler le génie de votre enfant.",
    en: "Premium custom education platform to reveal your child's genius.",
    ar: "منصة تعليمية مخصصة فاخرة لإظهار عبقرية طفلك.",
    es: "Plataforma premium de educación personalizada para revelar el genio de su hijo.",
    de: "Premium maßgeschneiderte Bildungsplattform, um das Genie Ihres Kindes zu enthüllen.",
    it: "Piattaforma premium di istruzione personalizzata per rivelare il genio di tuo figlio.",
    pt: "Plataforma premium de educação personalizada para revelar o génio do seu filho.",
    nl: "Premium maatwerk educatieplatform om het genie van uw kind te onthullen.",
    da: "Premium skræddersyet uddannelsesplatform til at afsløre dit barns geni.",
    sv: "Premium anpassad utbildningsplattform för att avslöja ditt barns geni.",
    no: "Premium skreddersydd utdanningsplattform for å avsløre barnets geni.",
    fi: "Premium räätälöity koulutusalusta lapsesi nerouden paljastamiseksi.",
    pl: "Premiumowa platforma edukacyjna na miarę do odkrycia geniuszu Twojego dziecka.",
    cs: "Premiumová platforma přizpůsobeného vzdělávání pro odhalení génia vašeho dítěte.",
    ko: "자녀의 천재성을 드러내는 프리미엄 맞춤형 교육 플랫폼.",
    ja: "お子様の天才性を明らかにするプレミアムカスタム教育プラットフォーム。",
    zh: "揭示孩子天才的优质定制教育平台。",
    ms: "Platform pendidikan tersuai premium untuk mendedahkan kegeniusan anak anda.",
    ta: "உங்கள் குழந்தையின் மேதைத்துவத்தை வெளிப்படுத்த பிரீமியம் தனிப்பயனாக்கப்பட்ட கல்வி தளம்.",
    ga: "Ardán oideachais saincheaptha premium chun géiniúil do leanbh a nochtadh.",
    mi: "Te papakori matauranga awhina hei whakaatu i te tohungatanga o tamaiti.",
    ro: "Platformă de educație premium personalizată pentru a dezvălia geniul copilului dumneavoastră.",
    af: "Premium pasgemaakte onderwysplatform om jou kind se genie te onthul.",
    zu: "Inkundla yokufunda eyenziwe ngokukhethekile ukuveza ikhono lengane yakho.",
    xh: "Iqonga lemfundo elenziwe ngokukhethekileyo ukuveza isiphiwo somntwana wakho.",
    id: "Platform pendidikan premium yang disesuaikan untuk mengungkap kejeniusan anak Anda.",
    hi: "\u0906\u092a\u0915\u0947 \u092c\u091a\u094d\u091a\u0947 \u0915\u0940 \u092a\u094d\u0930\u0924\u093f\u092d\u093e \u0915\u094b \u0909\u091c\u093e\u0917\u0930 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u092a\u094d\u0930\u0940\u092e\u093f\u092f\u092e \u0915\u0938\u094d\u091f\u092e \u0936\u093f\u0915\u094d\u0937\u093e \u092e\u0902\u091a\u0964",
    tr: "\u00c7ocu\u011funuzun dehas\u0131n\u0131 ortaya \u00e7\u0131karmak i\u00e7in premium \u00f6zel e\u011fitim platformu.",
    th: "\u0e41\u0e1e\u0e25\u0e15\u0e1f\u0e2d\u0e23\u0e4c\u0e21\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32\u0e1e\u0e23\u0e35\u0e40\u0e21\u0e35\u0e22\u0e21\u0e17\u0e35\u0e48\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e40\u0e2d\u0e07\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e40\u0e1b\u0e34\u0e14\u0e40\u0e1c\u0e22\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e02\u0e2d\u0e07\u0e25\u0e39\u0e01\u0e04\u0e38\u0e13",
    vi: "N\u1ec1n t\u1ea3ng gi\u00e1o d\u1ee5c cao c\u1ea5p t\u00f9y ch\u1ec9nh \u0111\u1ec3 kh\u00e1m ph\u00e1 thi\u00ean t\u00e0i c\u1ee7a con b\u1ea1n.",
    ku: "Platforma perwerdeya premium a kesane ji bo e\u015fkerekirina j\u00eahat\u00efb\u00fbna zarok\u00ea te.",
    be: "\u041f\u0440\u044d\u043c\u0456\u0443\u043c-\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430 \u0430\u0434\u0443\u043a\u0430\u0446\u044b\u0456 \u043d\u0430 \u0437\u0430\u043a\u0430\u0437, \u043a\u0430\u0431 \u0440\u0430\u0441\u043a\u0440\u044b\u0446\u044c \u0433\u0435\u043d\u0456\u044f\u043b\u044c\u043d\u0430\u0441\u0446\u044c \u0432\u0430\u0448\u0430\u0433\u0430 \u0434\u0437\u0456\u0446\u044f\u0446\u0456.",
    uk: "\u041f\u0440\u0435\u043c\u0456\u0443\u043c \u043d\u0430\u0432\u0447\u0430\u043b\u044c\u043d\u0430 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430 \u043d\u0430 \u0437\u0430\u043c\u043e\u0432\u043b\u0435\u043d\u043d\u044f, \u0449\u043e\u0431 \u0440\u043e\u0437\u043a\u0440\u0438\u0442\u0438 \u0433\u0435\u043d\u0456\u0430\u043b\u044c\u043d\u0456\u0441\u0442\u044c \u0432\u0430\u0448\u043e\u0457 \u0434\u0438\u0442\u0438\u043d\u0438.",
    ru: "\u041f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430 \u043f\u0440\u0435\u043c\u0438\u0443\u043c-\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u043d\u0430 \u0437\u0430\u043a\u0430\u0437 \u0434\u043b\u044f \u0440\u0430\u0441\u043a\u0440\u044b\u0442\u0438\u044f \u0433\u0435\u043d\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438 \u0432\u0430\u0448\u0435\u0433\u043e \u0440\u0435\u0431\u0451\u043d\u043a\u0430.",
    el: "\u03a0\u03bb\u03b1\u03c4\u03c6\u03cc\u03c1\u03bc\u03b1 \u03b5\u03ba\u03c0\u03b1\u03af\u03b4\u03b5\u03c5\u03c3\u03b7\u03c2 premium \u03b3\u03b9\u03b1 \u03c4\u03b7\u03bd \u03b1\u03c0\u03bf\u03ba\u03ac\u03bb\u03c5\u03c8\u03b7 \u03c4\u03b7\u03c2 \u03b9\u03b4\u03b9\u03bf\u03c6\u03c5\u0390\u03b1\u03c2 \u03c4\u03bf\u03c5 \u03c0\u03b1\u03b9\u03b4\u03b9\u03bf\u03cd \u03c3\u03b1\u03c2.",
    hu: "Pr\u00e9mium egy\u00e9ni oktat\u00e1si platform gyermeke zsenialit\u00e1s\u00e1nak felt\u00e1r\u00e1s\u00e1hoz.",
  };

  // Extract language from compound locale (e.g. "DZ-ar" → "ar", "LB-fr" → "fr", "FI-sv" → "sv")
  // Simple locales like "ar" or "fr" are used as-is.
  let lang = locale ?? "en";
  if (lang.includes("-")) {
    const parts = lang.split("-");
    // Country code is 2-char uppercase prefix
    if (parts[0].length === 2 && parts[0] === parts[0].toUpperCase()) {
      lang = parts[1];
    }
  }

  return {
    title: titles[lang] ?? titles.en,
    description: descriptions[lang] ?? descriptions.en,
    icons: {
      icon: "/assets/img/logo.png",
      shortcut: "/assets/img/logo.png",
      apple: "/assets/img/logo.png",
    },
  };
}

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
  const session = await auth();
  // Extract country from locale (e.g. "QA-ar" → "QA")
  const initialCountry = locale.includes("-") ? locale.split("-")[0] : locale;

  return (
    <html
      lang={locale}
      dir={(locale === "ar" || locale.endsWith("-ar")) ? "rtl" : "ltr"}
      className={`${readexPro.variable} ${cairo.variable} ${ibmPlexSansArabic.variable} ${amiri.variable} ${reemKufi.variable} ${outfit.variable} ${playfair.variable} ${inter.variable} ${caveat.variable} ${greatVibes.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-white">
        <SessionProvider session={session}>
          <NextIntlClientProvider messages={messages}>
            <RegionProvider initialLocale={locale}>
              <MaintenanceGate>
              <AppShell>
                {children}
              </AppShell>
              </MaintenanceGate>
              <ThemeModal />
              <Toaster position="top-right" richColors />
            </RegionProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
