import { Card, ContentTier, GameMode, SessionPhase } from './card';
export type SessionLength = 'short' | 'medium' | 'long';
export interface Player { id: string; name: string; score: number; }
export interface GameSession {
  id: string; mode: GameMode; players: Player[]; deck: Card[];
  currentCardIndex: number; previousCardIndex: number | null;
  undoUsedForCurrentCard: boolean; isComplete: boolean; totalCards: number;
  sessionLength: SessionLength; startedAt: number;
  drinkingMode?: boolean; activePlayerIndex?: number;
  contentTier?: ContentTier; currentPhase?: SessionPhase; finaleStartIndex?: number;
}
export interface SessionConfig {
  mode: GameMode; players: Player[]; sessionLength: SessionLength;
  drinkingMode?: boolean; contentTier?: ContentTier;
}