import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_DRAFT,
  type OnboardingDraft,
  type OnboardingStepId,
} from "@/types/onboarding";

type Ctx = {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  reset: () => void;
  loaded: boolean;
};

const OnboardingContext = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(DEFAULT_DRAFT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      const { storage } = await import("@/lib/storage");
      const raw = await storage.getOnboardingDraft();
      if (raw) {
        try {
          setDraft({ ...DEFAULT_DRAFT, ...JSON.parse(raw) });
        } catch {
          /* ignore */
        }
      }
      setLoaded(true);
    })();
  }, []);

  const persist = useCallback(async (next: OnboardingDraft) => {
    const { storage } = await import("@/lib/storage");
    await storage.setOnboardingDraft(JSON.stringify(next));
  }, []);

  const update = useCallback(
    (patch: Partial<OnboardingDraft>) => {
      setDraft((prev) => {
        const next = { ...prev, ...patch };
        void persist(next);
        return next;
      });
    },
    [persist]
  );

  const reset = useCallback(() => {
    setDraft(DEFAULT_DRAFT);
    void import("@/lib/storage").then(({ storage }) => storage.setOnboardingDraft(""));
  }, []);

  const value = useMemo(() => ({ draft, update, reset, loaded }), [draft, update, reset, loaded]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding outside provider");
  return ctx;
}

export type { OnboardingStepId };
