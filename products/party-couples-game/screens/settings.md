# Screen Spec: Settings
**Mode:** Both (shared screen, mode-aware theming)  
**File:** `screens/settings.md`  
**Author:** Designer Agent  
**Date:** 2026-03-06  
**Status:** READY FOR IMPLEMENTATION

---

## 1. Purpose

A lightweight settings screen accessible from the Home screen. Provides audio/haptic controls, purchase management, app store actions, and legal links. Minimal — only features that are actually needed in v1.0.

---

## 2. Access Point

- **Entry:** Gear icon (⚙️) in the top-right corner of the Home screen
- **Navigation type:** Modal presentation (slides up, or pushes right — design intent is modal/overlay feel)
  - Recommended: Push navigation from home (iOS) or slide-up modal. Implement as a standard React Navigation stack push for simplicity.
  - Back button closes/returns to Home.
- **Theme:** Settings screen adopts the **last used mode's** color theme. If no mode has been used, defaults to a neutral dark shell (use `neutral-800` / `neutral-900` bg).

---

## 3. Screen Background

- **Default (no mode used):** `neutral-900` (#0C0C14)
- **Party context:** `party-bg` (#0E0E1A)
- **Couples context:** `couples-bg` (#12080F)
- **Safe area:** `SafeAreaView edges={['top','bottom']}`

---

## 4. Navigation Header

Height: 56pt.

```
 ← Back          Settings
```

**Back button (left):**
- Icon: `chevron-back` (Ionicons), 24×24pt
- Color: Mode text-secondary or `neutral-400` (#7A7A94) in neutral mode
- Touch target: 44×44pt
- Tap: Navigate back to Home screen
- 24pt left padding

**Title (center):**
- Text: `"Settings"`
- Font: `type-h3` — 22pt, SemiBold (600), Poppins
- Color: Mode text-primary or `neutral-0` (#FFFFFF) in neutral mode
- Text align: center

No right-side element in header.

---

## 5. Layout Structure

Settings are organized into **section groups**, each with a section label and a rounded container housing the rows. Standard iOS-style grouped settings layout.

```
SECTION LABEL

┌────────────────────────────────┐
│  Row Item                      │
├────────────────────────────────┤
│  Row Item                      │
└────────────────────────────────┘

SECTION LABEL

┌────────────────────────────────┐
│  Row Item                      │
└────────────────────────────────┘
```

**Screen padding:** 24pt horizontal. `ScrollView` wrapping all content.

---

## 6. Section Label Style

- Font: `type-caption` — 12pt, Regular (400), letter-spacing 0.3px, uppercase
- Color: Mode text-secondary, or `neutral-400` (#7A7A94) in neutral mode
- Margin: 8pt bottom (between label and container), 24pt top (between containers and next label)
- Horizontal: Flush with container edges (same 24pt margin)

---

## 7. Row Container Style

- bg (Party): `party-surface` (#1C1C30)
- bg (Couples): `couples-surface` (#221019)
- bg (Neutral): `neutral-800` (#1A1A2A)
- Border radius: `radius-lg` (16pt)
- Overflow: hidden (rows clip to rounded corners)
- shadow: `shadow-xs`

---

## 8. Row Item Style

Standard row height: **52pt**

**Structure (horizontal flex, items vertically centered):**
```
[ Icon ]  [ Label ]           [ Right element ]
  24pt      flex-1                varies
 8pt gap  8pt to right element
```

**Icon:**
- Size: 24×24pt
- Color: Mode primary, or `neutral-400` in neutral
- 16pt left padding, vertically centered
- Ionicons (see Section 11 for icon mappings)

**Label:**
- Font: `type-body` — 16pt, Regular (400)
- Color: Mode text-primary, or `neutral-0` (#FFFFFF) in neutral
- 12pt gap from icon
- `flex: 1` — takes available space

**Divider between rows (inside container):**
- Height: 1pt
- Color: Mode border (`couples-border` / `party-border` / `neutral-600`)
- `marginLeft: 52pt` (indented past icon column — iOS standard)
- Last row in container: NO divider

**Right element varies per row type** — see sections below.

---

## 9. Section Definitions

### Section 1 — PREFERENCES

**Row 1: Sound**

```
 🔊  Sound Effects              [Toggle]
```

- Icon: `volume-high-outline` (Ionicons), Party primary / Couples primary
- Label: `"Sound Effects"`
- Right: Toggle Switch
  - On state: `trackColor: {true: [mode-primary], false: [mode-border]}`, `thumbColor: #FFFFFF`
  - Off state: track `neutral-600`
  - Default: **ON**
  - `accessibilityLabel`: "Sound effects"
  - `accessibilityHint`: "Toggle game sound effects on or off"
- Behavior: Immediately applies. Stores value in `AsyncStorage` key `"settings.sound"`.

**Row 2: Haptics**

```
 📳  Haptic Feedback            [Toggle]
```

- Icon: `phone-portrait-outline` (Ionicons)
- Label: `"Haptic Feedback"`
- Right: Toggle Switch (same pattern as Sound)
  - Default: **ON**
  - `accessibilityLabel`: "Haptic feedback"
  - `accessibilityHint`: "Toggle vibration feedback on or off"
- Behavior: Immediately applies. Stores value in `AsyncStorage` key `"settings.haptics"`.

---

### Section 2 — GAME (mode-specific settings shown contextually)

**Row 1: Drinking Mode** — shown only when Party Mode has been used (setting persists last used mode preference)

```
 🍺  Drinking Mode              [Toggle]
```

- Icon: `beer-outline` (Ionicons)
- Label: `"Drinking Mode"`
- Sub-label: 4pt below label, same left position
  - Text: `"Swaps drink penalties with alternative challenges when off"`
  - Font: `type-caption` 12pt, Regular (400)
  - Color: Mode text-secondary / `neutral-400`
- Right: Toggle Switch
  - Default: **ON**
  - Stores value in `AsyncStorage` key `"settings.party.drinkingMode"`
- Note: Toggle affects next session only (not mid-session retroactively)

**Row 2: Turn Order** — shown only when Party Mode has been used

```
 🔄  Turn Order                 Round-robin ›
```

- Icon: `repeat-outline` (Ionicons)
- Label: `"Turn Order"`
- Right element: Value label + chevron
  - Current value: `"Round-robin"` or `"Random"`
  - Font: `type-body-sm` 14pt, Regular, text-secondary color
  - Icon: `chevron-forward` (Ionicons), 16×16pt, text-secondary
  - 8pt gap between value and chevron
- Tap: Shows an `ActionSheet` (native) with 2 options:
  - `"Round-robin"` (default)
  - `"Random"`
  - `"Cancel"`
- Stores value in `AsyncStorage` key `"settings.party.turnOrder"`

**If neither mode has been used:** Section 2 is hidden entirely (don't show an empty section).

---

### Section 3 — PURCHASES

**Row 1: Restore Purchases**

```
 ↺  Restore Purchases
```

- Icon: `refresh` (Ionicons)
- Label: `"Restore Purchases"`
- Right element: none (chevron optional — omit for cleaner look)
- Tap: Triggers native IAP restore flow
  - Loading state: Row label dims to 50%, small `ActivityIndicator` (16×16pt, mode primary color) appears right-aligned where chevron would be. Row is non-interactive during restore.
  - Success: Row shows success feedback (see Section 9.3.1)
  - Failure: Row shows error feedback (see Section 9.3.2)
- `accessibilityLabel`: "Restore previous purchases"
- `accessibilityHint`: "Use if you purchased on another device with the same account"

**Row 1 — Success feedback (inline, temporary):**
- `ActivityIndicator` replaced by `checkmark-circle` icon (Ionicons), 20×20pt, `couples-success` (#5EE0A0)
- Label changes to `"Purchase restored!"` — `type-body` 16pt, SemiBold, `couples-success` (#5EE0A0)
- Reverts to normal state after 3 seconds (fade transition, 300ms)

**Row 1 — Error feedback (inline, temporary):**
- Icon changes to `alert-circle-outline` (Ionicons), 20×20pt, `couples-error` (#FF6B8A)
- Label changes to `"No purchase found"` — `type-body` 16pt, Regular, `couples-error` (#FF6B8A)
- Sub-label appears: `"Sign in with the account used to purchase"` — `type-caption` 12pt, `neutral-400`
- Reverts to normal state after 4 seconds

**Row 2: Unlock Everything** — shown only if user is NOT yet a paid user

```
 🔓  Unlock Everything          $4.99 →
```

- Icon: `lock-open-outline` (Ionicons), mode primary color
- Label: `"Unlock Everything"`
- Right element: `"$4.99"` in mode accent color + `chevron-forward`
  - Font: `type-body` 16pt, SemiBold (600), `couples-accent` (#FFAA5C) or `party-accent` (#FFD60A)
- Tap: Opens the paywall modal (see `paywall.md`)
- `accessibilityLabel`: "Unlock the full game for $4.99"

**If user is already a paid user:** Replace Row 2 with:

```
 ✓  Full Game Unlocked
```

- Icon: `checkmark-circle` (Ionicons), `couples-success` (#5EE0A0)
- Label: `"Full Game Unlocked"` — font: `type-body` 16pt, Regular
- Color: `couples-success` (#5EE0A0)
- Non-interactive (no tap, no chevron)
- `accessibilityLabel`: "You have the full game unlocked"

---

### Section 4 — RATE & SUPPORT

**Row 1: Rate SpinUp**

```
 ⭐  Rate SpinUp
```

- Icon: `star-outline` (Ionicons)
- Label: `"Rate SpinUp"`
- Right: `chevron-forward` (Ionicons), 16×16pt, text-secondary color
- Tap: Opens native app store rating prompt using `expo-store-review` (`StoreReview.requestReview()` if available; otherwise deep-links to App Store / Play Store listing)
- `accessibilityLabel`: "Rate SpinUp on the App Store"

---

### Section 5 — LEGAL

**Row 1: Privacy Policy**

```
 🔒  Privacy Policy
```

- Icon: `shield-checkmark-outline` (Ionicons)
- Label: `"Privacy Policy"`
- Right: `chevron-forward` (Ionicons), 16×16pt, text-secondary
- Tap: Opens in-app browser (`expo-web-browser`) pointing to privacy policy URL
- `accessibilityLabel`: "View Privacy Policy"

**Row 2: Terms of Service**

```
 📄  Terms of Service
```

- Icon: `document-text-outline` (Ionicons)
- Label: `"Terms of Service"`
- Right: `chevron-forward` (Ionicons), 16×16pt, text-secondary
- Tap: Opens in-app browser pointing to terms URL
- `accessibilityLabel`: "View Terms of Service"

---

### Section 6 — VERSION INFO (no section label)

**Not a section container** — a standalone centered block at the bottom of the scroll view.

```
         SpinUp
        Version 1.0.0
```

- App name: `"SpinUp"` — `type-body-sm` 14pt, Regular, text-secondary or `neutral-400`
- Version: `"Version {major.minor.patch}"` — `type-caption` 12pt, Regular, text-secondary or `neutral-400`
  - Value pulled from `expo-application` (`Application.nativeApplicationVersion`)
- Centered horizontally
- Top margin: 32pt
- Bottom margin: 16pt (above safe area)
- No touch interaction
- `accessibilityLabel`: "SpinUp version {number}"`

---

## 10. Full Scroll Layout Order

```
  [Safe Area Top]
  [Header — 56pt]

  24pt gap

  "PREFERENCES"
  [Sound row]
  [Haptics row]

  24pt gap

  "GAME"  ← hidden if no mode used yet
  [Drinking Mode row]
  [Turn Order row]

  24pt gap

  "PURCHASES"
  [Restore Purchases row]
  [Unlock Everything row]  ← or Unlocked status row

  24pt gap

  "RATE & SUPPORT"
  [Rate SpinUp row]

  24pt gap

  "LEGAL"
  [Privacy Policy row]
  [Terms of Service row]

  32pt gap

  [Version block — centered]

  [Safe Area Bottom]
```

---

## 11. Icon Mapping Summary

| Setting | Ionicons Name |
|---------|--------------|
| Sound Effects | `volume-high-outline` |
| Haptic Feedback | `phone-portrait-outline` |
| Drinking Mode | `beer-outline` |
| Turn Order | `repeat-outline` |
| Restore Purchases | `refresh` |
| Unlock Everything | `lock-open-outline` |
| Already Unlocked | `checkmark-circle` |
| Rate SpinUp | `star-outline` |
| Privacy Policy | `shield-checkmark-outline` |
| Terms of Service | `document-text-outline` |

---

## 12. State Persistence

All settings are stored via `AsyncStorage` and loaded at app start:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `settings.sound` | boolean | `true` | Sound effects enabled |
| `settings.haptics` | boolean | `true` | Haptic feedback enabled |
| `settings.party.drinkingMode` | boolean | `true` | Drinking references in Party Mode |
| `settings.party.turnOrder` | string | `"round-robin"` | `"round-robin"` or `"random"` |
| `settings.lastMode` | string | `null` | Last mode used, for theming settings screen |

Settings are applied immediately on toggle — no "Save" button needed.

---

## 13. Accessibility

- Settings screen uses `accessibilityViewIsModal={false}` (it's a normal screen, not a modal trap)
- All toggles: `accessibilityRole="switch"` with `accessibilityState={{checked: value}}`
- Chevron rows: `accessibilityRole="button"` with `accessibilityLabel` as specified
- Non-interactive rows (version, unlocked status): `accessibilityRole="text"` or `importantForAccessibility="no"` on Android
- Section labels: `accessibilityRole="header"` for screen reader context
- Loading states (restore purchases): `accessibilityLiveRegion="polite"` on the row to announce changes
- Minimum touch targets: All rows are 52pt tall (≥ 44pt HIG requirement) ✅

---

*Screen spec v1.0 — settings.md*
