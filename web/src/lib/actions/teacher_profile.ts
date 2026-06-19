"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { saveTeacherProfilePhoto } from "@/lib/teacher/profile-photo.server";
import {
  buildTeacherFormState,
  extractTeacherProfile,
  mergeTeacherProfileIntoMetadata,
  parseMetadata,
} from "@/lib/teacher/profile.server";
import type { TeacherProfileData } from "@/lib/teacher/profile.types";
import { MAX_NOTIFICATION_INTERESTS } from "@/lib/onboarding/interest-topics";
import {
  getUserVerificationStatus,
  isVerificationApproved,
} from "@/lib/orgVerification.guard";

async function requireTeacher() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || user.role !== "enseignant") return null;
  return user;
}

export async function getTeacherProfileFormAction(): Promise<
  { profile: Awaited<ReturnType<typeof buildTeacherFormState>> } | { error: string }
> {
  const user = await requireTeacher();
  if (!user) return { error: "Non autorisé" };
  const profile = await buildTeacherFormState(user);
  return { profile };
}

export async function updateTeacherProfileAction(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const user = await requireTeacher();
  if (!user) return { error: "Non autorisé" };

  const fullName = (formData.get("full_name") as string)?.trim();
  if (!fullName) return { error: "Le nom est requis." };

  const prev = parseMetadata(user.metadata);
  const prevProfile = extractTeacherProfile(prev);
  const verificationStatus = await getUserVerificationStatus(user.id, user.metadata);
  const verified = isVerificationApproved(verificationStatus);

  const subjects = formData.getAll("subjects").map(String).filter(Boolean);
  const levels = formData.getAll("levels").map(String).filter(Boolean);
  const interests = formData.getAll("notification_interests").map(String).filter(Boolean);

  if (interests.length > 0 && interests.length !== MAX_NOTIFICATION_INTERESTS) {
    return { error: "Choisissez exactement 3 centres d'intérêt." };
  }

  const profile: TeacherProfileData = {
    bio: (formData.get("bio") as string)?.trim() || "",
    subjects: subjects.length ? subjects : prevProfile.subjects,
    levels: levels.length ? levels : prevProfile.levels,
    contactEnabled: verified ? formData.get("contact_enabled") === "on" : false,
    contactAllowParents:
      verified && formData.get("contact_enabled") === "on"
        ? formData.get("contact_allow_parents") === "on"
        : prevProfile.contactAllowParents !== false,
    contactAllowTeachers:
      verified && formData.get("contact_enabled") === "on"
        ? formData.get("contact_allow_teachers") === "on"
        : prevProfile.contactAllowTeachers ?? false,
    contactNote: (formData.get("contact_note") as string)?.trim() || "",
    contactChannels: {
      phone: {
        value: (formData.get("contact_phone") as string)?.trim() || "",
        visible: formData.get("visible_phone") === "on",
      },
      whatsapp: {
        value: (formData.get("contact_whatsapp") as string)?.trim() || "",
        visible: formData.get("visible_whatsapp") === "on",
      },
      facebook: {
        value: (formData.get("contact_facebook") as string)?.trim() || "",
        visible: formData.get("visible_facebook") === "on",
      },
      linkedin: {
        value: (formData.get("contact_linkedin") as string)?.trim() || "",
        visible: formData.get("visible_linkedin") === "on",
      },
      emailPro: {
        value: (formData.get("contact_email_pro") as string)?.trim() || "",
        visible: formData.get("visible_email_pro") === "on",
      },
    },
    pushPrefs: {
      mur: formData.get("push_mur") === "on",
      messages: formData.get("push_messages") === "on",
      digest: formData.get("push_digest") === "on",
      news: formData.get("push_news") === "on",
    },
    notificationInterests: interests.length ? interests : prevProfile.notificationInterests,
    availability: {
      enabled: formData.get("availability_enabled") === "on",
      acceptsTutoring: formData.get("accepts_tutoring") === "on",
      slots: JSON.parse((formData.get("availability_slots") as string) || "[]"),
    },
    avatarMode: (formData.get("avatar_mode") as "photo" | "catalog") || "catalog",
  };

  const phone = (formData.get("phone") as string)?.trim() || user.phone || "";
  const avatarId = (formData.get("avatar_id") as string)?.trim();
  const avatarConfig = avatarId ? JSON.stringify({ id: avatarId, style: "luxury" }) : user.avatarConfig;

  let image = user.image;
  const photoFile = formData.get("photo") as File | null;
  if (photoFile && photoFile.size > 0) {
    try {
      image = await saveTeacherProfilePhoto(user.id, photoFile);
      profile.avatarMode = "photo";
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Erreur photo." };
    }
  }

  await db
    .update(users)
    .set({
      fullName,
      phone,
      image,
      avatarConfig,
      metadata: JSON.stringify(mergeTeacherProfileIntoMetadata(prev, profile)),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath("/dashboard/enseignant/profil");
  return { success: true };
}
