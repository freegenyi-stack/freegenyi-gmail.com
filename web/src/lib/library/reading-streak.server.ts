/** Calcule une série de jours consécutifs avec activité de lecture (aujourd'hui ou hier inclus). */
export function computeReadingStreakFromDayKeys(dayKeys: string[]): number {
  if (!dayKeys.length) return 0;
  const days = new Set(dayKeys);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const key = (d: Date) => d.toISOString().slice(0, 10);
  let streak = 0;
  let cursor = new Date(today);

  if (!days.has(key(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(key(cursor))) return 0;
  }

  while (days.has(key(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function dayKeyFromDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
