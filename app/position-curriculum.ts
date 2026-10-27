import type { Challenge, LearningModule, Position, Sport } from "./learning-data";

export type CraftProfile = {
  tacticalTitle: string;
  masteryTitle: string;
  gamePicture: string;
  pressure: string;
  communication: string;
  adjustment: string;
  evidence: string;
};

export const PRIMARY_SOURCE_IDS: Record<string, string[]> = {
  football: ["nfl-2025-rules", "nfl-football-terms"],
  "flag-football": ["ifaf-flag-rules"],
  basketball: ["fiba-2024-rules"],
  soccer: ["ifab-2026-laws"],
  volleyball: ["fivb-2025-2028-rules"],
  baseball: ["wbsc-baseball-2025-2026"],
  softball: ["wbsc-softball-2026-2029"],
  hockey: ["iihf-2026-2027-rulebook"],
  lacrosse: ["world-lacrosse-playing-rules"],
  rugby: ["world-rugby-laws"],
  "field-hockey": ["fih-2026-outdoor-rules"],
  "water-polo": ["world-aquatics-2026-water-polo"],
  cricket: ["mcc-2026-laws"],
  tennis: ["itf-2026-tennis-rules"],
  "track-field": ["world-athletics-2026-rules"],
  swimming: ["world-aquatics-2026-swimming"],
  gymnastics: ["fig-2025-2028-artistic"],
  pickleball: ["usap-2026-rulebook"],
  badminton: ["bwf-laws-badminton"],
  golf: ["usga-rules-golf"],
  cycling: ["uci-2026-regulations"],
  mma: ["abc-unified-mma"],
  wrestling: ["uww-2026-wrestling-rules"],
  bowling: ["usbc-bowling-basics", "usbc-high-school-guide"],
};

const SPORT_CRAFT_PROFILES: Record<string, CraftProfile> = {
  football: {
    tacticalTitle: "Keys, Leverage & Assignment",
    masteryTitle: "Disguise, Pressure & Adjustment",
    gamePicture: "formation, personnel, front, leverage, down and distance",
    pressure: "the opponent changes the strength, motion, or pressure picture",
    communication: "name the strength, alert the change, and confirm the assignment",
    adjustment: "honor the call while replacing the space or leverage the change threatens",
    evidence: "post-snap movement confirms or replaces the pre-snap expectation",
  },
  "flag-football": {
    tacticalTitle: "Space, Rush Clock & Leverage",
    masteryTitle: "Motion, Red Zone & Clock Decisions",
    gamePicture: "formation width, rush rules, defender leverage, open grass, and down",
    pressure: "the rush arrives or the defense squeezes the short field",
    communication: "identify the rusher, declare the spacing, and alert motion",
    adjustment: "create a legal quick answer without inviting contact or exposing a flag",
    evidence: "the rusher's path and defenders' hips reveal the next window",
  },
  basketball: {
    tacticalTitle: "Advantage, Help & Spacing",
    masteryTitle: "Coverage, Clock & Counter",
    gamePicture: "matchups, help position, screening angle, floor spacing, and shot clock",
    pressure: "the defense switches, traps, goes under, or closes the driving lane",
    communication: "call the screen, tag the cutter, and identify the next rotation",
    adjustment: "keep the advantage by attacking the rotation instead of forcing the first option",
    evidence: "the on-ball defender and low helper show where the advantage moved",
  },
  soccer: {
    tacticalTitle: "Scanning, Lines & Transition",
    masteryTitle: "Press, Overload & Game State",
    gamePicture: "pressure on the ball, teammate support, opponent lines, open space, and game state",
    pressure: "possession turns over or the opponent changes the press",
    communication: "name the pressure, point to the free player, and organize cover",
    adjustment: "protect the center first, then exploit the free player or space",
    evidence: "opponent body shape and line movement reveal whether to play through, around, or beyond",
  },
  volleyball: {
    tacticalTitle: "Rotation, Read & Coverage",
    masteryTitle: "Tempo, Matchup & Transition",
    gamePicture: "rotation, setter location, pass quality, hitter approach, and block shape",
    pressure: "the pass leaves system or the opponent changes attack tempo",
    communication: "call seam responsibility, hitter availability, and block or coverage assignment",
    adjustment: "preserve legal rotation and build the best attack or defensive shape available",
    evidence: "the setter's body and hitter approach narrow the likely attack",
  },
  baseball: {
    tacticalTitle: "Count, Outs & Base State",
    masteryTitle: "Sequence, Alignment & Run Value",
    gamePicture: "count, outs, runners, score, inning, hitter tendency, and field alignment",
    pressure: "the count, baserunner, or defensive alignment changes the risk",
    communication: "confirm the sign, coverage, cutoff, and priority runner",
    adjustment: "choose the highest-value out or hitting plan without giving away the next base",
    evidence: "pitch shape, swing decision, contact, and runner movement update the play",
  },
  softball: {
    tacticalTitle: "Count, Short Game & Coverage",
    masteryTitle: "Tempo, Runner Pressure & Counter",
    gamePicture: "count, outs, runners, bunt or slap threat, score, and defensive alignment",
    pressure: "the offense uses speed, short game, or an aggressive runner",
    communication: "confirm corners, coverage, cutoff, and priority out",
    adjustment: "secure the ball and choose the sure out before chasing a low-percentage play",
    evidence: "batter setup, pitch path, contact angle, and runner break reveal the play",
  },
  hockey: {
    tacticalTitle: "Gap, Support & Zone Read",
    masteryTitle: "Forecheck, Matchup & Line Change",
    gamePicture: "puck pressure, skating lanes, support, defensive gap, zone, and shift length",
    pressure: "possession changes or the opponent beats the first forechecker",
    communication: "call pressure, support, net-front threat, and change timing",
    adjustment: "stay above the puck or replace the vacated lane before attacking the next advantage",
    evidence: "puck carrier shoulders, speed, and support reveal the next lane",
  },
  lacrosse: {
    tacticalTitle: "Slide, Crease & Transition",
    masteryTitle: "Package, Matchup & Extra Player",
    gamePicture: "ball location, crease threats, slide package, matchup, transition numbers, and clock",
    pressure: "a defender is beaten or possession changes with an unsettled field",
    communication: "call ball, slide, two, crease, and recovery responsibility",
    adjustment: "protect the highest-danger middle space while rotating to the next threat",
    evidence: "dodger hips, adjacent cutters, and defender approach reveal the slide decision",
  },
  rugby: {
    tacticalTitle: "Gain Line, Breakdown & Shape",
    masteryTitle: "Phase, Kick Space & Defensive Fold",
    gamePicture: "gain line, breakdown numbers, defensive spacing, support, field zone, and phase count",
    pressure: "the breakdown is slow or the defense removes the planned edge",
    communication: "call numbers, width, guard-bodyguard roles, and kick or carry space",
    adjustment: "retain possession and rebuild shape before forcing a low-support action",
    evidence: "defensive line speed, backfield coverage, and ruck picture reveal the best next phase",
  },
  "field-hockey": {
    tacticalTitle: "Press, Transfer & Circle Entry",
    masteryTitle: "Overload, Counterpress & Set Piece",
    gamePicture: "ball pressure, passing lanes, press shape, circle numbers, and outlet support",
    pressure: "the first entry closes or possession turns over",
    communication: "call pressure, cover shadow, transfer option, and circle responsibility",
    adjustment: "keep legal stick position and move the defense before forcing the circle",
    evidence: "defender feet, stick angle, and support distance reveal the open lane",
  },
  "water-polo": {
    tacticalTitle: "Front, Drive & Perimeter Read",
    masteryTitle: "Extra Player, Clock & Matchup",
    gamePicture: "ball position, center battle, defender hips, open water, exclusion state, and possession clock",
    pressure: "the center is fronted or an exclusion creates a temporary advantage",
    communication: "call front or drop, driver movement, post threat, and clock",
    adjustment: "move the defense with a safe pass before attacking the highest-percentage window",
    evidence: "defender head and hips plus goalkeeper position reveal the next passing or shooting lane",
  },
  cricket: {
    tacticalTitle: "Line, Length & Field",
    masteryTitle: "Sequence, Rate & Match Situation",
    gamePicture: "line, length, field placement, batter intent, wickets, required rate, and innings phase",
    pressure: "the batter changes stance or the required rate changes risk",
    communication: "confirm field, target area, running call, and match plan",
    adjustment: "change line, length, pace, or scoring option while protecting the match situation",
    evidence: "release, bounce, batter movement, and field response reveal whether the plan is working",
  },
  tennis: {
    tacticalTitle: "Serve, Return & Court Position",
    masteryTitle: "Pattern, Score & Counter",
    gamePicture: "score, serve or return pattern, opponent position, ball height, court space, and recovery",
    pressure: "the opponent changes direction, depth, spin, or net position",
    communication: "commit to the target and, in doubles, call middle and movement responsibility",
    adjustment: "recover to a position that protects the next likely ball before seeking more offense",
    evidence: "opponent balance, racket path, and contact point reveal likely direction and time",
  },
  "track-field": {
    tacticalTitle: "Phase, Rhythm & Legal Execution",
    masteryTitle: "Pacing, Conditions & Competition Plan",
    gamePicture: "event phase, marks, rhythm, legal boundaries, conditions, competitors, and remaining distance",
    pressure: "wind, pace, a missed mark, or competitor movement disrupts the plan",
    communication: "confirm marks, exchange calls, attempt order, and safety signals",
    adjustment: "protect legal execution and rhythm before making a controlled performance change",
    evidence: "split, posture, contact rhythm, and mark accuracy show whether the plan needs adjustment",
  },
  swimming: {
    tacticalTitle: "Stroke, Turn & Pace",
    masteryTitle: "Race Plan, Underwater & Exchange",
    gamePicture: "stroke phase, wall distance, turn rules, underwater limit, pace, and remaining distance",
    pressure: "fatigue changes rhythm or the wall arrives differently than expected",
    communication: "confirm heat, lane, stroke order, relay order, and takeoff cue",
    adjustment: "protect legal technique and streamline before spending more energy",
    evidence: "stroke count, split, breakout distance, and wall timing show where speed is gained or lost",
  },
  gymnastics: {
    tacticalTitle: "Shape, Connection & Landing",
    masteryTitle: "Composition, Risk & Routine Control",
    gamePicture: "body shape, apparatus position, connection rhythm, landing area, difficulty, and execution risk",
    pressure: "a skill finishes off line or connection timing changes",
    communication: "confirm cue, apparatus setting, routine order, and coach safety signal",
    adjustment: "protect body position and a safe legal finish before adding difficulty",
    evidence: "takeoff, body line, hand or foot placement, and landing control reveal execution quality",
  },
  pickleball: {
    tacticalTitle: "Two-Bounce, Kitchen & Transition",
    masteryTitle: "Stack, Speed-Up & Counter",
    gamePicture: "serve-return state, non-volley-zone position, ball height, opponent balance, and partner spacing",
    pressure: "the return keeps you back or an opponent speeds up from the kitchen",
    communication: "call middle, switch, bounce, and movement through transition",
    adjustment: "respect the two-bounce and non-volley-zone rules while earning a balanced attack position",
    evidence: "ball height, paddle position, and opponent balance reveal dink, attack, or reset",
  },
  badminton: {
    tacticalTitle: "Base, Rotation & Attack",
    masteryTitle: "Serve Return, Tempo & Counter",
    gamePicture: "shuttle height, opponent balance, court base, partner rotation, and open space",
    pressure: "the shuttle gets behind the base or the opponents take attacking formation",
    communication: "call yours, rotation, front-back responsibility, and open middle",
    adjustment: "recover the formation with height or control before forcing the next attack",
    evidence: "racket preparation, contact height, and opponent balance reveal pace and direction",
  },
  golf: {
    tacticalTitle: "Lie, Target & Dispersion",
    masteryTitle: "Course, Conditions & Risk",
    gamePicture: "lie, distance, wind, hazards, landing area, dispersion, and next-shot angle",
    pressure: "the lie or wind makes the aggressive target smaller than the normal miss pattern",
    communication: "confirm yardage, target, club, conditions, and safety before playing",
    adjustment: "choose a target that keeps the normal miss away from penalty and short-sided trouble",
    evidence: "start line, strike, curve, carry, and rollout show whether the plan matched execution",
  },
  cycling: {
    tacticalTitle: "Draft, Pace & Line",
    masteryTitle: "Race Situation, Surface & Attack",
    gamePicture: "course, surface, wind, group position, effort, braking point, and remaining distance",
    pressure: "the group surges, wind changes, or the safest line closes",
    communication: "signal hazards, direction, rotation, and team or rider movement",
    adjustment: "protect traction and position before spending energy on the next move",
    evidence: "speed, cadence, gap, surface grip, and rider movement show when to hold or act",
  },
  mma: {
    tacticalTitle: "Range, Phase & Defense",
    masteryTitle: "Transition, Score & Safe Decision",
    gamePicture: "range, stance, legal targets, cage position, control, round time, and referee commands",
    pressure: "the exchange moves from striking to clinch or ground",
    communication: "follow referee commands and use clear corner cues between rounds",
    adjustment: "secure defense and position before attacking during a phase change",
    evidence: "stance, hips, grips, head position, and cage space reveal the next threat",
  },
  wrestling: {
    tacticalTitle: "Position, Control & Exposure",
    masteryTitle: "Style, Clock & Chain Wrestling",
    gamePicture: "stance, tie, mat position, control, exposure or near-fall risk, score, clock, and ruleset",
    pressure: "the opponent counters the first attack or the score changes urgency",
    communication: "respond to referee commands and use concise corner cues",
    adjustment: "protect position and legal control while chaining to the next attack, escape, or turn",
    evidence: "hips, head and hand position, weight distribution, and boundary reveal the next option",
  },
  bowling: {
    tacticalTitle: "Target, Pocket & Spare Plan",
    masteryTitle: "Lane Transition, Format & Pressure",
    gamePicture: "remaining pins, target board, ball path, pocket entry, lane transition, frame, and format",
    pressure: "oil transition changes the breakpoint or a pressure frame changes score priority",
    communication: "share ball reaction, target move, order, and Baker-frame plan",
    adjustment: "make the smallest evidence-based target, speed, or equipment change that restores pocket control",
    evidence: "where the ball skids, hooks, enters the pocket, and leaves pins reveals the adjustment",
  },
};

export function craftProfileForSport(sportId: string) {
  return SPORT_CRAFT_PROFILES[sportId];
}

export function primarySourceIdsForSport(sportId: string) {
  return PRIMARY_SOURCE_IDS[sportId] ?? [];
}

function makeChallenge(input: {
  id: string;
  label: string;
  prompt: string;
  correct: string;
  distractors: string[];
  explanation: string;
  xp?: number;
}): Challenge {
  return {
    id: input.id,
    conceptId: input.id,
    type: "scenario",
    label: input.label,
    prompt: input.prompt,
    options: [input.correct, ...input.distractors],
    correct: input.correct,
    explanation: input.explanation,
    xp: input.xp ?? 15,
    advancedOnly: true,
  };
}

export function buildAdvancedPositionModules(input: {
  sport: Sport;
  position: Position;
  read: string;
  moduleId: (level: number) => string;
}): [LearningModule, LearningModule] {
  const { sport, position, read, moduleId } = input;
  const profile = SPORT_CRAFT_PROFILES[sport.id];
  const sources = primarySourceIdsForSport(sport.id);
  const role = position.name;

  const tactics: LearningModule = {
    id: moduleId(2),
    sportId: sport.id,
    level: 2,
    pathway: "position",
    position: role,
    title: `${role}: ${profile.tacticalTitle}`,
    description: `Connect the ${role}'s first read to a real ${sport.name} decision.`,
    estimatedMinutes: 6,
    advancedOnly: true,
    minimumAgeBand: "13-15",
    sourceIds: sources,
    challenges: [
      makeChallenge({
        id: `${moduleId(2)}-picture`,
        label: "Build the read",
        prompt: `How should a ${role} use the first read?`,
        correct: "Connect the read to the full situation",
        distractors: ["Trust the read without checking the plan", "Check the plan without reading the action", "Wait for the result before choosing a response"],
        explanation: `${sport.name} decisions improve when the ${role} connects ${profile.gamePicture} to the role-specific read—${read}—instead of reacting to one isolated indicator.`,
      }),
      makeChallenge({
        id: `${moduleId(2)}-key`,
        label: "Update the read",
        prompt: `The initial read changes. What should a ${role} do?`,
        correct: "Update the read and protect the responsibility",
        distractors: ["Follow the first movement without checking again", "Wait until the available advantage has disappeared", "Leave the responsibility and chase the action"],
        explanation: `The role-specific key is ${read}. It matters only when it leads to the job: ${position.focus}.`,
      }),
      makeChallenge({
        id: `${moduleId(2)}-communicate`,
        label: "Connect the team",
        prompt: `What should a ${role} confirm before the action?`,
        correct: "Confirm the situation, adjustment, and responsibility",
        distractors: ["Change the plan after the action has started", "Repeat the plan without checking the situation", "Wait for the result before confirming responsibility"],
        explanation: `Useful communication is early, specific, and connected to the ${role}'s responsibility: ${profile.communication}.`,
      }),
      makeChallenge({
        id: `${moduleId(2)}-pressure`,
        label: "Solve pressure",
        prompt: `The situation changes. What comes first for a ${role}?`,
        correct: "Protect the primary responsibility first",
        distractors: ["Chase the most visible action first", "Force the fastest available response first", "Abandon the role plan for a new action"],
        explanation: `Pressure changes the situation, not the need for disciplined responsibility. The ${role} must ${position.focus}.`,
      }),
      makeChallenge({
        id: `${moduleId(2)}-evidence`,
        label: "Confirm the read",
        prompt: `What should confirm the ${role}'s first read?`,
        correct: "Use live movement to update the read",
        distractors: ["Use crowd reaction to update the read", "Use the last opponent to update the read", "Use the original plan to ignore the movement"],
        explanation: `Good ${role} play updates decisions from live evidence—${profile.evidence}—while continuing to read ${read}.`,
      }),
    ],
  };

  const mastery: LearningModule = {
    id: moduleId(3),
    sportId: sport.id,
    level: 3,
    pathway: "position",
    position: role,
    title: `${role}: ${profile.masteryTitle}`,
    description: `Diagnose the opponent's answer, adjust with discipline, and evaluate the result.`,
    estimatedMinutes: 7,
    advancedOnly: true,
    minimumAgeBand: "16-17",
    sourceIds: sources,
    challenges: [
      makeChallenge({
        id: `${moduleId(3)}-diagnose`,
        label: "Diagnose the counter",
        prompt: `The first option closes. What should the ${role} do first?`,
        correct: "Reassess the situation and confirm the read",
        distractors: ["Repeat the first choice at full speed", "Change every part of the plan at once", "Copy a different role without checking responsibility"],
        explanation: `Mastery begins with diagnosis. Rebuilding ${profile.gamePicture} and rechecking ${read} shows what truly changed for the ${role}.`,
      }),
      makeChallenge({
        id: `${moduleId(3)}-adjust`,
        label: "Choose the adjustment",
        prompt: `The first plan fails. Which adjustment is disciplined?`,
        correct: "Make the smallest change that protects responsibility",
        distractors: ["Trade the responsibility for the riskiest option", "Break a rule to regain the lost advantage", "Wait until no safe adjustment remains available"],
        explanation: `The disciplined ${role} counter is to ${profile.adjustment} while preserving the responsibility to ${position.focus}.`,
      }),
      makeChallenge({
        id: `${moduleId(3)}-risk`,
        label: "Manage risk",
        prompt: `When is an aggressive choice worth the risk?`,
        correct: "When reward and support justify the failure cost",
        distractors: ["When the choice could create the biggest highlight", "When the same choice worked in the last game", "When every aggressive option looks equally difficult"],
        explanation: `Advanced decisions weigh reward and failure cost in the current game state; aggression and safety are tools, not fixed identities.`,
      }),
      makeChallenge({
        id: `${moduleId(3)}-feedback`,
        label: "Learn from the rep",
        prompt: `How should a ${role} review the last action?`,
        correct: "Compare the process and result with responsibility",
        distractors: ["Judge the result without checking the decision process", "Compare the action with a different situation", "Count the action as good because it worked"],
        explanation: `Evaluate both result and process. For the ${role}, ${profile.evidence}; then check whether the rep still served the responsibility to ${position.focus}.`,
      }),
      makeChallenge({
        id: `${moduleId(3)}-transfer`,
        label: "Transfer the skill",
        prompt: `What makes the ${role}'s decision process repeatable?`,
        correct: "Read, communicate, act, and review",
        distractors: ["Memorize one answer for every situation", "Wait for the exact same action to return", "Copy the result without reviewing the reason"],
        explanation: `A repeatable high-IQ loop is read, communicate, execute responsibility, and review—not memorize one result.`,
      }),
    ],
  };

  return [tactics, mastery];
}
