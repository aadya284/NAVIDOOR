import React from 'react';
import { StyleSheet, Text, View, ScrollView, Animated, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText, stopSpeech } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { VoiceButton } from '../components/Buttons';
import { Mic, ArrowLeft, Send, Sparkles } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VoiceAssistant'>;

interface Props {
  navigation: NavigationProp;
}

const SUGGESTED_COMMANDS = [
  'Start Navigation',
  'Read Text',
  'Identify Medicine',
  'Find Stairs',
  'Emergency SOS',
  'Stop Navigation',
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

const VoiceAssistantScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const startRoute = useAppStore((state) => state.startRoute);

  // States
  const [listening, setListening] = React.useState(false);
  const [chats, setChats] = React.useState<ChatMessage[]>([
    { id: '1', sender: 'assistant', text: 'Hello! I am your AI Vision Assistant. Speak a command or choose a suggestion below.' },
  ]);

  // Audio wave heights animation values
  const wave1 = React.useRef(new Animated.Value(15)).current;
  const wave2 = React.useRef(new Animated.Value(25)).current;
  const wave3 = React.useRef(new Animated.Value(45)).current;
  const wave4 = React.useRef(new Animated.Value(25)).current;
  const wave5 = React.useRef(new Animated.Value(15)).current;

  React.useEffect(() => {
    speakText('Voice Assistant active. Say a command after pressing the microphone button.', voiceSpeed, voiceVolume);
    return () => stopSpeech();
  }, []);

  // Pulse wave animation loop when listening
  React.useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;

    if (listening) {
      const animateWaves = () => {
        const timings = [wave1, wave2, wave3, wave4, wave5].map((w, i) => {
          return Animated.sequence([
            Animated.timing(w, {
              toValue: Math.random() * 50 + 10,
              duration: 150 + i * 20,
              useNativeDriver: false,
            }),
            Animated.timing(w, {
              toValue: Math.random() * 15 + 5,
              duration: 150 + i * 20,
              useNativeDriver: false,
            }),
          ]);
        });

        animLoop = Animated.loop(Animated.parallel(timings));
        animLoop.start();
      };
      
      animateWaves();
    } else {
      if (animLoop) (animLoop as any).stop();
      // Reset heights
      [wave1, wave2, wave3, wave4, wave5].forEach((w, i) => {
        Animated.timing(w, { toValue: 12, duration: 200, useNativeDriver: false }).start();
      });
    }

    return () => {
      if (animLoop) (animLoop as any).stop();
    };
  }, [listening]);

  const triggerListening = () => {
    if (listening) return;
    setListening(true);
    triggerHaptic('heavy');
    speakText('Listening... Speak now.', voiceSpeed, voiceVolume);

    // Simulate speech detection complete after 3 seconds
    setTimeout(() => {
      setListening(false);
      processCommand('Find nearest pharmacy');
    }, 3000);
  };

  const processCommand = (cmdText: string) => {
    triggerHaptic('success');
    
    // Add user message
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: cmdText };
    setChats(prev => [...prev, userMsg]);

    // Generate response based on command
    setTimeout(() => {
      let reply = "I didn't quite catch that. Please repeat or choose a command card.";
      
      const normalizedCmd = cmdText.toLowerCase();
      if (normalizedCmd.includes('navigation') || normalizedCmd.includes('pharmacy')) {
        reply = 'Opening route maps to nearest Pharmacy. Distance is 120 meters.';
        startRoute('City Pharmacy');
        setTimeout(() => navigation.navigate('OutdoorNavigation'), 2500);
      } else if (normalizedCmd.includes('medicine') || normalizedCmd.includes('pill')) {
        reply = 'Opening medicine identification camera.';
        setTimeout(() => navigation.navigate('MedicineAssistant'), 2000);
      } else if (normalizedCmd.includes('read') || normalizedCmd.includes('ocr') || normalizedCmd.includes('text')) {
        reply = 'Opening document text reader scanner.';
        setTimeout(() => navigation.navigate('OCRReader'), 2000);
      } else if (normalizedCmd.includes('stairs')) {
        reply = 'Stairs alert. Staircase down is located five steps front-left.';
      } else if (normalizedCmd.includes('sos') || normalizedCmd.includes('emergency')) {
        reply = 'Triggering emergency SOS countdown.';
        setTimeout(() => navigation.navigate('EmergencySOS'), 2000);
      } else if (normalizedCmd.includes('stop')) {
        reply = 'Stopping all navigation assistance routes.';
        useAppStore.getState().stopRoute();
      }

      const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'assistant', text: reply };
      setChats(prev => [...prev, assistantMsg]);
      speakText(reply, voiceSpeed, voiceVolume);
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} accessible={true} accessibilityRole="button" accessibilityLabel="Back">
          <ArrowLeft size={28} color={theme.colors.onSurface} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Voice Assistant</Text>
        <Sparkles size={24} color={theme.colors.primary} />
      </View>

      {/* Discussion Chat Logs */}
      <ScrollView
        style={styles.chatScroller}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        ref={(ref) => ref?.scrollToEnd({ animated: true })}
      >
        {chats.map((chat) => (
          <View
            key={chat.id}
            accessible={true}
            accessibilityLabel={`${chat.sender === 'user' ? 'You said' : 'Assistant said'}: ${chat.text}`}
            style={[
              styles.chatBubble,
              {
                alignSelf: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: chat.sender === 'user'
                  ? theme.colors.primary
                  : theme.colors.surfaceVariant,
                borderColor: theme.colors.outline,
                borderWidth: customTheme.cardBorderWidth,
              },
            ]}
          >
            <Text style={[styles.chatText, { color: chat.sender === 'user' ? '#FFFFFF' : theme.colors.onSurface }]}>
              {chat.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Voice ripple wave animation */}
      <View style={styles.waveformContainer}>
        {[wave1, wave2, wave3, wave4, wave5].map((w, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveBar,
              {
                height: w,
                backgroundColor: listening ? theme.colors.secondary : theme.colors.primary,
              },
            ]}
          />
        ))}
      </View>

      {/* Mic trigger control */}
      <View style={styles.micSection}>
        <VoiceButton onPress={triggerListening} isActive={listening} />
        <Text style={[styles.micLabel, { color: theme.colors.onSurface }]}>
          {listening ? 'LISTENING TO VOICE...' : 'TAP MICROPHONE TO SPEAK'}
        </Text>
      </View>

      {/* Suggested commands scroll */}
      <View style={styles.suggestionBox}>
        <Text style={[styles.suggestHeading, { color: customTheme.textSecondary }]}>
          SUGGESTED COMMANDS
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionScroll}>
          {SUGGESTED_COMMANDS.map((cmd) => (
            <Pressable
              key={cmd}
              onPress={() => processCommand(cmd)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Command suggestion: ${cmd}`}
              style={({ pressed }) => [
                styles.suggestCard,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.primary,
                  borderWidth: 1,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.suggestText, { color: theme.colors.onSurface }]}>{cmd}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default VoiceAssistantScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  chatScroller: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  chatBubble: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    elevation: 1,
  },
  chatText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  waveformContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  micSection: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  micLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: spacing.sm,
  },
  suggestionBox: {
    marginTop: spacing.sm,
  },
  suggestHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  suggestionScroll: {
    paddingHorizontal: spacing.lg,
    height: 48,
  },
  suggestCard: {
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  suggestText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
