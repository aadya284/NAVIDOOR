import React from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Play, Pause, Mic, AlertTriangle, ShieldAlert, Navigation } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AISmartNavigation'>;

interface Props {
  navigation: NavigationProp;
}

const AISmartNavigationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store bindings
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const isDetecting = useAppStore((state) => state.isDetecting);
  const setDetecting = useAppStore((state) => state.setDetecting);
  const obstacles = useAppStore((state) => state.obstaclesDetected);

  // Animations for bounding boxes pulsing
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    setDetecting(true);
    speakText('AI Live Smart Navigation active. Camera scanner monitoring path for obstacles.', voiceSpeed, voiceVolume);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Set up periodic mock voice announcements of obstacles
    const speechInterval = setInterval(() => {
      if (isDetecting && obstacles.length > 0) {
        const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
        speakText(`${randomObstacle.label}, ${randomObstacle.distance} away, on your ${randomObstacle.direction}.`, voiceSpeed, voiceVolume);
        triggerHaptic('medium');
      }
    }, 6000);

    return () => {
      clearInterval(speechInterval);
      setDetecting(false);
    };
  }, [isDetecting]);

  const toggleDetection = () => {
    triggerHaptic('heavy');
    setDetecting(!isDetecting);
    speakText(isDetecting ? 'Detection paused.' : 'Detection resumed.', voiceSpeed, voiceVolume);
  };

  const handleVoiceCommand = () => {
    triggerHaptic('medium');
    navigation.navigate('VoiceAssistant');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* simulated camera viewport */}
      <View style={[styles.cameraViewport, { backgroundColor: '#1E293B' }]}>
        
        {/* Mock visual background representation */}
        <View style={styles.gridOverlay}>
          <View style={styles.scannerLine} />
        </View>

        {isDetecting ? (
          <>
            {/* Map obstacles into visual bounding boxes */}
            {obstacles.map((obs) => (
              <Animated.View
                key={obs.id}
                style={[
                  styles.boundingBox,
                  {
                    left: `${obs.x}%`,
                    top: `${obs.y}%`,
                    width: `${obs.width}%`,
                    height: `${obs.height}%`,
                    borderColor: obs.label.includes('Stair') ? theme.colors.error : theme.colors.primary,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <View style={[styles.boxLabelBg, { backgroundColor: obs.label.includes('Stair') ? theme.colors.error : theme.colors.primary }]}>
                  <Text style={styles.boxLabelText}>{obs.label}</Text>
                  <Text style={styles.boxDistText}>{obs.distance}</Text>
                </View>
              </Animated.View>
            ))}

            <View style={styles.overlayInstructionBubble}>
              <Text style={styles.overlayInstructionText}>
                SCANNING PATH AHEAD
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.pausedContainer}>
            <Pause size={48} color="#FFFFFF" />
            <Text style={styles.pausedText}>AI Object Detection Paused</Text>
          </View>
        )}
      </View>

      {/* Screen Controls Overlay Dashboard */}
      <View style={[styles.controlOverlay, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.statusHeader}>
          <ShieldAlert size={24} color={isDetecting ? theme.colors.secondary : theme.colors.error} />
          <Text style={[styles.statusText, { color: theme.colors.onSurface }]}>
            AI CAMERA FEED: {isDetecting ? 'ACTIVE MONITOR' : 'PAUSED'}
          </Text>
        </View>

        {/* Dynamic Voice Logs */}
        <View style={[styles.logConsole, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
          <Text style={[styles.consoleLabel, { color: customTheme.textSecondary }]}>LATEST AUDITORY ALERT:</Text>
          <Text style={[styles.consoleLogText, { color: theme.colors.onSurface }]}>
            {isDetecting && obstacles.length > 0
              ? `"${obstacles[0].label} detected at ${obstacles[0].distance} on the ${obstacles[0].direction}."`
              : '"No obstacle threats currently blocking route."'}
          </Text>
        </View>

        {/* Buttons Controls Section */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={toggleDetection}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isDetecting ? "Pause detection" : "Resume detection"}
            style={({ pressed }) => [
              styles.controlBtn,
              {
                backgroundColor: isDetecting ? theme.colors.error : theme.colors.secondary,
                borderColor: theme.colors.outline,
                borderWidth: customTheme.cardBorderWidth,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            {isDetecting ? <Pause size={24} color="#FFFFFF" /> : <Play size={24} color="#FFFFFF" />}
            <Text style={styles.controlBtnText}>{isDetecting ? 'Pause' : 'Resume'}</Text>
          </Pressable>

          <Pressable
            onPress={handleVoiceCommand}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Speak Command"
            style={({ pressed }) => [
              styles.controlBtn,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.outline,
                borderWidth: customTheme.cardBorderWidth,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Mic size={24} color="#FFFFFF" />
            <Text style={styles.controlBtnText}>Speak</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('EmergencySOS')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="SOS Emergency Alert"
            style={({ pressed }) => [
              styles.controlBtn,
              {
                backgroundColor: theme.colors.error,
                borderColor: theme.colors.outline,
                borderWidth: customTheme.cardBorderWidth,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <AlertTriangle size={24} color="#FFFFFF" />
            <Text style={styles.controlBtnText}>SOS</Text>
          </Pressable>
        </View>

        <SecondaryButton
          title="Back to Dashboard"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        />
      </View>
    </View>
  );
};

export default AISmartNavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraViewport: {
    flex: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#00FF00',
    position: 'absolute',
    top: '30%',
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: borderRadius.sm,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  boxLabelBg: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  boxLabelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  boxDistText: {
    color: '#FFFF00',
    fontSize: 12,
    fontWeight: '900',
  },
  overlayInstructionBubble: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  overlayInstructionText: {
    color: '#00FF00',
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 12,
  },
  pausedContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  pausedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  controlOverlay: {
    flex: 2,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.md,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '800',
    marginLeft: spacing.sm,
  },
  logConsole: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  consoleLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  consoleLogText: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  controlBtn: {
    flex: 1,
    minHeight: 64, // Touch Target
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },
  controlBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  backBtn: {
    marginTop: spacing.xs,
  },
});
