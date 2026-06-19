import * as SecureStore from "expo-secure-store";

const KEYS = {
  locale: "fg_locale",
  role: "fg_role",
  parentToken: "fg_parent_token",
  childToken: "fg_child_token",
  childPinOk: "fg_child_pin_ok",
  onboardingDraft: "fg_onboarding_draft",
} as const;

export async function getItem(key: string) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function removeItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export const storage = {
  getLocale: () => getItem(KEYS.locale),
  setLocale: (v: string) => setItem(KEYS.locale, v),
  getRole: () => getItem(KEYS.role),
  setRole: (v: string) => setItem(KEYS.role, v),
  getParentToken: () => getItem(KEYS.parentToken),
  setParentToken: (v: string) => setItem(KEYS.parentToken, v),
  clearParentToken: () => removeItem(KEYS.parentToken),
  getChildToken: () => getItem(KEYS.childToken),
  setChildToken: (v: string) => setItem(KEYS.childToken, v),
  clearChildToken: () => removeItem(KEYS.childToken),
  getChildPinOk: () => getItem(KEYS.childPinOk),
  setChildPinOk: (v: "1" | "0") => setItem(KEYS.childPinOk, v),
  getOnboardingDraft: () => getItem(KEYS.onboardingDraft),
  setOnboardingDraft: (v: string) => setItem(KEYS.onboardingDraft, v),
};
