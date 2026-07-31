import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { Home, Navigation2, Camera, User, Settings as SettingsIcon } from 'lucide-react-native';
import { useAppStore } from '../store/appStore';
import { AppThemeType } from '../theme/theme';

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AISmartNavigationScreen from '../screens/AISmartNavigationScreen';
import IndoorNavigationScreen from '../screens/IndoorNavigationScreen';
import OutdoorNavigationScreen from '../screens/OutdoorNavigationScreen';
import PublicTransportScreen from '../screens/PublicTransportScreen';
import OCRReaderScreen from '../screens/OCRReaderScreen';
import MedicineAssistantScreen from '../screens/MedicineAssistantScreen';
import VoiceAssistantScreen from '../screens/VoiceAssistantScreen';
import EmergencySOSScreen from '../screens/EmergencySOSScreen';
import FamilyCompanionScreen from '../screens/FamilyCompanionScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Stack Parameter List
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  AISmartNavigation: undefined;
  IndoorNavigation: undefined;
  OutdoorNavigation: undefined;
  PublicTransport: undefined;
  OCRReader: undefined;
  MedicineAssistant: undefined;
  VoiceAssistant: undefined;
  EmergencySOS: undefined;
  FamilyCompanion: undefined;
  Notifications: undefined;
  ProfileTab: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigation Config
const BottomTabNavigator = () => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: customTheme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: customTheme.border,
          borderTopWidth: Math.max(1, customTheme.cardBorderWidth),
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          tabBarAccessibilityLabel: 'Home Tab. Double tap to view your main dashboard.',
        }}
      />
      <Tab.Screen
        name="NavigationTab"
        component={OutdoorNavigationScreen}
        options={{
          tabBarLabel: 'Navigation',
          tabBarIcon: ({ color, size }) => <Navigation2 size={size} color={color} />,
          tabBarAccessibilityLabel: 'Navigation Tab. Double tap to open outdoor walking route helper.',
        }}
      />
      <Tab.Screen
        name="CameraTab"
        component={AISmartNavigationScreen}
        options={{
          tabBarLabel: 'Camera',
          tabBarIcon: ({ color, size }) => <Camera size={size} color={color} />,
          tabBarAccessibilityLabel: 'Camera Tab. Double tap to launch AI live obstacle detection.',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          tabBarAccessibilityLabel: 'Profile Tab. Double tap to view personal details and emergency contacts.',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const isOnboarded = useAppStore((state) => state.isOnboarded);
  const theme = useTheme() as AppThemeType;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {!isOnboarded ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </>
      )}
      
      {/* Feature Screens */}
      <Stack.Screen name="AISmartNavigation" component={AISmartNavigationScreen} />
      <Stack.Screen name="IndoorNavigation" component={IndoorNavigationScreen} />
      <Stack.Screen name="OutdoorNavigation" component={OutdoorNavigationScreen} />
      <Stack.Screen name="PublicTransport" component={PublicTransportScreen} />
      <Stack.Screen name="OCRReader" component={OCRReaderScreen} />
      <Stack.Screen name="MedicineAssistant" component={MedicineAssistantScreen} />
      <Stack.Screen name="VoiceAssistant" component={VoiceAssistantScreen} />
      <Stack.Screen name="EmergencySOS" component={EmergencySOSScreen} />
      <Stack.Screen name="FamilyCompanion" component={FamilyCompanionScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
