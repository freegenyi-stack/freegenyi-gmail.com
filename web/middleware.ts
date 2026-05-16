import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const isDashboard = req.nextUrl.pathname.includes("/dashboard");
  
  // Extraire la locale courante de l'URL, ou utiliser "fr" par défaut
  const pathParts = req.nextUrl.pathname.split("/");
  const locale = routing.locales.includes(pathParts[1] as any) ? pathParts[1] : "fr";

  if (isDashboard) {
    // 1. Rediriger vers la page de connexion si non authentifié
    if (!req.auth) {
      return Response.redirect(new URL(`/${locale}/auth/login`, req.url));
    }
    // Les vérifications d'onboarding se feront directement dans les Server Components
    // pour garantir une synchronisation parfaite avec la base de données.
  }

  // Permettre au middleware d'internationalisation de prendre le relais
  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|fr|en|nl|de|it|es|pt|tr|ru|be|uk|pl|ro|el|hu|cs|da|no|sv|fi|ga|af|zu|xh|zh|ms|ta|ja|ko|hi|mi|th|vi|id|ku)/:path*", "/((?!api|_next|_static|_vercel|assets|[\\w-]+\\.\\w+).*)"],
};
