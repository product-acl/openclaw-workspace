# SpinUp — Technical Specification
**Version:** 1.0  
**Author:** Architect Agent (BAIcan)  
**Date:** 2026-03-06  
**Status:** READY FOR IMPLEMENTATION  
**Target Ship:** Sunday 2026-03-08  

---

## Table of Contents
1. [Project Structure](#1-project-structure)
2. [Dependency List](#2-dependency-list)
3. [TypeScript Data Models](#3-typescript-data-models)
4. [State Architecture](#4-state-architecture)
5. [Card Content Architecture](#5-card-content-architecture)
6. [IAP Integration Design](#6-iap-integration-design)
7. [Navigation Architecture](#7-navigation-architecture)
8. [AsyncStorage Keys & Data Shapes](#8-asyncstorage-keys--data-shapes)
9. [Error Handling Patterns](#9-error-handling-patterns)
10. [Build Config (eas.json)](#10-build-config-easjson)
11. [Architecture Decisions & Rationale](#11-architecture-decisions--rationale)
12. [Ambiguities & Risk Flags](#12-ambiguities--risk-flags)

---

## 1. Project Structure

```
spinup/
├── app.json                    # Expo app config
├── eas.json                    # EAS Build profiles
├── tsconfig.json               # TypeScript config with path aliases
├── babel.config.js             # Babel config (module-resolver plugin)
├── package.json
├── assets/
│   ├── icon.png                # 1024x1024 app icon
│   ├── splash.png              # Splash screen
│   ├── adaptive-icon.png       # Android adaptive icon
│   └── fonts/                  # Custom fonts (if any)
└── src/
    ├── types/
    │   ├── card.ts             # Card, CardType, ContentTier, etc.
    │   ├── session.ts          # GameSession, Player, SessionConfig
    │   └── iap.ts             # IAPEntitlement
    ├── content/
    │   ├── party/
    │   │   ├── dare.json
    │   │   ├── truth-bomb.json
    │   │   ├── vote.json
    │   │   ├── challenge-roulette.json
    │   │   ├── wild.json       # locked
    │   │   └── spicy.json      # locked (placeholder for v1.1)
    │   └── couples/
    │       ├── dare-duel.json
    │       ├── memory-challenge.json
    │       ├── spin-the-scenario.json
    │       └── finale-specials.json
    ├── store/
    │   ├── appStore.ts         # App-level state (onboarding, tutorial flags)
    │   ├── sessionStore.ts     # Active game session state
    │   └── iapStore.ts        # IAP entitlement state
    ├── navigation/
    │   ├── RootNavigator.tsx   # Root stack with modal group
    │   ├── PartyNavigator.tsx  # Party mode stack
    │   ├── CouplesNavigator.tsx# Couples mode stack
    │   └── types.ts            # NavigationProp type exports
    ├── screens/
    │   ├── HomeScreen.tsx
    │   ├── OnboardingScreen.tsx
    │   ├── party/
    │   │   ├── PartySetupScreen.tsx
    │   │   ├── PartyGameScreen.tsx
    │   │   └── PartyEndScreen.tsx
    │   ├── couples/
    │   │   ├── CouplesSetupScreen.tsx
    │   │   ├── CouplesGameScreen.tsx
    │   │   └── CouplesEndScreen.tsx
    │   └── modals/
    │       ├── PaywallModal.tsx
    │       └── ExitConfirmModal.tsx
    ├── components/
    │   ├── cards/
    │   │   ├── CardDisplay.tsx         # Full-screen card renderer
    │   │   ├── CardTypeBadge.tsx       # "DARE", "TRUTH BOMB" badge
    │   │   └── CardTransition.tsx      # Animated card flip/slide
    │   ├── game/
    │   │   ├── PlayerNameInput.tsx     # Party setup name entry
    │   │   ├── SessionLengthPicker.tsx
    │   │   ├── ContentTierPicker.tsx   # Couples tier selector
    │   │   ├── ScoreDisplay.tsx        # Live score bar (Couples)
    │   │   ├── ProgressIndicator.tsx   # "Card 8 of 30"
    │   │   ├── UndoButton.tsx
    │   │   └── CountdownTimer.tsx      # Spin the Scenario 30s timer
    │   ├── paywall/
    │   │   ├── PaywallFeatureList.tsx
    │   │   └── PaywallCTA.tsx
    │   └── ui/
    │       ├── Button.tsx              # Styled button variants
    │       ├── Modal.tsx               # Base modal wrapper
    │       ├── LockIcon.tsx
    │       └── PointsAnimation.tsx     # "+2 pts" animated badge
    ├── hooks/
    │   ├── useSession.ts       # Session-aware helpers
    │   ├── useEntitlement.ts   # IAP entitlement hook
    │   ├── useDeck.ts          # Deck loading and composition
    │   └── useAppState.ts      # App foreground/background listener
    ├── utils/
    │   ├── deck.ts             # Shuffle, compose, filter logic
    │   ├── storage.ts          # AsyncStorage typed wrapper
    │   ├── cardLoader.ts       # Load + merge JSON content files
    │   └── scoring.ts          # Points calculation helpers
    └── constants/
        ├── storageKeys.ts      # All AsyncStorage key strings
        ├── iap.ts              # RevenueCat product/entitlement IDs
        └── game.ts             # Session length card counts, composition ratios
```

### Naming Conventions
- **Files:** PascalCase for components/screens, camelCase for utils/hooks/stores
- **Types:** PascalCase interfaces, `type` aliases for unions
- **Zustand stores:** `useXxxStore` hook exported from each store file
- **Screen names (navigation):** `'PartySetup'`, `'PartyGame'`, `'CouplesSetup'`, etc. — PascalCase string literals
- **JSON content files:** kebab-case, singular noun

---

## 2. Dependency List

### Runtime Dependencies

| Package | Version | Justification |
|---------|---------|---------------|
| `expo` | `~52.0.0` | Managed workflow SDK — provides OTA updates, build tooling, native module abstraction |
| `react` | `18.3.x` | Peer dependency of React Native |
| `react-native` | `0.76.x` | Core framework (pinned by Expo SDK 52) |
| `@react-navigation/native` | `^7.0.0` | Navigation core library; v7 is current stable with improved type safety |
| `@react-navigation/stack` | `^7.0.0` | Stack navigator for screen transitions with gesture support |
| `react-native-screens` | `^4.0.0` | Native screen container optimization; required by React Navigation |
| `react-native-safe-area-context` | `^4.0.0` | Notch/dynamic island safe area insets; required by React Navigation |
| `react-native-gesture-handler` | `^2.0.0` | Gesture system required by @react-navigation/stack |
| `zustand` | `^5.0.0` | Minimal state management (locked decision); simpler API than Redux, no boilerplate |
| `@react-native-async-storage/async-storage` | `^2.0.0` | Session persistence across backgrounding |
| `react-native-purchases` | `^8.0.0` | RevenueCat SDK for cross-platform IAP abstraction (locked decision) |
| `react-native-reanimated` | `^3.0.0` | Performant card flip/slide animations running on the UI thread |
| `expo-haptics` | `~14.0.0` | Haptic feedback on card taps and key interactions |
| `expo-linear-gradient` | `~14.0.0` | Background gradients on home screen and cards for visual polish |
| `expo-font` | `~13.0.0` | Custom font loading if needed; available as Expo module |
| `expo-splash-screen` | `~0.29.0` | Controlled splash screen hide after fonts/data load |
| `expo-application` | `~6.0.0` | App version/build number for display in settings if needed |

### Dev Dependencies

| Package | Version | Justification |
|---------|---------|---------------|
| `typescript` | `^5.0.0` | Type safety; project-wide |
| `@types/react` | `^18.0.0` | React TypeScript types |
| `babel-plugin-module-resolver` | `^5.0.0` | Path aliases (`@/components`, `@/store`, etc.) |
| `eslint` | `^9.0.0` | Linting |
| `eslint-config-expo` | latest | Expo-specific ESLint rules |
| `prettier` | `^3.0.0` | Code formatting |
| `jest` | `^29.0.0` | Unit tests for deck logic and utility functions |
| `jest-expo` | `~52.0.0` | Jest preset for Expo projects |

---

## 3. TypeScript Data Models

```typescript
// src/types/card.ts

export type GameMode = 'party' | 'couples';

export type PartyCardType =
  | 'dare'
  | 'truth_bomb'
  | 'vote'
  | 'challenge_roulette'
  | 'wild'
  | 'spicy';

export type CouplesCardType =
  | 'dare_duel'
  | 'memory_challenge'
  | 'spin_the_scenario'
  | 'finale_special';

export type ContentTier = 'romantic' | 'flirty' | 'spicy';

export type SessionPhase = 'warmup' | 'main' | 'finale';

export type IntensityLevel = 1 | 2 | 3;

// Discriminated union — a card belongs to exactly one mode
export type Card = PartyCard | CouplesCard;

export interface PartyCard {
  id: string;
  mode: 'party';
  type: PartyCardType;
  isLocked: boolean;
  intensityLevel: IntensityLevel;
  drinkingText: string;       // Full card text with drinking references
  nonDrinkingText: string;    // Swap text without drinking references
  shortLabel: string;         // Short label for progress UI (max 20 chars)
}

export interface CouplesCard {
  id: string;
  mode: 'couples';
  type: CouplesCardType;
  tier: ContentTier;
  isLocked: boolean;           // true for flirty and spicy
  phase: SessionPhase | null;  // null = any phase; 'finale' = finale only
  text: string;                // Card body text
  shortLabel: string;
  pointValue: number;          // Base points for completing this card
}
```

```typescript
// src/types/session.ts

import { Card, ContentTier, GameMode, SessionPhase } from './card';

export type SessionLength = 'short' | 'medium' | 'long';

export interface Player {
  id: string;        // uuid generated at session start
  name: string;      // custom or "Player N"
  score: number;     // always 0 for party mode
}

export interface GameSession {
  id: string;                        // uuid
  mode: GameMode;
  players: Player[];
  deck: Card[];                      // ordered shuffled deck for this session
  currentCardIndex: number;          // index into deck
  previousCardIndex: number | null;  // for undo; null when undo unavailable
  undoUsedForCurrentCard: boolean;   // prevent double-undo
  isComplete: boolean;
  totalCards: number;                // session length in cards (15/30/50 or 20/35/55)
  sessionLength: SessionLength;
  startedAt: number;                 // Date.now() timestamp
  
  // Party Mode only
  drinkingMode?: boolean;
  activePlayerIndex?: number;        // round-robin cursor

  // Couples Mode only
  contentTier?: ContentTier;
  currentPhase?: SessionPhase;
  activePlayerIndex?: number;        // alternating turn cursor
  finaleStartIndex?: number;         // card index where finale begins
}

export interface SessionConfig {
  mode: GameMode;
  players: Player[];
  sessionLength: SessionLength;
  drinkingMode?: boolean;       // party only
  contentTier?: ContentTier;    // couples only
}
```

```typescript
// src/types/iap.ts

export interface IAPEntitlement {
  isUnlocked: boolean;
  productId: string | null;
  purchaseDate: string | null;   // ISO date string
  isRestored: boolean;
  lastCheckedAt: number | null;  // Date.now() timestamp for cache validity
}
```

---

## 4. State Architecture

### What Lives in Zustand Stores

#### `appStore.ts`
Persisted to AsyncStorage on every write.

```typescript
interface AppState {
  // Onboarding flags
  hasCompletedOnboarding: boolean;
  hasSeenPartyTutorial: boolean;
  hasSeenCouplesTutorial: boolean;
  drinkingDisclaimerShown: boolean;

  // User preferences
  lastSelectedCouplesTier: ContentTier;  // default: 'romantic'
  drinkingModeDefault: boolean;           // default: true

  // Actions
  markOnboardingComplete: () => void;
  markPartyTutorialSeen: () => void;
  markCouplesTutorialSeen: () => void;
  markDrinkingDisclaimerShown: () => void;
  setLastCouplesTier: (tier: ContentTier) => void;
}
```

#### `sessionStore.ts`
Persisted to AsyncStorage for background survival. Cleared on session end.

```typescript
interface SessionState {
  session: GameSession | null;

  // Actions
  startSession: (config: SessionConfig, deck: Card[]) => void;
  advanceCard: () => void;
  undoCard: () => void;
  resolveCard: (pointsAwarded?: number) => void; // couples only points
  endSession: () => void;
  
  // Computed getters (not stored, derived from session)
  currentCard: () => Card | null;
  currentPlayer: () => Player | null;
  canUndo: () => boolean;
  isFinale: () => boolean;
}
```

#### `iapStore.ts`
Persisted to AsyncStorage as a cache (RevenueCat is source of truth).

```typescript
interface IAPState {
  entitlement: IAPEntitlement;
  isLoading: boolean;
  purchaseError: string | null;

  // Actions
  checkEntitlement: () => Promise<void>;   // hits RevenueCat API
  purchase: () => Promise<void>;
  restore: () => Promise<void>;
  clearError: () => void;
}
```

### What Lives in Local Component State

- Text field values in PlayerNameInput, CouplesSetupScreen
- Modal open/close (PaywallModal, ExitConfirmModal)
- Countdown timer state in CountdownTimer
- Animation state in CardTransition, PointsAnimation
- Dare Duel rating slider value
- Memory Challenge answer text inputs

**Rule:** If state needs to survive navigation or background → Zustand. If it's ephemeral within a screen render cycle → local `useState`.

---

## 5. Card Content Architecture

### JSON Schema

#### Party Card JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "type", "isLocked", "intensityLevel", "drinkingText", "nonDrinkingText", "shortLabel"],
    "properties": {
      "id":              { "type": "string", "pattern": "^party-(dare|truth_bomb|vote|cr|wild|spicy)-\\d{3}$" },
      "type":            { "type": "string", "enum": ["dare","truth_bomb","vote","challenge_roulette","wild","spicy"] },
      "isLocked":        { "type": "boolean" },
      "intensityLevel":  { "type": "integer", "enum": [1, 2, 3] },
      "drinkingText":    { "type": "string", "maxLength": 200 },
      "nonDrinkingText": { "type": "string", "maxLength": 200 },
      "shortLabel":      { "type": "string", "maxLength": 30 }
    }
  }
}
```

#### Couples Card JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "type", "tier", "isLocked", "phase", "text", "shortLabel", "pointValue"],
    "properties": {
      "id":         { "type": "string", "pattern": "^couples-(dd|mc|ss|fs)-\\d{3}$" },
      "type":       { "type": "string", "enum": ["dare_duel","memory_challenge","spin_the_scenario","finale_special"] },
      "tier":       { "type": "string", "enum": ["romantic","flirty","spicy"] },
      "isLocked":   { "type": "boolean" },
      "phase":      { "type": ["string","null"], "enum": ["warmup","main","finale",null] },
      "text":       { "type": "string", "maxLength": 300 },
      "shortLabel": { "type": "string", "maxLength": 30 },
      "pointValue": { "type": "integer", "minimum": 1 }
    }
  }
}
```

### Example Card Records

```json
// src/content/party/dare.json (excerpt)
[
  {
    "id": "party-dare-001",
    "type": "dare",
    "isLocked": false,
    "intensityLevel": 1,
    "drinkingText": "Do your best impression of the person to your right. Refuse? Drink 2.",
    "nonDrinkingText": "Do your best impression of the person to your right. Refuse? Do 10 jumping jacks.",
    "shortLabel": "Impression dare"
  },
  {
    "id": "party-dare-016",
    "type": "dare",
    "isLocked": true,
    "intensityLevel": 2,
    "drinkingText": "Trade phones with the person to your left for 2 minutes. Refuse? Drink 4.",
    "nonDrinkingText": "Trade phones with the person to your left for 2 minutes. Refuse? Give everyone in the group a compliment.",
    "shortLabel": "Phone swap dare"
  }
]
```

```json
// src/content/couples/dare-duel.json (excerpt)
[
  {
    "id": "couples-dd-001",
    "type": "dare_duel",
    "tier": "romantic",
    "isLocked": false,
    "phase": null,
    "text": "Dare Duel: Draw a 60-second portrait of your partner. They rate it 1–10. Highest score wins.",
    "shortLabel": "Portrait duel",
    "pointValue": 3
  }
]
```

### How Free vs Locked Is Determined

**Single source of truth: the `isLocked` field on the Card object.**

- Party Mode: Cards in `dare.json`, `truth-bomb.json`, `vote.json`, `challenge-roulette.json` have `isLocked: false` for free cards and `isLocked: true` for locked. All cards in `wild.json` and `spicy.json` are `isLocked: true`.
- Couples Mode: All `tier: 'romantic'` cards are `isLocked: false`. All `tier: 'flirty'` and `tier: 'spicy'` cards are `isLocked: true`.

**At runtime**, the `cardLoader` utility loads all JSON bundles at app startup into a flat `Card[]`. The deck composition function (`deck.ts`) uses `isLocked` + the `IAPEntitlement.isUnlocked` flag to determine card availability:

```
isCardAvailable(card, entitlement):
  if !card.isLocked → always available
  if card.isLocked && entitlement.isUnlocked → available
  if card.isLocked && !entitlement.isUnlocked → gated
```

Locked cards are **included in the bundle** (Expo managed workflow bundles all assets). They are not protected by encryption — this is acceptable for v1.0. The gate is the entitlement check, not binary hiding of content.

### File Structure — Card Content

```
src/content/
├── party/
│   ├── dare.json              # 50 cards (15 free + 35 locked)
│   ├── truth-bomb.json        # 40 cards (12 free + 28 locked)
│   ├── vote.json              # 32 cards (10 free + 22 locked)
│   ├── challenge-roulette.json# 28 cards (8 free + 20 locked)
│   ├── wild.json              # 15 cards (all locked)
│   └── spicy.json             # 25 cards (all locked) — v1.1 content, "coming soon"
└── couples/
    ├── dare-duel.json         # 40 cards (12 romantic + 18 flirty + 10 spicy)
    ├── memory-challenge.json  # 38 cards (15 romantic + 15 flirty + 8 spicy)
    ├── spin-the-scenario.json # 42 cards (13 romantic + 17 flirty + 12 spicy)
    └── finale-specials.json   # 20 cards (5 romantic + 8 flirty + 7 spicy)
```

### Deck Composition Rules

#### Party Mode
```
cardLoader → filterByMode('party') → filterByEntitlement()
  → compose deck:
      Short  (15 cards): intensity 1–2 only; ratio Dare:TB:Vote:CR = 6:4:3:2
      Medium (30 cards): intensity 1–3; ratio Dare:TB:Vote:CR = 12:7:6:5
      Long   (50 cards): intensity 1–3 + Wild; ratio Dare:TB:Vote:CR:Wild = 17:12:9:7:5
  → shuffle with Fisher-Yates
  → if entitlement locked: replace locked cards in positions >10 with free cards
    (ensures 10+ free cards before first paywall hit in Medium sessions)
```

#### Couples Mode
```
cardLoader → filterByMode('couples') → filterByTier(selectedTier) → filterByEntitlement()
  → split into phases:
      Warmup (25%): phase === 'warmup' || (phase === null && intensityLevel 1)
      Main   (50%): phase === 'main' || phase === null
      Finale (25%): phase === 'finale' (finale_special type)
  → shuffle each phase bucket independently
  → concatenate: [...warmup, ...main, ...finale]
```

---

## 6. IAP Integration Design

### RevenueCat Setup

**Product IDs (must match App Store Connect and Play Console exactly):**
```typescript
// src/constants/iap.ts
export const IAP_PRODUCT_ID = 'spinup_unlock_everything';
export const IAP_ENTITLEMENT_ID = 'full_access';
export const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_RC_IOS_KEY!;
export const REVENUECAT_ANDROID_API_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_KEY!;
```

**RevenueCat Dashboard config:**
- Product: `spinup_unlock_everything` → Non-consumable, $4.99
- Entitlement: `full_access` → attach `spinup_unlock_everything`
- Offering: `default` → one package: the unlock product

### Initialization

Initialize RevenueCat in the root component (App.tsx or RootNavigator) before any game screens render:

```typescript
// src/navigation/RootNavigator.tsx
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

useEffect(() => {
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  const apiKey = Platform.select({
    ios: REVENUECAT_IOS_API_KEY,
    android: REVENUECAT_ANDROID_API_KEY,
  })!;
  Purchases.configure({ apiKey });
  
  // Initial entitlement check
  iapStore.checkEntitlement();
}, []);
```

### Entitlement Check Pattern

```typescript
// src/store/iapStore.ts
checkEntitlement: async () => {
  set({ isLoading: true });
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const isUnlocked = IAP_ENTITLEMENT_ID in customerInfo.entitlements.active;
    const entitlement: IAPEntitlement = {
      isUnlocked,
      productId: isUnlocked ? IAP_PRODUCT_ID : null,
      purchaseDate: customerInfo.entitlements.active[IAP_ENTITLEMENT_ID]?.latestPurchaseDate ?? null,
      isRestored: false,
      lastCheckedAt: Date.now(),
    };
    set({ entitlement, isLoading: false });
    // Persist to AsyncStorage as cache
    await storage.set(STORAGE_KEYS.IAP_ENTITLEMENT_CACHE, entitlement);
  } catch (err) {
    // On network failure: fall back to cached entitlement
    const cached = await storage.get<IAPEntitlement>(STORAGE_KEYS.IAP_ENTITLEMENT_CACHE);
    if (cached) set({ entitlement: cached });
    set({ isLoading: false });
  }
}
```

**Re-check entitlement on:** App foreground (AppState `active` event). This handles restore after reinstall.

### Paywall Trigger Logic

```
PartyGame: before rendering currentCard
  → if currentCard.isLocked && !isUnlocked
    → push 'Paywall' modal to navigation stack (modal presentation)
    → session remains in sessionStore (not ended)
    → on paywall dismiss (no purchase): skip locked card, call sessionStore.advanceCard()
    → on paywall success (purchase): re-check entitlement, re-draw same card position

CouplesSetup: tier selector
  → if tapped tier is 'flirty' or 'spicy' && !isUnlocked
    → push 'Paywall' modal (don't start session yet)

Party session length: 'long'
  → if !isUnlocked → push 'Paywall' modal immediately (before session init)

Post-session upsell:
  → on EndScreen mount, if !isUnlocked → show dismissable banner (not modal)
```

### Purchase Flow

```typescript
purchase: async () => {
  set({ isLoading: true, purchaseError: null });
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    if (!pkg) throw new Error('No package available');
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isUnlocked = IAP_ENTITLEMENT_ID in customerInfo.entitlements.active;
    set({
      entitlement: { isUnlocked, productId: IAP_PRODUCT_ID, purchaseDate: new Date().toISOString(), isRestored: false, lastCheckedAt: Date.now() },
      isLoading: false,
    });
  } catch (err: any) {
    if (!err.userCancelled) {
      set({ purchaseError: err.message ?? 'Purchase failed. Try again.' });
    }
    set({ isLoading: false });
  }
}
```

### Restore Flow

```typescript
restore: async () => {
  set({ isLoading: true, purchaseError: null });
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isUnlocked = IAP_ENTITLEMENT_ID in customerInfo.entitlements.active;
    set({
      entitlement: { isUnlocked, productId: isUnlocked ? IAP_PRODUCT_ID : null, purchaseDate: null, isRestored: true, lastCheckedAt: Date.now() },
      isLoading: false,
    });
    // Show user feedback: success or "no purchase found"
  } catch (err: any) {
    set({ purchaseError: 'Restore failed. Please try again.', isLoading: false });
  }
}
```

---

## 7. Navigation Architecture

### Stack Structure

```
RootNavigator (Stack, headerShown: false, screenOptions: gestureEnabled: false)
│
├── 'Home'           → HomeScreen.tsx
│     (first launch: auto-redirect to 'Onboarding')
│
├── 'Onboarding'     → OnboardingScreen.tsx
│     (shown once; sets hasCompletedOnboarding → navigates to 'Home')
│
├── 'PartyStack'     → PartyNavigator (nested Stack)
│   ├── 'PartySetup'  → PartySetupScreen.tsx
│   ├── 'PartyGame'   → PartyGameScreen.tsx
│   └── 'PartyEnd'    → PartyEndScreen.tsx
│
├── 'CouplesStack'   → CouplesNavigator (nested Stack)
│   ├── 'CouplesSetup' → CouplesSetupScreen.tsx
│   ├── 'CouplesGame'  → CouplesGameScreen.tsx
│   └── 'CouplesEnd'   → CouplesEndScreen.tsx
│
└── Modal Group (presentation: 'modal', headerShown: false)
    ├── 'Paywall'       → PaywallModal.tsx
    └── 'ExitConfirm'  → ExitConfirmModal.tsx
```

### Screen Transitions
- **Home → PartyStack/CouplesStack:** Push (default horizontal slide)
- **PartySetup → PartyGame:** Push
- **PartyGame → PartyEnd:** Replace (no back gesture — session is done)
- **CouplesGame → CouplesEnd:** Replace
- **Any screen → Paywall:** Modal slide-up
- **Any screen → ExitConfirm:** Modal slide-up (semi-transparent bg)
- **PartyEnd/CouplesEnd → Home:** Navigate to root 'Home' (reset stack)

### Navigation Type Safety

```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Onboarding: undefined;
  PartyStack: NavigatorScreenParams<PartyStackParamList>;
  CouplesStack: NavigatorScreenParams<CouplesStackParamList>;
  Paywall: { returnTo?: string };    // context: where to resume after
  ExitConfirm: undefined;
};

export type PartyStackParamList = {
  PartySetup: undefined;
  PartyGame: undefined;
  PartyEnd: undefined;
};

export type CouplesStackParamList = {
  CouplesSetup: undefined;
  CouplesGame: undefined;
  CouplesEnd: undefined;
};
```

### Deep Links
None required for v1.0. No external entry points.

---

## 8. AsyncStorage Keys & Data Shapes

```typescript
// src/constants/storageKeys.ts
export const STORAGE_KEYS = {
  // App state flags
  HAS_COMPLETED_ONBOARDING:   '@spinup/has_completed_onboarding',    // boolean
  HAS_SEEN_PARTY_TUTORIAL:    '@spinup/has_seen_party_tutorial',     // boolean
  HAS_SEEN_COUPLES_TUTORIAL:  '@spinup/has_seen_couples_tutorial',   // boolean
  DRINKING_DISCLAIMER_SHOWN:  '@spinup/drinking_disclaimer_shown',   // boolean

  // User preferences
  LAST_COUPLES_TIER:          '@spinup/last_couples_tier',           // ContentTier string
  DRINKING_MODE_DEFAULT:      '@spinup/drinking_mode_default',       // boolean

  // Session persistence (background survival)
  ACTIVE_SESSION:             '@spinup/active_session',              // GameSession JSON | null

  // IAP cache (RevenueCat is source of truth; this survives offline)
  IAP_ENTITLEMENT_CACHE:      '@spinup/iap_entitlement_cache',       // IAPEntitlement JSON
} as const;
```

### Data Shapes Stored

```typescript
// @spinup/active_session → null or serialized GameSession
// Written: on every advanceCard(), undoCard(), resolveCard()
// Read: on app foreground/restore to check for in-progress session
// Cleared: on endSession(), on app launch if session.startedAt > 30min ago

// @spinup/iap_entitlement_cache → IAPEntitlement
// Written: after every checkEntitlement(), purchase(), restore()
// Read: on app start while RevenueCat check is in-flight (prevents flash of locked state)

// @spinup/last_couples_tier → 'romantic' | 'flirty' | 'spicy'
// Written: when user selects a tier in CouplesSetup
// Read: to pre-select tier on next CouplesSetup open
```

### AsyncStorage Wrapper

```typescript
// src/utils/storage.ts
export const storage = {
  set: async <T>(key: string, value: T): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  get: async <T>(key: string): Promise<T | null> => {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  remove: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};
```

---

## 9. Error Handling Patterns

### IAP Errors
```
User cancelled purchase → silent (no error shown)
Network error during purchase → "Purchase failed. Check your connection and try again."
No packages available → "Something went wrong loading the store. Please try again."
Restore — no purchase found → "No previous purchase found for this Apple/Google account."
RevenueCat SDK not configured → caught in useEffect, logged in dev, silent in prod
```

### Session Errors
```
AsyncStorage read fails → default to null session (clean start), no crash
Card JSON load fails → crash in dev (validate on startup); graceful fallback card in prod
Deck runs out of free cards → session ends naturally (treated as session complete)
Invalid card index → clamp to deck bounds, never throw
```

### Navigation Errors
```
Navigate to Paywall without route params → provide defaults in PaywallModal
Back gesture during game → intercept with beforeRemove listener → ExitConfirm modal
```

### General Pattern
- All async operations wrapped in try/catch
- Errors surfaced to UI via store state (`purchaseError`, etc.), not thrown up to component
- `__DEV__` gate for verbose logging; production is quiet
- No global error boundary crash screens for v1.0 (keep it simple — rely on React Native's default red screen in dev, clean crash in prod)

---

## 10. Build Config (eas.json)

```json
{
  "cli": {
    "version": ">= 12.0.0",
    "promptToConfigurePushNotifications": false
  },
  "build": {
    "base": {
      "env": {
        "EXPO_PUBLIC_APP_ENV": "production"
      }
    },
    "dev": {
      "extends": "base",
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_ENV": "development",
        "EXPO_PUBLIC_RC_IOS_KEY": "YOUR_RC_IOS_DEV_KEY",
        "EXPO_PUBLIC_RC_ANDROID_KEY": "YOUR_RC_ANDROID_DEV_KEY"
      },
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    },
    "staging": {
      "extends": "base",
      "distribution": "internal",
      "channel": "staging",
      "env": {
        "EXPO_PUBLIC_APP_ENV": "staging",
        "EXPO_PUBLIC_RC_IOS_KEY": "YOUR_RC_IOS_PROD_KEY",
        "EXPO_PUBLIC_RC_ANDROID_KEY": "YOUR_RC_ANDROID_PROD_KEY"
      },
      "ios": {
        "enterpriseProvisioning": "adhoc"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "extends": "base",
      "channel": "production",
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_RC_IOS_KEY": "YOUR_RC_IOS_PROD_KEY",
        "EXPO_PUBLIC_RC_ANDROID_KEY": "YOUR_RC_ANDROID_PROD_KEY"
      },
      "ios": {
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID",
        "ascAppId": "YOUR_ASC_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

**Environment variable strategy:** Use `EXPO_PUBLIC_` prefix for all build-time env vars so they're accessible in managed workflow without ejecting. RevenueCat keys are the only secrets — rotate them in EAS secrets, not in source.

**App size budget:**
- Base Expo managed app: ~15MB
- react-native-purchases: ~3MB
- react-native-reanimated: ~2MB
- Card JSON content: ~200KB
- Assets (icon, splash, fonts): ~2MB
- **Estimated total: ~22MB** — within 30MB target ✅

---

## 11. Architecture Decisions & Rationale

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Navigation | React Navigation v7 (Stack) | More control over transitions than Expo Router; team familiarity; explicit param typing |
| State management | Zustand (locked) | Zero boilerplate, works with Immer if needed, persist middleware for AsyncStorage sync |
| Zustand persistence | Custom AsyncStorage wrapper | Zustand's `persist` middleware works but adds complexity; hand-rolling gives tighter control over what/when to save |
| Card storage | All cards in JSON, bundled in app | Zero network latency, no CDN cost, offline works fully; 200 cards ≈ 200KB |
| Locked card strategy | Include in bundle, gate at runtime | Simpler than split bundles; acceptable for v1.0 (cards aren't high-value secrets) |
| Deck composition | Compose at session start, freeze | Shuffle once → store in session → deterministic for undo; no re-computation mid-session |
| Undo mechanic | `previousCardIndex` + re-insert card at end | Simple index tracking; undone card re-inserted near deck end (not discarded) |
| Couples phase split | Pre-tagged in JSON (`phase` field) | Deck builder reads phase tag; no runtime inference needed |
| IAP offline | Cache entitlement in AsyncStorage | RevenueCat is source of truth; cache survives airplane mode; stale cache cleared if >7 days old |
| Countdown timer | Only in Couples Mode Spin the Scenario | PRD explicitly excludes timers from Party Mode Challenge Roulette (Out of Scope #15) but Couples Mode spec requires it |

---

## 12. Ambiguities & Risk Flags

### ⚠️ RESOLVED IN THIS SPEC

**A1 — Countdown timer scope conflict:**
PRD Section 5.2 (Couples, Spin the Scenario) specifies "visible countdown" of 30 seconds. PRD Section 10 Out of Scope #15 says "no built-in timer UI" — but that item references Challenge Roulette (Party Mode) specifically. **Decision:** Implement countdown timer in Couples Mode Spin the Scenario only. No timer in Party Mode.

**A2 — Spicy Pack in Paywall:**
PRD Open Questions Q5 says Spicy tier is deferred to v1.1. **Decision:** Include "Spicy Pack — Coming Soon" in the paywall feature list as a greyed-out placeholder. The `$4.99` price still applies now (future-proofing the purchase). Spicy JSON files are empty arrays at launch.

**A3 — Session recovery on force-close:**
PRD US-11 says session is lost on force-close ("acceptable for v1.0"). **Decision:** On app launch, check `ACTIVE_SESSION` in AsyncStorage; if it exists AND `startedAt` was within 30 minutes, offer a "Resume session?" prompt. If older than 30 minutes, clear silently.

### ⚠️ RISKS

**R1 — RevenueCat SDK setup time:** RevenueCat requires App Store Connect product creation + RevenueCat dashboard configuration BEFORE any IAP testing. This must happen Day 1. Coder cannot test IAP without it.

**R2 — react-native-purchases in managed Expo:** `react-native-purchases` requires a native module. Managed Expo supports it via a config plugin in `app.json`. Verify plugin is listed in `plugins` array. If it's not in the Expo SDK managed list, may need to add `"react-native-purchases"` to `expo.plugins`. Test on a physical device — IAP never works on simulators.

**R3 — Non-drinking variant coverage:** PRD requires 100% non-drinking coverage for free cards, 80% for locked at launch. Content creation (Epic 6) is on the critical path.

**R4 — App Store Review time:** Submitting Saturday for Sunday ship is extremely tight. Plan for expedited review request or accept Monday as realistic ship date.

**R5 — 17+ rating + IAP review:** App Store reviewers test IAP flows manually. A broken restore flow = rejection. Must test on physical device before submission.
