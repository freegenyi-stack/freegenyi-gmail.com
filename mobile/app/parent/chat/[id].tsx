import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FgButton } from "@/components/FgButton";
import { FgInput, FgLoading } from "@/components/ui";
import { apiGet, apiPost } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import {  Fg , FgType } from "@/ui/theme";

type ChatMessage = {
  id: number;
  content: string;
  createdAt: string;
  isMine: boolean;
  senderName?: string | null;
};

export default function ParentChatScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const conversationId = parseInt(idParam ?? "", 10);
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    void (async () => {
      const tkn = await storage.getParentToken();
      setToken(tkn);
      if (!tkn || Number.isNaN(conversationId)) return;
      try {
        const res = await apiGet<{ messages: ChatMessage[] }>(
          `/api/mobile/chat/conversations/${conversationId}/messages`,
          tkn
        );
        setMessages(res.messages);
      } finally {
        setLoading(false);
      }
    })();
  }, [conversationId]);

  const send = async () => {
    if (!token || !text.trim()) return;
    setSending(true);
    try {
      const res = await apiPost<{ message: ChatMessage }>(
        `/api/mobile/chat/conversations/${conversationId}/messages`,
        { content: text.trim() },
        token
      );
      setMessages((prev) => [...prev, res.message]);
      setText("");
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <FgLoading />;

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <View style={styles.backPill}>
            <Text style={styles.backText}>← {t("back")}</Text>
          </View>
        </Pressable>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => String(m.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.isMine ? styles.bubbleMine : styles.bubbleOther]}>
              <Text style={[styles.bubbleText, item.isMine && styles.bubbleTextMine]}>{item.content}</Text>
            </View>
          )}
        />

        <View style={styles.composer}>
          <FgInput
            value={text}
            onChangeText={setText}
            placeholder={t("parent.messagePlaceholder")}
            multiline
            style={styles.input}
          />
          <FgButton label="→" onPress={() => void send()} loading={sending} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Fg.cream },
  flex: { flex: 1 },
  back: { paddingHorizontal: 16, paddingVertical: 8 },
  backPill: {
    alignSelf: "flex-start",
    backgroundColor: Fg.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Fg.radius.pill,
    borderWidth: 2,
    borderColor: Fg.border,
    borderBottomWidth: 4,
    borderBottomColor: "#D6D3D1",
  },
  backText: { ...FgType.regular, color: Fg.muted, fontWeight: "900", fontSize: 14 },
  list: { padding: 16, gap: 10, flexGrow: 1 },
  bubble: {
    maxWidth: "80%",
    borderRadius: Fg.radius.md,
    padding: 14,
    marginBottom: 4,
  },
  bubbleMine: {
    alignSelf: "flex-end",
    backgroundColor: Fg.orange,
    borderBottomWidth: 4,
    borderBottomColor: Fg.orangeDark,
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: Fg.white,
    borderWidth: 2,
    borderColor: Fg.border,
    borderBottomWidth: 4,
    borderBottomColor: "#D6D3D1",
  },
  bubbleText: { ...FgType.regular, color: Fg.ink, fontSize: 15, fontWeight: "600", lineHeight: 22 },
  bubbleTextMine: { color: Fg.white },
  composer: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderTopWidth: 2,
    borderTopColor: Fg.border,
    backgroundColor: Fg.cream,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    marginBottom: 0,
  },
});
