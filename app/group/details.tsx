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
        <View style={styles.section}>
          <ThemedText type="title" style={styles.title}>
            {group.name}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            <ThemedText style={styles.infoValue}>
              {group.members?.length ?? 0}
            </ThemedText>
            {" / "}
            {group.max_members ?? "-"} membres
          </ThemedText>

          <View style={styles.row}>
            <ThemedText style={styles.metaLabel}>Admin :</ThemedText>
            <ThemedText style={styles.metaValue}>
              {group.admin_name ?? "-"}
            </ThemedText>
          </View>

          {group.winnerLastMonth?.name && (
            <View style={styles.row}>
              <ThemedText style={styles.metaLabel}>
                Gagnant du mois dernier :
              </ThemedText>
              <ThemedText style={styles.metaValue}>
                {group.winnerLastMonth.name}
              </ThemedText>
            </View>
          )}

          {isAdmin && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={handleEditName}
                style={styles.buttonPrimary}
              >
                <ThemedText style={styles.buttonPrimaryText}>
                  Modifier le nom
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Membres</ThemedText>

          {group.members?.length ? (
            group.members.map((member, idx) => (
              <View key={`${member.id ?? idx}-${idx}`} style={styles.memberRow}>
                <ThemedText style={styles.medal}>{getMedal(idx)}</ThemedText>
                <ThemedText
                  style={idx === 0 ? styles.leaderName : styles.memberName}
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
                  >
                    <ThemedText style={styles.iconText}>🗑️</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <ThemedText>Aucun membre</ThemedText>
          )}
        </View>

        <View style={styles.section}>
          {isAdmin ? (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={handleAddMember}
                style={styles.buttonPrimary}
              >
                <ThemedText style={styles.buttonPrimaryText}>
                  Ajouter un membre
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Supprimer le groupe", "Fonction à implémenter")
                }
                style={styles.buttonDanger}
              >
                <ThemedText style={styles.buttonDangerText}>
                  Supprimer le groupe
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Quitter le groupe", "Fonction à implémenter")
                }
                style={styles.buttonPrimary}
              >
                <ThemedText style={styles.buttonPrimaryText}>
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
    row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
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
    buttonPrimaryText: { color: colors.textButtonPrimary, fontWeight: "700" },
    buttonDanger: {
      backgroundColor: colors.background,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
      marginLeft: 8,
    },
    buttonDangerText: { color: colors.dangerBg, fontWeight: "700" },
    iconText: { color: colors.groupCardTitle, fontSize: 18 },
    // styles requis par le composant
    title: { fontSize: 24, fontWeight: "700", color: colors.groupCardTitle },
    subtitle: { marginTop: 6, color: colors.text },
    infoValue: { fontWeight: "700", color: colors.textDivers },
    metaLabel: { fontWeight: "700", color: colors.textDivers },
    metaValue: { marginLeft: 8, color: colors.text },
  });
