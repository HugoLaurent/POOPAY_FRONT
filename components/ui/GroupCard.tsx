import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { GroupData } from "@/types/group";

interface GroupCardProps {
  item?: GroupData | null;
  userId?: string | number;
  onPress?: (item: GroupData, adminName: string, isAdmin: boolean) => void;
  isLoading?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({
  item,
  userId,
  onPress,
  isLoading,
}) => {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const isAdmin = item ? String(item.admin_user_id) === String(userId) : false;
  const adminName =
    item?.members?.find(
      (m: any) => String(m.id) === String(item?.admin_user_id)
    )?.name || "-";
  const winnerLastMonth = item?.winnerLastMonth;

  const styles = getStyles(colors);

  // Placeholder card when loading
  if (isLoading) {
    return (
      <View style={styles.groupCard}>
        <View style={styles.headerRowCustom}>
          <View style={styles.placeholderLeft}>
            <View style={styles.placeholderLineLarge} />
          </View>
          <View style={styles.headerRight}>
            <ActivityIndicator size="small" color={colors.groupCardTitle} />
          </View>
        </View>

        <View style={styles.placeholderLineSmall} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => onPress && item && onPress(item, adminName, isAdmin)}
      activeOpacity={0.9}
    >
      {/* Ligne 1 : Titre + membres/max + bouton admin */}
      <View style={styles.headerRowCustom}>
        <Text style={styles.groupName}>{item?.name}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.infoValue}>
            {item?.members?.length ?? 0} / {item?.max_members ?? "-"}
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
        {item?.members?.slice(0, 3).map((member: any, memberIndex: number) => {
          const isLeader = memberIndex === 0;
          const medalIcons = ["🥇", "🥈", "🥉"];
          const medal = medalIcons[memberIndex] ?? String(memberIndex + 1);
          return (
            <View key={member.id || memberIndex} style={styles.participantRow}>
              <Text style={styles.medal}>{medal}</Text>
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
    placeholderLeft: { flex: 1 },
    placeholderLineLarge: {
      height: 22,
      width: "60%",
      borderRadius: 6,
      backgroundColor: colors.groupCardTitle + "33",
    },
    placeholderLineSmall: {
      height: 12,
      marginTop: 12,
      width: "40%",
      borderRadius: 6,
      backgroundColor: colors.groupCardTitle + "22",
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
      color: colors.textDivers,
      fontWeight: "bold",
    },
    adminButton: {
      marginLeft: 8,
      backgroundColor: colors.bgButtonPrimary,
      borderRadius: 6,
      paddingVertical: 4,
      paddingHorizontal: 12,
      alignItems: "center",
      elevation: 1,
    },
    adminButtonText: {
      color: colors.textButtonPrimary,
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
      color: colors.textDivers,
    },
    winnerName: {
      fontWeight: "bold",
      fontSize: 14,
      color: colors.textDivers,
    },
    rankingBlock: {},
    participantRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 7,
    },

    medal: {
      fontSize: 20,
      marginRight: 8,
      width: 30,
      textAlign: "center",
    },
    participantName: {
      flex: 1,
      fontSize: 16,
      color: colors.textDivers,
      marginLeft: 8,
    },
    leaderName: {
      flex: 1,
      fontSize: 17,
      fontWeight: "bold",
      color: colors.textDivers,
      marginLeft: 8,
    },
    score: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.textDivers,
      marginLeft: 8,
    },
    leaderScore: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textDivers,
      marginLeft: 8,
    },
  });

export default GroupCard;
