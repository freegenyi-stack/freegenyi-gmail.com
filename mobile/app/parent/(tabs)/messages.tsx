import { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { router, useFocusEffect, type Href } from "expo-router";
import { Screen, FgLoading } from "@/components/Screen";
import { FgCard } from "@/components/ui";
import { apiGet } from "@/lib/api";
import { storage } from "@/lib/storage";
import { t } from "@/i18n";
import {  Fg , FgType } from "@/ui/theme";

type Conversation = {
  id: number;
  otherUser: { id: number; fullName: string | null; username: string | null };
  lastMessage: { content: string; createdAt: string; isMine: boolean } | null;
  unreadCount: number;
};

function ConversationRow({ item }: { item: Conversation }) {
  const name = item.otherUser.fullName || item.otherUser.username || "…";
  const initial = name.charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={() => router.push(`/parent/chat/${item.id}` as Href)}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <FgCard style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.preview} numberOfLines={1}>
            {item.lastMessage?.content || "—"}
          </Text>
        </View>
        {item.unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        ) : (
          <Text style={styles.chevron}>›</Text>
        )}
      </FgCard>
    </Pressable>
  );
}

export default function ParentMessagesTab() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = await storage.getParentToken();
    if (!token) return;
    try {
      const res = await apiGet<{ conversations: Conversation[] }>("/api/mobile/chat/conversations", token);
      setConversations(res.conversations.filter((c) => c.otherUser));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  if (loading) return <FgLoading />;

  return (
    <Screen title={t("parent.tabMessages")} subtitle={t("parent.messagesSubtitle")}>
      {conversations.length === 0 ? (
        <FgCard accent="warm">
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={styles.empty}>{t("parent.messagesEmpty")}</Text>
        </FgCard>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => String(c.id)}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ConversationRow item={item} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  pressed: { opacity: 0.92 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Fg.creamWarm,
    borderWidth: 2,
    borderColor: Fg.borderWarm,
    borderBottomWidth: 4,
    borderBottomColor: Fg.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { ...FgType.regular, fontSize: 20, fontWeight: "900", color: Fg.orange },
  name: { ...FgType.regular, fontWeight: "900", color: Fg.ink, fontSize: 16 },
  preview: { ...FgType.regular, color: Fg.muted, fontSize: 13, marginTop: 4, fontWeight: "600" },
  badge: {
    backgroundColor: Fg.orange,
    borderRadius: Fg.radius.pill,
    minWidth: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderBottomWidth: 3,
    borderBottomColor: Fg.orangeDark,
  },
  badgeText: { ...FgType.regular, color: Fg.white, fontWeight: "900", fontSize: 12 },
  chevron: { ...FgType.regular, fontSize: 28, color: Fg.mutedLight, fontWeight: "300" },
  emptyEmoji: { ...FgType.regular, fontSize: 36, textAlign: "center", marginBottom: 8 },
  empty: { ...FgType.regular, color: Fg.muted, fontWeight: "600", textAlign: "center", fontSize: 15, lineHeight: 22 },
});
