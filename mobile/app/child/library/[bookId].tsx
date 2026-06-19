import { FgType } from "@/ui/theme";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { apiGet, apiPost, API_BASE_URL } from "@/lib/api";
import { storage } from "@/lib/storage";
import { FgButton } from "@/components/FgButton";
import { t } from "@/i18n";

export default function ChildBookReaderScreen() {
  const { bookId: bookIdParam } = useLocalSearchParams<{ bookId: string }>();
  const bookId = parseInt(bookIdParam ?? "", 10);
  const [token, setToken] = useState<string | null>(null);
  const [book, setBook] = useState<{ title: string; format: string; percent: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const tkn = await storage.getChildToken();
      setToken(tkn);
      if (!tkn || Number.isNaN(bookId)) {
        router.replace("/child/pair");
        return;
      }
      try {
        const res = await apiGet<{ book: { title: string; format: string; percent: number } }>(
          `/api/mobile/child/library/books/${bookId}`,
          tkn
        );
        setBook(res.book);
      } finally {
        setLoading(false);
      }
    })();
  }, [bookId]);

  const markProgress = async (percent: number) => {
    if (!token) return;
    await apiPost("/api/mobile/child/library/progress", { bookId, percent }, token);
  };

  if (loading || !book || !token) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#7C3AED" />
      </View>
    );
  }

  if (book.format === "pdf") {
    const uri = `${API_BASE_URL}/api/mobile/child/library/books/${bookId}/file`;
    return (
      <View style={styles.root}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← {t("back")}</Text>
        </Pressable>
        <WebView
          source={{ uri, headers: { Authorization: `Bearer ${token}` } }}
          style={styles.webview}
          onLoadEnd={() => void markProgress(Math.max(book.percent, 50))}
        />
        <View style={styles.footer}>
          <FgButton label={t("child.libraryDone")} onPress={() => void markProgress(100).then(() => router.back())} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← {t("back")}</Text>
      </Pressable>
      <View style={styles.epubBox}>
        <Text style={styles.epubTitle}>{book.title}</Text>
        <Text style={styles.epubHint}>{t("child.epubHint")}</Text>
        <FgButton
          label={t("child.libraryOpenExternal")}
          onPress={() => void Linking.openURL(`${API_BASE_URL}/api/mobile/child/library/books/${bookId}/file`)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1E1B4B" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1E1B4B" },
  back: { padding: 16, zIndex: 2 },
  backText: { color: "#C4B5FD", fontWeight: "800" },
  webview: { flex: 1, backgroundColor: "#fff" },
  footer: { padding: 16, backgroundColor: "#312E81" },
  epubBox: { flex: 1, justifyContent: "center", padding: 24, gap: 16 },
  epubTitle: { ...FgType.regular, color: "#fff", fontSize: 22, fontWeight: "900", textAlign: "center" },
  epubHint: { color: "#C4B5FD", textAlign: "center", lineHeight: 22 },
});
