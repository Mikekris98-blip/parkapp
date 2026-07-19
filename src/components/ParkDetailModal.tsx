import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors, fonts, radii, type MembershipTier } from '../theme/theme';
import type { Park } from '../types/models';

interface Props {
  park: Park | null;
  tier: MembershipTier;
  onClose: () => void;
}

export function ParkDetailModal({ park, tier, onClose }: Props) {
  const visible = park !== null;
  const isPaid = tier !== 'free';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        {park && (
          <View style={styles.sheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Pressable onPress={onClose} hitSlop={12} style={styles.close}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>

              <Text style={styles.name}>{park.name}</Text>
              <Text style={styles.loc}>{park.loc}</Text>
              <Text style={styles.desc}>{park.description}</Text>

              <View style={styles.mapBox}>
                <Text style={styles.mapEmoji}>🗺️</Text>
              </View>

              <Text style={styles.sectionLabel}>Amenities</Text>
              <View style={styles.amenityRow}>
                {park.amenities.map((a) => (
                  <View key={a} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{a}</Text>
                  </View>
                ))}
              </View>

              {isPaid ? (
                <>
                  <Text style={styles.sectionLabel}>Campsites</Text>
                  {Array.from({ length: Math.min(park.campsiteCount, 4) }).map((_, i) => (
                    <View key={i} style={styles.listRow}>
                      <Text style={styles.listRowLabel}>Site {i + 1}</Text>
                      <Text style={styles.listRowTag}>{i % 2 === 0 ? 'ELECTRICAL' : 'NON-ELECTRICAL'}</Text>
                    </View>
                  ))}
                  <Text style={styles.sectionLabel}>Trails</Text>
                  {Array.from({ length: Math.min(park.trailCount, 4) }).map((_, i) => (
                    <View key={i} style={styles.listRow}>
                      <Text style={styles.listRowLabel}>Trail {i + 1}</Text>
                      <Text style={styles.listRowTag}>{2 + i} KM</Text>
                    </View>
                  ))}
                </>
              ) : (
                <View style={styles.lockedBlock}>
                  <Text style={styles.lockedText}>Campsite details and trail listings unlock with Membership.</Text>
                  <Button
                    title="See Membership"
                    onPress={() => Alert.alert('Coming soon', 'The upgrade flow is being built in a later stage.')}
                  />
                </View>
              )}
              <View style={{ height: 24 }} />
            </ScrollView>
          </View>
        )}
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
  name: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.pine,
    textTransform: 'uppercase',
    paddingRight: 24,
  },
  loc: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    color: colors.muted,
    marginTop: 4,
  },
  desc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.bodyText,
    lineHeight: 20,
    marginTop: 14,
  },
  mapBox: {
    height: 110,
    borderRadius: radii.lg,
    backgroundColor: colors.canvasLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  mapEmoji: {
    fontSize: 26,
  },
  sectionLabel: {
    fontFamily: fonts.display,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 18,
    marginBottom: 8,
  },
  amenityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  amenityTag: {
    fontFamily: fonts.mono,
    backgroundColor: colors.canvasLight,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: radii.sm,
  },
  amenityText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.ink,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE9D8',
  },
  listRowLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
  },
  listRowTag: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    color: colors.muted,
  },
  lockedBlock: {
    marginTop: 16,
    padding: 16,
    borderRadius: radii.lg,
    backgroundColor: colors.canvasLight,
    alignItems: 'center',
  },
  lockedText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.bodyText,
    marginBottom: 10,
    textAlign: 'center',
  },
});
