import type { ChildLearningProfile } from "@/lib/child/learning-profile";
import type { NotificationInterestId } from "@/lib/onboarding/interest-topics";

/** Payload inscription parent mobile — aligné RegisterWizard web */
export type MobileParentRegisterPayload = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
  spouseEmail?: string;
  spouseFirstName?: string;
  childName: string;
  childCountry: string;
  childLevel: string;
  childAge: number;
  childSchool?: string;
  childSchoolId?: number | null;
  childRegion?: string;
  notificationInterests: NotificationInterestId[];
  learningProfile: ChildLearningProfile;
  locale?: string;
};

export type MobileRegisterResult =
  | { ok: true; userId: number; accessToken: string; trackingCode?: string }
  | { ok: false; error: string; code?: string };
