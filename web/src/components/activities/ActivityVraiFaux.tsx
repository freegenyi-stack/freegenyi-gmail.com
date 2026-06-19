"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import {
  ActivityMotionSection,
  ActivityRoot,
  AudioButton,
  FeedbackBlock,
  NavChevron,
  PrimaryButton,
  pickLang,
  shakeAnimation,
  successPulse,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, VraiFauxContent } from "@/types/activity";
import { cn } from "@/lib/utils";

type Props = {
  content: VraiFauxContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
  hideCorrections?: boolean;
};

type Item = Omit<VraiFauxContent, "type" | "items">;

function VraiFauxItem({
  item,
  itemIndex,
  langue,
  onAnswer,
  onContinue,
  onRecordAnswer,
  disabled,
  hideCorrections,
}: {
  item: Item;
  itemIndex: number;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onContinue?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
  hideCorrections?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (value: boolean) => {
    if (disabled || answered !== null) return;
    const correct = value === item.reponse_correcte;
    setAnswered(value);
    setShowFeedback(true);
    onRecordAnswer?.({
      index: itemIndex,
      label: pickLang(item.affirmation_fr, item.affirmation_ar, langue),
      answer: value,
      correct,
    });
    onAnswer?.(correct);
  };

  const isCorrect = answered === item.reponse_correcte;

  return (
    <motion.div {...(showFeedback && !isCorrect ? shakeAnimation(reduceMotion) : {})}>
      <div className="mb-6 flex items-start gap-3">
        <p className="flex-1 text-2xl font-bold text-[#18181B] md:text-3xl">
          {pickLang(item.affirmation_fr, item.affirmation_ar, langue)}
        </p>
        <AudioButton
          url={item.affirmation_audio_url}
          label={langue === "ar" ? "تشغيل" : "Écouter"}
        />
      </div>

      <div className="flex gap-3">
        <motion.button
          type="button"
          whileTap={disabled || answered !== null ? undefined : { scale: 0.96 }}
          disabled={disabled || answered !== null}
          onClick={() => handleAnswer(true)}
          className={cn(
            "flex min-h-[100px] flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-[#10B981] py-6 text-2xl font-black text-white shadow-[0_6px_0_#059669] transition-all active:translate-y-1 active:shadow-[0_2px_0_#059669] disabled:opacity-60",
            answered === true && !isCorrect && "opacity-70",
            answered === true && isCorrect && "ring-4 ring-[#059669]"
          )}
          {...(showFeedback && isCorrect && answered === true ? successPulse(reduceMotion) : {})}
        >
          <ThumbsUp size={32} />
          {langue === "ar" ? "صحيح" : "Vrai"}
        </motion.button>

        <motion.button
          type="button"
          whileTap={disabled || answered !== null ? undefined : { scale: 0.96 }}
          disabled={disabled || answered !== null}
          onClick={() => handleAnswer(false)}
          className={cn(
            "flex min-h-[100px] flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-[#EF4444] py-6 text-2xl font-black text-white shadow-[0_6px_0_#DC2626] transition-all active:translate-y-1 active:shadow-[0_2px_0_#DC2626] disabled:opacity-60",
            answered === false && isCorrect && "ring-4 ring-[#059669]",
            answered === false && !isCorrect && "ring-4 ring-[#DC2626]"
          )}
        >
          <ThumbsDown size={32} />
          {langue === "ar" ? "خطأ" : "Faux"}
        </motion.button>
      </div>

      {showFeedback && !hideCorrections && (
        <>
          <FeedbackBlock
            correct={isCorrect}
            message={pickLang(item.explication_fr ?? "", item.explication_ar ?? "", langue)}
            langue={langue}
          />
          <PrimaryButton onClick={onContinue} className="mt-4 w-full">
            {langue === "ar" ? "التالي" : "Suivant"}
            <NavChevron direction="next" langue={langue} />
          </PrimaryButton>
        </>
      )}

      {showFeedback && hideCorrections && (
        <PrimaryButton onClick={onContinue} className="mt-4 w-full">
          {langue === "ar" ? "التالي" : "Suivant"}
          <NavChevron direction="next" langue={langue} />
        </PrimaryButton>
      )}
    </motion.div>
  );
}

export function ActivityVraiFaux({ content, langue, onAnswer, onStepComplete, onRecordAnswer, disabled, hideCorrections }: Props) {
  const items = useMemo<Item[]>(() => {
    if (content.items?.length) return content.items;
    const { type: _t, items: _i, ...single } = content;
    return [single];
  }, [content]);

  const [index, setIndex] = useState(0);
  const isLast = index >= items.length - 1;

  const handleContinue = () => {
    if (isLast) onStepComplete?.();
    else setIndex((i) => i + 1);
  };

  return (
    <ActivityRoot langue={langue}>
      <ActivityMotionSection key={index}>
        {items.length > 1 && (
          <p className="mb-4 text-sm font-semibold text-[#3F3F46]">
            {langue === "ar"
              ? `${index + 1} / ${items.length}`
              : `${index + 1} / ${items.length}`}
          </p>
        )}
        <VraiFauxItem
          item={items[index]}
          itemIndex={index}
          langue={langue}
          onAnswer={onAnswer}
          onContinue={handleContinue}
          onRecordAnswer={onRecordAnswer}
          disabled={disabled}
          hideCorrections={hideCorrections}
        />
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityVraiFaux;
