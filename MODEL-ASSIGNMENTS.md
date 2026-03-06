# AI Team — Model Assignments & Pipeline

## Guiding Principles

- **Tool use needed?** → Claude (most reliable multi-turn agentic behavior)
- **Pure reasoning/drafting?** → DeepSeek R1 (chain-of-thought, cheaper)
- **High volume text generation?** → DeepSeek V3 (fast, very cheap)
- **Final external-facing output?** → Claude Sonnet (quality bar)
- **Agentic loops at low cost?** → Claude Haiku 4.5

Available APIs: Anthropic (Claude), OpenAI, DeepSeek

---

## 🏗️ Engineering Squad

### Architect
- **Model:** DeepSeek R1
- **API Key:** `$DEEPSEEK_API_KEY_ARCHITECT`
- **Why:** Pure reasoning — system design, breaking epics into tasks, writing tech specs. No tools needed. R1's chain-of-thought is ideal for structured technical thinking.
- **Output:** Tech spec document, task breakdown, handoff to Coder

### Coder
- **Model:** Claude Sonnet (via Claude Code)
- **Why:** Non-negotiable. Claude Code requires reliable tool use, multi-turn context, and high code quality. This is where cutting costs hurts the most.
- **Output:** Implementation, PRs, branches ready for review

### Tester
- **Model:** Claude Haiku 4.5
- **Why:** Needs tool use to read code, write test files, and run jest. No deep reasoning needed — consistent and fast.
- **Input:** Coder's implementation + tech spec
- **Output:** Test suite, pass/fail report, bug list

### Reviewer
- **Model:** Claude Haiku 4.5
- **Why:** Reads diffs and specs, checks logic, flags issues. Fast and reliable instruction-following. No deep reasoning needed, just consistent QA.
- **Input:** Coder's PR + original spec from Architect
- **Output:** Approval or list of required changes

### DevOps
- **Model:** Claude Haiku 4.5
- **Why:** Needs tool use for CLI commands, EAS builds, App Store submissions, deployment scripts. Haiku's agentic reliability at low cost.
- **Output:** Deployed builds, CI/CD runs, submission confirmations

---

## 📦 Product Squad

### Scout
- **Model:** DeepSeek V3 + web search
- **API Key:** `$DEEPSEEK_API_KEY_SCOUT`
- **Why:** Bulk research — Reddit, forums, App Store reviews, competitor analysis. High volume, lower stakes. DeepSeek API is cheapest for this.
- **Output:** Research brief fed into PM

### PM
- **Model:** DeepSeek R1 (draft) → Claude Haiku 4.5 (polish)
- **API Key (draft):** `$DEEPSEEK_API_KEY_PM`
- **Why:** R1 drafts PRDs and user stories with structured reasoning. Haiku does a fast cleanup pass for formatting and consistency before handoff.
- **Input:** Scout's research brief
- **Output:** PRD, user stories, backlog — fed into Architect and Designer

### Designer
- **Model:** Claude Haiku 4.5 + Figma MCP
- **Why:** Tool use is required for design agent loops (generate → review → iterate → export). Haiku is the sweet spot — reliable multi-turn tool calls at reasonable cost.
- **Recommended MCPs:** Figma MCP (official), Framelink, fal.ai/Replicate for image gen
- **Input:** PM's user stories and UX flows
- **Output:** Figma components, screen specs, design system updates

### Product Marketer
- **Model:** DeepSeek V3 (draft) → Claude Sonnet (polish)
- **API Key (draft):** `$DEEPSEEK_API_KEY_PRODUCT_MARKETER`
- **Why:** DeepSeek handles the bulk drafting of positioning docs, ICP definitions, competitor teardowns. Sonnet polishes final copy since this goes external.
- **Input:** Scout's research + PM's PRD
- **Output:** Launch brief, positioning doc, competitor teardown

### Growth
- **Model:** DeepSeek V3
- **API Key:** `$DEEPSEEK_API_KEY_GROWTH`
- **Why:** ASO copy, Reddit posts, social content — high volume, iterative, pure text generation. No tool use needed.
- **Input:** Product Marketer's positioning doc
- **Output:** ASO metadata, social posts, Reddit launch copy

### Analyst
- **Model:** DeepSeek R1
- **API Key:** `$DEEPSEEK_API_KEY_ANALYST`
- **Why:** Metrics analysis, KPI interpretation, pattern recognition across weekly data. Strong reasoning, no tools required.
- **Input:** Raw KPI data, weekly numbers
- **Output:** Weekly report, flags, recommendations

---

## Pipeline Flow

```
Scout (DeepSeek V3)
 └─→ PM (DeepSeek R1 → Haiku polish)
 └─→ Architect (DeepSeek R1) Designer (Haiku + Figma MCP)
 └─→ Coder (Claude Code) ←── [runs in parallel with Architect]
 └─→ Reviewer (Haiku)
 └─→ DevOps (Haiku)
 └─→ 🚀 Ship

Product Marketer (DeepSeek → Sonnet) ──┐
Growth (DeepSeek V3) ──────────────────┤ [run in parallel with Engineering]
Analyst (DeepSeek R1) ─────────────────┘
```

---

## Handoff Rules

1. **Each agent receives the previous agent's full output as input** — no agent starts from scratch.
2. **Shared context document** — maintain a running project doc (PRD + spec + decisions) that all agents can reference.
3. **Draft → Review → Polish pattern** — DeepSeek drafts, Claude reviews/polishes for anything external-facing or going into production.
4. **Reviewer always gets both** the original spec AND the implementation to compare against.

---

## Cost Distribution (approximate)

| Layer | Models | % of Volume |
|---|---|---|
| Drafting & research | DeepSeek R1 + V3 | ~60–70% |
| Agentic loops & review | Claude Haiku 4.5 | ~20–25% |
| Final polish & coding | Claude Sonnet | ~10–15% |

Sonnet only touches external-facing copy and Claude Code. Everything else is DeepSeek or Haiku.

---

## Model Reference

| Model | API | Best For |
|---|---|---|
| DeepSeek R1 | DeepSeek API | Deep reasoning, structured drafts, analysis |
| DeepSeek V3 | DeepSeek API | High-volume text, research, content generation |
| Claude Haiku 4.5 | Anthropic API | Agentic loops, tool use, fast review passes |
| Claude Sonnet | Anthropic API | Final polish, Claude Code, external copy |
