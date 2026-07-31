import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText, stopSpeech } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { PrimaryButton, SecondaryButton, SOSButton } from '../components/Buttons';
import { AlertOctagon, Phone, ShieldAlert, Heart, Calendar, MessageSquare } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmergencySOS'>;

interface Props {
  navigation: NavigationProp;
}

const EmergencySOSScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const emergencyContacts = useAppStore((state) => state.emergencyContacts);
  const sosActive = useAppStore((state) => state.sosActive);
  const triggerSOSAction = useAppStore((state) => state.triggerSOS);
  const cancelSOSAction = useAppStore((state) => state.cancelSOS);

  // States
  const [countdown, setCountdown] = React.useState(5);
  const [isCounting, setIsCounting] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    speakText('Emergency SOS Center. Double tap the massive center button to trigger countdown and alert emergency services.', voiceSpeed, voiceVolume);
    return () => {
      clearTimer();
      cancelSOSAction();
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStartSOS = () => {
    triggerHaptic('heavy');
    setIsCounting(true);
    setCountdown(5);
    speakText('Emergency SOS initiated. Dispatching alerts in 5 seconds. Tap any button to cancel.', voiceSpeed, voiceVolume);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsCounting(false);
          triggerSOSAction();
          speakText('SOS emergency coordinates successfully dispatched to your contact Rajesh Kumar. Placing telephone call.', voiceSpeed, voiceVolume);
          return 0;
        }
        triggerHaptic('heavy');
        speakText(`${prev - 1}`, voiceSpeed, voiceVolume);
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancelSOS = () => {
    clearTimer();
    setIsCounting(false);
    setCountdown(5);
    cancelSOSAction();
    triggerHaptic('medium');
    speakText('Emergency SOS canceled.', voiceSpeed, voiceVolume);
  };

  const simulateCall = () => {
    triggerHaptic('success');
    speakText(`Calling emergency contact: ${emergencyContacts[0]?.name || 'Rajesh'} at ${emergencyContacts[0]?.phone || 'phone'}`, voiceSpeed, voiceVolume);
  };

  const simulateSms = () => {
    triggerHaptic('success');
    speakText(`Sending SOS text message with live coordinates to emergency contacts.`, voiceSpeed, voiceVolume);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <AlertOctagon size={28} color={theme.colors.error} />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>SOS Emergency</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Active Countdown Layout */}
        {isCounting && (
          <View style={styles.countdownWrapper}>
            <View style={[styles.countdownCircle, { borderColor: theme.colors.error }]}>
              <Text style={[styles.countdownNumber, { color: theme.colors.onSurface }]}>{countdown}</Text>
              <Text style={[styles.countdownSecText, { color: customTheme.textSecondary }]}>seconds</Text>
            </View>
            
            <Text style={[styles.warningText, { color: theme.colors.error }]}>
              DISPATCHING EMERGENCY ALERTS
            </Text>

            <PrimaryButton
              title="CANCEL EMERGENCY ALARM"
              onPress={handleCancelSOS}
              style={{ backgroundColor: theme.colors.secondary, marginTop: spacing.md }}
            />
          </View>
        )}

        {/* SOS active success state */}
        {!isCounting && sosActive && (
          <View style={styles.sosDispatchedWrapper}>
            <ShieldAlert size={64} color={theme.colors.error} />
            <Text style={[styles.dispatchedHeading, { color: theme.colors.error }]}>
              SOS ALERTS DISPATCHED
            </Text>
            <Text style={[styles.dispatchedDesc, { color: theme.colors.onSurface }]}>
              GPS Coordinates: 18.5204° N, 73.8567° E. Live path tracking sharing is active.
            </Text>

            <View style={styles.emergencyActionsRow}>
              <Pressable
                onPress={simulateCall}
                style={[styles.emergencyActionBtn, { backgroundColor: customTheme.success }]}
              >
                <Phone size={24} color="#FFFFFF" />
                <Text style={styles.emergencyActionText}>Call Contact</Text>
              </Pressable>

              <Pressable
                onPress={simulateSms}
                style={[styles.emergencyActionBtn, { backgroundColor: theme.colors.primary }]}
              >
                <MessageSquare size={24} color="#FFFFFF" />
                <Text style={styles.emergencyActionText}>Resend SMS</Text>
              </Pressable>
            </View>

            <PrimaryButton
              title="Deactivate SOS Status"
              onPress={handleCancelSOS}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}

        {/* Idle default state */}
        {!isCounting && !sosActive && (
          <View style={styles.idleWrapper}>
            <View style={styles.sosBtnBox}>
              <SOSButton onPress={handleStartSOS} />
              <Text style={[styles.sosBtnHelpText, { color: theme.colors.onSurface }]}>
                DOUBLE TAP TO SEND SOS
              </Text>
            </View>

            {/* Emergency Contacts */}
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              SOS EMERGENCY CONTACTS
            </Text>
            {emergencyContacts.map((contact, index) => (
              <View
                key={index}
                style={[styles.contactCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}
              >
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: theme.colors.onSurface }]}>
                    {contact.name} ({contact.relationship})
                  </Text>
                  <Text style={[styles.contactPhone, { color: customTheme.textSecondary }]}>
                    {contact.phone}
                  </Text>
                </View>
                <Pressable
                  onPress={simulateCall}
                  style={[styles.phoneBtn, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}
                >
                  <Phone size={20} color={customTheme.success} />
                </Pressable>
              </View>
            ))}

            {/* Medical File Card */}
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              CRITICAL MEDICAL DOSSIER
            </Text>
            <View style={[styles.medicalCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
              <View style={styles.medRow}>
                <Heart size={20} color={theme.colors.error} style={{ marginRight: spacing.sm }} />
                <Text style={[styles.medLabel, { color: theme.colors.onSurface }]}>
                  Blood Type: <Text style={{ fontWeight: '900' }}>O Positive (O+)</Text>
                </Text>
              </View>

              <View style={styles.medRow}>
                <AlertOctagon size={20} color={theme.colors.error} style={{ marginRight: spacing.sm }} />
                <Text style={[styles.medLabel, { color: theme.colors.onSurface }]}>
                  Conditions: <Text style={{ fontWeight: '800' }}>Type 2 Diabetes, Low Vision</Text>
                </Text>
              </View>

              <View style={styles.medRow}>
                <Calendar size={20} color={theme.colors.primary} style={{ marginRight: spacing.sm }} />
                <Text style={[styles.medLabel, { color: theme.colors.onSurface }]}>
                  Allergies: <Text style={{ fontWeight: '800' }}>Penicillin Compounds</Text>
                </Text>
              </View>
            </View>
          </View>
        )}

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

export default EmergencySOSScreen;

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
  countdownWrapper: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  countdownCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  countdownNumber: {
    fontSize: 54,
    fontWeight: '900',
  },
  countdownSecText: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: -8,
  },
  warningText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginVertical: spacing.md,
    textAlign: 'center',
  },
  sosDispatchedWrapper: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dispatchedHeading: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  dispatchedDesc: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  emergencyActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
  },
  emergencyActionBtn: {
    flex: 1,
    height: 60,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    flexDirection: 'row',
  },
  emergencyActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: spacing.sm,
  },
  idleWrapper: {
    width: '100%',
  },
  sosBtnBox: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  sosBtnHelpText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginVertical: spacing.md,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
  },
  contactPhone: {
    fontSize: 14,
    marginTop: 2,
  },
  phoneBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicalCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  medLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  backBtn: {
    marginHorizontal: spacing.lg,
  },
});
