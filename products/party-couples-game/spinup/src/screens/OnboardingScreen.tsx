import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppStore } from '@/store/appStore';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

type OnboardingScreenRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const route = useRoute<OnboardingScreenRouteProp>();
  const appStore = useAppStore();
  
  const { mode = 'party' } = route.params || {};
  const [step, setStep] = useState<1 | 2>(1);

  const isParty = mode === 'party';

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      if (isParty) {
        appStore.markPartyTutorialSeen();
        navigation.navigate('PartyStack', { screen: 'PartySetup' });
      } else {
        appStore.markCouplesTutorialSeen();
        navigation.navigate('CouplesStack', { screen: 'CouplesSetup' });
      }
    }
  };

  const handleSkip = () => {
    if (step === 1) {
      setStep(2);
    } else {
      handleNext();
    }
  };

  const renderContent = () => {
    if (isParty) {
      if (step === 1) {
        return {
          heading: 'Cards come to you one at a time',
          body: 'Do the dare, tell the truth, or drink up. Your call.',
          emoji: '🃏',
          buttonText: 'Got it →',
        };
      } else {
        return {
          heading: 'Accidentally skipped?',
          body: 'Hit Undo. No judgment. We know how parties go. 🍺',
          emoji: '↩',
          buttonText: "Let's Party 🍺",
        };
      }
    } else {
      if (step === 1) {
        return {
          heading: "This isn't a question list.",
          body: "You'll play, compete, and dare each other. Points are real.",
          emoji: '🎯',
          buttonText: 'Nice →',
        };
      } else {
        return {
          heading: 'Pick your vibe before you start.',
          body: 'Romantic, Flirty, or Spicy. You can always try all three.',
          emoji: '🔥',
          buttonText: "Let's Play 💑",
        };
      }
    }
  };

  const content = renderContent();

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.emoji}>{content.emoji}</Text>
        <Text style={styles.heading}>{content.heading}</Text>
        <Text style={styles.body}>{content.body}</Text>
      </View>

      {/* Step Dots */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, step === 1 && styles.dotActive]} />
        <View style={[styles.dot, step === 2 && styles.dotActive]} />
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{content.buttonText}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 12,
  },
  skipText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  body: {
    fontSize: 18,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 26,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#FF4D4D',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});