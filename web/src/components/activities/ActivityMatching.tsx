"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ActivityMotionSection,
  ActivityRoot,
  FeedbackBlock,
  PrimaryButton,
  pickLang,
  shuffleArray,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, MatchingContent, MatchingPair } from "@/types/activity";
import { cn } from "@/lib/utils";

type Props = {
  content: MatchingContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
};

type LineState = {
  pairId: string;
  correct: boolean;
  aKey: string;
  bKey: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

function colValue(
  col: MatchingPair["colonne_a"],
  langue: ActivityLang
): string {
  if (col.type === "image") return col.valeur ?? "";
  return pickLang(col.valeur_fr ?? "", col.valeur_ar ?? "", langue);
}

function MatchingCell({
  id,
  label,
  imageUrl,
  selected,
  matched,
  onClick,
  disabled,
}: {
  id: string;
  label: string;
  imageUrl?: string;
  selected: boolean;
  matched: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      data-match-id={id}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      disabled={disabled || matched}
      onClick={onClick}
      className={cn(
        "flex min-h-[56px] w-full items-center justify-center rounded-2xl border-2 border-[#E4E4E7] bg-white p-3 text-center font-semibold transition-all",
        selected && "border-[#F97316] bg-[#FEF3C7] shadow-[0_0_0_3px_#F97316]",
        matched && "border-[#10B981] bg-[#D1FAE5] opacity-70"
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={label} className="max-h-14 max-w-full object-contain" />
      ) : (
        label
      )}
    </motion.button>
  );
}

export function ActivityMatching({ content, langue, onAnswer, onStepComplete, onRecordAnswer, disabled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shuffledB = useMemo(() => shuffleArray(content.paires), [content.paires]);

  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [lines, setLines] = useState<LineState[]>([]);
  const [validated, setValidated] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const getCenter = useCallback((el: HTMLElement, container: DOMRect) => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - container.left,
      y: rect.top + rect.height / 2 - container.top,
    };
  }, []);

  const tryMatch = (pairIdA: string, pairIdB: string) => {
    if (disabled || validated) return;
    const container = containerRef.current;
    if (!container) return;

    const aEl = container.querySelector(`[data-match-id="a-${pairIdA}"]`) as HTMLElement | null;
    const bEl = container.querySelector(`[data-match-id="b-${pairIdB}"]`) as HTMLElement | null;
    if (!aEl || !bEl) return;

    const bounds = container.getBoundingClientRect();
    const p1 = getCenter(aEl, bounds);
    const p2 = getCenter(bEl, bounds);
    const correct = pairIdA === pairIdB;

    onAnswer?.(correct);

    const line: LineState = {
      pairId: pairIdA,
      correct,
      aKey: pairIdA,
      bKey: pairIdB,
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
    };

    if (correct) {
      setMatchedPairs((m) => [...m, pairIdA]);
      setLines((l) => [...l.filter((x) => x.pairId !== pairIdA), line]);
    } else {
      setLines((l) => [...l, line]);
      window.setTimeout(() => {
        setLines((l) => l.filter((x) => !(x.aKey === pairIdA && x.bKey === pairIdB && !x.correct)));
      }, 500);
    }
    setSelectedA(null);
  };

  const handleClickA = (pairId: string) => {
    if (disabled || validated || matchedPairs.includes(pairId)) return;
    setSelectedA(pairId);
  };

  const handleClickB = (pairId: string) => {
    if (disabled || validated || !selectedA || matchedPairs.includes(pairId)) return;
    tryMatch(selectedA, pairId);
  };

  const validate = () => {
    if (disabled || validated) return;
    const correct = content.paires.every((p) => matchedPairs.includes(p.id));
    content.paires.forEach((pair, idx) => {
      onRecordAnswer?.({
        index: idx,
        questionId: pair.id,
        label: colValue(pair.colonne_a, langue),
        answer: colValue(pair.colonne_b, langue),
        correct: matchedPairs.includes(pair.id),
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
        <p className="mb-6 text-xl font-bold text-[#18181B] md:text-2xl">
          {pickLang(content.instruction_fr, content.instruction_ar, langue)}
        </p>

        <div ref={containerRef} className="relative grid grid-cols-[1fr_auto_1fr] gap-4">
          <div className="flex flex-col gap-3">
            {content.paires.map((pair) => (
              <MatchingCell
                key={`a-${pair.id}`}
                id={`a-${pair.id}`}
                label={colValue(pair.colonne_a, langue)}
                imageUrl={pair.colonne_a.type === "image" ? pair.colonne_a.valeur : undefined}
                selected={selectedA === pair.id}
                matched={matchedPairs.includes(pair.id)}
                onClick={() => handleClickA(pair.id)}
                disabled={disabled}
              />
            ))}
          </div>

          <div className="w-4" aria-hidden />

          <div className="flex flex-col gap-3">
            {shuffledB.map((pair) => (
              <MatchingCell
                key={`b-${pair.id}`}
                id={`b-${pair.id}`}
                label={colValue(pair.colonne_b, langue)}
                imageUrl={pair.colonne_b.type === "image" ? pair.colonne_b.valeur : undefined}
                selected={false}
                matched={matchedPairs.includes(pair.id)}
                onClick={() => handleClickB(pair.id)}
                disabled={disabled}
              />
            ))}
          </div>

          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {lines.map((line, i) => (
              <motion.line
                key={`${line.aKey}-${line.bKey}-${i}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.correct ? "#10B981" : "#EF4444"}
                strokeWidth={3}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: line.correct ? 1 : 0.8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            ))}
          </svg>
        </div>

        {matchedPairs.length === content.paires.length && !validated && (
          <PrimaryButton onClick={validate} disabled={disabled} className="mt-6 w-full">
            {langue === "ar" ? "تحقق" : "Valider"}
          </PrimaryButton>
        )}

        {validated && (
          <FeedbackBlock
            correct={allCorrect}
            message={
              allCorrect
                ? langue === "ar"
                  ? "كل الروابط صحيحة!"
                  : "Toutes les liaisons sont correctes !"
                : langue === "ar"
                  ? "بعض الروابط خاطئة."
                  : "Certaines liaisons sont incorrectes."
            }
            langue={langue}
          />
        )}
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityMatching;
