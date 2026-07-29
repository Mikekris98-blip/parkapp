import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';
import type { FunGuide } from '../types/models';

interface Props {
  guide: FunGuide;
  unlocked: boolean;
  onPress: () => void;
}

export function GuideCard({ guide, unlocked, onPress }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{guide.title}</Text>
        <Text style={styles.theme}>{guide.theme}</Text>
      </View>
      <Pressable
        onPress={onPress}
        disabled={unlocked}
        style={[styles.pickBtn, unlocked && styles.pickBtnUnlocked]}
      >
        <Text style={[styles.pickBtnText, unlocked && styles.pickBtnTextUnlocked]}>
          {unlocked ? '✓ Unlocked' : '🔒 Unlock'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.lg,
    backgroundColor: colors.canvasLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13.5,
    color: colors.ink,
  },
  theme: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  pickBtn: {
    borderWidth: 1.5,
    borderColor: colors.pine,
    borderRadius: radii.sm,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  pickBtnUnlocked: {
    backgroundColor: colors.pine,
  },
  pickBtnText: {
    fontFamily: fonts.display,
    fontSize: 10.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.pine,
  },
  pickBtnTextUnlocked: {
    color: colors.paper,
  },
});
