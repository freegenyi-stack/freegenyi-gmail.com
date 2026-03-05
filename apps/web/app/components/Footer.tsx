import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations();

    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div>
                        <span className="font-['Titan_One'] text-2xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">FreeGeny</span>
                        <p className="mt-4 text-dark-light font-bold leading-relaxed opacity-80">
                            {t('mission_desc')}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-dark font-black mb-6">{t('ft_product')}</h3>
                        <ul className="space-y-4">
                            <li><a href="#app" className="text-dark-light font-bold hover:text-primary transition-colors">{t('nav_app')}</a></li>
                            <li><a href="#parents" className="text-dark-light font-bold hover:text-primary transition-colors">{t('nav_parents')}</a></li>
                            <li><a href="#schools" className="text-dark-light font-bold hover:text-primary transition-colors">{t('nav_schools')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-dark font-black mb-6">{t('nav_about')}</h3>
                        <ul className="space-y-4">
                            <li><a href="#mission" className="text-dark-light font-bold hover:text-primary transition-colors">{t('nav_mission')}</a></li>
                            <li><a href="#philosophy" className="text-dark-light font-bold hover:text-primary transition-colors">{t('nav_method')}</a></li>
                            <li><a href="#contact" className="text-dark-light font-bold hover:text-primary transition-colors">{t('nav_contact')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-dark font-black mb-6">{t('ft_legal')}</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-dark-light font-bold hover:text-primary transition-colors">{t('ft_privacy')}</a></li>
                            <li><a href="#" className="text-dark-light font-bold hover:text-primary transition-colors">{t('ft_terms')}</a></li>
                            <li><a href="#" className="text-dark-light font-bold hover:text-primary transition-colors">{t('ft_cookies')}</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-10 text-center">
                    <p className="text-dark-light font-bold opacity-60 text-sm">{t('ft_rights')}</p>
                </div>
            </div>
        </footer>
    );
}
