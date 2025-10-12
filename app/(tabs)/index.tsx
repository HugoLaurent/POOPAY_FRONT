import GroupRankingBlock from "@/components/ui/GroupRankingBlock";
import StatsBlock from "@/components/ui/StatsBlock";
import {
  NotificationPermissionModal,
  shouldShowNotificationPermissionModal,
} from "@/components/ui/NotificationPermissionModal";
import { NotificationBadge } from "@/components/ui/NotificationBadge";
import { NotificationListModal } from "@/components/ui/NotificationListModal";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useAppData } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

// --- HELPERS ---
function parseSessionDate(session: { start_time?: string }) {
  return session.start_time ? new Date(session.start_time) : null;
}

function getStats(sessionsArr: any[]) {
  let sessions = sessionsArr.length;
  let amount = 0;
  let time = 0;
  sessionsArr.forEach(
    (s: { amount_earned?: string | number; duration_seconds?: number }) => {
      let earned = 0;
      if (typeof s.amount_earned === "string") {
        earned = parseFloat(s.amount_earned);
      } else if (typeof s.amount_earned === "number") {
        earned = s.amount_earned;
      }
      if (isNaN(earned)) earned = 0;
      amount += earned;
      time += s.duration_seconds ? (s.duration_seconds || 0) / 3600 : 0;
    }
  );
  return {
    sessions,
    amount: Math.round(amount * 100) / 100,
    time: Math.round(time * 10) / 10,
  };
}

export default function HomeScreen() {
  const { profile, groups, sessions, saveSettings } = useAppData();
  const { token } = useAuth();

  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const styles = getStyles(colors);
  const now = new Date();

  // État pour la modal de permission des notifications
  const [showPermissionModal, setShowPermissionModal] = React.useState(false);

  // État pour la modal de liste des notifications
  const [showNotificationList, setShowNotificationList] = React.useState(false);

  // Utiliser le hook pour les notifications en temps réel
  const { notifications, acceptGroupInvitation, rejectGroupInvitation } =
    useRealtimeNotifications();

  // Callback pour mettre à jour la BDD quand les notifications sont activées
  const handleNotificationPermissionGranted = React.useCallback(async () => {
    if (!token || !profile?.id || !saveSettings) return;

    try {
      console.log("💾 Mise à jour BDD : notifications = true");
      await saveSettings(token, profile.id, { notifications: true });
      console.log("✅ BDD mise à jour avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de la BDD:", error);
    }
  }, [token, profile?.id, saveSettings]);

  // Gérer l'acceptation d'une notification
  const handleAcceptNotification = React.useCallback(
    async (notificationId: string) => {
      console.log(
        "🔍 handleAcceptNotification appelée avec notificationId:",
        notificationId
      );
      console.log("📋 Liste des notifications disponibles:", notifications);

      // Trouver la notification pour obtenir le related_id
      const notification = notifications.find((n) => n.id === notificationId);
      console.log("🎯 Notification trouvée:", notification);

      if (!notification) {
        console.error("❌ Notification non trouvée dans la liste");
        return;
      }

      if (notification.type !== "group_invite") {
        console.error("❌ Type de notification incorrect:", notification.type);
        return;
      }

      if (!notification.related_id) {
        console.error("❌ Pas de related_id dans la notification");
        return;
      }

      console.log(
        "✅ Toutes les validations passées, appel de acceptGroupInvitation"
      );
      const success = await acceptGroupInvitation(
        notificationId,
        notification.related_id
      );
      console.log("✅ Réponse du serveur:", success);

      if (success) {
        console.log("✅ Invitation acceptée avec succès");
      }
    },
    [notifications, acceptGroupInvitation]
  );

  // Gérer le refus d'une notification
  const handleRejectNotification = React.useCallback(
    async (notificationId: string) => {
      console.log("Notification refusée:", notificationId);

      // Trouver la notification pour obtenir le related_id
      const notification = notifications.find((n) => n.id === notificationId);
      if (
        notification &&
        notification.type === "group_invite" &&
        notification.related_id
      ) {
        const success = await rejectGroupInvitation(
          notificationId,
          notification.related_id
        );
        if (success) {
          console.log("✅ Invitation refusée avec succès");
        }
      }
    },
    [notifications, rejectGroupInvitation]
  );

  // Vérifier si on doit afficher la modal au premier chargement
  React.useEffect(() => {
    const checkPermissionModal = async () => {
      const shouldShow = await shouldShowNotificationPermissionModal();
      if (shouldShow) {
        // Attendre un peu pour que l'utilisateur voie d'abord l'écran
        setTimeout(() => setShowPermissionModal(true), 2000);
      }
    };
    checkPermissionModal();
  }, []);

  // Semaine (lundi 00:00 -> dimanche 23:59:59.999)
  const day = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const startOfWeekMonday = new Date(now);
  startOfWeekMonday.setDate(now.getDate() - day);
  startOfWeekMonday.setHours(0, 0, 0, 0);
  const endOfWeekSunday = new Date(startOfWeekMonday);
  endOfWeekSunday.setDate(startOfWeekMonday.getDate() + 6);
  endOfWeekSunday.setHours(23, 59, 59, 999);
  const weekSessions = sessions.filter((s: { start_time?: string }) => {
    const d = parseSessionDate(s);
    return d && d >= startOfWeekMonday && d <= endOfWeekSunday;
  });
  // Mois
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthSessions = sessions.filter((s: { start_time?: string }) => {
    const d = parseSessionDate(s);
    return d && d >= startOfMonth && d <= now;
  });
  const weeklyStats = getStats(weekSessions);
  const monthlyStats = getStats(monthSessions);

  // Calendrier 7 jours
  const [selectedDay, setSelectedDayRaw] = React.useState(6);
  const setSelectedDay = (idx: number) => {
    if (idx < 0) setSelectedDayRaw(0);
    else if (idx > 6) setSelectedDayRaw(6);
    else setSelectedDayRaw(idx);
  };
  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return d;
  });
  const selectedDate = last7Days[selectedDay];
  const daySessions = sessions.filter((s: { start_time?: string }) => {
    const d = parseSessionDate(s);
    return (
      d &&
      d.getFullYear() === selectedDate.getFullYear() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getDate() === selectedDate.getDate()
    );
  });
  const dayStats = getStats(daySessions);

  // Format dynamique du titre du jour
  const getDayTitle = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    if (selected.getTime() === today.getTime()) {
      return "Aujourd'hui";
    } else {
      const mois = [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
      ];
      return `${selected.getDate()} ${
        mois[selected.getMonth()]
      } ${selected.getFullYear()}`;
    }
  };

  return (
    <ThemedView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <ThemedText style={styles.appTitle}>{"POOPAY"}</ThemedText>
          <View style={styles.notificationBadgeContainer}>
            <NotificationBadge
              count={notifications.length}
              onPress={() => setShowNotificationList(true)}
            />
          </View>
        </View>
        <ThemedText style={styles.subtitle}>
          Combien tu gagnes aux toilettes auqsd travail ?
        </ThemedText>

        {/* Calendrier 7 jours */}
        <View style={styles.calendarRow}>
          {last7Days.map((date, idx) => {
            const isActive = idx === selectedDay;
            return (
              <View key={idx} style={styles.dayCell}>
                <ThemedText style={styles.calendarDayLabel}>
                  {daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                </ThemedText>
                <Pressable
                  style={({ pressed }) => [
                    styles.calendarDayButton,
                    isActive
                      ? styles.calendarDayButtonActive
                      : styles.calendarDayButtonInactive,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => setSelectedDay(idx)}
                >
                  <ThemedText
                    style={[
                      styles.calendarDayText,
                      styles.calendarDayTextInner,
                      isActive
                        ? styles.calendarDayTextActive
                        : styles.calendarDayTextInactive,
                    ]}
                  >
                    {date.getDate()}
                  </ThemedText>
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* Titre stats jour dynamique */}
        <ThemedText style={styles.statsBlockTitle}>{getDayTitle()}</ThemedText>
        {/* Stats du jour sélectionné */}

        <StatsBlock stats={dayStats} />

        {/* Semaine */}
        <ThemedText style={styles.statsBlockTitle}>Cette semaine</ThemedText>
        <StatsBlock stats={weeklyStats} />

        {/* Mois */}
        <ThemedText style={styles.statsBlockTitle}>Ce mois-ci</ThemedText>
        <StatsBlock
          stats={monthlyStats}
          labels={["Sessions", "Gagné", "Temps passé"]}
        />

        {/* Séparation et titre groupes */}
        <View style={styles.groupTitleSection}>
          <ThemedText style={styles.groupTitle}>
            Classement de la semaine{" "}
          </ThemedText>
        </View>

        {/* Liste des groupes harmonisée */}
        {groups.map((group, idx) => (
          <GroupRankingBlock
            key={group.name + idx}
            group={group}
            profile={profile}
          />
        ))}
      </ScrollView>

      {/* Modal de demande de permission pour les notifications */}
      <NotificationPermissionModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onPermissionGranted={handleNotificationPermissionGranted}
      />

      {/* Modal de liste des notifications */}
      <NotificationListModal
        visible={showNotificationList}
        onClose={() => setShowNotificationList(false)}
        notifications={notifications}
        onAccept={handleAcceptNotification}
        onReject={handleRejectNotification}
      />
    </ThemedView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    // Safe area
    safeArea: {
      flex: 1,
      paddingTop: 10,
    },

    // Container
    container: {
      flex: 1,
      backgroundColor: "transparent",
      paddingHorizontal: 20,
      paddingTop: 10,
    },

    // Header
    headerSection: {
      alignItems: "center",
      position: "relative",
    },
    notificationBadgeContainer: {
      position: "absolute",
      right: 0,
      top: 0,
    },
    welcomeText: {
      fontSize: 18,
      marginBottom: 2,
      textAlign: "center",
      color: colors.title,
    },
    usernameTitle: {
      fontSize: 18,
      fontWeight: "bold",

      textTransform: "capitalize",
      color: colors.primary,
    },
    appTitle: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      color: colors.title,
    },
    subtitle: {
      fontSize: 13,
      opacity: 0.85,
      textAlign: "center",
      color: colors.subtitle,
    },

    // Calendrier 7 jours
    calendarRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 20,
    },
    calendarDayLabel: {
      fontSize: 12,
      color: colors.textDivers,
      opacity: 0.7,
      marginBottom: 2,
    },
    calendarDayButton: {
      borderRadius: 14,
      paddingVertical: 4,
      width: 30,
      height: 30,
      marginBottom: 10,
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      zIndex: 10,
    },
    calendarDayButtonInactive: {
      backgroundColor: "rgba(139,69,19,0.08)",
    },
    calendarDayButtonActive: {
      backgroundColor: colors.bgButtonPrimary,

      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    calendarDayText: {
      fontSize: 18,
      textAlign: "center",
      backgroundColor: "transparent",
    },
    calendarDayTextInner: {
      textAlign: "center",
      textAlignVertical: "center",
      width: 32,
      height: 32,
      lineHeight: 32,
    },
    calendarDayTextActive: {
      color: "white",
      fontWeight: "bold",
    },
    calendarDayTextInactive: {
      color: colors.textDivers,
      fontWeight: "normal",
    },

    // Titres des blocs de stats
    statsBlockTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.title,
      marginLeft: 4,
      marginBottom: 4,
    },

    // Bloc de statistiques
    statsBlock: {
      backgroundColor: "rgba(139, 69, 19, 0.05)",
      borderRadius: 12,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(139, 69, 19, 0.1)",
      padding: 6, // padding réduit
    },

    statsItem: {
      alignItems: "center",
      flex: 1,
    },
    statsValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textDivers,
    },
    statsLabel: {
      color: colors.text,
      fontSize: 13,
      opacity: 0.8,
    },

    // Section des groupes
    groupTitleSection: {
      width: "100%",
      marginVertical: 14,
      marginBottom: 7,
      alignItems: "flex-start",
    },

    groupTitle: {
      fontWeight: "bold",
      fontSize: 17,
      color: colors.title,
      marginBottom: 2,
    },
    groupBlock: {
      display: "none",
    },
    groupBlockHarmonized: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    groupName: {
      fontWeight: "bold",
      fontSize: 16,
      color: colors.primary,
      marginLeft: 4,
    },
    groupMedal: {
      fontSize: 18,
      marginRight: 4,
    },
    groupMedalLabel: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "bold",
      marginRight: 8,
    },
    groupLeaderName: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "normal",
    },
    contentContainer: { paddingBottom: 16 },
    dayCell: { flex: 1, alignItems: "center", paddingVertical: 2 },
    groupPlace: {
      color: colors.primary,
      fontWeight: "bold",
      fontSize: 16,
    },
    groupLeader: {
      color: colors.text,
      fontSize: 13,
      opacity: 0.8,
    },
  });
