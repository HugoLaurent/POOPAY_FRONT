import { GroupMember } from "@/contexts/AppContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface GroupRankingBlockProps {
  group: any;
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
  return (
    <View
      style={[
        styles.statsBlock,
        styles.statsBlockSpacing,
        styles.groupBlockHarmonized,
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.groupName}>{group.name}</Text>
      </View>
      <View
        style={{
          alignItems: "flex-end",
          flexDirection: "column",
          gap: 2,
          minWidth: 90,
        }}
      >
        {topMembers.map((member: GroupMember, mIdx: number) => {
          const isUser = member.username === profile?.username;
          return (
            <View
              key={member.username + mIdx}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: mIdx < 2 ? 2 : 0,
              }}
            >
              <Text style={styles.groupLeaderName}>
                {isUser ? "Vous" : member.username}
              </Text>
              <Text style={styles.groupMedal}>{medals[mIdx]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsBlock: {
    backgroundColor: "rgba(139, 69, 19, 0.05)",
    borderRadius: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139, 69, 19, 0.1)",
    padding: 8,
  },
  statsBlockSpacing: {
    marginBottom: 10,
  },
  groupBlockHarmonized: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#8B4513",
    marginLeft: 4,
  },
  groupMedal: {
    fontSize: 18,
    marginRight: 4,
  },
  groupLeaderName: {
    fontSize: 14,
    color: "#8B4513",
    fontWeight: "normal",
  },
});
