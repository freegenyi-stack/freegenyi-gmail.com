'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
}

export default function LoadingOverlay({ isVisible, message = 'Securely connecting...' }: LoadingOverlayProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-white/90 backdrop-blur-[10px] z-[20000] 
                     flex flex-col items-center justify-center"
                >
                    {/* Spinner */}
                    <div className="w-12 h-12 border-[5px] border-[#E0F7FA] border-t-[#00C2CB] 
                         rounded-full animate-spin mb-5" />

                    {/* Message */}
                    <div className="font-bold text-[#00C2CB] text-lg">
                        {message}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
