import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { CampsiteNotes } from './CampsiteNotes';
import { ParkOutlineSvg } from './ParkOutlineSvg';
import { usePaywall } from '../context/PaywallContext';
import { colors, fonts, radii, type MembershipTier } from '../theme/theme';
import type { Park } from '../types/models';

interface Props {
  park: Park;
  tier: MembershipTier;
  userId: string | undefined;
  forceOpen?: boolean;
}

export function FullDbItem({ park, tier, userId, forceOpen }: Props) {
  const [open, setOpen] = useState(Boolean(forceOpen));
  const { openPaywall } = usePaywall();
  const isPaid = tier !== 'free';

  // forceOpen only sets the initial state above — this instance may already
  // be mounted (e.g. jumping to a park from the map view) when it changes,
  // so react to updates too.
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  return (
    <View style={styles.item}>
      <Pressable style={styles.head} onPress={() => setOpen((v) => !v)}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>{park.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{park.name}</Text>
          <Text style={styles.loc}>{park.loc}</Text>
        </View>
        <Text style={styles.chevron}>{open ? '▴' : '▾'}</Text>
      </Pressable>

      {open && (
        <View style={styles.body}>
          <Text style={styles.address}>{park.address}</Text>
          <View style={styles.mapBox}>
            <ParkOutlineSvg pin={park.coord} />
            <Text style={styles.mapCaption}>Approx. location</Text>
          </View>
          <Text style={styles.desc}>{park.description}</Text>
          <View style={styles.amenityRow}>
            {park.amenities.map((a) => (
              <View key={a} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>

          {isPaid && userId ? (
            <CampsiteNotes userId={userId} parkId={park.id} campsiteCount={park.campsiteCount} />
          ) : (
            <View style={styles.lockedBlock}>
              <Text style={styles.lockedText}>
                Membership unlocks the clickable site map with per-site notes and photos.
              </Text>
              <Button title="See Membership" onPress={openPaywall} />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.xl,
    backgroundColor: colors.paper,
    overflow: 'hidden',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 19,
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
  chevron: {
    fontSize: 12,
    color: colors.muted,
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFE9D8',
  },
  address: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.muted,
    marginBottom: 8,
  },
  mapBox: {
    height: 100,
    borderRadius: radii.md,
    backgroundColor: colors.canvasLight,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  mapCaption: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.mutedLight,
  },
  desc: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.bodyText,
    lineHeight: 19,
  },
  amenityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  amenityTag: {
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
