import { FgType } from "@/ui/theme";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityPlayer } from "@/components/activities/ActivityPlayer";
import { FgButton } from "@/components/FgButton";
import { apiGet, apiPost } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import type { ActivityResult, MissionPayload } from "@/types/activity";

export default function ChildMissionPlayerScreen() {
  const { progressId: progressIdParam } = useLocalSearchParams<{ progressId: string }>();
  const progressId = parseInt(progressIdParam ?? "", 10);
  const [payload, setPayload] = useState<MissionPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<ActivityResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      const token = await storage.getChildToken();
      if (!token || Number.isNaN(progressId)) {
        router.replace("/child/pair");
        return;
      }
      try {
        const locale = (await storage.getLocale()) || "fr";
        const data = await apiGet<MissionPayload>(
          `/api/mobile/child/missions/${progressId}?locale=${locale}`,
          token
        );
        setPayload(data);
        if (data.status !== "done") {
          await apiPost(`/api/mobile/child/missions/${progressId}/progress`, { status: "in_progress" }, token);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [progressId]);

  const onComplete = async (activityResult: ActivityResult) => {
    const token = await storage.getChildToken();
    if (!token) return;
    setSubmitting(true);
    try {
      await apiPost(
        `/api/mobile/child/missions/${progressId}/progress`,
        { status: "done", result: activityResult },
        token
      );
      setResult(activityResult);
      setFinished(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !payload) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (finished && result) {
    return (
      <View style={styles.root}>
        <View style={styles.doneBox}>
          <Text style={styles.doneEmoji}>🎉</Text>
          <Text style={styles.doneTitle}>{t("child.missionComplete")}</Text>
          <Text style={styles.doneScore}>
            {result.score}% · +{result.xpGagne} XP · {"⭐".repeat(result.nbEtoiles)}
          </Text>
          <FgButton label={t("child.backMissions")} onPress={() => router.replace("/child/missions")} />
        </View>
      </View>
    );
  }

  if (!payload.isActivity) {
    return (
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>← {t("back")}</Text>
          </Pressable>
          <Text style={styles.docTitle}>{payload.resourceTitle}</Text>
          <Text style={styles.docHint}>{t("child.documentHint")}</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.rootLight}>
      <ScrollView contentContainerStyle={styles.scrollLight}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backDark}>← {t("back")}</Text>
        </Pressable>
        <Text style={styles.missionTitle}>{payload.resourceTitle}</Text>
        {submitting ? (
          <ActivityIndicator color="#F97316" />
        ) : (
          <ActivityPlayer
            envelope={payload.envelope}
            activityType={payload.activityType}
            resourceId={payload.resourceId}
            langue={payload.langue}
            onComplete={(r) => void onComplete(r)}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFBF7" },
  root: { flex: 1, backgroundColor: "#020617", justifyContent: "center", padding: 24 },
  rootLight: { flex: 1, backgroundColor: "#FFFBF7" },
  scroll: { padding: 20 },
  scrollLight: { padding: 20, paddingBottom: 40 },
  back: { color: "#94A3B8", fontWeight: "800", marginBottom: 16 },
  backDark: { color: "#64748B", fontWeight: "800", marginBottom: 16 },
  missionTitle: { ...FgType.regular, fontSize: 22, fontWeight: "900", color: "#0F172A", marginBottom: 16 },
  docTitle: { ...FgType.regular, color: "#fff", fontSize: 24, fontWeight: "900" },
  docHint: { color: "#94A3B8", marginTop: 12, lineHeight: 20 },
  doneBox: {
    backgroundColor: "#0F172A",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  doneEmoji: { ...FgType.regular, fontSize: 48 },
  doneTitle: { ...FgType.regular, color: "#fff", fontSize: 24, fontWeight: "900" },
  doneScore: { ...FgType.regular, color: "#F97316", fontSize: 16, fontWeight: "800", marginBottom: 8 },
});
