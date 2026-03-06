import { Card } from './src/types/card';
import { SessionConfig } from './src/types/session';

const card: Card = {
  id: '1',
  mode: 'party',
  type: 'dare',
  isLocked: false,
  intensityLevel: 1,
  drinkingText: 'test',
  nonDrinkingText: 'test',
  shortLabel: 'test'
};

const config: SessionConfig = {
  mode: 'party',
  players: [{ id: '1', name: 'test', score: 0 }],
  sessionLength: 'short'
};

console.log('Type check passed');
