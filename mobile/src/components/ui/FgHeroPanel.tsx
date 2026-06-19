import { View, Text, StyleSheet, Pressable } from "react-native";
import {  Fg , FgType } from "@/ui/theme";
import { FgProgressBar } from "./FgProgressBar";
import { useIsRtl } from "@/context/LocaleContext";

export function FgHeroPanel({
  badge,
  greeting,
  stats,
}: {
  badge: string;
  greeting: string;
  stats: { value: string | number; label: string }[];
}) {
  return (
    <View style={styles.panel}>
      <View style={styles.glow} />
      <Text style={styles.badge}>{badge}</Text>
      <Text style={styles.greeting}>{greeting}</Text>
      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statBubble}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function FgChildRow({
  name,
  meta,
  progress,
  progressLabel,
  onPress,
}: {
  name: string;
  meta?: string | null;
  progress?: number;
  progressLabel?: string;
  onPress: () => void;
}) {
  const isRtl = useIsRtl();
  const initial = name.trim()[0]?.toUpperCase() ?? "?";

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { textAlign: isRtl ? "right" : "left" }]}>{name}</Text>
        {meta ? (
          <Text style={[styles.meta, { textAlign: isRtl ? "right" : "left" }]}>{meta}</Text>
        ) : null}
        {progressLabel ? (
          <Text style={[styles.progressLabel, { textAlign: isRtl ? "right" : "left" }]}>
            {progressLabel}
          </Text>
        ) : null}
        {progress != null ? (
          <View style={{ marginTop: 10 }}>
            <FgProgressBar progress={progress} height={10} trackColor={Fg.creamDeep} />
          </View>
        ) : null}
      </View>
      <Text style={styles.chevron}>{isRtl ? "‹" : "›"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Fg.ink,
    borderRadius: Fg.radius.xl,
    padding: 22,
    overflow: "hidden",
    borderBottomWidth: 5,
    borderBottomColor: "#000",
  },
  glow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(249,115,22,0.25)",
  },
  badge: { ...FgType.regular, color: Fg.orange,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase", },
  greeting: { ...FgType.regular, color: Fg.white,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 8,
    letterSpacing: -0.3, },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 18 },
  statBubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: Fg.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  statValue: { ...FgType.regular, color: Fg.orange, fontSize: 22, fontWeight: "900" },
  statLabel: { ...FgType.regular, color: Fg.mutedLight,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 4,
    textAlign: "center",
    textTransform: "uppercase", },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Fg.white,
    borderRadius: Fg.radius.lg,
    padding: 16,
    borderWidth: 2,
    borderColor: Fg.border,
    borderBottomWidth: 4,
    borderBottomColor: "#D6D3D1",
    marginBottom: 10,
  },
  rowPressed: { opacity: 0.94, transform: [{ scale: 0.99 }] },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: Fg.creamWarm,
    borderWidth: 2,
    borderColor: Fg.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { ...FgType.regular, fontSize: 22, fontWeight: "900", color: Fg.orangeMid },
  name: { ...FgType.regular, fontSize: 17, fontWeight: "900", color: Fg.ink },
  meta: { ...FgType.regular, fontSize: 13, color: Fg.muted, marginTop: 2, fontWeight: "600" },
  progressLabel: { ...FgType.regular, fontSize: 12, color: Fg.orange, fontWeight: "800", marginTop: 6 },
  chevron: { ...FgType.regular, fontSize: 28, fontWeight: "300", color: Fg.mutedLight },
});
