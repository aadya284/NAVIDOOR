import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText, stopSpeech } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { NotificationCard } from '../components/Cards';
import { SecondaryButton } from '../components/Buttons';
import { Bell, Trash2 } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

interface Props {
  navigation: NavigationProp;
}

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const notifications = useAppStore((state) => state.notifications);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const clearAllNotifications = useAppStore((state) => state.clearAllNotifications);

  React.useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    speakText(`Notifications screen. You have ${unreadCount} unread accessibility alerts.`, voiceSpeed, voiceVolume);
  }, []);

  const handleNotificationPress = (id: string, title: string, message: string) => {
    triggerHaptic('light');
    markNotificationRead(id);
    speakText(`Alert: ${title}. ${message}`, voiceSpeed, voiceVolume);
  };

  const handleClearAll = () => {
    triggerHaptic('heavy');
    clearAllNotifications();
    speakText('All notifications cleared.', voiceSpeed, voiceVolume);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Bell size={28} color={theme.colors.primary} />
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Alert History</Text>
        </View>
        {notifications.length > 0 && (
          <Pressable
            onPress={handleClearAll}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Clear all notifications"
            style={styles.clearBtn}
          >
            <Trash2 size={22} color={theme.colors.error} />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Bell size={64} color={customTheme.textSecondary} style={{ opacity: 0.3 }} />
            <Text style={[styles.emptyText, { color: customTheme.textSecondary }]}>
              No active alerts. All systems operational.
            </Text>
          </View>
        ) : (
          notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              title={notif.title}
              message={notif.message}
              type={notif.type}
              timestamp={notif.timestamp}
              read={notif.read}
              onPress={() => handleNotificationPress(notif.id, notif.title, notif.message)}
            />
          ))
        )}
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

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginLeft: spacing.sm,
  },
  clearBtn: {
    padding: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  backBtn: {
    marginHorizontal: spacing.lg,
  },
});
