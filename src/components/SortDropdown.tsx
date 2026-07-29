import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';

export type SortOption = 'alpha-asc' | 'alpha-desc' | 'date-asc' | 'date-desc';

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'alpha-asc', label: 'Alphabetically (A → Z)' },
  { value: 'alpha-desc', label: 'Alphabetically (Z → A)' },
  { value: 'date-asc', label: 'Chronologically (Oldest first)' },
  { value: 'date-desc', label: 'Chronologically (Newest first)' },
];

interface Props {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={styles.triggerLabel} numberOfLines={1}>
          Sort: {current.label}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            {OPTIONS.map((o) => {
              const active = o.value === value;
              return (
                <Pressable
                  key={o.value}
                  style={[styles.option, active && styles.optionActive]}
                  onPress={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>{o.label}</Text>
                  {active && <Text style={styles.check}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.canvasLight,
    maxWidth: 190,
  },
  triggerLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.bodyText,
  },
  chevron: {
    fontSize: 10,
    color: colors.muted,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,15,8,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  menu: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.paper,
    borderRadius: radii.xl,
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 18,
  },
  optionActive: {
    backgroundColor: colors.canvasLight,
  },
  optionText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.ink,
  },
  optionTextActive: {
    fontFamily: fonts.bodyMedium,
    color: colors.pine,
  },
  check: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.pine,
  },
});
