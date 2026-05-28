"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, School, MapPin, ChevronDown, X, CheckCircle, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { formatSgDistrictName, formatSgRegionName } from "@/lib/sgGeoLabels";

interface Region {
  id: number;
  code: string;
  nameLocal: string;
  nameFr: string | null;
}

interface District {
  id: number;
  code: string;
  nameLocal: string;
  nameFr: string | null;
}

interface SchoolResult {
  id: number;
  code: string | null;
  nameLocal: string;
  nameFr: string | null;
  type: number;
  districtNameFr: string | null;
  regionNameFr: string | null;
  districtNameLocal: string | null;
  regionNameLocal: string | null;
}

const FR_REGIONS = [
  { name: "Auvergne-Rhône-Alpes", depts: ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"] },
  { name: "Bourgogne-Franche-Comté", depts: ["21", "25", "39", "58", "70", "71", "89", "90"] },
  { name: "Bretagne", depts: ["22", "29", "35", "56"] },
  { name: "Centre-Val de Loire", depts: ["18", "28", "36", "37", "41", "45"] },
  { name: "Corse", depts: ["2A", "2B"] },
  { name: "Grand Est", depts: ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"] },
  { name: "Hauts-de-France", depts: ["02", "59", "60", "62", "80"] },
  { name: "Île-de-France", depts: ["75", "77", "78", "91", "92", "93", "94", "95"] },
  { name: "Normandie", depts: ["14", "27", "50", "61", "76"] },
  { name: "Nouvelle-Aquitaine", depts: ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"] },
  { name: "Occitanie", depts: ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"] },
  { name: "Pays de la Loire", depts: ["44", "49", "53", "72", "85"] },
  { name: "Provence-Alpes-Côte d'Azur", depts: ["04", "05", "06", "13", "83", "84"] },
  { name: "Outre-Mer", depts: ["971", "972", "973", "974", "976"] }
];

interface SchoolPickerProps {
  value?: { id: number; name: string } | null;
  onChange: (school: { id: number; name: string } | null) => void;
  country?: string;
  placeholder?: string;
}

export default function SchoolPicker({
  value,
  onChange,
  country = "DZ",
  placeholder = "Rechercher l'école...",
}: SchoolPickerProps) {
  const locale = useLocale();
  const tSp = useTranslations("SchoolPicker");
  const baseLang = locale.includes("-") ? (locale.split("-").pop() as string) : locale;
  const isAr = baseLang === "ar" || locale.endsWith("-ar");
  const isMaori = baseLang === "mi" || locale.endsWith("-mi");
  const isIrish = baseLang === "ga" || locale.endsWith("-ga");
  const isDanish = country === "DK" || baseLang === "da" || locale.endsWith("-da");
  const isSwedish = country === "SE" || baseLang === "sv" || locale.endsWith("-sv");
  const isNorwegian = country === "NO" || baseLang === "no" || locale.endsWith("-no");
  const isFinnish = country === "FI" || baseLang === "fi" || locale.endsWith("-fi") || locale === "sv-fi" || locale.endsWith("-sv-fi");
  const isDutch = country === "NL" || baseLang === "nl" || locale.endsWith("-nl");
  const isPortuguese = country === "PT" || baseLang === "pt" || locale.endsWith("-pt");
  const isPolish = country === "PL" || baseLang === "pl" || locale.endsWith("-pl");
  const isCzech = country === "CZ" || baseLang === "cs" || locale.endsWith("-cs");
  const isKorean = country === "KR" || baseLang === "ko" || locale.endsWith("-ko");
  const isJapanese = country === "JP" || baseLang === "ja" || locale.endsWith("-ja");
  const isChinese = baseLang === "zh";
  const isMalay = baseLang === "ms";
  const isTamil = baseLang === "ta";
  const isEnglish =
    baseLang === "en" ||
    ["AU", "GB", "US", "NZ", "IE", "SG"].includes(country) ||
    (country === "CA" && (baseLang === "en" || locale.startsWith("CA-en")));
  const isCanada = country === "CA";
  
  const [query, setQuery] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [selectedFrRegion, setSelectedFrRegion] = useState("");
  const [schoolType, setSchoolType] = useState<0 | 1 | 2>(0);
  
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [results, setResults] = useState<SchoolResult[]>([]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [regionOpen, setRegionOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [frRegionOpen, setFrRegionOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  // Reset local state when country changes
  useEffect(() => {
    setRegionCode("");
    setDistrictCode("");
    setSelectedFrRegion("");
    setRegions([]);
    setDistricts([]);
    setResults([]);
  }, [country]);

  // Fetch wilayas
  useEffect(() => {
    fetch(`/api/schools/regions?country=${country}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRegions(data);
      })
      .catch(() => {});
  }, [country]);

  // Fetch communes when wilaya changes
  useEffect(() => {
    setDistrictCode(""); // Reset district
    setDistricts([]);
    if (!regionCode) return;
    
    fetch(`/api/schools/districts?region=${regionCode}&country=${country}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDistricts(data);
      })
      .catch(() => {});
  }, [regionCode, country]);

  // Debounced search
  const doSearch = useCallback(
    (q: string, region: string, district: string, type: 0 | 1 | 2) => {
      clearTimeout(searchTimeout.current);
      if (q.length < 2 && !region && !district) {
        setResults([]);
        return;
      }
      searchTimeout.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const params = new URLSearchParams({ q, country });
          if (region) params.set("region", region);
          if (district) params.set("district", district);
          if (type !== 0) params.set("type", type.toString());
          
          const res = await fetch(`/api/schools/search?${params}`);
          const data = await res.json();
          if (Array.isArray(data)) setResults(data);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    },
    [country]
  );

  useEffect(() => {
    doSearch(query, regionCode, districtCode, schoolType);
  }, [query, regionCode, districtCode, schoolType, doSearch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setRegionOpen(false);
        setDistrictOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedRegion = regions.find((r) => r.code === regionCode);
  const selectedDistrict = districts.find((d) => d.code === districtCode);

  const sgLang = isChinese ? "zh" : isMalay ? "ms" : isTamil ? "ta" : "en";
  const getRegionName = (r: Region) =>
    country === "SG"
      ? formatSgRegionName(r.code, r.nameLocal, sgLang)
      : isNorwegian || isFinnish || isDutch || isPortuguese || isPolish || isCzech || isKorean || isJapanese
        ? (r.nameLocal || r.nameFr)
        : isSwedish
          ? (r.nameLocal || r.nameFr)
          : isEnglish || isChinese || isMalay || isTamil
            ? (r.nameLocal || r.nameFr)
            : isAr
              ? (r.nameLocal || r.nameFr)
              : (r.nameFr || r.nameLocal);
  const getDistrictName = (d: District) =>
    country === "SG"
      ? formatSgDistrictName(d.nameLocal || d.nameFr)
      : isNorwegian || isFinnish || isDutch || isPortuguese || isPolish || isCzech || isKorean || isJapanese
        ? (d.nameLocal || d.nameFr)
        : isSwedish
          ? (d.nameLocal || d.nameFr)
          : isEnglish || isChinese || isMalay || isTamil
            ? (d.nameLocal || d.nameFr)
            : isAr
              ? (d.nameLocal || d.nameFr)
              : (d.nameFr || d.nameLocal);
  const getSchoolName = (s: SchoolResult) => isNorwegian || isFinnish || isDutch || isPortuguese || isPolish || isCzech || isKorean || isJapanese ? (s.nameLocal || s.nameFr) : isSwedish ? (s.nameLocal || s.nameFr) : isEnglish || isChinese || isMalay || isTamil ? (s.nameLocal || s.nameFr) : isAr ? (s.nameLocal || s.nameFr) : (s.nameFr || s.nameLocal);
  const getSchoolRegion = (s: SchoolResult) => isNorwegian || isFinnish || isDutch || isPortuguese || isPolish || isCzech || isKorean || isJapanese ? (s.regionNameLocal || s.regionNameFr) : isSwedish ? (s.regionNameLocal || s.regionNameFr) : isEnglish || isChinese || isMalay || isTamil ? (s.regionNameLocal || s.regionNameFr) : isAr ? (s.regionNameLocal || s.regionNameFr) : (s.regionNameFr || s.regionNameLocal);
  const getSchoolDistrict = (s: SchoolResult) => isNorwegian || isFinnish || isDutch || isPortuguese || isPolish || isCzech || isKorean || isJapanese ? (s.districtNameLocal || s.districtNameFr) : isSwedish ? (s.districtNameLocal || s.districtNameFr) : isEnglish || isChinese || isMalay || isTamil ? (s.districtNameLocal || s.districtNameFr) : isAr ? (s.districtNameLocal || s.districtNameFr) : (s.districtNameFr || s.districtNameLocal);

  const handleSelect = (school: SchoolResult) => {
    onChange({
      id: school.id,
      name: getSchoolName(school) as string,
    });
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
  };

  if (value) {
    return (
      <div className="flex items-center gap-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-5 py-3" dir={isAr ? "rtl" : "ltr"}>
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">
            {tSp("SelectSchool")}
          </p>
          <p className="text-sm font-black text-slate-900 truncate">{value.name}</p>
        </div>
        <button onClick={handleClear} className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full text-slate-700" dir={isAr ? "rtl" : "ltr"}>
      {country === "FR" ? (
        <div className="flex flex-col md:flex-row gap-2.5 mb-3 w-full">
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                setFrRegionOpen(!frRegionOpen);
                setRegionOpen(false);
                setDistrictOpen(false);
              }}
              className="w-full flex items-center justify-between bg-white border-2 border-slate-100 hover:border-orange-200 focus:border-orange-500 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 transition-all shadow-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate">{selectedFrRegion || (isAr ? "المنطقة" : "Région")}</span>
              </span>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {selectedFrRegion && (
                  <div 
                    onClick={(e) => { e.stopPropagation(); setSelectedFrRegion(""); setRegionCode(""); setDistrictCode(""); }}
                    className="p-1 hover:bg-slate-100 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${frRegionOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            <AnimatePresence>
              {frRegionOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full mt-1 left-0 right-0 z-[60] bg-white shadow-2xl rounded-xl border border-slate-100 max-h-56 overflow-y-auto"
                >
                  {FR_REGIONS.map((reg) => (
                    <button
                      key={reg.name}
                      type="button"
                      onClick={() => { setSelectedFrRegion(reg.name); setRegionCode(""); setDistrictCode(""); setFrRegionOpen(false); }}
                      className={`w-full text-${isAr ? "right" : "left"} px-3 py-2.5 text-xs font-bold hover:bg-orange-50 hover:text-orange-700 transition-colors ${reg.name === selectedFrRegion ? "bg-orange-50 text-orange-700" : "text-slate-700"}`}
                    >
                      {reg.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                if (selectedFrRegion) {
                  setRegionOpen(!regionOpen);
                  setFrRegionOpen(false);
                  setDistrictOpen(false);
                }
              }}
              disabled={!selectedFrRegion}
              className={`w-full flex items-center justify-between bg-white border-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all shadow-sm ${!selectedFrRegion ? 'border-slate-50 bg-slate-50/50 text-slate-400 cursor-not-allowed opacity-60' : 'border-slate-100 hover:border-orange-200 text-slate-700'}`}
            >
              <span className="flex items-center gap-2 truncate">
                <MapPin className={`w-3.5 h-3.5 shrink-0 ${selectedFrRegion ? 'text-orange-500' : 'text-slate-300'}`} />
                <span className="truncate">{selectedRegion ? getRegionName(selectedRegion) : (isAr ? "القسم" : "Département")}</span>
              </span>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {regionCode && (
                  <div 
                    onClick={(e) => { e.stopPropagation(); setRegionCode(""); setDistrictCode(""); }}
                    className="p-1 hover:bg-slate-100 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${regionOpen ? "rotate-180" : ""} ${selectedFrRegion ? 'text-slate-400' : 'text-slate-300'}`} />
              </div>
            </button>

            <AnimatePresence>
              {regionOpen && selectedFrRegion && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full mt-1 left-0 right-0 z-[60] bg-white shadow-2xl rounded-xl border border-slate-100 max-h-56 overflow-y-auto"
                >
                  {regions
                    .filter((r) => {
                      const regObj = FR_REGIONS.find((fr) => fr.name === selectedFrRegion);
                      return regObj ? regObj.depts.includes(r.code) : true;
                    })
                    .map((r) => (
                      <button
                        key={r.code}
                        type="button"
                        onClick={() => { setRegionCode(r.code); setDistrictCode(""); setRegionOpen(false); }}
                        className={`w-full text-${isAr ? "right" : "left"} px-3 py-2.5 text-xs font-bold hover:bg-orange-50 hover:text-orange-700 transition-colors ${r.code === regionCode ? "bg-orange-50 text-orange-700" : "text-slate-700"}`}
                      >
                        {r.code} - {getRegionName(r)}
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                if (regionCode) {
                  setDistrictOpen(!districtOpen);
                  setFrRegionOpen(false);
                  setRegionOpen(false);
                }
              }}
              disabled={!regionCode}
              className={`w-full flex items-center justify-between bg-white border-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all shadow-sm ${!regionCode ? 'border-slate-50 bg-slate-50/50 text-slate-400 cursor-not-allowed opacity-60' : 'border-slate-100 hover:border-orange-200 text-slate-700'}`}
            >
              <span className="flex items-center gap-2 truncate">
                <Navigation className={`w-3.5 h-3.5 shrink-0 ${regionCode ? 'text-orange-500' : 'text-slate-300'}`} />
                <span className="truncate">{selectedDistrict ? getDistrictName(selectedDistrict) : (isAr ? "البلدية" : (country as string) === "SG" ? (isChinese ? "区域" : isMalay ? "Zon" : isTamil ? "மண்டலம்" : "Zone / DGP") : (country as string) === "AR" ? "Departamento / Partido" : (country as string) === "NO" ? "Kommune" : (country as string) === "FI" ? "Kunta" : (country as string) === "NL" ? "Gemeente" : (country as string) === "PT" ? "Município" : (country as string) === "PL" ? "Powiat" : (country as string) === "KR" ? "관할조직 (구/군)" : (country as string) === "JP" ? "市区町村" : (country as string) === "CZ" ? "Okres" : isEnglish ? "District" : "Commune")}</span>
              </span>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {districtCode && (
                  <div 
                    onClick={(e) => { e.stopPropagation(); setDistrictCode(""); }}
                    className="p-1 hover:bg-slate-100 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${districtOpen ? "rotate-180" : ""} ${regionCode ? 'text-slate-400' : 'text-slate-300'}`} />
              </div>
            </button>

            <AnimatePresence>
              {districtOpen && districts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full mt-1 left-0 right-0 z-[60] bg-white shadow-2xl rounded-xl border border-slate-100 max-h-56 overflow-y-auto"
                >
                  {districts.map((d) => (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => { setDistrictCode(d.code); setDistrictOpen(false); }}
                      className={`w-full text-${isAr ? "right" : "left"} px-3 py-2.5 text-xs font-bold hover:bg-orange-50 hover:text-orange-700 transition-colors ${d.code === districtCode ? "bg-orange-50 text-orange-700" : "text-slate-700"}`}
                    >
                      {getDistrictName(d)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : isCanada ? (
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                setRegionOpen(!regionOpen);
                setDistrictOpen(false);
              }}
              className="w-full flex items-center justify-between bg-white border-2 border-slate-100 hover:border-orange-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition-all shadow-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate">
                  {selectedRegion
                    ? getRegionName(selectedRegion)
                    : (isAr ? "المقاطعة" : "Province")}
                </span>
              </span>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {regionCode && (
                  <div
                    onClick={(e) => { e.stopPropagation(); setRegionCode(""); }}
                    className="p-1 hover:bg-slate-100 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${regionOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            <AnimatePresence>
              {regionOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full mt-1 left-0 right-0 z-[60] bg-white shadow-2xl rounded-xl border border-slate-100 max-h-56 overflow-y-auto"
                >
                  {regions.map((r) => (
                    <button
                      key={r.code}
                      type="button"
                      onClick={() => { setRegionCode(r.code); setRegionOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 text-xs font-bold hover:bg-orange-50 hover:text-orange-700 transition-colors ${r.code === regionCode ? "bg-orange-50 text-orange-700" : "text-slate-700"}`}
                    >
                      {getRegionName(r)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                if (regionCode) setDistrictOpen(!districtOpen);
                setRegionOpen(false);
              }}
              disabled={!regionCode}
              className={`w-full flex items-center justify-between bg-white border-2 rounded-xl px-3 py-2 text-xs font-bold transition-all shadow-sm ${!regionCode ? 'border-slate-50 bg-slate-50 text-slate-400 cursor-not-allowed opacity-70' : 'border-slate-100 hover:border-orange-200 text-slate-600'}`}
            >
              <span className="flex items-center gap-2 truncate">
                <Navigation className={`w-3.5 h-3.5 shrink-0 ${regionCode ? 'text-orange-500' : 'text-slate-300'}`} />
                <span className="truncate">
                  {selectedDistrict
                    ? getDistrictName(selectedDistrict)
                    : (isAr ? "المدينة" : isEnglish ? "City" : "Ville")}
                </span>
              </span>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {districtCode && (
                  <div
                    onClick={(e) => { e.stopPropagation(); setDistrictCode(""); }}
                    className="p-1 hover:bg-slate-100 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${districtOpen ? "rotate-180" : ""} ${regionCode ? 'text-slate-400' : 'text-slate-300'}`} />
              </div>
            </button>

            <AnimatePresence>
              {districtOpen && districts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full mt-1 left-0 right-0 z-[60] bg-white shadow-2xl rounded-xl border border-slate-100 max-h-56 overflow-y-auto"
                >
                  {districts.map((d) => (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => { setDistrictCode(d.code); setDistrictOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 text-xs font-bold hover:bg-orange-50 hover:text-orange-700 transition-colors ${d.code === districtCode ? "bg-orange-50 text-orange-700" : "text-slate-700"}`}
                    >
                      {getDistrictName(d)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                setRegionOpen(!regionOpen);
                setDistrictOpen(false);
              }}
              className="w-full flex items-center justify-between bg-white border-2 border-slate-100 hover:border-orange-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition-all shadow-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate">
                  {selectedRegion
                    ? getRegionName(selectedRegion)
                    : (isAr ? "الولاية" : country === "SG" ? tSp("RegionSG") : country === "AR" ? "Provincia" : country === "IE" ? (isIrish ? "Contae" : "County") : country === "GB" ? "Region" : country === "AU" ? "State" : country === "US" ? "State" : country === "NZ" ? (isMaori ? "Rohe" : "Regional Council") : country === "DK" ? "Region" : country === "SE" ? "Län" : country === "NO" ? "Fylke" : country === "FI" ? "Maakunta" : country === "NL" ? "Provincie" : country === "PT" ? "Distrito" : country === "BR" ? "Estado" : country === "PL" ? "Województwo" : country === "KR" ? "시/도" : country === "JP" ? "都道府県" : country === "CZ" ? "Kraj" : isEnglish ? "Region" : "Wilaya")}
                </span>
              </span>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {regionCode && (
                  <div 
                    onClick={(e) => { e.stopPropagation(); setRegionCode(""); }}
                    className="p-1 hover:bg-slate-100 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${regionOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
 
            <AnimatePresence>
              {regionOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full mt-1 left-0 right-0 z-[60] bg-white shadow-2xl rounded-xl border border-slate-100 max-h-56 overflow-y-auto"
                >
                  {regions.map((r) => (
                    <button
                      key={r.code}
                      type="button"
                      onClick={() => { setRegionCode(r.code); setRegionOpen(false); }}
                      className={`w-full text-${isAr ? "right" : "left"} px-3 py-2.5 text-xs font-bold hover:bg-orange-50 hover:text-orange-700 transition-colors ${r.code === regionCode ? "bg-orange-50 text-orange-700" : "text-slate-700"}`}
                    >
                      {getRegionName(r)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
 
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => {
                if (regionCode) setDistrictOpen(!districtOpen);
                setRegionOpen(false);
              }}
              disabled={!regionCode}
              className={`w-full flex items-center justify-between bg-white border-2 rounded-xl px-3 py-2 text-xs font-bold transition-all shadow-sm ${!regionCode ? 'border-slate-50 bg-slate-50 text-slate-400 cursor-not-allowed opacity-70' : 'border-slate-100 hover:border-orange-200 text-slate-600'}`}
            >
              <span className="flex items-center gap-2 truncate">
                <Navigation className={`w-3.5 h-3.5 shrink-0 ${regionCode ? 'text-orange-500' : 'text-slate-300'}`} />
                <span className="truncate">
                  {selectedDistrict
                    ? getDistrictName(selectedDistrict)
                    : (isAr ? "البلدية" : country === "SG" ? tSp("DistrictSG") : country === "AR" ? "Departamento / Partido" : country === "IE" ? (isIrish ? "Údarás Áitiúil" : "Local Authority") : country === "GB" ? "Local Authority" : country === "AU" ? "Suburb" : country === "US" ? "District" : country === "NZ" ? (isMaori ? "Takiwā" : "Territorial Authority") : country === "DK" ? "Kommune" : country === "SE" ? "Kommuner" : country === "NO" ? "Kommune" : country === "FI" ? "Kunta" : country === "NL" ? "Gemeente" : (country === "PT" || country === "BR") ? "Município" : country === "PL" ? "Powiat" : country === "KR" ? "관할조직 (구/군)" : country === "JP" ? "市区町村" : country === "CZ" ? "Okres" : isEnglish ? "District" : "Commune")}
                </span>
              </span>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {districtCode && (
                  <div 
                    onClick={(e) => { e.stopPropagation(); setDistrictCode(""); }}
                    className="p-1 hover:bg-slate-100 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${districtOpen ? "rotate-180" : ""} ${regionCode ? 'text-slate-400' : 'text-slate-300'}`} />
              </div>
            </button>

            <AnimatePresence>
              {districtOpen && districts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full mt-1 left-0 right-0 z-[60] bg-white shadow-2xl rounded-xl border border-slate-100 max-h-56 overflow-y-auto"
                >
                  {districts.map((d) => (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => { setDistrictCode(d.code); setDistrictOpen(false); }}
                      className={`w-full text-${isAr ? "right" : "left"} px-3 py-2.5 text-xs font-bold hover:bg-orange-50 hover:text-orange-700 transition-colors ${d.code === districtCode ? "bg-orange-50 text-orange-700" : "text-slate-700"}`}
                    >
                      {getDistrictName(d)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {districtCode ? (
        <div className="space-y-2 mt-3">
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isAr ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder || tSp("SearchPlaceholder")}
              className={`w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-500 rounded-xl py-3 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-inner ${isAr ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
              dir={isAr ? "rtl" : "ltr"}
            />
            {isLoading && (
              <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin ${isAr ? 'left-4' : 'right-4'}`} />
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSchoolType(0)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-colors ${schoolType === 0 ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {tSp("All")}
            </button>
            <button
              type="button"
              onClick={() => setSchoolType(1)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-colors ${schoolType === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
            >
              {tSp("Public")}
            </button>
            <button
              type="button"
              onClick={() => setSchoolType(2)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-colors ${schoolType === 2 ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              {tSp("Private")}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-100/80 rounded-2xl py-4 px-4 text-center text-[11px] font-extrabold text-slate-400/80 tracking-wide leading-relaxed">
          {isAr
            ? "الرجاء اختيار الولاية والبلدية أولاً لتحديد المدرسة"
            : isMaori 
            ? "Kōwhiria te rohe me te takiwā i te tuatahi kia kitea tētahi kura 🏫"
            : country === "IE"
              ? (isIrish ? "Roghnaigh an Contae agus an tÚdarás Áitiúil chun do scoil a aimsiú 🏫" : "Please select the County and Local Authority to choose your school 🏫")
            : country === "GB"
              ? "Please select the Region and Local Authority to choose your school 🏫"
              : country === "AU"
                ? "Please select the State and Suburb to choose your school 🏫"
                : country === "CA"
                  ? (isEnglish
                      ? "Please select the Province and City to find your school 🍁"
                      : "Veuillez sélectionner la Province et la Ville pour trouver votre école 🍁")
                  : country === "US"
                    ? "Please select the State and District to find your school 🏫"
                    : country === "PT"
                      ? "Selecione Distrito e Município para encontrar a sua escola 🏫"
                      : country === "BR"
                        ? "Selecione Estado e Município para encontrar a sua escola 🏫"
                        : country === "CL"
                          ? "Seleccione la Región y la Comuna para encontrar su escuela 🏫"
                          : country === "CO"
                            ? "Seleccione el Departamento y el Municipio para encontrar su escuela 🏫"
                            : country === "MX"
                              ? "Seleccione el Estado y el Municipio para encontrar su escuela 🏫"
                              : country === "PE"
                                ? "Seleccione el Departamento y la Provincia para encontrar su escuela 🏫"
                        : country === "AR"
                          ? "Seleccione Provincia y Departamento/Partido para encontrar su escuela 🏫"
                          : country === "PL"
                          ? "Wybierz Województwo i Powiat, aby znaleźć swoją szkołę 🏫"
                          : country === "KR"
                            ? "학교를 찾기 위해 시/도와 관할조직을 선택해주세요 🏫"
                            : country === "CZ"
                          ? "Vyberte kraj a okres pro nalezení školy 🏫"
                        : country === "SG" || country === "JP"
                          ? tSp("PromptSelect")
                          : country === "DK"
                      ? "Vælg venligst Region og Kommune for at finde din skole 🏫"
                      : country === "SE"
                        ? "Vänligen välj Län och Kommun för att hitta din skola 🏫"
                        : country === "NO"
                          ? "Vennligst velg Fylke og Kommune for å finne skolen din 🏫"
                          : country === "FI"
                            ? "Valitse Maakunta ja Kunta löytääksesi koulusi 🏫"
                            : country === "NL"
                              ? "Selecteer Provincie en Gemeente om uw school te vinden 🏫"
                              : (country === "FR"
                              ? "Veuillez sélectionner la Région, le Département et la Commune pour choisir votre école 🏫"
                              : "Veuillez sélectionner la Wilaya et la Commune pour choisir votre école 🏫")}
        </div>
      )}

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-full mt-2 left-0 right-0 z-[70] bg-white shadow-2xl rounded-2xl border border-slate-100 max-h-64 sm:max-h-72 overflow-y-auto"
          >
            {results.map((school) => (
              <button
                key={school.id}
                type="button"
                onClick={() => handleSelect(school)}
                className={`w-full flex items-start gap-3 px-3 sm:px-4 py-3 hover:bg-orange-50 transition-colors border-b border-slate-50 last:border-0 text-${isAr ? 'right' : 'left'}`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 items-center justify-center shrink-0 mt-0.5 hidden sm:flex">
                  <School className="w-4 h-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1 flex flex-col gap-1">
                  <p className={`text-[13px] sm:text-sm font-black text-slate-900 leading-tight truncate ${isAr ? 'font-arabic' : ''}`}>
                    {getSchoolName(school)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider truncate">
                      {getSchoolDistrict(school)} · {getSchoolRegion(school)}
                    </span>
                    <span className={`shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${school.type === 2 ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"}`}>
                      {school.type === 2 ? (isAr ? "خاص" : isMaori ? "Tūmataiti" : isIrish ? "Príobháideach" : isNorwegian ? "Privat" : isSwedish ? "Privatskola" : isDanish ? "Privatskole" : isFinnish ? "Yksityinen" : isDutch ? "Particulier" : isPortuguese ? "Privada" : isPolish ? "Prywatna" : isKorean ? "사립" : isCzech ? "Soukromá" : isChinese ? "私立" : isMalay ? "Swasta" : isTamil ? "தனியார்" : isEnglish ? "Private" : "Privé") : (isAr ? "عام" : isMaori ? "Tūmatanui" : isIrish ? "Poiblí" : isNorwegian ? "Offentlig" : isSwedish ? "Grundskola" : isDanish ? "Folkeskole" : isFinnish ? "Julkinen" : isDutch ? "Openbaar" : isPortuguese ? "Pública" : isPolish ? "Publiczna" : isKorean ? "공립" : isCzech ? "Veřejná" : isChinese ? "公立" : isMalay ? "Awam" : isTamil ? "அரசு" : isEnglish ? "Public" : "Public")}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
        {isOpen && !isLoading && results.length === 0 && (query.length >= 2 || regionCode) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-full mt-2 left-0 right-0 z-[70] bg-white shadow-xl rounded-2xl border border-slate-100 px-6 py-6 text-center"
          >
            <School className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-black text-slate-500">{tSp("NoSchoolFound")}</p>
            <p className="text-xs text-slate-400 mt-1">{tSp("TryAnotherSearch")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
