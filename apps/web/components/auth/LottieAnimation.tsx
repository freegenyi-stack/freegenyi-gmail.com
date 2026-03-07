'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import Lottie dynamiquement uniquement côté client
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LottieAnimationProps {
  animationData: object;
  className?: string;
}

export default function LottieAnimation({ animationData, className = '' }: LottieAnimationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`${className} bg-white/10 rounded-full animate-pulse`} />;
  }

  return <Lottie animationData={animationData} loop={true} className={className} />;
}
