import type { Challenge, LearningModule } from "./learning-data.ts";
import { COURSE_BLANKS } from "./course-blanks.ts";
import { COURSE_CHECKPOINTS } from "./course-checkpoints.ts";
import { COURSE_FACTS } from "./course-facts.ts";
import { FORMATION_EXERCISES, formationTargets } from "./course-formations.ts";

export const CORE_SPORT_IDS = ["football", "basketball", "baseball", "soccer", "volleyball"] as const;
export type CoreSportId = typeof CORE_SPORT_IDS[number];
export const COURSE_SECTIONS = [
  { title: "Meet the game", outcome: "Know the goal, the playing area, and how many players take part.", icon: "flag-outline" },
  { title: "Follow the action", outcome: "Follow a play from its start to its finish.", icon: "play-circle-outline" },
  { title: "Know the rules", outcome: "Understand scores, common fouls, and restarts.", icon: "book-open-variant" },
  { title: "Meet the attacking roles", outcome: "Find each attacking role and explain its job.", icon: "account-group-outline" },
  { title: "Meet the defending roles", outcome: "Find each defending role and explain its job.", icon: "shield-outline" },
  { title: "Build your skills", outcome: "Choose a basic skill and explain when it helps.", icon: "arm-flex-outline" },
  { title: "Work as a team", outcome: "Connect your job with the players around you.", icon: "account-group-outline" },
  { title: "Read the game", outcome: "Use space, time, and the opponent's movement to choose a response.", icon: "strategy" },
  { title: "Solve the next problem", outcome: "Recognize pressure and use a practiced answer.", icon: "lightbulb-outline" },
  { title: "Advanced game decisions", outcome: "Compare options and adjust when the opponent changes the plan.", icon: "trophy-outline" },
] as const;

export type CourseDecision = { prompt: string; answer: string; others: [string, string]; why: string };
export type CourseTerm = [term: string, meaning: string];
export type CourseUnit = {
  slug: string;
  title: string;
  goal: string;
  terms: CourseTerm[];
  decisions: CourseDecision[];
  sequence: string[];
  sequencePrompt: string;
  ruleNote?: string;
};
export type CourseSection = { id: string; title: string; outcome: string; unitIds: string[] };
export type CoreCourse = { sportId: CoreSportId; rules: string; sources: string[]; units: CourseUnit[]; sections?: CourseSection[] };
export function d(prompt: string, answer: string, other: string, another: string, why: string): CourseDecision {
  return { prompt, answer, others: [other, another], why };
}
export function u(slug: string, title: string, goal: string, terms: CourseUnit["terms"], decisions: CourseUnit["decisions"], sequence: CourseUnit["sequence"], sequencePrompt = "Put these steps in order.", ruleNote?: string): CourseUnit {
  return { slug, title, goal, terms, decisions, sequence, sequencePrompt, ruleNote };
}

// Content is authored in sport files. This compiler changes the exercise format,
// not its difficulty. Difficulty comes from the decisions and prerequisites.
export function compileCourse(course: CoreCourse): LearningModule[] {
  if (!course.sections?.length) throw new Error(`Missing authored sections for ${course.sportId}`);
  return course.units.flatMap((unit, index): LearningModule[] => {
    if(unit.terms.length<2||!unit.decisions.length||unit.sequence.length<2)throw new Error(`Incomplete teaching unit ${course.sportId}/${unit.slug}`);
    const moduleId = `rq-${course.sportId}-${unit.slug}`;
    const section = course.sections!.findIndex((entry) => entry.unitIds.includes(unit.slug));
    if (section < 0) throw new Error(`Unplaced unit: ${course.sportId}/${unit.slug}`);
    const sectionSpec = course.sections![section];
    const base = { label: unit.title, xp: 10 };
    const challenges: Challenge[] = unit.terms.map(([term, meaning], termIndex) => ({
      ...base,
      id: `${moduleId}-name-${termIndex}`,
      conceptId: `${moduleId}-term-${termIndex}`,
      type: "cards",
      prompt: termIndex === 0 && index === 0 ? "Pick the word that fits." : "Which word fits this meaning?",
      instruction: meaning,
      options: unit.terms.map(([name]) => name),
      correct: term,
      explanation: `${term}: ${meaning}`,
      hint: `Think about what ${term.toLowerCase()} means.`,
    }));
    const formation = FORMATION_EXERCISES[`${course.sportId}:${unit.slug}`];
    if(formation) challenges.push({...base,id:`${moduleId}-formation`,conceptId:`${moduleId}-location`,type:"formation",
      prompt:`Which marked player is the ${formation.roleName}?`,formation,
      options:["A","B","C"],correct:formationTargets(formation).find((target)=>target.role===formation.targetRole)!.label,explanation:formation.why,
      remediation:{...base,id:`${moduleId}-formation-remediate`,conceptId:`${moduleId}-location`,type:"formation",prompt:`Find the ${formation.roleName}.`,formation,options:["A","B","C"],correct:formationTargets(formation).find((target)=>target.role===formation.targetRole)!.label,explanation:formation.why,instruction:formation.why}});
    const first = unit.terms[0];
    const blank = COURSE_BLANKS[`${course.sportId}:${unit.slug}`];
    challenges.push({
      ...base, id: `${moduleId}-blank`, conceptId: `${moduleId}-term-0`, type: "blank",
      prompt: "Fill the gap.", instruction: blank ? undefined : first[1],
      sentence: blank?.sentence ?? `The word for this is _____.`,
      options: blank?.options ?? unit.terms.map(([term]) => term), correct: blank?.answer ?? first[0],
      explanation: blank ? blank.sentence.replace("_____",blank.answer) : `${first[0]} means ${first[1][0].toLowerCase()}${first[1].slice(1)}`,
    });
    const fact=COURSE_FACTS[`${course.sportId}:${unit.slug}`];
    if(fact) challenges.push({...base,id:`${moduleId}-rule`,conceptId:`${moduleId}-rule`,type:"choice",label:"One rule to know",instruction:fact.teach,
      prompt:fact.prompt,options:fact.options,correct:fact.answer,explanation:fact.teach});
    challenges.push({
      ...base, id: `${moduleId}-match`, conceptId: `${moduleId}-connections`, type: "match",
      prompt: "Match each pair.", options: unit.terms.map(([term]) => term),
      pairs: unit.terms.map(([term, meaning]) => ({ left: term, right: meaning })),
      correct: unit.terms.map(([term, meaning]) => `${term}::${meaning}`),
      explanation: unit.terms.map(([term, meaning]) => `${term}: ${meaning}`).join(" "),
    });
    unit.decisions.forEach((decision, decisionIndex) => challenges.push({
      ...base, id: `${moduleId}-decision-${decisionIndex}`, conceptId: `${moduleId}-decision-${decisionIndex}`,
      type: "scenario", prompt: decision.prompt,
      options: [decision.answer, ...decision.others], correct: decision.answer, explanation: decision.why,
      hint: decision.why,
      remediation: { ...base, id: `${moduleId}-decision-${decisionIndex}-remediate`, conceptId: `${moduleId}-decision-${decisionIndex}`, type: "choice",
        prompt: decision.prompt, instruction: decision.why, options: [decision.answer, ...decision.others], correct: decision.answer, explanation: decision.why },
    }));
    challenges.push({
      ...base, id: `${moduleId}-order`, conceptId: `${moduleId}-sequence`, type: "ordering",
      prompt: unit.sequencePrompt, options: [...unit.sequence], correct: [...unit.sequence],
      explanation: unit.sequence.map((step,stepIndex)=>`${stepIndex+1}. ${step}`).join(" "),
    });
    if (index > 0) {
      const previous = course.units[index - 1];
      const rememberedIndex=index%previous.decisions.length;
      const remembered = previous.decisions[rememberedIndex];
      challenges.push({ ...base, id: `${moduleId}-recall`, conceptId: `rq-${course.sportId}-${previous.slug}-decision-${rememberedIndex}`,
        type: "choice", label: "Remember this?", prompt: remembered.prompt,
        options: [remembered.answer, ...remembered.others], correct: remembered.answer, explanation: remembered.why });
    }
    if (index >= 3) {
      const older = course.units[index - 3];
      const review = older.decisions[0];
      challenges.push({ ...base,id:`${moduleId}-spaced-review`,conceptId:`rq-${course.sportId}-${older.slug}-decision-0`,type:"choice",label:"Bring it back",
        prompt:review.prompt,options:[review.answer,...review.others],correct:review.answer,explanation:review.why });
    }
    for(const challenge of challenges) if(!challenge.remediation) {
      challenge.remediation={...challenge,id:`${challenge.id}-remediate`,label:"Try again",instruction:challenge.explanation,remediation:undefined};
    }
    const lesson: LearningModule = { id: moduleId, sportId: course.sportId, level: section + 1, pathway: "general", title: unit.title,
      description: unit.goal, estimatedMinutes: 4, sourceIds: course.sources, challenges,
      courseSection: section, courseUnit: index, ruleContext: unit.ruleNote ?? course.rules, coreCourse: true };
    if (index === 0) lesson.teachingBrief = {
      football: "Each team has 11 players on the field. Run or pass the ball toward the other team's end zone.",
      basketball: "Each team has five players on the court. Pass the ball or bounce it as you move toward the other team's basket.",
      baseball: "Nine defenders take the field. The other team bats, one hitter at a time, and tries to score runs.",
      soccer: "Each team has 11 players, including a goalkeeper. Move the ball toward the other team's goal.",
      volleyball: "Each team has six players. Send the ball over the net and try to make it land in the other team's court.",
    }[course.sportId];
    if (sectionSpec.unitIds.at(-1) !== unit.slug) return [lesson];
    const checkpointId = `rq-${course.sportId}-check-${sectionSpec.id}`;
    const checkpointUnits = course.units.filter((entry) => sectionSpec.unitIds.includes(entry.slug));
    const checks = checkpointUnits.flatMap((entry) => entry.decisions.map((decision, decisionIndex): Challenge => ({
      ...base, id: `${checkpointId}-${entry.slug}-${decisionIndex}`, conceptId: `rq-${course.sportId}-${entry.slug}-decision-${decisionIndex}`,
      type: "scenario", label: "Game day", prompt: decision.prompt,
      options: [decision.answer, ...decision.others], correct: decision.answer, explanation: decision.why,
      remediation: { ...base, id: `${checkpointId}-${entry.slug}-${decisionIndex}-remediate`, conceptId: `rq-${course.sportId}-${entry.slug}-decision-${decisionIndex}`,
        type: "choice", label: "Try again", prompt: decision.prompt, instruction: decision.why,
        options: [decision.answer, ...decision.others], correct: decision.answer, explanation: decision.why },
    })));
    const transfer=COURSE_CHECKPOINTS[course.sportId][section];
    checks.unshift({...base,id:`${checkpointId}-new-situation`,conceptId:`${checkpointId}-transfer`,type:"scenario",label:"New situation",prompt:transfer.prompt,
      options:[transfer.answer,...transfer.others],correct:transfer.answer,explanation:transfer.why});
    return [lesson, { id: checkpointId, sportId: course.sportId, level: section + 1, pathway: "general", title: `${sectionSpec.title}: Game day`,
      description: sectionSpec.outcome, estimatedMinutes: 4, sourceIds: course.sources,
      challenges: checks, courseSection: section, courseUnit: index, ruleContext: course.rules, coreCourse: true, checkpoint: true }];
  });
}

export function courseModuleStates(modules: LearningModule[], completedIds: string[]) {
  const completed = new Set(completedIds);
  let frontierFound = false;
  return modules.map((module) => {
    if (frontierFound) return "locked" as const;
    if (completed.has(module.id)) return "complete" as const;
    frontierFound = true;
    return "current" as const;
  });
}
