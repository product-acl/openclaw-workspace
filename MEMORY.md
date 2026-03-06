# MEMORY.md — BAIcan Long-Term Memory

_Distilled knowledge. Updated over time. Main session only._

---

## Who I Am
- Name: BAIcan 🦾
- Role: CPO/CTO for Leo's one-person tech business
- I supervise a team of agents and report to Leo
- Full org documented in `TEAM.md`

---

## Who Leo Is
- Leonardo Diaz — call him Leo
- Ex-product manager (7 years, most recently Frubana)
- Chemical engineer background (top of class, Universidad de los Andes)
- Building a one-person tech business using AI agents
- Goal: $5,000/month revenue
- Runway: 2-3 months
- Stack: React Native / Expo, Claude Code on VS Code
- Triathlete, volunteer at TECHO, based in Bogotá, Colombia

---

## The Business Model
- Find pain points (Reddit, forums, App Store reviews)
- Build apps/SaaS that solve them
- Ship → promote → repeat
- Leo is CEO, I'm CPO/CTO, agents do the work

---

## Current Product — Party & Couples Game App

### Concept (LOCKED 2026-03-06)
One app, two modes:
- 🍺 **Party mode** — drinking game for groups (3-8 players)
- 💑 **Couples mode** — game for two (real mechanics, not just questions)

### Why it wins
- Drinking games market: $500K/month (Picolo is the leader, users hate their subscription)
- Our edge on drinking: fair pricing, one-time $4.99 unlock, undo button
- Couples games: 80% of competitors are question dumps
- Our edge on couples: actual game mechanics, no mid-session ads
- One download → two audiences → broader reach

### Pain points we solve
- No predatory subscription (one-time $4.99 unlocks everything)
- Undo button for drunk accidental taps
- Real game mechanic for couples, not just a question list
- No ads during intimate/couples moments

### Monetization
- Free core experience (enough to hook)
- $4.99 one-time "Unlock All" IAP — no subscription ever

### Platform
- iOS + Android via Expo/React Native

### Timeline
- Production-ready build (not in stores): Sunday 2026-03-08
- Sprint agents: PM, Designer, Architect, Coder, Reviewer

---

## Agent Team
Full details in `TEAM.md`. Summary:
- BAIcan = CPO/CTO (me)
- Engineering: Architect, Coder, Reviewer, DevOps
- Product: Scout, PM, Designer, Product Marketer, Growth, Analyst
- This week's active agents: PM, Designer, Architect, Coder, Tester, Reviewer

---

## Key Decisions Log
- 2026-03-06: Agent org designed, documented in TEAM.md
- 2026-03-06: Game app concept locked — party + couples dual-mode
- 2026-03-06: Monetization = one-time IAP, no subscription
- 2026-03-06: Store deployments via EAS CLI (Expo), DevOps runs autonomously post Leo setup
- 2026-03-06: Growth must draft-then-approve before using message tool (no auto-posting)
- 2026-03-06: App name = **SpinUp**
- 2026-03-06: PM finished PRD → `products/party-couples-game/PRD.md`
- 2026-03-06: Designer finished design system → `products/party-couples-game/design-system.md` + `screens/`
- 2026-03-06: Architect finished tech spec → `products/party-couples-game/tech-spec.md`
- 2026-03-06: Coder not yet started — waiting on Leo's go-ahead
- 2026-03-06: Identified memory loss bug (sessions not writing to daily log mid-session) — fix = sub-agents write to memory + ping Leo on Telegram when done
- 2026-03-06: Model policy updated — Architect/PM/Analyst → R1; Scout/PMM/Growth → V3; Designer/Tester/DevOps → Haiku; all 11 agents now standalone in openclaw.json with own workspaces
- 2026-03-06: Model policy updated — Coder → DeepSeek V3 (`deepseek/deepseek-chat`), Reviewer → Sonnet, BAIcan → Sonnet, everyone else → Haiku
- 2026-03-06: **Marketing foundation complete** — Product Marketer created positioning doc, app store listing, and visual brief in `/home/ubuntu/.openclaw/workspace/products/party-couples-game/marketing/`. Positioning angle: "Two games in one. Party or couples. No subscription." App Store headline: "SpinUp: Party & Couples Game". Visual brief includes app icon concepts and 6 screenshot layouts.

---

## Process Fixes (Active)
- Sub-agents must: (1) append summary to `memory/YYYY-MM-DD.md` when done, (2) send Leo a Telegram message via `message` tool on completion
- I must update MEMORY.md with key decisions during sessions, not just at end
