import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

// Typography config following Material Design 3
const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '700' as const,
    letterSpacing: -0.25,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 16,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '400' as const,
    letterSpacing: 0.15,
    lineHeight: 26,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 18,
  },
};

// Spacing & Layout Tokens (8-point Grid System)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  round: 9999,
};

// Main Color Palette defined by instructions
export const colors = {
  primary: '#2563EB',
  secondary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#22C55E',
  accent: '#3B82F6',
  
  light: {
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceVariant: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    shadow: '#000000',
  },
  
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2A2A2A',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    shadow: '#000000',
  },

  highContrast: {
    background: '#000000',
    surface: '#000000',
    surfaceVariant: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#FFFF00', // Yellow for high contrast visibility
    border: '#FFFFFF', // High-visibility thick border
    shadow: '#000000',
  }
};

// Create MD3 themes
export const appLightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.danger,
    background: colors.light.background,
    surface: colors.light.surface,
    surfaceVariant: colors.light.surfaceVariant,
    onSurface: colors.light.text,
    onSurfaceVariant: colors.light.textSecondary,
    outline: colors.light.border,
  },
  custom: {
    textSecondary: colors.light.textSecondary,
    border: colors.light.border,
    accent: colors.accent,
    warning: colors.warning,
    success: colors.success,
    cardBorderWidth: 0,
  }
};

export const appDarkTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.danger,
    background: colors.dark.background,
    surface: colors.dark.surface,
    surfaceVariant: colors.dark.surfaceVariant,
    onSurface: colors.dark.text,
    onSurfaceVariant: colors.dark.textSecondary,
    outline: colors.dark.border,
  },
  custom: {
    textSecondary: colors.dark.textSecondary,
    border: colors.dark.border,
    accent: colors.accent,
    warning: colors.warning,
    success: colors.success,
    cardBorderWidth: 0,
  }
};

// Custom High Contrast MD3 Theme
export const appHighContrastTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({
    config: {
      ...fontConfig,
      // Overwrite display / headlines to be extra bold for high visibility
      displayLarge: { ...fontConfig.displayLarge, fontWeight: '900' as const },
      displayMedium: { ...fontConfig.displayMedium, fontWeight: '900' as const },
      displaySmall: { ...fontConfig.displaySmall, fontWeight: '900' as const },
      headlineLarge: { ...fontConfig.headlineLarge, fontWeight: '900' as const },
      headlineMedium: { ...fontConfig.headlineMedium, fontWeight: '900' as const },
      headlineSmall: { ...fontConfig.headlineSmall, fontWeight: '900' as const },
      titleLarge: { ...fontConfig.titleLarge, fontWeight: '800' as const },
      titleMedium: { ...fontConfig.titleMedium, fontWeight: '800' as const },
      titleSmall: { ...fontConfig.titleSmall, fontWeight: '800' as const },
      bodyLarge: { ...fontConfig.bodyLarge, fontWeight: '700' as const },
      bodyMedium: { ...fontConfig.bodyMedium, fontWeight: '700' as const },
      bodySmall: { ...fontConfig.bodySmall, fontWeight: '700' as const },
    }
  }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFFF00', // Yellow as primary for ultimate contrast on black
    secondary: '#00FF00', // Bright green secondary
    error: '#FF0000', // Bright red
    background: colors.highContrast.background,
    surface: colors.highContrast.surface,
    surfaceVariant: colors.highContrast.surfaceVariant,
    onSurface: colors.highContrast.text,
    onSurfaceVariant: colors.highContrast.textSecondary,
    outline: colors.highContrast.border,
  },
  custom: {
    textSecondary: colors.highContrast.textSecondary,
    border: colors.highContrast.border,
    accent: '#00FFFF', // Bright Cyan accent
    warning: '#FFFF00',
    success: '#00FF00',
    cardBorderWidth: 2, // Thick outline borders for card boundaries
  }
};

export type AppThemeType = typeof appLightTheme;
