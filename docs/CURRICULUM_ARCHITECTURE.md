# RepQuest curriculum architecture

> Current scope (2026-10-26): [FIVE_SPORT_GAME_PLAN.md](FIVE_SPORT_GAME_PLAN.md) is the controlling specification for the five-sport, video-free experience. Older catalog, media, and age-depth details below describe retained legacy content, not the new primary course or release approval.


**Reviewed:** August 16, 2026

**Scope:** Shared web, iOS, and Android curriculum contract

## Coverage

- 24 sports
- 152 position, discipline, skill, or event paths
- 456 specialized modules at full depth
- 202 total eligible modules for ages 7–9 and 10–12
- 354 total eligible modules for ages 13–15
- 506 total eligible modules for ages 16–17 and 18+

These numbers come from the same runtime catalog used to render paths and
calculate progress. A path is not considered curriculum-approved merely because
it exists in the catalog.

## Three-level learning model

| Level | Eligible ages | Learner outcome | Unlock rule |
|---|---|---|---|
| Foundation | 7+ | Name the role, locate it, identify its responsibility, first read, and basic decision sequence | First module in every role is open |
| Tactics | 13+ | Connect sport-specific game state, live keys, communication, pressure, and responsibility | Complete that role's Foundation module |
| Mastery | 16+ | Diagnose counters, adjust, manage risk, evaluate evidence, and transfer the process | Complete that role's Tactics module |

General IQ and Position/Event IQ are parallel. A learner may begin any role's
Foundation module without completing General IQ. Prerequisites never cross from
one position path into another.

## Sport-specific decision lenses

| Sport | Tactical picture |
|---|---|
| Tackle football | Formation, personnel, front, leverage, down and distance |
| Flag football | Spacing, rush rules, open grass, flags, red zone, and clock |
| Basketball | Advantage, help, screens, spacing, coverage, and shot clock |
| Soccer | Pressure, support, opponent lines, transitions, overloads, and game state |
| Volleyball | Rotation, setter, pass quality, hitter approach, block, and tempo |
| Baseball | Count, outs, runners, inning, field alignment, and pitch/contact evidence |
| Softball | Count, short game, runner pressure, coverage, and tempo |
| Ice hockey | Puck pressure, support, gap, zone, forecheck, and line change |
| Lacrosse | Crease, slide package, transition numbers, matchup, and extra-player state |
| Rugby | Gain line, breakdown, phase shape, defensive fold, and kick space |
| Field hockey | Press, transfer, circle entry, counterpress, and set piece |
| Water polo | Center battle, drives, perimeter shape, exclusion, and possession clock |
| Cricket | Line, length, field, wickets, innings phase, and required rate |
| Tennis | Serve/return pattern, court position, ball height, score, and recovery |
| Track and field | Event phase, rhythm, marks, legal execution, conditions, and pacing |
| Swimming | Stroke phase, turns, underwater limits, pacing, and relay exchange |
| Gymnastics | Body shape, apparatus position, connections, composition, and landing risk |
| Pickleball | Two-bounce state, non-volley zone, transition, stacking, and speed-ups |
| Badminton | Base, shuttle height, partner rotation, attack/defense, and tempo |
| Golf | Lie, wind, target, dispersion, hazards, and next-shot angle |
| Cycling | Draft, pace, line, surface, group position, and race situation |
| MMA | Range, legal target, phase transition, position, score, and safety |
| Wrestling | Stance, tie, control, exposure, style, boundary, score, and clock |
| Bowling | Target, ball path, pocket entry, spares, lane transition, and format |

Each individual module combines its sport lens with the role's own responsibility
and first read from `POSITION_READS`. Football keeps hand-authored QB coverage and
linebacker terminology modules where a generic generator would lose necessary
scheme nuance.

## Source and editorial contract

Every module declares one or more source IDs from `app/content-registry.ts`.
Every sport has at least one governing-body or recognized regulatory source with
a named ruleset, review date, and next-review date.

Before publication, a named sport-domain reviewer must still confirm:

1. The chosen ruleset and every variant caveat are accurate.
2. Every term used in a check was taught first.
3. The correct answer is defensible and distractors are not also correct under
   the stated ruleset.
4. The reading load and interaction are appropriate for the age path.
5. Spatial decisions have an approved diagram or visual when words alone are
   insufficient.
6. The module's source IDs actually support its assessed concepts.

Source registration provides traceability. It is not a substitute for this
human approval.

## Progress and compatibility contract

- `learningModulePathsForSport` is the prerequisite source of truth.
- `eligibleLearningModulesForSport` is the progress denominator.
- `sportProgressSummary` drives web and mobile percentages.
- `migrateCompletedModuleIds` maps legacy unsafe IDs before evaluation.
- IDs must match `[a-z0-9][a-z0-9-]*` so measurement never silently drops a
  completion.
- First completion awards XP; replay builds practice/mastery without repeat XP.

Any future database/API must reproduce these rules on the server before cloud
progress or public leaderboards can be trusted.

## Continuous game-path model

RepQuest does not treat a path node as one four-question quiz. The intended
hierarchy is:

`sport → section → unit → node → coached reps → review → game simulation`

The first production-shaped vertical slice is Tackle Football General IQ,
Unit 1: **Find the End Zone**. It contains eight visible nodes and 48 authored
interactions before age adaptation:

1. Film Room: see the whole field.
2. Coach Audio: understand the snap and start of a play.
3. Field Read: move the chains through downs and distance.
4. Match-Up: connect offense, defense, and special teams.
5. Scenario: finish a drive and score.
6. Film Review: protect possession and learn from turnovers.
7. Checkpoint: solve connected game situations.
8. Game Day: complete a full beginner drive.

The visual path and prerequisite engine are shared by web, iOS, and Android.
Existing football completion IDs remain valid, so adopting the new projection
does not erase player progress or award duplicate XP.

### Learning loop

- Target 70–75% active decisions and direct manipulation, with 25–30% short
  film, audio, and coach instruction.
- Teach a term before assessing it.
- After a wrong answer, explain the cause, show the correct read, and append a
  reworded coached replay later in the same session.
- Reshuffle choices on replay and award less replay XP.
- Mark a concept recovered when the learner answers the later version
  correctly.
- Finish units with a connected multi-play simulation rather than a larger
  trivia set.
- Follow simulations with Film Review: Smart Read, Missed Read, Fix This, and
  an interactive rewind to the pre-decision state.

Core learning never uses punitive lives. Especially for ages 7–12, a mistake
is a teaching event, not a reason to end a lesson. Optional challenges may use
limited-play language only when the learner can continue the core path without
payment or waiting.

### Age presentation

| Age | Path presentation | Rep design |
|---|---|---|
| 7–9 | Avatar-led, listen-first, large icons, two answer choices, no timer | Three short interactions per node plus any recovery replay |
| 10–12 | Visual coach, short copy, 60-second timer | Full authored node with concrete game situations |
| 13–15 | Standard path, 45-second timer, terminology and tactics | Full node plus intermediate decisions |
| 16–17 | 35-second timer, disguise/counter concepts | Full node plus advanced reads |
| 18+ | 30-second timer, realistic distractors and scheme caveats | Full node plus advanced reads |

### Scale gate for other sports

The current 24-sport catalog proves breadth and shared infrastructure; it does
not mean every sport has received the same human-authored depth as this pilot.
Before a sport receives the continuous path UI, it must have:

1. A named sport-domain reviewer and selected governing ruleset.
2. Section and unit outcomes written from beginner understanding through
   advanced decision-making.
3. At least eight varied nodes per unit and meaningful recurrence of each key
   concept in three contexts.
4. Real interaction specifications for field/court reads, matching, ordering,
   and scenarios—not a text-choice control labeled as a hotspot.
5. Rights-cleared, discipline-correct media with documented provenance.
6. Early-reader and older-player variants reviewed independently.
7. Cross-platform progress, retry, mastery, and migration tests.

The recommended conversion order is Tackle Football General IQ, Quarterback,
Inside/Outside Linebacker, the remaining football rooms, then one sport at a
time based on domain-review capacity. Generic generated modules can remain
available as alpha scaffolding, but they must not be represented as
editorially production-ready curriculum.
