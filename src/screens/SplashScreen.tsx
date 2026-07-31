import React from 'react';
import { StyleSheet, Text, View, Animated, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText } from '../utils/speech';
import { spacing, AppThemeType } from '../theme/theme';
import { ShieldAlert } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: NavigationProp;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const isOnboarded = useAppStore((state) => state.isOnboarded);
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.85)).current;

  React.useEffect(() => {
    // Intro animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Text to speech welcome
    speakText('Welcome to NAVIDOOR. Your AI Vision Assistant.', voiceSpeed, voiceVolume);

    // Navigation timer
    const timer = setTimeout(() => {
      if (isOnboarded) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('Onboarding');
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        accessible={true}
        accessibilityLabel="NAVIDOOR logo"
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Geometric Accent Logo */}
        <View style={[styles.iconWrapper, { backgroundColor: theme.colors.primary }]}>
          <ShieldAlert size={56} color={theme.colors.background} />
        </View>
        
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          NAVIDOOR
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
          AI VISION ASSIST
        </Text>
        <Text style={[styles.tagline, { color: theme.custom.textSecondary }]}>
          Your AI Vision Assistant
        </Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 6,
    marginTop: -4,
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
