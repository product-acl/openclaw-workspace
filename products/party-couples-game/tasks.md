# SpinUp — Implementation Task List
**Author:** Architect Agent (BAIcan)
**Date:** 2026-03-06
**For:** Coder
**Based on:** PRD v1.0 + Tech Spec v1.0
**Target Ship:** Sunday 2026-03-08

---

## Summary
- **Total tasks:** 58
- **Estimated build time:** ~72–90 hours (3 focused engineers, 2.5 days)
- **Solo-dev estimate:** 5–7 days at full pace — Sunday is aggressive but possible if IAP is pre-configured Day 1
- **Critical path:** Scaffold → Navigation → SessionStore → Party Game Engine → Card Content → IAP → Paywall → Polish
- **Hard blocker:** RevenueCat + App Store Connect product must be created BEFORE Task 10.1. Do this on Day 1 in parallel with scaffold.

---

## Risks (read before starting)
- **R1 — RevenueCat setup is a prerequisite, not a task.** App Store Connect product ID `spinup_unlock_everything` and RevenueCat dashboard entitlement `full_access` must exist before any IAP code can be tested. Do this manually on Day 1.
- **R2 — IAP only works on physical device.** Never test purchase flows on simulator. Have a physical iOS + Android device ready for Epic 10.
- **R3 — App Store Review.** Submitting Saturday for Sunday ship is risky. Submit Friday evening. Request expedited review.
- **R4 — Card content (Epic 6) is on the critical path.** The game engine is useless without cards. Parallelize content writing if possible.

---

## Epic 1: Project Scaffold

**Task 1.1: Initialize Expo managed workflow project with TypeScript** [S]
- Run `npx create-expo-app spinup --template expo-template-blank-typescript`
- Confirm `app.json` has `name: "SpinUp"`, `slug: "spinup"`, `sdkVersion: "52.0.0"`, `platforms: ["ios","android"]`
- Set `ios.bundleIdentifier: "com.spinup.app"` and `android.package: "com.spinup.app"` in `app.json`
- Set `app.json` `userInterfaceStyle: "dark"` (dark-mode-first UI)
- Set `ios.infoPlist.NSUserTrackingUsageDescription` (required for App Store even if not using tracking)
- Confirm `npx expo start` runs without errors on clean install
- **Done when:** Project boots to blank screen with no TypeScript errors, `expo doctor` shows no issues

**Task 1.2: Install all runtime dependencies from tech spec** [S]
- Install exact packages from Tech Spec Section 2 runtime table: `@react-navigation/native@^7`, `@react-navigation/stack@^7`, `react-native-screens@^4`, `react-native-safe-area-context@^4`, `react-native-gesture-handler@^2`, `zustand@^5`, `@react-native-async-storage/async-storage@^2`, `react-native-purchases@^8`, `react-native-reanimated@^3`, `expo-haptics`, `expo-linear-gradient`, `expo-font`, `expo-splash-screen`, `expo-application`
- Add `react-native-purchases` to `app.json` plugins array: `["react-native-purchases"]`
- Add `react-native-reanimated` Babel plugin to `babel.config.js`
- Run `npx expo install` to validate all peer deps resolve correctly
- **Done when:** `npx expo start` runs clean after install, no peer dep warnings on runtime packages

**Task 1.3: Install dev dependencies and configure TypeScript + path aliases** [S]
- Install: `babel-plugin-module-resolver@^5`, `eslint@^9`, `eslint-config-expo`, `prettier@^3`, `jest@^29`, `jest-expo`
- Configure `tsconfig.json` with `"paths": { "@/*": ["./src/*"] }` and `"baseUrl": "."`, `"strict": true`
- Configure `babel.config.js` module-resolver plugin: alias `@` → `./src`
- Add `.prettierrc` with `singleQuote: true`, `trailingComma: "all"`, `semi: true`, `printWidth: 100`
- Add `.eslintrc.js` extending `expo`
- Add Jest config in `package.json`: `"preset": "jest-expo"`, `"testPathPattern": "src/__tests__"`
- Create `src/__tests__/` directory with a placeholder `deck.test.ts` file (empty, just verifies jest runs)
- **Done when:** `npx tsc --noEmit` passes, `npx jest` runs with 0 tests and no config errors

**Task 1.4: Create full folder structure and type definition files** [M]
- Create all directories from Tech Spec Section 1 project structure
- Create `src/types/card.ts` — copy exact TypeScript interfaces from Tech Spec Section 3 (`GameMode`, `PartyCardType`, `CouplesCardType`, `ContentTier`, `SessionPhase`, `IntensityLevel`, `Card`, `PartyCard`, `CouplesCard`)
- Create `src/types/session.ts` — copy exact interfaces (`SessionLength`, `Player`, `GameSession`, `SessionConfig`)
- Create `src/types/iap.ts` — copy `IAPEntitlement` interface
- Create `src/constants/storageKeys.ts` — copy all `STORAGE_KEYS` constants from Tech Spec Section 8
- Create `src/constants/iap.ts` — copy product/entitlement ID constants, import env vars via `process.env.EXPO_PUBLIC_RC_IOS_KEY`
- Create `src/constants/game.ts` — define session length card counts: `SHORT_PARTY=15`, `MEDIUM_PARTY=30`, `LONG_PARTY=50`, `SHORT_COUPLES=20`, `MEDIUM_COUPLES=35`, `LONG_COUPLES=55`; define deck composition ratios from Tech Spec Section 5
- Create `src/utils/storage.ts` — implement typed AsyncStorage wrapper (`set`, `get`, `remove`) exactly as shown in Tech Spec Section 8
- Create empty placeholder files for all remaining src directories (store, navigation, screens, components, hooks, utils, content)
- **Done when:** `npx tsc --noEmit` passes with all types defined and cross-referencing correctly

**Task 1.5: Configure EAS and environment variables** [S]
- Create `eas.json` exactly as specified in Tech Spec Section 10 (dev/staging/production profiles)
- Add `.env.example` file with `EXPO_PUBLIC_RC_IOS_KEY=` and `EXPO_PUBLIC_RC_ANDROID_KEY=` placeholders
- Add `.env` to `.gitignore`
- Create `.env` locally with placeholder values (`rc_ios_key_here`, `rc_android_key_here`)
- Run `eas build:configure` to validate `eas.json` format
- **Done when:** `eas build --profile dev --platform ios --dry-run` exits without config errors

---

## Epic 2: Navigation & App Shell

**Task 2.1: Build RootNavigator with all screen stubs** [M]
- Create `src/navigation/types.ts` — copy exact `RootStackParamList`, `PartyStackParamList`, `CouplesStackParamList` type definitions from Tech Spec Section 7
- Create stub screen files (each returns `<View><Text>ScreenName</Text></View>`): `HomeScreen.tsx`, `OnboardingScreen.tsx`, `PartySetupScreen.tsx`, `PartyGameScreen.tsx`, `PartyEndScreen.tsx`, `CouplesSetupScreen.tsx`, `CouplesGameScreen.tsx`, `CouplesEndScreen.tsx`, `PaywallModal.tsx`, `ExitConfirmModal.tsx`
- Create `src/navigation/PartyNavigator.tsx` — Stack navigator with `PartySetup`, `PartyGame`, `PartyEnd` screens; all `headerShown: false`
- Create `src/navigation/CouplesNavigator.tsx` — Stack navigator with `CouplesSetup`, `CouplesGame`, `CouplesEnd` screens; all `headerShown: false`
- Create `src/navigation/RootNavigator.tsx` — Root Stack with `gestureEnabled: false`, `headerShown: false`; register `Home`, `Onboarding`, `PartyStack` (CouplesNavigator), `CouplesStack` (CouplesNavigator), and modal group (`Paywall`, `ExitConfirm`) with `presentation: 'modal'`
- Update `App.tsx`: wrap in `GestureHandlerRootView`, `SafeAreaProvider`, `NavigationContainer` → render `<RootNavigator />`
- **Done when:** App boots, shows Home stub, navigating to each screen stub works without TypeScript errors

**Task 2.2: Implement app startup logic — onboarding redirect and splash screen control** [S]
- Create `src/store/appStore.ts` — implement full Zustand store as defined in Tech Spec Section 4: `hasCompletedOnboarding`, `hasSeenPartyTutorial`, `hasSeenCouplesTutorial`, `drinkingDisclaimerShown`, `lastSelectedCouplesTier` (default: `'romantic'`), `drinkingModeDefault` (default: `true`), and all action methods; persist all fields to AsyncStorage on every write using `storage.set(STORAGE_KEYS.X, value)` inside each action
- In `RootNavigator.tsx`, add a `useEffect` on mount that: (1) reads `HAS_COMPLETED_ONBOARDING` from AsyncStorage, (2) if false → navigate to `'Onboarding'`, (3) calls `SplashScreen.hideAsync()` after check completes
- Import and call `SplashScreen.preventAutoHideAsync()` at the top of `App.tsx`
- **Done when:** First launch navigates to Onboarding; subsequent launches navigate directly to Home; splash screen hides after check

**Task 2.3: Implement back gesture intercept → ExitConfirm modal during active game sessions** [S]
- In `PartyGameScreen.tsx` and `CouplesGameScreen.tsx`, add `useFocusEffect` with a `navigation.addListener('beforeRemove', ...)` handler that intercepts back gestures/hardware back button during an active session
- On intercept: prevent default, navigate to `'ExitConfirm'` modal
- `ExitConfirmModal.tsx`: show "End session? Your progress will be lost." with "Yes, End" button (calls `sessionStore.endSession()`, navigates to `'Home'` with stack reset) and "Keep Playing" button (dismisses modal, returns to game screen)
- **Done when:** Pressing back during a game shows the modal; "Keep Playing" returns to game; "Yes, End" goes to Home

**Task 2.4: Implement AppState listener for session background survival** [S]
- Create `src/hooks/useAppState.ts` — subscribes to React Native `AppState` changes; on `active` event: (1) calls `iapStore.checkEntitlement()`, (2) checks AsyncStorage for `ACTIVE_SESSION` and if session exists + `startedAt` < 30 minutes ago, leaves session in store
- Create `src/hooks/useSession.ts` — expose helpers: `isSessionActive(): boolean`, `activeMode(): GameMode | null`
- In `RootNavigator.tsx`, call `useAppState()` hook at root level
- **Done when:** Backgrounding and foregrounding the app preserves session state; entitlement re-checks on foreground

---

## Epic 3: Home Screen & Mode Selection

**Task 3.1: Build HomeScreen with Party/Couples mode selector UI** [M]
- `HomeScreen.tsx`: full-screen layout with `expo-linear-gradient` background (dark purple → near-black)
- App logo/name "SpinUp" centered at top (bold large text, white)
- Two large mode cards stacked vertically (or side-by-side on wider screens):
  - Party card: 🍺 emoji, "Party Mode" title, subtitle "3–8 players · Dares · Truth · Chaos"
  - Couples card: 💑 emoji, "Couples Mode" title, subtitle "2 players · Scoring · Challenges · Connection"
  - Each card is a `TouchableOpacity` with rounded corners, colored gradient background (Party: warm red/orange; Couples: deep purple/pink)
- Tapping Party Mode: check `hasSeenPartyTutorial`; if false → push `'Onboarding'` with `mode: 'party'` param; if true → navigate to `'PartyStack'` → `'PartySetup'`
- Tapping Couples Mode: same check with `hasSeenCouplesTutorial`; route to `'CouplesStack'` → `'CouplesSetup'`
- Settings gear icon in top-right corner navigating to `'Settings'` (add Settings to root stack in 2.1 if not already)
- **Done when:** Both mode buttons navigate correctly; screen looks polished with gradients; buttons have press feedback

**Task 3.2: Build OnboardingScreen — party tutorial (2-screen overlay)** [S]
- `OnboardingScreen.tsx` accepts a route param `mode: 'party' | 'couples'`
- Implement as a 2-page swipeable or button-advanced overlay (full-screen modal style, dark bg, centered content)
- Party Tutorial — Screen 1: heading "Cards come to you one at a time", body "Do the dare, tell the truth, or drink up. Your call.", illustration area (card mockup SVG/PNG placeholder), "Got it →" button
- Party Tutorial — Screen 2: heading "Accidentally skipped?", body "Hit Undo. No judgment. We know how parties go. 🍺", illustration of Undo button highlighted, "Let's Party" button
- On "Let's Party": call `appStore.markPartyTutorialSeen()`, navigate to `'PartySetup'`
- Couples Tutorial — Screen 1: heading "This isn't a question list.", body "You'll play, compete, and dare each other. Points are real.", score counter animation (simple counting-up number), "Nice →" button
- Couples Tutorial — Screen 2: heading "Pick your vibe before you start.", body "Romantic, Flirty, or Spicy. You can always try all three.", tier selector visual, "Let's Play" button
- On "Let's Play": call `appStore.markCouplesTutorialSeen()`, navigate to `'CouplesSetup'`
- **Done when:** Each tutorial screens render correctly; navigation after final screen goes to correct setup screen; flags persist across restarts

**Task 3.3: Build one-time drinking disclaimer modal for Party Mode first launch** [S]
- Create a `DrinkingDisclaimerModal` component (or add a flag-gated view inside `PartySetupScreen`) that shows once on first-ever Party Mode visit
- Content: "🍺 This app contains drinking game content. Please drink responsibly. Must be 18+ to use drinking features." with a single "I understand" dismiss button
- On dismiss: call `appStore.markDrinkingDisclaimerShown()`; do not show again
- Check `drinkingDisclaimerShown` on `PartySetupScreen` mount; if false, show the modal
- **Done when:** Modal appears exactly once on first Party Mode visit; never appears again after dismissal; persists across app restarts

---

## Epic 4: Party Mode — Setup

**Task 4.1: Build PartySetupScreen — player name entry grid** [M]
- `PartySetupScreen.tsx`: scrollable screen, dark background
- Default render: 4 player name input slots visible
- Each slot: `TextInput` with placeholder "Player N" (where N = slot number), max 20 chars, rounded input style
- "＋ Add Player" button below slots: adds a new slot, up to 8 total; button disabled/hidden at 8 players
- "−" remove button on each slot: removes that slot, minimum 2 slots; removing auto-renumbers placeholders
- Player count enforced: min 2, max 8 (not 3 as in original PRD — tech spec confirms 2–8)
- All fields are optional — empty fields auto-fill as "Player 1" through "Player N" when "Let's Go" is tapped
- **Done when:** Can add/remove player slots within 2–8 bounds; all edge cases work (add at 8 disabled, remove at 2 disabled)

**Task 4.2: Build PartySetupScreen — session length picker + drinking toggle** [S]
- Add `SessionLengthPicker` component below player inputs in `PartySetupScreen`
- Three options: "Short (15 cards)", "Medium (30 cards)", "Long (50 cards 🔒)"
- Long option shows lock icon if `!isUnlocked`; tapping it while locked shows Paywall modal
- Default selection: "Medium"
- Add "🍺 Drinking Mode" toggle below session length picker
- Toggle default: ON
- Toggle is a standard `Switch` component with label text; toggling changes `sessionConfig.drinkingMode`
- "Let's Go" CTA button fixed at bottom of screen; primary color, full width
- Tapping "Let's Go": build `SessionConfig`, call `sessionStore.startSession()` (after deck is composed — this calls `useDeck` hook to generate deck), navigate to `'PartyGame'`
- **Done when:** Session length selection works; Lock triggers paywall correctly; Drinking toggle works; Let's Go navigates to game with session initialized

---

## Epic 5: Party Mode — Game Engine

**Task 5.1: Implement sessionStore (Zustand)** [M]
- Create `src/store/sessionStore.ts` implementing all state + actions from Tech Spec Section 4:
  - State: `session: GameSession | null`
  - `startSession(config, deck)`: creates a `GameSession` with UUID, sets `currentCardIndex: 0`, `previousCardIndex: null`, `undoUsedForCurrentCard: false`, `isComplete: false`, `activePlayerIndex: 0`; persists to AsyncStorage `ACTIVE_SESSION`
  - `advanceCard()`: increments `currentCardIndex`; sets `previousCardIndex` to old index; resets `undoUsedForCurrentCard: false`; if `currentCardIndex >= totalCards` → sets `isComplete: true`; persists session to AsyncStorage
  - `undoCard()`: if `canUndo()` is false → no-op; else sets `currentCardIndex` back to `previousCardIndex`, sets `previousCardIndex: null`, sets `undoUsedForCurrentCard: true`; persists session
  - `resolveCard(pointsAwarded?)`: for Couples mode, add `pointsAwarded` to `session.players[activePlayerIndex].score`; toggle `activePlayerIndex` (0→1, 1→0); persists session
  - `endSession()`: sets `session: null`; removes `ACTIVE_SESSION` from AsyncStorage
  - Computed (non-stored, derived): `currentCard()` → `session.deck[session.currentCardIndex] ?? null`; `currentPlayer()` → `session.players[session.activePlayerIndex ?? 0] ?? null`; `canUndo()` → `previousCardIndex !== null && !undoUsedForCurrentCard`; `isFinale()` → `session.currentPhase === 'finale'`
- **Done when:** All actions behave correctly; session persists to AsyncStorage on every mutation; TypeScript compiles

**Task 5.2: Implement deck utility — card loader and Fisher-Yates shuffle** [S]
- Create `src/utils/cardLoader.ts`: imports all JSON files from `src/content/party/` and `src/content/couples/`; merges into a single `Card[]` flat array; exports `getAllCards(): Card[]` (memoized — load once at startup)
- Create `src/utils/deck.ts`:
  - `shuffleDeck<T>(array: T[]): T[]` — Fisher-Yates in-place shuffle; returns new array
  - `isCardAvailable(card: Card, isUnlocked: boolean): boolean` — returns `true` if `!card.isLocked`, or `card.isLocked && isUnlocked`
  - `composePartyDeck(allCards: Card[], config: SessionConfig, isUnlocked: boolean): Card[]` — filters to party mode cards → filters by entitlement → applies composition ratios from `constants/game.ts` for selected session length → if not unlocked, ensures first 10+ cards are free (re-order: sort free cards first up to position 10, then intersperse locked) → shuffle with Fisher-Yates → return deck of correct total card count
  - `composeCouplesDeck(allCards: Card[], config: SessionConfig, isUnlocked: boolean): Card[]` — filters to couples mode cards → filters by tier + entitlement → splits into warmup/main/finale buckets using `card.phase` tag → shuffles each bucket independently → concatenates `[...warmup, ...main, ...finale]` → returns correct total count
- Create `src/hooks/useDeck.ts` — exposes `buildDeck(config: SessionConfig): Card[]`; calls correct compose function based on mode; reads `isUnlocked` from `iapStore`
- **Done when:** Unit tests in `deck.test.ts` pass: shuffle produces no duplicates, composition ratios are correct within ±1 card, free-first ordering works for locked sessions

**Task 5.3: Build PartyGameScreen — full-screen card display** [M]
- `PartyGameScreen.tsx`: reads `sessionStore` for `currentCard`, `currentPlayer`, `canUndo`
- Layout (top to bottom):
  - Top bar: Player name ("Maya, your turn!") left-aligned; progress indicator right-aligned ("Card 8 of 30") — use `ProgressIndicator` component
  - Center: `CardDisplay` component (full-width, rounded card with shadow)
  - Bottom: large "Done →" primary button full-width; small "↩ Undo last" secondary button bottom-left (only visible if `canUndo()` is true)
- `CardDisplay` component: shows card content — `CardTypeBadge` at top (e.g., "DARE" in bold colored badge), main card text centered in large readable font, card background color varies by card type (Dare: red, Truth Bomb: blue, Vote: purple, Challenge Roulette: green)
- `CardTypeBadge` component: renders colored pill badge with type label; colors per type as above
- `ProgressIndicator` component: renders "Card X of N" text
- `UndoButton` component: small ghost button "↩ Undo last"; only renders when `canUndo` is true
- Drinking mode: if `session.drinkingMode === false`, render `card.nonDrinkingText`; else render `card.drinkingText`
- "Done" taps: call `sessionStore.advanceCard()`; if `session.isComplete` → navigate to `'PartyEnd'` (use `replace` not `push`)
- "Undo" tap: call `sessionStore.undoCard()`
- **Done when:** Full game loop works; cards display with correct text variant; progress increments; undo works once per card; session completes and navigates to end screen

**Task 5.4: Implement paywall interrupt in Party game loop** [S]
- In `PartyGameScreen.tsx`, add a `useEffect` that watches `currentCard`
- When `currentCard` changes AND `currentCard.isLocked === true` AND `!isUnlocked`:
  - Navigate to `'Paywall'` modal with param `{ returnTo: 'PartyGame' }`
- In `PaywallModal.tsx` (stub from 2.1 — will be fully built in Epic 10), add a dismiss handler: on dismiss without purchase → call `sessionStore.advanceCard()` (skip the locked card, advance to next) → navigate back to `'PartyGame'`
- On purchase success in Paywall: call `sessionStore.advanceCard()` with flag to re-draw (or simply reload the same card — since the card is now available, no skip needed); navigate back to `'PartyGame'`
- **Done when:** Locked card pauses session, shows paywall; dismiss skips locked card; purchase unlocks and shows the card

**Task 5.5: Build PartyEndScreen** [S]
- `PartyEndScreen.tsx`: dark background with celebration visual (simple emoji confetti or static)
- Show "🎉 Game Over!" heading
- Summary: list all players with their names (no scores in Party Mode — scores are irrelevant)
- "Play Again" button: reshuffles deck with same config, calls `sessionStore.startSession()` with new deck, navigates to `'PartyGame'` (replace)
- "Home" button: calls `sessionStore.endSession()`, resets navigation to `'Home'`
- Post-session upsell banner (if `!isUnlocked`): dismissable banner at bottom — "You played the free version. The full game has 3× more. $4.99, one time." with "Unlock Now" CTA (navigates to Paywall modal) and "✕" dismiss button
- **Done when:** End screen renders; Play Again starts new game; Home resets to home; upsell banner dismisses with one tap and doesn't re-appear in same session

---

## Epic 6: Party Mode — Card Content (JSON)

**Task 6.1: Write dare.json — 50 party dare cards** [L]
- File: `src/content/party/dare.json`
- 15 free cards (`isLocked: false`): 10 at `intensityLevel: 1`, 5 at `intensityLevel: 2`
- 35 locked cards (`isLocked: true`): 15 at `intensityLevel: 2`, 20 at `intensityLevel: 3`
- Every card has both `drinkingText` (with drink penalty like "Refuse? Drink 2.") and `nonDrinkingText` (with alternative penalty like "Refuse? Do 15 jumping jacks.")
- IDs follow pattern: `party-dare-001` through `party-dare-050`
- `shortLabel` max 30 chars, describes the dare briefly
- Content guidelines (PRD Appendix A): under 40 words, specific action, clear consequence, no expiring pop culture refs
- All free cards must have non-drinking variants that make sense without alcohol
- **Done when:** 50 cards written, valid against JSON schema in Tech Spec Section 5, `npx tsc --noEmit` passes on import

**Task 6.2: Write truth-bomb.json (40 cards), vote.json (32 cards)** [L]
- **truth-bomb.json** (`src/content/party/truth-bomb.json`):
  - 12 free cards: 8 at intensity 1, 4 at intensity 2; `isLocked: false`
  - 28 locked cards: 15 at intensity 2, 13 at intensity 3; `isLocked: true`
  - Format: personal question, penalty for refusing ("Refuse? Drink 2." / "Refuse? Give everyone a high five")
  - IDs: `party-truth_bomb-001` through `party-truth_bomb-040`
- **vote.json** (`src/content/party/vote.json`):
  - 10 free cards: all intensity 1–2; `isLocked: false`
  - 22 locked cards: intensity 2–3; `isLocked: true`
  - Format: "Vote: Who is most likely to…? [consequence for winner]"
  - Vote cards have clear voting criteria (PRD Appendix A rule 5)
  - IDs: `party-vote-001` through `party-vote-032`
- **Done when:** Both files written, IDs unique across all party JSON files, schemas valid

**Task 6.3: Write challenge-roulette.json (28 cards), wild.json (15 cards), spicy.json (placeholder)** [M]
- **challenge-roulette.json** (`src/content/party/challenge-roulette.json`):
  - 8 free cards: intensity 1–2; `isLocked: false`
  - 20 locked cards: intensity 2–3; `isLocked: true`
  - Include all 3 subtypes: head-to-head, timed, group-vs-player
  - Format: "[Player] vs [Random Player]: [challenge]. [Consequence for loser]."
  - IDs: `party-cr-001` through `party-cr-028`
- **wild.json** (`src/content/party/wild.json`):
  - 15 cards, all `isLocked: true`, intensity 2–3
  - Wild cards are escalating/unusual dares not fitting other categories
  - IDs: `party-wild-001` through `party-wild-015`
- **spicy.json** (`src/content/party/spicy.json`):
  - Empty array `[]` — placeholder for v1.1 content
  - Comment at top of file: `// Spicy Pack — v1.1 content. Coming soon.`
- **Done when:** All three files written; `wild.json` has 15 cards all locked; `spicy.json` is valid empty array; all IDs unique

**Task 6.4: Write all four couples mode JSON files** [L]
- **dare-duel.json** (`src/content/couples/dare-duel.json`): 40 cards total
  - 12 `tier: 'romantic'`, `isLocked: false`, `phase: null`
  - 18 `tier: 'flirty'`, `isLocked: true`, `phase: null`
  - 10 `tier: 'spicy'`, `isLocked: true`, `phase: null`
  - Format: "Dare Duel: [both players do X]. Partner rates 1–10. Highest score wins."
  - `pointValue: 3` for all dare duel cards
  - IDs: `couples-dd-001` through `couples-dd-040`
- **memory-challenge.json** (`src/content/couples/memory-challenge.json`): 38 cards total
  - 15 romantic / 15 flirty / 8 spicy; same lock rules as above
  - Format: question about your partner that both answer separately and compare
  - `pointValue: 2` for memory challenge cards
  - IDs: `couples-mc-001` through `couples-mc-038`
- **spin-the-scenario.json** (`src/content/couples/spin-the-scenario.json`): 42 cards total
  - 13 romantic / 17 flirty / 12 spicy
  - Include all 3 subtypes: "Convince", "Rank it", "Prediction" — note subtype in card text naturally
  - `pointValue: 2` for convince/rank, `pointValue: 3` for prediction (harder)
  - IDs: `couples-ss-001` through `couples-ss-042`
- **finale-specials.json** (`src/content/couples/finale-specials.json`): 20 cards total
  - 5 romantic / 8 flirty / 7 spicy
  - All have `phase: 'finale'`; `pointValue: 4` (base — multiplier applied in scoring logic)
  - Mix of all 3 card types (dare_duel, memory_challenge, spin_the_scenario)
  - IDs: `couples-fs-001` through `couples-fs-020`
- **Done when:** All 140 couples cards written; `isLocked` matches `tier` (romantic = false, flirty/spicy = true); schemas valid; IDs unique

---

## Epic 7: Couples Mode — Setup

**Task 7.1: Build CouplesSetupScreen — content tier selector** [M]
- `CouplesSetupScreen.tsx`: full-screen scrollable layout, dark background with couple-themed gradient
- Pre-fill tier selector with `appStore.lastSelectedCouplesTier` (defaults to `'romantic'`)
- Three tier tiles in a row:
  - **Romantic** 💝: "Sweet & emotionally connective" subtitle, no lock icon, tappable always
  - **Flirty** 🌶: "Playful & mildly suggestive" subtitle, lock icon if `!isUnlocked`, tapping locked tile navigates to `'Paywall'` modal
  - **Spicy** 🔥: "Intimate & adult-oriented" subtitle + "Coming Soon" overlay badge (per Tech Spec A2 — spicy deferred to v1.1; tile is always locked/greyed-out regardless of purchase), tapping shows "Coming Soon" toast, NOT paywall
- Selected tile has highlighted border + check indicator
- On tier select (unlocked tier): update local state + call `appStore.setLastCouplesTier(tier)` to persist
- **Done when:** Tier tiles render with correct lock states; Spicy shows "Coming Soon"; Flirty triggers paywall; selection persists across app restarts

**Task 7.2: Build CouplesSetupScreen — player names + session length + start** [S]
- Add `SessionLengthPicker` component below tier selector (reuse component from Party Setup)
- Short (20 cards) / Medium (35 cards) / Long (55 cards 🔒) — same lock behavior as Party
- Add optional player name inputs: two text fields, pre-filled with "You" and "Partner", max 20 chars each
- "Start Game" CTA button fixed at bottom: disabled if no tier selected (shouldn't happen with default), active otherwise
- On "Start Game" tap: build `SessionConfig` with `mode: 'couples'`, `contentTier`, `sessionLength`, `players`; call `useDeck().buildDeck(config)` to compose deck; call `sessionStore.startSession(config, deck)`; navigate to `'CouplesGame'`
- **Done when:** All inputs work; session initializes correctly; navigation works; Long session lock triggers paywall

---

## Epic 8: Couples Mode — Game Engine

**Task 8.1: Build CouplesGameScreen — base turn-based layout** [M]
- `CouplesGameScreen.tsx`: reads `sessionStore` for current state
- Layout:
  - Top bar: `ScoreDisplay` component (shows "You: 12 pts | Partner: 9 pts") spanning full width
  - Below score: player turn indicator ("💑 Your turn, [PlayerName]!")
  - Center: `CardDisplay` component (reuse from Party but render `card.text` for couples cards)
  - Bottom: primary action button (label varies by card type — see task 8.2)
- `ScoreDisplay` component: renders both player names + current scores; updates reactively from `sessionStore`
- Phase indicator: subtle label below score bar showing current phase ("Warm Up" / "Main Game" / "🏆 Finale")
- When `session.isComplete === true` → navigate to `'CouplesEnd'` (replace)
- Wire up back-intercept from Task 2.3
- **Done when:** Base screen renders with correct player names, scores at zero, phase indicator; completing all cards navigates to end screen

**Task 8.2: Implement card-type-specific interaction UI in CouplesGameScreen** [M]
- **Dare Duel cards** (`type: 'dare_duel'`): show card text; add a 1–10 rating slider (React Native `Slider` component or custom with 10 tap buttons) labeled "Rate your partner: [N]/10"; show current player's rating; "Submit Rating" button calls `sessionStore.resolveCard(pointsAwarded)` where points = 3 if this player's rating > partner's last rating, else 0 (simplified: active player rates, partner rates on their turn next — for v1.0, simplify to: active player rates the dare experience, +3 if rated ≥ 7, +1 if 4–6, 0 if < 4); button label: "Done — [N]/10"
- **Memory Challenge cards** (`type: 'memory_challenge'`): sequential single-device UX (PRD Open Question Q3 = Option A): show prompt; Player 1 types answer (TextInput, hidden from partner — "cover the screen"), taps "Done, pass phone"; screen flips to Player 2 prompt to type their answer; both taps done → reveal both answers side-by-side; "We Match! +2 pts each" button (calls `resolveCard(2)`) and "We Differ (0 pts)" button (calls `resolveCard(0)` + shows "Talk about it for 60 seconds" prompt); honor system — players decide
- **Spin the Scenario cards** (`type: 'spin_the_scenario'`): show scenario text; `CountdownTimer` component counts down from 30 seconds (visible); "Convinced" button → `resolveCard(2)` for active player; "Not Convinced" button → `resolveCard(0)`; `CountdownTimer` component: accepts `durationSeconds: number`; displays MM:SS countdown in large text; auto-fires callback on expire (just visually signals time is up, doesn't auto-advance)
- **Finale Special cards** (`type: 'finale_special'`): same UI as their underlying card type but with a "🏆 Finale — 2×" multiplier banner at top; `pointsAwarded` is doubled before passing to `resolveCard`
- **Done when:** Each card type renders its correct interaction UI; points are awarded correctly for each type; Memory Challenge sequential flow works

**Task 8.3: Implement CountdownTimer component** [S]
- Create `src/components/game/CountdownTimer.tsx`
- Props: `durationSeconds: number`, `onExpire: () => void`, `isActive: boolean`
- Displays time as "0:30" → "0:00" counting down
- Uses `setInterval` via `useEffect`; clears on unmount
- At 10 seconds remaining: text turns red/amber as visual warning
- At 0: calls `onExpire()`, displays "⏰ Time's up!"
- Visual treatment: large circular or rectangular countdown display, prominent but not intrusive
- **Done when:** Timer counts down accurately; color warning at 10s; expire callback fires; no memory leaks on unmount

**Task 8.4: Implement Couples Mode paywall interrupt and phase transitions** [S]
- In `CouplesGameScreen.tsx`, add same `useEffect` as Party game (Task 5.4) watching `currentCard` for locked cards
- Paywall dismiss in Couples context: skip locked card, call `sessionStore.advanceCard()`
- Add phase transition logic in `sessionStore.advanceCard()`: after incrementing `currentCardIndex`, compute current phase based on position relative to `finaleStartIndex`:
  - `finaleStartIndex` = stored on session as `Math.floor(totalCards * 0.75)` (set at session start in `startSession`)
  - If `currentCardIndex < totalCards * 0.25` → `currentPhase = 'warmup'`
  - If `currentCardIndex < finaleStartIndex` → `currentPhase = 'main'`
  - If `currentCardIndex >= finaleStartIndex` → `currentPhase = 'finale'`
- Store `currentPhase` in `GameSession` and update it in every `advanceCard()` call
- **Done when:** Phase transitions update UI correctly; paywall interrupt works same as party mode

---

## Epic 9: Couples Mode — Scoring & Rounds

**Task 9.1: Implement PointsAnimation component** [S]
- Create `src/components/ui/PointsAnimation.tsx`
- Props: `points: number`, `visible: boolean`, `onAnimationEnd: () => void`
- When `visible` becomes true: renders "+N pts" text that animates upward and fades out over 1 second using `react-native-reanimated` (`withTiming`, `withDelay`)
- Positioned absolutely, centered horizontally, appearing near the bottom of the card area
- For Finale cards: show "+N pts 🏆 2×" label instead
- Called from `CouplesGameScreen` after `resolveCard()` completes
- **Done when:** Animation plays smoothly on card completion; disappears after 1 second; doesn't block interaction

**Task 9.2: Build CouplesEndScreen — scores, winner, reward card, CTAs** [M]
- `CouplesEndScreen.tsx`: reads final session scores from `sessionStore.session.players`
- Layout:
  - Header: "🎉 Session Complete!" or "💫 Perfect Tie!" if scores equal
  - Score display: two large score bubbles side-by-side — "[Name]: X pts" for each player
  - Winner declaration: "🏆 [WinnerName] wins this round!" (or tie message: "You're in sync!")
  - Reward card section (winner only, or both on tie): a special prompt rendered in a styled card — use a hardcoded set of 10 affirming/fun prompts per content tier, picked randomly at end-screen render, stored in a `rewardCards` constant file
  - CTA buttons: "Play Again" (reshuffles same tier + length, starts new session, navigate to `'CouplesGame'` replace), "Change Settings" (navigate back to `'CouplesSetup'` with reset), "Home" (endSession + navigate to `'Home'` with stack reset)
  - Post-session upsell banner if `!isUnlocked` (same as Party end screen)
- Screen loads within 1 second: use data already in `sessionStore`, no async operations
- **Done when:** Correct winner shown; tie case handled; reward card renders; all 3 navigation buttons work; upsell banner dismisses

**Task 9.3: Create reward cards constant and wire to end screen** [S]
- Create `src/constants/rewardCards.ts`: export `REWARD_CARDS: Record<ContentTier, string[]>` with 10 prompts per tier
- Romantic examples: "Tell your partner one thing they do that makes you feel completely safe.", "Name one moment from today that made you grateful for this person."
- Flirty examples: "Give your partner the best kiss you've got. No holding back.", "Whisper one thing you've been meaning to say but kept putting off."
- Since Spicy is v1.1: use Flirty rewards for Spicy tier (safe fallback)
- In `CouplesEndScreen`, pick random reward using `Math.floor(Math.random() * 10)` on mount
- **Done when:** Each tier has 10 unique reward prompts; end screen shows correct tier's reward

---

## Epic 10: IAP & Paywall (RevenueCat)

**Task 10.1: Implement iapStore (Zustand) and RevenueCat initialization** [M]
- Create `src/store/iapStore.ts` implementing full state + actions from Tech Spec Section 4 and Section 6:
  - State: `entitlement: IAPEntitlement` (default: `{ isUnlocked: false, productId: null, purchaseDate: null, isRestored: false, lastCheckedAt: null }`), `isLoading: boolean`, `purchaseError: string | null`
  - `checkEntitlement()`: exact implementation from Tech Spec Section 6 including AsyncStorage fallback on network failure
  - `purchase()`: exact implementation from Tech Spec Section 6 including `userCancelled` silent handling
  - `restore()`: exact implementation from Tech Spec Section 6
  - `clearError()`: sets `purchaseError: null`
  - On startup: read `IAP_ENTITLEMENT_CACHE` from AsyncStorage and hydrate store before RevenueCat check completes (prevents flash of locked state)
- In `RootNavigator.tsx`, add `useEffect` that initializes RevenueCat with platform-specific key and calls `iapStore.checkEntitlement()`
- Create `src/hooks/useEntitlement.ts` — exposes `isUnlocked: boolean`, `isLoading: boolean`, `error: string | null` from `iapStore`
- **Done when:** RevenueCat initializes on app start; `checkEntitlement` runs; cached entitlement loads immediately; TypeScript compiles

**Task 10.2: Build PaywallModal — full UI** [M]
- `PaywallModal.tsx`: presented as a modal (Tech Spec Section 7 — `presentation: 'modal'`)
- Layout (clean, no dark patterns):
  - "✕" close button top-right — always visible, never hidden or delayed
  - Headline: "Unlock the Full Game" (large, bold)
  - Subhead: "One price. No subscription. Yours forever."
  - Feature list using `PaywallFeatureList` component: 5 items with ✅ icons: "200+ cards across both modes", "Flirty couples tier", "Wild cards + party extras", "Long sessions (50+ cards)", "All future card packs included — free" (note: Spicy greyed out with "Coming Soon" label per Tech Spec A2)
  - Price display: "$4.99" in large bold text with "one-time purchase" label
  - `PaywallCTA` component: "Unlock for $4.99" button (primary, full width); spinner shown when `isLoading`
  - "Restore Purchase" text link below CTA
  - Error message display (if `purchaseError`) shown below CTA in red
- On "✕" tap: navigate back (goBack); if `route.params.returnTo === 'PartyGame'` or `'CouplesGame'`, also call `sessionStore.advanceCard()` to skip the locked card
- On "Unlock for $4.99" tap: call `iapStore.purchase()`; on success (entitlement becomes true) → show success modal "🎉 You're unlocked. Everything's yours." for 2 seconds → auto-dismiss back to where user was
- On "Restore Purchase" tap: call `iapStore.restore()`; on success → same success flow; on no-purchase-found → show "No purchase found for this account." inline message
- **Done when:** Paywall renders correctly; purchase flow triggers native sheet; restore flow works; close button always works; no countdown timers or urgency manipulation anywhere

**Task 10.3: Build post-session upsell banner component** [S]
- Create `src/components/paywall/UpsellBanner.tsx`
- Props: `visible: boolean`; self-manages dismiss state via `useState`
- Renders a dismissable banner at the bottom of the screen (absolute positioned)
- Content: "You played the free version. The full game has 3× more. $4.99, one time." with "Unlock Now" button (navigates to `'Paywall'`) and "✕" dismiss button
- Once dismissed within a session, does not reappear
- Used in `PartyEndScreen` and `CouplesEndScreen` wrapped in `{!isUnlocked && <UpsellBanner visible={true} />}`
- **Done when:** Banner renders on end screens when not unlocked; dismiss works; "Unlock Now" opens paywall

**Task 10.4: Implement Settings screen with Restore Purchase** [S]
- Create `src/screens/SettingsScreen.tsx` and register it in `RootNavigator` as `'Settings'`
- Navigate from HomeScreen's gear icon
- Content:
  - App version display (from `expo-application`)
  - "Restore Purchase" button → calls `iapStore.restore()`; shows inline result message
  - "Unlock Full Game" button (if `!isUnlocked`) → navigates to `'Paywall'`
  - "✅ Full game unlocked" status display (if `isUnlocked`)
  - Simple styled list layout, no external links or social
- **Done when:** Settings screen accessible from home; restore works; purchase status shown correctly

---

## Epic 11: Settings Screen

*(Covered by Task 10.4 — Settings is minimal in v1.0 and primarily serves Restore Purchase)*

**Task 11.1: Add session resume prompt on app launch** [S]
- In `RootNavigator.tsx` startup `useEffect` (after onboarding check), add logic:
  - Read `ACTIVE_SESSION` from AsyncStorage
  - If session exists AND `session.startedAt` is within the last 30 minutes:
    - Show a `Modal` or `Alert` with: "You have a game in progress! Resume?" with "Resume" and "Start Fresh" buttons
    - "Resume": navigate to `'PartyGame'` or `'CouplesGame'` depending on `session.mode`
    - "Start Fresh": call `sessionStore.endSession()`, proceed to Home normally
  - If session exists AND `session.startedAt` is older than 30 minutes: clear silently with `sessionStore.endSession()`
- **Done when:** Force-close during game → reopen within 30 min → resume prompt appears; resume navigates to correct game screen; start fresh clears session

---

## Epic 12: Polish & Launch Prep

**Task 12.1: Implement card transition animations** [M]
- Create `src/components/cards/CardTransition.tsx`
- Uses `react-native-reanimated` to animate card transitions
- Animation: horizontal slide — new card slides in from right, old card slides out to left (standard card-advance feel)
- Undo animation: reverse direction — old card slides in from left
- Duration: 250ms, `Easing.out(Easing.quad)`
- Wrap `CardDisplay` in `CardTransition` in both `PartyGameScreen` and `CouplesGameScreen`
- Trigger animation key change on `currentCardIndex` change
- **Done when:** Cards animate smoothly on advance and undo; no jank on mid-session; animation does not block interaction

**Task 12.2: Add haptic feedback to all key interactions** [S]
- Import `expo-haptics` throughout the app
- Add `Haptics.impactAsync(ImpactFeedbackStyle.Light)` on: card "Done" tap, Undo tap, mode selection on Home, tier selection on Couples Setup, "Let's Go" / "Start Game" CTA
- Add `Haptics.notificationAsync(NotificationFeedbackType.Success)` on: purchase success, restore success, session complete
- Add `Haptics.notificationAsync(NotificationFeedbackType.Error)` on: purchase failure, restore failure
- Wrap all calls in try/catch — haptics are not critical
- **Done when:** Tactile feedback present on all listed interactions; no crashes if haptics unavailable (simulator)

**Task 12.3: Prepare app icon, splash screen, and metadata assets** [S]
- Create or source placeholder app icon: 1024×1024 PNG, saved to `assets/icon.png`
  - Design: SpinUp logo — "S" letter with a spin/arrow motif or stylized dice; dark purple background, white text/icon
  - Also create `assets/adaptive-icon.png` (Android, same design, 1024×1024, foreground layer only on transparent bg)
- Create splash screen: `assets/splash.png` (1284×2778 recommended), same branding as icon, centered logo on dark background
- Update `app.json`: `"splash": { "image": "./assets/splash.png", "resizeMode": "contain", "backgroundColor": "#1a0a2e" }` (dark purple)
- Update `app.json` `"icon"`, `"android.adaptiveIcon"` references
- App Store metadata prep: create a `store-metadata/` folder at project root with `description.txt` (500-word App Store description), `keywords.txt` (100 chars of comma-separated ASO keywords: party game, drinking game, couples game, truth dare, etc.), `subtitle.txt` (30 chars: "Party & Couples Card Game"), `privacy-policy-url.txt` (placeholder URL)
- **Done when:** `npx expo start` shows correct icon/splash; all `app.json` references resolve; store metadata folder exists

**Task 12.4: Write unit tests for deck composition and scoring utilities** [M]
- `src/__tests__/deck.test.ts`:
  - Test `shuffleDeck`: returns same elements, different order (run 3x, assert at least one difference), no duplicates
  - Test `isCardAvailable`: free card + locked entitlement = available; locked card + locked entitlement = unavailable; locked card + unlocked entitlement = available
  - Test `composePartyDeck` Short session: returns exactly 15 cards, all 4 types represented, no duplicates
  - Test `composePartyDeck` free user: first 10 cards are all `isLocked: false`
  - Test `composeCouplesDeck` Medium session: returns 35 cards; last 25% are `phase: 'finale'`
- `src/__tests__/scoring.test.ts`:
  - Create `src/utils/scoring.ts` with `calculatePoints(card, outcome, isFinale): number`
  - Dare Duel: rating ≥ 7 → 3 pts; Finale + rating ≥ 7 → 6 pts (2× multiplier)
  - Memory Match: match → 2 pts; no match → 0 pts
  - Spin: convinced → 2 pts; not convinced → 0 pts
  - Test all combinations including Finale multiplier
- Run `npx jest` — all tests must pass
- **Done when:** `npx jest` passes with 0 failures; coverage on deck.ts and scoring.ts ≥ 80%

**Task 12.5: End-to-end smoke test + crash-free session validation** [M]
- Manual test checklist (document results in `test-results.md` at project root):
  - [ ] First launch → onboarding appears → Party tutorial → player setup → short session → all 4 card types appear → game completes → end screen
  - [ ] Undo mechanic: advance card → undo → same card shown; advance again → undo on second time → "nothing to undo" behavior
  - [ ] Drinking mode OFF: text swaps to non-drinking variant correctly
  - [ ] Party Mode free session (Short, 15 cards): no paywall appears
  - [ ] Party Mode medium session: paywall appears mid-session; dismiss → session continues (locked card skipped); session completes
  - [ ] Couples Mode: setup → Romantic tier → Short session → Memory Challenge sequential UX works → score updates → end screen shows winner
  - [ ] Couples Mode: Flirty tier tap → paywall appears (no session started)
  - [ ] Session background survival: start session → background app for 2 min → foreground → same card shown
  - [ ] Force close + reopen within 30 min → resume prompt
  - [ ] Force close + reopen after 30 min → no resume prompt, session cleared
  - [ ] Settings → Restore Purchase → success/fail messages
  - [ ] Navigation: back during game → exit confirm modal → keep playing works, end game works
- **Done when:** All checklist items pass on physical device (both iOS and Android if available); document any failures with workarounds

**Task 12.6: Production build + App Store submission** [M]
- Set final app version: `app.json` `"version": "1.0.0"`, `"ios": { "buildNumber": "1" }`, `"android": { "versionCode": 1 }`
- Add RevenueCat production API keys to EAS secrets: `eas secret:create --name EXPO_PUBLIC_RC_IOS_KEY --value [key]` and same for Android
- Run production build: `eas build --platform ios --profile production` and `eas build --platform android --profile production`
- Verify build artifacts: iOS `.ipa` opens in TestFlight; Android `.aab` uploads to Play Console internal track
- Create App Store Connect app entry: 17+ rating, primary category "Games" → subcategory "Card", secondary "Entertainment"
- Upload screenshots (minimum: 6.7" iPhone): generate at least 3 screenshots (Home screen, Party game in progress, Couples end screen)
- Submit for App Store review via `eas submit --platform ios --profile production`
- Submit Android to Play Console internal → then promote to production
- File expedited App Store review request if targeting Sunday ship
- **Done when:** Both builds submitted; App Store review pending; Play Store in review; confirmation emails received

---

## Dependency Map (Critical Path)

```
1.1 → 1.2 → 1.3 → 1.4 → 1.5
                    ↓
               2.1 → 2.2 → 2.3 → 2.4
                    ↓
               3.1 → 3.2 → 3.3
                    ↓
          4.1 → 4.2          7.1 → 7.2
               ↓                   ↓
          5.1 → 5.2              8.1 → 8.2 → 8.3 → 8.4
               ↓                             ↓
          5.3 → 5.4 → 5.5               9.1 → 9.2 → 9.3
               ↓                             ↓
          6.1 → 6.2 → 6.3 → 6.4        10.1 → 10.2 → 10.3 → 10.4
                                              ↓
                                         11.1 → 12.1 → 12.2 → 12.3 → 12.4 → 12.5 → 12.6
```

**Parallelizable:** Epics 6 (content) and 7–9 (Couples) can proceed in parallel once Epic 5 core is complete. RevenueCat account setup (R1) must happen Day 1 out-of-band.

---

*Total: 58 tasks | Estimated: 72–90 hours | Ship window: 2026-03-08*
