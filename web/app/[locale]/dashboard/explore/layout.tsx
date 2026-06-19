import React from "react";
import ExploreBanner from "@/components/explore/ExploreBanner";

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <ExploreBanner />
        {children}
      </div>
    </div>
  );
}
