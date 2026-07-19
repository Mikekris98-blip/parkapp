import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/theme';
import type { MembershipTier } from '../theme/theme';

interface Props {
  tier: MembershipTier;
  years?: number[];
}

export function PatchShelf({ tier, years }: Props) {
  const currentYear = new Date().getFullYear();
  const displayYears = years ?? [currentYear - 2, currentYear - 1, currentYear];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
      {displayYears.map((year) => {
        const earned = tier === 'premium' && year === currentYear;
        return (
          <View key={year} style={[styles.patch, !earned && styles.patchFuture]}>
            <Text style={[styles.icon, !earned && styles.iconFuture]}>{earned ? '🏅' : '—'}</Text>
            <Text style={[styles.year, !earned && styles.yearFuture]}>{year}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shelf: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 12,
  },
  patch: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 3,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patchFuture: {
    borderStyle: 'dotted',
    backgroundColor: colors.canvasLight,
    opacity: 0.6,
  },
  icon: {
    fontSize: 16,
    color: colors.canvasLight,
  },
  iconFuture: {
    color: colors.muted,
  },
  year: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '700',
    color: colors.canvasLight,
    marginTop: 2,
  },
  yearFuture: {
    color: colors.muted,
  },
});
