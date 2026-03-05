'use client';
import { useTranslations, useLocale } from 'next-intl';

export default function Hero() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <section className="relative pt-48 pb-32 px-6 overflow-hidden bg-gradient-to-br from-[#EFF6FF] to-[#FEFCE8]">
            {/* Background Decorations */}
            <div className="absolute -top-1/2 -right-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-20 -left-20 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="inline-block py-2 px-4 rounded-full bg-white border border-gray-200 shadow-sm mb-8 animate-fade-in-up">
                    <span className="text-accent-yellow font-black tracking-widest text-xs uppercase">
                        {t('nav_tagline')}
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-['Titan_One'] text-dark mb-8 leading-[1.1] animate-fade-in-up animation-delay-200">
                    {t('hero_title_1')} <br />
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {t('hero_title_2')}
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-dark-light font-bold max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-400">
                    {t('hero_subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up animation-delay-600">
                    <a href={`/${locale}/auth/signin?mode=signup`} className="px-10 py-5 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all w-full sm:w-auto">
                        {t('btn_start_adventure')}
                    </a>
                    <a href="#how-it-works" className="px-10 py-5 rounded-2xl bg-white border-2 border-gray-100 text-dark font-black text-lg hover:bg-gray-50 hover:border-gray-200 transition-all w-full sm:w-auto">
                        {t('btn_learn_more')}
                    </a>
                </div>

                {/* Stats */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-800">
                    {[
                        { number: '38', label: t('stat_countries') },
                        { number: '50+', label: t('stat_psych') },
                        { number: '1M+', label: t('stat_puzzles') },
                        { number: '100%', label: t('stat_ads') }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/50 transition-all">
                            <span className="text-4xl font-['Titan_One'] text-dark mb-1">{stat.number}</span>
                            <span className="text-sm font-bold text-dark-light uppercase tracking-wide opacity-80">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
