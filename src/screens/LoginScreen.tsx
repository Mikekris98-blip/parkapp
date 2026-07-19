import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { useAuth } from '../context/AuthContext';
import { friendlyAuthError } from '../services/authErrors';
import { colors, fonts } from '../theme/theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!email.trim() || !password) return setError('Please enter your email and password.');

    setLoading(true);
    try {
      await logIn(email.trim(), password);
    } catch (e) {
      setError(friendlyAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.cancel} onPress={() => navigation.goBack()}>
            ← Back
          </Text>
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subtitle}>Welcome back to your trail passport.</Text>

          <FormField
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <FormField label="Password" placeholder="Your password" value={password} onChangeText={setPassword} secureTextEntry />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button title="Log In" onPress={handleSubmit} loading={loading} style={styles.submit} />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New here?</Text>
            <Text style={styles.footerLink} onPress={() => navigation.navigate('SignUp')}>
              {' '}
              Create Account
            </Text>
          </View>
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
  scroll: {
    padding: 20,
  },
  cancel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.pine,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.pine,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: 6,
    marginBottom: 22,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.danger,
    marginBottom: 12,
  },
  submit: {
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  footerLink: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.rust,
  },
});
