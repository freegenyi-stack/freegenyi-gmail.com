/**
 * FSRS — Free Spaced Repetition Scheduler (open source)
 * @see https://github.com/open-spaced-repetition/fsrs4anki
 *
 * Planifie les révisions (sourates, mahfoudat, vocabulaire) entre les sessions.
 */

export type FsrsRating = 1 | 2 | 3 | 4;

export type FsrsCard = {
  competencyId: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  lastReview: Date | null;
  due: Date;
};

export type FsrsReviewResult = {
  card: FsrsCard;
  nextDue: Date;
  intervalDays: number;
};

const MS_DAY = 86_400_000;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Carte neuve — première révision dans 1 jour. */
export function createFsrsCard(competencyId: string): FsrsCard {
  const now = new Date();
  return {
    competencyId,
    stability: 0.4,
    difficulty: 5,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    lastReview: null,
    due: now,
  };
}

/**
 * Mise à jour simplifiée FSRS après une révision.
 * rating: 1=Again, 2=Hard, 3=Good, 4=Easy
 */
export function reviewFsrsCard(card: FsrsCard, rating: FsrsRating, now = new Date()): FsrsReviewResult {
  const elapsed =
    card.lastReview != null
      ? Math.max(0, (now.getTime() - card.lastReview.getTime()) / MS_DAY)
      : 0;

  let stability = card.stability;
  let difficulty = card.difficulty;
  let intervalDays: number;

  if (rating === 1) {
    stability = Math.max(0.2, stability * 0.5);
    difficulty = clamp(difficulty + 0.5, 1, 10);
    intervalDays = 1;
  } else {
    const factor = rating === 4 ? 2.8 : rating === 3 ? 1.8 : 1.2;
    stability = Math.max(0.3, (stability + 0.15) * factor);
    difficulty = clamp(difficulty + (rating === 2 ? 0.2 : -0.1), 1, 10);
    intervalDays = Math.max(1, Math.round(stability * (rating === 4 ? 1.4 : 1)));
  }

  const nextDue = new Date(now.getTime() + intervalDays * MS_DAY);

  const updated: FsrsCard = {
    ...card,
    stability,
    difficulty,
    elapsedDays: elapsed,
    scheduledDays: intervalDays,
    reps: card.reps + 1,
    lapses: rating === 1 ? card.lapses + 1 : card.lapses,
    lastReview: now,
    due: nextDue,
  };

  return { card: updated, nextDue, intervalDays };
}

/** Cartes à réviser aujourd'hui, triées par urgence. */
export function dueFsrsCards(cards: FsrsCard[], now = new Date()): FsrsCard[] {
  return cards
    .filter((c) => c.due.getTime() <= now.getTime())
    .sort((a, b) => a.due.getTime() - b.due.getTime());
}
