"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import {
  ActivityMotionSection,
  ActivityRoot,
  FeedbackBlock,
  PrimaryButton,
  pickLang,
  shakeAnimation,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, DragDropContent, DragDropElement } from "@/types/activity";
import { cn } from "@/lib/utils";

type Props = {
  content: DragDropContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
};

function DraggableChip({
  element,
  langue,
  isDragging,
}: {
  element: DragDropElement;
  langue: ActivityLang;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: element.id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex cursor-grab items-center gap-2 rounded-2xl border-2 border-[#E4E4E7] bg-white p-3 shadow-md active:cursor-grabbing active:scale-105 active:shadow-lg",
        isDragging && "opacity-40"
      )}
    >
      {element.image_url && (
        <img src={element.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
      )}
      <span className="font-semibold text-[#18181B]">
        {pickLang(element.texte_fr, element.texte_ar, langue)}
      </span>
    </div>
  );
}

function DropZone({
  zoneId,
  label,
  bgColor,
  icon,
  placed,
  isCorrect,
  children,
  className,
  style,
}: {
  zoneId: string;
  label: string;
  bgColor?: string;
  icon?: string;
  placed: DragDropElement | null;
  isCorrect: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: zoneId });

  return (
    <div
      ref={setNodeRef}
      style={{ backgroundColor: bgColor ?? "#FAFAFA", ...style }}
      className={cn(
        "flex min-h-[80px] flex-col items-center justify-center rounded-2xl border-[3px] border-dashed p-4 transition-colors",
        isOver ? "border-[#F97316] bg-[#FEF3C7]" : "border-[#E4E4E7]",
        isCorrect && placed && "border-[#10B981] bg-[#D1FAE5]",
        className
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#3F3F46]">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
        {isCorrect && placed && <CheckCircle2 size={20} className="text-[#10B981]" />}
      </div>
      {placed ? (
        <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
          {placed.image_url && (
            <img src={placed.image_url} alt="" className="h-8 w-8 rounded object-cover" />
          )}
          <span className="font-semibold">{children}</span>
        </div>
      ) : (
        <span className="text-sm text-[#707475]">…</span>
      )}
    </div>
  );
}

export function ActivityDragDrop({ content, langue, onAnswer, onStepComplete, onRecordAnswer, disabled }: Props) {
  const reduceMotion = useReducedMotion();
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [shake, setShake] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  const pool = content.elements.filter((el) => !Object.values(placements).includes(el.id));
  const getElement = (id: string) => content.elements.find((e) => e.id === id);

  const handleDragStart = (event: DragStartEvent) => {
    if (disabled || validated) return;
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (disabled || validated) return;
    const { active, over } = event;
    if (!over) return;

    const element = getElement(String(active.id));
    if (!element) return;

    const zoneId = String(over.id);
    const zoneExists = content.zones.some((z) => z.id === zoneId);
    if (!zoneExists) return;

    if (element.zone_correcte !== zoneId) {
      onAnswer?.(false);
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      return;
    }

    setPlacements((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((z) => {
        if (next[z] === element.id) delete next[z];
      });
      next[zoneId] = element.id;
      return next;
    });
  };

  const validate = () => {
    if (disabled || validated) return;
    const correct = content.elements.every((el) => placements[el.zone_correcte] === el.id);
    setAllCorrect(correct);
    setValidated(true);
    onRecordAnswer?.({ index: 0, answer: { ...placements }, correct });
    onAnswer?.(correct);
    if (correct) onStepComplete?.();
  };

  const allPlaced = content.elements.every((el) =>
    Object.entries(placements).some(([zone, id]) => id === el.id && zone === el.zone_correcte)
  );

  const activeElement = activeId ? getElement(activeId) : null;
  const useCanvas =
    !!content.image_url && content.zones.some((z) => z.x_percent != null && z.y_percent != null);

  const renderZones = () =>
    content.zones.map((zone) => {
      const placedId = placements[zone.id];
      const placed = placedId ? getElement(placedId) : null;
      const isCorrect = placed?.zone_correcte === zone.id;
      return (
        <DropZone
          key={zone.id}
          zoneId={zone.id}
          label={pickLang(zone.label_fr, zone.label_ar, langue)}
          bgColor={zone.couleur_fond}
          icon={zone.icone}
          placed={placed ?? null}
          isCorrect={!!isCorrect && !!placed}
          className={useCanvas ? "absolute" : undefined}
          style={
            useCanvas
              ? {
                  left: `${zone.x_percent ?? 0}%`,
                  top: `${zone.y_percent ?? 0}%`,
                  width: `${zone.width_percent ?? 22}%`,
                  height: `${zone.height_percent ?? 16}%`,
                  minHeight: undefined,
                }
              : undefined
          }
        >
          {placed ? pickLang(placed.texte_fr, placed.texte_ar, langue) : null}
        </DropZone>
      );
    });

  return (
    <ActivityRoot langue={langue}>
      <ActivityMotionSection>
        <motion.div {...(shake ? shakeAnimation(reduceMotion) : {})}>
          <p className="mb-6 text-xl font-bold text-[#18181B] md:text-2xl">
            {pickLang(content.instruction_fr, content.instruction_ar, langue)}
          </p>

          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="mb-6 flex flex-wrap gap-3">
              {pool.map((el) => (
                <DraggableChip key={el.id} element={el} langue={langue} isDragging={activeId === el.id} />
              ))}
            </div>

            <div className={useCanvas ? "relative mb-6 aspect-video w-full overflow-hidden rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA]" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
              {useCanvas && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={content.image_url!} alt="" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
              )}
              {renderZones()}
            </div>

            <DragOverlay>
              {activeElement ? (
                <div className="flex items-center gap-2 rounded-2xl border-2 border-[#F97316] bg-white p-3 shadow-xl">
                  {activeElement.image_url && (
                    <img src={activeElement.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  )}
                  <span className="font-semibold">
                    {pickLang(activeElement.texte_fr, activeElement.texte_ar, langue)}
                  </span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {!validated && (
            <PrimaryButton
              onClick={validate}
              disabled={disabled || !allPlaced}
              className="mt-6 w-full"
            >
              {langue === "ar" ? "تحقق" : "Valider"}
            </PrimaryButton>
          )}

          {validated && (
            <FeedbackBlock
              correct={allCorrect}
              message={
                allCorrect
                  ? langue === "ar"
                    ? "ممتاز! كل العناصر في مكانها."
                    : "Parfait ! Tout est bien classé."
                  : langue === "ar"
                    ? "تحقق من التصنيف."
                    : "Vérifie ton classement."
              }
              langue={langue}
            />
          )}
        </motion.div>
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityDragDrop;
