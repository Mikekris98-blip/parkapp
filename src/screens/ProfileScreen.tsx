import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { CampDiary } from '../components/CampDiary';
import { PatchShelf } from '../components/PatchShelf';
import { ProgressBar } from '../components/ProgressBar';
import { TierPill } from '../components/TierPill';
import { useAuth } from '../context/AuthContext';
import { useVisits } from '../hooks/useVisits';
import { pickAndUploadImage } from '../services/photos';
import { setUserTier } from '../services/users';
import { totalParkCount } from '../services/parks';
import { colors, fonts, radii, type MembershipTier } from '../theme/theme';

const TIERS: MembershipTier[] = ['free', 'membership', 'premium'];

export function ProfileScreen() {
  const { profile, firebaseUser, logOut, refreshProfile, updateDisplayName, updateAvatarUrl } = useAuth();
  const { visits, distinctVisitedCount } = useVisits();
  const tier = profile?.tier ?? 'free';
  const total = totalParkCount();
  const pct = total > 0 ? (distinctVisitedCount / total) * 100 : 0;

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile?.displayName ?? '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  function startEditingName() {
    setNameDraft(profile?.displayName ?? firebaseUser?.displayName ?? '');
    setEditingName(true);
  }

  async function saveNameEdit() {
    const trimmed = nameDraft.trim();
    setEditingName(false);
    if (!trimmed || trimmed === profile?.displayName) return;
    try {
      await updateDisplayName(trimmed);
    } catch {
      Alert.alert('Could not save name', 'Please try again.');
    }
  }

  async function handleAvatarPress() {
    if (!firebaseUser) return;
    setUploadingAvatar(true);
    try {
      const url = await pickAndUploadImage(`avatars/${firebaseUser.uid}.jpg`);
      if (url) await updateAvatarUrl(url);
    } catch {
      Alert.alert('Upload failed', 'Could not upload that photo. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSetTier(t: MembershipTier) {
    if (!firebaseUser) return;
    await setUserTier(firebaseUser.uid, t);
    await refreshProfile();
  }

  const avatarUrl = profile?.photoUrl ?? firebaseUser?.photoURL ?? undefined;
  const initials = (profile?.displayName ?? firebaseUser?.displayName ?? '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileHead}>
          <View style={styles.avatarWrap}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
            <Pressable style={styles.avatarEdit} onPress={handleAvatarPress} disabled={uploadingAvatar}>
              <Text style={styles.avatarEditIcon}>{uploadingAvatar ? '…' : '📷'}</Text>
            </Pressable>
          </View>
          <View style={styles.nameBlock}>
            {editingName ? (
              <TextInput
                style={styles.nameInput}
                value={nameDraft}
                onChangeText={setNameDraft}
                autoFocus
                onBlur={saveNameEdit}
                onSubmitEditing={saveNameEdit}
              />
            ) : (
              <Text style={styles.name} onPress={startEditingName}>
                {profile?.displayName ?? firebaseUser?.displayName ?? 'Explorer'}
              </Text>
            )}
            <TierPill tier={tier} />
          </View>
        </View>

        <View style={styles.membershipRow}>
          <View>
            <Text style={styles.mlLabel}>Membership Level</Text>
            <Text style={styles.mlValue}>{tier}</Text>
          </View>
          <Button
            title="Upgrade"
            onPress={() => Alert.alert('Coming soon', 'The upgrade flow is being built in a later stage.')}
            style={styles.upgradeBtn}
          />
        </View>

        <Text style={styles.sectionLabel}>Progress</Text>
        <ProgressBar label={`${distinctVisitedCount} of ${total} Ontario Parks visited`} pct={pct} />

        <Text style={styles.sectionLabel}>Yearly Patches</Text>
        <PatchShelf tier={tier} />

        <Text style={styles.sectionLabel}>Completed Parks — Camp Diary</Text>
        <View style={styles.diaryWrap}>
          <CampDiary visits={visits} />
        </View>

        <View style={styles.devBlock}>
          <Text style={styles.devLabel}>Dev only — preview as tier:</Text>
          <View style={styles.devRow}>
            {TIERS.map((t) => (
              <Text
                key={t}
                onPress={() => handleSetTier(t)}
                style={[styles.devOpt, t === tier && styles.devOptActive]}
              >
                {t}
              </Text>
            ))}
          </View>
        </View>

        <Button title="Log Out" variant="ghost" onPress={logOut} style={styles.logout} />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.pine,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingBottom: 32,
  },
  profileHead: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.canvasLight,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.canvasLight,
  },
  avatarEdit: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.rust,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.paper,
  },
  avatarEditIcon: {
    fontSize: 10,
  },
  nameBlock: {
    gap: 4,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.ink,
  },
  nameInput: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.ink,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold,
    paddingVertical: 2,
    minWidth: 140,
  },
  membershipRow: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: radii.xl,
    backgroundColor: colors.canvasLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mlLabel: {
    fontFamily: fonts.display,
    fontSize: 10.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  mlValue: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.pine,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  upgradeBtn: {
    width: 'auto',
    paddingHorizontal: 18,
  },
  sectionLabel: {
    fontFamily: fonts.display,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
  },
  diaryWrap: {
    paddingHorizontal: 20,
  },
  devBlock: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.pineDark,
  },
  devLabel: {
    fontFamily: fonts.display,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.canvasLight,
    opacity: 0.8,
    marginBottom: 10,
  },
  devRow: {
    flexDirection: 'row',
    gap: 6,
  },
  devOpt: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    fontFamily: fonts.mono,
    fontSize: 10.5,
    color: colors.canvasLight,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  devOptActive: {
    backgroundColor: colors.gold,
    color: '#3a2e0e',
    fontWeight: '700',
  },
  logout: {
    marginHorizontal: 20,
    marginTop: 20,
  },
});
