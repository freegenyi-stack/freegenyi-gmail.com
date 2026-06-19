"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Timer } from "lucide-react";
import {
  ActivityMotionSection,
  ActivityRoot,
  shuffleArray,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, MemoryGameContent, MemoryPair } from "@/types/activity";
import { cn } from "@/lib/utils";

type Props = {
  content: MemoryGameContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
};

type MemoryCard = {
  uid: string;
  pairId: string;
  side: "a" | "b";
  type: "image" | "texte" | "texte_ar";
  valeur: string;
};

function renderCardFace(card: MemoryCard, langue: ActivityLang) {
  if (card.type === "image") {
    return <img src={card.valeur} alt="" className="max-h-full max-w-full object-contain p-2" />;
  }
  const text =
    card.type === "texte_ar" || (card.type === "texte" && langue === "ar") ? card.valeur : card.valeur;
  return (
    <span className="px-2 text-center text-lg font-bold text-[#18181B]">{text}</span>
  );
}

function pairToCards(pair: MemoryPair): MemoryCard[] {
  return [
    {
      uid: `${pair.id}-a`,
      pairId: pair.id,
      side: "a",
      type: pair.carte_a.type,
      valeur: pair.carte_a.valeur,
    },
    {
      uid: `${pair.id}-b`,
      pairId: pair.id,
      side: "b",
      type: pair.carte_b.type,
      valeur: pair.carte_b.valeur,
    },
  ];
}

export function ActivityMemoryGame({ content, langue, onAnswer, onStepComplete, onRecordAnswer, disabled }: Props) {
  const cards = useMemo(
    () => shuffleArray(content.paires.flatMap(pairToCards)),
    [content.paires]
  );

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(content.timer_secondes ?? null);
  const [completed, setCompleted] = useState(false);

  const cols = content.grille === "4x4" ? 4 : content.grille === "4x3" ? 4 : 4;
  const totalPairs = content.paires.length;

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || completed) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => (t !== null && t > 0 ? t - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [timeLeft, completed]);

  const checkMatch = useCallback(
    (first: string, second: string) => {
      const c1 = cards.find((c) => c.uid === first);
      const c2 = cards.find((c) => c.uid === second);
      if (!c1 || !c2) return;

      if (c1.pairId === c2.pairId && c1.uid !== c2.uid) {
        setMatched((m) => [...m, c1.pairId]);
        onAnswer?.(true);
        if (matched.length + 1 >= totalPairs) {
          setCompleted(true);
          onRecordAnswer?.({
            index: 0,
            label: langue === "ar" ? "الأزواج" : "Paires trouvées",
            answer: `${matched.length + 1}/${totalPairs}`,
            correct: true,
          });
          onStepComplete?.();
        }
      } else {
        onAnswer?.(false);
        setLockBoard(true);
        window.setTimeout(() => {
          setFlipped([]);
          setLockBoard(false);
        }, 1000);
      }
    },
    [cards, matched.length, onAnswer, onStepComplete, totalPairs]
  );

  useEffect(() => {
    if (flipped.length === 2) checkMatch(flipped[0], flipped[1]);
  }, [flipped, checkMatch]);

  const handleFlip = (uid: string, pairId: string) => {
    if (disabled || lockBoard || completed) return;
    if (flipped.includes(uid) || matched.includes(pairId)) return;
    if (flipped.length >= 2) return;
    setFlipped((f) => [...f, uid]);
  };

  return (
    <ActivityRoot langue={langue}>
      <ActivityMotionSection>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[#3F3F46]">
            {langue === "ar"
              ? `الأزواج: ${matched.length} / ${totalPairs}`
              : `Paires : ${matched.length} / ${totalPairs}`}
          </p>
          {timeLeft !== null && (
            <motion.div
              animate={timeLeft < 10 ? { scale: [1, 1.1, 1] } : {}}
              transition={timeLeft < 10 ? { duration: 0.5, repeat: Infinity } : {}}
              className="flex items-center gap-2 rounded-full bg-[#FEF3C7] px-4 py-2 font-bold text-[#F59E0B]"
            >
              <Timer size={22} />
              {timeLeft}s
            </motion.div>
          )}
        </div>

        <div
          className={cn(
            "grid gap-2 md:gap-3",
            cols === 4 ? "grid-cols-4" : "grid-cols-3"
          )}
        >
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(card.uid) || matched.includes(card.pairId);
            return (
              <motion.button
                key={card.uid}
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                disabled={disabled || matched.includes(card.pairId)}
                onClick={() => handleFlip(card.uid, card.pairId)}
                className="aspect-square min-h-[64px] perspective-[800px] select-none"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="relative h-full w-full"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#F97316] to-[#FB923C] shadow-md",
                      "[backface-visibility:hidden]"
                    )}
                  >
                    <span className="text-2xl font-black text-white">FG</span>
                  </div>
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-[#E4E4E7] bg-white shadow-sm",
                      "[backface-visibility:hidden] [transform:rotateY(180deg)]",
                      matched.includes(card.pairId) && "border-[#10B981] bg-[#D1FAE5]"
                    )}
                  >
                    {renderCardFace(card, langue)}
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#D1FAE5] p-4 text-lg font-bold text-[#065F46]"
          >
            <PartyPopper size={28} className="text-[#10B981]" />
            {langue === "ar" ? "أحسنت! وجدت كل الأزواج!" : "Bravo ! Toutes les paires sont trouvées !"}
          </motion.div>
        )}
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityMemoryGame;
