import type { ActivityAttemptAnswers, ActivityContentEnvelope, ActivityLang } from "@/types/activity";
import { pickLang } from "@/components/activities/activityShared";

export function parseAttemptAnswers(raw: unknown): ActivityAttemptAnswers | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as ActivityAttemptAnswers;
  if (!o.activityType || !Array.isArray(o.entries)) return null;
  return o;
}

type Props = {
  envelope: ActivityContentEnvelope;
  answers: ActivityAttemptAnswers;
  langue: ActivityLang;
};

function formatAnswer(value: ActivityAttemptAnswers["entries"][0]["answer"], langue: ActivityLang): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? (langue === "ar" ? "صحيح" : "Vrai") : langue === "ar" ? "خطأ" : "Faux";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => `${k} → ${v}`)
      .join(" · ");
  }
  return String(value);
}

function expectedForEntry(
  envelope: ActivityContentEnvelope,
  entry: ActivityAttemptAnswers["entries"][0],
  langue: ActivityLang
): string {
  const { activityType, contenu } = envelope;

  if (activityType === "QCM" && contenu.type === "QCM") {
    const questions = contenu.questions?.length ? contenu.questions : [contenu];
    const q = questions[entry.index];
    const correct = q?.choix?.find((c) => c.correct);
    return correct ? pickLang(correct.texte_fr, correct.texte_ar, langue) : "";
  }

  if (activityType === "VRAI_FAUX" && contenu.type === "VRAI_FAUX") {
    const items = contenu.items?.length ? contenu.items : [contenu];
    const item = items[entry.index];
    return item?.reponse_correcte
      ? langue === "ar"
        ? "صحيح"
        : "Vrai"
      : langue === "ar"
        ? "خطأ"
        : "Faux";
  }

  if (activityType === "DRAG_DROP" && contenu.type === "DRAG_DROP") {
    if (entry.index === 0 && typeof entry.answer === "object" && entry.answer && !Array.isArray(entry.answer)) {
      return contenu.elements
        .map((el) => {
          const zone = contenu.zones.find((z) => z.id === el.zone_correcte);
          return `${pickLang(el.texte_fr, el.texte_ar, langue)} → ${zone ? pickLang(zone.label_fr, zone.label_ar, langue) : el.zone_correcte}`;
        })
        .join(" · ");
    }
    const el = contenu.elements[entry.index];
    if (!el) return "";
    const zone = contenu.zones.find((z) => z.id === el.zone_correcte);
    return zone ? pickLang(zone.label_fr, zone.label_ar, langue) : el.zone_correcte;
  }

  if (activityType === "TEXTE_A_TROUS" && contenu.type === "TEXTE_A_TROUS") {
    const sorted = [...contenu.trous].sort((a, b) => a.position - b.position);
    const trou = sorted[entry.index];
    if (!trou) return "";
    return langue === "ar" && trou.reponse_correcte_ar ? trou.reponse_correcte_ar : trou.reponse_correcte;
  }

  if (activityType === "SEQUENCING" && contenu.type === "SEQUENCING") {
    return [...contenu.elements]
      .sort((a, b) => a.ordre_correct - b.ordre_correct)
      .map((el) => pickLang(el.texte_fr, el.texte_ar, langue))
      .join(" → ");
  }

  if (activityType === "MATCHING" && contenu.type === "MATCHING") {
    const pair = contenu.paires[entry.index];
    if (!pair) return "";
    const b =
      pair.colonne_b.type === "image"
        ? pair.colonne_b.valeur ?? ""
        : pickLang(pair.colonne_b.valeur_fr ?? "", pair.colonne_b.valeur_ar ?? "", langue);
    return b;
  }

  if (activityType === "IMAGE_HOTSPOT" && contenu.type === "IMAGE_HOTSPOT") {
    const zone = contenu.zones.find((z) => z.id === entry.questionId && z.correct);
    return zone ? pickLang(zone.label_fr, zone.label_ar, langue) : "";
  }

  if (activityType === "COLORIAGE" && contenu.type === "COLORIAGE") {
    const zone = contenu.zones_guidees?.find((z) => z.zone_id === entry.questionId);
    return zone?.couleur_correcte ?? "";
  }

  if (activityType === "LETTRES_MANQUANTES" && contenu.type === "LETTRES_MANQUANTES") {
    return pickLang(contenu.mot_fr, contenu.mot_ar, langue);
  }

  if (activityType === "CALCUL_INTERACTIF" && contenu.type === "CALCUL_INTERACTIF") {
    const items = contenu.items?.length ? contenu.items : [contenu];
    const item = items[entry.index];
    return item ? String(item.reponse_correcte) : "";
  }

  if (activityType === "FLASHCARDS" && contenu.type === "FLASHCARDS") {
    const carte = contenu.cartes[entry.index];
    return carte ? pickLang(carte.verso_texte_fr, carte.verso_texte_ar, langue) : "";
  }

  if (activityType === "MEMORY_GAME" && contenu.type === "MEMORY_GAME") {
    return `${contenu.paires.length} ${langue === "ar" ? "أزواج" : "paires"}`;
  }

  return "";
}

export default function ActivityAttemptAnswersPanel({ envelope, answers, langue }: Props) {
  const title = langue === "ar" ? "إجابات التلميذ" : "Réponses de l'élève";

  return (
    <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50/80 p-5">
      <h3 className="mb-4 text-lg font-black text-sky-900">{title}</h3>
      <ul className="space-y-3">
        {answers.entries.map((entry) => {
          const expected = expectedForEntry(envelope, entry, langue);

          return (
            <li
              key={`${entry.index}-${entry.questionId ?? "q"}`}
              className="rounded-xl border border-sky-100 bg-white px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase text-sky-700">
                  {langue === "ar" ? `س${entry.index + 1}` : `Q${entry.index + 1}`}
                </span>
                {entry.correct != null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                      entry.correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {entry.correct ? (langue === "ar" ? "صحيح" : "Correct") : langue === "ar" ? "خطأ" : "Incorrect"}
                  </span>
                )}
              </div>
              {entry.label && <p className="mt-1 font-bold text-slate-800">{entry.label}</p>}
              <p className="mt-1 text-slate-700">
                <span className="font-black text-slate-500">{langue === "ar" ? "إجابة: " : "Réponse : "}</span>
                {formatAnswer(entry.answer, langue)}
              </p>
              {expected && (
                <p className="mt-1 text-xs text-slate-500">
                  <span className="font-black">{langue === "ar" ? "المتوقع: " : "Attendu : "}</span>
                  {expected}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
