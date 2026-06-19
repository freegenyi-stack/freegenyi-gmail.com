import data from "@emoji-mart/data";

type EmojiSkin = { native?: string };
type EmojiEntry = { id: string; name: string; keywords: string[]; skins?: EmojiSkin[] };
type EmojiMartData = {
  emojis: Record<string, EmojiEntry>;
  categories: { id: string; emojis: string[] }[];
};

const emojiData = data as unknown as EmojiMartData;

const RECENT_KEY = "fg-chat-recent-emojis";
const MAX_RECENT = 32;

export type EmojiCategory = {
  id: string;
  icon: string;
  labelFr: string;
  labelAr: string;
  emojis: string[];
};

const CATEGORY_META: Record<string, { icon: string; labelFr: string; labelAr: string }> = {
  people: { icon: "😀", labelFr: "Smileys", labelAr: "وجوه" },
  nature: { icon: "🐻", labelFr: "Nature", labelAr: "طبيعة" },
  foods: { icon: "🍔", labelFr: "Nourriture", labelAr: "طعام" },
  activity: { icon: "⚽", labelFr: "Activités", labelAr: "أنشطة" },
  travel: { icon: "✈️", labelFr: "Voyage", labelAr: "سفر" },
  objects: { icon: "💡", labelFr: "Objets", labelAr: "أشياء" },
  symbols: { icon: "💜", labelFr: "Symboles", labelAr: "رموز" },
  flags: { icon: "🏳️", labelFr: "Drapeaux", labelAr: "أعلام" },
};

function nativeFromId(id: string): string | null {
  const e = emojiData.emojis[id];
  return e?.skins?.[0]?.native ?? null;
}

export function getEmojiCategories(): EmojiCategory[] {
  return emojiData.categories
    .map((cat) => {
      const meta = CATEGORY_META[cat.id] || { icon: "✨", labelFr: cat.id, labelAr: cat.id };
      return {
        id: cat.id,
        icon: meta.icon,
        labelFr: meta.labelFr,
        labelAr: meta.labelAr,
        emojis: cat.emojis.map(nativeFromId).filter((e): e is string => !!e),
      };
    })
    .filter((c) => c.emojis.length > 0);
}

export function searchEmojis(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const seen = new Set<string>();
  const results: string[] = [];

  for (const id of Object.keys(emojiData.emojis)) {
    const e = emojiData.emojis[id];
    const native = e?.skins?.[0]?.native;
    if (!native || seen.has(native)) continue;
    const match =
      e.id.includes(q) ||
      e.name.toLowerCase().includes(q) ||
      e.keywords.some((k: string) => k.toLowerCase().includes(q));
    if (match) {
      seen.add(native);
      results.push(native);
      if (results.length >= 120) break;
    }
  }
  return results;
}

export function getRecentEmojis(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]).slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

export function pushRecentEmoji(emoji: string): void {
  if (typeof window === "undefined") return;
  const prev = getRecentEmojis().filter((e) => e !== emoji);
  prev.unshift(emoji);
  localStorage.setItem(RECENT_KEY, JSON.stringify(prev.slice(0, MAX_RECENT)));
}

/** Barre rapide sous la recherche */
export const QUICK_EMOJIS = ["😀", "😂", "😍", "🥰", "👍", "❤️", "🔥", "🎉", "🙏", "💯", "✨", "😢"];
