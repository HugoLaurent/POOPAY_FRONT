import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.container}>
        {/* TOP SECTION - Header + Stats */}
        <ThemedView style={styles.topSection}>
          {/* Header Section */}
          <ThemedView style={styles.headerSection}>
            <ThemedText style={styles.welcomeText}>Bienvenue sur</ThemedText>
            <ThemedText style={styles.appTitle}>POOPAY</ThemedText>
            <ThemedText style={styles.subtitle}>
              L&apos;app la plus fun pour traquer tes cacas ! 🚽
            </ThemedText>
          </ThemedView>

          {/* Stats Quick Preview */}
          <ThemedView style={styles.quickStats}>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statNumber}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Aujourd&apos;hui</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statNumber}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Cette semaine</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statNumber}>🏆</ThemedText>
              <ThemedText style={styles.statLabel}>Streak</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* BOTTOM SECTION - Rest of Content */}
        <ThemedView style={styles.bottomSection}>
          {/* Features Preview */}
          <ThemedView style={styles.featuresSection}>
            <ThemedView style={styles.featureCard}>
              <ThemedText style={styles.featureIcon}>📊</ThemedText>
              <ThemedText style={styles.featureTitle}>
                Suivi personnalisé
              </ThemedText>
              <ThemedText style={styles.featureText}>
                Note tes événements avec tous les détails
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.featureCard}>
              <ThemedText style={styles.featureIcon}>🎮</ThemedText>
              <ThemedText style={styles.featureTitle}>
                Badges & Défis
              </ThemedText>
              <ThemedText style={styles.featureText}>
                Débloque des badges marrants !
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Action Section - Tout en bas */}
          <ThemedView style={styles.actionSection}>
            <TouchableOpacity style={styles.primaryButton}>
              <ThemedText style={styles.buttonText}>
                � Nouveau Caca !
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>
                📈 Voir mes stats
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topSection: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(139, 69, 19, 0.1)",
  },
  bottomSection: {
    flex: 1,
    paddingTop: 20,
    justifyContent: "space-between",
  },
  headerSection: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 0,
  },
  poopEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 11,
    opacity: 0.8,
    marginBottom: 2,
    textAlign: "center",
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
    color: "#8B4513",
  },
  subtitle: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 10,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(139, 69, 19, 0.1)",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139, 69, 19, 0.2)",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    opacity: 0.7,
    textAlign: "center",
  },
  featuresSection: {
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: "rgba(139, 69, 19, 0.05)",
    padding: 15,
    borderRadius: 14,
    marginBottom: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139, 69, 19, 0.15)",
  },
  featureIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 3,
    color: "#8B4513",
  },
  featureText: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: "center",
  },
  actionSection: {
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: "#8B4513",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#8B4513",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#8B4513",
  },
  secondaryButtonText: {
    color: "#8B4513",
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginBottom: 15,
  },
  footerText: {
    fontSize: 11,
    opacity: 0.6,
    textAlign: "center",
    fontStyle: "italic",
  },
});
