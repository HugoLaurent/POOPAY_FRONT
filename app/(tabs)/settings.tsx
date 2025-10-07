import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Switch,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppContext";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { useNotifications } from "@/hooks/useNotifications";
import * as api from "../../apiService";

export default function SettingsScreen() {
  const { user, token, logout } = useAuth();
  const { settings, saveSettings, profile } = useAppData();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const styles = getStyles(colors);

  // Hook pour les notifications natives
  const {
    permissionStatus,
    requestPermission,
    schedulePushNotification,
    cancelAllScheduledNotifications,
  } = useNotifications();

  const [username, setUsername] = useState<string>(profile?.username || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    settings?.notifications ?? true
  );
  const [darkMode, setDarkMode] = useState<boolean>(
    settings?.darkMode ?? false
  );
  const [language, setLanguage] = useState<string>(settings?.language || "fr");
  const [saving, setSaving] = useState(false);

  // when profile/settings change, update local form
  useEffect(() => {
    setUsername(profile?.username || "");
  }, [profile]);

  useEffect(() => {
    // Synchroniser avec les permissions natives ET les settings de la BDD
    // Si la permission native est refusée, forcer le toggle à false
    const effectiveNotifications = permissionStatus.granted
      ? settings?.notifications ?? true
      : false;

    setNotificationsEnabled(effectiveNotifications);

    // Synchroniser AsyncStorage avec l'état effectif
    AsyncStorage.setItem(
      "notifications_enabled",
      effectiveNotifications ? "true" : "false"
    );

    setDarkMode(settings?.darkMode ?? false);
    setLanguage(settings?.language || "fr");
  }, [settings, permissionStatus.granted]);

  const canSave = useMemo(() => {
    return !!token && !!user;
  }, [token, user]);

  const handleSave = async () => {
    if (!canSave) {
      Alert.alert("Non connecté", "Vous devez être connecté pour sauvegarder.");
      return;
    }
    setSaving(true);
    const newSettings = {
      notifications: notificationsEnabled,
      darkMode,
      language,
      displayName: username,
    };
    try {
      await saveSettings?.(token as string, user!.id, newSettings);
      Alert.alert("Sauvegardé", "Vos préférences ont été enregistrées.");
    } catch (e: any) {
      console.error(e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Impossible de sauvegarder les préférences.";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e: any) {
      console.error(e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Impossible de se déconnecter.";
      Alert.alert("Erreur", errorMessage);
    }
  };

  const goToSessions = () => {
    router.push("/session");
  };

  const handleExportData = async () => {
    if (!canSave) {
      Alert.alert("Non connecté", "Vous devez être connecté pour exporter.");
      return;
    }
    try {
      const res = await api.getAllData(token as string, user!.id);
      Alert.alert("Export des données", JSON.stringify(res, null, 2));
    } catch (e: any) {
      console.error(e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Impossible d'exporter les données.";
      Alert.alert("Erreur", errorMessage);
    }
  };

  const handleClearCache = async () => {
    // Placeholder local clear
    try {
      // ...clear caches, AsyncStorage, etc.
      Alert.alert("Cache", "Cache et données temporaires effacés.");
    } catch (e: any) {
      console.error(e);
      const errorMessage = e?.message || "Impossible d'effacer le cache.";
      Alert.alert("Erreur", errorMessage);
    }
  };

  const handleTestNotification = async () => {
    try {
      // D'abord vérifier/demander la permission
      if (!permissionStatus.granted) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert(
            "Permission requise",
            "Les notifications sont nécessaires pour ce test. Veuillez activer les notifications dans les paramètres.",
            [
              { text: "Annuler", style: "cancel" },
              {
                text: "Ouvrir les paramètres",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return;
        }
      }

      // Envoyer la notification de test
      await schedulePushNotification(
        "🚽 Test POOPAY",
        "Notification de test réussie ! Les notifications locales fonctionnent 🎉",
        3
      );

      Alert.alert(
        "✅ Notification programmée",
        "Vous allez recevoir une notification dans 3 secondes !"
      );
    } catch (e: any) {
      console.error(e);
      const errorMessage =
        e?.message || "Impossible d'envoyer la notification de test.";
      Alert.alert("Erreur", errorMessage);
    }
  };

  // Save toggles immediately (optimistic) so theme and notifications apply
  const handleToggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    if (!canSave) return;
    try {
      const payload = { darkMode: value };
      console.log(
        "[Settings] send saveSettings payload:",
        payload,
        typeof payload
      );
      await saveSettings?.(token as string, user!.id, payload);
    } catch (e: any) {
      console.error("Erreur toggle darkMode:", e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Impossible d'appliquer le thème.";
      Alert.alert("Erreur", errorMessage);
      // revert local state on error
      setDarkMode((prev) => !prev);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    // Sauvegarder immédiatement dans AsyncStorage pour bloquer les notifications
    try {
      await AsyncStorage.setItem(
        "notifications_enabled",
        value ? "true" : "false"
      );
      console.log(`💾 AsyncStorage: notifications_enabled = ${value}`);
    } catch (e) {
      console.error("Erreur sauvegarde AsyncStorage:", e);
    }

    // Si l'utilisateur désactive les notifs, annuler toutes les notifications programmées
    if (!value && cancelAllScheduledNotifications) {
      await cancelAllScheduledNotifications();
    }

    // Si l'utilisateur active les notifs et qu'on n'a pas la permission
    if (value && !permissionStatus.granted) {
      // Créer le callback pour mettre à jour la BDD
      const onPermissionGranted = async () => {
        if (!canSave) return;
        try {
          console.log("💾 [Settings] Mise à jour BDD : notifications = true");
          await saveSettings?.(token as string, user!.id, {
            notifications: true,
          });
          console.log("✅ [Settings] BDD mise à jour avec succès");
        } catch (e) {
          console.error("❌ [Settings] Erreur mise à jour BDD:", e);
        }
      };

      const granted = await requestPermission(onPermissionGranted);
      if (!granted) {
        // Permission refusée, remettre AsyncStorage à false
        await AsyncStorage.setItem("notifications_enabled", "false");
        Alert.alert(
          "Permission refusée",
          "Les notifications sont désactivées. Vous pouvez les activer dans les paramètres de votre téléphone.",
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Ouvrir les paramètres",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return; // Ne pas mettre à jour si pas de permission
      }
    }

    setNotificationsEnabled(value);
    if (!canSave) return;
    try {
      const payload = { notifications: value };
      console.log(
        "[Settings] send saveSettings payload:",
        payload,
        typeof payload
      );
      await saveSettings?.(token as string, user!.id, payload);
    } catch (e: any) {
      console.error("Erreur toggle notifications:", e);
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Impossible de modifier les notifications.";
      Alert.alert("Erreur", errorMessage);
      setNotificationsEnabled((prev) => !prev);
    }
  };

  return (
    <ThemedView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText style={styles.appTitle}>Réglages</ThemedText>
        </View>

        <View style={[styles.card, styles.cardColored]}>
          <ThemedText style={styles.fieldLabel}>Nom d’utilisateur</ThemedText>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Nom d’utilisateur"
            placeholderTextColor={colors.inputPlaceholder}
            style={[styles.input, styles.inputColored]}
            editable={!saving}
          />

          <View style={styles.sep} />

          <View style={styles.toggleRow}>
            <View>
              <ThemedText style={styles.fieldLabel}>Notifications</ThemedText>
              <ThemedText style={styles.hintSmall}>
                Recevoir des notifications push
              </ThemedText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.switchLine, true: colors.switchLine }}
              thumbColor={
                notificationsEnabled ? colors.switchOn : colors.switchOff
              }
              ios_backgroundColor={colors.switchLine}
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <ThemedText style={styles.fieldLabel}>Mode sombre</ThemedText>
              <ThemedText style={styles.hintSmall}>
                Activer le thème sombre
              </ThemedText>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: colors.switchLine, true: colors.switchLine }}
              thumbColor={darkMode ? colors.switchOn : colors.switchOff}
              ios_backgroundColor={colors.switchLine}
            />
          </View>

          <View style={styles.moreSection}>
            <ThemedText style={styles.moreTitle}>
              Plus d&apos;options
            </ThemedText>

            <Pressable style={styles.moreItem} onPress={goToSessions}>
              <ThemedText style={styles.moreItemText}>Mes sessions</ThemedText>
            </Pressable>

            <Pressable
              style={[styles.moreItem, styles.testNotifButton]}
              onPress={handleTestNotification}
            >
              <ThemedText style={[styles.moreItemText, styles.testNotifText]}>
                🔔 Tester une notification
              </ThemedText>
            </Pressable>

            <Pressable style={styles.moreItem} onPress={handleExportData}>
              <ThemedText style={styles.moreItemText}>
                Exporter mes données
              </ThemedText>
            </Pressable>

            <Pressable style={styles.moreItem} onPress={handleClearCache}>
              <ThemedText style={styles.moreItemText}>
                Effacer le cache
              </ThemedText>
            </Pressable>

            <Pressable
              style={styles.moreItem}
              onPress={() => router.push("/privacy")}
            >
              <ThemedText style={styles.moreItemText}>
                Confidentialité et permissions
              </ThemedText>
            </Pressable>

            <Pressable
              style={styles.moreItem}
              onPress={() => router.push("/legal")}
            >
              <ThemedText style={styles.moreItemText}>
                Mentions légales et santé
              </ThemedText>
            </Pressable>

            <Pressable
              style={styles.moreItem}
              onPress={() =>
                Alert.alert("Abonnement", "Gérer l'abonnement (placeholder)")
              }
            >
              <ThemedText style={styles.moreItemText}>
                Gérer l&apos;abonnement
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView
        edges={["bottom"]}
        style={[styles.footer, styles.footerSafeArea]}
      >
        <View style={styles.twoButtonRowFooter}>
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={({ pressed }) => [
              styles.buttonHalf,
              { backgroundColor: colors.bgButtonPrimary },
              pressed && styles.buttonPressed,
              { marginRight: 8 },
            ]}
          >
            <ThemedText
              style={[
                styles.fullWidthButtonText,
                { color: colors.textButtonPrimary },
              ]}
            >
              {saving ? "Enregistrement..." : "Sauvegarder"}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.buttonHalf,
              { backgroundColor: colors.background },
              pressed && styles.buttonPressed,
              { borderWidth: 1, borderColor: colors.bgButtonPrimary },
            ]}
          >
            <ThemedText
              style={[
                styles.fullWidthButtonText,
                { color: colors.bgButtonPrimary },
              ]}
            >
              Se déconnecter
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    // Safe area and container (match other pages)
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: "transparent",
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },

    appTitle: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.title,
      marginTop: 2,
      marginBottom: 10,
      lineHeight: 34,
    },

    card: {
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      // shadow for iOS
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      // elevation for Android
      elevation: 3,
    },
    cardColored: {
      backgroundColor: colors.groupCardBg,
      borderColor: colors.border,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 6,
    },
    hintSmall: {
      fontSize: 12,
      color: colors.textDivers,
    },
    sep: {
      height: 12,
    },
    moreSection: {
      marginTop: 12,

      paddingTop: 12,
    },
    moreTitle: {
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 8,
    },
    moreItem: {
      paddingVertical: 10,
    },
    moreItemText: {
      fontSize: 15,
      color: colors.textDivers,
    },
    toggleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    label: {
      fontSize: 14,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 10,
      borderRadius: 8,
    },
    inputColored: {
      backgroundColor: colors.inputBackground,
      borderColor: colors.inputBorder,
      color: colors.inputText,
    },

    saveBtn: {
      backgroundColor: colors.bgButtonPrimary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    saveText: {
      color: "#fff",
      fontWeight: "700",
    },
    disabledBtn: {
      opacity: 0.6,
    },
    logoutBtn: {
      alignItems: "center",
    },
    logoutText: {
      color: "#c33",
    },

    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      // ensure some space above system bottom inset
      paddingBottom: 16,
    },

    // safe area wrapper for footer to avoid buttons being too low on devices
    footerSafeArea: {
      backgroundColor: "transparent",
      // on some devices the safe area adds inset; add small marginTop to separate from content
      marginTop: 8,
    },
    primaryButton: {
      backgroundColor: colors.bgButtonPrimary,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    primaryButtonText: {
      color: colors.textButtonPrimary,
      fontSize: 16,
      fontWeight: "700",
    },
    footerPrimary: {
      flex: 1,
      marginRight: 12,
    },
    footerLogout: {
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    twoButtonRowFooter: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    buttonHalf: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    fullWidthButtonText: { color: "#fff", fontWeight: "700", fontSize: 18 },
    twoButtonRowNarrow: {
      marginTop: 8,
    },
    twoButtonRowFullWidth: {
      justifyContent: "space-between",
      width: "100%",
    },
    langBtnActive: {
      backgroundColor: colors.bgButtonPrimary,
      paddingHorizontal: 0,
    },
    langBtnInactive: {
      borderWidth: 1,
      borderColor: colors.bgButtonPrimary,
      paddingHorizontal: 0,
    },
    langTextActive: { color: colors.textButtonPrimary },
    langTextInactive: { color: colors.bgButtonPrimary },
    langButton: {
      width: "48%",
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    testNotifButton: {
      backgroundColor: colors.primary + "15", // 15 = opacity en hexa
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    testNotifText: {
      color: colors.primary,
      fontWeight: "600",
    },
  });
