import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSession, SessionConfig, Player } from '../types/session';
import { Card } from '../types/card';
import { STORAGE_KEYS } from '../constants/storageKeys';

interface SessionState {
  session: GameSession | null;
  startSession: (config: SessionConfig, deck: Card[]) => void;
  advanceCard: () => void;
  undoCard: () => void;
  resolveCard: (pointsAwarded?: number) => void;
  endSession: () => void;
  currentCard: () => Card | null;
  currentPlayer: () => Player | null;
  canUndo: () => boolean;
  isFinale: () => boolean;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      session: null,

      startSession: (config: SessionConfig, deck: Card[]) => {
        const session: GameSession = {
          id: Math.random().toString(36).substring(2, 11),
          mode: config.mode,
          players: config.players,
          deck,
          currentCardIndex: 0,
          previousCardIndex: null,
          undoUsedForCurrentCard: false,
          isComplete: false,
          totalCards: deck.length,
          sessionLength: config.sessionLength,
          startedAt: Date.now(),
          drinkingMode: config.drinkingMode,
          activePlayerIndex: 0,
          contentTier: config.contentTier,
          currentPhase: config.mode === 'couples' ? 'warmup' : undefined,
          finaleStartIndex: config.mode === 'couples' ? Math.floor(deck.length * 0.75) : undefined,
        };
        set({ session });
      },

      advanceCard: () => {
        const { session } = get();
        if (!session) return;

        const newSession = { ...session };
        newSession.previousCardIndex = newSession.currentCardIndex;
        newSession.currentCardIndex++;
        newSession.undoUsedForCurrentCard = false;

        if (newSession.currentCardIndex >= newSession.totalCards) {
          newSession.isComplete = true;
        }

        // Update phase for couples mode (Task 8.4)
        if (newSession.mode === 'couples') {
          if (newSession.currentCardIndex < newSession.totalCards * 0.25) {
            newSession.currentPhase = 'warmup';
          } else if (newSession.finaleStartIndex && newSession.currentCardIndex >= newSession.finaleStartIndex) {
            newSession.currentPhase = 'finale';
          } else {
            newSession.currentPhase = 'main';
          }
        }

        set({ session: newSession });
      },

      undoCard: () => {
        const { session } = get();
        if (!session || !get().canUndo()) return;

        const newSession = { ...session };
        newSession.currentCardIndex = newSession.previousCardIndex!;
        newSession.previousCardIndex = null;
        newSession.undoUsedForCurrentCard = true;

        // Revert phase for couples mode if needed
        if (newSession.mode === 'couples') {
          if (newSession.currentCardIndex < newSession.totalCards * 0.25) {
            newSession.currentPhase = 'warmup';
          } else if (newSession.finaleStartIndex && newSession.currentCardIndex >= newSession.finaleStartIndex) {
            newSession.currentPhase = 'finale';
          } else {
            newSession.currentPhase = 'main';
          }
        }

        set({ session: newSession });
      },

      resolveCard: (pointsAwarded?: number) => {
        const { session } = get();
        if (!session) return;

        const newSession = { ...session };
        const points = pointsAwarded ?? 0;
        
        // Add points to current player (use activePlayerIndex ?? 0 as per spec)
        const playerIndex = newSession.activePlayerIndex ?? 0;
        newSession.players[playerIndex].score += points;
        
        // Toggle active player (0→1, 1→0)
        newSession.activePlayerIndex = playerIndex === 0 ? 1 : 0;

        set({ session: newSession });
      },

      endSession: () => {
        set({ session: null });
      },

      currentCard: () => {
        const { session } = get();
        if (!session) return null;
        return session.deck[session.currentCardIndex] ?? null;
      },

      currentPlayer: () => {
        const { session } = get();
        if (!session) return null;
        const playerIndex = session.activePlayerIndex ?? 0;
        return session.players[playerIndex] ?? null;
      },

      canUndo: () => {
        const { session } = get();
        if (!session) return false;
        return session.previousCardIndex !== null && !session.undoUsedForCurrentCard;
      },

      isFinale: () => {
        const { session } = get();
        if (!session) return false;
        return session.currentPhase === 'finale';
      },
    }),
    {
      name: STORAGE_KEYS.ACTIVE_SESSION,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);