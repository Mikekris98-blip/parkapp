import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';
import type { FunGuide } from '../types/models';

interface Props {
  guide: FunGuide;
  locked: boolean;
  picked: boolean;
  onToggle: () => void;
}

export function GuideCard({ guide, locked, picked, onToggle }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{guide.title}</Text>
        <Text style={styles.theme}>{guide.theme}</Text>
      </View>
      <Pressable
        onPress={onToggle}
        disabled={locked}
        style={[styles.pickBtn, picked && !locked && styles.pickBtnPicked]}
      >
        <Text style={[styles.pickBtnText, picked && !locked && styles.pickBtnTextPicked]}>
          {locked ? '🔒' : picked ? 'Selected' : 'Select'}
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
  pickBtnPicked: {
    backgroundColor: colors.pine,
  },
  pickBtnText: {
    fontFamily: fonts.display,
    fontSize: 10.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.pine,
  },
  pickBtnTextPicked: {
    color: colors.paper,
  },
});
