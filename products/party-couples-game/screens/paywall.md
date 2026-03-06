# Screen Spec: Paywall (IAP Unlock)
**Mode:** Both (Party + Couples — same modal)  
**File:** `screens/paywall.md`  
**Author:** Designer Agent  
**Date:** 2026-03-06  
**Status:** READY FOR IMPLEMENTATION

---

## 1. Purpose

The one-time IAP unlock modal. Surfaces at specific trigger points during gameplay (mid-session locked card, locked tier tap, Long session selection, post-session soft upsell). Must be honest, frictionless to dismiss, and compelling without dark patterns.

---

## 2. Component Type

**Bottom sheet modal** — not a full-screen push. Slides up over the current screen (both Party Mode and Couples Mode sessions).

- The underlying screen (game, setup, etc.) remains visible but dimmed behind the overlay
- User can dismiss by tapping the backdrop OR the ✕ button — no delay, no countdown

---

## 3. Backdrop

- Color: `#000000` at 65% opacity
- Full screen (covers everything behind, including status bar)
- Tap on backdrop: Dismisses paywall (same behavior as ✕ button)
- Animation: Opacity 0 → 0.65 (300ms linear), simultaneous with sheet slide-up

---

## 4. Sheet Container

- **Background:** Mode-aware:
  - **Party context:** `party-surface-elevated` (#252540)
  - **Couples context:** `couples-surface-elevated` (#301625)
- **Border radius:** Top corners only — `radius-xl` (24pt)
- **Padding:** 28pt top (below handle), 24pt horizontal, 32pt bottom + device safe area
- **Width:** 100% of screen width
- **Max height:** 90% of screen height (sheet is scrollable if needed — unlikely on standard content)
- **shadow-lg:** `shadowOffset: {0, -4}`, `shadowOpacity: 0.4`, `shadowRadius: 24` (shadows upward on iOS). Android: `elevation: 12`.
- **Animation:** `translateY` from +100% to 0 (400ms, cubic-bezier 0.16, 1, 0.3, 1 — ease-out snappy)

**Drag handle (top of sheet):**
- Width: 36pt, height: 4pt
- bg: `neutral-400` (#7A7A94) at 40% opacity
- Border radius: `radius-full`
- Centered horizontally
- 12pt below top edge of sheet, 16pt above headline area
- Tapping/dragging handle: Dragging down by ≥80pt OR velocity ≥500pt/s → dismisses sheet

---

## 5. Dismiss Button (✕)

**Position:** Top-right corner of sheet, 20pt from top (relative to sheet top edge), 20pt from right edge.

- Icon: `close` (Ionicons), 24×24pt
- Color (Party): `party-text-secondary` (#A0A0C0)
- Color (Couples): `couples-text-secondary` (#C8A0B4)
- Touch target: 44×44pt (icon is centered within target)
- Tapping: Immediate dismiss (no confirmation). Sheet slides down (300ms ease-in), backdrop fades out.
- **Must always be visible and tappable** — no delay, no hide. This is a hard rule (App Store compliance + no dark patterns).
- `accessibilityLabel`: "Close paywall"
- `accessibilityHint`: "Dismiss this screen. You can continue with the free version."

---

## 6. Header Section

### 6.1 Icon / Visual

- Icon: `lock-open` (Ionicons, or custom unlock icon), 48×48pt
- Color (Party): `party-primary` (#7C3AFF) with glow — shadow `#7C3AFF` at 40% opacity, blur 12pt
- Color (Couples): `couples-primary` (#E8517A) with glow — shadow `#E8517A` at 30% opacity, blur 12pt
- Centered horizontally
- 32pt below handle area

### 6.2 Headline

- Text: `"Unlock the Full Game"`
- Font: `type-h1` — 36pt, ExtraBold (800), Poppins
- Color (Party): `party-text-primary` (#FFFFFF)
- Color (Couples): `couples-text-primary` (#FFF0F5)
- Text align: center
- `allowFontScaling={false}`
- 12pt below icon

### 6.3 Subheadline

- Text: `"One price. No subscription. Yours forever."`
- Font: `type-body` — 16pt, Regular (400)
- Color (Party): `party-text-secondary` (#A0A0C0)
- Color (Couples): `couples-text-secondary` (#C8A0B4)
- Text align: center
- 8pt below headline

---

## 7. Feature List

### 7.1 Container

- 24pt gap below subheadline
- No background card (features sit directly on sheet bg)
- Vertical stack, 16pt gap between items

### 7.2 Feature Item Structure

Each item is a horizontal row:

```
 ✅  200+ cards across both modes
```

**Checkmark icon:**
- Icon: `checkmark-circle` (Ionicons), 24×24pt
- Color (Party): `party-success` (#4ADE80)
- Color (Couples): `couples-success` (#5EE0A0)
- Vertically centered with text

**Feature text:**
- Font: `type-body` — 16pt, Regular (400)
- Color (Party): `party-text-primary` (#FFFFFF)
- Color (Couples): `couples-text-primary` (#FFF0F5)
- `flexShrink: 1` to wrap properly
- 12pt gap between icon and text

### 7.3 Feature List Items (exact copy)

1. `"200+ cards across both modes"`
2. `"Flirty & Spicy couples tiers"`
3. `"Wild cards + Spicy party pack"`
4. `"Long sessions — 50+ cards"`
5. `"All future card packs included"` — **this item is bold/highlighted** (see below)

**Item 5 — "All future card packs" highlight:**
- Feature text font: `type-body` 16pt, **SemiBold (600)** instead of Regular
- Color (Party): `party-accent` (#FFD60A) instead of white
- Color (Couples): `couples-accent` (#FFAA5C) instead of primary text
- This communicates the lifetime value promise visually

### 7.4 Spicy Pack Teaser Row

After the 5 feature items, 12pt gap, a distinct "coming soon" row:

```
 🔥  Spicy Pack — Coming Soon
```

- Icon: Inline emoji `🔥` (16pt)
- Text: `"Spicy Pack — Coming Soon"` 
  - Font: `type-body-sm` 14pt, Regular (400)
  - Color (Party): `party-text-secondary` (#A0A0C0)
  - Color (Couples): `couples-text-secondary` (#C8A0B4)
  - Font style: italic (`fontStyle: 'italic'`)
- Additional sub-text below (same style, 4pt gap): `"Included in your unlock — no extra charge"`
  - Font: `type-caption` 12pt, Regular (400), same secondary color

**Row container:**
- bg: Mode primary at 8% opacity
  - Party: `#7C3AFF` at 8% → `rgba(124,58,255,0.08)`
  - Couples: `#E8517A` at 8% → `rgba(232,81,122,0.08)`
- Border radius: `radius-md` (12pt)
- Padding: 12pt vertical, 16pt horizontal
- Border: 1pt dashed — Party: `party-primary` (#7C3AFF) at 30% opacity; Couples: `couples-primary` (#E8517A) at 30% opacity

---

## 8. Free vs Locked Contrast Section (Optional Contextual Block)

Displayed only when the paywall is triggered mid-session by a **locked card** (not when triggered by tier selector or long session button — in those cases, skip this block).

Positioned between feature list and CTA button, 24pt gap from feature list.

**Structure:**
```
 What you get free              What you're missing
 ─────────────────              ──────────────────
 ✓ 45 cards                     ✗ 145+ more cards
 ✓ Short & Medium sessions      ✗ Long sessions
 ✓ Romantic tier (couples)      ✗ Flirty & Spicy tiers
```

**Two-column layout:**
- Column gap: 16pt
- Column title: `type-body-sm` 14pt, SemiBold (600), `couples-text-secondary` / `party-text-secondary`
- Divider below title: 1pt `couples-border` / `party-border`, 8pt margin below
- Row items: `type-caption` 12pt, Regular (400)
  - Free column: `couples-success` / `party-success` with `✓` prefix
  - Missing column: `couples-error` (#FF6B8A) / `party-error` (#FF4D6D) with `✗` prefix
- 8pt gap between rows
- `accessibilityLabel` for the section: `"Comparison: what's free versus what unlocks"`

---

## 9. CTA Button — "Unlock Everything"

**Position:** Below feature list (or free/locked comparison if shown), 24pt gap.

```
[ Unlock for $4.99 ]
```

**Default state:**
- bg (Party): `party-primary` (#7C3AFF)
- bg (Couples): `couples-primary` (#E8517A)
- text: `#FFFFFF`
- Font: `type-button-lg` — 18pt, SemiBold (600), letter-spacing 0.3px
- Height: 60pt
- Border radius: `radius-xl` (24pt)
- Width: Full sheet width − 48pt (24pt each side)
- shadow-sm

**Pressed state:**
- bg (Party): `party-primary-pressed` (#6B28EE)
- bg (Couples): `couples-primary-pressed` (#D03D65)
- scale: 0.97 (100ms ease-in)
- shadow-xs

**Loading state** (after tap, waiting for App Store/Play Store):
- bg: same as default (not grayed out — still looks active)
- Text: hidden
- `ActivityIndicator` (size "small", color `#FFFFFF`) centered inside button
- Button is non-interactive (pointer events disabled)
- State triggered immediately on tap, before native purchase sheet appears
- `accessibilityLabel`: "Processing purchase, please wait"

**Success state** (purchase confirmed):
- Button is replaced by a success row (see Section 11 — Success State)

---

## 10. Restore Purchases Link

**Position:** 16pt below CTA button, centered.

```
Restore previous purchase
```

- Font: `type-button-sm` — 14pt, Medium (500)
- Color (Party): `party-text-secondary` (#A0A0C0)
- Color (Couples): `couples-text-secondary` (#C8A0B4)
- Underline: none (ghost style)
- Touch target: 44pt height (text appears small but tap area is tall)
- Tap: Triggers native App Store / Play Store restore flow
  - Loading: Shows `ActivityIndicator` (16×16pt) inline to the left of text, text dims to 50% opacity
  - On success: See Section 11 (Success State — Restore variant)
  - On failure (no purchase found): Inline error message replaces link (see Section 12 — Error State)
- `accessibilityLabel`: "Restore a previous purchase"
- `accessibilityHint`: "Use this if you've already purchased SpinUp on another device"

---

## 11. Success State (Post-Purchase or Post-Restore)

The sheet does NOT immediately dismiss. It transitions to a success view for 2 seconds, then auto-dismisses.

### 11.1 Success View Layout

The sheet content crossfades (200ms) to:

**Centered content, vertically centered in sheet:**

```
          🎉
    You're unlocked!
   Everything's yours.
       [ Let's Play ]
```

- Celebration icon: `checkmark-circle` (Ionicons), 64×64pt
  - Entry: Scale spring 0 → 1.1 → 1.0 (overshoot, tension 280, friction 16)
  - Color: `couples-success` (#5EE0A0) (both modes — universal success color)
- Title: `"You're unlocked!"` — `type-h1` 36pt, ExtraBold (800)
  - Entry: Fade + translateY from +8pt, 300ms ease-out, 100ms after icon
  - Color: `couples-text-primary` / `party-text-primary`
- Body: `"Everything's yours."` — `type-body` 16pt, Regular
  - Entry: Fade, 200ms, 250ms delay
  - Color: secondary text token for current mode
- Button: `"Let's Play"` — Primary CTA button (same style as unlock CTA)
  - Tap: Dismisses sheet, resumes session (or continues to the content the user was trying to access)
  - 24pt below body text
  - `accessibilityLabel`: "Close and continue playing"

### 11.2 Restore Success Variant

If triggered by restore (not fresh purchase):

- Title: `"Purchase restored!"`
- Body: `"Welcome back — everything's unlocked."`
- Otherwise identical layout and animation

### 11.3 Auto-dismiss

- 2.5 seconds after success view appears, auto-dismiss if user hasn't tapped "Let's Play"
- Animation: Sheet slides down (300ms ease-in), backdrop fades out

---

## 12. Error States

### 12.1 Purchase Failed / Cancelled

If purchase flow is cancelled by user OR fails:
- Loading state reverts immediately to default CTA state
- No error message shown (user chose to cancel — no penalty UI)
- Paywall remains open so user can retry or dismiss

### 12.2 Purchase Error (technical failure)

If App Store / Play Store returns an error (network, billing error, etc.):
- CTA button returns to default state
- Inline error message appears **above** the CTA button, 8pt gap:
  - Text: `"Something went wrong. Please try again."`
  - Font: `type-body-sm` 14pt, Regular
  - Color (Party): `party-error` (#FF4D6D)
  - Color (Couples): `couples-error` (#FF6B8A)
  - Icon: `alert-circle-outline` (Ionicons), 16×16pt, same error color, left of text
- Error message auto-dismisses after 4 seconds (fade out, 300ms)

### 12.3 Restore — No Purchase Found

If restore finds no prior purchase for the signed-in account:
- Restore link reverts to normal state
- Inline message replaces the restore link for 4 seconds:
  - Text: `"No purchase found for this account."`
  - Font: `type-body-sm` 14pt, Regular
  - Color: `neutral-400` (#7A7A94) — not an error color, just informational
- After 4 seconds: Restore link returns

---

## 13. Context-Specific Variations

### 13.1 Mid-Session Trigger (Locked Card)

**Additional context banner** appears at the top of the sheet (above the headline), 12pt below handle:

```
  🔒  Locked card reached — unlock to continue
```

- bg: Mode primary at 12% opacity, border radius `radius-sm` (8pt), padding 10pt vertical 16pt horizontal
- Icon: `lock-closed` (Ionicons), 16×16pt, mode primary color
- Text: `"Locked card reached — unlock to continue"` — `type-body-sm` 14pt, Regular, mode primary text
- This block is REMOVED in the default paywall (triggered from tier selector, settings, post-session, etc.)
- Session is paused — NOT ended — while paywall is open. Closing paywall returns to game.

**Session resume behavior (after dismiss without purchase):**
- Sheet dismisses
- Locked card is skipped
- Next available free card is drawn
- No animation or indication that a card was skipped (silent skip)

### 13.2 Post-Session Soft Upsell

When triggered from the session end screen (soft upsell banner), the sheet has a different tone:

**Modified subheadline:**
`"You just played the free version. The full game has 3× more."`

**No context banner** (section 13.1 block removed)

**Added "Maybe Later" link** below Restore Purchases:

```
Maybe later
```

- Font: `type-button-sm` 14pt, Medium (500)
- Color: `couples-text-disabled` / `party-text-disabled`
- Tap: Dismisses sheet (same as ✕)
- `accessibilityLabel`: "Dismiss paywall"

### 13.3 Locked Tier Trigger (Couples Setup)

**Modified headline:**
`"Flirty & Spicy are locked"` (if Flirty tapped) or `"Spicy is locked"` (if Spicy tapped)

**Modified subheadline:**
`"Unlock to choose any tier — and keep all future packs."`

---

## 14. Full Layout Height Estimate (Standard Paywall)

| Element | Height |
|---------|--------|
| Handle | 4pt |
| Handle top margin | 16pt |
| Header icon | 48pt |
| Gap | 16pt |
| Headline | 44pt |
| Subheadline | 24pt |
| Gap | 24pt |
| Feature list (5 items × 40pt) | 200pt |
| Gap between items | 64pt (4 × 16pt) |
| Spicy Pack teaser row | 64pt |
| Gap | 24pt |
| CTA button | 60pt |
| Gap | 16pt |
| Restore link | 44pt |
| Bottom padding | 32pt + safe area (~34pt) |
| **Total estimate** | **~670pt** |

On iPhone 14 (844pt tall), 670pt sheet = ~79% screen height — fits within 90% cap. Safe.

---

## 15. Accessibility

- All interactive elements: `accessibilityLabel` and `accessibilityHint` as specified throughout
- Feature list items: `accessibilityRole="text"` — read sequentially
- CTA button in loading state: `accessibilityLabel="Processing purchase, please wait"` + `disabled={true}`
- Sheet: `accessibilityViewIsModal={true}` — traps focus inside modal for screen readers
- ✕ button: Never hidden, never delayed — hard rule
- `accessibilityLiveRegion="polite"` on error messages (auto-announces to screen reader when they appear)
- Success state title: `accessibilityLiveRegion="assertive"` — announces immediately on purchase confirmation

---

*Screen spec v1.0 — paywall.md*
