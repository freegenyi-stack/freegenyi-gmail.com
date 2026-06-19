"use client";

import GluestackProvider from "@/components/gluestack/GluestackProvider";
import LandingPageContent from "./LandingPageContent";

export default function LandingPage() {
  return (
    <GluestackProvider>
      <LandingPageContent />
    </GluestackProvider>
  );
}
