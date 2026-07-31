import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Bus, MapPin, Navigation, Compass, Bell, AlertTriangle, ScanEye } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PublicTransport'>;

interface Props {
  navigation: NavigationProp;
}

const PublicTransportScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const detectedBus = useAppStore((state) => state.detectedBus);
  const detectBus = useAppStore((state) => state.detectBus);

  // States
  const [scanning, setScanning] = React.useState(false);
  const [exitReminderActive, setExitReminderActive] = React.useState(false);

  React.useEffect(() => {
    speakText('Public Transport Assistant active. Point camera at approaching vehicles or timetable boards to scan route numbers.', voiceSpeed, voiceVolume);
    return () => detectBus(null);
  }, []);

  const triggerScan = () => {
    if (scanning) return;
    setScanning(true);
    detectBus(null);
    triggerHaptic('heavy');
    speakText('Scanning approaching vehicles... Please hold camera steady.', voiceSpeed, voiceVolume);

    setTimeout(() => {
      setScanning(false);
      triggerHaptic('success');
      detectBus({
        line: '301',
        destination: 'Shivajinagar Terminal',
        eta: 'Arriving Now',
        isBoardingReady: true,
      });
      speakText('Bus 301 to Shivajinagar detected. Arriving now at platform 2. Boarding doors are opening.', voiceSpeed, voiceVolume);
    }, 3000);
  };

  const toggleExitReminder = () => {
    triggerHaptic('medium');
    const newState = !exitReminderActive;
    setExitReminderActive(newState);
    speakText(
      newState
        ? 'Exit reminder set. We will notify you when approaching Shivajinagar Terminal.'
        : 'Exit reminder disabled.',
      voiceSpeed,
      voiceVolume
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Bus size={28} color={theme.colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Transit Assistant</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* simulated camera scanning window */}
        <View style={[styles.scannerView, { backgroundColor: '#1E293B' }]}>
          {scanning && (
            <View style={styles.scanningOverlay}>
              <ScanEye size={48} color="#00FF00" />
              <Text style={styles.scanningText}>SCANNING BUS BOARDS...</Text>
            </View>
          )}

          {!scanning && !detectedBus && (
            <View style={styles.idleView}>
              <Bus size={48} color="rgba(255, 255, 255, 0.4)" />
              <Text style={styles.idleText}>Aim at oncoming buses</Text>
            </View>
          )}

          {detectedBus && (
            <View style={[styles.boxLabel, { borderColor: theme.colors.secondary }]}>
              <Text style={styles.boxText}>BUS {detectedBus.line}</Text>
              <Text style={styles.boxDest}>{detectedBus.destination}</Text>
            </View>
          )}
        </View>

        <PrimaryButton
          title={scanning ? 'Analyzing Frame...' : 'Scan Approaching Bus'}
          onPress={triggerScan}
          style={styles.scanBtn}
        />

        {detectedBus && (
          <View style={[styles.resultCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
            <View style={styles.resultHeader}>
              <Bus size={32} color={theme.colors.primary} />
              <View style={styles.resultTitleCol}>
                <Text style={[styles.resultBusName, { color: theme.colors.onSurface }]}>
                  Route {detectedBus.line}
                </Text>
                <Text style={[styles.resultDest, { color: customTheme.textSecondary }]}>
                  To: {detectedBus.destination}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.secondary }]}>{detectedBus.eta}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Assistance cues */}
            <View style={styles.cueRow}>
              <Compass size={20} color={theme.colors.primary} style={styles.cueIcon} />
              <Text style={[styles.cueText, { color: theme.colors.onSurface }]}>
                Boarding doors are located 5 steps front-right.
              </Text>
            </View>

            <View style={styles.cueRow}>
              <MapPin size={20} color={theme.colors.primary} style={styles.cueIcon} />
              <Text style={[styles.cueText, { color: theme.colors.onSurface }]}>
                Next station is General Hospital (3 mins).
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Exit Alarm Toggle */}
            <Pressable
              onPress={toggleExitReminder}
              accessible={true}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: exitReminderActive }}
              accessibilityLabel="Exit Reminder Alarm"
              style={({ pressed }) => [
                styles.reminderBtn,
                {
                  backgroundColor: exitReminderActive ? theme.colors.primary : 'transparent',
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Bell size={20} color={exitReminderActive ? '#FFFFFF' : theme.colors.primary} style={{ marginRight: spacing.sm }} />
              <Text style={[styles.reminderText, { color: exitReminderActive ? '#FFFFFF' : theme.colors.primary }]}>
                {exitReminderActive ? 'Exit Reminder: Active' : 'Set Alarm for Destination'}
              </Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
      <SecondaryButton
        title="Back to Dashboard"
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      />
    </View>
  );
};

export default PublicTransportScreen;

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
  scannerView: {
    height: 200,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanningOverlay: {
    alignItems: 'center',
  },
  scanningText: {
    color: '#00FF00',
    fontSize: 14,
    fontWeight: '800',
    marginTop: spacing.sm,
    letterSpacing: 2,
  },
  idleView: {
    alignItems: 'center',
  },
  idleText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  boxLabel: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  boxText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  boxDest: {
    color: '#FFFF00',
    fontSize: 14,
    fontWeight: '800',
  },
  scanBtn: {
    marginVertical: spacing.md,
  },
  resultCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultTitleCol: {
    flex: 1,
    marginLeft: spacing.md,
  },
  resultBusName: {
    fontSize: 20,
    fontWeight: '800',
  },
  resultDest: {
    fontSize: 14,
    marginTop: 2,
  },
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: spacing.md,
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cueIcon: {
    marginRight: spacing.sm,
  },
  cueText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  reminderBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: '800',
  },
  backBtn: {
    marginHorizontal: spacing.lg,
  },
});
