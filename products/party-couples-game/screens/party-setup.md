# Screen Spec: Party Setup — Player Name Entry
**File:** `screens/party-setup.md`  
**Author:** Designer Agent | **Date:** 2026-03-06  

---

## Purpose
Collect player names (optional), set session length, and optionally toggle drinking mode. Designed to be completable by a slightly buzzed user in under 60 seconds. Friction is intentionally low — all fields are optional.

## Entry Points
- Tap "Party Mode" on Home → (after tutorial overlay, first time)
- "Play Again" from End Game Screen

---

## Layout — Portrait 390×844pt

```
┌─────────────────────────────────────────────┐
│  Status Bar                                 │
│                                             │
│  ← [back]      Party Setup                 │  ← back button left, title centered
│                                             │
│  "Who's playing?"                           │  ← H2, left-aligned
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ 👤  [Player 1 name input         ]    │ │  ← text field
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ 👤  [Player 2 name input         ]    │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ 👤  [Player 3 name input         ]    │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ 👤  [Player 4 name input         ]    │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  [+ Add Player]              [− Remove]     │  ← add/remove row
│                                             │
│  ──────────────────────────────────────     │  ← divider
│                                             │
│  How long?                                  │  ← section label
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │  Short   │ │ Medium   │ │   Long   │    │  ← session length selector
│  │ 15 cards │ │ 30 cards │ │50 cards🔒│    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                             │
│  🍺 Drinking mode          [   Toggle   ]  │  ← toggle row
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │              LET'S GO!                 │ │  ← primary CTA
│  └────────────────────────────────────────┘ │
│  [safe area bottom]                         │
└─────────────────────────────────────────────┘
```

---

## Components

### 1. Navigation Header
- Back button: `←` (Ionicons `chevron-back`, 24pt, `party-text-secondary`)
- Title: "Party Setup" (`type-h4`, 18pt SemiBold, `party-text-primary`)
- Position: `paddingTop: safeAreaTop + 8pt`, height: 56pt
- No right-side element

### 2. Section Title
- Text: "Who's playing?"
- Font: `type-h2` (28pt, Bold, `party-text-primary`)
- `marginTop: 24pt`, `marginLeft: 24pt`

### 3. Player Name Input Fields

**Dimensions:** Width = screenWidth - 48pt (24pt margin each side), Height = 56pt  
**Stack:** `gap: 12pt` between fields  
**Scroll:** Entire screen is a `ScrollView` — keyboard pushes content up

```
Layout per field:
  ├── Left icon: 👤 (emoji, 18pt, marginLeft: 16pt)
  ├── TextInput: 
  │     placeholder: "Player 1", "Player 2", etc.
  │     placeholderTextColor: party-text-disabled (#4A4A6A)
  │     font: type-body (16pt, Regular)
  │     textColor: party-text-primary (#FFFFFF)
  │     maxLength: 16 characters
  │     returnKeyType: "next" (focuses next field)
  │     autoCapitalize: "words"
  └── Right element: [only on empty fields, shows − remove button]
```

**Field states:**
```
Default (empty):  bg: #1C1C30, border: 1pt #2E2E4A, radius: 8pt
Focused:          bg: #1C1C30, border: 2pt #7C3AFF, glow: shadow-xs w/ party-primary
Filled:           bg: #1C1C30, border: 1pt #7C3AFF at 50%, text: #FFFFFF
```

**Initial render:** 4 fields shown by default.

### 4. Add / Remove Player Controls

**Row layout:** Horizontal, space-between, `marginTop: 8pt`, `paddingHorizontal: 24pt`

**Add Player button:**
- Text: `"+ Add Player"` (`type-button-sm`, 14pt Medium, `party-primary` #7C3AFF)
- Icon: `add-circle-outline` left of text, 20pt
- Disabled when player count = 8 (opacity: 0.35, `accessibilityState: {disabled: true}`)
- Touch target: 44pt height minimum

**Remove button:**
- Text: `"− Remove"` (`type-button-sm`, 14pt Medium, `party-error` #FF4D6D)
- Icon: `remove-circle-outline` left of text, 20pt  
- Disabled when player count = 2 (opacity: 0.35)
- Removes the LAST empty field first; if all filled, removes last field and its content

### 5. Divider
- Height: 1pt
- Color: `party-border` (#2E2E4A)
- `marginVertical: 24pt`, `marginHorizontal: 24pt`

### 6. Session Length Selector

**Label:** "How long?" (`type-h4`, 18pt SemiBold, `party-text-primary`, `paddingLeft: 24pt`)

**Tiles:** 3 tiles in a row, equal width, `gap: 8pt`, `paddingHorizontal: 24pt`  
**Tile dimensions:** (screenWidth - 48 - 16) / 3 ≈ 108pt wide × 72pt tall

```
Short Tile:
  bg: party-surface #1C1C30 (default)  OR  party-primary-subtle #2A1066 (selected)
  border: 1.5pt party-border (default)  OR  1.5pt party-primary (selected)
  radius: 12pt
  Text line 1: "Short" (type-body, 16pt, Medium, white)
  Text line 2: "15 cards" (type-caption, 12pt, party-text-secondary)
  
Medium Tile: same structure, "30 cards"
  Default selected state (Medium pre-selected on screen load)

Long Tile:
  Same structure + lock icon overlay
  Text line 1: "Long" + 🔒 icon (18pt Ionicons lock-closed, party-accent)
  Text line 2: "50 cards" (type-caption, party-text-secondary)
  Tapping triggers paywall modal (Flow 6c)
  After unlock: lock icon hidden, behaves like Short/Medium tile
```

**Only one tile active at a time.** Default: Medium.

### 7. Drinking Mode Toggle

**Row layout:** Horizontal, space-between, `paddingHorizontal: 24pt`, `paddingVertical: 8pt`

Left side:
- Emoji: 🍺 (20pt), then text: "Drinking mode" (`type-body`, 16pt Regular, `party-text-primary`)
- Sub-label below: "Turn off for non-drinking groups" (`type-body-sm`, 13pt, `party-text-secondary`)

Right side:
- React Native Switch component
- `trackColor: { false: party-border, true: party-primary }`
- `thumbColor: #FFFFFF`
- Default state: ON (true)

### 8. Let's Go Button (Primary CTA)

- Width: screenWidth - 48pt
- Height: 56pt
- Background: `party-primary` (#7C3AFF)
- Text: "LET'S GO!" (`type-button-lg`, 18pt SemiBold, `#FFFFFF`, letter-spacing: 0.3px)
- Border-radius: `radius-md` (12pt)
- Shadow: `shadow-sm`
- `marginHorizontal: 24pt`
- Always enabled (tappable even with 0 names entered — auto-fills on tap)

**States:**
```
Default:  bg: #7C3AFF
Pressed:  bg: #6B28EE, scale: 0.97
```

**On tap behavior:**
1. Any empty text fields auto-fill with "Player 1", "Player 2", etc.
2. Session data initialized
3. Navigation: slide left → Party Game Screen (first card)

---

## Colors Used

| Element | Token | Hex |
|---------|-------|-----|
| Background | `party-bg` | `#0E0E1A` |
| Input background | `party-surface` | `#1C1C30` |
| Input border (default) | `party-border` | `#2E2E4A` |
| Input border (focused) | `party-primary` | `#7C3AFF` |
| Input placeholder | `party-text-disabled` | `#4A4A6A` |
| Input text | `party-text-primary` | `#FFFFFF` |
| Section title | `party-text-primary` | `#FFFFFF` |
| Subtitle/label | `party-text-secondary` | `#A0A0C0` |
| Add button | `party-primary` | `#7C3AFF` |
| Remove button | `party-error` | `#FF4D6D` |
| Tile selected bg | `party-primary-subtle` | `#2A1066` |
| Tile selected border | `party-primary` | `#7C3AFF` |
| Lock icon | `party-accent` | `#FFD60A` |
| Toggle on | `party-primary` | `#7C3AFF` |
| CTA button | `party-primary` | `#7C3AFF` |
| Divider | `party-border` | `#2E2E4A` |

---

## Typography Used

| Element | Token | Specs |
|---------|-------|-------|
| Screen title | `type-h2` | 28pt, Bold, white |
| Input text | `type-body` | 16pt, Regular |
| Input placeholder | `type-body` | 16pt, Regular, low-contrast |
| Section label | `type-h4` | 18pt, SemiBold |
| Session tile label | `type-body` | 16pt, Medium |
| Session tile sub | `type-caption` | 12pt, Regular |
| Drinking label | `type-body` | 16pt, Regular |
| Drinking sub | `type-body-sm` | 13pt, Regular |
| CTA button | `type-button-lg` | 18pt, SemiBold, UPPERCASE |
| Add/Remove text | `type-button-sm` | 14pt, Medium |

---

## Navigation / Transitions

| Action | Transition |
|--------|-----------|
| Back button | Slide right (pop to Home) |
| Let's Go → game | Slide left (push to Party Game) |
| Tap Long session | Slide up (paywall modal) |
| Paywall dismiss | Slide down (modal closes, Long deselects) |
| Paywall purchase | Slide down (modal closes, Long now active) |

---

## Edge Cases

### Keyboard Handling
- Screen wrapped in `KeyboardAvoidingView behavior="padding"`
- When keyboard visible, scroll to keep active input field visible
- "Done" / "Next" on keyboard: advance to next field, or dismiss on last field

### Maximum Players (8)
- Add Player button: `opacity: 0.35`, `pointerEvents: 'none'`
- Small tooltip on press (if user tries): "Maximum 8 players"

### Minimum Players (2)
- Remove button: `opacity: 0.35`, disabled state

### Auto-fill names
- On "Let's Go" tap: empty fields assigned names: "Player 1", "Player 2", etc. (not "P1", not "Anon")
- If ALL 4 default slots are empty and not customized, fills as "Player 1" through "Player 4"

### Long session locked (before purchase)
- Long tile shows lock icon
- On tap: paywall modal appears
- After purchase: Long tile becomes selectable, lock icon disappears globally

### Play Again flow
- Comes from End Game Screen
- Previous player names PRE-FILLED in inputs (good UX for repeat play)
- Session length resets to Medium
- Drinking mode retains previous setting

---

*Screen spec last updated 2026-03-06*
