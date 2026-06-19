export type AppLocale = "fr" | "ar";

export type AppRole = "parent" | "child";

/** Étapes onboarding parent mobile — alignées wizard RegisterClient web */
export const PARENT_ONBOARDING_STEPS = [
  "profile",
  "schooling",
  "interests",
  "school",
  "learning",
  "ally",
  "finish",
] as const;

export type ParentOnboardingStep = (typeof PARENT_ONBOARDING_STEPS)[number];

export type ParentSession = {
  accessToken: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
  onboardingStep: number;
  onboarded: boolean;
};

export type ChildSession = {
  accessToken: string;
  childId: number;
  childName: string;
  pinVerified: boolean;
};

export type ChildLearningProfile = {
  conditionIds: string[];
  questionnaire: Record<string, unknown>;
  learningMode: "guided" | "semi_guided" | "explorer";
  dailyScreenMinutes: number;
  updatedAt: string;
};

export type OnboardingDraft = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  spouseEmail: string;
  childName: string;
  childCountry: string;
  childLevel: string;
  childAge: string;
  childSchool: string;
  childSchoolId: number | null;
  childRegion: string;
  notificationInterests: string[];
  learningProfile: ChildLearningProfile;
};

export const DEFAULT_ONBOARDING_DRAFT: OnboardingDraft = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  spouseEmail: "",
  childName: "",
  childCountry: "DZ",
  childLevel: "1AP",
  childAge: "8",
  childSchool: "",
  childSchoolId: null,
  childRegion: "",
  notificationInterests: [],
  learningProfile: {
    conditionIds: [],
    questionnaire: {},
    learningMode: "semi_guided",
    dailyScreenMinutes: 20,
    updatedAt: new Date().toISOString(),
  },
};
