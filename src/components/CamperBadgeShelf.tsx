import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CAMPER_BADGES } from '../data/badges';
import { colors, fonts } from '../theme/theme';
import type { EarnedBadge } from '../services/badges';

interface Props {
  earned: EarnedBadge[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatEarnedDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function CamperBadgeShelf({ earned }: Props) {
  const earnedAtByKey = new Map(earned.map((e) => [e.key, e.earnedAt]));
  const earnedBadges = CAMPER_BADGES.filter((b) => earnedAtByKey.has(b.key));

  if (earnedBadges.length === 0) {
    return <Text style={styles.empty}>Keep logging parks — your first badge is on its way.</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
      {earnedBadges.map((badge) => (
        <View key={badge.key} style={styles.badge}>
          <View style={styles.ring}>
            <Text style={styles.emoji}>{badge.emoji}</Text>
          </View>
          <Text style={styles.name} numberOfLines={2}>
            {badge.name}
          </Text>
          <Text style={styles.date}>{formatEarnedDate(earnedAtByKey.get(badge.key)!)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shelf: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 14,
  },
  badge: {
    width: 84,
    alignItems: 'center',
  },
  ring: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 10.5,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 13,
  },
  date: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.rustDark,
    marginTop: 3,
  },
  empty: {
    marginHorizontal: 20,
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.muted,
  },
});
