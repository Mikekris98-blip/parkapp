import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BrandStamp } from '../components/BrandStamp';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { setUserTier } from '../services/users';
import { colors, fonts, type MembershipTier } from '../theme/theme';
import type { AppStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'HomePlaceholder'>;

const TIERS: MembershipTier[] = ['free', 'membership', 'premium'];

// Temporary landing screen for signed-in users. Replaced by the real Home
// screen (progress ring, visited parks list) in Stage 4.
export function HomePlaceholderScreen({ navigation }: Props) {
  const { profile, firebaseUser, logOut, refreshProfile } = useAuth();
  const tier = profile?.tier ?? 'free';

  async function handleSetTier(t: MembershipTier) {
    if (!firebaseUser) return;
    await setUserTier(firebaseUser.uid, t);
    await refreshProfile();
  }

  return (
    <SafeAreaView style={styles.container}>
      <BrandStamp size={96} />
      <Text style={styles.title}>Welcome, {profile?.displayName ?? firebaseUser?.displayName ?? 'Explorer'}</Text>
      <Text style={styles.subtitle}>
        Signed in as {firebaseUser?.email}. Tier: {tier.toUpperCase()}.
      </Text>
      <Text style={styles.note}>
        Stage 3 complete — Parks Database with search is wired up. Home, park logging, and profile screens come next.
      </Text>

      <Button title="Browse Parks Database" onPress={() => navigation.navigate('ParkDatabase')} style={styles.browse} />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.pine,
    textTransform: 'uppercase',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: 8,
    textAlign: 'center',
  },
  note: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.rustDark,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 16,
  },
  browse: {
    marginTop: 24,
  },
  devBlock: {
    marginTop: 20,
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
