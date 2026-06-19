/** Convertit les paramètres de l'assistant en contenu jouable sur le moteur interactif. */
import { H5P_ASSISTANT_TYPES } from "./constants";

export function isAssistantH5pLibrary(library: string | null | undefined): boolean {
  if (!library) return false;
  const machine = library.split(" ")[0] ?? library;
  return H5P_ASSISTANT_TYPES.some((t) => t.library === machine);
}

/** Paramètres sûrs pour création / resynchronisation (expert = vide, assistant = modèle). */
export function buildH5pContentParams(
  library: string,
  assistantParams: Record<string, unknown>,
  instructions?: string,
  title?: string
): Record<string, unknown> {
  if (!isAssistantH5pLibrary(library)) return {};
  return buildAssistantH5pParams(library, assistantParams, instructions, title);
}

export function buildAssistantH5pParams(
  library: string,
  assistantParams: Record<string, unknown>,
  instructions?: string,
  title?: string
): Record<string, unknown> {
  const intro = instructions?.trim() || "";
  const machine = library.split(" ")[0] ?? library;

  if (machine === "H5P.QuestionSet") {
    const count = Math.min(50, Math.max(1, Number(assistantParams.questionsCount) || 3));
    const questions = Array.from({ length: count }, (_, i) => ({
      library: "H5P.MultiChoice 1.16",
      params: {
        question: intro ? `${intro} (${i + 1})` : `Question ${i + 1}`,
        answers: [
          { text: "Réponse correcte", correct: true },
          { text: "Réponse incorrecte", correct: false },
        ],
      },
      metadata: { title: `Question ${i + 1}`, license: "U" },
    }));
    return {
      introPage: {
        showIntroPage: Boolean(intro || title),
        title: title || "Quiz",
        introduction: intro || title || "",
      },
      questions,
      passPercentage: 50,
      randomQuestions: false,
    };
  }

  if (machine === "H5P.Blanks") {
    const text = String(assistantParams.text ?? "").trim() || "*mot*";
    return { text, media: { disableImageZooming: false } };
  }

  if (machine === "H5P.TrueFalse") {
    const statement = String(assistantParams.statement ?? "").trim() || intro || "Affirmation à valider";
    return {
      question: statement,
      correct: "true",
    };
  }

  if (machine === "H5P.DragQuestion") {
    const label = String(assistantParams.label ?? (intro || title || "Glisser ici")).trim();
    const dragLib = library.includes(" ") ? library : "H5P.DragQuestion";
    return {
      question: { settings: { questionTitle: label } },
      dropZones: [{ label: "Zone 1", x: 10, y: 10, width: 20, height: 10 }],
      elements: [{ type: { library: dragLib }, x: 50, y: 50, width: 10, height: 5, dropZones: ["0"] }],
    };
  }

  if (machine === "H5P.Flashcards") {
    const raw = String(assistantParams.cards ?? assistantParams.text ?? "").trim();
    const lines = raw
      ? raw.split("\n").filter(Boolean)
      : ["Recto | Verso", "Mot | Définition"];
    const cards = lines.map((line) => {
      const [front, back] = line.split("|").map((s) => s.trim());
      return { text: front || line, answer: back || front || line };
    });
    return { cards, description: intro || title || "" };
  }

  if (machine === "H5P.InteractiveVideo") {
    const videoUrl = String(assistantParams.videoUrl ?? "").trim();
    return {
      interactiveVideo: {
        video: {
          files: videoUrl ? [{ path: videoUrl, mime: "video/YouTube", copyright: { license: "U" } }] : [],
        },
        assets: { interactions: [], bookmarks: [], endscreens: [] },
        summary: intro ? { task: { library: "H5P.FreeTextQuestion 1.0", params: { question: intro } } } : undefined,
      },
    };
  }

  return {};
}
