# RepQuest

> Current release scope (2026-10-27): five published sports, no video playback, ten authored sections per core sport course, and optional position training. See [the current game and curriculum plan](docs/FIVE_SPORT_GAME_PLAN.md) and [validation limits](docs/FIVE_SPORT_VALIDATION.md). Older 24-sport/media descriptions below are retained as historical platform context; they are not the current published UI.


RepQuest is a progression-based learning game for understanding sports.
It teaches rules, reads, responsibilities, terminology, and strategy through
short interactive modules rather than static lessons or generic trivia.

## Current product slice

- 24-sport learning hub with a guided beginner playbook before every general quiz
- Real 6–8 second game clips appear only after the sport, publication date, and reuse rights pass review
- Separate tackle-football and flag-football paths, with women’s, men’s, youth, and coed formats represented without tying the curriculum to one league

## Creative Commons media records

- `public/sport-clips/field-hockey.mp4` and its mobile copy are trimmed, resized, and muted from [Field Hockey vs Shenandoah Highlights](https://commons.wikimedia.org/wiki/File:Field_Hockey_vs_Shenandoah_Highlights.webm) by Stevenson Mustangs, licensed [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
- The local USA Football flag-football excerpt is retained only as a review record. Its Commons record still requires independent license confirmation, so RepQuest does not publish it as verified footage.
- The local NLL lacrosse excerpt is retained only as a review record. Its source is old and its Commons license review is incomplete, so RepQuest does not publish or bundle it as verified footage.
- General Sport IQ and independently selectable Position/Event IQ pathways
- Age-gated position/event progression: foundation for ages 7+, tactical reads for ages 13+, and mastery/adjustment work for ages 16+
- 152 role/event paths across all 24 sports, with authoritative governing-source records and safe prerequisite enforcement
- Truthful age-specific progress totals shared by web and mobile
- Multiple choice, multi-select, true/false, ordering, scenario, and field interactions
- Immediate conversational feedback and in-module remediation
- Concept-level mastery, adaptive question ordering, XP, streaks, badges, and daily goals
- Progress, badge, and profile dashboards
- Device-local persistence and dark mode
- Responsive keyboard- and touch-friendly interface

The structured content model is in `app/learning-data.ts`; sport-specific
decision profiles are in `app/position-curriculum.ts`; source governance is in
`app/content-registry.ts`. Web and mobile consume the same catalog, prerequisite
paths, legacy-ID migration, and progress calculation.

The beta is curriculum-platform ready, not approved for unattended public
launch. Human sport-SME review, youth usability/accessibility studies, final
media acquisition, legal approval, managed authentication, and server-owned
progress remain explicit production gates.

See `docs/CURRICULUM_ARCHITECTURE.md` for coverage, age gates, sport-specific
decision lenses, source requirements, and the editorial publication gate.

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
