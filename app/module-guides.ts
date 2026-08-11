import { beginnerGuideFor, type BeginnerGuide, type BeginnerLesson } from "./beginner-guides";
import { sportPositionsIntroModuleId, type LearningModule, type Position, type Sport } from "./learning-data";

function positionGroupLessons(sport: Sport, isYoung: boolean): BeginnerLesson[] {
  const groups = [...new Set(sport.positions.map((position) => position.group))];
  return groups.flatMap((group) => {
    const positions = sport.positions.filter((position) => position.group === group);
    const batches = isYoung
      ? Array.from({ length: Math.ceil(positions.length / 3) }, (_, index) => positions.slice(index * 3, index * 3 + 3))
      : [positions];
    return batches.map((batch, batchIndex) => ({
      eyebrow: "MEET THE TEAM",
      title: batches.length > 1 ? `${group} · Part ${batchIndex + 1}` : group,
      body: isYoung ? `These players are part of ${group}.` : `${group} is one part of the full ${sport.name} picture. Learn the job before choosing a role.`,
      terms: batch.map((position) => ({ term: position.name, meaning: `Helps the team ${position.focus}.` })),
    }));
  });
}

const FOOTBALL_MODULE_GUIDES: Record<string, BeginnerGuide> = {
  "fb-fundamentals-score": {
    welcome: "First learn how a team keeps the ball, moves the chains, and puts points on the board.",
    lessons: [
      { eyebrow: "KEEP THE BALL", title: "Four downs make one chance to advance.", body: "The offense normally gets four plays, called downs, to gain 10 yards. Reaching the line to gain earns a new first down and four more chances." },
      { eyebrow: "CHANGE OF POSSESSION", title: "The other team can get the ball in several ways.", body: "Possession changes after a punt, an interception, a recovered fumble, a score and kickoff, or when the offense fails on fourth down." },
      { eyebrow: "POINTS", title: "Touchdown 6. Field goal 3. Safety 2.", body: "After a touchdown, the scoring team gets a try for 1 or 2 more points. The game situation helps a team decide whether to kick, punt, or keep the offense on the field." },
      { eyebrow: "WATCH A DRIVE", title: "Field position connects every decision.", body: "A drive is one team’s possession. First downs extend it; turnovers end it; entering the opponent’s end of the field creates better scoring chances." },
    ],
  },
  "fb-rookie-units": {
    welcome: "A football team is really three connected groups. Meet each group before choosing a position.",
    lessons: [
      { eyebrow: "OFFENSE", title: "The offense starts with the ball.", body: "The quarterback, backs, receivers, tight ends, and offensive line work together to advance and score. Some handle the ball; others create time and space." },
      { eyebrow: "DEFENSE", title: "The defense tries to stop or take away the ball.", body: "Defensive linemen control the front, linebackers connect run and pass defense, and defensive backs protect receivers and deep space." },
      { eyebrow: "SPECIAL TEAMS", title: "Kicking plays use a different unit.", body: "Kickoffs, punts, field goals, extra points, returns, and blocks bring specialists and coverage players onto the field." },
      { eyebrow: "THE HANDOFF", title: "One unit leaves as the next one enters.", body: "After a possession change, players switch quickly. Recognizing the unit tells a new viewer what kind of play is about to happen." },
    ],
  },
};

function positionLesson(position: Position, sport: Sport): BeginnerGuide {
  return {
    welcome: `Meet the ${position.name} before making game decisions for the role.`,
    lessons: [
      { eyebrow: "YOUR JOB", title: `What does the ${position.name} do?`, body: `The ${position.name} belongs to ${position.group} and helps the team ${position.focus}.` },
      { eyebrow: "YOUR FIRST LOOK", title: "Read the picture before reacting.", body: `First find the ball, teammates, opponents, and the most important open space. Then connect what you see to the ${position.name}’s assignment.` },
      { eyebrow: "YOUR DECISION", title: "See it. Call it. Do your job.", body: `Strong ${sport.name} IQ is a repeatable process: notice the clue, decide what it means, communicate when needed, and carry out the role.` },
    ],
  };
}

export function moduleGuideFor(module: LearningModule, sport: Sport, ageBand?: string): BeginnerGuide | undefined {
  if (module.pathway === "position") {
    const position = sport.positions.find((candidate) => candidate.name === module.position);
    return position ? positionLesson(position, sport) : undefined;
  }
  if (module.id === sportPositionsIntroModuleId(sport.id)) {
    return {
      welcome: `Meet the major ${sport.pathLabel?.toLowerCase() ?? "position"} groups before choosing a specialized path.`,
      lessons: positionGroupLessons(sport, ageBand === "7-9"),
    };
  }
  return FOOTBALL_MODULE_GUIDES[module.id] ?? beginnerGuideFor(sport.id);
}
