"use client";

import { GluestackUIProvider } from "@gluestack-ui/themed";
import { landingGluestackConfig } from "@/lib/gluestack/landingConfig";

export default function GluestackProvider({ children }: { children: React.ReactNode }) {
  return (
    <GluestackUIProvider config={landingGluestackConfig} colorMode="light">
      {children}
    </GluestackUIProvider>
  );
}
