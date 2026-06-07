"use client";

import React from "react";
import Header from "@/components/Header";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";
import { LUXURY } from "@/constants/design";

/** Enveloppe globale : barre FreeGeny fixe + zone de contenu sous le header. */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <PushNotificationPrompt />
      <div
        id="app-content"
        className="min-h-[100dvh] flex flex-col w-full"
        style={{ paddingTop: LUXURY.headerHeight }}
      >
        {children}
      </div>
    </>
  );
}
