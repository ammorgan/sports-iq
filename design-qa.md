# RepQuest five-sport design QA — 2026-10-27

This report supersedes September's Option 3 sign-off. That older screenshot does not approve the new ten-section curriculum or its mobile layout.

## Evidence and comparison target

- Source visual truth: the user's seven Duolingo screenshots. Feedback reference: `/var/folders/7r/krsxc95x77g2fvznf8z80p240000gn/T/codex-clipboard-f3721b86-98d2-4198-b5e2-95bf69ee7d20.png`.
- Source pixels: 1320 × 2868. This is an interaction reference, not a request to copy Duolingo's branding or visual assets.
- Rendered implementation: local RepQuest on port 3001, Chrome, actual CSS viewport 1280 × 625; screenshots 1280 × 625 pixels.
- Requested phone viewport: 390 × 844. The browser override did not apply, confirmed by reading the actual viewport. It was reset. No claim of phone-layout validation is made.
- Full-view comparison input: `.audit/five-sport-2026-10-27/feedback-reference-comparison.png` (1340 × 850). The source is contained within 330 × 730, implementation within 910 × 730, preserving aspect ratios. This explicitly shows different viewports and is not a same-size fidelity pass.
- Live feedback capture: `.audit/five-sport-2026-10-27/feedback-desktop.png`.
- Focused feedback evidence: `.audit/five-sport-2026-10-27/feedback-format-detail.png`.
- Final home capture: `.audit/five-sport-2026-10-27/home-desktop-final.png`.
- Full path capture: `.audit/five-sport-2026-10-27/ten-section-path-desktop-final.png`.
- Latest observed preview capture: `.audit/five-sport-2026-10-27/current-preview-final.png` (teaching page, scrolled near the bottom, fixed Play action visible).
- State: local profile, no committed test lesson or XP award. The human resumed navigating the preview; automated interaction stopped to avoid competing for control.

## Findings

### P2 — Framework prefetch error needs resolution before release

Chrome's captured console includes repeated `[vinext] RSC prefetch setup error: TypeError: d is not a function`, in the generated Link chunk. Core in-page lessons remained playable. This does not prove all route navigation works.

Action: diagnose the framework/Link prefetch path and cold-test the Privacy Notice, Terms, back navigation, and refresh behavior. Do not hide the error or claim clean runtime logs.

### Open acceptance blocker — phone and native visual evidence

The phone-size override did not change the real viewport. The new role diagrams, later checkpoints, all five complete journeys, large text, and VoiceOver/TalkBack have not received a complete live visual play-through. Native exports and shared-data tests do not close this gap.

Action: capture actual phone/tablet views and compare the appropriate states, including matching edits, sequence undo, long answers, a wrong answer, repeated retry, diagram selection, completion, and next lesson.

### Follow-up — shared presentation and matching

The per-lesson source disclosure has now been removed on both clients; the underlying source records are retained. Progress, League, Badges, Player, Position Training, and completion use the course's purple game skin. Position lessons use the same answer renderer. Matching accepts either column first through one shared state transition. See `docs/GAME_STYLE_VALIDATION.md` for the narrower revision's evidence and outstanding checks.

This follow-up reached a real 390 × 844 browser viewport, unlike the original failed override described above. It revealed and prompted fixes for the old responsive cream lesson container, dark text inherited by purple panels, and the oversized position decision heading. The user cleared an interrupted exit dialog and final checks resumed: phone tab screenshots, position teaching/quiz screens, matching in both directions with correct grading, a compact practice completion with a visible Continue dock, readable skill details, and return to the same sport were verified. Saved XP remained 141 and course completion 1/49. Practice updated mastery and earned the Perfect Drive badge. This does not close native-device, full-curriculum, or specialist-review blockers.

## Comparison history and implemented fixes

1. The reported answer/retry run-on came from adjacent inline text. It now uses separate paragraphs, line height, spacing, and an answer separator. The live feedback capture and focused crop show the correction.
2. The desktop header and hint/exit controls initially inherited light surfaces that conflicted with the game theme. The home/header and lesson controls were given explicit dark surfaces and readable colors. Captured later views show the dark header and readable controls.
3. The lesson asked the same task below a redundant coach label, consuming vertical space. The selected avatar now presents the actual question in its bubble on both clients.
4. The primary Check/Play action was below the fold. Web actions and the native core Check action now use a bottom dock with content padding. The latest teaching capture shows Play available. The final visual-card height reduction still requires its phone-sized recheck.
5. A second wrong retry exposed the legacy paragraph-length prompt. A shared core retry helper preserves the short question and places coaching help below it. The new test checks repeated retries for every authored challenge.
6. Ordering showed duplicate instructions. The core engine now provides one tap/undo instruction; matching also avoids repeating its full instruction.

## Required fidelity surfaces

- **Fonts and typography:** existing RepQuest type retained; short task headings, 16–18px teaching/answer copy in primary states. The feedback explanation and answer are distinguishable. Phone wrapping and accessibility text-size behavior remain unverified.
- **Spacing and layout rhythm:** stacked course/position choices, distinct answer and retry paragraphs, a single next action, and one expanded section journey. Desktop evidence exists; same-size phone comparison does not.
- **Colors and tokens:** RepQuest purple/gold remains intentional rather than copying Duolingo green. Correct/wrong states include text and marks, not just color. Initial low-contrast light controls were corrected.
- **Image quality and assets:** existing RepQuest logo and selected avatar retained; sport and concept icons use the installed icon library. Role exercises are explicit interactive position-data diagrams, not replacement photographs or claims of fixed player locations. Native visual quality is still open.
- **Copy and content:** plain definitions precede practice; player counts distinguish per-team from total; safety score differs from safety position. Core age adaptation does not shrink the path to three questions. Rule contexts name competition differences. Human sport-editor approval remains required.

## Interactions checked

Live desktop: five-sport home, ten football section banners, lesson entry, concept cards, blank, three correct matching connections, game decisions with mixed answer positions, correct ordering, wrong-answer feedback, and a missed retry returning again.

Automated: answer grading, pair integrity, sequence order, repeated short retries, no duplicate options, concise single-decision prompts, source IDs, five-sport publishing, age-independent core depth, sequential prerequisites, latent sparse receipts, and first-completion XP guardrails.

Not claimed: full visual parity with Duolingo, complete mobile usability, every role elective rebuilt, full five-sport play-through, clean runtime logs, professional coaching accreditation, or production release readiness.

## Implementation checklist

1. Resolve the framework prefetch error and verify real legal-route navigation.
2. Capture phone/tablet and native screens and complete the matching-view comparison.
3. Review diagrams and advanced content with qualified sport editors.
4. Extend the separate older Position IQ electives and add validated placement/retention practice.
5. Re-run visual sign-off after those checks.

final result: blocked
