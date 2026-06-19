import React from "react";
import { listAllTeacherNewsArticles } from "@/lib/teacher/news-admin.server";
import AdminTeacherNewsClient from "./AdminTeacherNewsClient";

export default async function AdminTeacherNewsPage() {
  const articles = await listAllTeacherNewsArticles();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Actualités enseignant</h1>
        <p className="mt-1 text-sm text-slate-500">
          Publier des articles — notification push aux enseignants abonnés.
        </p>
      </div>
      <AdminTeacherNewsClient articles={articles} />
    </div>
  );
}
