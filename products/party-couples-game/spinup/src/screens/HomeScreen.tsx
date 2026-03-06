import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '@/store/appStore';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const appStore = useAppStore();

  const handlePartyPress = () => {
    if (!appStore.hasSeenPartyTutorial) {
      navigation.navigate('Onboarding', { mode: 'party' });
    } else {
      navigation.navigate('PartyStack', { screen: 'PartySetup' });
    }
  };

  const handleCouplesPress = () => {
    if (!appStore.hasSeenCouplesTutorial) {
      navigation.navigate('Onboarding', { mode: 'couples' });
    } else {
      navigation.navigate('CouplesStack', { screen: 'CouplesSetup' });
    }
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SpinUp</Text>
        <Text style={styles.subtitle}>Pick your game</Text>
      </View>

      <View style={styles.content}>
        {/* Party Mode Card */}
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={handlePartyPress}
          activeOpacity={0.85}
          testID="party-mode-btn"
        >
          <LinearGradient
            colors={['#FF4D4D', '#FF8C00']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.cardIcon}>🍺</Text>
            <Text style={styles.cardTitle}>Party Mode</Text>
            <Text style={styles.cardSubtitle}>
              3–8 players · Dares · Truth Bombs · Votes
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Couples Mode Card */}
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={handleCouplesPress}
          activeOpacity={0.85}
          testID="couples-mode-btn"
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.cardIcon}>💑</Text>
            <Text style={styles.cardTitle}>Couples Mode</Text>
            <Text style={styles.cardSubtitle}>
              Just the two of you · Dares · Points · Challenges
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Settings Button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress}
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 24,
  },
  cardWrapper: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 12,
  },
  settingsIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});