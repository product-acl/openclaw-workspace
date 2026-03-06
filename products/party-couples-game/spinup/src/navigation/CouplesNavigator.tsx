import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CouplesStackParamList } from './types';
import CouplesSetupScreen from '@/screens/couples/CouplesSetupScreen';
import CouplesGameScreen from '@/screens/couples/CouplesGameScreen';
import CouplesEndScreen from '@/screens/couples/CouplesEndScreen';

const Stack = createNativeStackNavigator<CouplesStackParamList>();

export default function CouplesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CouplesSetup" component={CouplesSetupScreen} />
      <Stack.Screen name="CouplesGame" component={CouplesGameScreen} />
      <Stack.Screen name="CouplesEnd" component={CouplesEndScreen} />
    </Stack.Navigator>
  );
}