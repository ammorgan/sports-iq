import { beginnerGuideFor, type BeginnerGuide, type BeginnerLesson } from "./beginner-guides.ts";
import {
  positionDecisionStepsFor,
  positionReadFor,
  sportPositionsIntroModuleId,
  type LearningModule,
  type Position,
  type Sport,
} from "./learning-data.ts";
import { craftProfileForSport } from "./position-curriculum.ts";
import { coreUnitForModule } from "./courses/index.ts";

function positionGroupLessons(sport: Sport, isYoung: boolean): BeginnerLesson[] {
  const groups = [...new Set(sport.positions.map((position) => position.group))];
  return groups.flatMap((group) => {
    const positions = sport.positions.filter((position) => position.group === group);
    const batches = isYoung
      ? Array.from({ length: Math.ceil(positions.length / 3) }, (_, index) => positions.slice(index * 3, index * 3 + 3))
      : [positions];
    return batches.map((batch, batchIndex) => ({
      eyebrow: "MEET THE ROLES",
      title: batches.length > 1 ? `${group} · Part ${batchIndex + 1}` : group,
      body: isYoung ? `These roles are part of ${group}.` : `${group} is one part of ${sport.name}. Learn each responsibility before choosing a role.`,
      terms: batch.map((position) => ({ term: position.name, meaning: `Focus: ${position.focus}.` })),
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

const QUARTERBACK_MODULE_GUIDES: Record<string, BeginnerGuide> = {
  "football-position-quarterback-intro-level-2": {
    welcome: "Build a pre-snap coverage hypothesis, then use post-snap rotation and leverage to confirm or change it.",
    sourceIds: ["usa-football-qb-coverages", "usa-football-qb-coverage-formula"],
    lessons: [
      { eyebrow: "START WITH THE SHELL", title: "Count deep safeties, then keep watching.", body: "Zero-, one-, and two-high safety pictures help a quarterback narrow the possibilities before the snap. They do not guarantee the final coverage because defenders can disguise and rotate." },
      { eyebrow: "MAN INDICATORS", title: "Motion and route matching can indicate man responsibility.", body: "A defender traveling with motion is one man-coverage indicator. After the snap, route matching adds evidence, but the quarterback still locates any deep helper, robber, or bracket." },
      { eyebrow: "COVER 2", title: "Two defenders protect the deep halves.", body: "In basic Cover 2 zone, two safeties divide the deep field, cornerbacks protect the flats, and underneath defenders work hook and curl areas. Tampa and match variations change the picture." },
      { eyebrow: "COVER 3", title: "Three defenders protect the deep thirds.", body: "In basic Cover 3, the two outside corners and a middle safety divide the deep field into thirds while underneath defenders protect shorter zones. Match Cover 3 can look like man after routes distribute." },
    ],
  },
  "football-position-quarterback-intro-level-3": {
    welcome: "Recognition only matters when it connects to the pass concept. Read the defender the play assigns—then protect the football if leverage closes.",
    sourceIds: ["usa-football-qb-coverages", "usa-football-qb-coverage-formula"],
    lessons: [
      { eyebrow: "CONFIRM AFTER THE SNAP", title: "Build a hypothesis. Track rotation. Confirm the structure.", body: "The quarterback uses the pre-snap shell to prepare, then sees where the safeties rotate and how underneath defenders distribute before committing to the throw." },
      { eyebrow: "VS. COVER 2", title: "Read the underneath defender and the deep-half cap.", body: "A high-low concept can stress the flat defender, but the deep safety can close the deeper window. The quarterback reads both levels and moves through the progression when neither throw has safe leverage." },
      { eyebrow: "VS. COVER 3", title: "Use the concept's movement key.", body: "Knowing the defense is three-deep helps locate the likely curl, flat, and hook defenders. The called concept determines which defender the quarterback actually reads; there is no automatic Cover 3 throw." },
      { eyebrow: "VS. MAN", title: "Win with timing and leverage—not a label alone.", body: "The quarterback connects the route concept to the matchup, sees where help is located, and throws on time only when the receiver owns the needed leverage." },
    ],
  },
};

function linebackerLesson(position: Position, advanced: boolean): BeginnerGuide | undefined {
  if (position.name === "Inside Linebacker") {
    const lessons: BeginnerLesson[] = [
      { eyebrow: "START INSIDE", title: "The inside linebacker plays behind the middle of the front.", body: "Watch the blockers and backfield, decide whether the play is a run or pass, and protect the assigned inside space." },
      { eyebrow: "STOP THE RUN", title: "Fit your gap before chasing the ball.", body: "A gap is a space between blockers. The linebacker works toward the assigned gap so one fake or cut does not pull the whole defense out of shape." },
      { eyebrow: "HELP VS. PASS", title: "Linebackers also cover and pressure.", body: "The call may send the inside linebacker into short coverage, toward a receiver, or forward on a blitz. The job changes with the call." },
    ];
    if (advanced) lessons.push({
      eyebrow: "13+ SCHEME LANGUAGE",
      title: "MIKE usually names the middle linebacker in a traditional 4–3.",
      body: "The MIKE often helps relay the call and organize the front from a central alignment. Teams can rename or redistribute that job, so learn the scheme—not just the nickname.",
      terms: [
        { term: "MIKE", meaning: "Traditional name for the middle linebacker." },
        { term: "Off-ball", meaning: "Aligned behind the line of scrimmage instead of directly on it." },
      ],
    });
    return { welcome: "Learn the inside linebacker from alignment and run-pass reads to the advanced MIKE call.", lessons, sourceIds: ["nfl-football-terms"] };
  }

  if (position.name === "Outside Linebacker") {
    const lessons: BeginnerLesson[] = [
      { eyebrow: "START OUTSIDE", title: "The outside linebacker protects the edge.", body: "The edge is the outside boundary of the defensive front. Keeping outside leverage can turn a runner back toward teammates." },
      { eyebrow: "READ THE END", title: "Watch the outside blocker and the backfield.", body: "A block, release, or backfield action helps the linebacker recognize run or pass without abandoning the called job." },
      { eyebrow: "THREE POSSIBLE JOBS", title: "Set the edge, cover, or rush.", body: "Outside linebackers do different things in different defenses. The play call tells the player whether to protect the run, cover space or a receiver, or pressure the quarterback." },
    ];
    if (advanced) lessons.push(
      {
        eyebrow: "13+ 4–3 LANGUAGE",
        title: "SAM is strong side. WILL is weak side.",
        body: "In traditional 4–3 terminology, the SAM aligns to the defense's strength call—commonly the tight-end or extra-blocker side—while the WILL aligns away from it. Modern defenses may define strength or use the names differently.",
        terms: [
          { term: "SAM", meaning: "Traditional strong-side linebacker name." },
          { term: "WILL", meaning: "Traditional weak-side linebacker name." },
        ],
      },
      {
        eyebrow: "13+ ROLE LANGUAGE",
        title: "EDGE is not the same as every outside linebacker.",
        body: "EDGE describes a defender aligned at the outside of the front whose main work includes setting the edge and rushing. A 3–4 defense may list that player as an outside linebacker; a 4–3 defense may list a similar player as a defensive end. Other outside linebackers play off the ball and cover more often.",
      },
    );
    return { welcome: "Learn the outside linebacker first, then add SAM, WILL, and EDGE scheme language on the 13+ path.", lessons, sourceIds: ["nfl-football-terms"] };
  }

  return undefined;
}

function positionLesson(position: Position, sport: Sport, ageBand?: string): BeginnerGuide {
  if (sport.id === "football") {
    const guide = linebackerLesson(position, ageBand === "13-15" || ageBand === "16-17" || ageBand === "18+");
    if (guide) return guide;
  }
  const read = positionReadFor(sport, position);
  const decisionSteps = positionDecisionStepsFor(sport, position);
  return {
    welcome: `Meet the ${position.name} before making game decisions for the role.`,
    lessons: [
      { eyebrow: "YOUR ROLE", title: `What does the ${position.name} do?`, body: `The ${position.name} belongs to ${position.group} and focuses on how to ${position.focus}.` },
      { eyebrow: "YOUR FIRST READ", title: `Read ${read}.`, body: `That role-specific information narrows the ${position.name}'s next decision before the action is committed.` },
      { eyebrow: "YOUR DECISION", title: decisionSteps.join(" · "), body: `This is the repeatable ${sport.name} decision sequence used in the lesson. The exact read changes with the role and game situation.` },
    ],
  };
}

function advancedPositionLesson(module: LearningModule, sport: Sport): BeginnerGuide {
  const craft = craftProfileForSport(sport.id);
  const position = sport.positions.find((candidate) => candidate.name === module.position);
  return {
    welcome: `Build the ${module.position ?? "role"} decision before the quiz. Read ${craft.gamePicture}, protect the role responsibility, then adjust from evidence.`,
    sourceIds: module.sourceIds,
    lessons: module.challenges.slice(0, 4).map((challenge, index) => ({
      eyebrow: `LEVEL ${module.level} · REP ${index + 1}`,
      title: challenge.label,
      body: challenge.explanation,
      terms: index === 0 ? [
        { term: "Role read", meaning: `The ${sport.name} information that shapes this position's decision: ${craft.gamePicture}.` },
        { term: "Responsibility", meaning: position ? `The role requirement protected while reacting: ${position.focus}.` : "The role requirement protected while reacting." },
      ] : undefined,
    })),
  };
}

function gamePathLesson(module: LearningModule, isYoung: boolean): BeginnerGuide {
  return {
    welcome: module.description,
    sourceIds: module.sourceIds,
    lessons: module.challenges.slice(0, 4).map((challenge, index) => ({
      eyebrow: `REP ${index + 1} · ${challenge.label.toUpperCase()}`,
      title: challenge.label,
      body: isYoung
        ? challenge.youngExplanation ?? challenge.explanation
        : challenge.explanation,
    })),
  };
}

export function moduleGuideFor(module: LearningModule, sport: Sport, ageBand?: string): BeginnerGuide | undefined {
  if (module.coreCourse && module.checkpoint) return undefined;
  const courseUnit = module.coreCourse ? coreUnitForModule(module.id) : undefined;
  if (courseUnit) return {
    welcome: courseUnit.goal,
    sourceIds: module.sourceIds,
    lessons: [{ eyebrow: "MEET THE WORDS", title: courseUnit.title, body: module.teachingBrief ?? courseUnit.goal,
      terms: courseUnit.terms.map(([term, meaning]) => ({ term, meaning })) }],
  };
  if (module.pathway === "position") {
    const advancedGuide = QUARTERBACK_MODULE_GUIDES[module.id];
    if (advancedGuide) return advancedGuide;
    if (module.level > 1) return advancedPositionLesson(module, sport);
    const position = sport.positions.find((candidate) => candidate.name === module.position);
    const guide = position ? positionLesson(position, sport, ageBand) : undefined;
    return guide ? { ...guide, sourceIds: guide.sourceIds?.length ? guide.sourceIds : module.sourceIds } : undefined;
  }
  if (module.id === sportPositionsIntroModuleId(sport.id)) {
    return {
      welcome: `Meet the major ${sport.pathLabel?.toLowerCase() ?? "position"} groups before choosing a specialized path.`,
      lessons: positionGroupLessons(sport, ageBand === "7-9"),
      sourceIds: module.sourceIds,
    };
  }
  if (module.id.startsWith("fb-path-")) {
    return gamePathLesson(module, ageBand === "7-9" || ageBand === "10-12");
  }
  const guide = FOOTBALL_MODULE_GUIDES[module.id] ?? beginnerGuideFor(sport.id);
  return guide ? { ...guide, sourceIds: guide.sourceIds?.length ? guide.sourceIds : module.sourceIds } : undefined;
}
