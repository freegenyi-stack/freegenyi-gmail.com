export type NewsGifPreset = {
  id: string;
  url: string;
  labelFr: string;
  labelAr: string;
};

/** GIFs éducatifs / réactions — URLs publiques stables */
export const NEWS_GIF_PRESETS: NewsGifPreset[] = [
  {
    id: "clap",
    url: "https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif",
    labelFr: "Bravo",
    labelAr: "Bravo",
  },
  {
    id: "think",
    url: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVy/giphy.gif",
    labelFr: "Réflexion",
    labelAr: "تفكير",
  },
  {
    id: "heart",
    url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    labelFr: "Merci",
    labelAr: "شكراً",
  },
  {
    id: "wow",
    url: "https://media.giphy.com/media/5VKbvrjxpVJCM/giphy.gif",
    labelFr: "Waouh",
    labelAr: "واو",
  },
  {
    id: "yes",
    url: "https://media.giphy.com/media/111ebonMsPfaic/giphy.gif",
    labelFr: "Oui !",
    labelAr: "نعم!",
  },
  {
    id: "study",
    url: "https://media.giphy.com/media/l378jzvr8buYSFz0A/giphy.gif",
    labelFr: "Étude",
    labelAr: "دراسة",
  },
];
