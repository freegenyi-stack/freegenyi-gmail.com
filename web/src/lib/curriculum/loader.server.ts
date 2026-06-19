import fs from "fs/promises";
import path from "path";
import {
  BUNDLE_FILES,
  bundleKey,
  levelDir,
  manifestPath,
  registryPath,
  subjectDir,
} from "./paths";
import type {
  ChildPathNode,
  ChildPathResponse,
  CompetencyRecord,
  CurriculumCountry,
  CurriculumLevel,
  CurriculumNode,
  CurriculumProfile,
  CurriculumSubject,
  ExerciseBankItem,
  PathNodeStatus,
} from "./types";

export type LoadedBundle = {
  key: string;
  country: CurriculumCountry;
  level: CurriculumLevel;
  subject: CurriculumSubject;
  moduleId: string;
  version: number;
  nodes: CurriculumNode[];
  competencies: CompetencyRecord[];
  exercises: ExerciseBankItem[];
  raw: {
    curriculum: unknown;
    competences: unknown;
    exercise_bank: unknown;
    evaluations: unknown;
  };
};

function extractNodes(curriculum: Record<string, unknown>): CurriculumNode[] {
  const nodes: CurriculumNode[] = [];
  const maqaate = (curriculum.maqaate as { nodes?: CurriculumNode[]; maqtaId?: string }[]) ?? [];
  for (const mq of maqaate) {
    for (const n of mq.nodes ?? []) {
      nodes.push({ ...n, maqtaId: n.maqtaId ?? mq.maqtaId });
    }
  }
  const trimesters = (curriculum.trimesters as { nodes?: CurriculumNode[] }[]) ?? [];
  for (const tr of trimesters) {
    for (const n of tr.nodes ?? []) {
      nodes.push(n);
    }
  }
  return nodes.sort((a, b) => a.order - b.order);
}

export async function loadBundleFromFiles(
  country: CurriculumCountry,
  level: CurriculumLevel,
  subject: CurriculumSubject
): Promise<LoadedBundle | null> {
  const dir = subjectDir(country, level, subject);
  try {
    await fs.access(dir);
  } catch {
    return null;
  }

  const read = async (file: string) =>
    JSON.parse(await fs.readFile(path.join(dir, file), "utf8")) as Record<string, unknown>;

  const [curriculum, competences, exercise_bank, evaluations] = await Promise.all(
    BUNDLE_FILES.map((f) => read(f))
  );

  const meta = (curriculum.metadata ?? {}) as Record<string, string | number>;
  const moduleId = String(meta.moduleId ?? bundleKey(country, level, subject));
  const version = Number(meta.version ?? 1);

  return {
    key: bundleKey(country, level, subject),
    country,
    level,
    subject,
    moduleId,
    version,
    nodes: extractNodes(curriculum),
    competencies: ((competences.competencies as CompetencyRecord[]) ?? []),
    exercises: ((exercise_bank.items as ExerciseBankItem[]) ?? []),
    raw: { curriculum, competences, exercise_bank, evaluations },
  };
}

export async function listLevelSubjects(
  country: CurriculumCountry,
  level: CurriculumLevel
): Promise<CurriculumSubject[]> {
  const dir = levelDir(country, level);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name as CurriculumSubject);
}

export async function loadRegistry(country: CurriculumCountry) {
  const raw = await fs.readFile(registryPath(country), "utf8");
  return JSON.parse(raw) as {
    levels: { code: CurriculumLevel; status: string; subjects?: { code: CurriculumSubject }[] }[];
  };
}

export async function loadManifest<T>(profile: "parent" | "teacher" | "child-mobile", country: CurriculumCountry) {
  const raw = await fs.readFile(manifestPath(profile, country), "utf8");
  return JSON.parse(raw) as T;
}

export function exercisesForCompetency(
  bundle: LoadedBundle,
  competencyId: string,
  profile: CurriculumProfile
): ExerciseBankItem[] {
  return bundle.exercises.filter(
    (ex) => ex.competencyId === competencyId && ex.profiles.includes(profile)
  );
}

/** Parcours Duolingo — statuts depuis progression enfant (DB ou défaut séquentiel). */
export function buildPathResponse(
  bundle: LoadedBundle,
  completedNodeIds: Set<string> = new Set(),
  inProgressNodeId: string | null = null
): ChildPathResponse {
  const nodes: ChildPathNode[] = bundle.nodes.map((n, idx) => {
    let status: PathNodeStatus = "locked";
    if (completedNodeIds.has(n.nodeId)) status = "mastered";
    else if (n.nodeId === inProgressNodeId) status = "in_progress";
    else if (idx === 0 || completedNodeIds.has(bundle.nodes[idx - 1]?.nodeId ?? "")) {
      status = "available";
    }
    const stars = status === "mastered" ? (3 as const) : (0 as const);
    return {
      nodeId: n.nodeId,
      competencyId: n.nodeId,
      titreFr: n.titreFr,
      titreAr: n.titreAr,
      domaine: n.domaine,
      order: n.order,
      status,
      stars,
    };
  });

  const current =
    nodes.find((n) => n.status === "in_progress")?.nodeId ??
    nodes.find((n) => n.status === "available")?.nodeId ??
    null;

  return {
    country: bundle.country,
    level: bundle.level,
    subject: bundle.subject,
    moduleId: bundle.moduleId,
    nodes,
    currentNodeId: current,
  };
}

export function competencyLabel(bundle: LoadedBundle, competencyId: string) {
  const c = bundle.competencies.find((x) => x.competencyId === competencyId);
  const n = bundle.nodes.find((x) => x.nodeId === competencyId);
  return {
    titleFr: c?.nameFr ?? n?.titreFr ?? competencyId,
    titleAr: c?.nameAr ?? n?.titreAr ?? competencyId,
  };
}
