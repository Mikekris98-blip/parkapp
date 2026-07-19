import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';
import type { Park } from '../types/models';

export function ParkCard({ park, onPress }: { park: Park; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>{park.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{park.name}</Text>
        <Text style={styles.loc}>{park.loc}</Text>
        <Text style={styles.counts}>
          {park.campsiteCount} campsites · {park.trailCount} trails
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 19,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.ink,
    fontWeight: '600',
  },
  loc: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    color: colors.muted,
    marginTop: 2,
  },
  counts: {
    fontFamily: fonts.body,
    fontSize: 10.5,
    color: colors.pine,
    marginTop: 4,
  },
});
