import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

const DEFAULT_COUNTRY_FOR_LOCALE: Record<string, string> = {
  ar: "DZ",
  fr: "FR",
  en: "AU",
  pt: "AO",
  es: "ES",
  de: "DE",
  it: "IT",
  nl: "NL",
  da: "DK",
  sv: "SE",
  no: "NO",
  fi: "FI",
};

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  // 1. Intercepter la racine "/"
  if (pathname === "/") {
    const ipCountry = req.headers.get("x-vercel-ip-country") || req.headers.get("cloudfront-viewer-country");
    const cookieCountry = req.cookies.get("NEXT_COUNTRY")?.value;
    const country = cookieCountry || ipCountry || "DZ";
    
    let locale = "fr";
    if (country === "DZ" || country === "MA" || country === "TN") locale = "ar";
    else if (country === "AU" || country === "US" || country === "GB") locale = "en";
    else if (country === "AO" || country === "PT") locale = "pt";
    else if (country === "SE") locale = "sv";
    else if (country === "NO") locale = "no";
    else if (country === "FI") locale = "fi";
    
    return NextResponse.redirect(new URL(`/${country}-${locale}/`, req.url));
  }

  // 2. Détecter le format professionnel "[Country]-[Language]" (ex: /DZ-ar/auth/register)
  const pattern = /^\/([A-Z]{2})-([a-z]{2})(\/.*)?$/;
  const match = pathname.match(pattern);

  if (match) {
    const country = match[1];
    const response = intlMiddleware(req);
    response.cookies.set("NEXT_COUNTRY", country, { path: "/" });
    return response;
  }

  // 3. Si l'URL a un format de langue simple (ex: /ar/auth/register), rediriger vers le format professionnel
  const localePattern = /^\/([a-z]{2})(\/.*)?$/;
  const localeMatch = pathname.match(localePattern);

  if (localeMatch) {
    const locale = localeMatch[1];
    const rest = localeMatch[2] || "";
    
    // Si la locale est valide pour next-intl
    if (routing.locales.includes(locale as any)) {
      const ipCountry = req.headers.get("x-vercel-ip-country") || req.headers.get("cloudfront-viewer-country");
      const cookieCountry = req.cookies.get("NEXT_COUNTRY")?.value;
      const country = cookieCountry || ipCountry || DEFAULT_COUNTRY_FOR_LOCALE[locale] || "DZ";

      return NextResponse.redirect(new URL(`/${country}-${locale}${rest}${req.nextUrl.search}`, req.url));
    }
  }

  // 4. Pour les requêtes de tableau de bord, s'assurer que l'utilisateur est authentifié
  const isDashboard = pathname.includes("/dashboard");
  if (isDashboard && !req.auth) {
    const pathParts = pathname.split("/");
    const locale = routing.locales.includes(pathParts[1] as any) ? pathParts[1] : "fr";
    const cookieCountry = req.cookies.get("NEXT_COUNTRY")?.value || DEFAULT_COUNTRY_FOR_LOCALE[locale] || "DZ";
    return NextResponse.redirect(new URL(`/${cookieCountry}-${locale}/auth/login`, req.url));
  }

  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|fr|en|nl|de|it|es|pt|tr|ru|be|uk|pl|ro|el|hu|cs|da|no|sv|fi|ga|af|zu|xh|zh|ms|ta|ja|ko|hi|mi|th|vi|id|ku)/:path*", "/((?!api|_next|_static|_vercel|assets|[\\w-]+\\.\\w+).*)"],
};
