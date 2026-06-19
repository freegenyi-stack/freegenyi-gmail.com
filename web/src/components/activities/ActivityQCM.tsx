"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  ActivityMotionSection,
  ActivityRoot,
  AudioButton,
  FeedbackBlock,
  NavChevron,
  PrimaryButton,
  pickLang,
  successPulse,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, QcmContent } from "@/types/activity";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"];

type Props = {
  content: QcmContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
  hideCorrections?: boolean;
};

type QuestionItem = Omit<QcmContent, "type" | "questions">;

function QcmQuestion({
  question,
  questionIndex,
  langue,
  onAnswer,
  onStepComplete,
  onRecordAnswer,
  disabled,
  hideCorrections,
  isLast,
}: {
  question: QuestionItem;
  questionIndex: number;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
  hideCorrections?: boolean;
  isLast: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const correctChoice = question.choix.find((c) => c.correct);
  const isCorrect = selectedId === correctChoice?.id;

  const validate = () => {
    if (!selectedId || disabled || validated) return;
    setValidated(true);
    setShowFeedback(true);
    onRecordAnswer?.({
      index: questionIndex,
      label: pickLang(question.question_fr, question.question_ar, langue),
      answer: selectedId,
      correct: isCorrect,
    });
    onAnswer?.(isCorrect);
  };

  const next = () => {
    onStepComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <h2 className="flex-1 text-2xl font-bold text-[#18181B] md:text-3xl">
          {pickLang(question.question_fr, question.question_ar, langue)}
        </h2>
        <AudioButton
          url={question.question_audio_url}
          label={langue === "ar" ? "تشغيل السؤال" : "Lire la question"}
        />
      </div>

      {question.question_image_url && (
        <img
          src={question.question_image_url}
          alt=""
          className="mx-auto max-h-48 rounded-3xl object-contain shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
        />
      )}

      <div className="flex flex-col gap-3">
        {question.choix.map((choice, index) => {
          const selected = selectedId === choice.id;
          const showResult = validated && showFeedback;
          const isChoiceCorrect = choice.correct;
          let stateClass =
            "border-[#E4E4E7] bg-white shadow-[0_4px_0_#E4E4E7]";
          if (!hideCorrections && showResult && isChoiceCorrect) {
            stateClass = "border-[#10B981] bg-[#D1FAE5] shadow-[0_4px_0_#059669]";
          } else if (!hideCorrections && showResult && selected && !isChoiceCorrect) {
            stateClass = "border-[#EF4444] bg-[#FEE2E2] shadow-[0_4px_0_#DC2626]";
          } else if (selected && !validated) {
            stateClass = "border-[#F97316] bg-[#FEF3C7] shadow-[0_0_0_3px_#F97316]";
          }

          return (
            <motion.button
              key={choice.id}
              type="button"
              whileTap={disabled || validated ? undefined : { scale: 0.96 }}
              disabled={disabled || validated}
              onClick={() => setSelectedId(choice.id)}
              className={cn(
                "flex min-h-[64px] w-full items-center gap-3 rounded-2xl border-2 px-5 py-4 text-xl font-semibold text-[#18181B] transition-all duration-100 select-none active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-60",
                stateClass,
                langue === "ar" ? "text-right" : "text-left"
              )}
              {...(showResult && !hideCorrections && isChoiceCorrect ? successPulse(reduceMotion) : {})}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-black text-white",
                  showResult && !hideCorrections && isChoiceCorrect
                    ? "bg-[#10B981]"
                    : showResult && !hideCorrections && selected && !isChoiceCorrect
                      ? "bg-[#EF4444]"
                      : "bg-[#F97316]"
                )}
              >
                {LETTERS[index] ?? "?"}
              </span>
              <span className="flex-1">{pickLang(choice.texte_fr, choice.texte_ar, langue)}</span>
              {showResult && !hideCorrections && isChoiceCorrect && <CheckCircle2 className="text-[#10B981]" size={28} />}
              {showResult && !hideCorrections && selected && !isChoiceCorrect && <XCircle className="text-[#EF4444]" size={28} />}
            </motion.button>
          );
        })}
      </div>

      {!validated && selectedId && (
        <PrimaryButton onClick={validate} disabled={disabled} className="w-full">
          {langue === "ar" ? "تحقق" : "Valider"}
        </PrimaryButton>
      )}

      {showFeedback && !hideCorrections && (
        <>
          <FeedbackBlock
            correct={isCorrect}
            message={pickLang(question.explication_fr ?? "", question.explication_ar ?? "", langue)}
            langue={langue}
          />
          <PrimaryButton onClick={next} className="w-full">
            {isLast
              ? langue === "ar"
                ? "إنهاء"
                : "Terminer"
              : langue === "ar"
                ? "التالي"
                : "Suivant"}
            <NavChevron direction="next" langue={langue} />
          </PrimaryButton>
        </>
      )}

      {showFeedback && hideCorrections && (
        <PrimaryButton onClick={next} className="w-full">
          {isLast
            ? langue === "ar"
              ? "إنهاء"
              : "Terminer"
            : langue === "ar"
              ? "التالي"
              : "Suivant"}
          <NavChevron direction="next" langue={langue} />
        </PrimaryButton>
      )}
    </div>
  );
}

export function ActivityQCM({ content, langue, onAnswer, onStepComplete, onRecordAnswer, disabled, hideCorrections }: Props) {
  const questions = useMemo<QuestionItem[]>(() => {
    if (content.questions?.length) return content.questions;
    const { type: _t, questions: _q, ...single } = content;
    return [single];
  }, [content]);

  const [index, setIndex] = useState(0);
  const current = questions[index];
  const isLast = index >= questions.length - 1;

  const handleStepComplete = () => {
    if (isLast) {
      onStepComplete?.();
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <ActivityRoot langue={langue}>
      <ActivityMotionSection key={index}>
        {questions.length > 1 && (
          <p className="mb-4 text-sm font-semibold text-[#3F3F46]">
            {langue === "ar"
              ? `السؤال ${index + 1} / ${questions.length}`
              : `Question ${index + 1} / ${questions.length}`}
          </p>
        )}
        <QcmQuestion
          question={current}
          questionIndex={index}
          langue={langue}
          onAnswer={onAnswer}
          onStepComplete={handleStepComplete}
          onRecordAnswer={onRecordAnswer}
          disabled={disabled}
          hideCorrections={hideCorrections}
          isLast={isLast}
        />
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityQCM;
