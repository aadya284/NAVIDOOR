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
import { Pill, ScanEye, CalendarDays, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MedicineAssistant'>;

interface Props {
  navigation: NavigationProp;
}

const MedicineAssistantScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const detectedMed = useAppStore((state) => state.detectedMedicine);
  const detectMed = useAppStore((state) => state.detectMedicine);

  // States
  const [scanning, setScanning] = React.useState(false);
  const [reminderConfigured, setReminderConfigured] = React.useState(false);

  React.useEffect(() => {
    speakText('Medicine Assistant active. Hold a pill bottle, capsule strip, or prescription leaflet in front of the camera and tap the scan button.', voiceSpeed, voiceVolume);
    return () => detectMed(null);
  }, []);

  const triggerScan = () => {
    if (scanning) return;
    setScanning(true);
    detectMed(null);
    setReminderConfigured(false);
    triggerHaptic('heavy');
    speakText('Scanning pill bottle details. Aligning text fonts.', voiceSpeed, voiceVolume);

    setTimeout(() => {
      setScanning(false);
      triggerHaptic('success');
      detectMed({
        name: 'Metformin Hydrochloride',
        dosage: '500mg',
        frequency: '1 tablet daily after dinner',
        warnings: 'Take with food to avoid gastric irritation. Do not chew.',
        isPrescriptionVerified: true,
      });
      speakText('Medicine Metformin 500mg identified. Recommended dosage: one tablet daily after dinner. Take with food. Prescription is verified.', voiceSpeed, voiceVolume);
    }, 3000);
  };

  const handleSetReminder = () => {
    if (!detectedMed) return;
    triggerHaptic('success');
    setReminderConfigured(true);
    speakText(`Reminder calendar alert configured for taking ${detectedMed.name} daily after dinner.`, voiceSpeed, voiceVolume);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Pill size={28} color={theme.colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Medicine Assistant</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* simulated camera viewport */}
        <View style={[styles.cameraView, { backgroundColor: '#1E293B' }]}>
          {scanning && (
            <View style={styles.scannerOverlay}>
              <ScanEye size={48} color="#00FF00" />
              <Text style={styles.scanLabel}>ANALYZING PILLS...</Text>
            </View>
          )}

          {!scanning && !detectedMed && (
            <View style={styles.idleView}>
              <Pill size={48} color="rgba(255, 255, 255, 0.4)" />
              <Text style={styles.helpText}>Hold pill bottle in front of camera</Text>
            </View>
          )}

          {detectedMed && (
            <View style={[styles.boundingBox, { borderColor: theme.colors.secondary }]}>
              <Text style={styles.boxText}>PILL BOTTLE IDENTIFIED</Text>
            </View>
          )}
        </View>

        <PrimaryButton
          title={scanning ? 'Analyzing Label...' : 'Scan Medication'}
          onPress={triggerScan}
          style={styles.scanBtn}
        />

        {/* Scan details card */}
        {detectedMed && (
          <View style={[styles.resultCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
            <View style={styles.cardHeader}>
              <Pill size={32} color={theme.colors.primary} />
              <View style={styles.cardTitleCol}>
                <Text style={[styles.medName, { color: theme.colors.onSurface }]}>{detectedMed.name}</Text>
                <Text style={[styles.medDosage, { color: customTheme.textSecondary }]}>Strength: {detectedMed.dosage}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Presc status */}
            <View style={styles.infoRow}>
              <ShieldCheck size={20} color={customTheme.success} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: theme.colors.onSurface }]}>
                {detectedMed.isPrescriptionVerified ? 'Prescription Verified by Physician' : 'Unverified Medicine'}
              </Text>
            </View>

            {/* Frequency details */}
            <View style={styles.infoRow}>
              <CalendarDays size={20} color={theme.colors.primary} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: theme.colors.onSurface }]}>
                Schedule: {detectedMed.frequency}
              </Text>
            </View>

            {/* Special Warnings */}
            <View style={styles.infoRow}>
              <AlertTriangle size={20} color={theme.colors.error} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: theme.colors.error }]}>
                Warning: {detectedMed.warnings}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Reminder Setting trigger */}
            <Pressable
              onPress={handleSetReminder}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Schedule Medicine Reminder"
              style={({ pressed }) => [
                styles.reminderBtn,
                {
                  backgroundColor: reminderConfigured ? theme.colors.secondary : theme.colors.primary,
                  borderColor: theme.colors.outline,
                  borderWidth: customTheme.cardBorderWidth,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text style={styles.reminderBtnText}>
                {reminderConfigured ? 'Reminder Calendar Configured ✓' : 'Add to Daily Reminders'}
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

export default MedicineAssistantScreen;

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
  cameraView: {
    height: 180,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scannerOverlay: {
    alignItems: 'center',
  },
  scanLabel: {
    color: '#00FF00',
    fontSize: 12,
    fontWeight: '800',
    marginTop: spacing.sm,
    letterSpacing: 2,
  },
  idleView: {
    alignItems: 'center',
  },
  helpText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  boxText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  scanBtn: {
    marginVertical: spacing.md,
  },
  resultCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitleCol: {
    marginLeft: spacing.md,
    flex: 1,
  },
  medName: {
    fontSize: 20,
    fontWeight: '800',
  },
  medDosage: {
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rowIcon: {
    marginRight: spacing.sm,
    flexShrink: 0,
  },
  rowText: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    lineHeight: 20,
  },
  reminderBtn: {
    minHeight: 52,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  reminderBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  backBtn: {
    marginHorizontal: spacing.lg,
  },
});
