import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/i18n";
import {  Fg , FgType } from "@/ui/theme";

type TabIcon = keyof typeof Ionicons.glyphMap;

function TabIconLabel({
  label,
  icon,
  focused,
}: {
  label: string;
  icon: TabIcon;
  focused: boolean;
}) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Ionicons name={icon} size={22} color={focused ? Fg.white : Fg.mutedLight} />
      </View>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </View>
  );
}

export default function ParentTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Fg.orange,
        tabBarInactiveTintColor: Fg.mutedLight,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("parent.tabHome"),
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label={t("parent.tabHome")} icon="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="children"
        options={{
          title: t("parent.tabChildren"),
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label={t("parent.tabChildren")} icon="people" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t("parent.tabProgress"),
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label={t("parent.tabProgress")} icon="stats-chart" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t("parent.tabMessages"),
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label={t("parent.tabMessages")} icon="chatbubbles" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("parent.tabSettings"),
          tabBarIcon: ({ focused }) => (
            <TabIconLabel label={t("parent.tabSettings")} icon="settings" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Fg.white,
    borderTopWidth: 0,
    height: Platform.OS === "ios" ? 88 : 72,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    elevation: 12,
    shadowColor: Fg.ink,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabItem: { alignItems: "center", gap: 4, minWidth: 56 },
  iconWrap: {
    width: 44,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: Fg.orange,
    borderBottomWidth: 3,
    borderBottomColor: Fg.orangeDark,
  },
  label: { ...FgType.regular, fontSize: 9, fontWeight: "800", color: Fg.mutedLight, textTransform: "uppercase" },
  labelActive: { color: Fg.orangeMid },
});
