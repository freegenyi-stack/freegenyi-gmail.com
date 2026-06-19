import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import {  Fg , FgType } from "@/ui/theme";

type Variant = "primary" | "secondary" | "ghost" | "dark";

export function FgButton({
  label,
  onPress,
  disabled,
  variant = "primary",
  loading,
  size = "md",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  loading?: boolean;
  size?: "md" | "lg";
}) {
  const isPrimary = variant === "primary";
  const isDark = variant === "dark";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        size === "lg" && styles.lg,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        variant === "dark" && styles.dark,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary || isDark ? "#fff" : Fg.orange} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "secondary" && styles.labelSecondary,
            variant === "ghost" && styles.labelGhost,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: Fg.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    borderBottomWidth: 5,
  } as ViewStyle,
  lg: { minHeight: 58, borderRadius: Fg.radius.md },
  primary: {
    backgroundColor: Fg.orange,
    borderBottomColor: Fg.orangeDark,
  },
  secondary: {
    backgroundColor: Fg.white,
    borderWidth: 2,
    borderColor: Fg.orangeSoft,
    borderBottomColor: Fg.orangeMid,
  },
  ghost: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    minHeight: 44,
  },
  dark: {
    backgroundColor: Fg.ink,
    borderBottomColor: "#000",
  },
  label: { ...FgType.regular, color: Fg.white,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.3,
    textTransform: "uppercase", },
  labelSecondary: { color: Fg.orangeMid },
  labelGhost: { color: Fg.orange, textTransform: "none", fontWeight: "800" },
  disabled: { opacity: 0.45 },
  pressed: { transform: [{ translateY: 3 }], borderBottomWidth: 2 },
});
