export type GameMode = 'party' | 'couples';
export type PartyCardType = 'dare' | 'truth_bomb' | 'vote' | 'challenge_roulette' | 'wild' | 'spicy';
export type CouplesCardType = 'dare_duel' | 'memory_challenge' | 'spin_the_scenario' | 'finale_special';
export type ContentTier = 'romantic' | 'flirty' | 'spicy';
export type SessionPhase = 'warmup' | 'main' | 'finale';
export type IntensityLevel = 1 | 2 | 3;
export type Card = PartyCard | CouplesCard;
export interface PartyCard {
  id: string; mode: 'party'; type: PartyCardType; isLocked: boolean;
  intensityLevel: IntensityLevel; drinkingText: string; nonDrinkingText: string; shortLabel: string;
}
export interface CouplesCard {
  id: string; mode: 'couples'; type: CouplesCardType; tier: ContentTier; isLocked: boolean;
  phase: SessionPhase | null; text: string; shortLabel: string; pointValue: number;
}