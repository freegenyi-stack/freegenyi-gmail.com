"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TeacherSchoolChild } from "@/lib/library/books.server";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { childId: string; assignLevel: string; note: string; dueAt: string }) => void;
  pending: boolean;
  schoolChildren: TeacherSchoolChild[];
  teacherLevels: string[];
  resourceTitle: string;
  resourceSchoolLevel?: string | null;
};

export default function AtelierAssignStepper({
  open,
  onClose,
  onSubmit,
  pending,
  schoolChildren,
  teacherLevels,
  resourceTitle,
  resourceSchoolLevel,
}: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const [step, setStep] = useState(0);
  const [childId, setChildId] = useState("");
  const [assignLevel, setAssignLevel] = useState(resourceSchoolLevel ?? "");
  const [note, setNote] = useState("");
  const [dueAt, setDueAt] = useState("");

  const visibleChildren = useMemo(() => {
    if (!assignLevel.trim()) return schoolChildren;
    return schoolChildren.filter((c) => c.educationLevel === assignLevel.trim());
  }, [schoolChildren, assignLevel]);

  const targetLabel = childId
    ? schoolChildren.find((c) => String(c.id) === childId)?.fullName ?? "—"
    : assignLevel.trim()
      ? `${t("assignLevel")} ${assignLevel}`
      : t("assignAll");

  if (!open) return null;

  const reset = () => {
    setStep(0);
    setChildId("");
    setAssignLevel(resourceSchoolLevel ?? "");
    setNote("");
    setDueAt("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-black text-slate-900">{t("assignTitle")}</h3>
        </div>
        <p className="mb-4 truncate text-sm font-bold text-violet-800">{resourceTitle}</p>

        <div className="mb-6 flex gap-1">
          {[t("assignStepTarget"), t("assignStepDetails"), t("assignStepConfirm")].map((label, i) => (
            <div
              key={label}
              className={`flex-1 rounded-lg py-1.5 text-center text-[9px] font-black uppercase ${
                i === step ? "bg-violet-600 text-white" : i < step ? "bg-violet-100 text-violet-800" : "bg-slate-100 text-slate-400"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {schoolChildren.length === 0 ? (
          <p className="mb-4 text-sm text-slate-500">{t("noStudents")}</p>
        ) : (
          <>
            {step === 0 && (
              <div className="space-y-3">
                <select
                  value={childId}
                  onChange={(e) => setChildId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
                >
                  <option value="">{t("assignAll")}</option>
                  {visibleChildren.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName}
                      {c.educationLevel ? ` · ${c.educationLevel}` : ""}
                    </option>
                  ))}
                </select>
                {!childId && teacherLevels.length > 0 && (
                  <select
                    value={assignLevel}
                    onChange={(e) => {
                      setAssignLevel(e.target.value);
                      setChildId("");
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
                  >
                    <option value="">{t("assignAllLevels")}</option>
                    {teacherLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("assignNote")}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
                <label className="block text-xs font-bold text-slate-600">
                  {t("assignDueDate")}
                  <input
                    type="date"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2 rounded-xl border border-violet-100 bg-violet-50/50 p-4 text-sm">
                <p>
                  <span className="font-black text-slate-500">{t("assignRecapTarget")}: </span>
                  {targetLabel}
                </p>
                {note.trim() && (
                  <p>
                    <span className="font-black text-slate-500">{t("assignNote")}: </span>
                    {note}
                  </p>
                )}
                {dueAt && (
                  <p>
                    <span className="font-black text-slate-500">{t("assignDueDate")}: </span>
                    {new Date(dueAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (step === 0) {
                reset();
                onClose();
              } else setStep((s) => s - 1);
            }}
          >
            {step === 0 ? t("cancel") : (
              <>
                <ArrowLeft className="mr-1 h-4 w-4" /> {t("assignStepBack")}
              </>
            )}
          </Button>
          {schoolChildren.length > 0 && (
            <Button
              type="button"
              disabled={pending}
              onClick={() => {
                if (step < 2) setStep((s) => s + 1);
                else {
                  onSubmit({ childId, assignLevel, note, dueAt });
                  reset();
                }
              }}
              className="gap-2"
            >
              {step < 2 ? (
                <>
                  {t("assignStepNext")} <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> {t("assignSubmit")}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
