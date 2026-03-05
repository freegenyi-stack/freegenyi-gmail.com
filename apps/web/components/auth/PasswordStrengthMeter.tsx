'use client';

import { motion } from 'framer-motion';
import { calculatePasswordStrength } from '@/lib/validations/auth-schema';

interface PasswordStrengthMeterProps {
    password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    if (!password) return null;

    const { score, label, color } = calculatePasswordStrength(password);
    const percentage = (score / 6) * 100;

    return (
        <div className="mt-2 space-y-1">
            {/* Progress bar */}
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>

            {/* Label */}
            <p className="text-xs font-bold" style={{ color }}>
                Password strength: {label}
            </p>
        </div>
    );
}
