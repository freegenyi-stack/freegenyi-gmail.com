"use client";

/** Bibliothèque d'icônes / images prédéfinies pour les activités */
export const ACTIVITY_MEDIA_LIBRARY = [
  { id: "math", emoji: "🔢", label: "Maths" },
  { id: "book", emoji: "📚", label: "Lecture" },
  { id: "science", emoji: "🔬", label: "Sciences" },
  { id: "geo", emoji: "🌍", label: "Géo" },
  { id: "history", emoji: "🏛️", label: "Histoire" },
  { id: "arabic", emoji: "📖", label: "Arabe" },
  { id: "star", emoji: "⭐", label: "Étoile" },
  { id: "heart", emoji: "❤️", label: "Cœur" },
  { id: "apple", emoji: "🍎", label: "Pomme" },
  { id: "cat", emoji: "🐱", label: "Chat" },
  { id: "sun", emoji: "☀️", label: "Soleil" },
  { id: "moon", emoji: "🌙", label: "Lune" },
] as const;

export function emojiToDataUrl(emoji: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="70" x="50" text-anchor="middle" font-size="64">${emoji}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
