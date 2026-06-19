import { Pressable, View, Text, StyleSheet } from "react-native";
import {  Fg, hubAccents, type FgHubAccent , FgType } from "@/ui/theme";
import { useIsRtl } from "@/context/LocaleContext";

export function FgHubTile({
  emoji,
  title,
  description,
  accent = "orange",
  onPress,
}: {
  emoji: string;
  title: string;
  description: string;
  accent?: FgHubAccent;
  onPress: () => void;
}) {
  const isRtl = useIsRtl();
  const colors = hubAccents[accent];
  const align = isRtl ? "right" : "left";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <View style={[styles.tile, { backgroundColor: colors.bg, borderBottomColor: colors.bottom }]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.icon }]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
        <Text style={[styles.desc, { textAlign: align }]}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "48%", marginBottom: 12 },
  pressed: { transform: [{ scale: 0.97 }] },
  tile: {
    borderRadius: Fg.radius.lg,
    padding: 18,
    borderWidth: 2,
    borderColor: "transparent",
    borderBottomWidth: 4,
    minHeight: 130,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emoji: { ...FgType.regular, fontSize: 22 },
  title: { ...FgType.regular, fontSize: 16, fontWeight: "900", color: Fg.ink },
  desc: { ...FgType.regular, fontSize: 12, color: Fg.muted, marginTop: 4, lineHeight: 17, fontWeight: "600" },
});
