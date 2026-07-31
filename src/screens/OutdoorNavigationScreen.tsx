import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store/appStore';
import { speakText } from '../utils/speech';
import { triggerHaptic } from '../utils/haptics';
import { spacing, borderRadius, AppThemeType } from '../theme/theme';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Search, Navigation, Compass, AlertOctagon, MapPin, Pill, Bus, Landmark } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'OutdoorNavigation'>;

interface Props {
  navigation: NavigationProp;
}

const NEARBY_PLACES = [
  { name: 'City Pharmacy', distance: '120m', type: 'pill' },
  { name: 'Main Bus Stop', distance: '250m', type: 'bus' },
  { name: 'Public Park', distance: '400m', type: 'landmark' },
];

const OutdoorNavigationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppThemeType;
  const customTheme = theme.custom;

  // Store params
  const voiceSpeed = useAppStore((state) => state.voiceSpeed);
  const voiceVolume = useAppStore((state) => state.voiceVolume);
  const currentRoute = useAppStore((state) => state.currentRoute);
  const startRoute = useAppStore((state) => state.startRoute);
  const stopRoute = useAppStore((state) => state.stopRoute);

  // States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);

  React.useEffect(() => {
    speakText('Outdoor Route Navigator active. Enter destination or double tap to use voice search.', voiceSpeed, voiceVolume);
  }, []);

  const handleSearchSubmit = () => {
    if (!searchQuery) return;
    triggerHaptic('medium');
    setIsSearching(true);
    speakText(`Searching route for: ${searchQuery}.`, voiceSpeed, voiceVolume);
    
    setTimeout(() => {
      setIsSearching(false);
      startRoute(searchQuery);
      triggerHaptic('success');
      speakText(`Route configured to ${searchQuery}. Total walking duration is 8 minutes. Turn-by-turn guidance active.`, voiceSpeed, voiceVolume);
    }, 2000);
  };

  const handleNearbyClick = (placeName: string) => {
    setSearchQuery(placeName);
    speakText(`Selected nearby place: ${placeName}.`, voiceSpeed, voiceVolume);
    startRoute(placeName);
  };

  const handleCancelRoute = () => {
    triggerHaptic('heavy');
    stopRoute();
    speakText('Navigation cancelled.', voiceSpeed, voiceVolume);
  };

  const getNearbyIcon = (type: string) => {
    switch (type) {
      case 'pill': return <Pill size={20} color={theme.colors.primary} />;
      case 'bus': return <Bus size={20} color={theme.colors.primary} />;
      default: return <Landmark size={20} color={theme.colors.primary} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Navigation size={28} color={theme.colors.primary} />
        <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Outdoor Navigation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Header */}
        <View style={styles.searchRow}>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.onSurface, borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Type or Speak Destination..."
            placeholderTextColor={customTheme.textSecondary}
            onSubmitEditing={handleSearchSubmit}
          />
          <Pressable
            onPress={handleSearchSubmit}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Search Route"
            style={({ pressed }) => [
              styles.searchBtn,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.outline,
                borderWidth: customTheme.cardBorderWidth,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Search size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        {!currentRoute ? (
          <>
            {/* Simulated Map Background */}
            <View style={[styles.mapContainer, { backgroundColor: '#E2E8F0' }]}>
              {/* Draw static shapes representing mock roads & buildings */}
              <View style={[styles.mapRoad, { top: 70, left: 0, right: 0, height: 40 }]} />
              <View style={[styles.mapRoad, { left: 100, top: 0, bottom: 0, width: 40 }]} />
              <View style={[styles.mapBuilding, { top: 10, left: 10, width: 70, height: 50 }]} />
              <View style={[styles.mapBuilding, { bottom: 10, right: 20, width: 100, height: 70 }]} />
              <View style={[styles.userPointer, { top: 80, left: 110 }]} />
              <Text style={styles.mapLabel}>OPENSTREETMAP INTERFACE</Text>
            </View>

            {/* Quick nearby points */}
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              QUICK ACCESSIBILITY NEARBY
            </Text>
            {NEARBY_PLACES.map((place) => (
              <Pressable
                key={place.name}
                onPress={() => handleNearbyClick(place.name)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${place.name}, distance ${place.distance} away.`}
                style={({ pressed }) => [
                  styles.nearbyRow,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.outline,
                    borderWidth: customTheme.cardBorderWidth,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={styles.nearbyIconBg}>
                  {getNearbyIcon(place.type)}
                </View>
                <View style={styles.nearbyInfo}>
                  <Text style={[styles.nearbyName, { color: theme.colors.onSurface }]}>{place.name}</Text>
                  <Text style={[styles.nearbyDist, { color: customTheme.textSecondary }]}>{place.distance}</Text>
                </View>
                <Navigation size={20} color={theme.colors.primary} />
              </Pressable>
            ))}
          </>
        ) : (
          <View style={styles.activeRouteBox}>
            {/* Live routing map */}
            <View style={[styles.mapContainer, { backgroundColor: '#1E293B' }]}>
              {/* Path Routing lines */}
              <View style={[styles.mapRoad, { top: 90, left: 0, right: 0, height: 20, backgroundColor: '#334155' }]} />
              <View style={[styles.routePath, { top: 100, left: 0, width: 200, height: 4 }]} />
              <View style={[styles.userPointer, { top: 92, left: 150 }]} />
              
              {/* Bounding obstacle threat overlay */}
              <View style={styles.obstacleWarningBox}>
                <AlertOctagon size={16} color="#FF0000" />
                <Text style={styles.obstacleWarningText}>Obstacle 12m front</Text>
              </View>

              <Text style={styles.mapLabel}>LIVE ROUTING FEED</Text>
            </View>

            {/* Direction directions card */}
            <View style={[styles.directionCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline, borderWidth: customTheme.cardBorderWidth }]}>
              <View style={styles.statsRow}>
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: customTheme.textSecondary }]}>DESTINATION</Text>
                  <Text style={[styles.statValue, { color: theme.colors.onSurface }]} numberOfLines={1}>
                    {currentRoute.destination}
                  </Text>
                </View>
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: customTheme.textSecondary }]}>ETA</Text>
                  <Text style={[styles.statValue, { color: theme.colors.primary }]}>{currentRoute.eta}</Text>
                </View>
                <View style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: customTheme.textSecondary }]}>DISTANCE</Text>
                  <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>{currentRoute.distanceRemaining}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Step indicator */}
              <View style={styles.instructionRow}>
                <Compass size={28} color={theme.colors.primary} />
                <Text style={[styles.instructionText, { color: theme.colors.onSurface }]}>
                  {currentRoute.nextInstruction}
                </Text>
              </View>
            </View>

            <PrimaryButton
              title="Stop Route Guidance"
              onPress={handleCancelRoute}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}
      </ScrollView>
      <SecondaryButton
        title="Back to Dashboard"
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      />
    </View>
  );
};

export default OutdoorNavigationScreen;

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
  searchRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    fontWeight: '600',
  },
  searchBtn: {
    width: 56,
    height: 56,
    borderTopRightRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 220,
    borderRadius: borderRadius.md,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: '#CBD5E1',
  },
  mapBuilding: {
    position: 'absolute',
    backgroundColor: '#94A3B8',
    borderRadius: borderRadius.sm,
  },
  routePath: {
    position: 'absolute',
    backgroundColor: '#3B82F6',
  },
  userPointer: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  obstacleWarningBox: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  obstacleWarningText: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 4,
  },
  mapLabel: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginVertical: spacing.md,
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  nearbyIconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyName: {
    fontSize: 16,
    fontWeight: '700',
  },
  nearbyDist: {
    fontSize: 13,
    marginTop: 2,
  },
  activeRouteBox: {
    width: '100%',
  },
  directionCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statCol: {
    flex: 1,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginBottom: spacing.md,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginLeft: spacing.md,
  },
  backBtn: {
    marginHorizontal: spacing.lg,
  },
});
