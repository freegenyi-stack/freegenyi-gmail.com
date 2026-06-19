import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { storage } from "@/lib/storage";
import { setI18nLocale, type Locale } from "@/i18n";
import { applyNativeRtl } from "@/i18n/locale";
import {  Fg , FgType } from "@/ui/theme";

export default function BootstrapScreen() {
  useEffect(() => {
    void (async () => {
      const locale = (await storage.getLocale()) as Locale | null;
      if (!locale) {
        router.replace("/welcome/language");
        return;
      }
      setI18nLocale(locale);
      applyNativeRtl(locale);

      const role = await storage.getRole();
      if (role === "child") {
        const token = await storage.getChildToken();
        const pinOk = await storage.getChildPinOk();
        if (token && pinOk === "1") {
          router.replace("/child/lobby");
          return;
        }
        if (token) {
          router.replace("/child/pin");
          return;
        }
        router.replace("/child/pair");
        return;
      }

      const parentToken = await storage.getParentToken();
      if (parentToken) {
        try {
          const { apiGet } = await import("@/lib/api");
          const me = await apiGet<{ user: { onboarded: boolean } }>("/api/mobile/me", parentToken);
          router.replace(me.user.onboarded ? "/parent" : "/parent/onboarding/profile");
        } catch {
          router.replace("/auth/login");
        }
        return;
      }

      router.replace("/welcome/role");
    })();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.blobOrange} />
      <View style={styles.blobCream} />
      <View style={styles.mascotCircle}>
        <Text style={styles.mascot}>🦊</Text>
      </View>
      <Text style={styles.brand}>FreeGeny</Text>
      <ActivityIndicator size="large" color={Fg.orange} style={{ marginTop: 32 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Fg.cream,
  },
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
    bottom: 80,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: "rgba(255,237,213,0.5)",
  },
  mascotCircle: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: Fg.creamWarm,
    borderWidth: 3,
    borderColor: Fg.borderWarm,
    borderBottomWidth: 6,
    borderBottomColor: Fg.orangeMid,
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: { ...FgType.regular, fontSize: 44 },
  brand: { ...FgType.regular, marginTop: 20,
    fontSize: 14,
    fontWeight: "900",
    color: Fg.orange,
    letterSpacing: 2,
    textTransform: "uppercase", },
});
