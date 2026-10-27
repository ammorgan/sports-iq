# Shared game presentation — 2026-10-27

## Change contract

- Apply the Learn the Game purple palette, rounded surfaces, readable type, and clear selected/locked/reward states across every existing web tab, Player, Position Training, teaching pages, exercises, feedback, and completion.
- Apply the corresponding presentation to existing native screens. This does not introduce new native Progress or Badges tabs.
- Let matching start from either column. Keep one-to-one pairs, allow edits, and preserve canonical left-to-right grading.
- Remove per-lesson reference panels, not the source registry or curriculum attribution records.
- Preserve saved profiles, module IDs, XP awards, age-specific timing, prerequisites, privacy choices, and the five-sport catalog. No migration or reset is required.

## Implementation

Web uses the shared `repquest-game` skin for dashboard, sport, primer, quiz, and results shells. It overrides the legacy responsive cream lesson container as well as desktop surfaces. The obsolete light/dark toggle is hidden because the game now has one consistent theme; previously stored preferences remain untouched.

Position Training reuses the course node treatment and shared answer renderer. Both choice renderers support multiple selections and ordered steps as well as the newer card, blank, matching, and diagram tasks. Existing young-player auto-check behavior is preserved for legacy single-choice lessons. Long position decision sequences are presented as steps rather than an oversized heading.

Both clients use `selectMatchingItem` for pending selections and pair replacement. Either side can be selected first; a second tap on the same pending choice cancels it. Changing a pair removes conflicting connections on either side. Choices are disabled only when feedback is revealed, not because the player started from the right.

## Evidence

- Fresh checks: web and native TypeScript passed; ESLint for touched production/test files passed; 64 repository tests passed with zero failures; production web build and both iOS/Android Expo exports passed; local preview returned HTTP 200; Git whitespace check passed. The build still reports the existing large-chunk warning. Expo export is not an Xcode archive or installed-device test.
- New matching regression tests cover both starting sides, canonical pair order, pending selection changes, cancellation, and one-to-one replacement. The missing helper was demonstrated as a failing check before implementation.
- Presentation contract tests cover all web shells, shared renderers for both tracks, native palette adoption, and reference-panel removal.
- Desktop browser checks: Progress, League, Badges, Player, football role selection, Quarterback journey, and all three position teaching pages. The saved profile still showed 141 XP and one completed football lesson during these checks.
- Actual responsive viewport reached 390 × 844, confirmed using the live DOM. That check exposed a legacy cream lesson surface, inherited dark text on purple panels, and a decision sequence rendered as a huge heading. Final captures confirm the corrected surfaces, contrast, and step presentation. A capture-scale issue after refresh was corrected by resetting/reapplying the documented viewport override.
- The unfinished lesson exit confirmation initially interrupted browser control. The user cleared it, and verification resumed. Right-first and left-first matching connections both received correct feedback in the final build. Ordering, selection locks after feedback, and continuing the same sport were also checked.
- Two replays of the already-cleared first football lesson verified the completion screen without new XP or module unlocks. Saved XP stayed at 141 and the football course at 1/49 lessons. These real practice runs updated mastery/history and the first earned the Perfect Drive badge; no saved progress was reset. No legal acceptance was submitted.
- The phone completion screen now keeps Continue visible in a bottom dock, with skill details behind a disclosure. The disclosure uses readable terms and questions instead of internal IDs. The same labels are used by Progress.
- Screenshots: `.audit/game-style-2026-10-27/`. Final evidence includes `badges-desktop-final.png`, `progress-phone-final.png`, `league-phone-final.png`, `badges-phone-final.png`, `player-phone-final.png`, `lesson-phone-final.png`, `matching-right-first-phone.png`, `completion-phone-final.png`, `position-primer-phone-final.png`, and `position-lesson-phone-final.png`. `position-lesson-phone.png` is an earlier issue capture, not the final implementation.

## Limits and follow-ups

- Native-device rendering, tablet/large-text checks, and full VoiceOver/TalkBack testing remain required. Browser phone-size evidence is not a native-device test. Completion evidence covers a real practice result; the first-completion XP branch retains its existing award logic and automated integrity checks.
- League's public board failed locally. The server logged an unsupported `cloudflare:` module import. Its error state was visually checked; this change does not repair or enable the public leaderboard backend.
- The existing web chunk-size warning and prior framework prefetch issue are not resolved by this visual revision.
- Position electives retain their existing curriculum and age adaptation. Presentation parity is not a claim that every elective has been rewritten to the new ten-section core curriculum.
- No TestFlight build, Git commit/push, deployment, API spending, or new account/database setup was performed.
