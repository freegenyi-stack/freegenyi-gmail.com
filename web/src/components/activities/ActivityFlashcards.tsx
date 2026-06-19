"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import {
  ActivityMotionSection,
  ActivityRoot,
  AudioButton,
  NavChevron,
  PrimaryButton,
  SecondaryButton,
  pickLang,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, FlashcardsContent } from "@/types/activity";
import { cn } from "@/lib/utils";

type Props = {
  content: FlashcardsContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
};

export function ActivityFlashcards({ content, langue, onAnswer, onStepComplete, onRecordAnswer, disabled }: Props) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cartes = content.cartes;
  const carte = cartes[index];
  const isLast = index >= cartes.length - 1;

  const goPrev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setFlipped(false);
    }
  };

  const goNext = () => {
    onRecordAnswer?.({
      index,
      questionId: carte.id,
      label: pickLang(carte.recto_texte_fr, carte.recto_texte_ar, langue),
      answer: pickLang(carte.verso_texte_fr, carte.verso_texte_ar, langue),
      correct: true,
    });
    if (isLast) {
      onStepComplete?.();
      onAnswer?.(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  if (!carte) {
    return (
      <ActivityRoot langue={langue}>
        <p className="text-center text-[#3F3F46]">
          {langue === "ar" ? "لا توجد بطاقات." : "Aucune carte disponible."}
        </p>
      </ActivityRoot>
    );
  }

  return (
    <ActivityRoot langue={langue}>
      <ActivityMotionSection className="flex flex-col items-center gap-4">
        <p className="text-sm font-semibold text-[#3F3F46]">
          {langue === "ar" ? `البطاقة ${index + 1} / ${cartes.length}` : `Carte ${index + 1} / ${cartes.length}`}
        </p>

        <motion.div
          drag={disabled ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (disabled) return;
            if (info.offset.x > 80) goPrev();
            else if (info.offset.x < -80) goNext();
          }}
          className="w-full max-w-sm perspective-[1000px]"
        >
          <motion.button
            type="button"
            disabled={disabled}
            onClick={() => setFlipped((f) => !f)}
            className="relative h-64 w-full cursor-pointer select-none"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeInOut" }}
          >
            {/* Recto */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-[#E4E4E7] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
                "[backface-visibility:hidden]"
              )}
            >
              {carte.recto_image_url && (
                <img src={carte.recto_image_url} alt="" className="max-h-28 object-contain" />
              )}
              <p className="text-center text-3xl font-black text-[#18181B]">
                {pickLang(carte.recto_texte_fr, carte.recto_texte_ar, langue)}
              </p>
              <span className="flex items-center gap-1 text-sm text-[#3F3F46]">
                <RefreshCw size={20} />
                {langue === "ar" ? "اضغط للقلب" : "Toucher pour retourner"}
              </span>
            </div>

            {/* Verso */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-[#F97316] bg-[#FEF3C7] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
                "[backface-visibility:hidden] [transform:rotateY(180deg)]"
              )}
            >
              <p className="text-center text-xl font-semibold text-[#18181B]">
                {pickLang(carte.verso_texte_fr, carte.verso_texte_ar, langue)}
              </p>
              <AudioButton
                url={carte.verso_audio_url}
                label={langue === "ar" ? "استماع" : "Écouter"}
              />
            </div>
          </motion.button>
        </motion.div>

        <div className="flex w-full max-w-sm gap-3">
          <SecondaryButton
            onClick={goPrev}
            disabled={disabled || index === 0}
            className="flex flex-1 items-center justify-center gap-2"
          >
            <NavChevron direction="prev" langue={langue} />
            {langue === "ar" ? "السابق" : "Précédent"}
          </SecondaryButton>
          <PrimaryButton
            onClick={goNext}
            disabled={disabled}
            className="flex flex-1 items-center justify-center gap-2"
          >
            {isLast ? (langue === "ar" ? "إنهاء" : "Terminer") : langue === "ar" ? "التالي" : "Suivant"}
            <NavChevron direction="next" langue={langue} />
          </PrimaryButton>
        </div>
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityFlashcards;
