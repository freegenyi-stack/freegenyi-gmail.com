export type LearningMode = "guided" | "semi_guided" | "explorer";

export type ChildLearningProfile = {
  conditionIds: string[];
  questionnaire: Record<string, unknown>;
  learningMode: LearningMode;
  dailyScreenMinutes: number;
  updatedAt: string;
};

export type OnboardingStepId =
  | "profile"
  | "schooling"
  | "interests"
  | "school"
  | "learning"
  | "ally"
  | "finish";

export const ONBOARDING_STEPS: OnboardingStepId[] = [
  "profile",
  "schooling",
  "interests",
  "school",
  "learning",
  "ally",
  "finish",
];

export type OnboardingDraft = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  childName: string;
  childCountry: string;
  childLevel: string;
  childAge: string;
  childRegion: string;
  childSchool: string;
  childSchoolId: number | null;
  spouseEmail: string;
  notificationInterests: string[];
  learningProfile: ChildLearningProfile;
};

const DEFAULT_LEARNING: ChildLearningProfile = {
  conditionIds: [],
  questionnaire: {},
  learningMode: "semi_guided",
  dailyScreenMinutes: 20,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_DRAFT: OnboardingDraft = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  childName: "",
  childCountry: "DZ",
  childLevel: "1AP",
  childAge: "8",
  childRegion: "",
  childSchool: "",
  childSchoolId: null,
  spouseEmail: "",
  notificationInterests: [],
  learningProfile: DEFAULT_LEARNING,
};

export function stepIndex(step: OnboardingStepId) {
  return ONBOARDING_STEPS.indexOf(step);
}

export function nextStep(step: OnboardingStepId): OnboardingStepId | null {
  const i = stepIndex(step);
  return i >= 0 && i < ONBOARDING_STEPS.length - 1 ? ONBOARDING_STEPS[i + 1]! : null;
}

export function prevStep(step: OnboardingStepId): OnboardingStepId | null {
  const i = stepIndex(step);
  return i > 0 ? ONBOARDING_STEPS[i - 1]! : null;
}
