import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface StatsBlockProps {
  stats: { sessions: number; amount: number; time: number };
  labels?: string[];
  style?: any;
}

export default function StatsBlock({
  stats,
  labels = ["Sessions", "Gagné", "Temps passé"],
  style,
}: StatsBlockProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const styles = getStyles(colors);

  return (
    <ThemedView style={[styles.statsBlock, styles.statsBlockSpacing, style]}>
      <View style={[styles.statsItem, styles.statsItemSpacing]}>
        <Text style={styles.statsValue}>{stats.sessions}</Text>
        <Text style={styles.statsLabel}>{labels[0]}</Text>
      </View>
      <View style={[styles.statsItem, styles.statsItemSpacing]}>
        <Text style={styles.statsValue}>{stats.amount.toFixed(2)}€</Text>
        <Text style={styles.statsLabel}>{labels[1]}</Text>
      </View>
      <View style={styles.statsItem}>
        <Text style={styles.statsValue}>{stats.time}h</Text>
        <Text style={styles.statsLabel}>{labels[2]}</Text>
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
      paddingVertical: 18,
      paddingHorizontal: 18,
      backgroundColor: colors.groupCardBg,
    },
    statsBlockSpacing: {
      marginBottom: 4,
    },
    statsItem: {
      alignItems: "center",
      flex: 1,
    },
    statsItemSpacing: {
      marginRight: 12,
    },
    statsValue: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.textDivers,
      marginBottom: 4,
    },
    statsLabel: {
      color: colors.textDivers,
      fontSize: 13,
      opacity: 0.7,
      letterSpacing: 0.2,
    },
  });
