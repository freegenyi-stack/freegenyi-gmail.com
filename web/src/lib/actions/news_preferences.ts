"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { parseMetadata } from "@/lib/teacher/profile.server";
import {
  mergeNewsPreferencesIntoMetadata,
  parseNewsPreferences,
  type NewsPreferences,
} from "@/lib/news/preferences";
import {
  MAX_NOTIFICATION_INTERESTS,
  type NotificationInterestId,
} from "@/lib/onboarding/interest-topics";
import { mergeTeacherProfileIntoMetadata, extractTeacherProfile } from "@/lib/teacher/profile.server";

async function requireNewsUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || !["enseignant", "parent", "coparent"].includes(user.role || "")) return null;
  return user;
}

export async function getNewsPreferencesAction(): Promise<
  | {
      interests: NotificationInterestId[];
      preferences: NewsPreferences;
      role: string;
    }
  | { error: string }
> {
  const user = await requireNewsUser();
  if (!user) return { error: "Non autorisé" };

  const meta = parseMetadata(user.metadata);
  const tp = extractTeacherProfile(meta);
  const interests = (tp.notificationInterests?.length
    ? tp.notificationInterests
    : meta.notificationInterests) as NotificationInterestId[];

  return {
    interests: Array.isArray(interests) ? interests : [],
    preferences: parseNewsPreferences(user.metadata),
    role: user.role || "parent",
  };
}

export async function updateNewsPreferencesAction(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const user = await requireNewsUser();
  if (!user) return { error: "Non autorisé" };

  const interestsRaw = formData.get("notification_interests");
  let interests: NotificationInterestId[] = [];
  if (interestsRaw && typeof interestsRaw === "string") {
    try {
      const parsed = JSON.parse(interestsRaw) as unknown;
      if (Array.isArray(parsed)) interests = parsed as NotificationInterestId[];
    } catch {
      return { error: "Centres d'intérêt invalides." };
    }
  }

  if (interests.length !== MAX_NOTIFICATION_INTERESTS) {
    return { error: `Choisissez exactement ${MAX_NOTIFICATION_INTERESTS} thèmes.` };
  }

  const enabledTopics = formData.getAll("enabled_topics").map(String).filter(Boolean);
  const pushBreaking = formData.get("push_breaking") === "on";
  const pushDigest = formData.get("push_digest") === "on";

  const prefs: NewsPreferences = {
    enabledTopics,
    pushBreaking,
    pushDigest,
  };

  const prev = parseMetadata(user.metadata);
  let metadata = mergeNewsPreferencesIntoMetadata(prev, prefs);

  if (user.role === "enseignant") {
    const tp = extractTeacherProfile(prev);
    metadata = mergeTeacherProfileIntoMetadata(metadata, {
      ...tp,
      notificationInterests: interests,
      pushPrefs: {
        ...tp.pushPrefs,
        news: pushBreaking,
        digest: pushDigest,
        mur: tp.pushPrefs?.mur ?? true,
        messages: tp.pushPrefs?.messages ?? true,
      },
    });
  } else {
    metadata = { ...metadata, notificationInterests: interests };
  }

  await db
    .update(users)
    .set({ metadata: JSON.stringify(metadata), updatedAt: new Date() })
    .where(eq(users.id, user.id));

  revalidatePath("/dashboard/enseignant/actualites");
  revalidatePath("/dashboard/parent/actualites");
  revalidatePath("/dashboard/settings");

  return { success: true };
}
