import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedView } from "@/components/themed-view";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);

  const { login, signup } = useAuth();
  const { initializeAppData } = useAppData();

  const handleSubmit = async () => {
    // if (!email || !password) {
    //   Alert.alert("Erreur", "Veuillez remplir tous les champs");
    //   return;
    // }

    setIsLoading(true);

    try {
      let success = false;

      if (isSignupMode) {
        success = await signup(email, password);
      } else {
        success = await login("admin@example.com", "admin1234");
      }

      if (success) {
        // Charger les données App avant navigation
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          await initializeAppData(token);
        }
        router.push("/(tabs)");
      } else {
        Alert.alert(
          "Erreur",
          isSignupMode
            ? "Impossible de créer le compte"
            : "Email ou mot de passe incorrect"
        );
      }
    } catch (error) {
      console.error("🎯 HandleSubmit: Exception:", error);
      Alert.alert("Erreur", "Une erreur est survenue");
    } finally {
      console.log("🎯 HandleSubmit: Fin, arrêt du loading");
      setIsLoading(false);
    }
  };

  const backgroundColor = useThemeColor({}, "background");
  const inputBg = useThemeColor(
    { light: "rgba(139, 69, 19, 0.08)", dark: "rgba(139, 69, 19, 0.15)" },
    "background"
  );
  const inputBorder = useThemeColor(
    { light: "rgba(139, 69, 19, 0.2)", dark: "rgba(139, 69, 19, 0.3)" },
    "background"
  );
  return (
    <ThemedView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <ThemedView style={styles.header}>
            <ThemedText style={styles.logo}>💩</ThemedText>
            <ThemedText style={styles.title}>POOPAY</ThemedText>
            <ThemedText style={styles.subtitle}>
              {isSignupMode
                ? "Crée ton compte pour tracker tes cacas !"
                : "Connecte-toi pour tracker tes cacas !"}
            </ThemedText>
          </ThemedView>

          {/* Form */}
          <ThemedView style={styles.form}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: inputBg, borderColor: inputBorder },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="ton.email@example.com"
                placeholderTextColor={useThemeColor(
                  {
                    light: "rgba(139, 69, 19, 0.5)",
                    dark: "rgba(236, 237, 238, 0.5)",
                  },
                  "text"
                )}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Mot de passe</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: inputBg, borderColor: inputBorder },
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder="Au moins 6 caractères..."
                placeholderTextColor={useThemeColor(
                  {
                    light: "rgba(139, 69, 19, 0.5)",
                    dark: "rgba(236, 237, 238, 0.5)",
                  },
                  "text"
                )}
                secureTextEntry
                autoCapitalize="none"
              />
            </ThemedView>

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <ThemedText style={styles.submitButtonText}>
                {isLoading
                  ? "⏳ Chargement..."
                  : isSignupMode
                  ? "🚀 Créer mon compte"
                  : "💩 Se connecter"}
              </ThemedText>
            </TouchableOpacity>

            {/* Switch Mode */}
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsSignupMode(!isSignupMode)}
            >
              <ThemedText style={styles.switchButtonText}>
                {isSignupMode
                  ? "Déjà un compte ? Se connecter"
                  : "Pas de compte ? S'inscrire"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Fun Footer */}
          <ThemedView style={styles.footer}>
            <ThemedText style={styles.footerText}>
              🚽 Prêt(e) à devenir un(e) expert(e) du transit ? 🚽
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
    marginHorizontal: 20,
  },
  form: {
    gap: 20,
    marginBottom: 40,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B4513",
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#8B4513",
  },
  submitButton: {
    backgroundColor: "#8B4513",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#8B4513",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  switchButtonText: {
    color: "#8B4513",
    fontSize: 14,
    opacity: 0.8,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
    fontStyle: "italic",
  },
});
