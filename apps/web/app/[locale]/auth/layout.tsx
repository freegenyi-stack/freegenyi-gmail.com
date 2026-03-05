import { ReactNode } from 'react';
import { Logo } from '@/components/icons/Logo';
import { LanguageSelector } from '@/components/layout/LanguageSelector';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] relative font-sans">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] 
                      bg-[radial-gradient(circle,rgba(0,194,203,0.05)_0%,transparent_70%)]" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] 
                      bg-[radial-gradient(circle,rgba(255,107,157,0.05)_0%,transparent_70%)]" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 w-full px-5 py-4 md:px-10 flex justify-between items-center z-50">
                <Logo className="hover:opacity-80 transition-opacity" textColor="white" />
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-black/5 shadow-sm">
                    <LanguageSelector />
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 w-full min-h-screen flex flex-col">
                {children}
            </main>
        </div>
    );
}
