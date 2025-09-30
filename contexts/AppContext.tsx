import React, { createContext, useContext, useState } from "react";
import * as authAPI from "../apiService/auth";
import { GroupData } from "../types/group";

interface Session {
  id: string;
  date?: string;
  start_date?: string;
  start_time?: string;
  amount_earned?: number;
  duration_minutes?: number;
  // autres infos session
}

interface AppData {
  profile: any;
  subscription: any;
  settings: any;
  sessions: Session[];
  groups: GroupData[];
  isAppLoading: boolean;
}

interface AppContextType extends AppData {
  initializeAppData: (token: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const initializeAppData = async (token: string) => {
    setIsAppLoading(true);
    try {
      // Un seul appel pour tout récupérer
      // getInitData doit retourner { profile, subscription, settings, sessions, groups }
      const profileRes = await authAPI.getProfile(token);
      // Normaliser la réponse qui peut être { data: {...} } ou { user: {...} } ou directement l'objet user
      const profileResData =
        (profileRes && (profileRes as any).data) || profileRes;
      const user =
        (profileResData && (profileResData as any).user) || profileResData;
      const userId = user?.id;

      const initRes = await authAPI.getInitData(token, userId);
      // Normaliser initRes qui peut contenir un wrapper 'data'
      const initResData = (initRes && (initRes as any).data) || initRes || {};

      // Preferer initResData.profile, sinon initResData.user, sinon initResData (cas où init renvoie directement le profil)
      const resolvedProfile =
        initResData.profile || initResData.user || initResData;
      setProfile(resolvedProfile || null);
      setSubscription(initResData.subscription || null);
      setSettings(initResData.settings || null);
      setSessions(initResData.sessions || []);
      setGroups(initResData.groups || []);
      // Debug logs utiles en dev
      console.log("[AppProvider] initializeAppData profileRes:", profileRes);
      console.log("[AppProvider] initializeAppData initRes:", initRes);
    } catch (e) {
      console.error("Erreur chargement données app:", e);
    } finally {
      setIsAppLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        subscription,
        settings,
        sessions,
        groups,
        isAppLoading,
        initializeAppData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppData doit être utilisé dans AppProvider");
  return context;
}
