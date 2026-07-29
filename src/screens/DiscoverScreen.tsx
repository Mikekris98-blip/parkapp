import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GuideCard } from '../components/GuideCard';
import { ParkCard } from '../components/ParkCard';
import { ParkDetailModal } from '../components/ParkDetailModal';
import { ProgressBar } from '../components/ProgressBar';
import { TierPill } from '../components/TierPill';
import { TrailCard } from '../components/TrailCard';
import { UnlockItemModal } from '../components/UnlockItemModal';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { usePaywall } from '../context/PaywallContext';
import { useVisits } from '../hooks/useVisits';
import { seedGuides } from '../data/guides';
import { seedTrails } from '../data/trails';
import {
  isGuideUnlocked,
  isTrailUnlocked,
  remainingFreeGuidePicks,
  remainingFreeTrailPicks,
} from '../services/entitlements';
import { searchParks, totalParkCount } from '../services/parks';
import { addPremiumGuidePick, addPremiumTrailPick, purchaseGuide, purchaseTrail } from '../services/users';
import { colors, fonts, radii } from '../theme/theme';
import type { AppStackParamList, MainTabParamList } from '../navigation/types';
import type { Park } from '../types/models';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Discover'>,
  NativeStackScreenProps<AppStackParamList>
>;

interface UnlockTarget {
  kind: 'trail' | 'guide';
  id: string;
  name: string;
}

// Treasure Trails / Community Fun Guides use placeholder admin-curated
// content — see src/data/trails.ts and guides.ts.
export function DiscoverScreen({ navigation }: Props) {
  const { showAlert } = useAlert();
  const { profile, firebaseUser, refreshProfile } = useAuth();
  const { openPaywall } = usePaywall();
  const { distinctVisitedCount } = useVisits();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Park[]>([]);
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [unlockTarget, setUnlockTarget] = useState<UnlockTarget | null>(null);
  const tier = profile?.tier ?? 'free';
  const total = totalParkCount();

  useEffect(() => {
    searchParks(query).then(setResults);
  }, [query]);

  function handleTrailPress(id: string, name: string) {
    if (isTrailUnlocked(profile, id)) return;
    setUnlockTarget({ kind: 'trail', id, name });
  }

  function handleGuidePress(id: string, title: string) {
    if (isGuideUnlocked(profile, id)) return;
    setUnlockTarget({ kind: 'guide', id, name: title });
  }

  function closeUnlockModal() {
    setUnlockTarget(null);
  }

  function handleUpgrade() {
    closeUnlockModal();
    openPaywall();
  }

  async function handleUseFreePick() {
    if (!firebaseUser || !unlockTarget) return;
    try {
      if (unlockTarget.kind === 'trail') {
        await addPremiumTrailPick(firebaseUser.uid, unlockTarget.id, profile?.premiumPicks);
      } else {
        await addPremiumGuidePick(firebaseUser.uid, unlockTarget.id, profile?.premiumPicks);
      }
      await refreshProfile();
      closeUnlockModal();
    } catch {
      showAlert('Something went wrong', 'Could not unlock that right now. Please try again.');
    }
  }

  async function handlePurchase() {
    if (!firebaseUser || !unlockTarget) return;
    try {
      if (unlockTarget.kind === 'trail') {
        await purchaseTrail(firebaseUser.uid, unlockTarget.id);
      } else {
        await purchaseGuide(firebaseUser.uid, unlockTarget.id);
      }
      await refreshProfile();
      closeUnlockModal();
    } catch {
      showAlert('Something went wrong', 'Could not complete that purchase. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Text style={styles.title}>Discover</Text>
        <TierPill tier={tier} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <ParkCard park={item} onPress={() => setSelectedPark(item)} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <ProgressBar label={`${distinctVisitedCount} of ${total} Ontario Parks visited`} pct={(distinctVisitedCount / total) * 100} />

            <View style={styles.searchWrap}>
              <TextInput
                style={styles.search}
                placeholder="Search Ontario Provincial Parks…"
                placeholderTextColor={colors.mutedLight}
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Pressable
              style={styles.fullDbBanner}
              onPress={() => navigation.getParent()?.navigate('FullParksDatabase')}
            >
              <Text style={styles.fullDbText}>
                Browse the <Text style={styles.fullDbBold}>full Parks Database</Text> — every park, alphabetically, with maps and amenities.
              </Text>
              <Text style={styles.fullDbGo}>Open →</Text>
            </Pressable>
          </>
        }
        ListEmptyComponent={<Text style={styles.empty}>No parks match that search.</Text>}
        ListFooterComponent={
          <>
            <Text style={styles.sectionLabel}>Treasure Trails</Text>
            {seedTrails.map((trail) => (
              <TrailCard
                key={trail.id}
                trail={trail}
                locked={!isTrailUnlocked(profile, trail.id)}
                onPress={() => handleTrailPress(trail.id, trail.name)}
              />
            ))}

            <Text style={styles.sectionLabel}>Community Fun Guides</Text>
            {seedGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                unlocked={isGuideUnlocked(profile, guide.id)}
                onPress={() => handleGuidePress(guide.id, guide.title)}
              />
            ))}
          </>
        }
      />

      <ParkDetailModal park={selectedPark} tier={tier} onClose={() => setSelectedPark(null)} />

      {unlockTarget && (
        <UnlockItemModal
          visible={Boolean(unlockTarget)}
          itemName={unlockTarget.name}
          itemKindLabel={unlockTarget.kind === 'trail' ? 'Treasure Trail' : 'Fun Guide'}
          tier={tier}
          remainingFreePicks={
            unlockTarget.kind === 'trail' ? remainingFreeTrailPicks(profile) : remainingFreeGuidePicks(profile)
          }
          onClose={closeUnlockModal}
          onUpgrade={handleUpgrade}
          onUseFreePick={handleUseFreePick}
          onPurchase={handlePurchase}
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.pine,
    textTransform: 'uppercase',
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
  },
  search: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.ink,
    backgroundColor: colors.canvasLight,
  },
  fullDbBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  fullDbText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.ink,
    lineHeight: 18,
  },
  fullDbBold: {
    fontFamily: fonts.bodyBold,
  },
  fullDbGo: {
    fontFamily: fonts.display,
    fontSize: 11,
    color: colors.pine,
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
    paddingTop: 6,
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
