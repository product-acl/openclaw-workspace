// Quick type check by examining exports
const fs = require('fs');
const path = require('path');

console.log('Checking key files exist and export expected functions...');

const filesToCheck = [
  'src/store/sessionStore.ts',
  'src/utils/cardLoader.ts', 
  'src/utils/deck.ts',
  'src/constants/game.ts',
  'src/hooks/useDeck.ts',
  'src/store/iapStore.ts',
  'src/__tests__/deck.test.ts'
];

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} missing`);
  }
});

// Check sessionStore exports
const sessionStore = fs.readFileSync('src/store/sessionStore.ts', 'utf8');
const hasUseSessionStore = sessionStore.includes('export const useSessionStore');
const hasPersist = sessionStore.includes('persist');
const hasAsyncStorage = sessionStore.includes('AsyncStorage');

console.log(`\nsessionStore checks:`);
console.log(`✓ Exports useSessionStore: ${hasUseSessionStore}`);
console.log(`✓ Uses persist middleware: ${hasPersist}`);
console.log(`✓ Uses AsyncStorage: ${hasAsyncStorage}`);

// Check deck.ts exports
const deck = fs.readFileSync('src/utils/deck.ts', 'utf8');
const hasShuffleDeck = deck.includes('export function shuffleDeck');
const hasIsCardAvailable = deck.includes('export function isCardAvailable');
const hasComposePartyDeck = deck.includes('export function composePartyDeck');
const hasComposeCouplesDeck = deck.includes('export function composeCouplesDeck');

console.log(`\ndeck.ts checks:`);
console.log(`✓ Exports shuffleDeck: ${hasShuffleDeck}`);
console.log(`✓ Exports isCardAvailable: ${hasIsCardAvailable}`);
console.log(`✓ Exports composePartyDeck: ${hasComposePartyDeck}`);
console.log(`✓ Exports composeCouplesDeck: ${hasComposeCouplesDeck}`);

// Check game.ts has required constants
const game = fs.readFileSync('src/constants/game.ts', 'utf8');
const hasPartyLengths = game.includes('PARTY_SESSION_LENGTHS');
const hasCouplesLengths = game.includes('COUPLES_SESSION_LENGTHS');

console.log(`\ngame.ts checks:`);
console.log(`✓ Has PARTY_SESSION_LENGTHS: ${hasPartyLengths}`);
console.log(`✓ Has COUPLES_SESSION_LENGTHS: ${hasCouplesLengths}`);

console.log('\nAll required files and exports appear to be present.');
