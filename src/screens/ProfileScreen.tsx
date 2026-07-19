import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandStamp } from '../components/BrandStamp';
import { Button } from '../components/Button';
import { TierPill } from '../components/TierPill';
import { useAuth } from '../context/AuthContext';
import { setUserTier } from '../services/users';
import { colors, fonts, type MembershipTier } from '../theme/theme';

const TIERS: MembershipTier[] = ['free', 'membership', 'premium'];

// Minimal placeholder. Real Profile (avatar upload, editable name, progress
// tracker, patch shelf, camp diary) is built in Stage 5.
export function ProfileScreen() {
  const { profile, firebaseUser, logOut, refreshProfile } = useAuth();
  const tier = profile?.tier ?? 'free';

  async function handleSetTier(t: MembershipTier) {
    if (!firebaseUser) return;
    await setUserTier(firebaseUser.uid, t);
    await refreshProfile();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <View style={styles.body}>
        <BrandStamp size={80} />
        <Text style={styles.name}>{profile?.displayName ?? firebaseUser?.displayName ?? 'Explorer'}</Text>
        <TierPill tier={tier} />
        <Text style={styles.email}>{firebaseUser?.email}</Text>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
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
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: colors.ink,
    marginTop: 12,
  },
  email: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.muted,
  },
  devBlock: {
    marginTop: 24,
    width: '100%',
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
    marginTop: 16,
  },
});
