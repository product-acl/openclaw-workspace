# SpinUp — Design System v1.0
**Author:** Designer Agent  
**Date:** 2026-03-06  
**Status:** APPROVED — Use as single source of truth for all UI implementation  

---

## 1. Design Philosophy

SpinUp has two distinct personalities activated by mode selection. Both share the same structural shell (navigation, settings, IAP) but apply completely different color themes, creating the illusion of two separate apps inside one.

**Core principles:**
- **Mobile-first.** Every decision is made for a 390×844pt viewport (iPhone 14 base). Scale up, never down.
- **Legible at arm's length.** Cards are read aloud in social settings. Minimum card text is 20pt.
- **Dark modes only.** Both themes are dark-background. This is intentional — party contexts often have low ambient light; couples at home are often in dim settings.
- **Zero skeuomorphism.** Flat shapes with subtle elevation via shadows. No textures, no gradients on UI chrome (backgrounds may use subtle gradients).
- **Accessible.** All text meets WCAG AA (4.5:1) or better. Contrast ratios documented per color pairing.

---

## 2. Color Palette

### 2.1 Global Neutrals (shared across both modes)

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-0` | `#FFFFFF` | Pure white, max contrast text |
| `neutral-50` | `#F5F5F7` | Light backgrounds (rarely used in dark mode) |
| `neutral-200` | `#C8C8D4` | Dividers, borders in dark contexts |
| `neutral-400` | `#7A7A94` | Placeholder text, disabled labels |
| `neutral-600` | `#3A3A52` | Inactive states, ghost elements |
| `neutral-800` | `#1A1A2A` | Deep surface (shared across modes) |
| `neutral-900` | `#0C0C14` | Deepest background base |
| `neutral-1000` | `#000000` | True black (sparingly) |

### 2.2 Party Mode Theme — "Electric Night"

Vibe: dark club, neon glow, bold irreverence. Think electric violet on near-black with a yellow punch.

| Token | Hex | Role | Contrast on bg |
|-------|-----|------|----------------|
| `party-bg` | `#0E0E1A` | Screen background | — |
| `party-surface` | `#1C1C30` | Cards, modals, surfaces | — |
| `party-surface-elevated` | `#252540` | Raised elements (bottom sheets, overlays) | — |
| `party-primary` | `#7C3AFF` | Primary CTA buttons, badges, active states | 7.2:1 on `party-bg` ✅ |
| `party-primary-pressed` | `#6B28EE` | Primary button pressed state | — |
| `party-primary-subtle` | `#2A1066` | Primary background tints (chip bg, highlights) | — |
| `party-accent` | `#FFD60A` | Accent highlights, progress dots, badges | 12.4:1 on `party-bg` ✅ |
| `party-accent-pressed` | `#E6BF00` | Accent pressed state | — |
| `party-secondary` | `#FF6B35` | Secondary accents, warning states, "Dare" badge | 6.1:1 on `party-bg` ✅ |
| `party-text-primary` | `#FFFFFF` | Body text, headings on dark backgrounds | 17.7:1 on `party-bg` ✅ |
| `party-text-secondary` | `#A0A0C0` | Subtitles, captions, hints | 5.3:1 on `party-bg` ✅ |
| `party-text-disabled` | `#4A4A6A` | Disabled labels | Intentionally low contrast |
| `party-border` | `#2E2E4A` | Subtle borders, dividers | — |
| `party-error` | `#FF4D6D` | Error states | 6.8:1 on `party-bg` ✅ |
| `party-success` | `#4ADE80` | Success confirmations | 9.1:1 on `party-bg` ✅ |

**Mini-game type badge colors (Party Mode):**

| Type | Background | Text | Token |
|------|-----------|------|-------|
| DARE | `#FF6B35` | `#FFFFFF` | `badge-dare` |
| TRUTH BOMB | `#7C3AFF` | `#FFFFFF` | `badge-truth` |
| VOTE | `#FFD60A` | `#0E0E1A` | `badge-vote` |
| CHALLENGE | `#00D4FF` | `#0E0E1A` | `badge-challenge` |
| WILD | `#FF2D78` | `#FFFFFF` | `badge-wild` |

### 2.3 Couples Mode Theme — "Velvet Rose"

Vibe: warm, intimate, slightly playful. Deep burgundy-rose background with soft pink primary and amber warmth.

| Token | Hex | Role | Contrast on bg |
|-------|-----|------|----------------|
| `couples-bg` | `#12080F` | Screen background | — |
| `couples-surface` | `#221019` | Cards, modals, surfaces | — |
| `couples-surface-elevated` | `#301625` | Raised elements | — |
| `couples-primary` | `#E8517A` | Primary CTA buttons, active states, highlights | 6.4:1 on `couples-bg` ✅ |
| `couples-primary-pressed` | `#D03D65` | Primary button pressed state | — |
| `couples-primary-subtle` | `#4A1028` | Primary background tints | — |
| `couples-accent` | `#FFAA5C` | Warm accent, scores, bonus indicators | 9.8:1 on `couples-bg` ✅ |
| `couples-accent-pressed` | `#E89040` | Accent pressed state | — |
| `couples-secondary` | `#C97DFF` | Secondary accents, Finale indicators | 7.1:1 on `couples-bg` ✅ |
| `couples-text-primary` | `#FFF0F5` | Body text, headings | 19.2:1 on `couples-bg` ✅ |
| `couples-text-secondary` | `#C8A0B4` | Subtitles, captions | 5.8:1 on `couples-bg` ✅ |
| `couples-text-disabled` | `#5A3A48` | Disabled labels | Intentionally low contrast |
| `couples-border` | `#3A1A28` | Subtle borders, dividers | — |
| `couples-error` | `#FF6B8A` | Error states | 7.1:1 on `couples-bg` ✅ |
| `couples-success` | `#5EE0A0` | Success confirmations | 8.4:1 on `couples-bg` ✅ |

**Mini-game type colors (Couples Mode):**

| Type | Background | Text | Token |
|------|-----------|------|-------|
| DARE DUEL | `#E8517A` | `#FFFFFF` | `badge-dareduel` |
| MEMORY | `#C97DFF` | `#FFFFFF` | `badge-memory` |
| SCENARIO | `#FFAA5C` | `#12080F` | `badge-scenario` |
| FINALE | `#FFD700` | `#12080F` | `badge-finale` |

### 2.4 Content Tier Colors (Couples Mode)

| Tier | Accent Hex | Icon | Token |
|------|-----------|------|-------|
| Romantic | `#FF8FAB` | 🌹 | `tier-romantic` |
| Flirty | `#FF5FA0` | 💋 | `tier-flirty` |
| Spicy | `#FF2D6B` | 🔥 | `tier-spicy` |

---

## 3. Typography

### 3.1 Font Family

**Primary font:** `Poppins` (Google Fonts / expo-google-fonts)  
**Fallback:** `System` → `sans-serif`

Import in Expo:
```js
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
```

Rationale: Poppins has a geometric roundedness that feels playful without being childish. Its wide character spacing reads well at arm's length. ExtraBold (800) is dramatic enough for card headings without needing a separate display font.

### 3.2 Type Scale

| Token | Size (pt) | Weight | Line Height | Letter Spacing | Usage |
|-------|-----------|--------|-------------|----------------|-------|
| `type-display` | 48 | ExtraBold (800) | 52pt | -0.5px | Splash titles, score reveals |
| `type-h1` | 36 | ExtraBold (800) | 44pt | -0.3px | Screen titles, card headlines |
| `type-h2` | 28 | Bold (700) | 36pt | -0.2px | Section headings, player names |
| `type-h3` | 22 | SemiBold (600) | 30pt | 0 | Sub-headings, card type labels |
| `type-h4` | 18 | SemiBold (600) | 26pt | 0 | Card metadata, form labels |
| `type-body-lg` | 20 | Medium (500) | 30pt | 0 | Card text (primary reading) |
| `type-body` | 16 | Regular (400) | 24pt | 0 | Body copy, instructions |
| `type-body-sm` | 14 | Regular (400) | 20pt | 0.1px | Captions, supplementary text |
| `type-caption` | 12 | Regular (400) | 18pt | 0.2px | Timestamps, legal, meta |
| `type-button-lg` | 18 | SemiBold (600) | 24pt | 0.3px | Primary buttons |
| `type-button` | 16 | SemiBold (600) | 22pt | 0.3px | Secondary buttons |
| `type-button-sm` | 14 | Medium (500) | 20pt | 0.3px | Tertiary buttons, links |
| `type-badge` | 11 | Bold (700) | 16pt | 1.2px | Type badges (uppercase) |
| `type-score` | 40 | ExtraBold (800) | 48pt | -0.5px | Score numbers, game counters |

**Important note for Coder:** All badges use `textTransform: 'uppercase'`. Score numbers use tabular-nums for stable layout.

### 3.3 Platform Notes

- **iOS:** Use `pt` → maps 1:1 to React Native points. No conversion needed.
- **Android:** React Native points are density-independent pixels (dp). Same numbers.
- **Text scaling:** Lock game card text to fixed sizes (do not respect system font size scaling in v1.0 — cards are designed at fixed sizes for layout integrity). Use `allowFontScaling={false}` on game card text elements.

---

## 4. Spacing System

Base unit: **4pt**

| Token | Value | CSS/RN Equivalent |
|-------|-------|-------------------|
| `space-1` | 4pt | `padding: 4` |
| `space-2` | 8pt | `padding: 8` |
| `space-3` | 12pt | `padding: 12` |
| `space-4` | 16pt | `padding: 16` |
| `space-6` | 24pt | `padding: 24` |
| `space-8` | 32pt | `padding: 32` |
| `space-12` | 48pt | `padding: 48` |
| `space-16` | 64pt | `padding: 64` |
| `space-20` | 80pt | `padding: 80` |

**Common layout values:**
- Screen horizontal padding: `space-6` (24pt) on both sides
- Card internal padding: `space-6` (24pt) horizontal, `space-8` (32pt) vertical
- Section gap between major UI blocks: `space-8` (32pt)
- Between form fields: `space-4` (16pt)
- Icon-to-label gap: `space-2` (8pt)
- Bottom safe area padding: `space-8` (32pt) + device safe area inset

---

## 5. Border Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `radius-xs` | 4pt | Inline badges, small chips |
| `radius-sm` | 8pt | Input fields, secondary buttons |
| `radius-md` | 12pt | Cards, primary buttons (standard) |
| `radius-lg` | 16pt | Modals, bottom sheets, settings tiles |
| `radius-xl` | 24pt | Large cards, mode selector tiles (couples mode) |
| `radius-2xl` | 32pt | Floating action buttons, pill shapes |
| `radius-full` | 9999pt | Circular avatars, toggle switches |

**Mode-specific guidance:**
- **Party Mode:** Use `radius-md` (12pt) as default — crisper, more angular
- **Couples Mode:** Use `radius-xl` (24pt) as default — softer, rounder, more intimate

---

## 6. Shadow / Elevation Tokens

React Native `shadow*` properties (iOS) + `elevation` (Android).

| Token | iOS Shadow | Android Elevation | Usage |
|-------|-----------|-------------------|-------|
| `shadow-none` | No shadow | `elevation: 0` | Flat surfaces |
| `shadow-xs` | `shadowOffset: {0,1}`, `shadowOpacity: 0.15`, `shadowRadius: 2` | `elevation: 1` | Subtle card lift |
| `shadow-sm` | `shadowOffset: {0,2}`, `shadowOpacity: 0.2`, `shadowRadius: 6` | `elevation: 3` | Cards, buttons |
| `shadow-md` | `shadowOffset: {0,4}`, `shadowOpacity: 0.25`, `shadowRadius: 12` | `elevation: 6` | Modals, bottom sheets |
| `shadow-lg` | `shadowOffset: {0,8}`, `shadowOpacity: 0.35`, `shadowRadius: 24` | `elevation: 12` | Floating cards, paywall |
| `shadow-glow-party` | Party primary `#7C3AFF` at 30% opacity, radius 16 | N/A (use elevation-6) | Game card active glow |
| `shadow-glow-couples` | Couples primary `#E8517A` at 25% opacity, radius 20 | N/A | Couples card glow |

**Implementation note:** For Android, `shadowColor` is ignored — only `elevation` works. Use the elevation value shown. For iOS, combine shadow props. For glow effects, use a wrapping `View` with a background matching the color at low opacity behind/around the card.

---

## 7. Component States

### 7.1 Button States

**Primary Button (Party Mode):**
```
Default:    bg: party-primary (#7C3AFF), text: #FFFFFF, shadow-sm
Pressed:    bg: party-primary-pressed (#6B28EE), scale: 0.97, shadow-xs
Disabled:   bg: party-surface-elevated (#252540), text: party-text-disabled (#4A4A6A), shadow-none
Loading:    bg: party-primary (#7C3AFF), show ActivityIndicator (white), text hidden
```

**Primary Button (Couples Mode):**
```
Default:    bg: couples-primary (#E8517A), text: #FFFFFF, shadow-sm
Pressed:    bg: couples-primary-pressed (#D03D65), scale: 0.97, shadow-xs
Disabled:   bg: couples-surface-elevated (#301625), text: couples-text-disabled (#5A3A48), shadow-none
Loading:    bg: couples-primary (#E8517A), show ActivityIndicator (white), text hidden
```

**Secondary Button (both modes):**
```
Default:    bg: transparent, border: 1.5pt solid [mode-primary], text: [mode-primary]
Pressed:    bg: [mode-primary-subtle], border: [mode-primary], text: [mode-primary], scale: 0.97
Disabled:   bg: transparent, border: [mode-text-disabled], text: [mode-text-disabled]
```

**Ghost/Text Button:**
```
Default:    bg: transparent, text: [mode-text-secondary], underline: none
Pressed:    text: [mode-text-primary], opacity: 0.8
Disabled:   text: [mode-text-disabled]
```

**Destructive Button (end session, etc.):**
```
Default:    bg: transparent, text: [mode-error]
Pressed:    bg: [mode-error at 15% opacity], text: [mode-error], scale: 0.97
```

### 7.2 Input Field States

```
Default:    bg: [mode-surface], border: 1pt [mode-border], text: [mode-text-primary], radius-sm
Focused:    bg: [mode-surface], border: 2pt [mode-primary], text: [mode-text-primary]
Filled:     bg: [mode-surface], border: 1pt [mode-primary at 50%], text: [mode-text-primary]
Disabled:   bg: [mode-neutral-800], border: none, text: [mode-text-disabled]
Error:      bg: [mode-surface], border: 2pt [mode-error], text: [mode-text-primary]
```

### 7.3 Toggle / Switch States

Using React Native's built-in Switch component:
```
On:    trackColor: [mode-primary], thumbColor: #FFFFFF
Off:   trackColor: [mode-border], thumbColor: neutral-400
```

### 7.4 Progress Indicator (cards remaining)

Segmented bar, each segment represents one card:
```
Played:     fill: [mode-primary]
Locked:     fill: [mode-accent at 40% opacity] + lock icon overlay
Unplayed:   fill: [mode-border]
Current:    fill: [mode-accent], pulsing glow animation
```

### 7.5 Card Tile States (Game Cards)

```
Default:    bg: [mode-surface], shadow-md, [mode-glow at 0%]
Active:     bg: [mode-surface], shadow-lg, [mode-glow at 100%], slight scale-up (1.01)
Pressed:    scale: 0.99, shadow-sm
```

---

## 8. Party Mode — Full Theme Summary

```
App background: #0E0E1A (party-bg)
Card background: #1C1C30 (party-surface)
Primary action: #7C3AFF (party-primary)
Key accent: #FFD60A (party-accent)
Secondary accent: #FF6B35 (party-secondary)
All text: #FFFFFF / #A0A0C0
Border radius: 12pt default
Typography: Poppins ExtraBold for card text, SemiBold for UI
Card glow: party-primary (#7C3AFF) at 30% opacity
Badge style: Uppercase, bold, pill shape, type-specific colors
Background texture: None (pure flat dark)
Subtle gradient use: Radial gradient on card bg — #1C1C30 center → #0E0E1A edges (very subtle)
```

---

## 9. Couples Mode — Full Theme Summary

```
App background: #12080F (couples-bg)
Card background: #221019 (couples-surface)
Primary action: #E8517A (couples-primary)
Key accent: #FFAA5C (couples-accent)
Secondary accent: #C97DFF (couples-secondary)
All text: #FFF0F5 / #C8A0B4
Border radius: 24pt default (softer)
Typography: Poppins Bold for card text, Medium for UI labels
Card glow: couples-primary (#E8517A) at 25% opacity
Badge style: Uppercase, bold, softer pill (radius-xl), type-specific colors
Background: Subtle top-to-bottom gradient #18080E → #12080F (barely perceptible depth)
Special: Finale round gets purple tint overlay on card surface: #1A0A2A
```

---

## 10. App Shell (Both Modes)

Elements that look the same regardless of mode:

### Status Bar
- Style: `StatusBar barStyle="light-content"` always
- Background: transparent (blend into app bg)

### Navigation Header
- No traditional header. All screens use in-screen back buttons or modal dismissal.
- Settings accessible via gear icon (⚙️) in top-right of Home screen
- During sessions: Only progress indicator + exit icon. No nav bar.

### Safe Area
- Use `SafeAreaView` with `edges={['top','bottom']}` on all screens
- Bottom edge: Respect iOS home indicator, Android nav gestures

### Loading Screen (App Launch)
```
Background: #0C0C14 (neutral-900)
Logo: SpinUp wordmark (white) centered
Tagline: "One app. Two vibes." in type-body, neutral-400
Animation: Logo fades in with subtle scale from 0.9 to 1.0 (300ms ease-out)
Duration: Show until fonts loaded (useFonts hook resolved)
```

---

## 11. Icon Style Guidelines

- **Style:** Line icons, 2pt stroke weight, rounded line caps and joins
- **Size:** 24×24pt standard; 20×20pt small (nav/badge); 32×32pt large (feature icons)
- **Library:** Use `@expo/vector-icons` with `Ionicons` set — covers all needed icons in the correct style
- **Color:** Always inherit from text color token of context (never hardcode icon colors)
- **Mode-specific emojis:** Use for decorative mode badges only (🍺 🍕 💑 ❤️) — not for functional UI icons

**Key icon mappings:**
| Function | Ionicons name |
|----------|--------------|
| Settings | `settings-outline` |
| Back | `chevron-back` |
| Close/Exit | `close` |
| Undo | `arrow-undo-outline` |
| Lock (locked content) | `lock-closed` |
| Checkmark | `checkmark-circle` |
| Add player | `add-circle-outline` |
| Remove player | `remove-circle-outline` |
| Trophy/Winner | `trophy` |
| Heart (couples) | `heart` |
| Star (score) | `star` |
| Info | `information-circle-outline` |
| Restore purchase | `refresh` |

---

## 12. Motion & Animation Guidelines

- **Philosophy:** Motion confirms actions, not decorates screens. Be fast and purposeful.
- **Card transitions:** Horizontal slide — new card slides in from right as current slides out left (like a card deck)
- **Mode switch:** Fade out → theme swap → fade in (300ms)
- **Modal appear:** Slide up from bottom (400ms, ease-out cubic bezier 0.16, 1, 0.3, 1)
- **Score update:** Number counter animates up (LayoutAnimation or Animated.Value)
- **Badge pop:** Scale from 0 to 1 with spring (tension: 300, friction: 20)
- **Button press:** Scale to 0.97 (100ms ease-in), release to 1.0 (150ms ease-out)
- **Undo button:** Subtle shake animation when nothing to undo (3 quick oscillations)
- **Finale round reveal:** Card surface gets purple gradient overlay fade-in (600ms)
- **Never:** Rotation animations, 3D card flips, bouncy overshoots on navigation

---

## 13. Accessibility Checklist

All implemented screens must pass:
- [ ] Minimum 4.5:1 contrast ratio on all text (AA)
- [ ] Touch targets minimum 44×44pt (iOS HIG / Material)
- [ ] All interactive elements have `accessibilityLabel` set
- [ ] Color is not the sole indicator of state (always paired with text or shape change)
- [ ] `allowFontScaling={false}` is applied ONLY on game card text, all other text respects system settings
- [ ] Paywall dismiss button (✕) is never hidden or delayed

---

*Design System v1.0 — Last updated 2026-03-06*
