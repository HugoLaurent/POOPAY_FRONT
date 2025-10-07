import React from "react";
import { View, StyleSheet, Modal, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { useNotifications } from "@/hooks/useNotifications";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const PERMISSION_ASKED_KEY = "notification_permission_asked";

interface NotificationPermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onPermissionGranted?: () => Promise<void>;
}

export function NotificationPermissionModal({
  visible,
  onClose,
  onPermissionGranted,
}: NotificationPermissionModalProps) {
  const { requestPermission, isExpoGo } = useNotifications();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  const handleAllow = async () => {
    await requestPermission(onPermissionGranted);
    await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "true");
    onClose();
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "true");
    onClose();
  };

  // Ne pas afficher dans Expo Go
  if (isExpoGo) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <ThemedText style={styles.title}>
            Activer les notifications ?
          </ThemedText>

          <ThemedText
            style={[styles.description, { color: colors.textDivers }]}
          >
            Recevez des rappels pour vos sessions et restez informé de vos
            progrès quotidiens
          </ThemedText>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleAllow}
            >
              <ThemedText style={[styles.buttonText, styles.primaryButtonText]}>
                Activer
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.secondaryButton,
                { borderColor: colors.border },
              ]}
              onPress={handleSkip}
            >
              <ThemedText style={[styles.buttonText, { color: colors.text }]}>
                Plus tard
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

export async function shouldShowNotificationPermissionModal(): Promise<boolean> {
  try {
    // Ne pas afficher dans Expo Go
    const isExpoGo = Constants.appOwnership === "expo";
    if (isExpoGo) {
      return false;
    }

    // Vérifier si la permission est déjà accordée
    const { status } = await Notifications.getPermissionsAsync();

    // Si la permission est déjà accordée, ne pas afficher le modal
    if (status === "granted") {
      return false;
    }

    // Sinon, vérifier si on a déjà demandé (et que l'utilisateur a dit "Plus tard")
    const hasAsked = await AsyncStorage.getItem(PERMISSION_ASKED_KEY);
    return hasAsked !== "true";
  } catch {
    return true;
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#fff",
  },
});
