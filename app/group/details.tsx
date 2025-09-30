import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import type { GroupData } from "@/types/group";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Helper: conserve le nom et le comportement
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
  const colors = Colors[theme];
  const styles = getStyles(colors);

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
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyTitle}>Groupe introuvable</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Card */}
        <View style={styles.groupCard} accessible accessibilityRole="header">
          <View style={styles.headerRowCustom}>
            <ThemedText type="title" style={styles.title}>
              {group.name}
            </ThemedText>

            <View style={styles.headerRight}>
              <ThemedText style={styles.infoValue}>
                {group.members?.length ?? 0} / {group.max_members ?? "-"}
              </ThemedText>
            </View>
          </View>

          {/* Show admin owner only when the viewer is NOT the admin */}
          {!isAdmin && (
            <View style={styles.metaRow}>
              <ThemedText style={styles.metaLabel}>Admin :</ThemedText>
              <ThemedText style={styles.metaValue}>
                {group.admin_name ?? "-"}
              </ThemedText>
            </View>
          )}

          {group.winnerLastMonth?.name && (
            <View style={styles.winnerRow}>
              <ThemedText style={styles.winnerLabel}>
                Gagnant du mois dernier :
              </ThemedText>
              <ThemedText style={styles.winnerName}>
                {group.winnerLastMonth.name}
              </ThemedText>
            </View>
          )}

          {isAdmin && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={handleEditName}
                style={styles.buttonPrimary}
                accessibilityLabel="Modifier le nom du groupe"
              >
                <ThemedText style={styles.buttonPrimaryText}>
                  Modifier
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Members Card */}
        <View style={[styles.groupCard, styles.memberCard]}>
          <ThemedText type="subtitle" style={styles.membersHeader}>
            Membres
          </ThemedText>

          {group.members?.length ? (
            group.members.map((member, idx) => (
              <TouchableOpacity
                key={`${member.id ?? idx}-${idx}`}
                activeOpacity={0.8}
                style={styles.memberRow}
                accessibilityRole="button"
                accessibilityLabel={`Membre ${member.name}, ${
                  member.totalEarned ?? 0
                } euros`}
                onPress={() => {
                  /* Potentielle navigation vers profil membre */
                }}
              >
                <ThemedText style={styles.medal}>{getMedal(idx)}</ThemedText>

                <ThemedText
                  style={idx === 0 ? styles.leaderName : styles.memberName}
                  numberOfLines={1}
                >
                  {member.name}
                </ThemedText>

                <ThemedText style={styles.memberScore}>
                  {member.totalEarned ?? 0} €
                </ThemedText>

                {isAdmin && (
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        "Supprimer le membre",
                        "Fonction à implémenter"
                      )
                    }
                    style={styles.iconButton}
                    accessibilityLabel={`Supprimer ${member.name}`}
                  >
                    <ThemedText style={styles.iconText}>🗑️</ThemedText>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <ThemedText style={styles.emptyList}>Aucun membre</ThemedText>
          )}
        </View>

        {/* Actions Footer */}
        <View style={styles.section}>
          {isAdmin ? (
            <View style={[styles.section, styles.actionsRowAdmin]}>
              <TouchableOpacity
                onPress={handleAddMember}
                style={[styles.buttonPrimary, styles.buttonPrimarySmall]}
                accessibilityLabel="Ajouter un membre"
              >
                <ThemedText style={styles.buttonPrimaryText}>
                  Ajouter
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Supprimer le groupe", "Fonction à implémenter")
                }
                style={[styles.buttonDanger, styles.buttonDangerSmall]}
                accessibilityLabel="Supprimer le groupe"
              >
                <ThemedText style={styles.buttonDangerText}>
                  Supprimer
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.section}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Quitter le groupe", "Fonction à implémenter")
                }
                style={styles.fullWidthButton}
                accessibilityLabel="Quitter le groupe"
              >
                <ThemedText style={styles.fullWidthButtonText}>
                  Quitter le groupe
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 16, paddingBottom: 40 },
    section: { marginBottom: 16 },
    row: { flexDirection: "row", marginTop: 8 },
    actionsRow: { flexDirection: "row", marginTop: 12 },
    simpleButton: { padding: 10, borderRadius: 8, marginRight: 8 },
    memberRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    medal: { width: 36, textAlign: "center" },
    memberName: { flex: 1, marginLeft: 8, color: colors.groupCardText },
    leaderName: {
      flex: 1,
      marginLeft: 8,
      fontWeight: "700",
      color: colors.groupCardHighlight,
    },
    memberScore: { marginLeft: 12, color: colors.textDivers },
    // additional styles to avoid inline
    emptyTitle: {
      marginTop: 32,
      textAlign: "center",
      color: colors.groupCardTitle,
      fontWeight: "700",
      fontSize: 18,
    },
    buttonPrimary: {
      backgroundColor: colors.bgButtonPrimary,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      marginRight: 8,
    },
    buttonPrimaryText: {
      color: colors.textButtonPrimary,
      fontWeight: "700",
      textAlign: "center",
    },
    buttonDanger: {
      backgroundColor: colors.background,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      marginLeft: 8,
    },
    buttonDangerText: {
      color: colors.dangerBg,
      fontWeight: "700",
      textAlign: "center",
    },
    iconText: { color: colors.groupCardTitle, fontSize: 18 },
    // styles requis par le composant
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.groupCardTitle,
      flexShrink: 1,
      flexWrap: "wrap",
    },
    subtitle: { marginTop: 6, color: colors.text },
    infoValue: { fontWeight: "700", color: colors.textDivers },
    metaLabel: { fontWeight: "700", color: colors.textDivers },
    metaValue: { marginLeft: 8, color: colors.text },
    /* New styles for updated layout */
    groupCard: {
      backgroundColor: colors.groupCardBg,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 1,
    },
    headerRowCustom: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    adminBadge: {
      marginLeft: 8,
      backgroundColor: colors.bgButtonPrimary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    adminBadgeText: {
      color: colors.textButtonPrimary,
      fontWeight: "700",
      fontSize: 12,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    winnerRow: {
      flexDirection: "row",
      marginTop: 8,
      alignItems: "center",
    },
    winnerLabel: { fontWeight: "700", color: colors.textDivers },
    winnerName: { marginLeft: 8, color: colors.text },
    memberCard: { paddingTop: 12 },
    iconButton: { padding: 6, marginLeft: 8, borderRadius: 8 },
    emptyList: { marginTop: 8, color: colors.textDivers, textAlign: "center" },
    membersHeader: { textAlign: "center" },
    actionsRowRight: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 8,
    },
    fullWidthButton: {
      backgroundColor: colors.bgButtonPrimary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    fullWidthButtonText: {
      color: colors.textButtonPrimary,
      fontWeight: "800",
      fontSize: 16,
    },
    fullWidthDanger: { backgroundColor: colors.dangerBg, marginTop: 8 },
    fullWidthButtonTextDanger: {
      color: colors.background,
      fontWeight: "800",
      fontSize: 16,
    },
    actionsRowAdmin: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
    },
    buttonPrimarySmall: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 10,
    },
    buttonDangerSmall: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 10,
      marginLeft: 8,
    },
  });
