import Cookies from 'js-cookie';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export function getLocaleCookie(): string | undefined {
    return Cookies.get(LOCALE_COOKIE_NAME);
}

export function setLocaleCookie(locale: string) {
    Cookies.set(LOCALE_COOKIE_NAME, locale, {
        expires: 365,
        path: '/',
        sameSite: 'lax'
    });
}

export function removeLocaleCookie() {
    Cookies.remove(LOCALE_COOKIE_NAME);
}
