# RepQuest Product Requirements Document

> Current scope (2026-10-27): [FIVE_SPORT_GAME_PLAN.md](FIVE_SPORT_GAME_PLAN.md) is the controlling specification for five video-free sports, each with ten authored sections. Older catalog, media, and age-depth details below describe retained legacy content, not the new primary course or release approval.


**Status:** Living product specification

**Version:** 2.0 — five-sport curriculum revision

**Product:** RepQuest web, iOS, and Android

**Primary audience:** Learners age 6–75, parents/guardians, and adult beginners. Independent early-reader usability is not yet validated.

**Product owner:** Amanda Morgan

## 1. Product summary

RepQuest is a guided sports-learning game that teaches someone who may never have seen a sport how the game works, who participates, what each role does, and how players make decisions. Learners earn XP through short lessons and interactive checks, then progress from general knowledge into position- or event-specific paths.

RepQuest is not a trivia-first product. Every assessed term or concept must be taught in plain language before it is tested.

## 2. Problem and opportunity

Sports education is often fragmented across broadcasts, coaching, camps, and rule books. Most existing products assume prior knowledge, focus on fantasy/statistics, or train physical skills. New learners—especially children—need an inviting, visual, safe way to understand many sports without already knowing their vocabulary.

RepQuest creates a common learning loop across sports while adapting language, pacing, interaction, and challenge level by age.

## 3. Vision and principles

**Vision:** Make every learner feel capable of understanding any sport.

Product principles:

1. Teach before testing.
2. Show more and say less, especially for ages 7–9.
3. A wrong answer is a learning moment, never a punishment.
4. The next action is visible without scrolling or guessing.
5. General IQ and Position/Event IQ are parallel choices; every specialized path teaches the role before testing it.
6. Youth privacy is a product feature, not a legal afterthought.
7. Media must depict the correct sport and have verified reuse rights.
8. The same curriculum and progress model power web, phone, and tablet.

## 4. Goals and success measures

### Product goals

- Help a first-time learner explain the basic objective, scoring, playing area, participants, and major roles of a sport.
- Make ages 7–9 successful with minimal independent reading.
- Create a clear progression from fundamentals to role-specific decision-making.
- Encourage continued learning through XP, streaks, mastery, badges, and safe leaderboards.
- Provide a consistent, responsive experience on web, iOS, Android, phones, and tablets.

### Initial success measures

- At least 80% of new learners start the first lesson after opening a sport.
- At least 70% complete the first fundamentals module.
- At least 60% continue into the next recommended module.
- Ages 7–9 complete a module with no more than one adult-help request on average in observed usability tests.
- Fewer than 2% of questions receive a “confusing wording” report.
- Every published question passes content, age-readability, answer-order, and ambiguity review.
- No unlicensed or incorrectly labeled media reaches production.

## 5. Non-goals for the first release

- Live coaching, team management, betting, fantasy sports, or real-money rewards.
- Open chat, direct messaging, followers, or public profiles for children.
- Diagnosing athletic ability or replacing qualified coaches and safety instruction.
- Automatically publishing AI-generated curriculum or media without human review.

## 6. Users

### Early reader (7–9)

Needs large visual choices, short spoken-style sentences, no timer, limited options, simple interactions, and reassuring animated feedback. May not read independently.

### Growing learner (10–12)

Can read short explanations and handle three to four realistic choices with a generous timer. Benefits from visual examples and encouraging feedback.

### Teen beginner (13–15)

Needs clear definitions without childish presentation, more realistic distractors, and introductory strategy.

### Advanced teen (16–17)

Expects nuanced decisions, position language, realistic situations, and less obvious answers.

### Adult learner (18+)

May be a new fan, parent, coach, or player. Expects concise instruction, authentic terminology, and challenging scenarios.

### Parent or guardian

Creates or consents to an under-13 account, controls the child experience, understands data collection, and can request deletion.

## 7. Core learning journey

Every sport follows this guided sequence:

1. **Sport home:** See the sport icon, a verified 6–10 second real-play snapshot, progress, and a visible Start/Continue button.
2. **What is this game?** Learn the objective and what success looks like.
3. **Fundamentals:** Learn participants, playing area, start/restart, scoring, core rules, and common flow.
4. **Meet the positions or events:** Learn the names and plain-language jobs of every major role or event group.
5. **Knowledge check:** Practice only concepts already taught.
6. **Position/Event IQ:** Choose a role and learn responsibilities, reads, decisions, and situations.
7. **Mission result:** See what was learned, receive XP, and get a primary Continue Path action.

General IQ and each specialized Position/Event IQ path are parallel entry points. The first module in every specialized path is immediately available and contains its own role primer. Later modules unlock in order within that same path. Previously completed users retain credit through explicit module-ID aliases; migration rules must never erase earned XP.

## 8. Curriculum requirements

### Required beginner modules

Each sport must cover:

- Objective: what each side or athlete is trying to do.
- Participants: number of players per team on the playing area, where applicable.
- Playing area and important boundaries/zones.
- How play starts and restarts.
- How scoring or winning works.
- Equipment needed to recognize the sport.
- Legal versus illegal actions at a beginner level.
- Major positions, role groups, disciplines, or events.
- A short “watch for this” viewing cue.

### Position/event introduction

Before a learner chooses a specialized path, RepQuest must display each major group, the positions/events in it, and a one-sentence job for each. Example: “The offensive line protects the ball carrier and creates running space.” Position checks may ask a learner to match a role to a group or responsibility only after this teaching step.

### Question quality rules

- State the unit precisely: “How many players from one team are on the field?” rather than “How many players are on the field?”
- Do not test unexplained terms such as “grappling,” “the key,” or “line of scrimmage.”
- Exactly one answer must be defensibly correct unless labeled “choose all.”
- Randomize answer order deterministically; the correct answer must not consistently be A.
- Ages 15+ receive plausible distractors based on common misconceptions.
- Explanations state why the answer is correct and clarify the underlying concept.
- Content reviewers verify rules against an authoritative governing body and record the source and review date.
- Distinguish materially different sports and rulesets, including tackle football and flag football.
- League or organization names are excluded unless necessary, licensed, current, and approved by the product owner.

## 9. Age-adaptive experience

| Age | Timer | Reading and interaction |
|---|---:|---|
| 7–9 | None | 2 large choices; up to 4 short questions; no ordering/multi-select in the first release; visual cue on every question; animated supportive feedback; optional read-aloud target |
| 10–12 | 60 sec | Short prompts; 3–4 choices; diagrams when useful; supportive feedback |
| 13–15 | 45 sec | Standard terminology after definitions; realistic distractors; basic situations |
| 16–17 | 35 sec | Nuanced scenarios; closer distractors; role-specific reads |
| 18+ | 30 sec | Concise advanced wording; authentic terminology and strategy |

### Ages 7–9 detailed requirements

- A screen should communicate one idea and one action.
- Prompts target approximately eight words when possible and never exceed two short sentences.
- Tap targets are at least 48×48 points; primary choices should be substantially larger.
- Use pictures, field/court diagrams, recognizable equipment, animation, and color—not letter labels alone.
- Avoid persistent counters for mistakes. Show progress with friendly dots or a journey marker.
- Correct feedback celebrates the concept; incorrect feedback says the learner is still learning and immediately teaches the answer.
- The interface must work without a countdown and without relying on audio.
- Read-aloud narration is a planned accessibility enhancement; visible text and controls remain complete without sound.

## 10. Sports catalog

Launch catalog includes tackle football, flag football, basketball, soccer, volleyball, baseball, softball, ice hockey, lacrosse, rugby, field hockey, water polo, cricket, tennis, track and field, swimming, gymnastics, pickleball, badminton, golf, cycling, mixed martial arts, wrestling, and bowling.

Each catalog entry requires curriculum coverage, sport icon, beginner guide, progress identifiers, position/event taxonomy, question review, and verified media before it is marked production-ready.

## 11. Navigation and interface requirements

- The sport screen shows Start/Continue immediately below or within the hero, before optional media and detailed path content.
- Back buttons use clear destinations (“Sports,” “Path,” “All positions”), not unlabeled arrows.
- The home screen displays accurate per-sport status: Not started, In progress, or Complete.
- General Sport IQ displays numbered, sequential modules and the next unlocked step.
- Locked content explains both why it is locked and the single action needed to unlock it.
- Result screens make Continue [Sport/Position] Path the primary action and Choose Another Sport secondary.
- The visual system remains energetic and game-like without becoming childish: purple arena backgrounds, rounded cards, sport colors, motion, large icons, and restrained text.
- RepQuest branding and logo are consistent across web and mobile.

## 12. Video and media policy

- Each sport should have a 6–10 second muted clip of recognizable real play.
- A clip is publishable only when it clearly depicts the named sport and the license/source page has been reviewed.
- Store source URL, creator/source name, license, acquisition date, editor, modifications, and required attribution.
- Do not use broadcast footage, social-media reposts, professional-league footage, or DVIDS footage without explicit approved rights.
- Pexels, Pixabay, Creative Commons, commissioned footage, or original footage may be used only under their applicable terms.
- A missing verified clip shows an honest “clip coming” state; it must never silently substitute a different sport.
- Generated animation may teach a concept but must be labeled as an illustration, not real gameplay.
- Flag football requires footage with visible flag belts and a non-tackle play before release acceptance.

## 13. Profiles, authentication, and age assurance

- Support guest play plus email/password, Google, and Facebook sign-in where provider and platform policies permit.
- Ask date of birth or age during registration, minimize retention, and derive the age path.
- Do not use a child’s legal name, email, or public identity for an under-13 learner profile.
- Under 13: collect the parent/guardian account information, record verifiable parental-consent state, and mark the learner profile as a child account.
- CAPTCHA/bot protection applies to account creation and suspicious authentication attempts; it must be accessible.
- Age changes that cross the under-13 boundary require the appropriate consent flow, not a simple preference update.
- Local development includes a clearly labeled reset-age/test-profile control unavailable in production.

## 14. COPPA and privacy requirements

- Collect only data necessary to provide the learning service.
- Publish a parent-facing privacy notice describing collection, use, disclosure, retention, and deletion.
- Obtain verifiable parental consent before collecting personal information from a child under 13.
- Give parents access, review, deletion, and consent-revocation controls.
- Do not serve behavioral advertising to child users.
- Do not expose child accounts in public leaderboards, search, chat, or social features.
- Use age-appropriate design and avoid manipulative engagement patterns.
- Complete legal review before production launch; this PRD is a product specification, not legal advice.

## 15. XP, progress, and leaderboards

- XP is awarded for completed learning interactions and recovery after mistakes, not speed alone.
- Progress is based on actual completed module IDs and survives app restarts and signed-in device changes.
- Under-13 players receive a private personal milestone board only.
- Public leaderboard eligibility is age 13+, opt-in, alias-only, and excludes legal name, age, email, messages, and followers.
- Provide report/block and administrative removal capabilities before enabling public rankings.
- Prevent obvious XP manipulation with server-authoritative completion events, rate limits, replay rules, and anomaly detection.

## 16. Functional requirements

### Web and mobile

- Shared sport, curriculum, age, progression, and media metadata.
- Responsive layouts for small phones through tablets and desktop browsers.
- Offline-safe local guest progress where feasible; authenticated progress sync when backend is available.
- Deterministic answer-order mixing.
- Correct timer by age band and no timer for 7–9.
- Support reduced motion, screen readers, dynamic text, keyboard navigation on web, and adequate color contrast.

### Content administration (planned)

- Draft/review/publish states.
- Governing-body source and review date per concept.
- Age-specific prompt, explanation, visual, and distractors.
- Media-rights record and expiration/review reminders.
- Rollback and audit history.

## 17. Data model (logical)

Core entities: Adult Account, Learner Profile, Consent Record, Sport, Sport Variant, Position/Event Group, Position/Event, Learning Module, Lesson Card, Challenge, Answer Option, Content Source, Media Asset, Media Rights Record, Progress Event, Mastery Record, XP Ledger, Badge Award, Leaderboard Opt-In, and Safety Report.

Child learner profiles reference the responsible adult account and store only a non-identifying display alias and required learning state. Consent records are immutable audit events with policy version, method, timestamp, status, and revocation information.

## 18. Security requirements

- Use managed authentication; never store plaintext passwords.
- Enforce server-side authorization and row-level data access rules for every profile, progress, consent, and leaderboard query.
- Keep service-role credentials and provider secrets off clients and out of source control.
- Encrypt transport with TLS and use provider-managed encryption at rest.
- Rate-limit authentication, consent, progress, and leaderboard endpoints.
- Validate all writes server-side; do not trust client age, XP, or ownership claims.
- Maintain dependency scanning, secret scanning, audit logging, backups, restore tests, and a documented incident-response process.
- Separate production, staging, and development data and credentials.
- Complete threat modeling and an independent security/privacy review before public launch.

## 19. Analytics and experimentation

Track privacy-safe events: sport opened, module viewed/started/completed, lesson slide viewed, question answered, concept recovered, position path opened, video played/failed, and navigation abandonment. Do not place advertising identifiers or unnecessary third-party trackers in child experiences. Segment by broad age path, not exact birth date, and enforce retention limits.

Experiments involving children require privacy review and must not use dark patterns. Useful tests include Start button placement, lesson length, visual choice formats, and feedback language.

## 20. Performance and reliability

- Sport screen should become interactive within 2.5 seconds on a representative mid-range mobile device over a typical mobile connection.
- Lazy-load video and non-visible sport media; show poster/placeholder immediately.
- Keep animations at a stable 60 fps on supported devices and honor reduced motion.
- Cache shared curriculum and icons; avoid duplicate media bundles.
- Recover gracefully from video/network failure without blocking lessons.
- Crash-free mobile sessions target: at least 99.5% during beta.

## 21. Quality and release acceptance

A sport is release-ready only when:

- All required beginner concepts and role/event introductions exist.
- A zero-prior-knowledge reviewer completes the path without unexplained vocabulary.
- All questions pass ambiguity and correct-answer review at every age band.
- Correct answers are distributed across choice positions.
- Ages 7–9 pass observed usability testing with early readers.
- Progress and unlocking work on web, iOS, and Android.
- The media asset is correct and its rights record is complete, or the honest placeholder is approved.
- Accessibility checks, unit/integration tests, type checks, builds, and device smoke tests pass.
- Privacy, consent, security, and analytics behavior match account age.

## 22. Rollout plan

### Phase 1 — Beginner foundation

Ship the shared beginner sequence, embedded position/event introductions, visible Start action, league-neutral wording, 7–9 simplified interactions, corrected progress/path access, and a rights-cleared flag-football clip once written permission or a licensed stock purchase is recorded.

### Phase 2 — Account beta

Add managed authentication, parent/child accounts, consent records, secure sync, private child milestones, and opt-in 13+ leaderboard. Conduct legal and security reviews.

### Phase 3 — Curriculum depth

The shared foundation/tactical/mastery architecture now exists for all 152 positions and events. Ages 7–12 receive foundation only, ages 13–15 add tactical reads, and ages 16+ add mastery, counters, risk, and post-rep evaluation. Before any path is labeled reviewed curriculum, a sport-domain reviewer must approve its terminology, ruleset context, ambiguity, and instructional sequence. Diagrams and reviewed short-form media remain an expansion requirement.

### Phase 4 — Production scale

Add content administration, moderation, fraud controls, analytics dashboards, reliability monitoring, and broader device/accessibility certification.

## 23. Risks and mitigations

- **Reading load:** enforce age-specific content budgets and test with real early readers.
- **Incorrect or ambiguous instruction:** require authoritative sources and human sport review.
- **Media-rights exposure:** maintain rights records and default to no clip when uncertain.
- **Child privacy:** minimize data, parent-owned accounts, private youth progress, and legal review.
- **Curriculum breadth:** release sports only after meeting a shared completeness rubric.
- **Gamification pressure:** reward learning and recovery, avoid punishment and speed pressure for young children.
- **Client-side XP abuse:** move authoritative XP writes to the backend before public leaderboards.

## 24. Open product decisions

- Select a verifiable-parental-consent method and legal/privacy counsel.
- Select production authentication, database, CAPTCHA, and monitoring providers.
- Decide whether read-aloud uses recorded narration, device text-to-speech, or both.
- Assign named sport-domain reviewers and record sign-off for every module. Governing-body source records now exist for every sport, but source registration is not human approval.
- Obtain written permission for the USA Football flag-football excerpt or purchase a model-released stock replacement before publishing a flag clip.
- Define XP replay limits and 13+ leaderboard moderation operations.

## 25. Definition of done for this beta iteration

- User-facing tackle-football content stays league-neutral unless a named organization is necessary, current, licensed, and approved.
- Position/Event IQ is selectable immediately, and each specialized module begins with a role-specific beginner primer.
- Every age-eligible specialized path exposes real foundation, tactics, and mastery modules rather than placeholder roadmap cards; each later level requires the prior level in that path.
- Start/Continue is visible near the top of sport screens on web and mobile.
- Ages 7–9 see no timer, two large answer choices, no initial ordering/multi-select, at most three questions, short explanations, and supportive feedback.
- Home progress counts all beginner and specialized modules accurately.
- Flag football displays verified correct footage or an explicit unavailable state; no substitute tackle footage.
- Web and mobile type checks/builds/tests pass, and this PRD ships with the code.
- Privacy export/reset/deletion, first-completion-only XP, within-path prerequisite enforcement, and youth-safe measurement follow `PRIVACY_PROGRESS_MEASUREMENT_OPERATIONS.md` on web and mobile.
