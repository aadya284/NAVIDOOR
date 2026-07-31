import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import { useTheme, Portal } from 'react-native-paper';
import { ShieldCheck, Info } from 'lucide-react-native';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { PrimaryButton, SecondaryButton } from './Buttons';
import { subscribeToCaptions } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { useAppStore } from '../store/appStore';

interface PermissionDialogProps {
  visible: boolean;
  permissionName: string;
  description: string;
  icon?: React.ReactNode;
  onGrant: () => void;
  onDeny: () => void;
}

export const PermissionDialog: React.FC<PermissionDialogProps> = ({
  visible,
  permissionName,
  description,
  icon,
  onGrant,
  onDeny,
}) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      accessibilityViewIsModal={true}
    >
      <View style={styles.modalOverlay}>
        <View
          accessible={true}
          accessibilityLabel={`Permission request: ${permissionName}. Description: ${description}`}
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
              borderWidth: customTheme.cardBorderWidth,
            },
          ]}
        >
          <View style={[styles.modalIconBg, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
            {icon || <ShieldCheck size={40} color={theme.colors.primary} />}
          </View>
          
          <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
            Enable {permissionName}
          </Text>
          
          <Text style={[styles.modalDesc, { color: theme.colors.onSurfaceVariant }]}>
            {description}
          </Text>

          <View style={styles.buttonSpacing}>
            <PrimaryButton
              title="Allow Access"
              onPress={onGrant}
              accessibilityLabel={`Allow Access to ${permissionName}`}
            />
            <SecondaryButton
              title="Maybe Later"
              onPress={onDeny}
              accessibilityLabel={`Deny Access to ${permissionName}`}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Global Text-to-Speech caption box that shows spoken text as subtitles
export const TTSCaptionOverlay: React.FC = () => {
  const theme = useTheme() as AppThemeType;
  const [caption, setCaption] = React.useState<string>('');

  React.useEffect(() => {
    // Listen for speech events and show the subtitle bar
    const unsubscribe = subscribeToCaptions((text) => {
      setCaption(text);
      if (text) {
        triggerHaptic('light');
      }
    });
    return unsubscribe;
  }, []);

  const currentTheme = useAppStore((state) => state.theme);

  if (!caption) return null;

  return (
    <View style={styles.captionContainer}>
      <View style={[
        styles.captionBubble,
        {
          backgroundColor: currentTheme === 'high-contrast' ? '#000000' : 'rgba(0, 0, 0, 0.85)',
          borderColor: '#FFFFFF',
          borderWidth: currentTheme === 'high-contrast' ? 2 : 1,
        }
      ]}>
        <Info size={16} color="#FFFF00" style={styles.captionIcon} />
        <Text style={styles.captionText}>{caption}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  modalIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalDesc: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  buttonSpacing: {
    width: '100%',
  },
  captionContainer: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
    alignItems: 'center',
  },
  captionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    maxWidth: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  captionIcon: {
    marginRight: spacing.sm,
    flexShrink: 0,
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    flexShrink: 1,
    lineHeight: 20,
    textAlign: 'center',
  },
});
