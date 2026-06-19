export type QuarterGoalTargets = {
  quarter: string;
  booksTarget: number;
  missionsTarget: number;
  readingDaysTarget: number;
};

export type QuarterGoalProgress = QuarterGoalTargets & {
  booksDone: number;
  missionsDone: number;
  readingStreak: number;
  booksPercent: number;
  missionsPercent: number;
  readingPercent: number;
  overallPercent: number;
};

export function currentQuarterKey(): string {
  const d = new Date();
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}-T${q}`;
}

const DEFAULT_TARGETS: Omit<QuarterGoalTargets, "quarter"> = {
  booksTarget: 3,
  missionsTarget: 8,
  readingDaysTarget: 12,
};

export function parseQuarterGoalsFromMetadata(
  metadata: string | null | undefined,
  childId: number
): QuarterGoalTargets {
  const quarter = currentQuarterKey();
  if (!metadata?.trim()) return { quarter, ...DEFAULT_TARGETS };
  try {
    const meta = JSON.parse(metadata) as {
      parentQuarterGoals?: Record<string, Partial<QuarterGoalTargets>>;
    };
    const row = meta.parentQuarterGoals?.[String(childId)];
    if (!row || row.quarter !== quarter) return { quarter, ...DEFAULT_TARGETS };
    return {
      quarter,
      booksTarget: row.booksTarget ?? DEFAULT_TARGETS.booksTarget,
      missionsTarget: row.missionsTarget ?? DEFAULT_TARGETS.missionsTarget,
      readingDaysTarget: row.readingDaysTarget ?? DEFAULT_TARGETS.readingDaysTarget,
    };
  } catch {
    return { quarter, ...DEFAULT_TARGETS };
  }
}

export function mergeQuarterGoalsIntoMetadata(
  prev: Record<string, unknown>,
  childId: number,
  targets: QuarterGoalTargets
): Record<string, unknown> {
  const existing = (prev.parentQuarterGoals as Record<string, QuarterGoalTargets>) || {};
  return {
    ...prev,
    parentQuarterGoals: {
      ...existing,
      [String(childId)]: targets,
    },
  };
}

export function computeQuarterProgress(
  targets: QuarterGoalTargets,
  stats: { booksRead: number; exercisesDone: number; readingStreakDays: number }
): QuarterGoalProgress {
  const pct = (done: number, target: number) =>
    target > 0 ? Math.min(100, Math.round((done / target) * 100)) : 0;

  const booksPercent = pct(stats.booksRead, targets.booksTarget);
  const missionsPercent = pct(stats.exercisesDone, targets.missionsTarget);
  const readingPercent = pct(stats.readingStreakDays, targets.readingDaysTarget);
  const overallPercent = Math.round((booksPercent + missionsPercent + readingPercent) / 3);

  return {
    ...targets,
    booksDone: stats.booksRead,
    missionsDone: stats.exercisesDone,
    readingStreak: stats.readingStreakDays,
    booksPercent,
    missionsPercent,
    readingPercent,
    overallPercent,
  };
}
