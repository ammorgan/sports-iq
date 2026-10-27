import assert from "node:assert/strict";
import test from "node:test";
import { learningConceptLabel } from "../app/learning-labels.ts";
import { coreModulesForSport } from "../app/courses/index.ts";

test("progress labels describe the skill instead of displaying storage IDs", () => {
  const modules = coreModulesForSport("football");
  const [first] = modules;
  const term = first.challenges.find((entry) => entry.type === "cards");
  assert.equal(learningConceptLabel(term.conceptId, modules), term.correct);
  const match = first.challenges.find((entry) => entry.type === "match");
  assert.equal(learningConceptLabel(match.conceptId, modules), "Match the terms");
  const sequence = first.challenges.find((entry) => entry.type === "ordering");
  assert.equal(learningConceptLabel(sequence.conceptId, modules), "Put the steps in order");
  assert.equal(learningConceptLabel("retired-private-id", modules), "Game practice");
});
