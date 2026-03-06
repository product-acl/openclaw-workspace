import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CouplesStackParamList } from '@/navigation/types';
import { useAppStore } from '@/store/appStore';
import { useIapStore } from '@/store/iapStore';
import { useSessionStore } from '@/store/sessionStore';
import { useDeck } from '@/hooks/useDeck';
import { SessionLengthPicker } from '@/components/game';
import { ContentTier, SessionPhase } from '@/types/card';
import { SessionConfig, SessionLength } from '@/types/session';

type Props = NativeStackScreenProps<CouplesStackParamList, 'CouplesSetup'>;

const TIERS: Array<{
  tier: ContentTier;
  emoji: string;
  title: string;
  subtitle: string;
  isLocked: boolean;
  isComingSoon: boolean;
}> = [
  {
    tier: 'romantic',
    emoji: '💝',
    title: 'Romantic',
    subtitle: 'Sweet & emotionally connective',
    isLocked: false,
    isComingSoon: false,
  },
  {
    tier: 'flirty',
    emoji: '🌶',
    title: 'Flirty',
    subtitle: 'Playful & mildly suggestive',
    isLocked: false,
    isComingSoon: false,
  },
  {
    tier: 'spicy',
    emoji: '🔥',
    title: 'Spicy',
    subtitle: 'Coming Soon',
    isLocked: true,
    isComingSoon: true,
  },
];

export default function CouplesSetupScreen({ navigation }: Props) {
  const { lastSelectedCouplesTier, setLastCouplesTier } = useAppStore();
  const { isUnlocked } = useIapStore();
  const { startSession } = useSessionStore();
  const { buildDeck } = useDeck();

  const [selectedTier, setSelectedTier] = useState<ContentTier>(lastSelectedCouplesTier);
  const [selectedLength, setSelectedLength] = useState<SessionLength>('medium');
  const [player1Name, setPlayer1Name] = useState('You');
  const [player2Name, setPlayer2Name] = useState('Partner');

  const handleTierSelect = (tier: ContentTier) => {
    const tierInfo = TIERS.find(t => t.tier === tier);
    if (!tierInfo) return;

    if (tierInfo.isComingSoon) {
      // Show toast-style message (using Alert for now)
      Alert.alert('Coming Soon', 'Spicy content will be available in v1.1 🔜');
      return;
    }

    if (tierInfo.isLocked && !isUnlocked) {
      navigation.getParent()?.navigate('Paywall', { returnTo: 'CouplesSetup' });
      return;
    }

    setSelectedTier(tier);
    setLastCouplesTier(tier);
  };

  const handleLengthLockedPress = () => {
    navigation.getParent()?.navigate('Paywall', { returnTo: 'CouplesSetup' });
  };

  const handleStartGame = () => {
    // Validate names
    const p1 = player1Name.trim() || 'You';
    const p2 = player2Name.trim() || 'Partner';

    // Build config
    const config: SessionConfig = {
      mode: 'couples',
      players: [
        { id: '1', name: p1, score: 0 },
        { id: '2', name: p2, score: 0 },
      ],
      sessionLength: selectedLength,
      contentTier: selectedTier,
    };

    // Build deck
    const deck = buildDeck(config);

    // Start session
    startSession(config, deck);

    // Navigate to game
    navigation.navigate('CouplesGame');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Couples Mode</Text>
        <Text style={styles.subtitle}>
          Connect, laugh, and grow closer together
        </Text>

        {/* Tier Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Content Style</Text>
          <View style={styles.tierContainer}>
            {TIERS.map((tierInfo) => {
              const isSelected = selectedTier === tierInfo.tier;
              const isActuallyLocked = tierInfo.isLocked && !isUnlocked && !tierInfo.isComingSoon;

              return (
                <TouchableOpacity
                  key={tierInfo.tier}
                  style={[
                    styles.tierCard,
                    isSelected && styles.tierCardSelected,
                    isActuallyLocked && styles.tierCardLocked,
                    tierInfo.isComingSoon && styles.tierCardComingSoon,
                  ]}
                  onPress={() => handleTierSelect(tierInfo.tier)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tierEmoji}>{tierInfo.emoji}</Text>
                  <Text style={styles.tierTitle}>{tierInfo.title}</Text>
                  <Text style={styles.tierSubtitle}>{tierInfo.subtitle}</Text>
                  
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}

                  {isActuallyLocked && (
                    <View style={styles.lockBadge}>
                      <Text style={styles.lockBadgeText}>🔒</Text>
                    </View>
                  )}

                  {tierInfo.isComingSoon && (
                    <View style={styles.comingSoonOverlay}>
                      <Text style={styles.comingSoonText}>Coming Soon</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Session Length Picker */}
        <View style={styles.section}>
          <SessionLengthPicker
            selectedLength={selectedLength}
            onSelect={setSelectedLength}
            onLockedPress={handleLengthLockedPress}
          />
        </View>

        {/* Player Names */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Player Names</Text>
          <View style={styles.nameInputsContainer}>
            <View style={styles.nameInputWrapper}>
              <Text style={styles.nameLabel}>Your name</Text>
              <TextInput
                style={styles.nameInput}
                value={player1Name}
                onChangeText={setPlayer1Name}
                placeholder="You"
                placeholderTextColor="#8888AA"
                maxLength={20}
                selectionColor="#FF3D6B"
              />
            </View>
            <View style={styles.nameInputWrapper}>
              <Text style={styles.nameLabel}>Partner's name</Text>
              <TextInput
                style={styles.nameInput}
                value={player2Name}
                onChangeText={setPlayer2Name}
                placeholder="Partner"
                placeholderTextColor="#8888AA"
                maxLength={20}
                selectionColor="#FF3D6B"
              />
            </View>
          </View>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Start Game CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>Start Game →</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    padding: 24,
    paddingBottom: 100, // Space for fixed CTA
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#8888AA',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  tierContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  tierCard: {
    flex: 1,
    backgroundColor: '#1C1C30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E2E4A',
    minHeight: 120,
    position: 'relative',
  },
  tierCardSelected: {
    borderColor: '#FF3D6B',
    borderWidth: 2,
  },
  tierCardLocked: {
    opacity: 0.7,
  },
  tierCardComingSoon: {
    opacity: 0.5,
  },
  tierEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  tierTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  tierSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#8888AA',
    textAlign: 'center',
    lineHeight: 16,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3D6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2E2E4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadgeText: {
    color: '#8888AA',
    fontSize: 12,
  },
  comingSoonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 30, 46, 0.8)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    color: '#8888AA',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  nameInputsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  nameInputWrapper: {
    flex: 1,
  },
  nameLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#8888AA',
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: '#1C1C30',
    borderWidth: 1,
    borderColor: '#2E2E4A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  spacer: {
    height: 32,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0E0E1A',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#2E2E4A',
  },
  startButton: {
    backgroundColor: '#FF3D6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
});