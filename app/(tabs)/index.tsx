import { useAppData } from "@/contexts/AppContext";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { profile, groups, sessions } = useAppData();

  // Date courante
  const now = new Date();

  // Helper pour parser la date session
  function parseSessionDate(session: { start_time?: string }) {
    return session.start_time ? new Date(session.start_time) : null;
  }

  // Filtrer sessions semaine (début lundi)
  const day = now.getDay() === 0 ? 6 : now.getDay() - 1; // Lundi = 0
  const startOfWeekMonday = new Date(now);
  startOfWeekMonday.setDate(now.getDate() - day);
  startOfWeekMonday.setHours(0, 0, 0, 0);

  const weekSessions = sessions.filter((s: { start_time?: string }) => {
    const d = parseSessionDate(s);
    return d && d >= startOfWeekMonday && d <= now;
  });

  // Filtrer sessions mois
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthSessions = sessions.filter((s: { start_time?: string }) => {
    const d = parseSessionDate(s);
    return d && d >= startOfMonth && d <= now;
  });

  // Calculer stats
  function getStats(sessionsArr: any[]) {
    let sessions = sessionsArr.length;
    let amount = 0;
    let time = 0;
    sessionsArr.forEach(
      (s: { amount_earned?: string | number; duration_minutes?: number }) => {
        // Correction : amount_earned peut être string (ex: "2.50")
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
      time: Math.round(time * 10) / 10, // 1 décimale
    };
  }

  const weeklyStats = getStats(weekSessions);
  const monthlyStats = getStats(monthSessions);
  // --- LOGIQUE CALENDRIER 7 JOURS ---
  // À placer juste avant le return, après toutes les déclarations nécessaires
  const [selectedDay, setSelectedDay] = React.useState(6); // 6 = aujourd'hui (dernier à droite)
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

  // Fonction de déconnexion supprimée

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        colorScheme === "dark"
          ? { backgroundColor: "#151718" }
          : { backgroundColor: "#f5f5f5" },
      ]}
      edges={["top"]}
    >
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
            L&apos;app la plus fun pour traquerjkj tes cacas ! 🚽
          </Text>
          {/* Bouton de déconnexion supprimé */}
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
                <Text
                  style={[
                    styles.calendarDayButton,
                    isActive && styles.calendarDayButtonActive,
                  ]}
                  onPress={() => setSelectedDay(idx)}
                >
                  {date.getDate()}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Stats du jour sélectionné */}
        <View style={styles.statsBlock}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{dayStats.sessions}</Text>
            <Text style={styles.statsLabel}>Sessions (jour)</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{dayStats.amount}€</Text>
            <Text style={styles.statsLabel}>Gagné (jour)</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{dayStats.time}h</Text>
            <Text style={styles.statsLabel}>Temps passé (jour)</Text>
          </View>
          {/* SUPPRESSION de la balise </View> superflue ici */}
        </View>

        {/* Bloc semaine */}
        <View style={styles.statsBlock}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{weeklyStats.sessions}</Text>
            <Text style={styles.statsLabel}>Sessions</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{weeklyStats.amount}€</Text>
            <Text style={styles.statsLabel}>Gagné</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{weeklyStats.time}h</Text>
            <Text style={styles.statsLabel}>Temps passé</Text>
          </View>
        </View>

        {/* Bloc mois */}
        <View style={styles.statsBlock}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{monthlyStats.sessions}</Text>
            <Text style={styles.statsLabel}>Sessions (mois)</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{monthlyStats.amount}€</Text>
            <Text style={styles.statsLabel}>Gagné (mois)</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{monthlyStats.time}h</Text>
            <Text style={styles.statsLabel}>Temps passé (mois)</Text>
          </View>
        </View>

        {/* Séparation et titre groupes */}
        <View style={styles.groupTitleSection}>
          <View style={styles.separator} />
          <Text style={styles.groupTitle}>Vos Groupes</Text>
        </View>

        {/* Liste des groupes */}
        {groups.map((group, idx) => (
          <View key={group.name + idx} style={styles.groupBlock}>
            <View style={{ flex: 1 }}>
              <Text style={styles.groupName}>{group.name}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.groupPlace}>#{group.userPlace}</Text>
              <Text style={styles.groupLeader}>Leader : {group.leader}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calendarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 18,
    paddingHorizontal: 8,
  },
  calendarDayLabel: {
    fontSize: 12,
    color: "#8B4513",
    opacity: 0.7,
    marginBottom: 2,
  },
  calendarDayButton: {
    fontSize: 18,
    color: "#8B4513",
    backgroundColor: "rgba(139,69,19,0.08)",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 0,
    width: 32,
    textAlign: "center",
    marginBottom: 2,
    overflow: "hidden",
  },
  calendarDayButtonActive: {
    backgroundColor: "#8B4513",
    color: "white",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#8B4513",
    shadowColor: "#8B4513",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#151718",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 0,
  },
  welcomeText: {
    fontSize: 13,
    opacity: 0.8,
    marginBottom: 2,
    textAlign: "center",
    color: "#8B4513",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#8B4513",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 10,
    color: "#ECEDEE",
  },
  logoutButton: {
    backgroundColor: "#8B4513",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#8B4513",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsBlock: {
    marginVertical: 18,
    padding: 24,
    backgroundColor: "rgba(139, 69, 19, 0.05)",
    borderRadius: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139, 69, 19, 0.1)",
  },
  statsItem: {
    alignItems: "center",
    flex: 1,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
  },
  statsLabel: {
    color: "#ECEDEE",
    fontSize: 13,
    opacity: 0.8,
  },
  groupTitleSection: {
    width: "100%",
    marginVertical: 24,
    alignItems: "flex-start",
  },
  separator: {
    height: 1,
    backgroundColor: "#8B4513",
    width: "100%",
    marginBottom: 8,
    opacity: 0.2,
  },
  groupTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#8B4513",
    marginBottom: 8,
  },
  groupBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(139, 69, 19, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(139, 69, 19, 0.1)",
  },
  groupName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#8B4513",
  },
  groupPlace: {
    color: "#8B4513",
    fontWeight: "bold",
    fontSize: 16,
  },
  groupLeader: {
    color: "#ECEDEE",
    fontSize: 13,
    opacity: 0.8,
  },
});
