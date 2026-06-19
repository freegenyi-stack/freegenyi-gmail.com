import { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useFocusEffect, type Href } from "expo-router";
import { Screen, FgLoading } from "@/components/Screen";
import { FgHeroPanel, FgChildRow, FgHubTile } from "@/components/ui";
import { apiGet, type ParentHomeResponse } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import { useIsRtl } from "@/context/LocaleContext";
import {  Fg , FgType } from "@/ui/theme";
import type { FgHubAccent } from "@/ui/theme";

type ProgressChild = {
  childId: number;
  stats: { level: number; totalXp: number; progress: number };
};

const HUBS: { key: string; route: Href; emoji: string; accent: FgHubAccent }[] = [
  { key: "children", route: "/parent/children", emoji: "👨‍👩‍👧", accent: "orange" },
  { key: "progress", route: "/parent/progress", emoji: "📈", accent: "emerald" },
  { key: "messages", route: "/parent/messages", emoji: "💬", accent: "violet" },
  { key: "settings", route: "/parent/settings", emoji: "⚙️", accent: "blue" },
];

export default function ParentHomeTab() {
  const isRtl = useIsRtl();
  const [data, setData] = useState<ParentHomeResponse | null>(null);
  const [progressByChild, setProgressByChild] = useState<Map<number, ProgressChild>>(new Map());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = await storage.getParentToken();
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    try {
      const [home, progress] = await Promise.all([
        apiGet<ParentHomeResponse>("/api/mobile/parent/home", token),
        apiGet<{ children: ProgressChild[] }>("/api/mobile/parent/progress", token).catch(() => ({
          children: [] as ProgressChild[],
        })),
      ]);
      setData(home);
      setProgressByChild(new Map(progress.children.map((c) => [c.childId, c])));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const firstName = useMemo(
    () => data?.user.fullName?.split(" ")[0] ?? "",
    [data?.user.fullName]
  );

  if (loading) return <FgLoading />;

  const align = isRtl ? "right" : "left";

  return (
    <Screen title={t("parent.homeTitle")} subtitle={t("parent.homeSubtitle")} bare>
      <FgHeroPanel
        badge={t("parent.premiumBadge")}
        greeting={`${t("parent.greeting")}, ${firstName}`}
        stats={[
          { value: data?.totals.children ?? 0, label: t("parent.tabChildren") },
          { value: data?.totals.pendingMissions ?? 0, label: t("child.tabMissions") },
          { value: data?.totals.pendingGeny ?? 0, label: t("parent.genyLabel") },
        ]}
      />

      {(data?.totals.pendingMissions ?? 0) + (data?.totals.pendingGeny ?? 0) > 0 ? (
        <View style={styles.todayBanner}>
          <Text style={[styles.todayTitle, { textAlign: align }]}>{t("parent.todayTitle")}</Text>
          <Text style={[styles.todayBody, { textAlign: align }]}>
            {t("parent.todayPending", {
              missions: String(data?.totals.pendingMissions ?? 0),
              geny: String(data?.totals.pendingGeny ?? 0),
            })}
          </Text>
        </View>
      ) : null}

      <Text style={[styles.section, { textAlign: align }]}>{t("parent.hubs.children")}</Text>
      <View style={styles.hubGrid}>
        {HUBS.map((hub) => (
          <FgHubTile
            key={hub.key}
            emoji={hub.emoji}
            title={t(`parent.hubs.${hub.key}`)}
            description={t(`parent.hubs.${hub.key}Desc`)}
            accent={hub.accent}
            onPress={() => router.push(hub.route)}
          />
        ))}
      </View>

      <Text style={[styles.section, { textAlign: align, marginTop: 8 }]}>
        {t("parent.childrenOverview")}
      </Text>

      {(data?.children ?? []).length === 0 ? (
        <Text style={[styles.empty, { textAlign: align }]}>{t("parent.noChildren")}</Text>
      ) : (
        (data?.children ?? []).map((child) => {
          const prog = progressByChild.get(child.id);
          return (
            <FgChildRow
              key={child.id}
              name={child.fullName}
              meta={child.educationLevel}
              progress={prog?.stats.progress}
              progressLabel={
                prog
                  ? `${t("parent.levelXp", {
                      level: String(prog.stats.level),
                      xp: String(prog.stats.totalXp),
                    })} · ${prog.stats.progress}%`
                  : t("parent.pendingLine", {
                      missions: String(child.pendingMissions),
                      geny: String(child.pendingGeny),
                    })
              }
              onPress={() => router.push("/parent/children")}
            />
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  todayBanner: {
    backgroundColor: Fg.creamWarm,
    borderRadius: Fg.radius.lg,
    padding: 18,
    borderWidth: 2,
    borderColor: Fg.borderWarm,
    borderBottomWidth: 4,
    borderBottomColor: Fg.orangeSoft,
    marginTop: 16,
  },
  todayTitle: { ...FgType.regular, fontSize: 11,
    fontWeight: "900",
    color: "#9A3412",
    textTransform: "uppercase",
    letterSpacing: 0.8, },
  todayBody: { ...FgType.regular, fontSize: 15, fontWeight: "800", color: Fg.orangeMid, marginTop: 6 },
  section: { ...FgType.regular, fontSize: 12,
    fontWeight: "900",
    color: Fg.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 20,
    marginBottom: 4, },
  hubGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  empty: { ...FgType.regular, color: Fg.muted, fontSize: 16, fontWeight: "600", marginTop: 8 },
});
