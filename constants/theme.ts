/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorDark = '#fff';

// Palette centrale pour éviter les duplications et faciliter les ajustements
const PALETTE = {
  brandDark: '#8B4513', // couleur principale (brun/taupe)
  brandLight: '#C7A16E', // couleur secondaire / accent (beige/or)
  neutralLight: '#E0DAD2',
  neutralMed: '#A89B8C',
  neutralDark: '#4B3F2A',
  neutralLighter: '#F5F3EF',


  white: '#FFFFFF',
  black: '#000000',
  tint: '#FF914D', // accent vibrant
  groupHighlightLight: '#d8c163ff',
  groupHighlightDark: '#FFE066',
};

type ThemeColors = { [key: string]: string };

const makeLightTheme = (p: typeof PALETTE): ThemeColors => ({
  // Text
  title: p.brandDark,
  subtitle: '#3a342dff',
  smallTitle: p.brandLight,
  textDivers: p.brandLight,
  text: p.brandDark,
  textInfo: '#11100fff',
  textSwitchLogin: p.brandDark,

  // Button
  bgButtonPrimary: p.brandLight,
  textButtonPrimary: p.white,
  // semantic primary color (kept for backwards compatibility)
  primary: p.brandLight,
  onPrimary: p.white,

  // INPUT
  inputBorder: p.neutralLight,
  inputBackground: 'rgba(245,243,239,0.32)',
  inputText: p.neutralDark,
  inputPlaceholder: p.neutralMed,

  // App chrome
  background: p.neutralLight,
  tint: p.tint,
  icon: p.brandDark,
  tabIconDefault: p.neutralMed,
  tabIconSelected: p.brandDark,
  border: p.neutralLight,

  // Group card
  groupCardBg: '#F5F3EF',
  groupCardTitle: p.brandDark,
  groupCardText: p.neutralDark,
  groupCardHighlight: p.groupHighlightLight,
  groupCardAdminButton: p.brandLight,
  groupCardAdminText: p.white,
  groupCardLeaderBg: '#FFF6E9',
  // switch color alias (used for active switch thumb/track)
  // switch color alias (used for active switch thumb/track)
  // track (line) will be pink, thumb ON blue, thumb OFF yellow
  switchOn: p.brandDark,
  switchOff: p.neutralLighter,
  switchLine: p.neutralLight,




});

const makeDarkTheme = (p: typeof PALETTE): ThemeColors => ({
  // Text
  title: p.brandDark,
  subtitle: p.neutralLight,
  smallTitle: p.brandLight,
  textDivers: p.brandLight,
  text: p.brandDark,
  textInfo: p.neutralLight,
  textSwitchLogin: p.brandDark,

  // Button
  bgButtonPrimary: p.brandLight,
  textButtonPrimary: p.white,
  // semantic primary color (kept for backwards compatibility)
  primary: p.brandLight,
  onPrimary: p.white,

  // INPUT
  inputBorder: '#5c59543d',
  inputBackground: '#22211e70',
  inputText: p.neutralLight,
  inputPlaceholder: p.neutralLight,

  // App chrome
  background: '#151718',
  tint: tintColorDark,
  icon: p.brandDark,
  tabIconDefault: '#9BA1A6',
  tabIconSelected: tintColorDark,
  border: '#232526',

  // Group card
  groupCardBg: '#232325',
  groupCardTitle: p.brandDark,
  groupCardText: '#ECEDEE',
  groupCardHighlight: p.groupHighlightDark,
  groupCardAdminButton: p.brandLight,
  groupCardAdminText: '#181A1B',
  groupCardLeaderBg: '#2A2320',
  // switch color alias (used for active switch thumb/track)
  // switch color alias (used for active switch thumb/track)
  // track (line) will be pink, thumb ON blue, thumb OFF yellow
  switchOn: '#86674aff',
  switchOff: p.brandLight,
  switchLine: '#ebebeb33',




});

export const Colors = {
  light: makeLightTheme(PALETTE),
  dark: makeDarkTheme(PALETTE),
};
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
