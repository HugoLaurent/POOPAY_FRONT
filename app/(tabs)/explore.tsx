import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerEmoji}>💩</ThemedText>
          <ThemedText style={styles.title}>Fonctionnalités</ThemedText>
          <ThemedText style={styles.subtitle}>
            Tout ce que POOPAY peut faire pour toi !
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          {/* Suivi Personnel */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionIcon}>📝</ThemedText>
            <ThemedText style={styles.sectionTitle}>Suivi Personnel</ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Enregistre chaque &quot;événement&quot; avec date, heure, et
              détails marrants : consistance, couleur, douleur, humeur... 🎯
            </ThemedText>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionButtonText}>
                📊 Commencer le suivi
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Statistiques */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionIcon}>📈</ThemedText>
            <ThemedText style={styles.sectionTitle}>
              Statistiques Pro
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Fréquence, horaires favoris, moyennes par jour/semaine/mois.
              Deviens un data scientist du caca ! 🤓
            </ThemedText>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionButtonText}>
                📊 Voir mes stats
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Graphiques */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionIcon}>📊</ThemedText>
            <ThemedText style={styles.sectionTitle}>
              Graphiques Sympas
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Histogrammes, camemberts, courbes... Visualise ton transit ! Tes
              intestins n&apos;auront plus de secrets 📉
            </ThemedText>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionButtonText}>
                📈 Explorer les graphiques
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Gamification */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionIcon}>🏆</ThemedText>
            <ThemedText style={styles.sectionTitle}>Badges & Défis</ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Débloque des badges marrants : &quot;3 jours d&apos;affilée&quot;,
              &quot;Full Flush&quot;, &quot;Golden Poop&quot;...
              Collectionne-les tous ! 🎮
            </ThemedText>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionButtonText}>
                🏅 Voir mes badges
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Rappels */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionIcon}>⏰</ThemedText>
            <ThemedText style={styles.sectionTitle}>
              Rappels Intelligents
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Configure des rappels pour ne jamais oublier d&apos;enregistrer.
              Parce que chaque caca compte ! 🔔
            </ThemedText>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionButtonText}>
                ⚙️ Configurer
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Export */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionIcon}>📤</ThemedText>
            <ThemedText style={styles.sectionTitle}>
              Export & Partage
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Exporte tes données ou partage tes stats avec tes amis ! (Oui, on
              sait que tu en as envie 😏)
            </ThemedText>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionButtonText}>
                📱 Partager
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            💩 POOPAY - Parce que tes cacas méritent d&apos;être trackés ! 💩
          </ThemedText>
        </ThemedView>
      </ScrollView>
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
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#8B4513",
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 20,
    gap: 15,
  },
  section: {
    backgroundColor: "rgba(139, 69, 19, 0.05)",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(139, 69, 19, 0.1)",
  },
  sectionIcon: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#8B4513",
  },
  sectionDescription: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: "#8B4513",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#8B4513",
    opacity: 0.8,
  },
});
