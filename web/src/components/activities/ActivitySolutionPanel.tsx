"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { pickLang } from "./activityShared";
import type { ActivityContentEnvelope, ActivityLang, ActivityType } from "@/types/activity";

type Props = {
  envelope: ActivityContentEnvelope;
  langue: ActivityLang;
  score: number;
};

function qcmItems(contenu: ActivityContentEnvelope["contenu"]) {
  if (contenu.type !== "QCM") return [];
  if ("questions" in contenu && contenu.questions?.length) return contenu.questions;
  const { type: _t, questions: _q, ...single } = contenu;
  return [single];
}

function vraiFauxItems(contenu: ActivityContentEnvelope["contenu"]) {
  if (contenu.type !== "VRAI_FAUX") return [];
  if ("items" in contenu && contenu.items?.length) return contenu.items;
  const { type: _t, items: _i, ...single } = contenu;
  return [single];
}

export default function ActivitySolutionPanel({ envelope, langue, score }: Props) {
  const type = envelope.activityType as ActivityType;
  const title =
    langue === "ar"
      ? envelope.titre_ar || envelope.titre_fr || ""
      : envelope.titre_fr || envelope.titre_ar || "";

  if (type === "QCM") {
    const items = qcmItems(envelope.contenu);
    return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
        <h3 className="text-lg font-black text-emerald-900">
          {langue === "ar" ? "الحلول والتصحيح" : "Corrections"}
        </h3>
        <p className="mt-1 text-sm font-bold text-emerald-800">
          {langue === "ar" ? `نتيجتك: ${score}%` : `Votre score : ${score}%`}
        </p>
        <ol className="mt-4 space-y-4">
          {items.map((q, i) => {
            const correct = q.choix.find((c) => c.correct);
            const explanation = pickLang(q.explication_fr ?? "", q.explication_ar ?? "", langue);
            return (
              <li key={i} className="rounded-xl border border-emerald-100 bg-white p-4">
                <p className="text-sm font-black text-slate-500">
                  {langue === "ar" ? `س${i + 1}` : `Q${i + 1}`}
                </p>
                <p className="mt-1 font-bold text-slate-900">
                  {pickLang(q.question_fr, q.question_ar, langue)}
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {correct ? pickLang(correct.texte_fr, correct.texte_ar, langue) : "—"}
                </p>
                {explanation ? (
                  <p className="mt-2 text-sm text-slate-600">{explanation}</p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (type === "VRAI_FAUX") {
    const items = vraiFauxItems(envelope.contenu);
    return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
        <h3 className="text-lg font-black text-emerald-900">
          {langue === "ar" ? "الحلول والتصحيح" : "Corrections"}
        </h3>
        <p className="mt-1 text-sm font-bold text-emerald-800">
          {langue === "ar" ? `نتيجتك: ${score}%` : `Votre score : ${score}%`}
        </p>
        <ol className="mt-4 space-y-4">
          {items.map((item, i) => {
            const explanation = pickLang(item.explication_fr ?? "", item.explication_ar ?? "", langue);
            const label = item.reponse_correcte
              ? langue === "ar"
                ? "صحيح"
                : "Vrai"
              : langue === "ar"
                ? "خطأ"
                : "Faux";
            return (
              <li key={i} className="rounded-xl border border-emerald-100 bg-white p-4">
                <p className="font-bold text-slate-900">
                  {pickLang(item.affirmation_fr, item.affirmation_ar, langue)}
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                  {item.reponse_correcte ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-600" />
                  )}
                  {label}
                </p>
                {explanation ? (
                  <p className="mt-2 text-sm text-slate-600">{explanation}</p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
      <h3 className="text-lg font-black text-emerald-900">
        {langue === "ar" ? "تم الإرسال" : "Activité soumise"}
      </h3>
      {title ? <p className="mt-1 font-bold text-slate-800">{title}</p> : null}
      <p className="mt-2 text-sm font-bold text-emerald-800">
        {langue === "ar" ? `نتيجتك: ${score}%` : `Votre score : ${score}%`}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        {langue === "ar"
          ? "تم إرسال نتيجتك إلى معلمك."
          : "Votre résultat a été envoyé à votre enseignant."}
      </p>
    </div>
  );
}
