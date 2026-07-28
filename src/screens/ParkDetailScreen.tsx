import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { getParkByIdSync } from '../services/parks';
import { pickAndUploadImage } from '../services/photos';
import { addPhotoToVisit, deleteVisit } from '../services/visits';
import { colors, fonts, radii } from '../theme/theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'ParkDetail'>;

export function ParkDetailScreen({ route, navigation }: Props) {
  const { showAlert, showConfirm } = useAlert();
  const { visit } = route.params;
  const { firebaseUser } = useAuth();
  const park = visit.parkId ? getParkByIdSync(visit.parkId) : undefined;
  const [photoUrls, setPhotoUrls] = useState(visit.photoUrls);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const name = park?.name ?? visit.manualParkName ?? 'Unnamed park';
  const loc = park?.loc ?? 'MANUAL ENTRY';
  const icon = park?.icon ?? '🏕️';

  async function handleAddPhoto() {
    if (!firebaseUser) return;
    setUploading(true);
    try {
      const url = await pickAndUploadImage(`visits/${firebaseUser.uid}/${visit.id}/${Date.now()}.jpg`);
      if (url) {
        await addPhotoToVisit(visit.id, url);
        setPhotoUrls((prev) => [...prev, url]);
      }
    } catch (e) {
      showAlert('Upload failed', 'Could not upload that photo. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleDeletePress() {
    showConfirm(
      'Remove this entry?',
      `This will remove ${name} from your logged parks. This can't be undone.`,
      'Remove',
      handleDeleteConfirmed,
      true
    );
  }

  async function handleDeleteConfirmed() {
    setDeleting(true);
    try {
      await deleteVisit(visit.id, photoUrls);
      navigation.goBack();
    } catch (e) {
      showAlert('Something went wrong', 'Could not remove this entry. Please try again.');
      setDeleting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Text style={styles.back} onPress={() => navigation.goBack()}>
          ←
        </Text>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {name}
        </Text>
        <View style={{ width: 18 }} />
      </View>
      <ScrollView>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>{icon}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>
            {visit.dates ? `${visit.dates.toUpperCase()} · ` : ''}
            {loc}
          </Text>

          <View style={styles.gallery}>
            {photoUrls.map((url) => (
              <Image key={url} source={{ uri: url }} style={styles.photo} />
            ))}
            <Pressable style={styles.addPhoto} onPress={handleAddPhoto} disabled={uploading}>
              <Text style={styles.addPhotoText}>{uploading ? '…' : '＋'}</Text>
            </Pressable>
          </View>

          {visit.notes ? <Text style={styles.note}>{visit.notes}</Text> : null}

          <Pressable style={styles.deleteButton} onPress={handleDeletePress} disabled={deleting}>
            <Text style={styles.deleteButtonText}>{deleting ? 'Removing…' : 'Remove Entry'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  appBar: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    fontSize: 18,
    color: colors.pine,
  },
  headerTitle: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.pine,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  hero: {
    height: 150,
    backgroundColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    fontSize: 52,
  },
  body: {
    padding: 20,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 21,
    color: colors.pine,
    textTransform: 'uppercase',
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    color: colors.muted,
    marginTop: 4,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.canvasLight,
  },
  addPhoto: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 20,
    color: colors.mutedLight,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 21,
    color: colors.ink,
    backgroundColor: colors.canvasLight,
    borderRadius: radii.lg,
    padding: 14,
  },
  deleteButton: {
    marginTop: 22,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  deleteButtonText: {
    fontFamily: fonts.display,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.danger,
  },
});
