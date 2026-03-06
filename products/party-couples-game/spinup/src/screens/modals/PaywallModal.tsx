import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useSessionStore } from '@/store/sessionStore';
import { useIapStore } from '@/store/iapStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export default function PaywallModal({ route, navigation }: Props) {
  const { returnTo } = route.params || {};
  const advanceCard = useSessionStore((state) => state.advanceCard);
  const unlock = useIapStore((state) => state.unlock);

  const handleUnlock = () => {
    unlock();
    navigation.goBack();
  };

  const handleSkip = () => {
    advanceCard();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Unlock Full Game</Text>
        <Text style={styles.description}>
          Get access to all cards, including spicy dares, wild challenges, and exclusive content.
        </Text>
        
        <View style={styles.featureList}>
          <Text style={styles.feature}>✓ 3× more cards</Text>
          <Text style={styles.feature}>✓ Exclusive spicy content</Text>
          <Text style={styles.feature}>✓ No ads, ever</Text>
          <Text style={styles.feature}>✓ One-time purchase</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>$4.99</Text>
          <Text style={styles.priceSubtitle}>One time • Lifetime access</Text>
        </View>

        <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
          <Text style={styles.unlockButtonText}>Unlock — $4.99</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Not now</Text>
        </TouchableOpacity>

        {returnTo && (
          <Text style={styles.returnText}>You'll return to: {returnTo}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0E1A',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Poppins_800ExtraBold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: '#8888AA',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featureList: {
    marginBottom: 32,
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
  },
  feature: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 12,
  },
  priceContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  price: {
    color: '#7C3AFF',
    fontSize: 48,
    fontFamily: 'Poppins_800ExtraBold',
  },
  priceSubtitle: {
    color: '#8888AA',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  unlockButton: {
    backgroundColor: '#7C3AFF',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#8888AA',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  returnText: {
    color: '#2E2E4A',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 32,
  },
});