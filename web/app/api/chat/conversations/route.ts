import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, conversations, conversationMembers, chatMessages } from "@/db/schema";
import { eq, and, ne, desc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email));
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    // Fetch user's conversations
    const userMemberships = await db.select({ conversationId: conversationMembers.conversationId }).from(conversationMembers).where(eq(conversationMembers.userId, user.id));
    
    if (userMemberships.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    const conversationIds = userMemberships.map(m => m.conversationId);
    
    // Manual loop for MVP, but normally done via a single complex query
    const results = [];
    for (const cid of conversationIds) {
      const [conv] = await db.select().from(conversations).where(eq(conversations.id, cid));
      
      // Get partner info for direct chat
      let partner = null;
      if (conv.type === "direct") {
        const [partnerMembership] = await db.select().from(conversationMembers).where(and(eq(conversationMembers.conversationId, cid), ne(conversationMembers.userId, user.id)));
        if (partnerMembership) {
          const [pUser] = await db.select({ id: users.id, fullName: users.fullName, image: users.image, lastLoginAt: users.lastLoginAt }).from(users).where(eq(users.id, partnerMembership.userId));
          partner = pUser;
        }
      }

      // Get last message
      const [lastMsg] = await db.select().from(chatMessages).where(eq(chatMessages.conversationId, cid)).orderBy(desc(chatMessages.createdAt)).limit(1);

      // Unread count
      const unreadRecords = await db.select({ count: sql<number>`count(*)` }).from(chatMessages).where(and(eq(chatMessages.conversationId, cid), eq(chatMessages.isRead, false), ne(chatMessages.senderId, user.id)));
      const unreadCount = Number(unreadRecords[0]?.count || 0);

      results.push({
        id: conv.id,
        type: conv.type,
        name: conv.type === "direct" && partner ? partner.fullName : conv.name,
        unreadCount,
        lastMessage: lastMsg ? (lastMsg.messageType === "text" ? lastMsg.content : `[${lastMsg.messageType}]`) : null,
        partnerId: partner?.id,
        partnerImage: partner?.image,
        partnerName: partner?.fullName,
        lastLoginAt: partner?.lastLoginAt,
        isOnline: partner?.lastLoginAt ? (Date.now() - new Date(partner.lastLoginAt).getTime() < 5 * 60 * 1000) : false
      });
    }

    return NextResponse.json({ conversations: results });
  } catch (error) {
    console.error("Conversations GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email));
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    const body = await req.json();
    const { partnerId, type = "direct", name } = body;

    if (type === "direct" && partnerId) {
      // Check if conversation already exists
      // simplified:
      const userConvs = await db.select({ cid: conversationMembers.conversationId }).from(conversationMembers).where(eq(conversationMembers.userId, user.id));
      const partnerConvs = await db.select({ cid: conversationMembers.conversationId }).from(conversationMembers).where(eq(conversationMembers.userId, partnerId));
      
      const common = userConvs.find(u => partnerConvs.some(p => p.cid === u.cid));
      if (common) {
        return NextResponse.json({ conversationId: common.cid });
      }

      // Create new
      const [newConv] = await db.insert(conversations).values({ type: "direct" }).returning();
      await db.insert(conversationMembers).values([{ conversationId: newConv.id, userId: user.id }, { conversationId: newConv.id, userId: partnerId }]);
      return NextResponse.json({ conversationId: newConv.id });
    }

    // AI or group
    const [newConv] = await db.insert(conversations).values({ type, name: name || "Chat" }).returning();
    await db.insert(conversationMembers).values({ conversationId: newConv.id, userId: user.id });
    return NextResponse.json({ conversationId: newConv.id });

  } catch (error) {
    console.error("Conversations POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
