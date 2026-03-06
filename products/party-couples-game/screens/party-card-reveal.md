# Screen Spec: Party Card Reveal — Between-Card Handoff
**File:** `screens/party-card-reveal.md`  
**Author:** Designer Agent | **Date:** 2026-03-06  

---

## Purpose
The brief interstitial shown between cards. Its job is two-fold:
1. Allow the current player to hand the phone to the next player without them seeing the incoming card
2. Build brief anticipation / energy before the next card appears

This is a transitional moment, not a full screen. It auto-dismisses after 1.5s or on tap.

## Entry Points
- Player taps "DONE!" on Party Game Screen
- Undo used on a card → redirects to Player Handoff briefly before showing previous card

---

## Layout — Portrait 390×844pt

```
┌─────────────────────────────────────────────┐
│  Status Bar                                 │
│                                             │
│  ╔═══════════════════════════════════════╗  │
│  ║  [━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░] ║  │  ← progress bar (same as game screen)
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  Card 9 of 30                    [✕ exit]  │
│                                             │
│                                             │
│                                             │
│                                             │
│           ┌─────────────────────┐           │
│           │                     │           │
│           │   👋                │           │
│           │                     │           │
│           │   Jordan,           │           │  ← big name
│           │   your turn!        │           │
│           │                     │           │
│           │   Pass the phone.   │           │  ← instruction
│           │                     │           │
│           └─────────────────────┘           │
│                                             │
│                                             │
│           Tap anywhere to continue          │  ← ghost label at bottom
│                                             │
│                                             │
│  [safe area bottom]                         │
└─────────────────────────────────────────────┘
```

---

## Components

### 1. Progress Bar + Counter
Identical to Party Game Screen (see `party-game.md`). Shows updated progress (card 9 of 30 — the upcoming card number).

### 2. Central Handoff Card

**Dimensions:**  
- Width: screenWidth - 64pt (centered, narrower than game card for a different feel)  
- Height: ~260pt

```
Background: party-primary-subtle (#2A1066)
Border: 1.5pt solid party-primary (#7C3AFF) at 50% opacity
Border-radius: radius-lg (16pt)
Shadow: shadow-md

Content (centered, vertically):
  ├── Emoji: 👋 (48pt font size)
  ├── marginTop: 24pt
  ├── Player name: "[NextPlayerName],"
  │     font: type-h1 (36pt, ExtraBold, #FFFFFF)
  │     allowFontScaling: false
  ├── "your turn!" (same font, party-primary #7C3AFF)
  ├── marginTop: 16pt
  └── "Pass the phone." (type-body, 16pt, party-text-secondary #A0A0C0)
```

**Animation on appear:**
```
Card enters: scale from 0.85 → 1.0 with spring (tension: 250, friction: 20)
Simultaneously: opacity 0 → 1 (200ms)
Background pulse: Very subtle pulsing glow on card border (loop, 2s cycle)
```

### 3. "Tap anywhere" Label

```
Text: "Tap anywhere to continue"
Font: type-caption (12pt, Regular)
Color: party-text-disabled (#4A4A6A)
Position: bottom-center, marginBottom: safeAreaBottom + 32pt
Animation: Gentle opacity pulse (0.4 → 0.7 → 0.4, 2s loop)
```

---

## Interaction Behavior

### Auto-dismiss
- After 1.5 seconds, auto-transition to Party Game Screen (next card)
- Transition: cross-fade (150ms) → card slides in from right

### Tap to skip
- Tap anywhere on screen skips the 1.5s wait
- Same transition: cross-fade → card slides in

### Progress during this screen
- Progress bar is "in between" — fill shows completed cards, upcoming card slot highlighted in accent

---

## Colors Used

| Element | Token | Hex |
|---------|-------|-----|
| Background | `party-bg` | `#0E0E1A` |
| Handoff card bg | `party-primary-subtle` | `#2A1066` |
| Handoff card border | `party-primary` at 50% | — |
| Player name | `neutral-0` | `#FFFFFF` |
| "your turn!" | `party-primary` | `#7C3AFF` |
| Instruction text | `party-text-secondary` | `#A0A0C0` |
| Tap hint | `party-text-disabled` | `#4A4A6A` |
| Progress fill | `party-primary` | `#7C3AFF` |

---

## Typography Used

| Element | Token | Specs |
|---------|-------|-------|
| Player name | `type-h1` | 36pt, ExtraBold, allowFontScaling=false |
| "your turn!" | `type-h1` | 36pt, ExtraBold, primary color |
| Pass instruction | `type-body` | 16pt, Regular |
| Tap hint | `type-caption` | 12pt, Regular |

---

## Navigation / Transitions

| Action | Transition |
|--------|-----------|
| Auto-dismiss (1.5s) | Fade → Card slides in from right (Party Game) |
| Tap anywhere | Same as auto-dismiss |
| Exit icon tap | Confirmation modal → End Game |

---

## Edge Cases

### Long Player Names
- Names >12 chars: truncate to 12 + "..."
- If name is very short (like "Jo"), still renders beautifully — padding fills space

### Same Player Multiple Times
- Round-robin assignment can mean same player twice in some edge cases near session end
- Screen still shows same handoff ("Maya, your turn!") — no special treatment needed

### Undo flow
- When undo is used: handoff screen shows the PREVIOUS player's name with text:
  "[PrevPlayerName], going back!"
  Sub-text: "↩ Redoing your turn"
  party-accent (#FFD60A) color on "going back!" instead of primary purple
  Duration: 1.5s same as normal

### Last Card Approaching
- No special treatment on this screen. Last card announcement happens on the game card itself.

### Session end (no next card)
- This screen is NEVER shown when advancing from the last card
- After last card's Done tap → direct transition to End Game Screen (no handoff needed)

---

## Design Note for Coder

This screen is lightweight — it's not worth a full Navigator `Screen`. Implement as a conditional render state within the Party Game flow, or as a very fast modal that covers the game screen. Avoid adding it as a separate navigation route to keep back-button behavior clean.

---

*Screen spec last updated 2026-03-06*
