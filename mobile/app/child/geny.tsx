import { FgType } from "@/ui/theme";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { router } from "expo-router";
import { FgButton } from "@/components/FgButton";
import { apiGet, apiPost } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import type { GenyWorksheet } from "@/types/activity";

type CurriculumSession = {
  sessionKey: string;
  titleFr: string;
  titleAr: string;
  itemCount: number;
  xpReward: number;
  source: string;
};

export default function ChildGenyScreen() {
  const [worksheets, setWorksheets] = useState<GenyWorksheet[]>([]);
  const [sessions, setSessions] = useState<CurriculumSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<number | null>(null);

  useEffect(() => {
    void (async () => {
      const token = await storage.getChildToken();
      if (!token) {
        router.replace("/child/pair");
        return;
      }
      try {
        const [genyRes, curRes] = await Promise.all([
          apiGet<{ worksheets: GenyWorksheet[] }>("/api/mobile/child/geny", token),
          apiGet<{ sessions: CurriculumSession[] }>("/api/mobile/child/curriculum/sessions", token),
        ]);
        setWorksheets(genyRes.worksheets.filter((w) => w.status === "pending"));
        setSessions(curRes.sessions.filter((s) => s.source === "parent_geny"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markDone = async (worksheetId: number) => {
    const token = await storage.getChildToken();
    if (!token) return;
    setCompleting(worksheetId);
    try {
      await apiPost(`/api/mobile/child/geny/${worksheetId}/done`, {}, token);
      setWorksheets((prev) => prev.filter((w) => w.id !== worksheetId));
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  const empty = worksheets.length === 0 && sessions.length === 0;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← {t("back")}</Text>
        </Pressable>
        <Text style={styles.title}>{t("child.portalGeny")}</Text>
        <Text style={styles.subtitle}>{t("child.genyHint")}</Text>

        {sessions.map((s) => (
          <View key={s.sessionKey} style={[styles.card, styles.cardCurriculum]}>
            <Text style={styles.setSubject}>Programme · {s.itemCount} questions</Text>
            <Text style={styles.setTitle}>{s.titleFr}</Text>
            <FgButton
              label={t("child.play")}
              onPress={() => router.push(`/child/curriculum/${s.sessionKey}`)}
            />
          </View>
        ))}

        {empty ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t("child.genyEmpty")}</Text>
          </View>
        ) : (
          worksheets.map((ws) => (
            <View key={ws.id} style={styles.card}>
              {ws.sets.map((set) => (
                <View key={set.id} style={styles.setBlock}>
                  <Text style={styles.setSubject}>{set.subjectFr}</Text>
                  <Text style={styles.setTitle}>{set.titleFr}</Text>
                  <Text style={styles.setInstructions}>{set.instructionsFr}</Text>
                  {set.questions.map((q, i) => (
                    <Text key={i} style={styles.question}>
                      {i + 1}. {q.fr}
                    </Text>
                  ))}
                </View>
              ))}
              <FgButton
                label={completing === ws.id ? "…" : t("child.genyDone")}
                onPress={() => void markDone(ws.id)}
                loading={completing === ws.id}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#042F2E" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#042F2E" },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { marginBottom: 16 },
  backText: { ...FgType.regular, color: "#5EEAD4", fontWeight: "800", fontSize: 14 },
  title: { ...FgType.regular, color: "#fff", fontSize: 28, fontWeight: "900" },
  subtitle: { ...FgType.regular, color: "#99F6E4", fontSize: 14, marginBottom: 20, lineHeight: 20 },
  empty: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    padding: 24,
    alignItems: "center",
  },
  emptyText: { ...FgType.regular, color: "#CBD5E1", fontSize: 15 },
  card: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(45,212,191,0.3)",
    gap: 12,
  },
  cardCurriculum: { borderColor: "rgba(249,115,22,0.5)" },
  setBlock: { marginBottom: 8 },
  setSubject: { ...FgType.regular, color: "#2DD4BF", fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  setTitle: { ...FgType.regular, color: "#fff", fontSize: 18, fontWeight: "900", marginTop: 4 },
  setInstructions: { ...FgType.regular, color: "#CBD5E1", fontSize: 13, marginTop: 6, lineHeight: 18 },
  question: { ...FgType.regular, color: "#fff",
    fontSize: 14,
    marginTop: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 12,
    borderRadius: 12, },
});
