# Screen Spec: Home — Mode Selection
**File:** `screens/home.md`  
**Author:** Designer Agent | **Date:** 2026-03-06  

---

## Purpose
The Home Screen is the app's front door. It serves one job: get the user to tap a mode and start playing in under 5 seconds. No account creation, no friction.

This screen also establishes tone — the contrast between the two mode tiles hints at the dual personality of the app.

## Entry Points
- App launch (splash → home)
- "Home" CTA from any end-game screen
- "Change Mode" CTA from any session end screen

---

## Layout — Portrait 390×844pt

```
┌─────────────────────────────────────────────┐
│  Status Bar (transparent, light content)    │
│                                             │
│                             ⚙️  [settings]  │  ← top-right, 44×44pt tap target
│                                             │
│  ████████████████████████████████           │
│          S P I N U P                        │  ← Wordmark, centered
│  ████████████████████████████████           │
│                                             │
│         "Pick your vibe"                    │  ← subhead, centered
│                                             │
│  ┌──────────────┐  ┌──────────────┐         │
│  │              │  │              │         │
│  │  🍺           │  │  💑          │         │
│  │              │  │              │         │
│  │  Party       │  │  Couples     │         │
│  │  Mode        │  │  Mode        │         │
│  │              │  │              │         │
│  │  Groups of   │  │  Just the    │         │
│  │  3–8 friends │  │  two of you  │         │
│  │              │  │              │         │
│  └──────────────┘  └──────────────┘         │
│                                             │
│                                             │
│  [Shared safe area bottom padding]          │
└─────────────────────────────────────────────┘
```

---

## Components

### 1. Status Bar
- `StatusBar barStyle="light-content" backgroundColor="transparent"`
- Blends into background

### 2. Settings Icon Button
- Position: absolute top-right, `top: safeAreaTop + 16pt`, `right: 24pt`
- Icon: `Ionicons name="settings-outline"` size=24, color=`neutral-400`
- Touch target: 44×44pt
- State: default | pressed (opacity 0.7)
- `accessibilityLabel="Settings"`

### 3. App Wordmark — "SPINUP"
- Font: `type-display` (48pt, Poppins ExtraBold)
- Color: `#FFFFFF`
- Tracking: -0.5px
- Position: centered horizontally, `marginTop: 80pt` from status bar
- Sub-detail: A subtle gradient shimmer version for future — v1 use solid white
- `accessibilityRole="header"`

### 4. Tagline
- Text: `"Pick your vibe"`
- Font: `type-body` (16pt, Poppins Regular)
- Color: `neutral-400` (#7A7A94)
- Position: centered, `marginTop: 8pt` below wordmark

### 5. Mode Selection Tiles (the core interaction)

**Tile dimensions:** Each tile = (screenWidth - 24 - 24 - 16) / 2 ≈ 163pt wide  
**Tile height:** 220pt  
**Gap between tiles:** 16pt  
**Margin from edges:** 24pt each side  
**Position:** Vertically centered between tagline and bottom of screen

#### Party Mode Tile
```
Background gradient: 
  Linear, 145deg
  From: #1C1C30 (party-surface)
  To:   #0E0E1A (party-bg)

Border: 1.5pt solid #2E2E4A (party-border)
Border-radius: 16pt (radius-lg)
Shadow: shadow-md, shadowColor: #7C3AFF, shadowOpacity: 0.25

Content (top-to-bottom, centered):
  ├── Emoji: 🍺 (48pt font size, marginTop: 32pt)
  ├── Title: "Party Mode" (type-h3, 22pt SemiBold, #FFFFFF, marginTop: 12pt)
  ├── Subtitle: "Groups of 3–8" (type-body-sm, 14pt, party-text-secondary #A0A0C0, marginTop: 8pt)
  └── Flavor: "Dares. Truths. Chaos." (type-caption, 12pt, party-primary #7C3AFF, marginTop: 8pt)
```

**Party Tile States:**
```
Default:  As above
Pressed:  scale: 0.96, border: 1.5pt #7C3AFF, shadow-sm (150ms ease)
```

#### Couples Mode Tile
```
Background gradient:
  Linear, 145deg
  From: #221019 (couples-surface)
  To:   #12080F (couples-bg)

Border: 1.5pt solid #3A1A28 (couples-border)
Border-radius: 24pt (radius-xl — softer for couples)
Shadow: shadow-md, shadowColor: #E8517A, shadowOpacity: 0.2

Content (top-to-bottom, centered):
  ├── Emoji: 💑 (48pt font size, marginTop: 32pt)
  ├── Title: "Couples Mode" (type-h3, 22pt SemiBold, #FFF0F5, marginTop: 12pt)
  ├── Subtitle: "Just the two of you" (type-body-sm, 14pt, couples-text-secondary #C8A0B4, marginTop: 8pt)
  └── Flavor: "Play. Score. Connect." (type-caption, 12pt, couples-primary #E8517A, marginTop: 8pt)
```

**Couples Tile States:**
```
Default:  As above
Pressed:  scale: 0.96, border: 1.5pt #E8517A, shadow-sm (150ms ease)
```

---

## Colors Used

| Element | Token | Hex |
|---------|-------|-----|
| Screen background | `neutral-900` | `#0C0C14` |
| Settings icon | `neutral-400` | `#7A7A94` |
| Wordmark | `neutral-0` | `#FFFFFF` |
| Tagline | `neutral-400` | `#7A7A94` |
| Party tile bg start | `party-surface` | `#1C1C30` |
| Party tile bg end | `party-bg` | `#0E0E1A` |
| Party tile border (default) | `party-border` | `#2E2E4A` |
| Party tile title | `neutral-0` | `#FFFFFF` |
| Party tile subtitle | `party-text-secondary` | `#A0A0C0` |
| Party tile flavor | `party-primary` | `#7C3AFF` |
| Couples tile bg start | `couples-surface` | `#221019` |
| Couples tile bg end | `couples-bg` | `#12080F` |
| Couples tile border (default) | `couples-border` | `#3A1A28` |
| Couples tile title | `couples-text-primary` | `#FFF0F5` |
| Couples tile subtitle | `couples-text-secondary` | `#C8A0B4` |
| Couples tile flavor | `couples-primary` | `#E8517A` |

---

## Typography Used

| Element | Token | Specs |
|---------|-------|-------|
| App name | `type-display` | 48pt, ExtraBold, white |
| Tagline | `type-body` | 16pt, Regular, neutral-400 |
| Tile title | `type-h3` | 22pt, SemiBold |
| Tile subtitle | `type-body-sm` | 14pt, Regular |
| Tile flavor | `type-caption` | 12pt, Regular |

---

## Navigation / Transitions

| Action | Transition |
|--------|-----------|
| Tap Party Mode tile | Slide left (push to Party Setup or Tutorial) |
| Tap Couples Mode tile | Slide left (push to Couples Setup or Tutorial) |
| Tap Settings gear | Slide up from bottom (modal presentation) |
| Return from end game | Fade in (not a slide — avoids direction confusion) |

---

## Edge Cases

### Empty/First State
- This IS the first state. No empty case needed — always shows both tiles.

### Already Purchased
- No visual change to home screen. The tiles remain the same.
- Locked indicators don't appear here — they appear inside each mode's flow.

### Returning User
- Session state NOT restored (per PRD v1.0). Home screen always shows both tiles fresh.
- If user was in a session that backgrounded >30 min ago, home screen is shown with no notification.

### Portrait Only
- In v1.0, portrait only. If user rotates to landscape, app stays in portrait (lock orientation).

### Accessibility
- Both mode tiles: `accessibilityRole="button"`, `accessibilityLabel="Party Mode - groups of 3 to 8 friends"` and `accessibilityLabel="Couples Mode - just the two of you"`

---

## Open Questions for Coder
- **None.** Home screen is fully defined. No conditional logic beyond tutorial flag check.

---

*Screen spec last updated 2026-03-06*
