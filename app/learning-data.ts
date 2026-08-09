export type ExperienceLevel = "new" | "basics" | "casual" | "competitive" | "expert";

export type ChallengeType = "choice" | "truefalse" | "scenario" | "ordering" | "multi" | "hotspot";

export type Challenge = {
  id: string;
  conceptId: string;
  type: ChallengeType;
  label: string;
  prompt: string;
  youngPrompt?: string;
  options: string[];
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
  correct: string;
  explanation: string;
  youngExplanation?: string;
  xp: number;
};

export type Sport = {
  id: string;
  name: string;
  mark: string;
  color: string;
  softColor: string;
  variants: string[];
  pathNote?: string;
  positions: Position[];
  introQuestions: IntroQuestion[];
};

export const EXPERIENCE_OPTIONS: Array<{ value: ExperienceLevel; title: string; note: string }> = [
  { value: "new", title: "I’m completely new", note: "Start with an interactive Fundamentals path." },
  { value: "basics", title: "I know the basics", note: "Skip the intro and begin at Rookie." },
  { value: "casual", title: "I’ve played casually", note: "Start with game situations and core reads." },
  { value: "competitive", title: "I’ve played competitively", note: "Jump into Playmaker-level decisions." },
  { value: "expert", title: "I’m very experienced / coach-level", note: "Open advanced film-room challenges." },
];

export const LEVELS = ["Rookie", "Starter", "Playmaker", "All-Star", "Elite", "Pro"];

export const SPORTS: Sport[] = [
  {
    id: "football",
    name: "Tackle Football",
    mark: "TF",
    color: "#2f6f68",
    softColor: "#dcebe6",
    variants: ["Women’s Tackle (WNFC)", "Men’s Tackle", "Youth Tackle"],
    pathNote: "Eleven-on-eleven tackle football with full offensive, defensive, and special-teams position rooms—including the women’s tackle game represented by the WNFC.",
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

export function buildPositionModule(sport: Sport, position: Position): LearningModule {
  if (sport.id === "football" && position.name === "Center") {
    return {
      id: "fb-position-center-foundations",
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
  return {
    id: `${sport.id}-position-${position.name.toLowerCase().replaceAll(" ", "-")}-intro`,
    sportId: sport.id,
    level: 1,
    pathway: "position",
    position: position.name,
    title: `${position.name} Foundations`,
    description: `A representative ${position.name} module focused on recognition and responsibility.`,
    estimatedMinutes: 3,
    challenges: [
      {
        id: `${sport.id}-${position.name}-role`,
        conceptId: `${sport.id}-${position.name}-role`,
        type: "choice",
        label: "Know your job",
        prompt: `Which description best matches the ${position.name}’s core responsibility?`,
        options: [responsibility, "Ignore team shape and follow the ball", "Focus only on the scoreboard", "Wait for a teammate to make every call"],
        correct: responsibility,
        explanation: `At its core, the ${position.name} must ${position.focus}.`,
        xp: 10,
      },
      {
        id: `${sport.id}-${position.name}-awareness`,
        conceptId: `${sport.id}-${position.name}-awareness`,
        type: "truefalse",
        label: "Position IQ",
        prompt: `A strong ${position.name} reads teammates and opponents before reacting.`,
        options: ["True", "False"],
        correct: "True",
        explanation: "Position IQ starts with an early picture of the situation, then a decisive response.",
        xp: 10,
      },
      {
        id: `${sport.id}-${position.name}-decision`,
        conceptId: `${sport.id}-${position.name}-decision`,
        type: "scenario",
        label: "What’s your read?",
        prompt: `As the ${position.name}, what is the best first step when the opponent changes shape unexpectedly?`,
        options: ["Scan, communicate, then adjust", "Freeze and wait", "Abandon the position", "Repeat the same action without looking"],
        correct: "Scan, communicate, then adjust",
        explanation: "Good players gather the new picture, communicate what changed, and adjust within the team plan.",
        xp: 15,
      },
      {
        id: `${sport.id}-${position.name}-sequence`,
        conceptId: `${sport.id}-${position.name}-process`,
        type: "ordering",
        label: "Decision process",
        prompt: "Arrange a high-IQ decision sequence.",
        options: ["Scan", "Recognize", "Communicate", "Execute"],
        correct: ["Scan", "Recognize", "Communicate", "Execute"],
        explanation: "Seeing early creates time to recognize, communicate, and execute with confidence.",
        xp: 15,
      },
    ],
  };
}

export function buildSportIntroModule(sport: Sport): LearningModule {
  return {
    id: `${sport.id}-fundamentals-intro`,
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
