export type ChallengeType = "choice" | "truefalse" | "scenario" | "ordering" | "multi" | "hotspot";

export type Challenge = {
  id: string;
  conceptId: string;
  type: ChallengeType;
  label: string;
  prompt: string;
  youngPrompt?: string;
  options: string[];
  advancedOptions?: string[];
  correct: string | string[];
  explanation: string;
  youngExplanation?: string;
  hint?: string;
  youngHint?: string;
  xp: number;
  remediation?: Challenge;
};

export type LearningModule = {
  id: string;
  sportId: string;
  level: number;
  pathway: "general" | "position";
  position?: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  challenges: Challenge[];
};

export type Position = {
  name: string;
  group: string;
  focus: string;
};

type IntroQuestion = {
  id: "team-size" | "format" | "score" | "field";
  type: "choice" | "hotspot";
  label: string;
  prompt: string;
  youngPrompt?: string;
  options: string[];
  advancedOptions?: string[];
  correct: string;
  explanation: string;
  youngExplanation?: string;
  xp: number;
};

export type Sport = {
  id: string;
  name: string;
  icon: string;
  mark: string;
  color: string;
  softColor: string;
  variants: string[];
  pathNote?: string;
  pathLabel?: string;
  pathQuestion?: string;
  positions: Position[];
  introQuestions: IntroQuestion[];
};

export type QuizAgeBand = "7-9" | "10-12" | "13-15" | "16-17" | "18+";

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rotate<T>(items: T[], offset: number) {
  if (items.length < 2) return [...items];
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

export function arrangeChallengeOptions(
  challenge: Challenge,
  ageBand: QuizAgeBand,
  questionIndex = 0,
  sequenceKey = challenge.id,
) {
  const expected = Array.isArray(challenge.correct) ? challenge.correct : [challenge.correct];
  const advancedPath = ageBand === "13-15" || ageBand === "16-17" || ageBand === "18+";
  const source = advancedPath && challenge.advancedOptions?.length ? challenge.advancedOptions : challenge.options;
  let options = [...new Set([...source, ...expected])];
  const salt = stableHash(`${sequenceKey}:${ageBand}`);

  if (ageBand === "7-9" && !["multi", "ordering"].includes(challenge.type) && options.length > 2) {
    const distractors = rotate(options.filter((option) => !expected.includes(option)), salt);
    options = [...expected, ...distractors.slice(0, Math.max(0, 2 - expected.length))];
  }

  if (challenge.type === "ordering") {
    const shift = options.length > 1 ? 1 + ((salt + questionIndex) % (options.length - 1)) : 0;
    const arranged = rotate(options, shift);
    return arranged.every((option, index) => option === expected[index]) ? rotate(arranged, 1) : arranged;
  }

  if (challenge.type === "multi") {
    return rotate(options, (salt + questionIndex) % Math.max(1, options.length));
  }

  const correct = expected[0];
  const distractors = rotate(options.filter((option) => option !== correct), salt);
  const targetIndex = (salt + questionIndex) % options.length;
  distractors.splice(targetIndex, 0, correct);
  return distractors;
}

export const LEVELS = ["Rookie", "Starter", "Playmaker", "All-Star", "Elite", "Pro"];

export const SPORTS: Sport[] = [
  {
    id: "football",
    name: "Tackle Football",
    icon: "football",
    mark: "TF",
    color: "#2f6f68",
    softColor: "#dcebe6",
    variants: ["Women’s Tackle", "Men’s Tackle", "Youth Tackle"],
    pathNote: "Eleven-on-eleven tackle football with offensive, defensive, and special-teams position rooms.",
    positions: [
      { name: "Quarterback", group: "Offense", focus: "read the defense and distribute the ball" },
      { name: "Running Back", group: "Offense", focus: "press the run track and identify the open crease" },
      { name: "Fullback", group: "Offense", focus: "lead block and adjust to the first dangerous defender" },
      { name: "Wide Receiver", group: "Offense", focus: "create leverage and run routes at the correct depth" },
      { name: "Tight End", group: "Offense", focus: "balance route, run-block, and protection responsibilities" },
      { name: "Left Tackle", group: "Offensive Line", focus: "protect the edge and maintain pocket width" },
      { name: "Left Guard", group: "Offensive Line", focus: "secure the interior gap and create movement" },
      { name: "Center", group: "Offensive Line", focus: "identify the front, snap cleanly, and set protection" },
      { name: "Right Guard", group: "Offensive Line", focus: "secure the interior gap and create movement" },
      { name: "Right Tackle", group: "Offensive Line", focus: "protect the edge and anchor against power" },
      { name: "Defensive Tackle", group: "Defense", focus: "control an interior gap and disrupt the backfield" },
      { name: "Defensive End", group: "Defense", focus: "set the edge and pressure the passer" },
      { name: "Inside Linebacker", group: "Defense", focus: "read run-pass keys and fit the correct gap" },
      { name: "Outside Linebacker", group: "Defense", focus: "force the edge and handle coverage or pressure" },
      { name: "Cornerback", group: "Defense", focus: "control receiver leverage and defend the route" },
      { name: "Safety", group: "Defense", focus: "read the formation and protect the deepest threat" },
      { name: "Kicker", group: "Special Teams", focus: "repeat a consistent approach and contact point" },
      { name: "Punter", group: "Special Teams", focus: "control operation time, direction, and hang time" },
      { name: "Long Snapper", group: "Special Teams", focus: "deliver an accurate snap on a repeatable line" },
      { name: "Returner", group: "Special Teams", focus: "secure the ball and read the return leverage" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "In standard 11-player tackle football, how many players from each team are normally on the field during a play?", youngPrompt: "In tackle football, how many players from one team are on the field during a play?", options: ["11 players from each team (22 players total)", "11 players total", "22 players from each team", "The number changes every play"], correct: "11 players from each team (22 players total)", explanation: "Each team normally fields 11 players, so there are 22 players total when both teams have a full unit on the field.", youngExplanation: "Each team uses 11 players, making 22 players total.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "How is a regulation adult tackle football game normally divided?", options: ["Four quarters", "Two halves with no quarters", "Three periods", "Nine innings"], correct: "Four quarters", explanation: "Adult tackle football uses four quarters, although quarter length can vary by league.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "Before the extra-point try, how many points is a touchdown worth?", options: ["6 points", "3 points", "2 points", "1 point"], correct: "6 points", explanation: "A touchdown is worth 6 points before the offense attempts a one- or two-point try.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a regulation tackle football field?", options: ["100 yards between the goal lines, plus two end zones", "A diamond with four bases", "A court divided by a net", "An oval centered on a pitch"], correct: "100 yards between the goal lines, plus two end zones", explanation: "The playing field is 100 yards between the goal lines, with an end zone beyond each goal line.", xp: 12 },
    ],
  },
  {
    id: "flag-football",
    name: "Flag Football",
    icon: "flag-checkered",
    mark: "FF",
    color: "#59739a",
    softColor: "#e0e6ef",
    variants: ["Women’s Flag", "Men’s Flag", "Coed Flag", "5v5", "7v7"],
    pathNote: "A distinct non-tackle discipline with its own rulesets, field spacing, eligible-player concepts, positions, and strategy.",
    positions: [
      { name: "Quarterback", group: "Offense", focus: "read space quickly and deliver an accurate on-time throw" },
      { name: "Center / Snapper", group: "Offense", focus: "start the play cleanly and release into the pattern when eligible" },
      { name: "Receiver", group: "Offense", focus: "create separation and settle in open space" },
      { name: "Ball Carrier", group: "Offense", focus: "protect the flag and attack leverage without initiating contact" },
      { name: "Rusher", group: "Defense", focus: "time the rush and pressure the quarterback under the ruleset" },
      { name: "Short-Zone Defender", group: "Defense", focus: "close throwing windows and break safely on the ball" },
      { name: "Deep Defender", group: "Defense", focus: "protect vertical space and prevent explosive plays" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "Which statement is most accurate about flag football team size?", youngPrompt: "Flag football can use different team sizes. Which answer is true?", options: ["It depends on the ruleset; 5-on-5 and 7-on-7 are common", "Every league uses exactly 11 players per team", "Every league uses exactly 5 players per team", "Both teams share a total of 7 players"], correct: "It depends on the ruleset; 5-on-5 and 7-on-7 are common", explanation: "Flag football varies by ruleset: international competition uses 5-on-5, while 7-on-7 is also common in U.S. leagues.", youngExplanation: "Flag football often uses 5 players or 7 players on each team.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "Which statement best describes the flag football game clock?", options: ["Many leagues use two halves, but exact timing depends on the ruleset", "Every game has four 15-minute quarters", "Every game lasts exactly 90 minutes", "Flag football has nine innings"], correct: "Many leagues use two halves, but exact timing depends on the ruleset", explanation: "Many flag football formats use two halves, but the length and clock rules are set by the league or tournament.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "In many flag football rulesets, how many points is a touchdown worth?", options: ["6 points", "3 points", "2 points", "1 point"], correct: "6 points", explanation: "A touchdown is commonly worth 6 points, while the value and location of the try can vary by ruleset.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which statement best describes a common flag football field?", options: ["It is usually shorter or narrower than a tackle field, with dimensions set by the ruleset", "It must always be a full 100 yards between goal lines", "It is a court with two baskets", "It is a diamond with four bases"], correct: "It is usually shorter or narrower than a tackle field, with dimensions set by the ruleset", explanation: "Flag football commonly uses a shorter or narrower field, but exact dimensions depend on whether the game is 5-on-5, 7-on-7, youth, or another format.", xp: 12 },
    ],
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: "basketball",
    mark: "BK",
    color: "#b66a45",
    softColor: "#f1e3d8",
    variants: ["General", "Men’s", "Women’s"],
    positions: [
      { name: "Point Guard", group: "Backcourt", focus: "organize the offense and create advantages" },
      { name: "Shooting Guard", group: "Backcourt", focus: "space the floor and attack closeouts" },
      { name: "Small Forward", group: "Wing", focus: "score, defend, and connect actions" },
      { name: "Power Forward", group: "Frontcourt", focus: "screen, rebound, and defend multiple spots" },
      { name: "Center", group: "Frontcourt", focus: "protect the rim and control the paint" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "In standard five-on-five basketball, how many players from each team are on the court during play?", youngPrompt: "How many players from one basketball team are on the court?", options: ["5 per team (10 players total)", "5 players total", "10 per team", "11 per team"], correct: "5 per team (10 players total)", explanation: "Each team has 5 players on the court, so a full five-on-five game has 10 players on the court.", youngExplanation: "Each team uses 5 players, making 10 players total.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "Under FIBA, NBA, and WNBA-style rules, how is a game divided?", options: ["Four quarters", "Two 45-minute halves", "Three periods", "Nine innings"], correct: "Four quarters", explanation: "FIBA, NBA, and WNBA games use four quarters; some competitions, including NCAA men’s basketball, use two halves.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "How many points is a made shot from beyond the three-point line worth?", options: ["3 points", "2 points", "1 point", "6 points"], correct: "3 points", explanation: "A successful shot from beyond the three-point line is worth 3 points.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a basketball court?", options: ["A rectangular court with one basket at each end", "A diamond with four bases", "A field with two end zones", "An oval centered on a pitch"], correct: "A rectangular court with one basket at each end", explanation: "Basketball is played on a rectangular court with one basket at each end.", xp: 12 },
    ],
  },
  {
    id: "soccer",
    name: "Soccer",
    icon: "soccer",
    mark: "SC",
    color: "#4b7a58",
    softColor: "#e1eadf",
    variants: ["General", "Men’s", "Women’s"],
    positions: [
      { name: "Goalkeeper", group: "Goal", focus: "protect the goal and organize the back line" },
      { name: "Center Back", group: "Defense", focus: "control central space and defend depth" },
      { name: "Fullback", group: "Defense", focus: "defend wide areas and support buildup" },
      { name: "Defensive Midfielder", group: "Midfield", focus: "screen the defense and connect possession" },
      { name: "Central Midfielder", group: "Midfield", focus: "control tempo and find the next line" },
      { name: "Winger", group: "Attack", focus: "stretch the field and create chances from width" },
      { name: "Striker", group: "Attack", focus: "occupy defenders and finish chances" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "In standard 11-a-side soccer, how many players may each team have on the field, including the goalkeeper?", youngPrompt: "How many players can one soccer team have on the field, including the goalkeeper?", options: ["11 players from each team (22 players total)", "11 players total between both teams", "22 players from each team", "10 players from each team, plus a shared goalkeeper"], correct: "11 players from each team (22 players total)", explanation: "Each team may have up to 11 players on the field, including one goalkeeper, so there can be 22 players total.", youngExplanation: "Each team can have 11 players, making 22 players total.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "How is a standard adult soccer match normally divided?", options: ["Two 45-minute halves", "Four 15-minute quarters", "Three 20-minute periods", "Nine innings"], correct: "Two 45-minute halves", explanation: "A standard adult match has two 45-minute halves, plus time added by the referee for stoppages.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "When the ball legally crosses the goal line between the posts, what is added to the score?", options: ["1 goal", "2 points", "3 points", "6 points"], correct: "1 goal", explanation: "Each legal goal adds 1 to that team’s score.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a standard outdoor soccer field?", options: ["A rectangular field with one goal at each end", "A diamond with four bases", "A court divided by a net", "An ice rink divided by blue lines"], correct: "A rectangular field with one goal at each end", explanation: "Outdoor soccer is played on a rectangular field, also called a pitch, with one goal at each end.", xp: 12 },
    ],
  },
  {
    id: "volleyball",
    name: "Volleyball",
    icon: "volleyball",
    mark: "VB",
    color: "#6b64a2",
    softColor: "#e8e5f3",
    variants: ["Indoor", "Beach", "Men’s", "Women’s"],
    positions: [
      { name: "Setter", group: "Offense", focus: "run the offense and deliver hittable sets" },
      { name: "Outside Hitter", group: "Attack", focus: "pass, attack, and score from the left pin" },
      { name: "Opposite", group: "Attack", focus: "score from the right pin and block the outside" },
      { name: "Middle Blocker", group: "Front Row", focus: "read the setter and close the block" },
      { name: "Libero", group: "Back Row", focus: "control serve receive and floor defense" },
      { name: "Defensive Specialist", group: "Back Row", focus: "serve, pass, and defend targeted rotations" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "In standard indoor volleyball, how many players from each team are on the court?", youngPrompt: "How many players from one indoor volleyball team are on the court?", options: ["6 per team (12 players total)", "6 players total", "2 per team", "11 per team"], correct: "6 per team (12 players total)", explanation: "Indoor volleyball uses 6 players per team on the court; beach volleyball uses 2 players per team.", youngExplanation: "Indoor volleyball uses 6 players on each team.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "How is a standard indoor volleyball match normally decided?", options: ["Best of five sets; the first team to win three sets wins", "Two 45-minute halves", "Four quarters", "Nine innings"], correct: "Best of five sets; the first team to win three sets wins", explanation: "Indoor volleyball is normally best of five sets, while beach volleyball is normally best of three.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "In standard indoor volleyball, what is the usual target score for a non-deciding set?", options: ["25 points, with a two-point winning margin", "15 points with no winning margin", "21 points exactly", "6 points"], correct: "25 points, with a two-point winning margin", explanation: "Most indoor sets are played to 25 and must be won by 2; a deciding fifth set is played to 15.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a volleyball court?", options: ["A court divided into two sides by a net", "A diamond with four bases", "A pool with floating goals", "A field with two end zones"], correct: "A court divided into two sides by a net", explanation: "Volleyball is played on a court divided into two equal sides by a net.", xp: 12 },
    ],
  },
  {
    id: "baseball",
    name: "Baseball",
    icon: "baseball",
    mark: "BB",
    color: "#386a8b",
    softColor: "#dce8ef",
    variants: ["General", "Youth", "Adult"],
    positions: [
      { name: "Pitcher", group: "Battery", focus: "execute pitches and disrupt timing" },
      { name: "Catcher", group: "Battery", focus: "receive, call pitches, and control the field" },
      { name: "First Base", group: "Infield", focus: "secure throws and defend the right side" },
      { name: "Second Base", group: "Infield", focus: "cover range and turn double plays" },
      { name: "Shortstop", group: "Infield", focus: "control the left-side gap and relay throws" },
      { name: "Third Base", group: "Infield", focus: "react quickly and guard the line" },
      { name: "Outfielder", group: "Outfield", focus: "read contact and control extra bases" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "In standard baseball, how many defensive players does one team put on the field while the other team bats?", youngPrompt: "How many defenders does a baseball team use on the field?", options: ["9 defensive players", "9 players total between both teams", "11 defensive players", "6 defensive players"], correct: "9 defensive players", explanation: "A standard baseball defense has 9 players on the field.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "How many innings are in a standard regulation adult baseball game?", options: ["9 innings", "7 innings", "4 quarters", "2 halves"], correct: "9 innings", explanation: "A standard adult regulation baseball game has 9 innings, although some youth and shortened competitions use fewer.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "What must a runner do to score one run in baseball?", options: ["Touch first, second, third, and home plate legally", "Reach first base only", "Hit the ball over the fence every time", "Record three outs"], correct: "Touch first, second, third, and home plate legally", explanation: "A runner scores 1 run by legally advancing around all four bases and touching home plate.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a baseball field?", options: ["A diamond with four bases connected to an outfield", "A court divided by a net", "A pool with floating goals", "A rectangular pitch with in-goal areas"], correct: "A diamond with four bases connected to an outfield", explanation: "Baseball uses a four-base diamond surrounded by fair-territory outfield space.", xp: 12 },
    ],
  },
  {
    id: "softball",
    name: "Softball",
    icon: "baseball-diamond",
    mark: "SB",
    color: "#9a6c36",
    softColor: "#efe5d4",
    variants: ["Fastpitch", "Slowpitch", "Women’s", "Men’s"],
    positions: [
      { name: "Pitcher", group: "Battery", focus: "change speed and location from the circle" },
      { name: "Catcher", group: "Battery", focus: "receive, call pitches, and control runners" },
      { name: "Corner Infielder", group: "Infield", focus: "react to bunts and protect the lines" },
      { name: "Middle Infielder", group: "Infield", focus: "cover range and manage force plays" },
      { name: "Outfielder", group: "Outfield", focus: "read contact and control extra bases" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "In standard fastpitch softball, how many defensive players are on the field?", youngPrompt: "How many defenders does a fastpitch softball team use?", options: ["9 defensive players", "9 players total between both teams", "10 defensive players in every softball format", "6 defensive players"], correct: "9 defensive players", explanation: "Standard fastpitch softball uses 9 defensive players; some slowpitch rulesets use 10.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "How many innings are in a standard regulation fastpitch softball game?", options: ["7 innings", "9 innings", "4 quarters", "2 halves"], correct: "7 innings", explanation: "A standard regulation fastpitch softball game has 7 innings.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "What must a runner do to score one run in softball?", options: ["Touch first, second, third, and home plate legally", "Reach first base only", "Record three outs", "Touch the pitching plate"], correct: "Touch first, second, third, and home plate legally", explanation: "A runner scores 1 run by legally advancing around all four bases and touching home plate.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which feature helps distinguish a softball field?", options: ["A four-base diamond with a pitching circle", "A court divided by a net", "An ice rink with blue lines", "A pool with floating goals"], correct: "A four-base diamond with a pitching circle", explanation: "Softball uses a four-base diamond and a pitching circle rather than a raised pitching mound.", xp: 12 },
    ],
  },
  {
    id: "hockey",
    name: "Ice Hockey",
    icon: "hockey-puck",
    mark: "HK",
    color: "#4b6f83",
    softColor: "#dfe9ed",
    variants: ["General", "Men’s", "Women’s"],
    positions: [
      { name: "Center", group: "Forward", focus: "support all three zones and drive the middle" },
      { name: "Winger", group: "Forward", focus: "create width, forecheck, and finish chances" },
      { name: "Defenseman", group: "Defense", focus: "protect the middle and start the breakout" },
      { name: "Goaltender", group: "Goal", focus: "track the puck and control rebounds" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "At full strength in standard ice hockey, how many players from each team are normally on the ice, including the goalkeeper?", youngPrompt: "At full strength, how many players from one hockey team are on the ice, including the goalie?", options: ["6 per team (12 players total)", "6 players total", "5 per team including the goalie", "11 per team"], correct: "6 per team (12 players total)", explanation: "A full-strength team normally has 5 skaters and 1 goalkeeper on the ice, making 6 players per team.", youngExplanation: "Each team normally has 5 skaters and 1 goalie on the ice.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "How is regulation time divided in standard international ice hockey?", options: ["Three 20-minute periods", "Two 45-minute halves", "Four 15-minute quarters", "Nine innings"], correct: "Three 20-minute periods", explanation: "Regulation ice hockey uses three 20-minute periods, with overtime rules applied when required.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "How much does one legal hockey goal add to the score?", options: ["1 goal", "2 points", "3 points", "6 points"], correct: "1 goal", explanation: "Each legal goal adds 1 to the scoring team’s total.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches an ice hockey rink?", options: ["An ice surface divided into defensive, neutral, and attacking zones", "A diamond with four bases", "A turf pitch with shooting circles", "A court divided by a net"], correct: "An ice surface divided into defensive, neutral, and attacking zones", explanation: "Blue lines divide an ice hockey rink into defensive, neutral, and attacking zones.", xp: 12 },
    ],
  },
  {
    id: "lacrosse",
    name: "Lacrosse",
    icon: "target",
    mark: "LX",
    color: "#8a584b",
    softColor: "#eee0dc",
    variants: ["Men’s Field", "Women’s Field", "Box"],
    positions: [
      { name: "Attack", group: "Offense", focus: "create offense below and around the goal" },
      { name: "Midfielder", group: "Two-Way", focus: "transition between offense and defense" },
      { name: "Defense", group: "Defense", focus: "protect the middle and disrupt dodges" },
      { name: "Goalie", group: "Goal", focus: "save shots and direct the clearing game" },
      { name: "Faceoff Specialist", group: "Specialist", focus: "win possession at the whistle" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "In men’s field lacrosse, how many players from each team are normally on the field, including the goalkeeper?", youngPrompt: "In men’s field lacrosse, how many players are on one team, including the goalie?", options: ["10 players per team", "10 players total between both teams", "6 players per team", "15 players per team"], correct: "10 players per team", explanation: "Men’s field lacrosse uses 10 players per team; women’s field, box, and Sixes lacrosse use different team sizes.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "How is a standard men’s field lacrosse game normally divided?", options: ["Four quarters", "Two 45-minute halves", "Three periods", "Nine innings"], correct: "Four quarters", explanation: "Men’s field lacrosse is played in four quarters; exact quarter length depends on the competition level.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "How much does one legal field lacrosse goal add to the score?", options: ["1 goal", "2 points", "3 points", "6 points"], correct: "1 goal", explanation: "Each legal goal adds 1 to the scoring team’s total.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a field lacrosse playing area?", options: ["A large field with one goal in each offensive end", "A diamond with four bases", "A pool with floating goals", "A court divided by a net"], correct: "A large field with one goal in each offensive end", explanation: "Field lacrosse uses a large rectangular field with a goal positioned in each offensive end.", xp: 12 },
    ],
  },
  {
    id: "rugby",
    name: "Rugby",
    icon: "rugby",
    mark: "RG",
    color: "#6d7044",
    softColor: "#e7e7d8",
    variants: ["Union", "League", "Sevens", "Women’s", "Men’s"],
    positions: [
      { name: "Prop", group: "Forwards", focus: "stabilize the scrum and win contact" },
      { name: "Hooker", group: "Forwards", focus: "throw at lineouts and connect the front row" },
      { name: "Lock", group: "Forwards", focus: "provide power and contest lineouts" },
      { name: "Flanker", group: "Forwards", focus: "pressure the breakdown and cover space" },
      { name: "Scrum-half", group: "Backs", focus: "distribute quickly and control tempo" },
      { name: "Fly-half", group: "Backs", focus: "direct shape and choose territory or attack" },
      { name: "Center", group: "Backs", focus: "break the line and organize midfield defense" },
      { name: "Wing", group: "Backs", focus: "finish space and defend the edge" },
      { name: "Fullback", group: "Backs", focus: "cover kicks and counterattack" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "In rugby union, how many players from each team are normally on the field?", youngPrompt: "How many players are on one rugby union team during play?", options: ["15 players per team", "15 players total between both teams", "13 players per team", "7 players per team"], correct: "15 players per team", explanation: "Rugby union uses 15 players per team; rugby league uses 13 and rugby sevens uses 7.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "How is a standard adult rugby union match normally divided?", options: ["Two 40-minute halves", "Four 15-minute quarters", "Three 20-minute periods", "Nine innings"], correct: "Two 40-minute halves", explanation: "A standard adult rugby union match has two 40-minute halves.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "How many points is a try worth in rugby union?", options: ["5 points", "4 points", "3 points", "6 points"], correct: "5 points", explanation: "A try is worth 5 points in rugby union; rugby league uses a different value.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a rugby union pitch?", options: ["A rectangular pitch with an in-goal area beyond each goal line", "A diamond with four bases", "A court with two baskets", "An ice rink divided by blue lines"], correct: "A rectangular pitch with an in-goal area beyond each goal line", explanation: "A rugby union pitch is rectangular and includes an in-goal area beyond each goal line.", xp: 12 },
    ],
  },
  {
    id: "field-hockey",
    name: "Field Hockey",
    icon: "hockey-sticks",
    mark: "FH",
    color: "#94714a",
    softColor: "#eee5d8",
    variants: ["General", "Men’s", "Women’s"],
    positions: [
      { name: "Forward", group: "Attack", focus: "stretch the defense and create circle entries" },
      { name: "Midfielder", group: "Midfield", focus: "connect lines and manage transition" },
      { name: "Defender", group: "Defense", focus: "protect the circle and start possession" },
      { name: "Goalkeeper", group: "Goal", focus: "protect the goal and organize defenders" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "In standard outdoor field hockey, how many players from each team are normally on the field, including the goalkeeper?", youngPrompt: "How many players from one outdoor field hockey team are on the field, including the goalie?", options: ["11 players per team (22 players total)", "11 players total between both teams", "6 players per team", "15 players per team"], correct: "11 players per team (22 players total)", explanation: "Outdoor field hockey uses 11 players per team, including the goalkeeper, so two full teams total 22 players.", youngExplanation: "Each team uses 11 players, making 22 players total.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "How is a standard international outdoor field hockey match divided?", options: ["Four 15-minute quarters", "Two 45-minute halves", "Three 20-minute periods", "Nine innings"], correct: "Four 15-minute quarters", explanation: "International outdoor field hockey uses four 15-minute quarters.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "How much does one legal field hockey goal add to the score?", options: ["1 goal", "2 points", "3 points", "6 points"], correct: "1 goal", explanation: "Each legal goal adds 1 to the scoring team’s total.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which feature belongs to an outdoor field hockey pitch?", options: ["A shooting circle in front of each goal", "A diamond with four bases", "End zones behind uprights", "Blue lines dividing an ice surface"], correct: "A shooting circle in front of each goal", explanation: "An outdoor field hockey pitch has a shooting circle in front of each goal; attacking shots must meet the circle rules to count.", xp: 12 },
    ],
  },
  {
    id: "water-polo",
    name: "Water Polo",
    icon: "water-polo",
    mark: "WP",
    color: "#397a88",
    softColor: "#dcecef",
    variants: ["General", "Men’s", "Women’s"],
    positions: [
      { name: "Center", group: "Offense", focus: "establish position near the goal" },
      { name: "Driver", group: "Offense", focus: "create movement and attack open water" },
      { name: "Point", group: "Perimeter", focus: "organize the offense from the top" },
      { name: "Center Defender", group: "Defense", focus: "deny inside position without fouling" },
      { name: "Goalkeeper", group: "Goal", focus: "protect angles and direct the defense" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "At the start of a standard water polo match, how many players from each team are in the water, including the goalkeeper?", youngPrompt: "At the start of water polo, how many players from one team are in the pool, including the goalie?", options: ["7 players per team (14 players total)", "7 players total between both teams", "6 players per team", "11 players per team"], correct: "7 players per team (14 players total)", explanation: "Each team starts with 7 players in the water, one of whom is the goalkeeper; current rules can allow seven field players after the match begins.", youngExplanation: "Each team starts with 7 players in the pool.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "How is a standard water polo match divided?", options: ["Four quarters", "Two 45-minute halves", "Three periods", "Nine innings"], correct: "Four quarters", explanation: "Water polo uses four quarters, while exact quarter length can depend on the ruleset and competition level.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "How much does one legal water polo goal add to the score?", options: ["1 goal", "2 points", "3 points", "6 points"], correct: "1 goal", explanation: "Each legal goal adds 1 to the scoring team’s total.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a water polo playing area?", options: ["A marked pool with one goal at each end", "A diamond with four bases", "A turf pitch with shooting circles", "An ice rink divided by blue lines"], correct: "A marked pool with one goal at each end", explanation: "Water polo is played in a marked pool with a goal at each end.", xp: 12 },
    ],
  },
  {
    id: "cricket",
    name: "Cricket",
    icon: "cricket",
    mark: "CR",
    color: "#6f526f",
    softColor: "#eadfeb",
    variants: ["Test", "One Day", "T20", "Women’s", "Men’s"],
    positions: [
      { name: "Batter", group: "Batting", focus: "protect the wicket and score efficiently" },
      { name: "Fast Bowler", group: "Bowling", focus: "use pace, seam, and length to create chances" },
      { name: "Spin Bowler", group: "Bowling", focus: "use flight and turn to deceive the batter" },
      { name: "Wicketkeeper", group: "Fielding", focus: "collect deliveries and create dismissals" },
      { name: "Fielder", group: "Fielding", focus: "protect scoring areas and convert chances" },
      { name: "Captain", group: "Leadership", focus: "set fields and manage bowlers strategically" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the team", prompt: "How many players are named in each playing side for a standard cricket match?", youngPrompt: "How many players are on one cricket side?", options: ["11 players per side", "11 players total between both sides", "9 players per side", "15 players per side"], correct: "11 players per side", explanation: "A cricket match is played between two sides of 11 players each.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "Which statement correctly distinguishes the major cricket formats?", options: ["Tests can last up to five days; ODIs use 50 overs per side; T20s use 20 overs per side", "Every format lasts exactly 90 minutes", "Every format uses four quarters", "Tests, ODIs, and T20s all use exactly 20 overs"], correct: "Tests can last up to five days; ODIs use 50 overs per side; T20s use 20 overs per side", explanation: "Cricket’s structure depends on its format: Tests, One Day Internationals, and T20 matches use different innings and over limits.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "What is the standard boundary scoring in cricket?", options: ["4 runs if the ball reaches the boundary after touching the ground; 6 if it clears on the full", "Every boundary scores 1 run", "Every boundary scores 3 points", "Only running between wickets can score"], correct: "4 runs if the ball reaches the boundary after touching the ground; 6 if it clears on the full", explanation: "A grounded boundary scores 4 runs, while a ball clearing the boundary without touching the ground scores 6.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a cricket ground?", options: ["An oval field centered on a 22-yard pitch", "A diamond with four bases", "A court divided by a net", "A pool with floating goals"], correct: "An oval field centered on a 22-yard pitch", explanation: "Cricket is played on an oval field with a 22-yard pitch at its center.", xp: 12 },
    ],
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "tennis",
    mark: "TN",
    color: "#49a75e",
    softColor: "#ddf3e2",
    variants: ["Singles", "Doubles", "Youth", "Women’s", "Men’s"],
    pathLabel: "PLAY STYLE",
    pathQuestion: "How do you want to own the court?",
    pathNote: "Build court awareness through serving, returning, baseline patterns, net play, and doubles teamwork.",
    positions: [
      { name: "Singles Player", group: "Court Control", focus: "manage the full court and build points with purpose" },
      { name: "Server", group: "First Strike", focus: "use placement, spin, and the first ball to start the point" },
      { name: "Returner", group: "First Strike", focus: "read the serve and neutralize or attack the next ball" },
      { name: "Baseline Player", group: "Court Control", focus: "control depth, direction, and rally tolerance" },
      { name: "Net Player", group: "Front Court", focus: "close space and finish with smart positioning" },
      { name: "Doubles Partner", group: "Team Play", focus: "protect team spacing and communicate movement" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the match", prompt: "How many players compete on each side in tennis singles and doubles?", youngPrompt: "How many players are on each side in singles and doubles?", options: ["Singles: 1 per side; doubles: 2 per side", "Singles: 2 per side; doubles: 4 per side", "Every match uses 5 per side", "Both formats use 1 per side"], correct: "Singles: 1 per side; doubles: 2 per side", explanation: "Singles uses one player on each side of the net; doubles uses two players on each side.", youngExplanation: "Singles is one against one. Doubles is two against two.", xp: 10 },
      { id: "format", type: "choice", label: "Game structure", prompt: "Which order correctly shows how tennis scoring units build a match?", options: ["Points build games; games build sets; sets decide the match", "Sets build points; points build games", "Quarters build innings", "Goals build periods"], correct: "Points build games; games build sets; sets decide the match", explanation: "Players win points to win games, games to win sets, and enough sets to win the match.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "What is the usual point sequence within a standard tennis game?", options: ["Love, 15, 30, 40, game", "1, 2, 3, touchdown", "10, 20, 30, set", "Love, 10, 20, game"], correct: "Love, 15, 30, 40, game", explanation: "A standard game moves from love to 15, 30, and 40 before game, with deuce rules when both players reach 40.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a tennis court?", options: ["A rectangular court divided by a net with service boxes", "An oval track with lanes", "A pool divided by lane ropes", "A diamond with four bases"], correct: "A rectangular court divided by a net with service boxes", explanation: "Tennis uses a rectangular court divided by a net, with service boxes marking where serves must land.", xp: 12 },
    ],
  },
  {
    id: "track-field",
    name: "Track & Field",
    icon: "run-fast",
    mark: "TFD",
    color: "#e7654b",
    softColor: "#fde2db",
    variants: ["Youth", "High School", "College", "Olympic"],
    pathLabel: "EVENT",
    pathQuestion: "Which event feels like your challenge?",
    pathNote: "Explore speed, endurance, rhythm, jumping, throwing, and relay teamwork through event-specific decisions.",
    positions: [
      { name: "Sprinter", group: "Running", focus: "accelerate efficiently and hold form at top speed" },
      { name: "Distance Runner", group: "Running", focus: "manage pace, position, and energy across the race" },
      { name: "Hurdler", group: "Running", focus: "keep rhythm and clear barriers without losing speed" },
      { name: "Relay Runner", group: "Team Events", focus: "run the assigned leg and exchange the baton safely at speed" },
      { name: "Jumper", group: "Field Events", focus: "control the approach and convert speed into lift or distance" },
      { name: "Thrower", group: "Field Events", focus: "build balance, sequence power, and release safely" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the meet", prompt: "Which statement best describes participation in track and field?", youngPrompt: "How do athletes compete in track and field?", options: ["Athletes compete in individual events and can also form relay teams", "Every event uses 11 players at once", "Only teams can enter events", "Every athlete must do every event"], correct: "Athletes compete in individual events and can also form relay teams", explanation: "Most events are individual, while relays combine runners as a team.", youngExplanation: "Many events are one athlete at a time, and relays use a team.", xp: 10 },
      { id: "format", type: "choice", label: "Meet structure", prompt: "What happens at a track and field meet?", options: ["Multiple running, jumping, and throwing events take place", "One 90-minute match decides everything", "Teams play four quarters", "Athletes complete nine innings"], correct: "Multiple running, jumping, and throwing events take place", explanation: "A meet brings together separate track races and field events, often with qualifying rounds and finals.", xp: 10 },
      { id: "score", type: "choice", label: "Winning basics", prompt: "How are winners normally decided across track and field events?", options: ["Fastest time, greatest legal distance, or greatest legal height", "Most goals scored", "Fewest innings", "Longest time on the track"], correct: "Fastest time, greatest legal distance, or greatest legal height", explanation: "Races reward the fastest legal time; jumps and throws reward the greatest legal mark.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which description matches a typical track and field venue?", options: ["An oval running track surrounding areas for jumps and throws", "A court divided by a net", "A pool with starting blocks", "A rink divided by blue lines"], correct: "An oval running track surrounding areas for jumps and throws", explanation: "Most venues place an oval track around an infield containing jumping and throwing areas.", xp: 12 },
    ],
  },
  {
    id: "swimming",
    name: "Swimming",
    icon: "swim",
    mark: "SW",
    color: "#348dca",
    softColor: "#dceef9",
    variants: ["Youth", "High School", "College", "Olympic"],
    pathLabel: "STROKE",
    pathQuestion: "Which race do you want to master?",
    pathNote: "Learn starts, turns, pacing, stroke rules, and relay decisions across the major competitive strokes.",
    positions: [
      { name: "Freestyle", group: "Strokes", focus: "hold efficient body position, breathing, and race tempo" },
      { name: "Backstroke", group: "Strokes", focus: "track the lane, rotate efficiently, and time the finish" },
      { name: "Breaststroke", group: "Strokes", focus: "coordinate pull, breath, kick, and glide legally" },
      { name: "Butterfly", group: "Strokes", focus: "connect the body wave, pull, kick, and breath rhythm" },
      { name: "Individual Medley", group: "Multi-Stroke", focus: "manage all four strokes and legal transitions" },
      { name: "Relay Swimmer", group: "Team Events", focus: "time the exchange and execute the assigned leg" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the race", prompt: "Which statement is true about competitive swimming?", youngPrompt: "How do swimmers race?", options: ["Most races are individual; relays use teams of swimmers", "Every race has 11 swimmers per team in one lane", "All races are relays", "Two teams share one swimmer"], correct: "Most races are individual; relays use teams of swimmers", explanation: "Individual swimmers race in separate lanes, while relay teammates complete different legs in order.", youngExplanation: "Some races are one swimmer, and relays use a team.", xp: 10 },
      { id: "format", type: "choice", label: "Meet structure", prompt: "How are competitive swimming events commonly organized?", options: ["By stroke and distance, sometimes with heats and finals", "By quarters and touchdowns", "By innings and bases", "Every race uses the same stroke and distance"], correct: "By stroke and distance, sometimes with heats and finals", explanation: "Meets schedule races by stroke and distance, with some competitions advancing swimmers from heats to finals.", xp: 10 },
      { id: "score", type: "choice", label: "Winning basics", prompt: "What decides the winner of a swimming race?", options: ["The first legal finish with the fastest time", "The most goals", "The highest jump", "The swimmer with the most strokes"], correct: "The first legal finish with the fastest time", explanation: "The fastest swimmer who follows the stroke, turn, and finish rules wins the race.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which feature belongs in a competition pool?", options: ["Marked lanes with starting blocks at one end", "A center net and service boxes", "A diamond with bases", "An oval running track"], correct: "Marked lanes with starting blocks at one end", explanation: "Competition pools use marked lanes and starting blocks, with walls used for turns and finishes.", xp: 12 },
    ],
  },
  {
    id: "gymnastics",
    name: "Gymnastics",
    icon: "gymnastics",
    mark: "GY",
    color: "#9557c7",
    softColor: "#eee0f8",
    variants: ["General", "Women’s Artistic", "Men’s Artistic", "Youth"],
    pathLabel: "APPARATUS",
    pathQuestion: "Where do you want to perform?",
    pathNote: "Build body control, safe technique, routine awareness, and confident decisions across major apparatus events.",
    positions: [
      { name: "Floor Exercise", group: "Performance", focus: "connect tumbling, control, rhythm, and safe landings" },
      { name: "Vault", group: "Power", focus: "build a consistent approach, block, flight, and landing" },
      { name: "Uneven Bars", group: "Swing", focus: "connect swing shapes, releases, and safe transitions" },
      { name: "Balance Beam", group: "Precision", focus: "control alignment, confidence, and landing space" },
      { name: "Still Rings", group: "Strength", focus: "show strength positions, swing control, and a stable landing" },
      { name: "Parallel Bars", group: "Swing", focus: "manage support, swing rhythm, transitions, and dismount" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the meet", prompt: "Which statement best describes gymnastics competition?", youngPrompt: "How can gymnasts compete?", options: ["Gymnasts perform individually, and their scores can also count toward a team", "Eleven gymnasts perform on one apparatus at once", "Only teams receive scores", "Every event is a head-to-head race"], correct: "Gymnasts perform individually, and their scores can also count toward a team", explanation: "Each gymnast performs a routine, while selected individual scores can combine for a team result.", youngExplanation: "One gymnast performs at a time, and scores can help the team.", xp: 10 },
      { id: "format", type: "choice", label: "Meet structure", prompt: "How is an artistic gymnastics meet organized?", options: ["Gymnasts perform routines on different apparatus", "One 90-minute field match", "Four quarters with a ball", "Nine innings"], correct: "Gymnasts perform routines on different apparatus", explanation: "Artistic gymnastics uses separate apparatus events, and the apparatus differ across women’s and men’s programs.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "What two major ideas contribute to an elite gymnastics routine score?", options: ["Difficulty and execution", "Goals and assists", "Runs and wickets", "Speed and possession only"], correct: "Difficulty and execution", explanation: "Judges evaluate what skills were attempted and how accurately the routine was performed, including deductions.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Which item is a gymnastics apparatus?", options: ["Balance beam", "Pitcher’s mound", "Goalpost", "Lane rope"], correct: "Balance beam", explanation: "The balance beam is one of the apparatus used in women’s artistic gymnastics.", xp: 12 },
    ],
  },
  {
    id: "pickleball",
    name: "Pickleball",
    icon: "table-tennis",
    mark: "PB",
    color: "#5e9c45",
    softColor: "#e3f2dc",
    variants: ["General"],
    pathLabel: "PLAY STYLE",
    pathQuestion: "Where do you want to own the rally?",
    pathNote: "Learn serving, returning, kitchen play, court movement, and doubles teamwork on the pickleball court.",
    positions: [
      { name: "Server", group: "First Ball", focus: "start the point with a legal serve and purposeful placement" },
      { name: "Returner", group: "First Ball", focus: "return deep and move into strong court position" },
      { name: "Baseline Player", group: "Court Zones", focus: "build the rally before moving forward" },
      { name: "Kitchen Player", group: "Court Zones", focus: "control the non-volley line with patience and soft shots" },
      { name: "Doubles Partner", group: "Team Play", focus: "move with a partner and protect the middle" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the match", prompt: "How many players are on each side in pickleball singles and doubles?", youngPrompt: "How many players play on each side?", options: ["Singles: 1; doubles: 2", "Singles: 2; doubles: 4", "Both always use 5", "Both always use 1"], correct: "Singles: 1; doubles: 2", explanation: "Singles uses one player per side and doubles uses two players per side.", youngExplanation: "Singles is one against one. Doubles is two against two.", xp: 10 },
      { id: "format", type: "choice", label: "Start the rally", prompt: "Where must a pickleball serve travel?", youngPrompt: "Where should the serve go?", options: ["Diagonally into the opposite service court", "Straight into the kitchen", "Over the back fence", "Into either sideline"], correct: "Diagonally into the opposite service court", explanation: "The serve travels crosscourt into the opponent’s service court and must clear the non-volley zone.", youngExplanation: "Serve across the net into the opposite box.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "What is a common winning score for a pickleball game?", youngPrompt: "Many pickleball games are played to what score?", options: ["11, win by 2", "6, win by 1", "21 with no lead needed", "100"], correct: "11, win by 2", explanation: "Traditional games are commonly played to 11 and must be won by two points.", youngExplanation: "A common game goes to 11, and the winner leads by 2.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the court", prompt: "What is the area next to the net called?", youngPrompt: "What is the zone by the net called?", options: ["The non-volley zone or kitchen", "The end zone", "The penalty box", "The mound"], correct: "The non-volley zone or kitchen", explanation: "The seven-foot area on both sides of the net is the non-volley zone, often called the kitchen.", youngExplanation: "The zone by the net is called the kitchen.", xp: 12 },
    ],
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "badminton",
    mark: "BD",
    color: "#4979bd",
    softColor: "#e0eafb",
    variants: ["General"],
    pathLabel: "PLAY STYLE",
    pathQuestion: "How do you want to control the court?",
    pathNote: "Build racket control, movement, serving, front-court reactions, and rear-court attack with the shuttle.",
    positions: [
      { name: "Singles Player", group: "Court Control", focus: "cover the full court and move the opponent" },
      { name: "Server", group: "First Shot", focus: "start the rally legally with accurate placement" },
      { name: "Receiver", group: "First Shot", focus: "read the serve and take control of the next shot" },
      { name: "Front-Court Player", group: "Doubles", focus: "intercept the shuttle and protect the net" },
      { name: "Rear-Court Player", group: "Doubles", focus: "create pressure with clears, drops, and smashes" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the match", prompt: "How many players are on each side in badminton singles and doubles?", youngPrompt: "How many players play on each side?", options: ["Singles: 1; doubles: 2", "Singles: 2; doubles: 4", "Both use 5", "Both use 11"], correct: "Singles: 1; doubles: 2", explanation: "Singles uses one player per side and doubles uses two.", youngExplanation: "Singles is one against one. Doubles is two against two.", xp: 10 },
      { id: "format", type: "choice", label: "Match structure", prompt: "How is a standard badminton match normally decided?", youngPrompt: "How many games can decide a badminton match?", options: ["Best of 3 games", "Four quarters", "Nine innings", "One 90-minute game"], correct: "Best of 3 games", explanation: "The first side to win two games wins a standard best-of-three match.", youngExplanation: "Win two games to win the match.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "How many points normally win a badminton game before deuce rules?", youngPrompt: "A badminton game normally goes to what score?", options: ["21", "11", "6", "40"], correct: "21", explanation: "Games use rally scoring to 21; at 20-all a side must lead by two, up to a 30-point cap.", youngExplanation: "A game normally goes to 21 points.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the court", prompt: "What do players hit across the net in badminton?", youngPrompt: "What flies across the badminton net?", options: ["A shuttlecock", "A baseball", "A puck", "A football"], correct: "A shuttlecock", explanation: "Badminton uses a feathered or synthetic shuttlecock rather than a ball.", youngExplanation: "Players hit a shuttlecock across the net.", xp: 12 },
    ],
  },
  {
    id: "golf",
    name: "Golf",
    icon: "golf",
    mark: "GF",
    color: "#397957",
    softColor: "#deeee5",
    variants: ["General"],
    pathLabel: "SHOT",
    pathQuestion: "Which part of the hole will you master?",
    pathNote: "Learn safe course habits, club choices, shot planning, short game, putting, and honest scoring.",
    positions: [
      { name: "Tee Shot", group: "Long Game", focus: "choose a safe target and start the hole in play" },
      { name: "Approach Shot", group: "Long Game", focus: "match club, distance, lie, and safe landing area" },
      { name: "Short Game", group: "Scoring Zone", focus: "control chips and pitches near the green" },
      { name: "Putter", group: "Scoring Zone", focus: "read line and speed to roll the ball toward the hole" },
      { name: "Course Manager", group: "Strategy", focus: "choose smart targets and avoid unnecessary risk" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the round", prompt: "How can golfers compete?", youngPrompt: "Can golf be played alone or with others?", options: ["Individually or in team formats", "Only with 11 players", "Only in pairs", "Only as one giant team"], correct: "Individually or in team formats", explanation: "Golf includes individual stroke or match play and several team formats.", youngExplanation: "Golfers can compete alone or as part of a team.", xp: 10 },
      { id: "format", type: "choice", label: "Round structure", prompt: "How many holes are in a traditional full round of golf?", youngPrompt: "How many holes are in a full round?", options: ["18", "4", "9 only", "21"], correct: "18", explanation: "A traditional full round contains 18 holes, though shorter rounds are also played.", youngExplanation: "A full round usually has 18 holes.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "In stroke play, what is the main scoring goal?", youngPrompt: "Do golfers want more strokes or fewer strokes?", options: ["Use the fewest strokes", "Use the most strokes", "Score the most touchdowns", "Finish with the most penalties"], correct: "Use the fewest strokes", explanation: "In stroke play, the player with the lowest total number of strokes wins.", youngExplanation: "Fewer strokes make the better score.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the hole", prompt: "Where does each golf hole begin?", youngPrompt: "Where do golfers start a hole?", options: ["The teeing area", "The putting cup", "The bunker", "The clubhouse"], correct: "The teeing area", explanation: "Each hole starts with a stroke from the teeing area and ends when the ball is holed.", youngExplanation: "A hole starts at the teeing area.", xp: 12 },
    ],
  },
  {
    id: "cycling",
    name: "Cycling",
    icon: "bike",
    mark: "CY",
    color: "#d46c32",
    softColor: "#f8e5d9",
    variants: ["General"],
    pathLabel: "DISCIPLINE",
    pathQuestion: "Where do you want to ride?",
    pathNote: "Explore road, track, mountain bike, BMX, pacing, bike control, race awareness, and helmet-first safety.",
    positions: [
      { name: "Road Rider", group: "Road", focus: "manage pace, position, corners, and changing terrain" },
      { name: "Track Sprinter", group: "Track", focus: "use timing, acceleration, and line choice on the velodrome" },
      { name: "Pursuit Rider", group: "Track", focus: "hold a sustainable pace and smooth racing line" },
      { name: "Mountain Biker", group: "Off-Road", focus: "read terrain and control braking, balance, and traction" },
      { name: "BMX Racer", group: "BMX", focus: "launch from the gate and choose fast safe lines" },
      { name: "Para Cyclist", group: "Adaptive", focus: "use the right cycle and race plan for the classification" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the race", prompt: "Which statement is true about cycling competition?", youngPrompt: "Can cyclists race alone and on teams?", options: ["Riders can compete individually and as teammates", "Every race uses exactly 11 riders", "Cycling has no team events", "Only two riders may enter"], correct: "Riders can compete individually and as teammates", explanation: "Cycling includes individual races, team events, and team-supported individual results.", youngExplanation: "Cyclists can race alone or work with teammates.", xp: 10 },
      { id: "format", type: "choice", label: "Sport structure", prompt: "Which list contains major cycling disciplines?", youngPrompt: "Which are types of bike racing?", options: ["Road, track, mountain bike, and BMX", "Swimming, vault, and hockey", "Only road racing", "Baseball and softball"], correct: "Road, track, mountain bike, and BMX", explanation: "The UCI oversees road, track, mountain bike, BMX, cyclo-cross, trials, indoor cycling, and other cycling disciplines.", youngExplanation: "Road, track, mountain bike, and BMX are all cycling sports.", xp: 10 },
      { id: "score", type: "choice", label: "Winning basics", prompt: "What usually decides a cycling race winner?", youngPrompt: "Who usually wins a bike race?", options: ["The rider or team that meets the event goal fastest", "The rider with the most fouls", "The tallest rider", "The rider with the heaviest bike"], correct: "The rider or team that meets the event goal fastest", explanation: "Most races reward the fastest finish or time, while some events use points or elimination rules.", youngExplanation: "Most races reward the fastest legal ride.", xp: 10 },
      { id: "field", type: "hotspot", label: "Safety first", prompt: "Which item protects a cyclist’s head?", youngPrompt: "What should protect a rider’s head?", options: ["A properly fitted helmet", "A wristband", "A water bottle", "A race number"], correct: "A properly fitted helmet", explanation: "A properly fitted helmet is essential protective equipment for riding and racing.", youngExplanation: "Wear a helmet that fits correctly.", xp: 12 },
    ],
  },
  {
    id: "mma",
    name: "Mixed Martial Arts",
    icon: "mixed-martial-arts",
    mark: "MMA",
    color: "#9b4d55",
    softColor: "#f3dfe2",
    variants: ["General"],
    pathLabel: "SKILL",
    pathQuestion: "Which part of the contest will you study?",
    pathNote: "Learn the rules, scoring, distance, defense, and referee safety of regulated MMA. Physical techniques belong with qualified coaching and proper equipment.",
    positions: [
      { name: "Striker", group: "Standing", focus: "manage distance and use legal accurate offense with defense" },
      { name: "Clinch Fighter", group: "Standing", focus: "control position safely at close range" },
      { name: "Wrestler", group: "Transitions", focus: "change levels, control balance, and secure position" },
      { name: "Grappler", group: "Ground", focus: "improve position while protecting against submissions" },
      { name: "Defensive Specialist", group: "Safety", focus: "recognize danger, defend intelligently, and follow the referee" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the bout", prompt: "How many competitors are active in a standard MMA bout?", youngPrompt: "How many athletes compete in one MMA bout?", options: ["Two", "Five per team", "Eleven per team", "Three at once"], correct: "Two", explanation: "A standard bout matches two regulated competitors under a referee’s supervision.", youngExplanation: "Two trained athletes compete while a referee watches.", xp: 10 },
      { id: "format", type: "choice", label: "Bout structure", prompt: "How long is a professional Unified Rules MMA round?", youngPrompt: "How long is one professional MMA round?", options: ["5 minutes", "15 minutes", "One hour", "30 seconds"], correct: "5 minutes", explanation: "Professional rounds last five minutes with a one-minute rest between rounds.", youngExplanation: "One professional round lasts five minutes.", xp: 10 },
      { id: "score", type: "choice", label: "Scoring basics", prompt: "What should judges evaluate first under the Unified Rules?", youngPrompt: "What do MMA judges look for most?", options: ["Effective striking and grappling", "Costume color", "Crowd noise", "Height alone"], correct: "Effective striking and grappling", explanation: "Judges prioritize effective striking and grappling, followed by effective aggressiveness and fighting-area control when needed.", youngExplanation: "Judges look for effective, legal striking and grappling.", xp: 10 },
      { id: "field", type: "hotspot", label: "Safety first", prompt: "Who is authorized to stop an MMA contest for safety?", youngPrompt: "Who can stop the bout to protect an athlete?", options: ["The referee", "A spectator", "The scorekeeper alone", "Another athlete"], correct: "The referee", explanation: "The referee is the sole arbiter of the bout and may stop it to protect a competitor.", youngExplanation: "The referee can stop the bout to keep athletes safe.", xp: 12 },
    ],
  },
  {
    id: "wrestling",
    name: "Wrestling",
    icon: "human-handsdown",
    mark: "WR",
    color: "#8057b4",
    softColor: "#eadff5",
    variants: ["General"],
    pathLabel: "STYLE / POSITION",
    pathQuestion: "Which wrestling room will you enter?",
    pathNote: "Explore freestyle, Greco-Roman, folkstyle, takedowns, control, escapes, and safe mat awareness.",
    positions: [
      { name: "Freestyle Wrestler", group: "Styles", focus: "attack legs, control positions, and expose the opponent’s back" },
      { name: "Greco-Roman Wrestler", group: "Styles", focus: "use upper-body control and legal throws without leg attacks" },
      { name: "Folkstyle Wrestler", group: "Styles", focus: "earn and maintain control while building toward a pin" },
      { name: "Neutral Position", group: "Match Position", focus: "create angles and secure a controlled takedown" },
      { name: "Top Position", group: "Match Position", focus: "maintain control and turn the opponent safely" },
      { name: "Bottom Position", group: "Match Position", focus: "build a base and earn an escape or reversal" },
    ],
    introQuestions: [
      { id: "team-size", type: "choice", label: "Know the bout", prompt: "How many wrestlers are active in one standard bout?", youngPrompt: "How many wrestlers compete in one match?", options: ["Two", "Five per team", "Eleven per team", "Four at once"], correct: "Two", explanation: "A wrestling bout matches two athletes in the same weight category.", youngExplanation: "Two wrestlers compete in one match.", xp: 10 },
      { id: "format", type: "choice", label: "Know the styles", prompt: "What is a key difference between freestyle and Greco-Roman wrestling?", youngPrompt: "Which style does not allow leg attacks?", options: ["Greco-Roman does not allow active leg attacks", "Freestyle has no takedowns", "Both ban all throws", "Greco-Roman uses a ball"], correct: "Greco-Roman does not allow active leg attacks", explanation: "Freestyle allows attacks involving the legs; Greco-Roman action is limited to the upper body and arms.", youngExplanation: "Greco-Roman wrestlers use upper-body attacks, not leg attacks.", xp: 10 },
      { id: "score", type: "choice", label: "Winning basics", prompt: "What immediately wins a wrestling bout by fall?", youngPrompt: "What is another name for winning by a fall?", options: ["Pinning both shoulders to the mat", "Stepping out once", "Scoring one point", "Calling timeout"], correct: "Pinning both shoulders to the mat", explanation: "Holding both shoulder blades to the mat for the required confirmation wins by fall, commonly called a pin.", youngExplanation: "A pin wins the match by fall.", xp: 10 },
      { id: "field", type: "hotspot", label: "Know the arena", prompt: "Where does a wrestling bout take place?", youngPrompt: "Where do wrestlers compete?", options: ["On a marked wrestling mat", "In a swimming lane", "On a baseball diamond", "Across a tennis net"], correct: "On a marked wrestling mat", explanation: "Wrestlers compete inside a marked circular area on a padded mat.", youngExplanation: "Wrestlers compete on a padded mat.", xp: 12 },
    ],
  },
];

const remediationPlayers: Challenge = {
  id: "fb-remediate-players",
  conceptId: "fb-team-size",
  type: "scenario",
  label: "Second look",
  prompt: "Your offense has a QB, RB, TE, five linemen, and three wide receivers. How many players are in the unit?",
  youngPrompt: "Count the players: 1 quarterback + 1 runner + 1 tight end + 5 linemen + 3 receivers. How many?",
  options: ["10", "11", "12", "13"],
  correct: "11",
  explanation: "Add the full unit: 1 + 1 + 1 + 5 + 3 = 11. You recovered the concept.",
  youngExplanation: "All those players add up to 11.",
  xp: 12,
};

export const FOOTBALL_MODULES: LearningModule[] = [
  {
    id: "fb-fundamentals-field",
    sportId: "football",
    level: 0,
    pathway: "general",
    title: "Meet the Field",
    description: "Players, field layout, game clock, and the shape of a football game.",
    estimatedMinutes: 4,
    challenges: [
      {
        id: "fb-field-players",
        conceptId: "fb-team-size",
        type: "choice",
        label: "Know the unit",
        prompt: "How many players does one football team normally have on the field at a time?",
        youngPrompt: "A football team puts how many players on the field?",
        options: ["9", "10", "11", "12"],
        correct: "11",
        explanation: "A complete offensive, defensive, or special-teams unit normally has 11 players on the field.",
        youngExplanation: "Each team uses 11 players at one time.",
        hint: "Think of one complete offensive unit.",
        youngHint: "Think of the number just after 10.",
        xp: 10,
        remediation: remediationPlayers,
      },
      {
        id: "fb-field-zones",
        conceptId: "fb-field-layout",
        type: "hotspot",
        label: "Tap the field",
        prompt: "Your team must cross which line to score a touchdown?",
        youngPrompt: "Which line must the ball cross for a touchdown?",
        options: ["Sideline", "Goal line", "50-yard line", "Hash mark"],
        correct: "Goal line",
        explanation: "The ball must break the plane of the opponent’s goal line while controlled by a player.",
        youngExplanation: "The ball must cross the other team’s goal line for a touchdown.",
        xp: 12,
      },
      {
        id: "fb-field-quarters",
        conceptId: "fb-game-clock",
        type: "choice",
        label: "Game clock",
        prompt: "How is a regulation football game divided?",
        youngPrompt: "A football game is split into how many quarters?",
        options: ["Two halves only", "Three periods", "Four quarters", "Nine innings"],
        correct: "Four quarters",
        explanation: "Football uses four quarters. Halftime separates the second and third quarters.",
        youngExplanation: "A football game has four quarters.",
        xp: 10,
      },
      {
        id: "fb-field-lines",
        conceptId: "fb-line-of-scrimmage",
        type: "truefalse",
        label: "True or false",
        prompt: "The line of scrimmage is the imaginary line running through the ball before the snap.",
        youngPrompt: "True or false: Before the play, the line through the ball is called the line of scrimmage.",
        options: ["True", "False"],
        correct: "True",
        explanation: "That line separates the two teams before the play and anchors every formation.",
        youngExplanation: "The line of scrimmage separates the teams before the play starts.",
        xp: 10,
      },
      {
        id: "fb-field-start",
        conceptId: "fb-start-play",
        type: "ordering",
        label: "Put it in order",
        prompt: "Arrange the basic start of an offensive play.",
        youngPrompt: "What is the right order for starting a play?",
        options: ["Players align", "Quarterback calls cadence", "Center snaps", "Play unfolds"],
        correct: ["Players align", "Quarterback calls cadence", "Center snaps", "Play unfolds"],
        explanation: "Alignment establishes legal positions, the cadence coordinates timing, and the snap makes the ball live.",
        youngExplanation: "Players line up, the quarterback calls the signal, and the center snaps the ball.",
        xp: 15,
      },
      {
        id: "fb-field-offense",
        conceptId: "fb-offense-defense",
        type: "choice",
        label: "Who has the ball?",
        prompt: "Which unit begins a normal play in possession of the ball?",
        youngPrompt: "Which group starts the play with the ball?",
        options: ["Offense", "Defense", "Officials", "Coverage team"],
        correct: "Offense",
        explanation: "The offense possesses the ball and tries to advance it; the defense tries to stop or take it away.",
        youngExplanation: "The offense starts with the ball and tries to move it down the field.",
        xp: 10,
      },
      {
        id: "fb-field-equipment",
        conceptId: "fb-equipment",
        type: "multi",
        label: "Select all that apply",
        prompt: "Which pieces are standard protective equipment in tackle football?",
        youngPrompt: "Which gear helps protect a tackle football player? Choose all that apply.",
        options: ["Helmet", "Shoulder pads", "Shin guards", "Mouthguard"],
        correct: ["Helmet", "Shoulder pads", "Mouthguard"],
        explanation: "Helmets, shoulder pads, and mouthguards are standard. Shin guards belong to sports such as soccer.",
        youngExplanation: "Players use helmets, shoulder pads, and mouthguards for protection.",
        xp: 15,
      },
      {
        id: "fb-field-end",
        conceptId: "fb-game-end",
        type: "scenario",
        label: "What happens next?",
        prompt: "The fourth-quarter clock reaches 0:00 and one team is ahead. What normally happens?",
        youngPrompt: "The clock reaches 0:00 and one team is ahead. What usually happens?",
        options: ["The game ends", "Every game goes to overtime", "A fifth quarter begins", "The score resets"],
        correct: "The game ends",
        explanation: "If the final period ends without a tie requiring overtime, the team ahead wins.",
        youngExplanation: "When time runs out and one team is ahead, the game ends.",
        xp: 12,
      },
    ],
  },
  {
    id: "fb-fundamentals-score",
    sportId: "football",
    level: 0,
    pathway: "general",
    title: "Score & Possession",
    description: "Downs, first downs, scoring, turnovers, and how teams earn another series.",
    estimatedMinutes: 5,
    challenges: [
      {
        id: "fb-score-touchdown",
        conceptId: "fb-scoring",
        type: "choice",
        label: "Points on the board",
        prompt: "How many points is a touchdown worth before the try?",
        options: ["3", "6", "7", "8"],
        correct: "6",
        explanation: "A touchdown is worth six points. The offense then attempts a one- or two-point try.",
        xp: 10,
      },
      {
        id: "fb-score-downs",
        conceptId: "fb-downs",
        type: "choice",
        label: "Move the chains",
        prompt: "How many downs does an offense normally get to gain 10 yards?",
        options: ["Three", "Four", "Five", "Unlimited"],
        correct: "Four",
        explanation: "The offense receives four downs. Gaining 10 yards earns a fresh set of downs.",
        xp: 10,
      },
      {
        id: "fb-score-first-down",
        conceptId: "fb-downs",
        type: "scenario",
        label: "Read the situation",
        prompt: "It is 2nd & 6 and the offense gains 8 yards. What is the next down?",
        options: ["3rd & 2", "1st & 10", "4th & 6", "Turnover"],
        correct: "1st & 10",
        explanation: "The offense gained more than the six yards needed, so the chains reset to 1st & 10.",
        xp: 12,
      },
      {
        id: "fb-score-field-goal",
        conceptId: "fb-scoring",
        type: "choice",
        label: "Take the points",
        prompt: "A successful field goal is worth how many points?",
        options: ["1", "2", "3", "6"],
        correct: "3",
        explanation: "A field goal is worth three points and is often attempted on fourth down within range.",
        xp: 10,
      },
      {
        id: "fb-score-turnover",
        conceptId: "fb-turnovers",
        type: "multi",
        label: "Select all that apply",
        prompt: "Which plays can immediately give the defense possession?",
        options: ["Interception", "Recovered fumble", "Incomplete pass", "Touchback after every play"],
        correct: ["Interception", "Recovered fumble"],
        explanation: "An interception or a defensive fumble recovery changes possession immediately.",
        xp: 15,
      },
      {
        id: "fb-score-punt",
        conceptId: "fb-field-position",
        type: "scenario",
        label: "Make the call",
        prompt: "It is 4th & 12 near your own end zone. Why might the offense punt?",
        options: ["To improve field position", "To score six points", "To stop the game", "To keep the same possession"],
        correct: "To improve field position",
        explanation: "A punt gives up possession but pushes the opponent farther from the end zone.",
        xp: 12,
      },
      {
        id: "fb-score-safety",
        conceptId: "fb-scoring",
        type: "truefalse",
        label: "True or false",
        prompt: "A safety is worth two points to the defending team.",
        options: ["True", "False"],
        correct: "True",
        explanation: "A safety usually occurs when the offense is responsible for the ball becoming dead in its own end zone.",
        xp: 10,
      },
      {
        id: "fb-score-drive",
        conceptId: "fb-drive",
        type: "ordering",
        label: "Build the drive",
        prompt: "Put this successful scoring drive in order.",
        options: ["Gain a first down", "Cross midfield", "Reach the red zone", "Score a touchdown"],
        correct: ["Gain a first down", "Cross midfield", "Reach the red zone", "Score a touchdown"],
        explanation: "Drives are built by extending possession, winning field position, entering scoring range, and finishing.",
        xp: 15,
      },
    ],
  },
  {
    id: "fb-rookie-units",
    sportId: "football",
    level: 1,
    pathway: "general",
    title: "Three Units, One Team",
    description: "Recognize offensive, defensive, and special-teams responsibilities.",
    estimatedMinutes: 5,
    challenges: [
      {
        id: "fb-unit-qb",
        conceptId: "fb-positions",
        type: "choice",
        label: "Identify the role",
        prompt: "Which player usually receives the snap and begins the offense’s decision?",
        options: ["Quarterback", "Safety", "Punter", "Defensive end"],
        correct: "Quarterback",
        explanation: "The quarterback receives most snaps, then hands off, passes, or runs based on the play and read.",
        xp: 10,
      },
      {
        id: "fb-unit-line",
        conceptId: "fb-positions",
        type: "multi",
        label: "Select all that apply",
        prompt: "Which jobs belong to the offensive line?",
        options: ["Protect the passer", "Create run lanes", "Cover wide receivers", "Handle protection calls"],
        correct: ["Protect the passer", "Create run lanes", "Handle protection calls"],
        explanation: "The line protects, blocks for the run, and communicates how the unit will account for defenders.",
        xp: 15,
      },
      {
        id: "fb-unit-secondary",
        conceptId: "fb-defense-levels",
        type: "choice",
        label: "Know the defense",
        prompt: "Cornerbacks and safeties make up which level of the defense?",
        options: ["Secondary", "Offensive line", "Backfield offense", "Specialists"],
        correct: "Secondary",
        explanation: "The secondary defends routes, supports the run, and protects deep space.",
        xp: 10,
      },
      {
        id: "fb-unit-lb",
        conceptId: "fb-defense-reads",
        type: "scenario",
        label: "What’s your read?",
        prompt: "A linebacker sees the offensive line fire forward low. What should that suggest first?",
        options: ["Run action", "Punt", "Field goal", "End of game"],
        correct: "Run action",
        explanation: "Low, forward movement from the line is a primary run key. The linebacker should prepare to fit a gap.",
        xp: 15,
      },
      {
        id: "fb-unit-kick",
        conceptId: "fb-special-teams",
        type: "multi",
        label: "Special teams check",
        prompt: "Which plays use special teams?",
        options: ["Kickoff", "Punt", "Field goal", "Routine first-down handoff"],
        correct: ["Kickoff", "Punt", "Field goal"],
        explanation: "Special teams handles kicking plays and the returns or blocks attached to them.",
        xp: 15,
      },
      {
        id: "fb-unit-balance",
        conceptId: "fb-team-phases",
        type: "ordering",
        label: "Change of possession",
        prompt: "After your defense forces a punt, arrange the next phases.",
        options: ["Punt return unit enters", "Returner secures the ball", "Offense takes the field", "New drive begins"],
        correct: ["Punt return unit enters", "Returner secures the ball", "Offense takes the field", "New drive begins"],
        explanation: "The return phase handles the punt, then the offense begins a new possession where the return ends.",
        xp: 15,
      },
    ],
  },
];

const CENTER_CHALLENGES: Challenge[] = [
  {
    id: "center-front",
    conceptId: "center-front-id",
    type: "scenario",
    label: "Film room",
    prompt: "You are the center. A nose tackle shades your right shoulder and a linebacker walks into the left A-gap. What should you identify first?",
    options: ["The defensive front and protection point", "The crowd noise", "The receiver split", "The game uniform"],
    correct: "The defensive front and protection point",
    explanation: "The center must identify immediate threats and help set how the line will account for the front.",
    xp: 15,
  },
  {
    id: "center-snap",
    conceptId: "center-snap",
    type: "ordering",
    label: "Operation order",
    prompt: "Arrange the center’s pre-snap process.",
    options: ["Identify the front", "Communicate the call", "Set the grip", "Snap on cadence"],
    correct: ["Identify the front", "Communicate the call", "Set the grip", "Snap on cadence"],
    explanation: "Recognition and communication come first; the snap then starts the physical assignment.",
    xp: 15,
  },
  {
    id: "center-agap",
    conceptId: "center-gaps",
    type: "choice",
    label: "Know the gap",
    prompt: "Where is the A-gap?",
    options: ["Between center and guard", "Outside the tight end", "Between guard and tackle", "Behind the safety"],
    correct: "Between center and guard",
    explanation: "The A-gaps are the two interior spaces immediately beside the center.",
    xp: 10,
  },
  {
    id: "center-double",
    conceptId: "center-combo",
    type: "scenario",
    label: "Make the call",
    prompt: "On an inside run, you and the guard are responsible for a defensive tackle before one climbs to a linebacker. What is this?",
    options: ["Combination block", "Solo route", "Punt protection", "Man coverage"],
    correct: "Combination block",
    explanation: "Two linemen create movement together, then one comes off to the second-level defender.",
    xp: 15,
  },
  {
    id: "center-pass",
    conceptId: "center-protection",
    type: "multi",
    label: "Protection scan",
    prompt: "Which threats should a center communicate before a pass play?",
    options: ["Interior rushers", "Possible blitzers", "Protection direction", "The halftime score only"],
    correct: ["Interior rushers", "Possible blitzers", "Protection direction"],
    explanation: "Good protection begins with a shared picture of the front, possible pressure, and the line’s direction.",
    xp: 15,
  },
  {
    id: "center-finish",
    conceptId: "center-technique",
    type: "truefalse",
    label: "True or false",
    prompt: "A clean snap matters, but the center’s assignment continues immediately after the ball leaves the hand.",
    options: ["True", "False"],
    correct: "True",
    explanation: "The center must transition from snapping to blocking without losing leverage or timing.",
    xp: 10,
  },
];

const POSITION_READS: Record<string, Record<string, string>> = {
  football: {
    Quarterback: "the safety shell, box count, and post-snap rotation",
    "Running Back": "the defensive front, linebacker flow, and leverage of the blocks",
    Fullback: "the point of attack and the first unblocked dangerous defender",
    "Wide Receiver": "cornerback cushion, inside-out leverage, and nearby safety help",
    "Tight End": "the end defender, second-level leverage, and whether the assignment becomes route or protection",
    "Left Tackle": "the edge rusher's width, stance, and first two steps",
    "Left Guard": "the defensive tackle's shade and possible pressure through the inside gap",
    Center: "the front structure, both A-gaps, and second-level pressure threats",
    "Right Guard": "the defensive tackle's shade and possible pressure through the inside gap",
    "Right Tackle": "the edge rusher's alignment, power angle, and inside counter threat",
    "Defensive Tackle": "the near lineman's first step and the movement of the center-guard triangle",
    "Defensive End": "the tackle or tight end's release and the quarterback-running back mesh",
    "Inside Linebacker": "the guard triangle, backfield action, and open interior gap",
    "Outside Linebacker": "the end player on the line, backfield flow, and force/contain responsibility",
    Cornerback: "receiver split, release, hip angle, and available safety help",
    Safety: "formation strength, vertical threats, and the quarterback's shoulders",
    Kicker: "the holder's spot, plant-foot location, and the ball's contact line",
    Punter: "snap location, rush lane, and coverage direction",
    "Long Snapper": "target line, operation rhythm, and the immediate protection threat",
    Returner: "ball flight, coverage leverage, and the safest north-south lane",
  },
  "flag-football": {
    Quarterback: "defender spacing, the rush clock, and the first open throwing window",
    "Center / Snapper": "snap target, rusher alignment, and open release space",
    Receiver: "defender leverage, zone windows, and route spacing",
    "Ball Carrier": "flag position, pursuit angle, and open space",
    Rusher: "the legal rush point, quarterback setup, and throwing-hand escape lane",
    "Short-Zone Defender": "the quarterback's eyes and receivers entering the short window",
    "Deep Defender": "vertical threats, route combinations, and the deepest open space",
  },
  basketball: {
    "Point Guard": "floor balance, help-defender position, and the next advantage",
    "Shooting Guard": "closeout speed, shooting space, and the driving gap",
    "Small Forward": "matchup leverage, weak-side space, and the next connecting pass",
    "Power Forward": "screen angle, rebounding position, and help responsibility",
    Center: "rim pressure, ball-handler angle, and the most dangerous rebounder",
  },
  soccer: {
    Goalkeeper: "ball pressure, runners behind the line, and the space to claim",
    "Center Back": "ball pressure, the striker's movement, and depth behind the line",
    Fullback: "the winger's position, inside support, and space beyond the wide channel",
    "Defensive Midfielder": "the space between lines, the opponent's attacking midfielder, and the safe outlet",
    "Central Midfielder": "shoulder pressure, teammate spacing, and the next open line",
    Winger: "fullback leverage, space behind, and teammates arriving in the box",
    Striker: "center-back body shape, the offside line, and the finishing window",
  },
  volleyball: {
    Setter: "pass quality, blocker position, and available hitter matchups",
    "Outside Hitter": "set location, blocker hands, and deep-court defender position",
    Opposite: "set tempo, outside hitter approach, and the blocking matchup",
    "Middle Blocker": "setter body position, pass location, and opposing hitter approach",
    Libero: "server contact, hitter shoulder, and seams in the defensive shape",
    "Defensive Specialist": "server target, hitter approach, and uncovered floor space",
  },
  baseball: {
    Pitcher: "catcher target, hitter timing, and the count",
    Catcher: "hitter setup, pitcher command, runners, and the game situation",
    "First Base": "ball contact, throw path, and runner position",
    "Second Base": "ball angle, force-play responsibility, and shortstop movement",
    Shortstop: "contact direction, runner speed, and relay responsibility",
    "Third Base": "hitter setup, bunt threat, and the speed of contact",
    Outfielder: "swing contact, ball flight, and runner advancement",
  },
  softball: {
    Pitcher: "catcher target, batter timing, and the count",
    Catcher: "batter setup, pitch movement, runners, and bunt threat",
    "Corner Infielder": "batter stance, bunt angle, and line responsibility",
    "Middle Infielder": "contact angle, force-play responsibility, and runner speed",
    Outfielder: "contact, ball flight, and the lead runner",
  },
  hockey: {
    Center: "puck pressure, middle-lane support, and threats through all three zones",
    Winger: "puck side, wall pressure, and open ice toward the net",
    Defenseman: "forecheck pressure, middle-lane danger, and the first breakout option",
    Goaltender: "puck release, screen position, and rebound danger",
  },
  lacrosse: {
    Attack: "defender approach, slide position, and space around the crease",
    Midfielder: "transition numbers, matchup leverage, and two-way recovery space",
    Defense: "dodger hips, slide responsibility, and the dangerous middle",
    Goalie: "shooter hands, release angle, and off-ball threats",
    "Faceoff Specialist": "opponent hand position, clamp angle, and exit space",
  },
  rugby: {
    Prop: "bind, body height, and pressure through the scrum",
    Hooker: "throwing target, jumper timing, and front-row connection",
    Lock: "lineout call, lifting timing, and contact shape",
    Flanker: "tackle outcome, arriving support, and breakdown space",
    "Scrum-half": "ruck speed, defensive spacing, and the next receiver",
    "Fly-half": "defensive line speed, backfield space, and attacking numbers",
    Center: "defender shoulders, support line, and midfield space",
    Wing: "edge defender, cover defense, and touchline space",
    Fullback: "kick flight, chase line, and counterattack support",
  },
  "field-hockey": {
    Forward: "defender body shape, space behind, and circle-entry support",
    Midfielder: "pressure direction, teammate spacing, and transition numbers",
    Defender: "ball-carrier angle, circle danger, and the safe outlet",
    Goalkeeper: "ball release, screen position, and the next scoring threat",
  },
  "water-polo": {
    Center: "defender position, entry-pass angle, and space near goal",
    Driver: "defender hips, open water, and passing-lane timing",
    Point: "defensive shape, center position, and the next perimeter advantage",
    "Center Defender": "center leverage, ball position, and foul risk",
    Goalkeeper: "shooter arm, passing threats, and the near-post angle",
  },
  cricket: {
    Batter: "bowler release, line, length, and field placement",
    "Fast Bowler": "batter setup, seam position, and target length",
    "Spin Bowler": "batter movement, flight, and the field set",
    Wicketkeeper: "bowler release, batter edge, and stumping chance",
    Fielder: "batter contact, likely scoring area, and backing-up responsibility",
    Captain: "batter intent, bowler rhythm, match situation, and field gaps",
  },
  tennis: {
    "Singles Player": "opponent court position, recovery space, and the next open target",
    Server: "returner position, service target, and the planned first ball",
    Returner: "server toss, contact direction, and the first available response",
    "Baseline Player": "ball depth, opponent balance, and the open direction",
    "Net Player": "opponent contact, passing lane, and space through the middle",
    "Doubles Partner": "partner position, middle responsibility, and opponent formation",
  },
  "track-field": {
    Sprinter: "start signal, body angle, and acceleration rhythm",
    "Distance Runner": "race pace, pack position, breathing, and remaining distance",
    Hurdler: "barrier spacing, lead-leg rhythm, and steps between hurdles",
    "Relay Runner": "exchange-zone mark, teammate speed, and baton hand",
    Jumper: "approach mark, takeoff position, and landing area",
    Thrower: "sector, body balance, power sequence, and release point",
  },
  swimming: {
    Freestyle: "lane line, body alignment, breathing pattern, and race tempo",
    Backstroke: "backstroke flags, lane direction, rotation, and wall distance",
    Breaststroke: "pull-kick timing, glide length, and legal wall contact",
    Butterfly: "body rhythm, breath timing, and simultaneous wall contact",
    "Individual Medley": "stroke order, transition rules, and energy across each leg",
    "Relay Swimmer": "incoming teammate, wall contact, and takeoff timing",
  },
  gymnastics: {
    "Floor Exercise": "tumbling line, landing space, body shape, and routine rhythm",
    Vault: "run mark, board contact, hand placement, and landing line",
    "Uneven Bars": "swing shape, hand position, release timing, and next bar",
    "Balance Beam": "beam center, body alignment, landing foot, and routine rhythm",
    "Still Rings": "ring stability, body line, hold position, and dismount timing",
    "Parallel Bars": "support position, swing line, hand placement, and dismount space",
  },
  pickleball: {
    Server: "receiver position, diagonal service box, and legal contact",
    Returner: "serve depth, bounce, and open space behind the serving team",
    "Baseline Player": "ball depth, opponent balance, and safe space to move forward",
    "Kitchen Player": "ball height, opponent paddle, and open dink space",
    "Doubles Partner": "partner movement, middle responsibility, and opponent spacing",
  },
  badminton: {
    "Singles Player": "opponent position, recovery base, and open court space",
    Server: "receiver stance, legal service height, and target box",
    Receiver: "server motion, shuttle direction, and first attacking chance",
    "Front-Court Player": "shuttle height, net space, and partner position",
    "Rear-Court Player": "shuttle depth, opponent balance, and partner coverage",
  },
  golf: {
    "Tee Shot": "hole shape, hazards, wind, and the widest safe target",
    "Approach Shot": "distance, lie, wind, hazards, and green target",
    "Short Game": "lie, landing spot, slope, and room for the ball to roll",
    Putter: "starting line, slope, speed, and distance to the hole",
    "Course Manager": "score situation, safe zones, hazards, and next-shot angle",
  },
  cycling: {
    "Road Rider": "road surface, rider movement, wind, corners, and course direction",
    "Track Sprinter": "opponent position, banking, lap count, and launch distance",
    "Pursuit Rider": "lap splits, racing line, effort level, and remaining distance",
    "Mountain Biker": "trail surface, obstacle line, braking point, and available grip",
    "BMX Racer": "gate timing, first obstacle, rider position, and fastest safe line",
    "Para Cyclist": "course, classification equipment, pacing, and race position",
  },
  mma: {
    Striker: "distance, opponent stance, legal target, and return threat",
    "Clinch Fighter": "head position, underhooks, balance, and cage space",
    Wrestler: "stance, hips, balance, and safe takedown opening",
    Grappler: "position, base, submission danger, and path to improve control",
    "Defensive Specialist": "distance, opponent attack, boundary, and referee commands",
  },
  wrestling: {
    "Freestyle Wrestler": "stance, lead leg, hand position, and exposure risk",
    "Greco-Roman Wrestler": "upper-body contact, hip position, and legal throwing angle",
    "Folkstyle Wrestler": "control, escape space, riding position, and pinning danger",
    "Neutral Position": "stance, distance, opponent lead, and attack angle",
    "Top Position": "hip control, opponent base, turn option, and legal pressure",
    "Bottom Position": "hand control, base, open escape side, and reversal chance",
  },
};

function positionRead(sport: Sport, position: Position) {
  return POSITION_READS[sport.id]?.[position.name] ?? `the action developing around the ${position.group.toLowerCase()}`;
}

export function positionModuleId(sportId: string, positionName: string) {
  if (sportId === "football" && positionName === "Center") return "fb-position-center-foundations";
  return `${sportId}-position-${positionName.toLowerCase().replaceAll(" ", "-")}-intro`;
}

export function buildPositionModule(sport: Sport, position: Position): LearningModule {
  if (sport.id === "football" && position.name === "Center") {
    return {
      id: positionModuleId(sport.id, position.name),
      sportId: sport.id,
      level: 1,
      pathway: "position",
      position: position.name,
      title: "Center Foundations",
      description: "Front identification, communication, snap mechanics, and interior responsibility.",
      estimatedMinutes: 5,
      challenges: CENTER_CHALLENGES,
    };
  }

  const responsibility = position.focus.charAt(0).toUpperCase() + position.focus.slice(1);
  const read = positionRead(sport, position);
  const readableRead = read.charAt(0).toUpperCase() + read.slice(1);
  const firstRead = read.split(",")[0];
  const execution = `Use the read to ${position.focus}`;
  const relatedResponsibilities = sport.positions
    .filter((candidate) => candidate.name !== position.name)
    .map((candidate) => candidate.focus.charAt(0).toUpperCase() + candidate.focus.slice(1));
  const advancedRoleOptions = [...new Set([
    responsibility,
    ...relatedResponsibilities,
    `Support the ${position.group.toLowerCase()} without adjusting to the developing play`,
    "Wait for another player to take control of the assignment",
  ])].slice(0, 4);
  return {
    id: positionModuleId(sport.id, position.name),
    sportId: sport.id,
    level: 1,
    pathway: "position",
    position: position.name,
    title: `${position.name} Foundations`,
    description: `Read ${read}, make the call, and execute the ${position.name}'s job.`,
    estimatedMinutes: 4,
    challenges: [
      {
        id: `${sport.id}-${position.name}-role`,
        conceptId: `${sport.id}-${position.name}-role`,
        type: "choice",
        label: "Know your job",
        prompt: `Which description best matches the ${position.name}’s core responsibility?`,
        youngPrompt: `What is the ${position.name}'s main job?`,
        options: [responsibility, "Ignore team shape and follow the ball", "Focus only on the scoreboard", "Wait for a teammate to make every call"],
        advancedOptions: advancedRoleOptions,
        correct: responsibility,
        explanation: `At its core, the ${position.name} must ${position.focus}.`,
        youngExplanation: `The ${position.name}'s main job is to ${position.focus}.`,
        xp: 10,
      },
      {
        id: `${sport.id}-${position.name}-awareness`,
        conceptId: `${sport.id}-${position.name}-awareness`,
        type: "choice",
        label: "Spot the first clue",
        prompt: `What should the ${position.name} read before committing to the play?`,
        youngPrompt: `What should a ${position.name} look at first?`,
        options: [readableRead, "Only the scoreboard", "Only the nearest teammate", "The crowd and the sideline"],
        advancedOptions: [readableRead, `Only ${firstRead}, without checking the rest of the play`, `The original plan, even when ${firstRead} changes`, "The nearest matchup after the decision window has already closed"],
        correct: readableRead,
        explanation: `That picture—${read}—gives the ${position.name} the information needed to act early instead of guessing.`,
        youngExplanation: `Looking at ${read} helps the ${position.name} make a smart choice.`,
        xp: 12,
      },
      {
        id: `${sport.id}-${position.name}-decision`,
        conceptId: `${sport.id}-${position.name}-decision`,
        type: "scenario",
        label: "Make the game call",
        prompt: `You are the ${position.name}. The picture around you changes after you read ${read}. Which response best protects your assignment?`,
        youngPrompt: `You are the ${position.name}, and the play changes. What is your best move?`,
        options: [execution, "Chase the action and leave the assignment", "Freeze until a teammate solves it", "Repeat the original action without looking"],
        advancedOptions: [execution, "Stay with the original action even after the read changes", "Leave the primary assignment early to help the nearest teammate", "Wait for a teammate to solve the change before reacting"],
        correct: execution,
        explanation: `The read only matters when it connects to the job. The smart response is to ${position.focus}.`,
        youngExplanation: `Use what you see, then ${position.focus}.`,
        xp: 15,
      },
      {
        id: `${sport.id}-${position.name}-tools`,
        conceptId: `${sport.id}-${position.name}-tools`,
        type: "multi",
        label: "Build your toolkit",
        prompt: `Which TWO habits belong in a high-IQ ${position.name}'s toolkit?`,
        youngPrompt: `Pick TWO things that help a ${position.name} play smart.`,
        options: [`Read ${read}`, responsibility, "Ignore teammates' calls", "Watch only the scoreboard"],
        advancedOptions: [`Read ${read}`, responsibility, `React to ${firstRead} before confirming the full picture`, "Change the assignment without communicating the adjustment"],
        correct: [`Read ${read}`, responsibility],
        explanation: `Strong position play combines information—reading ${read}—with responsibility: ${position.focus}.`,
        youngExplanation: `A smart ${position.name} looks for the right clue and does the position's job.`,
        xp: 15,
      },
      {
        id: `${sport.id}-${position.name}-sequence`,
        conceptId: `${sport.id}-${position.name}-process`,
        type: "ordering",
        label: "Run the rep",
        prompt: `Tap the ${position.name}'s decision steps in the best order.`,
        youngPrompt: `Tap the steps in order to help the ${position.name} make the play.`,
        options: ["Look for the most important clue", "Decide what the clue means", "Communicate the plan", "Do your job"],
        correct: ["Look for the most important clue", "Decide what the clue means", "Communicate the plan", "Do your job"],
        explanation: `Position IQ is a repeatable process: identify the most important clue (${read}), decide what it means, communicate the plan, then ${position.focus}.`,
        youngExplanation: `Look for a clue, understand it, call it out, then do your job.`,
        xp: 15,
      },
    ],
  };
}

export function sportIntroModuleId(sportId: string) {
  return `${sportId}-fundamentals-intro`;
}

export function buildSportIntroModule(sport: Sport): LearningModule {
  return {
    id: sportIntroModuleId(sport.id),
    sportId: sport.id,
    level: 0,
    pathway: "general",
    title: `${sport.name} in Motion`,
    description: "A representative interactive fundamentals module for this sport’s growing curriculum.",
    estimatedMinutes: 3,
    challenges: sport.introQuestions.map((question) => ({
      ...question,
      id: `${sport.id}-${question.id}`,
      conceptId: `${sport.id}-${question.id === "format" ? "game-format" : question.id === "score" ? "scoring" : question.id === "field" ? "playing-area" : "team-size"}`,
    })),
  };
}

export function sportPositionsIntroModuleId(sportId: string) {
  return `${sportId}-positions-intro`;
}

export function buildPositionsIntroModule(sport: Sport): LearningModule {
  const groups = [...new Set(sport.positions.map((position) => position.group))];
  const challenges = groups.slice(0, 5).map((group, index) => {
    const groupPositions = sport.positions.filter((position) => position.group === group);
    const featured = groupPositions[index % groupPositions.length];
    const distractors = sport.positions.filter((position) => position.group !== group).slice(index, index + 3);
    return {
      id: `${sport.id}-positions-${group.toLowerCase().replaceAll(" ", "-")}`,
      conceptId: `${sport.id}-position-groups`,
      type: "choice" as const,
      label: "Meet the team",
      prompt: `Which ${sport.name} position belongs to the ${group} group?`,
      youngPrompt: `Tap a ${group} position.`,
      options: [featured.name, ...distractors.map((position) => position.name)],
      correct: featured.name,
      explanation: `${featured.name} belongs to ${group}. Its job includes helping the team ${featured.focus}.`,
      youngExplanation: `${featured.name} is in ${group}. It helps the team ${featured.focus}.`,
      hint: `Look for the role that shares the ${group} team's job.`,
      youngHint: `Look for ${featured.name}.`,
      xp: 10,
    };
  });

  return {
    id: sportPositionsIntroModuleId(sport.id),
    sportId: sport.id,
    level: 0,
    pathway: "general",
    title: sport.positions.length ? "Meet the Positions" : "Meet the Events",
    description: sport.positions.length
      ? "Learn who is on the playing area and what each group helps the team do."
      : "Learn the different ways athletes compete in this sport.",
    estimatedMinutes: 4,
    challenges,
  };
}

export function generalModulesForSport(sport: Sport): LearningModule[] {
  const fundamentals = sport.id === "football" ? FOOTBALL_MODULES : [buildSportIntroModule(sport)];
  return sport.positions.length ? [...fundamentals, buildPositionsIntroModule(sport)] : fundamentals;
}

export const BADGES = [
  { id: "first-steps", name: "First Steps", description: "Complete your first module.", mark: "01" },
  { id: "perfect-drive", name: "Perfect Drive", description: "Finish a module without a mistake.", mark: "PD" },
  { id: "comeback-kid", name: "Comeback Kid", description: "Recover a missed concept later in the module.", mark: "CK" },
  { id: "position-master", name: "Position Master", description: "Complete a position pathway.", mark: "PM" },
  { id: "rookie-graduate", name: "Rookie Graduate", description: "Complete the Rookie level.", mark: "RG" },
  { id: "multi-sport", name: "Multi-Sport Athlete", description: "Begin three different sports.", mark: "MS" },
  { id: "iron-mind", name: "Iron Mind", description: "Complete ten modules.", mark: "IM" },
  { id: "sport-scholar", name: "Sport Scholar", description: "Master every major pathway in one sport.", mark: "SS" },
];
