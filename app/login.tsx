import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);

  const { login, signup } = useAuth();
  const { initializeAppData } = useAppData();

  const handleSubmit = async () => {
    console.log("🎯 HandleSubmit: Début");

    // if (!email || !password) {
    //   Alert.alert("Erreur", "Veuillez remplir tous les champs");
    //   return;
    // }

    console.log("🎯 HandleSubmit: Champs validés");
    setIsLoading(true);

    try {
      let success = false;
      console.log("🎯 HandleSubmit: Mode:", isSignupMode ? "signup" : "login");

      if (isSignupMode) {
        console.log("🎯 HandleSubmit: Appel signup");
        success = await signup(email, password);
      } else {
        console.log("🎯 HandleSubmit: Appel login");
        success = await login("admin@example.com", "admin1234");
      }

      console.log("🎯 HandleSubmit: Résultat:", success);

      if (success) {
        // Charger les données App avant navigation
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          await initializeAppData(token);
        }
        console.log("🎯 HandleSubmit: Navigation vers tabs");
        router.push("/(tabs)");
      } else {
        console.log("🎯 HandleSubmit: Échec, affichage erreur");
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
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
                style={styles.input}
                value={email }
                onChangeText={setEmail}
                placeholder="ton.email@example.com"
                placeholderTextColor="rgba(139, 69, 19, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Mot de passe</ThemedText>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Au moins 6 caractères..."
                placeholderTextColor="rgba(139, 69, 19, 0.5)"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#151718",
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
    backgroundColor: "rgba(139, 69, 19, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(139, 69, 19, 0.3)",
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
