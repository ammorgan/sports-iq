export type BeginnerLesson = {
  eyebrow: string;
  title: string;
  body: string;
  terms?: Array<{ term: string; meaning: string }>;
};

export type BeginnerGuide = {
  welcome: string;
  lessons: BeginnerLesson[];
  sourceIds?: string[];
};

export const BEGINNER_GUIDES: Record<string, BeginnerGuide> = {
  football: {
    sourceIds: ["nfl-2025-rules"],
    welcome: "Start with the field, the two teams, and what happens on one play. No football knowledge needed.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Carry or pass the ball toward the end zone.", body: "The offense has the ball and tries to score. The defense tries to stop the offense, force a mistake, or take the ball away." },
      { eyebrow: "HOW PLAY MOVES", title: "Football happens one short play at a time.", body: "Players line up, the center snaps the ball, and the play ends after a tackle, score, incomplete pass, or the ball goes out. The offense normally has four downs to gain 10 yards." },
      { eyebrow: "WORDS TO KNOW", title: "Three words unlock the game.", body: "These will appear in the quiz, so learn them before making a call.", terms: [
        { term: "Snap", meaning: "The center sends the ball backward to start the play." },
        { term: "Down", meaning: "One chance—or play—for the offense to move the ball." },
        { term: "Line of scrimmage", meaning: "The imaginary line through the ball before the snap." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Cross the goal line for the biggest score.", body: "A touchdown is worth 6 points. A field goal is worth 3. After a touchdown, the team can try for 1 or 2 more points." },
    ],
  },
  "flag-football": {
    sourceIds: ["ifaf-flag-rules"],
    welcome: "Learn football’s no-tackle version from the ground up.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Advance the ball without being tackled.", body: "The offense passes or runs toward the end zone. Instead of tackling the ball carrier, a defender ends the play by pulling a flag from the player’s belt." },
      { eyebrow: "HOW PLAY MOVES", title: "Each play starts with a snap.", body: "Players run routes, pass, and move into open space. Exact team sizes, rush rules, and field lengths can vary by league, so RepQuest teaches the shared ideas first." },
      { eyebrow: "WORDS TO KNOW", title: "Space and timing matter.", body: "Learn these before the quiz.", terms: [
        { term: "Flag pull", meaning: "Removing the ball carrier’s flag to end the play." },
        { term: "Route", meaning: "The planned path a receiver runs to get open." },
        { term: "Rusher", meaning: "A defender allowed to chase the quarterback under the league’s rules." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Reach the end zone to score.", body: "A touchdown is the main score. Point values and conversion rules differ by league, but protecting the ball and creating open passing lanes always matter." },
    ],
  },
  basketball: {
    sourceIds: ["fiba-2024-rules"],
    welcome: "Meet the court, the hoop, and the basic rhythm of a possession.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Put the ball through the other team’s hoop.", body: "Five players per team are on the court. The offense passes, dribbles, and shoots; the defense protects the basket and tries to regain possession." },
      { eyebrow: "HOW PLAY MOVES", title: "Pass, dribble, cut, and shoot.", body: "A player must dribble while moving with the ball. Teammates move into open space, set screens, and rebound missed shots." },
      { eyebrow: "WORDS TO KNOW", title: "Start with these court words.", body: "They explain most beginner situations.", terms: [
        { term: "Dribble", meaning: "Bounce the ball repeatedly while moving." },
        { term: "Rebound", meaning: "Gain control of a missed shot." },
        { term: "Foul", meaning: "Illegal contact or another rule violation." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Shots are worth 1, 2, or 3 points.", body: "A normal basket inside the three-point line is 2. A shot beyond the arc is 3. A made free throw is 1." },
    ],
  },
  soccer: {
    sourceIds: ["ifab-2026-laws"],
    welcome: "Learn the world’s game without assuming you know its language.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Move the ball into the other team’s goal.", body: "Each team normally has 11 players on the field, including a goalkeeper. Field players mainly use their feet, head, and body—not their hands." },
      { eyebrow: "HOW PLAY MOVES", title: "Soccer flows continuously.", body: "Players pass, dribble, shoot, defend, and change roles as possession changes. The goalkeeper may use hands inside that team’s own penalty area." },
      { eyebrow: "WORDS TO KNOW", title: "These three terms explain many calls.", body: "Read them once, then spot them in the game.", terms: [
        { term: "Dribble", meaning: "Control the ball with small touches while moving." },
        { term: "Tackle", meaning: "A legal attempt to take the ball from an opponent—not an American-football tackle." },
        { term: "Offside", meaning: "A rule that prevents an attacker from waiting unfairly behind the defense for a pass." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "A goal counts as 1.", body: "The whole ball must cross the whole goal line between the posts and under the crossbar. The team with more goals wins." },
    ],
  },
  volleyball: {
    welcome: "See how a team keeps the ball off the floor and builds an attack.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Send the ball over the net and make it land in bounds.", body: "Six players per team are normally on the court. A team also scores when the opponent sends the ball out or commits a fault." },
      { eyebrow: "HOW PLAY MOVES", title: "Most teams build with three contacts.", body: "A common pattern is pass, set, then attack. A team may use up to three contacts before sending the ball back over the net." },
      { eyebrow: "WORDS TO KNOW", title: "The three-contact language is simple.", body: "These terms describe the usual sequence.", terms: [
        { term: "Pass", meaning: "Control the opponent’s serve or attack, often with the forearms." },
        { term: "Set", meaning: "Place the ball for a teammate to attack." },
        { term: "Spike", meaning: "A hard attacking hit aimed into the opponent’s court." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Every rally can produce a point.", body: "A rally starts with a serve and ends when the ball lands, goes out, or a fault occurs. Sets are usually played to 25, with a two-point winning margin." },
    ],
  },
  baseball: {
    welcome: "Learn innings, outs, and the trip around the bases one idea at a time.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Hit the ball and travel around four bases to score.", body: "One team bats while the other pitches and fields. The batting team tries to score runs; the fielding team tries to record outs." },
      { eyebrow: "HOW PLAY MOVES", title: "Three outs switch offense and defense.", body: "A pitcher throws toward the batter. After contact, the batter runs to first base and may continue when it is safe." },
      { eyebrow: "WORDS TO KNOW", title: "Start with the pitcher-batter battle.", body: "These words repeat throughout every inning.", terms: [
        { term: "Strike", meaning: "A hittable pitch not hit, a swing and miss, or usually a foul before strike two." },
        { term: "Out", meaning: "One of the three defensive results needed to end a half-inning." },
        { term: "Inning", meaning: "A section in which both teams get a turn to bat." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "A completed trip around the bases is 1 run.", body: "After the scheduled innings, the team with more runs wins. A home run lets the batter—and any runners on base—score." },
    ],
  },
  softball: {
    welcome: "Learn what softball shares with baseball and what makes it its own sport.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Hit, run the bases, and score before the defense gets three outs.", body: "Softball uses a larger ball, and fast-pitch pitchers deliver underhand from a level circle. The field is usually smaller than a baseball field." },
      { eyebrow: "HOW PLAY MOVES", title: "Each team takes turns batting and fielding.", body: "The pitcher throws, the batter tries to reach base, and runners advance toward home. Three outs end that team’s turn at bat." },
      { eyebrow: "WORDS TO KNOW", title: "Know the shape of an inning.", body: "These terms will appear in beginner questions.", terms: [
        { term: "Pitch", meaning: "The underhand delivery from the pitcher toward home plate." },
        { term: "Force out", meaning: "An out made by touching the required base before the runner arrives." },
        { term: "Inning", meaning: "A section in which both teams bat once." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Cross home plate to score 1 run.", body: "Many standard games use seven innings, though youth and local formats vary. The team with more runs wins." },
    ],
  },
  hockey: {
    welcome: "Meet the ice, the puck, and the fast change from attack to defense.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Use a stick to send the puck into the other team’s net.", body: "Six players per team are usually on the ice, including the goaltender. Skaters attack, defend, and change in short shifts." },
      { eyebrow: "HOW PLAY MOVES", title: "Hockey changes direction very quickly.", body: "Players skate, pass, shoot, and battle for possession. The puck can move faster than the players, so spacing and support are essential." },
      { eyebrow: "WORDS TO KNOW", title: "Learn the lines and the penalties.", body: "These are common beginner calls.", terms: [
        { term: "Offside", meaning: "An attacker enters the offensive zone before the puck." },
        { term: "Icing", meaning: "A player sends the puck across both the center red line and the opponent’s goal line without a legal touch." },
        { term: "Power play", meaning: "One team has more skaters because an opponent is serving a penalty." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Each goal is worth 1.", body: "The puck must fully cross the goal line inside the net. The team with more goals after regulation—or the required tiebreaker—wins." },
    ],
  },
  lacrosse: {
    welcome: "Learn how the stick, ball, and goal work before position language begins.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Carry, pass, and shoot with a lacrosse stick.", body: "Players cradle the ball in the stick’s pocket while moving. The offense tries to shoot into the goal while the defense protects the middle." },
      { eyebrow: "HOW PLAY MOVES", title: "Possession can change in an instant.", body: "Teams pass to create space, dodge defenders, scoop ground balls, and transition quickly after a turnover. Field, box, women’s, and men’s rules have important differences." },
      { eyebrow: "WORDS TO KNOW", title: "The stick has its own vocabulary.", body: "Start with these three actions.", terms: [
        { term: "Cradle", meaning: "Move the stick to keep the ball secure in its pocket." },
        { term: "Ground ball", meaning: "A loose ball that players scoop from the field." },
        { term: "Crease", meaning: "The protected area around the goal." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "A ball in the goal counts as 1.", body: "The team with more goals wins. Legal contact, field size, player count, and possession timing depend on the version being played." },
    ],
  },
  rugby: {
    welcome: "Learn forward running, backward passing, and what happens after a tackle.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Carry the ball forward—but pass it sideways or backward.", body: "The attacking team tries to cross the goal line and ground the ball. The defending team tackles legally and competes for possession." },
      { eyebrow: "HOW PLAY MOVES", title: "Play often continues after contact.", body: "After a tackle, teammates form over the ball so it can be played again. Kicks can move the ball forward even though forward hand-passes are illegal." },
      { eyebrow: "WORDS TO KNOW", title: "Contact creates these game shapes.", body: "They make rugby much easier to follow.", terms: [
        { term: "Try", meaning: "Grounding the ball in the opponent’s in-goal area to score." },
        { term: "Ruck", meaning: "Players from both teams compete over a ball on the ground after a tackle." },
        { term: "Scrum", meaning: "A structured restart where the forwards bind and push for the ball." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "In rugby union, a try is worth 5.", body: "A conversion adds 2, and many penalty goals or drop goals add 3. Other rugby formats can use different match structures." },
    ],
  },
  "field-hockey": {
    welcome: "Learn the outdoor stick-and-ball game—not ice hockey without skates.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Move the ball with the flat side of the stick and score in the goal.", body: "Eleven players per team are normally on the field, including a goalkeeper. Players dribble and pass while protecting space." },
      { eyebrow: "HOW PLAY MOVES", title: "The ball stays mostly on the ground.", body: "Teams build attacks through passing lanes, carries, and quick combinations. Most field players may use only the flat side of the stick." },
      { eyebrow: "WORDS TO KNOW", title: "The scoring area matters.", body: "These terms explain many whistles.", terms: [
        { term: "Shooting circle", meaning: "The marked area around goal; an attacker must touch the ball inside it for a goal to count." },
        { term: "Penalty corner", meaning: "A set attacking chance awarded for certain defensive fouls." },
        { term: "Tackle", meaning: "A legal stick challenge to win the ball." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Each legal goal is worth 1.", body: "The ball must be played by an attacker inside the shooting circle before entering the goal. The team with more goals wins." },
    ],
  },
  "water-polo": {
    welcome: "Learn how players swim, pass, and score while staying afloat.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Pass and shoot the ball into the other team’s goal.", body: "Seven players per team are usually in the water, including a goalkeeper. Field players handle the ball with one hand." },
      { eyebrow: "HOW PLAY MOVES", title: "Players swim, tread water, and pass under pressure.", body: "Teams have a limited possession clock to create a shot. Players cannot stand on the pool bottom in standard deep-water play." },
      { eyebrow: "WORDS TO KNOW", title: "Fouls shape the action.", body: "These calls help explain who has an advantage.", terms: [
        { term: "Exclusion", meaning: "A major foul that temporarily removes a defender, creating a player advantage." },
        { term: "Center", meaning: "An attacking player who works close to the goal." },
        { term: "Eggbeater", meaning: "The circular leg motion used to stay high in the water." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Each goal is worth 1.", body: "The entire ball must cross the goal line. The team with more goals after the match wins." },
    ],
  },
  cricket: {
    welcome: "Learn wickets, runs, and the bowler-batter contest from zero.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Batters score runs while the fielding team tries to take wickets.", body: "Two batters are on the pitch. A bowler delivers the ball toward the striker and the wicket behind them." },
      { eyebrow: "HOW PLAY MOVES", title: "Six legal deliveries usually make an over.", body: "Batters can run between the two ends after a hit, or score a boundary. The batting innings ends according to the match format, wickets, or allotted overs." },
      { eyebrow: "WORDS TO KNOW", title: "Three words open the whole sport.", body: "Cricket becomes easier once these are clear.", terms: [
        { term: "Wicket", meaning: "The stumps and bails behind a batter—and also the word used when a batter is dismissed." },
        { term: "Over", meaning: "A set of six legal balls bowled by one bowler." },
        { term: "Boundary", meaning: "A hit worth 4 runs after bouncing or 6 without bouncing before crossing the edge." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "The team with more runs wins.", body: "Match length can range from short Twenty20 games to multi-day Test cricket, but runs and wickets are the foundation of every format." },
    ],
  },
  tennis: {
    welcome: "Learn the serve, the rally, and the unusual score language.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Hit the ball over the net and into the opponent’s court.", body: "Players score when the opponent cannot return the ball legally, hits it out, or lets it bounce twice." },
      { eyebrow: "HOW PLAY MOVES", title: "Every point begins with a serve.", body: "After the serve lands in the correct box, players rally from the baseline or move forward to volley before the ball bounces." },
      { eyebrow: "WORDS TO KNOW", title: "Tennis has special score words.", body: "They sound strange until you see the pattern.", terms: [
        { term: "Love", meaning: "Zero points in a game." },
        { term: "Deuce", meaning: "A 40–40 tie; a player usually must win two straight points." },
        { term: "Break", meaning: "Winning a game while the opponent is serving." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Points build games; games build sets.", body: "The usual point sequence is 15, 30, 40, game. A player normally wins a set by reaching six games with the required margin or tiebreak." },
    ],
  },
  "track-field": {
    welcome: "Learn how running, jumping, and throwing events fit under one sport.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Run fastest, jump highest or farthest, or throw farthest.", body: "Track and field contains many separate events. Athletes may sprint, race distance, clear barriers, jump, vault, or throw implements." },
      { eyebrow: "HOW PLAY MOVES", title: "Each event has its own legal attempt.", body: "Races use starts and finish lines. Field events use measured jumps or throws, often with several attempts and qualifying rounds." },
      { eyebrow: "WORDS TO KNOW", title: "Competition is organized in rounds.", body: "These terms appear across events.", terms: [
        { term: "Heat", meaning: "One preliminary race used to decide who advances." },
        { term: "False start", meaning: "Leaving before the legal start signal." },
        { term: "Personal best", meaning: "An athlete’s best result ever in that event." },
      ] },
      { eyebrow: "HOW WINNING WORKS", title: "The measurement decides the result.", body: "Lowest time wins most races. Greatest legal height or distance wins most field events." },
    ],
  },
  swimming: {
    welcome: "Learn the pool, the strokes, and what makes a race legal.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Complete the required distance faster than the other swimmers.", body: "Competitive races use a named stroke or a combination of strokes. Athletes must follow stroke, turn, and finish rules." },
      { eyebrow: "HOW PLAY MOVES", title: "Starts, turns, and finishes all matter.", body: "Swimmers dive or start in the water, travel in marked lanes, touch or turn at the wall, and finish by completing the full distance." },
      { eyebrow: "WORDS TO KNOW", title: "Pool distance has two useful words.", body: "Learn these before reading a race card.", terms: [
        { term: "Length", meaning: "One trip from one end of the pool to the other." },
        { term: "Lap", meaning: "Often used casually for a length, though some coaches use it for down-and-back." },
        { term: "Medley", meaning: "A race combining butterfly, backstroke, breaststroke, and freestyle in a set order." },
      ] },
      { eyebrow: "HOW WINNING WORKS", title: "The fastest legal time wins.", body: "A swimmer can be disqualified for an illegal start, stroke, turn, or finish even if they touch the wall first." },
    ],
  },
  gymnastics: {
    welcome: "Learn what a routine is and what judges are actually watching.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Perform a planned routine with skill, control, and safety.", body: "Gymnastics includes apparatus such as floor, vault, bars, beam, rings, and more. Events differ by discipline and competition." },
      { eyebrow: "HOW PLAY MOVES", title: "Skills connect into a routine.", body: "Athletes combine jumps, turns, balances, swings, and tumbling. They must meet event requirements while controlling body shape and landings." },
      { eyebrow: "WORDS TO KNOW", title: "Judges separate difficulty from execution.", body: "These terms explain the score.", terms: [
        { term: "Difficulty", meaning: "The value of the skills and connections attempted." },
        { term: "Execution", meaning: "How cleanly and correctly the routine is performed." },
        { term: "Stick", meaning: "Land without moving the feet." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Hard skills help only when they are controlled.", body: "Many events combine a difficulty score with an execution score, then subtract penalties. Exact systems vary by discipline and level." },
    ],
  },
  pickleball: {
    welcome: "Learn the paddle, the bounce rules, and the area called the kitchen.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Hit a perforated ball over a net with a paddle.", body: "Pickleball can be singles or doubles. The court is smaller than a tennis court, and control near the net is a major part of the game." },
      { eyebrow: "HOW PLAY MOVES", title: "The first two shots must bounce.", body: "The serve must bounce before the return, and the return must bounce before the serving team hits it. After that, players may volley when legal." },
      { eyebrow: "WORDS TO KNOW", title: "The kitchen changes net play.", body: "These three terms make rallies easier to read.", terms: [
        { term: "Kitchen", meaning: "The non-volley zone beside the net; players cannot volley while touching it." },
        { term: "Dink", meaning: "A soft shot that lands in the opponent’s kitchen." },
        { term: "Volley", meaning: "Hit the ball before it bounces." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Traditional scoring awards points only to the serving side.", body: "Games are commonly played to 11 and won by 2, though some events use rally scoring or different targets." },
    ],
  },
  badminton: {
    welcome: "Learn how the shuttle changes the speed and shape of a racket sport.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Hit the shuttle over the net and into the opponent’s court.", body: "Players score when the shuttle lands in, or when the opponent hits it out, into the net, or commits a fault." },
      { eyebrow: "HOW PLAY MOVES", title: "Each side gets one hit before the shuttle crosses back.", body: "Players move from a central base, use overhead and underhand shots, and change between attack and defense very quickly." },
      { eyebrow: "WORDS TO KNOW", title: "Shot height changes the tactic.", body: "These are three basic choices.", terms: [
        { term: "Clear", meaning: "A high, deep shot toward the back of the court." },
        { term: "Drop", meaning: "A soft shot that falls near the net." },
        { term: "Smash", meaning: "A hard, steep attacking shot." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Every rally earns a point.", body: "Games are normally played to 21, won by 2, with a cap at 30 under standard rules." },
    ],
  },
  golf: {
    welcome: "Learn the course and why a lower number is better.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Finish each hole in as few strokes as possible.", body: "A stroke is one attempt to hit the ball. A round moves from the teeing area, through the fairway or rough, onto the green, and into the hole." },
      { eyebrow: "HOW PLAY MOVES", title: "Each shot sets up the next one.", body: "Players choose a club based on distance, lie, hazards, and target. Power helps, but safe placement and putting are equally important." },
      { eyebrow: "WORDS TO KNOW", title: "Golf scores compare you with par.", body: "Lower is better.", terms: [
        { term: "Par", meaning: "The expected number of strokes for a hole." },
        { term: "Birdie", meaning: "One stroke under par." },
        { term: "Bogey", meaning: "One stroke over par." },
      ] },
      { eyebrow: "HOW SCORING WORKS", title: "Add every stroke across the round.", body: "In stroke play, the lowest total wins. Match play instead compares who wins each hole." },
    ],
  },
  cycling: {
    welcome: "Learn why cycling races can look very different from one another.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Ride the course as fast and efficiently as the event requires.", body: "Cycling includes road, track, mountain bike, BMX, and para cycling. Terrain, equipment, team tactics, and scoring differ by discipline." },
      { eyebrow: "HOW PLAY MOVES", title: "Position and energy matter—not only top speed.", body: "Road riders often travel in a group to reduce air resistance, then attack, climb, or sprint at important moments." },
      { eyebrow: "WORDS TO KNOW", title: "The group changes the race.", body: "These terms explain common road tactics.", terms: [
        { term: "Peloton", meaning: "The main group of riders in a road race." },
        { term: "Draft", meaning: "Ride behind another cyclist to reduce air resistance." },
        { term: "Cadence", meaning: "How quickly a rider turns the pedals." },
      ] },
      { eyebrow: "HOW WINNING WORKS", title: "Most races reward the fastest legal finish or time.", body: "Some track events use points, heats, or head-to-head tactics, so always check the event format first." },
    ],
  },
  mma: {
    sourceIds: ["abc-unified-mma"],
    welcome: "No combat-sports knowledge is assumed. Learn the language before judging a round.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "MMA combines standing and ground fighting.", body: "Mixed martial arts lets trained athletes use techniques from boxing, kickboxing, wrestling, judo, jiu-jitsu, and other disciplines under one safety-focused rule set." },
      { eyebrow: "THE TWO MAIN AREAS", title: "Striking happens with blows; grappling happens through holds and control.", body: "Striking means legal punches, kicks, knees, and—under many professional rules—elbows. Grappling means clinching, takedowns, positional control, escapes, and submission attempts." },
      { eyebrow: "WORDS TO KNOW", title: "Now the judging words have meaning.", body: "The quiz will use these terms only after teaching them.", terms: [
        { term: "Takedown", meaning: "Bring an opponent from standing to the floor while establishing control." },
        { term: "Submission", meaning: "A legal hold that makes an opponent tap or verbally give up." },
        { term: "Effective", meaning: "An action that produces real impact, improves position, or creates a serious finishing threat." },
      ] },
      { eyebrow: "HOW A FIGHT IS WON", title: "A bout can end early or go to the judges.", body: "A fighter can win by knockout, technical knockout, or submission. If time expires, judges score each round—primarily effective striking and grappling, then effective aggression and fighting-area control when needed." },
    ],
  },
  wrestling: {
    welcome: "Learn the mat, the positions, and the difference between a takedown and a pin.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Control the opponent and score legal actions on the mat.", body: "Two wrestlers compete in the same weight category. They use balance, leverage, and technique rather than punches or kicks." },
      { eyebrow: "HOW PLAY MOVES", title: "Action can begin standing or from a referee’s position.", body: "Wrestlers attack for takedowns, work for turns from the top, and try to escape or reverse from the bottom." },
      { eyebrow: "WORDS TO KNOW", title: "Position explains the score.", body: "Learn these before comparing wrestling styles.", terms: [
        { term: "Takedown", meaning: "Bring the opponent to the mat and establish control." },
        { term: "Escape", meaning: "Break free from an opponent’s control." },
        { term: "Pin or fall", meaning: "Hold both shoulders to the mat for the required confirmation and win immediately." },
      ] },
      { eyebrow: "HOW WINNING WORKS", title: "Win immediately by fall—or finish with more points.", body: "Freestyle, Greco-Roman, and folkstyle award actions differently. Greco-Roman does not allow active attacks using the legs; freestyle does." },
    ],
  },
  bowling: {
    sourceIds: ["usbc-bowling-basics", "usbc-high-school-guide"],
    welcome: "Meet the lane, the ten pins, and the goal of every delivery. No bowling knowledge needed.",
    lessons: [
      { eyebrow: "THE BIG IDEA", title: "Roll the ball down the lane to knock down ten pins.", body: "A bowler starts on the approach, releases the ball before crossing the foul line, and aims at the pins at the far end. The gutters beside the lane do not count as part of the playing surface." },
      { eyebrow: "HOW A GAME MOVES", title: "One game has ten frames.", body: "In most frames, a bowler gets up to two deliveries to knock down all ten pins. A strike ends the frame after the first ball. A strike or spare in the tenth frame earns bonus deliveries so its score can be completed." },
      { eyebrow: "WORDS TO KNOW", title: "Three score words unlock the game.", body: "Learn these before the quick check.", terms: [
        { term: "Frame", meaning: "One of the ten turns that make up a game." },
        { term: "Strike", meaning: "Knock down all ten pins with the first delivery of a frame." },
        { term: "Spare", meaning: "Knock down all ten pins using both deliveries in a frame." },
      ] },
      { eyebrow: "SCORING + SAFETY", title: "Bonus pins reward strikes and spares.", body: "A strike scores 10 plus the next two deliveries. A spare scores 10 plus the next delivery. A perfect game is 300. Wait for the pinsetter, keep hands away from the ball return opening, use a ball you can control, and wear bowling shoes on the approach." },
    ],
  },
};

export function beginnerGuideFor(sportId: string) {
  return BEGINNER_GUIDES[sportId];
}
