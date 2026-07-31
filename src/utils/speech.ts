import { Platform } from 'react-native';

type CaptionCallback = (text: string) => void;
const captionListeners = new Set<CaptionCallback>();

// Register callbacks to show on-screen captions of spoken text
export const subscribeToCaptions = (callback: CaptionCallback) => {
  captionListeners.add(callback);
  return () => {
    captionListeners.delete(callback);
  };
};

const notifyCaptions = (text: string) => {
  captionListeners.forEach((cb) => cb(text));
};

export const speakText = (text: string, rate: number = 1.0, volume: number = 1.0) => {
  console.log(`[TTS] Speaking: "${text}" at rate ${rate}`);
  notifyCaptions(text);

  // In Web environment / Expo web preview
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.volume = volume;
    
    // Find suitable speech voice (try English/Hindi based on content)
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en') || v.lang.startsWith('hi'));
    if (voice) {
      utterance.voice = voice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    // If running in physical react-native / non-supported web, we fall back to logs.
    // In production, developers would use import * as Speech from 'expo-speech';
    // Speech.speak(text, { rate, volume });
  }
};

export const stopSpeech = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  notifyCaptions('');
};
