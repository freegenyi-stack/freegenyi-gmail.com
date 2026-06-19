import { FgType } from "@/ui/theme";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { FgButton } from "@/components/FgButton";
import { FormInput } from "@/components/FormInput";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  ONBOARDING_STEPS,
  nextStep,
  prevStep,
  type OnboardingStepId,
} from "@/types/onboarding";
import {
  apiGet,
  apiPost,
  ApiError,
  checkAvailability,
  type MetaOnboarding,
  type RegisterResponse,
} from "@/lib/api";
import { storage } from "@/lib/storage";
import { t, type Locale } from "@/i18n";

const INTEREST_LABELS: Record<string, string> = {
  news: "Actualités",
  sports: "Sport",
  music: "Musique",
  reading: "Lecture",
  science: "Sciences",
  arts: "Arts",
  technology: "Tech",
  education: "Éducation",
  games: "Jeux",
  health: "Santé",
  culture: "Culture",
  nature: "Nature",
};

export default function ParentOnboardingStepScreen() {
  const { step: stepParam } = useLocalSearchParams<{ step: string }>();
  const current = (ONBOARDING_STEPS.includes(stepParam as OnboardingStepId)
    ? stepParam
    : "profile") as OnboardingStepId;
  const next = nextStep(current);
  const previous = prevStep(current);

  const { draft, update, reset, loaded } = useOnboarding();
  const [meta, setMeta] = useState<MetaOnboarding | null>(null);
  const [schoolQuery, setSchoolQuery] = useState("");
  const [schoolResults, setSchoolResults] = useState<{ id: number; nameFr: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void apiGet<MetaOnboarding>("/api/mobile/meta/onboarding").then(setMeta).catch(() => null);
  }, []);

  useEffect(() => {
    if (schoolQuery.length < 2) {
      setSchoolResults([]);
      return;
    }
    const timer = setTimeout(() => {
      void apiGet<{ id: number; nameFr: string }[]>(
        `/api/schools/search?q=${encodeURIComponent(schoolQuery)}&country=${draft.childCountry}&limit=8`
      )
        .then(setSchoolResults)
        .catch(() => setSchoolResults([]));
    }, 350);
    return () => clearTimeout(timer);
  }, [schoolQuery, draft.childCountry]);

  const titleMap: Record<OnboardingStepId, string> = {
    profile: t("onboarding.stepProfile"),
    schooling: t("onboarding.stepSchooling"),
    interests: t("onboarding.stepInterests"),
    school: t("onboarding.stepSchool"),
    learning: t("onboarding.stepLearning"),
    ally: t("onboarding.stepAlly"),
    finish: t("onboarding.stepFinish"),
  };

  const validateStep = (): string | null => {
    if (current === "profile") {
      if (!draft.fullName || !draft.username || !draft.email || !draft.password) {
        return t("errors.missing_fields");
      }
      if (draft.password !== draft.confirmPassword) return t("errors.password_mismatch");
    }
    if (current === "schooling" && !draft.childName) return t("errors.missing_fields");
    if (current === "interests" && draft.notificationInterests.length !== 3) {
      return t("errors.interests_required");
    }
    return null;
  };

  const goNext = async () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError(null);

    if (current === "profile") {
      setLoading(true);
      try {
        const [emailCheck, usernameCheck] = await Promise.all([
          checkAvailability("email", draft.email),
          checkAvailability("username", draft.username),
        ]);
        if (!emailCheck.available) {
          setError(t("errors.email_taken"));
          return;
        }
        if (!usernameCheck.available) {
          setError(t("errors.username_taken"));
          return;
        }
      } catch {
        setError(t("errors.generic"));
        return;
      } finally {
        setLoading(false);
      }
    }

    if (next) {
      router.push(`/parent/onboarding/${next}`);
      return;
    }
    await submitRegister();
  };

  const submitRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const locale = ((await storage.getLocale()) as Locale | null) ?? "fr";
      const res = await apiPost<RegisterResponse>("/api/mobile/auth/register", {
        email: draft.email,
        username: draft.username,
        password: draft.password,
        confirmPassword: draft.confirmPassword,
        fullName: draft.fullName,
        phone: draft.phone,
        spouseEmail: draft.spouseEmail,
        childName: draft.childName,
        childCountry: draft.childCountry,
        childLevel: draft.childLevel,
        childAge: parseInt(draft.childAge, 10) || 8,
        childSchool: draft.childSchool,
        childSchoolId: draft.childSchoolId,
        childRegion: draft.childRegion,
        notificationInterests: draft.notificationInterests,
        learningProfile: draft.learningProfile,
        locale,
      });
      await storage.setParentToken(res.accessToken);
      await storage.setRole("parent");
      reset();
      router.replace("/parent");
    } catch (e) {
      const code = e instanceof ApiError ? e.code : "generic";
      setError(t(`errors.${code}`) || t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (id: string) => {
    const set = new Set(draft.notificationInterests);
    if (set.has(id)) set.delete(id);
    else if (set.size < 3) set.add(id);
    update({ notificationInterests: [...set] });
  };

  const levels = meta?.levelsByCountry[draft.childCountry] ?? meta?.levelsByCountry.DZ ?? ["1AP"];

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#F97316" />
      </View>
    );
  }

  return (
    <Screen
      title={titleMap[current]}
      subtitle={`${ONBOARDING_STEPS.indexOf(current) + 1} / ${ONBOARDING_STEPS.length}`}
      footer={
        <View style={styles.footerRow}>
          {previous ? (
            <Pressable onPress={() => router.push(`/parent/onboarding/${previous}`)} style={styles.backBtn}>
              <Text style={styles.backText}>{t("back")}</Text>
            </Pressable>
          ) : (
            <View style={styles.backBtn} />
          )}
          <View style={{ flex: 1 }}>
            <FgButton
              label={current === "finish" ? t("onboarding.finish") : t("onboarding.next")}
              onPress={() => void goNext()}
              loading={loading}
            />
          </View>
        </View>
      }
    >
      {current === "profile" && (
        <>
          <FormInput label="Nom complet" value={draft.fullName} onChangeText={(v) => update({ fullName: v })} />
          <FormInput label="Identifiant" autoCapitalize="none" value={draft.username} onChangeText={(v) => update({ username: v })} />
          <FormInput label="Email" autoCapitalize="none" keyboardType="email-address" value={draft.email} onChangeText={(v) => update({ email: v })} />
          <FormInput label="Téléphone" keyboardType="phone-pad" value={draft.phone} onChangeText={(v) => update({ phone: v })} />
          <FormInput label="Mot de passe" secureTextEntry value={draft.password} onChangeText={(v) => update({ password: v })} />
          <FormInput label="Confirmer" secureTextEntry value={draft.confirmPassword} onChangeText={(v) => update({ confirmPassword: v })} />
        </>
      )}

      {current === "schooling" && (
        <>
          <FormInput label="Prénom de l'enfant" value={draft.childName} onChangeText={(v) => update({ childName: v })} />
          <FormInput label="Âge" keyboardType="number-pad" value={draft.childAge} onChangeText={(v) => update({ childAge: v })} />
          <Text style={styles.sectionLabel}>Pays</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
            {(meta?.countries ?? [{ code: "DZ", nameFr: "Algérie" }]).map((c) => (
              <Pressable
                key={c.code}
                onPress={() => update({ childCountry: c.code, childLevel: (meta?.levelsByCountry[c.code] ?? ["1AP"])[0]! })}
                style={[styles.chip, draft.childCountry === c.code && styles.chipActive]}
              >
                <Text style={[styles.chipText, draft.childCountry === c.code && styles.chipTextActive]}>{c.nameFr}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={styles.sectionLabel}>Niveau</Text>
          <View style={styles.chipsWrap}>
            {levels.map((lvl) => (
              <Pressable
                key={lvl}
                onPress={() => update({ childLevel: lvl })}
                style={[styles.chip, draft.childLevel === lvl && styles.chipActive]}
              >
                <Text style={[styles.chipText, draft.childLevel === lvl && styles.chipTextActive]}>{lvl}</Text>
              </Pressable>
            ))}
          </View>
          <FormInput label="Région / wilaya" value={draft.childRegion} onChangeText={(v) => update({ childRegion: v })} />
        </>
      )}

      {current === "interests" && (
        <>
          <Text style={styles.hint}>{t("onboarding.interestsHint")}</Text>
          <View style={styles.chipsWrap}>
            {(meta?.interestTopics ?? []).map(({ id }) => (
              <Pressable
                key={id}
                onPress={() => toggleInterest(id)}
                style={[styles.chip, draft.notificationInterests.includes(id) && styles.chipActive]}
              >
                <Text style={[styles.chipText, draft.notificationInterests.includes(id) && styles.chipTextActive]}>
                  {INTEREST_LABELS[id] ?? id}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.counter}>{draft.notificationInterests.length} / 3</Text>
        </>
      )}

      {current === "school" && (
        <>
          <FormInput
            label="Rechercher une école"
            value={schoolQuery || draft.childSchool}
            onChangeText={(v) => {
              setSchoolQuery(v);
              update({ childSchool: v, childSchoolId: null });
            }}
          />
          {schoolResults.map((s) => (
            <Pressable
              key={s.id}
              style={styles.schoolRow}
              onPress={() => {
                update({ childSchool: s.nameFr, childSchoolId: s.id });
                setSchoolQuery(s.nameFr);
                setSchoolResults([]);
              }}
            >
              <Text style={styles.schoolName}>{s.nameFr}</Text>
            </Pressable>
          ))}
        </>
      )}

      {current === "learning" && (
        <>
          <Text style={styles.sectionLabel}>{t("onboarding.learningMode")}</Text>
          {(meta?.learningModes ?? []).map((mode) => (
            <Pressable
              key={mode.id}
              onPress={() =>
                update({
                  learningProfile: { ...draft.learningProfile, learningMode: mode.id as typeof draft.learningProfile.learningMode },
                })
              }
              style={[styles.modeCard, draft.learningProfile.learningMode === mode.id && styles.modeCardActive]}
            >
              <Text style={styles.modeTitle}>{mode.labelFr}</Text>
              <Text style={styles.modeDesc}>{mode.descFr}</Text>
            </Pressable>
          ))}
          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>{t("onboarding.screenTime")}</Text>
          <View style={styles.chipsWrap}>
            {(meta?.dailyScreenOptions ?? [10, 15, 20, 30]).map((mins) => (
              <Pressable
                key={mins}
                onPress={() =>
                  update({ learningProfile: { ...draft.learningProfile, dailyScreenMinutes: mins } })
                }
                style={[styles.chip, draft.learningProfile.dailyScreenMinutes === mins && styles.chipActive]}
              >
                <Text style={[styles.chipText, draft.learningProfile.dailyScreenMinutes === mins && styles.chipTextActive]}>
                  {mins} min
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {current === "ally" && (
        <FormInput
          label="Email du co-parent (optionnel)"
          autoCapitalize="none"
          keyboardType="email-address"
          value={draft.spouseEmail}
          onChangeText={(v) => update({ spouseEmail: v })}
        />
      )}

      {current === "finish" && (
        <View style={styles.summary}>
          <Text style={styles.summaryLine}>• {draft.fullName}</Text>
          <Text style={styles.summaryLine}>• {draft.childName} — {draft.childLevel}</Text>
          <Text style={styles.summaryLine}>• {draft.childSchool || "École à préciser"}</Text>
          <Text style={styles.summaryHint}>{t("onboarding.finishHint")}</Text>
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFBF7" },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { minWidth: 64, paddingVertical: 12 },
  backText: { color: "#64748B", fontWeight: "700" },
  sectionLabel: { ...FgType.regular, fontSize: 13, fontWeight: "700", color: "#0F172A", marginBottom: 8, marginTop: 4 },
  hint: { ...FgType.regular, fontSize: 14, color: "#64748B", marginBottom: 12, lineHeight: 20 },
  chipsRow: { marginBottom: 12 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#E7E5E4",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  chipActive: { borderColor: "#F97316", backgroundColor: "#FFF7ED" },
  chipText: { ...FgType.regular, fontSize: 13, fontWeight: "700", color: "#475569" },
  chipTextActive: { color: "#C2410C" },
  counter: { marginTop: 8, fontWeight: "700", color: "#F97316" },
  schoolRow: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    marginBottom: 8,
  },
  schoolName: { ...FgType.regular, fontSize: 14, fontWeight: "600", color: "#0F172A" },
  modeCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E7E5E4",
    padding: 14,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  modeCardActive: { borderColor: "#F97316", backgroundColor: "#FFF7ED" },
  modeTitle: { ...FgType.regular, fontWeight: "800", color: "#0F172A", fontSize: 14 },
  modeDesc: { ...FgType.regular, marginTop: 4, fontSize: 12, color: "#64748B", lineHeight: 18 },
  summary: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E7E5E4",
  },
  summaryLine: { ...FgType.regular, fontSize: 15, color: "#0F172A", marginBottom: 8 },
  summaryHint: { ...FgType.regular, marginTop: 12, fontSize: 13, color: "#64748B", lineHeight: 20 },
  error: { ...FgType.regular, color: "#DC2626", marginTop: 12, fontSize: 14 },
});
