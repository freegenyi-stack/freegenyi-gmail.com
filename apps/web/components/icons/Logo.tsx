import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    variant?: 'full' | 'short';
    textColor?: string;
}

export function Logo({ className, variant = 'full', textColor }: LogoProps) {
    return (
        <Link href="/" className={cn("flex items-center gap-2", className)}>
            <div className="w-10 h-10 bg-white border-2 border-[#00C2CB] rounded-xl flex items-center justify-center text-[#00C2CB] font-bold text-xl shadow-sm">
                FG
            </div>
            {variant === 'full' && (
                <span className={cn(
                    "font-heading font-bold text-2xl tracking-tight",
                    textColor ? `text-${textColor}` : "text-primary"
                )}>
                    FreeGeny
                </span>
            )}
        </Link>
    );
}
