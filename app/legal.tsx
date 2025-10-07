import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function LegalScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ThemedView style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>
          Mentions Légales et Santé
        </ThemedText>
        <View style={{ width: 24 }} />
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          {/* Section Avertissements */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              ⚠️ Avertissements Importants
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              POOPAY est une application de suivi personnel à des fins de
              divertissement et de statistiques. Veuillez lire attentivement les
              avertissements suivants avant utilisation.
            </ThemedText>
          </ThemedView>

          {/* Section Responsabilité Professionnelle */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>
              Responsabilité Légale et Professionnelle
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              L&apos;éditeur décline toute responsabilité concernant :
            </ThemedText>
            <ThemedView style={styles.list}>
              <ThemedText style={styles.listItem}>
                • Les conséquences professionnelles liées à l&apos;utilisation
                de l&apos;application (temps passé aux toilettes, productivité,
                etc.)
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Les décisions prises par votre employeur concernant votre
                temps de travail ou votre présence
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Tout conflit ou sanction disciplinaire en relation avec
                l&apos;utilisation de cette application pendant les heures de
                travail
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Les litiges liés au droit du travail découlant de l&apos;usage
                de l&apos;application
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Tout licenciement ou mesure disciplinaire liée au temps passé
                aux toilettes durant votre temps de travail
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.warningText}>
              ⚠️ Il est de votre responsabilité de respecter les règles et
              politiques de votre lieu de travail. Utilisez cette application en
              dehors de vos heures de travail ou conformément aux règles de
              votre employeur.
            </ThemedText>
          </ThemedView>

          {/* Section Santé */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>
              Avertissement Santé
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              L&apos;éditeur n&apos;est pas responsable des problèmes de santé
              pouvant découler d&apos;une utilisation inappropriée de
              l&apos;application :
            </ThemedText>
            <ThemedView style={styles.list}>
              <ThemedText style={styles.listItem}>
                • Rester assis trop longtemps sur les toilettes peut causer des
                problèmes de circulation sanguine
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Les positions assises prolongées peuvent favoriser
                l&apos;apparition d&apos;hémorroïdes et autres troubles
                proctologiques
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Une utilisation excessive du téléphone aux toilettes peut
                entraîner de mauvaises habitudes et prolonger inutilement le
                temps passé
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • L&apos;application ne doit pas encourager des comportements
                nuisibles à votre santé digestive ou physique
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • En cas de problèmes digestifs chroniques, douleurs ou
                troubles, consultez un professionnel de santé qualifié
              </ThemedText>
              <ThemedText style={styles.listItem}>
                • Cette application ne constitue en aucun cas un avis médical,
                un diagnostic ou un traitement
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.warningText}>
              🏥 Utilisez cette application de manière raisonnable et
              responsable. Votre santé et votre bien-être sont prioritaires. Ne
              restez pas assis trop longtemps et consultez un médecin en cas de
              problèmes.
            </ThemedText>
          </ThemedView>

          {/* Section Usage Responsable */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>
              Usage Responsable
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              Recommandations pour une utilisation saine de l&apos;application :
            </ThemedText>
            <ThemedView style={styles.list}>
              <ThemedText style={styles.listItem}>
                ✓ Utilisez l&apos;application à titre ludique et informatif
                uniquement
              </ThemedText>
              <ThemedText style={styles.listItem}>
                ✓ Ne prolongez pas artificiellement vos passages aux toilettes
              </ThemedText>
              <ThemedText style={styles.listItem}>
                ✓ Respectez les règles de votre lieu de travail
              </ThemedText>
              <ThemedText style={styles.listItem}>
                ✓ Maintenez une hygiène de vie saine
              </ThemedText>
              <ThemedText style={styles.listItem}>
                ✓ Consultez un médecin si vous constatez des changements
                inhabituels
              </ThemedText>
              <ThemedText style={styles.listItem}>
                ✓ Ne partagez pas d&apos;informations médicales sensibles dans
                l&apos;application
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Divider */}
          <ThemedView style={styles.divider} />

          {/* Acceptation des conditions */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>
              Acceptation des Conditions
            </ThemedText>
            <ThemedText style={styles.paragraph}>
              En utilisant POOPAY, vous reconnaissez avoir lu et compris ces
              avertissements et acceptez d&apos;utiliser l&apos;application à
              vos propres risques. Vous comprenez que l&apos;éditeur ne peut
              être tenu responsable des conséquences professionnelles, légales
              ou sanitaires liées à l&apos;usage de cette application.
            </ThemedText>
          </ThemedView>

          {/* Contact */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.subsectionTitle}>Contact</ThemedText>
            <ThemedText style={styles.paragraph}>
              Pour toute question concernant ces mentions légales :
            </ThemedText>
            <ThemedText style={styles.contactText}>legal@poopay.app</ThemedText>
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
    warningText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
      fontStyle: "italic",
      marginTop: 12,
      paddingLeft: 8,
      borderLeftWidth: 3,
      borderLeftColor: colors.tint,
      paddingVertical: 8,
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
