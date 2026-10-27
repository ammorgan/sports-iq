# RepQuest Content and Media Standard

> Current scope (2026-10-26): [FIVE_SPORT_GAME_PLAN.md](FIVE_SPORT_GAME_PLAN.md) is the controlling specification for the five-sport, video-free experience. Older catalog, media, and age-depth details below describe retained legacy content, not the new primary course or release approval.


## Purpose

RepQuest must teach accurately and show the correct sport. A polished presentation cannot compensate for an unsupported rule, unexplained term, ambiguous question, incorrect clip, or uncertain media license.

## Curriculum publication gate

Every assessed concept must have:

1. A plain-language teaching card presented before the question.
2. A governing-body or recognized regulatory source.
3. A named ruleset or discipline, such as international 5-on-5 flag football or professional unified-rules MMA.
4. A review date and next-review date.
5. Age-specific wording and an explanation of the correct answer.
6. A human content review for ambiguity, variants, and terminology.

If a rule differs by league, age, sex category, discipline, or governing body, the product must state the chosen context and avoid presenting the rule as universal.

## Question review checklist

- Does the lesson explicitly teach every term used by the question?
- Does the prompt ask for one decision in one sentence? Split a second decision into a separate question and concept ID.
- Is the prompt concise—ideally 18 words or fewer and never more than 24 without editorial approval?
- Is the unit clear—for example, players from one team rather than all players present?
- Is exactly one answer correct unless the interaction says to select more than one?
- Could a knowledgeable reader defend a distractor under another common ruleset?
- Are all choices parallel in grammar and similar enough in length that the correct answer is not visually obvious?
- Are distractors realistic mistakes from the same decision space rather than jokes, unrelated facts, or obviously careless actions?
- Is the correct answer position mixed with deterministic ordering?
- Does the explanation teach why, not merely repeat the answer?
- Do younger versions reduce reading without changing the underlying truth?
- Do ages 15+ use plausible, non-trick distractors?
- Has a second reviewer signed off?

## Coach terminology gate

Every position, event, style, or skill path must define a role-specific read and a sport-specific decision sequence before publication. Wording must use the language a qualified coach would use for that ruleset—for example, a quarterback reads the safety shell, box count, leverage, and post-snap rotation before executing the progression.

- Do not replace established sport terms with generic classroom metaphors such as “find the clue” or “decide what the clue means.”
- Do not force team-sport terms such as teammate, assignment, or play call into individual-event paths where race plan, shot plan, routine, attempt, target, or technique is correct.
- Age adaptation may shorten or define a term, but it must not replace the correct term with an inaccurate one.
- Define unfamiliar vocabulary before it is assessed, then reuse the same term consistently in the lesson, question, answer, feedback, and remediation.
- Label scheme-, discipline-, or competition-specific language. A term that is correct in one system must not be presented as universal.
- Require a coach or sport subject-matter reviewer to approve terminology alongside rules accuracy. Automated checks are a regression gate, not a substitute for that sign-off.

## Media publication gate

Every clip must record:

- Sport and discipline shown.
- Source page and creator/source name.
- License name and license URL.
- Download/acquisition date.
- Review date and reviewer.
- Whether editing, trimming, muting, cropping, or compression occurred.
- Required attribution.
- A plain-language viewing cue that matches what is visible.
- A sport-match decision: verified, rejected, or needs review.

Only `verified` clips are returned by the application. `Needs review` clips remain in the registry but display the honest in-product placeholder. Rejected clips should be removed from distributable assets when no other product use exists.

## Visual match criteria

- **Tackle football:** pads/helmets, eleven-player game context when visible, blocking/tackling play—not flag football.
- **Flag football:** visible flag belts or unmistakable flag pulls, non-tackle rules, appropriate spacing—not padded tackle football.
- **Basketball:** basketball court, hoop, ball, and recognizable live play.
- **Soccer:** association-football field, goals, ball, and recognizable live play—not American football.
- **MMA:** regulated mixed-rules bout or unmistakable training that demonstrates both the named concept and MMA context—not generic boxing, kickboxing, or ring fitness.
- **Wrestling:** wrestling mat and recognizable takedown/control action—not boxing-ring training.

## Current 24-sport inventory

“Source registered” means the code points to the named governing source and
records a review date. It does not replace question-level sport-SME approval.

| Sport | Curriculum authority | Clip status |
|---|---|---|
| Tackle football | NFL Football Operations | Verified Pexels record |
| Flag football | IFAF | Unavailable; matching excerpt quarantined pending rights confirmation |
| Basketball | FIBA | Verified Pexels record |
| Soccer | IFAB | Verified Pexels record |
| Volleyball | FIVB | Verified Pexels record |
| Baseball | WBSC | Verified Pexels record |
| Softball | WBSC | Verified Pexels record |
| Ice hockey | IIHF | Verified Pexels record |
| Lacrosse | World Lacrosse | Unavailable; old box-lacrosse excerpt quarantined pending rights review |
| Rugby | World Rugby | Verified Pexels record |
| Field hockey | FIH | Reviewed CC BY 3.0 record; newer footage remains desirable |
| Water polo | World Aquatics | Needs visual/date review; placeholder shown |
| Cricket | MCC | Verified Pexels record |
| Tennis | ITF | Verified Pexels record |
| Track and field | World Athletics | Verified Pexels record |
| Swimming | World Aquatics | Verified Pexels record |
| Gymnastics | FIG | Needs visual/date review; placeholder shown |
| Pickleball | USA Pickleball | Verified Pexels record |
| Badminton | BWF | Verified Pexels record |
| Golf | USGA and The R&A | Verified Pexels record |
| Cycling | UCI | Verified Pexels record |
| MMA | ABC Unified Rules | Verified striking example only; not a complete striking-and-grappling overview |
| Wrestling | UWW | Missing; acquire discipline-correct, rights-cleared mat footage |
| Bowling | USBC | Verified Pexels record |

All 24 source anchors are registered. Every generated module declares its source
IDs, but every module still requires named human sport-SME and editorial sign-off
before production publication. Remote clips outside the verified set are hidden.
Local flag-football and lacrosse files were moved from distributable web/mobile
asset directories into `.audit/media-review/`; field-hockey footage retains its
reviewed Creative Commons attribution record while a newer source is sought.

## AI-generated media

AI-generated or illustrated sequences may explain a concept, formation, court area, or role. They must be labeled “illustration” or “animated example,” cannot be described as real gameplay, and cannot replace an actual-play clip when the product promises real footage.

## Review cadence

- Re-check rules and media records at least every six months and before a major sports season or rules update.
- Re-review immediately when a governing body publishes rule changes, a source removes content, or a license changes.
- Preserve an audit history rather than overwriting prior decisions.
