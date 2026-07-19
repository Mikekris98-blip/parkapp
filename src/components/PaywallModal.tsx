import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, type MembershipTier } from '../theme/theme';

interface TierInfo {
  tier: MembershipTier;
  name: string;
  price: string;
  features: string[];
}

const TIERS: TierInfo[] = [
  { tier: 'free', name: 'Free', price: '$0', features: ['Track 3–5 parks', 'Photos & notes', 'Progress tracker'] },
  {
    tier: 'membership',
    name: 'Membership',
    price: '$4.99/mo',
    features: ['Unlimited park tracking', 'Campsite & trail maps', 'Public or private entries'],
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: '$8.99/mo',
    features: [
      'Everything in Membership',
      'Treasure trails included',
      'Choose your fun guides',
      'Yearly member patch',
    ],
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onChooseTier: (tier: MembershipTier) => void;
}

export function PaywallModal({ visible, onClose, onChooseTier }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable onPress={onClose} hitSlop={12} style={styles.close}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
            <Text style={styles.title}>Choose Your Tier</Text>

            <View style={styles.compare}>
              {TIERS.map((t) => (
                <View key={t.tier} style={[styles.box, t.tier === 'membership' && styles.boxReco]}>
                  <View style={styles.boxTop}>
                    <Text style={styles.boxName}>{t.name.toUpperCase()}</Text>
                    <Text style={styles.boxPrice}>{t.price}</Text>
                  </View>
                  {t.features.map((f) => (
                    <Text key={f} style={styles.feature}>
                      •  {f}
                    </Text>
                  ))}
                  {t.tier !== 'free' && (
                    <Pressable
                      style={[styles.ctaBtn, t.tier === 'membership' ? styles.ctaPrimary : styles.ctaGhost]}
                      onPress={() => onChooseTier(t.tier)}
                    >
                      <Text style={[styles.ctaText, t.tier === 'membership' ? styles.ctaTextPrimary : styles.ctaTextGhost]}>
                        Choose {t.name}
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>

            <Text style={styles.backHint}>This is a prototype — no payment is processed.</Text>
            <View style={{ height: 12 }} />
          </ScrollView>
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
    maxHeight: '85%',
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
  title: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.pine,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  compare: {
    marginTop: 18,
    gap: 10,
  },
  box: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: 14,
  },
  boxReco: {
    borderColor: colors.gold,
    backgroundColor: colors.canvasLight,
  },
  boxTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxName: {
    fontFamily: fonts.display,
    fontSize: 14,
    letterSpacing: 0.5,
    color: colors.pine,
  },
  boxPrice: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '700',
    color: colors.rustDark,
  },
  feature: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.bodyText,
    lineHeight: 20,
    marginTop: 6,
  },
  ctaBtn: {
    marginTop: 10,
    borderRadius: radii.md,
    paddingVertical: 12,
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
    fontSize: 12,
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
    marginTop: 16,
  },
});
