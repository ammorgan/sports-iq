import type { LearningModule } from "./learning-data.ts";

// Storage IDs are stable bookkeeping, not player-facing skill names.
export function learningConceptLabel(conceptId: string, modules: LearningModule[]): string {
  for (const learningModule of modules) {
    const challenge = learningModule.challenges.find((entry) => entry.conceptId === conceptId);
    if (!challenge) continue;
    if (["cards", "blank"].includes(challenge.type) && typeof challenge.correct === "string") return challenge.correct;
    if (challenge.type === "match") return "Match the terms";
    if (challenge.type === "ordering") return "Put the steps in order";
    if (challenge.type === "formation") return "Find the player";
    return challenge.prompt;
  }
  return "Game practice";
}
