import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Screen, FgLoading } from "@/components/Screen";
import { FgButton, FgCard, FgInput } from "@/components/ui";
import { apiGet, apiPost, type ChildrenResponse, type PairingCodeResponse } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import {  Fg , FgType } from "@/ui/theme";

export default function ParentChildrenTab() {
  const [token, setToken] = useState<string | null>(null);
  const [children, setChildren] = useState<ChildrenResponse["children"]>([]);
  const [loading, setLoading] = useState(true);
  const [pairing, setPairing] = useState<{ childId: number; code: string } | null>(null);
  const [generating, setGenerating] = useState<number | null>(null);
  const [pinChildId, setPinChildId] = useState<number | null>(null);
  const [pin, setPin] = useState("");
  const [pinSaving, setPinSaving] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const tkn = await storage.getParentToken();
      setToken(tkn);
      if (!tkn) return;
      try {
        const res = await apiGet<ChildrenResponse>("/api/mobile/parent/children", tkn);
        setChildren(res.children);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const generateCode = async (childId: number) => {
    if (!token) return;
    setGenerating(childId);
    try {
      const res = await apiPost<PairingCodeResponse>(
        `/api/mobile/parent/children/${childId}/pairing-code`,
        {},
        token
      );
      setPairing({ childId, code: res.code });
    } finally {
      setGenerating(null);
    }
  };

  const savePin = async () => {
    if (!token || pinChildId === null) return;
    setPinSaving(true);
    setPinError(null);
    try {
      await apiPost(`/api/mobile/parent/children/${pinChildId}/pin`, { pin }, token);
      setPinChildId(null);
      setPin("");
    } catch {
      setPinError(t("errors.invalid_pin_format"));
    } finally {
      setPinSaving(false);
    }
  };

  if (loading) return <FgLoading />;

  return (
    <Screen title={t("parent.tabChildren")} subtitle={t("parent.childrenSubtitle")}>
      {children.length === 0 ? (
        <Text style={styles.empty}>{t("parent.noChildren")}</Text>
      ) : (
        children.map((child) => (
          <FgCard key={child.id} style={{ marginBottom: 14 }}>
            <Text style={styles.childName}>{child.fullName}</Text>
            <Text style={styles.childLevel}>{child.educationLevel}</Text>
            <FgButton
              label={generating === child.id ? "…" : t("parent.generateCode")}
              onPress={() => void generateCode(child.id)}
              loading={generating === child.id}
            />
            <Pressable onPress={() => setPinChildId(child.id)} style={styles.pinLink}>
              <Text style={styles.pinLinkText}>{t("parent.setPin")}</Text>
            </Pressable>
          </FgCard>
        ))
      )}

      {pairing ? (
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>{t("parent.pairingCode")}</Text>
          <Text style={styles.codeValue}>{pairing.code}</Text>
          <Text style={styles.codeHint}>{t("parent.pairingHint")}</Text>
          <Pressable onPress={() => setPairing(null)}>
            <Text style={styles.dismiss}>{t("parent.dismissCode")}</Text>
          </Pressable>
        </View>
      ) : null}

      {pinChildId !== null ? (
        <FgCard style={{ marginTop: 16 }}>
          <Text style={styles.pinTitle}>{t("parent.setPinTitle")}</Text>
          <FgInput
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            placeholder="••••"
            style={styles.pinInput}
          />
          {pinError ? <Text style={styles.error}>{pinError}</Text> : null}
          <FgButton label={t("parent.savePin")} onPress={() => void savePin()} loading={pinSaving} />
          <Pressable onPress={() => setPinChildId(null)}>
            <Text style={styles.dismiss}>{t("parent.dismissCode")}</Text>
          </Pressable>
        </FgCard>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { ...FgType.regular, color: Fg.muted, fontSize: 16, fontWeight: "600" },
  childName: { ...FgType.regular, fontSize: 20, fontWeight: "900", color: Fg.ink },
  childLevel: { ...FgType.regular, fontSize: 14, color: Fg.muted, marginBottom: 14, fontWeight: "600" },
  pinLink: { alignItems: "center", paddingVertical: 10 },
  pinLinkText: { ...FgType.regular, color: Fg.muted, fontWeight: "800", fontSize: 14 },
  codeBox: {
    marginTop: 16,
    backgroundColor: Fg.ink,
    borderRadius: Fg.radius.xl,
    padding: 28,
    alignItems: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#000",
  },
  codeLabel: { ...FgType.regular, color: Fg.mutedLight, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: "900" },
  codeValue: { ...FgType.regular, color: "#fff", fontSize: 40, fontWeight: "900", letterSpacing: 10, marginVertical: 16 },
  codeHint: { ...FgType.regular, color: "#CBD5E1", fontSize: 14, textAlign: "center", lineHeight: 22, fontWeight: "600" },
  dismiss: { ...FgType.regular, marginTop: 16, color: Fg.orange, fontWeight: "800", textAlign: "center", fontSize: 15 },
  pinTitle: { ...FgType.regular, fontWeight: "900", fontSize: 17, color: Fg.ink, marginBottom: 8 },
  pinInput: { ...FgType.regular, textAlign: "center", fontSize: 26, letterSpacing: 12, marginBottom: 8 },
  error: { ...FgType.regular, color: "#DC2626", fontSize: 13, fontWeight: "700", marginBottom: 8 },
});
