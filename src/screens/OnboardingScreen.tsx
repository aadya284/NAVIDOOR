import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText, stopSpeech } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { PrimaryButton, SecondaryButton, VoiceButton } from '../components/Buttons';
import { PermissionDialog } from '../components/Dialogs';
import { Check, Volume2, ShieldCheck, Languages, ArrowRight, UserPlus, Eye, HeartHandshake } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Props {
  navigation: NavigationProp;
}

type OnboardingStep =
  | 'LANGUAGE'
  | 'NAME'
  | 'CONFIRM_NAME'
  | 'PHONE'
  | 'OTP'
  | 'SOS_CONTACT'
  | 'PERMISSIONS'
  | 'PREFERENCES'
  | 'SUCCESS';

const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada'];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Zustand bindings
  const setOnboardingCompleted = useAppStore((state) => state.setOnboardingCompleted);
  const userLanguage = useAppStore((state) => state.userLanguage);
  const setUserLanguage = useAppStore((state) => state.setUserLanguage);
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const hapticFeedback = useAppStore((state) => state.hapticFeedback);
  const setHapticFeedback = useAppStore((state) => state.setHapticFeedback);
  const currentAppTheme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  // Component states
  const [currentStep, setCurrentStep] = React.useState<OnboardingStep>('LANGUAGE');
  const [typedName, setTypedName] = React.useState('');
  const [typedPhone, setTypedPhone] = React.useState('');
  const [typedOtp, setTypedOtp] = React.useState('');
  const [sosName, setSosName] = React.useState('Rajesh Kumar (Son)');
  const [sosPhone, setSosPhone] = React.useState('+91 9876543210');
  
  const [isListening, setIsListening] = React.useState(false);
  const [permissionTarget, setPermissionTarget] = React.useState<'CAMERA' | 'MIC' | 'GPS' | 'NOTIF' | null>(null);

  // Initial speech welcome
  React.useEffect(() => {
    speakStepInstructions('LANGUAGE');
    return () => stopSpeech();
  }, []);

  const speakStepInstructions = (step: OnboardingStep) => {
    switch (step) {
      case 'LANGUAGE':
        speakText('Please select your language. English, Hindi, Marathi, Tamil, Telugu, or Kannada.', voiceSpeed, voiceVolume);
        break;
      case 'NAME':
        speakText('Please say your full name.', voiceSpeed, voiceVolume);
        break;
      case 'CONFIRM_NAME':
        // Evaluates prompt dynamically when name is registered
        break;
      case 'PHONE':
        speakText('Please say your ten digit mobile number.', voiceSpeed, voiceVolume);
        break;
      case 'OTP':
        speakText('Enter or speak the four digit code sent to your phone.', voiceSpeed, voiceVolume);
        break;
      case 'SOS_CONTACT':
        speakText('Say or enter your emergency contact number.', voiceSpeed, voiceVolume);
        break;
      case 'PERMISSIONS':
        speakText('We need camera, microphone, and location permissions to guide you safely. Click each dialog to grant access.', voiceSpeed, voiceVolume);
        break;
      case 'PREFERENCES':
        speakText('Set your accessibility parameters. You can toggle high contrast, volume, and haptic indicators.', voiceSpeed, voiceVolume);
        break;
      case 'SUCCESS':
        speakText('Registration completed successfully! Welcome to NAVIDOOR dashboard.', voiceSpeed, voiceVolume);
        break;
    }
  };

  const handleStepTransition = (nextStep: OnboardingStep) => {
    setCurrentStep(nextStep);
    speakStepInstructions(nextStep);
  };

  const selectLanguage = (lang: string) => {
    setUserLanguage(lang);
    triggerHaptic('medium');
    speakText(`Language set to ${lang}.`, voiceSpeed, voiceVolume);
    setTimeout(() => handleStepTransition('NAME'), 1000);
  };

  // Simulating voice speech inputs
  const triggerVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    triggerHaptic('heavy');
    
    setTimeout(() => {
      setIsListening(false);
      triggerHaptic('success');
      if (currentStep === 'NAME') {
        setTypedName('Aarav Sharma');
        speakText('Did you say Aarav Sharma? Say Yes or tap the confirm button.', voiceSpeed, voiceVolume);
        setCurrentStep('CONFIRM_NAME');
      } else if (currentStep === 'PHONE') {
        setTypedPhone('9876543210');
        speakText('Saying phone number: 9, 8, 7, 6, 5, 4, 3, 2, 1, 0. Proceeding to verification.', voiceSpeed, voiceVolume);
        setTimeout(() => handleStepTransition('OTP'), 2000);
      } else if (currentStep === 'SOS_CONTACT') {
        setSosName('Rajesh Kumar (Son)');
        setSosPhone('9876543210');
        speakText('SOS Contact registered as Rajesh Kumar. Proceeding to permissions.', voiceSpeed, voiceVolume);
        setTimeout(() => handleStepTransition('PERMISSIONS'), 2000);
      }
    }, 2000);
  };

  const confirmName = (isConfirmed: boolean) => {
    if (isConfirmed) {
      speakText(`Name confirmed: ${typedName}.`, voiceSpeed, voiceVolume);
      setTimeout(() => handleStepTransition('PHONE'), 1000);
    } else {
      setTypedName('');
      handleStepTransition('NAME');
    }
  };

  const handlePermissionRequest = (type: 'CAMERA' | 'MIC' | 'GPS' | 'NOTIF') => {
    setPermissionTarget(type);
  };

  const completePermission = (granted: boolean) => {
    setPermissionTarget(null);
    triggerHaptic(granted ? 'success' : 'warning');
    speakText(`${permissionTarget} permission ${granted ? 'granted' : 'declined'}.`, voiceSpeed, voiceVolume);
  };

  const finishRegistration = () => {
    setOnboardingCompleted(typedName || 'User', typedPhone || '9876543210', {
      name: sosName,
      phone: sosPhone,
      relationship: 'Family Member',
    });
    triggerHaptic('success');
    navigation.replace('MainTabs');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'LANGUAGE':
        return (
          <View style={styles.contentBox}>
            <Languages size={48} color={theme.colors.primary} style={styles.stepIcon} />
            <Text style={[styles.stepTitle, { color: theme.colors.onSurface }]}>Select Language</Text>
            <View style={styles.gridContainer}>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang}
                  onPress={() => selectLanguage(lang)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={lang}
                  style={({ pressed }) => [
                    styles.langCard,
                    {
                      backgroundColor: userLanguage === lang ? theme.colors.primary : theme.colors.surfaceVariant,
                      borderColor: theme.colors.outline,
                      borderWidth: customTheme.cardBorderWidth || (userLanguage === lang ? 2 : 0),
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.langText, { color: userLanguage === lang ? '#FFFFFF' : theme.colors.onSurface }]}>
                    {lang}
                  </Text>
                  {userLanguage === lang && <Check size={20} color="#FFFFFF" />}
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 'NAME':
        return (
          <View style={styles.contentBox}>
            <UserPlus size={48} color={theme.colors.primary} style={styles.stepIcon} />
            <Text style={[styles.stepTitle, { color: theme.colors.onSurface }]}>What is your full name?</Text>
            <Text style={[styles.stepDesc, { color: theme.colors.onSurfaceVariant }]}>
              Say your name clearly after pressing the microphone.
            </Text>
            
            <VoiceButton onPress={triggerVoiceInput} isActive={isListening} />
            
            <Text style={[styles.statusText, { color: theme.colors.secondary }]}>
              {isListening ? 'Listening...' : 'Tap Mic to Speak'}
            </Text>

            <View style={styles.keyboardFallback}>
              <Text style={[styles.fallbackLabel, { color: customTheme.textSecondary }]}>Or type your name:</Text>
              <TextInput
                style={[styles.inputField, { color: theme.colors.onSurface, borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}
                value={typedName}
                onChangeText={setTypedName}
                placeholder="Full Name"
                placeholderTextColor={customTheme.textSecondary}
              />
              <PrimaryButton
                title="Next"
                disabled={!typedName}
                onPress={() => confirmName(true)}
              />
            </View>
          </View>
        );

      case 'CONFIRM_NAME':
        return (
          <View style={styles.contentBox}>
            <Volume2 size={48} color={theme.colors.secondary} style={styles.stepIcon} />
            <Text style={[styles.stepTitle, { color: theme.colors.onSurface }]}>Confirm Name</Text>
            <Text style={[styles.confirmVoiceText, { color: theme.colors.primary }]}>
              "{typedName}"
            </Text>
            
            <Text style={[styles.stepDesc, { color: theme.colors.onSurfaceVariant }]}>
              Is this correct? Say "Yes" or tap the buttons below.
            </Text>

            <View style={styles.rowButtons}>
              <SecondaryButton
                title="Speak Again"
                onPress={() => confirmName(false)}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <PrimaryButton
                title="Yes, Correct"
                onPress={() => confirmName(true)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        );

      case 'PHONE':
        return (
          <View style={styles.contentBox}>
            <ShieldCheck size={48} color={theme.colors.primary} style={styles.stepIcon} />
            <Text style={[styles.stepTitle, { color: theme.colors.onSurface }]}>Mobile Number</Text>
            
            <VoiceButton onPress={triggerVoiceInput} isActive={isListening} />
            
            <Text style={[styles.statusText, { color: theme.colors.secondary }]}>
              {isListening ? 'Listening...' : 'Say your number'}
            </Text>

            <View style={styles.keyboardFallback}>
              <TextInput
                style={[styles.inputField, { color: theme.colors.onSurface, borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}
                value={typedPhone}
                onChangeText={setTypedPhone}
                keyboardType="phone-pad"
                placeholder="10 Digit Number"
                placeholderTextColor={customTheme.textSecondary}
              />
              <PrimaryButton
                title="Send Verification Code"
                disabled={typedPhone.length < 10}
                onPress={() => handleStepTransition('OTP')}
              />
            </View>
          </View>
        );

      case 'OTP':
        return (
          <View style={styles.contentBox}>
            <ShieldCheck size={48} color={theme.colors.primary} style={styles.stepIcon} />
            <Text style={[styles.stepTitle, { color: theme.colors.onSurface }]}>Verification OTP</Text>
            <Text style={[styles.stepDesc, { color: theme.colors.onSurfaceVariant }]}>
              Code sent to phone ending in {typedPhone.slice(-4) || '3210'}.
            </Text>

            <TextInput
              style={[styles.inputField, { color: theme.colors.onSurface, borderColor: theme.colors.outline, backgroundColor: theme.colors.surface, letterSpacing: 8, fontSize: 24, textAlign: 'center' }]}
              value={typedOtp}
              onChangeText={setTypedOtp}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="0000"
              placeholderTextColor={customTheme.textSecondary}
            />

            <PrimaryButton
              title="Verify Code"
              onPress={() => handleStepTransition('SOS_CONTACT')}
            />
            <SecondaryButton
              title="Resend Voice Call"
              onPress={() => speakText('Sending voice call verification OTP code.', voiceSpeed, voiceVolume)}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        );

      case 'SOS_CONTACT':
        return (
          <View style={styles.contentBox}>
            <HeartHandshake size={48} color={theme.colors.error} style={styles.stepIcon} />
            <Text style={[styles.stepTitle, { color: theme.colors.onSurface }]}>Emergency SOS Contact</Text>
            <Text style={[styles.stepDesc, { color: theme.colors.onSurfaceVariant }]}>
              Who should we contact in an emergency? Say their name and phone number.
            </Text>

            <VoiceButton onPress={triggerVoiceInput} isActive={isListening} />

            <View style={styles.keyboardFallback}>
              <TextInput
                style={[styles.inputField, { color: theme.colors.onSurface, borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}
                value={sosName}
                onChangeText={setSosName}
                placeholder="Contact Name (e.g. Son, Daughter)"
                placeholderTextColor={customTheme.textSecondary}
              />
              <TextInput
                style={[styles.inputField, { color: theme.colors.onSurface, borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}
                value={sosPhone}
                onChangeText={setSosPhone}
                keyboardType="phone-pad"
                placeholder="Contact Mobile Number"
                placeholderTextColor={customTheme.textSecondary}
              />
              <PrimaryButton
                title="Save Contact"
                onPress={() => handleStepTransition('PERMISSIONS')}
              />
            </View>
          </View>
        );

      case 'PERMISSIONS':
        return (
          <View style={styles.contentBox}>
            <ShieldCheck size={48} color={theme.colors.primary} style={styles.stepIcon} />
            <Text style={[styles.stepTitle, { color: theme.colors.onSurface }]}>Grant Access Permissions</Text>
            <Text style={[styles.stepDesc, { color: theme.colors.onSurfaceVariant }]}>
              These are required for real-time vision guidance and route assistants.
            </Text>

            <View style={styles.permissionList}>
              <Pressable
                onPress={() => handlePermissionRequest('CAMERA')}
                style={[styles.permissionRow, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}
              >
                <Text style={[styles.permissionText, { color: theme.colors.onSurface }]}>Camera (Vision Scanner)</Text>
                <Check size={20} color={theme.colors.secondary} />
              </Pressable>
              
              <Pressable
                onPress={() => handlePermissionRequest('MIC')}
                style={[styles.permissionRow, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}
              >
                <Text style={[styles.permissionText, { color: theme.colors.onSurface }]}>Microphone (Voice Engine)</Text>
                <Check size={20} color={theme.colors.secondary} />
              </Pressable>

              <Pressable
                onPress={() => handlePermissionRequest('GPS')}
                style={[styles.permissionRow, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}
              >
                <Text style={[styles.permissionText, { color: theme.colors.onSurface }]}>Location (GPS Map Router)</Text>
                <Check size={20} color={theme.colors.secondary} />
              </Pressable>

              <Pressable
                onPress={() => handlePermissionRequest('NOTIF')}
                style={[styles.permissionRow, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}
              >
                <Text style={[styles.permissionText, { color: theme.colors.onSurface }]}>Notifications (Reminders)</Text>
                <Check size={20} color={theme.colors.secondary} />
              </Pressable>
            </View>

            <PrimaryButton
              title="Next: Set Preferences"
              onPress={() => handleStepTransition('PREFERENCES')}
            />
          </View>
        );

      case 'PREFERENCES':
        return (
          <View style={styles.contentBox}>
            <Eye size={48} color={theme.colors.primary} style={styles.stepIcon} />
            <Text style={[styles.stepTitle, { color: theme.colors.onSurface }]}>Accessibility Settings</Text>

            <ScrollView style={{ width: '100%', maxHeight: 250, marginBottom: spacing.md }}>
              {/* High Contrast Mode toggle */}
              <Pressable
                onPress={() => {
                  triggerHaptic('medium');
                  setTheme(currentAppTheme === 'high-contrast' ? 'dark' : 'high-contrast');
                }}
                style={[styles.prefOptionCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}
              >
                <Text style={[styles.prefText, { color: theme.colors.onSurface }]}>
                  High Contrast: {currentAppTheme === 'high-contrast' ? 'ACTIVE' : 'INACTIVE'}
                </Text>
              </Pressable>

              {/* Haptic feedback toggle */}
              <Pressable
                onPress={() => {
                  setHapticFeedback(!hapticFeedback);
                  triggerHaptic('heavy');
                }}
                style={[styles.prefOptionCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}
              >
                <Text style={[styles.prefText, { color: theme.colors.onSurface }]}>
                  Haptic Feedback: {hapticFeedback ? 'ENABLED' : 'DISABLED'}
                </Text>
              </Pressable>

              {/* Dark mode toggling */}
              <Pressable
                onPress={() => {
                  triggerHaptic('medium');
                  setTheme(currentAppTheme === 'light' ? 'dark' : 'light');
                }}
                style={[styles.prefOptionCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}
              >
                <Text style={[styles.prefText, { color: theme.colors.onSurface }]}>
                  Theme: {currentAppTheme.toUpperCase()}
                </Text>
              </Pressable>
            </ScrollView>

            <PrimaryButton
              title="Complete Onboarding"
              onPress={() => handleStepTransition('SUCCESS')}
            />
          </View>
        );

      case 'SUCCESS':
        return (
          <View style={styles.contentBox}>
            <Check size={64} color={theme.colors.secondary} style={styles.stepIcon} />
            <Text style={[styles.stepTitle, { color: theme.colors.onSurface }]}>Setup Completed!</Text>
            <Text style={[styles.stepDesc, { color: theme.colors.onSurfaceVariant, fontSize: 18 }]}>
              NAVIDOOR is ready. All core systems are active and monitoring.
            </Text>

            <PrimaryButton
              title="Enter Dashboard"
              onPress={finishRegistration}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerBrand, { color: theme.colors.primary }]}>NAVIDOOR</Text>
        <Text style={[styles.stepIndicator, { color: customTheme.textSecondary }]}>
          ONBOARDING
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStepContent()}
      </ScrollView>

      {/* Permission modal simulator */}
      <PermissionDialog
        visible={permissionTarget !== null}
        permissionName={permissionTarget || ''}
        description={`NAVIDOOR requires access to your system's ${permissionTarget} to track active hazards and provide auditory guides.`}
        onGrant={() => completePermission(true)}
        onDeny={() => completePermission(false)}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 48,
    paddingBottom: spacing.sm,
  },
  headerBrand: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  stepIndicator: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  contentBox: {
    alignItems: 'center',
    width: '100%',
  },
  stepIcon: {
    marginBottom: spacing.md,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  stepDesc: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: spacing.md,
  },
  langCard: {
    width: '48%',
    minHeight: 64,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexDirection: 'row',
    padding: spacing.sm,
  },
  langText: {
    fontSize: 18,
    fontWeight: '800',
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  keyboardFallback: {
    width: '100%',
    marginTop: spacing.lg,
  },
  fallbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  inputField: {
    height: 56,
    borderWidth: 2,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  confirmVoiceText: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  rowButtons: {
    flexDirection: 'row',
    width: '100%',
    marginTop: spacing.md,
  },
  permissionList: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  permissionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  prefOptionCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  prefText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
