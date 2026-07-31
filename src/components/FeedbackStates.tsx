import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Info, AlertCircle, CheckCircle } from 'lucide-react-native';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { PrimaryButton } from './Buttons';

interface StateProps {
  title: string;
  message: string;
  onAction?: () => void;
  actionTitle?: string;
}

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading, please wait...' }) => {
  const theme = useTheme() as AppThemeType;

  return (
    <View
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.messageText, { color: theme.colors.onSurface, marginTop: spacing.md }]}>
        {message}
      </Text>
    </View>
  );
};

export const EmptyState: React.FC<StateProps> = ({ title, message, onAction, actionTitle }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  return (
    <View
      accessible={true}
      accessibilityLabel={`${title}. ${message}`}
      style={styles.container}
    >
      <Info size={48} color={customTheme.textSecondary} />
      <Text style={[styles.titleText, { color: theme.colors.onSurface, marginTop: spacing.md }]}>
        {title}
      </Text>
      <Text style={[styles.subText, { color: customTheme.textSecondary }]}>
        {message}
      </Text>
      {onAction && actionTitle && (
        <PrimaryButton
          title={actionTitle}
          onPress={onAction}
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

export const ErrorState: React.FC<StateProps> = ({ title, message, onAction, actionTitle }) => {
  const theme = useTheme() as AppThemeType;

  return (
    <View
      accessible={true}
      accessibilityLabel={`Error occurred. ${title}. ${message}`}
      style={styles.container}
    >
      <AlertCircle size={48} color={theme.colors.error} />
      <Text style={[styles.titleText, { color: theme.colors.onSurface, marginTop: spacing.md }]}>
        {title}
      </Text>
      <Text style={[styles.subText, { color: theme.colors.error }]}>
        {message}
      </Text>
      {onAction && actionTitle && (
        <PrimaryButton
          title={actionTitle}
          onPress={onAction}
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

export const SuccessState: React.FC<StateProps> = ({ title, message, onAction, actionTitle }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  return (
    <View
      accessible={true}
      accessibilityLabel={`Success! ${title}. ${message}`}
      style={styles.container}
    >
      <CheckCircle size={48} color={customTheme.success} />
      <Text style={[styles.titleText, { color: theme.colors.onSurface, marginTop: spacing.md }]}>
        {title}
      </Text>
      <Text style={[styles.subText, { color: theme.colors.onSurfaceVariant }]}>
        {message}
      </Text>
      {onAction && actionTitle && (
        <PrimaryButton
          title={actionTitle}
          onPress={onAction}
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  actionButton: {
    marginTop: spacing.md,
    minWidth: 200,
  },
});
