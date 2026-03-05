'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const LANGUAGE_NAMES: Record<string, { name: string, flag: string }> = {
    // Principales langues mondiales
    'en': { name: 'English', flag: '🇺🇸' },
    'fr': { name: 'Français', flag: '🇫🇷' },
    'es': { name: 'Español', flag: '🇪🇸' },
    'zh': { name: '中文', flag: '🇨🇳' },
    'ar': { name: 'العربية', flag: '🇸🇦' },
    'ru': { name: 'Русский', flag: '🇷🇺' },
    'pt': { name: 'Português', flag: '🇵🇹' },
    'de': { name: 'Deutsch', flag: '🇩🇪' },
    'hi': { name: 'हिन्दी', flag: '🇮🇳' },
    'bn': { name: 'বাংলা', flag: '🇧🇩' },
    'ja': { name: '日本語', flag: '🇯🇵' },
    'ko': { name: '한국어', flag: '🇰🇷' },

    // Europe & Moyen-Orient
    'tr': { name: 'Türkçe', flag: '🇹🇷' },
    'it': { name: 'Italiano', flag: '🇮🇹' },
    'nl': { name: 'Nederlands', flag: '🇳🇱' },
    'pl': { name: 'Polski', flag: '🇵🇱' },
    'vi': { name: 'Tiếng Việt', flag: '🇻🇳' },
    'id': { name: 'Indonesia', flag: '🇮🇩' },
    'th': { name: 'ไทย', flag: '🇹🇭' },
    'sw': { name: 'Kiswahili', flag: '🇹🇿' },
    'uk': { name: 'Українська', flag: '🇺🇦' },
    'ur': { name: 'اردو', flag: '🇵🇰' },
    'fa': { name: 'فارسی', flag: '🇮🇷' },
    'ro': { name: 'Română', flag: '🇷🇴' },
    'hu': { name: 'Magyar', flag: '🇭🇺' },
    'cs': { name: 'Čeština', flag: '🇨🇿' },
    'el': { name: 'Ελληνικά', flag: '🇬🇷' },

    // Nordiques & Autres
    'sv': { name: 'Svenska', flag: '🇸🇪' },
    'da': { name: 'Dansk', flag: '🇩🇰' },
    'no': { name: 'Norsk', flag: '🇳🇴' },
    'fi': { name: 'Suomi', flag: '🇫🇮' },
    'ca': { name: 'Català', flag: '🇪🇸' },
    'ga': { name: 'Gaeilge', flag: '🇮🇪' },
    'sq': { name: 'Shqip', flag: '🇦🇱' },
    'hr': { name: 'Hrvatski', flag: '🇭🇷' },
    'sr': { name: 'Српски', flag: '🇷🇸' },
    'sl': { name: 'Slovenščina', flag: '🇸🇮' },
    'bg': { name: 'Български', flag: '🇧🇬' },
    'be': { name: 'Беларуская', flag: '🇧🇾' },
    'mk': { name: 'Македонски', flag: '🇲🇰' },
    'lt': { name: 'Lietuvių', flag: '🇱🇹' },
    'lv': { name: 'Latviešu', flag: '🇱Ｖ' },
    'et': { name: 'Eesti', flag: '🇪🇪' },
    'is': { name: 'Íslenska', flag: '🇮🇸' },
    'mt': { name: 'Malti', flag: '🇲Ｔ' },
    'cy': { name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },

    // Langues Régionales & Spécifiques
    'pcm': { name: 'Nigerian Pidgin', flag: '🇳🇬' },
    'ha': { name: 'Hausa', flag: '🇳🇬' },
    'tl': { name: 'Tagalog', flag: '🇵🇭' },
    'jv': { name: 'Javanese', flag: '🇮🇩' },
    'eu': { name: 'Euskara', flag: '🇪🇸' },
    'gl': { name: 'Galego', flag: '🇪🇸' },
    'pnb': { name: 'پنجابی', flag: '🇵🇰' }
};

export default function Navbar() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState('');
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);

            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / (docHeight || 1)) * 100;
            setScrollProgress(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll Spy logic
    useEffect(() => {
        const sections = ['app', 'parents', 'schools', 'org', 'mission', 'about', 'contact'];
        const observers = sections.map(id => {
            const element = document.getElementById(id);
            if (!element) return null;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(id);
                        }
                    });
                },
                { threshold: 0.5, rootMargin: '-80px 0px -50% 0px' }
            );

            observer.observe(element);
            return observer;
        });

        return () => {
            observers.forEach(observer => observer?.disconnect());
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleLang = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLangOpen(!isLangOpen);
    };

    const handleLocaleChange = (newLocale: string) => {
        console.log(`Changing locale from ${locale} to ${newLocale}`);
        localStorage.setItem('fg_lang', newLocale);
        // Robust pathname replacement
        const segments = pathname.split('/');
        // If pathname is /en/login, segments are ["", "en", "login"]
        // We want to replace segments[1] if it's the locale
        if (segments[1] === locale) {
            segments[1] = newLocale;
        } else {
            // Probably at root or something else, insert new locale
            segments.splice(1, 0, newLocale);
        }
        const newPathname = segments.join('/') || '/';
        router.push(newPathname);
        setIsLangOpen(false);
    };

    // Close lang dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLang = LANGUAGE_NAMES[locale] || { name: locale.toUpperCase(), flag: '🌍' };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[1000] h-[80px] flex items-center bg-white/70 backdrop-blur-[40px] saturate-[200%] border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300 ${scrolled ? 'py-4' : 'py-5'}`}>
            {/* Reading Progress Bar */}
            <div
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#9D4EDD] to-[#FFD60A] transition-all duration-300 ease-out z-[1001]"
                style={{ width: `${scrollProgress}%` }}
            ></div>

            {/* Subtile Glow Border */}
            <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9D4EDD]/20 to-transparent"></div>

            <div className="w-full px-10 flex justify-between items-center box-border">
                {/* Logo */}
                <a href={`/${locale}`} className="font-heading font-black text-xl md:text-2xl bg-gradient-to-r from-[#9D4EDD] via-[#FFD60A] to-[#9D4EDD] bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer decoration-0 relative group transition-all duration-300 hover:scale-105">
                    <span className="relative z-10">FreeGeny</span>
                    {/* Glow Effect */}
                    <span className="absolute inset-0 bg-gradient-to-br from-[#9D4EDD]/5 to-[#FFD60A]/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                    {/* Pulse Animation */}
                    <span className="absolute inset-0 bg-gradient-to-br from-[#9D4EDD]/30 to-[#FFD60A]/30 blur-lg animate-pulse opacity-50 -z-20"></span>
                </a>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-[12px] min-w-0">
                    {[
                        { href: "#app", key: "nav_app" },
                        { href: "#parents", key: "nav_parents" },
                        { href: "#schools", key: "nav_schools" },
                        { href: "#org", key: "nav_org" },
                        { href: "#mission", key: "nav_mission" },
                        { href: "#about", key: "nav_about" },
                        { href: "#contact", key: "nav_contact" }
                    ].map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setActiveSection(item.href.slice(1))}
                            className={`font-nunito font-extrabold transition-all text-[13px] whitespace-nowrap px-3 py-1 relative group overflow-visible ${activeSection === item.href.slice(1) ? 'text-[#9D4EDD]' : 'text-dark hover:text-[#9D4EDD]'}`}
                        >
                            <span className="relative z-10">{t(item.key)}</span>
                            {/* Underline (Active or Hover) */}
                            <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#9D4EDD] to-[#FFD60A] rounded-full transition-transform duration-300 origin-center ${activeSection === item.href.slice(1) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            {/* Subtle background on hover */}
                            <span className="absolute inset-0 bg-black/5 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                        </a>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-3">
                        <a href={`/${locale}/auth/signin?mode=signup`} className="px-5 py-2.5 rounded-xl font-heading font-bold text-dark hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 text-sm whitespace-nowrap">{t('btn_signup')}</a>
                        <a href={`/${locale}/auth/signin`} className="px-5 py-2.5 rounded-xl font-heading font-bold bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 shadow-lg shadow-primary/30 transition-all text-sm whitespace-nowrap">{t('btn_login')}</a>
                    </div>

                    {/* Language Selector */}
                    <div
                        ref={langRef}
                        className={`relative bg-[#F1F5F9] px-[16px] py-[8px] rounded-full text-dark cursor-pointer font-extrabold text-[14px] border border-transparent flex items-center justify-center gap-2 transition-all hover:bg-white hover:border-primary-light hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)] flex-shrink-0 whitespace-nowrap min-w-[110px] ${isLangOpen ? 'bg-white border-primary-light shadow-[0_5px_15px_rgba(0,0,0,0.05)] open' : ''}`}
                        onClick={toggleLang}
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-[16px]">{currentLang.flag}</span>
                            <span className="uppercase tracking-wider">{locale}</span>
                        </span>

                        <svg
                            className={`w-3 h-3 text-dark-light transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>

                        {/* Dropdown */}
                        <div className={`${isLangOpen ? 'grid' : 'hidden'} absolute top-full end-0 mt-[10px] bg-[#F1F5F9] backdrop-blur-[20px] rounded-[20px] p-[15px] w-[500px] min-w-[300px] max-w-[calc(100vw-40px)] max-h-[450px] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.1)] grid-cols-1 sm:grid-cols-2 gap-2 border border-black/5 z-[10000]`}>
                            {Object.entries(LANGUAGE_NAMES).map(([code, info]) => {
                                return (
                                    <div
                                        key={code}
                                        className={`px-[14px] py-[10px] rounded-[12px] hover:bg-white hover:text-primary transition-all cursor-pointer font-bold flex justify-between items-center text-[0.85rem] ${locale === code ? 'bg-primary text-white' : 'text-dark-light'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLocaleChange(code);
                                        }}
                                    >
                                        <span>{info.flag} {info.name}</span>
                                        {locale === code && <span className="text-[0.8rem] font-black">✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden flex flex-col gap-1.5 cursor-pointer ml-2" onClick={toggleMenu}>
                        <span className={`w-6 h-0.5 bg-dark rounded-full transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-dark rounded-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-dark rounded-full transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl animate-fade-in-down">
                    <a href="#app" className="text-lg font-heading font-bold text-dark" onClick={() => setIsMenuOpen(false)}>{t('nav_app')}</a>
                    <a href="#parents" className="text-lg font-heading font-bold text-dark" onClick={() => setIsMenuOpen(false)}>{t('nav_parents')}</a>
                    <a href="#schools" className="text-lg font-heading font-bold text-dark" onClick={() => setIsMenuOpen(false)}>{t('nav_schools')}</a>
                    <a href="#org" className="text-lg font-heading font-bold text-dark" onClick={() => setIsMenuOpen(false)}>{t('nav_org')}</a>
                    <a href="#mission" className="text-lg font-heading font-bold text-dark" onClick={() => setIsMenuOpen(false)}>{t('nav_mission')}</a>
                    <a href="#about" className="text-lg font-heading font-bold text-dark" onClick={() => setIsMenuOpen(false)}>{t('nav_about')}</a>
                    <a href="#contact" className="text-lg font-heading font-bold text-dark" onClick={() => setIsMenuOpen(false)}>{t('nav_contact')}</a>
                    <hr className="border-gray-100" />
                    <a href={`/${locale}/auth/signin?mode=signup`} className="text-lg font-heading font-bold text-dark" onClick={() => setIsMenuOpen(false)}>{t('btn_signup')}</a>
                    <a href={`/${locale}/auth/signin`} className="text-center py-3 rounded-xl font-heading font-bold bg-primary text-white" onClick={() => setIsMenuOpen(false)}>{t('btn_login')}</a>
                </div>
            )}
        </nav>
    );
}
