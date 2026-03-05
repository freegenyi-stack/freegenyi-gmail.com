'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthCardProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative bg-white border border-black/5 rounded-2xl sm:rounded-3xl lg:rounded-[40px] p-4 sm:p-6 md:p-8 lg:p-8 w-full max-w-sm sm:max-w-md lg:max-w-md 
                 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_15px_rgba(0,194,203,0.1)] 
                 backdrop-blur-sm"
        >
            {/* Logo decorative element */}
            <div className="absolute -top-3 sm:-top-5 left-1/2 transform -translate-x-1/2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-[18px] flex items-center justify-center 
                       shadow-[0_10px_30px_rgba(0,0,0,0.06)] border-2 border-primary">
                    <span className="font-heading text-xl sm:text-2xl text-primary font-extrabold filter drop-shadow-[0_5px_10px_rgba(0,194,203,0.15)]">
                        FG
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="mt-4 sm:mt-6 text-center">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold mb-1 text-foreground line-clamp-2 leading-tight">
                    {title}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base font-medium mb-2 sm:mb-4">
                    {subtitle}
                </p>
                {children}
            </div>
        </motion.div>
    );
}
