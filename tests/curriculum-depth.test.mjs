import assert from "node:assert/strict";
import test from "node:test";

import {
  SPORTS,
  generalModulesForSport,
  learningModulePathsForSport,
  migrateCompletedModuleIds,
  positionAbbreviation,
  positionModuleId,
  positionModulesForPosition,
  sportProgressSummary,
} from "../app/learning-data.ts";
import { CONTENT_SOURCES } from "../app/content-registry.ts";
import { canStartLearningModule } from "../app/product-governance.ts";

const SAFE_ID = /^[a-z0-9][a-z0-9-]*$/;

test("every sport has age-gated foundation, tactics, and mastery depth", () => {
  assert.equal(SPORTS.length, 24);
  const moduleIds = new Set();
  const knownSourceIds = new Set(CONTENT_SOURCES.map((source) => source.id));
  let positionCount = 0;

  for (const sport of SPORTS) {
    for (const position of sport.positions) {
      positionCount += 1;
      const early = positionModulesForPosition(sport, position, "7-9");
      const preteen = positionModulesForPosition(sport, position, "10-12");
      const teen = positionModulesForPosition(sport, position, "13-15");
      const older = positionModulesForPosition(sport, position, "16-17");
      const adult = positionModulesForPosition(sport, position, "18+");

      assert.equal(early.length, 1, `${sport.name} ${position.name} should keep one early-reader foundation`);
      assert.equal(preteen.length, 1, `${sport.name} ${position.name} should keep one preteen foundation`);
      assert.ok(teen.length >= 2, `${sport.name} ${position.name} needs a tactical level for ages 13+`);
      assert.ok(older.length >= 3, `${sport.name} ${position.name} needs a mastery level for ages 16+`);
      assert.equal(adult.length, older.length, `${sport.name} ${position.name} should expose the full adult path`);

      for (const learningModule of adult) {
        assert.match(learningModule.id, SAFE_ID, `${learningModule.id} must be safe for progress and measurement`);
        assert.equal(moduleIds.has(learningModule.id), false, `${learningModule.id} must be globally unique`);
        moduleIds.add(learningModule.id);
        assert.ok(learningModule.challenges.length >= 4, `${learningModule.id} must provide a complete interaction set`);
        assert.ok(learningModule.sourceIds?.length, `${learningModule.id} must declare its curriculum sources`);
        for (const sourceId of learningModule.sourceIds) assert.equal(knownSourceIds.has(sourceId), true, `${learningModule.id} references unknown source ${sourceId}`);
        for (const challenge of learningModule.challenges) {
          const correct = Array.isArray(challenge.correct) ? challenge.correct : [challenge.correct];
          const available = new Set([...challenge.options, ...(challenge.advancedOptions ?? [])]);
          assert.ok(challenge.prompt.trim().length > 12, `${challenge.id} needs a substantive prompt`);
          assert.ok(challenge.explanation.trim().length > 20, `${challenge.id} needs a teaching explanation`);
          for (const answer of correct) assert.equal(available.has(answer), true, `${challenge.id} must include every correct answer in its options`);
        }
      }
    }
  }

  assert.equal(positionCount, 152);
  assert.equal(moduleIds.size, 456);
});

test("every sport is backed by an authoritative source registry entry", () => {
  const sourcedSports = new Set(CONTENT_SOURCES.map((source) => source.sportId));
  assert.deepEqual(SPORTS.filter((sport) => !sourcedSports.has(sport.id)).map((sport) => sport.id), []);
});

test("paths enforce prerequisites within a position without forcing General IQ", () => {
  const basketball = SPORTS.find((sport) => sport.id === "basketball");
  assert.ok(basketball);
  const paths = learningModulePathsForSport(basketball, "18+");
  const pointGuardPath = paths.find((path) => path.id.endsWith("point-guard"));
  assert.ok(pointGuardPath);
  assert.ok(pointGuardPath.moduleIds.length >= 3);

  const [foundation, tactics, mastery] = pointGuardPath.moduleIds;
  assert.equal(canStartLearningModule({ moduleId: foundation, modulePaths: paths, completedModuleIds: [] }), true);
  assert.equal(canStartLearningModule({ moduleId: tactics, modulePaths: paths, completedModuleIds: [] }), false);
  assert.equal(canStartLearningModule({ moduleId: tactics, modulePaths: paths, completedModuleIds: [foundation] }), true);
  assert.equal(canStartLearningModule({ moduleId: mastery, modulePaths: paths, completedModuleIds: [foundation] }), false);

  const generalIds = paths[0].moduleIds;
  assert.equal(canStartLearningModule({ moduleId: foundation, modulePaths: paths, completedModuleIds: [] }), true);
  assert.equal(generalIds.some((id) => [foundation, tactics, mastery].includes(id)), false);
});

test("home course progress excludes role electives and sparse future receipts", () => {
  const soccer = SPORTS.find((sport) => sport.id === "soccer");
  assert.ok(soccer);
  const eligible = generalModulesForSport(soccer);
  const firstPositionPath = learningModulePathsForSport(soccer, "16-17")[1];
  const completed = [...firstPositionPath.moduleIds.slice(0, 2), eligible[0].id,eligible[1].id,eligible[9].id];
  const summary = sportProgressSummary(soccer, "16-17", completed);

  assert.equal(summary.totalModules, eligible.length);
  assert.equal(summary.completedModules, 2);
  assert.equal(summary.percent, Math.round((2 / eligible.length) * 100));
  assert.equal(summary.started, true);
});

test("legacy unsafe IDs migrate without erasing progress", () => {
  const migrated = migrateCompletedModuleIds([
    "flag-football-position-center-/-snapper-intro",
    "flag-football-position-receiver-intro",
  ]);
  assert.deepEqual(migrated, [
    "flag-football-position-center-snapper-intro",
    "flag-football-position-receiver-intro",
  ]);
  assert.equal(positionModuleId("flag-football", "Center / Snapper"), migrated[0]);
});

test("football uses explicit, conventional position abbreviations", () => {
  const football = SPORTS.find((sport) => sport.id === "football");
  assert.ok(football);
  const expected = {
    Quarterback: "QB",
    Fullback: "FB",
    "Left Tackle": "LT",
    "Left Guard": "LG",
    Center: "C",
    "Right Guard": "RG",
    "Right Tackle": "RT",
    "Inside Linebacker": "ILB",
    "Outside Linebacker": "OLB",
    Cornerback: "CB",
    Returner: "KR/PR",
  };
  for (const [name, abbreviation] of Object.entries(expected)) {
    const position = football.positions.find((candidate) => candidate.name === name);
    assert.ok(position);
    assert.equal(positionAbbreviation(position), abbreviation);
  }
});
