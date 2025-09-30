/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#4B3F2A', // brun doux
    background: '#E0DAD2', // beige moyen (plus foncé)
    tint: '#FF914D', // orange doux/terracotta
    icon: '#A89B8C', // taupe/gris chaud
    tabIconDefault: '#A89B8C',
    tabIconSelected: '#FF914D',
    border: '#E0DAD2', // beige grisé
    groupCardBg: '#F5F3EF', // fond carte groupe clair
    groupCardTitle: '#C7A16E',
    groupCardText: '#4B3F2A',
    groupCardHighlight: '#FFE066', // jaune doux pour la 1ère place (light)
    // groupCardLeaderBg: '#FFF6E9', // plus de fond pour la 1ère place (light)
    groupCardAdminButton: '#C7A16E',
    groupCardAdminText: '#181A1B',
    periodTabBg: 'rgba(199,161,110,0.08)',
    periodTabActiveBg: '#C7A16E',
    periodTabText: '#C7A16E',
    periodTabTextActive: '#181A1B',
    // Styles globaux
    primary: '#8B4513',
    onPrimary: '#fff',
    dangerBg: '#E57373',
    dangerText: '#fff',
    groupCardLeaderBg: '#FFF6E9',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#232526', // ajout pour la navbar dark
    groupCardBg: '#232325', // fond carte groupe sombre
    groupCardTitle: '#C7A16E',
    groupCardText: '#ECEDEE',
    groupCardHighlight: '#FFE066', // jaune doux pour la 1ère place (dark)
    // groupCardLeaderBg: '#2A2320', // plus de fond pour la 1ère place (dark)
    groupCardAdminButton: '#C7A16E',
    groupCardAdminText: '#181A1B',
    periodTabBg: 'rgba(199,161,110,0.08)',
    periodTabActiveBg: '#C7A16E',
    periodTabText: '#C7A16E',
    periodTabTextActive: '#181A1B',
    // Styles globaux
    primary: '#8B4513 ',
    onPrimary: '#181A1B',
    dangerBg: '#B71C1C',
    dangerText: '#fff',
    groupCardLeaderBg: '#2A2320',
  },
};

// Styles globaux réutilisables pour StyleSheet.create, dépendants du thème
export const getGlobalStyles = (colors: any) => ({
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center' as const,
    elevation: 2,
    paddingHorizontal: 18,
  },
  buttonPrimaryText: {
    color: colors.onPrimary,
    fontWeight: '700' as const,
    fontSize: 16,
  },
  buttonDanger: {
    backgroundColor: colors.dangerBg,
    marginLeft: 12,
  },
  buttonDangerText: {
    color: colors.dangerText,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
});

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
