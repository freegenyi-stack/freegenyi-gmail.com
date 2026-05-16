import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, chatMessages, conversationMembers, conversations } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import * as Ably from "ably";
import { askGeny } from "@/lib/actions/geny";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const url = new URL(req.url);
    const convIdStr = url.searchParams.get("convId");
    if (!convIdStr) return NextResponse.json({ error: "Missing convId" }, { status: 400 });
    const convId = parseInt(convIdStr);

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email));
    
    // Check membership
    const [membership] = await db.select().from(conversationMembers).where(and(eq(conversationMembers.conversationId, convId), eq(conversationMembers.userId, user.id)));
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Mark as read
    await db.update(chatMessages).set({ isRead: true }).where(and(eq(chatMessages.conversationId, convId), ne(chatMessages.senderId, user.id)));

    // Fetch messages
    const msgs = await db.select().from(chatMessages).where(eq(chatMessages.conversationId, convId)).orderBy(chatMessages.createdAt);

    return NextResponse.json({ messages: msgs });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const [user] = await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.email, session.user.email));
    
    const body = await req.json();
    const { conversationId, content, messageType = "text", mediaUrl } = body;

    const [membership] = await db.select().from(conversationMembers).where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, user.id)));
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [newMsg] = await db.insert(chatMessages).values({
      conversationId,
      senderId: user.id,
      content,
      messageType,
      mediaUrl
    }).returning();

    // Check conversation type
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, conversationId));

    let genyMsg = null;
    if (conv?.type === "ai" && messageType === "text" && content) {
      // Get AI response
      const aiResponse = await askGeny(content, `Utilisateur: ${user.email}`);
      // Insert AI message (using a system AI user ID or similar, here we'll assume senderId=0 means AI, or just use user.id and rely on a 'is_ai' flag or type. Since schema doesn't have sender type, we'll use a special AI user or just 0)
      // Wait, senderId is a foreign key to users.id. The AI needs a user account in the DB.
      // For now, if we don't have an AI user, we'll bypass the foreign key issue by fetching the first user with role 'admin' or just creating an AI user if needed. 
      // A better approach for the MVP: we can fetch the first user, but wait, we need a dedicated AI user.
      // Let's assume there's a user with email 'geny@freegeny.com'.
      const [aiUser] = await db.select().from(users).where(eq(users.email, "geny@freegeny.com"));
      if (aiUser) {
        [genyMsg] = await db.insert(chatMessages).values({
          conversationId,
          senderId: aiUser.id,
          content: aiResponse,
          messageType: "text",
        }).returning();
      }
    }

    // Publish to Ably for real-time delivery
    const apiKey = process.env.ABLY_API_KEY;
    if (apiKey) {
      const ably = new Ably.Rest({ key: apiKey });
      
      const channelName = `user-${user.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
      const channel = ably.channels.get(channelName);
      
      // Publish user's message
      await channel.publish("new_message", newMsg);
      
      // Publish Geny's message if any
      if (genyMsg) {
        await channel.publish("new_message", genyMsg);
      }

      // Find partners
      const partners = await db.select().from(conversationMembers).where(and(eq(conversationMembers.conversationId, conversationId), ne(conversationMembers.userId, user.id)));
      
      for (const p of partners) {
        const [pUser] = await db.select({ email: users.email }).from(users).where(eq(users.id, p.userId));
        if (pUser?.email) {
          const partnerChannelName = `user-${pUser.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
          const partnerChannel = ably.channels.get(partnerChannelName);
          await partnerChannel.publish("new_message", newMsg);
          if (genyMsg) await partnerChannel.publish("new_message", genyMsg);
        }
      }
    }

    return NextResponse.json({ message: newMsg });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
