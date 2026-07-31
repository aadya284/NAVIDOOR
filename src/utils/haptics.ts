import { Platform } from 'react-native';

export type HapticFeedbackType = 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy';

export const triggerHaptic = (type: HapticFeedbackType = 'light') => {
  console.log(`[HAPTIC] Triggered tactile feedback: ${type}`);

  if (Platform.OS === 'web') {
    // Web Vibration API fallback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      switch (type) {
        case 'success':
          navigator.vibrate([100, 50, 100]);
          break;
        case 'warning':
          navigator.vibrate([200, 100, 200]);
          break;
        case 'error':
          navigator.vibrate([500]);
          break;
        case 'heavy':
          navigator.vibrate([200]);
          break;
        case 'medium':
          navigator.vibrate([100]);
          break;
        case 'light':
        default:
          navigator.vibrate([40]);
          break;
      }
    }
  } else {
    // Native Expo Haptics integration mapping:
    // In production, developers install expo-haptics and call:
    // import * as Haptics from 'expo-haptics';
    // switch (type) {
    //   case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
    //   case 'warning': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); break;
    //   case 'error': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
    //   case 'heavy': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); break;
    //   case 'medium': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
    //   case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
    // }
  }
};
