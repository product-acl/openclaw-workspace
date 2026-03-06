# /agents — Agent Prompt Library

Each file here is the base prompt for a reusable team agent.
BAIcan loads the relevant file and appends the specific task before spawning.

## Agents

| File | Role |
|------|------|
| `pm.md` | Product Manager — writes PRDs, user stories, backlogs |
| `designer.md` | UX/UI Designer — user flows, screen specs, design system |
| `architect.md` | Lead Engineer — tech specs, system design, task breakdowns |
| `coder.md` | Full-Stack Developer — implementation via Claude Code/Codex |
| `reviewer.md` | QA / Code Reviewer — quality gate before merge |
| `devops.md` | DevOps — builds, EAS CLI, App Store submissions |
| `scout.md` | Market Researcher — pain point scanning, signal validation |
| `product-marketer.md` | Positioning & Messaging — ICP, launch brief |
| `growth.md` | Distribution — ASO, social, launch execution |
| `analyst.md` | Data & Metrics — KPIs, dashboards, weekly reports |

## How to Spawn an Agent

```
1. read /agents/[role].md
2. Append the specific task to the prompt
3. sessions_spawn with the combined prompt
```

## File Conventions

All agent outputs go to:
- `/workspace/products/[product-name]/` — product artifacts
- `/workspace/research/pain-points/` — Scout findings
- `/workspace/products/[product-name]/reports/` — Analyst reports
