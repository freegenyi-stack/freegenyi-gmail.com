import { FgType } from "@/ui/theme";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView, Image } from "react-native";
import { router, type Href } from "expo-router";
import { apiGet, API_BASE_URL } from "@/lib/api";
import { storage } from "@/lib/storage";
import { bookCoverUri } from "@/lib/screen-time";
import { t } from "@/i18n";

type Book = {
  id: number;
  title: string;
  author: string | null;
  format: string;
  percent: number;
  coverPath: string;
};

export default function ChildLibraryScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const tkn = await storage.getChildToken();
      setToken(tkn);
      if (!tkn) {
        router.replace("/child/pair");
        return;
      }
      try {
        const res = await apiGet<{ books: Book[] }>("/api/mobile/child/library", tkn);
        setBooks(res.books);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← {t("back")}</Text>
        </Pressable>
        <Text style={styles.title}>{t("child.portalLibrary")}</Text>

        {books.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t("child.libraryEmpty")}</Text>
          </View>
        ) : (
          books.map((book) => (
            <Pressable
              key={book.id}
              style={styles.row}
              onPress={() => router.push(`/child/library/${book.id}` as Href)}
            >
              <Image
                source={{
                  uri: bookCoverUri(book.coverPath),
                  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                }}
                style={styles.cover}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                {book.author ? <Text style={styles.bookAuthor}>{book.author}</Text> : null}
                <Text style={styles.bookMeta}>
                  {book.format.toUpperCase()} · {book.percent}%
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1E1B4B" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#1E1B4B" },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { marginBottom: 16 },
  backText: { color: "#C4B5FD", fontWeight: "800" },
  title: { ...FgType.regular, color: "#fff", fontSize: 28, fontWeight: "900", marginBottom: 20 },
  empty: { padding: 24, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", alignItems: "center" },
  emptyText: { color: "#CBD5E1" },
  row: { flexDirection: "row", gap: 14, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, marginBottom: 12 },
  cover: { width: 56, height: 76, borderRadius: 8, backgroundColor: "#312E81" },
  bookTitle: { ...FgType.regular, color: "#fff", fontWeight: "800", fontSize: 15 },
  bookAuthor: { ...FgType.regular, color: "#C4B5FD", fontSize: 12, marginTop: 4 },
  bookMeta: { ...FgType.regular, color: "#94A3B8", fontSize: 11, marginTop: 6, fontWeight: "700" },
});
