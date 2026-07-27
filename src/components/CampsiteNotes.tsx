import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';
import { addSiteNotePhoto, getSiteNote, saveSiteNoteText } from '../services/siteNotes';
import { pickAndUploadImage } from '../services/photos';
import { useAlert } from '../context/AlertContext';

interface Props {
  userId: string;
  parkId: string;
  campsiteCount: number;
}

// Tapping a numbered site loads (and lets the user edit) that site's own
// notes and photos — a real Firestore-backed feature per the Stage 1 data
// model (SiteNote), unlike the prototype's inert demo textarea.
export function CampsiteNotes({ userId, parkId, campsiteCount }: Props) {
  const { showAlert } = useAlert();
  const [selectedSite, setSelectedSite] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedSite === null) return;
    let cancelled = false;
    setLoading(true);
    getSiteNote(userId, parkId, selectedSite)
      .then((note) => {
        if (cancelled) return;
        setNotes(note?.notes ?? '');
        setPhotoUrls(note?.photoUrls ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setNotes('');
        setPhotoUrls([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedSite, userId, parkId]);

  async function handleNotesBlur() {
    if (selectedSite === null) return;
    try {
      await saveSiteNoteText(userId, parkId, selectedSite, notes);
    } catch {
      showAlert('Could not save note', 'Please try again.');
    }
  }

  async function handleAddPhoto() {
    if (selectedSite === null) return;
    setUploading(true);
    try {
      const url = await pickAndUploadImage(`siteNotes/${userId}/${parkId}/${selectedSite}/${Date.now()}.jpg`);
      if (url) {
        await addSiteNotePhoto(userId, parkId, selectedSite, url);
        setPhotoUrls((prev) => [...prev, url]);
      }
    } catch {
      showAlert('Upload failed', 'Could not upload that photo. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <View>
      <Text style={styles.sectionLabel}>Site Map — tap a site</Text>
      <View style={styles.grid}>
        {Array.from({ length: campsiteCount }).map((_, i) => {
          const num = i + 1;
          const selected = selectedSite === num;
          return (
            <Pressable
              key={num}
              style={[styles.dot, selected && styles.dotSelected]}
              onPress={() => setSelectedSite(selected ? null : num)}
            >
              <Text style={[styles.dotText, selected && styles.dotTextSelected]}>{num}</Text>
            </Pressable>
          );
        })}
      </View>

      {selectedSite !== null && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Site {selectedSite}</Text>
          {loading ? (
            <Text style={styles.loading}>Loading…</Text>
          ) : (
            <>
              <TextInput
                style={styles.textarea}
                placeholder="Notes about this site…"
                placeholderTextColor={colors.mutedLight}
                value={notes}
                onChangeText={setNotes}
                onBlur={handleNotesBlur}
                multiline
              />
              <View style={styles.photoRow}>
                {photoUrls.map((url) => (
                  <Image key={url} source={{ uri: url }} style={styles.photo} />
                ))}
                <Pressable style={styles.addPhoto} onPress={handleAddPhoto} disabled={uploading}>
                  <Text style={styles.addPhotoText}>{uploading ? '…' : '＋'}</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: fonts.display,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 14,
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotSelected: {
    backgroundColor: colors.rust,
  },
  dotText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.canvasLight,
  },
  dotTextSelected: {
    color: colors.paper,
  },
  panel: {
    marginTop: 12,
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: colors.canvasLight,
  },
  panelTitle: {
    fontFamily: fonts.display,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.pine,
    marginBottom: 8,
  },
  loading: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  textarea: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: 10,
    fontFamily: fonts.body,
    fontSize: 12.5,
    minHeight: 56,
    textAlignVertical: 'top',
    backgroundColor: colors.paper,
    color: colors.ink,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.paper,
  },
  addPhoto: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 18,
    color: colors.mutedLight,
  },
});
