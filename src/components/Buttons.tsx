import React from 'react';
import { StyleSheet, Text, Pressable, View, Animated, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Mic, AlertTriangle } from 'lucide-react-native';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { triggerHaptic } from '../utils/haptics';
import { useAppStore } from '../store/appStore';

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  onPress,
  title,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  const handlePress = () => {
    triggerHaptic('medium');
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.baseButton,
        {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.outline,
          borderWidth: customTheme.cardBorderWidth,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.primaryText, { color: theme.colors.background }]}>
        {title}
      </Text>
    </Pressable>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  onPress,
  title,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  const handlePress = () => {
    triggerHaptic('light');
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.baseButton,
        {
          backgroundColor: 'transparent',
          borderColor: theme.colors.outline || theme.colors.primary,
          borderWidth: Math.max(2, customTheme.cardBorderWidth),
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.secondaryText, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
    </Pressable>
  );
};

interface VoiceButtonProps {
  onPress: () => void;
  isActive?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onPress,
  isActive = false,
  accessibilityLabel = 'Activate Voice Assistant',
  style,
}) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;
  
  // Animation pulse
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  const handlePress = () => {
    triggerHaptic(isActive ? 'medium' : 'heavy');
    onPress();
  };

  const currentTheme = useAppStore((state) => state.theme);
  const ringBg = currentTheme === 'high-contrast' ? '#FFFFFF' : theme.colors.primary;

  return (
    <View style={styles.voiceButtonContainer}>
      {isActive && (
        <Animated.View
          style={[
            styles.voicePulse,
            {
              transform: [{ scale: pulseAnim }],
              backgroundColor: ringBg,
              opacity: 0.25,
            },
          ]}
        />
      )}
      <Pressable
        onPress={handlePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Activates speech recognition. Say your commands after hearing the tone."
        style={({ pressed }) => [
          styles.voiceCircle,
          {
            backgroundColor: isActive ? theme.colors.secondary : theme.colors.primary,
            borderColor: theme.colors.onSurface,
            borderWidth: customTheme.cardBorderWidth,
            opacity: pressed ? 0.9 : 1,
          },
          style,
        ]}
      >
        <Mic size={36} color={isActive ? '#000000' : theme.colors.background} />
      </Pressable>
    </View>
  );
};

interface SOSButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onPress, style }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  const handlePress = () => {
    triggerHaptic('heavy');
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Emergency SOS Alert"
      accessibilityHint="Double tap to trigger emergency distress protocols and share location."
      style={({ pressed }) => [
        styles.sosCircle,
        {
          backgroundColor: theme.colors.error,
          borderColor: theme.colors.onSurface,
          borderWidth: customTheme.cardBorderWidth,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <AlertTriangle size={42} color="#FFFFFF" />
      <Text style={styles.sosText}>SOS</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    minHeight: 56, // Accessible target size (>= 48)
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  voiceButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
  },
  voiceCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 2,
  },
  voicePulse: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    zIndex: 1,
  },
  sosCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: spacing.xs,
    letterSpacing: 1,
  },
});
