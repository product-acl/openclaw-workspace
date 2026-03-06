import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { CouplesStackParamList } from '@/navigation/types';
import { useSessionStore } from '@/store/sessionStore';
import { useIapStore } from '@/store/iapStore';
import { ScoreDisplay, CountdownTimer } from '@/components/game';
import { PointsAnimation } from '@/components/ui';
import { CouplesCard, CouplesCardType } from '@/types/card';

type Props = NativeStackScreenProps<CouplesStackParamList, 'CouplesGame'>;

// Memory challenge steps
type MemoryStep = 1 | 2 | 3;

export default function CouplesGameScreen({ navigation }: Props) {
  const session = useSessionStore((state) => state.session);
  const currentCard = useSessionStore((state) => state.currentCard());
  const currentPlayer = useSessionStore((state) => state.currentPlayer());
  const canUndo = useSessionStore((state) => state.canUndo());
  const advanceCard = useSessionStore((state) => state.advanceCard);
  const undoCard = useSessionStore((state) => state.undoCard);
  const resolveCard = useSessionStore((state) => state.resolveCard);
  const isUnlocked = useIapStore((state) => state.isUnlocked);

  // State for memory challenge
  const [memoryStep, setMemoryStep] = useState<MemoryStep>(1);
  const [player1Answer, setPlayer1Answer] = useState('');
  const [player2Answer, setPlayer2Answer] = useState('');
  const [showTalkPrompt, setShowTalkPrompt] = useState(false);

  // State for points animation
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [pointsToShow, setPointsToShow] = useState(0);
  const [isFinalePoints, setIsFinalePoints] = useState(false);

  // State for dare duel rating
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // State for countdown timer
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Reset card-specific state when card changes
  useEffect(() => {
    setMemoryStep(1);
    setPlayer1Answer('');
    setPlayer2Answer('');
    setShowTalkPrompt(false);
    setSelectedRating(null);
    setIsTimerActive(false);
  }, [currentCard?.id]);

  // Paywall interrupt effect (Task 8.4)
  useEffect(() => {
    if (currentCard?.isLocked && !isUnlocked) {
      navigation.getParent()?.navigate('Paywall', { returnTo: 'CouplesGame' });
    }
  }, [currentCard, isUnlocked, navigation]);

  // Handle session completion
  useEffect(() => {
    if (session?.isComplete) {
      navigation.replace('CouplesEnd');
    }
  }, [session?.isComplete, navigation]);

  // Back intercept (same as PartyGameScreen)
  useFocusEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      navigation.getParent()?.navigate('ExitConfirm');
    });
    return unsubscribe;
  });

  const handlePointsAwarded = (points: number, isFinale: boolean) => {
    setPointsToShow(points);
    setIsFinalePoints(isFinale);
    setShowPointsAnimation(true);
    
    // Apply finale multiplier
    const finalPoints = isFinale ? points * 2 : points;
    resolveCard(finalPoints);
  };

  const handleAnimationEnd = () => {
    setShowPointsAnimation(false);
    advanceCard();
  };

  const handleDareDuelSubmit = () => {
    if (selectedRating === null) return;

    let points = 0;
    if (selectedRating >= 7) points = 3;
    else if (selectedRating >= 4) points = 1;
    // else points = 0 (already 0)

    handlePointsAwarded(points, session?.currentPhase === 'finale');
  };

  const handleMemoryChallengeNext = () => {
    if (memoryStep === 1 && player1Answer.trim()) {
      setMemoryStep(2);
    } else if (memoryStep === 2 && player2Answer.trim()) {
      setMemoryStep(3);
    }
  };

  const handleMemoryMatch = (matched: boolean) => {
    const points = matched ? 2 : 0;
    handlePointsAwarded(points, session?.currentPhase === 'finale');
    
    if (!matched) {
      setShowTalkPrompt(true);
      setTimeout(() => {
        setShowTalkPrompt(false);
        advanceCard();
      }, 60000); // 60 seconds
    }
  };

  const handleSpinScenarioResult = (convinced: boolean) => {
    const points = convinced ? 2 : 0;
    handlePointsAwarded(points, session?.currentPhase === 'finale');
  };

  const handleTimerExpire = () => {
    // Auto-submit as "Not Convinced" when timer expires
    handleSpinScenarioResult(false);
  };

  const renderPhaseIndicator = () => {
    if (!session?.currentPhase) return null;

    const phaseLabels = {
      warmup: 'Warm Up',
      main: 'Main Game',
      finale: '🏆 Finale',
    };

    return (
      <View style={styles.phaseIndicator}>
        <Text style={styles.phaseText}>{phaseLabels[session.currentPhase]}</Text>
      </View>
    );
  };

  const renderTurnIndicator = () => {
    if (!currentPlayer) return null;
    
    return (
      <View style={styles.turnIndicator}>
        <Text style={styles.turnText}>💑 {currentPlayer.name}'s turn</Text>
      </View>
    );
  };

  const renderCardDisplay = () => {
    if (!currentCard || currentCard.mode !== 'couples') {
      return (
        <View style={styles.cardContainer}>
          <Text style={styles.noCardText}>No card available</Text>
        </View>
      );
    }

    const couplesCard = currentCard as CouplesCard;
    
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardText}>{couplesCard.text}</Text>
        </View>
        
        <PointsAnimation
          points={pointsToShow}
          visible={showPointsAnimation}
          onAnimationEnd={handleAnimationEnd}
          isFinale={isFinalePoints}
        />
      </View>
    );
  };

  const renderActionArea = () => {
    if (!currentCard || currentCard.mode !== 'couples') return null;

    const couplesCard = currentCard as CouplesCard;
    const isFinale = session?.currentPhase === 'finale';
    const cardType = couplesCard.type;

    // Handle finale_special - use underlying type if available
    let effectiveType: CouplesCardType = cardType;
    if (cardType === 'finale_special') {
      // In a real implementation, we might have metadata for the underlying type
      // For now, default to spin_the_scenario
      effectiveType = 'spin_the_scenario';
    }

    switch (effectiveType) {
      case 'dare_duel':
        return renderDareDuelUI(isFinale);
      case 'memory_challenge':
        return renderMemoryChallengeUI(isFinale);
      case 'spin_the_scenario':
        return renderSpinScenarioUI(isFinale);
      default:
        return null;
    }
  };

  const renderDareDuelUI = (isFinale: boolean) => {
    return (
      <View style={styles.actionArea}>
        {isFinale && (
          <View style={styles.finaleBanner}>
            <Text style={styles.finaleBannerText}>🏆 Finale — 2×</Text>
          </View>
        )}
        
        <Text style={styles.actionLabel}>
          Rate the experience: {selectedRating ? `${selectedRating}/10` : '?/10'}
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingButton,
                selectedRating === rating && styles.ratingButtonSelected,
              ]}
              onPress={() => setSelectedRating(rating)}
            >
              <Text style={[
                styles.ratingButtonText,
                selectedRating === rating && styles.ratingButtonTextSelected,
              ]}>
                {rating}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity
          style={[styles.submitButton, !selectedRating && styles.submitButtonDisabled]}
          onPress={handleDareDuelSubmit}
          disabled={!selectedRating}
        >
          <Text style={styles.submitButtonText}>Submit →</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMemoryChallengeUI = (isFinale: boolean) => {
    if (showTalkPrompt) {
      return (
        <View style={styles.actionArea}>
          <Text style={styles.talkPromptText}>
            You answered differently. Take 60 seconds to talk about it!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.actionArea}>
        {isFinale && (
          <View style={styles.finaleBanner}>
            <Text style={styles.finaleBannerText}>🏆 Finale — 2×</Text>
          </View>
        )}
        
        {memoryStep === 1 && (
          <>
            <Text style={styles.actionLabel}>{session?.players[0]?.name}, type your answer:</Text>
            <TextInput
              style={styles.memoryInput}
              value={player1Answer}
              onChangeText={setPlayer1Answer}
              placeholder="Type your answer here..."
              placeholderTextColor="#8888AA"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              selectionColor="#FF3D6B"
            />
            <TouchableOpacity
              style={[styles.submitButton, !player1Answer.trim() && styles.submitButtonDisabled]}
              onPress={handleMemoryChallengeNext}
              disabled={!player1Answer.trim()}
            >
              <Text style={styles.submitButtonText}>Done — pass to partner →</Text>
            </TouchableOpacity>
          </>
        )}
        
        {memoryStep === 2 && (
          <>
            <Text style={styles.actionLabel}>
              {session?.players[1]?.name}, cover {session?.players[0]?.name}'s answer
            </Text>
            <TextInput
              style={styles.memoryInput}
              value={player2Answer}
              onChangeText={setPlayer2Answer}
              placeholder="Type your answer here..."
              placeholderTextColor="#8888AA"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              selectionColor="#FF3D6B"
            />
            <TouchableOpacity
              style={[styles.submitButton, !player2Answer.trim() && styles.submitButtonDisabled]}
              onPress={handleMemoryChallengeNext}
              disabled={!player2Answer.trim()}
            >
              <Text style={styles.submitButtonText}>Reveal →</Text>
            </TouchableOpacity>
          </>
        )}
        
        {memoryStep === 3 && (
          <>
            <Text style={styles.actionLabel}>Compare your answers:</Text>
            <View style={styles.answersContainer}>
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>{session?.players[0]?.name}</Text>
                <Text style={styles.answerText}>{player1Answer}</Text>
              </View>
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>{session?.players[1]?.name}</Text>
                <Text style={styles.answerText}>{player2Answer}</Text>
              </View>
            </View>
            <View style={styles.memoryButtonsContainer}>
              <TouchableOpacity
                style={[styles.memoryButton, styles.matchButton]}
                onPress={() => handleMemoryMatch(true)}
              >
                <Text style={styles.memoryButtonText}>We Match! +2 pts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.memoryButton, styles.differButton]}
                onPress={() => handleMemoryMatch(false)}
              >
                <Text style={styles.memoryButtonText}>We Differ</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  const renderSpinScenarioUI = (isFinale: boolean) => {
    return (
      <View style={styles.actionArea}>
        {isFinale && (
          <View style={styles.finaleBanner}>
            <Text style={styles.finaleBannerText}>🏆 Finale — 2×</Text>
          </View>
        )}
        
        <CountdownTimer
          durationSeconds={30}
          onExpire={handleTimerExpire}
          isActive={isTimerActive}
        />
        
        <View style={styles.spinButtonsContainer}>
          <TouchableOpacity
            style={[styles.spinButton, styles.convincedButton]}
            onPress={() => {
              setIsTimerActive(false);
              handleSpinScenarioResult(true);
            }}
          >
            <Text style={styles.spinButtonText}>Convinced ✓ +2pts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.spinButton, styles.notConvincedButton]}
            onPress={() => {
              setIsTimerActive(false);
              handleSpinScenarioResult(false);
            }}
          >
            <Text style={styles.spinButtonText}>Not Convinced ✗</Text>
          </TouchableOpacity>
        </View>
        
        {!isTimerActive && (
          <TouchableOpacity
            style={styles.startTimerButton}
            onPress={() => setIsTimerActive(true)}
          >
            <Text style={styles.startTimerButtonText}>Start Timer</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!session || !currentCard) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No active session</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Score display */}
        <ScoreDisplay players={session.players} />
        
        {/* Phase indicator */}
        {renderPhaseIndicator()}
        
        {/* Turn indicator */}
        {renderTurnIndicator()}
        
        {/* Card display */}
        {renderCardDisplay()}
        
        {/* Action area */}
        {renderActionArea()}
        
        {/* Undo button */}
        {canUndo && (
          <TouchableOpacity style={styles.undoButton} onPress={undoCard}>
            <Text style={styles.undoButtonText}>↶ Undo</Text>
          </TouchableOpacity>
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
    gap: 24,
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  phaseIndicator: {
    backgroundColor: '#1C1C30',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#2E2E4A',
  },
  phaseText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  turnIndicator: {
    backgroundColor: '#1C1C30',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FF3D6B',
  },
  turnText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  card: {
    backgroundColor: '#1C1C30',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    lineHeight: 32,
  },
  noCardText: {
    color: '#8888AA',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
  actionArea: {
    backgroundColor: '#1C1C30',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2E2E4A',
    gap: 16,
  },
  finaleBanner: {
    backgroundColor: '#FF3D6B',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  finaleBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  actionLabel: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  ratingContainer: {
    marginHorizontal: -20,
  },
  ratingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2E2E4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  ratingButtonSelected: {
    backgroundColor: '#FF3D6B',
  },
  ratingButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#8888AA',
  },
  ratingButtonTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#FF3D6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#2E2E4A',
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  memoryInput: {
    backgroundColor: '#0E0E1A',
    borderWidth: 1,
    borderColor: '#2E2E4A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  answersContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  answerBox: {
    flex: 1,
    backgroundColor: '#0E0E1A',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2E2E4A',
  },
  answerLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FF3D6B',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  memoryButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  memoryButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  matchButton: {
    backgroundColor: '#FF3D6B',
  },
  differButton: {
    backgroundColor: '#2E2E4A',
  },
  memoryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  spinButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  spinButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  convincedButton: {
    backgroundColor: '#FF3D6B',
  },
  notConvincedButton: {
    backgroundColor: '#2E2E4A',
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  startTimerButton: {
    backgroundColor: '#2E2E4A',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  startTimerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  talkPromptText: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFD166',
    textAlign: 'center',
    lineHeight: 24,
  },
  undoButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    backgroundColor: '#2E2E4A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2E2E4A',
  },
  undoButtonText: {
    color: '#8888AA',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
});