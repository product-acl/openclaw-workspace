import { useCallback } from 'react';
import { SessionConfig } from '../types/session';
import { Card } from '../types/card';
import { getAllCards } from '../utils/cardLoader';
import { composePartyDeck, composeCouplesDeck } from '../utils/deck';
import { useIapStore } from '../store/iapStore';

export function useDeck() {
  const isUnlocked = useIapStore(state => state.isUnlocked);

  const buildDeck = useCallback((config: SessionConfig): Card[] => {
    const allCards = getAllCards();
    
    if (config.mode === 'party') {
      return composePartyDeck(allCards, config, isUnlocked);
    } else {
      return composeCouplesDeck(allCards, config, isUnlocked);
    }
  }, [isUnlocked]);

  return { buildDeck };
}