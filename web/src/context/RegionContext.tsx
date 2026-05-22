"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface RegionContextType {
  selectedCountry: string;
  selectedLang: string;
  setRegion: (country: string, lang: string) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ 
  children,
  initialLocale
}: { 
  children: React.ReactNode;
  initialLocale?: string;
}) {
  let defaultCountry = "DZ";
  let defaultLang = "fr";

  if (initialLocale && initialLocale.includes("-")) {
    const parts = initialLocale.split("-");
    if (parts[0] && parts[1]) {
      defaultCountry = parts[0];
      defaultLang = parts[1];
    }
  }

  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedLang, setSelectedLang] = useState(defaultLang);

  // Load from localStorage, URL, or cookie if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const firstPart = pathParts[1]; // e.g. "DZ-ar"
      if (firstPart && firstPart.includes("-") && firstPart.length === 5) {
        const [country, lang] = firstPart.split("-");
        if (country === country.toUpperCase() && lang === lang.toLowerCase()) {
          setSelectedCountry(country);
          setSelectedLang(lang);
          localStorage.setItem("freegeny_country", country);
          localStorage.setItem("freegeny_lang", lang);
          return;
        }
      }

      // Try to read from NEXT_COUNTRY cookie (set by middleware)
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const cookieCountry = getCookie("NEXT_COUNTRY");
      if (cookieCountry) {
        setSelectedCountry(cookieCountry);
        localStorage.setItem("freegeny_country", cookieCountry);
      }

      const savedCountry = localStorage.getItem("freegeny_country");
      const savedLang = localStorage.getItem("freegeny_lang");
      if (savedCountry && !cookieCountry) setSelectedCountry(savedCountry);
      if (savedLang) setSelectedLang(savedLang);
    }
  }, []);

  const setRegion = (country: string, lang: string) => {
    setSelectedCountry(country);
    setSelectedLang(lang);
    localStorage.setItem("freegeny_country", country);
    localStorage.setItem("freegeny_lang", lang);
  };

  return (
    <RegionContext.Provider value={{ selectedCountry, selectedLang, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}
