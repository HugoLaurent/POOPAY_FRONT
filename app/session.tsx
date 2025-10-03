import React, { useEffect } from "react";
import { FlatList, StyleSheet, View, Alert, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppData } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import GroupDetailsHeader from "@/components/GroupDetailsHeader";
import { useNavigation } from "expo-router";

export default function SessionScreen() {
  const { sessions } = useAppData() as any;
  const { deleteSession } = useAppData() as any;
  const { token } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    try {
      navigation.setOptions &&
        navigation.setOptions({
          header: () => (
            <GroupDetailsHeader
              title={"Mes sessions"}
              subtitle={undefined}
              onBack={() => navigation.goBack && navigation.goBack()}
            />
          ),
        });
    } catch {}
  }, [navigation]);

  const renderItem = ({ item }: { item: any }) => {
    const label = item.start_time
      ? new Date(item.start_time).toLocaleString()
      : "Inconnue";

    return (
      <ThemedView style={styles.item}>
        <View style={styles.itemRow}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.title}>{label}</ThemedText>
            <ThemedText style={styles.sub}>{`Durée: ${
              item.duration_seconds !== undefined
                ? `${String(
                    Math.floor((item.duration_seconds || 0) / 60)
                  ).padStart(2, "0")}:${String(
                    (item.duration_seconds || 0) % 60
                  ).padStart(2, "0")}`
                : "-"
            } • Gagné: ${item.amount_earned ?? "-"}`}</ThemedText>
          </View>

          <Pressable
            onPress={() => {
              Alert.alert(
                "Supprimer la session",
                "Voulez-vous vraiment supprimer cette session ?",
                [
                  { text: "Annuler", style: "cancel" },
                  {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await deleteSession?.(item.id, token as string);
                      } catch (e) {
                        console.error(e);
                        Alert.alert(
                          "Erreur",
                          "Impossible de supprimer la session."
                        );
                      }
                    },
                  },
                ]
              );
            }}
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.buttonPressed,
            ]}
            accessibilityLabel={`Supprimer session ${label}`}
          >
            <ThemedText style={styles.deleteText}>🗑️</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Inline header fallback: some layouts hide native headers, so render here to ensure visibility */}
      <GroupDetailsHeader
        title={"Mes sessions"}
        onBack={() => navigation.goBack && navigation.goBack()}
      />

      <FlatList
        data={sessions || []}
        keyExtractor={(s: any) => s.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(139,69,19,0.04)",
    borderWidth: 1,
    borderColor: "rgba(139,69,19,0.06)",
  },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontSize: 14, fontWeight: "600" },
  sub: { fontSize: 12, marginTop: 4, color: "#666" },
  deleteBtn: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: { fontSize: 16 },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
