import React, { createContext, useContext, useState } from "react";
import * as api from "../apiService";
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
  rankings?: any;
  isAppLoading: boolean;
}

interface AppContextType extends AppData {
  initializeAppData: (token: string) => Promise<void>;
  saveSettings?: (
    token: string,
    userId: string,
    newSettings: any
  ) => Promise<any>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [rankings, setRankings] = useState<any>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const initializeAppData = async (token: string) => {
    setIsAppLoading(true);
    try {
      // Un seul appel pour tout récupérer
      // getInitData doit retourner { profile, subscription, settings, sessions, groups }
      const profileRes = await api.getProfile(token);
      // Normaliser la réponse qui peut être { data: {...} } ou { user: {...} } ou directement l'objet user
      console.log("[AppProvider] initializeAppData profileRes:", profileRes);

      const profileResData =
        (profileRes && (profileRes as any).data) || profileRes;
      const user =
        (profileResData && (profileResData as any).user) || profileResData;
      const userId = user?.id;

      const initRes = await api.getInitData(token, userId);

      // Normaliser initRes qui peut contenir un wrapper 'data'
      const initResData = (initRes && (initRes as any).data) || initRes || {};

      // Preferer initResData.profile, sinon initResData.user, sinon initResData (cas où init renvoie directement le profil)
      const resolvedProfile =
        initResData.profile || initResData.user || initResData;
      setProfile(resolvedProfile || null);
      setSubscription(initResData.subscription || null);

      // Prefer explicit settings from init response, otherwise fallback to
      // resolvedProfile.preferences (some backends return user preferences
      // nested under the user object). Normalize common keys to match
      // what the app expects (notifications, darkMode, language).
      let finalSettings: any =
        initResData.settings || resolvedProfile?.preferences || null;
      if (finalSettings) {
        const normalized: any = { ...(finalSettings || {}) };
        // legacy key from backend
        if (
          normalized.notification_push !== undefined &&
          normalized.notifications === undefined
        ) {
          normalized.notifications = !!normalized.notification_push;
        }
        // theme -> darkMode mapping (e.g. 'dark' | 'light')
        if (
          normalized.theme !== undefined &&
          normalized.darkMode === undefined
        ) {
          normalized.darkMode = normalized.theme === "dark";
        }
        // ensure language prop exists
        if (!normalized.language && resolvedProfile?.preferences?.language) {
          normalized.language = resolvedProfile.preferences.language;
        }
        finalSettings = normalized;
      }

      setSettings(finalSettings || null);
      setSessions(initResData.sessions || []);
      setGroups(initResData.groups || []);
      // Accept multiple possible keys for ranking payload from backend
      const rankingPayload =
        initResData.rankings ||
        initResData.rankings_by_region ||
        initResData.rank_by_region ||
        initResData.rankings_by ||
        null;
      setRankings(rankingPayload || null);
      // Debug logs utiles en dev
    } catch (e) {
      console.error("Erreur chargement données app:", e);
    } finally {
      setIsAppLoading(false);
    }
    console.log(settings);
  };

  const saveSettings = async (
    token: string,
    userId: string,
    newSettings: any
  ) => {
    try {
      console.log(
        "[AppContext] saveSettings payload:",
        newSettings,
        typeof newSettings
      );
      setSettings((prev: any) => ({ ...(prev || {}), ...(newSettings || {}) }));
      // Appel API si token disponible
      if (token && userId) {
        console.log(
          "[AppContext] calling authAPI.updateSettings with (stringified):",
          JSON.stringify(newSettings)
        );
        const res = await api.updateSettings(token, userId, newSettings);
        // si réponse contient settings mis à jour, on les utilise
        const updatedRaw = (res && (res as any).data) || res;
        let normalizedUpdated: any = null;
        if (updatedRaw) {
          // si le backend renvoie { preferences: { theme: 'dark', notification_push: true, language: 'fr' } }
          if (updatedRaw.preferences) {
            const p = updatedRaw.preferences || {};
            normalizedUpdated = {
              darkMode: p.theme === "dark",
              notifications:
                p.notification_push !== undefined
                  ? !!p.notification_push
                  : p.notifications !== undefined
                  ? !!p.notifications
                  : settings?.notifications ?? true,
              language: p.language || settings?.language || "fr",
            };
          } else if (updatedRaw.settings) {
            normalizedUpdated = updatedRaw.settings;
          } else {
            // Already in settings shape
            normalizedUpdated = updatedRaw;
          }
          setSettings((prev: any) => ({
            ...(prev || {}),
            ...(normalizedUpdated || {}),
          }));
        }
        console.log(
          "[AppContext] saveSettings -> normalizedUpdated:",
          normalizedUpdated
        );
        return normalizedUpdated || updatedRaw;
      }
      return settings;
    } catch (e) {
      console.error("Erreur saveSettings:", e);
      throw e;
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
        rankings,
        isAppLoading,
        initializeAppData,
        saveSettings,
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
