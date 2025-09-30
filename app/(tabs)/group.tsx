import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
  const bottomGutter = Math.max(insets.bottom, tabBarHeight) + 16; // marge basse

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

  console.log("groups:", groups[0]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ActivityIndicator
          size="small"
          color="#8B4513"
          style={{ marginTop: 40 }}
        />
        <Text style={{ color: "#8B4513", textAlign: "center", marginTop: 8 }}>
          Chargement...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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
            period === "week" && styles.periodTabActive,
          ]}
          onPress={() => setPeriod("week")}
        >
          <Text
            style={[
              styles.periodTabText,
              period === "week" && styles.periodTabTextActive,
            ]}
          >
            Cette semaine
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodTab,
            period === "month" && styles.periodTabActive,
          ]}
          onPress={() => setPeriod("month")}
        >
          <Text
            style={[
              styles.periodTabText,
              period === "month" && styles.periodTabTextActive,
            ]}
          >
            Ce mois-ci
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodTab,
            period === "past" && styles.periodTabActive,
          ]}
          onPress={() => setPeriod("past")}
        >
          <Text
            style={[
              styles.periodTabText,
              period === "past" && styles.periodTabTextActive,
            ]}
          >
            Mois derniers
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: bottomGutter }}
        renderItem={({ item }) => {
          const isAdmin = String(item.admin_user_id) === String(user?.id);
          const adminName =
            item.members?.find(
              (m: any) => String(m.id) === String(item.admin_user_id)
            )?.name || "-";

          return (
            <TouchableOpacity
              style={styles.groupCard}
              onPress={() =>
                router.push({
                  pathname: "/group/details",
                  params: {
                    group: JSON.stringify({ ...item, admin_name: adminName }),
                    isAdmin: isAdmin ? "1" : undefined,
                  },
                })
              }
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.groupName}>{item.name}</Text>
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.adminButton}
                    onPress={() =>
                      router.push({
                        pathname: "/group/details",
                        params: { group: JSON.stringify(item), isAdmin: "1" },
                      })
                    }
                  >
                    <Text style={styles.adminButtonText}>Admin</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoText}>
                  Membres :{" "}
                  <Text style={styles.infoValue}>
                    {item.members?.length ?? 0} / {item.max_members ?? "-"}
                  </Text>
                </Text>

                {item.userPlace && (
                  <Text style={styles.infoText}>
                    Ta place :{" "}
                    <Text style={[styles.infoValue, { color: "#8B4513" }]}>
                      {item.userPlace}
                    </Text>
                  </Text>
                )}
              </View>

              <View style={styles.rankingBlock}>
                {item.members
                  ?.slice(0, 3)
                  .map((member: any, memberIndex: number) => (
                    <View
                      key={member.id || memberIndex}
                      style={[
                        styles.participantRow,
                        memberIndex === 0 ? styles.leaderRow : null,
                      ]}
                    >
                      <Text
                        style={[
                          styles.rank,
                          memberIndex === 0 && styles.leaderRank,
                        ]}
                      >
                        {memberIndex + 1}
                      </Text>
                      <Text
                        style={[
                          styles.participantName,
                          memberIndex === 0 && styles.leaderName,
                        ]}
                      >
                        {member.name}
                      </Text>
                      <Text
                        style={[
                          styles.score,
                          memberIndex === 0 && styles.leaderScore,
                        ]}
                      >
                        {member.totalEarned ?? 0} €
                      </Text>
                    </View>
                  ))}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#151718",
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B4513",
    textAlign: "left",
  },
  addButton: {
    backgroundColor: "#C7A16E",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    elevation: 2,
  },
  addButtonText: {
    color: "#181A1B",
    fontWeight: "bold",
    fontSize: 22,
    lineHeight: 24,
  },
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
    backgroundColor: "rgba(199,161,110,0.08)",
    marginHorizontal: 2,
  },
  periodTabActive: {
    backgroundColor: "#C7A16E",
  },
  periodTabText: {
    color: "#C7A16E",
    fontWeight: "bold",
    fontSize: 14,
  },
  periodTabTextActive: {
    color: "#181A1B",
  },
  groupCard: {
    backgroundColor: "#232325",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  groupName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C7A16E",
    flex: 1,
    textAlign: "left",
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 12,
  },
  infoText: {
    color: "#AAA",
    fontSize: 14,
    marginRight: 16,
    marginBottom: 2,
  },
  infoValue: {
    color: "#ECEDEE",
    fontWeight: "bold",
  },
  rankingBlock: {
    backgroundColor: "#202123",
    borderRadius: 10,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 0,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ECEDEE",
    marginBottom: 8,
    textAlign: "left",
    marginLeft: 4,
    marginTop: 8,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#232325",
    marginHorizontal: 4,
  },
  leaderRow: {
    backgroundColor: "#232325",
    borderRadius: 6,
  },
  rank: {
    width: 28,
    fontSize: 16,
    color: "#C7A16E",
    fontWeight: "bold",
    textAlign: "right",
  },
  leaderRank: {
    color: "#FFD700",
    fontSize: 17,
  },
  participantName: {
    flex: 1,
    fontSize: 16,
    color: "#ECEDEE",
    marginLeft: 8,
  },
  leaderName: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 17,
  },
  score: {
    fontSize: 15,
    color: "#C7A16E",
    fontWeight: "bold",
    marginLeft: 8,
  },
  leaderScore: {
    color: "#FFD700",
    fontSize: 16,
  },
  adminButton: {
    marginLeft: 8,
    backgroundColor: "#C7A16E",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
    elevation: 1,
  },
  adminButtonText: {
    color: "#181A1B",
    fontWeight: "bold",
    fontSize: 14,
  },
});
