"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  isRTL?: boolean;
  heroImage?: string;
  sideTitle?: string;
  sideSubtitle?: string;
  wide?: boolean;
};

export default function AuthShell({ children, isRTL, heroImage, sideTitle, sideSubtitle, wide }: Props) {
  return (
    <div
      className="min-h-[calc(100dvh-64px)] bg-gradient-to-b from-white via-slate-50/80 to-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-6xl flex-col items-center justify-center gap-10 px-6 py-12 lg:flex-row lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 24 : -24 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn("hidden w-full max-w-md flex-col lg:flex", isRTL ? "items-end text-right" : "items-start text-left")}
        >
          <Link href="/" className="mb-8 flex items-center gap-3">
            <Image src="/assets/img/logo.png" alt="FreeGeny" width={40} height={40} />
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Free<span className="text-orange-600">Geny</span>
            </span>
          </Link>
          {sideTitle && (
            <h1 className={cn("text-4xl font-black leading-tight text-slate-900", isRTL && "font-ui-ar text-5xl")}>
              {sideTitle}
            </h1>
          )}
          {sideSubtitle && (
            <p className={cn("mt-4 text-lg text-slate-500 leading-relaxed", isRTL && "font-lateef text-2xl")}>
              {sideSubtitle}
            </p>
          )}
          {heroImage && (
            <div className="relative mt-10 w-full">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-slate-200/40 to-slate-100/30 blur-2xl" />
              <Image
                src={heroImage}
                alt="FreeGeny"
                width={480}
                height={480}
                className="relative z-10 w-full rounded-[2rem] border border-white/80 object-cover shadow-2xl shadow-orange-500/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/img/hero_elite.png";
                }}
              />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn("w-full", wide ? "max-w-lg" : "max-w-md")}
        >
          <CardWrap>{children}</CardWrap>
        </motion.div>
      </div>
    </div>
  );
}

function CardWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-10">
      {children}
    </div>
  );
}
