'use client';

import { motion } from 'framer-motion';

interface SocialButton {
    name: 'google' | 'apple' | 'microsoft' | 'facebook' | 'linkedin';
    icon: JSX.Element;
    hoverColor: string;
}

interface SocialButtonsProps {
    onSocialLogin: (provider: 'google' | 'apple' | 'microsoft' | 'facebook' | 'linkedin') => void;
    loading: boolean;
}

const socialButtons: SocialButton[] = [
    {
        name: 'google',
        hoverColor: 'hover:border-[#4285F4] hover:bg-[#f8fbff]',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
        ),
    },
    {
        name: 'apple',
        hoverColor: 'hover:border-black hover:bg-[#fafafa]',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
        ),
    },
    {
        name: 'microsoft',
        hoverColor: 'hover:border-[#00a4ef] hover:bg-[#f5fcff]',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6">
                <rect x="1" y="1" width="10.5" height="10.5" fill="#f25022" />
                <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7fba00" />
                <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00a4ef" />
                <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#ffb900" />
            </svg>
        ),
    },
    {
        name: 'facebook',
        hoverColor: 'hover:border-[#1877F2] hover:bg-[#f5f9ff]',
        icon: (
            <svg viewBox="0 0 24 24" fill="#1877F2" className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        name: 'linkedin',
        hoverColor: 'hover:border-[#0077B5] hover:bg-[#f5faff]',
        icon: (
            <svg viewBox="0 0 24 24" fill="#0077B5" className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
            </svg>
        ),
    },
];

export default function SocialButtons({ onSocialLogin, loading }: SocialButtonsProps) {
    return (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5 md:gap-3">
            {socialButtons.map((button) => (
                <motion.button
                    key={button.name}
                    type="button"
                    onClick={() => onSocialLogin(button.name)}
                    disabled={loading}
                    whileHover={{ y: -4 }}
                    whileTap={{ y: 0 }}
                    className={`
            bg-white border-[1.5px] border-[#F1F5F9] p-2 sm:p-3 md:p-3.5 rounded-lg sm:rounded-2xl md:rounded-[20px]
            flex items-center justify-center cursor-pointer
            transition-all duration-300 ease-out
            shadow-[0_4px_12px_rgba(0,0,0,0.03)]
            hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${button.hoverColor}
          `}
                    title={button.name.charAt(0).toUpperCase() + button.name.slice(1)}
                >
                    {button.icon}
                </motion.button>
            ))}
        </div>
    );
}
