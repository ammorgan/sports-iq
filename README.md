# Sports IQ

Sports IQ is a progression-based learning game for understanding team sports.
It teaches rules, reads, responsibilities, terminology, and strategy through
short interactive modules rather than static lessons or generic trivia.

## Current product slice

- 12-sport learning hub with independent experience placement per sport
- General Sport IQ and Position IQ pathways
- Six-level progression model from Rookie through Pro
- Football Fundamentals and Rookie sample modules
- Every major football position plus representative positions for other sports
- Multiple choice, multi-select, true/false, ordering, scenario, and field interactions
- Immediate conversational feedback and in-module remediation
- Concept-level mastery, adaptive question ordering, XP, streaks, badges, and daily goals
- Progress, badge, and profile dashboards
- Device-local persistence and dark mode
- Responsive keyboard- and touch-friendly interface

The structured content model is in `app/learning-data.ts`. UI and game-engine
logic are in `app/page.tsx`. The content types are generic across sports and can
grow into database-backed modules without changing the module player.

## Run locally

Requires Node.js 22.13 or newer and pnpm.

```bash
pnpm install
pnpm run dev
```

## Verify a production build

```bash
pnpm run build
node --test tests/rendered-html.test.mjs
```

The site uses vinext and is configured for Cloudflare-compatible OpenAI Sites
hosting through `.openai/hosting.json`.
