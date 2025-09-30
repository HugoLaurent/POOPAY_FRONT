import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useState } from "react";
import * as authAPI from "../apiService/auth";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("🔐 AuthContext: Début du login");
      const response = await authAPI.login(email, password);
      console.log("🔐 AuthContext: Réponse reçue:", response);

      // Vérification basique sur la présence du token et de l'utilisateur
      if (response && response.token && response.user) {
        console.log("✅ AuthContext: Login réussi, stockage des données");
        await AsyncStorage.setItem("access_token", response.token);
        await AsyncStorage.setItem("user_data", JSON.stringify(response.user));
        setUser(response.user);
        setToken(response.token);
        return true;
      }

      console.error(
        "❌ AuthContext: Erreur de connexion: Données invalides",
        response
      );
      return false;
    } catch (error) {
      console.error("❌ AuthContext: Exception:", error);
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.signup(email, password);

      if (response.status === "success" && response.data?.access_token) {
        // Stocker le token
        await AsyncStorage.setItem("access_token", response.data.access_token);

        // Stocker les données utilisateur
        await AsyncStorage.setItem(
          "user_data",
          JSON.stringify(response.data.user)
        );
        setUser(response.data.user);
        return true;
      }

      console.error("Erreur d'inscription:", response.message);
      return false;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const tokenValue = await AsyncStorage.getItem("access_token");
      if (tokenValue) {
        await authAPI.logout(tokenValue);
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
        const response = await authAPI.getProfile(tokenValue);

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
