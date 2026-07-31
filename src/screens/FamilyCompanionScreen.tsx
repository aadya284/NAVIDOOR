import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Users, MapPin, Eye, ShieldAlert, CheckCircle2, QrCode } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'FamilyCompanion'>;

interface Props {
  navigation: NavigationProp;
}

const COMPLIANCE_ITEMS = [
  { time: '08:30 AM', med: 'Metformin 500mg', status: 'TAKEN', checked: true },
  { time: '02:00 PM', med: 'Multivitamin Capsule', status: 'MISSED', checked: false },
  { time: '09:00 PM', med: 'Insulin Dosage', status: 'SCHEDULED', checked: false },
];

const TIMELINE_EVENTS = [
  { time: '10:15 AM', event: 'Started route navigation to City Pharmacy.' },
  { time: '10:25 AM', event: 'Identified medication capsule strip.' },
  { time: '10:45 AM', event: 'Arrived safely at home location.' },
];

const FamilyCompanionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);

  React.useEffect(() => {
    speakText('Family Companion Dashboard active. View medicine compliance log, path timelines, and retrieve pairing codes for remote location sharing.', voiceSpeed, voiceVolume);
  }, []);

  const triggerPairing = () => {
    triggerHaptic('success');
    speakText('Retrieved synchronization passcode. Say code 5, 8, 2, 9 to connect family members.', voiceSpeed, voiceVolume);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Users size={28} color={theme.colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Family Companion</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Pairing code display */}
        <View style={[styles.syncCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
          <QrCode size={40} color={theme.colors.primary} />
          <View style={styles.syncInfo}>
            <Text style={[styles.syncTitle, { color: theme.colors.onSurface }]}>Connect Family Member</Text>
            <Text style={[styles.syncDesc, { color: customTheme.textSecondary }]}>
              Code: <Text style={{ fontWeight: '900', color: theme.colors.primary }}>NAV-5829</Text>
            </Text>
          </View>
          <Pressable
            onPress={triggerPairing}
            style={[styles.syncButton, { backgroundColor: 'rgba(37, 99, 235, 0.15)' }]}
          >
            <Text style={[styles.syncButtonText, { color: theme.colors.primary }]}>Share Code</Text>
          </Pressable>
        </View>

        {/* Live Journey Tracker Status */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          LIVE JOURNEY STATUS
        </Text>
        <View style={[styles.statusBox, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MapPin size={24} color={theme.colors.primary} style={{ marginRight: spacing.sm }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusHeading, { color: theme.colors.onSurface }]}>Currently: At Home</Text>
            <Text style={[styles.statusText, { color: customTheme.textSecondary }]}>
              Last coordinates logged 2 minutes ago. GPS signal is strong.
            </Text>
          </View>
        </View>

        {/* Compliance list */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          MEDICINE COMPLIANCE TRACKER
        </Text>
        {COMPLIANCE_ITEMS.map((item, index) => (
          <View
            key={index}
            style={[styles.complianceCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}
          >
            <View style={styles.complianceIconBg}>
              <CheckCircle2 size={24} color={item.checked ? customTheme.success : theme.colors.error} />
            </View>
            <View style={styles.complianceInfo}>
              <Text style={[styles.complianceName, { color: theme.colors.onSurface }]}>{item.med}</Text>
              <Text style={[styles.complianceTime, { color: customTheme.textSecondary }]}>Scheduled: {item.time}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: item.checked ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
              <Text style={[styles.badgeText, { color: item.checked ? customTheme.success : theme.colors.error }]}>
                {item.status}
              </Text>
            </View>
          </View>
        ))}

        {/* Activity timeline list */}
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          RECENT ACCESSIBILITY TIMELINE
        </Text>
        <View style={[styles.timelineCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
          {TIMELINE_EVENTS.map((event, index) => (
            <View key={index} style={styles.timelineRow}>
              <View style={styles.timelinePointCol}>
                <View style={[styles.timelineDot, { backgroundColor: theme.colors.primary }]} />
                {index < TIMELINE_EVENTS.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineTextCol}>
                <Text style={[styles.timelineTime, { color: customTheme.textSecondary }]}>{event.time}</Text>
                <Text style={[styles.timelineEvent, { color: theme.colors.onSurface }]}>{event.event}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
      <SecondaryButton
        title="Back to Dashboard"
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      />
    </View>
  );
};

export default FamilyCompanionScreen;

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
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  syncInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  syncDesc: {
    fontSize: 14,
    marginTop: 2,
  },
  syncButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  syncButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginVertical: spacing.md,
  },
  statusBox: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 14,
    marginTop: 2,
    lineHeight: 18,
  },
  complianceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  complianceIconBg: {
    marginRight: spacing.md,
  },
  complianceInfo: {
    flex: 1,
  },
  complianceName: {
    fontSize: 16,
    fontWeight: '700',
  },
  complianceTime: {
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  timelineCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelinePointCol: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    marginTop: 4,
  },
  timelineTextCol: {
    flex: 1,
  },
  timelineTime: {
    fontSize: 11,
    fontWeight: '700',
  },
  timelineEvent: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 18,
  },
  backBtn: {
    marginHorizontal: spacing.lg,
  },
});
