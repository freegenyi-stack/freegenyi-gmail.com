import React from "react";
import { listAllTeacherCoursesAdmin } from "@/lib/teacher/courses-admin.server";
import AdminTeacherCoursesClient from "./AdminTeacherCoursesClient";

export default async function AdminTeacherCoursesPage() {
  const courses = await listAllTeacherCoursesAdmin();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Formations enseignant</h1>
        <p className="mt-1 text-sm text-slate-500">Gérer les parcours, la difficulté et la durée affichées dans l&apos;espace enseignant.</p>
      </div>
      <AdminTeacherCoursesClient courses={courses} />
    </div>
  );
}
