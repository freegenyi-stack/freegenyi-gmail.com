import Constants from "expo-constants";

/** URL API Next.js — dev : machine locale, prod : domaine FreeGeny */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new ApiError(data.error || res.statusText, data.error, res.status);
  }
  return data;
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  token?: string | null
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return parseJson<T>(res);
}

export async function apiGet<T>(path: string, token?: string | null): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return parseJson<T>(res);
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
  token?: string | null
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return parseJson<T>(res);
}

export type LoginResponse = {
  accessToken: string;
  user: {
    id: number;
    email: string;
    fullName: string | null;
    role: string;
    onboardingStep: number;
    onboarded: boolean;
  };
};

export type PairResponse = {
  accessToken: string;
  childId: number;
  childName: string;
  paired: boolean;
  needsPin: boolean;
};

export type LobbyResponse = {
  child: { id: number; fullName: string; firstName: string };
  stats: {
    xp: number;
    level: number;
    progress: number;
    breakdown?: { reading: number; exercises: number; badges: number; quizzes: number };
    pendingMissions?: number;
    booksRead?: number;
    exercisesDone?: number;
  };
  latestBoost?: { message: string; createdAt: string } | null;
  pendingWorksheets: number;
  pendingGeny: number;
  learningMode: "guided" | "semi_guided" | "explorer";
  dailyScreenMinutes: number;
};

export type ParentHomeResponse = {
  user: { id: number; fullName: string | null; email: string };
  children: {
    id: number;
    fullName: string;
    firstName: string;
    educationLevel: string | null;
    pendingMissions: number;
    pendingGeny: number;
    learningMode: string;
    dailyScreenMinutes: number;
  }[];
  totals: { children: number; pendingMissions: number; pendingGeny: number };
};

export type MetaOnboarding = {
  countries: { code: string; nameFr: string; nameAr: string }[];
  levelsByCountry: Record<string, string[]>;
  learningModes: { id: string; labelFr: string; labelAr: string; descFr: string; descAr: string }[];
  dailyScreenOptions: number[];
  interestTopics: { id: string }[];
  maxInterests: number;
};

export type RegisterResponse = {
  accessToken: string;
  userId: number;
  trackingCode?: string;
  onboarded: boolean;
};

export type ChildrenResponse = {
  children: { id: number; fullName: string; educationLevel: string | null; firstName: string }[];
};

export type PairingCodeResponse = {
  code: string;
  expiresAt: string;
};

export type AvailabilityResponse = {
  available: boolean;
  error?: string;
};

export async function checkAvailability(
  field: "email" | "username",
  value: string
): Promise<AvailabilityResponse> {
  return apiGet<AvailabilityResponse>(
    `/api/mobile/auth/check?field=${field}&value=${encodeURIComponent(value)}`
  );
}

export type MeResponse = {
  user: {
    id: number;
    email: string;
    fullName: string | null;
    role: string;
    onboardingStep: number;
    onboarded: boolean;
  };
};
