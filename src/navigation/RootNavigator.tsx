import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { PaywallProvider } from '../context/PaywallContext';
import { colors } from '../theme/theme';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

export function RootNavigator() {
  const { firebaseUser, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper }}>
        <ActivityIndicator color={colors.pine} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {firebaseUser ? (
        <PaywallProvider>
          <AppNavigator />
        </PaywallProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
