const TYPING_TTL_MS = 5000;

type TypingEntry = { userId: number; name: string; expiresAt: number };

const store = new Map<number, Map<number, TypingEntry>>();

function prune(conversationId: number) {
  const room = store.get(conversationId);
  if (!room) return;
  const now = Date.now();
  for (const [uid, entry] of room) {
    if (entry.expiresAt <= now) room.delete(uid);
  }
  if (room.size === 0) store.delete(conversationId);
}

export function setTyping(conversationId: number, userId: number, name: string, active: boolean): void {
  if (!active) {
    store.get(conversationId)?.delete(userId);
    prune(conversationId);
    return;
  }

  let room = store.get(conversationId);
  if (!room) {
    room = new Map();
    store.set(conversationId, room);
  }
  room.set(userId, { userId, name, expiresAt: Date.now() + TYPING_TTL_MS });
}

export function getTypingUsers(
  conversationId: number,
  excludeUserId: number
): { userId: number; name: string }[] {
  prune(conversationId);
  const room = store.get(conversationId);
  if (!room) return [];
  return [...room.values()]
    .filter((e) => e.userId !== excludeUserId)
    .map((e) => ({ userId: e.userId, name: e.name }));
}
