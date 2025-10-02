import React, { useState } from "react";
import { View, Pressable, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import FlappyTurd from "@/components/game/FlappyTurd";
import DinoTurd from "@/components/game/DinoTurd";

export default function GameContainer() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      {selectedGame ? (
        // render the chosen game in full size inside the container
        selectedGame === "flappy" ? (
          <FlappyTurd autoStart={false} />
        ) : selectedGame === "dino" ? (
          <DinoTurd autoStart={false} />
        ) : (
          // fallback: render FlappyTurd by default
          <FlappyTurd autoStart={false} />
        )
      ) : (
        // centered selector
        <View style={styles.selectorWrap} pointerEvents="box-none">
          <View style={styles.selectorRow}>
            <Pressable
              onPress={() => setSelectedGame("flappy")}
              style={({ pressed }) => [
                styles.selectorButton,
                selectedGame === "flappy"
                  ? styles.selectorButtonActive
                  : styles.selectorButtonInactive,
                pressed && styles.buttonPressed,
              ]}
            >
              <ThemedText
                style={
                  selectedGame === "flappy"
                    ? styles.selectorTextActive
                    : styles.selectorTextInactive
                }
              >
                FlappyTurd
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setSelectedGame("dino")}
              style={({ pressed }) => [
                styles.selectorButton,
                selectedGame === "dino"
                  ? styles.selectorButtonActive
                  : styles.selectorButtonInactive,
                pressed && styles.buttonPressed,
              ]}
            >
              <ThemedText
                style={
                  selectedGame === "dino"
                    ? styles.selectorTextActive
                    : styles.selectorTextInactive
                }
              >
                DinoTurd
              </ThemedText>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: Math.round(Dimensions.get("window").height * 0.55),
    },
    selectorWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
    selectorRow: { flexDirection: "row", gap: 12 },
    selectorButton: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
    },
    selectorButtonActive: {
      backgroundColor: colors.bgButtonPrimary,
      borderColor: colors.bgButtonPrimary,
    },
    selectorButtonInactive: {
      backgroundColor: colors.bgButtonPrimary,
      borderColor: colors.bgButtonPrimary,
    },
    selectorTextActive: { color: colors.textButtonPrimary },
    selectorTextInactive: { color: colors.textButtonPrimary },
    buttonPressed: { opacity: 0.85 },
  });
