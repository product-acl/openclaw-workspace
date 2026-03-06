import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CouplesStackParamList } from '@/navigation/types';
import { useSessionStore } from '@/store/sessionStore';
import { useIapStore } from '@/store/iapStore';
import { useDeck } from '@/hooks/useDeck';
import { Card } from '@/types/card';
import { SessionConfig } from '@/types/session';
import { REWARD_CARDS } from '@/constants/rewardCards';

type Props = NativeStackScreenProps<CouplesStackParamList, 'CouplesEnd'>;

export default function CouplesEndScreen({ navigation }: Props) {
  const session = useSessionStore((state) => state.session);
  const startSession = useSessionStore((state) => state.startSession);
  const endSession = useSessionStore((state) => state.endSession);
  const isUnlocked = useIapStore((state) => state.isUnlocked);
  const { buildDeck } = useDeck();
  
  const [showUpsell, setShowUpsell] = useState(!isUnlocked);
  const [rewardPrompt, setRewardPrompt] = useState<string>('');

  useEffect(() => {
    if (session?.contentTier) {
      const prompts = REWARD_CARDS[session.contentTier];
      const randomIndex = Math.floor(Math.random() * prompts.length);
      setRewardPrompt(prompts[randomIndex]);
    }
  }, [session?.contentTier]);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No session found</Text>
      </View>
    );
  }

  const player1 = session.players[0];
  const player2 = session.players[1];
  const isTie = player1.score === player2.score;
  const winner = player1.score > player2.score ? player1 : player2;

  const handlePlayAgain = () => {
    const config: SessionConfig = {
      mode: session.mode,
      players: [
        { ...player1, score: 0 },
        { ...player2, score: 0 },
      ],
      sessionLength: session.sessionLength,
      contentTier: session.contentTier,
    };

    const newDeck: Card[] = buildDeck(config);
    startSession(config, newDeck);
    navigation.replace('CouplesGame');
  };

  const handleChangeSettings = () => {
    navigation.navigate('CouplesSetup');
  };

  const handleHome = () => {
    endSession();
    navigation.getParent()?.navigate('Home');
  };

  const handleUnlockNow = () => {
    navigation.getParent()?.navigate('Paywall', { returnTo: 'CouplesEnd' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.title}>
          {isTie ? '💫 Perfect Tie!' : '🎉 Session Complete!'}
        </Text>

        {/* Scores */}
        <View style={styles.scoresContainer}>
          <View style={styles.scoreBubble}>
            <Text style={styles.scoreName}>{player1.name}</Text>
            <Text style={styles.scoreValue}>{player1.score} pts</Text>
          </View>
          
          <View style={styles.scoreBubble}>
            <Text style={styles.scoreName}>{player2.name}</Text>
            <Text style={styles.scoreValue}>{player2.score} pts</Text>
          </View>
        </View>

        {/* Winner declaration */}
        {!isTie ? (
          <View style={styles.winnerContainer}>
            <Text style={styles.winnerText}>🏆 {winner.name} wins this round!</Text>
          </View>
        ) : (
          <View style={styles.winnerContainer}>
            <Text style={styles.winnerText}>You're perfectly in sync! 💑</Text>
          </View>
        )}

        {/* Reward card */}
        {rewardPrompt && (
          <View style={styles.rewardCard}>
            <Text style={styles.rewardTitle}>Your Reward</Text>
            <Text style={styles.rewardPrompt}>{rewardPrompt}</Text>
          </View>
        )}

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
              You played the free version. Unlock Flirty tier and Long sessions for more intimate moments.
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
          
          <TouchableOpacity style={styles.ghostButton} onPress={handleChangeSettings}>
            <Text style={styles.ghostButtonText}>Change Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.ghostButton} onPress={handleHome}>
            <Text style={styles.ghostButtonText}>Home</Text>
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
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    gap: 16,
  },
  scoreBubble: {
    flex: 1,
    backgroundColor: '#1C1C30',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E2E4A',
  },
  scoreName: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontFamily: 'Poppins_800ExtraBold',
    color: '#FFD166',
  },
  winnerContainer: {
    backgroundColor: '#1C1C30',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#2E2E4A',
  },
  winnerText: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  rewardCard: {
    backgroundColor: '#1C1C30',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FF3D6B',
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FF3D6B',
    marginBottom: 16,
  },
  rewardPrompt: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  upsellBanner: {
    backgroundColor: '#2E2E4A',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 32,
    position: 'relative',
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1C1C30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButtonText: {
    color: '#8888AA',
    fontSize: 12,
    fontWeight: 'bold',
  },
  upsellText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 20,
  },
  unlockCta: {
    backgroundColor: '#FF3D6B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  unlockCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  playAgainButton: {
    backgroundColor: '#FF3D6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  playAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E2E4A',
  },
  ghostButtonText: {
    color: '#8888AA',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
});