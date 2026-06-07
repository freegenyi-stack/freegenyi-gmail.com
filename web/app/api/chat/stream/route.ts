import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getMessages, userIsMember } from "@/lib/messaging/conversations.server";
import { getTypingUsers } from "@/lib/messaging/typing.server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const conversationId = parseInt(req.nextUrl.searchParams.get("conversationId") || "", 10);
  if (Number.isNaN(conversationId)) {
    return new Response("Bad request", { status: 400 });
  }

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, session.user.email.toLowerCase()));

  if (!user || !(await userIsMember(conversationId, user.id))) {
    return new Response("Forbidden", { status: 403 });
  }

  const encoder = new TextEncoder();
  let lastId = parseInt(req.nextUrl.searchParams.get("since") || "0", 10);

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

          send({ type: "connected", typing: getTypingUsers(conversationId, user.id) });

      const interval = setInterval(async () => {
        try {
          const messages = await getMessages(conversationId, user.id, 30);
          const newest = messages[messages.length - 1];
          const typing = getTypingUsers(conversationId, user.id);
          if (newest && newest.id > lastId) {
            lastId = newest.id;
            send({ type: "messages", messages, lastId, typing });
          } else {
            send({ type: "heartbeat", typing });
          }
        } catch {
          send({ type: "error", message: "poll failed" });
        }
      }, 2500);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
