import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: "group_invite" | "challenge" | "achievement" | "info";
  related_id?: string;
  is_read?: boolean;
}

interface NotificationListModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onAccept: (notificationId: string) => void;
  onReject: (notificationId: string) => void;
}

export const NotificationListModal: React.FC<NotificationListModalProps> = ({
  visible,
  onClose,
  notifications,
  onAccept,
  onReject,
}) => {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const styles = getStyles(colors);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "group_invite":
        return "👥";
      case "challenge":
        return "🏆";
      case "achievement":
        return "🎯";
      case "info":
        return "ℹ️";
      default:
        return "🔔";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </Pressable>
          </View>

          {/* Liste des notifications */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyIcon}>🔔</ThemedText>
                <ThemedText style={styles.emptyText}>
                  Aucune notification
                </ThemedText>
              </View>
            ) : (
              notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <View style={styles.notificationHeader}>
                    <View style={styles.notificationTitleRow}>
                      <ThemedText style={styles.notificationIcon}>
                        {getNotificationIcon(notification.type)}
                      </ThemedText>
                      <ThemedText style={styles.notificationTitle}>
                        {notification.title}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.notificationTime}>
                      {formatTimestamp(notification.timestamp)}
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.notificationMessage}>
                    {notification.message}
                  </ThemedText>

                  {/* Boutons d'action pour les invitations */}
                  {notification.type === "group_invite" && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.button, styles.rejectButton]}
                        onPress={() => onReject(notification.id)}
                      >
                        <ThemedText style={styles.rejectButtonText}>
                          Refuser
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.acceptButton]}
                        onPress={() => onAccept(notification.id)}
                      >
                        <ThemedText style={styles.acceptButtonText}>
                          Accepter
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContainer: {
      maxHeight: "80%",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(139, 69, 19, 0.1)",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.title,
    },
    closeButton: {
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
    },
    closeButtonText: {
      fontSize: 24,
      color: colors.text,
      opacity: 0.6,
    },
    scrollView: {
      paddingHorizontal: 20,
    },
    emptyContainer: {
      paddingVertical: 60,
      alignItems: "center",
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 12,
      opacity: 0.3,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.5,
    },
    notificationItem: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(139, 69, 19, 0.1)",
    },
    notificationHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    notificationTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    notificationIcon: {
      fontSize: 20,
      marginRight: 8,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.title,
      flex: 1,
    },
    notificationTime: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.5,
      marginLeft: 8,
    },
    notificationMessage: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginBottom: 12,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
    },
    button: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    acceptButton: {
      backgroundColor: colors.bgButtonPrimary,
    },
    acceptButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
    },
    rejectButton: {
      backgroundColor: "rgba(139, 69, 19, 0.1)",
    },
    rejectButtonText: {
      color: colors.text,
      fontWeight: "600",
      fontSize: 14,
    },
  });
