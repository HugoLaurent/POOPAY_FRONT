import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppData } from "@/contexts/AppContext";

export default function SessionScreen() {
  const { sessions } = useAppData() as any;

  const renderItem = ({ item }: { item: any }) => {
    const label = item.start_time
      ? new Date(item.start_time).toLocaleString()
      : "Inconnue";
    return (
      <ThemedView style={styles.item}>
        <ThemedText style={styles.title}>{label}</ThemedText>
        <ThemedText style={styles.sub}>{`Durée: ${
          item.duration_minutes ?? "-"
        } min • Gagné: ${item.amount_earned ?? "-"}`}</ThemedText>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
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
  title: { fontSize: 14, fontWeight: "600" },
  sub: { fontSize: 12, marginTop: 4, color: "#666" },
});
