import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandStamp } from '../components/BrandStamp';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme/theme';

// Temporary landing screen for signed-in users. Replaced by the real Home
// screen (progress ring, visited parks list) in Stage 4.
export function HomePlaceholderScreen() {
  const { profile, firebaseUser, logOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <BrandStamp size={96} />
      <Text style={styles.title}>Welcome, {profile?.displayName ?? firebaseUser?.displayName ?? 'Explorer'}</Text>
      <Text style={styles.subtitle}>
        Signed in as {firebaseUser?.email}. Tier: {(profile?.tier ?? 'free').toUpperCase()}.
      </Text>
      <Text style={styles.note}>
        Stage 2 complete — sign-up and login are wired to Firebase. Home, park logging, and profile screens come next.
      </Text>
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
  logout: {
    marginTop: 28,
  },
});
