import { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { FgButton } from "@/components/FgButton";
import { FgInput } from "@/components/ui";
import { apiPost, ApiError, type PairResponse } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import {  Fg , FgType } from "@/ui/theme";

export default function ChildPairScreen() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost<PairResponse>("/api/mobile/child/pair", { code, deviceLabel: "Mobile" });
      await storage.setChildToken(res.accessToken);
      await storage.setRole("child");
      await storage.setChildPinOk("0");
      router.replace("/child/pin");
    } catch (e) {
      const msg = e instanceof ApiError ? e.code : "generic";
      setError(t(`errors.${msg}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      title={t("child.pairTitle")}
      subtitle={t("child.pairSubtitle")}
      footer={<FgButton label={t("child.pairCta")} onPress={() => void submit()} loading={loading} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🔗</Text>
        <Text style={styles.heroHint}>Code à 6 caractères</Text>
      </View>
      <FgInput
        placeholder="ABC123"
        autoCapitalize="characters"
        value={code}
        onChangeText={setCode}
        style={styles.codeInput}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginBottom: 8 },
  heroEmoji: { ...FgType.regular, fontSize: 48 },
  heroHint: { ...FgType.regular, marginTop: 8, fontSize: 13, fontWeight: "700", color: Fg.muted },
  codeInput: { ...FgType.regular, fontSize: 24,
    letterSpacing: 6,
    textAlign: "center",
    fontWeight: "900",
    height: 64, },
  error: { color: Fg.rose, marginTop: 4, textAlign: "center", fontWeight: "700" },
});
