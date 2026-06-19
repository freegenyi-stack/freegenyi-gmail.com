import { Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { FgButton } from "@/components/FgButton";
import { FgCard } from "@/components/ui";
import { t } from "@/i18n";
import {  Fg , FgType } from "@/ui/theme";

/** Point d'entrée inscription — wizard onboarding parent (étapes suivantes). */
export default function RegisterIntroScreen() {
  return (
    <Screen title={t("onboarding.title")} subtitle={t("auth.noAccount")}>
      <FgCard accent="warm">
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.text}>{t("onboarding.registerIntro")}</Text>
      </FgCard>
      <FgButton label={t("continue")} onPress={() => router.push("/parent/onboarding/profile")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emoji: { ...FgType.regular, fontSize: 40, textAlign: "center", marginBottom: 12 },
  text: { ...FgType.regular, fontSize: 16, lineHeight: 24, color: Fg.inkSoft, fontWeight: "600", textAlign: "center" },
});
