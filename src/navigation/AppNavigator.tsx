import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomePlaceholderScreen } from '../screens/HomePlaceholderScreen';
import { ParkDatabaseScreen } from '../screens/ParkDatabaseScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

// Temporary stack. Replaced by the bottom-tab navigator (Home / Discover /
// Add / Profile) starting in Stage 4, at which point ParkDatabase moves
// under Discover instead of being reachable from this placeholder Home.
export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePlaceholder" component={HomePlaceholderScreen} />
      <Stack.Screen name="ParkDatabase" component={ParkDatabaseScreen} />
    </Stack.Navigator>
  );
}
