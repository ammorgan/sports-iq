# RepQuest Youth Product Audit and Redesign Blueprint

**Audit date:** September 8, 2026

**Primary audience:** ages 7–12

**Surfaces reviewed:** responsive web, Expo iOS/Android, shared curriculum, media registry, progress model, privacy/account gates, tests, and product documentation

## Executive decision

RepQuest has a strong, differentiated foundation: 24 sports, 152 role/event paths, source-backed content, age-aware pacing, private child profiles, mistake recovery, real sport clips, progress integrity, and web/mobile delivery. The product should be preserved and substantially rebuilt around one promise:

> **See the play. Make the call. Build game sense.**

The current experience is still primarily a large sports catalog followed by primers and answer cards. Its football map looks more like a game, but most node labels do not yet represent distinct gameplay. For a 7-year-old, the product can be navigated, but too much success still depends on reading small text and understanding instructional labels. For an experienced 12-year-old, most non-football paths are too shallow and templated to feel like meaningful craft development.

The recommended redesign is not a visual reskin. It changes the product from **content library → quiz → score** into **visual situation → player decision → immediate consequence → coached replay → mastery progression**.

No sport should be removed. Existing progress IDs, XP receipts, privacy protections, curriculum sources, videos, avatars, age bands, position paths, legal controls, and accessible fallbacks must survive the transition.

## Evidence and method

This audit used:

- live desktop and 390 × 844 responsive walkthroughs on the local application;
- static inspection of the web, React Native, shared curriculum, governance, database, media, and documentation code;
- runtime catalog analysis of all age-eligible modules and challenges;
- fresh typechecking, linting, and the complete 51-test suite;
- official product, accessibility, platform-policy, and sports-learning research.

Current evidence captures:

- [Desktop home](../.audit/redesign-2026-09-08/screenshots/01-home-desktop.png)
- [Phone home](../.audit/redesign-2026-09-08/screenshots/02-home-phone.png)
- [Phone football arena](../.audit/redesign-2026-09-08/screenshots/03-football-phone.png)
- [Phone football path](../.audit/redesign-2026-09-08/screenshots/04-football-path-phone.png)
- [Phone early-reader primer](../.audit/redesign-2026-09-08/screenshots/05-lesson-phone.png)
- [Phone primer-to-play transition](../.audit/redesign-2026-09-08/screenshots/06-lesson-start-phone.png)
- [Phone question](../.audit/redesign-2026-09-08/screenshots/07-question-phone.png)
- [Phone wrong-answer recovery](../.audit/redesign-2026-09-08/screenshots/08-wrong-feedback-phone.png)

## 1. Current product inventory

### Product surfaces

| Surface | Current implementation | State |
|---|---|---|
| Web app | Vinext, React 19, TypeScript | Working responsive single-page product |
| iOS/Android | Expo SDK 55, React Native 0.83 | Working native app and TestFlight-shaped project |
| Shared curriculum | TypeScript catalog imported by both clients | Working, but shipped as a large monolith |
| Persistence | Browser local storage / React Native AsyncStorage | Working local beta only |
| Accounts | Provider-selection UI and future database schema | Intentionally disabled; not authenticated |
| Child privacy | Neutral age band, private local child play, no under-13 product measurement | Strong beta default to preserve |
| Public league | 13+ opt-in design and API shape | Not account-ready; under-13 remains private |
| Legal | Privacy Notice, Terms, export/reset/delete controls | Working beta drafts; counsel/operator completion remains a launch gate |

### Routes and screens

**Web routes**

- `/` — all interactive child/player states
- `/privacy` — Privacy Notice
- `/terms` — Terms of Use
- `/api/account/config` — provider readiness
- `/api/privacy/verify-human` — Turnstile verification
- `/api/leaderboard` — public 13+ leaderboard surface

**Web states within `/`**

- privacy age gate;
- parent handoff or account/guest choice;
- legacy welcome/profile setup and Quick Play;
- Learn home;
- sport arena;
- Learn the Game path;
- Position/Event IQ room list;
- position/event roadmap;
- primer;
- challenge;
- result celebration;
- Progress;
- League;
- Badges;
- Player Profile and Privacy Center.

**Mobile states**

- privacy age gate;
- parent handoff or guest choice;
- legacy profile setup;
- home;
- sport arena;
- primer;
- quiz;
- result;
- profile;
- league;
- in-app privacy/terms.

The legacy welcome/profile setup is effectively bypassed on both surfaces because completing the privacy gate assigns the name `Player`. This means the promised Quick Play and avatar-first onboarding do not occur for a normal new user.

### Sports and content inventory

All 24 sports remain in scope. Counts below are generated from the current catalog. “Young modules” means age 7–9 eligible; “full modules” means age 16+ eligible.

| Sport | Roles/events | General modules | Young modules | Full modules | 7–9 challenges | 16+ challenges | Clip state |
|---|---:|---:|---:|---:|---:|---:|---|
| Tackle Football | 20 | 8 | 28 | 68 | 84 | 343 | Verified |
| Flag Football | 7 | 2 | 9 | 23 | 26 | 111 | Rights review required |
| Basketball | 5 | 2 | 7 | 17 | 21 | 82 | Verified |
| Soccer | 7 | 2 | 9 | 23 | 27 | 113 | Verified |
| Volleyball | 6 | 2 | 8 | 20 | 24 | 98 | Verified |
| Baseball | 7 | 2 | 9 | 23 | 27 | 112 | Verified |
| Softball | 5 | 2 | 7 | 17 | 21 | 82 | Verified |
| Ice Hockey | 4 | 2 | 6 | 14 | 18 | 67 | Verified |
| Lacrosse | 5 | 2 | 7 | 17 | 21 | 84 | Rights review required |
| Rugby | 9 | 2 | 11 | 29 | 32 | 141 | Verified |
| Field Hockey | 4 | 2 | 6 | 14 | 18 | 68 | Verified |
| Water Polo | 5 | 2 | 7 | 17 | 21 | 83 | Editorial review required |
| Cricket | 6 | 2 | 8 | 20 | 24 | 98 | Verified |
| Tennis | 6 | 2 | 8 | 20 | 24 | 98 | Verified |
| Track & Field | 6 | 2 | 8 | 20 | 24 | 97 | Verified |
| Swimming | 6 | 2 | 8 | 20 | 24 | 97 | Verified |
| Gymnastics | 6 | 2 | 8 | 20 | 24 | 99 | Editorial review required |
| Pickleball | 5 | 2 | 7 | 17 | 21 | 82 | Verified |
| Badminton | 5 | 2 | 7 | 17 | 21 | 82 | Verified |
| Golf | 5 | 2 | 7 | 17 | 21 | 82 | Verified |
| Cycling | 6 | 2 | 8 | 20 | 24 | 99 | Verified |
| Mixed Martial Arts | 5 | 2 | 7 | 17 | 21 | 83 | Verified striking example only |
| Wrestling | 6 | 2 | 8 | 20 | 23 | 96 | No approved clip |
| Bowling | 6 | 2 | 8 | 20 | 24 | 98 | Verified |

Totals:

- 24 sports;
- 152 role/event definitions;
- 54 General IQ modules;
- 456 age-16+ position/event modules;
- 206 age-7–12 eligible modules;
- 615 age-7–9 challenge records;
- 979 age-10–12 challenge records;
- 2,495 age-16+ challenge records;
- 24 beginner guides;
- 23 sport clips: 19 verified, 4 awaiting rights/editorial review, and wrestling unmapped;
- 28 governing-source records;
- 22 avatars;
- 8 badges.

### Current learning activities

The data model declares six challenge types:

- choice;
- true/false;
- scenario;
- ordering;
- multiple selection;
- hotspot.

The visible engine has three functional interaction patterns:

1. choose one answer;
2. choose multiple answer cards;
3. tap answer cards in sequence.

`scenario` and `hotspot` are primarily content labels. A hotspot does not yet ask the player to touch a meaningful location on a field/court image. Scenarios still end as answer-card selection. The football path includes film, audio, field-read, match, scenario, review, checkpoint, and boss node labels, but those nodes all project into the same primer/challenge engine.

### Current reward and retention systems

- XP, awarded only on first module completion;
- completion and perfect bonuses;
- daily 100 XP goal on web;
- day streak on web;
- answer streak/combo during older-player lessons;
- five player ranks: Rookie Reader, Game Scout, Field General, Sports Scholar, Arena Elite;
- eight badges;
- completion percentage by sport;
- private personal milestone league for children;
- public alias-only league design for opted-in 13+ accounts;
- recent activity and concept mastery on web;
- result celebration with avatar, accuracy, and continue-path action;
- wrong answers return later as a generated coached replay.

### Reusable assets and components worth preserving

- `SPORTS`, positions, modules, challenges, age bands, and stable progress IDs;
- authoritative content-source registry;
- media provenance and review metadata;
- `GamePathUnit` and sequential unlock logic;
- first-completion-only XP and immutable receipt intent;
- age-based timers, including no timer for 7–9;
- child privacy and measurement gates;
- diverse motivational avatar catalog;
- sport icon mapping;
- web/mobile result celebration;
- mistake replay behavior;
- optional source disclosure for adults;
- reduced-motion support already started in web CSS and avatar animation;
- test coverage for curriculum presence, IDs, progression, privacy, media, and question integrity.

## 2. Flow-by-flow health audit

| Step | Current health | Evidence | Main risk | Redesign decision |
|---|---|---|---|---|
| Age/privacy gate | Healthy beta safeguard | Age band, legal acknowledgement, child local mode | Too much legal/account context before first delight | Keep neutral age choice; shorten child-facing copy; move adult detail behind a grown-up link |
| First-run setup | Broken/inconsistent | Privacy completion sets `Player`, bypassing legacy setup | Avatar choice and Quick Play can be unreachable | Replace with sport-first play; earn avatar setup after first win |
| Home | Partly usable | Phone says “Pick a sport” and shows 24 cards | Returning player must scan a library; no meaningful Daily Challenge; four nav items compete | Make Continue Playing dominant; show My Sports row, Daily Rep, Explore below fold |
| Sport arena | Strong visual direction | Sport icon, real clip, progress, two stacked path buttons | Too much explanation before the choice; video is passive | Lead with next rep and two clear modes; move clip into a Film Room node |
| Football path | Best current product idea | 8-node field map, current/locked/complete states, avatar coach | Very tall 1,180px map; tiny labels; node types do not change gameplay | Preserve the map metaphor; make every node a real mechanic and each unit 5–8 short nodes |
| Other sport paths | Weak/inconsistent | Two general cards and three-level role roadmaps | Feels unlike football; promises deep paths that do not exist | Project all sports through the shared path engine after content reaches quality gates |
| Primer | Clear but reading-led | Four slides before questions | 665 early-reader slides; some generated titles reach 41 words | Replace most slides with a 5–15 second demonstration plus one action |
| Challenge | Visually clean | Large question and two answer cards for 7–9 | Still a test; generic visual repeats the answer label; no direct manipulation | Make 70–75% of reps field/film manipulation; reserve answer cards for retrieval |
| Wrong answer | Good emotional tone | “Good try,” explanation, later replay | Explanation is still text; replay can be a reworded card instead of a changed situation | Show consequence, freeze, coach one cue, retry with a visual variant |
| Result | Strong continuation intent | XP, accuracy, avatar, continue path | Rewards measure activity more than durable skill | Add skill gained, one replay moment, and next unlock; keep no XP farming |
| Progress | Good adult proof on web | sport XP, concepts, accuracy, history | Missing on mobile; concept IDs are developer-like; no time learning | Build one shared progress model; child summary in Player, adult evidence behind gate |
| League | Safe for children | Private milestones | “League” implies social comparison even when no peers exist | Rename child surface Season/Division; reserve League for future parent-enabled cohorts |
| Badges | Working but detached | Eight criteria-based badges | No collection narrative or sport-specific identity | Fold into Trophy Room; connect each award to a demonstrated skill |
| Profile | Rich privacy controls | avatar, age, export/reset/delete/legal | Adult operations compete with child customization | Split Player Locker from Grown-up Center |

## 3. Audience findings

### A 7-year-old

- Can identify sport images and the dominant Continue/Start actions.
- Encounters very small labels, a two-column list of 24 choices, and reading before play.
- Is explicitly told “Tap Hear” while narration is disabled and no Hear button exists. This is a P0 broken instruction.
- Receives no timer, which is correct and must remain.
- Gets only two answer choices in most reps, but the activity is still decoding text rather than reading a play.
- May need to pass four primer screens plus three questions before a meaningful reward.

### A 9-year-old

- Can complete the existing flow but may learn to guess through answer-card patterns.
- The avatar appears as decoration and feedback, not as an active coach.
- The path provides direction, but the large catalog and internal terms such as “Position IQ,” “rooms,” and “nodes” are not always self-explanatory.

### A 12-year-old

- The visual brand is not babyish, which is a strength.
- A 60-second timer adds pressure without improving decision quality.
- Two-answer early-reader cards are gone, but almost all reps still look like quizzes.
- Advanced ambition is visible, but non-football roles reuse generic decision templates and can feel artificial to a real player.

### Parent

- The source registry, local privacy, progress integrity, and explanations create trust.
- Mobile does not show the richer web mastery, badges, streak, accuracy, and activity model.
- There is no “minutes learning,” curriculum objective, observed growth, or next recommended skill in one adult summary.
- Account sync and parental consent are intentionally not live, so cross-device continuity and family management are unavailable.

### Coach or PE teacher

- The multi-sport and role-specific architecture is compelling.
- Authoritative rules sources are a strong foundation, but traceability is not the same as sport-SME approval.
- The current advanced generator often swaps sport/role terms into the same five tactical prompts. That does not yet teach authentic craft.
- There is no standards map, assignment flow, roster, cohort evidence, or coach-controlled progression.

### Complete beginner

- The four-part guides teach before testing, which is valuable.
- Some generated position primers contain a 35–41 word “title” made from an entire decision sequence.
- Video is passive and not connected to the question moment.
- Ruleset/discipline distinctions exist in data but are not always foregrounded at the moment they matter.

### Experienced young athlete

- Football QB and linebacker content shows the right direction: coverage, strength calls, MIKE/SAM/WILL, EDGE distinctions, and scheme caveats.
- Most other position/event paths still consist of Foundations, Tactics, and Mastery modules with roughly five question-card interactions each.
- High-level mastery needs authentic opponent cues, multiple valid options, tradeoffs, and review of the decision process—not generic “protect the responsibility” answers.

## 4. Core product problems

### P0 comprehension failures

1. Early-reader copy requires a disabled Hear action.
2. The first-run setup state is bypassed by default profile assignment.
3. The primary home task is obscured by a 24-card catalog.
4. On mobile, more than 70 style declarations use 6–9px text, including status and instructional labels. WCAG’s enhanced touch guidance recommends 44 × 44 CSS-pixel targets, and youth comprehension also requires readable supporting text—not just large containers.
5. The child and adult jobs are mixed in the same navigation/profile surfaces.

### Reading and information-density problems

- Ages 7–9 currently see 665 primer slides across their eligible catalog.
- Early-reader question prompts average 7.6 words, which is reasonable; explanations average 14.2 words; answer options average 6.7 words. The larger problem is cumulative sequencing and abstract vocabulary.
- Auto-generated early-reader primer titles average 12.5 words, with a 90th percentile of 34 and a maximum of 41 words.
- Source, progress, path, room, level, XP, timer, and age metadata frequently appear together.
- On desktop the opening hero consumes substantial height before the sport action; on phone the complete catalog begins immediately and never resolves into “My Sports” versus “Explore.”

### Navigation problems

- Web primary navigation has Learn, Progress, League, Badges, and a separate avatar Profile target. Mobile has Learn, Progress, League, Badges in a persistent bar while profile is in the header.
- Progress, League, and Badges are secondary motivations competing with the primary action.
- All interactive web states live at `/`, so lessons are not deep-linkable, browser-restorable, or naturally shareable with an adult/coach.
- Sport, path, module, and question state are ephemeral state-machine values rather than route-backed destinations.
- “Back to Path,” “All Sports,” header home, and bottom Learn can all exit differently.

### Learning-design problems

- Challenge taxonomy overstates interaction variety.
- The majority of sport learning is recall/recognition, not perception–decision–action practice.
- Football’s visual path is a UI projection over modules; it does not yet define multi-rep lessons, variants, or gameplay payloads by node type.
- A current football node typically uses four primer frames followed by three early-reader questions; this is still lesson-plus-quiz.
- Only the authored football slice has a deep eight-node General IQ unit. The other 23 sports have two General IQ modules.
- Most position/event modules are generated from shared templates. They satisfy structural breadth tests without establishing reviewed sport depth.
- Diagnostic placement by experience does not exist even though the database includes an experience field.
- Web orders challenge content by weak mastery; mobile does not retain concept mastery at all.

### Retention problems

- The daily system is primarily a 100 XP meter, not a fresh playable event.
- The child league is a static personal ladder rather than a changing season or challenge.
- Badges and ranks have no visible preview of the next meaningful unlock.
- The avatar has limited agency in the learning loop.
- There are no collectible sport moments, stadium upgrades, team identity, weekly championships, or mystery reveals. These should be introduced carefully and without gambling-like random rewards.
- Repetition is driven by missed questions, not by a spaced concept scheduler across days.

### Cross-sport and cross-platform inconsistencies

- Football has 8 general modules and an illustrated path; every other sport has 2 general modules and stacked cards.
- Football contains hand-authored advanced QB/LB content; most sports use generic advanced templates.
- Web retains per-sport mastery, streak, daily XP, badges, and activity; mobile retains only flat XP, completed sports/modules, and receipts.
- Web supports a richer Progress and Badges view; mobile navigation labels them but routes do not provide equivalent dedicated screens.
- Wrestling has no approved clip; four other media entries are not fully cleared for publication.

## 5. Strong features to protect

1. **Breadth:** 24 sports and 152 roles/events are a genuine strategic asset.
2. **Position/Event IQ:** the ability to learn a role directly, without being forced through General IQ.
3. **Beginner-first teaching:** every module has an instructional guide before assessment.
4. **Age and experience as separate dimensions:** keep age for presentation; add experience for placement.
5. **Friendly recovery:** mistakes are framed as learning and return later.
6. **Progress integrity:** replays do not farm XP; stable IDs and migration aliases preserve history.
7. **Source credibility:** governing-body sources, review dates, and media provenance.
8. **Private youth model:** no public child leaderboard or under-13 product measurement.
9. **Diverse motivational avatars:** a strong base for an active coach/player identity.
10. **Cross-platform shared curriculum:** preserve and strengthen this boundary.

## 6. Product positioning and market gap

### Recommended positioning

**RepQuest teaches young athletes to see the game before the play happens.**

Primary child promise:

> **Watch it. Read it. Make the call.**

Parent/coach promise:

> **Interactive sports IQ training that turns rules, positions, and real game situations into decisions children can understand and practice.**

### Why this is distinct

- HomeCourt and Ballogy center physical basketball reps, camera tracking, and skill metrics.
- MOJO/TeamSnap centers practice plans, drills, and coach/team operations.
- IntelliGym centers cognitive simulation, but currently promotes soccer and hockey rather than a broad beginner-to-advanced multi-sport curriculum.
- Duolingo demonstrates a strong learning/path model but is not a sports-IQ product.
- Generic sports trivia tests recall without building role-specific game perception.

The defensible white space is the combination of:

1. child-first multi-sport learning;
2. complete beginner through advanced youth athlete progression;
3. position/event-specific game intelligence;
4. field, court, and film decisions rather than fact recall;
5. age-appropriate presentation with independent experience placement;
6. coach-reviewed and source-traceable content;
7. safe private youth progression;
8. one overall multi-sport player identity.

The moat will not be the path graphic or XP. It will be the reviewed concept graph, large library of varied visual situations, mastery data, and trusted progression from “never seen it” to “reads the game.”

## 7. New information architecture

### Primary child navigation

Use three destinations:

1. **Home** — Continue Playing, Daily Rep, and the clearest next reward.
2. **Sports** — My Sports first; Explore All Sports second.
3. **Player** — avatar/player card, Trophy Room, and simple progress.

Move adult operations behind a **Grown-up Center** gate inside Player. Do not place League and Badges as permanent primary destinations for ages 7–12.

### Home hierarchy

1. Continue Playing — one large card/node with sport, current unit, next 2–5 minute rep, and reward preview.
2. Daily Rep — one optional fresh situation, no streak punishment.
3. My Sports — horizontally scrollable, showing at most 3–5 active sports.
4. Next Unlock — one visual cosmetic, trophy, or championship goal.
5. Explore Sports — below the first viewport with search/category filters.

Returning players should reach the next meaningful interaction in one tap.

### Sport structure

Each sport has three top-level modes:

- **Journey** — ordered core learning path;
- **Role/Event IQ** — open specialized paths with their own beginner entry;
- **Practice** — mistakes, overdue concepts, Film Room, and Game Day.

Do not use “General Sports IQ” in child copy. Use “Learn the Game.”

### Adult structure

Grown-up Center, behind an adult gate:

- learning summary;
- minutes and sessions;
- sport/unit objectives;
- concept mastery and practice needs;
- recent growth;
- privacy, export, consent, account, and deletion;
- future coach/team connection.

## 8. Core gameplay loop

```text
NEXT REP
  → SEE a 3–10 second play or animated situation
  → MAKE one direct decision
  → WATCH the consequence
  → HEAR/READ one coaching cue
  → RETRY a changed situation when needed
  → EARN XP + advance mastery
  → REVEAL the next node or reward
  → PLAY AGAIN or stop with a clear win
```

Target session:

- one node: 2–5 minutes;
- one unit: 5–8 nodes across several sessions;
- one session goal: 1–3 nodes in 3–10 minutes;
- teaching/play ratio: roughly 25–30% demonstration and 70–75% interaction;
- no lives or punitive hearts in core learning;
- optional Game Day can have a limited number of “plays,” followed by free Film Review and retry.

## 9. Learning-path architecture

### Scalable hierarchy

```text
Sport
  → Section
    → Unit
      → Node
        → Rep / Challenge Variant
          → Concept
            → Mastery Evidence
```

Parallel specialization:

```text
Sport
  → Role or Event Path
    → Foundations
    → Reads and Responsibilities
    → Situations and Counters
    → Advanced Craft
    → Game Day Mastery
```

### Recommended sections

1. **Meet the Game** — objective, space, players/equipment, scoring, flow.
2. **Read the Game** — boundaries, timing, phases, possession, legal/illegal actions.
3. **Team Roles or Event Skills** — position/event overview through visual matching and movement.
4. **Make the Call** — situational decisions, risk/reward, score/time/state.
5. **Advanced IQ** — formation/pattern recognition, counters, opponent cues.
6. **Game Mastery** — multi-play simulations and Film Review.

Not every sport should force football concepts. Individual sports replace team-role language with event phases, opponent cues, equipment decisions, pacing, scoring state, and technique legality.

### Unit pattern

A production unit should normally include 5–8 nodes, selected from:

- Film Room;
- Coach Demo;
- Find the Player/Area;
- Build the Formation;
- Matchup;
- Fix the Play;
- What Happens Next;
- Put Me in the Game;
- Locker Room language;
- Coach’s Challenge;
- Review Rep;
- Checkpoint;
- Game Day.

Each concept must appear in at least three contexts before “mastered”: introduction, guided use, and later independent transfer.

### Age presentation

**Ages 7–9**

- one instruction, generally five words or fewer;
- narration available but never required;
- one visual decision per screen;
- two strong visual choices when choices are needed;
- no timer;
- avatar coach demonstrates by pointing, moving, freezing, and celebrating;
- text fallback for every audio cue;
- 60–120 second reps.

**Ages 10–12**

- short captions and optional narration;
- 2–4 visual alternatives;
- untimed by default; optional Beat the Clock modes;
- more terminology, responsibility tradeoffs, and sequences;
- 2–5 minute nodes.

**13+**

- retain the more detailed current interface as a base;
- deepen tactical context, not simply longer distractors;
- timers only where decision speed is part of the objective.

## 10. Game mechanic library

Every mechanic requires a real interaction contract, not only a display label.

| Mechanic | Child action | Learning evidence | Accessible alternative |
|---|---|---|---|
| Film Freeze | Watch, predict, continue | anticipates next action | captioned still sequence |
| Find the Player | Tap a player/zone | identifies role/location | numbered list with diagram labels |
| Build the Formation | Drag players | places roles and spacing | tap player, then destination |
| Fix the Play | Move one wrong player | diagnoses alignment | choose corrected formation |
| Draw the Route | Trace movement | understands path/timing | select from high-contrast routes |
| Who Gets the Ball | Select target/player | weighs leverage/space | descriptive choice plus static diagram |
| Coach’s Challenge | Legal/illegal + reason | applies rules in context | replay controls and transcript |
| Matchup | Pair role and responsibility | links vocabulary to function | keyboard/screen-reader pairing flow |
| Locker Room | Match phrase to meaning | understands coach language | narrated/captioned phrase cards |
| Call the Play | Choose strategy | applies game state | untimed step-by-step version |
| Game Day | Multi-play simulation | transfers several concepts | pause, hints, no speed penalty |
| Film Review | Rewind and retry key moments | reflects and corrects | static frame-by-frame review |

## 11. Adaptive learning model

Track mastery by `player × sport × concept`, not only completed module IDs.

Recommended states:

- Unseen;
- Introduced;
- Practicing;
- Understands;
- Mastered;
- Review Due.

Evidence should include:

- first-try accuracy;
- assisted versus independent success;
- success on a changed scenario;
- delayed retrieval;
- misconception tag;
- content and ruleset version;
- no speed penalty for the core child path.

Scheduling mix for a normal node:

- 60% current unit;
- 25% weak or review-due concepts;
- 15% mastered confidence checks.

On a miss:

1. show the play consequence;
2. freeze the decision moment;
3. highlight one relevant cue;
4. give one short coaching explanation;
5. continue the lesson;
6. test the concept later with a different player arrangement, clip, or game state.

The child should never see an internal concept ID or feel sent backward. A missed concept creates a “Practice Rep,” not a penalty.

## 12. Video strategy

Turn every clip from decoration into a gameplay asset with:

- exact start/end time;
- freeze points;
- player/ball coordinates where relevant;
- pre-freeze instruction;
- prediction prompt;
- correct outcome;
- coach explanation;
- difficulty and age range;
- sport, discipline, ruleset, and position tags;
- captions/transcript;
- content-safety rating;
- license, source, purchase/permission evidence, reviewer, and re-review date;
- static storyboard fallback.

Example loop:

1. “Watch the safety.”
2. Play 4 seconds.
3. Freeze before the rotation.
4. Child taps Cover 2, Cover 3, or man indicator.
5. Continue the clip.
6. Overlay the rotation and one coach cue.
7. Reuse the concept later with a diagram or new clip.

Current publication gates:

- do not publish flag-football or lacrosse footage until rights review is complete;
- do not publish water-polo or gymnastics footage until editorial approval is complete;
- do not pretend the MMA striking clip demonstrates grappling;
- do not ship a wrestling placeholder as real footage;
- age-review combat-sport media and provide non-graphic training alternatives for younger paths.

## 13. Gamification and reward economy

Use one visible economy: **XP**. Do not add spendable gems at launch.

XP unlocks:

- journey nodes;
- sport ranks;
- player-card frames;
- uniforms/equipment cosmetics;
- stadium/arena visual upgrades;
- trophy-room objects.

Reward cadence:

- every rep: immediate motion/sound/haptic feedback;
- every node: XP and one skill statement;
- every unit: trophy piece or arena upgrade;
- every section: championship event and player-card evolution;
- multi-sport milestones: overall Sports IQ titles.

Healthy retention rules:

- no XP for repeated farming;
- no random paid reward boxes;
- no public child rankings;
- no lost progress for missing a day;
- describe streaks as training consistency, with weekly goals and recovery;
- celebrations can be reduced or skipped with reduced motion;
- timers are optional unless timing is the skill being practiced.

## 14. Parent and coach experiences

### Grown-up Center — P1/P2

Show:

- time learning this week;
- sports and current sections;
- concepts introduced/understood/mastered/review due;
- strengths and practice suggestions in plain language;
- recent Film Review examples;
- privacy/account/consent state;
- data export and deletion;
- “What this teaches” curriculum evidence;
- no manipulative engagement language.

### Coach/Educator platform — P3 architecture now, UI later

Future entities:

- organization, team/class, season;
- coach role and verified adult access;
- parent-owned learner membership;
- assignment and due window;
- curriculum objective and ruleset;
- private cohort progress aggregates;
- role/event-specific learning plans;
- no open child search, chat, or public profiles.

Potential coach value proposition:

> Assign the reads before practice so field time can focus on execution.

## 15. Technical and code-quality findings

### Fresh verification

- Web TypeScript: pass.
- Mobile TypeScript: pass.
- ESLint: pass.
- Automated tests: 51/51 pass.

This is a healthy baseline, but the tests mostly prove structural presence and policy constraints; they do not prove that a hotspot is interactive, a 7-year-old understands the flow, or sport-SME content is deep.

### Architecture risks

1. `app/page.tsx` is 1,193 lines and owns persistence, navigation, adaptive ordering, reward logic, account-state gates, and all major screens.
2. `mobile/App.tsx` is 1,278 lines with a parallel but different state model.
3. `app/learning-data.ts` is 2,149 lines and loads the entire multi-sport catalog for every player.
4. `app/globals.css` is 1,131 lines with many one-off component rules and very small text tokens.
5. Web and mobile progress types diverge; the native app lacks web mastery, daily XP, streak, badges, and recent activity.
6. Content is generated in code instead of authored against a versioned schema with review state, variants, and migration tooling.
7. All lesson states live on one web route and cannot be resumed via URL.
8. Mobile eagerly registers all 22 full avatar images.
9. The database schema is thoughtful but not connected to authenticated services; production security cannot be claimed from schema design alone.
10. The current product test suite lacks visual regression, accessibility automation, route-state, performance budgets, and observed comprehension tests.

### Target architecture

Create shared packages/contracts for:

- `curriculum-schema` — Sport, Section, Unit, Node, Rep, Variant, Concept, Source, Media;
- `path-engine` — unlocks, prerequisites, placement, resume state;
- `mastery-engine` — evidence updates and scheduling;
- `reward-engine` — XP and one-time rewards;
- `player-progress` — one cross-platform versioned data model;
- `privacy-governance` — age, measurement, consent, export/delete rules;
- `design-tokens` — color, type, spacing, motion, target size;
- platform renderers for web and native.

Split curriculum by sport and lazy-load the selected sport. Preload only the current node and next node. Lazy-load clips with posters and explicit play. Generate small avatar thumbnails separately from full-body coach art.

### Proposed core schema

```ts
type Sport = {
  id: string;
  name: string;
  disciplines: Discipline[];
  sectionIds: string[];
  rolePathIds: string[];
  releaseState: ContentReleaseState;
};

type Section = {
  id: string;
  sportId: string;
  title: string;
  objective: string;
  unitIds: string[];
};

type Unit = {
  id: string;
  sectionId: string;
  conceptIds: string[];
  nodeIds: string[];
  checkpointNodeId: string;
};

type Node = {
  id: string;
  kind: GameMechanic;
  ageVariants: Record<AgeBand, NodeVariant>;
  prerequisiteNodeIds: string[];
  estimatedSeconds: number;
  xp: number;
  sourceIds: string[];
  contentVersion: string;
};

type Rep = {
  id: string;
  conceptIds: string[];
  prompt: string;
  interaction: InteractionPayload;
  feedback: FeedbackPayload;
  remediationVariantIds: string[];
  mediaId?: string;
};

type ConceptMastery = {
  state: "unseen" | "introduced" | "practicing" | "understands" | "mastered" | "review-due";
  independentSuccesses: number;
  assistedSuccesses: number;
  transferSuccesses: number;
  lastPracticedAt: string;
  nextReviewAt: string;
  misconceptionTags: string[];
  contentVersion: string;
};
```

### Content maturity model

Do not call a sport “production-ready” only because modules exist.

1. Catalogued — sport and roles are represented.
2. Source-backed — authoritative rules and discipline are identified.
3. Instructionally designed — beginner progression and concepts are reviewed.
4. Playable — required mechanic payloads and variants work.
5. SME-approved — coach/official reviews accuracy and terminology.
6. Youth-tested — observed 7-, 9-, and 12-year-old comprehension passes.
7. Release-ready — media, accessibility, privacy, performance, and regression gates pass.

## 16. Prioritized roadmap

### P0 — critical

1. Remove or rewrite every “Tap Hear” instruction while narration is disabled.
2. Replace the bypassed first-run setup with sport-first onboarding and a fun visual diagnostic.
3. Rebuild youth Home around Continue Playing, Daily Rep, My Sports, and Explore below the fold.
4. Reduce child primary navigation to Home, Sports, Player; move adult/privacy operations behind Grown-up Center.
5. Establish youth design tokens: 16px primary body, 14px secondary body, 12px minimum metadata, 48px primary targets, high contrast, non-color state cues.
6. Introduce one shared versioned progress/mastery contract for web and mobile.
7. Turn the first tackle-football unit into true direct gameplay with at least five functional mechanic types.
8. Add a real experience-placement challenge and allow “start from the beginning.”
9. Add route/resume identity for sport, path, unit, node, and rep.
10. Keep all under-13 data local/private until verified parent accounts and operational controls are live.

### P1 — high impact

1. Convert the football Journey and QB path into complete sections with authored variants and Film Review.
2. Build the reusable Field/Court, Formation, Film Freeze, Matchup, and Scenario engines for both clients.
3. Replace passive sport video cards with Film Room nodes.
4. Create Practice Locker scheduling from weak and review-due concepts.
5. Create one shared Progress summary and child-friendly Trophy Room.
6. Build parent evidence views from the same mastery records.
7. Split the curriculum by sport and add lazy-loading/performance budgets.
8. Create content authoring validation for vocabulary prerequisites, source review, rights, age variant, interaction payload, and misconception variants.
9. Perform sport-SME review in release waves while keeping all catalog entries discoverable and honestly labeled.

### P2 — enhancement

1. Unlockable uniforms, equipment, player-card frames, and arena upgrades.
2. Daily Rep and weekly championship content operations.
3. Narration with approved prerecorded voices, captions, transcripts, and non-audio parity.
4. Multi-sport overall IQ profile and crossover challenges.
5. Improved haptics, sound, celebration choreography, and reduced-motion alternatives.
6. Adult session summaries and shareable private progress reports.

### P3 — future

1. Parent-owned cloud profiles and cross-device sync after legal/security readiness.
2. Coach/teacher teams, assignments, private cohorts, and curricula.
3. Parent-enabled friend challenges and private leagues.
4. Licensed professional film packs and sport-organization partnerships.
5. Authoring CMS, localization, offline lesson packs, and school administration.

## 17. Definition of a successful youth redesign

### Five-second test

- A first-time 7-year-old identifies one obvious action without adult explanation.

### Thirty-second test

- The child is watching or manipulating a sport situation—not reading an introduction.

### Two-minute test

- The child makes at least three meaningful decisions and can explain one idea.

### Five-minute test

- The child completes a node, sees a specific skill gain, earns a reward, and understands the next goal.

### Parent test

- The parent can see what was learned, why it matters in the sport, and what comes next.

### Coach test

- The coach recognizes authentic cues, responsibility, decisions, ruleset context, and terminology.

### Release evidence

- observed usability with ages 7, 9, and 12;
- one beginner and one experienced athlete per sampled sport;
- comprehension, not only completion;
- WCAG 2.2 AA plus 44px enhanced target goal for frequent sequential controls;
- full captions/transcripts and reduced motion;
- zero unreviewed public media;
- one cross-platform progress contract and migration tests;
- performance budgets on representative mid-range phones;
- provider/security/legal gates completed before accounts collect family data.

## 18. Research foundations

- Duolingo’s path uses ordered smaller units, interleaved practice, and built-in review rather than leaving learners to choose what to study next: [Duolingo path design](https://blog.duolingo.com/new-duolingo-home-screen-design/).
- Duolingo’s current course guidance describes progression from easier recognition to harder production and personalized practice based on mistakes: [Duolingo 101](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/).
- Duolingo Chess is the closest learning analogue: 75% puzzle-based hands-on learning, guided-to-independent scaffolding, spaced return, and mini/full matches: [Duolingo Chess](https://blog.duolingo.com/chess-course/).
- Youth sport decision-making reviews support game-based, video-based, and perceptual-cognitive training rather than isolated trivia: [youth team-sport decision-making review](https://pmc.ncbi.nlm.nih.gov/articles/PMC8200496/) and [video-based football decision training review](https://pmc.ncbi.nlm.nih.gov/articles/PMC9686440/).
- Retrieval practice with feedback has demonstrated learning benefits in elementary children: [retrieval-based learning study](https://www.frontiersin.org/articles/10.3389/fpsyg.2016.00350/pdf?isPublishedV2=False).
- WCAG 2.2 defines a 24px minimum target with spacing exceptions and a 44px enhanced target; frequent sequential youth controls should target the larger value: [WCAG target-size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) and [enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced).
- Apple’s Kids Category guidance restricts third-party data/analytics and requires parental gates for child-facing external actions: [Apple Kids guidance](https://developer.apple.com/kids/) and [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/).
- Google Play’s Families policy requires accurate child-audience disclosure, restricted data practices, approved SDK behavior, and adult action before sensitive social features: [Google Play Families policy](https://support.google.com/googleplay/android-developer/answer/9893335).
- The FTC’s updated COPPA rule strengthens notice, consent, retention, security, and third-party disclosure obligations: [FTC COPPA update](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data).
- Market references: [HomeCourt](https://www.homecourt.ai/), [Ballogy](https://www.ballogy.com/mobile-app), [TeamSnap/MOJO](https://www.teamsnap.com/mojo), and [IntelliGym](https://www.intelligym.com/).

## Final recommendation

Approve a design direction for the new youth Home/Journey language, then build a production-quality tackle-football vertical slice using shared web/mobile mechanics and a shared mastery contract. Validate it with children before scaling the mechanic system across all 24 sports. Keep every sport visible during the transition, but show honest content maturity instead of presenting generated breadth as finished depth.
