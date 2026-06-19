import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen, FgLoading } from "@/components/Screen";
import { FgButton } from "@/components/FgButton";
import { FgCard } from "@/components/ui";
import { apiGet, apiPatch, type ChildrenResponse, type MetaOnboarding } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t, type Locale } from "@/i18n";
import { useLocaleContext } from "@/context/LocaleContext";
import {  Fg , FgType } from "@/ui/theme";

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function ParentSettingsTab() {
  const { locale, setLocale } = useLocaleContext();
  const [token, setToken] = useState<string | null>(null);
  const [children, setChildren] = useState<ChildrenResponse["children"]>([]);
  const [meta, setMeta] = useState<MetaOnboarding | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [learningMode, setLearningMode] = useState<"guided" | "semi_guided" | "explorer">("semi_guided");
  const [screenMinutes, setScreenMinutes] = useState(20);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const tkn = await storage.getParentToken();
      setToken(tkn);
      const [childrenRes, metaRes] = await Promise.all([
        tkn ? apiGet<ChildrenResponse>("/api/mobile/parent/children", tkn) : Promise.resolve({ children: [] }),
        apiGet<MetaOnboarding>("/api/mobile/meta/onboarding"),
      ]);
      setChildren(childrenRes.children);
      setMeta(metaRes);
      if (childrenRes.children[0]) setSelectedChildId(childrenRes.children[0].id);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    if (!token || selectedChildId === null) return;
    setSaving(true);
    try {
      await apiPatch(
        `/api/mobile/parent/children/${selectedChildId}/learning-profile`,
        { learningMode, dailyScreenMinutes: screenMinutes },
        token
      );
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await storage.clearParentToken();
    await storage.setRole("");
    router.replace("/welcome/role");
  };

  if (loading) return <FgLoading />;

  return (
    <Screen title={t("parent.tabSettings")} subtitle={t("parent.settingsSubtitle")}>
      {children.length > 0 ? (
        <>
          <Text style={styles.label}>{t("parent.selectChild")}</Text>
          <View style={styles.chips}>
            {children.map((c) => (
              <Chip
                key={c.id}
                label={c.firstName}
                active={selectedChildId === c.id}
                onPress={() => setSelectedChildId(c.id)}
              />
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>{t("onboarding.learningMode")}</Text>
          {(meta?.learningModes ?? []).map((mode) => (
            <Pressable
              key={mode.id}
              onPress={() => setLearningMode(mode.id as typeof learningMode)}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <FgCard
                accent={learningMode === mode.id ? "warm" : "default"}
                style={[styles.modeCard, learningMode === mode.id && styles.modeCardActive]}
              >
                <Text style={styles.modeTitle}>{mode.labelFr}</Text>
                <Text style={styles.modeDesc}>{mode.descFr}</Text>
              </FgCard>
            </Pressable>
          ))}

          <Text style={[styles.label, { marginTop: 16 }]}>{t("onboarding.screenTime")}</Text>
          <View style={styles.chips}>
            {(meta?.dailyScreenOptions ?? [10, 15, 20, 30]).map((mins) => (
              <Chip
                key={mins}
                label={`${mins} min`}
                active={screenMinutes === mins}
                onPress={() => setScreenMinutes(mins)}
              />
            ))}
          </View>

          <View style={{ marginTop: 20 }}>
            <FgButton label={t("parent.saveSettings")} onPress={() => void save()} loading={saving} />
          </View>
        </>
      ) : (
        <FgCard accent="warm">
          <Text style={styles.empty}>{t("parent.noChildren")}</Text>
        </FgCard>
      )}

      <Text style={[styles.label, { marginTop: 24 }]}>{t("parent.languageLabel")}</Text>
      <View style={styles.chips}>
        {(["fr", "ar"] as Locale[]).map((code) => (
          <Chip
            key={code}
            label={code === "fr" ? t("parent.languageFr") : t("parent.languageAr")}
            active={locale === code}
            onPress={() => {
              void (async () => {
                await storage.setLocale(code);
                await setLocale(code);
              })();
            }}
          />
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <FgButton label={t("parent.logout")} onPress={() => void logout()} variant="ghost" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { ...FgType.regular, fontSize: 12,
    fontWeight: "900",
    color: Fg.muted,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5, },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderRadius: Fg.radius.pill,
    borderWidth: 2,
    borderColor: Fg.border,
    borderBottomWidth: 4,
    borderBottomColor: "#D6D3D1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Fg.white,
  },
  chipActive: {
    borderColor: Fg.orange,
    borderBottomColor: Fg.orangeDark,
    backgroundColor: Fg.creamWarm,
  },
  chipText: { ...FgType.regular, fontSize: 14, fontWeight: "800", color: Fg.muted },
  chipTextActive: { color: Fg.orangeDark },
  modeCard: { marginBottom: 10 },
  modeCardActive: { borderColor: Fg.orange, borderBottomColor: Fg.orangeMid },
  modeTitle: { ...FgType.regular, fontWeight: "900", color: Fg.ink, fontSize: 15 },
  modeDesc: { ...FgType.regular, marginTop: 4, fontSize: 13, color: Fg.muted, lineHeight: 20, fontWeight: "500" },
  empty: { ...FgType.regular, color: Fg.muted, fontSize: 15, fontWeight: "600", textAlign: "center" },
  pressed: { opacity: 0.92 },
});
