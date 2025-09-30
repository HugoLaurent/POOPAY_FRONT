import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import type { GroupData } from "@/types/group";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Helpers

const getMedal = (idx: number) => {
  const medalIcons = ["🥇", "🥈", "🥉"];
  return medalIcons[idx] ?? String(idx + 1);
};

export default function GroupDetailsScreen() {
  const params = useLocalSearchParams();
  const groupParam = params.group;
  const isAdminParam = params.isAdmin;
  const [group, setGroup] = useState<GroupData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const theme = useColorScheme() ?? "light";
  const styles = getStyles(theme);
  const colors = Colors[theme];

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

  const handleAddMember = () => {
    Alert.alert("Ajouter un membre", "Fonction à implémenter");
  };
  const handleEditName = () => {
    Alert.alert("Modifier le nom", "Fonction à implémenter");
  };

  if (!group) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.emptyTitle}>Groupe introuvable</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.headerRowCustom}>
            <View style={styles.headerMain}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupSubtitle}>
                <Text style={styles.infoValue}>
                  {group.members?.length ?? 0}
                </Text>{" "}
                / {group.max_members ?? "-"} membres
              </Text>
            </View>
            <View style={styles.headerRight}>
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor:
                      colors.groupCardAdminButton ?? colors.primary,
                  },
                ]}
              >
                <Text style={styles.countBadgeText}>
                  {group.members?.length ?? 0}
                </Text>
              </View>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.adminButton}
                  onPress={handleEditName}
                >
                  <Text style={styles.adminButtonText}>Modifier</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {group.winnerLastMonth?.name && (
            <View style={styles.winnerRowCustom}>
              <View style={styles.winnerBadge}>
                <Text style={styles.winnerEmoji}>🏆</Text>
                <Text style={styles.winnerLabel}>Gagnant du mois dernier</Text>
              </View>
              <Text style={styles.winnerName}>
                {group.winnerLastMonth.name}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Admin :{" "}
              <Text style={styles.infoValue}>{group.admin_name ?? "-"}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.rankingBlock}>
          <Text style={styles.sectionTitle}>Membres</Text>
          {group.members?.map((member, idx) => (
            <View
              key={String(member.id) + "-" + idx}
              style={[styles.participantRow, idx === 0 && styles.leaderRow]}
            >
              <View style={styles.memberAvatar}>
                {getInitials(member.name)}
              </View>
              <Text style={styles.medal}>{getMedal(idx)}</Text>
              <Text
                style={idx === 0 ? styles.leaderName : styles.participantName}
              >
                {member.name}
              </Text>
              <Text style={idx === 0 ? styles.leaderScore : styles.score}>
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

        {isAdmin ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleAddMember}
            >
              <Text style={styles.buttonPrimaryText}>Ajouter un membre</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonPrimary, styles.buttonDanger]}
              onPress={() =>
                Alert.alert("Supprimer le groupe", "Fonction à implémenter")
              }
            >
              <Text style={[styles.buttonPrimaryText, styles.buttonDangerText]}>
                Supprimer le groupe
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionsRowSingle}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() =>
                Alert.alert("Quitter le groupe", "Fonction à implémenter")
              }
            >
              <Text style={styles.buttonPrimaryText}>Quitter le groupe</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: "light" | "dark") => {
  const colors = Colors[theme];
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 24,
      paddingTop: 12,
    },
    card: {
      backgroundColor: colors.groupCardBg,
      borderRadius: 16,
      marginHorizontal: 16,
      marginTop: 8,
      padding: 20,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    headerRowCustom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.groupCardTitle,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    avatarText: {
      color: colors.background,
      fontWeight: "700",
      fontSize: 16,
    },
    headerMain: {
      flex: 1,
      justifyContent: "center",
    },
    groupSubtitle: {
      color: colors.text,
      fontSize: 13,
      marginTop: 2,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    countBadge: {
      minWidth: 36,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      paddingHorizontal: 8,
    },
    countBadgeText: {
      color: colors.onPrimary || colors.background,
      fontWeight: "700",
    },
    groupName: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.groupCardTitle,
      flex: 1,
      textAlign: "left",
    },
    adminButton: {
      marginLeft: 8,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: colors.groupCardTitle,
      alignItems: "center",
      justifyContent: "center",
    },
    adminButtonText: {
      fontWeight: "700",
      fontSize: 13,
      color: colors.background,
    },
    winnerRowCustom: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      marginTop: 6,
    },
    winnerBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.groupCardLeaderBg,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 16,
      marginRight: 12,
    },
    winnerEmoji: {
      marginRight: 8,
      fontSize: 16,
    },
    winnerLabel: {
      fontSize: 13,
      marginRight: 6,
      color: colors.text,
    },
    winnerName: {
      fontWeight: "700",
      fontSize: 13,
      color: colors.groupCardHighlight,
    },
    infoRow: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    infoText: {
      color: colors.text,
      fontSize: 15,
      marginRight: 16,
      marginBottom: 2,
    },
    infoValue: {
      color: colors.text,
      fontWeight: "700",
    },
    rankingBlock: {
      backgroundColor: colors.groupCardBg,
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: 12,
      paddingVertical: 8,
      paddingHorizontal: 0,
      elevation: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "left",
      marginLeft: 16,
      marginTop: 8,
    },
    participantRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      marginHorizontal: 12,
    },
    memberAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.groupCardTitle,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    medal: {
      width: 28,
      textAlign: "center",
      marginRight: 6,
      fontSize: 18,
    },
    leaderRow: {
      borderRadius: 8,
      backgroundColor: colors.groupCardLeaderBg,
    },
    rank: {
      width: 32,
      fontSize: 18,
      color: colors.groupCardTitle,
      fontWeight: "700",
      textAlign: "right",
    },
    leaderRank: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.groupCardHighlight,
    },
    participantName: {
      flex: 1,
      fontSize: 17,
      color: colors.text,
      marginLeft: 12,
    },
    leaderName: {
      flex: 1,
      fontSize: 18,
      fontWeight: "800",
      color: colors.groupCardHighlight,
      marginLeft: 12,
    },
    score: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.groupCardTitle,
      marginLeft: 8,
    },
    leaderScore: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.groupCardHighlight,
      marginLeft: 8,
    },
    iconButton: {
      marginLeft: 8,
      padding: 6,
      backgroundColor: "transparent",
    },
    iconText: {
      fontSize: 18,
      color: colors.groupCardTitle,
    },
    actionsRow: {
      marginTop: 32,
      flexDirection: "row",
      gap: 12,
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    actionsRowSingle: {
      marginTop: 32,
      alignItems: "center",
      paddingHorizontal: 16,
    },
    emptyTitle: {
      marginTop: 32,
      textAlign: "center",
      color: colors.groupCardTitle,
      fontWeight: "700",
      fontSize: 18,
    },
    buttonPrimary: {
      backgroundColor: colors.groupCardHighlight,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonPrimaryText: {
      color: colors.background,
      fontWeight: "700",
      fontSize: 16,
    },
    buttonDanger: {
      backgroundColor: colors.background,
    },
    buttonDangerText: {
      color: colors.dangerBg,
    },
  });
};
