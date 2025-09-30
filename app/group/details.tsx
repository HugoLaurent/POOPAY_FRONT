import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
// import { getGroupById } from "@/apiService/auth";
// import { useAuth } from "@/contexts/AuthContext";

type Member = {
  id?: number | string;
  name: string;
  totalEarned?: number;
};
type GroupData = {
  id: number;
  name: string;
  admin_user_id: number | string;
  admin_name?: string;
  max_members?: number;
  members: Member[];
  createdAt?: string;
  updatedAt?: string;
  leader?: string;
  userPlace?: number;
};

export default function GroupDetailsScreen() {
  const params = useLocalSearchParams();
  const groupParam = params.group;
  const isAdminParam = params.isAdmin;
  const [group, setGroup] = useState<GroupData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (groupParam) {
      try {
        const parsed = JSON.parse(groupParam as string);
        setGroup(parsed);
        setIsAdmin(isAdminParam === "1");
      } catch {
        setGroup(null);
      }
    } else {
      setGroup(null);
    }
  }, [groupParam, isAdminParam]);

  // Handlers à compléter plus tard
  const handleAddMember = () => {
    Alert.alert("Ajouter un membre", "Fonction à implémenter");
  };
  const handleEditName = () => {
    Alert.alert("Modifier le nom", "Fonction à implémenter");
  };

  // plus de loading, on affiche direct
  if (!group) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.groupName}>Groupe introuvable</Text>
      </SafeAreaView>
    );
  }

  // Affichage carte de visite groupe + liste des membres
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.groupName}>{group.name}</Text>
            {isAdmin && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleEditName}
              >
                <Text style={styles.iconText}>✏️</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Admin :{" "}
              <Text style={styles.infoValue}>{group.admin_name ?? "-"}</Text>
            </Text>
            <Text style={styles.infoText}>
              Max :{" "}
              <Text style={styles.infoValue}>{group.max_members ?? "-"}</Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            {group.leader && (
              <Text style={styles.infoText}>
                Leader :{" "}
                <Text style={[styles.infoValue, { color: "#FFD700" }]}>
                  {group.leader}
                </Text>
              </Text>
            )}
          </View>
        </View>

        {/* Liste des membres */}
        <View style={styles.rankingBlock}>
          <Text style={styles.sectionTitle}>Membres</Text>
          {group.members?.map((member, idx) => (
            <View
              key={String(member.id) + "-" + idx}
              style={[
                styles.participantRow,
                idx === 0 ? styles.leaderRow : null,
              ]}
            >
              <Text style={[styles.rank, idx === 0 && styles.leaderRank]}>
                {idx + 1}
              </Text>
              <Text
                style={[styles.participantName, idx === 0 && styles.leaderName]}
              >
                {member.name}
              </Text>
              <Text style={[styles.score, idx === 0 && styles.leaderScore]}>
                {member.totalEarned ?? 0} €
              </Text>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() =>
                    Alert.alert("Supprimer le membre", "Fonction à implémenter")
                  }
                >
                  <Text style={styles.iconText}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Actions admin uniquement si admin */}
        {/* Actions admin ou quitter groupe */}
        {isAdmin ? (
          <View
            style={{
              marginTop: 32,
              flexDirection: "row",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddMember}
            >
              <Text style={styles.addButtonText}>Ajouter un membre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                Alert.alert("Supprimer le groupe", "Fonction à implémenter")
              }
            >
              <Text style={styles.addButtonText}>Supprimer le groupe</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginTop: 32, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                Alert.alert("Quitter le groupe", "Fonction à implémenter")
              }
            >
              <Text style={styles.addButtonText}>Quitter le groupe</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#181A1B",
    padding: 0,
  },
  card: {
    backgroundColor: "#232325",
    borderRadius: 16,
    margin: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  groupName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#C7A16E",
    flex: 1,
    textAlign: "left",
  },
  iconButton: {
    marginLeft: 8,
    padding: 4,
    backgroundColor: "transparent",
  },
  iconText: {
    fontSize: 20,
    color: "#C7A16E",
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoText: {
    color: "#AAA",
    fontSize: 15,
    marginRight: 16,
    marginBottom: 2,
  },
  infoValue: {
    color: "#ECEDEE",
    fontWeight: "bold",
  },
  rankingBlock: {
    backgroundColor: "#202123",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 5,
    paddingVertical: 8,
    paddingHorizontal: 0,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ECEDEE",
    marginBottom: 8,
    textAlign: "left",
    marginLeft: 16,
    marginTop: 8,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#232325",
    marginHorizontal: 12,
  },
  leaderRow: {
    backgroundColor: "#232325",
    borderRadius: 8,
  },
  rank: {
    width: 32,
    fontSize: 18,
    color: "#C7A16E",
    fontWeight: "bold",
    textAlign: "right",
  },
  leaderRank: {
    color: "#FFD700",
    fontSize: 20,
  },
  participantName: {
    flex: 1,
    fontSize: 17,
    color: "#ECEDEE",
    marginLeft: 12,
  },
  leaderName: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 18,
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
  addButton: {
    backgroundColor: "#C7A16E",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 2,
  },
  addButtonText: {
    color: "#181A1B",
    fontWeight: "bold",
    fontSize: 18,
    paddingHorizontal: 12,
  },
});
