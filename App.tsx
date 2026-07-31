import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { useAppStore } from './src/store/appStore';
import { appLightTheme, appDarkTheme, appHighContrastTheme } from './src/theme/theme';
import { AppNavigator } from './src/navigation/AppNavigator';
import { TTSCaptionOverlay } from './src/components/Dialogs';

export default function App() {
  const currentThemeName = useAppStore((state) => state.theme);

  // Select dynamic theme based on state store
  const getActiveTheme = () => {
    switch (currentThemeName) {
      case 'high-contrast':
        return appHighContrastTheme;
      case 'light':
        return appLightTheme;
      case 'dark':
      default:
        return appDarkTheme;
    }
  };

  const activeTheme = getActiveTheme();

  return (
    <PaperProvider theme={activeTheme}>
      <NavigationContainer>
        <StatusBar
          backgroundColor={activeTheme.colors.background}
          barStyle={currentThemeName === 'light' ? 'dark-content' : 'light-content'}
        />
        
        {/* Main Application Navigator */}
        <AppNavigator />
        
        {/* Global TTS visual captions overlay for accessibility debugging */}
        <TTSCaptionOverlay />
      </NavigationContainer>
    </PaperProvider>
  );
}
