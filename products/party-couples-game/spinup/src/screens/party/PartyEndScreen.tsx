import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PartyStackParamList } from '@/navigation/types';
import { useSessionStore } from '@/store/sessionStore';
import { useIapStore } from '@/store/iapStore';
import { Card } from '@/types/card';
import { SessionConfig } from '@/types/session';

type Props = NativeStackScreenProps<PartyStackParamList, 'PartyEnd'>;

export default function PartyEndScreen({ navigation }: Props) {
  const session = useSessionStore((state) => state.session);
  const startSession = useSessionStore((state) => state.startSession);
  const endSession = useSessionStore((state) => state.endSession);
  const isUnlocked = useIapStore((state) => state.isUnlocked);
  const [showUpsell, setShowUpsell] = useState(!isUnlocked);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No session found</Text>
      </View>
    );
  }

  const handlePlayAgain = async () => {
    // Rebuild deck with same config
    const config: SessionConfig = {
      mode: session.mode,
      players: session.players,
      sessionLength: session.sessionLength,
      drinkingMode: session.drinkingMode,
      contentTier: session.contentTier,
    };

    // For now, reuse the same deck
    // In a real implementation, we would reload cards from storage
    // and recompose the deck based on unlock status
    const newDeck: Card[] = [...session.deck];
    
    startSession(config, newDeck);
    navigation.replace('PartyGame');
  };

  const handleHome = () => {
    endSession();
    navigation.getParent()?.navigate('Home');
  };

  const handleUnlockNow = () => {
    navigation.getParent()?.navigate('Paywall', { returnTo: 'PartyEnd' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎉 Game Over!</Text>
        
        {/* Player list */}
        <View style={styles.playerList}>
          {session.players.map((player) => (
            <View key={player.id} style={styles.playerChip}>
              <Text style={styles.playerName}>{player.name}</Text>
            </View>
          ))}
        </View>

        {/* Upsell banner */}
        {showUpsell && !isUnlocked && (
          <View style={styles.upsellBanner}>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => setShowUpsell(false)}
            >
              <Text style={styles.dismissButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.upsellText}>
              You played the free version. The full game has 3× more cards. $4.99, one time.
            </Text>
            <TouchableOpacity style={styles.unlockCta} onPress={handleUnlockNow}>
              <Text style={styles.unlockCtaText}>Unlock Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 40,
    fontFamily: 'Poppins_800ExtraBold',
    textAlign: 'center',
    marginBottom: 32,
  },
  playerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  playerChip: {
    backgroundColor: '#1C1C30',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  upsellBanner: {
    backgroundColor: '#1C1C30',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    position: 'relative',
  },
  dismissButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButtonText: {
    color: '#8888AA',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  upsellText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 16,
    lineHeight: 24,
  },
  unlockCta: {
    backgroundColor: '#7C3AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  unlockCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  playAgainButton: {
    backgroundColor: '#7C3AFF',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  playAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  homeButton: {
    borderWidth: 2,
    borderColor: '#2E2E4A',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});