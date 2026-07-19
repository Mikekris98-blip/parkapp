import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomePlaceholderScreen } from '../screens/HomePlaceholderScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

// Temporary single-screen stack. Replaced by the bottom-tab navigator
// (Home / Discover / Add / Profile) starting in Stage 4.
export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePlaceholder" component={HomePlaceholderScreen} />
    </Stack.Navigator>
  );
}
