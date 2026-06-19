import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import { Screen } from "@/components/Screen";
import { FgButton, FgCard } from "@/components/ui";
import {  Fg , FgType } from "@/ui/theme";

export default function RoleScreen() {
  const pickChild = async () => {
    await storage.setRole("child");
    router.push("/child/pair");
  };

  return (
    <Screen title={t("welcome.roleTitle")} subtitle={t("welcome.roleSubtitle")}>
      <FgCard accent="warm">
        <Text style={styles.cardTitle}>{t("welcome.parent")}</Text>
        <Text style={styles.cardDesc}>{t("welcome.parentDesc")}</Text>
        <View style={styles.parentActions}>
          <View style={{ flex: 1 }}>
            <FgButton
              label={t("welcome.register")}
              onPress={() => void storage.setRole("parent").then(() => router.push("/auth/register"))}
              size="lg"
            />
          </View>
          <View style={{ flex: 1 }}>
            <FgButton
              label={t("welcome.login")}
              variant="secondary"
              onPress={() => void storage.setRole("parent").then(() => router.push("/auth/login"))}
              size="lg"
            />
          </View>
        </View>
      </FgCard>

      <FgCard onPress={() => void pickChild()} style={{ marginTop: 14 }}>
        <View style={styles.childRow}>
          <View style={styles.childIcon}>
            <Text style={{ fontSize: 28 }}>🎮</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{t("welcome.child")}</Text>
            <Text style={styles.cardDesc}>{t("welcome.childDesc")}</Text>
          </View>
        </View>
      </FgCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardTitle: { ...FgType.regular, fontSize: 20, fontWeight: "900", color: Fg.ink },
  cardDesc: { ...FgType.regular, marginTop: 6, fontSize: 14, color: Fg.muted, lineHeight: 21, fontWeight: "600" },
  parentActions: { flexDirection: "row", gap: 10, marginTop: 18 },
  childRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  childIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Fg.creamWarm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Fg.borderWarm,
  },
});


