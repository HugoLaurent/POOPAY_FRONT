import { useColorScheme as useRNColorScheme } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

/**
 * Returns the app color scheme. If the user has an explicit preference saved in
 * app settings (settings.darkMode), that value overrides the system color scheme.
 */
export function useColorScheme() {
    const system = useRNColorScheme();
    // useAppData will throw if used outside AppProvider; this hook is intended
    // to be called from components inside the provider.
    // Read AppContext directly to avoid useAppData's throw when provider is missing.
    const ctx = useContext(AppContext as any);
    const settings = (ctx as any)?.settings;
    if (settings && typeof settings.darkMode === 'boolean') {
        return settings.darkMode ? 'dark' : 'light';
    }
    return system;
}
