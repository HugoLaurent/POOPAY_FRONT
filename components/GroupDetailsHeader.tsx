import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title?: string;
  subtitle?: string;
  onEdit?: () => void;
  onBack?: () => void;
};

export default function GroupDetailsHeader({
  title,
  subtitle,
  onEdit,
  onBack,
}: Props) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <TouchableOpacity
          onPress={onBack}
          accessibilityLabel="Retour"
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titles}>
          <ThemedText type="title" style={styles.title} numberOfLines={1}>
            {title}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.separator ?? "rgba(255,255,255,0.06)",
    },
    leftRow: { flexDirection: "row", alignItems: "center", flex: 1 },
    rightRow: { marginLeft: 12 },
    iconButton: { padding: 6, marginRight: 8 },
    titles: { flex: 1 },
    title: { fontSize: 18, fontWeight: "700", color: colors.text },
   
  });
