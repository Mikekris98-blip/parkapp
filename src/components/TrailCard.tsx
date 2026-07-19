import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';
import type { TreasureTrail } from '../types/models';

export function TrailCard({ trail, locked, onPress }: { trail: TreasureTrail; locked: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, locked && styles.locked, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Text style={styles.iconText}>{trail.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{trail.name}</Text>
        <Text style={styles.desc}>{trail.description}</Text>
        <Text style={styles.clues}>
          {trail.checkpointCount} CHECKPOINTS · PREMIUM
        </Text>
      </View>
      {locked && <Text style={styles.lockBadge}>🔒</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: radii.xl,
    backgroundColor: colors.canvasLight,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  locked: {
    opacity: 0.72,
  },
  pressed: {
    opacity: 0.55,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    fontWeight: '600',
  },
  desc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
    lineHeight: 17,
  },
  clues: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    color: colors.rustDark,
    marginTop: 6,
  },
  lockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    fontSize: 14,
  },
});
