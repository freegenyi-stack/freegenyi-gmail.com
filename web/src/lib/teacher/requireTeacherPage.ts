import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { extractTeacherProfile, parseMetadata } from "@/lib/teacher/profile.server";
import { isTeacherProfileComplete } from "@/lib/teacher/profile-complete";
import { getUserVerificationStatus, isVerificationApproved } from "@/lib/orgVerification.guard";

export async function requireTeacherPage(locale: string) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user || user.role !== "enseignant") {
    redirect(`/${locale}/dashboard/parent`);
  }

  if (user.onboardingStep! < 4) {
    redirect(`/${locale}/dashboard/onboarding?type=enseignant`);
  }

  const metadata = parseMetadata(user.metadata);
  const tp = extractTeacherProfile(metadata);
  const verificationStatus = await getUserVerificationStatus(user.id, user.metadata);

  return {
    user: {
      id: user.id,
      fullName: user.fullName || session.user.name || "",
      email: user.email,
      image: user.image || session.user.image,
      avatarConfig: user.avatarConfig,
      metadata: user.metadata,
    },
    profile: {
      schoolName: (metadata.teacherSchoolName as string) || "",
      subjects: tp.subjects?.length ? tp.subjects : metadata.teacherSubject ? [String(metadata.teacherSubject)] : [],
      levels: tp.levels?.length ? tp.levels : metadata.teacherLevel ? [String(metadata.teacherLevel)] : [],
      bio: tp.bio || (metadata.teacherBio as string) || "",
      avatarMode: tp.avatarMode || "catalog",
      profileComplete: isTeacherProfileComplete(user.metadata, {
        image: user.image,
        avatarConfig: user.avatarConfig,
      }),
    },
    verification: {
      status: verificationStatus,
      approved: isVerificationApproved(verificationStatus),
    },
  };
}
