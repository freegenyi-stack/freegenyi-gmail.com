import { randomBytes } from "crypto";
import type {
  ChildSessionPayload,
  CurriculumProfile,
  ExerciseBankItem,
  ResolvedExerciseItem,
  SessionSource,
} from "./types";
import type { LoadedBundle } from "./loader.server";
import { competencyLabel, exercisesForCompetency } from "./loader.server";

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function applyTemplates(item: ExerciseBankItem): ResolvedExerciseItem {
  const vars = item.templateVars ?? {};
  const resolved: Record<string, string> = {};
  for (const [key, values] of Object.entries(vars)) {
    resolved[key] = pickOne(values);
  }

  const replace = (s: string) =>
    s.replace(/\{\{(\w+)\}\}/g, (_, k: string) => resolved[k] ?? `{{${k}}}`);

  let statementFr = item.statementFr ? replace(item.statementFr) : "";
  let statementAr = item.statementAr ? replace(item.statementAr) : statementFr;

  let correctAnswer: string | boolean =
    typeof item.correctAnswer === "boolean"
      ? item.correctAnswer
      : replace(String(item.correctAnswer));

  if (typeof item.correctAnswer === "string" && item.correctAnswer.includes("{{")) {
    correctAnswer = replace(item.correctAnswer);
  }

  return {
    itemId: `${item.id}_${randomBytes(3).toString("hex")}`,
    type: item.type,
    statementFr,
    statementAr,
    optionsFr: item.optionsFr,
    optionsAr: item.optionsAr,
    correctAnswer,
    explanationFr: item.explanationFr,
    feedbackCorrect: item.feedback?.correctFr,
    feedbackIncorrect: item.feedback?.incorrectFr,
    points: item.points,
  };
}

/** Une variante par variantGroup — énoncés différents à chaque session. */
export function pickExerciseSet(
  items: ExerciseBankItem[],
  opts?: { min?: number; max?: number }
): ResolvedExerciseItem[] {
  const min = opts?.min ?? 4;
  const max = opts?.max ?? 8;
  const byGroup = new Map<string, ExerciseBankItem[]>();
  for (const item of items) {
    const g = item.variantGroup;
    if (!byGroup.has(g)) byGroup.set(g, []);
    byGroup.get(g)!.push(item);
  }

  const groups = [...byGroup.keys()].sort(() => Math.random() - 0.5);
  const selected: ExerciseBankItem[] = [];
  for (const g of groups) {
    if (selected.length >= max) break;
    selected.push(pickOne(byGroup.get(g)!));
  }

  while (selected.length < min && groups.length > 0) {
    const g = pickOne(groups);
    selected.push(pickOne(byGroup.get(g)!));
  }

  return selected.map(applyTemplates);
}

export function buildSessionPayload(input: {
  bundle: LoadedBundle;
  competencyId: string;
  source: SessionSource;
  profile?: CurriculumProfile;
  itemsMin?: number;
  itemsMax?: number;
  meta?: ChildSessionPayload["meta"];
}): ChildSessionPayload | { error: string } {
  const profile =
    input.profile ??
    (input.source === "parent_geny"
      ? "parent"
      : input.source === "official_path"
        ? "official_path"
        : "teacher");

  const pool = exercisesForCompetency(input.bundle, input.competencyId, profile);
  if (pool.length === 0) {
    return { error: "no_exercises_for_competency" };
  }

  const items = pickExerciseSet(pool, { min: input.itemsMin, max: input.itemsMax });
  const labels = competencyLabel(input.bundle, input.competencyId);
  const xpReward = items.reduce((s, i) => s + i.points, 0);

  return {
    sessionId: `sess_${randomBytes(8).toString("hex")}`,
    payloadVersion: 1,
    source: input.source,
    profile: "child",
    country: input.bundle.country,
    level: input.bundle.level,
    subject: input.bundle.subject,
    competencyId: input.competencyId,
    titleFr: labels.titleFr,
    titleAr: labels.titleAr,
    xpReward,
    items,
    meta: input.meta,
  };
}
