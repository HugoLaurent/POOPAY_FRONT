import GroupRankingBlock from "@/components/ui/GroupRankingBlock";
import StatsBlock from "@/components/ui/StatsBlock";
import { useAppData } from "@/contexts/AppContext";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { ThemedView } from "@/components/themed-view";

// --- HELPERS ---
function parseSessionDate(session: { start_time?: string }) {
  return session.start_time ? new Date(session.start_time) : null;
}

function getStats(sessionsArr: any[]) {
  let sessions = sessionsArr.length;
  let amount = 0;
  let time = 0;
  sessionsArr.forEach(
    (s: { amount_earned?: string | number; duration_minutes?: number }) => {
      let earned = 0;
      if (typeof s.amount_earned === "string") {
        earned = parseFloat(s.amount_earned);
      } else if (typeof s.amount_earned === "number") {
        earned = s.amount_earned;
      }
      if (isNaN(earned)) earned = 0;
      amount += earned;
      time += s.duration_minutes ? s.duration_minutes / 60 : 0;
    }
  );
  return {
    sessions,
    amount: Math.round(amount),
    time: Math.round(time * 10) / 10,
  };
}

export default function HomeScreen() {
  const { profile, groups, sessions } = useAppData();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const now = new Date();

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

  const styles = getStyles(theme);

  return (
    <ThemedView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>
            Bienvenue {profile?.username || "utilisateur"} sur
          </Text>
          <Text style={styles.appTitle}>POOPAY</Text>
          <Text style={styles.subtitle}>
            L&apos;app la plus fun pour traquer ses cacas ! 🚽
          </Text>
        </View>

        {/* Calendrier 7 jours */}
        <View style={styles.calendarRow}>
          {last7Days.map((date, idx) => {
            const isActive = idx === selectedDay;
            return (
              <View key={idx} style={{ flex: 1, alignItems: "center" }}>
                <Text style={styles.calendarDayLabel}>
                  {daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                </Text>
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
                  <Text
                    style={[
                      styles.calendarDayText,
                      isActive
                        ? styles.calendarDayTextActive
                        : styles.calendarDayTextInactive,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* Stats jour sélectionné */}
        <Text style={styles.statsBlockTitle}>{getDayTitle()}</Text>
        <StatsBlock stats={dayStats} />

        {/* Stats semaine */}
        <Text style={styles.statsBlockTitle}>Cette semaine</Text>
        <StatsBlock stats={weeklyStats} />

        {/* Stats mois */}
        <Text style={styles.statsBlockTitle}>Ce mois-ci</Text>
        <StatsBlock
          stats={monthlyStats}
          labels={["Sessions", "Gagné", "Temps passé"]}
        />

        {/* Séparation et titre groupes */}
        <View style={styles.groupTitleSection}>
          <View style={styles.separator} />
          <Text style={styles.groupTitle}>Classement de la semaine </Text>
        </View>

        {/* Liste des groupes */}
        {groups.map((group, idx) => (
          <GroupRankingBlock
            key={
              group.id !== undefined ? String(group.id) : group.name + "-" + idx
            }
            group={group}
            profile={profile}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const getStyles = (theme: "light" | "dark") => {
  const colors = Colors[theme];
  return StyleSheet.create({
    safeArea: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: "transparent",
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    headerSection: { alignItems: "center", marginBottom: 10 },
    welcomeText: {
      fontSize: 18,
      marginBottom: 2,
      textAlign: "center",
      color: colors.text,
    },
    appTitle: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
      color: colors.primary,
    },
    subtitle: {
      fontSize: 14,
      textAlign: "center",
      marginBottom: 10,
      color: colors.text,
      opacity: 0.7,
    },
    calendarRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
      marginTop: 18,
    },
    calendarDayLabel: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 2,
    },
    calendarDayButton: {
      borderRadius: 16,
      paddingVertical: 6,
      width: 32,
      height: 32,
      marginBottom: 2,
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      zIndex: 10,
    },
    calendarDayButtonInactive: { backgroundColor: `${colors.primary}20` },
    calendarDayButtonActive: {
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: colors.primary,
      shadowColor: colors.primary,
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
    calendarDayTextActive: { color: colors.onPrimary, fontWeight: "bold" },
    calendarDayTextInactive: { color: colors.primary, fontWeight: "normal" },
    statsBlockTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.primary,
      marginLeft: 4,
      marginBottom: 8,
    },
    groupTitleSection: {
      width: "100%",
      marginVertical: 24,
      alignItems: "flex-start",
    },
    separator: {
      height: 1,
      backgroundColor: colors.primary,
      width: "100%",
      marginBottom: 8,
      opacity: 0.2,
    },
    groupTitle: {
      fontWeight: "bold",
      fontSize: 18,
      color: colors.primary,
      marginBottom: 8,
    },
  });
};
