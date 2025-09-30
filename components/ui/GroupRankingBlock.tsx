import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { GroupData } from "@/types/group";

interface GroupRankingBlockProps {
  group: GroupData;
  profile: any;
  style?: any;
}

export default function GroupRankingBlock({
  group,
  profile,
  style,
}: GroupRankingBlockProps) {
  const members = group.members || [];
  const topMembers = members.slice(0, 3);
  const medals = ["🥇", "🥈", "🥉"];
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const styles = getStyles(colors);
  // DEBUG LOG

  return (
    <ThemedView style={[styles.statsBlock, styles.statsBlockSpacing, style]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.groupName}>{group.name}</Text>
      </View>
      <View style={styles.rightColumn}>
        {topMembers.map((member: any, mIdx: number) => {
          const isUser = member.username === profile?.username;
          const key =
            (member.id !== undefined
              ? String(member.id)
              : member.username || member.name) +
            "-" +
            mIdx;
          return (
            <View
              key={key}
              style={[
                styles.memberRow,
                mIdx < 2 ? styles.memberRowMargin : null,
              ]}
            >
              <Text style={styles.groupLeaderName}>
                {isUser ? "Vous" : member.username || member.name}
              </Text>
              <Text style={styles.groupMedal}>{medals[mIdx]}</Text>
            </View>
          );
        })}
      </View>
    </ThemedView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    statsBlock: {
      borderRadius: 16,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(139, 69, 19, 0.1)",
      padding: 8,
      backgroundColor: colors.groupCardBg,
    },
    statsBlockSpacing: {
      marginBottom: 10,
    },
    rightColumn: {
      alignItems: "flex-end",
      flexDirection: "column",
      gap: 2,
      minWidth: 90,
    },
    memberRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    memberRowMargin: { marginBottom: 2 },
    groupBlockHarmonized: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    groupName: {
      fontWeight: "bold",
      fontSize: 16,
      color: colors.textDivers,
      marginLeft: 4,
    },
    groupMedal: {
      fontSize: 18,
      marginRight: 4,
    },
    groupLeaderName: {
      fontSize: 14,
      color: colors.textDivers,
      fontWeight: "normal",
    },
  });
