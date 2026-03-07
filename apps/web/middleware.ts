import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, getLocaleFromCountry } from './lib/i18n/config';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
    localeDetection: false, // Désactivé pour éviter les redirections automatiques
});

export default async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // 1. Update Supabase session (refresh token if needed)
    const { supabaseResponse, user } = await updateSession(req);

    // Cookie Debugging
    const cookieNames = req.cookies.getAll().map(c => c.name).join(', ');
    console.log(`🛡️ Middleware: Path=${pathname}, User=${user ? user.email : 'NULL'}, Cookies=[${cookieNames}]`);

    // 2. I18n and Public path checks
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2,3}(\/|$)/, '/') || '/';
    const isPublicPath =
        pathname.startsWith('/api/') ||
        pathname.includes('/site-access') ||
        pathname.includes('/favicon.ico') ||
        pathname.includes('/images/') ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/);

    const dashboardRoutes = ['/parent', '/teacher', '/school', '/ngo', '/ong', '/admin', '/ecole'];
    const isProtectedRoute = dashboardRoutes.some(route => pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/'));

    // Handle Country -> Locale redirect if no locale present
    const country = req.headers.get('x-vercel-ip-country');
    const hasLocale = locales.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

    if (!hasLocale && !isPublicPath) {
        const detectedLocale = getLocaleFromCountry(country);
        if (detectedLocale !== defaultLocale) {
            return NextResponse.redirect(new URL(`/${detectedLocale}${pathname}`, req.url));
        }
    }

    const localeMatch = pathname.match(/^\/([a-z]{2,3})(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : defaultLocale;

    // 3. Auth Check for protected routes
    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL(`/${locale}/auth/signin`, req.url));
    }

    // Prevent authenticated users from seeing the sign-in/up pages again
    const isAuthRoute = pathname.includes('/auth/signin') || pathname.includes('/auth/signup');
    if (isAuthRoute && user) {
        const role = user.user_metadata?.role;
        let dashboardPath = '/parent';
        if (role === 'TEACHER') dashboardPath = '/ecole/dashboard';
        else if (role === 'NGO' || role === 'ORGANIZATION') dashboardPath = '/ngo';

        return NextResponse.redirect(new URL(`/${locale}${dashboardPath}`, req.url));
    }

    // 4. Run i18n middleware
    const response = intlMiddleware(req);

    // 5. Merge Supabase cookies into the FINAL response
    // We must iterate over supabaseResponse.cookies because updateSession might have set/deleted cookies
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        const { name, value, ...options } = cookie;
        response.cookies.set(name, value, {
            ...options,
            domain: process.env.NODE_ENV === 'production' ? '.freegeny.com' : options.domain
        });
    });

    return response;
}

export const config = {
    // Matcher that excludes static files and internal Next.js paths
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)']
};
