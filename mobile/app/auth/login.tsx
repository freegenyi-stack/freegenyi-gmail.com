import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { FgButton, FgInput } from "@/components/ui";
import { apiPost, ApiError, type LoginResponse } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import {  Fg , FgType } from "@/ui/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost<LoginResponse>("/api/mobile/auth/login", { email, password });
      await storage.setParentToken(res.accessToken);
      await storage.setRole("parent");
      if (res.user.onboarded) {
        router.replace("/parent");
      } else {
        router.replace("/parent/onboarding/profile");
      }
    } catch (e) {
      const code = e instanceof ApiError ? e.code : undefined;
      setError(t(`errors.${code || "generic"}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      title={t("auth.loginTitle")}
      footer={
        <View style={styles.footerStack}>
          <FgButton label={t("auth.loginCta")} onPress={() => void submit()} loading={loading} size="lg" />
          <Pressable onPress={() => router.push("/auth/register")} style={styles.linkWrap}>
            <Text style={styles.link}>{t("auth.registerCta")}</Text>
          </Pressable>
        </View>
      }
    >
      <FgInput placeholder={t("auth.email")} autoCapitalize="none" value={email} onChangeText={setEmail} />
      <FgInput
        placeholder={t("auth.password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { ...FgType.regular, color: "#DC2626", marginTop: 4, fontSize: 14, fontWeight: "700" },
  footerStack: { gap: 12 },
  linkWrap: { alignItems: "center", paddingVertical: 8 },
  link: { ...FgType.regular, color: Fg.orange, fontWeight: "800", fontSize: 15 },
});
