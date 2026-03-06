export const SESSION_CARD_COUNTS = {
  party: { short: 15, medium: 30, long: 50 },
  couples: { short: 20, medium: 35, long: 55 },
} as const;

export const PARTY_SESSION_LENGTHS = { short: 15, medium: 30, long: 50 } as const;
export const COUPLES_SESSION_LENGTHS = { short: 20, medium: 35, long: 55 } as const;

export const PARTY_DECK_RATIOS = {
  short:  { dare: 6,  truth_bomb: 4, vote: 3, challenge_roulette: 2 },
  medium: { dare: 12, truth_bomb: 7, vote: 6, challenge_roulette: 5 },
  long:   { dare: 17, truth_bomb: 12, vote: 9, challenge_roulette: 7, wild: 5 },
} as const;