/** FSRS lite pour smoke test (copie alignée sur src/lib/curriculum/fsrs.ts) */
const MS_DAY = 86_400_000;

export function createFsrsCard(competencyId) {
  return {
    competencyId,
    stability: 0.4,
    difficulty: 5,
    lastReview: null,
    due: new Date(),
  };
}

export function reviewFsrsCard(card, rating, now = new Date()) {
  let stability = card.stability;
  let intervalDays = rating === 1 ? 1 : Math.max(1, Math.round(stability * (rating === 4 ? 2.8 : 1.8)));
  if (rating === 1) stability *= 0.5;
  else stability = Math.max(0.3, stability * 1.5);
  const nextDue = new Date(now.getTime() + intervalDays * MS_DAY);
  return {
    card: { ...card, stability, lastReview: now, due: nextDue },
    intervalDays,
  };
}

export function dueFsrsCards(cards, now = new Date()) {
  return cards.filter((c) => c.due.getTime() <= now.getTime());
}
