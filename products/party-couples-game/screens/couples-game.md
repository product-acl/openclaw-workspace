# Screen Spec: Couples Game (Active Round)
**Mode:** Couples  
**File:** `screens/couples-game.md`  
**Author:** Designer Agent  
**Date:** 2026-03-06  
**Status:** READY FOR IMPLEMENTATION

---

## 1. Purpose

The primary gameplay screen. Shown for the full duration of each card interaction during a Couples Mode session. This screen persists across all three round phases (Warm-Up / Main / Finale) with visual mutations per phase. Also handles the Memory Challenge's sequential 2-phase input flow on a single device.

---

## 2. Screen Layout — Base (All Card Types)

### 2.1 Viewport

- **Background:** `couples-bg` (#12080F)
- **Subtle gradient:** `#18080E` (top) → `#12080F` (bottom), 100% screen height, linear
- **Finale round override:** Additional radial overlay on card surface — `#1A0A2A` at 35% opacity (see Section 6)
- **Safe area:** `SafeAreaView edges={['top','bottom']}`

---

### 2.2 Top Bar (fixed, 56pt tall)

```
[← Exit]          [WARM-UP ROUND]          [↩ Undo]
```

**Exit button (left):**
- Icon: `close` (Ionicons), 24×24pt
- Color: `couples-text-secondary` (#C8A0B4)
- Touch target: 44×44pt
- Tap: Opens exit confirmation modal (see Section 8.2)
- Position: Left edge, vertically centered. 24pt left padding.

**Round indicator (center):**
- Label: `WARM-UP ROUND` / `MAIN GAME` / `FINALE`
- Font: `type-badge` — 11pt, Bold (700), Poppins, letter-spacing 1.2px, uppercase
- Colors by phase:
  - Warm-Up: `couples-text-secondary` (#C8A0B4)
  - Main Game: `couples-accent` (#FFAA5C)
  - Finale: `couples-secondary` (#C97DFF) — with a subtle glow: text-shadow `#C97DFF` at 40% opacity, blur 6pt
- Horizontally centered in bar

**Undo button (right):**
- Label: `↩ Undo last`
- Font: `type-button-sm` — 14pt, Medium (500), letter-spacing 0.3px
- Color (active): `couples-text-secondary` (#C8A0B4)
- Color (disabled — first card, or already undone): `couples-text-disabled` (#5A3A48)
- Touch target: 44×44pt minimum. Right edge, 24pt right padding.
- Disabled state: no press animation, no opacity change — just disabled color
- Tap behavior (active): Animated — screen slides right, previous card slides back in from left. +subtle haptic tick.
- Tap behavior (disabled): Icon shakes (3 quick oscillations ±4pt horizontal, 80ms each). No action taken.
- `accessibilityLabel`: "Undo last card"

---

### 2.3 Progress + Score Bar (below top bar)

Height: 48pt. Sits immediately below top bar, 16pt gap.

**Structure (left to right):**
```
[Player A Name: 12 pts]    [Card 7 of 35]    [Player B Name: 9 pts]
```

**Player scores:**
- Player name: `type-body-sm` — 14pt, Regular (400), `couples-text-secondary` (#C8A0B4)
- Score number: `type-h4` — 18pt, SemiBold (600), `couples-accent` (#FFAA5C)
- Format: `"Alex\n12 pts"` — name on top, score below, center-aligned per player
- Layout: Left player flush left (24pt), right player flush right (24pt)
- Active player highlight: Name becomes `couples-text-primary` (#FFF0F5), 500 weight. A 2pt underline in `couples-primary` (#E8517A) sits below the name.

**Card counter (center):**
- Text: `"7 of 35"` or `"Card 7 / 35"`
- Font: `type-caption` — 12pt, Regular (400), `couples-text-secondary` (#C8A0B4)
- `allowFontScaling={false}`

**Progress bar (thin strip, below the score row):**
- Height: 4pt
- Width: Full screen (0pt horizontal margin, bleeds to edges)
- Background: `couples-border` (#3A1A28)
- Fill (progress): `couples-primary` (#E8517A) — left to right based on cards played / total
- Fill radius: `radius-full` (pill shape, 9999pt)
- Animation: Width transition on each new card (300ms linear)

---

### 2.4 Whose Turn Indicator (below score bar)

Height: 40pt. 24pt horizontal padding.

```
💑  Jordan's turn
```

- Icon: `heart` (Ionicons), 20×20pt, `couples-primary` (#E8517A)
- Text: `"{PlayerName}'s turn"` — `type-body` 16pt, Medium (500), `couples-text-primary` (#FFF0F5)
- 8pt gap between icon and text
- Animation: On each card transition, this label fades out (150ms) then fades in with new name (150ms)

---

### 2.5 Point Multiplier Badge (Finale only)

Appears only during Finale round, above the card.

```
✦  2× POINTS
```

- Container: `couples-secondary` (#C97DFF) at 20% opacity background, `couples-secondary` 1.5pt border
- Border radius: `radius-2xl` (32pt) — pill shape
- Padding: 8pt vertical, 16pt horizontal
- Icon: `star` (Ionicons), 16×16pt, `couples-secondary` (#C97DFF)
- Text: `"2× POINTS"` — `type-badge` 11pt, Bold (700), letter-spacing 1.2px, `couples-secondary` (#C97DFF)
- Position: Centered, 12pt above card top edge
- Entry animation: Scale from 0 → 1 with spring (tension 300, friction 20), simultaneous with card entry
- `accessibilityLabel`: "Double points — Finale round active"

---

### 2.6 Card Container

**Dimensions:**
- Width: Screen width − 48pt (24pt horizontal padding each side)
- Min height: 340pt
- Max height: 480pt (card grows with content; scrollable if overflow — but card text should never exceed 40 words per PRD)
- Border radius: `radius-xl` (24pt) — Couples Mode default

**Background:** `couples-surface` (#221019)
- Subtle radial gradient on card: `#2A1219` at center → `#221019` at edges (very faint, purely aesthetic)

**Shadow:** `shadow-glow-couples` — `#E8517A` at 25% opacity, radius 20pt (iOS). Android: `elevation: 6`.

**Card internal layout (top to bottom, 32pt vertical padding, 24pt horizontal padding):**

1. **Mini-game type badge** — top-left
2. **Card content text** — center
3. **Action row** — bottom

**Vertical spacing between elements:** 24pt

---

### 2.7 Mini-Game Type Badge (inside card, top-left)

- Font: `type-badge` — 11pt, Bold (700), uppercase, letter-spacing 1.2px
- Border radius: `radius-xs` (4pt)
- Padding: 4pt vertical, 10pt horizontal
- Colors:

| Type | Background | Text |
|------|-----------|------|
| DARE DUEL | `#E8517A` | `#FFFFFF` |
| MEMORY | `#C97DFF` | `#FFFFFF` |
| SCENARIO | `#FFAA5C` | `#12080F` |
| FINALE | `#FFD700` | `#12080F` |

- Entry animation: Scale from 0 → 1 spring (tension 300, friction 20)

---

### 2.8 Card Content Text

- Font: `type-body-lg` — 20pt, Medium (500), Poppins
- Color: `couples-text-primary` (#FFF0F5)
- `allowFontScaling={false}`
- Text alignment: Left (not center — longer prompts read better left-aligned)
- Max width: Card width − 48pt horizontal padding
- Line height: 30pt

**If the card has a sub-prompt or timer note**, show it below the main text:
- 12pt gap
- Font: `type-body-sm` — 14pt, Regular (400)
- Color: `couples-text-secondary` (#C8A0B4)
- Example: `"You have 30 seconds to convince your partner."`

---

### 2.9 Countdown Timer (Scenario cards only)

Displayed inside the card, below the card text. Only shown when card type is `Spin the Scenario` or any card tagged with `hasTimer: true`.

**Timer display:**
- Large number: `type-score` — 40pt, ExtraBold (800), `couples-accent` (#FFAA5C)
- Unit label: `"sec"` — `type-caption` 12pt, Regular (400), `couples-text-secondary` (#C8A0B4), below the number
- Both centered together
- `allowFontScaling={false}`

**Timer states:**
- **Running (>10s):** Color `couples-accent` (#FFAA5C)
- **Urgent (≤10s):** Color `couples-primary` (#E8517A), number pulses (scale 1.0→1.05→1.0, 800ms repeat)
- **Expired:** Number shows `"0"`, color `couples-error` (#FF6B8A), brief shake animation

**Timer is decorative / honor system** — tapping the number does nothing. No start/stop control in v1.0.

---

### 2.10 Action Row (bottom of card)

Single primary button, full-width within card padding.

**"Done" Button:**
- Label: `"Done"` (default) / `"We're Done"` (Dare Duel) / `"Reveal Answers"` (Memory Challenge — see Section 5)
- Style: Primary button, Couples Mode
  - Default: bg `couples-primary` (#E8517A), text `#FFFFFF`, shadow-sm
  - Pressed: bg `couples-primary-pressed` (#D03D65), scale 0.97, shadow-xs
- Height: 56pt
- Border radius: `radius-xl` (24pt)
- Font: `type-button-lg` — 18pt, SemiBold (600), letter-spacing 0.3px
- `accessibilityLabel`: "Mark card complete and advance"

**+Points feedback (on Done tap):**
- A "+2 pts" (or "+3 pts" for Dare Duel win) label animates from the Done button upward, fades out over 600ms
- Font: `type-h3` — 22pt, SemiBold (600)
- Color: `couples-accent` (#FFAA5C)
- Animation: `translateY` from 0 to −40pt, `opacity` from 1 to 0 (600ms ease-out)

---

## 3. Standard Card States

### State A — Idle (card just appeared)
- Card slides in from right (horizontal slide, 280ms ease-out)
- Badge pops in (scale spring)
- Multiplier badge (Finale only) pops in simultaneously
- Undo button enables if not first card

### State B — Reading
- No interaction expected. User reads / performs.
- Timer counts down if applicable.

### State C — Done (user taps Done)
- Haptic: medium impact
- +Points label animates
- Card slides out to left (280ms ease-in), next card slides in from right

### State D — Undo triggered
- Current card slides out to right (280ms ease-in)
- Previous card slides in from left (280ms ease-out)
- Undo button immediately disables (one level deep)
- Score decrements if points were awarded for the undone card

---

## 4. Dare Duel Card — Additional Elements

Beyond the base layout, Dare Duel cards add:

**Rating Sliders** (appear after both players perform the dare):
- Labeled: `"Partner A rates you:"` above slider
- Slider: React Native Slider component
  - Min: 1, Max: 10, Step: 1
  - Track color (filled): `couples-primary` (#E8517A)
  - Track color (empty): `couples-border` (#3A1A28)
  - Thumb color: `#FFFFFF`
  - Height: 44pt touch target
- Current value displayed as large number to the right: `type-h2` 28pt, Bold (700), `couples-accent` (#FFAA5C)
- Two sliders shown when both players have performed — each labeled with player name

**"Who goes first?" note:**
- Shown as small text below badge, above card text
- `"Flip a coin or decide together — then take turns"`
- Font: `type-body-sm` 14pt, `couples-text-secondary` (#C8A0B4), italic style (`fontStyle: 'italic'`)

**Done button label:** `"We're Done"` (both performed)

---

## 5. Memory Challenge — Sequential Input Flow

Memory Challenge uses a 3-phase state machine on a single device.

### Phase 1 — Player A Input

**Card surface is normal** with badge `MEMORY` (purple).

Card text shows the question, e.g.:
> *"What's your partner's biggest non-work stress right now?"*

Below the card text, a text input field:
- Label: `"Jordan, write your answer:"` — `type-body-sm` 14pt, Medium, `couples-text-secondary`
- Input field:
  - bg: `couples-surface-elevated` (#301625)
  - border: 2pt `couples-secondary` (#C97DFF) when focused
  - text color: `couples-text-primary` (#FFF0F5)
  - border radius: `radius-sm` (8pt)
  - height: 80pt (multiline, up to 3 lines)
  - padding: 12pt
  - font: `type-body` 16pt, Regular (400)
  - placeholder: `"Type your answer..."` in `couples-text-disabled` (#5A3A48)
  - `returnKeyType="done"` (keyboard done dismisses keyboard)
  - `multiline={true}`, `maxLength={200}`

Done button label: `"Pass to Alex →"` (shows partner's name)

### Phase 2 — Blackout Screen

Triggered immediately on "Pass to Alex" tap.

**Full screen black overlay** (`#000000`, opacity 1.0, covers entire screen including safe area).

**Content (centered):**
- Icon: `eye-off-outline` (Ionicons), 48×48pt, `#FFFFFF` at 60% opacity
- Text: `"Alex's turn"` — `type-h2` 28pt, Bold (700), `#FFFFFF`
- Sub-text: `"Don't look! Pass the phone."` — `type-body` 16pt, Regular, `#FFFFFF` at 60% opacity
- 24pt gap between icon, title, subtext

**Tap to reveal:**
- Below sub-text, 32pt gap
- Button: `"I have the phone →"` — Secondary button style (border `#FFFFFF` at 30%, text `#FFFFFF` at 70%)
- Height: 52pt, border radius: `radius-xl` (24pt)
- `accessibilityLabel`: "I now have the phone, show my input screen"

### Phase 3 — Player B Input

**Identical to Phase 1** but:
- Label: `"Alex, write your answer:"`
- Done button label: `"Reveal Both Answers ✦"`
- Player A's answer is NOT shown (hidden behind the reveal)

### Phase 4 — Reveal

Both answers animate in simultaneously:

**Two answer panels, stacked vertically, 16pt gap:**

Each panel:
- bg: `couples-surface-elevated` (#301625)
- border radius: `radius-lg` (16pt)
- padding: 16pt all sides
- shadow: `shadow-sm`
- Label (top of panel): Player name, `type-body-sm` 14pt, SemiBold, `couples-text-secondary`
- Answer text: `type-body-lg` 20pt, Medium (500), `couples-text-primary`

**Entry animation:** Both panels scale from 0.85 → 1.0, opacity 0 → 1 (400ms ease-out, staggered: Panel A at 0ms, Panel B at 150ms)

**Below both panels — match decision row:**
- Text: `"Do your answers match?"` — `type-body` 16pt, `couples-text-secondary`
- Two buttons side by side:
  - `"✓ Match! +2 each"` — style: bg `couples-success` (#5EE0A0) at 20% opacity, border 1.5pt `couples-success`, text `couples-success`, border radius `radius-xl` (24pt), flex 1
  - `"✗ No match"` — style: bg transparent, border 1.5pt `couples-border`, text `couples-text-secondary`, border radius `radius-xl` (24pt), flex 1
  - 12pt gap between buttons
  - Height: 52pt each
  - Font: `type-button` 16pt, SemiBold (600)

**No-match conversation prompt:**
If "No match" tapped — a bottom sheet slides up (400ms ease-out):
- bg: `couples-surface-elevated` (#301625)
- Border radius top: `radius-xl` (24pt)
- Content:
  - Icon: `chatbubble-ellipses-outline` (Ionicons), 32×32pt, `couples-accent` (#FFAA5C)
  - Title: `"Talk about it"` — `type-h3` 22pt, SemiBold
  - Body: `"60 seconds — what were you each thinking?"` — `type-body` 16pt, `couples-text-secondary`
  - Button: `"Done Talking →"` — Primary button (full width)

---

## 6. Finale Round Visual Treatment

When `currentRound === 'finale'`:

1. **Card surface overlay:** Radial gradient `#1A0A2A` at 35% opacity on top of card background — center → edges. Applied via absolute-positioned `View` with `pointerEvents="none"` inside the card.
2. **Round indicator:** `couples-secondary` (#C97DFF) with text-shadow glow (see Section 2.2)
3. **Multiplier badge:** Visible above card (see Section 2.5)
4. **Card glow:** `shadow-glow-couples` intensity increases — `#C97DFF` at 30% opacity, radius 24pt (iOS). Android: elevation 10.
5. **Score color:** Both player score numbers flip from `couples-accent` (#FFAA5C) to `couples-secondary` (#C97DFF) for the duration of Finale
6. **Transition into Finale:** When first Finale card appears, overlay fades in (600ms), multiplier badge springs in, round indicator transitions with a 200ms cross-fade

---

## 7. Full Screen States Summary

| State | Description | Trigger |
|-------|-------------|---------|
| `idle` | Card displayed, timer running if applicable | Card loads |
| `memory-input-a` | Player A typing phase | Memory Challenge card |
| `memory-blackout` | Blackout screen between inputs | "Pass to [B]" tapped |
| `memory-input-b` | Player B typing phase | "I have the phone" tapped |
| `memory-reveal` | Both answers shown, match decision | "Reveal Both Answers" tapped |
| `dare-duel-rating` | Rating sliders visible | "We're Done" tapped |
| `points-awarded` | +N pts animation playing | Match/win confirmed |
| `transitioning` | Card sliding out / in | Done tapped |
| `undo-transitioning` | Previous card sliding back in | Undo tapped |
| `finale-active` | Finale overlay active | Round changes to Finale |

---

## 8. Modals

### 8.1 Points Awarded Toast (non-blocking)

Not a modal — a floating toast that appears above the Done button:

- `"+2 pts"` or `"+3 pts"` (Dare Duel)
- Font: `type-h2` 28pt, ExtraBold (800)
- Color: `couples-accent` (#FFAA5C)
- Animation: Rises from button position 40pt upward, opacity 1 → 0 over 600ms ease-out
- Then: Score counter in top bar animates up (counter ticks from old to new value over 400ms)

### 8.2 Exit Confirmation Modal

Triggered by tapping the × (close) icon.

- **Overlay:** `#000000` at 60% opacity, full screen. Tap outside dismisses.
- **Sheet:** `couples-surface-elevated` (#301625), border radius top `radius-xl` (24pt), slides up from bottom (400ms)
- **Content (vertical stack, 24pt gap):**
  - Title: `"End this session?"` — `type-h3` 22pt, SemiBold, `couples-text-primary`
  - Body: `"Your scores will be lost."` — `type-body` 16pt, Regular, `couples-text-secondary`
  - `"End Session"` — Destructive button (text `couples-error` #FF6B8A, bg transparent, pressed state bg `#FF6B8A` at 15%), height 52pt, full width
  - `"Keep Playing"` — Primary button (bg `couples-primary`, text `#FFFFFF`), height 56pt, full width
- Sheet padding: 32pt top, 24pt horizontal, 32pt bottom + safe area

---

## 9. Accessibility

- All card type badges: `accessibilityLabel={"{type} card"}` e.g. `"Memory card"`
- Timer: `accessibilityLabel={"Time remaining: {N} seconds"}`, `accessibilityLiveRegion="polite"` updates every 5s
- Progress bar: `accessibilityLabel={"Card {current} of {total}"}`
- Undo button: `accessibilityLabel={"Undo last card"}`, `accessibilityHint={"Returns to previous card. Available one card back only."}`
- Memory blackout screen: `accessibilityLabel={"Blackout screen — pass phone to your partner"}`
- Touch targets: All tappable elements ≥ 44×44pt
- Card text: `allowFontScaling={false}` (fixed layout integrity for game cards)

---

*Screen spec v1.0 — couples-game.md*
