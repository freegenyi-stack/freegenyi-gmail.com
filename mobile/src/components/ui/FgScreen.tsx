import { ReactNode } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fg, FgType } from "@/ui/theme";
import { useIsRtl } from "@/context/LocaleContext";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Masque le header texte (hero custom dans children) */
  bare?: boolean;
};

export function FgScreen({ title, subtitle, children, footer, bare }: Props) {
  const isRtl = useIsRtl();
  const align = isRtl ? "right" : "left";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.blobOrange} />
      <View style={styles.blobCream} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!bare && (
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.mascotCircle}>
                <Text style={styles.mascot}>🦊</Text>
              </View>
              <Text style={styles.brand}>FreeGeny</Text>
            </View>
            <Text style={[styles.title, { textAlign: align }]}>{title}</Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { textAlign: align }]}>{subtitle}</Text>
            ) : null}
          </View>
        )}
        <View style={styles.body}>{children}</View>
      </ScrollView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

export function FgLoading() {
  return (
    <View style={styles.loading}>
      <View style={styles.mascotCircleLg}>
        <Text style={styles.mascotLg}>🦊</Text>
      </View>
      <ActivityIndicator size="large" color={Fg.orange} style={{ marginTop: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Fg.cream },
  blobOrange: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(249,115,22,0.12)",
  },
  blobCream: {
    position: "absolute",
    top: 120,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: "rgba(255,237,213,0.5)",
  },
  scroll: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 28 },
  header: { marginBottom: 20 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  mascotCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Fg.creamWarm,
    borderWidth: 2,
    borderColor: Fg.borderWarm,
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: { ...FgType.regular, fontSize: 24 },
  brand: { ...FgType.regular, fontSize: 13, fontWeight: "900", color: Fg.orange, letterSpacing: 1.5, textTransform: "uppercase" },
  title: { ...FgType.regular, fontSize: 30, fontWeight: "900", color: Fg.ink, lineHeight: 36, letterSpacing: -0.5 },
  subtitle: { ...FgType.regular, marginTop: 8, fontSize: 16, lineHeight: 24, color: Fg.muted, fontWeight: "500" },
  body: { flex: 1, gap: 14 },
  footer: {
    borderTopWidth: 2,
    borderTopColor: Fg.border,
    paddingHorizontal: 22,
    paddingVertical: 14,
    paddingBottom: 22,
    backgroundColor: Fg.cream,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Fg.cream,
  },
  mascotCircleLg: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Fg.creamWarm,
    borderWidth: 3,
    borderColor: Fg.orangeSoft,
    borderBottomWidth: 5,
    borderBottomColor: Fg.orangeMid,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotLg: { ...FgType.regular, fontSize: 36 },
});
