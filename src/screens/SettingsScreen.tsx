import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore, AppThemeName } from '../store/appStore';
import { speakText, stopSpeech } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { SecondaryButton } from '../components/Buttons';
import { Settings as SettingsIcon, Volume2, Eye, Map, ShieldCheck, HelpCircle } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: NavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const currentAppTheme = useAppStore((state) => state.theme);
  const hapticFeedback = useAppStore((state) => state.hapticFeedback);
  
  const setVoiceSpeed = useAppStore((state) => state.setVoiceSpeed);
  const setVoiceVolume = useAppStore((state) => state.setVoiceVolume);
  const setTheme = useAppStore((state) => state.setTheme);
  const setHapticFeedback = useAppStore((state) => state.setHapticFeedback);

  React.useEffect(() => {
    speakText('Settings screen. Adjust voice properties, contrast colors, or download offline maps.', voiceSpeed, voiceVolume);
  }, []);

  const adjustVoiceSpeed = (up: boolean) => {
    triggerHaptic('medium');
    const step = 0.25;
    const nextSpeed = up ? voiceSpeed + step : voiceSpeed - step;
    setVoiceSpeed(nextSpeed);
    speakText(`Voice speed adjusted to ${Math.max(0.5, Math.min(2.0, nextSpeed)).toFixed(2)}x.`, Math.max(0.5, Math.min(2.0, nextSpeed)), voiceVolume);
  };

  const adjustVoiceVolume = (up: boolean) => {
    triggerHaptic('medium');
    const step = 0.1;
    const nextVol = up ? voiceVolume + step : voiceVolume - step;
    setVoiceVolume(nextVol);
    speakText(`Voice volume set to ${Math.round(Math.max(0, Math.min(1, nextVol)) * 100)} percent.`, voiceSpeed, Math.max(0, Math.min(1, nextVol)));
  };

  const cycleTheme = () => {
    triggerHaptic('heavy');
    let nextTheme: AppThemeName = 'light';
    if (currentAppTheme === 'light') {
      nextTheme = 'dark';
    } else if (currentAppTheme === 'dark') {
      nextTheme = 'high-contrast';
    }
    setTheme(nextTheme);
    speakText(`Theme changed to ${nextTheme}.`, voiceSpeed, voiceVolume);
  };

  const toggleHaptic = () => {
    const nextHap = !hapticFeedback;
    setHapticFeedback(nextHap);
    triggerHaptic('heavy');
    speakText(`Haptic feedback ${nextHap ? 'enabled' : 'disabled'}.`, voiceSpeed, voiceVolume);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <SettingsIcon size={28} color={theme.colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Settings Panel</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Voice Parameters Card */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          VOICE SPEECH PARAMETERS
        </Text>

        <View style={[styles.settingsCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
          {/* Voice Speed Controls */}
          <View style={styles.settingsRow}>
            <Volume2 size={24} color={theme.colors.primary} />
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: theme.colors.onSurface }]}>Speaking Rate</Text>
              <Text style={[styles.rowValText, { color: customTheme.textSecondary }]}>{voiceSpeed.toFixed(2)}x speed</Text>
            </View>
            <View style={styles.adjustCol}>
              <Pressable
                onPress={() => adjustVoiceSpeed(false)}
                style={[styles.adjustBtn, { backgroundColor: theme.colors.surface }]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Decrease speaking rate"
              >
                <Text style={[styles.adjustBtnText, { color: theme.colors.onSurface }]}>-</Text>
              </Pressable>
              <Pressable
                onPress={() => adjustVoiceSpeed(true)}
                style={[styles.adjustBtn, { backgroundColor: theme.colors.surface }]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Increase speaking rate"
              >
                <Text style={[styles.adjustBtnText, { color: theme.colors.onSurface }]}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Voice Volume Controls */}
          <View style={styles.settingsRow}>
            <Volume2 size={24} color={theme.colors.primary} />
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: theme.colors.onSurface }]}>Voice Volume</Text>
              <Text style={[styles.rowValText, { color: customTheme.textSecondary }]}>{Math.round(voiceVolume * 100)}% volume</Text>
            </View>
            <View style={styles.adjustCol}>
              <Pressable
                onPress={() => adjustVoiceVolume(false)}
                style={[styles.adjustBtn, { backgroundColor: theme.colors.surface }]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Decrease voice volume"
              >
                <Text style={[styles.adjustBtnText, { color: theme.colors.onSurface }]}>-</Text>
              </Pressable>
              <Pressable
                onPress={() => adjustVoiceVolume(true)}
                style={[styles.adjustBtn, { backgroundColor: theme.colors.surface }]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Increase voice volume"
              >
                <Text style={[styles.adjustBtnText, { color: theme.colors.onSurface }]}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Accessibility Layout settings */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          THEMES & CONTRAST
        </Text>

        <View style={[styles.settingsCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
          <Pressable
            onPress={cycleTheme}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Toggle high contrast and theme. Currently: ${currentAppTheme}`}
            style={styles.settingsRow}
          >
            <Eye size={24} color={theme.colors.primary} style={{ marginRight: spacing.md }} />
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: theme.colors.onSurface }]}>Visual Theme Layout</Text>
              <Text style={[styles.rowValText, { color: customTheme.textSecondary }]}>Active: {currentAppTheme.toUpperCase()}</Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            onPress={toggleHaptic}
            accessible={true}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: hapticFeedback }}
            accessibilityLabel="Tactile haptic feedback triggers"
            style={styles.settingsRow}
          >
            <ShieldCheck size={24} color={theme.colors.primary} style={{ marginRight: spacing.md }} />
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: theme.colors.onSurface }]}>Tactile Haptics</Text>
              <Text style={[styles.rowValText, { color: customTheme.textSecondary }]}>{hapticFeedback ? 'ENABLED' : 'DISABLED'}</Text>
            </View>
          </Pressable>
        </View>

        {/* Offline Maps download card */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          OFFLINE MAP DATA
        </Text>

        <View style={[styles.settingsCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
          <View style={styles.settingsRow}>
            <Map size={24} color={theme.colors.primary} />
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: theme.colors.onSurface }]}>Offline Maps (City Hub)</Text>
              <Text style={[styles.rowValText, { color: customTheme.textSecondary }]}>Size: 120MB. Status: Installed.</Text>
            </View>
          </View>
        </View>

        {/* Support details */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          ABOUT SYSTEM
        </Text>

        <View style={[styles.settingsCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
          <View style={styles.settingsRow}>
            <HelpCircle size={24} color={theme.colors.primary} />
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: theme.colors.onSurface }]}>NAVIDOOR - Version 1.0.0</Text>
              <Text style={[styles.rowValText, { color: customTheme.textSecondary }]}>Built for Accessibility First. © 2026</Text>
            </View>
          </View>
        </View>

      </ScrollView>
      <SecondaryButton
        title="Back to Dashboard"
        onPress={() => {
          stopSpeech();
          navigation.goBack();
        }}
        style={styles.backBtn}
      />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginLeft: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginVertical: spacing.md,
  },
  settingsCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  rowInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  rowValText: {
    fontSize: 14,
    marginTop: 2,
  },
  adjustCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 1,
  },
  adjustBtnText: {
    fontSize: 22,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: spacing.md,
  },
  backBtn: {
    marginHorizontal: spacing.lg,
  },
});
