import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText } from '../utils/speech';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { FeatureCard, AIStatusCard } from '../components/Cards';
import { VoiceButton } from '../components/Buttons';
import { Navigation, Eye, Pill, Bus, AlertTriangle, Users, History, Settings as SettingsIcon } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface Props {
  navigation: NavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store variables
  const userName = useAppStore((state) => state.userName) || 'User';
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);

  // Trigger vocal greeting on mount
  React.useEffect(() => {
    speakText(`Welcome Back, ${userName}. How can I assist you today?`, voiceSpeed, voiceVolume);
  }, []);

  const openVoiceAssistant = () => {
    navigation.navigate('VoiceAssistant');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greetingLabel, { color: customTheme.textSecondary }]}>
            HELLO,
          </Text>
          <Text style={[styles.userName, { color: theme.colors.onSurface }]}>
            {userName}
          </Text>
        </View>
        <AlertTriangle
          size={36}
          color={theme.colors.error}
          onPress={() => navigation.navigate('EmergencySOS')}
          accessible={true}
          accessibilityLabel="SOS shortcut. Double tap to trigger emergency distress."
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Device Status Bar */}
        <AIStatusCard batteryLevel={82} gpsActive={true} internetActive={true} />

        {/* Big Central Voice Assistant Trigger */}
        <View style={styles.voiceAssistantWrapper}>
          <Text style={[styles.voicePromptText, { color: theme.colors.onSurface }]}>
            How can I help you today?
          </Text>
          <VoiceButton onPress={openVoiceAssistant} isActive={false} />
          <Text style={[styles.voiceInstruction, { color: customTheme.textSecondary }]}>
            Tap or say a command
          </Text>
        </View>

        {/* Primary Feature Cards Grid */}
        <Text style={[styles.sectionHeading, { color: theme.colors.onSurface }]}>
          AI Assistant Services
        </Text>
        <View style={styles.cardGrid}>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FeatureCard
                title="Start Navigation"
                subtitle="Live GPS walk routing"
                icon={<Navigation size={24} color="#FFFFFF" />}
                primary={true}
                onPress={() => navigation.navigate('OutdoorNavigation')}
              />
            </View>
            <View style={styles.gridCol}>
              <FeatureCard
                title="OCR Reader"
                subtitle="Scan text around you"
                icon={<Eye size={24} color={theme.colors.primary} />}
                onPress={() => navigation.navigate('OCRReader')}
              />
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FeatureCard
                title="Medicine Care"
                subtitle="Identify pills & dosage"
                icon={<Pill size={24} color={theme.colors.primary} />}
                onPress={() => navigation.navigate('MedicineAssistant')}
              />
            </View>
            <View style={styles.gridCol}>
              <FeatureCard
                title="Public Transit"
                subtitle="Bus number OCR & route"
                icon={<Bus size={24} color={theme.colors.primary} />}
                onPress={() => navigation.navigate('PublicTransport')}
              />
            </View>
          </View>
        </View>

        {/* Secondary Cards */}
        <Text style={[styles.sectionHeading, { color: theme.colors.onSurface }]}>
          Companion & Utilities
        </Text>
        
        <View style={styles.secondaryCardList}>
          <FeatureCard
            title="Family Companion"
            subtitle="Let trusted contacts track your location"
            icon={<Users size={24} color={theme.colors.primary} />}
            onPress={() => navigation.navigate('FamilyCompanion')}
            style={styles.wideCard}
          />
          
          <FeatureCard
            title="Emergency SOS Center"
            subtitle="Send coordinates and call contacts"
            icon={<AlertTriangle size={24} color="#FFFFFF" />}
            primary={true}
            onPress={() => navigation.navigate('EmergencySOS')}
            style={[styles.wideCard, { backgroundColor: theme.colors.error }]}
          />

          <FeatureCard
            title="System Settings"
            subtitle="Configure voice speed, languages & map details"
            icon={<SettingsIcon size={24} color={theme.colors.primary} />}
            onPress={() => navigation.navigate('Settings')}
            style={styles.wideCard}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.md,
  },
  greetingLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  userName: {
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  voiceAssistantWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
    padding: spacing.md,
  },
  voicePromptText: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  voiceInstruction: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.sm,
    letterSpacing: 1,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: spacing.md,
  },
  cardGrid: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  gridCol: {
    width: '48%',
  },
  secondaryCardList: {
    width: '100%',
  },
  wideCard: {
    height: 96,
    marginBottom: spacing.sm,
  },
});
