import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText, stopSpeech } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { User, Phone, Globe, Shield, Heart, HelpCircle, RefreshCw } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileTab'>;

interface Props {
  navigation: NavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const userName = useAppStore((state) => state.userName) || 'User';
  const userPhone = useAppStore((state) => state.userPhone) || '+91 9876543210';
  const userLanguage = useAppStore((state) => state.userLanguage);
  const emergencyContacts = useAppStore((state) => state.emergencyContacts);
  const resetOnboarding = useAppStore((state) => state.resetOnboarding);

  React.useEffect(() => {
    speakText(`Profile screen. Displaying account settings for ${userName}.`, voiceSpeed, voiceVolume);
  }, []);

  const handleReset = () => {
    triggerHaptic('heavy');
    resetOnboarding();
    speakText('App cache cleared. Restarting voice onboarding process.', voiceSpeed, voiceVolume);
    // React Navigation will automatically reset navigation stack if Zustand isOnboarded state toggles.
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <User size={28} color={theme.colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>User Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Card info */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.colors.onSurface }]}>{userName}</Text>
            <Text style={[styles.profilePhone, { color: customTheme.textSecondary }]}>{userPhone}</Text>
          </View>
        </View>

        {/* Configuration settings list */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          ACCOUNT PREFERENCES
        </Text>

        <View style={[styles.optionsGroup, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
          <View style={styles.optionRow}>
            <Globe size={20} color={theme.colors.primary} style={styles.optionIcon} />
            <Text style={[styles.optionLabel, { color: theme.colors.onSurface }]}>Language: {userLanguage}</Text>
          </View>
          
          <View style={styles.optionRow}>
            <Shield size={20} color={theme.colors.primary} style={styles.optionIcon} />
            <Text style={[styles.optionLabel, { color: theme.colors.onSurface }]}>Location Access: Always On</Text>
          </View>

          <View style={styles.optionRow}>
            <Phone size={20} color={theme.colors.primary} style={styles.optionIcon} />
            <Text style={[styles.optionLabel, { color: theme.colors.onSurface }]}>SOS Contacts: {emergencyContacts[0]?.name || 'Rajesh'}</Text>
          </View>
        </View>

        {/* Medical ID summary info */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          PHYSICIAN HEALTH FILE
        </Text>

        <View style={[styles.optionsGroup, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
          <View style={styles.optionRow}>
            <Heart size={20} color={theme.colors.error} style={styles.optionIcon} />
            <Text style={[styles.optionLabel, { color: theme.colors.onSurface }]}>Blood Group: O Positive</Text>
          </View>

          <View style={styles.optionRow}>
            <Heart size={20} color={theme.colors.error} style={styles.optionIcon} />
            <Text style={[styles.optionLabel, { color: theme.colors.onSurface }]}>Conditions: Diabetes, Low Vision</Text>
          </View>
        </View>

        {/* System triggers (Reset onboarding) */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          DEVELOPMENT & CACHE
        </Text>
        <Pressable
          onPress={handleReset}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Reset onboarding cache"
          style={({ pressed }) => [
            styles.resetBtn,
            {
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: theme.colors.error,
              borderWidth: 2,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <RefreshCw size={20} color={theme.colors.error} style={{ marginRight: spacing.sm }} />
          <Text style={[styles.resetBtnText, { color: theme.colors.error }]}>Reset Voice Onboarding</Text>
        </Pressable>

      </ScrollView>
      <SecondaryButton
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
        style={styles.backBtn}
      />
    </View>
  );
};

export default ProfileScreen;

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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  profileInfo: {
    marginLeft: spacing.md,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
  },
  profilePhone: {
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginVertical: spacing.md,
  },
  optionsGroup: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  optionIcon: {
    marginRight: spacing.md,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  resetBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  backBtn: {
    marginHorizontal: spacing.lg,
  },
});
