import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
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

  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const styles = getStyles(colors);
  return (
    <ThemedView style={styles.safeArea}>
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
            <Image
              source={require("../assets/images/logoPoopay.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
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
                value={email}
                onChangeText={setEmail}
                placeholder="ton.email@example.com"
                placeholderTextColor={colors.inputPlaceholder + "80"}
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
                placeholderTextColor={colors.inputPlaceholder + "80"}
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
                  ? "Créer mon compte"
                  : "Se connecter"}
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

function getStyles(colors: any) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
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
    logoImage: {
      width: 96,
      height: 96,
      marginBottom: 8,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.title,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      opacity: 0.8,
      textAlign: "center",
      marginHorizontal: 20,
      color: colors.subtitle,
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
      color: colors.smallTitle,
      marginLeft: 4,
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.inputText,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      minHeight: 48,
    },

    submitButton: {
      backgroundColor: colors.bgButtonPrimary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 10,
      shadowColor: colors.groupCardAdminButton,
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
      color: colors.textButtonPrimary,
      fontSize: 18,
      fontWeight: "bold",
    },
    switchButton: {
      alignItems: "center",
      paddingVertical: 12,
    },
    switchButtonText: {
      color: colors.textSwitchLogin,
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
      color: colors.textInfo,
    },
    // Il n'est pas possible de styler le placeholder via StyleSheet.
    // Utilise la prop `placeholderTextColor` sur le composant TextInput :
    // <TextInput placeholderTextColor={colors.text + "80"} ... />
  });
}
