import { useState } from 'react';
import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';
import { getParkByIdSync } from '../services/parks';
import type { Visit } from '../types/models';

interface DiaryGroup {
  key: string;
  icon: string;
  name: string;
  loc: string;
  visits: Visit[];
}

function groupVisits(visits: Visit[]): DiaryGroup[] {
  const groups = new Map<string, DiaryGroup>();
  for (const visit of visits) {
    const park = visit.parkId ? getParkByIdSync(visit.parkId) : undefined;
    const key = visit.parkId ?? `manual:${visit.manualParkName}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        icon: park?.icon ?? '🏕️',
        name: park?.name ?? visit.manualParkName ?? 'Unnamed park',
        loc: park?.loc ?? 'MANUAL ENTRY',
        visits: [],
      });
    }
    groups.get(key)!.visits.push(visit);
  }
  return [...groups.values()];
}

export function CampDiary({ visits }: { visits: Visit[] }) {
  const groups = groupVisits(visits);

  if (groups.length === 0) {
    return <Text style={styles.empty}>Check off a park to start your camp diary.</Text>;
  }

  return (
    <View>
      {groups.map((g) => (
        <DiaryItem key={g.key} group={g} />
      ))}
    </View>
  );
}

function DiaryItem({ group }: { group: DiaryGroup }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.item}>
      <Pressable style={styles.head} onPress={() => setOpen((v) => !v)}>
        <View style={styles.stamp}>
          <Text style={styles.stampIcon}>{group.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{group.name}</Text>
          <Text style={styles.loc}>{group.loc}</Text>
        </View>
        <Text style={styles.chevron}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.body}>
          {group.visits.map((v) => (
            <View key={v.id} style={styles.visitBlock}>
              {v.dates ? <Text style={styles.dates}>{v.dates}</Text> : null}
              {v.photoUrls.length > 0 && (
                <View style={styles.photoRow}>
                  {v.photoUrls.map((url) => (
                    <View key={url} style={styles.photoThumbWrap}>
                      <Image source={{ uri: url }} style={styles.photoThumb} />
                    </View>
                  ))}
                </View>
              )}
              {v.notes ? <Text style={styles.note}>{v.notes}</Text> : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    padding: 20,
    textAlign: 'center',
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12.5,
  },
  item: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.xl,
    marginBottom: 10,
    overflow: 'hidden',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  stamp: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampIcon: {
    fontSize: 16,
  },
  name: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.ink,
    fontWeight: '600',
  },
  loc: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 12,
    color: colors.muted,
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  visitBlock: {
    marginTop: 8,
  },
  dates: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    color: colors.muted,
    marginBottom: 6,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  photoThumbWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    overflow: 'hidden',
    backgroundColor: colors.canvasLight,
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.bodyText,
    lineHeight: 19,
    backgroundColor: colors.canvasLight,
    borderRadius: radii.md,
    padding: 10,
  },
});
