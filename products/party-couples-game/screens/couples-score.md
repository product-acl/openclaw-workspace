# Screen Spec: Couples Score / Round Tracker
**Mode:** Couples  
**File:** `screens/couples-score.md`  
**Author:** Designer Agent  
**Date:** 2026-03-06  
**Status:** READY FOR IMPLEMENTATION

---

## 1. Purpose

Shown between rounds and at session end. Two distinct configurations:

- **Between-Round View** — Displays score after each round completes (Warm-Up → Main → Main → Finale), with CTA to advance.
- **End Game View** — Full session wrap-up: winner reveal, final scores, reward card, replay options.

Both share the same base layout. End Game View progressively replaces between-round elements with final results content.

---

## 2. When This Screen Appears

| Trigger | Config Shown |
|---------|-------------|
| Warm-Up round ends | Between-Round View, "Round 1 complete" |
| Main Game round ends | Between-Round View, "Round 2 complete" |
| Finale round ends | End Game View |
| User force-exits mid-session | End Game View (partial scores, no winner declared) |

---

## 3. Screen Background

- **Background:** `couples-bg` (#12080F)
- **Gradient:** Subtle radial — `#1E0814` at 30% center → `#12080F` edges
- **Safe area:** `SafeAreaView edges={['top','bottom']}`

---

## 4. Between-Round View

### 4.1 Layout (top to bottom, 24pt horizontal padding throughout)

**A. Round Complete Header** (top, 48pt from top safe area)

```
         ✦ Warm-Up Complete ✦
```

- Icon: `checkmark-circle` (Ionicons), 32×32pt, `couples-success` (#5EE0A0)
  - Centered above text, 8pt gap below
- Title: `"Warm-Up Complete"` / `"Main Game Complete"` / `"Finale Complete"`
  - Font: `type-h2` — 28pt, Bold (700), Poppins
  - Color: `couples-text-primary` (#FFF0F5)
  - Text align: center
- Entry animation: Icon scales in spring (tension 300, friction 20) then title fades up from +8pt offset (300ms ease-out, 100ms delay after icon)

---

**B. Round Progress Stepper** (below header, 24pt gap)

Horizontal pill row showing 3 round stages. Centered.

```
 [●]━━━━━━━[○]━━━━━━━[○]
  Warm-Up    Main    Finale
```

Each node:
- Diameter: 12pt circle
- Completed: fill `couples-primary` (#E8517A)
- Current (just-completed): fill `couples-accent` (#FFAA5C), 2pt outer ring `couples-accent` at 30% opacity, radius 8pt
- Upcoming: fill `couples-border` (#3A1A28), border 1.5pt `couples-border`

Connector lines:
- Height: 2pt
- Completed segment: `couples-primary` (#E8517A)
- Upcoming segment: `couples-border` (#3A1A28)
- Width: 64pt between each node

Labels below each node:
- Font: `type-caption` — 12pt, Regular (400)
- Active/completed: `couples-text-primary` (#FFF0F5)
- Upcoming: `couples-text-disabled` (#5A3A48)
- 6pt gap below node

Total stepper width: ~220pt (fits all phones). Centered horizontally.

---

**C. Score Card** (below stepper, 32pt gap)

Full-width card showing current scores.

**Container:**
- bg: `couples-surface` (#221019)
- border radius: `radius-xl` (24pt)
- padding: 32pt vertical, 24pt horizontal
- shadow: `shadow-md`
- Width: Screen width − 48pt (24pt each side)

**Inside — two-column layout:**

Left column (Player A) | Right column (Player B)
--- | ---
Player name | Player name
Score (large) | Score (large)
Points breakdown | Points breakdown

Player name:
- Font: `type-h4` — 18pt, SemiBold (600)
- Color: `couples-text-secondary` (#C8A0B4)
- Max 12 characters before truncate with `…`
- Text align: center

Score number:
- Font: `type-score` — 40pt, ExtraBold (800)
- Color: `couples-accent` (#FFAA5C)
- `allowFontScaling={false}`
- Text align: center
- Entry animation: Number ticks up from 0 to final value over 600ms (Animated.Value linear)
- `accessibilityLabel={"{PlayerName}: {N} points"}`

**Leading player indicator:**
- The score of the player with MORE points gets a small `▲` leader tag below their score:
  - `"▲ Leading"` — `type-caption` 12pt, Medium, `couples-primary` (#E8517A)
- Tie: Neither shows the tag; a small `"—"` divider appears between the two columns

**Points Breakdown (below score):**
- Visible as a collapsible section — collapsed by default, showing `"See breakdown ›"`
  - Tap: Expands inline (no modal), chevron rotates 90°
  - Collapse height: 0pt, height animated (300ms ease)
- Expanded content (per player):
  - Each row: `"{Card Type} × {count}   +{points}"` (e.g., "Dare Duels won × 3   +9")
  - Font: `type-body-sm` — 14pt, Regular (400), `couples-text-secondary`
  - Row height: 28pt
  - Divider between rows: 1pt `couples-border` (#3A1A28)
  - Total row (bottom of each column's breakdown): Bold, `couples-text-primary`
- See breakdown label:
  - Font: `type-button-sm` — 14pt, Medium (500)
  - Color: `couples-primary` (#E8517A)
  - Text align: center, full width below score (spans both columns)

**Vertical divider between columns:**
- Width: 1pt
- Color: `couples-border` (#3A1A28)
- Height: 80% of card content height, vertically centered
- Position: Exact horizontal center of card

---

**D. Upcoming Round Preview** (below score card, 24pt gap)

```
 ⚡  Up next: Main Game
 "Full scoring in effect — double down."
```

Icon: `flash-outline` (Ionicons), 20×20pt, `couples-accent` (#FFAA5C)
Title: `"Up next: {Round Name}"` — `type-h4` 18pt, SemiBold, `couples-text-primary`
Body: Short flavor copy per transition — `type-body-sm` 14pt, Regular, `couples-text-secondary`

Copy per transition:
- Warm-Up → Main: `"Full scoring in effect — every card counts now."`
- Main → Finale: `"Final round. 2× points on every card. This is it."`

**Finale callout (Main → Finale only):**
An additional badge below the copy:

```
 ✦  2× POINTS ON ALL CARDS
```

- Container: `couples-secondary` (#C97DFF) at 15% opacity bg, 1.5pt `couples-secondary` border, `radius-2xl` (32pt), padding 10pt vertical 20pt horizontal
- Text: `"2× POINTS ON ALL CARDS"` — `type-badge` 11pt, Bold (700), letter-spacing 1.2px, `couples-secondary` (#C97DFF)
- Icon: `star` (Ionicons), 16×16pt, `couples-secondary`, 8pt left of text
- Entry animation: Scale spring from 0 → 1 (tension 300, friction 20), 200ms delay after preview title

---

**E. Next Round CTA** (bottom of screen, above safe area, 32pt bottom padding)

```
[ ▶  Start Main Game  ]
```

- Style: Primary button, Couples Mode
  - bg: `couples-primary` (#E8517A)
  - text: `#FFFFFF`
  - shadow-sm
  - pressed: `couples-primary-pressed` (#D03D65), scale 0.97
- Height: 60pt
- Border radius: `radius-xl` (24pt)
- Width: Screen width − 48pt (24pt padding each side)
- Font: `type-button-lg` — 18pt, SemiBold (600), letter-spacing 0.3px
- Icon: `play` (Ionicons), 20×20pt, `#FFFFFF`, 8pt left of label
- Label: `"Start Main Game"` / `"Start Finale"` / `"See Results"` (between-round to end)
- Haptic: medium impact on tap
- `accessibilityLabel`: Dynamic based on label text

---

## 5. End Game View

### 5.1 Layout Changes vs Between-Round

- **Round Complete Header** → replaced by **Winner Reveal Block**
- **Round Progress Stepper** → replaced by **Session Summary Tag**
- **Score Card** → same, but NO collapse on breakdown — fully expanded. Title changes.
- **Upcoming Round Preview** → removed
- **Next Round CTA** → replaced by **End Game Action Row**

---

### 5.2 Winner Reveal Block

Position: Top of screen, below safe area, 40pt top padding.

**Standard Win:**

```
     🏆
  Alex wins!
  This round goes to you.
```

- Trophy icon: `trophy` (Ionicons), 48×48pt
  - Color: `couples-accent` (#FFAA5C)
  - Entry: Scale spring 0 → 1 (tension 280, friction 18), 0ms delay
- Name: `"{WinnerName} wins!"` — `type-display` 48pt, ExtraBold (800), `couples-text-primary`
  - Entry: Fade + translateY from +12pt, 300ms ease-out, 150ms delay
  - `allowFontScaling={false}`
- Subtext: `"This round goes to you."` — `type-body` 16pt, Regular (400), `couples-text-secondary`
  - Entry: Fade in, 200ms ease-out, 350ms delay

**Tie State:**

```
     💫
  Perfect tie!
  You're completely in sync.
```

- Icon: `star` (Ionicons), 48×48pt, `couples-secondary` (#C97DFF)
- Name label: `"Perfect tie!"` — same size/weight as winner name
- Color: `couples-secondary` (#C97DFF)
- Subtext: `"You're completely in sync."` — `type-body` 16pt, Regular, `couples-text-secondary`

**Force-Exit (partial game) State:**

- No trophy or star icon
- Label: `"Session ended early"` — `type-h2` 28pt, Bold, `couples-text-secondary`
- Subtext: `"Here's where you stood:"` — `type-body` 16pt, `couples-text-disabled`

---

### 5.3 Session Summary Tag

A small horizontal pill tag below the winner reveal block, 16pt gap.

```
  ✓  35 cards played  ·  Flirty tier  ·  Session complete
```

- bg: `couples-surface` (#221019)
- Border radius: `radius-full` (9999pt)
- Padding: 8pt vertical, 16pt horizontal
- Font: `type-caption` — 12pt, Regular (400), `couples-text-secondary` (#C8A0B4)
- Dots (`·`) are separator characters in same color/weight
- `accessibilityLabel`: `"Session complete. {N} cards played. {Tier} tier."`

---

### 5.4 Score Card (End Game variant)

**Title changes:**

Within the score card, above the two player columns:
- `"Final Score"` — `type-h3` 22pt, SemiBold (600), `couples-text-primary`, centered
- 16pt below title, then the columns begin

**Points breakdown is fully expanded** (no toggle — always visible at end).

**Winner column highlighted:**
- Winner's column has a subtle bg: `couples-primary` (#E8517A) at 8% opacity, applied as a rounded rectangle overlay (`radius-lg` 16pt) spanning the column
- Winner's score number: `couples-primary` (#E8517A) instead of `couples-accent`
- Loser's score: `couples-text-secondary` (#C8A0B4)

---

### 5.5 Reward Card (Winner only)

Shown below the score card, 24pt gap. **Only visible when there is a clear winner (not tie).**

```
 ✦  Jordan's Reward
```

**Reward card container:**
- bg: `couples-surface-elevated` (#301625)
- Border: 1.5pt `couples-accent` (#FFAA5C)
- Border radius: `radius-xl` (24pt)
- Padding: 24pt all sides
- shadow: `shadow-md`

**Header row (inside card, top):**
- Icon: `gift-outline` (Ionicons), 24×24pt, `couples-accent` (#FFAA5C)
- Label: `"{WinnerName}'s Reward"` — `type-h4` 18pt, SemiBold (600), `couples-accent` (#FFAA5C)
- 8pt gap between icon and label
- Row: horizontal flex, items centered

**Reward prompt text:**
- 16pt gap below header row
- Font: `type-body-lg` — 20pt, Medium (500), `couples-text-primary`
- `allowFontScaling={false}`
- Content: A special affirming or playful prompt drawn from the reward card pool (varies by content tier)
  - Romantic tier example: `"Tell your partner one thing they did this session that made you smile."`
  - Flirty tier example: `"You won. Ask your partner for one thing you'd love right now."`
- Text align: Left
- Max 50 words

**Entry animation:**
- Card slides up from +24pt offset, fades in (400ms ease-out, 500ms delay after score card renders)

---

### 5.6 End Game Action Row

Three actions, stacked vertically, 12pt gap between each. Bottom of screen above safe area, 32pt bottom padding.

**Action 1 — Play Again (Primary):**
```
[ ↺  Play Again ]
```
- Style: Primary button (Couples Mode)
- Height: 60pt, border radius `radius-xl` (24pt)
- Full width (screen − 48pt)
- Font: `type-button-lg` 18pt, SemiBold
- Icon: `refresh` (Ionicons), 20×20pt, white, 8pt left of label
- Behavior: Re-shuffles deck using same tier, same session length. Returns to `couples-game` screen (first card).
- `accessibilityLabel`: "Play again with same settings"

**Action 2 — Change Settings (Secondary):**
```
[ Change Mode or Settings ]
```
- Style: Secondary button (border 1.5pt `couples-primary`, text `couples-primary`, bg transparent)
- Height: 52pt, border radius `radius-xl` (24pt)
- Full width
- Font: `type-button` 16pt, SemiBold
- Behavior: Returns to `couples-setup` screen
- `accessibilityLabel`: "Go back to setup to change mode or settings"

**Action 3 — Go Home (Ghost):**
```
     Go to Home Screen
```
- Style: Ghost/Text button
- Height: 44pt
- Font: `type-button-sm` 14pt, Medium, `couples-text-secondary`
- Underline: none (default ghost style)
- Behavior: Navigates to Home (`home.md`)
- `accessibilityLabel`: "Return to home screen"

---

## 6. Scroll Behavior

- Both views (Between-Round and End Game) are wrapped in `ScrollView` — content may exceed viewport on smaller devices (iPhone SE, etc.)
- `showsVerticalScrollIndicator={false}`
- `keyboardShouldPersistTaps="handled"` (not needed here but include for safety)
- Between-Round view: Usually fits on screen without scrolling on 390pt+ wide devices
- End Game view with reward card: May require scrolling on small devices — this is acceptable

---

## 7. Accessibility

- Winner reveal: `accessibilityLiveRegion="polite"` — announce "{WinnerName} wins" after animation completes
- Score numbers: `accessibilityLabel="{PlayerName} has {N} points"`
- Reward card: `accessibilityLabel="Reward for {WinnerName}: {prompt text}"`
- Play Again button: `accessibilityHint="Replays with same tier and session length"`
- Stepper (between-round): `accessibilityLabel="Round progress: {N} of 3 complete"`
- Breakdown rows: `accessibilityLabel="{Type}: {count} completed, {points} points"`

---

*Screen spec v1.0 — couples-score.md*
