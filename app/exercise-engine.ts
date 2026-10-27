import type { Challenge } from "./learning-data.ts";

export type MatchingSide = "left" | "right";
export type MatchingSelection = { side: MatchingSide; value: string } | null;

// Keep canonical pairs independent of the side the player taps first.
export function selectMatchingItem(selected: string[], pending: MatchingSelection, side: MatchingSide, value: string): { selected: string[]; pending: MatchingSelection } {
  if (!pending || pending.side === side) {
    return { selected, pending: pending?.value === value ? null : { side, value } };
  }
  const left = side === "left" ? value : pending.value;
  const right = side === "right" ? value : pending.value;
  const remaining = selected.filter((entry) => {
    const [pairedLeft, pairedRight] = entry.split("::");
    return pairedLeft !== left && pairedRight !== right;
  });
  return { selected: [...remaining, `${left}::${right}`], pending: null };
}

export function coreRetryChallenge(challenge:Challenge,attemptKey:number):Challenge {
  const source=challenge.remediation??challenge;
  return {...source,id:`${challenge.id.split("-retry-")[0]}-retry-${attemptKey}`,label:"Try again",
    instruction:challenge.explanation,remediation:undefined};
}

export function matchingRightOptions(challenge:Challenge) {
  const hash=(value:string)=>Array.from(value).reduce((total,char)=>(Math.imul(total,31)+char.charCodeAt(0))>>>0,7);
  return [...(challenge.pairs??[])].sort((a,b)=>hash(`${challenge.id}:${a.right}`)-hash(`${challenge.id}:${b.right}`)).map((pair)=>pair.right);
}

export function formattedCorrectAnswer(challenge:Challenge) {
  const expected=Array.isArray(challenge.correct)?challenge.correct:[challenge.correct];
  return expected.map((answer)=>answer.replace("::"," — ")).join(challenge.type==="ordering"?" → ":"; ");
}

export function exerciseInstruction(challenge:Challenge) {
  if(challenge.type === "formation") return "Tap a marked player, or choose its letter below.";
  if(challenge.type === "match") return "Start on either side. Tap two items that match.";
  if(challenge.type === "multi") return "Choose every answer that fits.";
  if(challenge.type === "ordering") return "Tap the steps in order. Tap a picked step to undo it.";
  if(challenge.type === "blank") return "Pick a word or number for the gap.";
  return "Choose one answer.";
}

export function isChallengeAnswerCorrect(challenge: Challenge, selected: string[]) {
  const expected = Array.isArray(challenge.correct) ? challenge.correct : [challenge.correct];
  if (selected.length !== expected.length || new Set(selected).size !== selected.length) return false;
  return challenge.type === "ordering"
    ? expected.every((answer,index) => selected[index] === answer)
    : expected.every((answer) => selected.includes(answer));
}

export function hasRecoveredCoreLesson(required: Challenge[], results: Array<{conceptId:string;correct:boolean}>) {
  if (!required.length) return false;
  const recovered = new Set(results.filter((result)=>result.correct).map((result)=>result.conceptId));
  return required.every((challenge)=>recovered.has(challenge.conceptId));
}
