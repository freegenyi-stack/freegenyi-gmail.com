"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ActivityMotionSection,
  ActivityRoot,
  AudioButton,
  FeedbackBlock,
  PrimaryButton,
  pickLang,
  shakeAnimation,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, LettresManquantesContent } from "@/types/activity";
import { cn } from "@/lib/utils";

type Props = {
  content: LettresManquantesContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
};

type LetterSlot = {
  index: number;
  expected: string;
  filled: string | null;
  state: "empty" | "filled" | "correct" | "wrong";
};

export function ActivityLettresManquantes({
  content,
  langue,
  onAnswer,
  onStepComplete,
  onRecordAnswer,
  disabled,
}: Props) {
  const reduceMotion = useReducedMotion();
  const word = pickLang(content.mot_fr, content.mot_ar, langue);
  const maskedIndices =
    langue === "ar" ? content.lettres_masquees_ar : content.lettres_masquees_fr;
  const availableLetters =
    langue === "ar" ? content.lettres_disponibles_ar : content.lettres_disponibles_fr;
  const audioUrl = langue === "ar" ? content.audio_url_ar : content.audio_url_fr;

  const letters = useMemo(() => Array.from(word), [word]);

  const [slots, setSlots] = useState<LetterSlot[]>(() =>
    maskedIndices.map((index) => ({
      index,
      expected: letters[index] ?? "",
      filled: null,
      state: "empty" as const,
    }))
  );
  const [usedLetters, setUsedLetters] = useState<Record<string, number>>({});
  const [validated, setValidated] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const firstEmptySlot = slots.find((s) => s.state === "empty" || s.state === "filled");

  const placeLetter = (letter: string) => {
    if (disabled || validated || !firstEmptySlot) return;
    const countUsed = usedLetters[letter] ?? 0;
    const availableCount = availableLetters.filter((l) => l === letter).length;
    if (countUsed >= availableCount) return;

    const isCorrect = letter === firstEmptySlot.expected;
    setSlots((prev) =>
      prev.map((s) =>
        s.index === firstEmptySlot.index
          ? {
              ...s,
              filled: letter,
              state: isCorrect ? "correct" : "wrong",
            }
          : s
      )
    );
    setUsedLetters((u) => ({ ...u, [letter]: countUsed + 1 }));

    if (!isCorrect) {
      onAnswer?.(false);
      window.setTimeout(() => {
        setSlots((prev) =>
          prev.map((s) =>
            s.index === firstEmptySlot.index ? { ...s, filled: null, state: "empty" } : s
          )
        );
        setUsedLetters((u) => ({ ...u, [letter]: Math.max(0, (u[letter] ?? 1) - 1) }));
      }, 600);
    } else {
      onAnswer?.(true);
    }
  };

  const allFilled = slots.every((s) => s.state === "correct");

  const validate = () => {
    if (disabled || validated) return;
    const filledWord = letters
      .map((letter, index) => {
        const slot = slotMap[index];
        return slot?.filled ?? letter;
      })
      .join("");
    const correct = slots.every((s) => s.filled === s.expected);
    onRecordAnswer?.({
      index: 0,
      label: word,
      answer: filledWord,
      correct,
    });
    setAllCorrect(correct);
    setValidated(true);
    onAnswer?.(correct);
    if (correct) onStepComplete?.();
  };

  const slotMap = Object.fromEntries(slots.map((s) => [s.index, s]));

  return (
    <ActivityRoot langue={langue}>
      <ActivityMotionSection>
        <div className="mb-6 flex flex-col items-center gap-4">
          {content.image_url && (
            <img
              src={content.image_url}
              alt=""
              className="max-h-32 rounded-2xl object-contain"
            />
          )}
          <AudioButton url={audioUrl} label={langue === "ar" ? "استماع" : "Écouter le mot"} />
        </div>

        <motion.div
          className="mb-8 flex flex-wrap justify-center gap-2"
          {...(validated && !allCorrect ? shakeAnimation(reduceMotion) : {})}
        >
          {letters.map((letter, index) => {
            const slot = slotMap[index];
            const isMasked = maskedIndices.includes(index);

            if (!isMasked) {
              return (
                <span
                  key={index}
                  className="flex h-14 w-12 items-center justify-center text-2xl font-black uppercase text-[#18181B]"
                >
                  {letter}
                </span>
              );
            }

            return (
              <motion.span
                key={index}
                className={cn(
                  "flex h-14 w-12 items-center justify-center rounded-xl border-b-4 text-2xl font-black",
                  slot?.state === "correct" && "border-[#10B981] bg-[#D1FAE5] text-[#065F46]",
                  slot?.state === "wrong" && "border-[#EF4444] bg-[#FEE2E2]",
                  (slot?.state === "empty" || !slot?.filled) &&
                    "border-dashed border-[#F97316] bg-white",
                  slot?.filled && slot.state === "filled" && "border-[#F97316] bg-[#FEF3C7]"
                )}
                {...(slot?.state === "wrong" ? shakeAnimation(reduceMotion) : {})}
              >
                {slot?.filled ?? ""}
              </motion.span>
            );
          })}
        </motion.div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {availableLetters.map((letter, i) => {
            const used = usedLetters[letter] ?? 0;
            const total = availableLetters.filter((l) => l === letter).length;
            const exhausted = used >= total;
            return (
              <motion.button
                key={`${letter}-${i}`}
                type="button"
                whileTap={disabled || validated || exhausted ? undefined : { scale: 0.95 }}
                disabled={disabled || validated || exhausted}
                onClick={() => placeLetter(letter)}
                className={cn(
                  "flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border-2 border-[#E4E4E7] bg-white text-xl font-bold shadow-[0_3px_0_#E4E4E7] active:translate-y-0.5 active:shadow-[0_1px_0_#E4E4E7] disabled:opacity-40",
                  langue === "fr" && "uppercase"
                )}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>

        {allFilled && !validated && (
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
                  ? "أحسنت! الكلمة كاملة."
                  : "Bravo ! Le mot est complet."
                : langue === "ar"
                  ? "حاول مرة أخرى."
                  : "Essaie encore."
            }
            langue={langue}
          />
        )}
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityLettresManquantes;
