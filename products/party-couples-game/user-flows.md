# SpinUp — User Flows v1.0
**Author:** Designer Agent  
**Date:** 2026-03-06  
**Status:** APPROVED  

Each flow is written as a numbered step sequence with screen transitions and decision branches noted.

---

## Flow 1: First Launch / Onboarding

### Trigger
App opens for the very first time (no prior state).

### Steps

```
1. SPLASH SCREEN (300ms)
   → SpinUp logo + tagline fade in
   → Fonts loaded → auto-advance

2. HOME SCREEN — Mode Select
   → No skip or onboarding before this screen
   → User sees: "Party Mode 🍺" tile | "Couples Mode 💑" tile
   → Gear icon (⚙️) top-right for Settings
   → User must tap a mode to proceed

   [User taps PARTY MODE]
   → Branch: Flow 2 (Party Mode First Launch)
   
   [User taps COUPLES MODE]
   → Branch: Flow 4 (Couples Mode First Launch)
```

**State saved after this flow:** First launch flag set to false.

---

## Flow 2: Party Mode — First Launch (Tutorial + Setup + Game)

### Trigger
User taps Party Mode for the first time ever. Flag: `hasSeenPartyTutorial = false`.

### Steps

```
1. TUTORIAL OVERLAY — Screen 1 of 2
   Layout: Semi-transparent overlay on a mocked card behind it
   Content: "Cards come to you one at a time. Do the dare, tell the truth, 
            or drink up. Your call."
   CTA: "Got it →" (bottom, full-width button)
   → Tap CTA

2. TUTORIAL OVERLAY — Screen 2 of 2
   Content: "Accidentally skipped? Hit Undo. No judgment. We know 
            how parties go. 🍺"
   Visual: Undo button highlighted with arrow
   CTA: "Let's Party" (bottom, full-width button)
   → Tap CTA
   → Set hasSeenPartyTutorial = true
   → Transition: Slide up → Party Setup Screen

3. PARTY SETUP SCREEN
   → User adds player names (optional), sets session length, toggles drinking mode
   → Tap "Let's Go"
   → Transition: Slide left → first card (Party Game Screen)

4. PARTY GAME SCREEN — Card 1
   → Active card displayed
   → Continue as Flow 3: Party Mode Session
```

**Subsequent Party Mode launches:** Step 1–2 skipped entirely. Goes directly to Party Setup Screen.

---

## Flow 3: Party Mode — Full Game Session

### Trigger
User taps "Let's Go" on Party Setup Screen. Session data initialized.

### Setup state entering this flow:
- `players[]` — names array (2–8)
- `sessionLength` — Short (15) / Medium (30) / Long (50)
- `drinkingMode` — boolean
- `deck[]` — shuffled card queue, free + locked cards interleaved per ratio
- `currentPlayerIndex` — starts at 0
- `cardIndex` — starts at 0
- `undoStack` — empty (max depth 1)

### Steps

```
1. PLAYER HANDOFF SCREEN (brief interstitial, 1.5s or tap to dismiss)
   → Shows: "[PlayerName], your turn!"
   → Transition: Fade → Party Game Screen

2. PARTY GAME SCREEN — Card Active
   → Card displayed: badge | player name | card text | Done button | Undo button
   → [Undo button] visible (disabled/ghost state if first card or already used)
   
   [User taps UNDO] (if available)
   → Revert to previous card
   → Previous card redisplayed
   → undoStack cleared (consumed)
   → Current card pushed back near end of deck
   → Stay on Party Game Screen
   
   [User taps DONE]
   → Current card marked played
   → undoStack = [current card]
   → cardIndex++
   → Check: is next card LOCKED?
   
   [NEXT CARD IS FREE]
   → currentPlayerIndex advances (round-robin)
   → Transition: Card slide left → Player Handoff → Party Game Screen (next card)
   
   [NEXT CARD IS LOCKED]
   → Branch: Flow 6 — Paywall (Mid-Session)
   → On DISMISS: skip locked card, draw next free card, continue session
   → On PURCHASE: all cards unlocked, session resumes with previously locked card
   
   [ALL CARDS PLAYED]
   → Transition: Fade → End Game Screen

3. END GAME SCREEN
   → "That's a wrap! 🎉" 
   → Cards played count
   → Post-session upsell banner (if free user): "You played the free version. 
     The full game has 3x more. $4.99, one time." [Dismiss] [Unlock Now]
   → CTA: "Play Again" → reshuffles deck → returns to Party Setup
   → CTA: "Change Mode" → returns to Home
   → CTA: "Settings" → opens Settings

   [User exits mid-session via back/exit icon]
   → Confirmation modal: "End session? Your progress will be lost."
   → [Cancel] → returns to game
   → [End It] → End Game Screen with partial play count
```

---

## Flow 4: Couples Mode — First Launch (Tutorial + Setup)

### Trigger
User taps Couples Mode for the first time. Flag: `hasSeenCouplesTotorial = false`.

### Steps

```
1. TUTORIAL OVERLAY — Screen 1 of 2
   Content: "This isn't a question list. You'll play, compete, and dare 
            each other. Points are real."
   Visual: Animated score counter showing "+2 pts"
   CTA: "Nice →"
   → Tap CTA

2. TUTORIAL OVERLAY — Screen 2 of 2
   Content: "Pick your vibe before you start: Romantic, Flirty, or Spicy. 
            You can always try all three."
   Visual: Three tier selector tiles shown
   CTA: "Let's Play"
   → Tap CTA
   → Set hasSeenCouplesTutorial = true
   → Transition: Slide up → Couples Setup Screen

3. COUPLES SETUP SCREEN
   → Continue as step 1 of Flow 5
```

**Subsequent Couples Mode launches:** Steps 1–2 skipped. Go directly to Couples Setup Screen.

---

## Flow 5: Couples Mode — Full Game Session

### Trigger
User taps "Start Game" on Couples Setup Screen.

### Setup state entering this flow:
- `player1Name` — default "You"
- `player2Name` — default "Partner"
- `contentTier` — Romantic / Flirty / Spicy
- `sessionLength` — Short (20) / Medium (35) / Long (55)
- `deck[]` — shuffled cards tagged by phase (Warm-Up / Main / Finale)
- `scores` — {p1: 0, p2: 0}
- `currentPlayer` — Player 1 starts
- `sessionPhase` — "warmup" initially
- `cardIndex` — 0
- `finaleBonus` — unearned (tracked)

### Session Arc

```
Phase 1 — WARM-UP (first 25% of cards)
   Cards tagged level-1 intensity only
   Scoring active but lower stakes
   No phase announcement — game flows naturally

Phase 2 — MAIN GAME (middle 50% of cards)  
   Full mix of all mini-game types
   Normal scoring (+2 per complete, +3 for Dare Duel win)

Phase 3 — FINALE (last 25% of cards)
   Special Finale-tagged cards
   2× point multiplier indicator shown on cards
   Background tint shifts to purple-tinted surface
   +5 bonus to winner of Finale phase (completing all without skip)
```

### Detailed Steps

```
1. COUPLES GAME SCREEN — Card Active
   → Shows: current player's name | mini-game type badge | card text
   → Score header visible (both scores, live)
   → Round phase indicator (Warm-Up / Main / Finale)
   
   [Dare Duel card]
   → Both see card simultaneously
   → Active player goes first (taps "I'm Done")
   → Pass phone → partner taps "Rate" (1–10 slider appears)
   → Role reversal → partner performs → active player rates
   → Higher rating wins +3 pts
   → "+3 pts" animation on winner's score
   
   [Memory Challenge card]  
   → Question shown to active player
   → Active player types/thinks answer → taps "Done, hide it"
   → Screen shows "Pass to [partner name]"
   → Partner sees same question, types their answer
   → Tap "Reveal" → both answers shown side by side
   → Partner decides: "We match ✅" (+2 each) or "We don't ❌" (0 pts)
   → If no match: Conversation prompt appears for 5s then auto-dismisses
   
   [Spin the Scenario card]
   → Scenario text shown to active player
   → 30-second countdown visible on card
   → Player argues for their answer (real-life, no digital input needed)
   → Partner taps "Convinced (+2)" or "Not convinced (0)"
   → Roles swap → partner argues → active player judges
   
   [Card complete — tap Next Turn]
   → Point animation (+X pts) floats up from score area
   → currentPlayer toggles
   → cardIndex++
   → Check: is deck exhausted?
   
   [CHECK LOCKED CONTENT]
   → If card is locked: Branch to Flow 6 — Paywall (Mid-Session)
   → On dismiss: skip locked card, draw next available card
   
   [CHECK PHASE TRANSITION]
   → If crossing 25%/75% thresholds:
      Warm-Up → Main: No visual announcement (seamless)
      Main → Finale: PHASE TRANSITION SCREEN (1 card-flip transition with "FINALE 🔥" 
                      announcement, 2x multiplier reminder, 2s then auto-advance)
   
   [ALL CARDS PLAYED]
   → Transition: Fade → Couples Score Screen (End Screen)

2. COUPLES SCORE SCREEN (End Screen)
   → Winner announced: "[Name] wins this round! 🏆"
   → Tie variant: "You're perfectly in sync! 💫"
   → Score breakdown: both names + final totals
   → Winner's reward card displayed (special prompt — text only)
   → CTAs:
      "Play Again" → same tier + length, reshuffled deck → Couples Game Screen
      "Change Settings" → Couples Setup Screen
      "Home" → Home Screen
   
   [User exits mid-session via exit icon]
   → Confirmation modal: "End session? Scores won't be saved."
   → [Keep Playing] → returns to game
   → [End Session] → Couples Score Screen with partial scores
```

---

## Flow 6: IAP Purchase Flow

### 6a. Paywall — Mid-Session Trigger (Party Mode)

```
1. Session is paused (current card not advanced)
2. PAYWALL MODAL slides up from bottom (covers bottom 85% of screen)
   → Background: blurred/dimmed session card visible behind modal
   → Headline: "Unlock the Full Game"
   → Feature list
   → Price CTA: "Unlock for $4.99"
   → Restore Purchase link
   → ✕ dismiss (top-right corner, always visible, no delay)

3a. [User taps ✕ DISMISS]
   → Modal slides down
   → Session resumes: current locked card is skipped
   → Next available free card drawn
   → Subtle text in progress area: "Some cards are locked. [Unlock]"
   
3b. [User taps UNLOCK FOR $4.99]
   → Loading state on button: spinner, text "Processing..."
   → Native App Store / Play Store payment sheet appears (OS-level)
   
   [Purchase CANCELLED]
   → Returns to Paywall Modal (user can try again or dismiss)
   
   [Purchase FAILED (network/error)]
   → Error toast: "Purchase failed. Please try again."
   → Paywall Modal remains visible
   
   [Purchase SUCCESS]
   → Payment sheet closes
   → SUCCESS MODAL (replaces paywall): "🎉 You're unlocked! Everything's yours."
   → After 2s or tap: Modal dismisses
   → Session resumes with the previously locked card now showing
   → All content gates lifted globally for this device
```

### 6b. Paywall — Tier Selection Trigger (Couples Mode)

```
1. User taps "Flirty" or "Spicy" on Couples Setup Screen
2. PAYWALL MODAL slides up
   → Same design as 6a, same dismiss behavior
3a. DISMISS → tier selection stays on Romantic (default)
3b. PURCHASE SUCCESS → Tier selected immediately, user continues to setup
```

### 6c. Paywall — Session Length Trigger (Long)

```
1. User taps "Long" on setup screen (Party or Couples)
2. PAYWALL MODAL slides up (same design)
3a. DISMISS → selection reverts to Medium
3b. PURCHASE → Long session now available, auto-selected, user continues
```

### 6d. Restore Purchase Flow

```
1. User taps "Restore Purchase" (paywall modal or Settings screen)
2. Loading state: "Restoring..."
3. Native OS restore flow runs silently
4a. RESTORE SUCCESS → "✅ Purchase restored. Enjoy the full game!" toast
   → All content unlocked
4b. RESTORE NOT FOUND → "No purchase found for this Apple/Google account." toast
   → Paywall modal remains open
4c. RESTORE ERROR (network) → "Couldn't connect. Check your internet and try again." toast
```

---

## Flow 7: Settings Screen

### Trigger
User taps ⚙️ gear icon from Home Screen. Available at any time (not during active game session — icon is removed during sessions).

```
1. SETTINGS SCREEN slides up as bottom sheet (modal)
2. Options available:
   - "Restore Purchase" → triggers Flow 6d
   - "Privacy Policy" → opens in-app browser (WebView)
   - "Terms of Service" → opens in-app browser (WebView)
   - "Rate SpinUp" → opens App Store / Play Store listing
   - "App Version" → static text (non-interactive)
   - [If purchased] "Purchase Status: ✅ Full Game Unlocked" (non-interactive)
3. Dismiss: swipe down or tap outside modal
   → Returns to Home Screen
```

---

## Flow 8: Session Exit / Interruption Handling

### App Backgrounded During Session

```
1. App goes to background (call, home button, notification tap)
2. Session state written to AsyncStorage immediately (React state + AsyncStorage sync)
3. [App returns to foreground within 30 minutes]
   → Session resumed exactly where left off (same card visible)
4. [App returns to foreground after 30+ minutes]
   → Home Screen shown (session lost — this is acceptable per PRD)
   → No error, no crash. Clean home screen.
5. [App force-closed and reopened]
   → Home Screen shown (session lost)
   → No recovery attempt (v1.0 behavior per PRD)
```

---

## Navigation Map (Summary)

```
Home ──────────────────────────────────── Settings (modal)
  │
  ├── [Party Mode tap] 
  │     → [First time] Party Tutorial Overlay
  │     → Party Setup
  │         → Party Game (card loop)
  │              └── Paywall (modal, mid-session)
  │         → End Game Screen
  │              └── Play Again → Party Setup
  │              └── Home
  │
  └── [Couples Mode tap]
        → [First time] Couples Tutorial Overlay
        → Couples Setup
            → Couples Game (card loop)
                 ├── Paywall (modal, tier or mid-session)
                 └── Finale Phase Transition (overlay)
            → Couples Score (end screen)
                 └── Play Again → Couples Game
                 └── Change Settings → Couples Setup
                 └── Home
```

---

*User Flows v1.0 — Last updated 2026-03-06*
