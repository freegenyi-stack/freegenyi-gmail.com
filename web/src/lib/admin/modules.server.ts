import { db } from "@/db";

import {

  chatMessages,

  contactSubmissions,

  newsArticleComments,

  pedagogyShareComments,

  pedagogyShares,

  pushSubscriptions,

  users,

} from "@/db/schema";

import { and, desc, eq, gt, ilike, isNotNull, sql } from "drizzle-orm";



export type ModerationPageOpts = {

  limit?: number;

  offset?: number;

  search?: string;

};



export async function listReportedComments(opts: ModerationPageOpts = {}) {

  const limit = opts.limit ?? 20;

  const offset = opts.offset ?? 0;

  const search = opts.search?.trim();



  const conditions = [gt(newsArticleComments.reportCount, 0)];

  if (search) {

    conditions.push(ilike(newsArticleComments.body, `%${search}%`));

  }



  return db

    .select({

      id: newsArticleComments.id,

      body: newsArticleComments.body,

      reportCount: newsArticleComments.reportCount,

      isHidden: newsArticleComments.isHidden,

      createdAt: newsArticleComments.createdAt,

      userId: newsArticleComments.userId,

      userName: users.fullName,

      userEmail: users.email,

    })

    .from(newsArticleComments)

    .leftJoin(users, eq(newsArticleComments.userId, users.id))

    .where(and(...conditions))

    .orderBy(desc(newsArticleComments.reportCount), desc(newsArticleComments.createdAt))

    .limit(limit)

    .offset(offset);

}



export async function countReportedComments(search?: string) {

  const conditions = [gt(newsArticleComments.reportCount, 0)];

  if (search?.trim()) {

    conditions.push(ilike(newsArticleComments.body, `%${search.trim()}%`));

  }

  const [row] = await db

    .select({ count: sql<number>`count(*)::int` })

    .from(newsArticleComments)

    .where(and(...conditions));

  return row?.count ?? 0;

}



export async function listRecentChatMessages(opts: ModerationPageOpts = {}) {

  const limit = opts.limit ?? 20;

  const offset = opts.offset ?? 0;

  const search = opts.search?.trim();



  const conditions = search ? [ilike(chatMessages.content, `%${search}%`)] : undefined;



  const base = db

    .select({

      id: chatMessages.id,

      body: chatMessages.content,

      reportCount: chatMessages.reportCount,

      isHidden: chatMessages.isHidden,

      createdAt: chatMessages.createdAt,

      senderId: chatMessages.senderId,

      conversationId: chatMessages.conversationId,

      senderName: users.fullName,

      senderEmail: users.email,

    })

    .from(chatMessages)

    .leftJoin(users, eq(chatMessages.senderId, users.id));



  const rows = conditions

    ? await base.where(and(...conditions)).orderBy(desc(chatMessages.createdAt)).limit(limit).offset(offset)

    : await base.orderBy(desc(chatMessages.createdAt)).limit(limit).offset(offset);



  return rows;

}



export async function countRecentChatMessages(search?: string) {

  if (search?.trim()) {

    const [row] = await db

      .select({ count: sql<number>`count(*)::int` })

      .from(chatMessages)

      .where(ilike(chatMessages.content, `%${search.trim()}%`));

    return row?.count ?? 0;

  }

  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(chatMessages);

  return row?.count ?? 0;

}

export async function listReportedChatMessages(opts: ModerationPageOpts = {}) {

  const limit = opts.limit ?? 20;

  const offset = opts.offset ?? 0;

  const search = opts.search?.trim();

  const conditions = [gt(chatMessages.reportCount, 0)];

  if (search) {

    conditions.push(ilike(chatMessages.content, `%${search}%`));

  }

  return db

    .select({

      id: chatMessages.id,

      body: chatMessages.content,

      reportCount: chatMessages.reportCount,

      isHidden: chatMessages.isHidden,

      createdAt: chatMessages.createdAt,

      senderId: chatMessages.senderId,

      conversationId: chatMessages.conversationId,

      senderName: users.fullName,

      senderEmail: users.email,

    })

    .from(chatMessages)

    .leftJoin(users, eq(chatMessages.senderId, users.id))

    .where(and(...conditions))

    .orderBy(desc(chatMessages.reportCount), desc(chatMessages.createdAt))

    .limit(limit)

    .offset(offset);

}

export async function countReportedChatMessages(search?: string) {

  const conditions = [gt(chatMessages.reportCount, 0)];

  if (search?.trim()) {

    conditions.push(ilike(chatMessages.content, `%${search.trim()}%`));

  }

  const [row] = await db

    .select({ count: sql<number>`count(*)::int` })

    .from(chatMessages)

    .where(and(...conditions));

  return row?.count ?? 0;

}



export async function listRecentChatMedia(opts: ModerationPageOpts = {}) {

  const limit = opts.limit ?? 12;

  const offset = opts.offset ?? 0;



  return db

    .select({

      id: chatMessages.id,

      body: chatMessages.content,

      mediaUrl: chatMessages.mediaUrl,

      mediaBlocked: chatMessages.mediaBlocked,

      createdAt: chatMessages.createdAt,

      senderId: chatMessages.senderId,

      messageType: chatMessages.messageType,

      senderName: users.fullName,

      senderEmail: users.email,

    })

    .from(chatMessages)

    .leftJoin(users, eq(chatMessages.senderId, users.id))

    .where(isNotNull(chatMessages.mediaUrl))

    .orderBy(desc(chatMessages.createdAt))

    .limit(limit)

    .offset(offset);

}



export async function countRecentChatMedia() {

  const [row] = await db

    .select({ count: sql<number>`count(*)::int` })

    .from(chatMessages)

    .where(isNotNull(chatMessages.mediaUrl));

  return row?.count ?? 0;

}



export async function listContactSubmissions(limit = 100) {

  return db

    .select()

    .from(contactSubmissions)

    .orderBy(desc(contactSubmissions.createdAt))

    .limit(limit);

}



export async function countPushSubscriptions() {

  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(pushSubscriptions);

  return row?.count ?? 0;

}



export async function getExtendedStats() {

  const [active7d] = await db

    .select({ count: sql<number>`count(*)::int` })

    .from(users)

    .where(sql`${users.lastLoginAt} > NOW() - INTERVAL '7 days'`);



  const roleRows = await db

    .select({ role: users.role, count: sql<number>`count(*)::int` })

    .from(users)

    .groupBy(users.role);



  return {

    activeLast7Days: active7d?.count ?? 0,

    roles: Object.fromEntries(roleRows.map((r) => [r.role ?? "unknown", r.count])),

    pushSubscriptions: await countPushSubscriptions(),

    pendingContacts: (

      await db

        .select({ count: sql<number>`count(*)::int` })

        .from(contactSubmissions)

        .where(eq(contactSubmissions.status, "pending"))

    )[0]?.count ?? 0,

  };

}

export async function listReportedMurComments(opts: ModerationPageOpts = {}) {
  const limit = opts.limit ?? 20;
  const offset = opts.offset ?? 0;
  const search = opts.search?.trim();
  const conditions = [gt(pedagogyShareComments.reportCount, 0)];

  if (search) {
    conditions.push(ilike(pedagogyShareComments.body, `%${search}%`));
  }

  return db
    .select({
      id: pedagogyShareComments.id,
      body: pedagogyShareComments.body,
      reportCount: pedagogyShareComments.reportCount,
      isHidden: pedagogyShareComments.isHidden,
      createdAt: pedagogyShareComments.createdAt,
      userId: pedagogyShareComments.authorId,
      userName: users.fullName,
      userEmail: users.email,
      shareId: pedagogyShareComments.shareId,
      shareTitle: pedagogyShares.title,
    })
    .from(pedagogyShareComments)
    .innerJoin(pedagogyShares, eq(pedagogyShareComments.shareId, pedagogyShares.id))
    .leftJoin(users, eq(pedagogyShareComments.authorId, users.id))
    .where(and(...conditions))
    .orderBy(desc(pedagogyShareComments.reportCount), desc(pedagogyShareComments.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function countReportedMurComments(search?: string) {
  const conditions = [gt(pedagogyShareComments.reportCount, 0)];
  if (search?.trim()) {
    conditions.push(ilike(pedagogyShareComments.body, `%${search.trim()}%`));
  }
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pedagogyShareComments)
    .where(and(...conditions));
  return row?.count ?? 0;
}

