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
import { Eye, Volume2, Globe2, Save, Copy, History, RefreshCw, ScanLine } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'OCRReader'>;

interface Props {
  navigation: NavigationProp;
}

const MOCK_OCR_DOC = 'WARNING: Keep out of reach of children. Store in a cool dry place below 25°C. Consult your pharmacist before using this drug.';

const OCRReaderScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const ocrHistory = useAppStore((state) => state.ocrHistory);
  const addOcrHistory = useAppStore((state) => state.addOcrHistory);

  // Screen states
  const [scanning, setScanning] = React.useState(false);
  const [extractedText, setExtractedText] = React.useState<string | null>(null);
  const [translatedText, setTranslatedText] = React.useState<string | null>(null);

  React.useEffect(() => {
    speakText('OCR Text Reader active. Tap the massive center capture button to take a photo of any written document, label, or road sign.', voiceSpeed, voiceVolume);
  }, []);

  const triggerCapture = () => {
    if (scanning) return;
    setScanning(true);
    setExtractedText(null);
    setTranslatedText(null);
    triggerHaptic('heavy');
    speakText('Analyzing document. Processing text layouts.', voiceSpeed, voiceVolume);

    setTimeout(() => {
      setScanning(false);
      triggerHaptic('success');
      setExtractedText(MOCK_OCR_DOC);
      speakText('Text scan complete. The extracted text is displayed. Double tap read aloud to hear it.', voiceSpeed, voiceVolume);
    }, 2500);
  };

  const handleReadAloud = () => {
    if (!extractedText) return;
    triggerHaptic('medium');
    speakText(translatedText || extractedText, voiceSpeed, voiceVolume);
  };

  const handleTranslate = () => {
    if (!extractedText) return;
    triggerHaptic('medium');
    speakText('Translating text to Hindi language.', voiceSpeed, voiceVolume);
    
    setTimeout(() => {
      setTranslatedText('चेतावनी: बच्चों की पहुँच से दूर रखें। २५ डिग्री सेल्सियस से नीचे सूखी जगह पर रखें।');
      speakText('Translation completed. text translated to Hindi.', voiceSpeed, voiceVolume);
    }, 1500);
  };

  const handleSaveText = () => {
    if (!extractedText) return;
    triggerHaptic('success');
    addOcrHistory(extractedText);
    speakText('Document text saved to history library.', voiceSpeed, voiceVolume);
  };

  const handleCopyText = () => {
    if (!extractedText) return;
    triggerHaptic('success');
    speakText('Text copied to system clipboard.', voiceSpeed, voiceVolume);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Eye size={28} color={theme.colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>OCR Text Reader</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* simulated camera viewer */}
        <View style={[styles.cameraView, { backgroundColor: '#1E293B' }]}>
          {scanning && (
            <View style={styles.scannerAnimationBox}>
              <ScanLine size={48} color="#00FF00" />
              <Text style={styles.scannerLineText}>OCR CONVERTING...</Text>
            </View>
          )}

          {!scanning && !extractedText && (
            <View style={styles.idleCameraBox}>
              <ScanLine size={48} color="rgba(255, 255, 255, 0.4)" />
              <Text style={styles.cameraHelpText}>Place text inside camera grid</Text>
            </View>
          )}

          {extractedText && (
            <View style={styles.successScanOverlay}>
              <Text style={styles.successScanLabel}>TEXT FRAME CAPTURED</Text>
            </View>
          )}
        </View>

        {/* Capture Control Button */}
        <View style={styles.captureBtnWrapper}>
          <Pressable
            onPress={triggerCapture}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={scanning ? "Processing capture" : "Capture image and extract text"}
            style={({ pressed }) => [
              styles.captureCircleBtn,
              {
                backgroundColor: scanning ? theme.colors.surfaceVariant : theme.colors.primary,
                borderColor: theme.colors.onSurface,
                borderWidth: customTheme.cardBorderWidth ? 3 : 0,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Eye size={36} color={scanning ? theme.colors.onSurface : '#FFFFFF'} />
          </Pressable>
          <Text style={[styles.captureLabel, { color: theme.colors.onSurface }]}>
            {scanning ? 'Analyzing Document...' : 'TAP TO CAPTURE & READ'}
          </Text>
        </View>

        {/* OCR Result Console */}
        {extractedText && (
          <View style={[styles.resultCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
            <Text style={[styles.resultHeaderLabel, { color: customTheme.textSecondary }]}>EXTRACTED TEXT DATA:</Text>
            <Text style={[styles.resultText, { color: theme.colors.onSurface }]}>
              {translatedText || extractedText}
            </Text>

            <View style={styles.divider} />

            {/* Row of Controls */}
            <View style={styles.ocrActionsRow}>
              <Pressable
                onPress={handleReadAloud}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Read Aloud Text"
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.8 : 1 }]}
              >
                <View style={[styles.iconBg, { backgroundColor: theme.colors.primary }]}>
                  <Volume2 size={20} color="#FFFFFF" />
                </View>
                <Text style={[styles.actionLabel, { color: theme.colors.onSurface }]}>Speak</Text>
              </Pressable>

              <Pressable
                onPress={handleTranslate}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Translate to Hindi"
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.8 : 1 }]}
              >
                <View style={[styles.iconBg, { backgroundColor: customTheme.accent }]}>
                  <Globe2 size={20} color="#FFFFFF" />
                </View>
                <Text style={[styles.actionLabel, { color: theme.colors.onSurface }]}>Translate</Text>
              </Pressable>

              <Pressable
                onPress={handleSaveText}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Save Text"
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.8 : 1 }]}
              >
                <View style={[styles.iconBg, { backgroundColor: theme.colors.secondary }]}>
                  <Save size={20} color="#FFFFFF" />
                </View>
                <Text style={[styles.actionLabel, { color: theme.colors.onSurface }]}>Save</Text>
              </Pressable>

              <Pressable
                onPress={handleCopyText}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Copy Text"
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.8 : 1 }]}
              >
                <View style={[styles.iconBg, { backgroundColor: 'rgba(128, 128, 128, 0.4)' }]}>
                  <Copy size={20} color={theme.colors.onSurface} />
                </View>
                <Text style={[styles.actionLabel, { color: theme.colors.onSurface }]}>Copy</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* History Logs */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <History size={20} color={customTheme.textSecondary} />
            <Text style={[styles.historyHeading, { color: theme.colors.onSurface }]}>OCR HISTORY LOGS</Text>
          </View>

          {ocrHistory.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setExtractedText(item.text);
                speakText(`Selected history log. ${item.text}`, voiceSpeed, voiceVolume);
              }}
              style={[styles.historyRow, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}
            >
              <Text style={[styles.historyText, { color: theme.colors.onSurface }]} numberOfLines={2}>
                {item.text}
              </Text>
              <Text style={[styles.historyTime, { color: customTheme.textSecondary }]}>
                {item.timestamp.split(',')[1] || item.timestamp}
              </Text>
            </Pressable>
          ))}
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

export default OCRReaderScreen;

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
    marginBottom: spacing.md,
  },
  scannerAnimationBox: {
    alignItems: 'center',
  },
  scannerLineText: {
    color: '#00FF00',
    fontSize: 12,
    fontWeight: '800',
    marginTop: spacing.sm,
    letterSpacing: 2,
  },
  idleCameraBox: {
    alignItems: 'center',
  },
  cameraHelpText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  successScanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successScanLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    padding: spacing.sm,
  },
  captureBtnWrapper: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  captureCircleBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  captureLabel: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: spacing.sm,
  },
  resultCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  resultHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: spacing.md,
  },
  ocrActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  historySection: {
    marginTop: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  historyHeading: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginLeft: spacing.sm,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.md,
  },
  historyTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  backBtn: {
    marginHorizontal: spacing.lg,
  },
});
