import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { router } from "expo-router";
import * as api from "../apiService";

interface User {
  id: string;
  email: string;
  username: string;
  // champs optionnels renvoyés par l'API
  department_code?: string;
  category_id?: string | number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  signup: (
    email: string,
    password: string,
    username?: string,
    department_code?: string,
    category_id?: number,
    monthly_salary?: number,
    monthly_hours?: number,
    notifications_enabled?: boolean,
    theme?: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérification initiale au démarrage
  React.useEffect(() => {
    checkAuthStatus();
  }, []);

  // Si la vérification est terminée (isLoading false) et qu'il n'y a pas d'user,
  // s'assurer que l'utilisateur est redirigé vers l'écran de login et que le
  // storage est nettoyé.
  React.useEffect(() => {
    if (!isLoading && !user) {
      // Nettoyage supplémentaire et redirection
      (async () => {
        try {
          await AsyncStorage.multiRemove(["access_token", "user_data"]);
        } catch {
          // noop
        }
        // Utilise replace pour empêcher le retour en arrière vers des écrans protégés
        try {
          router.replace("/login");
        } catch {
          // router peut ne pas être prêt dans certains environnements — ignore
        }
      })();
    }
  }, [isLoading, user]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log("🔐 AuthContext: Début du login");
      const response = await api.login(email, password);
      console.log("🔐 AuthContext: Réponse reçue:", response);

      // Vérification basique sur la présence du token et de l'utilisateur
      if (response && response.token && response.user) {
        console.log("✅ AuthContext: Login réussi, stockage des données");
        await AsyncStorage.setItem("access_token", response.token);
        await AsyncStorage.setItem("user_data", JSON.stringify(response.user));
        setUser(response.user);
        setToken(response.token);
        return { success: true };
      }

      // Erreur du backend
      const errorMessage = response?.message || "Identifiants invalides";
      console.error("❌ AuthContext: Erreur de connexion:", errorMessage);
      return { success: false, message: errorMessage };
    } catch (error: any) {
      console.error("❌ AuthContext: Exception:", error);
      return {
        success: false,
        message: error?.message || "Impossible de contacter le serveur",
      };
    }
  };

  const signup = async (
    email: string,
    password: string,
    username?: string,
    department_code?: string,
    category_id?: number,
    monthly_salary?: number,
    monthly_hours?: number,
    notifications_enabled?: boolean,
    theme?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log("🔐 AuthContext: Début de l'inscription");
      const response = await api.signup(
        email,
        password,
        username,
        department_code,
        category_id,
        monthly_salary,
        monthly_hours,
        notifications_enabled,
        theme
      );

      console.log("🔐 AuthContext: Réponse reçue:", response);

      // Vérifier différents formats de réponse
      if (response.status === "success" && response.data?.access_token) {
        console.log("✅ AuthContext: Inscription réussie (format v1)");
        await AsyncStorage.setItem("access_token", response.data.access_token);
        await AsyncStorage.setItem(
          "user_data",
          JSON.stringify(response.data.user)
        );
        setUser(response.data.user);
        setToken(response.data.access_token);
        return { success: true };
      }

      // Format alternatif avec token direct
      if (response.token && response.user) {
        console.log("✅ AuthContext: Inscription réussie (format v2)");
        await AsyncStorage.setItem("access_token", response.token);
        await AsyncStorage.setItem("user_data", JSON.stringify(response.user));
        setUser(response.user);
        setToken(response.token);
        return { success: true };
      }

      // Erreur du backend
      const errorMessage = response.message || "Erreur lors de l'inscription";
      console.error("❌ AuthContext: Erreur d'inscription:", errorMessage);
      return { success: false, message: errorMessage };
    } catch (error: any) {
      console.error("❌ AuthContext: Exception lors de l'inscription:", error);
      return {
        success: false,
        message: error?.message || "Impossible de contacter le serveur",
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const tokenValue = await AsyncStorage.getItem("access_token");
      if (tokenValue) {
        await api.logout(tokenValue);
      }
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      // Nettoyer le stockage local dans tous les cas
      await AsyncStorage.multiRemove(["access_token", "user_data"]);
      setUser(null);
      setToken(null);
    }
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const tokenValue = await AsyncStorage.getItem("access_token");
      const userData = await AsyncStorage.getItem("user_data");

      if (tokenValue && userData) {
        // Vérifier si le token est encore valide
        const response = await api.getProfile(tokenValue);

        if (response.status === "success" && response.data) {
          const user = JSON.parse(userData);
          setUser(user);
          setToken(tokenValue);
        } else {
          // Token invalide, nettoyer
          await AsyncStorage.multiRemove(["access_token", "user_data"]);
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Erreur de vérification:", error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    token,
    login,
    signup,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
