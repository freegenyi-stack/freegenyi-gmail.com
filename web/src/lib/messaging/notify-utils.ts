const MSG_COUNT_RE = /^\[fg:(\d+)\]\s*/;

export function formatMessageNotificationContent(count: number, preview: string): string {
  return `[fg:${count}] ${preview}`;
}

export function parseMessageNotificationCount(content: string | null | undefined): number {
  const m = content?.match(MSG_COUNT_RE);
  return m ? Math.max(1, parseInt(m[1], 10)) : 1;
}

export function displayMessageNotificationContent(content: string | null | undefined): string {
  return content?.replace(MSG_COUNT_RE, "").trim() || "";
}

export const MESSAGE_COUNT_MARKER = MSG_COUNT_RE;
