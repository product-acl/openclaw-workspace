import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { RootStackParamList } from './types';
import HomeScreen from '@/screens/HomeScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import PaywallModal from '@/screens/modals/PaywallModal';
import ExitConfirmModal from '@/screens/modals/ExitConfirmModal';
import PartyNavigator from './PartyNavigator';
import CouplesNavigator from './CouplesNavigator';
import { useAppStore, loadAppState } from '@/store/appStore';
import { useAppState } from '@/hooks/useAppState';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);

  // Initialize app state listener
  useAppState();

  useEffect(() => {
    // Placeholder for RevenueCat initialization
    console.log('RevenueCat init placeholder');
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Load app state from storage
        await loadAppState();
        
        // Check if onboarding is needed
        if (!hasCompletedOnboarding) {
          navigation.navigate('Onboarding', {});
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [hasCompletedOnboarding, navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Group>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="PartyStack" component={PartyNavigator} />
        <Stack.Screen name="CouplesStack" component={CouplesNavigator} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
        <Stack.Screen name="Paywall" component={PaywallModal} />
        <Stack.Screen name="ExitConfirm" component={ExitConfirmModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}