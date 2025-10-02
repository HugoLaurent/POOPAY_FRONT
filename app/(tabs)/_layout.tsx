import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { CentralTimerTab } from "@/components/CentralTimerTab";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
          tabBarInactiveTintColor:
            Colors[colorScheme ?? "light"].tabIconDefault,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            borderTopColor: Colors[colorScheme ?? "light"].border,
            height: 72,
            paddingBottom: 16,
          },
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarLabelStyle: {
            fontWeight: "600",
            fontSize: 13,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Accueil",
            tabBarLabel: "Accueil",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
            tabBarItemStyle: { marginRight: 28 },
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Fonctionnalités",
            tabBarLabel: "Fonctionnalités",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="star.fill" color={color} />
            ),
            // Espace augmenté pour laisser la place au bouton central
            tabBarItemStyle: { marginRight: 36 },
          }}
        />
        {/* Placeholder screen to reserve center space for the floating timer button */}
        <Tabs.Screen
          name="placeholder"
          options={{
            tabBarLabel: "",
            // Largeur agrandie pour mieux couvrir la zone du bouton central
            tabBarButton: () => <View style={{ width: 84 }} />,
          }}
        />
        <Tabs.Screen
          name="group"
          options={{
            title: "Groupe",
            tabBarLabel: "Groupe",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.2.fill" color={color} />
            ),
            // Espace augmenté pour laisser la place au bouton central
            tabBarItemStyle: { marginLeft: 36 },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Réglages",
            tabBarLabel: "Réglages",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="gearshape.fill" color={color} />
            ),
            tabBarItemStyle: { marginLeft: 28 },
          }}
        />
      </Tabs>

      {/* Bouton central flottant surélevé */}
      <CentralTimerTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
