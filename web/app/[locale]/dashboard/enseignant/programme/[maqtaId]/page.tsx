import { redirect } from "next/navigation";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import { buildProgramSectionDetail } from "@/lib/curriculum/hub.server";
import ProgrammeSectionClient from "@/components/curriculum/ProgrammeSectionClient";
import type { CurriculumSubject } from "@/lib/curriculum/types";
import { teacherSchoolIdFromMetadata, listTeacherSchoolChildren } from "@/lib/library/books.server";

export default async function TeacherProgrammeSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; maqtaId: string }>;
  searchParams: Promise<{ subject?: string }>;
}) {
  const { locale, maqtaId } = await params;
  const { user } = await requireTeacherPage(locale);

  const sp = await searchParams;
  const subject = (sp.subject ?? "ar_islam_civique") as CurriculumSubject;

  const detail = await buildProgramSectionDetail("DZ", "1AP", subject, maqtaId);
  if (!detail) redirect(`/${locale}/dashboard/enseignant/programme`);

  const schoolId = teacherSchoolIdFromMetadata(user.metadata);
  const schoolChildren = schoolId ? await listTeacherSchoolChildren(schoolId) : [];
  const childOptions = schoolChildren.map((c) => ({
    id: c.id,
    fullName: c.fullName,
  }));

  return (
    <ProgrammeSectionClient
      detail={detail}
      mode="teacher"
      backHref={`/${locale}/dashboard/enseignant/programme`}
      subject={subject}
      children={childOptions}
      selectedChildId={childOptions[0]?.id ?? null}
      atelierHref={`/${locale}/dashboard/enseignant/atelier`}
    />
  );
}
