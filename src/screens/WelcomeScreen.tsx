import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandStamp } from '../components/BrandStamp';
import { Button } from '../components/Button';
import { colors, fonts } from '../theme/theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <BrandStamp />
        <Text style={styles.title}>Every Park.{'\n'}One Passport.</Text>
        <Text style={styles.subtitle}>
          Log the campgrounds and parks you've visited, add photos and notes, and earn your stamps along the way.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button title="Create Account" onPress={() => navigation.navigate('SignUp')} />
        <Button
          title="I already have one — Log In"
          variant="ghost"
          onPress={() => navigation.navigate('Login')}
          style={styles.secondButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: 32,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: colors.pine,
    marginTop: 0,
  },
  subtitle: {
    fontFamily: fonts.body,
    color: '#6b6455',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  actions: {
    width: '100%',
    marginTop: 32,
  },
  secondButton: {
    marginTop: 10,
  },
});
