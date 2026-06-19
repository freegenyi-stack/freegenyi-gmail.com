export type ParentPreferences = {
  weeklyReport: boolean;
  missionAlerts: boolean;
  readingDigest: boolean;
};

const DEFAULT_PREFS: ParentPreferences = {
  weeklyReport: true,
  missionAlerts: true,
  readingDigest: true,
};

export function parseParentPreferences(metadata: string | null | undefined): ParentPreferences {
  if (!metadata?.trim()) return DEFAULT_PREFS;
  try {
    const meta = JSON.parse(metadata) as { parentPreferences?: Partial<ParentPreferences> };
    return { ...DEFAULT_PREFS, ...meta.parentPreferences };
  } catch {
    return DEFAULT_PREFS;
  }
}
