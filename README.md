# RepQuest

RepQuest is a progression-based learning game for understanding sports.
It teaches rules, reads, responsibilities, terminology, and strategy through
short interactive modules rather than static lessons or generic trivia.

## Current product slice

- 23-sport learning hub with a guided beginner playbook before every general quiz
- Real 8-second game clips for 22 sports, with an accuracy-first review placeholder for flag football
- Separate tackle-football and flag-football paths, including women’s tackle represented by the WNFC

## Creative Commons video credits

- `public/sport-clips/field-hockey.mp4` and its mobile copy are trimmed, resized, and muted from [Field Hockey vs Shenandoah Highlights](https://commons.wikimedia.org/wiki/File:Field_Hockey_vs_Shenandoah_Highlights.webm) by Stevenson Mustangs, licensed [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
- `public/sport-clips/lacrosse.mp4` and its mobile copy are trimmed, resized, and muted from [Colorado Mammoth's Drew Westervelt Scores Amazing Dunk Goal](https://commons.wikimedia.org/wiki/File:National_Lacrosse_League-_Colorado_Mammoth%27s_Drew_Westervelt_Scores_Amazing_Dunk_Goal!.webm) by NLL / National Lacrosse League, licensed [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
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
