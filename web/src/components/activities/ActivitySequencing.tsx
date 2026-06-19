"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, useReducedMotion } from "framer-motion";
import { GripVertical } from "lucide-react";
import {
  ActivityMotionSection,
  ActivityRoot,
  FeedbackBlock,
  PrimaryButton,
  pickLang,
  shuffleArray,
  successPulse,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, SequencingContent, SequencingItem } from "@/types/activity";
import { cn } from "@/lib/utils";

type Props = {
  content: SequencingContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
};

function SortableCard({
  item,
  langue,
  disabled,
  highlight,
}: {
  item: SequencingItem;
  langue: ActivityLang;
  disabled?: boolean;
  highlight?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-2xl border-2 border-[#E4E4E7] bg-white p-4 shadow-sm",
        isDragging && "z-50 scale-105 border-[#F97316] bg-[#FFFBF5] shadow-xl",
        highlight && "border-[#10B981] bg-[#D1FAE5]"
      )}
    >
      <button
        type="button"
        className="flex min-h-[48px] min-w-[48px] cursor-grab items-center justify-center text-[#A1A1AA] active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label={langue === "ar" ? "اسحب" : "Glisser"}
      >
        <GripVertical size={22} />
      </button>
      {item.image_url && (
        <img src={item.image_url} alt="" className="h-12 w-12 rounded-xl object-cover" />
      )}
      <span className="flex-1 text-lg font-semibold text-[#18181B]">
        {pickLang(item.texte_fr, item.texte_ar, langue)}
      </span>
    </div>
  );
}

export function ActivitySequencing({ content, langue, onAnswer, onStepComplete, onRecordAnswer, disabled }: Props) {
  const reduceMotion = useReducedMotion();
  const initialOrder = useMemo(
    () => shuffleArray(content.elements),
    [content.elements]
  );
  const [items, setItems] = useState(initialOrder);
  const [validated, setValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const correctOrder = [...content.elements].sort((a, b) => a.ordre_correct - b.ordre_correct);

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled || validated) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((current) => {
      const oldIndex = current.findIndex((i) => i.id === active.id);
      const newIndex = current.findIndex((i) => i.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const verify = () => {
    if (disabled || validated) return;
    const correct = items.every((item, idx) => item.id === correctOrder[idx]?.id);
    onRecordAnswer?.({
      index: 0,
      label: pickLang(content.instruction_fr, content.instruction_ar, langue),
      answer: items.map((i) => pickLang(i.texte_fr, i.texte_ar, langue)).join(" → "),
      correct,
    });
    setIsCorrect(correct);
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

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <motion.div
              className="flex flex-col gap-3"
              {...(validated && isCorrect ? successPulse(reduceMotion) : {})}
            >
              {items.map((item) => (
                <SortableCard
                  key={item.id}
                  item={item}
                  langue={langue}
                  disabled={disabled || validated}
                  highlight={validated && isCorrect}
                />
              ))}
            </motion.div>
          </SortableContext>
        </DndContext>

        {!validated && (
          <PrimaryButton onClick={verify} disabled={disabled} className="mt-6 w-full">
            {langue === "ar" ? "تحقق" : "Vérifier"}
          </PrimaryButton>
        )}

        {validated && (
          <FeedbackBlock
            correct={isCorrect}
            message={
              isCorrect
                ? langue === "ar"
                  ? "ترتيب صحيح!"
                  : "Ordre correct !"
                : langue === "ar"
                  ? "الترتيب غير صحيح."
                  : "L'ordre n'est pas correct."
            }
            langue={langue}
          />
        )}
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivitySequencing;
