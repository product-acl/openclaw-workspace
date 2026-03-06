# PRD: Party & Couples Game App
**Version:** 1.0  
**Author:** PM Agent (BAIcan)  
**Date:** 2026-03-06  
**Status:** APPROVED — Decisions locked 2026-03-06  
**Target Ship:** Sunday 2026-03-08  

---

## Table of Contents
1. [Overview](#1-overview)
2. [Target Users](#2-target-users)
3. [Scope](#3-scope)
4. [Game Mechanics — Party Mode](#4-game-mechanics--party-mode)
5. [Game Mechanics — Couples Mode](#5-game-mechanics--couples-mode)
6. [Onboarding Flow](#6-onboarding-flow)
7. [IAP & Paywall](#7-iap--paywall)
8. [Content Requirements](#8-content-requirements)
9. [User Stories](#9-user-stories)
10. [Out of Scope for v1.0](#10-out-of-scope-for-v10)
11. [Success Metrics](#11-success-metrics)
12. [Open Questions](#12-open-questions)

---

## 1. Overview

### Product Summary
**App Name (working title):** *SpinUp* — one app, two modes.

SpinUp is a dual-mode mobile game for iOS and Android (React Native/Expo). It serves two distinct audiences through a single download:

- **Party Mode 🍺** — A drinking game for groups of 3–8 players, with card-based mini-games, dares, votes, and challenges. Designed to replace Picolo and similar apps with honest pricing and a smarter UX.
- **Couples Mode 💑** — An interactive game for two, featuring real turn-based mechanics, scoring, and surprise challenges. Not a question dump — actual gameplay.

### Vision
Be the drinking game app people actually recommend to their friends because it isn't trying to scam them, and the couples game app that feels like *playing* instead of *reading*.

### Goal for v1.0
Ship a production-ready, App Store and Play Store approved build by **Sunday 2026-03-08** with:
- Enough free content to hook both audiences
- One clean $4.99 one-time unlock that removes all gates permanently
- Zero subscriptions, zero mid-session ads
- Polished enough to earn a 4.5+ star rating in week one

---

## 2. Target Users

### Persona A — The Party Group (Primary, Party Mode)

**Who:** 3–8 friends, ages 21–32, pre-gaming or at a house party. Mix of genders. At least one person is slightly drunk. Someone owns an iPhone or Android and suggests "let's play a game."

**Their pain:**
- Picolo and Kings Cup apps are free to download but paywalled after 2 rounds — feels like a bait-and-switch
- Subscription model ($5–8/month) for a game you play twice a year is offensive
- Drunk players accidentally tap the wrong option and can't undo it
- Cards repeat too fast; the app feels thin

**Our solution:**
- One-time $4.99 — buy once, own forever, no guilt
- Undo button that reverses the last card action (explained in Section 4)
- 30% free is actually playable (not just 3 cards), 70% unlocked is genuinely premium
- Varied mini-game types that keep the energy alive

**Job-to-be-done:** *"Make the pregame more fun without anyone having to think too hard or spend money they'll regret."*

---

### Persona B — The Couple (Primary, Couples Mode)

**Who:** Two people in a relationship, ages 22–35. Could be: new couple wanting to learn more, long-term couple wanting a spark, or partners on a date night at home.

**Their pain:**
- 80% of couples apps are just "200 questions to ask your partner" formatted as cards — you could print these on paper
- The good apps (Intimacy, Paired) cost $15–20/month subscriptions
- Many show ads mid-session, which kills the mood
- No real game feel — no stakes, no scoring, no surprise, no payoff

**Our solution:**
- Actual game loop: turns, scoring, challenges, dare mechanics — feels like *playing*, not *answering*
- No ads during Couples Mode, ever (free or paid)
- Romantic and Spicy content tiers — users pick the vibe before starting
- Session has a clear arc: beginning → escalation → finale

**Job-to-be-done:** *"Give us something to do together that's actually interactive, not just us taking turns reading questions off a screen."*

---

## 3. Scope

### In v1.0

**Party Mode:**
- Player setup: 2–8 players, name entry (custom names)
- 4 mini-game types: Dare, Truth Bomb, Vote, and Challenge Roulette
- Card deck with free/unlocked split
- Undo button (last card only)
- Session length selector (Short / Medium / Long)
- Basic drinking rule toggle (can disable drinking references for non-drinking groups)

**Couples Mode:**
- 2-player assumed; no name entry required (Player 1 / Player 2 or custom)
- 3 mini-game types: Dare Duel, Memory Challenge, Spin the Scenario
- Content tier selector at session start: Romantic / Flirty / Spicy
- Turn-based scoring system with session leaderboard
- Session end screen with result summary

**Both Modes:**
- Home screen with mode selector
- Onboarding (first-launch walkthrough, max 3 screens)
- $4.99 one-time IAP ("Unlock Everything")
- Paywall modal (appears at gate moments)
- App Store + Play Store ready (content rating: 17+ for Spicy tier)

### Explicitly Out of v1.0
See Section 10 for full list.

---

## 4. Game Mechanics — Party Mode

### 4.1 Player Setup

**Flow:**
1. User taps "Party Mode" from home screen
2. Screen: "Who's playing?" — shows empty name slots
3. Default: 4 player slots shown. "+" button adds up to 8. "−" removes down to 2 (Note: product brief says 3–8; see Open Questions re: 2-player party)
4. Each slot has a text field. Placeholder: "Player 1", "Player 2", etc.
5. Names are optional — tapping "Let's Go" with empty fields auto-fills "Player 1" through "Player N"
6. Session length selector below names: Short (15 cards), Medium (30 cards), Long (50 cards)
7. Optional toggle: "🍺 Drinking mode" — ON by default. When OFF, drinking-related card text swaps to non-drinking variants where available

**Constraint:** Player names persist for the session only. No accounts, no cloud sync in v1.0.

---

### 4.2 The Card/Round Loop

**Core mechanic:**
- Cards are drawn one at a time, full-screen
- Each card is assigned to a player via round-robin (or random — see Open Questions)
- The active player's name appears at the top: *"Maya, your turn!"*
- Card content is displayed center-screen
- Player performs/responds to the card
- Taps "Done" or "Next" to advance
- Progress indicator shows cards remaining (e.g., "Card 8 of 30")

**Card anatomy:**
```
[Player Name]
[Mini-game type badge — e.g., "DARE"]
[Card text / prompt]
[Action buttons: Done | Undo]
```

**Deck composition (Medium session, 30 cards):**
- ~40% Dare (12 cards)
- ~25% Truth Bomb (7 cards)
- ~20% Vote (6 cards)
- ~15% Challenge Roulette (5 cards)

Deck is shuffled at session start. No card repeats within a session.

---

### 4.3 Mini-Game Types

#### Type 1: Dare
**Description:** The active player must perform a physical or social action.  
**Format:** *"[Player], dare: Kiss the person to your left on the cheek. Refuse? Drink 3."*  
**Mechanics:** Player performs the dare OR takes the drinking penalty. Group validates. Tap Done to continue.  
**Drinking variant:** Penalty is X drinks.  
**Non-drinking variant:** Penalty is a replacement challenge (e.g., "Do 10 jumping jacks" or "Sing a line of a song").  
**Example cards (free tier):**
- "Text your mom a random emoji. Show the group."
- "Do your best impression of the person to your right."
- "Let the group pick a 30-second TikTok dance you must perform."

**Example cards (locked tier):**
- "Trade phones with the person to your left for 2 minutes."
- "Tell the group your most embarrassing recent photo. Show it."
- "Let the group read your last 5 search queries out loud."

---

#### Type 2: Truth Bomb
**Description:** Active player answers a personal question honestly, or takes the penalty.  
**Format:** *"[Player], truth: What's the most recent lie you told in this group? Refuse? Drink 2."*  
**Mechanics:** Player answers or takes penalty. No validation — honor system. Tap Done to continue.  
**Example cards (free tier):**
- "Who in this room would you call at 3am if you were in trouble?"
- "What's a habit you have that you'd be embarrassed to admit?"

**Example cards (locked tier):**
- "Read your most recently sent voice note out loud."
- "What's the last thing you googled that you wouldn't want anyone to see?"
- "Name someone you've ghosted and why."

---

#### Type 3: Vote
**Description:** The whole group votes on a question — usually "most likely to…" or ranking-style. The person who gets the most votes takes a consequence.  
**Format:** *"Vote: Who is most likely to cry at a Disney movie? The winner drinks 2."*  
**Mechanics:**
- Card appears with the vote prompt
- Group points simultaneously at one person (no digital voting — it's physical)
- Person with most pointed fingers takes the consequence
- Tie-breaker: Both tied players take half the consequence (rounded up)
- Tap Done to continue

**Example cards (free tier):**
- "Most likely to overshare on Instagram"
- "Most likely to end up on a reality TV show"

**Example cards (locked tier):**
- "Most likely to have kissed someone in this room" (consequences escalate)
- "Most likely to still be talking to their ex"
- "Who would survive the longest in a zombie apocalypse?"

---

#### Type 4: Challenge Roulette
**Description:** A mini-game within the game — active player does a timed or head-to-head challenge against another player or the group.  
**Format:** *"[Player] vs [Random player]: Staring contest. First to blink drinks 3."*  
**Mechanics:**
- Card names a challenger (randomly selected from other players)
- Challenge has clear win/lose condition
- Timer challenges use phone's visible clock or the group counts
- Loser takes consequence

**Subtypes:**
- **Head-to-head:** Two players compete (staring contest, thumb war, who can hold their breath longer)
- **Timed:** Active player has 30 seconds to complete something (name 5 countries starting with A, do 15 push-ups)
- **Group vs player:** Player competes against the whole group (everyone does a hand clap rhythm; player must copy it)

**Example cards (free tier):**
- "Thumb war — loser drinks 2"
- "Name 5 songs by [genre] in 30 seconds or drink 3"

**Example cards (locked tier):**
- "Act out a scene from a movie. Group guesses. Wrong guesses each drink 1."
- "Do a 60-second standup bit about the person to your left. They rate it 1–10. Under 6? You drink the difference."

---

### 4.4 Undo Mechanic

**Exact behavior:**
- After a card is displayed and *before* the player taps "Done", an **Undo** button is visible in the bottom-left corner
- If the player taps "Done" (advancing to the next card), the Undo button becomes available on the *next* card for one action — tapping it reverses to the previous card
- **Undo is one-level deep only.** You can't undo two cards back.
- Undo is NOT available on the very first card of a session (nothing to undo)
- After an undo, the same card is shown again and re-counted toward the session (it doesn't disappear from the deck — it gets reshuffled near the end)

**Why this exists:** Drunk players accidentally tap "Done" before reading the card or performing the dare. Undo gives a fair second chance without restarting the session.

**Visual treatment:** Undo button is small, secondary — not competing with the "Done/Next" CTA. Label: "↩ Undo last"

**Locked behavior:** Undo is available in both free and paid tiers. It is a UX feature, not a monetized one. This is a key differentiator.

---

### 4.5 Free vs Unlocked Content Split

**Target ratio:** ~30% free / ~70% unlocked

**Free tier includes:**
- All 4 mini-game types represented (players experience the full variety)
- ~60 free cards across all types (enough for 2 short sessions without repeating)
- Non-drinking mode available in free tier
- Session length: Short and Medium only in free tier (Long = 50 cards = locked)

**Locked tier adds:**
- ~140 additional cards (total deck: ~200 cards)
- Long session length (50 cards)
- "Wild" card type (special escalating dares — unlocked only)
- Custom dare submission (players type a dare that gets added to the session deck) — unlocked only
- "Spicy Pack" — adult-themed dares/truths (17+ rated)

**Paywall trigger:** When the session would draw a locked card, the game pauses and shows the paywall modal. This happens naturally in Medium sessions after ~10 cards (hitting the lock ratio) and immediately in Long sessions.

---

## 5. Game Mechanics — Couples Mode

### 5.1 The Game Loop

Couples Mode is a **turn-based game with scoring and a session arc**. It is not a card viewer.

**Session structure:**
1. **Setup** (60 seconds): Content tier selection, session length
2. **Warm-Up Round** (first 25% of session): Lower-stakes cards, establish comfort
3. **Main Game** (middle 50%): Full mix of mini-game types, scoring in effect
4. **Finale** (last 25%): Higher-stakes challenges, bonus point multipliers
5. **End Screen**: Score reveal, winner declared, reward card (special prompt for the winner)

**Turn order:**
- Players alternate turns
- On your turn, a card is drawn and assigned to you
- You respond / perform / challenge
- Your partner validates (they tap ✅ or ❌ on their half of the screen, or just the active player taps Done — see Open Questions)
- Points awarded

**Scoring:**
- Completing a challenge: +2 points
- Completing a Dare Duel (and winning): +3 points
- Declining a challenge: 0 points (no punishment beyond the game pressure — couples mode doesn't punish)
- Bonus: Completing all cards in the Finale round without skipping: +5 bonus to winner

**Session end:** The player with more points wins. Equal points = tie = "You're perfect together" end screen variant.

---

### 5.2 Mini-Game Types

#### Type 1: Dare Duel
**Description:** Both players receive the same dare simultaneously. First to complete wins the round points.  
**Format:** *"Dare Duel: Serenade your partner with 30 seconds of a love song — improvised. Your partner rates 1–10. Highest score wins."*  
**Mechanics:**
- Both players see the dare at the same time
- They take turns performing (coin flip or player choice for who goes first)
- Partner rates on 1–10 slider
- Player with higher rating wins +3 points
- If both refuse: 0 points, card advances

**Example cards (Romantic tier, free):**
- "Draw a 60-second portrait of your partner. They rate it."
- "Give your partner a 1-minute shoulder massage. They rate how good it was."

**Example cards (Flirty tier, locked):**
- "Whisper something you love about them in the most dramatic voice possible."
- "Re-enact your first date in 2 minutes. Accuracy judged by your partner."

**Example cards (Spicy tier, locked):**
- *(Content is adult-themed but not explicit — think "flirtatious dare" not graphic)*
- "Tell your partner the one thing they do that drives you absolutely wild."

---

#### Type 2: Memory Challenge
**Description:** Tests how well you know your partner. Both players answer the same question separately; compare answers.  
**Format:** *"How did your partner feel about their last job? Each of you writes your answer — compare."*  
**Mechanics:**
- Card shows a question about the partner
- Each player types (or thinks of) their answer simultaneously (phone passes back and forth, or both type on a shared prompt area — see Open Questions on single-device UX)
- Answers are revealed
- If answers match (or are close enough — partner decides): +2 points each
- If they don't match: 0 points, but a conversation prompt appears: *"Talk about it for 60 seconds"*

**Example cards (Romantic tier, free):**
- "What's your partner's biggest non-work stress right now?"
- "What meal would your partner order at their favorite restaurant?"

**Example cards (Flirty/Spicy tier, locked):**
- "What's your partner's most embarrassing habit they don't know you've noticed?"
- "What's something your partner is secretly proud of?"

---

#### Type 3: Spin the Scenario
**Description:** A "what if" or "choose one" prompt that sparks real conversation — but has a game mechanic attached.  
**Format:** *"Scenario: If you had to give up either music or movies forever — which one? You have 30 seconds to convince your partner to pick the same answer as you."*  
**Mechanics:**
- Player reads the scenario
- Has 30 seconds (visible countdown) to argue for their answer
- Partner decides: "Convinced" (+2 to active player) or "Not convinced" (0 points)
- Then roles swap — partner argues for *their* answer in 30 seconds
- If partner changes their position: Bonus discussion prompt

**Variants:**
- "Convince" scenarios (above)
- "Rank it" — both players rank 3 options privately, compare ranking
- "Prediction" — active player predicts how partner will answer; partner answers; points for correct prediction

**Example cards (Romantic tier, free):**
- "Rank these in order of importance to you in a relationship: trust, passion, humor."
- "Predict: What would your partner's dream vacation look like in 10 words?"

**Example cards (Flirty/Spicy tier, locked):**
- "Convince your partner that your way of showing love is the most romantic."
- "Scenario: You can only say 'I love you' in one language forever. Which one and why? Convince your partner."

---

### 5.3 Content Tiers

Selected at session start — locked in for the whole session. Cannot be changed mid-session.

| Tier | Description | Availability |
|------|-------------|--------------|
| **Romantic** | Sweet, emotionally connective. No sexual content. | Free |
| **Flirty** | Playful, mildly suggestive. Light physical dares. | Locked ($4.99) |
| **Spicy** | Intimate, adult-oriented. Suggestive but not explicit. 17+ | Locked ($4.99) |

**App Store rating strategy:** App rated 17+ to allow Spicy content. Romantic and Flirty tiers are appropriate for 12+ content, but the app is rated for its maximum content level.

---

### 5.4 How the Session Ends

**Normal end:** All cards played, score tallied, end screen shown.

**End screen shows:**
- Final scores: "Alex: 18 pts | Jordan: 14 pts"
- Winner badge: "🏆 Alex wins this round!"
- Tie variant: "💫 Perfect tie — you're in sync!"
- Reward prompt for the winner: A special card only the winner reads (something affirming or fun — varies by content tier)
- CTA: "Play Again" (reshuffles deck) or "Switch Mode" (returns to home)

**Rage-quit / early exit:** Pressing home icon during session shows confirmation modal: "End session? Your progress will be lost." Confirms → end screen with partial scores shown.

---

## 6. Onboarding Flow

### 6.1 First Launch (Both Modes)

**Screen 1 — Mode Select (no onboarding skippable here):**
> *Welcome to SpinUp*  
> Large visual: two modes side by side  
> "Party Mode 🍺" and "Couples Mode 💑"  
> Subtext: "Pick your vibe"

No sign-up. No account creation. No email. Tap a mode → go.

---

### 6.2 Party Mode First Launch

**If first time tapping Party Mode**, show a 2-screen micro-tutorial overlay:

**Tutorial Screen 1:**
> "Cards come to you one at a time. Do the dare, tell the truth, or drink up. Your call."  
> Visual: Card mockup  
> Tap: "Got it →"

**Tutorial Screen 2:**
> "Accidentally skipped? Hit Undo. No judgment. We know how parties go. 🍺"  
> Visual: Undo button highlighted  
> Tap: "Let's Party"

Then → Player setup screen (Section 4.1).

**Subsequent launches:** Skip tutorial, go directly to Player Setup.

---

### 6.3 Couples Mode First Launch

**If first time tapping Couples Mode**, show a 2-screen micro-tutorial overlay:

**Tutorial Screen 1:**
> "This isn't a question list. You'll play, compete, and dare each other. Points are real."  
> Visual: Score counter animation  
> Tap: "Nice →"

**Tutorial Screen 2:**
> "Pick your vibe before you start: Romantic, Flirty, or Spicy. You can always try all three."  
> Visual: Tier selector  
> Tap: "Let's Play"

Then → Couples session setup screen (content tier selector + session length).

---

### 6.4 Session Setup — Couples Mode

1. Content tier selector: Three tiles — Romantic / Flirty / Spicy
   - Flirty and Spicy tiles show lock icon if not purchased
   - Tapping a locked tier shows paywall modal
2. Session length: Short (20 cards) / Medium (35 cards) / Long (55 cards)
   - Long = locked
3. Optional: Enter player names (pre-filled: "You" / "Partner")
4. Tap "Start Game" → Warm-Up Round begins

---

## 7. IAP & Paywall

### 7.1 The Offer

**Product:** "Unlock Everything"  
**Price:** $4.99 one-time  
**What it includes:**
- All 140+ locked Party Mode cards
- All Flirty and Spicy couples content tiers
- Long session length (both modes)
- Custom dare feature (Party Mode)
- Wild card type (Party Mode)
- Spicy Pack (Party Mode adult content)
- All future content updates at no additional charge (this is a promise we make in the paywall copy)

**What it does NOT unlock:** Nothing — there are no other tiers, no premium features hidden behind additional purchases. One price, done.

---

### 7.2 Paywall Trigger Points

The paywall appears in these specific moments:

1. **Party Mode — Locked card drawn:** During a session, when the next card in the queue is a locked card, the current card transitions and instead of showing the card, shows the paywall modal. Session is paused, not ended. After purchase (or dismissal), session resumes.

2. **Party Mode — Long session selected:** On the session length selector, tapping "Long (50 cards)" immediately shows the paywall modal before the session starts.

3. **Couples Mode — Locked tier tapped:** On the tier selector, tapping "Flirty" or "Spicy" immediately shows the paywall.

4. **Couples Mode — Locked card drawn:** Same behavior as Party Mode — card queue pauses, paywall modal shown.

5. **Post-session upsell:** At the end of any free session, a soft upsell banner appears: *"You played the free version. The full game has 3x more. $4.99, one time."* This is dismissable with one tap.

---

### 7.3 Paywall Modal Design

**Headline:** "Unlock the Full Game"  
**Subhead:** "One price. No subscription. Yours forever."

**Feature list (icons + text):**
- ✅ 200+ cards across both modes
- ✅ Flirty & Spicy couples tiers
- ✅ Wild cards + Spicy party pack
- ✅ Long sessions (50+ cards)
- ✅ All future card packs included

**CTA Button:** "Unlock for $4.99"  
**Secondary:** "Restore Purchase" (required for App Store)  
**Dismiss:** Small "✕" in top-right (never hidden or delayed — no dark patterns)

**No trial period. No "try free for 7 days" language.** Clean, honest.

---

### 7.4 Purchase Flow

1. User taps "Unlock for $4.99"
2. Native App Store / Play Store purchase sheet appears
3. User confirms or cancels
4. On success: Confirmation modal — "🎉 You're unlocked. Everything's yours." → Returns to wherever they were
5. On failure/cancel: Returns to paywall modal, which can be dismissed

**Restore Purchase:** Standard IAP restore flow. Required for App Store compliance. On success: "✅ Purchase restored."

---

## 8. Content Requirements

### 8.1 Party Mode Card Counts

| Type | Free Cards | Locked Cards | Total |
|------|-----------|--------------|-------|
| Dare | 15 | 35 | 50 |
| Truth Bomb | 12 | 28 | 40 |
| Vote | 10 | 22 | 32 |
| Challenge Roulette | 8 | 20 | 28 |
| Wild (locked only) | 0 | 15 | 15 |
| Spicy Pack (locked only) | 0 | 25 | 25 |
| **Total** | **45** | **145** | **190** |

Notes:
- Free cards are distributed so each session type (Short/Medium) draws full variety
- Cards are tagged with intensity levels 1–3; Short sessions pull mostly level 1–2
- All cards need drinking and non-drinking variants (two text strings per card)

---

### 8.2 Couples Mode Card Counts

| Type | Romantic (Free) | Flirty (Locked) | Spicy (Locked) | Total |
|------|----------------|-----------------|----------------|-------|
| Dare Duel | 12 | 18 | 10 | 40 |
| Memory Challenge | 15 | 15 | 8 | 38 |
| Spin the Scenario | 13 | 17 | 12 | 42 |
| Finale Specials | 5 | 8 | 7 | 20 |
| **Total** | **45** | **58** | **37** | **140** |

Notes:
- Finale Special cards are variants of all 3 types, pre-tagged to appear only in the last 25% of a session
- Spicy content is suggestive, not explicit — must pass App Store 17+ content guidelines
- Each card needs a "short label" for progress UI and "full text" for the card itself

---

### 8.3 Content Creation Priority

**For v1.0 ship (Sunday 2026-03-08), minimum viable content:**
- Party Mode: 45 free cards + 60 locked cards (enough for launch, add rest post-launch)
- Couples Mode: 45 free Romantic cards + 40 locked Flirty cards

**Spicy content and remaining locked cards:** Can launch with 50% and fill in post-launch update within 2 weeks. Flag in App Store description: "More content added regularly."

---

## 9. User Stories

### US-01: Starting a Party Session
**As a** party host,  
**I want to** add my friends' names and start a game in under 60 seconds,  
**so that** we don't lose momentum during pre-game.

**Acceptance Criteria:**
- Player setup screen loads in <1 second from tapping Party Mode
- Can add 2–8 player names via text fields
- Names are optional — empty fields auto-fill as "Player 1", "Player 2", etc.
- "Let's Go" button is tappable as soon as at least 1 name/slot exists
- First card appears within 1 second of tapping "Let's Go"

---

### US-02: Playing Through a Free Session
**As a** free user,  
**I want to** play a full Short session without hitting the paywall,  
**so that** I can experience the game before deciding to buy.

**Acceptance Criteria:**
- A Short session (15 cards) completes entirely within free content
- All 4 mini-game types appear at least once in a Short session
- No paywall is triggered during a Short session in Party Mode
- No paywall is triggered during a Short session in Couples Mode (Romantic tier)

---

### US-03: Hitting the Paywall Gracefully
**As a** free user playing a Medium session,  
**I want** the paywall to appear without disrupting my experience harshly,  
**so that** I understand what I'm missing without feeling punished.

**Acceptance Criteria:**
- Paywall modal appears mid-session (not at app launch)
- Session is paused — not ended — when paywall appears
- Paywall can be dismissed with a single tap (✕ button)
- After dismissal, session resumes (skips the locked card, draws next free card)
- Paywall shows clearly what's included in the unlock
- No countdown timer or urgency manipulation on the paywall

---

### US-04: One-Time Purchase
**As a** user who wants to unlock the full game,  
**I want to** pay once and never see a subscription screen,  
**so that** I feel like I own the game and got fair value.

**Acceptance Criteria:**
- IAP is a non-consumable, one-time purchase
- After purchase, all locked content is immediately accessible
- App works fully offline with unlocked content (no server validation required for content access)
- "Restore Purchase" option works on reinstall or device change
- No upsell appears to a user who has already purchased

---

### US-05: Undo Accidental Tap (Party Mode)
**As a** slightly drunk player,  
**I want to** undo my accidental "Done" tap,  
**so that** I don't miss a dare or skip my turn unfairly.

**Acceptance Criteria:**
- "↩ Undo last" button is visible on every card screen (not just after tapping Done)
- Tapping Undo on the current card reverses to the previous card
- Undo only works one level back — tapping Undo twice does nothing the second time (or shows a subtle "Nothing to undo" message)
- The undone card is re-inserted into the deck (not discarded) to be drawn later
- Undo is available in both free and paid tiers

---

### US-06: Choosing a Couples Mode Content Tier
**As a** couple,  
**I want to** select our comfort level before starting,  
**so that** neither of us is surprised or made uncomfortable mid-session.

**Acceptance Criteria:**
- Tier selector appears before every Couples session (not just first launch)
- Three options displayed: Romantic, Flirty, Spicy
- Locked tiers show a lock icon and trigger the paywall on tap (not after session start)
- Selected tier is clearly highlighted
- User cannot change tier mid-session (must exit and restart)
- Tier choice persists as the default for the next session (saves last selection)

---

### US-07: Scoring in Couples Mode
**As a couple playing in Couples Mode,**  
**I want to** see a live score during the game,  
**so that** the competitive element stays fun and motivating.

**Acceptance Criteria:**
- Live score counter visible at top of screen during session (both player scores shown)
- Score updates immediately after each card is resolved
- Point values are shown briefly on each card after completion: "+2 pts" animation
- Finale round cards show "2x points" multiplier indicator before the card is played
- Final score screen shows full session breakdown: total cards, points per player, winner

---

### US-08: Non-Drinking Mode (Party Mode)
**As a** user playing with non-drinking friends,  
**I want to** turn off drinking references,  
**so that** the game works at a sober party or family-friendly event.

**Acceptance Criteria:**
- "Drinking Mode" toggle is visible on the player setup screen
- Default state: ON (drinking references included)
- When toggled OFF: All card text swaps drinking penalties for non-drinking alternatives
- Toggle change does not restart a session in progress (if changed mid-session, applies from next card onward)
- Non-drinking variants available for 100% of Party Mode free cards; minimum 80% of locked cards at launch

---

### US-09: Session End and Replay (Couples Mode)
**As a couple finishing a session,**  
**I want to** see our results and have a clear path to play again,  
**so that** the session has a satisfying conclusion and we're motivated to come back.

**Acceptance Criteria:**
- End screen appears automatically when last card is played (no manual "end game" required)
- End screen shows: both player names, final scores, winner (or tie message)
- Winner sees a unique "reward card" (a special fun/affirming prompt)
- "Play Again" reshuffles same tier and same session length
- "Change Mode/Settings" returns to session setup screen
- "Home" returns to the main mode selector
- End screen loads within 1 second of last card completion

---

### US-10: Restore Purchase on New Device
**As a** paid user switching to a new phone,  
**I want to** restore my purchase without paying again,  
**so that** I don't lose what I paid for.

**Acceptance Criteria:**
- "Restore Purchase" button is visible on the paywall modal and in Settings (if implemented in v1.0)
- Tapping Restore triggers native App Store / Play Store restore flow
- On successful restore: All locked content unlocks immediately, confirmation message shown
- On failed restore (no prior purchase found): Friendly message: "No purchase found for this account."
- Restore works without an internet connection to our servers (uses App Store/Play Store native restore)

---

### US-11: Interrupted Session Recovery
**As a** party host,  
**I want** the app to handle phone interruptions gracefully,  
**so that** a call or notification doesn't end our game.

**Acceptance Criteria:**
- When app is backgrounded during a session, session state is preserved
- On return to foreground, user sees the same card they were on
- Session state persists for at least 30 minutes in background
- If app is force-closed and reopened, user sees the home screen (session is lost — this is acceptable for v1.0, but handled gracefully with no error)

---

### US-12: Vote Card — Group Mechanic
**As a** group playing a Vote card,  
**I want** the card to facilitate a group vote without digital infrastructure,  
**so that** the social moment happens in real life, not on a screen.

**Acceptance Criteria:**
- Vote cards instruct players to point at someone simultaneously
- Card text is clear and includes the consequence for the "winner"
- "Done" button advances when the group is ready (honor system — no voting UI needed)
- Group validation is real-world, not digital — this is intentional and must be maintained

---

## 10. Out of Scope for v1.0

The following are explicitly NOT being built for this launch:

1. **User accounts / cloud sync** — No login, no profiles, no saved game history
2. **Multiplayer over the internet / remote play** — All party mode is in-person, same room
3. **Custom card creation by users** — Exception: Custom Dare feature (locked IAP perk) allows adding a dare text to the current session only; it does not persist
4. **Social sharing of scores or cards** — No share-to-Instagram, no screenshot frames
5. **Analytics dashboard / admin panel** — No backend infrastructure at launch
6. **Push notifications** — No "come back and play" notifications
7. **Localization beyond English** — Spanish and Portuguese are high priority for Leo's market (Colombia) but deferred to v1.1
8. **Seasonal / themed packs** — Holiday packs, Valentine's Day packs, etc. — post-launch
9. **Multiple languages per card** — All cards English-only in v1.0
10. **Accessibility features beyond system defaults** — VoiceOver support, dynamic text sizes: v1.1
11. **Android tablets / iPad optimization** — Build for phone form factor first; tablet layout deferred
12. **Web app / browser play** — Mobile native only
13. **Subscription or recurring billing** — Explicitly never (not just deferred)
14. **Friend groups / saved player lists** — No persistent player data
15. **In-app timer / countdown visual** — Challenge Roulette timed challenges use real-world counting or phone clock; no built-in timer UI in v1.0

---

## 11. Success Metrics

### Week 1 Targets (first 7 days post-launch)

| Metric | Target | Stretch |
|--------|--------|---------|
| Total downloads | 500 | 1,500 |
| Day-1 retention | 40% | 55% |
| IAP conversion rate | 5% | 10% |
| Revenue (week 1) | $125 | $375 |
| App Store rating | 4.2+ | 4.5+ |
| Crash-free sessions | 99%+ | 99.5%+ |

### Month 1 Targets

| Metric | Target | Stretch |
|--------|--------|---------|
| Total downloads | 3,000 | 8,000 |
| Paid users | 150 | 500 |
| Revenue (month 1) | $750 | $2,500 |
| App Store rating | 4.3+ | 4.5+ |
| Reviews (App Store + Play Store) | 30+ | 100+ |

### What "successful v1.0" looks like qualitatively:
- Users are recommending it to friends (organic growth signal)
- Reviews specifically call out "no subscription" as a reason they love it
- Couples Mode is praised for being "actually a game" (not just questions)
- Zero 1-star reviews about dark patterns, paywalls, or ads
- At least one review mentions the undo button positively

### Revenue path to Leo's $5K/month goal:
- At $4.99 conversion, need ~1,000 paying users/month
- At 5% conversion, need ~20,000 downloads/month
- Path: strong ASO + Reddit organic marketing + viral party moments → achievable by month 3 with solid reviews

---

## 12. Open Questions

**Status: All critical questions resolved 2026-03-06.**

| # | Question | Decision |
|---|----------|----------|
| Q1 | App Name | ✅ **SpinUp** — locked |
| Q2 | Min player count | ✅ **2–8 players** |
| Q3 | Memory Challenge UX | ✅ **Option A** — sequential single-device input |
| Q4 | Turn assignment | ✅ **Round-robin default**, random mode toggle |
| Q5 | Spicy tier | ✅ **Defer to v1.1** — launch clean at 12+/17+, "Coming Soon" placeholder in paywall |
| Q6 | Card content | ✅ **AI drafts via API** — themed packs, randomized generation, Leo reviews |
| Q7 | Language | ✅ **English-first**, Spanish in v1.1 |
| Q8 | Content update promise | ✅ **Yes** — "All future card packs included" is intentional |
| Q9 | Analytics | ✅ **RevenueCat + App Store Connect** — no custom backend needed at launch |
| Q10 | Drinks disclaimer | ✅ **One-time disclaimer** on first Party Mode launch |

---

## Appendix A: Card Writing Guidelines

For content creators (human or AI) writing cards:

1. **Keep it under 40 words.** Cards are read aloud by drunk people. Short wins.
2. **Be specific, not vague.** "Do 15 push-ups" > "Do some push-ups."
3. **Consequences should be clear.** Always state what the penalty is.
4. **Avoid pop culture references that expire.** Timeless > trendy.
5. **Voting cards need clear criteria.** "Most likely to cry at a Disney movie" is clear. "The most dramatic person" is subjective and argument-prone.
6. **Couples cards should create dialogue, not just answers.** End with an opening for connection.
7. **Test every card aloud.** If it sounds awkward read aloud, rewrite it.

---

## Appendix B: Technical Notes for Architect

*(Non-binding — for context only. Architect to validate and override as needed.)*

- **Platform:** React Native + Expo (managed workflow preferred for speed)
- **IAP:** RevenueCat SDK recommended for cross-platform IAP abstraction
- **Content storage:** Cards stored as local JSON bundles (no network dependency for gameplay). Locked cards bundled in app but gated by IAP entitlement check via RevenueCat.
- **State management:** Zustand or React Context for session state (no Redux overhead needed)
- **Session persistence:** AsyncStorage for session state (survive backgrounding)
- **No backend required for v1.0** — all logic is client-side
- **Analytics (optional, v1.0):** RevenueCat + App Store Connect is sufficient. No custom backend events needed at launch.
- **App size target:** Under 30MB download size (no large assets in v1.0)

---

*PRD v1.0 — Ready for Designer and Architect review.*  
*Next step: Leo reviews Open Questions, PM Agent generates card content.*
