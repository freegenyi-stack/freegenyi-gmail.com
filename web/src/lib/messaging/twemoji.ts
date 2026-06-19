/** URLs Twemoji (couleurs vives, CDN jsDelivr). */
export function twemojiCodepoints(emoji: string): string {
  return [...emoji]
    .map((char) => char.codePointAt(0)?.toString(16))
    .filter(Boolean)
    .join("-");
}

export function twemojiUrl(emoji: string, size: 72 | 512 = 72): string {
  const folder = size === 512 ? "512x512" : "72x72";
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/${folder}/${twemojiCodepoints(emoji)}.png`;
}

export type StickerItem = { emoji: string; fr: string; ar: string };

export type StickerPack = {
  id: string;
  labelFr: string;
  labelAr: string;
  icon: string;
  stickers: StickerItem[];
};

export const FG_STICKER_PACKS: StickerPack[] = [
  {
    id: "react",
    labelFr: "Réactions",
    labelAr: "تفاعلات",
    icon: "👍",
    stickers: [
      { emoji: "👍", fr: "Bravo", ar: "ممتاز" },
      { emoji: "👎", fr: "Non", ar: "لا" },
      { emoji: "👏", fr: "Applaudir", ar: "تصفيق" },
      { emoji: "🙌", fr: "Yes!", ar: "نعم!" },
      { emoji: "🙏", fr: "Merci", ar: "شكراً" },
      { emoji: "💪", fr: "Force", ar: "قوة" },
      { emoji: "🤝", fr: "D'accord", ar: "اتفاق" },
      { emoji: "✌️", fr: "Victoire", ar: "انتصار" },
    ],
  },
  {
    id: "love",
    labelFr: "Cœurs",
    labelAr: "قلوب",
    icon: "❤️",
    stickers: [
      { emoji: "❤️", fr: "Amour", ar: "حب" },
      { emoji: "🧡", fr: "Orange", ar: "برتقالي" },
      { emoji: "💛", fr: "Jaune", ar: "أصفر" },
      { emoji: "💚", fr: "Vert", ar: "أخضر" },
      { emoji: "💙", fr: "Bleu", ar: "أزرق" },
      { emoji: "💜", fr: "Violet", ar: "بنفسجي" },
      { emoji: "🖤", fr: "Noir", ar: "أسود" },
      { emoji: "💕", fr: "Doux", ar: "حنان" },
    ],
  },
  {
    id: "mood",
    labelFr: "Humeur",
    labelAr: "مزاج",
    icon: "😂",
    stickers: [
      { emoji: "😂", fr: "MDR", ar: "ضحك" },
      { emoji: "🤣", fr: "Ptdr", ar: "ههه" },
      { emoji: "😍", fr: "Adore", ar: "إعجاب" },
      { emoji: "🥰", fr: "Mignon", ar: "لطيف" },
      { emoji: "😮", fr: "Wow", ar: "وow" },
      { emoji: "😢", fr: "Triste", ar: "حزن" },
      { emoji: "😡", fr: "Colère", ar: "غضب" },
      { emoji: "🤗", fr: "Câlin", ar: "عناق" },
    ],
  },
  {
    id: "school",
    labelFr: "École",
    labelAr: "مدرسة",
    icon: "📚",
    stickers: [
      { emoji: "📚", fr: "Livres", ar: "كتب" },
      { emoji: "✏️", fr: "Crayon", ar: "قلم" },
      { emoji: "🎓", fr: "Diplôme", ar: "تخرج" },
      { emoji: "🏫", fr: "École", ar: "مدرسة" },
      { emoji: "📝", fr: "Devoir", ar: "واجب" },
      { emoji: "✅", fr: "Validé", ar: "تم" },
      { emoji: "⭐", fr: "Étoile", ar: "نجمة" },
      { emoji: "🏆", fr: "Trophée", ar: "كأس" },
    ],
  },
  {
    id: "fun",
    labelFr: "Fun",
    labelAr: "مرح",
    icon: "🎉",
    stickers: [
      { emoji: "🎉", fr: "Fête", ar: "احتفال" },
      { emoji: "🔥", fr: "Top", ar: "رائع" },
      { emoji: "✨", fr: "Magie", ar: "سحر" },
      { emoji: "💯", fr: "100%", ar: "مئة" },
      { emoji: "🌟", fr: "Brillant", ar: "لامع" },
      { emoji: "🎈", fr: "Ballon", ar: "بالون" },
      { emoji: "🎁", fr: "Cadeau", ar: "هدية" },
      { emoji: "☀️", fr: "Soleil", ar: "شمس" },
    ],
  },
  {
    id: "flags",
    labelFr: "Drapeaux",
    labelAr: "أعلام",
    icon: "🇩🇿",
    stickers: [
      { emoji: "🇩🇿", fr: "Algérie", ar: "الجزائر" },
      { emoji: "🇫🇷", fr: "France", ar: "فرنسا" },
      { emoji: "🇲🇦", fr: "Maroc", ar: "المغرب" },
      { emoji: "🇹🇳", fr: "Tunisie", ar: "تونس" },
      { emoji: "🇸🇳", fr: "Sénégal", ar: "السنغال" },
      { emoji: "🇨🇮", fr: "Côte d'Ivoire", ar: "كôte d'Ivoire" },
      { emoji: "🇪🇬", fr: "Égypte", ar: "مصر" },
      { emoji: "🇱🇧", fr: "Liban", ar: "لبنان" },
    ],
  },
];

/** @deprecated use FG_STICKER_PACKS */
export const FG_STICKERS: StickerItem[] = FG_STICKER_PACKS.flatMap((p) => p.stickers);
