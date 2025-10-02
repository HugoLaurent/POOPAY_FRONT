import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import GroupCard from "@/components/ui/GroupCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { getGroupsByUserId } from "@/apiService/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function GroupScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres de période
  const [period, setPeriod] = useState<"week" | "month" | "past">("week");

  // Hauteur utile pour éviter le recouvrement par la bottom tab bar
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const bottomGutter = Math.max(insets.bottom, tabBarHeight || 0) + 16; // marge basse

  // Couleurs du thème dynamiques
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  // Styles dépendants
  const styles = makeStyles(colors, bottomGutter, period);

  const handleAddGroup = () => {
    alert("Fonction à implémenter : ajouter un groupe");
  };

  const fetchGroups = useCallback(async () => {
    if (!user || !token) return;
    setLoading(true);
    try {
      const response = await getGroupsByUserId(token, user.id, period);
      setGroups(response.groups || []);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [user, token, period]);

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [fetchGroups])
  );

  if (loading) {
    // Affiche des placeholders de cartes pendant le chargement
    const placeholderCount = 4;
    const placeholders = Array.from({ length: placeholderCount }, (_, i) => ({
      id: `ph-${i}`,
    }));

    return (
      <ThemedView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Mes Groupes</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddGroup}>
              <Text style={styles.addButtonText}>＋</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.periodTabs}>
            <TouchableOpacity
              style={[
                styles.periodTab,
                period === "week" ? styles.periodTabActive : null,
              ]}
              onPress={() => setPeriod("week")}
            >
              <Text
                style={[
                  styles.periodTabText,
                  period === "week" ? styles.periodTabTextActive : null,
                ]}
              >
                Cette semaine
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodTab,
                period === "month" ? styles.periodTabActive : null,
              ]}
              onPress={() => setPeriod("month")}
            >
              <Text
                style={[
                  styles.periodTabText,
                  period === "month" ? styles.periodTabTextActive : null,
                ]}
              >
                Ce mois-ci
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodTab,
                period === "past" ? styles.periodTabActive : null,
              ]}
              onPress={() => setPeriod("past")}
            >
              <Text
                style={[
                  styles.periodTabText,
                  period === "past" ? styles.periodTabTextActive : null,
                ]}
              >
                Mois derniers
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            style={styles.list}
            data={placeholders}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={() => <GroupCard isLoading />}
          />
        </View>
      </ThemedView>
    );
  }

  if (!user?.id) {
    return (
      <ThemedView style={[styles.safeArea, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Utilisateur non connecté.</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Mes Groupes</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddGroup}>
            <Text style={styles.addButtonText}>＋</Text>
          </TouchableOpacity>
        </View>

        {/* Barre de filtres période */}
        <View style={styles.periodTabs}>
          <TouchableOpacity
            style={[
              styles.periodTab,
              period === "week" ? styles.periodTabActive : null,
            ]}
            onPress={() => setPeriod("week")}
          >
            <Text
              style={[
                styles.periodTabText,
                period === "week" ? styles.periodTabTextActive : null,
              ]}
            >
              Cette semaine
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.periodTab,
              period === "month" ? styles.periodTabActive : null,
            ]}
            onPress={() => setPeriod("month")}
          >
            <Text
              style={[
                styles.periodTabText,
                period === "month" ? styles.periodTabTextActive : null,
              ]}
            >
              Ce mois-ci
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.periodTab,
              period === "past" ? styles.periodTabActive : null,
            ]}
            onPress={() => setPeriod("past")}
          >
            <Text
              style={[
                styles.periodTabText,
                period === "past" ? styles.periodTabTextActive : null,
              ]}
            >
              Mois derniers
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.list}
          data={groups}
          keyExtractor={(item) =>
            item?.id ? item.id.toString() : Math.random().toString()
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <GroupCard
              item={item}
              userId={user.id}
              onPress={(itemData, adminName, isAdmin) =>
                router.push({
                  pathname: "/group/details",
                  params: {
                    group: JSON.stringify({
                      ...itemData,
                      admin_name: adminName,
                    }),
                    isAdmin: isAdmin ? "1" : undefined,
                  },
                })
              }
            />
          )}
        />
      </View>
    </ThemedView>
  );
}

/**
 * Génère les styles dépendants du thème et de la marge basse
 */
const makeStyles = (colors: any, bottomGutter: number, period: string) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: "transparent",
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
      marginTop: 8,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.title,
      textAlign: "left",
      marginTop: 2,
    },
    addButton: {
      backgroundColor: colors.bgButtonPrimary,
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
      elevation: 2,
    },
    addButtonText: {
      fontWeight: "bold",
      fontSize: 22,
      lineHeight: 24,
      color: colors.textButtonPrimary,
    },

    // period tabs
    periodTabs: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 12,
      gap: 8,
    },
    periodTab: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 16,
      marginHorizontal: 2,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(139,69,19,0.08)",
    },
    periodTabActive: {
      backgroundColor: colors.bgButtonPrimary,

      elevation: 3,
    },
    periodTabText: {
      fontWeight: "700",
      fontSize: 14,
      color: colors.textDivers,
    },
    periodTabTextActive: {
      color: "white",
      fontWeight: "bold",
    },

    // list
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: bottomGutter,
      paddingTop: 8,
    },

    // loading / empty
    loadingIndicator: {
      marginTop: 40,
    },
    loadingText: {
      color: colors.text,
      textAlign: "center",
      marginTop: 8,
    },
  });
// ...existing code from group.tsx...
