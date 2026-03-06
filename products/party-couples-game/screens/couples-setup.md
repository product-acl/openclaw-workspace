# Screen Spec: Couples Setup — Session Configuration
**File:** `screens/couples-setup.md`  
**Author:** Designer Agent | **Date:** 2026-03-06  

---

## Purpose
Configure a Couples Mode session. Select content tier (Romantic / Flirty / Spicy), session length, and optionally enter player names. The tier selector is the emotional heart of this screen — it sets expectations and creates a "choosing your adventure" moment.

This screen appears before EVERY Couples Mode session (not just first time), so returning players can change their vibe.

## Entry Points
- Tap "Couples Mode" on Home → (after tutorial overlay, first time)
- "Change Settings" from Couples Score (End) Screen
- Return from paywall (tier locked → chose to dismiss)

---

## Layout — Portrait 390×844pt

```
┌─────────────────────────────────────────────┐
│  Status Bar                                 │
│                                             │
│  ←              Couples Mode               │  ← back left, title centered
│                                             │
│  ╔═══════════════════════════════════════╗  │
│  ║        Set your vibe ✨               ║  │  ← section label
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │  🌹                                    │ │
│  │  Romantic                              │ │  ← tier tile (selected by default)
│  │  Sweet moments & real connection       │ │
│  │  [FREE]                                │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │  💋                         🔒         │ │
│  │  Flirty                                │ │  ← tier tile (locked)
│  │  Playful, mildly daring, suggestive    │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │  🔥                         🔒         │ │
│  │  Spicy                                 │ │  ← tier tile (locked)
│  │  Intimate. Adults only. 17+            │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ──────────────────────────────────────     │  ← divider
│                                             │
│  How long?                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │  Short   │ │ Medium   │ │   Long   │    │
│  │ 20 cards │ │ 35 cards │ │55 cards🔒│    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                             │
│  Your names (optional)                      │
│  ┌──────────────────┐  ┌──────────────────┐ │
│  │  [You        ]   │  │  [Partner    ]   │ │  ← name inputs
│  └──────────────────┘  └──────────────────┘ │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │            START GAME ❤️               │ │  ← primary CTA
│  └────────────────────────────────────────┘ │
│  [safe area bottom]                         │
└─────────────────────────────────────────────┘
```

---

## Components

### 1. Navigation Header
- Back button: `chevron-back` (Ionicons, 24pt, `couples-text-secondary`)
- Title: "Couples Mode" (`type-h4`, 18pt SemiBold, `couples-text-primary`)
- No right element

### 2. Section Label — "Set your vibe ✨"
- Font: `type-h3` (22pt, SemiBold, `couples-text-primary`)
- `marginTop: 24pt`, `paddingLeft: 24pt`

### 3. Tier Selection Tiles

**Layout:** Vertical stack, `gap: 12pt`, `paddingHorizontal: 24pt`  
**Tile dimensions:** Full width (screenWidth - 48pt), height: 80pt  
**Only one tier selectable at a time**  
**Default selection:** Romantic (or last used tier, persisted in AsyncStorage)

#### Romantic Tile (Free)
```
States:
  Selected:
    bg: couples-primary-subtle (#4A1028) with subtle left-border accent
    border: 1.5pt solid couples-primary (#E8517A)
    left accent bar: 4pt wide, full height, couples-primary (#E8517A)
    
  Default (not selected):
    bg: couples-surface (#221019)
    border: 1pt solid couples-border (#3A1A28)
    
  Pressed:
    scale: 0.98, opacity transition

Content layout (horizontal, space-between):
  Left group:
    ├── Emoji: 🌹 (28pt, left)
    ├── marginLeft: 16pt → Title: "Romantic" (type-h4, 18pt SemiBold, couples-text-primary)
    └── Below title: "Sweet moments & real connection" (type-body-sm, 13pt, couples-text-secondary)
    
  Right group:
    └── "FREE" badge: bg: couples-success (#5EE0A0 at 15%), text: couples-success (#5EE0A0),
                       border: 1pt couples-success, padding: 4pt x 8pt, radius-xs
                       font: type-badge (11pt, Bold, UPPERCASE)
```

#### Flirty Tile (Locked)
```
States:
  Locked (default):
    bg: couples-surface (#221019)
    border: 1pt solid couples-border (#3A1A28)
    opacity: 1 (visible, but with lock indicator)
    
  Locked + Pressed:
    Tap opens paywall modal immediately
    
  Unlocked + Selected:
    Same as Romantic selected, with tier-flirty accent

Content layout:
  Left group:
    ├── Emoji: 💋 (28pt)
    ├── Title: "Flirty" (type-h4, 18pt SemiBold, couples-text-primary)
    └── Sub: "Playful, mildly daring, suggestive" (type-body-sm, 13pt, couples-text-secondary)
    
  Right group:
    └── [Locked state] Lock icon: lock-closed (Ionicons, 20pt, couples-accent #FFAA5C)
        [Unlocked state] Checkmark: checkmark-circle (Ionicons, 20pt, couples-success)
```

#### Spicy Tile (Locked)
```
Same structure as Flirty tile.
Emoji: 🔥
Title: "Spicy"
Sub: "Intimate. Adults only. 17+"
Right: Lock icon when locked; checkmark when unlocked

Special note: If Spicy content is deferred (per PRD Open Question Q5 resolution 
"Coming Soon"), render tile with:
  opacity: 0.5
  Sub text changed to: "Coming soon"
  Lock icon still shown
  Tap shows: Toast "Spicy content is coming soon! Stay tuned." (not paywall)
```

### 4. Session Length Selector

Same pattern as Party Setup, with couples mode colors:

```
Selected tile:
  bg: couples-primary-subtle (#4A1028)
  border: 1.5pt couples-primary (#E8517A)

Default tile:
  bg: couples-surface (#221019)
  border: 1pt couples-border (#3A1A28)
  
Long tile: Lock icon in couples-accent (#FFAA5C)
```

Default: Medium (35 cards)

### 5. Player Names (Optional)

**Label:** "Your names (optional)" (`type-body-sm`, 13pt, `couples-text-secondary`, `paddingLeft: 24pt`)

**Two inputs side-by-side:**
```
Width: (screenWidth - 48 - 12) / 2 ≈ 153pt per input
Height: 52pt

Left input:
  placeholder: "You" (couples-text-disabled #5A3A48)
  default value: "You" (cleared on first focus)
  
Right input:
  placeholder: "Partner" (couples-text-disabled)
  default value: "Partner" (cleared on first focus)

Field styling:
  bg: couples-surface (#221019)
  border: 1pt couples-border (default), 2pt couples-primary (focused)
  radius: radius-xl (24pt) — roundness matching couples theme
  text: couples-text-primary (#FFF0F5)
  padding: 16pt horizontal
  textAlign: 'center' (centered text feels more intimate)
  maxLength: 16 chars
```

**State persistence:** Names persist to next session (AsyncStorage). Pre-filled on return visits.

### 6. Start Game CTA

```
Text: "START GAME ❤️"
Font: type-button-lg (18pt, SemiBold, #FFFFFF, letter-spacing: 0.3px)
bg: couples-primary (#E8517A)
Width: screenWidth - 48pt
Height: 56pt
Border-radius: radius-xl (24pt) — rounded pill for couples mode
Shadow: shadow-sm, shadowColor: couples-primary, shadowOpacity: 0.4

States:
  Default:  bg: #E8517A
  Pressed:  bg: #D03D65, scale: 0.97
  
marginHorizontal: 24pt
marginBottom: safeAreaBottom + 16pt
```

---

## Colors Used

| Element | Token | Hex |
|---------|-------|-----|
| Background | `couples-bg` | `#12080F` |
| Tile background (default) | `couples-surface` | `#221019` |
| Tile bg (selected) | `couples-primary-subtle` | `#4A1028` |
| Tile border (default) | `couples-border` | `#3A1A28` |
| Tile border (selected) | `couples-primary` | `#E8517A` |
| Tier title | `couples-text-primary` | `#FFF0F5` |
| Tier subtitle | `couples-text-secondary` | `#C8A0B4` |
| Lock icon | `couples-accent` | `#FFAA5C` |
| Free badge | `couples-success` | `#5EE0A0` |
| Input border (focused) | `couples-primary` | `#E8517A` |
| Input text | `couples-text-primary` | `#FFF0F5` |
| Input placeholder | `couples-text-disabled` | `#5A3A48` |
| CTA button | `couples-primary` | `#E8517A` |
| Section labels | `couples-text-primary` | `#FFF0F5` |
| Divider | `couples-border` | `#3A1A28` |

---

## Typography Used

| Element | Token | Specs |
|---------|-------|-------|
| Section label | `type-h3` | 22pt, SemiBold |
| Tier title | `type-h4` | 18pt, SemiBold |
| Tier subtitle | `type-body-sm` | 13pt, Regular |
| Session tile label | `type-body` | 16pt, Medium |
| Session tile sub | `type-caption` | 12pt, Regular |
| Names label | `type-body-sm` | 13pt, Regular |
| Name input | `type-body` | 16pt, Regular |
| CTA button | `type-button-lg` | 18pt, SemiBold |

---

## Navigation / Transitions

| Action | Transition |
|--------|-----------|
| Back button | Slide right (pop to Home) |
| Tap locked tier | Slide up (paywall modal) |
| Paywall dismiss | Slide down, tier stays on Romantic |
| Paywall purchase | Slide down, tapped tier becomes selected |
| Start Game | Slide left (push to Couples Game) |
| Tap Long session | Slide up (paywall modal) |

---

## Edge Cases

### Spicy tier deferred (Coming Soon)
- Tile rendered at 50% opacity
- Sub text: "Coming soon"
- Tap shows toast: not paywall

### Already purchased
- Lock icons absent on Flirty, Spicy tiles
- FREE badge on Romantic remains (still free, just clarifying)
- Long session tile has no lock

### First visit (no saved preferences)
- Romantic tier selected
- Medium session selected
- Player names: "You" / "Partner" pre-filled

### Return visit (saved preferences)
- Last used tier pre-selected
- Last used session length pre-selected
- Last used player names pre-filled

### Tier change after purchase
- If user bought unlock mid-session and returns to setup:
  Previously locked tiers now selectable immediately

---

*Screen spec last updated 2026-03-06*
