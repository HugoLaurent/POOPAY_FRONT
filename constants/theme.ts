/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorDark = '#fff';

export const Colors = {
  light: {


    // Text
    title: '#8B4513',
    subtitle: '#3a342dff',
    smallTitle: '#C7a16e',
    textDivers: '#C7A16E',
    // Button
    bgButtonPrimary: '#C7A16E',
    textButtonPrimary: '#fff',
    // INPUT
    inputBorder: '#E0DAD2',
    inputBackground: '#f5f3ef52',
    inputText: '#4B3F2A',
    inputPlaceholder: '#A89B8C',
    textInfo: '#11100fff',
    textSwitchLogin: '#8B4513',



    text: '#4B3F2A', // brun doux
    background: '#E0DAD2', // beige moyen (plus foncé)
    tint: '#FF914D', // orange doux/terracotta
    icon: '#8B4513', // taupe/gris chaud
    tabIconDefault: '#A89B8C',
    tabIconSelected: '#8B4513',
    border: '#E0DAD2', // beige grisé
    groupCardBg: '#F5F3EF', // fond carte groupe clair
    groupCardTitle: '#8B4513',
    groupCardText: '#4B3F2A',
    groupCardHighlight: '#d8c163ff', // jaune doux pour la 1ère place (light)
    groupCardAdminButton: '#C7A16E',
    groupCardAdminText: '#FFFFFF',
    periodTabBg: 'rgba(199,161,110,0.08)',
    periodTabActiveBg: '#C7A16E',
    periodTabText: '#8B4513',
    periodTabTextActive: '#FFFFFF',
    // Styles globaux
    primary: '#8B4513',
    onPrimary: '#fff',
    dangerBg: '#E57373',
    dangerText: '#fff',
    groupCardLeaderBg: '#FFF6E9',
  },
  dark: {
    // Text
    title: '#8B4513',
    subtitle: '#E0DAD2',
    smallTitle: '#C7a16e',
    textDivers: '#C7A16E',
    textInfo: '#E0DAD2',
    textSwitchLogin: '#8B4513',
    // Button
    bgButtonPrimary: '#C7A16E',
    textButtonPrimary: '#fff',
    // INPUT
    inputBorder: '#5c59543d',
    inputBackground: '#22211e70',
    inputText: '#E0DAD2',
    inputPlaceholder: '#E0DAD2',



    text: '#8B4513',
    background: '#151718',
    tint: tintColorDark,
    icon: '#8B4513',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#232526', // ajout pour la navbar dark
    groupCardBg: '#232325', // fond carte groupe sombre
    groupCardTitle: '#8B4513',
    groupCardText: '#ECEDEE',
    groupCardHighlight: '#FFE066', // jaune doux pour la 1ère place (dark)
    // groupCardLeaderBg: '#2A2320', // plus de fond pour la 1ère place (dark)
    groupCardAdminButton: '#C7A16E',
    groupCardAdminText: '#181A1B',
    periodTabBg: 'rgba(199,161,110,0.08)',
    periodTabActiveBg: '#C7A16E',
    periodTabText: '#8B4513',
    periodTabTextActive: '#FFFFFF',
    // Styles globaux
    primary: '#8B4513',
    onPrimary: '#8B4513',
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
