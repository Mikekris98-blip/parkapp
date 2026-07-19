import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';

interface Props {
  label: string;
  pct: number; // 0-100
}

export function ProgressBar({ label, pct }: Props) {
  const clamped = Math.min(Math.max(pct, 0), 100);
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.pct}>{Math.round(clamped)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: radii.xl,
    backgroundColor: colors.pine,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 12.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.canvasLight,
    opacity: 0.9,
    flexShrink: 1,
  },
  pct: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '700',
    color: colors.gold,
  },
  track: {
    height: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: colors.gold,
  },
});
