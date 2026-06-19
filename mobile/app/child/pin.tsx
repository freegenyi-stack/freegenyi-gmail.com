import { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { FgButton } from "@/components/FgButton";
import { FgInput } from "@/components/ui";
import { apiPost, ApiError } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import {  Fg , FgType } from "@/ui/theme";

export default function ChildPinScreen() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const token = await storage.getChildToken();
    if (!token) {
      router.replace("/child/pair");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiPost("/api/mobile/child/pin", { pin }, token);
      await storage.setChildPinOk("1");
      router.replace("/child/lobby");
    } catch (e) {
      const msg = e instanceof ApiError ? e.code : "generic";
      setError(t(`errors.${msg}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      title={t("child.pinTitle")}
      subtitle={t("child.pinSubtitle")}
      footer={<FgButton label={t("child.pinCta")} onPress={() => void submit()} loading={loading} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🔐</Text>
      </View>
      <FgInput
        placeholder="••••"
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
        value={pin}
        onChangeText={setPin}
        style={styles.pinInput}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginBottom: 8 },
  heroEmoji: { ...FgType.regular, fontSize: 48 },
  pinInput: { ...FgType.regular, fontSize: 32,
    letterSpacing: 16,
    textAlign: "center",
    fontWeight: "900",
    height: 72, },
  error: { color: Fg.rose, marginTop: 4, textAlign: "center", fontWeight: "700" },
});
