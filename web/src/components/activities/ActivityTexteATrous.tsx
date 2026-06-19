"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ActivityMotionSection,
  ActivityRoot,
  FeedbackBlock,
  PrimaryButton,
  pickLang,
  shakeAnimation,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, TexteATrousContent } from "@/types/activity";
import { cn } from "@/lib/utils";

type Props = {
  content: TexteATrousContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
};

export function ActivityTexteATrous({ content, langue, onAnswer, onStepComplete, onRecordAnswer, disabled }: Props) {
  const reduceMotion = useReducedMotion();
  const text = pickLang(content.texte_fr, content.texte_ar, langue);
  const wordBank = langue === "ar" ? content.word_bank_ar ?? [] : content.word_bank_fr ?? [];

  const sortedTrous = useMemo(
    () => [...content.trous].sort((a, b) => a.position - b.position),
    [content.trous]
  );

  const segments = useMemo(() => {
    const parts = text.split("___");
    return parts;
  }, [text]);

  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(sortedTrous.map((t) => [t.id, ""]))
  );
  const [validated, setValidated] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const usedWords = new Set(Object.values(answers).filter(Boolean));

  const correctAnswer = (trouId: string) => {
    const trou = sortedTrous.find((t) => t.id === trouId);
    if (!trou) return "";
    return langue === "ar" && trou.reponse_correcte_ar
      ? trou.reponse_correcte_ar
      : trou.reponse_correcte;
  };

  const isTrouCorrect = (trouId: string) =>
    answers[trouId]?.trim().toLowerCase() === correctAnswer(trouId).trim().toLowerCase();

  const selectWord = (word: string, trouId: string) => {
    if (disabled || validated || content.mode !== "choix") return;
    setAnswers((prev) => ({ ...prev, [trouId]: word }));
  };

  const pickChip = (word: string) => {
    if (disabled || validated || content.mode !== "choix") return;
    const emptyTrou = sortedTrous.find((t) => !answers[t.id]);
    if (emptyTrou) selectWord(word, emptyTrou.id);
  };

  const validate = () => {
    if (disabled || validated) return;
    const correct = sortedTrous.every((t) => isTrouCorrect(t.id));
    sortedTrous.forEach((trou, idx) => {
      onRecordAnswer?.({
        index: idx,
        questionId: trou.id,
        label: `___${idx + 1}`,
        answer: answers[trou.id] ?? "",
        correct: isTrouCorrect(trou.id),
      });
    });
    setAllCorrect(correct);
    setValidated(true);
    onAnswer?.(correct);
    if (correct) onStepComplete?.();
  };

  return (
    <ActivityRoot langue={langue}>
      <ActivityMotionSection>
        <motion.div {...(validated && !allCorrect ? shakeAnimation(reduceMotion) : {})}>
          <p className="mb-6 text-xl leading-loose text-[#18181B] md:text-2xl">
            {segments.map((segment, i) => (
              <span key={`seg-${i}`}>
                {segment}
                {i < sortedTrous.length && (
                  <span className="mx-1 inline-block align-middle">
                    {content.mode === "clavier" ? (
                      <input
                        type="text"
                        disabled={disabled || validated}
                        value={answers[sortedTrous[i].id] ?? ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [sortedTrous[i].id]: e.target.value,
                          }))
                        }
                        className={cn(
                          "inline-block min-w-[80px] rounded-lg border-b-4 border-dashed border-[#F97316] bg-[#FEF3C7] px-2 py-1 text-center text-lg font-semibold outline-none",
                          validated &&
                            (isTrouCorrect(sortedTrous[i].id)
                              ? "border-[#10B981] bg-[#D1FAE5]"
                              : "border-[#EF4444] bg-[#FEE2E2]")
                        )}
                        style={{ width: `${Math.max(80, correctAnswer(sortedTrous[i].id).length * 14)}px` }}
                      />
                    ) : (
                      <button
                        type="button"
                        disabled={disabled || validated}
                        onClick={() => {
                          if (answers[sortedTrous[i].id]) {
                            setAnswers((prev) => ({ ...prev, [sortedTrous[i].id]: "" }));
                          }
                        }}
                        className={cn(
                          "inline-block min-w-[80px] rounded-lg border-b-4 border-dashed border-[#F97316] bg-[#FEF3C7] px-2 py-1 text-center text-lg font-semibold",
                          validated &&
                            (isTrouCorrect(sortedTrous[i].id)
                              ? "border-[#10B981] bg-[#D1FAE5]"
                              : "border-[#EF4444] bg-[#FEE2E2]")
                        )}
                      >
                        {answers[sortedTrous[i].id] || "…"}
                      </button>
                    )}
                  </span>
                )}
              </span>
            ))}
          </p>

          {content.mode === "choix" && wordBank.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {wordBank.map((word) => (
                <motion.button
                  key={word}
                  type="button"
                  whileTap={disabled || validated ? undefined : { scale: 0.95 }}
                  disabled={disabled || validated || usedWords.has(word)}
                  onClick={() => pickChip(word)}
                  className={cn(
                    "cursor-pointer select-none rounded-xl border-2 border-[#E4E4E7] bg-white px-4 py-2 text-lg font-semibold shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  )}
                >
                  {word}
                </motion.button>
              ))}
            </div>
          )}

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
                    ? "أحسنت! كل الإجابات صحيحة."
                    : "Bravo ! Toutes les réponses sont correctes."
                  : langue === "ar"
                    ? "حاول مرة أخرى."
                    : "Essaie encore une fois."
              }
              langue={langue}
            />
          )}
        </motion.div>
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityTexteATrous;
