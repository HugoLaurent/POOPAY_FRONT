import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { GroupData } from "@/types/group";

interface GroupCardProps {
  item: GroupData;
  userId: string | number;
  onPress: (item: GroupData, adminName: string, isAdmin: boolean) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ item, userId, onPress }) => {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const isAdmin = String(item.admin_user_id) === String(userId);
  const adminName =
    item.members?.find((m: any) => String(m.id) === String(item.admin_user_id))
      ?.name || "-";
  const winnerLastMonth = item.winnerLastMonth;

  const styles = getStyles(colors);

  return (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => onPress(item, adminName, isAdmin)}
      activeOpacity={0.9}
    >
      {/* Ligne 1 : Titre + membres/max + bouton admin */}
      <View style={styles.headerRowCustom}>
        <Text style={styles.groupName}>{item.name}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.infoValue}>
            {item.members?.length ?? 0} / {item.max_members ?? "-"}
          </Text>
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
      </View>

      {/* Gagnant du mois dernier */}
      {winnerLastMonth?.name && (
        <View style={styles.winnerRowCustom}>
          <Text style={styles.winnerLabel}>Gagnant du mois dernier :</Text>
          <Text style={styles.winnerName}>{winnerLastMonth.name}</Text>
        </View>
      )}

      {/* Bloc classement */}
      <View style={styles.rankingBlock}>
        {item.members?.slice(0, 3).map((member: any, memberIndex: number) => {
          const isLeader = memberIndex === 0;
          return (
            <View
              key={member.id || memberIndex}
              style={[styles.participantRow, isLeader && styles.leaderRow]}
            >
              <Text style={isLeader ? styles.leaderRank : styles.rank}>
                {memberIndex + 1}
              </Text>
              <Text
                style={isLeader ? styles.leaderName : styles.participantName}
              >
                {member.name}
              </Text>
              <Text style={isLeader ? styles.leaderScore : styles.score}>
                {member.totalEarned ?? 0} €
              </Text>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    groupCard: {
      backgroundColor: colors.groupCardBg,
      borderRadius: 16,
      padding: 18,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    headerRowCustom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    groupName: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.groupCardTitle,
      flex: 1,
      textAlign: "left",
    },
    infoValue: {
      color: colors.groupCardText,
      fontWeight: "bold",
    },
    adminButton: {
      marginLeft: 8,
      backgroundColor: colors.groupCardAdminButton,
      borderRadius: 6,
      paddingVertical: 4,
      paddingHorizontal: 12,
      alignItems: "center",
      elevation: 1,
    },
    adminButtonText: {
      color: colors.groupCardAdminText,
      fontWeight: "bold",
      fontSize: 14,
    },
    winnerRowCustom: {
      marginTop: 8,
      marginBottom: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 6,
    },
    winnerLabel: {
      fontWeight: "bold",
      fontSize: 14,
      color: colors.groupCardText,
    },
    winnerName: {
      fontWeight: "bold",
      fontSize: 14,
      color: colors.groupCardHighlight,
    },
    rankingBlock: {},
    participantRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 7,
    },
    leaderRow: {},
    rank: {
      fontSize: 16,
      color: colors.groupCardTitle,
      fontWeight: "bold",
      textAlign: "right",
    },
    leaderRank: {
      fontSize: 17,
      color: colors.groupCardHighlight,
      fontWeight: "bold",
    },
    participantName: {
      flex: 1,
      fontSize: 16,
      color: colors.groupCardText,
      marginLeft: 8,
    },
    leaderName: {
      flex: 1,
      fontSize: 17,
      fontWeight: "bold",
      color: colors.groupCardHighlight,
      marginLeft: 8,
    },
    score: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.groupCardTitle,
      marginLeft: 8,
    },
    leaderScore: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.groupCardHighlight,
      marginLeft: 8,
    },
  });

export default GroupCard;
