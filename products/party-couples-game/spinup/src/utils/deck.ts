import { Card } from '../types/card';
import { SessionConfig } from '../types/session';
import { PARTY_SESSION_LENGTHS, COUPLES_SESSION_LENGTHS } from '../constants/game';

/**
 * Fisher-Yates shuffle, returns a new shuffled array
 */
export function shuffleDeck<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Check if a card is available based on unlock status
 */
export function isCardAvailable(card: Card, isUnlocked: boolean): boolean {
  return !card.isLocked || (card.isLocked && isUnlocked);
}

/**
 * Compose a party deck based on configuration
 */
export function composePartyDeck(
  allCards: Card[],
  config: SessionConfig,
  isUnlocked: boolean
): Card[] {
  // 1. Filter mode='party' cards
  const partyCards = allCards.filter(card => card.mode === 'party');
  
  // 2. Filter by isCardAvailable
  const availableCards = partyCards.filter(card => isCardAvailable(card, isUnlocked));
  
  // Get session length
  const sessionLength = PARTY_SESSION_LENGTHS[config.sessionLength];
  
  // 3. If !isUnlocked: split free/locked, shuffle each separately
  if (!isUnlocked) {
    const freeCards = availableCards.filter(card => !card.isLocked);
    const lockedCards = availableCards.filter(card => card.isLocked);
    
    const freeShuffled = shuffleDeck(freeCards);
    const lockedShuffled = shuffleDeck(lockedCards);
    
    // Concat and slice to session length
    const combined = [...freeShuffled, ...lockedShuffled];
    return combined.slice(0, sessionLength);
  }
  
  // 4. If isUnlocked: shuffle all, slice to session length
  const shuffled = shuffleDeck(availableCards);
  return shuffled.slice(0, sessionLength);
}

/**
 * Compose a couples deck based on configuration
 */
export function composeCouplesDeck(
  allCards: Card[],
  config: SessionConfig,
  isUnlocked: boolean
): Card[] {
  // 1. Filter mode='couples' cards
  const couplesCards = allCards.filter(card => card.mode === 'couples');
  
  // 2. Filter by isCardAvailable
  const availableCards = couplesCards.filter(card => isCardAvailable(card, isUnlocked));
  
  // Get session length
  const sessionLength = COUPLES_SESSION_LENGTHS[config.sessionLength];
  
  // 3. Split into warmup, finale, main
  const warmupCards = availableCards.filter(card => card.mode === 'couples' && card.phase === 'warmup');
  const finaleCards = availableCards.filter(card => card.mode === 'couples' && card.phase === 'finale');
  const mainCards = availableCards.filter(card => 
    card.mode === 'couples' && (card.phase === null || card.phase === 'main')
  );
  
  // 4. Shuffle each bucket independently
  const warmupShuffled = shuffleDeck(warmupCards);
  const finaleShuffled = shuffleDeck(finaleCards);
  const mainShuffled = shuffleDeck(mainCards);
  
  // 5. Concat and slice to session length
  const combined = [...warmupShuffled, ...mainShuffled, ...finaleShuffled];
  return combined.slice(0, sessionLength);
}