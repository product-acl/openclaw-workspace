import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PartyStackParamList } from '@/navigation/types';
import { useAppStore } from '@/store/appStore';
import { useIapStore } from '@/store/iapStore';
import { useSessionStore } from '@/store/sessionStore';
import { useDeck } from '@/hooks/useDeck';
import { SessionLengthPicker } from '@/components/game';
import { SessionLength, SessionConfig, Player } from '@/types/session';
type PartySetupScreenProps = NativeStackScreenProps<PartyStackParamList, 'PartySetup'>;

const MAX_PLAYERS = 8;
const MIN_PLAYERS = 2;

export default function PartySetupScreen({ navigation }: PartySetupScreenProps) {
  const appStore = useAppStore();
  const iapStore = useIapStore();
  const sessionStore = useSessionStore();
  const { buildDeck } = useDeck();
  
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [selectedLength, setSelectedLength] = useState<SessionLength>('medium');
  const [drinkingMode, setDrinkingMode] = useState(true);

  useEffect(() => {
    if (!appStore.drinkingDisclaimerShown) {
      setShowDisclaimer(true);
    }
  }, [appStore.drinkingDisclaimerShown]);

  const handleDisclaimerClose = () => {
    appStore.markDrinkingDisclaimerShown();
    setShowDisclaimer(false);
  };

  const handleAddPlayer = () => {
    if (playerNames.length < MAX_PLAYERS) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > MIN_PLAYERS) {
      const newNames = [...playerNames];
      newNames.splice(index, 1);
      setPlayerNames(newNames);
    }
  };

  const handlePlayerNameChange = (index: number, text: string) => {
    const newNames = [...playerNames];
    newNames[index] = text;
    setPlayerNames(newNames);
  };

  const handleLockedLengthPress = () => {
    navigation.getParent()?.navigate('Paywall', { returnTo: 'PartySetup' });
  };

  const handleStartGame = () => {
    // Build players array
    const players: Player[] = playerNames.map((name, index) => ({
      id: Math.random().toString(36).substring(2, 11),
      name: name.trim() || `Player ${index + 1}`,
      score: 0,
    }));

    // Build session config
    const config: SessionConfig = {
      mode: 'party',
      players,
      sessionLength: selectedLength,
      drinkingMode,
    };

    // Build deck and start session
    const deck = buildDeck(config);
    sessionStore.startSession(config, deck);

    // Navigate to game screen
    navigation.navigate('PartyGame');
  };

  const canStartGame = playerNames.filter(name => name.trim()).length >= MIN_PLAYERS;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Who's Playing?</Text>
        </View>

        {/* Player Grid */}
        <View style={styles.playerGrid}>
          {playerNames.map((name, index) => (
            <View key={index} style={styles.playerSlot}>
              <TextInput
                style={styles.playerInput}
                placeholder={`Player ${index + 1}`}
                placeholderTextColor="#666666"
                value={name}
                onChangeText={(text) => handlePlayerNameChange(index, text)}
                maxLength={20}
                autoCapitalize="words"
                accessibilityLabel={`Player ${index + 1} name input`}
                accessibilityHint={`Enter name for player ${index + 1}`}
              />
              {playerNames.length > MIN_PLAYERS && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemovePlayer(index)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel={`Remove player ${index + 1}`}
                  accessibilityHint={`Removes player ${index + 1} from the game`}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Add Player Button */}
        {playerNames.length < MAX_PLAYERS && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPlayer}
            activeOpacity={0.7}
            accessibilityLabel="Add player"
            accessibilityHint="Adds a new player slot to the game"
          >
            <Text style={styles.addButtonText}>＋ Add Player</Text>
          </TouchableOpacity>
        )}

        {/* Session Length Picker */}
        <SessionLengthPicker
          selectedLength={selectedLength}
          onSelect={setSelectedLength}
          onLockedPress={handleLockedLengthPress}
        />

        {/* Drinking Mode Toggle */}
        <View style={styles.drinkingToggleContainer}>
          <Text style={styles.drinkingToggleLabel}>🍺 Drinking Mode</Text>
          <Switch
            value={drinkingMode}
            onValueChange={setDrinkingMode}
            trackColor={{ false: '#2E2E4A', true: '#7C3AFF' }} // party-border, party-primary
            thumbColor="#FFFFFF"
            ios_backgroundColor="#2E2E4A"
            accessibilityLabel="Drinking mode toggle"
            accessibilityHint="Turns drinking game mode on or off"
          />
        </View>
      </ScrollView>

      {/* Fixed CTA Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.ctaButton, !canStartGame && styles.ctaButtonDisabled]}
          onPress={handleStartGame}
          disabled={!canStartGame}
          activeOpacity={0.8}
          accessibilityLabel="Start game"
          accessibilityHint="Starts the party game with current settings"
          accessibilityRole="button"
        >
          <Text style={styles.ctaButtonText}>Let's Go →</Text>
        </TouchableOpacity>
      </View>

      {/* Drinking Disclaimer Modal */}
      <Modal
        visible={showDisclaimer}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDisclaimerClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🍺</Text>
            <Text style={styles.modalTitle}>Drink Responsibly</Text>
            <Text style={styles.modalBody}>
              This app contains drinking game content. Please drink responsibly. You must be 18 or older to use drinking features.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDisclaimerClose}
            >
              <Text style={styles.modalButtonText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E1A', // party-bg
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24, // space-6 from design system
    paddingTop: 24, // space-6
    paddingBottom: 120, // Extra padding for fixed CTA
  },
  header: {
    marginBottom: 32, // space-8
  },
  title: {
    fontSize: 36, // type-h1
    fontWeight: 'bold',
    color: '#FFFFFF', // party-text-primary
    fontFamily: 'Poppins_800ExtraBold',
  },
  playerGrid: {
    gap: 16, // space-4
    marginBottom: 24, // space-6
  },
  playerSlot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerInput: {
    flex: 1,
    backgroundColor: '#1C1C30', // party-surface
    borderRadius: 12, // radius-md
    borderWidth: 1,
    borderColor: '#2E2E4A', // party-border
    color: '#FFFFFF', // party-text-primary
    fontSize: 16, // type-body
    paddingHorizontal: 16, // space-4
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontFamily: 'Poppins_400Regular',
  },
  removeButton: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 16, // radius-full for circle
    backgroundColor: '#2E2E4A', // party-border
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF', // party-text-primary
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#1C1C30', // party-surface
    borderRadius: 12, // radius-md
    borderWidth: 1,
    borderColor: '#2E2E4A', // party-border
    borderStyle: 'dashed',
    paddingVertical: 16, // space-4
    alignItems: 'center',
    marginBottom: 40,
  },
  addButtonText: {
    color: '#7C3AFF', // party-primary
    fontSize: 16, // type-body
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  drinkingToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C30', // party-surface
    borderRadius: 12, // radius-md
    paddingHorizontal: 16, // space-4
    paddingVertical: 16, // space-4
    marginBottom: 24, // space-6
  },
  drinkingToggleLabel: {
    fontSize: 16, // type-body
    color: '#FFFFFF', // party-text-primary
    fontFamily: 'Poppins_600SemiBold',
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24, // space-6
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: 16, // space-4
    backgroundColor: '#0E0E1A', // party-bg
    borderTopWidth: 1,
    borderTopColor: '#1C1C30', // party-surface
  },
  ctaButton: {
    backgroundColor: '#7C3AFF', // party-primary
    borderRadius: 16, // radius-lg
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: '#252540', // party-surface-elevated
    opacity: 0.5,
  },
  ctaButtonText: {
    color: '#FFFFFF', // party-text-primary
    fontSize: 18, // type-button-lg
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(14, 14, 26, 0.95)', // party-bg with opacity
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24, // space-6
  },
  modalContent: {
    backgroundColor: '#1C1C30', // party-surface
    borderRadius: 16, // radius-lg
    padding: 24, // space-6
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E2E4A', // party-border
  },
  modalEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24, // type-h3
    fontWeight: 'bold',
    color: '#FFFFFF', // party-text-primary
    marginBottom: 16, // space-4
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  modalBody: {
    fontSize: 16, // type-body
    color: '#A0A0C0', // party-text-secondary
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24, // space-6
    fontFamily: 'Poppins_400Regular',
  },
  modalButton: {
    backgroundColor: '#7C3AFF', // party-primary
    borderRadius: 12, // radius-md
    paddingVertical: 16, // space-4
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF', // party-text-primary
    fontSize: 18, // type-button-lg
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },
});