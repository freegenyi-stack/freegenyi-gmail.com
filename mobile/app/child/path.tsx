import { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiGet, apiPost } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import {  Fg , FgType } from "@/ui/theme";

type PathNode = {
  nodeId: string;
  competencyId: string;
  titreFr: string;
  titreAr?: string;
  status: string;
  stars: number;
  order: number;
};

type PathResponse = {
  nodes: PathNode[];
  currentNodeId: string | null;
  subject: string;
  moduleId: string;
};

const STATUS_EMOJI: Record<string, string> = {
  locked: "🔒",
  available: "⭐",
  in_progress: "🔥",
  completed: "✅",
  mastered: "👑",
};

export default function ChildPathScreen() {
  const { subject: subjectParam } = useLocalSearchParams<{ subject?: string }>();
  const subject = subjectParam ?? "ar_islam_civique";
  const [path, setPath] = useState<PathResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await storage.getChildToken();
    if (!token) {
      router.replace("/child/pair");
      return;
    }
    try {
      const data = await apiGet<PathResponse>(
        `/api/mobile/child/curriculum/path?subject=${encodeURIComponent(subject)}`,
        token
      );
      setPath(data);
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const startNode = async (node: PathNode) => {
    if (node.status === "locked") return;
    const token = await storage.getChildToken();
    if (!token) return;
    setStarting(node.nodeId);
    try {
      const res = await apiPost<{ session: { sessionId: string } }>(
        "/api/mobile/child/curriculum/session/start",
        {
          subject,
          competencyId: node.competencyId,
          source: "official_path",
        },
        token
      );
      router.push(`/child/curriculum/${res.session.sessionId}`);
    } finally {
      setStarting(null);
    }
  };

  if (loading || !path) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Fg.orange} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← {t("back")}</Text>
        </Pressable>
        <Text style={styles.title}>{t("child.portalPath")}</Text>
        <Text style={styles.subtitle}>{t("child.portalPathDesc")}</Text>

        <View style={styles.pathColumn}>
          {path.nodes.map((node, i) => {
            const isLocked = node.status === "locked";
            const isCurrent = path.currentNodeId === node.nodeId;
            return (
              <View key={node.nodeId} style={styles.pathRow}>
                {i > 0 && <View style={styles.connector} />}
                <Pressable
                  style={({ pressed }) => [
                    styles.node,
                    isCurrent && styles.nodeCurrent,
                    isLocked && styles.nodeLocked,
                    pressed && !isLocked && styles.nodePressed,
                  ]}
                  onPress={() => void startNode(node)}
                  disabled={isLocked || starting === node.nodeId}
                >
                  <Text style={styles.nodeEmoji}>{STATUS_EMOJI[node.status] ?? "📘"}</Text>
                  <Text style={styles.nodeTitle} dir="rtl">
                    {node.titreAr ?? node.titreFr}
                  </Text>
                  {node.stars > 0 && (
                    <Text style={styles.stars}>{"⭐".repeat(Math.min(node.stars, 3))}</Text>
                  )}
                  {starting === node.nodeId && (
                    <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1e1b4b" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1e1b4b" },
  scroll: { padding: 20, paddingBottom: 48 },
  back: { marginBottom: 12 },
  backText: { ...FgType.regular, color: "#c4b5fd", fontWeight: "800", fontSize: 14 },
  title: { ...FgType.regular, color: "#fff", fontSize: 26, fontWeight: "900" },
  subtitle: { ...FgType.regular, color: "#a5b4fc", fontSize: 14, marginBottom: 24, lineHeight: 20 },
  pathColumn: { alignItems: "center" },
  pathRow: { alignItems: "center", width: "100%" },
  connector: {
    width: 4,
    height: 28,
    backgroundColor: "rgba(167,139,250,0.4)",
    borderRadius: 2,
  },
  node: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#4c1d95",
    borderRadius: 24,
    padding: 20,
    borderWidth: 3,
    borderColor: "#7c3aed",
    borderBottomWidth: 6,
    borderBottomColor: "#5b21b6",
    alignItems: "center",
  },
  nodeCurrent: { borderColor: Fg.orange, backgroundColor: "#6d28d9" },
  nodeLocked: { opacity: 0.45 },
  nodePressed: { transform: [{ translateY: 3 }], borderBottomWidth: 3 },
  nodeEmoji: { ...FgType.regular, fontSize: 28, marginBottom: 8 },
  nodeTitle: { ...FgType.regular, color: "#fff", fontSize: 16, fontWeight: "900", textAlign: "center" },
  stars: { ...FgType.regular, marginTop: 8, fontSize: 14 },
});
