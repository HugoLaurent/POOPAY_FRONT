import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function PrivacyScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const styles = getStyles(colors);

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ThemedView style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>
          Confidentialité et Permissions
        </ThemedText>
        <View style={{ width: 24 }} />
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          {/* Section Politique de Confidentialité */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              🔒 Politique de Confidentialité
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              POOPAY respecte votre vie privée et s&apos;engage à protéger vos
              données personnelles.
            </ThemedText>
          </ThemedView>

          {/* Données collectées */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>
              Données Collectées
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              Nous collectons uniquement les informations nécessaires au
              fonctionnement de l&apos;application :
            </ThemedText>
            <ThemedView style={styles.list}>
              <ThemedText style={styles.listItem}>
                • Identifiants de compte (email, nom d&apos;utilisateur)
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Statistiques d&apos;utilisation (sessions, durées)
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Préférences de l&apos;application
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Données de groupe et classements
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Utilisation des données */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>
              Utilisation des Données
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              Vos données sont utilisées exclusivement pour :
            </ThemedText>
            <ThemedView style={styles.list}>
              <ThemedText style={styles.listItem}>
                • Fournir les fonctionnalités de l&apos;application
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Gérer vos groupes et classements
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Envoyer des notifications (si activées)
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Améliorer l&apos;expérience utilisateur
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Partage des données */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>
              Partage des Données
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              Nous ne vendons ni ne partageons vos données personnelles avec des
              tiers, sauf :
            </ThemedText>
            <ThemedView style={styles.list}>
              <ThemedText style={styles.listItem}>
                • Avec les membres de vos groupes (classements, statistiques)
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Si requis par la loi
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Sécurité */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>
              Sécurité des Données
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              Nous mettons en œuvre des mesures de sécurité techniques et
              organisationnelles pour protéger vos données contre tout accès non
              autorisé, modification, divulgation ou destruction.
            </ThemedText>
          </ThemedView>

          {/* Section Permissions */}
          <ThemedView style={styles.divider} />

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              🔐 Permissions Requises
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              L&apos;application demande les permissions suivantes :
            </ThemedText>
          </ThemedView>

          {/* Permission Notifications */}
          <ThemedView style={styles.permissionCard}>
            <ThemedView style={styles.permissionHeader}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.text}
              />
              <ThemedText style={styles.permissionTitle}>
                Notifications
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.permissionDescription}>
              Permet d&apos;envoyer des rappels et des alertes pour vos sessions
              et activités de groupe.
            </ThemedText>
            <ThemedText style={styles.permissionNote}>
              • Peut être activée/désactivée dans les paramètres
            </ThemedText>
            <ThemedText style={styles.permissionNote}>
              • Nécessaire pour les rappels de sessions
            </ThemedText>
          </ThemedView>

          {/* Permission Internet */}
          <ThemedView style={styles.permissionCard}>
            <ThemedView style={styles.permissionHeader}>
              <Ionicons name="globe-outline" size={24} color={colors.text} />
              <ThemedText style={styles.permissionTitle}>Internet</ThemedText>
            </ThemedView>
            <ThemedText style={styles.permissionDescription}>
              Nécessaire pour synchroniser vos données avec nos serveurs et
              interagir avec vos groupes.
            </ThemedText>
            <ThemedText style={styles.permissionNote}>
              • Requis pour le fonctionnement de l&apos;application
            </ThemedText>
          </ThemedView>

          {/* Permission Stockage */}
          <ThemedView style={styles.permissionCard}>
            <ThemedView style={styles.permissionHeader}>
              <Ionicons name="save-outline" size={24} color={colors.text} />
              <ThemedText style={styles.permissionTitle}>
                Stockage Local
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.permissionDescription}>
              Permet de sauvegarder vos préférences et de mettre en cache
              certaines données pour un accès hors ligne.
            </ThemedText>
            <ThemedText style={styles.permissionNote}>
              • Améliore les performances
            </ThemedText>
            <ThemedText style={styles.permissionNote}>
              • Permet le mode hors ligne partiel
            </ThemedText>
          </ThemedView>

          {/* Vos droits */}
          <ThemedView style={styles.divider} />

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>⚖️ Vos Droits</ThemedText>
            <ThemedText style={styles.paragraph}>
              Conformément au RGPD, vous disposez des droits suivants :
            </ThemedText>
            <ThemedView style={styles.list}>
              <ThemedText style={styles.listItem}>
                • Droit d&apos;accès à vos données
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Droit de rectification
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Droit à l&apos;effacement (droit à l&apos;oubli)
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Droit à la portabilité
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Droit d&apos;opposition au traitement
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Gestion des permissions */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>
              Gérer les Permissions
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              Vous pouvez à tout moment modifier les permissions accordées à
              l&apos;application depuis les paramètres de votre appareil.
            </ThemedText>
            <Pressable style={styles.settingsButton} onPress={openAppSettings}>
              <Ionicons name="settings-outline" size={20} color="#fff" />
              <ThemedText style={styles.settingsButtonText}>
                Ouvrir les Paramètres Système
              </ThemedText>
            </Pressable>
          </ThemedView>

          {/* Contact */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>Contact</ThemedText>
            <ThemedText style={styles.paragraph}>
              Pour toute question concernant vos données ou cette politique de
              confidentialité, contactez-nous à :
            </ThemedText>
            <ThemedText style={styles.contactText}>
              privacy@poopay.app
            </ThemedText>
          </ThemedView>

          {/* Dernière mise à jour */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.updateText}>
              Dernière mise à jour : 6 octobre 2025
            </ThemedText>
          </ThemedView>

          <View style={{ height: 40 }} />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 12,
      color: colors.text,
    },
    subsectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
      color: colors.text,
    },
    paragraph: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    list: {
      marginTop: 8,
      marginLeft: 8,
    },
    listItem: {
      fontSize: 14,
      lineHeight: 24,
      color: colors.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 24,
    },
    permissionCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    permissionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      gap: 12,
    },
    permissionTitle: {
      fontSize: 17,
      fontWeight: "600",
    },
    permissionDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    permissionNote: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
      fontStyle: "italic",
      marginTop: 2,
    },
    settingsButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.tint,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 12,
      gap: 8,
    },
    settingsButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "600",
    },
    contactText: {
      fontSize: 15,
      color: colors.tint,
      fontWeight: "500",
      marginTop: 4,
    },
    updateText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontStyle: "italic",
      textAlign: "center",
    },
  });
}
