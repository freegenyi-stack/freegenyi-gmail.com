import { ReactNode } from "react";
import { Pressable, View, StyleSheet, ViewStyle, PressableProps, StyleProp } from "react-native";
import {  Fg , FgType } from "@/ui/theme";

export function FgCard({
  children,
  onPress,
  accent,
  style,
}: {
  children: React.ReactNode;
  onPress?: PressableProps["onPress"];
  accent?: "warm" | "default";
  style?: StyleProp<ViewStyle>;
}) {
  const inner = (
    <View
      style={[
        styles.card,
        accent === "warm" && styles.warm,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
        {inner}
      </Pressable>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Fg.white,
    borderRadius: Fg.radius.lg,
    padding: 20,
    borderWidth: 2,
    borderColor: Fg.border,
    borderBottomWidth: 4,
    borderBottomColor: "#D6D3D1",
  },
  warm: {
    backgroundColor: Fg.creamWarm,
    borderColor: Fg.borderWarm,
    borderBottomColor: Fg.orangeSoft,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.985 }] },
});
