# Sports IQ

A fast, mobile-first sports trivia game for fans who know more than the score.

## The game

- Four modes: All Sports, Pro Leagues, College Sports, and Legends & Records
- Timed questions with speed and streak bonuses
- Immediate answer explanations
- Local personal-best tracking
- Keyboard and touch controls
- Responsive, reduced-motion-friendly interface

Questions live in `app/questions.ts`, separate from the game interface, so the
question bank can grow without changing the screen logic.

## Run locally

Requires Node.js 22.13 or newer and pnpm.

```bash
pnpm install
pnpm run dev
```

Open the local URL printed by the development server.

## Verify a production build

```bash
pnpm run build
node --test tests/rendered-html.test.mjs
```

The site uses vinext and is configured for Cloudflare-compatible OpenAI Sites
hosting through `.openai/hosting.json`.
