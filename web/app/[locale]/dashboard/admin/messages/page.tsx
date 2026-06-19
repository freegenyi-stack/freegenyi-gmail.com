import React from "react";
import { getTranslations } from "next-intl/server";
import {
  countRecentChatMedia,
  countRecentChatMessages,
  countReportedChatMessages,
  countReportedComments,
  countReportedMurComments,
  listRecentChatMessages,
  listRecentChatMedia,
  listReportedChatMessages,
  listReportedComments,
  listReportedMurComments,
} from "@/lib/admin/modules.server";
import AdminMessagesClient from "./AdminMessagesClient";

export default async function AdminMessagesPage() {
  const t = await getTranslations("AdminMessages");

  const [comments, murComments, chatPreview, reportedChat, mediaPreview, commentTotal, murCommentTotal, chatTotal, reportedChatTotal, mediaTotal] =
    await Promise.all([
      listReportedComments({ limit: 200 }),
      listReportedMurComments({ limit: 200 }),
      listRecentChatMessages({ limit: 200 }),
      listReportedChatMessages({ limit: 200 }),
      listRecentChatMedia({ limit: 120 }),
      countReportedComments(),
      countReportedMurComments(),
      countRecentChatMessages(),
      countReportedChatMessages(),
      countRecentChatMedia(),
    ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">{t("title")}</h1>
        <p className="text-sm text-slate-500">{t("subtitle")}</p>
      </div>

      <AdminMessagesClient
        comments={comments}
        murComments={murComments}
        chatPreview={chatPreview}
        reportedChat={reportedChat}
        mediaPreview={mediaPreview}
        commentTotal={commentTotal}
        murCommentTotal={murCommentTotal}
        chatTotal={chatTotal}
        reportedChatTotal={reportedChatTotal}
        mediaTotal={mediaTotal}
      />
    </div>
  );
}
