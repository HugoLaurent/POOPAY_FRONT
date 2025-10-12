import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface NotificationBadgeProps {
  count: number;
  onPress: () => void;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  onPress,
}) => {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Image
        source={require("@/assets/images/logoPoopay.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.badgeText}>
            {count > 99 ? "99+" : count}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    position: "relative",
  },
  pressed: {
    opacity: 0.7,
  },
  logo: {
    width: 40,
    height: 40,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
