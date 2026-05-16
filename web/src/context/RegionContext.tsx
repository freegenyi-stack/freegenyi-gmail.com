"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface RegionContextType {
  selectedCountry: string;
  selectedLang: string;
  setRegion: (country: string, lang: string) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState("DZ");
  const [selectedLang, setSelectedLang] = useState("fr");

  // Load from localStorage if available
  useEffect(() => {
    const savedCountry = localStorage.getItem("freegeny_country");
    const savedLang = localStorage.getItem("freegeny_lang");
    if (savedCountry) setSelectedCountry(savedCountry);
    if (savedLang) setSelectedLang(savedLang);
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
