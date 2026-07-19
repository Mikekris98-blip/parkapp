import { StyleSheet, Text } from 'react-native';
import { fonts, radii, tierColors, type MembershipTier } from '../theme/theme';

export function TierPill({ tier }: { tier: MembershipTier }) {
  const { bg, fg } = tierColors[tier];
  return <Text style={[styles.pill, { backgroundColor: bg, color: fg }]}>{tier.toUpperCase()}</Text>;
}

const styles = StyleSheet.create({
  pill: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.round,
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
});
