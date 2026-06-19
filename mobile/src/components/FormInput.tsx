import { FgType } from "@/ui/theme";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

export function FormInput({ label, ...props }: TextInputProps & { label?: string }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput {...props} style={[styles.input, props.style]} placeholderTextColor="#A8A29E" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { ...FgType.regular, fontSize: 13, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
  input: { ...FgType.regular, height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E7E5E4",
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#0F172A", },
});
