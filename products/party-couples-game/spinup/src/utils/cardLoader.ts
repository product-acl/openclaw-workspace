import { Card } from '../types/card';

// Import party card data
import dareParty from '../content/party/dare.json';
import truthBombParty from '../content/party/truth-bomb.json';
import voteParty from '../content/party/vote.json';
import challengeRouletteParty from '../content/party/challenge-roulette.json';
import wildParty from '../content/party/wild.json';
import spicyParty from '../content/party/spicy.json';

// Import couples card data
import dareDuelCouples from '../content/couples/dare-duel.json';
import memoryChallengeCouples from '../content/couples/memory-challenge.json';
import spinTheScenarioCouples from '../content/couples/spin-the-scenario.json';
import finaleSpecialsCouples from '../content/couples/finale-specials.json';

// Module-level cache
let allCardsCache: Card[] | null = null;

/**
 * Get all cards from all JSON files, merged into a flat array.
 * Results are cached at module level.
 */
export function getAllCards(): Card[] {
  if (allCardsCache) {
    return allCardsCache;
  }

  // Cast JSON imports to Card[] (they should match the Card type)
  const partyCards: Card[] = [
    ...(dareParty as Card[]),
    ...(truthBombParty as Card[]),
    ...(voteParty as Card[]),
    ...(challengeRouletteParty as Card[]),
    ...(wildParty as Card[]),
    ...(spicyParty as Card[]),
  ];

  const couplesCards: Card[] = [
    ...(dareDuelCouples as Card[]),
    ...(memoryChallengeCouples as Card[]),
    ...(spinTheScenarioCouples as Card[]),
    ...(finaleSpecialsCouples as Card[]),
  ];

  allCardsCache = [...partyCards, ...couplesCards];
  return allCardsCache;
}