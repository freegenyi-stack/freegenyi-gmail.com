import type {
  ActivityContentEnvelope,
  ActivityContentPayload,
  ActivityLang,
  ActivityType,
} from "@/types/activity";
import { ACTIVITY_TYPES, H5P_LIBRARY_TO_ACTIVITY } from "./constants";

export function activityLangFromLocale(locale: string): ActivityLang {
  if (locale === "ar" || locale.endsWith("-ar")) return "ar";
  return "fr";
}

export function parseActivityEnvelope(raw: string | null | undefined): ActivityContentEnvelope | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ActivityContentEnvelope;
    if (parsed?.version === 1 && parsed.activityType && parsed.contenu) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function resolveActivityType(
  activityType: string | null | undefined,
  legacyLibrary: string | null | undefined
): ActivityType {
  if (activityType && ACTIVITY_TYPES.some((t) => t.id === activityType)) {
    return activityType as ActivityType;
  }
  if (legacyLibrary) {
    const machine = legacyLibrary.split(" ")[0] ?? legacyLibrary;
    if (H5P_LIBRARY_TO_ACTIVITY[machine]) return H5P_LIBRARY_TO_ACTIVITY[machine];
    if (H5P_LIBRARY_TO_ACTIVITY[legacyLibrary]) return H5P_LIBRARY_TO_ACTIVITY[legacyLibrary];
  }
  return "QCM";
}

export function buildDefaultEnvelope(
  type: ActivityType,
  title: string,
  lang: ActivityLang = "fr"
): ActivityContentEnvelope {
  const contenu = defaultContentForType(type, title, lang);
  return {
    version: 1,
    activityType: type,
    titre_fr: lang === "fr" ? title : title,
    titre_ar: lang === "ar" ? title : title,
    instructions_fr: "",
    instructions_ar: "",
    notation: { notePassage: 50, bareme: 20 },
    regles: {
      autoriserRefaire: true,
      maxTentatives: 3,
      notePassage: 50,
      couleurPrincipale: "#F97316",
      couleurFond: "#FFFBF5",
    },
    contenu,
  };
}

export function defaultContentForType(
  type: ActivityType,
  title: string,
  lang: ActivityLang
): ActivityContentPayload {
  switch (type) {
    case "QCM":
      return {
        type: "QCM",
        question_fr: title || "Question 1",
        question_ar: title || "سؤال 1",
        choix: [
          { id: "a", texte_fr: "Réponse correcte", texte_ar: "إجابة صحيحة", correct: true },
          { id: "b", texte_fr: "Réponse incorrecte", texte_ar: "إجابة خاطئة", correct: false },
        ],
        explication_fr: "",
        explication_ar: "",
      };
    case "VRAI_FAUX":
      return {
        type: "VRAI_FAUX",
        affirmation_fr: title || "Affirmation à valider",
        affirmation_ar: title || "عبارة للتحقق",
        reponse_correcte: true,
      };
    case "FLASHCARDS":
      return {
        type: "FLASHCARDS",
        cartes: [
          {
            id: "c1",
            recto_texte_fr: title || "Mot",
            recto_texte_ar: title || "كلمة",
            verso_texte_fr: "Définition",
            verso_texte_ar: "تعريف",
          },
        ],
      };
    case "MEMORY_GAME":
      return {
        type: "MEMORY_GAME",
        grille: "4x3",
        paires: [
          { id: "p1", carte_a: { type: "texte", valeur: "A" }, carte_b: { type: "texte", valeur: "A" } },
          { id: "p2", carte_a: { type: "texte", valeur: "B" }, carte_b: { type: "texte", valeur: "B" } },
        ],
      };
    case "TEXTE_A_TROUS":
      return {
        type: "TEXTE_A_TROUS",
        mode: "choix",
        texte_fr: "Le chat mange une ___.",
        texte_ar: "القطة تأكل ___.",
        trous: [{ id: "t1", reponse_correcte: "souris", position: 1 }],
        word_bank_fr: ["souris", "pain"],
        word_bank_ar: ["فأر", "خبز"],
      };
    case "DRAG_DROP":
      return {
        type: "DRAG_DROP",
        instruction_fr: "Classe chaque élément.",
        instruction_ar: "صنّف كل عنصر.",
        elements: [
          { id: "e1", texte_fr: "Élément 1", texte_ar: "عنصر 1", zone_correcte: "z1" },
        ],
        zones: [{ id: "z1", label_fr: "Zone 1", label_ar: "منطقة 1" }],
      };
    case "SEQUENCING":
      return {
        type: "SEQUENCING",
        instruction_fr: "Remets dans le bon ordre.",
        instruction_ar: "رتّب بالترتيب الصحيح.",
        elements: [
          { id: "s1", texte_fr: "Étape 1", texte_ar: "خطوة 1", ordre_correct: 1 },
          { id: "s2", texte_fr: "Étape 2", texte_ar: "خطوة 2", ordre_correct: 2 },
        ],
      };
    case "MATCHING":
      return {
        type: "MATCHING",
        instruction_fr: "Relie les paires.",
        instruction_ar: "اربط الأزواج.",
        paires: [
          {
            id: "m1",
            colonne_a: { type: "texte", valeur_fr: "Un", valeur_ar: "واحد" },
            colonne_b: { type: "texte", valeur_fr: "1", valeur_ar: "١" },
          },
        ],
      };
    case "IMAGE_HOTSPOT":
      return {
        type: "IMAGE_HOTSPOT",
        image_url: "/assets/img/regions/DZ/hero.png",
        instruction_fr: "Clique sur la bonne zone.",
        instruction_ar: "انقر على المنطقة الصحيحة.",
        zones: [{ id: "z1", label_fr: "Zone", label_ar: "منطقة", x_percent: 50, y_percent: 50, rayon_percent: 10, correct: true }],
      };
    case "COLORIAGE":
      return {
        type: "COLORIAGE",
        mode: "libre",
        svg_url: "/images/coloring/simple.svg",
        instruction_fr: "Colorie l'image.",
        instruction_ar: "لوّن الصورة.",
        palette: ["#F97316", "#10B981", "#3B82F6", "#EF4444", "#F59E0B"],
      };
    case "LETTRES_MANQUANTES":
      return {
        type: "LETTRES_MANQUANTES",
        mot_fr: "CHAT",
        mot_ar: "قطة",
        lettres_masquees_fr: [2],
        lettres_masquees_ar: [1],
        lettres_disponibles_fr: ["C", "H", "A", "T", "B"],
        lettres_disponibles_ar: ["ق", "ط", "ة", "ب"],
      };
    case "CALCUL_INTERACTIF":
      return {
        type: "CALCUL_INTERACTIF",
        operation: "addition",
        nombre_a: 2,
        nombre_b: 3,
        question_fr: "Combien font 2 + 3 ?",
        question_ar: "كم يساوي ٢ + ٣ ؟",
        reponse_correcte: 5,
        aide_visuelle: true,
      };
    default:
      return defaultContentForType("QCM", title, lang);
  }
}

export function serializeActivityEnvelope(envelope: ActivityContentEnvelope): string {
  return JSON.stringify(envelope);
}
