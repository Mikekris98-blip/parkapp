import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlusIcon } from '../components/icons';
import { ProgressRing } from '../components/ProgressRing';
import { TierPill } from '../components/TierPill';
import { VisitedParkRow } from '../components/VisitedParkRow';
import { useAuth } from '../context/AuthContext';
import { usePaywall } from '../context/PaywallContext';
import { useVisits } from '../hooks/useVisits';
import { getParkByIdSync, totalParkCount } from '../services/parks';
import { FREE_TIER_PARK_CAP } from '../constants';
import { colors, fonts, radii } from '../theme/theme';
import type { AppStackParamList, MainTabParamList } from '../navigation/types';
import type { Visit } from '../types/models';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<AppStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const { openPaywall } = usePaywall();
  const { visits, distinctVisitedCount } = useVisits();
  const tier = profile?.tier ?? 'free';

  const total = totalParkCount();
  const cap = tier === 'free' ? FREE_TIER_PARK_CAP : total;
  const shown = Math.min(distinctVisitedCount, cap);
  const pct = cap > 0 ? (shown / cap) * 100 : 0;
  const subText =
    tier === 'free'
      ? `${Math.max(0, cap - distinctVisitedCount)} more before you hit your free limit`
      : `${Math.max(0, total - distinctVisitedCount)} left to complete every Ontario Provincial Park`;

  function displayFor(visit: Visit) {
    const park = visit.parkId ? getParkByIdSync(visit.parkId) : undefined;
    return {
      icon: park?.icon ?? '🏕️',
      name: park?.name ?? visit.manualParkName ?? 'Unnamed park',
      loc: park?.loc ?? 'MANUAL ENTRY',
    };
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Text style={styles.title}>My Trail</Text>
        <TierPill tier={tier} />
      </View>

      <FlatList
        data={visits}
        keyExtractor={(v) => v.id}
        ListHeaderComponent={
          <>
            <View style={styles.progressCard}>
              <ProgressRing pct={pct} label={`${shown}/${cap}`} />
              <View style={styles.progressText}>
                <Text style={styles.progressLabel}>Parks logged</Text>
                <Text style={styles.progressSub}>{subText}</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.logButton, pressed && styles.logButtonPressed]}
              onPress={() => navigation.getParent()?.navigate('AddPark')}
            >
              <PlusIcon size={26} color={colors.paper} />
              <Text style={styles.logButtonText}>Log a New Park</Text>
            </Pressable>

            {tier === 'free' && (
              <Text style={styles.upgradeBanner} onPress={openPaywall}>
                <Text style={styles.upgradeText}>
                  Unlock <Text style={styles.upgradeBold}>unlimited parks</Text>, trail maps, and treasure trails.{' '}
                </Text>
                <Text style={styles.upgradeGo}>Upgrade →</Text>
              </Text>
            )}

            <Text style={styles.sectionLabel}>Recently logged</Text>
          </>
        }
        renderItem={({ item }) => {
          const d = displayFor(item);
          return (
            <VisitedParkRow
              icon={d.icon}
              name={d.name}
              loc={d.loc}
              dates={item.dates}
              onPress={() => navigation.getParent()?.navigate('ParkDetail', { visit: item })}
            />
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No parks logged yet — tap ＋ to check one off.</Text>}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  appBar: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.pine,
    textTransform: 'uppercase',
  },
  progressCard: {
    margin: 16,
    padding: 20,
    borderRadius: radii.xxl,
    backgroundColor: colors.pine,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressText: {
    flex: 1,
  },
  progressLabel: {
    fontFamily: fonts.display,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.canvasLight,
    opacity: 0.85,
  },
  progressSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.canvasLight,
    opacity: 0.65,
    marginTop: 4,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 18,
    paddingVertical: 16,
    borderRadius: radii.xl,
    backgroundColor: colors.rust,
    shadowColor: colors.rust,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  logButtonPressed: {
    opacity: 0.85,
  },
  logButtonText: {
    fontFamily: fonts.display,
    fontSize: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.paper,
  },
  upgradeBanner: {
    marginHorizontal: 20,
    marginBottom: 6,
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: colors.canvasLight,
    borderWidth: 1,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  upgradeText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.ink,
    lineHeight: 18,
  },
  upgradeBold: {
    fontFamily: fonts.bodyBold,
    color: colors.rustDark,
  },
  upgradeGo: {
    fontFamily: fonts.display,
    fontSize: 11,
    color: colors.rust,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionLabel: {
    fontFamily: fonts.display,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  empty: {
    padding: 20,
    textAlign: 'center',
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12.5,
  },
});
