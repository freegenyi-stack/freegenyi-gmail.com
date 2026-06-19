import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiGet, type LobbyResponse } from "@/lib/api";
import { storage } from "@/lib/storage";
import { useChildScreenTime } from "@/lib/screen-time";
import { t } from "@/i18n";
import { FgProgressBar } from "@/components/ui";
import { FgLoading } from "@/components/Screen";
import {  Fg , FgType } from "@/ui/theme";

type Portal = {
  id: string;
  title: string;
  description: string;
  color: string;
  bottom: string;
  emoji: string;
  route: string;
  badge?: number;
};

function filterPortals(
  portals: Portal[],
  learningMode: LobbyResponse["learningMode"],
  limitReached: boolean
): Portal[] {
  if (limitReached) return [];
  if (learningMode === "guided") return portals.slice(0, 1);
  if (learningMode === "semi_guided") return portals.slice(0, 2);
  return portals;
}

export default function ChildLobbyScreen() {
  const [data, setData] = useState<LobbyResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const tkn = await storage.getChildToken();
    setToken(tkn);
    if (!tkn) {
      router.replace("/child/pair");
      return;
    }
    try {
      const lobby = await apiGet<LobbyResponse>("/api/mobile/child/lobby", tkn);
      setData(lobby);
    } finally {
      setLoading(false);
    }
  }, []);

  const { remaining, limitReached, dailyLimitMinutes } = useChildScreenTime(
    data?.child.id ?? null,
    data?.dailyScreenMinutes ?? 20,
    token
  );

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  if (loading || !data) {
    return (
      <View style={styles.loadingRoot}>
        <FgLoading />
      </View>
    );
  }

  const portals: Portal[] = [
    {
      id: "path",
      title: t("child.portalPath"),
      description: t("child.portalPathDesc"),
      color: "#7C3AED",
      bottom: "#6D28D9",
      emoji: "🗺️",
      route: "/child/path",
    },
    {
      id: "geny",
      title: t("child.portalGeny"),
      description: data.pendingGeny
        ? t("child.portalGenyDesc", { count: String(data.pendingGeny) })
        : t("child.portalGenyEmpty"),
      color: "#059669",
      bottom: "#047857",
      emoji: "✨",
      route: "/child/geny",
      badge: data.pendingGeny,
    },
    {
      id: "missions",
      title: t("child.portalMissions"),
      description: data.stats.pendingMissions
        ? t("child.portalMissionsDesc", { count: String(data.stats.pendingMissions) })
        : t("child.portalMissionsEmpty"),
      color: "#E11D48",
      bottom: "#BE123C",
      emoji: "🎯",
      route: "/child/missions",
      badge: data.stats.pendingMissions,
    },
    {
      id: "library",
      title: t("child.portalLibrary"),
      description: t("child.portalLibraryDesc"),
      color: "#7C3AED",
      bottom: "#6D28D9",
      emoji: "📚",
      route: "/child/library",
    },
    {
      id: "school",
      title: t("child.portalSchool"),
      description: t("child.portalComingSoon"),
      color: "#2563EB",
      bottom: "#1D4ED8",
      emoji: "🏫",
      route: "/child/portal/school",
    },
    {
      id: "world",
      title: t("child.portalWorld"),
      description: t("child.portalComingSoon"),
      color: "#EA580C",
      bottom: "#C2410C",
      emoji: "🌍",
      route: "/child/portal/world",
    },
    {
      id: "arena",
      title: t("child.portalArena"),
      description: t("child.portalComingSoon"),
      color: "#0D9488",
      bottom: "#0F766E",
      emoji: "⚡",
      route: "/child/portal/arena",
    },
  ];

  const visible = filterPortals(portals, data.learningMode, limitReached);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.glowOrange} />
      <View style={styles.glowBlue} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.mascotWrap}>
            <Text style={styles.mascot}>🦊</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {t("child.lobbyTitle")}, {data.child.firstName} !
            </Text>
            <Text style={styles.subtitle}>
              {t("child.levelXp", {
                level: String(data.stats.level),
                xp: data.stats.xp.toLocaleString(),
              })}
            </Text>
            <View style={{ marginTop: 12 }}>
              <FgProgressBar progress={data.stats.progress} height={14} />
            </View>
            {data.latestBoost?.message ? (
              <View style={styles.boostBubble}>
                <Text style={styles.boostText}>💛 {data.latestBoost.message}</Text>
              </View>
            ) : null}
            {!limitReached ? (
              <Text style={styles.screenTime}>
                ⏱ {remaining} min · {dailyLimitMinutes} min
              </Text>
            ) : null}
          </View>
        </View>

        {visible.length === 0 ? (
          <View style={styles.limitBox}>
            <Text style={styles.limitEmoji}>🌙</Text>
            <Text style={styles.limitText}>{t("child.screenTimeLimit")}</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {visible.map((portal) => (
              <Pressable
                key={portal.id}
                style={({ pressed }) => [
                  styles.portal,
                  { backgroundColor: portal.color, borderBottomColor: portal.bottom },
                  pressed && styles.portalPressed,
                ]}
                onPress={() => {
                  if (portal.route.includes("portal/")) return;
                  router.push(portal.route as "/child/geny");
                }}
              >
                {portal.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{portal.badge > 99 ? "99+" : portal.badge}</Text>
                  </View>
                ) : null}
                <Text style={styles.portalEmoji}>{portal.emoji}</Text>
                <Text style={styles.portalTitle}>{portal.title}</Text>
                <Text style={styles.portalDesc}>{portal.description}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Fg.childBg },
  loadingRoot: { flex: 1, backgroundColor: Fg.childBg },
  glowOrange: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: "rgba(249,115,22,0.15)",
  },
  glowBlue: {
    position: "absolute",
    bottom: 80,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(59,130,246,0.12)",
  },
  scroll: { padding: 20, paddingBottom: 40, maxWidth: 960, alignSelf: "center", width: "100%" },
  headerCard: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: Fg.radius.xl,
    padding: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.08)",
    borderBottomWidth: 5,
    borderBottomColor: "rgba(0,0,0,0.35)",
    marginBottom: 24,
  },
  mascotWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "rgba(249,115,22,0.2)",
    borderWidth: 2,
    borderColor: "rgba(249,115,22,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: { ...FgType.regular, fontSize: 34 },
  title: { ...FgType.regular, color: "#fff", fontSize: 26, fontWeight: "900", letterSpacing: -0.3 },
  subtitle: { ...FgType.regular, color: Fg.orange,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5, },
  boostBubble: {
    marginTop: 12,
    backgroundColor: "rgba(253,224,71,0.15)",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(253,224,71,0.25)",
  },
  boostText: { ...FgType.regular, color: "#FDE68A", fontSize: 13, fontWeight: "700", lineHeight: 18 },
  screenTime: { ...FgType.regular, color: Fg.mutedLight, fontSize: 11, marginTop: 10, fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 0 },
  portal: {
    width: "48%",
    borderRadius: Fg.radius.lg,
    padding: 18,
    minHeight: 150,
    marginBottom: 14,
    borderBottomWidth: 5,
    justifyContent: "flex-end",
  },
  portalPressed: { transform: [{ translateY: 3 }], borderBottomWidth: 2 },
  portalEmoji: { ...FgType.regular, fontSize: 32, marginBottom: 10 },
  portalTitle: { ...FgType.regular, color: "#fff", fontSize: 17, fontWeight: "900" },
  portalDesc: { ...FgType.regular, color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 6, lineHeight: 17, fontWeight: "600" },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 999,
    minWidth: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderBottomWidth: 3,
    borderBottomColor: "#E7E5E4",
  },
  badgeText: { ...FgType.regular, color: Fg.ink, fontWeight: "900", fontSize: 11 },
  limitBox: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: Fg.radius.xl,
  },
  limitEmoji: { ...FgType.regular, fontSize: 48, marginBottom: 12 },
  limitText: { ...FgType.regular, color: "#CBD5E1", textAlign: "center", fontSize: 16, fontWeight: "700", lineHeight: 24 },
});
