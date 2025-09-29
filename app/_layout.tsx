import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Thème personnalisé pour éviter le flash blanc
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#151718", // Notre couleur de fond sombre
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#151718", // Même couleur pour éviter le flash
    },
  };

  return (
    <AuthProvider>
      <AppProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? customDarkTheme : customLightTheme}
        >
          <RootStack />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AppProvider>
    </AuthProvider>
  );
}

function RootStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#151718" }, // Fond sombre par défaut
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
