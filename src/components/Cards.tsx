import React from 'react';
import { StyleSheet, Text, Pressable, View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Battery, Wifi, Navigation, Shield, Compass, Calendar, ChevronRight } from 'lucide-react-native';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { triggerHaptic } from '../utils/haptics';
import { useAppStore } from '../store/appStore';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  primary?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  primary = false,
  style,
}) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  const handlePress = () => {
    triggerHaptic('medium');
    onPress();
  };

  const currentTheme = useAppStore((state) => state.theme);

  const cardBg = primary
    ? (currentTheme === 'high-contrast' ? '#000000' : theme.colors.primary)
    : theme.colors.surfaceVariant;

  const textPrimary = primary
    ? (currentTheme === 'high-contrast' ? '#FFFF00' : '#FFFFFF')
    : theme.colors.onSurface;

  const textSecondary = primary
    ? (currentTheme === 'high-contrast' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)')
    : customTheme.textSecondary;

  const outlineColor = currentTheme === 'high-contrast'
    ? '#FFFFFF'
    : (primary ? theme.colors.primary : customTheme.border);

  return (
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      accessibilityHint="Double tap to open this feature."
      style={({ pressed }) => [
        styles.featureCard,
        {
          backgroundColor: cardBg,
          borderColor: outlineColor,
          borderWidth: Math.max(1, customTheme.cardBorderWidth),
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: primary ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)' }]}>
          {icon}
        </View>
        <ChevronRight size={24} color={textPrimary} />
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={[styles.cardTitle, { color: textPrimary }]}>{title}</Text>
        <Text style={[styles.cardSubtitle, { color: textSecondary }]}>{subtitle}</Text>
      </View>
    </Pressable>
  );
};

interface AIStatusCardProps {
  batteryLevel: number;
  gpsActive: boolean;
  internetActive: boolean;
}

export const AIStatusCard: React.FC<AIStatusCardProps> = ({
  batteryLevel,
  gpsActive,
  internetActive,
}) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  return (
    <View
      accessible={true}
      accessibilityLabel={`Telemetry Status. Battery ${batteryLevel} percent. GPS ${gpsActive ? 'Active' : 'Disconnected'}. Internet ${internetActive ? 'Connected' : 'Offline'}.`}
      style={[
        styles.statusCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: customTheme.border,
          borderWidth: Math.max(1, customTheme.cardBorderWidth),
        },
      ]}
    >
      <View style={styles.statusItem}>
        <Battery size={20} color={batteryLevel < 20 ? theme.colors.error : theme.colors.onSurface} />
        <Text style={[styles.statusText, { color: theme.colors.onSurface }]}>{batteryLevel}%</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statusItem}>
        <Compass size={20} color={gpsActive ? customTheme.success : theme.colors.error} />
        <Text style={[styles.statusText, { color: theme.colors.onSurface }]}>
          {gpsActive ? 'GPS FIX' : 'NO GPS'}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statusItem}>
        <Wifi size={20} color={internetActive ? customTheme.accent : theme.colors.error} />
        <Text style={[styles.statusText, { color: theme.colors.onSurface }]}>
          {internetActive ? 'ONLINE' : 'OFFLINE'}
        </Text>
      </View>
    </View>
  );
};

interface NotificationCardProps {
  title: string;
  message: string;
  type: 'obstacle' | 'medicine' | 'sos' | 'navigation' | 'battery' | 'system';
  timestamp: string;
  read: boolean;
  onPress?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  message,
  type,
  timestamp,
  read,
  onPress,
}) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  const handlePress = () => {
    if (onPress) {
      triggerHaptic('light');
      onPress();
    }
  };

  const getAlertColor = () => {
    switch (type) {
      case 'sos':
      case 'obstacle':
        return theme.colors.error;
      case 'medicine':
        return customTheme.warning;
      case 'navigation':
        return theme.colors.primary;
      case 'battery':
        return theme.colors.error;
      default:
        return customTheme.accent;
    }
  };

  return (
    <Pressable
      onPress={onPress ? handlePress : undefined}
      accessible={true}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${read ? '' : 'Unread alert.'} ${title}. ${message}. Recieved ${timestamp}.`}
      style={({ pressed }) => [
        styles.notificationCard,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: read ? customTheme.border : getAlertColor(),
          borderWidth: Math.max(read ? 1 : 2, customTheme.cardBorderWidth),
          opacity: pressed && onPress ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.notifHeader}>
        <View style={styles.notifTitleRow}>
          <View style={[styles.notifDot, { backgroundColor: getAlertColor() }]} />
          <Text style={[styles.notifTitle, { color: theme.colors.onSurface, fontWeight: read ? '600' : '800' }]}>
            {title}
          </Text>
        </View>
        <Text style={[styles.notifTime, { color: customTheme.textSecondary }]}>{timestamp}</Text>
      </View>
      <Text style={[styles.notifMessage, { color: theme.colors.onSurfaceVariant }]}>{message}</Text>
    </Pressable>
  );
};

export const NavigationCard: React.FC<{
  label: string;
  address: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ label, address, onPress, style }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  const handlePress = () => {
    triggerHaptic('medium');
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Route to ${label}. Address ${address}.`}
      style={({ pressed }) => [
        styles.navCard,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: customTheme.border,
          borderWidth: Math.max(1, customTheme.cardBorderWidth),
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <View style={styles.navIconBg}>
        <Navigation size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.navTextContainer}>
        <Text style={[styles.navLabel, { color: theme.colors.onSurface }]}>{label}</Text>
        <Text style={[styles.navAddress, { color: customTheme.textSecondary }]}>{address}</Text>
      </View>
      <ChevronRight size={20} color={customTheme.textSecondary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  featureCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    height: 140,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    marginTop: spacing.sm,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 2,
    lineHeight: 18,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    elevation: 1,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  notificationCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    elevation: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notifDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  notifTitle: {
    fontSize: 16,
    flex: 1,
  },
  notifTime: {
    fontSize: 12,
  },
  notifMessage: {
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 18,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    elevation: 1,
  },
  navIconBg: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  navTextContainer: {
    flex: 1,
  },
  navLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  navAddress: {
    fontSize: 14,
    marginTop: 2,
  },
});
