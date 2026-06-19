import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Screen, FgLoading } from "@/components/Screen";
import { FgCard, FgProgressBar } from "@/components/ui";
import { apiGet } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import {  Fg , FgType } from "@/ui/theme";

type ChildProgress = {
  childId: number;
  fullName: string;
  educationLevel: string | null;
  stats: {
    totalXp: number;
    level: number;
    progress: number;
    pendingMissions: number;
    booksRead: number;
    exercisesDone: number;
  };
  readingStats: {
    booksFinished: number;
    booksReading: number;
    readingStreakDays: number;
  };
  recentMissions: { resourceTitle: string; status: string; xpEarned: number | null }[];
};

type HistoryItem = {
  id: string;
  type: string;
  title: string;
  detail?: string;
  childName?: string;
  date: string;
};

export default function ParentProgressTab() {
  const [children, setChildren] = useState<ChildProgress[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const token = await storage.getParentToken();
      if (!token) return;
      try {
        const [progressRes, historyRes] = await Promise.all([
          apiGet<{ children: ChildProgress[] }>("/api/mobile/parent/progress", token),
          apiGet<{ items: HistoryItem[] }>("/api/mobile/parent/history?limit=20", token),
        ]);
        setChildren(progressRes.children);
        setHistory(historyRes.items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <FgLoading />;

  return (
    <Screen title={t("parent.tabProgress")} subtitle={t("parent.progressSubtitle")}>
      {children.length === 0 ? (
        <Text style={styles.empty}>{t("parent.noChildren")}</Text>
      ) : (
        children.map((child) => (
          <FgCard key={child.childId} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>🌟</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{child.fullName}</Text>
                <Text style={styles.level}>
                  {t("parent.levelXp", {
                    level: String(child.stats.level),
                    xp: String(child.stats.totalXp),
                  })}
                </Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>Lv.{child.stats.level}</Text>
              </View>
            </View>

            <View style={styles.progressWrap}>
              <FgProgressBar progress={child.stats.progress} height={14} trackColor={Fg.creamDeep} />
              <Text style={styles.progressPct}>{child.stats.progress}%</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.statEmoji}>📚</Text>
                <Text style={styles.stat}>{child.readingStats.booksFinished}</Text>
                <Text style={styles.statLabel}>{t("parent.booksRead")}</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statEmoji}>🎮</Text>
                <Text style={styles.stat}>{child.stats.exercisesDone}</Text>
                <Text style={styles.statLabel}>{t("parent.exercises")}</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statEmoji}>⏳</Text>
                <Text style={styles.stat}>{child.stats.pendingMissions}</Text>
                <Text style={styles.statLabel}>{t("child.tabMissions")}</Text>
              </View>
            </View>

            {child.recentMissions.slice(0, 3).map((m, i) => (
              <View key={i} style={styles.missionRow}>
                <Text style={styles.missionDot}>•</Text>
                <Text style={styles.mission} numberOfLines={1}>
                  {m.resourceTitle}{" "}
                  <Text style={styles.missionStatus}>({m.status})</Text>
                </Text>
              </View>
            ))}
          </FgCard>
        ))
      )}

      {history.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>{t("parent.historyTitle")}</Text>
          <FgCard>
            {history.slice(0, 10).map((item, idx) => (
              <View
                key={item.id}
                style={[styles.historyRow, idx < 9 && styles.historyRowBorder]}
              >
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyMeta}>
                  {item.childName ? `${item.childName} · ` : ""}
                  {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </FgCard>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { ...FgType.regular, color: Fg.muted, fontWeight: "600", fontSize: 15 },
  card: { marginBottom: 14, gap: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Fg.creamWarm,
    borderWidth: 2,
    borderColor: Fg.borderWarm,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { ...FgType.regular, fontSize: 22 },
  name: { ...FgType.regular, fontSize: 18, fontWeight: "900", color: Fg.ink },
  level: { ...FgType.regular, color: Fg.orange, fontWeight: "800", fontSize: 12, marginTop: 2 },
  levelBadge: {
    backgroundColor: Fg.orange,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Fg.radius.sm,
    borderBottomWidth: 3,
    borderBottomColor: Fg.orangeDark,
  },
  levelBadgeText: { ...FgType.regular, color: Fg.white, fontWeight: "900", fontSize: 11 },
  progressWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressPct: { ...FgType.regular, fontWeight: "900", color: Fg.orange, fontSize: 13, minWidth: 36 },
  statsRow: { flexDirection: "row", gap: 8 },
  statPill: {
    flex: 1,
    backgroundColor: Fg.creamWarm,
    borderRadius: Fg.radius.sm,
    padding: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Fg.border,
  },
  statEmoji: { ...FgType.regular, fontSize: 18 },
  stat: { ...FgType.regular, fontSize: 18, fontWeight: "900", color: Fg.ink, marginTop: 2 },
  statLabel: { ...FgType.regular, fontSize: 9, fontWeight: "800", color: Fg.muted, textTransform: "uppercase", marginTop: 2 },
  missionRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  missionDot: { ...FgType.regular, color: Fg.orange, fontWeight: "900", fontSize: 16 },
  mission: { ...FgType.regular, flex: 1, fontSize: 13, color: Fg.muted, fontWeight: "600" },
  missionStatus: { color: Fg.mutedLight, fontWeight: "500" },
  sectionTitle: { ...FgType.regular, fontSize: 12,
    fontWeight: "900",
    color: Fg.muted,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 10,
    letterSpacing: 0.6, },
  historyRow: { paddingVertical: 12 },
  historyRowBorder: { borderBottomWidth: 1, borderBottomColor: (Fg.border) },
  historyTitle: { ...FgType.regular, fontWeight: "800", color: Fg.ink, fontSize: 15 },
  historyMeta: { ...FgType.regular, color: Fg.mutedLight, fontSize: 12, marginTop: 4, fontWeight: "600" },
});
