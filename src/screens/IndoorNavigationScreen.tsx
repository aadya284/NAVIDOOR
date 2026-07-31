import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Map, ScanLine, Compass, Landmark, Radio, ChevronRight, HelpCircle } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'IndoorNavigation'>;

interface Props {
  navigation: NavigationProp;
}

const BUILDINGS = [
  { id: 'b1', name: 'General Hospital Clinic', address: 'Block A, Floors 1-4', beaconCount: 12, qrActive: true },
  { id: 'b2', name: 'Metro Terminal Station', address: 'Main Lobby & Platforms', beaconCount: 24, qrActive: true },
  { id: 'b3', name: 'Central Shopping Plaza', address: 'East Wing Offices', beaconCount: 8, qrActive: false },
];

const IndoorNavigationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);

  // Screen states
  const [selectedBuilding, setSelectedBuilding] = React.useState<string | null>(null);
  const [activeFloor, setActiveFloor] = React.useState(1);
  const [qrScanning, setQrScanning] = React.useState(false);
  const [beaconStatus, setBeaconStatus] = React.useState('SEARCHING'); // SEARCHING | CONNECTED
  const [indoorInstructions, setIndoorInstructions] = React.useState('Stand near a QR code or beacon to begin routing.');

  React.useEffect(() => {
    speakText('Indoor Navigation screen. Select a pre-mapped building or scan a nearby QR marker to calibrate location.', voiceSpeed, voiceVolume);
  }, []);

  const selectBuilding = (id: string, name: string) => {
    triggerHaptic('medium');
    setSelectedBuilding(id);
    setBeaconStatus('CONNECTED');
    setIndoorInstructions('Beacon calibrating... Located on Floor 1, Reception area. Speak destination like pharmacy or elevator.');
    speakText(`Connected to ${name} indoor navigation. Beacons active. You are near Floor 1 reception.`, voiceSpeed, voiceVolume);
  };

  const handleQrScan = () => {
    triggerHaptic('heavy');
    setQrScanning(true);
    speakText('Camera scanning QR location marker.', voiceSpeed, voiceVolume);
    setTimeout(() => {
      setQrScanning(false);
      triggerHaptic('success');
      setIndoorInstructions('QR Mat detected: Lift Lobby Entrance. Elevator is 10 steps front.');
      speakText('QR code scan successful. Located at elevator lobby. Elevator is ten steps directly in front of you.', voiceSpeed, voiceVolume);
    }, 2500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Landmark size={28} color={theme.colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Indoor Navigation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {!selectedBuilding ? (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              MAPPED BUILDINGS NEAR YOU
            </Text>
            {BUILDINGS.map((building) => (
              <Pressable
                key={building.id}
                onPress={() => selectBuilding(building.id, building.name)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${building.name}. Address ${building.address}. Beacons ${building.beaconCount} detected.`}
                style={({ pressed }) => [
                  styles.buildingCard,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.outline,
                    borderWidth: customTheme.cardBorderWidth,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={styles.buildingIconBg}>
                  <Radio size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.buildingInfo}>
                  <Text style={[styles.buildingName, { color: theme.colors.onSurface }]}>
                    {building.name}
                  </Text>
                  <Text style={[styles.buildingAddress, { color: customTheme.textSecondary }]}>
                    {building.address}
                  </Text>
                </View>
                <ChevronRight size={20} color={customTheme.textSecondary} />
              </Pressable>
            ))}

            <View style={styles.quickQrBox}>
              <Text style={[styles.qrTitle, { color: theme.colors.onSurface }]}>
                Scan QR Location Code
              </Text>
              <Text style={[styles.qrDesc, { color: customTheme.textSecondary }]}>
                Quick-align your position inside buildings by scanning wall or door QR markers.
              </Text>
              <PrimaryButton
                title={qrScanning ? 'Scanning...' : 'Scan Room QR'}
                onPress={handleQrScan}
              />
            </View>
          </>
        ) : (
          <View style={styles.activeNavBox}>
            {/* Beacon status panel */}
            <View style={[styles.beaconIndicator, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Radio size={20} color={theme.colors.secondary} />
              <Text style={[styles.beaconText, { color: theme.colors.onSurface }]}>
                BEACONS: {beaconStatus === 'CONNECTED' ? 'ACTIVE & CALIBRATED' : 'SEARCHING'}
              </Text>
            </View>

            {/* Floor switcher */}
            <View style={styles.floorControlRow}>
              {[1, 2, 3].map((f) => (
                <Pressable
                  key={f}
                  onPress={() => {
                    setActiveFloor(f);
                    triggerHaptic('light');
                    speakText(`Switched map to Floor ${f}`, voiceSpeed, voiceVolume);
                  }}
                  style={[
                    styles.floorBtn,
                    {
                      backgroundColor: activeFloor === f ? theme.colors.primary : theme.colors.surfaceVariant,
                      borderColor: theme.colors.outline,
                      borderWidth: customTheme.cardBorderWidth,
                    },
                  ]}
                >
                  <Text style={[styles.floorBtnText, { color: activeFloor === f ? '#FFFFFF' : theme.colors.onSurface }]}>
                    FL {f}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Simulated Vector Floor Map */}
            <View style={[styles.vectorMap, { backgroundColor: '#1E293B' }]}>
              <View style={[styles.mapRoom, { top: 20, left: 20, width: 80, height: 60 }]} />
              <View style={[styles.mapRoom, { top: 20, right: 20, width: 80, height: 60 }]} />
              <View style={[styles.mapCorridor, { top: 90, left: 20, right: 20, height: 30 }]} />
              <View style={[styles.userPointer, { top: 100, left: 120 }]} />
              
              <Text style={styles.mapLabelText}>FLOORPLAN VIEW</Text>
            </View>

            {/* Auditory directions log console */}
            <View style={[styles.guidanceBox, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Compass size={24} color={theme.colors.primary} />
              <Text style={[styles.guidanceTitle, { color: theme.colors.onSurface }]}>
                DIRECTIONS LOG
              </Text>
              <Text style={[styles.guidanceText, { color: theme.colors.onSurfaceVariant }]}>
                {indoorInstructions}
              </Text>
            </View>

            <View style={styles.rowButtons}>
              <SecondaryButton
                title="Scan QR"
                onPress={handleQrScan}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <PrimaryButton
                title="Stop Routing"
                onPress={() => {
                  setSelectedBuilding(null);
                  triggerHaptic('medium');
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}

      </ScrollView>
      <SecondaryButton
        title="Go Back"
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      />
    </View>
  );
};

export default IndoorNavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginLeft: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginVertical: spacing.md,
  },
  buildingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  buildingIconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  buildingInfo: {
    flex: 1,
  },
  buildingName: {
    fontSize: 18,
    fontWeight: '700',
  },
  buildingAddress: {
    fontSize: 13,
    marginTop: 2,
  },
  quickQrBox: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(128, 128, 128, 0.3)',
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  qrDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  activeNavBox: {
    width: '100%',
  },
  beaconIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  beaconText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  floorControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  floorBtn: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  floorBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  vectorMap: {
    height: 200,
    borderRadius: borderRadius.md,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  mapRoom: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#475569',
    backgroundColor: '#334155',
  },
  mapCorridor: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#475569',
    backgroundColor: '#1E293B',
  },
  userPointer: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mapLabelText: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  guidanceBox: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  guidanceTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  guidanceText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
  },
  rowButtons: {
    flexDirection: 'row',
  },
  backBtn: {
    marginHorizontal: spacing.lg,
  },
});
