/** Formats page (96 dpi ≈ dimensions Canva / impression courante). */
export type VisualPageFormat = {
  id: string;
  labelFr: string;
  labelAr: string;
  width: number;
  height: number;
};

export const VISUAL_PAGE_FORMATS: VisualPageFormat[] = [
  { id: "a4-portrait", labelFr: "A4 portrait", labelAr: "A4 عمودي", width: 794, height: 1123 },
  { id: "a4-landscape", labelFr: "A4 paysage", labelAr: "A4 أفقي", width: 1123, height: 794 },
  { id: "a3-portrait", labelFr: "A3 portrait", labelAr: "A3 عمودي", width: 1123, height: 1587 },
  { id: "a3-landscape", labelFr: "A3 paysage", labelAr: "A3 أفقي", width: 1587, height: 1123 },
  { id: "dl-envelope", labelFr: "Enveloppe DL", labelAr: "ظرف DL", width: 624, height: 312 },
  { id: "poster-a2", labelFr: "Affiche A2", labelAr: "ملصق A2", width: 1587, height: 2245 },
];

export function visualFormatById(formatId: string): VisualPageFormat {
  return VISUAL_PAGE_FORMATS.find((f) => f.id === formatId) ?? VISUAL_PAGE_FORMATS[0];
}
