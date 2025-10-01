import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // Use app Colors so background matches light/dark theme and avoids flashes
  const theme = colorScheme === "dark" ? "dark" : "light";
  const backgroundColor = Colors[theme].background;

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: backgroundColor,
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: backgroundColor,
    },
  };

  return (
    <AuthProvider>
      <AppProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? customDarkTheme : customLightTheme}
        >
          <SafeAreaView
            style={[styles.safeArea, { backgroundColor }]}
            edges={["top"]}
          >
            <RootStack backgroundColor={backgroundColor} />
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
          </SafeAreaView>
        </ThemeProvider>
      </AppProvider>
    </AuthProvider>
  );
}

const styles = {
  safeArea: { flex: 1 },
  stackContentStyle: { backgroundColor: "#151718" },
};

function RootStack({ backgroundColor }: { backgroundColor?: string }) {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor:
            backgroundColor ?? styles.stackContentStyle.backgroundColor,
        }, // use theme bg
        animationDuration: 350, // Durée d'animation globale
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "fade", // Fade pour le loading
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          animation: "slide_from_left", // Slide depuis la gauche pour login
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          animation: "slide_from_right", // Slide depuis la droite pour l'app
          animationDuration: 400, // Un peu plus lent pour être fluide
        }}
      />
      <Stack.Screen
        name="group/details"
        options={{
          // Affiche l'en-tête natif pour permettre le retour en arrière
          headerShown: true,
          // On garde la même animation
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Modal",
          animation: "slide_from_bottom", // Modal depuis le bas
        }}
      />
    </Stack>
  );
}
