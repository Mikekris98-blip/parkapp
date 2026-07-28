import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { usePaywall } from '../context/PaywallContext';
import { useVisits } from '../hooks/useVisits';
import { pickAndUploadImage } from '../services/photos';
import { searchParks } from '../services/parks';
import { createVisit } from '../services/visits';
import { FREE_TIER_PARK_CAP } from '../constants';
import { colors, fonts, radii } from '../theme/theme';
import type { AppStackParamList } from '../navigation/types';
import type { Park } from '../types/models';

const MAX_PHOTOS = 3;

type Props = NativeStackScreenProps<AppStackParamList, 'AddPark'>;

export function AddParkScreen({ navigation }: Props) {
  const { showAlert } = useAlert();
  const { firebaseUser, profile } = useAuth();
  const { openPaywall } = usePaywall();
  const { distinctVisitedCount, distinctParkKeys } = useVisits();
  const tier = profile?.tier ?? 'free';

  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<Park[]>([]);
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualName, setManualName] = useState('');
  const [dates, setDates] = useState('');
  const [notes, setNotes] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function handleSearchChange(text: string) {
    setSearchText(text);
    setSelectedPark(null);
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }
    const results = await searchParks(text);
    setSuggestions(results.slice(0, 5));
  }

  function selectSuggestion(park: Park) {
    setSelectedPark(park);
    setSearchText(park.name);
    setSuggestions([]);
  }

  function useManualEntry() {
    setManualMode(true);
    setSelectedPark(null);
    setSuggestions([]);
  }

  async function handleAddPhoto() {
    if (!firebaseUser) return;
    setUploadingPhoto(true);
    try {
      const url = await pickAndUploadImage(`visits/${firebaseUser.uid}/pending/${Date.now()}.jpg`);
      if (url) setPhotoUrls((prev) => [...prev, url]);
    } catch {
      showAlert('Upload failed', 'Could not upload that photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSave() {
    if (!firebaseUser) return;

    const parkKey = selectedPark ? selectedPark.id : manualMode ? `manual:${manualName.trim()}` : null;
    if (!parkKey || (manualMode && !manualName.trim())) {
      showAlert('Pick a park', 'Search and select a park, or add one manually.');
      return;
    }

    const isNewPark = !distinctParkKeys.has(parkKey);
    if (tier === 'free' && isNewPark && distinctVisitedCount >= FREE_TIER_PARK_CAP) {
      openPaywall();
      return;
    }

    setSaving(true);
    try {
      await createVisit({
        userId: firebaseUser.uid,
        parkId: selectedPark ? selectedPark.id : null,
        ...(manualMode ? { manualParkName: manualName.trim() } : {}),
        dates,
        notes,
        photoUrls,
        isPublic: tier === 'free' ? false : isPublic,
      });
      navigation.goBack();
    } catch (e) {
      showAlert('Something went wrong', 'Could not save this entry. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Text style={styles.title}>Log a Park</Text>
        <Text style={styles.cancel} onPress={() => navigation.goBack()}>
          Cancel
        </Text>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          {!manualMode && (
            <View style={styles.field}>
              <Text style={styles.label}>Search Ontario Provincial Parks</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Start typing a park name…"
                placeholderTextColor={colors.mutedLight}
                value={searchText}
                onChangeText={handleSearchChange}
              />
              {suggestions.length > 0 && (
                <View style={styles.suggestions}>
                  {suggestions.map((p) => (
                    <Pressable key={p.id} style={styles.suggestionItem} onPress={() => selectSuggestion(p)}>
                      <Text style={styles.suggestionName}>{p.name}</Text>
                      <Text style={styles.suggestionLoc}>{p.loc}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
              {selectedPark && <Text style={styles.linkedTag}>✓ Linked to park database</Text>}
              <Text style={styles.manualLink} onPress={useManualEntry}>
                Can't find it? Add manually instead
              </Text>
            </View>
          )}

          {manualMode && (
            <FormField
              label="Park / Campground name"
              placeholder="e.g. Killarney Provincial Park"
              value={manualName}
              onChangeText={setManualName}
              autoCapitalize="words"
            />
          )}

          <FormField label="Dates stayed" placeholder="Jun 12 – Jun 15, 2026" value={dates} onChangeText={setDates} />
          <FormField
            label="Notes"
            placeholder="What made this stop memorable?"
            value={notes}
            onChangeText={setNotes}
            multiline
            style={styles.notesInput}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Photos</Text>
            <View style={styles.photoRow}>
              {photoUrls.map((url) => (
                <Image key={url} source={{ uri: url }} style={styles.photoThumb} />
              ))}
              {photoUrls.length < MAX_PHOTOS && (
                <Pressable style={styles.photoSlot} onPress={handleAddPhoto} disabled={uploadingPhoto}>
                  <Text style={styles.photoPlus}>{uploadingPhoto ? '…' : '＋'}</Text>
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleText}>Make this entry public</Text>
              <Pressable
                onPress={() => tier !== 'free' && setIsPublic((v) => !v)}
                style={[styles.switch, isPublic && tier !== 'free' && styles.switchOn]}
              >
                <View style={[styles.knob, isPublic && tier !== 'free' && styles.knobOn]} />
              </Pressable>
            </View>
            {tier === 'free' && <Text style={styles.lockedNote}>🔒 Public/private sharing is a Membership feature</Text>}
          </View>

          <Button title="Save Entry" onPress={handleSave} loading={saving} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.pine,
    textTransform: 'uppercase',
  },
  cancel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  form: {
    padding: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: 6,
  },
  searchInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 11,
    paddingHorizontal: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: colors.paper,
  },
  suggestions: {
    marginTop: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE9D8',
  },
  suggestionName: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
  },
  suggestionLoc: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    marginTop: 2,
  },
  linkedTag: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.pine,
    marginTop: 6,
  },
  manualLink: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.muted,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  photoSlot: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: '#cfc6ad',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlus: {
    fontSize: 20,
    color: colors.mutedLight,
  },
  photoThumb: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.canvasLight,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.canvasLight,
    borderRadius: radii.md,
  },
  toggleText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
  },
  switch: {
    width: 42,
    height: 24,
    borderRadius: 14,
    backgroundColor: colors.borderStrong,
    justifyContent: 'center',
  },
  switchOn: {
    backgroundColor: colors.pine,
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.paper,
    marginLeft: 2,
  },
  knobOn: {
    marginLeft: 20,
  },
  lockedNote: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.rustDark,
    marginTop: 6,
  },
});
