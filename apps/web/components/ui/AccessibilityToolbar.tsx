'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';

export default function AccessibilityToolbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [highContrast, setHighContrast] = useState(false);
    const locale = useLocale();

    useEffect(() => {
        const savedFontSize = localStorage.getItem('accessibility_fontSize');
        const savedContrast = localStorage.getItem('accessibility_highContrast');
        if (savedFontSize) {
            setFontSize(Number(savedFontSize));
            document.documentElement.style.fontSize = `${savedFontSize}%`;
        }
        if (savedContrast === 'true') {
            setHighContrast(true);
            document.documentElement.classList.add('high-contrast');
        }
    }, []);

    const handleFontSizeChange = (size: number) => {
        setFontSize(size);
        document.documentElement.style.fontSize = `${size}%`;
        localStorage.setItem('accessibility_fontSize', size.toString());
    };

    const toggleHighContrast = () => {
        const newValue = !highContrast;
        setHighContrast(newValue);
        if (newValue) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
        localStorage.setItem('accessibility_highContrast', newValue.toString());
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl flex items-center justify-center text-white"
                aria-label="Accessibility settings"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-6"
                        >
                            <div className="max-w-4xl mx-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Accessibility</h2>
                                    <button onClick={() => setIsOpen(false)}>Close</button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-semibold mb-4">Text Size ({fontSize}%)</h3>
                                        <input
                                            type="range"
                                            min="50"
                                            max="200"
                                            value={fontSize}
                                            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-4">Contrast</h3>
                                        <button
                                            onClick={toggleHighContrast}
                                            className={`px-6 py-3 rounded-full font-semibold transition-all ${highContrast ? 'bg-gray-900 text-white' : 'bg-gray-100'
                                                }`}
                                        >
                                            {highContrast ? 'High Contrast: ON' : 'High Contrast: OFF'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
