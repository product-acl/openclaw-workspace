import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { PartyStackParamList } from '@/navigation/types';
import { useSessionStore } from '@/store/sessionStore';
import { useIapStore } from '@/store/iapStore';
import { CardDisplay, ProgressIndicator, UndoButton } from '@/components/game';

type Props = NativeStackScreenProps<PartyStackParamList, 'PartyGame'>;

export default function PartyGameScreen({ navigation }: Props) {
  const session = useSessionStore((state) => state.session);
  const currentCard = useSessionStore((state) => state.currentCard());
  const currentPlayer = useSessionStore((state) => state.currentPlayer());
  const canUndo = useSessionStore((state) => state.canUndo());
  const advanceCard = useSessionStore((state) => state.advanceCard);
  const undoCard = useSessionStore((state) => state.undoCard);
  const isUnlocked = useIapStore((state) => state.isUnlocked);

  useFocusEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Prevent default back behavior
      e.preventDefault();
      // Navigate to ExitConfirm modal using root navigation
      // @ts-ignore - We need to access the root navigator
      navigation.getParent()?.navigate('ExitConfirm');
    });

    return unsubscribe;
  });

  // Paywall interrupt effect
  useEffect(() => {
    if (currentCard?.isLocked && !isUnlocked) {
      navigation.getParent()?.navigate('Paywall', { returnTo: 'PartyGame' });
    }
  }, [currentCard]);

  const handleDone = () => {
    advanceCard();
    if (session?.isComplete) {
      navigation.replace('PartyEnd');
    }
  };

  if (!session || !currentCard) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No active session</Text>
      </View>
    );
  }

  // Type guard to ensure it's a PartyCard
  if (currentCard.mode !== 'party') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Invalid card type</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.playerName}>
            {currentPlayer?.name}, your turn!
          </Text>
          <ProgressIndicator
            currentIndex={session.currentCardIndex}
            totalCards={session.totalCards}
          />
        </View>

        {/* Center card display */}
        <View style={styles.cardContainer}>
          <CardDisplay
            card={currentCard}
            drinkingMode={session.drinkingMode || false}
          />
        </View>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <UndoButton
            onPress={undoCard}
            visible={canUndo}
          />
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done →</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  doneButton: {
    backgroundColor: '#7C3AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flex: 1,
    marginLeft: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});