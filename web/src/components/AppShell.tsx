"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";
import ImpersonationBanner from "@/components/admin/ImpersonationBanner";
import { LUXURY } from "@/constants/design";

const READER_PAGE = /\/bibliotheque\/\d+\/?$/;

/** Enveloppe globale : barre FreeGeny fixe + zone de contenu sous le header. */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isReaderPage = READER_PAGE.test(pathname);
  const { data: session } = useSession();
  const impersonating = Boolean((session?.user as { impersonating?: boolean } | undefined)?.impersonating);

  return (
    <>
      <div className="fg-app-backdrop" aria-hidden />
      {!isReaderPage && <Header />}
      <PushNotificationPrompt />
      {impersonating && <ImpersonationBanner />}
      <div
        id="app-content"
        className="relative z-10 flex min-h-[100dvh] w-full flex-col"
        style={
          isReaderPage
            ? undefined
            : {
                paddingTop: `calc(${LUXURY.headerHeight}px + env(safe-area-inset-top, 0px))`,
                ["--header-height" as string]: `calc(${LUXURY.headerHeight}px + env(safe-area-inset-top, 0px))`,
              }
        }
      >
        {children}
      </div>
    </>
  );
}
