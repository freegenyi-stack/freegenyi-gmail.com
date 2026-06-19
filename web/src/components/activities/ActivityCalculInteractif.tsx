"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Delete } from "lucide-react";
import {
  ActivityMotionSection,
  ActivityRoot,
  FeedbackBlock,
  NavChevron,
  PrimaryButton,
  formatNumber,
  pickLang,
  shakeAnimation,
  successPulse,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, CalculInteractifContent } from "@/types/activity";
type Props = {
  content: CalculInteractifContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
};

type CalcItem = Omit<CalculInteractifContent, "type" | "items">;

const OP_SYMBOL: Record<CalculInteractifContent["operation"], string> = {
  addition: "+",
  soustraction: "−",
  multiplication: "×",
  division: "÷",
};

function VisualAid({
  icon,
  a,
  b,
  operation,
}: {
  icon?: string;
  a: number;
  b: number;
  operation: CalculInteractifContent["operation"];
}) {
  if (!icon) return null;
  const count = operation === "addition" ? a + b : operation === "multiplication" ? a * b : a;
  return (
    <div className="mb-4 flex flex-wrap justify-center gap-1">
      {Array.from({ length: Math.min(count, 24) }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="text-2xl"
        >
          {icon}
        </motion.span>
      ))}
      {count > 24 && <span className="text-sm text-[#3F3F46]">+{count - 24}</span>}
    </div>
  );
}

function CalculQuestion({
  item,
  questionIndex,
  langue,
  onAnswer,
  onRecordAnswer,
  onContinue,
  disabled,
  isLast,
}: {
  item: CalcItem;
  questionIndex: number;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  onContinue?: () => void;
  disabled?: boolean;
  isLast: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const useArabicDigits = langue === "ar" || item.chiffres_arabes;
  const [input, setInput] = useState("");
  const [validated, setValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const op = OP_SYMBOL[item.operation];
  const displayA = formatNumber(item.nombre_a, langue, useArabicDigits);
  const displayB = formatNumber(item.nombre_b, langue, useArabicDigits);

  const appendDigit = (digit: string) => {
    if (disabled || validated) return;
    if (input.length >= 6) return;
    setInput((v) => v + digit);
  };

  const clearInput = () => {
    if (disabled || validated) return;
    setInput("");
  };

  const validate = () => {
    if (disabled || validated || !input) return;
    const answer = Number(input);
    const correct = answer === item.reponse_correcte;
    setIsCorrect(correct);
    setValidated(true);
    if (!correct) setShowHelp(true);
    onRecordAnswer?.({
      index: questionIndex,
      label: pickLang(item.question_fr, item.question_ar, langue),
      answer: String(answer),
      correct,
    });
    onAnswer?.(correct);
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <motion.div {...(validated && !isCorrect ? shakeAnimation(reduceMotion) : {})}>
      <p className="mb-4 text-center text-lg font-semibold text-[#3F3F46]">
        {pickLang(item.question_fr, item.question_ar, langue)}
      </p>

      {showHelp && item.aide_visuelle && (
        <VisualAid
          icon={item.icone_visuelle}
          a={item.nombre_a}
          b={item.nombre_b}
          operation={item.operation}
        />
      )}

      <motion.div
        className="mb-6 text-center text-5xl font-black"
        {...(validated && isCorrect ? successPulse(reduceMotion) : {})}
      >
        <span className="text-[#F97316]">{displayA}</span>{" "}
        <span className="text-[#10B981]">{op}</span>{" "}
        <span className="text-[#F97316]">{displayB}</span>{" "}
        <span className="text-[#3F3F46]">=</span>{" "}
        <span className="text-[#18181B]">?</span>
      </motion.div>

      <div className="mx-auto mb-6 min-w-[120px] rounded-xl border-b-4 border-[#F97316] bg-[#FEF3C7] p-2 text-center text-4xl font-black text-[#18181B]">
        {input ? formatNumber(Number(input), langue, useArabicDigits) : "…"}
      </div>

      <div className="mx-auto mb-6 grid max-w-xs grid-cols-3 gap-2">
        {digits.slice(0, 9).map((d) => (
          <motion.button
            key={d}
            type="button"
            whileTap={disabled || validated ? undefined : { scale: 0.96 }}
            disabled={disabled || validated}
            onClick={() => appendDigit(d)}
            className="flex h-16 min-h-[48px] items-center justify-center rounded-2xl border-2 border-[#E4E4E7] bg-white text-2xl font-bold shadow-[0_4px_0_#E4E4E7] active:translate-y-0.5 active:shadow-[0_1px_0_#E4E4E7] disabled:opacity-60"
          >
            {formatNumber(Number(d), langue, useArabicDigits)}
          </motion.button>
        ))}
        <motion.button
          type="button"
          whileTap={disabled || validated ? undefined : { scale: 0.96 }}
          disabled={disabled || validated}
          onClick={clearInput}
          className="flex h-16 items-center justify-center rounded-2xl border-2 border-[#E4E4E7] bg-[#FEE2E2] text-[#EF4444] shadow-[0_4px_0_#E4E4E7] disabled:opacity-60"
          aria-label={langue === "ar" ? "مسح" : "Effacer"}
        >
          <Delete size={24} />
        </motion.button>
        <motion.button
          type="button"
          whileTap={disabled || validated ? undefined : { scale: 0.96 }}
          disabled={disabled || validated}
          onClick={() => appendDigit("0")}
          className="col-span-2 flex h-16 items-center justify-center rounded-2xl border-2 border-[#E4E4E7] bg-white text-2xl font-bold shadow-[0_4px_0_#E4E4E7] disabled:opacity-60"
        >
          {formatNumber(0, langue, useArabicDigits)}
        </motion.button>
      </div>

      {!validated && (
        <PrimaryButton onClick={validate} disabled={disabled || !input} className="w-full">
          {langue === "ar" ? "تحقق" : "Valider"}
        </PrimaryButton>
      )}

      {validated && (
        <>
          <FeedbackBlock
            correct={isCorrect}
            message={
              isCorrect
                ? langue === "ar"
                  ? `الجواب الصحيح: ${formatNumber(item.reponse_correcte, langue, useArabicDigits)}`
                  : `Bonne réponse : ${item.reponse_correcte}`
                : langue === "ar"
                  ? `الجواب الصحيح: ${formatNumber(item.reponse_correcte, langue, useArabicDigits)}`
                  : `La bonne réponse est ${item.reponse_correcte}`
            }
            langue={langue}
          />
          <PrimaryButton onClick={onContinue} className="mt-4 w-full">
            {isLast ? (langue === "ar" ? "إنهاء" : "Terminer") : langue === "ar" ? "التالي" : "Suivant"}
            <NavChevron direction="next" langue={langue} />
          </PrimaryButton>
        </>
      )}
    </motion.div>
  );
}

export function ActivityCalculInteractif({
  content,
  langue,
  onAnswer,
  onStepComplete,
  onRecordAnswer,
  disabled,
}: Props) {
  const items = useMemo<CalcItem[]>(() => {
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
            {index + 1} / {items.length}
          </p>
        )}
        <CalculQuestion
          item={items[index]}
          questionIndex={index}
          langue={langue}
          onAnswer={onAnswer}
          onRecordAnswer={onRecordAnswer}
          onContinue={handleContinue}
          disabled={disabled}
          isLast={isLast}
        />
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityCalculInteractif;
