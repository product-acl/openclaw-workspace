import { shuffleDeck, composePartyDeck, isCardAvailable } from '../utils/deck';
import { Card } from '../types/card';
import { SessionConfig, Player } from '../types/session';

describe('Deck utilities', () => {
  // Mock data - using proper PartyCard type
  // Need at least 15 unlocked cards for party short deck test
  const mockCards: Card[] = [
    { id: '1', mode: 'party', type: 'dare', isLocked: false, intensityLevel: 1, drinkingText: 'Drink 1', nonDrinkingText: 'No drink 1', shortLabel: 'Dare 1' },
    { id: '2', mode: 'party', type: 'truth_bomb', isLocked: false, intensityLevel: 2, drinkingText: 'Drink 2', nonDrinkingText: 'No drink 2', shortLabel: 'Truth 1' },
    { id: '3', mode: 'party', type: 'vote', isLocked: false, intensityLevel: 3, drinkingText: 'Drink 3', nonDrinkingText: 'No drink 3', shortLabel: 'Vote 1' },
    { id: '4', mode: 'party', type: 'challenge_roulette', isLocked: false, intensityLevel: 1, drinkingText: 'Drink 4', nonDrinkingText: 'No drink 4', shortLabel: 'Challenge 1' },
    { id: '5', mode: 'party', type: 'wild', isLocked: false, intensityLevel: 2, drinkingText: 'Drink 5', nonDrinkingText: 'No drink 5', shortLabel: 'Wild 1' },
    { id: '6', mode: 'party', type: 'spicy', isLocked: false, intensityLevel: 3, drinkingText: 'Drink 6', nonDrinkingText: 'No drink 6', shortLabel: 'Spicy 1' },
    { id: '7', mode: 'party', type: 'dare', isLocked: false, intensityLevel: 1, drinkingText: 'Drink 7', nonDrinkingText: 'No drink 7', shortLabel: 'Dare 2' },
    { id: '8', mode: 'party', type: 'truth_bomb', isLocked: false, intensityLevel: 2, drinkingText: 'Drink 8', nonDrinkingText: 'No drink 8', shortLabel: 'Truth 2' },
    { id: '9', mode: 'party', type: 'vote', isLocked: false, intensityLevel: 3, drinkingText: 'Drink 9', nonDrinkingText: 'No drink 9', shortLabel: 'Vote 2' },
    { id: '10', mode: 'party', type: 'challenge_roulette', isLocked: false, intensityLevel: 1, drinkingText: 'Drink 10', nonDrinkingText: 'No drink 10', shortLabel: 'Challenge 2' },
    { id: '11', mode: 'party', type: 'wild', isLocked: false, intensityLevel: 2, drinkingText: 'Drink 11', nonDrinkingText: 'No drink 11', shortLabel: 'Wild 2' },
    { id: '12', mode: 'party', type: 'spicy', isLocked: false, intensityLevel: 3, drinkingText: 'Drink 12', nonDrinkingText: 'No drink 12', shortLabel: 'Spicy 2' },
    { id: '13', mode: 'party', type: 'dare', isLocked: false, intensityLevel: 1, drinkingText: 'Drink 13', nonDrinkingText: 'No drink 13', shortLabel: 'Dare 3' },
    { id: '14', mode: 'party', type: 'truth_bomb', isLocked: false, intensityLevel: 2, drinkingText: 'Drink 14', nonDrinkingText: 'No drink 14', shortLabel: 'Truth 3' },
    { id: '15', mode: 'party', type: 'vote', isLocked: false, intensityLevel: 3, drinkingText: 'Drink 15', nonDrinkingText: 'No drink 15', shortLabel: 'Vote 3' },
    { id: '16', mode: 'party', type: 'challenge_roulette', isLocked: true, intensityLevel: 1, drinkingText: 'Drink 16', nonDrinkingText: 'No drink 16', shortLabel: 'Challenge 3' },
    { id: '17', mode: 'party', type: 'wild', isLocked: true, intensityLevel: 2, drinkingText: 'Drink 17', nonDrinkingText: 'No drink 17', shortLabel: 'Wild 3' },
    { id: '18', mode: 'party', type: 'spicy', isLocked: true, intensityLevel: 3, drinkingText: 'Drink 18', nonDrinkingText: 'No drink 18', shortLabel: 'Spicy 3' },
    { id: '19', mode: 'party', type: 'dare', isLocked: true, intensityLevel: 1, drinkingText: 'Drink 19', nonDrinkingText: 'No drink 19', shortLabel: 'Dare 4' },
    { id: '20', mode: 'party', type: 'truth_bomb', isLocked: true, intensityLevel: 2, drinkingText: 'Drink 20', nonDrinkingText: 'No drink 20', shortLabel: 'Truth 4' },
  ];

  const mockPlayers: Player[] = [
    { id: 'p1', name: 'Player 1', score: 0 },
    { id: 'p2', name: 'Player 2', score: 0 },
  ];

  const mockConfig: SessionConfig = {
    mode: 'party',
    players: mockPlayers,
    sessionLength: 'short',
  };

  describe('shuffleDeck', () => {
    it('returns same elements (sort both, deep equal)', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleDeck(original);
      
      // Should have same length
      expect(shuffled.length).toBe(original.length);
      
      // Should contain all same elements (sorted comparison)
      expect([...shuffled].sort()).toEqual([...original].sort());
      
      // Should be a new array (not same reference)
      expect(shuffled).not.toBe(original);
    });
  });

  describe('composePartyDeck', () => {
    it('short returns exactly 15 cards', () => {
      const deck = composePartyDeck(mockCards, mockConfig, false);
      expect(deck.length).toBe(15);
    });

    it('when isUnlocked=false, first min(10, deck.length) cards all have isLocked=false', () => {
      const deck = composePartyDeck(mockCards, mockConfig, false);
      
      // Check first cards (up to 10 or deck length)
      const checkCount = Math.min(10, deck.length);
      for (let i = 0; i < checkCount; i++) {
        expect(deck[i].isLocked).toBe(false);
      }
    });
  });

  describe('isCardAvailable', () => {
    it('returns true for unlocked card when isUnlocked=false', () => {
      const card: Card = { id: '1', mode: 'party', type: 'dare', isLocked: false, intensityLevel: 1, drinkingText: 'Drink 1', nonDrinkingText: 'No drink 1', shortLabel: 'Dare 1' };
      expect(isCardAvailable(card, false)).toBe(true);
    });

    it('returns false for locked card when isUnlocked=false', () => {
      const card: Card = { id: '1', mode: 'party', type: 'dare', isLocked: true, intensityLevel: 1, drinkingText: 'Drink 1', nonDrinkingText: 'No drink 1', shortLabel: 'Dare 1' };
      expect(isCardAvailable(card, false)).toBe(false);
    });

    it('returns true for locked card when isUnlocked=true', () => {
      const card: Card = { id: '1', mode: 'party', type: 'dare', isLocked: true, intensityLevel: 1, drinkingText: 'Drink 1', nonDrinkingText: 'No drink 1', shortLabel: 'Dare 1' };
      expect(isCardAvailable(card, true)).toBe(true);
    });
  });
});