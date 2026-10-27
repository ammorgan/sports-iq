# Five-sport revision: validation and release limits

Date: 2026-10-27. Working branch: `feature/duolingo-style-path`.

## Verified implementation

- Only Football, Basketball, Baseball, Soccer, and Volleyball are published in the web and native sport selectors. The other 19 sports remain in the retained library; their records were not deleted.
- Active clients render no sport video player and no video placeholder. The native export contains no clip assets.
- Each core course has ten explicitly authored sections and its own ordered lessons. Section sizes follow the topic rather than a fixed difficulty-to-question-count rule.
- Football and basketball each have 39 teaching units; baseball, soccer, and volleyball each have 38. Each also has ten Game Day checkpoints. These counts describe the implementation, not proof of mastery.
- Forty role-identification exercises share authored alignments between web and native. Each role lesson teaches the labeled example before asking the player to select A, B, or C. These are diagrams, not photographs.
- Matching grades actual pairs; ordering grades order; duplicate selections fail. Core lessons cannot be marked complete without answering their planned questions and recovering required concepts.
- Misses return later in the lesson. Repeated retries preserve a short prompt, help text, format, and concept identity.
- Main course progress is sequential. Optional role electives cannot inflate its percentage, and sparse future receipts do not jump over missing prerequisites.
- Voice remains disabled. No new audio generation, API spending, account setup, database migration, deployment, Git push, or TestFlight upload was performed.

## Fresh automated evidence

| Check | Result |
| --- | --- |
| Web TypeScript | Passed |
| Native TypeScript | Passed |
| ESLint for edited production, authoring, and test files | Passed |
| Full repository test suite | 64 passed, 0 failed after shared-presentation, matching, and readable-label regressions |
| Production web build | Passed |
| iOS Expo export | Passed |
| Android Expo export | Passed |
| Local preview HTTP response | 200 on port 3001 |
| Git whitespace/conflict-marker check | Passed |

The repository already contained unrelated changes before this request. They were preserved. Some older tests still exercise the retained pilot and 24-sport legacy library. Their names do not mean those sports are all published, or that a professional coach, privacy lawyer, or security auditor approved the release.

The web build reports a client chunk above 500 kB. This is a follow-up loading/performance concern, not a failed build. Lazy loading the retained role/content library should be evaluated on real devices before release. The export's approximately 2.6 MB native code bundles are build sizes, not runtime speed measurements.

Chrome's captured console also contains a Vinext RSC prefetch TypeError in the generated Link chunk. In-page game interactions worked, but legal-route navigation and cold-start behavior need a separate fix and verification before release. Runtime logs were not clean.

## Live browser evidence

Chrome displayed the five-sport home, all ten football section banners, the first teaching page, concept cards, a word-bank blank, all three matching connections, two game decisions, ordered steps, wrong-answer feedback, and a missed retry returning again. Test lesson answers were not committed as completed progress; the local profile remained at 0 XP and no completed lessons after refreshing.

The live test found and prompted fixes for:

1. Adjacent inline answer/retry text: replaced with separate, spaced paragraphs.
2. Light controls against the dark game background: explicit dark surfaces and readable text.
3. Excess lesson-header space: the selected avatar now presents the question directly.
4. Hidden next action: fixed-position Check/Play controls with content space beneath them.
5. Long generic second-retry prompts: replaced with the shared short-prompt retry helper.
6. Duplicate ordering instructions: one instruction, with tap-to-undo support.

Original course screenshots are under `.audit/five-sport-2026-10-27/`. The follow-up shared-theme and bidirectional-matching revision is documented in `GAME_STYLE_VALIDATION.md`, with separate screenshots under `.audit/game-style-2026-10-27/`. See the root `design-qa.md` for broader visual acceptance status.

## Still required before release

- Real phone/tablet play-throughs, including large text, VoiceOver/TalkBack, keyboard focus, and touch targets. Chrome's requested 390 × 844 override did not change its actual 1280 × 625 viewport; it was not counted as a phone test.
- Visual interaction checks for the role diagrams, later checkpoints, and all five complete journeys. Source/data tests are not a substitute for seeing those screens.
- Qualified sport-specific editorial review, especially advanced distractors, tactical assumptions, and competition-specific rules. Digital completion is not evidence of professional playing ability.
- Independent early-reader usability research with responsible adults. With narration paused, some six-year-olds will need reading help.
- Deeper authored Position IQ electives. The main courses now introduce roles in detail, but the separate older elective paths have not all been rewritten in this revision.
- Persistent cross-session mistake practice, unassisted retention evidence, and a validated placement/test-out flow.
- Separate production account/privacy/security readiness work and release signing. Expo export is not an Xcode archive, device install, or App Store approval.

Release decision: implementation available for review; full visual and production sign-off remains open.
