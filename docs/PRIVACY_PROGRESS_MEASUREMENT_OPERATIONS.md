# RepQuest privacy, progression, and measurement operations

**Status:** Beta operating specification

**Reviewed:** August 11, 2026

**Applies to:** Web, iOS, and Android

This document defines the operational controls implemented in the beta and the controls that must be live before online accounts or cross-device progress are enabled. It is a product and engineering specification, not legal advice.

## 1. Launch gates

Online registration and child-account syncing remain disabled until all of the following are complete:

- The operating legal entity, mailing address, monitored privacy email, and support email are published.
- Privacy counsel approves the final Privacy Notice, Terms, data map, retention schedule, and launch jurisdictions.
- Managed authentication verifies the adult account and the server authorizes every profile and progress request.
- A verifiable-parental-consent provider and method are selected, contracted, tested, and documented.
- Parents can review/export a child profile, revoke consent, stop future collection, and request deletion.
- Deletion is rehearsed across the primary database, authentication provider, vendors, analytics, support tools, and backups.
- Every third-party SDK and service has a documented purpose, data inventory, retention period, child-use position, contract, and owner.
- App Store privacy labels and Google Play Data safety/Target audience declarations match the production build.

## 2. Current beta data map

| Data | Current location | Purpose | Child default | Current deletion |
| --- | --- | --- | --- | --- |
| Broad age path | Local browser/app storage | Reading, visual, and timer adaptation | Allowed locally | Delete local profile |
| Avatar and optional display name | Local browser/app storage | Player customization | Child name forced to “Player” | Delete local profile |
| Module IDs, mastery, XP, badges | Local browser/app storage | Learning progression | Private/local only | Reset progress or delete profile |
| Legal acknowledgement versions | Local browser/app storage | Record the local-beta acknowledgement | Local only | Delete local profile |
| Product events | Local browser/app storage | Optional product improvement | Always off under 13 | Turn off measurement or delete profile |
| Email, OAuth subject, parental consent | Not collected in beta | Future secure accounts | Online child account disabled | Not applicable |

Product events are allowlisted and coarse: event name, timestamp, surface, broad age path, sport/module identifier, outcome, and step counts. They may not contain names, emails, birth dates, answer text, free-form text, location, advertising IDs, device IDs, IP addresses, or cross-app identifiers. Local history is capped at 200 events and 30 days.

## 3. User and parent privacy operations

The web and mobile Privacy Centers provide:

1. **Export my data** — produces a readable JSON export of the complete local profile.
2. **Reset learning progress** — removes XP, completions, and completion receipts while preserving the player card and privacy choices.
3. **Delete local profile** — removes the entire local profile and returns to the age/privacy gate.
4. **Product measurement choice** — off by default; unavailable to under-13 players; deleting or turning it off removes local event history.
5. **Legal documents and versions** — links to the Privacy Notice and Terms and shows the versions acknowledged on the device.

For future accounts, requests must be authenticated and logged in `privacy_events`. Export artifacts must expire. Deletion requests move through requested, processing, and complete states. Parent access to child data must be checked against current profile ownership and consent status on every request.

## 4. Retention standard

- Local guest profile: until the user resets/deletes it, clears storage, or removes the app.
- Optional beta product events: maximum 30 days and 200 events on the device.
- Online progress: retain while an account is active and the learning service needs it; set a final inactive-account period with counsel before launch.
- Export artifacts: short-lived; the database supports an explicit expiration timestamp.
- Legal/consent evidence: retain only for the approved legal/operational period. It is append-only while retained.
- Deleted account data: remove from active systems promptly and from backups according to the published backup-expiration schedule.

No record may be retained indefinitely merely because storage is inexpensive.

## 5. Progress integrity and progression design

### Client behavior now

- General modules unlock in order; every preceding general module must be complete.
- Position/event paths are open in parallel with General IQ. Each path's foundation module begins with its own role/event primer, so a learner can explore a role without completing General IQ first. Tactical and mastery levels then unlock sequentially inside that chosen role/event path.
- The eligible catalog is age-aware: ages 7–12 see foundation modules, ages 13–15 add tactics, and ages 16+ add mastery. Web and mobile calculate progress from that same catalog.
- Legacy module IDs are migrated through explicit aliases before progress is evaluated; identifiers are restricted to measurement-safe characters.
- Completion requires an answer record for every planned question.
- XP and the completion bonus are awarded once, on the first completion of a module.
- Replays return learning feedback and award no repeat completion XP; the web beta also updates concept-mastery history.
- Results clearly distinguish a first completion from a practice run.
- A completion receipt records module, sport, time, XP, and score locally.

### Required online authority

The database has one `module_completions` row per player/module and an idempotent client-submission ID. Before sync is enabled, the completion endpoint must:

1. Authenticate the adult/account session and authorize the player relationship.
2. Reject child profiles without current verified consent when online collection requires it.
3. Validate module and content versions against server curriculum metadata.
4. Validate the curriculum's path-specific prerequisite policy and the expected question set. General modules remain sequential; first-level position/event modules do not require General IQ completion.
5. Recalculate score and XP on the server; never accept client XP totals.
6. Insert completion and update progress in one transaction.
7. Return the prior receipt for duplicate submissions rather than awarding XP again.
8. Rate-limit and audit suspicious completion velocity or impossible sequences.

Public leaderboard XP must be calculated only from authoritative completion rows. Guest/client XP never enters the public league.

## 6. Product measurement plan

### North-star learning measure

**First valid module completion rate:** the percentage of eligible `module_started` events that reach a first `module_completed` event. Practice completions are reported separately.

### Supporting measures

- Sport-to-start conversion: `sport_opened → module_started`.
- Lesson completion: lesson steps viewed before the first question.
- Learning success: correct/incorrect question outcomes by broad age path, sport, module, and surface.
- Concept recovery rate: learners who answer correctly after an initial miss.
- Progression clarity: `progression_blocked` events and where they occur.
- Media reliability: `video_played` and `video_failed`.
- First-completion accuracy and practice accuracy, reported separately.
- 7–9 usability: completion and abandonment, never speed pressure or timer performance.

### Collection rules

- Under 13: product-improvement measurement is disabled in the beta.
- Age 13+: explicit opt-in; off by default; easy withdrawal; no advertising or device identifiers.
- Server storage uses daily aggregate rows without account, player, device, network, or session identifiers.
- Do not join measurement to authentication, support, advertising, or social data.
- Do not run experiments on children without privacy review and a documented benefit/risk assessment.
- Never optimize for time-on-app, compulsive streak pressure, notification opens, or purchases by children.

## 7. Operating cadence

### Every release

- Compare the code/SDK inventory with App Store privacy labels, Google Play Data safety, and the Privacy Notice.
- Run the governance contract tests, type checks, lint, web build, and mobile device smoke test.
- Confirm child product measurement is still rejected and public leaderboard queries still exclude child profiles.
- Test export, progress reset, local-profile deletion, replay XP, and locked-module bypass attempts.

### Monthly during beta

- Review questions with high incorrect/abandonment rates for teaching or wording problems.
- Review blocked-progression and media-failure rates.
- Review privacy requests/incidents and confirm owners and response times.
- Delete expired export artifacts and optional events according to policy.

### Before production accounts

- Complete a privacy impact assessment, threat model, vendor review, backup/restore test, deletion rehearsal, and independent security/privacy review.

## 8. Primary references reviewed

- [FTC COPPA compliance FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [FTC 2025 COPPA Rule amendment summary](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data)
- [FTC 2026 age-verification policy statement](https://www.ftc.gov/news-events/news/press-releases/2026/02/ftc-issues-coppa-policy-statement-incentivize-use-age-verification-technologies-protect-children)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple guidance for age-appropriate experiences](https://developer.apple.com/kids/)
- [Google Play Families policies](https://support.google.com/googleplay/android-developer/answer/9893335)
- [Google Play target audience and content guidance](https://support.google.com/googleplay/android-developer/answer/9867159)

The FTC materials emphasize parental notice/consent, parent access/deletion, security, data minimization, and purpose-limited retention. Apple restricts third-party analytics and child/device identifiers in Kids Category apps and requires parental gates for external actions. Google requires accurate child-audience declarations, privacy disclosures, and child-safe data practices. Counsel must map these requirements to RepQuest’s final entity, vendors, regions, and store category.
