/** Réactions messagerie FreeGeny — groupées par sens (contexte école + vie quotidienne). */
export type ReactionGroup = {
  id: string;
  labelFr: string;
  labelAr: string;
  emojis: string[];
};

export const MESSAGE_REACTION_GROUPS: ReactionGroup[] = [
  {
    id: "approve",
    labelFr: "Bravo & OK",
    labelAr: "ممتاز وموافق",
    emojis: ["👍", "👏", "🙌", "💪", "✅", "💯", "🤝"],
  },
  {
    id: "love",
    labelFr: "Cœurs",
    labelAr: "قلوب",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🥰", "😍", "💕"],
  },
  {
    id: "joy",
    labelFr: "Joie & fun",
    labelAr: "فرح ومرح",
    emojis: ["😂", "🤣", "😄", "😁", "🎉", "🎈", "🎁", "✨", "🔥", "🌟"],
  },
  {
    id: "wow",
    labelFr: "Surprise",
    labelAr: "مفاجأة",
    emojis: ["😮", "😲", "🤯", "👀", "😱"],
  },
  {
    id: "sad",
    labelFr: "Triste & soutien",
    labelAr: "حزن ودعم",
    emojis: ["😢", "😭", "💔", "😔", "🥺"],
  },
  {
    id: "thanks",
    labelFr: "Merci",
    labelAr: "شكراً",
    emojis: ["🙏", "☺️", "😊", "🤗"],
  },
  {
    id: "school",
    labelFr: "École & réussite",
    labelAr: "مدرسة ونجاح",
    emojis: ["📚", "📖", "📝", "✏️", "🎓", "🏫", "⭐", "🏆", "🥇", "📋"],
  },
  {
    id: "no",
    labelFr: "Pas d'accord",
    labelAr: "غير موافق",
    emojis: ["👎", "😅", "🙄", "😬", "😡"],
  },
];

export const ALL_PRESET_REACTIONS = MESSAGE_REACTION_GROUPS.flatMap((g) => g.emojis);

/** Barre rapide (bulle / raccourci) — les plus universelles */
export const QUICK_MESSAGE_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "🎉"];

export function reactionGroupLabel(group: ReactionGroup, locale: string): string {
  return locale.startsWith("ar") ? group.labelAr : group.labelFr;
}

/** Réactions déjà sur le message mais hors presets (ex. anciennes) */
export function extraReactionsOnMessage(
  reactions: Record<string, number[]> | undefined,
  presets: string[] = ALL_PRESET_REACTIONS
): string[] {
  if (!reactions) return [];
  return Object.keys(reactions).filter((e) => reactions[e]?.length && !presets.includes(e));
}
