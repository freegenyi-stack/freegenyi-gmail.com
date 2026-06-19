import { FgType } from "@/ui/theme";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityPlayer } from "@/components/activities/ActivityPlayer";
import { FgButton } from "@/components/FgButton";
import { apiGet, apiPost } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import type { ActivityContentEnvelope, ActivityResult, ActivityType } from "@/types/activity";

type PlayPayload = {
  sessionKey: string;
  titleFr: string;
  titleAr: string;
  subject: string;
  xpReward: number;
  envelope: ActivityContentEnvelope;
  activityType: ActivityType;
  itemCount: number;
};

export default function ChildCurriculumSessionScreen() {
  const { sessionKey } = useLocalSearchParams<{ sessionKey: string }>();
  const [play, setPlay] = useState<PlayPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<ActivityResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      const token = await storage.getChildToken();
      if (!token || !sessionKey) {
        router.replace("/child/pair");
        return;
      }
      try {
        const data = await apiGet<{ play: PlayPayload; langue: "fr" | "ar" }>(
          `/api/mobile/child/curriculum/session/${sessionKey}`,
          token
        );
        setPlay(data.play);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionKey]);

  const onComplete = async (activityResult: ActivityResult) => {
    const token = await storage.getChildToken();
    if (!token || !play) return;
    setSubmitting(true);
    const correct =
      activityResult.answers?.entries.filter((e) => e.correct).length ??
      Math.round((activityResult.score / 100) * play.itemCount);
    try {
      await apiPost(
        `/api/mobile/child/curriculum/session/${sessionKey}/complete`,
        {
          score: activityResult.score,
          correctCount: correct,
          totalCount: play.itemCount,
          subject: play.subject,
          answers: activityResult.answers,
        },
        token
      );
      setResult(activityResult);
      setFinished(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !play) {
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
          <Text style={styles.doneTitle}>{t("child.pathComplete")}</Text>
          <Text style={styles.doneScore}>
            {result.score}% · +{result.xpGagne} XP · {"⭐".repeat(result.nbEtoiles)}
          </Text>
          <FgButton label={t("child.backPath")} onPress={() => router.replace("/child/path")} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.rootLight}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← {t("back")}</Text>
        </Pressable>
        <Text style={styles.title}>{play.titleFr}</Text>
        {submitting ? (
          <ActivityIndicator color="#F97316" />
        ) : (
          <ActivityPlayer
            envelope={play.envelope}
            activityType={play.activityType}
            resourceId={0}
            langue="fr"
            onComplete={(r) => void onComplete(r)}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1e1b4b", justifyContent: "center", padding: 24 },
  rootLight: { flex: 1, backgroundColor: "#FFFBF7" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { color: "#EA580C", fontWeight: "800", marginBottom: 12 },
  title: { ...FgType.regular, fontSize: 22, fontWeight: "900", color: "#1e293b", marginBottom: 16 },
  doneBox: { alignItems: "center", gap: 16 },
  doneEmoji: { ...FgType.regular, fontSize: 56 },
  doneTitle: { ...FgType.regular, color: "#fff", fontSize: 24, fontWeight: "900", textAlign: "center" },
  doneScore: { ...FgType.regular, color: "#c4b5fd", fontSize: 16, fontWeight: "700" },
});
