const LABELS = {
  fr: {
    back: "Retour",
    menu: "Menu",
    listenPage: "Écouter la page",
    stop: "Arrêter",
    loading: "Chargement du lecteur",
  },
  en: {
    back: "Back",
    menu: "Menu",
    listenPage: "Listen to page",
    stop: "Stop",
    loading: "Loading reader",
  },
} as const;

export function readerLabels(language?: string | null) {
  const lang = language?.startsWith("en") ? "en" : "fr";
  return LABELS[lang];
}
