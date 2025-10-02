import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  StatusBar as RNStatusBar,
  Platform,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export const unstable_settings = { anchor: "(tabs)" };

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <InnerLayout />
      </AppProvider>
    </AuthProvider>
  );
}

function InnerLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const bg = Colors[theme].background;

  const customDarkTheme = {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, background: bg },
  };
  const customLightTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: bg },
  };

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [baseBg, setBaseBg] = useState(bg);
  const [overlayBg, setOverlayBg] = useState<string | null>(null);

  useEffect(() => {
    if (bg === baseBg) return;

    // Fade the previous background over the new one, keeping the content visible.
    const previousBg = baseBg;
    setOverlayBg(previousBg); // overlay shows the old color
    overlayOpacity.setValue(1);

    // swap base immediately to the new bg, so content remains drawn on top of the new bg
    setBaseBg(bg);

    // then animate the overlay (old bg) out to reveal the new background smoothly
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setOverlayBg(null);
    });
  }, [bg, baseBg, overlayOpacity]);

  useEffect(() => {
    try {
      RNStatusBar.setBarStyle(
        theme === "dark" ? "light-content" : "dark-content",
        true
      );
      if (Platform.OS === "android")
        RNStatusBar.setBackgroundColor(baseBg, true);
    } catch {
      // ignore
    }
  }, [theme, baseBg]);

  return (
    <ThemeProvider
      value={theme === "dark" ? customDarkTheme : customLightTheme}
    >
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: baseBg }]}
        edges={["top"]}
      >
        <Animated.View style={{ flex: 1 }}>
          <RootStack backgroundColor={baseBg} />
        </Animated.View>

        {overlayBg !== null && (
          <Animated.View
            pointerEvents="none"
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: overlayBg,
              opacity: overlayOpacity,
            }}
          />
        )}

        <StatusBar
          style={theme === "dark" ? "light" : "dark"}
          backgroundColor={baseBg}
          translucent={false}
        />
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  stackContentStyle: { backgroundColor: "#151718" },
});

function RootStack({ backgroundColor }: { backgroundColor?: string }) {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor:
            backgroundColor ?? styles.stackContentStyle.backgroundColor,
        },
        animationDuration: 350,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          animation: "slide_from_left",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 400,
        }}
      />
      <Stack.Screen
        name="group/details"
        options={{ headerShown: true, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="timer"
        options={{ headerShown: true, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
