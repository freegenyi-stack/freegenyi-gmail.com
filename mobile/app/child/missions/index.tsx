import { FgType } from "@/ui/theme";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { router } from "expo-router";
import { apiGet } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import type { ChildMission } from "@/types/activity";

export default function ChildMissionsScreen() {
  const [missions, setMissions] = useState<ChildMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const token = await storage.getChildToken();
      if (!token) {
        router.replace("/child/pair");
        return;
      }
      try {
        const res = await apiGet<{ missions: ChildMission[] }>("/api/mobile/child/missions", token);
        setMissions(res.missions);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pending = missions.filter((m) => m.status !== "done");
  const done = missions.filter((m) => m.status === "done");

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← {t("back")}</Text>
        </Pressable>
        <Text style={styles.title}>{t("child.portalMissions")}</Text>
        <Text style={styles.subtitle}>{t("child.missionsSubtitle")}</Text>

        {pending.length === 0 && done.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t("child.missionsEmpty")}</Text>
          </View>
        ) : null}

        {pending.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("child.missionsPending", { count: String(pending.length) })}</Text>
            {pending.map((m) => (
              <Pressable
                key={m.progressId}
                style={styles.row}
                onPress={() => router.push(`/child/missions/${m.progressId}`)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{m.resourceTitle}</Text>
                  {m.teacherName ? <Text style={styles.rowMeta}>{m.teacherName}</Text> : null}
                </View>
                <View style={styles.playBadge}>
                  <Text style={styles.play}>{m.isActivity ? t("child.play") : t("child.read")}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : null}

        {done.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: "#34D399" }]}>
              {t("child.missionsDone", { count: String(done.length) })}
            </Text>
            {done.map((m) => (
              <View key={m.progressId} style={styles.doneRow}>
                <Text style={styles.doneTitle}>{m.resourceTitle}</Text>
                {m.xpEarned ? <Text style={styles.xp}>+{m.xpEarned} XP</Text> : null}
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#020617" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#020617" },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { marginBottom: 16 },
  backText: { ...FgType.regular, color: "#94A3B8", fontWeight: "800", fontSize: 14 },
  title: { ...FgType.regular, color: "#fff", fontSize: 28, fontWeight: "900" },
  subtitle: { ...FgType.regular, color: "#94A3B8", fontSize: 14, marginBottom: 20 },
  empty: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
  },
  emptyText: { color: "#94A3B8" },
  section: { marginBottom: 24 },
  sectionTitle: { ...FgType.regular, color: "#F97316", fontSize: 12, fontWeight: "900", textTransform: "uppercase", marginBottom: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  rowTitle: { ...FgType.regular, color: "#fff", fontWeight: "800", fontSize: 15 },
  rowMeta: { ...FgType.regular, color: "#94A3B8", fontSize: 12, marginTop: 4 },
  playBadge: {
    backgroundColor: "#F97316",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  play: { ...FgType.regular, color: "#fff",
    fontWeight: "900",
    fontSize: 10,
    textTransform: "uppercase", },
  doneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  doneTitle: { ...FgType.regular, color: "#CBD5E1", fontSize: 14 },
  xp: { color: "#F97316", fontWeight: "800" },
});
