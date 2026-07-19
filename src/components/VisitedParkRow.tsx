import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';

interface Props {
  icon: string;
  name: string;
  loc: string;
  onPress: () => void;
}

export function VisitedParkRow({ icon, name, loc, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.stamp}>
        <Text style={styles.stampIcon}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.loc}>{loc}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.canvasLight,
    borderRadius: radii.xl,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  stamp: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.pine,
    borderWidth: 2,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stampIcon: {
    fontSize: 20,
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
  loc: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    color: colors.muted,
    marginTop: 2,
  },
});
