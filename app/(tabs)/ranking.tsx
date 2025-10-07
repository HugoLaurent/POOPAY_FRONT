import React from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, StyleSheet } from "react-native";
import ChipsFilter from "@/components/ui/ChipsFilter";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as api from "../../apiService";
import { useAuth } from "@/contexts/AuthContext";

export default function ExploreScreen() {
  const { token } = useAuth();

  // mode + selected are now controlled inside ChipsFilter and reported via onChange
  const [remoteMode, setRemoteMode] = React.useState<"region" | "category">(
    "region"
  );
  const [remoteFilter, setRemoteFilter] = React.useState<string>("");

  // Style/theme
  const colorScheme = useColorScheme() ?? "light";
  const styles = getStyles(Colors[colorScheme]);

  const [topUsers, setTopUsers] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchRankings() {
      if (!token) return;
      try {
        // exemple d'appel : GET /rankings?mode=region&filter=75
        const result = await api.getRankings(token, {
          mode: remoteMode,
          filter: remoteFilter,
        });
        // Normaliser la réponse pour toujours stocker un tableau
        setTopUsers(Array.isArray(result?.rankings) ? result.rankings : []);
        console.log(result.rankings);
      } catch {
        // ignore pour l'instant ; log si tu veux debug
      }
    }
    fetchRankings();
    return () => {};
  }, [remoteMode, remoteFilter, token]);

  // --- Rendu UI ---
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerEmoji}>🏆</ThemedText>
          <ThemedText style={styles.title}>Classements</ThemedText>
          <ThemedText style={styles.subtitle}>
            Compare les meilleurs groupes par région ou par catégorie de travail
          </ThemedText>
        </ThemedView>

        <ChipsFilter
          initialMode={remoteMode}
          onChange={(m, s) => {
            setRemoteMode(m);
            setRemoteFilter(s);
          }}
          styles={styles}
        />

        <ThemedView style={styles.sectionList}>
          {(() => {
            const users = Array.isArray(topUsers) ? topUsers : [];
            return users.length === 0 ? (
              <ThemedText style={styles.noData}>
                Aucun utilisateur pour ce filtre.
              </ThemedText>
            ) : (
              users.map((u: any, idx: number) => (
                <ThemedView
                  key={(u.id ?? idx) + "-" + idx}
                  style={styles.userRow}
                >
                  <ThemedText style={styles.userRank}>{idx + 1}.</ThemedText>
                  <ThemedText style={styles.userName}>
                    {u.username ?? u.name ?? "—"}
                  </ThemedText>
                  <ThemedText style={styles.userScore}>
                    {u.totalEarned}€
                  </ThemedText>
                </ThemedView>
              ))
            );
          })()}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Styles (identiques à ton original pour intégration facile ---------- */
const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, backgroundColor: "transparent" },
    scrollContent: { paddingBottom: 30 },
    header: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 12,
      alignItems: "center",
    },
    headerEmoji: { fontSize: 28, marginBottom: 4 },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 3,
      color: "#8B4513",
    },
    subtitle: {
      fontSize: 13,
      opacity: 0.9,
      textAlign: "center",
      paddingHorizontal: 28,
      color: colors.textDivers,
    },

    filterRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      paddingHorizontal: 16,
      marginTop: 12,
    },
    modeButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
    },
    modeButtonActive: { backgroundColor: colors.bgButtonPrimary },
    modeButtonInactive: { backgroundColor: "rgba(139,69,19,0.06)" },
    modeTextActive: { color: "white", fontWeight: "700" },
    modeTextInactive: { color: colors.textDivers, fontWeight: "600" },

    chipsRow: { marginTop: 12, maxHeight: 48 },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 14,
      marginRight: 8,
      borderWidth: 1,
      borderColor: "rgba(139,69,19,0.08)",
    },
    chipActive: {
      backgroundColor: colors.groupCardBg,
      borderColor: "rgba(139,69,19,0.18)",
    },
    chipInactive: { backgroundColor: "transparent" },
    chipText: { color: colors.textDivers },
    chipTextActive: { color: colors.textDivers, fontWeight: "700" },
    emptyChip: { padding: 8 },

    sectionList: { paddingHorizontal: 16, paddingTop: 12 },
    noData: {
      textAlign: "center",
      color: colors.textDivers,
      paddingVertical: 20,
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: colors.groupCardBg,
      borderWidth: 1,
      borderColor: "rgba(139,69,19,0.06)",
      marginBottom: 8,
    },
    userRank: { width: 28, fontWeight: "700", color: colors.textDivers },
    userName: {
      flex: 1,
      marginLeft: 8,
      color: colors.textDivers,
      fontWeight: "600",
    },
    userScore: { marginLeft: 12, color: colors.textDivers, fontWeight: "600" },
  });
