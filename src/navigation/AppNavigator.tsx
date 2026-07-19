import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { AddParkScreen } from '../screens/AddParkScreen';
import { ParkDetailScreen } from '../screens/ParkDetailScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="AddPark" component={AddParkScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="ParkDetail" component={ParkDetailScreen} />
    </Stack.Navigator>
  );
}
