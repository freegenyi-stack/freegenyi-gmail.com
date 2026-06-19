"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import {
  createTeacherNewsArticleAction,
  deleteTeacherNewsArticleAction,
  toggleTeacherNewsPublishAction,
  updateTeacherNewsArticleAction,
} from "@/lib/actions/teacher_news_admin";
import { TEACHER_NEWS_TOPICS } from "@/lib/teacher/news-constants";
import type { TeacherNewsArticleAdminDto } from "@/lib/teacher/news-admin.server";

const EMPTY_FORM = {
  topic: "pedagogy",
  titleFr: "",
  titleAr: "",
  excerptFr: "",
  excerptAr: "",
  bodyFr: "",
  bodyAr: "",
  interestTags: '["education"]',
  publishedAt: new Date().toISOString().slice(0, 16),
  isPublished: false,
};

export default function AdminTeacherNewsClient({ articles }: { articles: TeacherNewsArticleAdminDto[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState<number | null>(null);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (article: TeacherNewsArticleAdminDto) => {
    setEditingId(article.id);
    setShowForm(true);
    setForm({
      topic: article.topic,
      titleFr: article.titleFr,
      titleAr: article.titleAr,
      excerptFr: article.excerptFr,
      excerptAr: article.excerptAr,
      bodyFr: article.bodyFr || "",
      bodyAr: article.bodyAr || "",
      interestTags: article.interestTags || '["education"]',
      publishedAt: article.publishedAt.replace("T", "T").slice(0, 16),
      isPublished: article.isPublished,
    });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(editingId ?? -1);
    const fd = new FormData();
    fd.set("topic", form.topic);
    fd.set("title_fr", form.titleFr);
    fd.set("title_ar", form.titleAr);
    fd.set("excerpt_fr", form.excerptFr);
    fd.set("excerpt_ar", form.excerptAr);
    fd.set("body_fr", form.bodyFr);
    fd.set("body_ar", form.bodyAr);
    fd.set("body_fr", form.bodyFr);
    fd.set("body_ar", form.bodyAr);
    fd.set("interest_tags", form.interestTags);
    fd.set("published_at", form.publishedAt);
    if (form.isPublished) fd.set("is_published", "on");

    const result = editingId
      ? await updateTeacherNewsArticleAction(editingId, fd)
      : await createTeacherNewsArticleAction(fd);

    setLoading(null);
    if ("success" in result && result.success) {
      toast.success(editingId ? "Article mis à jour" : "Article créé");
      window.location.reload();
      return;
    }
    toast.error("error" in result ? result.error : "Erreur");
  };

  const handleTogglePublish = async (id: number, publish: boolean) => {
    setLoading(id);
    const result = await toggleTeacherNewsPublishAction(id, publish);
    setLoading(null);
    if ("success" in result && result.success) {
      toast.success(publish ? "Publié + notifications envoyées" : "Dépublié");
      window.location.reload();
      return;
    }
    toast.error("error" in result ? result.error : "Erreur");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet article ?")) return;
    setLoading(id);
    const result = await deleteTeacherNewsArticleAction(id);
    setLoading(null);
    if ("success" in result && result.success) {
      toast.success("Supprimé");
      window.location.reload();
      return;
    }
    toast.error("error" in result ? result.error : "Erreur");
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{articles.length} article(s)</p>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-black uppercase text-white hover:bg-teal-500"
        >
          <Plus className="h-4 w-4" /> Nouvel article
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitForm} className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900">{editingId ? "Modifier" : "Créer"} un article</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold text-slate-600">
              Topic
              <select
                value={form.topic}
                onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {TEACHER_NEWS_TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>{t.labelFr}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold text-slate-600">
              Date publication
              <input
                type="datetime-local"
                value={form.publishedAt}
                onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          {[
            ["titleFr", "Titre FR"],
            ["titleAr", "Titre AR"],
            ["excerptFr", "Extrait FR"],
            ["excerptAr", "Extrait AR"],
          ].map(([key, label]) => (
            <label key={key} className="block text-xs font-bold text-slate-600">
              {label}
              <input
                required
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          ))}
          <label className="block text-xs font-bold text-slate-600">
            Corps FR (article complet)
            <textarea
              value={form.bodyFr}
              onChange={(e) => setForm((f) => ({ ...f, bodyFr: e.target.value }))}
              rows={6}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            Corps AR
            <textarea
              value={form.bodyAr}
              onChange={(e) => setForm((f) => ({ ...f, bodyAr: e.target.value }))}
              rows={6}
              dir="rtl"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            Tags intérêt (JSON array)
            <input
              value={form.interestTags}
              onChange={(e) => setForm((f) => ({ ...f, interestTags: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
            />
            Publier immédiatement (+ push aux enseignants concernés)
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading !== null}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black uppercase text-white disabled:opacity-60"
            >
              {editingId ? "Enregistrer" : "Créer"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black uppercase">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-black text-slate-900">{article.titleFr}</p>
                <p className="text-xs text-slate-500 mt-1">{article.topic} · {article.publishedAt}</p>
              </div>
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${article.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {article.isPublished ? "Publié" : "Brouillon"}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{article.excerptFr}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={loading === article.id}
                onClick={() => startEdit(article)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-black uppercase"
              >
                <Pencil className="h-3 w-3" /> Modifier
              </button>
              <button
                type="button"
                disabled={loading === article.id}
                onClick={() => handleTogglePublish(article.id, !article.isPublished)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-black uppercase"
              >
                {article.isPublished ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {article.isPublished ? "Dépublier" : "Publier"}
              </button>
              <button
                type="button"
                disabled={loading === article.id}
                onClick={() => handleDelete(article.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase text-red-700"
              >
                <Trash2 className="h-3 w-3" /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
