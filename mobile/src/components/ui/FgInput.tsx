import { TextInput, StyleSheet, TextInputProps } from "react-native";
import {  Fg , FgType } from "@/ui/theme";
import { useIsRtl } from "@/context/LocaleContext";

export function FgInput(props: TextInputProps) {
  const isRtl = useIsRtl();
  return (
    <TextInput
      placeholderTextColor={Fg.muted}
      {...props}
      style={[styles.input, isRtl && styles.rtl, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: { ...FgType.regular, height: 56,
    borderRadius: Fg.radius.sm,
    borderWidth: 2,
    borderColor: Fg.border,
    borderBottomWidth: 4,
    borderBottomColor: "#D6D3D1",
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: Fg.white,
    color: Fg.ink,
    marginBottom: 12, },
  rtl: { textAlign: "right" },
});
