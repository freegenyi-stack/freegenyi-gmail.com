"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ActivityMotionSection,
  ActivityRoot,
  FeedbackBlock,
  PrimaryButton,
  normalizeHex,
  pickLang,
  shakeAnimation,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, ColoriageContent } from "@/types/activity";
import { cn } from "@/lib/utils";

type Props = {
  content: ColoriageContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
};

export function ActivityColoriage({ content, langue, onAnswer, onStepComplete, onRecordAnswer, disabled }: Props) {
  const reduceMotion = useReducedMotion();
  const [selectedColor, setSelectedColor] = useState(content.palette[0] ?? "#F97316");
  const [fills, setFills] = useState<Record<string, string>>({});
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [guideIndex, setGuideIndex] = useState(0);

  const guidedZones = content.zones_guidees ?? [];
  const currentGuide = content.mode === "guide" ? guidedZones[guideIndex] : null;

  useEffect(() => {
    let cancelled = false;
    void fetch(content.svg_url)
      .then((r) => r.text())
      .then((text) => {
        if (!cancelled) setSvgMarkup(text);
      })
      .catch(() => {
        if (!cancelled) setSvgMarkup(null);
      });
    return () => {
      cancelled = true;
    };
  }, [content.svg_url]);

  const handleZoneClick = useCallback(
    (zoneId: string) => {
      if (disabled || validated) return;
      setFills((prev) => ({ ...prev, [zoneId]: selectedColor }));

      if (content.mode === "guide" && currentGuide?.zone_id === zoneId) {
        const expected = normalizeHex(currentGuide.couleur_correcte);
        if (normalizeHex(selectedColor) === expected) {
          setGuideIndex((i) => Math.min(i + 1, guidedZones.length));
        }
      }
    },
    [content.mode, currentGuide, disabled, guidedZones.length, selectedColor, validated]
  );

  useEffect(() => {
    if (!svgMarkup) return;

    const container = document.getElementById("coloriage-svg-root");
    if (!container) return;

    const paths = container.querySelectorAll("[id]");
    paths.forEach((node) => {
      const el = node as SVGElement;
      const id = el.id;
      if (!id) return;
      el.style.cursor = disabled || validated ? "default" : "pointer";
      if (fills[id]) el.setAttribute("fill", fills[id]);
      el.onclick = () => handleZoneClick(id);
    });
  }, [svgMarkup, fills, handleZoneClick, disabled, validated]);

  const validate = () => {
    if (disabled || validated) return;
    if (content.mode === "guide" && guidedZones.length > 0) {
      const correct = guidedZones.every(
        (z) => normalizeHex(fills[z.zone_id] ?? "") === normalizeHex(z.couleur_correcte)
      );
      guidedZones.forEach((z, idx) => {
        onRecordAnswer?.({
          index: idx,
          questionId: z.zone_id,
          label: pickLang(z.label_fr, z.label_ar, langue),
          answer: fills[z.zone_id] ?? "",
          correct: normalizeHex(fills[z.zone_id] ?? "") === normalizeHex(z.couleur_correcte),
        });
      });
      setAllCorrect(correct);
      setValidated(true);
      onAnswer?.(correct);
      if (correct) onStepComplete?.();
      return;
    }
    onRecordAnswer?.({
      index: 0,
      label: pickLang(content.instruction_fr, content.instruction_ar, langue),
      answer: fills,
      correct: true,
    });
    setAllCorrect(true);
    setValidated(true);
    onAnswer?.(true);
    onStepComplete?.();
  };

  return (
    <ActivityRoot langue={langue}>
      <ActivityMotionSection>
        <p className="mb-4 text-xl font-bold text-[#18181B] md:text-2xl">
          {pickLang(content.instruction_fr, content.instruction_ar, langue)}
        </p>

        {content.mode === "guide" && currentGuide && !validated && (
          <motion.div
            animate={reduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="mb-4 rounded-2xl bg-[#FEF3C7] p-3 text-center font-semibold text-[#3F3F46]"
          >
            {langue === "ar"
              ? `لوّن ${currentGuide.label_ar} باللون ${currentGuide.couleur_correcte}`
              : `Colorie ${currentGuide.label_fr} avec ${currentGuide.couleur_correcte}`}
          </motion.div>
        )}

        <motion.div
          className="mx-auto mb-6 max-w-lg rounded-3xl bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          {...(validated && !allCorrect ? shakeAnimation(reduceMotion) : {})}
        >
          {svgMarkup ? (
            <div
              id="coloriage-svg-root"
              className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-h-[360px] [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
          ) : (
            <p className="py-12 text-center text-[#3F3F46]">
              {langue === "ar" ? "جاري تحميل الرسم…" : "Chargement du coloriage…"}
            </p>
          )}
        </motion.div>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {content.palette.map((color) => (
            <button
              key={color}
              type="button"
              disabled={disabled || validated}
              onClick={() => setSelectedColor(color)}
              aria-label={color}
              className={cn(
                "h-12 w-12 min-h-[48px] min-w-[48px] rounded-full border-4 transition-transform active:scale-90",
                normalizeHex(selectedColor) === normalizeHex(color)
                  ? "border-[#18181B]"
                  : "border-transparent"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {!validated && (
          <PrimaryButton onClick={validate} disabled={disabled} className="w-full">
            {langue === "ar" ? "تحقق" : "Valider"}
          </PrimaryButton>
        )}

        {validated && (
          <FeedbackBlock
            correct={allCorrect}
            message={
              allCorrect
                ? langue === "ar"
                  ? "ألوان رائعة!"
                  : "Belles couleurs !"
                : langue === "ar"
                  ? "تحقق من الألوان."
                  : "Vérifie les couleurs."
            }
            langue={langue}
          />
        )}
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityColoriage;
