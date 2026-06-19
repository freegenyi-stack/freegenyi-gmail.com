"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import DifficultyStars from "@/components/teacher/DifficultyStars";
import {
  createTeacherCourseAction,
  deleteTeacherCourseAction,
  seedTeacherCoursesAction,
  updateTeacherCourseAction,
} from "@/lib/actions/teacher_courses_admin";
import type { TeacherCourseAdminDto } from "@/lib/teacher/courses-admin.server";

const EMPTY = {
  kind: "direct",
  slug: "",
  titleFr: "",
  titleAr: "",
  durationLabel: "",
  durationMinutes: "",
  difficultyLevel: "1",
  tagFr: "",
  tagAr: "",
  totalEpisodes: "1",
  externalUrl: "",
  sortOrder: "0",
  isPublished: true,
};

export default function AdminTeacherCoursesClient({ courses }: { courses: TeacherCourseAdminDto[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState<number | null>(null);

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (c: TeacherCourseAdminDto) => {
    setEditingId(c.id);
    setShowForm(true);
    setForm({
      kind: c.kind,
      slug: c.slug,
      titleFr: c.titleFr,
      titleAr: c.titleAr,
      durationLabel: c.durationLabel ?? "",
      durationMinutes: c.durationMinutes ? String(c.durationMinutes) : "",
      difficultyLevel: String(c.difficultyLevel),
      tagFr: c.tagFr ?? "",
      tagAr: c.tagAr ?? "",
      totalEpisodes: String(c.totalEpisodes),
      externalUrl: c.externalUrl ?? "",
      sortOrder: String(c.sortOrder),
      isPublished: c.isPublished,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(editingId ?? -1);
    const fd = new FormData();
    fd.set("kind", form.kind);
    fd.set("slug", form.slug);
    fd.set("title_fr", form.titleFr);
    fd.set("title_ar", form.titleAr);
    fd.set("duration_label", form.durationLabel);
    fd.set("duration_minutes", form.durationMinutes);
    fd.set("difficulty_level", form.difficultyLevel);
    fd.set("tag_fr", form.tagFr);
    fd.set("tag_ar", form.tagAr);
    fd.set("total_episodes", form.totalEpisodes);
    fd.set("external_url", form.externalUrl);
    fd.set("sort_order", form.sortOrder);
    if (form.isPublished) fd.set("is_published", "on");

    const res = editingId ? await updateTeacherCourseAction(editingId, fd) : await createTeacherCourseAction(fd);
    setLoading(null);
    if ("success" in res) {
      toast.success(editingId ? "Formation mise à jour" : "Formation créée");
      reset();
    } else toast.error(res.error);
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer cette formation ?")) return;
    setLoading(id);
    const res = await deleteTeacherCourseAction(id);
    setLoading(null);
    if ("success" in res) toast.success("Supprimée");
    else toast.error("Erreur");
  };

  const runSeed = async () => {
    setLoading(-2);
    const res = await seedTeacherCoursesAction();
    setLoading(null);
    if ("success" in res) toast.success("Seed exécuté");
    else toast.error("Erreur seed");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => { reset(); setShowForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Nouvelle formation
        </Button>
        <Button type="button" variant="outline" onClick={runSeed} disabled={loading === -2} className="gap-2">
          <Database className="h-4 w-4" /> Importer le seed par défaut
        </Button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
          <label className="text-sm font-bold">Type
            <select value={form.kind} onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
              <option value="direct">Directe</option>
              <option value="series">Série</option>
            </select>
          </label>
          <label className="text-sm font-bold">Slug
            <input required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
          </label>
          <label className="text-sm font-bold">Titre FR<input required value={form.titleFr} onChange={(e) => setForm((f) => ({ ...f, titleFr: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
          <label className="text-sm font-bold">Titre AR<input required value={form.titleAr} onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))} dir="rtl" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
          <label className="text-sm font-bold">Durée (label)<input value={form.durationLabel} onChange={(e) => setForm((f) => ({ ...f, durationLabel: e.target.value }))} placeholder="25 min" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
          <label className="text-sm font-bold">Durée (minutes)<input type="number" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
          <label className="text-sm font-bold">Difficulté (1-3)
            <select value={form.difficultyLevel} onChange={(e) => setForm((f) => ({ ...f, difficultyLevel: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
              <option value="1">1 — Facile</option>
              <option value="2">2 — Intermédiaire</option>
              <option value="3">3 — Avancé</option>
            </select>
          </label>
          <label className="text-sm font-bold">Épisodes<input type="number" value={form.totalEpisodes} onChange={(e) => setForm((f) => ({ ...f, totalEpisodes: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
          <label className="text-sm font-bold">Tag FR<input value={form.tagFr} onChange={(e) => setForm((f) => ({ ...f, tagFr: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
          <label className="text-sm font-bold">Tag AR<input value={form.tagAr} onChange={(e) => setForm((f) => ({ ...f, tagAr: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
          <label className="text-sm font-bold md:col-span-2">URL externe<input value={form.externalUrl} onChange={(e) => setForm((f) => ({ ...f, externalUrl: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
          <label className="flex items-center gap-2 text-sm font-bold md:col-span-2">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} /> Publiée
          </label>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" disabled={loading !== null}>{editingId ? "Enregistrer" : "Créer"}</Button>
            <Button type="button" variant="outline" onClick={reset}>Annuler</Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-[10px] font-black uppercase text-slate-500">
              <th className="p-3">Formation</th>
              <th className="p-3">Type</th>
              <th className="p-3">Difficulté</th>
              <th className="p-3">Durée</th>
              <th className="p-3">Statut</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-slate-100">
                <td className="p-3 font-bold text-slate-900">{c.titleFr}</td>
                <td className="p-3">{c.kind}</td>
                <td className="p-3"><DifficultyStars level={c.difficultyLevel} /></td>
                <td className="p-3">{c.durationMinutes ? `${c.durationMinutes} min` : c.durationLabel ?? "—"}</td>
                <td className="p-3">{c.isPublished ? "Publiée" : "Brouillon"}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => startEdit(c)} className="rounded p-1 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                    <button type="button" disabled={loading === c.id} onClick={() => remove(c.id)} className="rounded p-1 hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
