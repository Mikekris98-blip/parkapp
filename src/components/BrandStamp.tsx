import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme/theme';

export function BrandStamp({ size = 132 }: { size?: number }) {
  return (
    <View style={[styles.stamp, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.peak, { fontSize: size * 0.29 }]}>⛰</Text>
      <Text style={styles.word}>TRAILSTAMP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    borderWidth: 3,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  peak: {
    color: colors.canvasLight,
  },
  word: {
    fontFamily: fonts.display,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
    color: colors.canvasLight,
  },
});
