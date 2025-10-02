import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { useAppData } from "../../contexts/AppContext";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { ThemedView } from "../../components/themed-view";
import { ThemedText } from "../../components/themed-text";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { user, token, logout } = useAuth();
  const { settings, saveSettings, profile } = useAppData();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const styles = getStyles(colors);

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
    setNotificationsEnabled(settings?.notifications ?? true);
    setDarkMode(settings?.darkMode ?? false);
    setLanguage(settings?.language || "fr");
  }, [settings]);

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
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible de sauvegarder les préférences.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible de se déconnecter.");
    }
  };

  const goToSessions = () => {
    router.push("/session");
  };

  const handleExportData = async () => {
    // Placeholder: implémenter export réel côté serveur
    Alert.alert(
      "Export",
      "Fonction d'export des données demandée (placeholder)."
    );
  };

  const handleClearCache = async () => {
    // Placeholder local clear
    try {
      // ...clear caches, AsyncStorage, etc.
      Alert.alert("Cache", "Cache et données temporaires effacés.");
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible d'effacer le cache.");
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
    } catch (e) {
      console.error("Erreur toggle darkMode:", e);
      Alert.alert("Erreur", "Impossible d'appliquer le thème.");
      // revert local state on error
      setDarkMode((prev) => !prev);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
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
    } catch (e) {
      console.error("Erreur toggle notifications:", e);
      Alert.alert("Erreur", "Impossible de modifier les notifications.");
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
        <View style={styles.headerSection}>
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
              trackColor={{ false: "#ccc", true: colors.primary }}
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
              trackColor={{ false: "#ccc", true: colors.primary }}
            />
          </View>

          <View style={styles.sep} />

          <ThemedText style={styles.fieldLabel}>Langue</ThemedText>
          <View style={styles.langRow}>
            <Pressable
              style={[
                styles.langBtn,
                language === "fr" ? styles.langBtnActive : undefined,
              ]}
              onPress={() => setLanguage("fr")}
            >
              <ThemedText
                style={[
                  styles.langText,
                  language === "fr" ? styles.langTextActive : undefined,
                ]}
              >
                Français
              </ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.langBtn,
                language === "en" ? styles.langBtnActive : undefined,
              ]}
              onPress={() => setLanguage("en")}
            >
              <ThemedText
                style={[
                  styles.langText,
                  language === "en" ? styles.langTextActive : undefined,
                ]}
              >
                English
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.sep} />

          <View style={styles.moreSection}>
            <ThemedText style={styles.moreTitle}>
              Plus d&apos;options
            </ThemedText>

            <Pressable style={styles.moreItem} onPress={goToSessions}>
              <ThemedText style={styles.moreItemText}>Mes sessions</ThemedText>
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
              onPress={() =>
                Alert.alert(
                  "Confidentialité",
                  "Gérer les permissions et la confidentialité (placeholder)"
                )
              }
            >
              <ThemedText style={styles.moreItemText}>
                Confidentialité et permissions
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
        <Pressable
          onPress={handleSave}
          style={[
            styles.primaryButton,
            styles.footerPrimary,
            saving ? styles.disabledBtn : undefined,
          ]}
          disabled={saving}
        >
          <ThemedText style={styles.primaryButtonText}>
            {saving ? "Enregistrement..." : "Sauvegarder"}
          </ThemedText>
        </Pressable>

        <Pressable onPress={handleLogout} style={styles.footerLogout}>
          <ThemedText style={styles.logoutText}>Se déconnecter</ThemedText>
        </Pressable>
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

    headerSection: {
      alignItems: "center",
    },

    appTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.title,
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
      color: "#666",
    },
    sep: {
      height: 12,
    },
    moreSection: {
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#eee",
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
      color: colors.primary,
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

    langRow: {
      flexDirection: "row",
      gap: 8,
    },
    langBtn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: "#f5f5f5",
      marginRight: 8,
    },
    langBtnActive: {
      backgroundColor: colors.bgButtonPrimary,
    },
    langText: {
      color: "#111",
    },
    langTextActive: {
      color: colors.onPrimary,
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
  });
