import assert from "node:assert/strict";
import test from "node:test";

import {
  SPORTS,
  generalModulesForSport,
  positionDecisionStepsFor,
  positionModulesForSport,
  positionReadFor,
} from "../app/learning-data.ts";
import { moduleGuideFor } from "../app/module-guides.ts";
import { craftProfileForSport } from "../app/position-curriculum.ts";

const wordCount = (value) => value.trim().split(/\s+/).filter(Boolean).length;
const BANNED_GENERIC_LANGUAGE = /\bclues?\b|decide what the clue means|do your job|play smart|smart choice|picture clue/i;
const MULTIPART_QUESTION = /\b(?:what|which|where|when|how)\b[^?]*(?:\band\b|,\s*then\b)[^?]*\b(?:what|which|where|when|how)\b/i;

function curriculum() {
  const modules = SPORTS.flatMap((sport) => [
    ...generalModulesForSport(sport),
    ...positionModulesForSport(sport, "18+"),
  ]);
  const challenges = [...new Map(modules.flatMap((module) => module.challenges).map((challenge) => [challenge.id, challenge])).values()];
  return { modules, challenges };
}

function answerLengthStats(challenges, optionSource) {
  const singleAnswer = challenges
    .filter((challenge) => !Array.isArray(challenge.correct))
    .map((challenge) => ({
      ...challenge,
      selectedOptions: optionSource(challenge),
    }));
  const uniquelyLongest = singleAnswer.filter((challenge) => {
    const correctLength = wordCount(challenge.correct);
    const distractorLengths = challenge.selectedOptions
      .filter((option) => option !== challenge.correct)
      .map(wordCount);
    return distractorLengths.length > 0 && correctLength > Math.max(...distractorLengths);
  });
  const severeBias = singleAnswer.filter((challenge) => {
    const correctLength = wordCount(challenge.correct);
    const distractorLengths = challenge.selectedOptions
      .filter((option) => option !== challenge.correct)
      .map(wordCount);
    const averageDistractor = distractorLengths.reduce((total, length) => total + length, 0) / distractorLengths.length;
    return distractorLengths.length > 0 && correctLength >= averageDistractor * 1.5 && correctLength - averageDistractor >= 3;
  });
  return {
    uniquelyLongestRatio: uniquelyLongest.length / singleAnswer.length,
    severeBiasRatio: severeBias.length / singleAnswer.length,
  };
}

test("questions ask one concise decision without answer-length giveaways", () => {
  const { challenges } = curriculum();

  for (const challenge of challenges) {
    assert.ok(wordCount(challenge.prompt) <= 24, `${challenge.id} prompt is longer than 24 words`);
    assert.equal((challenge.prompt.match(/\?/g) ?? []).length <= 1, true, `${challenge.id} asks more than one question`);
    assert.doesNotMatch(challenge.prompt, MULTIPART_QUESTION, `${challenge.id} combines multiple decisions in one prompt`);
    assert.doesNotMatch(`${challenge.label} ${challenge.prompt} ${challenge.youngPrompt ?? ""}`, BANNED_GENERIC_LANGUAGE, `${challenge.id} uses generic classroom language`);
  }

  const base = answerLengthStats(challenges, (challenge) => challenge.options);
  const advanced = answerLengthStats(challenges, (challenge) => challenge.advancedOptions?.length ? challenge.advancedOptions : challenge.options);
  assert.ok(base.uniquelyLongestRatio <= 0.06, `base correct answer is uniquely longest in ${(base.uniquelyLongestRatio * 100).toFixed(1)}% of questions`);
  assert.ok(advanced.uniquelyLongestRatio <= 0.06, `advanced correct answer is uniquely longest in ${(advanced.uniquelyLongestRatio * 100).toFixed(1)}% of questions`);
  assert.ok(base.severeBiasRatio <= 0.02, `base answer-length bias is ${(base.severeBiasRatio * 100).toFixed(1)}%`);
  assert.ok(advanced.severeBiasRatio <= 0.02, `advanced answer-length bias is ${(advanced.severeBiasRatio * 100).toFixed(1)}%`);
});

test("every position path uses sport-specific reads and coach decision language", () => {
  for (const sport of SPORTS) {
    assert.ok(craftProfileForSport(sport.id), `${sport.name} needs a coach terminology profile`);
    for (const position of sport.positions) {
      const read = positionReadFor(sport, position);
      const steps = positionDecisionStepsFor(sport, position);
      assert.equal(read.startsWith("the action developing around"), false, `${sport.name} ${position.name} is using the fallback read`);
      assert.equal(steps.length, 4, `${sport.name} ${position.name} needs a four-step decision sequence`);
      assert.doesNotMatch(`${read} ${steps.join(" ")}`, BANNED_GENERIC_LANGUAGE, `${sport.name} ${position.name} uses generic classroom language`);
    }
  }
});

test("player-facing guides use coach language, including the quarterback sequence", () => {
  const { modules } = curriculum();
  for (const learningModule of modules) {
    const sport = SPORTS.find((candidate) => candidate.id === learningModule.sportId);
    assert.ok(sport);
    const guide = moduleGuideFor(learningModule, sport, "18+");
    if (!guide) continue;
    const guideText = [
      guide.welcome,
      ...guide.lessons.flatMap((lesson) => [lesson.eyebrow, lesson.title, lesson.body, ...(lesson.terms ?? []).flatMap((term) => [term.term, term.meaning])]),
    ].join(" ");
    assert.doesNotMatch(guideText, BANNED_GENERIC_LANGUAGE, `${learningModule.id} guide uses generic classroom language`);
  }

  const football = SPORTS.find((sport) => sport.id === "football");
  assert.ok(football);
  const quarterback = football.positions.find((position) => position.name === "Quarterback");
  assert.ok(quarterback);
  const quarterbackLanguage = positionDecisionStepsFor(football, quarterback).join(" ").toLowerCase();
  for (const term of ["safety shell", "box count", "post-snap rotation", "leverage", "protection", "progression"]) {
    assert.match(quarterbackLanguage, new RegExp(term), `quarterback sequence is missing ${term}`);
  }
});
