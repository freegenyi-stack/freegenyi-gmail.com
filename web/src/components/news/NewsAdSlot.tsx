"use client";

import React from "react";

/** Emplacement pub optionnel — activer avec NEXT_PUBLIC_ADSENSE_CLIENT dans Vercel */
export default function NewsAdSlot({ slot }: { slot?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_NEWS;

  if (!client || !adSlot) return null;

  return (
    <div className="my-8 flex justify-center">
      <ins
        className="adsbygoogle block min-h-[90px] w-full max-w-2xl rounded-xl bg-slate-50"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
