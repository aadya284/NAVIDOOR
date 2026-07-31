import { create } from 'zustand';

// Theme Type
export type AppThemeName = 'light' | 'dark' | 'high-contrast';

// Notification Model
export interface NotificationItem {
  id: string;
  type: 'obstacle' | 'medicine' | 'sos' | 'navigation' | 'battery' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Emergency Contact Model
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

// State Interface
interface AppState {
  // Authentication & Onboarding
  isOnboarded: boolean;
  userLanguage: string;
  userName: string;
  userPhone: string;
  emergencyContacts: EmergencyContact[];
  
  // Accessibility Preferences
  theme: AppThemeName;
  voiceSpeed: number; // 0.5 to 2.0
  voiceVolume: number; // 0.0 to 1.0
  hapticFeedback: boolean;
  screenReaderActive: boolean;

  // Active Screen States / Mock Data
  isDetecting: boolean;
  obstaclesDetected: Array<{ id: string; label: string; distance: string; direction: string; confidence: number; x: number; y: number; width: number; height: number }>;
  currentRoute: {
    destination: string;
    eta: string;
    distanceRemaining: string;
    nextInstruction: string;
    progress: number; // 0 to 100
  } | null;
  detectedBus: {
    line: string;
    destination: string;
    eta: string;
    isBoardingReady: boolean;
  } | null;
  detectedMedicine: {
    name: string;
    dosage: string;
    frequency: string;
    warnings: string;
    isPrescriptionVerified: boolean;
  } | null;
  ocrHistory: Array<{ id: string; text: string; timestamp: string }>;
  
  // Emergency State
  sosActive: boolean;
  sosCountdown: number;

  // Notification Alerts
  notifications: NotificationItem[];

  // Setters & Actions
  setOnboardingCompleted: (userName: string, userPhone: string, contact: EmergencyContact) => void;
  setUserLanguage: (lang: string) => void;
  setTheme: (theme: AppThemeName) => void;
  setVoiceSpeed: (speed: number) => void;
  setVoiceVolume: (volume: number) => void;
  setHapticFeedback: (enabled: boolean) => void;
  setScreenReaderActive: (enabled: boolean) => void;
  setDetecting: (enabled: boolean) => void;
  setObstacles: (obstacles: AppState['obstaclesDetected']) => void;
  startRoute: (destination: string) => void;
  stopRoute: () => void;
  detectBus: (bus: AppState['detectedBus']) => void;
  detectMedicine: (med: AppState['detectedMedicine']) => void;
  addOcrHistory: (text: string) => void;
  startSOSCountdown: () => void;
  cancelSOS: () => void;
  triggerSOS: () => void;
  addNotification: (type: NotificationItem['type'], title: string, message: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetOnboarding: () => void;
}

// Initial Mock Notifications
const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'medicine',
    title: 'Medicine Reminder',
    message: 'Time to take Metformin (Dosage: 500mg) after food.',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'battery',
    title: 'Low Battery Warning',
    message: 'Battery level is at 15%. Voice feedback volume optimized.',
    timestamp: '1 hr ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'navigation',
    title: 'Destination Approaching',
    message: 'Saved Location: "Home" is 50 meters away.',
    timestamp: '2 hrs ago',
    read: true,
  }
];

export const useAppStore = create<AppState>((set) => ({
  // Authentication & Onboarding
  isOnboarded: false,
  userLanguage: 'English',
  userName: '',
  userPhone: '',
  emergencyContacts: [
    { name: 'Rajesh Kumar', phone: '+91 9876543210', relationship: 'Son' }
  ],

  // Accessibility Preferences
  theme: 'dark', // Accessibility default starts in dark mode
  voiceSpeed: 1.0,
  voiceVolume: 0.8,
  hapticFeedback: true,
  screenReaderActive: false,

  // Active Screen States / Mock Data
  isDetecting: false,
  obstaclesDetected: [
    { id: '1', label: 'Doorway', distance: '1.5m', direction: 'front-left', confidence: 0.92, x: 20, y: 15, width: 35, height: 60 },
    { id: '2', label: 'Staircase Down', distance: '3.0m', direction: 'center', confidence: 0.88, x: 50, y: 40, width: 40, height: 45 }
  ],
  currentRoute: null,
  detectedBus: null,
  detectedMedicine: null,
  ocrHistory: [
    { id: '1', text: 'Paracetamol 500mg. Take one tablet twice daily after meals.', timestamp: '2026-07-31, 14:30' },
    { id: '2', text: 'PLATFORM 4 - Bus arriving: 301 to Shivajinagar.', timestamp: '2026-07-31, 11:20' }
  ],

  // Emergency SOS State
  sosActive: false,
  sosCountdown: 5,

  // Notification Alerts
  notifications: initialNotifications,

  // Setters & Actions
  setOnboardingCompleted: (userName, userPhone, contact) => set(() => ({
    isOnboarded: true,
    userName,
    userPhone,
    emergencyContacts: [contact],
  })),

  setUserLanguage: (lang) => set(() => ({ userLanguage: lang })),
  setTheme: (theme) => set(() => ({ theme })),
  setVoiceSpeed: (speed) => set(() => ({ voiceSpeed: Math.max(0.5, Math.min(2.0, speed)) })),
  setVoiceVolume: (volume) => set(() => ({ voiceVolume: Math.max(0.0, Math.min(1.0, volume)) })),
  setHapticFeedback: (enabled) => set(() => ({ hapticFeedback: enabled })),
  setScreenReaderActive: (enabled) => set(() => ({ screenReaderActive: enabled })),

  setDetecting: (enabled) => set(() => ({ isDetecting: enabled })),
  setObstacles: (obstacles) => set(() => ({ obstaclesDetected: obstacles })),

  startRoute: (destination) => set(() => ({
    currentRoute: {
      destination,
      eta: '8 mins',
      distanceRemaining: '450 meters',
      nextInstruction: 'Walk straight for 30 meters, then turn left.',
      progress: 10,
    }
  })),

  stopRoute: () => set(() => ({ currentRoute: null })),

  detectBus: (bus) => set(() => ({ detectedBus: bus })),
  detectMedicine: (med) => set(() => ({ detectedMedicine: med })),

  addOcrHistory: (text) => set((state) => ({
    ocrHistory: [
      { id: Date.now().toString(), text, timestamp: new Date().toLocaleString() },
      ...state.ocrHistory
    ]
  })),

  startSOSCountdown: () => set(() => ({ sosCountdown: 5 })),
  cancelSOS: () => set(() => ({ sosActive: false, sosCountdown: 5 })),
  triggerSOS: () => set((state) => {
    // Add warning notification
    const sosNotification: NotificationItem = {
      id: Date.now().toString(),
      type: 'sos',
      title: 'SOS Alert Dispatched',
      message: `Emergency coordinates sent to ${state.emergencyContacts[0]?.name || 'contacts'}.`,
      timestamp: 'Just now',
      read: false,
    };
    return {
      sosActive: true,
      notifications: [sosNotification, ...state.notifications],
    };
  }),

  addNotification: (type, title, message) => set((state) => ({
    notifications: [
      {
        id: Date.now().toString(),
        type,
        title,
        message,
        timestamp: 'Just now',
        read: false,
      },
      ...state.notifications
    ]
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  clearAllNotifications: () => set(() => ({ notifications: [] })),

  resetOnboarding: () => set(() => ({
    isOnboarded: false,
    userName: '',
    userPhone: '',
    currentRoute: null,
    detectedBus: null,
    detectedMedicine: null,
  })),
}));
