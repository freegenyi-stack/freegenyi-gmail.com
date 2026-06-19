import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { getLocale, setI18nLocale, type Locale } from "@/i18n";
import { applyAppLocale, isRtlLocale } from "@/i18n/locale";
import { storage } from "@/lib/storage";

type LocaleContextValue = {
  locale: Locale;
  isRtl: boolean;
  setLocale: (locale: Locale) => Promise<void>;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? getLocale());

  useEffect(() => {
    void storage.getLocale().then((stored) => {
      if (stored === "fr" || stored === "ar") {
        setI18nLocale(stored);
        setLocaleState(stored);
      }
    });
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      isRtl: isRtlLocale(locale),
      setLocale: async (next) => {
        setLocaleState(next);
        await applyAppLocale(next);
      },
    }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>
      <View style={{ flex: 1, direction: value.isRtl ? "rtl" : "ltr" }}>
        {children}
      </View>
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocaleContext must be used within LocaleProvider");
  return ctx;
}

export function useIsRtl() {
  return useLocaleContext().isRtl;
}
