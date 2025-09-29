import React, { createContext, useContext, useState } from "react";
import * as authAPI from "../apiService/auth";

interface GroupMeta {
  id: string;
  name: string;
  memberCount: number;
  userPlace: number;
  leader: string;
  members: GroupMember[];
  // autres métadonnées utiles
}

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
  groups: GroupMeta[];
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
  const [groups, setGroups] = useState<GroupMeta[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const initializeAppData = async (token: string) => {
    setIsAppLoading(true);
    try {
      // Profil
      const profileRes = await authAPI.getProfile(token);
      const user = profileRes.user || profileRes;
      setProfile(user);
      const userId = user.id;

      // Abonnement
      const subRes = await authAPI.getSubscription(token, userId);
      setSubscription(subRes.subscription || subRes);

      // Sessions récentes
      const sessionsRes = await authAPI.getSessions(token, userId, {
        limit: 30,
      });
      setSessions(sessionsRes.sessions || sessionsRes);

      // Groupes
      const groupsRes = await authAPI.getGroups(token, userId);
      setGroups(groupsRes.groups || groupsRes);
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

export type GroupMember = {
  username: string;
  // Ajoute ici d'autres propriétés si besoin (score, avatar, etc)
};
