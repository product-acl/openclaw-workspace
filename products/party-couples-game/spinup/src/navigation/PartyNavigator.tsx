import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PartyStackParamList } from './types';
import PartySetupScreen from '@/screens/party/PartySetupScreen';
import PartyGameScreen from '@/screens/party/PartyGameScreen';
import PartyEndScreen from '@/screens/party/PartyEndScreen';

const Stack = createNativeStackNavigator<PartyStackParamList>();

export default function PartyNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PartySetup" component={PartySetupScreen} />
      <Stack.Screen name="PartyGame" component={PartyGameScreen} />
      <Stack.Screen name="PartyEnd" component={PartyEndScreen} />
    </Stack.Navigator>
  );
}