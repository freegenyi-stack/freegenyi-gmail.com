import { Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import { applyAppLocale } from "@/i18n/locale";
import { Screen } from "@/components/Screen";
import { FgCard } from "@/components/ui";
import {  Fg , FgType } from "@/ui/theme";

export default function LanguageScreen() {
  const pick = async (locale: "fr" | "ar") => {
    await storage.setLocale(locale);
    await applyAppLocale(locale);
    router.push("/welcome/role");
  };

  return (
    <Screen title={t("welcome.languageTitle")} subtitle={t("welcome.languageSubtitle")}>
      <FgCard onPress={() => void pick("fr")}>
        <Text style={styles.cardTitle}>Français</Text>
        <Text style={styles.cardDesc}>Interface en français</Text>
      </FgCard>
      <FgCard onPress={() => void pick("ar")} accent="warm" style={{ marginTop: 12 }}>
        <Text style={[styles.cardTitle, styles.rtl]}>العربية</Text>
        <Text style={[styles.cardDesc, styles.rtl]}>واجهة بالعربية — RTL</Text>
      </FgCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardTitle: { ...FgType.regular, fontSize: 22, fontWeight: "900", color: Fg.ink },
  cardDesc: { ...FgType.regular, marginTop: 6, fontSize: 15, color: Fg.muted, fontWeight: "600", lineHeight: 22 },
  rtl: { textAlign: "right", writingDirection: "rtl" },
});
