import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { INDIVIDUAL_ITEM_PRICE, PREMIUM_FREE_PICKS_PER_YEAR } from '../constants';
import { colors, fonts, radii, type MembershipTier } from '../theme/theme';

interface Props {
  visible: boolean;
  itemName: string;
  itemKindLabel: 'Treasure Trail' | 'Fun Guide';
  tier: MembershipTier;
  remainingFreePicks: number;
  onClose: () => void;
  onUpgrade: () => void;
  onUseFreePick: () => void;
  onPurchase: () => void;
}

export function UnlockItemModal({
  visible,
  itemName,
  itemKindLabel,
  tier,
  remainingFreePicks,
  onClose,
  onUpgrade,
  onUseFreePick,
  onPurchase,
}: Props) {
  const year = new Date().getFullYear();
  const kindPlural = `${itemKindLabel}s`;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.close}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          <Text style={styles.eyebrow}>{itemKindLabel}</Text>
          <Text style={styles.title}>{itemName}</Text>

          {tier === 'premium' ? (
            remainingFreePicks > 0 ? (
              <>
                <Text style={styles.body}>
                  Premium includes {PREMIUM_FREE_PICKS_PER_YEAR} free {kindPlural} per year. You have{' '}
                  <Text style={styles.bodyBold}>{remainingFreePicks}</Text> left for {year}.
                </Text>
                <Pressable style={[styles.ctaBtn, styles.ctaPrimary]} onPress={onUseFreePick}>
                  <Text style={[styles.ctaText, styles.ctaTextPrimary]}>Use a free pick</Text>
                </Pressable>
                <Pressable style={[styles.ctaBtn, styles.ctaGhost]} onPress={onPurchase}>
                  <Text style={[styles.ctaText, styles.ctaTextGhost]}>
                    Buy for {INDIVIDUAL_ITEM_PRICE} instead
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.body}>
                  You've used all {PREMIUM_FREE_PICKS_PER_YEAR} of your free {kindPlural} for {year}.
                </Text>
                <Pressable style={[styles.ctaBtn, styles.ctaPrimary]} onPress={onPurchase}>
                  <Text style={[styles.ctaText, styles.ctaTextPrimary]}>Buy for {INDIVIDUAL_ITEM_PRICE}</Text>
                </Pressable>
              </>
            )
          ) : (
            <>
              <Text style={styles.body}>
                Upgrade to Premium for {PREMIUM_FREE_PICKS_PER_YEAR} free {kindPlural} a year, or buy just this one.
              </Text>
              <Pressable style={[styles.ctaBtn, styles.ctaPrimary]} onPress={onUpgrade}>
                <Text style={[styles.ctaText, styles.ctaTextPrimary]}>Upgrade to Premium</Text>
              </Pressable>
              <Pressable style={[styles.ctaBtn, styles.ctaGhost]} onPress={onPurchase}>
                <Text style={[styles.ctaText, styles.ctaTextGhost]}>Buy for {INDIVIDUAL_ITEM_PRICE}</Text>
              </Pressable>
            </>
          )}

          <Text style={styles.backHint}>This is a prototype — no payment is processed.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,15,8,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    paddingTop: 24,
  },
  close: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    fontSize: 20,
    color: colors.muted,
  },
  eyebrow: {
    fontFamily: fonts.display,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.rust,
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.pine,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 4,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.bodyText,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 14,
  },
  bodyBold: {
    fontFamily: fonts.bodyBold,
    color: colors.rustDark,
  },
  ctaBtn: {
    marginTop: 14,
    borderRadius: radii.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  ctaPrimary: {
    backgroundColor: colors.rust,
  },
  ctaGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.pine,
  },
  ctaText: {
    fontFamily: fonts.display,
    fontSize: 12.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  ctaTextPrimary: {
    color: colors.paper,
  },
  ctaTextGhost: {
    color: colors.pine,
  },
  backHint: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.mutedLight,
    textAlign: 'center',
    marginTop: 18,
  },
});
