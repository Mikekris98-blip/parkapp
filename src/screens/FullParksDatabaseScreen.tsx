import { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FullDbItem } from '../components/FullDbItem';
import { ParkOutlineSvg } from '../components/ParkOutlineSvg';
import { TierPill } from '../components/TierPill';
import { useAuth } from '../context/AuthContext';
import { seedParks } from '../data/parks';
import { colors, fonts, radii } from '../theme/theme';
import type { AppStackParamList } from '../navigation/types';
import type { Park } from '../types/models';

type Props = NativeStackScreenProps<AppStackParamList, 'FullParksDatabase'>;
type ViewMode = 'list' | 'map';

const alphabeticalParks = [...seedParks].sort((a, b) => a.name.localeCompare(b.name));

export function FullParksDatabaseScreen({ navigation }: Props) {
  const { profile, firebaseUser } = useAuth();
  const tier = profile?.tier ?? 'free';
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('list');
  const [jumpToId, setJumpToId] = useState<string | null>(null);
  const listRef = useRef<FlatList<Park>>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alphabeticalParks;
    return alphabeticalParks.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  function jumpToPark(park: Park) {
    setView('list');
    setQuery('');
    setJumpToId(park.id);
    setTimeout(() => {
      const index = alphabeticalParks.findIndex((p) => p.id === park.id);
      if (index >= 0) listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
    }, 100);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Text style={styles.back} onPress={() => navigation.goBack()}>
          ←
        </Text>
        <Text style={styles.title}>Parks Database</Text>
        <TierPill tier={tier} />
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Search all Ontario Provincial Parks…"
          placeholderTextColor={colors.mutedLight}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.viewToggle}>
        <Pressable style={[styles.toggleOpt, view === 'list' && styles.toggleOptActive]} onPress={() => setView('list')}>
          <Text style={[styles.toggleText, view === 'list' && styles.toggleTextActive]}>☰ List</Text>
        </Pressable>
        <Pressable style={[styles.toggleOpt, view === 'map' && styles.toggleOptActive]} onPress={() => setView('map')}>
          <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>📍 Map</Text>
        </Pressable>
      </View>

      {view === 'list' ? (
        <FlatList
          ref={listRef}
          data={filtered}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <FullDbItem park={item} tier={tier} userId={firebaseUser?.uid} forceOpen={item.id === jumpToId} />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No parks match that search.</Text>}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          onScrollToIndexFailed={(info) => {
            // Items are variable-height (accordion open/closed), so FlatList's
            // estimate can be off enough to fail outright on first try —
            // jump to the estimated offset, then retry once it's settled.
            listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false });
            setTimeout(() => {
              listRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0 });
            }, 100);
          }}
        />
      ) : (
        <View style={styles.mapWrap}>
          <View style={styles.mapFrame}>
            <ParkOutlineSvg />
            {alphabeticalParks.map((p) => (
              <Pressable
                key={p.id}
                style={[styles.pin, { left: `${(p.coord.x / 300) * 100}%`, top: `${(p.coord.y / 300) * 100}%` }]}
                onPress={() => jumpToPark(p)}
              >
                <Text style={styles.pinIcon}>📍</Text>
                <Text style={styles.pinLabel}>{p.name.replace(' Provincial Park', '')}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.mapCaption}>Pin placement is illustrative, not exact GPS — tap a pin to open that park</Text>
        </View>
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
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    fontSize: 18,
    color: colors.pine,
  },
  title: {
    flex: 1,
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
  viewToggle: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  toggleOpt: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  toggleOptActive: {
    backgroundColor: colors.pine,
    borderColor: colors.pine,
  },
  toggleText: {
    fontFamily: fonts.display,
    fontSize: 11,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  toggleTextActive: {
    color: colors.paper,
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
  mapWrap: {
    flex: 1,
  },
  mapFrame: {
    marginHorizontal: 20,
    height: 420,
    borderRadius: radii.xxl,
    backgroundColor: colors.canvasLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pin: {
    position: 'absolute',
    transform: [{ translateX: -20 }, { translateY: -30 }],
    alignItems: 'center',
  },
  pinIcon: {
    fontSize: 18,
  },
  pinLabel: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.pine,
    backgroundColor: colors.paper,
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 1,
    marginTop: 2,
    maxWidth: 80,
  },
  mapCaption: {
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    marginTop: 10,
    marginHorizontal: 20,
  },
});
