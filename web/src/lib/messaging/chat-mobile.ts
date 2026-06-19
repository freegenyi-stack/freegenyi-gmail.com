/**
 * Constantes layout messagerie — web mobile & future app (Capacitor).
 * Les styles responsive live dans globals.css (classes fg-chat-*).
 */

/** Cible tactile minimum (Apple HIG / Material) */
export const CHAT_TOUCH_MIN_PX = 44;

/** Appui long → panneau d'actions sur mobile */
export const CHAT_LONG_PRESS_MS = 480;

export const chatMobileClasses = {
  actionSheet: "fg-chat-action-sheet",
  reactionsScroll: "fg-chat-reactions-scroll",
  reactionBtn: "fg-chat-reaction-btn",
  emojiPanel: "fg-chat-emoji-panel",
  emojiScroll: "fg-chat-emoji-scroll",
  emojiGrid: "fg-chat-emoji-grid",
  chatSearchPanel: "fg-chat-search-panel",
} as const;

/** Helpers touch — appui long sans déclencher le menu contextuel iOS */
export function bindLongPress(open: () => void, ms = CHAT_LONG_PRESS_MS) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let fired = false;

  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return {
    onTouchStart: () => {
      fired = false;
      clear();
      timer = setTimeout(() => {
        fired = true;
        open();
      }, ms);
    },
    onTouchEnd: () => clear(),
    onTouchMove: () => clear(),
    onContextMenu: (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (!fired) open();
    },
  };
}
