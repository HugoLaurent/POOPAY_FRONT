import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useNavigation } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
// IconSymbol removed — not used in this screen
import { useAppData } from "@/contexts/AppContext";
import GroupDetailsHeader from "@/components/GroupDetailsHeader";
import GameContainer from "@/components/GameContainer";

export default function TimerScreen() {
  // navigation is used to set a custom native header like GroupDetails
  const navigation = useNavigation();
  // safe area insets could be used here, but we'll keep a small absolute offset
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Start from zero and count up
  const DEFAULT_SECONDS = 0;

  const { profile } = useAppData();

  const [secondsElapsed, setSecondsElapsed] = useState(DEFAULT_SECONDS);
  const [running, setRunning] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  // game selection is now handled inside GameContainer

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      // start interval to increment elapsed seconds
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((s) => s + 1);
      }, 1000) as unknown as number;
    }

    return () => {
      clearIntervalIfAny();
    };
  }, [running]);

  function clearIntervalIfAny() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as unknown as number);
      intervalRef.current = null;
    }
  }

  function toggleStartPause() {
    setRunning((r) => {
      const next = !r;
      if (next) {
        // starting a new run: clear elapsed and hide the save button
        setSecondsElapsed(0);
        setShowSaveButton(false);
      } else {
        // stopping the run: show the "Enregistrer la session" button
        setShowSaveButton(true);
      }
      return next;
    });
  }

  function handleSaveSession() {
    // NOTE: per your previous instruction we won't persist sessions now.
    // This button clears the UI and hides itself. If you want persistence,
    // I can hook this to the backend or AsyncStorage.
    setShowSaveButton(false);
    setSecondsElapsed(0);
    setRunning(false);
  }

  function handleCancelSession() {
    // User canceled: just hide the save button and reset UI state
    setShowSaveButton(false);
    setSecondsElapsed(0);
    setRunning(false);
  }

  // resetTimer removed; stopping/starting handled by toggleStartPause

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }

  // Mirror the Group Details header: set a native header that shows the timer
  useEffect(() => {
    try {
      navigation.setOptions &&
        navigation.setOptions({
          header: () => (
            <GroupDetailsHeader
              title={"Chronomètre"}
              subtitle={
                running
                  ? "En cours"
                  : secondsElapsed === 0
                  ? "Prêt"
                  : "En pause"
              }
              onBack={() => navigation.goBack && navigation.goBack()}
            />
          ),
        });
    } catch {
      // ignore in environments where setOptions is not available
    }
  }, [navigation, secondsElapsed, running]);

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Game area with overlayed game selector buttons */}
      {/* Top: timer */}
      <View style={styles.topBar}>
        <ThemedText style={styles.clock}>
          {formatTime(secondsElapsed)}
        </ThemedText>

        <View style={styles.earningsRow}>
          <ThemedText style={styles.earningsLabel}>Gagné</ThemedText>
          <ThemedText style={styles.earningsValue}>
            {(() => {
              const hourly = parseFloat(profile?.hourly_rate ?? 0) || 0;
              const earned = (secondsElapsed / 3600) * hourly;
              const currency = profile?.currency ?? "€";
              return `${earned.toFixed(2)} ${currency}`;
            })()}
          </ThemedText>
        </View>
      </View>

      {/* Center: Game container — selector appears centered inside this component */}
      <View style={styles.gameArea}>
        <GameContainer />
      </View>

      {/* Bottom: earnings + controls */}
      <View style={styles.bottomArea}>
        {showSaveButton ? (
          <View style={styles.twoButtonRow}>
            <Pressable
              onPress={handleSaveSession}
              style={({ pressed }) => [
                styles.buttonHalf,
                { backgroundColor: colors.primary },
                pressed && styles.buttonPressed,
                { marginRight: 8 },
              ]}
            >
              <ThemedText style={styles.fullWidthButtonText}>
                Enregistrer la session
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleCancelSession}
              style={({ pressed }) => [
                styles.buttonHalf,
                { backgroundColor: colors.background },
                pressed && styles.buttonPressed,
                { borderWidth: 1, borderColor: colors.primary },
              ]}
            >
              <ThemedText
                style={[styles.fullWidthButtonText, { color: colors.primary }]}
              >
                Annuler la session
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={toggleStartPause}
            style={({ pressed }) => [
              styles.fullWidthButton,
              { backgroundColor: colors.primary },
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText style={styles.fullWidthButtonText}>
              {running ? "Arrêter le timer" : "Démarrer le timer"}
            </ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

// FlappyGame extracted to components/FlappyGame.tsx

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  clock: { fontSize: 50, fontWeight: "700", lineHeight: 48, marginBottom: 8 },
  subtitle: { marginBottom: 24, color: "#888" },

  topBar: {
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  subtitleTop: { marginTop: 6, color: "#bbb" },

  earningsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 8,
  },
  earningsLabel: { fontSize: 20, color: "#666", marginRight: 8 },
  earningsValue: { fontSize: 24, fontWeight: "700" },

  gameArea: {
    // Height is 55% of screen height, adapts to screen size
    height: Math.round(Dimensions.get("window").height * 0.7),
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 24,
  },
  bottomArea: {
    paddingBottom: 24,
    width: "100%",
    alignItems: "center",
  },

  controls: { flexDirection: "row", alignItems: "center", gap: 16 },
  primaryButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  resetButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  flappyContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // minHeight and maxHeight adapt to screen size
    minHeight: Math.round(Dimensions.get("window").height * 0.25),
    maxHeight: Math.round(Dimensions.get("window").height * 0.7),
  },
  flappyInner: { position: "relative" },

  scoreWrap: { position: "absolute", top: 8, left: 8, zIndex: 10 },
  scoreText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  gameOverText: { color: "#f8d7da", fontSize: 12, marginTop: 4 },
  fullWidthButton: {
    width: "90%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidthButtonText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  twoButtonRow: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonHalf: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  gameOverlay: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
    pointerEvents: "box-none",
  },
  gameOverlayRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gameSelectButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  gameSelectButtonText: {
    fontWeight: "700",
  },
});
