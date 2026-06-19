import { View, StyleSheet } from "react-native";
import {  Fg , FgType } from "@/ui/theme";

export function FgProgressBar({
  progress,
  height = 12,
  trackColor = "rgba(255,255,255,0.2)",
  fillColor = Fg.orange,
}: {
  progress: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
}) {
  const pct = Math.min(100, Math.max(0, progress));
  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: fillColor, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: 999, overflow: "hidden", width: "100%" },
  fill: { borderRadius: 999 },
});
