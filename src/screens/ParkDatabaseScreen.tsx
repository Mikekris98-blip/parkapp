import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParkCard } from '../components/ParkCard';
import { ParkDetailModal } from '../components/ParkDetailModal';
import { TierPill } from '../components/TierPill';
import { useAuth } from '../context/AuthContext';
import { searchParks } from '../services/parks';
import { colors, fonts, radii } from '../theme/theme';
import type { AppStackParamList } from '../navigation/types';
import type { Park } from '../types/models';

type Props = NativeStackScreenProps<AppStackParamList, 'ParkDatabase'>;

export function ParkDatabaseScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Park[]>([]);
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const tier = profile?.tier ?? 'free';

  useEffect(() => {
    searchParks(query).then(setResults);
  }, [query]);

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
          placeholder="Search Ontario Provincial Parks…"
          placeholderTextColor={colors.mutedLight}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <ParkCard park={item} onPress={() => setSelectedPark(item)} />}
        ListEmptyComponent={<Text style={styles.empty}>No parks match that search.</Text>}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />

      <ParkDetailModal park={selectedPark} tier={tier} onClose={() => setSelectedPark(null)} />
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
