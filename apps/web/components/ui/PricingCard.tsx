'use client';

import { motion } from 'framer-motion';

interface PricingCardProps {
    name: string;
    price: string;
    period: string;
    features: string[];
    ctaText: string;
    popular?: boolean;
    color?: 'blue' | 'purple' | 'green';
    onSelect?: () => void;
}

export default function PricingCard({
    name,
    price,
    period,
    features,
    ctaText,
    popular,
    color = 'blue',
    onSelect,
}: PricingCardProps) {
    const colorClasses = {
        blue: 'border-blue-100 bg-blue-50/10',
        purple: 'border-purple-100 bg-purple-50/10',
        green: 'border-green-100 bg-green-50/10',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`card p-8 flex flex-col h-full relative overflow-hidden ${popular ? 'ring-2 ring-blue-500 shadow-xl' : ''} ${colorClasses[color]}`}
        >
            {popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-xl text-sm font-bold">
                    Popular
                </div>
            )}
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{price}</span>
                    <span className="text-gray-500">/{period}</span>
                </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>
            <button
                onClick={onSelect}
                className={`w-full py-3 px-6 rounded-2xl font-bold transition-all ${popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border-2 border-gray-100 hover:border-blue-200'
                    }`}
            >
                {ctaText}
            </button>
        </motion.div>
    );
}
