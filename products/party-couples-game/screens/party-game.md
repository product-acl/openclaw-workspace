# Screen Spec: Party Game — Active Card Screen
**File:** `screens/party-game.md`  
**Author:** Designer Agent | **Date:** 2026-03-06  

---

## Purpose
The core gameplay screen. Displays the active card to the current player. Must be instantly readable at arm's length, in a noisy environment, by a player who may have had a drink or two. This screen is shown more than any other — it must be flawless.

## Entry Points
- "Let's Go" on Party Setup → first card
- "Next" CTA on previous card → next card
- "Undo" on a card → returns to the card before current

---

## Layout — Portrait 390×844pt

```
┌─────────────────────────────────────────────┐
│  Status Bar                                 │
│                                             │
│  ╔═══════════════════════════════════════╗  │
│  ║  [━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░] ║  │  ← progress bar (card index / total)
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  ╔═══════════════════════════════════════╗  │
│  ║  Card 8 of 30            [✕ exit]     ║  │  ← counter + exit icon
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  │    ████ DARE ████                      │ │  ← mini-game type badge
│  │                                        │ │
│  │    Maya, your turn!                    │ │  ← player name + "your turn"
│  │                                        │ │
│  │    ────────────────────────────────    │ │  ← thin divider
│  │                                        │ │
│  │    "Do your best impression            │ │
│  │     of the person to your              │ │
│  │     right."                            │ │  ← card text (large, bold)
│  │                                        │ │
│  │                                        │ │
│  │    Refuse? Drink 2.                    │ │  ← consequence line
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                             │
│                                             │
│  [↩ Undo last]        [     DONE! →    ]   │  ← action row
│                                             │
│  [safe area bottom]                         │
└─────────────────────────────────────────────┘
```

---

## Components

### 1. Progress Bar

**Position:** Top of screen, `paddingTop: safeAreaTop + 4pt`  
**Height:** 6pt  
**Width:** Full screen width, `paddingHorizontal: 24pt`

Segmented or continuous fill:
```
Style: Continuous fill bar (simpler than segments for large decks)
Track bg: party-border (#2E2E4A)
Fill: party-primary (#7C3AFF) for played cards
Current position: Fill ends here
Border-radius: radius-full (3pt, fully rounded)
Animation: Width transitions linearly when advancing (300ms ease)
```

### 2. Card Counter + Exit

**Row:** Horizontal, space-between, `paddingHorizontal: 24pt`, `paddingTop: 8pt`

Counter text:
- "Card 8 of 30" (`type-body-sm`, 14pt Regular, `party-text-secondary` #A0A0C0)
- Updates each card

Exit button (right side):
- Icon: `Ionicons close`, 24pt, `neutral-400` (#7A7A94)
- Touch target: 44×44pt
- Tap: confirmation modal "End session? Your progress will be lost."
  - [Cancel] → dismiss modal, stay on card
  - [End It] → navigate to End Game Screen
- `accessibilityLabel="Exit session"`

### 3. Game Card

**The card is the hero of this screen.**

**Dimensions:**  
- Width: screenWidth - 32pt (16pt margin each side)  
- Height: Dynamic (min 400pt, flex to fill space between progress bar and action row)

```
Background: party-surface (#1C1C30)
Border-radius: radius-md (12pt) — Party Mode, keep crisper
Border: 1pt party-border (#2E2E4A)
Shadow: shadow-lg, shadowColor: party-primary (#7C3AFF), shadowOpacity: 0.3, shadowRadius: 20

Internal padding: horizontal 28pt, vertical 32pt
```

**Card content stack (top-to-bottom):**

#### 3a. Mini-Game Type Badge

```
Layout: Pill shape, inline-block, left-aligned on card
Height: 28pt
Padding: horizontal 12pt, vertical 4pt
Border-radius: radius-full

Type-specific styling:
  DARE:       bg: #FF6B35, text: #FFFFFF
  TRUTH BOMB: bg: #7C3AFF, text: #FFFFFF
  VOTE:       bg: #FFD60A, text: #0E0E1A
  CHALLENGE:  bg: #00D4FF, text: #0E0E1A
  WILD:       bg: #FF2D78, text: #FFFFFF

Text: type-badge (11pt, Bold, UPPERCASE, letter-spacing: 1.2px)

Animation: Scale from 0.7 to 1.0 with spring (tension:300, friction:20) on card enter
```

#### 3b. Player Name Header

```
Text: "[PlayerName], your turn!"
Font: type-h2 (28pt, Bold, party-text-primary #FFFFFF)
marginTop: 16pt
allowFontScaling: false

Note: If player name is >12 chars, truncate to 12 + "..." to prevent layout break.
```

#### 3c. Thin Divider

```
Height: 1pt
Color: party-border (#2E2E4A) at 50% opacity
marginVertical: 16pt
width: 40pt (not full width — more like a decorative dash)
```

#### 3d. Card Text

```
Font: type-body-lg (20pt, Medium, party-text-primary #FFFFFF)
allowFontScaling: false
lineHeight: 30pt
marginTop: 0

Multi-line — text wraps naturally.
Max ~50 words per card (per content guidelines).

If text is extra long (>40 words), reduce to type-body (16pt) to preserve card fit.
```

#### 3e. Consequence Line

```
Shown only when card has a consequence (Dare, Truth Bomb, Vote — always; Challenge — conditional)
Format: "Refuse? Drink 2." or non-drinking variant: "Refuse? Do 10 jumping jacks."

Font: type-body-sm (14pt, Regular)
Color: party-secondary (#FF6B35) — orange to indicate stakes
marginTop: 20pt
fontStyle: 'italic'
```

**Vote card special layout:**

Vote cards replace player name header with "EVERYONE VOTES!" label (same badge style as type badge, but in `party-accent` #FFD60A):
```
"EVERYONE VOTES!"
Badge position: top of card, full-width alignment
Below badge: Vote prompt in card text area
Below prompt: Consequence ("Most votes? Drink 2.") in party-secondary
```

**Challenge Roulette special layout:**

Shows two player names when it's a head-to-head challenge:
```
Player Name Header: "[ActivePlayer] vs [ChallengerPlayer]"
Color: active player in #FFFFFF, "vs" in party-accent, challenger in party-secondary
```

### 4. Action Row

**Position:** Fixed to bottom of screen, above safe area  
**Layout:** Horizontal, space-between, `paddingHorizontal: 24pt`, `paddingBottom: safeAreaBottom + 16pt`  
**Height:** 72pt

#### 4a. Undo Button (left side)

```
Text: "↩ Undo last"
Icon: arrow-undo-outline (Ionicons, 18pt) + text side-by-side
Font: type-button-sm (14pt Medium)

States:
  Active (something to undo):
    Color: party-text-secondary (#A0A0C0)
    bg: transparent
    border: 1pt party-border (#2E2E4A)
    border-radius: radius-sm (8pt)
    padding: 8pt horizontal, 8pt vertical
    
  Disabled (first card, or undo already used):
    Color: party-text-disabled (#4A4A6A)
    bg: transparent
    border: 1pt party-border at 30% opacity
    accessibilityState: { disabled: true }
    
  Pressed (active state):
    opacity: 0.7, scale: 0.95
```

**On tap (when active):**
1. Haptic feedback (light impact)
2. Current card animated off-screen to RIGHT (reverse direction of normal flow)
3. Previous card slides in from LEFT
4. Undo button immediately goes to disabled state (consumed)
5. "Undone! Re-doing [PlayerName]'s turn" — toast appears for 1.5s (type-caption, neutral-400)

#### 4b. Done Button (right side)

```
Text: "DONE!"
Icon: chevron-forward right of text
Font: type-button-lg (18pt SemiBold, #FFFFFF, letter-spacing: 0.3px)

Dimensions: min-width 140pt, height: 56pt
Background: party-primary (#7C3AFF)
Border-radius: radius-md (12pt)
Shadow: shadow-sm

States:
  Default: bg: #7C3AFF
  Pressed: bg: #6B28EE, scale: 0.97
```

**On tap:**
1. Haptic feedback (medium impact)
2. Check if next card is locked → if yes, show paywall modal
3. If not locked: card slides out left, Player Handoff Screen appears briefly, then next card slides in right

---

## Player Handoff Screen (Brief Interstitial)

Appears between cards to pass phone to next player.

```
Duration: 1.5 seconds OR tap to skip
Background: party-bg (#0E0E1A) with subtle radial gradient

Center content:
  Text: "[NextPlayerName]'s turn!" 
  Font: type-display (48pt, ExtraBold, white)
  Sub: "Pass the phone!" (type-body, 16pt, party-text-secondary)
  Below: Animated hand/phone emoji or simple arrow graphic (optional)
  
  [Tap anywhere to skip the wait]
```

**Note:** This screen does NOT appear before the very first card. Session starts directly with card 1.

---

## Colors Used

| Element | Token | Hex |
|---------|-------|-----|
| Screen background | `party-bg` | `#0E0E1A` |
| Progress track | `party-border` | `#2E2E4A` |
| Progress fill | `party-primary` | `#7C3AFF` |
| Card background | `party-surface` | `#1C1C30` |
| Card border | `party-border` | `#2E2E4A` |
| Card shadow | `party-primary` at 30% | — |
| Player name | `party-text-primary` | `#FFFFFF` |
| Card text | `party-text-primary` | `#FFFFFF` |
| Consequence text | `party-secondary` | `#FF6B35` |
| Counter text | `party-text-secondary` | `#A0A0C0` |
| Exit icon | `neutral-400` | `#7A7A94` |
| Undo text (active) | `party-text-secondary` | `#A0A0C0` |
| Undo text (disabled) | `party-text-disabled` | `#4A4A6A` |
| Done button | `party-primary` | `#7C3AFF` |

---

## Typography Used

| Element | Token | Specs |
|---------|-------|-------|
| Player name | `type-h2` | 28pt, Bold, allowFontScaling=false |
| Card text | `type-body-lg` | 20pt, Medium, allowFontScaling=false |
| Consequence | `type-body-sm` | 14pt, Regular, italic |
| Badge | `type-badge` | 11pt, Bold, UPPERCASE |
| Counter | `type-body-sm` | 14pt, Regular |
| Done button | `type-button-lg` | 18pt, SemiBold |
| Undo button | `type-button-sm` | 14pt, Medium |
| Handoff screen | `type-display` | 48pt, ExtraBold |

---

## Navigation / Transitions

| Action | Transition |
|--------|-----------|
| Done → next card | Card slides LEFT, new card slides in from RIGHT |
| Undo → previous card | Card slides RIGHT (reverse), previous card slides in from LEFT |
| Done → paywall | Paywall slides up from bottom (modal) |
| Exit tap → modal | Fade-in overlay modal |
| Exit confirmed → End Game | Cross-fade |

---

## Edge Cases

### Long Card Text (>40 words)
- Auto-reduce font from `type-body-lg` (20pt) to `type-body` (16pt)
- If still overflows, add `ScrollView` within card content area only

### Player Name Overflow
- Max 12 characters displayed + "..."
- Full name stored in state but truncated for display

### First Card of Session
- Undo button: disabled state (nothing to undo)
- No "previous card" slide animation

### Last Card of Session
- Done button text changes to: "FINISH! 🎉"
- Tapping advances to End Game Screen

### Non-Drinking Mode
- Consequence line reads: "Refuse? [Alternative action]." (e.g., "Do 10 jumping jacks.")
- Same orange color, same italic style

### Vote Cards
- Player name header replaced with "EVERYONE VOTES!" badge (yellow)
- Instructions prompt the group to point simultaneously — no digital voting UI

### Wild Cards (unlocked only)
- Badge: `badge-wild` (#FF2D78)
- Card bg gets a subtle pink tint overlay (wild-card indicator)

### Paywall mid-session
- Card that triggered the lock does NOT display its text
- Paywall modal slides up
- Behind modal: locked card dimmed with lock icon centered on it
- After dismiss: locked card skipped, next free card slides in
- After purchase: locked card shown normally (session resumes)

### Session interrupted (backgrounded)
- On return: exact same card shown, no change
- If returned >30 min later: Home Screen shown (new session required)

---

*Screen spec last updated 2026-03-06*
