import React from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, StyleSheet, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "@/contexts/AppContext";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Page "Classement" : classement par région / par catégorie
export default function RankingScreen() {
  const { groups, rankings } = useAppData();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const styles = getStyles(colors);

  // mode: 'region' | 'category'
  const [mode, setMode] = React.useState<"region" | "category">("region");
  const [selected, setSelected] = React.useState<string | null>(null);

  // Extraire les régions et catégories depuis les groupes.
  // Hypothèse : les groupes peuvent contenir les champs "region" et "category" (sinon on utilise "Global").
  const regions: string[] = Array.from(
    new Set(
      groups
        .map((g: any) => (g.region ? String(g.region) : "Global"))
        .filter(Boolean)
    )
  );
  const categories: string[] = Array.from(
    new Set(
      groups
        .map((g: any) => (g.category ? String(g.category) : "Tous"))
        .filter(Boolean)
    )
  );

  // valeurs à afficher en fonction du mode
  const values = mode === "region" ? regions : categories;

  // si aucun filtre sélectionné, choisir la première valeur
  React.useEffect(() => {
    // si aucun filtre sélectionné, choisir la première valeur disponible
    if (!selected && values.length > 0) setSelected(values[0]);
  }, [mode, values, selected]);

  // Récupère les groupes filtrés selon le mode / sélection
  const filteredGroups = groups.filter((g: any) => {
    if (!selected) return true;
    if (mode === "region")
      return (g.region ? String(g.region) : "Global") === selected;
    return (g.category ? String(g.category) : "Tous") === selected;
  });

  // Agrège les membres provenant des groupes filtrés et calcule un score par utilisateur
  const getTopUsers = (limit = 10) => {
    const map: Record<string, any> = {};
    filteredGroups.forEach((g: any) => {
      const members = g.members || [];
      members.forEach((m: any) => {
        const key =
          m.id !== undefined
            ? String(m.id)
            : m.name || m.username || JSON.stringify(m);
        if (!map[key]) {
          map[key] = {
            id: key,
            name: m.name || m.username || "Inconnu",
            totalEarned: 0,
            occurrences: 0,
          };
        }
        const val =
          typeof m.totalEarned === "number"
            ? m.totalEarned
            : m.totalEarned
            ? parseFloat(m.totalEarned) || 0
            : 0;
        map[key].totalEarned += val;
        map[key].occurrences += 1;
      });
    });
    const arr = Object.values(map);
    arr.sort((a: any, b: any) => {
      if ((b.totalEarned || 0) !== (a.totalEarned || 0))
        return (b.totalEarned || 0) - (a.totalEarned || 0);
      return (b.occurrences || 0) - (a.occurrences || 0);
    });
    return arr.slice(0, limit);
  };

  // Essaie d'utiliser le payload 'rankings' renvoyé par le backend si disponible.
  // Le back enverra probablement : { "rankings": [ {id, username, totalEarned, rank}, ... ] }
  const getServerTopUsers = (limit = 10) => {
    if (!rankings) return null;

    // cas simple : rankings est directement un array
    if (Array.isArray(rankings)) return rankings.slice(0, limit);

    // cas recommandé : { rankings: [...] }
    if (Array.isArray((rankings as any).rankings))
      return (rankings as any).rankings.slice(0, limit);

    // si le payload contient une map regions/categories et qu'une sélection est faite
    if (selected) {
      const byKey = mode === "category" ? "categories" : "regions";
      const container =
        (rankings as any)[byKey] ||
        (rankings as any).rankings_by ||
        (rankings as any).by_region ||
        (rankings as any).by_category;
      if (
        container &&
        container[selected] &&
        Array.isArray(container[selected])
      )
        return container[selected].slice(0, limit);

      // fallback: clé directe
      const direct = (rankings as any)[selected];
      if (direct && Array.isArray(direct)) return direct.slice(0, limit);
    }

    return null;
  };

  // topUsers : priorité au backend, sinon fallback local
  const serverTop = getServerTopUsers(10);
  const topUsers = serverTop
    ? serverTop.map((u: any, idx: number) => ({
        id: u.id ?? idx,
        name: u.name || u.username || u.label || "Inconnu",
        totalEarned: u.totalEarned || u.amount || 0,
        occurrences: u.occurrences || 1,
      }))
    : getTopUsers(10);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerEmoji}>🏆</ThemedText>
          <ThemedText style={styles.title}>Classements</ThemedText>
          <ThemedText style={styles.subtitle}>
            Compare les meilleurs groupes par région ou par catégorie de travail
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.filterRow}>
          <Pressable
            onPress={() => setMode("region")}
            style={({ pressed }) => [
              styles.modeButton,
              mode === "region"
                ? styles.modeButtonActive
                : styles.modeButtonInactive,
              pressed && { opacity: 0.75 },
            ]}
          >
            <ThemedText
              style={
                mode === "region"
                  ? styles.modeTextActive
                  : styles.modeTextInactive
              }
            >
              Par région
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setMode("category")}
            style={({ pressed }) => [
              styles.modeButton,
              mode === "category"
                ? styles.modeButtonActive
                : styles.modeButtonInactive,
              pressed && { opacity: 0.75 },
            ]}
          >
            <ThemedText
              style={
                mode === "category"
                  ? styles.modeTextActive
                  : styles.modeTextInactive
              }
            >
              Par catégorie
            </ThemedText>
          </Pressable>
        </ThemedView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsRow}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {values.length === 0 ? (
            <View style={styles.emptyChip}>
              <ThemedText style={styles.chipText}>Aucun</ThemedText>
            </View>
          ) : (
            values.map((val) => {
              const active = selected === val;
              return (
                <Pressable
                  key={val}
                  onPress={() => setSelected(val)}
                  style={({ pressed }) => [
                    styles.chip,
                    active ? styles.chipActive : styles.chipInactive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <ThemedText
                    style={active ? styles.chipTextActive : styles.chipText}
                  >
                    {val}
                  </ThemedText>
                </Pressable>
              );
            })
          )}
        </ScrollView>

        <ThemedView style={styles.sectionList}>
          {topUsers.length === 0 ? (
            <ThemedText style={styles.noData}>
              Aucun utilisateur pour ce filtre.
            </ThemedText>
          ) : (
            topUsers.map((u: any, idx: number) => (
              <ThemedView key={u.id + idx} style={styles.userRow}>
                <ThemedText style={styles.userRank}>{idx + 1}.</ThemedText>
                <ThemedText style={styles.userName}>{u.name}</ThemedText>
                <ThemedText style={styles.userScore}>
                  {u.totalEarned > 0
                    ? `${u.totalEarned}€`
                    : `Présent·e ${u.occurrences}×`}
                </ThemedText>
              </ThemedView>
            ))
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#151718" },
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
      color: colors.subtitle,
    },

    filterRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      paddingHorizontal: 16,
      marginTop: 12,
    },
    modeButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
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
      color: colors.subtitle,
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
    userScore: { marginLeft: 12, color: colors.subtitle, fontWeight: "600" },
  });
