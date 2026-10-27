import assert from "node:assert/strict";
import test from "node:test";

import { CONTENT_SOURCES } from "../app/content-registry.ts";
import { CORE_COURSES } from "../app/courses/index.ts";
import { TACKLE_FOOTBALL_FIND_END_ZONE_PATH } from "../app/football-game-path.ts";
import {
  SPORTS,
  generalModulesForSport,
  learningModulePathsForSport,
  remediationChallengeFor,
} from "../app/learning-data.ts";
import {
  gamePathModules,
  gamePathNodeStates,
  gamePathProgress,
  gamePathUnitFromContent,
} from "../app/game-path.ts";

const SAFE_ID = /^[a-z0-9][a-z0-9-]*$/;

const EXPECTED_NODE_IDS = [
  "football-general-see-the-field-film",
  "football-general-start-the-play-audio",
  "football-general-move-the-chains-field-read",
  "football-general-build-the-team-match",
  "football-general-finish-the-drive-scenario",
  "football-general-score-possession-review",
  "football-general-game-situation-checkpoint",
  "football-general-find-the-end-zone-boss",
];

const EXPECTED_MODULE_IDS = [
  "fb-path-see-the-field",
  "fb-fundamentals-field",
  "fb-path-move-the-chains",
  "fb-rookie-units",
  "fb-path-finish-the-drive",
  "fb-fundamentals-score",
  "fb-path-game-situation-checkpoint",
  "fb-path-find-the-end-zone-boss",
];

test("tackle football is an eight-node learning path with meaningful interaction depth", () => {
  const path = TACKLE_FOOTBALL_FIND_END_ZONE_PATH;

  assert.equal(path.nodes.length, 8);
  assert.deepEqual(path.nodes.map((node) => node.id), EXPECTED_NODE_IDS);
  assert.deepEqual(
    path.nodes.map((node) => node.kind),
    ["film", "audio", "field-read", "match", "scenario", "review", "checkpoint", "boss"],
  );

  for (const node of path.nodes) {
    assert.ok(
      node.module.challenges.length >= 6,
      `${node.id} needs at least six interactions instead of a four-question card`,
    );
  }

  assert.ok(
    path.nodes.reduce((total, node) => total + node.module.challenges.length, 0) >= 48,
    "the complete unit needs at least 48 authored interactions",
  );
});

test("football path IDs, explanations, answers, and curriculum sources are production-safe", () => {
  const path = TACKLE_FOOTBALL_FIND_END_ZONE_PATH;
  const knownSourceIds = new Set(CONTENT_SOURCES.map((source) => source.id));
  const allIds = [
    path.id,
    ...path.nodes.flatMap((node) => [
      node.id,
      node.module.id,
      ...node.module.challenges.map((challenge) => challenge.id),
    ]),
  ];

  for (const id of allIds) assert.match(id, SAFE_ID, `${id} must be safe for persistence and measurement`);
  assert.equal(new Set(allIds).size, allIds.length, "path, node, module, and challenge IDs must be unique");

  for (const node of path.nodes) {
    assert.ok(node.sourceIds.length > 0, `${node.id} must declare curriculum sources`);
    assert.ok(node.module.sourceIds?.length, `${node.module.id} must declare curriculum sources`);
    assert.deepEqual(node.module.sourceIds, node.sourceIds, `${node.id} must expose the same sources as its module`);

    for (const sourceId of node.sourceIds) {
      assert.equal(knownSourceIds.has(sourceId), true, `${node.id} references unknown source ${sourceId}`);
    }

    for (const challenge of node.module.challenges) {
      const correctAnswers = Array.isArray(challenge.correct) ? challenge.correct : [challenge.correct];
      const availableAnswers = new Set([
        ...challenge.options,
        ...(challenge.advancedOptions ?? []),
      ]);

      assert.ok(challenge.prompt.trim().length > 12, `${challenge.id} needs a substantive prompt`);
      assert.ok(challenge.explanation.trim().length > 20, `${challenge.id} needs a teaching explanation`);
      assert.ok(challenge.youngPrompt?.trim().length > 8, `${challenge.id} needs an early-reader prompt`);
      assert.ok(challenge.youngExplanation?.trim().length > 12, `${challenge.id} needs an early-reader explanation`);
      for (const answer of correctAnswers) {
        assert.equal(availableAnswers.has(answer), true, `${challenge.id} must include every correct answer in its options`);
      }
    }
  }
});

test("authored order and existing football completion receipts survive path conversion", () => {
  const unit = gamePathUnitFromContent(TACKLE_FOOTBALL_FIND_END_ZONE_PATH);

  assert.deepEqual(unit.nodes.map((node) => node.id), EXPECTED_NODE_IDS);
  assert.deepEqual(gamePathModules(unit).map((module) => module.id), EXPECTED_MODULE_IDS);

  const initialStates = gamePathNodeStates(unit, []);
  assert.equal(initialStates.get(EXPECTED_NODE_IDS[0]), "current");
  assert.deepEqual(
    EXPECTED_NODE_IDS.slice(1).map((nodeId) => initialStates.get(nodeId)),
    Array(7).fill("locked"),
  );

  const preservedLegacyReceipt = "fb-fundamentals-field";
  const preservedStates = gamePathNodeStates(unit, [preservedLegacyReceipt]);
  assert.equal(preservedStates.get(EXPECTED_NODE_IDS[0]), "current");
  assert.equal(preservedStates.get(EXPECTED_NODE_IDS[1]), "locked");
  assert.deepEqual(gamePathProgress(unit, [preservedLegacyReceipt]), {
    completed: 0,
    total: 8,
    percent: 0,
    currentNode: unit.nodes[0],
  });

  const sparseOldReceipts = [EXPECTED_MODULE_IDS[0], EXPECTED_MODULE_IDS[4]];
  assert.deepEqual(
    EXPECTED_NODE_IDS.map((nodeId) => gamePathNodeStates(unit, sparseOldReceipts).get(nodeId)),
    ["complete", "current", "locked", "locked", "locked", "locked", "locked", "locked"],
  );

  const firstTwoModuleReceipts = EXPECTED_MODULE_IDS.slice(0, 2);
  const advancedStates = gamePathNodeStates(unit, firstTwoModuleReceipts);
  assert.equal(advancedStates.get(EXPECTED_NODE_IDS[0]), "complete");
  assert.equal(advancedStates.get(EXPECTED_NODE_IDS[1]), "complete");
  assert.equal(advancedStates.get(EXPECTED_NODE_IDS[2]), "current");

  assert.deepEqual(gamePathProgress(unit, EXPECTED_MODULE_IDS), {
    completed: 8,
    total: 8,
    percent: 100,
    currentNode: null,
  });
});

test("the new football course replaces the pilot without reusing old completion IDs", () => {
  const football = SPORTS.find((sport) => sport.id === "football");
  assert.ok(football);

  const catalogModuleIds = generalModulesForSport(football).map((module) => module.id);
  const generalPath = learningModulePathsForSport(football, "18+").find((path) => path.id === "football-general");

  const course=CORE_COURSES.find((entry)=>entry.sportId==="football");
  assert.equal(catalogModuleIds.length, course.units.length+course.sections.length);
  assert.equal(catalogModuleIds[0], "rq-football-meet-the-game");
  assert.equal(catalogModuleIds.at(-1), "rq-football-check-advanced");
  assert.equal(catalogModuleIds.some((id) => EXPECTED_MODULE_IDS.includes(id)), false);
  assert.ok(generalPath);
  assert.deepEqual(generalPath.moduleIds, catalogModuleIds);
});

test("a missed football read returns as a coached, non-recursive replay", () => {
  const original = TACKLE_FOOTBALL_FIND_END_ZONE_PATH.nodes[0].module.challenges[0];
  const replay = remediationChallengeFor(original, "10-12");

  assert.equal(replay.id, `${original.id}-remediate`);
  assert.match(replay.youngPrompt, /Coach feedback:/);
  assert.match(replay.youngPrompt, /Try it again:/);
  assert.deepEqual(replay.correct, original.correct);
  assert.equal(replay.remediation, undefined);
  assert.ok(replay.xp < original.xp, "a replay should not be worth as much as the first read");
});
