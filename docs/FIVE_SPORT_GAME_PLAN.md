# RepQuest: five-sport game and learning plan

Decision date: 2026-10-26. Implementation and verification continued on 2026-10-27.

This is the current scope for the web and Expo apps. It supersedes older claims that all 24 sports are published or that short videos are part of the active experience.

## The game analyst's assessment

The main issue was the relationship between learning and play. A new player faced a large sport catalog, long introductions, role terminology, several competing buttons, and question screens that mostly behaved alike. The football locker-room art added atmosphere, but the underlying action was still largely reading and selecting an answer. More decorations or a larger question bank would not solve that learning problem.

The user's seven Duolingo screenshots show the useful patterns: one task per screen; a short instruction; a character connected to the task; large answer targets; different ways to respond; visible progress; immediate feedback; and a clear next action. RepQuest adopts those functional patterns with its own sport content, purple/gold palette, characters, and wording. It does not copy Duolingo's brand, character art, or interface exactly.

Evidence limits: a fresh Chrome play-through covered the published home, the ten-section football map, teaching, cards, a word-bank blank, matching, ordered steps, game decisions, wrong answers, and a missed retry. Screenshots were captured at the actual 1280 × 625 CSS viewport. The requested 390 × 844 override did not change that viewport, so it is not evidence for phone layout. The separate fixture was declined and was not revisited. Native iOS/Android exports passed, but physical-device usability and a full five-sport end-to-end visual sign-off remain open. September screenshots do not approve this release.

## Product decisions

- Publish Football, Basketball, Baseball, Soccer, and Volleyball. Keep the other 19 sports and their saved progress in the source library, hidden from the current selectors.
- Remove all video players, previews, and video placeholders from both active clients. Keep media-rights records as historical records. No native clip files are required by the active app.
- Keep one primary game path per sport. Position training remains an optional, directly accessible branch.
- Use the same course content and prerequisite rules on web, iOS, and Android.
- Use plain English at every stage. Advanced content adds harder reads and competing priorities, not unnecessarily difficult sentences.
- Keep core learning untimed at all ages. Existing age timers remain only in the older role electives. A future timed challenge must be optional.
- Treat age as reading/privacy support, not evidence of sports knowledge. A new adult starts with the same clear explanation as a new child. The core course is not shortened for younger learners.
- Display ages 6–9 using the existing private under-13 storage category, internally named `7-9`, so existing profiles continue to load safely. No birth date is added.

## The player journey

1. Choose one of five sports.
2. See the current stage, the next playable lesson, and one Continue action.
3. Meet a small group of words with short meanings. The first lesson also explains team size and the basic objective.
4. Practice with concept cards, a word-bank blank, matching, a sequence, and game decisions.
5. Get a short explanation after a response. A miss adds a coached retry later in the lesson.
6. Recover every required concept before completing the lesson. A missed retry gets another chance; there is no life loss or payment barrier.
7. Revisit earlier decisions in later lessons. Later units bring back both the previous unit and an older unit.
8. Complete Game Day at the end of a stage. It includes a newly worded situation and mixed decisions from that stage.
9. Earn first-completion XP once, unlock the next lesson, and return to the current place on the path.

The path is organized by learning outcomes. Unit and exercise counts are implementation facts, not definitions of beginner, intermediate, or advanced ability.

## Ten sections and what passing means

| Section | Learning outcome |
| --- | --- |
| 1. Meet the game | Name the goal, playing area, team size, and basic score. |
| 2. Follow the action | Follow a play, possession, batting turn, or rally from start to finish. |
| 3. Know the rules | Distinguish scores, common fouls, legal actions, and restarts. |
| 4. Attacking roles | Recognize each attacking job and explain how it helps. Baseball covers batting and running; volleyball covers attack organization. |
| 5. Defending roles | Recognize each defending job, its usual area, and support responsibilities. Baseball covers all nine fielders. |
| 6. Build skills | Choose a useful fundamental skill and put its decision steps in order. |
| 7. Work as a team | Link passes, movement, communication, coverage, and support. |
| 8. Read the game | Use pressure, space, numbers, score, and time to make a choice. |
| 9. Solve the next problem | Use a practiced response when the normal plan breaks down. |
| 10. Advanced decisions | Read the next rotation or counter, compare credible options, and manage the game situation. |

Every section has its own visible lesson journey followed by Game Day. Section length follows its subject: baseball needs a lesson for each fielder, for example. A lesson is a teaching-and-practice loop, not the entire beginner course. Age does not truncate the core path to three questions.

Completing a digital course demonstrates game knowledge practiced in the app. It does not certify professional playing ability, physical technique, medical safety, or coaching qualifications. Advanced means advanced decisions taught by this course, not an assertion that an NBA, WNBA, NFL, MLB, or international athlete has mastered their craft.

## Exercise design

| Exercise | Player action | Learning purpose | Authoring requirement |
| --- | --- | --- | --- |
| Concept cards | Select a short label from large illustrated/icon-led cards. | Recognize a term after it is taught. | Meanings and distinctions must be explicit; generic icons supplement words rather than prove understanding. |
| Word-bank blank | Place a word or number into a sentence. | Retrieve a fact without reading a long answer. | Use a sports statement, such as a free throw's value or the direction of rotation. |
| Matching | Connect each term to a meaning. | Separate related ideas. | Store and grade each exact connection; show which pairs were made and allow edits. |
| Sequence | Tap steps into a visible order; tap to undo. | Understand the order of a play or decision. | All steps must have a defensible order, not an arbitrary ranking. |
| Game decision | Choose a response to one situation. | Apply knowledge. | One decision, short options, enough context for one best answer. |
| Game Day | Apply stage concepts in a fresh situation and mixed review. | Check transfer and recovery. | Teach after a miss, allow a retry, and avoid claiming that seeing an answer proves independent mastery. |

Distractors should be plausible and similar in length. A wrong answer should expose a real misconception. Avoid joke answers, unrelated sports as routine advanced distractors, absolutes that make the answer obvious, and copying the full explanation into the correct option.

Current implementation includes matching, word banks, ordered sequences, game decisions, and 40 role-identification diagram exercises. Each role diagram first shows labeled positions and then asks for a marked player. The diagrams are deterministic learning data, not photos; all examples explicitly avoid claiming fixed tactical locations. Animated possessions, coverage rotations, and richer ball-placement games remain follow-up work. The catalog's old `hotspot` label alone is not a spatial interaction.

## Clarity and inclusion

- Explain a term before assessing it. For example: “Paint: the marked lane near the basket, also called the key.”
- Keep one action in the instruction: “Match each pair,” “Fill the gap,” or “Pick the next play.”
- Use real coaching terms with short definitions: “read,” “coverage,” “rotation,” and “support,” rather than vague “clues.”
- Keep the character beside the lesson, not in front of controls.
- Provide generous targets, visible selection, text labels, sufficient contrast, and keyboard access. Do not rely only on color.
- Matching and sequences must work with taps; dragging is not required.
- Preserve reduced-motion support and avoid essential information conveyed only through animation.
- Provide respectful encouragement after mistakes. Do not equate a failed answer with a failed player.
- Voice remains disabled as previously requested. Some six-year-olds and other early readers will need adult support until approved narration and more visual teaching are available. A displayed age band is not proof of independent usability.
- Adult beginners get plain explanations without childish labels. Experienced players can use position electives; a validated general-course placement/test-out system is a planned improvement, not implemented in this release.

## Expansion model

The shared curriculum is authored in sport-specific files. A course has stable section IDs; each section explicitly lists its lesson IDs. Lessons can contain variable numbers of terms, decisions, and sequence steps. No database migration is needed to add a section lesson or exercise. The compiler validates missing or duplicate lesson placements instead of silently dropping content. Web and native renderers consume the same exercise and formation data.

The published catalog is separate from the retained 24-sport reference catalog. This hides unfinished breadth without deleting old records. Diagram exercises have explicit player coordinates, a target role, distinct alternatives, and an explanation; they do not infer a position from appearance. Checkpoints use section IDs rather than numbers so reorganizing the path does not wrongly reuse an older checkpoint receipt.

## Progress and reward integrity

Course progress uses only the active course's sequential lessons. Optional role lessons do not inflate its percentage. Old or sparse later receipts remain stored, but cannot make the path jump over a missing prerequisite. The new course uses `rq-` IDs so old quizzes are not misrepresented as newly learned material.

The same shared functions grade answers and require concept recovery in both clients. Matching is order-independent but pair-sensitive. Sequencing is order-sensitive. Duplicate selected answers do not pass. A complete lesson requires all original questions to be answered and all required concepts to have at least one successful response. XP remains a first-completion award, with no repeat-lesson farming.

Recovery during a lesson is evidence of supported learning, not the same as retention tomorrow. Cross-session spaced scheduling, a persistent mistake practice queue on mobile, and a separate unassisted mastery score remain follow-up work.

## Content credibility

Use the source registry for competition-specific facts and show sources in the lesson details. This run checked official NFL, NBA, WNBA, MLB, IFAB, FIVB/USAV sources. MLB's public rules link currently leads to its 2025 edition; do not relabel that document as a 2026 edition. Tactical examples are authored instructional scenarios, not universal best-play claims.

Each sport still needs a qualified coach/editor to review accuracy, context, terminology, answer ambiguity, and whether advanced distractors are credible. An authoritative link or a green automated test does not constitute that human review.

Primary references:

- [NFL 2026 Rulebook](https://operations.nfl.com/rules-officiating/2026-nfl-rulebook/)
- [NBA Official Rulebook](https://official.nba.com/rulebook/)
- [WNBA Official Rules](https://www.wnba.com/wnba-rule-book)
- [MLB Official Baseball Rules linked by MLB](https://mktg.mlbstatic.com/mlb/official-information/2025-official-baseball-rules.pdf)
- [IFAB Laws](https://www.theifab.com/laws/latest/)
- [USA Volleyball rules and interpretations](https://usavolleyball.org/resources-for-officials/rulebooks-and-interpretations/)
- [Duolingo's explanation of review and spaced repetition](https://blog.duolingo.com/spaced-repetition-for-learning/)

## Development and validation priorities

1. Complete real phone, tablet, keyboard, and screen-reader play-throughs of the new path and every exercise type. The current visual check remains incomplete.
2. Have sport specialists review all five authored courses, especially the advanced tactical tradeoffs and competition-specific rules.
3. Extend the new role-identification diagrams into animated possessions, coverage rotations, base-runner situations, and ball-placement decisions. Review each authored alignment with a sport specialist.
4. Expand role electives into authored sequences matching the new core course. Existing role paths remain available but have not all been rewritten in this pass.
5. Add a no-pressure placement check and a persistent practice area. Keep learning, recovery, and unassisted mastery separate.
6. Conduct supervised usability sessions across younger children, teens, adult newcomers, experienced athletes, and older adults. Observe understanding and independence before adding more sports.
7. Refine rewards around learning goals, recovered mistakes, and return visits. Avoid punitive lives, compulsory speed, and grinding XP.

Product measurement should answer: Can people find their next action? Do they understand the new term? Can they apply it later without a hint? Where do they stop or need help? Existing under-13 measurement remains off; use supervised sessions with the responsible adult for youth research. Do not claim the current event list measures retention, accessibility, or enjoyment automatically.

## Authored course specifications

The following inventory is generated from the same authored units the clients consume. Each sport has a complete path through all ten sections, with a Game Day check after each section. The inventory records actual learning goals, terms, and application decisions; it is not a promise based on question count.

### Football

Rule context: 11-player tackle football. Special rules are named when they matter.


#### 1. Meet the game

Outcome: Know the goal, the playing area, and how many players take part.

- **Meet football** — Know who has the ball and where they want to go.
  - Teach: Offense: The team with the ball. Defense: The team trying to stop the ball. End zone: The scoring area at each end of the field.
  - Apply: Your team has the ball. Which group is playing? Where does the offense try to take the ball?

- **The field and the teams** — Know the team size and the direction of play.
  - Teach: Eleven: Players from each team on the field in standard tackle football. Goal line: The line where an end zone begins. Yard line: A field marking that helps measure distance.
  - Apply: Both teams have full lineups. How many players are on the field? What do yard lines help you measure?

- **Move and score** — Understand downs, yards to gain, and a touchdown.
  - Teach: Down: One play for the offense. First down: A new set of four plays, usually earned by gaining 10 yards. Touchdown: A score worth six points before the extra-point try.
  - Apply: It is first and 10. Your team gains 10 yards. What comes next? A runner scores a touchdown. How many points are added before the try?

  - Rule teaching: A touchdown is 6 points, a field goal is 3, and a safety is 2. After a touchdown, the try can add 1 or 2.

Game Day transfer: A blue player carries the ball toward the red team's end zone. Which unit is blue using?

Expected reasoning: The unit with the ball is the offense, regardless of its uniform color.


#### 2. Follow the action

Outcome: Follow a play from its start to its finish.

- **Follow one play** — Find the start of a play and tell when it ends.
  - Teach: Snap: A backward pass by the center that starts a play. Line of scrimmage: The starting line through the ball before a play. Dead ball: A ball that is no longer in play.
  - Apply: Who sends the snap to start the play? The runner goes out of bounds. What happens to that play?

  - Rule teaching: The field has 100 yards between the goal lines, plus an end zone at each end.

- **Run or pass** — Tell a handoff from a pass and recognize an incomplete pass.
  - Teach: Handoff: Giving the ball directly to a teammate. Forward pass: A throw that travels toward the opponent's goal line. Incomplete pass: A forward pass that is not caught legally.
  - Apply: The quarterback puts the ball into the running back's hands. What is that? A forward pass hits the ground before anyone catches it. What is the result?

- **A game in four parts** — Follow quarters, halftime, and the clock.
  - Teach: Quarter: One of four main periods of the game. Halftime: The break after the second quarter. Play clock: The time limit to start the next play.
  - Apply: The second quarter ends. What break comes next? The play clock is nearly at zero. What needs to happen?

Game Day transfer: The second quarter just ended. Which part of the game comes next?

Expected reasoning: Halftime follows the first two quarters.


#### 3. Know the rules

Outcome: Understand scores, common fouls, and restarts.

- **All the ways to score** — Tell a safety score from a safety position.
  - Teach: Safety score: Usually two points when the team with the ball is responsible for it becoming dead in its own end zone. Kicked try: A kick after a touchdown that can add one point. Two-point try: A play after a touchdown that can add two points.
  - Apply: A runner is tackled with the ball in their own end zone. What is the usual score? A team runs the ball into the end zone on its try after a touchdown. How many extra points?

- **Flags and kicking plays** — Understand common penalties and scoring kicks.
  - Teach: False start: An illegal early movement by an offensive player before the snap. Holding: Illegally grabbing or restricting an opponent. Field goal: A kick through the uprights worth three points.
  - Apply: An offensive lineman jumps early and the official stops play. What is the likely call? A field-goal kick goes between the uprights above the crossbar. How many points?

- **Who gets the ball?** — Recognize turnovers and fourth-down choices.
  - Teach: Interception: A defender legally catches an opponent's pass. Fumble: A player loses a live ball after having control. Punt: A kick used to send the ball downfield, usually giving it to the opponent.
  - Apply: A defender catches the quarterback's pass. What happened? It is fourth and long near your own goal. Which choice often moves the opponent farther away?

Game Day transfer: It is fourth and 3. The offense gains only 2 yards. Who normally gets the next possession?

Expected reasoning: Failing to reach the line to gain on fourth down gives the opponent the ball.


#### 4. Meet the attacking roles

Outcome: Find each attacking role and explain its job.

- **Meet the offense** — Connect the quarterback, backs, receivers, and line.
  - Teach: Quarterback: The player who usually takes the snap and directs the offense. Receiver: A player whose job often includes catching passes. Offensive line: The blockers who protect the passer and help open running lanes.
  - Apply: Who usually takes the snap and chooses a throw in a pass play? A receiver is not getting the ball on this play. How can the receiver still help?

- **Quarterback: lead the play** — Find the quarterback and understand the first decision.
  - Teach: Quarterback (QB): Usually receives the snap and runs the called play. Under center: The quarterback lines up directly behind the center. Shotgun: The quarterback starts several yards behind the center.
  - Apply: Who usually receives the snap and directs a pass play? The QB starts several yards behind the center. What is this alignment?

  - Visual practice: identify the quarterback in an example alignment. Teach the labeled layout before testing.

- **Center: start the play** — Find the middle lineman and explain the snap.
  - Teach: Center (C): The middle offensive lineman who snaps the ball. Snap: The backward transfer that starts the play. Protection: The blocking plan that gives the passer time.
  - Apply: Which offensive lineman has the ball before the snap? After snapping on a pass play, what does the center usually do?

  - Visual practice: identify the center in an example alignment. Teach the labeled layout before testing.

- **Guards: beside the center** — Find LG and RG and understand their blocking work.
  - Teach: Left guard (LG): The offensive lineman immediately to the center's left. Right guard (RG): The offensive lineman immediately to the center's right. Pull: A blocker moves from the starting spot to lead a block elsewhere.
  - Apply: Which player is immediately left of the center, from the offense's view? A guard leaves the starting spot to lead a running play. What is that movement called?

  - Visual practice: identify the left guard in an example alignment. Teach the labeled layout before testing.

- **Tackles: protect the outside** — Find LT and RT without confusing a position with a tackle action.
  - Teach: Left tackle (LT): The offensive lineman outside the left guard. Right tackle (RT): The offensive lineman outside the right guard. Pass rusher: A defender trying to reach the passer.
  - Apply: Which offensive lineman lines up outside the right guard? A defender rushes around the outside on a pass. What is the tackle trying to protect?

  - Visual practice: identify the right tackle in an example alignment. Teach the labeled layout before testing.

- **Running back and fullback** — Understand carrying, receiving, and helping protect.
  - Teach: Running back (RB): A back who often carries the ball and can also receive or block. Fullback (FB): A back often used as a lead blocker and sometimes as a runner or receiver. Lead block: A block made ahead of the ball carrier.
  - Apply: A back takes a handoff and follows the blocking. Which role is this often? A fullback moves ahead of the runner to block. What job is that?

  - Visual practice: identify the running back in an example alignment. Teach the labeled layout before testing.

- **Wide receiver: run the route** — Find wide receivers and understand work without the ball.
  - Teach: Wide receiver (WR): A player often aligned away from the line's center to run routes. Release: The receiver's first movement off the line. Separation: Space between a receiver and a defender.
  - Apply: Which role often begins wide and runs a pass route? Why does a receiver change speed during a route?

  - Visual practice: identify the wide receiver in an example alignment. Teach the labeled layout before testing.

- **Tight end: two kinds of help** — Connect blocking and receiving in one role.
  - Teach: Tight end (TE): A player who can block near the line or run a receiving route. Attached: Aligned beside an offensive tackle. Flexed out: Aligned farther away from the offensive line.
  - Apply: A tight end lines up beside the right tackle. What alignment is shown? Must a tight end block on every play?

  - Visual practice: identify the attached tight end in an example alignment. Teach the labeled layout before testing.

Game Day transfer: The middle offensive lineman sends the ball backward, then blocks. Which role is this?

Expected reasoning: The center starts the play with the snap, then carries out the blocking job.


#### 5. Meet the defending roles

Outcome: Find each defending role and explain its job.

- **The defensive line** — Tell defensive tackles from defensive ends.
  - Teach: Defensive tackle (DT): An interior defender near the offensive guards or center. Defensive end (DE): A defender near the outside of the defensive line. Nose tackle: An interior defender often aligned near the center.
  - Apply: Which defender is usually inside, near the center and guards? An end rushes from outside the tackle. What is one possible job?

  - Visual practice: identify the interior defensive lineman in an example alignment. Teach the labeled layout before testing.

- **Inside linebacker** — Learn the defender behind the middle of the line.
  - Teach: Inside linebacker (ILB): A linebacker aligned behind the inside of the defensive front. Run fit: The assigned space a defender protects against a run. Short zone: An underneath area a defender covers against passes.
  - Apply: A linebacker is assigned an inside run gap. What comes first? Can an inside linebacker cover a pass?

  - Visual practice: identify the inside linebacker in an example alignment. Teach the labeled layout before testing.

- **Outside linebacker** — Tell edge rushing from off-ball linebacker work.
  - Teach: Outside linebacker (OLB): A linebacker with an outside alignment; duties depend on the defense. Set the edge: Keep a runner from escaping outside the defense. Edge rusher: A defender whose work includes rushing from outside the front.
  - Apply: A runner tries to get around the defense. What does setting the edge help do? Does every OLB rush on every pass play?

  - Visual practice: identify the outside linebacker in an example alignment. Teach the labeled layout before testing.

- **Cornerback: cover outside** — Understand receiver coverage and outside support.
  - Teach: Cornerback (CB): A defensive back who often aligns near a wide receiver. Press coverage: A close starting alignment near a receiver. Off coverage: A starting alignment with space from the receiver.
  - Apply: A defender starts across from a wide receiver near the sideline. Which role is likely? A corner gives the receiver several yards before the snap. What alignment is shown?

  - Visual practice: identify the cornerback in an example alignment. Teach the labeled layout before testing.

- **Safety: protect deep space** — Tell the defensive position from the two-point score.
  - Teach: Safety position: A defensive back often responsible for deeper space and support. Deep help: A defender positioned behind another defender. Run support: Helping stop a running play.
  - Apply: A defender starts deep behind the cornerbacks. Which role is likely? Does the position called safety automatically award two points?

  - Visual practice: identify the deep safety in an example alignment. Teach the labeled layout before testing.

- **Meet the defense** — Learn how the front, linebackers, and backs share work.
  - Teach: Defensive line: Defenders near the ball who contest blocks and pressure the passer. Linebacker: A defender who may stop runs, cover, or rush. Defensive back: A cornerback or safety who often defends passes.
  - Apply: In a traditional 4-3 defense, what is the middle linebacker often called? An outside linebacker is assigned to rush from the edge. What job is described?

Game Day transfer: A player is listed as an outside linebacker. Does that name alone tell you whether the player rushes or covers?

Expected reasoning: Outside linebackers can have different responsibilities. Learn alignment, scheme, and the actual call.


#### 6. Build your skills

Outcome: Choose a basic skill and explain when it helps.

- **Secure the ball** — Choose habits that keep a catch or carry under control.
  - Teach: Ball security: Keeping firm control of the ball. Catch: Gaining legal control of a pass in bounds. Sideline: The boundary along each side of the field.
  - Apply: A runner enters traffic. What should stay protected? In NFL play, a receiver catches near the sideline. What else must be checked?

- **Find open space** — Connect simple routes with where defenders are standing.
  - Teach: Route: The planned path a receiver runs. Slant: A short route angled toward the middle. Flat: The short outside area near a sideline.
  - Apply: A receiver takes a short inside angle after the release. Which route is it? A defender stays deep and the flat is open. Which space may be available?

- **Time and running lanes** — Understand what blockers create and what defenders protect.
  - Teach: Pocket: The protected space around a passer. Gap: A space between offensive blockers. Edge: The outside of the line of players near the ball.
  - Apply: A lineman keeps a rusher away from the quarterback. What is the lineman helping create? A defender is assigned one inside gap. What should the defender protect first?

Game Day transfer: A receiver breaks toward the sideline on a short route. Which area is the receiver entering?

Expected reasoning: The flat is the short outside space. A receiver's route must be connected to the defenders there.


#### 7. Work as a team

Outcome: Connect your job with the players around you.

- **Get everyone on the same play** — Understand the huddle, cadence, and assignment check.
  - Teach: Huddle: Players gather to hear the next call. Cadence: The quarterback's signals and rhythm before the snap. Assignment: The job one player has on a play.
  - Apply: Two players heard different protection calls. What should happen before the snap? What tells a player the job on this snap?

- **Build a running play** — Connect inside runs, outside runs, and assigned blocks.
  - Teach: Inside run: A run aimed between or close to the interior blockers. Outside run: A run aimed toward the edge of the blocking front. Cutback: A runner changes direction toward an open lane behind the flow.
  - Apply: A run is called inside. What should the back read first? Defenders overrun an outside play and an inside lane opens. What might the runner see?

- **Meet the specialists** — Connect the snapper, holder, kicker, punter, and returner.
  - Teach: Long snapper (LS): Sends a longer snap on punts and place kicks. Kicker (K): Takes place kicks such as field goals. Punter (P): Drops and kicks the ball to send it downfield.
  - Apply: Who normally kicks a field-goal attempt? A player drops the ball from the hands and kicks it before it lands. What kick is shown?

- **Every unit matters** — Follow kicks, returns, and support away from the ball.
  - Teach: Special teams: The units used on kicking plays. Coverage team: Players trying to stop a kick return. Fair catch: A signaled catch that gives up the return in exchange for protection.
  - Apply: A returner makes a valid fair-catch signal. What is given up? Your teammate is returning a punt. What helps most?

Game Day transfer: A run flows outside but the defense leaves an inside lane. What may the runner read?

Expected reasoning: Read the blocking and available space before cutting back.


#### 8. Read the game

Outcome: Use space, time, and the opponent's movement to choose a response.

- **Read down and distance** — Use the situation before choosing a play.
  - Teach: Distance: Yards still needed for a first down. Short yardage: A situation with only a few yards to gain. Field position: Where the ball sits on the field.
  - Apply: It is third and 2. A safe play gains 3 yards. What does it earn? You trail with little time and need a touchdown. What matters besides yards?

  - Rule teaching: Football uses four quarters. Quarter length and some clock rules depend on the league.

- **Read pass coverage** — Tell basic zone structures from man coverage.
  - Teach: Man coverage: A defender is assigned to cover a receiver. Cover 2 zone: Two defenders divide the deep field into halves. Cover 3 zone: Three defenders divide the deep field into thirds.
  - Apply: After the snap, three defenders spread across deep thirds. Which basic zone is shown? A defender follows a receiver through several route breaks. What does that suggest?

- **Use motion to read coverage** — Treat movement as evidence, not a guaranteed coverage answer.
  - Teach: Motion: Legal movement by an offensive player before the snap. Man indicator: An action that suggests a defender has a receiver assignment. Match coverage: Zone rules that can turn into receiver matching.
  - Apply: A defender follows a receiver's motion. What does that suggest? What confirms a defender's real job?

Game Day transfer: Two safeties show deep before the snap. What is still needed to identify the coverage?

Expected reasoning: The pre-snap shell narrows possibilities. Rotation and route responsibility confirm what the defense plays.


#### 9. Solve the next problem

Outcome: Recognize pressure and use a practiced answer.

- **Read the defender** — Connect a play's decision to the defender it puts in conflict.
  - Teach: Read defender: The defender a play asks the ball handler to watch. Leverage: A position advantage to one side of an opponent. Checkdown: A shorter pass option later in the progression.
  - Apply: The called read defender drops into the first throwing lane. What should the quarterback do? A runner has outside support waiting but an inside lane is protected. Which defender's plan is working?

- **Answer pressure** — Connect pass protection and quick answers to a rush.
  - Teach: Blitz: A pressure that sends additional defenders to rush. Hot answer: A planned quick response to an unblocked rusher. Protection call: The assignment that tells blockers whom to protect against.
  - Apply: The defense sends an unblocked rusher covered by the play's hot rule. Which response fits? A receiver sees pressure that changes the route under team rules. What must be shared?

- **Play near the goal line** — Understand how less space changes the passing plan.
  - Teach: Red zone: The area inside the opponent's 20-yard line. Compressed field: Less space behind defenders near the end zone. Throwaway: A legal pass discarded to avoid a worse result, subject to grounding rules.
  - Apply: Near the opponent's goal, what happens to deep passing space? A pass window closes near the goal. Must the QB force a throw?

Game Day transfer: Near the goal line, the first passing window closes. What is the useful next step?

Expected reasoning: Limited space makes timing and possession important. Follow the called progression.


#### 10. Advanced game decisions

Outcome: Compare options and adjust when the opponent changes the plan.

- **Beat a changing picture** — Adjust to rotation without treating a coverage label as a guaranteed throw.
  - Teach: Rotation: Defenders move into a different coverage picture after the snap. High-low read: Two routes test a defender at different depths. Progression: The planned order of a passer's reads.
  - Apply: Two safeties show deep, then one rotates down. What should the quarterback trust? On a called high-low, the underneath defender takes the short route and the deep window stays safe. Which read fits? The flat defender sinks under the deep route. The short route is open. Which high-low response fits? Two safeties show deep. After the snap, one rotates down and three defenders cover deep thirds. Which zone appears?

- **Read two levels** — Connect a coverage read to a specific route concept.
  - Teach: Underneath defender: A defender working a shorter passing area. Deep cap: Coverage protecting above a receiving route. Throwing window: Space and timing in which a pass can safely reach its target.
  - Apply: The short defender drops under the deeper route. The short route is open. Which option fits this high-low? The deep safety closes the high route. Why is the coverage label not enough?

- **Manage the final drive** — Choose between risk, clock, and field position.
  - Teach: Two-minute offense: An offense working quickly with limited time. Timeout: A team stoppage that can preserve time. Situational football: Decisions shaped by score, time, down, and field position.
  - Apply: You lead late and can run out the clock safely. What is the main goal? You need 3 points late and are in field-goal range. Which risk should be limited? Your team trails by 4 with one play left. Which scoring result can win in regulation? Your offense leads late and the next safe kneel ends the game. Which choice protects the win?

Game Day transfer: Your first route is covered and the assigned checkdown is open. What fits the called progression?

Expected reasoning: The progression gives a planned next answer. An open checkdown can preserve the possession when the first read closes.


### Basketball

Rule context: Five-on-five basketball. NBA, WNBA, and other rule differences are named.


#### 1. Meet the game

Outcome: Know the goal, the playing area, and how many players take part.

- **Meet basketball** — Know which basket to attack and how teams share the court.
  - Teach: Basket: The hoop and net a team tries to score through. Offense: The team with the ball. Defense: The team trying to stop a score.
  - Apply: Your team has the ball. What is its main goal? How many players from one team play in five-on-five basketball?

- **Five players, one team** — Know the court boundaries and full team size.
  - Teach: Five players: The number from one team on court in five-on-five basketball. Sideline: A long side boundary of the court. Baseline: The boundary behind each basket, also called the end line.
  - Apply: Both teams have five players. How many are on court altogether? The ball crosses the boundary behind the basket. Which line is it?

- **Find the basket** — Recognize the paint, the three-point line, and shot values.
  - Teach: Paint: The marked lane near the basket, also called the key. Three-point line: The arc separating two-point and three-point shots. Free throw: An unguarded shot from the foul line worth one point.
  - Apply: A player makes a shot from beyond the three-point line. How many points? A player makes a normal shot inside the arc. How many points?

  - Rule teaching: A regular basket inside or on the arc is 2 points. Beyond the arc it is 3. A free throw is 1.

- **Read the scoreboard** — Tell the score, period, and time apart.
  - Teach: Score: The total points a team has. Period: A part of the game, such as a quarter. Overtime: Extra play used to break a tie after regulation.
  - Apply: Your team has 20 points and the other has 18. How much is your lead? Regulation ends with equal scores. What normally comes next?

Game Day transfer: Red misses a shot. Blue controls the rebound. Which team is now on offense?

Expected reasoning: The team controlling the ball becomes the offense. The other team must switch to defense.


#### 2. Follow the action

Outcome: Follow a play from its start to its finish.

- **Follow the ball** — Follow a pass, a shot, and the next possession.
  - Teach: Pass: Sending the ball to a teammate. Shot: An attempt to put the ball through the basket. Rebound: Gaining the ball after a missed shot.
  - Apply: A shot misses and your teammate gains the ball. What did the teammate get? The other team gains the ball. What is your team's new job?

- **Move with the ball** — Recognize legal movement before learning advanced footwork.
  - Teach: Dribble: Bouncing the ball while moving or staying in place. Pivot foot: The foot that stays in place while a player turns with the ball. Traveling: An illegal movement of the feet while holding the ball.
  - Apply: You stop dribbling and hold the ball. Can you start a new dribble? You hold the ball and want to turn without traveling. What can you use?

- **Know when the dribble ends** — Separate a legal bounce from a second dribble.
  - Teach: Live dribble: A dribble that has not ended. Gather: Gaining control of the ball to hold, pass, or shoot. Double dribble: An illegal second dribble after the first has ended, unless a rule exception applies.
  - Apply: You hold the ball with both hands after dribbling. What can you normally do next? A player bounces with both hands at the same time. What is the usual call?

Game Day transfer: You dribbled, picked the ball up, and are now holding it. What is normally legal next?

Expected reasoning: Ending the dribble leaves passing, shooting, and legal pivoting as options.


#### 3. Know the rules

Outcome: Understand scores, common fouls, and restarts.

- **Keep play fair** — Know what happens after out-of-bounds and illegal contact.
  - Teach: Out of bounds: The ball or a player with the ball touches outside the court. Throw-in: A pass from outside a boundary to restart play. Personal foul: Illegal contact with an opponent.
  - Apply: The defense last touches the ball before it goes out. Who usually gets the throw-in? A defender holds a cutter's arm. What can be called?

- **Fouls and free throws** — Understand why a whistle can lead to shots or a throw-in.
  - Teach: Shooting foul: An illegal contact foul against a player in the act of shooting. Team fouls: Fouls counted toward a team's period limit. Bonus: A penalty situation that can award free throws for certain fouls.
  - Apply: A player is fouled on a missed two-point shot. How many free throws normally follow? Does every personal foul always give free throws?

- **Beat the clock** — Tell the game clock from the shot clock.
  - Teach: Game clock: The time remaining in the period. Shot clock: The time a team has to attempt a legal shot. Shot-clock violation: The offense fails to release a legal attempt in time.
  - Apply: The NBA shot clock shows 2 seconds. What needs to happen soon? In the NBA and WNBA, how long is a full new shot clock?

  - Rule teaching: NBA and WNBA games have four quarters. NBA quarters last 12 minutes; WNBA quarters last 10.

Game Day transfer: A shooter touches the three-point line at takeoff and makes the shot. How many points is that field goal?

Expected reasoning: A player on the arc is in the two-point area. The shot needs to be released from beyond it for three.


#### 4. Meet the attacking roles

Outcome: Find each attacking role and explain its job.

- **Meet the five roles** — Understand guards, wings, and bigs without rigid labels.
  - Teach: Guard: A player who often handles the ball and organizes perimeter play. Wing: A perimeter player who often scores, passes, and defends. Big: A frontcourt player who often screens, rebounds, and protects the basket.
  - Apply: Who often starts an offense by handling the ball? A center can shoot and pass well. Must the center stay under the hoop?

- **Point guard: organize** — Learn the ball handler's role before reading screens.
  - Teach: Point guard (PG): A player who often organizes the offense and handles the ball. Ball handler: The player controlling the ball. Play call: The team's chosen action or plan.
  - Apply: Who often brings the ball up and starts the team's action? Pressure blocks your planned pass. What should a ball handler look for?

  - Visual practice: identify the point guard in an example alignment. Teach the labeled layout before testing.

- **Shooting guard: score and connect** — Understand shooting, cutting, and secondary ball handling.
  - Teach: Shooting guard (SG): A guard who often scores, handles, and defends on the perimeter. Catch-and-shoot: A shot taken soon after receiving a pass. Off-ball movement: Moving to help when someone else has the ball.
  - Apply: The shooting guard is not holding the ball. How can they help? A defender closes the shot before the catch. What is a useful next choice?

  - Visual practice: identify the shooting guard in an example alignment. Teach the labeled layout before testing.

- **Small forward: connect the floor** — Understand the wing's scoring and defending work.
  - Teach: Small forward (SF): A wing who commonly scores, passes, rebounds, and defends. Perimeter: The outside part of the half court. Cutter: A player moving without the ball into a useful space.
  - Apply: A wing's defender watches the ball and loses sight of the wing. What can help? Can a small forward help rebound?

  - Visual practice: identify the small forward in an example alignment. Teach the labeled layout before testing.

- **Power forward: screen and finish** — Connect frontcourt scoring, spacing, and rebounding.
  - Teach: Power forward (PF): A frontcourt player who often screens, rebounds, and scores. Pop: A screener moves away from the basket into shooting space. High post: The area around the free-throw line.
  - Apply: After screening, a forward moves outward for a possible shot. What is that? A teammate drives into the lane. What should the forward avoid?

  - Visual practice: identify the power forward in an example alignment. Teach the labeled layout before testing.

- **Center: help near the basket** — Identify the center and understand more than height.
  - Teach: Center (C): A frontcourt player who often screens, finishes, rebounds, and protects the rim. Rim protection: Defending close shots at the basket. Post-up: Establishing a receiving position, often with the back toward the basket.
  - Apply: Who commonly protects the rim and rebounds as a frontcourt role? A center draws help while holding the ball near the basket. What can become available?

  - Visual practice: identify the center in an example alignment. Teach the labeled layout before testing.

Game Day transfer: Your center catches near the basket and a second defender comes. What opening may appear?

Expected reasoning: Help defense can open a pass. A center's job includes reading it.


#### 5. Meet the defending roles

Outcome: Find each defending role and explain its job.

- **Guard the ball** — Understand staying in front without grabbing.
  - Teach: On-ball defender: The defender responsible for the ball handler. Contain: Keep a dribbler from gaining a clear driving path. Reach-in foul: Illegal contact made while reaching for the ball.
  - Apply: The dribbler changes direction. What is the defender's goal? A defender hits the dribbler's arm while reaching. What may be called?

- **See your player and the ball** — Learn help position before team rotations.
  - Teach: Off-ball defender: A defender guarding someone without the ball. Help position: A spot from which a defender can support a teammate. Deny: Make a pass to an opponent harder to complete.
  - Apply: Your opponent cuts behind you while you watch only the ball. What did you lose? You help stop a drive and the ball leaves the lane. What needs attention next?

- **Stop and rebound** — Understand staying in front, boxing out, and finishing a stop.
  - Teach: Defensive stance: A balanced position ready to move with an attacker. Box out: Legally place your body between an opponent and the rebound. Defensive rebound: The defense gains the ball after an opponent's missed shot.
  - Apply: Your team makes the shooter miss. What finishes the stop? An opponent is behind you as a shot goes up. What helps protect the rebound?

- **Get back after a turnover** — Protect the basket before finding matchups.
  - Teach: First defender back: The player who first protects against a fast break. Stop the ball: Prevent the ball handler from advancing freely. Match up: Find the opponent or area to defend.
  - Apply: You are the only defender back against two attackers. What must stay protected? More defenders arrive. What helps organize them?

Game Day transfer: The shot misses. An opponent stands between you and the rim. What helps before chasing the rebound?

Expected reasoning: Rebounding begins with positioning. A legal box out creates space without holding or pushing.


#### 6. Build your skills

Outcome: Choose a basic skill and explain when it helps.

- **Find a teammate** — Choose a clear passing lane and move after passing.
  - Teach: Passing lane: The open path between passer and receiver. Bounce pass: A pass that bounces before reaching a teammate. Cut: A purposeful move without the ball.
  - Apply: A defender stands directly in your passing lane. What helps first? You pass and your defender turns toward the ball. What may create a chance?

- **Pick the passing angle** — Choose a pass from the defender's position.
  - Teach: Chest pass: A direct pass sent from around chest height. Overhead pass: A pass released from above the head. Pass fake: A movement that makes a defender expect a pass.
  - Apply: A defender's hands block a direct chest pass. What can improve the pass? A teammate is moving into open space. Where should a useful pass lead?

- **Choose a shot** — Tell a layup, an open jumper, and a rushed shot apart.
  - Teach: Layup: A close shot usually taken while moving toward the basket. Jump shot: A shot released during a jump. Shot selection: Choosing whether a shot is a useful chance to score.
  - Apply: You have a clear path close to the basket. Which finish often fits? Two defenders contest your shot and a teammate is open. What often improves the chance?

- **Range and balance** — Recognize a useful shot rather than the farthest shot.
  - Teach: Shooting range: The distance from which a player can shoot with control. Balanced shot: A shot taken from a stable position. Contested shot: A shot challenged by a defender.
  - Apply: You are far beyond your reliable range and a teammate is open closer. What often helps? A defender stays far away and you are in your range. What chance may be available?

Game Day transfer: A defender's hands close a direct pass. What can the passer change?

Expected reasoning: A pivot, fake, or different passing angle may create a clear lane.


#### 7. Work as a team

Outcome: Connect your job with the players around you.

- **Pass and cut** — Build a two-player action without a screen.
  - Teach: Give-and-go: Pass, then cut for a possible return pass. Backdoor cut: A cut behind a defender who overplays the passing lane. Return pass: A pass back to the teammate who started the action.
  - Apply: You pass and cut behind your defender toward the rim. What action may you be starting? A defender denies the front passing lane. Which cut may use the space behind?

- **Make the screen legal** — Understand position instead of moving into contact.
  - Teach: Legal screen: A screen that follows the position, time, distance, and movement rules. Moving screen: An illegal screen when movement creates unlawful contact. Screen angle: The direction from which a screen delays a defender.
  - Apply: A screener steps sideways into a moving defender and causes illegal contact. What may be called? Why tell the ball handler where the screen is coming from?

- **Make room** — Use spacing and legal screens to help the ball handler.
  - Teach: Spacing: Keeping useful distance between teammates. Screen: A legal position that delays a defender's route. Roll: The screener moves toward the basket after a screen.
  - Apply: All five attackers crowd the ball. What can help? After screening, a big has an open path to the rim. Which move fits?

- **Help and recover** — Understand guarding a player, helping, and returning to an assignment.
  - Teach: Man-to-man: Each defender is responsible for an opponent. Zone defense: Defenders share responsibility for areas of the court. Help defense: A teammate supports the defender on the ball.
  - Apply: A teammate gets beaten toward the basket. What can a nearby defender do? The offense passes out of the drive. What must the defense do next?

Game Day transfer: A defender steps away from your teammate to stop your drive. What advantage may that create?

Expected reasoning: Helping on the drive can leave another attacker open. Look for the pass the help creates.


#### 8. Read the game

Outcome: Use space, time, and the opponent's movement to choose a response.

- **Win the changeover** — Read numbers and balance attack with protection.
  - Teach: Transition: The change between offense and defense. Fast break: An attack before the defense is set. Numbers advantage: More attackers than defenders in the immediate play.
  - Apply: Two attackers face one defender. The defender commits to the ball. What is often open? Your team loses the ball. What is the first team priority?

- **Read the screen** — Make a decision from how defenders handle a ball screen.
  - Teach: Switch: Defenders exchange assignments. Drop coverage: The screener's defender stays closer to the basket. Short roll: The screener receives between the perimeter and the rim.
  - Apply: Both defenders trap the ball handler. Who may become available? A switch leaves a small defender on a big near the basket. What has the offense found?

- **Make the extra pass** — Read a closeout and choose between shooting, driving, and passing.
  - Teach: Closeout: A defender moves toward a shooter under control. Drive: A dribble attack toward the basket. Extra pass: One more pass to improve the team's shot.
  - Apply: A defender rushes past your shooting side. The lane is open. What may work? Help arrives on your drive and a teammate is open outside. Which response fits?

- **Find gaps in a zone** — Move the ball and players instead of standing around it.
  - Teach: Zone gap: Space between defenders' areas. Ball reversal: Moving the ball from one side to the other. High-post touch: Receiving near the free-throw line.
  - Apply: A zone crowds one side. What can make its defenders shift? A teammate catches between zone defenders at the high post. What should happen next?

Game Day transfer: A screen draws both defenders to you. Your screener has space in the middle. Which pass uses that space?

Expected reasoning: The short roll can give the offense an extra decision maker behind the two defenders on the ball.


#### 9. Solve the next problem

Outcome: Recognize pressure and use a practiced answer.

- **Defend the ball screen** — Compare switching, dropping, and trapping.
  - Teach: Trap: Two defenders pressure the ball handler together. Screen communication: A call that warns a teammate and names the coverage. Roll coverage: The job of protecting against the screener moving to the rim.
  - Apply: Both defenders trap the ball. What must teammates behind them protect? A team calls switch. What must the two defenders do together?

- **Start from a throw-in** — Create a safe first pass under pressure.
  - Teach: Inbounder: The player making a throw-in. Safety outlet: A teammate positioned as a safer passing option. Five-second count: The usual limit to release a throw-in after receiving the ball from the official.
  - Apply: The first inbound target is covered. What should the inbounder use? Why keep a safety outlet on an inbound play?

- **Cover the next pass** — Read the space left by help defense.
  - Teach: Low helper: A defender near the baseline who can help protect the rim. Rotation: A coordinated move to cover a teammate's help. Recover: Move back to a useful defensive assignment.
  - Apply: The low helper stops a drive and leaves a corner shooter. What must the defense arrange? The offense makes one more pass after your closeout. What matters next?

Game Day transfer: A trap stops your dribble. A safety outlet has space. Which choice protects possession?

Expected reasoning: A planned outlet lets the team escape pressure without a forced pass.


#### 10. Advanced game decisions

Outcome: Compare options and adjust when the opponent changes the plan.

- **Solve the coverage** — Recognize help positions and counters to defensive plans.
  - Teach: Tag: A help defender briefly checks a rolling attacker. Weak side: The side away from the ball. Skip pass: A pass across the court over nearby options.
  - Apply: The weak-side corner defender tags the roller and leaves the corner. What may be open? The defense switches every screen. What can the offense test? The low helper tags the roll. A second defender covers the corner, leaving the wing open. Where is the new opening? A switch puts a strong big on your guard far from the basket. Must the guard drive immediately?

- **Plan two actions ahead** — Balance clock, shot quality, and the opponent's answer.
  - Teach: First action: The opening move of an offensive possession. Second action: The next planned move if the first is stopped. End-of-clock shot: An attempt created with little shot-clock time remaining.
  - Apply: The defense stops the first action with 12 seconds left. What helps most? A quick contested shot leaves time for the opponent. What should a late-period plan weigh?

- **Play the final minute** — Use score, clocks, and fouls to make a useful decision.
  - Teach: Two-for-one: Trying to get two possessions for the opponent's one near a period's end. Intentional foul: Deliberately fouling to stop time under the game's rules. Clock management: Using the remaining time to support the score situation.
  - Apply: You trail by 2 with enough time for one controlled attack. Must you take a three? You lead by 3 in the final seconds. Which shot deserves special attention? You trail by 3 with time for only one made field goal. Which shot value can tie? You lead by 1 with 10 game-clock seconds and 16 shot-clock seconds. Must you shoot before regulation ends?

- **Make the next adjustment** — Apply NBA and WNBA concepts without assuming one answer always wins.
  - Teach: Scouting report: A plan based on an opponent's strengths and habits. Counter: An adjustment to the opponent's response. Possession quality: How well a trip creates a useful scoring chance.
  - Apply: An opponent repeatedly denies your first action. What should the team use? NBA quarters are 12 minutes. Are WNBA quarters also 12 minutes?

Game Day transfer: A weak-side defender tags the roller. Your corner teammate is open. Which read attacks the help?

Expected reasoning: Tagging the roll can expose the corner. The passer reads the next rotation before delivering the ball.


### Baseball

Rule context: Standard baseball. MLB-specific rules are named; youth rules can differ.


#### 1. Meet the game

Outcome: Know the goal, the playing area, and how many players take part.

- **Meet baseball** — Know who bats, who fields, and how a run scores.
  - Teach: Batter: The player trying to hit the pitch. Fielder: A defender trying to get the ball and make outs. Run: A score earned by legally completing the bases and reaching home.
  - Apply: Your team is batting. What is it trying to score? Which team has players spread across the field?

- **Nine defenders** — Find the infield, outfield, and home plate.
  - Teach: Nine defenders: The standard fielding team's players on the field. Infield: The area around the bases and the defenders who work there. Outfield: The deeper field beyond the infield.
  - Apply: How many defenders take the field in standard baseball? Where does the batter stand to begin a batting turn?

- **Around the diamond** — Follow the base order and the three-out changeover.
  - Teach: Base: A safe point a runner tries to reach. Out: A player is retired from the current play or batting turn. Half-inning: One team's turn to bat until three outs.
  - Apply: After first base, which base comes next? The fielding team records its third out. What happens?

- **Hits are not the score** — Tell a hit, a run, and a home run apart.
  - Teach: Hit: A batter reaches safely on a batted ball under the scoring rules. Home run: A hit on which the batter can complete all bases and score. Run batted in (RBI): A scoring credit for a batter whose action brings in a run under the scoring rules.
  - Apply: A batter hits safely and stops at first. Has that batter scored a run? The bases are empty and a batter hits a home run. How many runs score?

Game Day transfer: The pitcher and catcher are in position with the other fielders. How many defenders form the standard team?

Expected reasoning: Pitcher and catcher are included in the nine fielding positions.


#### 2. Follow the action

Outcome: Follow a play from its start to its finish.

- **Take your turn** — Follow the batting order and the change of jobs.
  - Teach: Batting order: The listed order in which a team's players bat. On deck: The next batter waiting for a turn. Top half: The visiting team's batting half of an inning.
  - Apply: Who normally bats in the top half of an inning? What decides which teammate bats next?

- **Follow a pitch** — Understand balls, strikes, and the count.
  - Teach: Pitch: A ball delivered by the pitcher to the batter. Strike: A called or swinging result that counts toward a strikeout. Ball: A pitch outside the strike zone that the batter does not swing at.
  - Apply: A batter swings and misses. What is added? The count is 3 balls and 1 strike. A fourth ball is called. What happens?

  - Rule teaching: Three strikes normally make a strikeout. Four balls make a walk. An ordinary foul ball does not add a third strike.

- **Finish the count** — Know what three strikes and four balls mean.
  - Teach: Walk: The batter is awarded first base after four balls. Strikeout: A batter is retired on a third strike, subject to uncaught-third-strike rules. Full count: Three balls and two strikes.
  - Apply: The count is 3-2 and the next pitch is a called ball. What happens? With two strikes, the batter swings and misses a pitch the catcher holds. What happens?

- **Know when play is live** — Do not stop running or defending without a reason.
  - Teach: Live ball: Play can continue under the rules. Dead ball: Play is stopped under the rules. Time call: The umpire stops play; a player's request alone does not do so.
  - Apply: A player asks for time but the umpire has not granted it. Is play automatically dead? A fair hit rolls into the outfield. What should the defense assume?

Game Day transfer: There are two outs. A fielder catches the batter's fly ball. What happens next?

Expected reasoning: The catch is the third out, ending the half-inning.


#### 3. Know the rules

Outcome: Understand scores, common fouls, and restarts.

- **Fair or foul?** — Recognize playable balls, fouls, and caught balls.
  - Teach: Fair territory: The area between the foul lines, including the lines. Foul ball: A batted ball judged foul under the boundary rules. Fly out: An out made by legally catching a batted ball before it lands.
  - Apply: A fielder legally catches a fly ball before it lands. What happens to the batter? A normal foul ball is hit with two strikes. Does it usually create strike three?

- **Force or tag?** — Tell when touching the base is enough and when the runner must be tagged.
  - Teach: Force play: A runner must advance because the batter became a runner. Tag: Touching a runner with the ball or the glove holding it. Safe: A runner reaches or keeps a base without being put out.
  - Apply: A ground ball is hit with a runner on first. Which base is that runner forced toward? A runner leaves second to try for third with first base empty. How is that runner usually put out?

- **Does the run count?** — Follow outs, timing, and the end of an inning.
  - Teach: Inning: One batting turn for each team, subject to the game-ending rules. Third out: The out that ends a half-inning. Force out: An out at the base a runner was required to reach.
  - Apply: A runner crosses home, but the third out is a force at second. Does the run count? In a standard MLB game, how many innings are scheduled?

  - Rule teaching: Each team gets a batting turn in an inning. The home team bats in the bottom half. MLB normally plays nine innings; the home team may not need its last turn.

Game Day transfer: A runner is forced to second. The fielder controls the ball on second before the runner arrives. What is the result?

Expected reasoning: A force can be completed by touching the required base with control of the ball before the runner arrives.


#### 4. Batting and running roles

Outcome: Find each attacking role and explain its job.

- **Batter: choose your pitch** — Recognize the hitter's job without needing swing technique.
  - Teach: Batter's box: The marked space beside home plate where the batter stands. Swing decision: Choosing whether to offer at a pitch. Two-strike approach: A hitting plan that accounts for the risk of strike three.
  - Apply: What is a batter trying to do with a useful pitch? Two strikes are called. Must the batter swing at every pitch?

- **Runner: earn the next base** — Understand base order and avoiding an unnecessary out.
  - Teach: Batter-runner: The batter after becoming a runner toward first. Overrun first: A batter-runner may run past first and return under the rules. Extra base: A base beyond the first safe stop available.
  - Apply: A batter-runner overruns first and returns directly without trying for second. Is being past first always an out? A throw reaches the next base well ahead of you and the coach signals stop. What is the safer choice?

- **Designated hitter** — Understand a batting job without a fielding position.
  - Teach: Designated hitter (DH): A player assigned to bat for the pitcher under the DH rules. Lineup: The team's listed batting order and positions. Substitute: A player who legally replaces another.
  - Apply: Under ordinary MLB DH use, whose batting turn does the DH take? Does a DH add a tenth defender to the field?

Game Day transfer: The DH is listed to bat for the pitcher. Does that create a tenth fielding position?

Expected reasoning: The designated hitter changes the batting assignment, not the nine defenders.


#### 5. Meet the nine defenders

Outcome: Find each defending role and explain its job.

- **Pitcher: start the contest** — Find the mound and understand the delivery.
  - Teach: Pitcher (P): The defender who pitches to the batter. Mound: The raised area where the pitcher works. Pitch location: Where the pitch travels near home plate.
  - Apply: Which defender delivers the pitch toward home plate? After a bunt rolls near the mound, can the pitcher field it?

  - Visual practice: identify the pitcher in an example alignment. Teach the labeled layout before testing.

- **Catcher: behind the plate** — Connect receiving, throwing, and helping direct play.
  - Teach: Catcher (C): The defender behind home plate who receives pitches. Passed ball: A scoring judgment about a catchable pitch the catcher lets get away. Throw to second: A possible response to a runner trying to steal second.
  - Apply: Which defender starts behind the batter and home plate? A runner breaks for second. What does a catcher need for a useful throw?

  - Visual practice: identify the catcher in an example alignment. Teach the labeled layout before testing.

- **First base: finish the out** — Understand receiving throws and staying on the base.
  - Teach: First baseman (1B): The infielder responsible for many plays at first base. Receiving target: A clear place for a teammate to aim the throw. Batter-runner out: The defense can retire the batter-runner by controlling the ball on first before arrival.
  - Apply: A teammate fields a grounder with no runners on base. Who usually receives the throw at first? The first baseman catches the throw but is pulled off first before the runner arrives. Is the base out automatic?

  - Visual practice: identify the first baseman in an example alignment. Teach the labeled layout before testing.

- **Second base: cover and connect** — Find the right-side middle infielder.
  - Teach: Second baseman (2B): The infielder usually starting between first and second. Middle infield: The second baseman and shortstop working near second. Feed: A short throw to a teammate starting a double play.
  - Apply: Which infielder usually starts between first and second? The shortstop fields a possible double-play grounder. What may the second baseman need to do?

  - Visual practice: identify the second baseman in an example alignment. Teach the labeled layout before testing.

- **Shortstop: the other middle** — Find the defender between second and third.
  - Teach: Shortstop (SS): The infielder usually starting between second and third. Backhand: Fielding a ball on the glove's opposite side. Middle coverage: Sharing second-base and nearby fielding jobs.
  - Apply: Which role usually begins between second and third? The second baseman fields away from second. What job may the shortstop have?

  - Visual practice: identify the shortstop in an example alignment. Teach the labeled layout before testing.

- **Third base: the hot corner** — Understand quick reactions and long throws.
  - Teach: Third baseman (3B): The infielder who works near third base. Hot corner: A nickname for third base because hard-hit balls can arrive quickly. Bunt defense: The team's plan for a softly tapped ball near the plate.
  - Apply: Which infielder works at the hot corner? The third baseman charges a bunt. What must teammates know?

  - Visual practice: identify the third baseman in an example alignment. Teach the labeled layout before testing.

- **Left field: guard the line** — Learn the outfield from home plate's view.
  - Teach: Left fielder (LF): The outfielder on the left when looking out from home plate. Foul line: A boundary that is part of fair territory. Outfield gap: Space between two outfielders.
  - Apply: Looking out from home plate, who covers the left outfield? A hit rolls between left and center. What helps the two fielders?

  - Visual practice: identify the left fielder in an example alignment. Teach the labeled layout before testing.

- **Center field: connect both sides** — Understand range, communication, and backup.
  - Teach: Center fielder (CF): The outfielder in the middle of the deep field. Catch call: A clear signal about who will catch the ball. Outfield backup: A teammate covers behind a fielding attempt.
  - Apply: Which outfielder starts between left and right field? A teammate fields a difficult ball near you. What can you provide?

  - Visual practice: identify the center fielder in an example alignment. Teach the labeled layout before testing.

- **Right field: stop extra bases** — Connect an outfield throw with the relay plan.
  - Teach: Right fielder (RF): The outfielder on the right when looking out from home plate. Cutoff target: A teammate placed to receive or redirect a throw. Extra-base prevention: Keeping a hit from turning into additional bases.
  - Apply: Looking out from home plate, which role covers the right outfield? A direct throw to third is too long to control. What can help?

  - Visual practice: identify the right fielder in an example alignment. Teach the labeled layout before testing.

Game Day transfer: A grounder goes to third with no runners. Which teammate usually finishes the routine out?

Expected reasoning: The third baseman commonly throws to first to retire the batter-runner.


#### 6. Build your skills

Outcome: Choose a basic skill and explain when it helps.

- **Choose a pitch** — Understand the strike zone and a hitter's decision.
  - Teach: Strike zone: The rule-defined area over home plate used for called strikes. Take: Letting a pitch pass without swinging. Contact: The bat meets the ball.
  - Apply: With no strikes, a pitch is far outside the zone. What often fits a patient plan? A hitter keeps chasing low pitches outside the zone. What needs work?

- **Make the routine out** — Choose control, a target, and a useful throw.
  - Teach: Ground ball: A batted ball that travels along the ground. Throwing target: The teammate or base a throw is intended to reach. Error: A scoring judgment about a missed play that should have been made with ordinary effort.
  - Apply: A ground ball comes to you with nobody on base. Where is the usual first out? You have time on a routine grounder. What helps the throw most?

- **Read the runner** — Understand tag-ups and safe decisions on the bases.
  - Teach: Tag up: Keep or retouch the starting base before advancing after a caught fly is first touched. Lead: A runner's distance from a base before a play. Base coach: A coach who helps runners read plays and signals.
  - Apply: A fly ball is caught. When may a runner leave legally to advance? A third-base coach signals stop and the ball is ahead of you. What is the safer read?

Game Day transfer: A runner leaves before a caught fly is first touched. What must the runner do before advancing legally?

Expected reasoning: The runner must correct the early departure by retouching the starting base under the tag-up rules.


#### 7. Work as a team

Outcome: Connect your job with the players around you.

- **The battery** — Connect the pitcher and catcher to the count and runners.
  - Teach: Pitcher: The defender who delivers pitches. Catcher: The defender behind home who receives pitches and helps direct defense. Battery: The pitcher and catcher working together.
  - Apply: Why should pitcher and catcher agree on the pitch? A runner threatens to steal. Who must also watch the runner besides the pitcher?

- **Connect the infield** — Learn force outs, double plays, and coverage.
  - Teach: Double play: Two outs recorded during one continuous play. Shortstop: The infielder usually positioned between second and third. Cover a base: Move to a base to receive a throw or make a play.
  - Apply: A grounder goes to shortstop with a runner on first and one out. Which base may start a double play? The second baseman fields a ball away from second. What may the shortstop need to do?

- **Bring the ball home** — Use cutoffs, relays, and backup positions.
  - Teach: Cutoff: A defender positioned to receive or redirect an outfield throw. Relay: A throw passed through a teammate over a long distance. Backup: A defender positioned to stop an overthrow or missed ball.
  - Apply: A deep outfield throw cannot reach home safely. What can help? A teammate receives a high-risk throw at third. How can another fielder help?

Game Day transfer: A ball reaches the deep outfield. The direct throw home is too far. Who connects the throw?

Expected reasoning: A relay defender provides an intermediate target for a long throw.


#### 8. Read the game

Outcome: Use space, time, and the opponent's movement to choose a response.

- **Know the next out** — Read runners, outs, and the score before the pitch.
  - Teach: Situational defense: A plan based on runners, outs, inning, and score. Lead runner: The runner farthest around the bases. Infield in: Infielders move closer to home to try to stop a run.
  - Apply: You lead by several runs with two outs. A difficult throw home risks an error, while first is routine. What often fits? The winning run is on third with no outs. Why might the infield move in?

- **Work the count** — Understand how the count changes risk for pitcher and hitter.
  - Teach: Ahead in the count: A count that gives the pitcher or hitter a useful advantage. Changeup: A slower pitch designed to disrupt a hitter's timing. Location: Where the pitch crosses near the plate.
  - Apply: A hitter has two strikes. What becomes more important? A hitter repeatedly times the fastball well. Which change may disrupt timing?

- **Control the running game** — Read steal risk and the defense's response.
  - Teach: Stolen base: Advancing to a base on the pitch without a hit or other event awarding it. Pickoff: A throw intended to retire a runner away from the base. Pitchout: A pitch intentionally thrown outside to help the catcher throw at a runner.
  - Apply: A runner takes a very large lead. What does the defense gain? A steal attempt is likely. What must the middle infielder know?

Game Day transfer: With two outs, first base is a sure third out and a throw home is risky. Which play usually ends the threat?

Expected reasoning: The routine third out ends the half-inning, so a risky play home is often unnecessary.


#### 9. Solve the next problem

Outcome: Recognize pressure and use a practiced answer.

- **Small contact, different rules** — Tell a normal foul from a foul bunt and a foul tip.
  - Teach: Bunt: A deliberately tapped ball rather than a full swing. Foul bunt: A bunt ruled foul; with two strikes it is strike three. Foul tip: A sharp, direct ball from bat to catcher that is legally caught; it counts as a strike.
  - Apply: A batter bunts foul with two strikes. What happens? A sharp foul tip goes directly to the catcher and is legally caught with two strikes. What happens?

- **Understand the infield fly** — Recognize protection against an easy double play.
  - Teach: Infield fly: An umpire's call on a qualifying fair fly that an infielder can catch with ordinary effort. Qualifying runners: Runners on first and second, or bases loaded, with fewer than two outs. Batter out: On a valid infield-fly call, the batter is out whether or not the fair ball is caught.
  - Apply: First and second are occupied with one out. A routine fair pop-up is called infield fly. Who is out? An infield fly is called. Is the ball automatically dead?

- **Value each out** — Compare one run now with a larger inning.
  - Teach: Base-out situation: The occupied bases and number of outs. Run goal: Whether the team most needs one run or a bigger rally. Productive out: An out that helps a runner advance or score, without being automatically the best choice.
  - Apply: Your team trails by four late. Why may giving away an out for one base be costly? Before choosing a bunt, which information matters?

Game Day transfer: With two strikes, the batter bunts foul. What is the result?

Expected reasoning: A foul bunt with two strikes is strike three, unlike a normal uncaught foul.


#### 10. Advanced game decisions

Outcome: Compare options and adjust when the opponent changes the plan.

- **Move before the pitch** — Connect positioning to hitter tendencies and the rule set.
  - Teach: Spray chart: A record of where a hitter tends to send batted balls. Defensive alignment: Where fielders begin a play. Range: The area a fielder can cover effectively.
  - Apply: A hitter often pulls ground balls. What can defenders use to plan their starting spots? Under MLB shift limits, may three infielders start on the same side of second base?

- **Choose the next pitcher** — Weigh workload, skills, and substitution limits.
  - Teach: Bullpen: Relief pitchers and the area where they warm up. Matchup: How a pitcher's skills fit a particular hitter. Three-batter minimum: An MLB rule that usually requires a new pitcher to face three batters or finish the half-inning.
  - Apply: A reliever enters under MLB rules. Can a manager always remove that pitcher after one batter? A tired pitcher loses location. What should a manager weigh? An MLB reliever finishes the inning after one batter and is replaced before the next inning. Is that normally allowed?

- **Manage the last inning** — Choose outs, runs, and risk in a close game.
  - Teach: Walk-off: A home-team play that ends the game by scoring the winning run. Sacrifice bunt: A bunt intended to advance a runner at the cost of an out. Win situation: The score and base-out conditions that shape a team's best chance.
  - Apply: The home team scores the winning run in the bottom of the final inning. What is that ending called? Why is a sacrifice bunt not automatically the best choice? Tie game, bottom of the ninth, bases loaded, one out. A routine force at home is available. Which base prevents the winning run? A run crosses home before a third-out tag at second. The runner at second was not forced. Can that run count?

Game Day transfer: An MLB reliever faces one batter to end the inning, then returns. What minimum normally remains?

Expected reasoning: A pitcher who returns for the next inning still has to reach the three-batter total unless an exception applies.


### Soccer

Rule context: Standard 11-a-side soccer under IFAB laws. Small-sided youth formats can differ.


#### 1. Meet the game

Outcome: Know the goal, the playing area, and how many players take part.

- **Meet soccer** — Know the goal and who can use their hands.
  - Teach: Goal: A score when the whole ball legally crosses the goal line between the posts and under the bar. Outfield player: Any player other than the goalkeeper. Goalkeeper: The player who may handle the ball inside their own penalty area, subject to the laws.
  - Apply: Which goal does your team attack? Who may usually use hands inside their own penalty area?

- **Find your way** — Recognize the boundaries and the two ends.
  - Teach: Touchline: A long side boundary of the field. Goal line: The boundary at each end of the field. Penalty area: The marked area around a goal where special goalkeeper and penalty rules apply.
  - Apply: The ball goes completely over a long side boundary. Which line did it cross? How many players does one standard 11-a-side team start with, including its goalkeeper?

  - Rule teaching: An adult regulation match has two 45-minute halves. The referee can add time lost to stoppages.

- **Players and match time** — Know the standard lineup and the two halves.
  - Teach: Eleven players: A standard starting team, including one goalkeeper. Half: One of the two main periods; adult standard matches use 45 minutes each. Added time: Time the referee adds for time lost during a half.
  - Apply: A standard team has eleven starters. How many are outfield players? Why might a half continue after 45 minutes?

- **Read the score** — Know a goal, a draw, and a competition's tie rules.
  - Teach: One goal: Adds one to the team's score. Draw: The teams finish with equal scores when the competition allows it. Penalty shootout: A separate tie-deciding series of kicks when the competition requires it.
  - Apply: A legal goal is scored from far outside the penalty area. How many goals are added? A league game ends 1-1 and draws are allowed. What is the result?

Game Day transfer: A shot touches the goal line but the whole ball has not crossed it. Is a goal scored?

Expected reasoning: The whole ball must cross the goal line between the posts and under the crossbar for a goal.


#### 2. Follow the action

Outcome: Follow a play from its start to its finish.

- **Start and stop** — Follow the kickoff and the whole-ball boundary rule.
  - Teach: Kickoff: A center-field restart at the start of a half and after a goal. Ball out: The whole ball crosses a boundary, on the ground or in the air. Ball in play: The ball remains available for play unless the laws or referee stop it.
  - Apply: Only part of the ball crosses the touchline. Has it gone out? A goal is awarded. What restart normally follows?

- **Follow an attack** — Tell passing, dribbling, and shooting apart.
  - Teach: Pass: Sending the ball to a teammate. Dribble: Moving with controlled touches of the ball. Shot: An attempt to score a goal.
  - Apply: A player sends the ball to a teammate. What is that action? A player carries the ball with several foot touches. What is that action?

- **Start play again** — Choose the correct restart after the ball leaves the field.
  - Teach: Throw-in: A restart after the ball fully crosses a touchline. Goal kick: A restart when an attacker last touches the ball over the goal line without a goal. Corner kick: A restart when a defender last touches the ball over their own goal line without a goal.
  - Apply: A defender last touches a ball over their own goal line. No goal is scored. What is the restart? An attacker last touches the ball over the same goal line. No goal is scored. What is the restart?

  - Rule teaching: The whole ball must cross the boundary for it to be out. Touching a line alone does not make it out.

Game Day transfer: A ball is still partly above the touchline. Should players assume a throw-in?

Expected reasoning: The whole ball must cross the boundary to go out.


#### 3. Know the rules

Outcome: Understand scores, common fouls, and restarts.

- **Play fairly** — Understand illegal contact and the official's decisions.
  - Teach: Foul: An offense penalized under the laws of the game. Yellow card: An official caution. Red card: A sending-off that removes a player from the match.
  - Apply: A defender trips an opponent carelessly. What can the referee award? A player receives a second yellow card in the same match. What follows?

- **Free kick or penalty?** — Connect the offense, location, and restart.
  - Teach: Direct free kick: A free kick from which a goal may be scored directly against the opponent. Indirect free kick: A restart that needs another player's touch before a goal can count. Penalty kick: A direct-free-kick offense by a defender in their own penalty area can lead to this kick.
  - Apply: A defender carelessly trips an opponent inside the defender's penalty area during play. What restart normally follows? An indirect free kick enters the opponent's goal without another touch. Does it count?

- **Understand offside** — Separate an offside position from an offside offense.
  - Teach: Offside position: An attacker is in the opponents' half nearer the goal line than both the ball and second-last opponent, excluding hands and arms. Active involvement: Playing the ball, interfering with an opponent, or gaining an advantage under the offside law. Second-last opponent: The opponent used with the ball to judge the offside line.
  - Apply: An attacker is in an offside position but never affects the play. Is that alone an offense? When is a receiver's offside position normally judged?

Game Day transfer: A player receives directly from a throw-in beyond the second-last opponent. Can that direct receipt be offside?

Expected reasoning: The offside law excludes direct receipt from a throw-in, goal kick, or corner kick.


#### 4. Meet the attacking roles

Outcome: Find each attacking role and explain its job.

- **Meet the team** — Learn defenders, midfielders, and forwards.
  - Teach: Defender: A player whose role often protects the team from attacks. Midfielder: A player who links defense and attack through the middle areas. Forward: A player whose role often creates and finishes attacks.
  - Apply: Which group often connects defenders to forwards? The team loses the ball. Do only defenders have defensive work?

- **Striker: lead the attack** — Find the central forward and understand runs without the ball.
  - Teach: Striker: A forward who often leads the attack and looks to finish chances. Run behind: A move into space beyond the defensive line. Hold-up play: Keeping the ball under pressure so teammates can join.
  - Apply: Which role often stays high and central to finish chances? A striker receives with a defender close behind and support arriving. What can help?

  - Visual practice: identify the striker in an example alignment. Teach the labeled layout before testing.

- **Winger: use the outside** — Understand width, crosses, and inside movement.
  - Teach: Winger: An attacker who often starts toward a side of the field. Cross: A ball sent from a wide area toward teammates near goal. Cut inside: Move from a wide position toward the middle.
  - Apply: An attacker stays wide and stretches the opposing back line. Which role often does this? A defender blocks the outside route but leaves inside space. What can the winger consider?

  - Visual practice: identify the left winger in an example alignment. Teach the labeled layout before testing.

- **Attacking midfielder** — Connect the pass into the striker with a chance to score.
  - Teach: Attacking midfielder: A midfielder who often works behind the forwards to create chances. Number 10 role: A common name for an attacking midfield job, not a required shirt number. Through ball: A pass into space beyond defenders for a teammate to run onto.
  - Apply: A player finds space behind midfield and feeds the striker. Which role fits? A striker starts a well-timed run behind the line. What pass may fit?

  - Visual practice: identify the attacking midfielder in an example alignment. Teach the labeled layout before testing.

- **Central midfielder** — Learn the link between defense and attack.
  - Teach: Central midfielder: A player who helps connect possession, defending, and attack through the middle. Number 8 role: A common label for a midfielder linking play across areas. Support angle: A position that gives a teammate a useful passing option.
  - Apply: Your teammate has the ball but no safe forward pass. How can a central midfielder help? Your team loses possession in midfield. Does the central midfielder's work stop?

  - Visual practice: identify the number 8 midfielder in an example alignment. Teach the labeled layout before testing.

Game Day transfer: A striker has a defender behind and teammates arriving. What can help the attack connect?

Expected reasoning: Protecting the ball can give supporting teammates time to join.


#### 5. Meet the defending roles

Outcome: Find each defending role and explain its job.

- **Goalkeeper: protect and start** — Understand saves, handling limits, and distribution.
  - Teach: Save: A goalkeeper stops an attempt from scoring. Distribution: How the goalkeeper sends the ball to a teammate. Back-pass restriction: A goalkeeper cannot handle a ball deliberately kicked to them by a teammate, subject to the law's exceptions.
  - Apply: Which player may usually handle the ball in their own penalty area? A teammate deliberately kicks a normal pass to the goalkeeper. What is the usual legal receiving choice?

  - Visual practice: identify the goalkeeper in an example alignment. Teach the labeled layout before testing.

- **Center back: protect the middle** — Learn central defending before the offside trap.
  - Teach: Center back: A defender who usually protects central space near their own goal. Cover: Support behind a teammate challenging the ball. Clearance: Sending the ball away from an immediate danger.
  - Apply: Your fellow center back steps toward the ball. What may your job become? A loose ball is dangerous near your goal and no safe short pass exists. What may fit?

  - Visual practice: identify the center back in an example alignment. Teach the labeled layout before testing.

- **Fullback and wing-back** — Learn the wide defending role and its attacking support.
  - Teach: Fullback: A wide defender, commonly left back or right back. Wing-back: A wide role often covering more attacking and defending ground in a back-three system. Overlap: A supporting run outside a teammate with the ball.
  - Apply: A left-sided defender runs outside the winger to offer a pass. What run is that? The fullback joins an attack. What should the team account for?

  - Visual practice: identify the left back in an example alignment. Teach the labeled layout before testing.

- **Holding midfielder** — Find the midfielder protecting the space ahead of the defense.
  - Teach: Holding midfielder: A midfielder who helps protect central space and start attacks. Number 6 role: A common name for a deeper central midfield job. Screen the pass: Position to make a passing lane harder to use.
  - Apply: Which role often protects the center just ahead of the center backs? A forward waits between your midfield and defense. What needs attention?

  - Visual practice: identify the holding midfielder in an example alignment. Teach the labeled layout before testing.

Game Day transfer: A center back challenges the attacker. What can the other center back provide?

Expected reasoning: Challenge and cover share the danger instead of leaving the space behind empty.


#### 6. Build your skills

Outcome: Choose a basic skill and explain when it helps.

- **Receive ready** — Choose a first touch that prepares the next action.
  - Teach: First touch: The first contact used to receive the ball. Scan: Look around before the ball arrives. Open body shape: A receiving position that lets a player see more than one direction.
  - Apply: A defender closes from your left. Where may a useful first touch go? What helps you know where pressure is before receiving?

- **Receive with a plan** — Use a first touch to prepare the next action.
  - Teach: First touch: The first control of a received ball. Open body shape: A receiving position that helps see and play into more space. Scan: Look around before or during the play.
  - Apply: A defender closes from your left before the pass arrives. Where may a useful first touch go? Why look around before the ball arrives?

- **Give a passing option** — Use passing angles and movement without the ball.
  - Teach: Support angle: A position that gives the ball carrier a useful pass. Passing lane: The path a pass can travel through. Give-and-go: Pass to a teammate and move to receive the return.
  - Apply: A defender blocks the straight pass to you. What can help? You pass to a teammate and run beyond a defender for the return. What is the combination?

- **Choose the finish** — Compare a shot, a pass, and keeping the ball.
  - Teach: Shooting lane: A path from the ball toward the goal. Square pass: A pass across the field, often to a teammate beside the ball. Finishing chance: An opportunity to attempt a goal.
  - Apply: Two defenders block your shot and a teammate is free near goal. What can improve the chance? You receive with a clear lane near goal. What opportunity is present?

- **Attack and defend one-on-one** — Read balance, distance, and the goal.
  - Teach: Delay: Slow an attacker while help returns. Tackle: A legal challenge to win the ball. Finish: The final attempt to score.
  - Apply: You are the only defender against two attackers. What often helps first? A goalkeeper leaves one side of goal open. What should guide the shot?

- **Delay the attacker** — Understand patience and support before a tackle.
  - Teach: Delay: Slow an attack so teammates can recover. Tackle: Challenge for the ball under the laws. Show a direction: Use position to guide the attacker toward a planned side.
  - Apply: You face an attacker with no cover behind. What is often useful first? The attacker takes a heavy touch within reach. What may become possible?

Game Day transfer: You see pressure behind your right shoulder before receiving. What can your first touch use?

Expected reasoning: Scanning lets the first touch prepare a useful action away from pressure.


#### 7. Work as a team

Outcome: Connect your job with the players around you.

- **Pass, move, receive** — Build a two-player move around a defender.
  - Teach: One-two: Pass to a teammate and move to receive a quick return. Third-player run: A third teammate moves to receive after two others connect. Support triangle: Three teammates give each other passing angles.
  - Apply: You pass then run beyond the defender for a quick return. What is this? Three players stand in a straight line behind one defender. What often improves their options?

- **Stretch the field** — Create room around and behind the defense.
  - Teach: Width: Space used across the field from side to side. Depth: Space used in front of and behind teammates or defenders. Overlap: A supporting run around the outside of a teammate.
  - Apply: The opponents crowd the middle. What may open their shape? A fullback runs outside the winger. What is that supporting run called?

- **Move together** — Understand a formation and keep useful support distances.
  - Teach: Formation: A team's broad starting arrangement of outfield players. Compactness: Keeping useful short distances between defenders and lines. Press: Coordinated pressure to limit the opponent's options.
  - Apply: In a 4-3-3, how many players are listed in midfield? One player presses while everyone else stays far back. What is the main risk?

- **Move the lines together** — Connect the back line with midfield support.
  - Teach: Defensive line: The defenders organized across the back of the team. Compactness: Keeping useful short distances between teammates and lines. Covering depth: Space behind the first challenge protected by teammates.
  - Apply: The forwards press but midfield stays far behind. What problem can appear? An attacker runs behind while the passer has no pressure. What must the back line consider?

Game Day transfer: Your first defender presses the ball. Why should teammates move together behind that player?

Expected reasoning: Pressure works when supporting players limit the next options and protect space.


#### 8. Read the game

Outcome: Use space, time, and the opponent's movement to choose a response.

- **React when possession changes** — Choose a useful first action after winning or losing the ball.
  - Teach: Counterattack: A quick attack before the opponent reorganizes. Recovery run: A run back to help defend. Counterpress: Immediate team pressure after losing the ball.
  - Apply: You win the ball and a teammate has open space ahead. What may be available? You lose the ball and nearby teammates cannot support pressure. What may fit better?

- **Play through pressure** — Use space between opponents and change the point of attack.
  - Teach: Line-breaking pass: A pass that travels beyond a line of opponents. Switch of play: Moving the ball toward the other side of the field. Third-player run: A supporting player runs to receive after two teammates combine.
  - Apply: The opponent traps your team near one touchline. The far side is open. What may help? A teammate receives between the opponent's midfield and defense. Which advantage is created?

- **Choose when to press** — Read a poor touch and coordinate the team's response.
  - Teach: Pressing trigger: An event the team uses to begin pressure. Cover shadow: Space behind a defender where their position blocks a passing option. Cover: A teammate's support behind the player applying pressure.
  - Apply: The opponent takes a heavy touch and your teammates are ready. What may trigger? You press at an angle that blocks the central pass. What are you also controlling?

Game Day transfer: The opponent takes a heavy touch, but your team is too far away to support you. What is safer?

Expected reasoning: A trigger is useful only with support. Delaying can give teammates time to recover.


#### 9. Solve the next problem

Outcome: Recognize pressure and use a practiced answer.

- **Attack after winning it** — Use the advantage without losing all cover.
  - Teach: Counterattack: A quick attack after regaining possession. First forward pass: An early pass that can use a disorganized opponent. Defensive balance: Players positioned to respond if possession is lost.
  - Apply: You win the ball and a forward has open space. What should be checked? Every teammate runs ahead of the ball. What risk grows?

- **Move the opponent** — Use one side to open another.
  - Teach: Switch of play: Move the ball to the other side of the field. Overload: More useful attackers than defenders in one area. Isolate: Create space for a favorable one-on-one.
  - Apply: The opponent crowds your right side and your left winger has space. What may help? An overload draws extra defenders to one side. What can it create elsewhere?

- **Play through pressure** — Find support rather than forcing a blocked pass.
  - Teach: Spare player: A teammate the current press is not directly covering. Third-player pass: A connection through one teammate to reach another. Press escape: A planned way to get the ball beyond pressure.
  - Apply: Two opponents close your receiver and a supporting midfielder is free. What is a useful option? A direct forward pass is blocked. How can a third player help?

Game Day transfer: The opponent crowds your right side. Your left winger has space. What may use that space?

Expected reasoning: Moving the ball to the opposite side can use an opening created by pressure.


#### 10. Advanced game decisions

Outcome: Compare options and adjust when the opponent changes the plan.

- **Beat the first press** — Use the goalkeeper, spare player, and movement to escape pressure.
  - Teach: Build-up: How a team moves the ball forward from deeper areas. Spare player: A teammate not immediately marked. Rest defense: The players and positions kept ready to defend if the ball is lost.
  - Apply: Two forwards press your two center backs. The goalkeeper is available. What can the goalkeeper create? Both fullbacks attack high. What must the team still protect? A striker covers your goalkeeper's direct pass to midfield. A center back is free to connect there. What can unlock midfield? Both fullbacks advance and possession is lost. Which prepared structure can protect the counter?

- **Plan a restart** — Coordinate movement, marking, and second balls.
  - Teach: Set play: A planned action from a restart. Second ball: The loose ball after the first contest or clearance. Marking: Positioning to limit an opponent's movement or chance.
  - Apply: A corner is partly cleared to the edge of the area. What is that next loose ball often called? Can a player be offside by receiving directly from a corner kick?

- **Adjust the match plan** — Read time, score, substitutions, and the opponent's shape.
  - Teach: Game state: The score, time, and conditions shaping a decision. Overload: More teammates than opponents in a useful area. Tactical adjustment: A change in roles or structure to solve a game problem.
  - Apply: Your team leads late and keeps forcing low-chance forward passes. What may help? Your winger is repeatedly isolated against two defenders. What may improve the attack? Your team leads late and wins possession near the touchline. A safe supporting pass is open. What can help control the game?

Game Day transfer: Your goalkeeper draws a forward's press and a center back becomes free. What does the build-up now offer?

Expected reasoning: Drawing pressure can free a teammate. The next pass should use that advantage while protecting against a turnover.


### Volleyball

Rule context: Six-player indoor volleyball under USAV/FIVB-style rules. Beach and school rules can differ.


#### 1. Meet the game

Outcome: Know the goal, the playing area, and how many players take part.

- **Meet volleyball** — Know the net, the rally, and how a point is won.
  - Teach: Net: The barrier that separates the two teams. Rally: Play from the serve until the ball is dead. Point: The score awarded when a rally is won.
  - Apply: What does your team try to make the ball do? Your team wins a rally while receiving serve. Does it earn a point?

- **Six players and a net** — Find both teams and the court boundaries.
  - Teach: Six players: The players from each team on court in standard indoor volleyball. End line: The back boundary of a team's court. Sideline: A side boundary; a ball touching the line is in.
  - Apply: Both teams have full indoor lineups. How many players are on court altogether? An untouched serve lands on the sideline. Is the ball in?

- **Find your court** — Recognize boundaries and front and back rows.
  - Teach: Boundary line: A line that marks the edge of the court. Front row: The three rotational positions nearest the net. Back row: The three rotational positions farther from the net.
  - Apply: The ball lands on a boundary line. Is it in? How many players from one team are on the court in standard indoor sixes?

Game Day transfer: A served ball lands on your end line untouched. Which team wins the rally?

Expected reasoning: A boundary line belongs to the court. A serve landing on it is in.


#### 2. Follow the action

Outcome: Follow a play from its start to its finish.

- **One rally at a time** — Follow the serve, exchange, and point.
  - Teach: Rally: The action from the serve until the ball becomes dead. Rally point: A point is awarded after each completed rally. Fault: An action that breaks a rule and can lose the rally.
  - Apply: Your team receives the serve and wins the rally. Does your team get a point? The referee ends the rally for a fault. What should players do?

- **Pass, set, attack** — Learn how teammates share up to three contacts.
  - Teach: Pass: A controlled contact that sends the ball toward a teammate. Set: A contact that prepares the ball for an attacker. Attack: A contact that sends the ball toward the opponent.
  - Apply: What is the usual maximum number of team hits after a block touch in indoor volleyball? Must a team always use all three hits?

- **Start the rally** — Understand serving, side-out, and basic set scoring.
  - Teach: Serve: The contact from behind the end line that starts a rally. Side-out: The receiving team wins the rally and gains the serve. Set: One scoring contest within a match.
  - Apply: Your team receives serve and wins the rally. Who serves next? A standard indoor set is 24-24. Does the next point always end it?

  - Rule teaching: A common indoor match is best of five sets: win three to win the match. Sets usually go to 25; a fifth goes to 15. Win by two.

Game Day transfer: A team sends a legal ball over on its second contact. Is a third contact always required?

Expected reasoning: A team may return the ball before using all three hits.


#### 3. Know the rules

Outcome: Understand scores, common fouls, and restarts.

- **Find the six starting spots** — Learn numbered court positions before specialist roles.
  - Teach: Position 1: The right-back rotational spot, where the server starts. Position 3: The middle-front rotational spot. Position 6: The middle-back rotational spot.
  - Apply: Which numbered rotational spot is the server's spot? Does being a setter mean always starting in one rotational spot?

- **Know where to start** — Follow the serve order and rotational positions.
  - Teach: Rotation: The clockwise movement when a receiving team gains the serve. Serve order: The fixed order in which teammates take serving turns. Position one: The back-right rotational position, where the server begins.
  - Apply: Your team wins back the serve. Which way does it rotate? The server wins another rally. Does the team rotate again?

- **Serve within the rules** — Know the service area and the end-line restriction.
  - Teach: Service area: The area behind the end line from which a serve is made. Foot fault: An illegal service contact with the court or boundary under the service rules. Service order: The order teammates must follow when serving.
  - Apply: A server touches the end line while contacting the serve from the floor. What is the usual call? A strong server wants to take the next teammate's turn. Is that allowed just by choice?

- **Keep the rally legal** — Recognize lifts, net faults, and indoor block rules.
  - Teach: Catch or lift: Holding or throwing the ball instead of a legal rebounding contact. Block: An action near the net reaching above it to intercept an opponent's ball. Net fault: A prohibited net contact during the action of playing the ball.
  - Apply: A blocker touches the ball, then plays the next contact. Is that allowed in indoor volleyball? May a player block the opponent's serve?

- **Share the net safely** — Recognize interference instead of assuming every touch is the same.
  - Teach: Net fault: A prohibited net contact, including contact between the antennae during the action of playing the ball. Interference: Illegally hindering an opponent's play. Center line: The floor boundary beneath the net between the two courts.
  - Apply: A player grabs the net while playing the ball. What can be called? A player crosses under the net and interferes with an opponent. Is that allowed?

Game Day transfer: Your team is receiving at 24-24 and wins the rally. What happens?

Expected reasoning: The team gains a point and the serve, then rotates. The set still needs a two-point margin.


#### 4. Build the attack

Outcome: Find each attacking role and explain its job.

- **Meet the roles** — Connect setter, hitters, and libero.
  - Teach: Setter: The player who usually directs the second contact and organizes attacks. Hitter: A player whose role includes attacking and often blocking. Libero: A back-row defensive specialist wearing a different-colored jersey.
  - Apply: Which role usually organizes the second contact? Why is one defender wearing a different-colored jersey?

- **Setter: organize the attack** — Find the player who often takes the second contact.
  - Teach: Setter: The player who organizes the attack, often with the second contact. Set target: The space where an attacker expects the ball. Backup setter: The agreed player who sets when the setter cannot.
  - Apply: A pass reaches the target. Who usually chooses which hitter gets the set? The setter digs the first ball. Who should take the next contact?

  - Visual practice: identify the setter in an example alignment. Teach the labeled layout before testing.

- **Outside hitter** — Learn left-side attacks and serve-receive work.
  - Teach: Outside hitter (OH): A hitter who often attacks from the left side and helps receive serve. High outside set: A higher ball toward the left-side attacker. Attack coverage: Teammates prepare to recover a ball rebounding from a block.
  - Apply: The offense sends a high set to its left-side hitter. Which role commonly attacks it? The outside hitter attacks into a block. What can teammates provide?

  - Visual practice: identify the outside hitter in an example alignment. Teach the labeled layout before testing.

- **Opposite hitter** — Connect right-side attacking and blocking.
  - Teach: Opposite (OPP): A hitter who rotates opposite the setter and often attacks from the right. Right-side attack: An attack from the team's right side of the net. Outside matchup: The opposite often blocks against the opponent's outside hitter.
  - Apply: Which hitter commonly attacks from the right side and rotates opposite the setter? The opponent sets its outside hitter. Which front-row role often blocks across from that attack?

  - Visual practice: identify the opposite hitter in an example alignment. Teach the labeled layout before testing.

- **Server: start with a plan** — Connect a reliable serve with a chosen target.
  - Teach: Server: The player whose turn starts the rally with a serve. Serve target: The area or receiver a team chooses to test. Serve pressure: A serve that makes a controlled first pass harder.
  - Apply: Your goal is to make the receiver move while keeping the serve reliable. What helps? Your last three serves missed while chasing speed. What adjustment may help?

Game Day transfer: The setter digs the first ball and cannot set the next one normally. Who should organize the second contact?

Expected reasoning: The team needs a backup setting plan when the setter handles first contact.


#### 5. Meet the defending roles

Outcome: Find each defending role and explain its job.

- **Middle blocker** — Learn quick attacks and moving to help the block.
  - Teach: Middle blocker (MB): A front-row player who attacks quick sets and helps block across the net. Quick set: A faster-tempo set coordinated with the hitter's timing. Close the block: Move beside another blocker to reduce the seam.
  - Apply: Which role often moves from the middle to help block either side? The opponent sets outside. What can the middle blocker help reduce?

  - Visual practice: identify the middle blocker in an example alignment. Teach the labeled layout before testing.

- **Libero: a back-row specialist** — Identify the different jersey and the limits of the role.
  - Teach: Libero: A specialist in back-row defense and passing who wears a different-colored jersey. Libero replacement: A role-specific exchange with a back-row player under the competition's rules. No blocking: The libero cannot block or attempt to block.
  - Apply: One defender wears a different-colored jersey and specializes in back-row play. Which role is likely? May a libero join a block at the net?

  - Visual practice: identify the libero in an example alignment. Teach the labeled layout before testing.

- **Defensive specialist** — Tell an ordinary substitute from the libero.
  - Teach: Defensive specialist (DS): A player used mainly for back-row passing and defense through ordinary substitution rules. Ordinary substitution: An exchange counted under the competition's substitution rules. Readiness: Being prepared for the next ball before it is hit.
  - Apply: A back-row specialist enters through an ordinary substitution and wears the team's normal jersey. Which role fits? Does a DS automatically get the libero's replacement rules?

  - Visual practice: identify the defensive specialist in an example alignment. Teach the labeled layout before testing.

- **Know your row** — Separate a player's role from current front- or back-row status.
  - Teach: Attack line: The line three meters from the net that matters for back-row attacks. Back-row attack: An attack by a back-row player, subject to takeoff and ball-height rules. Libero restriction: A special limit on what a libero may do.
  - Apply: A back-row hitter jumps from behind the attack line and lands in front. Is the landing alone illegal? May the libero complete a block?

  - Rule teaching: The libero may not complete an attack hit when the ball is entirely above the top of the net, wherever the libero is.

Game Day transfer: A different-jersey back-row specialist moves toward a block. What restriction applies?

Expected reasoning: The libero's special role excludes blocking and attempting to block.


#### 6. Build your skills

Outcome: Choose a basic skill and explain when it helps.

- **Build a first pass** — Understand the forearm pass as a team action.
  - Teach: Forearm pass: Controlling the ball with the forearms. Platform: The joined forearm surface used to direct a pass. Passing target: The planned area where the setter can use the ball.
  - Apply: What is the usual goal of a serve-receive pass? A serve travels between two receivers. What helps before both move for it?

- **Make the first pass** — Read a serve and direct a controlled first contact.
  - Teach: Serve receive: The team's plan for handling the opponent's serve. Platform: The forearm surface used for a forearm pass. Target: The space or teammate the pass is meant to reach.
  - Apply: A serve comes between two receivers. What helps avoid confusion? A pass is too tight to the net. What is the main risk?

- **Build a useful attack** — Choose a hittable set and a controlled attacking option.
  - Teach: Hittable set: A set the attacker can reach and use under control. Approach: The steps an attacker uses to prepare a jump and hit. Tip: A controlled softer attack placed into open space.
  - Apply: The first pass is far off the net. What should the setter prioritize? A strong block takes away the hard swing and open space is short. What may work?

- **Choose the attack** — Understand a hard hit, a tip, and a safer return.
  - Teach: Spike: A forceful attacking hit. Tip: A softer legal attack placed into space. Free ball: An easier return that gives the opponent time to organize.
  - Apply: Two blockers seal the hard angle and short space is open. What may be available? A poor pass leaves no controlled full attack. What may keep the rally alive?

- **Keep it alive** — Recognize a dig, attack coverage, and a free ball.
  - Teach: Dig: A defensive contact that keeps an opponent's attack in play. Attack coverage: Teammates position to recover a ball rebounding from the block. Free ball: A relatively easy ball sent over instead of a strong attack.
  - Apply: Your teammate attacks into a block. Where can you help? An easy free ball comes over. What should your team try to create?

Game Day transfer: A teammate's attack rebounds from the block toward you. Which team action are you providing?

Expected reasoning: Attack coverage prepares teammates to recover balls coming off the block.


#### 7. Work as a team

Outcome: Connect your job with the players around you.

- **Pass, set, attack** — Keep a plan when the perfect sequence is not available.
  - Teach: First contact: Often a pass or dig to control the ball. Second contact: Often a set that prepares the attacker. Third contact: Often an attack sending the ball over the net.
  - Apply: Must a team always use all three contacts? The first contact is poor. What should the next player prioritize?

- **Share the first ball** — Organize lanes and seams before the serve.
  - Teach: Serve-receive pattern: The team's starting arrangement to pass a serve. Passing seam: Space between two receivers. Short-serve coverage: Responsibility for a serve landing closer to the net.
  - Apply: A short serve repeatedly falls between the setter and passers. What should the team clarify? A passer is moved by the serve. What should nearby teammates avoid?

- **Blockers and floor defenders** — Connect the block with the spaces behind it.
  - Teach: Line shot: An attack down the nearby sideline. Cross-court shot: An attack diagonally across the court. Defensive seam: Space between defending responsibilities.
  - Apply: The team calls a line block. What must floor defenders know? A ball drops between two defenders who both waited. What needs a clearer plan?

- **Defend as one team** — Coordinate what the block takes away and what defenders cover.
  - Teach: Line shot: An attack directed along the sideline. Cross-court shot: An attack directed diagonally across the court. Seam: The space between two blockers or defenders.
  - Apply: The block is assigned to take away the line. What should the floor defense plan to cover? Two blockers leave a gap between their hands. What is that opening?

Game Day transfer: Your setter takes the first dig. What keeps the three-contact plan organized?

Expected reasoning: An agreed backup setting role keeps the rally organized when the setter handles the first ball.


#### 8. Read the game

Outcome: Use space, time, and the opponent's movement to choose a response.

- **Read the second contact** — Use the pass and setter position to prepare defense.
  - Teach: In-system: The pass allows the team to run its planned attacking options. Out-of-system: The pass limits the team's normal attacking options. Setter dump: A setter attacks the second contact rather than setting.
  - Apply: A pass pulls the setter far away from the net. What often becomes less likely? A front-row setter near the net has open space across it. What should defenders remember?

- **Serve to a plan** — Connect serving risk with the opponent's passing shape.
  - Teach: Serving zone: An area the server aims to reach. Ace: A serve that directly wins the rally. Serve pressure: A serve that makes the opponent's first pass difficult.
  - Apply: The opponent's seam passes keep causing confusion. What is a useful serving target? Your hard serves keep missing long. What may improve the plan?

- **Turn defense into attack** — Move from a block or dig into the next offensive chance.
  - Teach: Transition attack: An attack built after defending the opponent's attack. Release: A player's move from one responsibility to the next. Reset: Regain useful positions for the next contact.
  - Apply: A blocker lands and your team digs the ball. What should the blocker prepare for? The setter digs the attack. Who should take the second contact?

Game Day transfer: A pass pulls the setter away from the net. What should the block prepare for?

Expected reasoning: A poor pass reduces some quick combinations. Defenders still read the set rather than assuming one outcome.


#### 9. Solve the next problem

Outcome: Recognize pressure and use a practiced answer.

- **When the pass breaks down** — Choose a hittable response from a difficult first ball.
  - Teach: Out of system: The team cannot run its usual organized attack. High-ball option: A higher set that gives an available attacker time. Reset ball: A controlled return used when a full attack is unavailable.
  - Apply: The pass pulls the setter far from the net. What should the team choose? Why cover an out-of-system hitter closely?

- **See the block before choosing** — Use blocker position without assuming a guaranteed point.
  - Teach: Block seam: A gap between blockers. High hands: The upper part of the block a hitter may try to use. Attack error: An attack loses the rally, such as going out untouched.
  - Apply: The blockers leave a clear seam. What is one available attacking target? The block closes the seam as you approach. What needs to change?

- **Use the block** — Choose attacks from the block and floor defense.
  - Teach: Tool the block: Attack off the block so the ball goes out or becomes hard to defend. Commit block: A blocker commits early to a specific attacker. Read block: A blocker waits for information before moving to the attack.
  - Apply: The outside blocker's hands leave an exposed outside edge. What may the hitter use? The middle blocker commits early to your quick hitter. What may the setter find?

Game Day transfer: A poor pass removes the quick attack. What should the setter choose?

Expected reasoning: An out-of-system plan uses the control and hitters still available.


#### 10. Advanced game decisions

Outcome: Compare options and adjust when the opponent changes the plan.

- **Run the system** — Understand 5-1 and 6-2 responsibilities.
  - Teach: 5-1 offense: One setter runs the offense through all six rotations. 6-2 offense: Two setters alternate, with a back-row setter usually running the offense. Front-row options: The attackers and setter actions legally available near the net.
  - Apply: In a 5-1, does a new player become setter every rotation? Why can a 6-2 offer three front-row hitters? In a 5-1, the only setter rotates to the front row. Can the setter still run the offense? A back-row setter jumps near the net and sends a ball over entirely above net height. What rule needs checking?

- **Adjust through the rotations** — Use match evidence rather than a single successful rally.
  - Teach: Rotation matchup: The attackers and blockers facing one another in a particular rotation. Passing trend: A repeated strength or difficulty in serve receive. Match adjustment: A planned change based on what the opponent is doing.
  - Apply: One rotation repeatedly struggles with short serves. What is a useful adjustment? An attacker scores once with a tip. Does that prove every next ball should be tipped?

- **Adjust and finish** — Use rotations, substitutions, and score pressure thoughtfully.
  - Teach: Matchup: How one player or unit compares with an opponent in a specific action. Timeout: A legal team stoppage to regroup. Game plan: The team's agreed targets, roles, and responses.
  - Apply: One rotation repeatedly loses points in serve receive. What should a timeout address? At set point, is the hardest possible serve always best? The libero finger-sets from the front zone. Can a teammate finish that ball entirely above the net?

Game Day transfer: The opponent's middle blocker commits early. Your outside hitter has one blocker. What has the setter created?

Expected reasoning: Moving a blocker can improve a matchup. A useful set and the hitter's next read still decide the attack.
