import { db } from "@/db";
import { chatTyping } from "@/db/schema";
import { and, eq, gt, ne } from "drizzle-orm";

const TYPING_TTL_MS = 5000;

const memoryStore = new Map<number, Map<number, { userId: number; name: string; expiresAt: number }>>();

function pruneMemory(conversationId: number) {
  const room = memoryStore.get(conversationId);
  if (!room) return;
  const now = Date.now();
  for (const [uid, entry] of room) {
    if (entry.expiresAt <= now) room.delete(uid);
  }
  if (room.size === 0) memoryStore.delete(conversationId);
}

export async function setTyping(
  conversationId: number,
  userId: number,
  name: string,
  active: boolean
): Promise<void> {
  if (!active) {
    memoryStore.get(conversationId)?.delete(userId);
    pruneMemory(conversationId);
    try {
      await db
        .delete(chatTyping)
        .where(and(eq(chatTyping.conversationId, conversationId), eq(chatTyping.userId, userId)));
    } catch {
      /* table may not exist before v7 migration */
    }
    return;
  }

  const expiresAt = new Date(Date.now() + TYPING_TTL_MS);
  let room = memoryStore.get(conversationId);
  if (!room) {
    room = new Map();
    memoryStore.set(conversationId, room);
  }
  room.set(userId, { userId, name, expiresAt: expiresAt.getTime() });

  try {
    await db
      .insert(chatTyping)
      .values({ conversationId, userId, displayName: name, expiresAt })
      .onConflictDoUpdate({
        target: [chatTyping.conversationId, chatTyping.userId],
        set: { displayName: name, expiresAt },
      });
  } catch {
    /* fallback memory only */
  }
}

export async function getTypingUsers(
  conversationId: number,
  excludeUserId: number
): Promise<{ userId: number; name: string }[]> {
  const now = new Date();
  try {
    const rows = await db
      .select({ userId: chatTyping.userId, name: chatTyping.displayName })
      .from(chatTyping)
      .where(
        and(
          eq(chatTyping.conversationId, conversationId),
          ne(chatTyping.userId, excludeUserId),
          gt(chatTyping.expiresAt, now)
        )
      );
    if (rows.length > 0) return rows.map((r) => ({ userId: r.userId, name: r.name }));
  } catch {
    /* use memory */
  }

  pruneMemory(conversationId);
  const room = memoryStore.get(conversationId);
  if (!room) return [];
  const ts = Date.now();
  return [...room.values()]
    .filter((e) => e.userId !== excludeUserId && e.expiresAt > ts)
    .map((e) => ({ userId: e.userId, name: e.name }));
}
