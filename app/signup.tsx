import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

// Import des données
import departements from "@/assets/data/departement.json";
import categories from "@/assets/data/category.json";

type SignupStep = 1 | 2 | 3 | 4 | 5;

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  departmentCode: string;
  categoryId: number | null;
  monthlySalary: string;
  monthlyHours: string;
  acceptedTerms: boolean;
  acceptedHealth: boolean;
  notificationsEnabled: boolean;
  theme: string;
}

export default function SignupScreen() {
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchDept, setSearchDept] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    departmentCode: "",
    categoryId: null,
    monthlySalary: "",
    monthlyHours: "",
    acceptedTerms: false,
    acceptedHealth: false,
    notificationsEnabled: false,
    theme: "light", // Sera mis à jour avec le thème du système
  });

  const { signup } = useAuth();
  const { initializeAppData } = useAppData();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const styles = getStyles(colors);

  // Mettre à jour le thème dans signupData quand il change
  React.useEffect(() => {
    updateSignupData("theme", theme);
  }, [theme]);

  // Filtrer les départements selon la recherche
  const filteredDepartments = departements.filter(
    (dept) =>
      dept.nom.toLowerCase().includes(searchDept.toLowerCase()) ||
      dept.code.includes(searchDept)
  );

  // Filtrer les catégories selon la recherche
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const updateSignupData = (field: keyof SignupData, value: any) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: SignupStep): boolean => {
    switch (step) {
      case 1:
        if (
          !signupData.email ||
          !signupData.password ||
          !signupData.confirmPassword
        ) {
          Alert.alert("Erreur", "Veuillez remplir tous les champs");
          return false;
        }
        if (!signupData.email.includes("@")) {
          Alert.alert("Erreur", "Email invalide");
          return false;
        }
        if (signupData.password.length < 12) {
          Alert.alert(
            "Erreur",
            "Le mot de passe doit contenir au moins 12 caractères"
          );
          return false;
        }
        // Vérifier la présence d'au moins un symbole
        const symbolRegex = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/;
        if (!symbolRegex.test(signupData.password)) {
          Alert.alert(
            "Erreur",
            "Le mot de passe doit contenir au moins un symbole (!@#$%^&*...)"
          );
          return false;
        }
        if (signupData.password !== signupData.confirmPassword) {
          Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
          return false;
        }
        return true;

      case 2:
        if (!signupData.username.trim()) {
          Alert.alert("Erreur", "Veuillez entrer un nom d'utilisateur");
          return false;
        }
        if (!signupData.departmentCode) {
          Alert.alert("Erreur", "Veuillez sélectionner un département");
          return false;
        }
        return true;

      case 3:
        if (!signupData.categoryId) {
          Alert.alert(
            "Erreur",
            "Veuillez sélectionner une catégorie professionnelle"
          );
          return false;
        }
        return true;

      case 4:
        if (!signupData.monthlySalary.trim()) {
          Alert.alert("Erreur", "Veuillez entrer votre salaire mensuel net");
          return false;
        }
        if (!signupData.monthlyHours.trim()) {
          Alert.alert("Erreur", "Veuillez entrer vos heures mensuelles");
          return false;
        }
        const salary = parseFloat(signupData.monthlySalary);
        const hours = parseFloat(signupData.monthlyHours);

        if (isNaN(salary) || salary <= 0) {
          Alert.alert(
            "Erreur",
            "Le salaire mensuel doit être un nombre positif"
          );
          return false;
        }
        if (isNaN(hours) || hours <= 0) {
          Alert.alert(
            "Erreur",
            "Les heures mensuelles doivent être un nombre positif"
          );
          return false;
        }
        if (hours > 250) {
          Alert.alert(
            "Attention",
            "Le nombre d'heures mensuelles semble élevé. Vérifie ta saisie !"
          );
        }
        return true;

      case 5:
        if (!signupData.acceptedTerms || !signupData.acceptedHealth) {
          Alert.alert(
            "Erreur",
            "Vous devez accepter les conditions d'utilisation et le disclaimer santé"
          );
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((prev) => (prev + 1) as SignupStep);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as SignupStep);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const monthlySalaryNumber = parseFloat(signupData.monthlySalary);
      const monthlyHoursNumber = parseFloat(signupData.monthlyHours);

      console.log("📝 Données d'inscription:", {
        email: signupData.email,
        username: signupData.username,
        department_code: signupData.departmentCode,
        category_id: signupData.categoryId,
        monthly_salary: monthlySalaryNumber,
        monthly_hours: monthlyHoursNumber,
        notifications_enabled: signupData.notificationsEnabled,
        theme: signupData.theme,
      });

      const result = await signup(
        signupData.email,
        signupData.password,
        signupData.username,
        signupData.departmentCode,
        signupData.categoryId || undefined,
        monthlySalaryNumber,
        monthlyHoursNumber,
        signupData.notificationsEnabled,
        signupData.theme
      );

      if (result.success) {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          await initializeAppData(token);
        }
        Alert.alert(
          "Bienvenue ! 🎉",
          "Ton compte a été créé avec succès. Prêt(e) à gérer tes finances ?",
          [
            {
              text: "C'est parti !",
              onPress: () => router.replace("/(tabs)"),
            },
          ]
        );
      } else {
        // Afficher le message d'erreur du backend
        Alert.alert(
          "Erreur d'inscription",
          result.message ||
            "Impossible de créer le compte. Vérifie que l'email n'est pas déjà utilisé."
        );
      }
    } catch (error: any) {
      console.error("❌ Erreur inscription:", error);
      Alert.alert(
        "Erreur",
        "Une erreur inattendue est survenue. Vérifie ta connexion et réessaye."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => (
    <ThemedView style={styles.progressContainer}>
      {[1, 2, 3, 4, 5].map((step) => (
        <ThemedView
          key={step}
          style={[
            styles.progressDot,
            currentStep >= step && styles.progressDotActive,
          ]}
        />
      ))}
    </ThemedView>
  );

  const renderStep1 = () => (
    <ThemedView style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Créer ton compte</ThemedText>
      <ThemedText style={styles.stepSubtitle}>
        Commence par ton email et un bon mot de passe
      </ThemedText>

      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          style={styles.input}
          value={signupData.email}
          onChangeText={(text) => updateSignupData("email", text)}
          placeholder="ton.email@example.com"
          placeholderTextColor={colors.inputPlaceholder + "80"}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.label}>Mot de passe</ThemedText>
        <ThemedView style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={signupData.password}
            onChangeText={(text) => updateSignupData("password", text)}
            placeholder="Min 12 caractères + 1 symbole (!@#$%...)"
            placeholderTextColor={colors.inputPlaceholder + "80"}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <ThemedText style={styles.eyeText}>
              {showPassword ? "Masquer" : "Afficher"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.label}>Confirmer le mot de passe</ThemedText>
        <ThemedView style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={signupData.confirmPassword}
            onChangeText={(text) => updateSignupData("confirmPassword", text)}
            placeholder="Même mot de passe"
            placeholderTextColor={colors.inputPlaceholder + "80"}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <ThemedText style={styles.eyeText}>
              {showConfirmPassword ? "Masquer" : "Afficher"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderStep2 = () => (
    <ThemedView style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Parle-nous de toi</ThemedText>
      <ThemedText style={styles.stepSubtitle}>
        Comment veux-tu qu&apos;on t&apos;appelle ? Et d&apos;où viens-tu ?
      </ThemedText>

      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.label}>Nom d&apos;utilisateur</ThemedText>
        <TextInput
          style={styles.input}
          value={signupData.username}
          onChangeText={(text) => updateSignupData("username", text)}
          placeholder="TonPseudo"
          placeholderTextColor={colors.inputPlaceholder + "80"}
          autoCapitalize="words"
        />
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.label}>Département</ThemedText>
        <TextInput
          style={styles.input}
          value={searchDept}
          onChangeText={setSearchDept}
          placeholder="Rechercher un département..."
          placeholderTextColor={colors.inputPlaceholder + "80"}
        />
      </ThemedView>

      {searchDept && (
        <ThemedView style={styles.listContainer}>
          <FlatList
            data={filteredDepartments.slice(0, 5)}
            keyExtractor={(item) => item.code}
            style={styles.list}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  signupData.departmentCode === item.code &&
                    styles.listItemSelected,
                ]}
                onPress={() => {
                  updateSignupData("departmentCode", item.code);
                  setSearchDept(`${item.code} - ${item.nom}`);
                }}
              >
                <ThemedText style={styles.listItemText}>
                  {item.code} - {item.nom}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
        </ThemedView>
      )}
    </ThemedView>
  );

  const renderStep3 = () => (
    <ThemedView style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Ton domaine pro</ThemedText>
      <ThemedText style={styles.stepSubtitle}>
        Dans quel secteur travailles-tu ?
      </ThemedText>

      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.label}>Catégorie professionnelle</ThemedText>
        <TextInput
          style={styles.input}
          value={searchCategory}
          onChangeText={setSearchCategory}
          placeholder="Rechercher une catégorie..."
          placeholderTextColor={colors.inputPlaceholder + "80"}
        />
      </ThemedView>

      <ThemedView style={styles.listContainer}>
        <FlatList
          data={searchCategory ? filteredCategories : categories}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.listItem,
                signupData.categoryId === item.id && styles.listItemSelected,
              ]}
              onPress={() => {
                updateSignupData("categoryId", item.id);
                setSearchCategory(item.name);
              }}
            >
              <ThemedText style={styles.listItemText}>{item.name}</ThemedText>
            </TouchableOpacity>
          )}
        />
      </ThemedView>
    </ThemedView>
  );

  const renderStep4 = () => (
    <ThemedView style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>💰 Ton salaire</ThemedText>
      <ThemedText style={styles.stepSubtitle}>
        Pour calculer tes gains aux toilettes !
      </ThemedText>

      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.label}>Salaire mensuel NET (€)</ThemedText>
        <TextInput
          style={styles.input}
          value={signupData.monthlySalary}
          onChangeText={(text) => updateSignupData("monthlySalary", text)}
          placeholder="Ex: 1850"
          placeholderTextColor={colors.inputPlaceholder + "80"}
          keyboardType="decimal-pad"
        />
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.label}>Heures mensuelles</ThemedText>
        <TextInput
          style={styles.input}
          value={signupData.monthlyHours}
          onChangeText={(text) => updateSignupData("monthlyHours", text)}
          placeholder="Ex: 151"
          placeholderTextColor={colors.inputPlaceholder + "80"}
          keyboardType="decimal-pad"
        />
      </ThemedView>

      <ThemedView style={styles.infoBox}>
        <ThemedText style={styles.infoText}>
          💡 <ThemedText style={styles.infoBold}>Astuce :</ThemedText>
          {"\n"}
          Tu peux trouver ces infos sur ta fiche de paie.
          {"\n\n"}•{" "}
          <ThemedText style={styles.infoBold}>Salaire net :</ThemedText>{" "}
          c&apos;est ce que tu reçois sur ton compte
          {"\n"}•{" "}
          <ThemedText style={styles.infoBold}>Heures mensuelles :</ThemedText>{" "}
          35h/semaine = environ 151h/mois
          {"\n\n"}
          Exemple : 1 850€ net pour 151h
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );

  const renderStep5 = () => (
    <ThemedView style={styles.stepContainer}>
      <ThemedText style={styles.stepTitle}>Dernière étape !</ThemedText>
      <ThemedText style={styles.stepSubtitle}>
        Quelques trucs légaux à valider
      </ThemedText>

      <ThemedView style={styles.disclaimerContainer}>
        <ThemedText style={styles.disclaimerTitle}>
          ⚠️ Disclaimer Santé
        </ThemedText>
        <ScrollView style={styles.disclaimerScroll}>
          <ThemedText style={styles.disclaimerText}>
            POOPAY est une application de gestion financière ludique. Elle
            n&apos;a pas vocation à fournir des conseils médicaux.
            {"\n\n"}
            Si vous ressentez des troubles digestifs, des douleurs abdominales
            ou tout autre symptôme inhabituel, veuillez consulter un
            professionnel de santé.
            {"\n\n"}
            L&apos;utilisation de cette application ne remplace en aucun cas un
            avis médical professionnel.
          </ThemedText>
        </ScrollView>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() =>
            updateSignupData("acceptedHealth", !signupData.acceptedHealth)
          }
        >
          <ThemedView
            style={[
              styles.checkbox,
              signupData.acceptedHealth && styles.checkboxChecked,
            ]}
          >
            {signupData.acceptedHealth && (
              <ThemedText style={styles.checkboxIcon}>✓</ThemedText>
            )}
          </ThemedView>
          <ThemedText style={styles.checkboxLabel}>
            J&apos;ai lu et j&apos;accepte le disclaimer santé
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.disclaimerContainer}>
        <ThemedText style={styles.disclaimerTitle}>
          📋 Conditions d&apos;utilisation
        </ThemedText>
        <ScrollView style={styles.disclaimerScroll}>
          <ThemedText style={styles.disclaimerText}>
            En créant un compte sur POOPAY, vous acceptez :{"\n\n"}• De fournir
            des informations exactes lors de votre inscription
            {"\n"}• D&apos;utiliser l&apos;application de manière responsable
            {"\n"}• De respecter la vie privée des autres utilisateurs
            {"\n"}• Que vos données soient traitées conformément à notre
            politique de confidentialité
            {"\n\n"}
            POOPAY se réserve le droit de modifier ces conditions à tout moment.
            L&apos;utilisation continue de l&apos;application vaut acceptation
            des nouvelles conditions.
          </ThemedText>
        </ScrollView>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() =>
            updateSignupData("acceptedTerms", !signupData.acceptedTerms)
          }
        >
          <ThemedView
            style={[
              styles.checkbox,
              signupData.acceptedTerms && styles.checkboxChecked,
            ]}
          >
            {signupData.acceptedTerms && (
              <ThemedText style={styles.checkboxIcon}>✓</ThemedText>
            )}
          </ThemedView>
          <ThemedText style={styles.checkboxLabel}>
            J&apos;accepte les conditions d&apos;utilisation
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.disclaimerContainer}>
        <ThemedText style={styles.disclaimerTitle}>🔔 Notifications</ThemedText>
        <ThemedText style={styles.disclaimerText}>
          Active les notifications pour recevoir des rappels et des statistiques
          quotidiennes.
        </ThemedText>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() =>
            updateSignupData(
              "notificationsEnabled",
              !signupData.notificationsEnabled
            )
          }
        >
          <ThemedView
            style={[
              styles.checkbox,
              signupData.notificationsEnabled && styles.checkboxChecked,
            ]}
          >
            {signupData.notificationsEnabled && (
              <ThemedText style={styles.checkboxIcon}>✓</ThemedText>
            )}
          </ThemedView>
          <ThemedText style={styles.checkboxLabel}>
            J&apos;autorise les notifications
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <ThemedView style={styles.header}>
            <Image
              source={require("../assets/images/logoPoopay.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <ThemedText style={styles.title}>POOPAY</ThemedText>
          </ThemedView>

          {/* Progress Bar */}
          {renderProgressBar()}

          {/* Step Content */}
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <ThemedView style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, styles.backButton]}
              onPress={handleBack}
            >
              <ThemedText style={styles.backButtonText}>
                {currentStep === 1 ? "Annuler" : "Retour"}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.nextButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={isLoading}
            >
              <ThemedText style={styles.nextButtonText}>
                {isLoading
                  ? "⏳"
                  : currentStep === 5
                  ? "Créer mon compte"
                  : "Suivant"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

function getStyles(colors: any) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingVertical: 40,
    },
    header: {
      alignItems: "center",
      marginBottom: 30,
    },
    logoImage: {
      width: 80,
      height: 80,
      marginBottom: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.title,
    },
    progressContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      marginBottom: 30,
    },
    progressDot: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.inputBorder,
    },
    progressDotActive: {
      backgroundColor: colors.bgButtonPrimary,
    },
    stepContainer: {
      gap: 20,
      marginBottom: 30,
    },
    stepTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.title,
      textAlign: "center",
    },
    stepSubtitle: {
      fontSize: 14,
      opacity: 0.7,
      textAlign: "center",
      color: colors.subtitle,
      marginBottom: 10,
    },
    inputContainer: {
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.smallTitle,
      marginLeft: 4,
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.inputText,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      minHeight: 48,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 12,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
      minHeight: 48,
    },
    passwordInput: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.inputText,
    },
    eyeButton: {
      padding: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    eyeText: {
      fontSize: 12,
      color: colors.textButtonPrimary,
      fontWeight: "600",
    },
    listContainer: {
      maxHeight: 200,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    list: {
      backgroundColor: colors.inputBackground,
    },
    listItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.inputBorder,
    },
    listItemSelected: {
      backgroundColor: colors.bgButtonPrimary + "20",
    },
    listItemText: {
      fontSize: 14,
      color: colors.inputText,
    },
    disclaimerContainer: {
      gap: 12,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    disclaimerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.title,
    },
    disclaimerScroll: {
      maxHeight: 150,
    },
    disclaimerText: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.text,
      opacity: 0.8,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 8,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.inputBorder,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      backgroundColor: colors.bgButtonPrimary,
      borderColor: colors.bgButtonPrimary,
    },
    checkboxIcon: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    checkboxLabel: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    infoBox: {
      backgroundColor: colors.bgButtonPrimary + "15",
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.bgButtonPrimary + "30",
    },
    infoText: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.text,
    },
    infoBold: {
      fontWeight: "bold",
      color: colors.title,
    },
    navigationContainer: {
      flexDirection: "row",
      gap: 12,
      marginTop: 20,
    },
    navButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    backButton: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    backButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    nextButton: {
      backgroundColor: colors.bgButtonPrimary,
      shadowColor: colors.groupCardAdminButton,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    nextButtonText: {
      color: colors.textButtonPrimary,
      fontSize: 16,
      fontWeight: "bold",
    },
    disabledButton: {
      opacity: 0.6,
    },
  });
}
