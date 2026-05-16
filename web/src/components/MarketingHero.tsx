import React from "react";
import { motion } from "framer-motion";

interface MarketingHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  gradient?: string;
}

export default function MarketingHero({ title, subtitle, badge, gradient = "from-orange-50 to-orange-100/50" }: MarketingHeroProps) {
  return (
    <div className={`relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b ${gradient}`}>
      <div className="absolute inset-0 bg-[url('/assets/img/grid-pattern.svg')] opacity-5"></div>
      
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/20 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {badge && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 border border-slate-200/50 text-[10px] font-black text-orange-600 uppercase tracking-widest mb-8 backdrop-blur-sm shadow-sm">
            {badge}
          </div>
        )}
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight font-jakarta mb-6 leading-tight max-w-4xl mx-auto">
          {title}
        </h1>
        <p className="text-lg md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
