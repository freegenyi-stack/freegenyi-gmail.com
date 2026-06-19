import fs from "fs/promises";
import path from "path";
import type { LoadedBundle } from "./loader.server";
import { loadBundleFromFiles, listLevelSubjects } from "./loader.server";
import { buildPathResponse } from "./loader.server";
import type {
  ContentKind,
  CurriculumCountry,
  CurriculumLessonRecord,
  CurriculumLevel,
  CurriculumSubject,
  ProgramHubResponse,
  ProgramSectionDetail,
} from "./types";
import { subjectDir } from "./paths";

type MaqtaRaw = {
  maqtaId: string;
  order: number;
  titreFr: string;
  titreAr?: string;
  status?: string;
  worldTheme?: { id: string };
  blocks?: {
    blockId: string;
    domaine: string;
    titreFr: string;
    titreAr?: string;
    contentKinds?: string[];
  }[];
  units?: {
    unitId: string;
    blockId?: string;
    titreFr: string;
    titreAr?: string;
    pageRef?: number;
    contentKind?: string;
    lessonId?: string;
  }[];
  nodes?: { nodeId: string; unitId?: string; order: number }[];
};

async function loadLessons(
  country: CurriculumCountry,
  level: CurriculumLevel,
  subject: CurriculumSubject
): Promise<Map<string, CurriculumLessonRecord>> {
  const file = path.join(subjectDir(country, level, subject), "lessons.json");
  try {
    const raw = JSON.parse(await fs.readFile(file, "utf8")) as {
      lessons?: CurriculumLessonRecord[];
    };
    return new Map((raw.lessons ?? []).map((l) => [l.unitId, l]));
  } catch {
    return new Map();
  }
}

function exerciseCountByMaqta(bundle: LoadedBundle, maqtaId: string): number {
  const compIds = new Set(
    bundle.competencies.filter((c) => c.maqtaId === maqtaId).map((c) => c.competencyId)
  );
  return bundle.exercises.filter((e) => compIds.has(e.competencyId)).length;
}

export async function buildProgramHub(
  country: CurriculumCountry,
  level: CurriculumLevel
): Promise<ProgramHubResponse | null> {
  const subjects = await listLevelSubjects(country, level);
  const hubSubjects: ProgramHubResponse["subjects"] = [];
  let enrichment: ProgramHubResponse["enrichment"] = null;
  let contentFilters: ProgramHubResponse["contentFilters"] = [];

  for (const subject of subjects) {
    const bundle = await loadBundleFromFiles(country, level, subject);
    if (!bundle) continue;

    const curriculum = bundle.raw.curriculum as Record<string, unknown>;
    const meta = (curriculum.metadata ?? {}) as Record<string, string>;
    const maqaate = (curriculum.maqaate as MaqtaRaw[]) ?? [];

    if (!contentFilters.length && Array.isArray(curriculum.contentFilters)) {
      contentFilters = curriculum.contentFilters as ProgramHubResponse["contentFilters"];
    }

    if (!enrichment && curriculum.enrichment) {
      const e = curriculum.enrichment as ProgramHubResponse["enrichment"];
      enrichment = e;
    }

    hubSubjects.push({
      code: subject,
      labelFr: meta.labelFr ?? subject,
      labelAr: meta.labelAr,
      moduleId: bundle.moduleId,
      sections: maqaate.map((mq) => ({
        maqtaId: mq.maqtaId,
        order: mq.order,
        titreFr: mq.titreFr,
        titreAr: mq.titreAr,
        status: mq.status,
        unitCount: mq.units?.length ?? 0,
        nodeCount: mq.nodes?.length ?? 0,
        exerciseCount: exerciseCountByMaqta(bundle, mq.maqtaId),
        worldThemeId: mq.worldTheme?.id,
      })),
    });
  }

  if (hubSubjects.length === 0) return null;

  const levelLabels: Record<CurriculumLevel, { fr: string; ar: string }> = {
    "1AP": { fr: "1ère année primaire", ar: "السنة الأولى ابتدائي" },
    "2AP": { fr: "2ème année primaire", ar: "السنة الثانية ابتدائي" },
    "3AP": { fr: "3ème année primaire", ar: "السنة الثالثة ابتدائي" },
    "4AP": { fr: "4ème année primaire", ar: "السنة الرابعة ابتدائي" },
    "5AP": { fr: "5ème année primaire", ar: "السنة الخامسة ابتدائي" },
  };

  return {
    country,
    level,
    labelFr: levelLabels[level].fr,
    labelAr: levelLabels[level].ar,
    subjects: hubSubjects,
    enrichment,
    contentFilters: contentFilters.length
      ? contentFilters
      : [
          { id: "all", labelFr: "Tout", labelAr: "الكل" },
          { id: "lesson", labelFr: "Leçons", labelAr: "الدروس" },
          { id: "surah", labelFr: "Sourates", labelAr: "السور" },
          { id: "mahfoudat", labelFr: "Mahfoudat", labelAr: "المحفوظات" },
          { id: "exercise", labelFr: "Exercices", labelAr: "التمارين" },
          { id: "project", labelFr: "Projets", labelAr: "المشاريع" },
        ],
  };
}

export async function buildProgramSectionDetail(
  country: CurriculumCountry,
  level: CurriculumLevel,
  subject: CurriculumSubject,
  maqtaId: string
): Promise<ProgramSectionDetail | null> {
  const bundle = await loadBundleFromFiles(country, level, subject);
  if (!bundle) return null;

  const curriculum = bundle.raw.curriculum as Record<string, unknown>;
  const maqaate = (curriculum.maqaate as MaqtaRaw[]) ?? [];
  const maqta = maqaate.find((m) => m.maqtaId === maqtaId);
  if (!maqta) return null;

  const lessons = await loadLessons(country, level, subject);
  const nodeByUnit = new Map(
    (maqta.nodes ?? [])
      .filter((n) => n.unitId)
      .map((n) => [n.unitId!, n.nodeId])
  );

  const blocks = (maqta.blocks ?? []).map((block) => ({
    blockId: block.blockId,
    domaine: block.domaine,
    titreFr: block.titreFr,
    titreAr: block.titreAr,
    contentKinds: (block.contentKinds ?? []) as ContentKind[],
    units: (maqta.units ?? [])
      .filter((u) => u.blockId === block.blockId)
      .map((u) => {
        const lesson = lessons.get(u.unitId);
        return {
          unitId: u.unitId,
          blockId: u.blockId,
          titreFr: u.titreFr,
          titreAr: u.titreAr,
          pageRef: u.pageRef,
          contentKind: (u.contentKind ?? lesson?.contentKind ?? "lesson") as ContentKind,
          lessonId: u.lessonId ?? lesson?.lessonId,
          lessonStatus: lesson?.status,
          competencyId: nodeByUnit.get(u.unitId),
        };
      }),
  }));

  const unassigned = (maqta.units ?? []).filter(
    (u) => !u.blockId || !maqta.blocks?.some((b) => b.blockId === u.blockId)
  );
  if (unassigned.length > 0) {
    blocks.push({
      blockId: "other",
      domaine: "mixed",
      titreFr: "Contenus",
      titreAr: "محتويات",
      contentKinds: ["lesson", "exercise"],
      units: unassigned.map((u) => {
        const lesson = lessons.get(u.unitId);
        return {
          unitId: u.unitId,
          blockId: u.blockId,
          titreFr: u.titreFr,
          titreAr: u.titreAr,
          pageRef: u.pageRef,
          contentKind: (u.contentKind ?? lesson?.contentKind ?? "lesson") as ContentKind,
          lessonId: u.lessonId ?? lesson?.lessonId,
          lessonStatus: lesson?.status,
          competencyId: nodeByUnit.get(u.unitId),
        };
      }),
    });
  }

  const maqtaNodeIds = new Set((maqta.nodes ?? []).map((n) => n.nodeId));
  const sectionNodes = bundle.nodes.filter((n) => maqtaNodeIds.has(n.nodeId));
  const path = buildPathResponse({ ...bundle, nodes: sectionNodes });

  return {
    maqtaId,
    titreFr: maqta.titreFr,
    titreAr: maqta.titreAr,
    subject,
    level,
    blocks,
    nodes: path.nodes,
  };
}
