import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Oswald_500Medium, Oswald_600SemiBold, Oswald_700Bold } from '@expo-google-fonts/oswald';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, fonts } from './src/theme/theme';
import { isFirebaseConfigured } from './src/services/firebase';

export default function App() {
  const [fontsLoaded] = useFonts({
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.stamp}>
          <Text style={styles.stampPeak}>⛰</Text>
          <Text style={styles.stampWord}>TRAILSTAMP</Text>
        </View>
        <Text style={styles.title}>Every Park.{'\n'}One Passport.</Text>
        <Text style={styles.subtitle}>
          Stage 1 complete: project scaffolding, theme, fonts, and Firebase wiring are in place.
        </Text>
        <Text style={styles.status}>
          Firebase: {isFirebaseConfigured ? 'configured' : 'no config found (add .env)'}
        </Text>
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
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
  stamp: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 3,
    borderColor: colors.gold,
    borderStyle: 'dashed',
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  stampPeak: {
    fontSize: 38,
    lineHeight: 42,
    color: colors.canvasLight,
  },
  stampWord: {
    fontFamily: fonts.display,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
    color: colors.canvasLight,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: colors.pine,
  },
  subtitle: {
    fontFamily: fonts.body,
    color: '#6b6455',
    fontSize: 14,
    marginTop: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  status: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.rustDark,
    marginTop: 20,
  },
});
