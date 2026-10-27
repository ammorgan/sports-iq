import test from "node:test";
import assert from "node:assert/strict";

import {
  gamePathModules,
  gamePathNodeStates,
  gamePathProgress,
  gamePathStageState,
  gamePathStageTarget,
  migrateGamePathCompletionIds,
} from "../app/game-path.ts";

const moduleFor = (id) => ({
  id,
  sportId: "football",
  level: 0,
  pathway: "general",
  title: id,
  description: id,
  estimatedMinutes: 3,
  challenges: [],
});

const unit = {
  id: "football-find-the-end-zone",
  sportId: "football",
  track: "general",
  title: "Find the End Zone",
  objective: "Move the ball, score, and identify the three units.",
  nodes: [
    { id: "film-room", kind: "film", title: "Film Room", shortLabel: "FILM", description: "Watch", module: moduleFor("film-room") },
    { id: "field-read", kind: "field-read", title: "Field Read", shortLabel: "READ", description: "Read", module: moduleFor("field-read"), legacyCompletionIds: ["old-field"] },
    { id: "game-day", kind: "boss", title: "Game Day", shortLabel: "BOSS", description: "Play", module: moduleFor("game-day") },
  ],
};

test("game path exposes one clear current node and locks the future", () => {
  const initial = gamePathNodeStates(unit, []);
  assert.deepEqual([...initial.values()], ["current", "locked", "locked"]);

  const advanced = gamePathNodeStates(unit, ["film-room"]);
  assert.deepEqual([...advanced.values()], ["complete", "current", "locked"]);
});

test("legacy completions preserve receipts without skipping prerequisites", () => {
  const migrated = migrateGamePathCompletionIds([unit], ["old-field"]);
  assert.deepEqual(new Set(migrated), new Set(["old-field", "field-read"]));
  assert.deepEqual([...gamePathNodeStates(unit, migrated).values()], ["current", "locked", "locked"]);

  assert.deepEqual(
    [...gamePathNodeStates(unit, [...migrated, "film-room"]).values()],
    ["complete", "complete", "current"],
  );
});

test("sparse completion receipts remain latent beyond the first unfinished node", () => {
  assert.deepEqual(
    [...gamePathNodeStates(unit, ["film-room", "game-day"]).values()],
    ["complete", "current", "locked"],
  );
  assert.deepEqual(gamePathProgress(unit, ["film-room", "game-day"]), {
    completed: 1,
    total: 3,
    percent: 33,
    currentNode: unit.nodes[1],
  });

  assert.deepEqual(
    [...gamePathNodeStates(unit, ["film-room", "field-read", "game-day"]).values()],
    ["complete", "complete", "complete"],
  );
});

test("game path progress and module projection share the authored order", () => {
  assert.deepEqual(gamePathModules(unit).map((module) => module.id), ["film-room", "field-read", "game-day"]);
  assert.deepEqual(gamePathProgress(unit, ["film-room"]), {
    completed: 1,
    total: 3,
    percent: 33,
    currentNode: unit.nodes[1],
  });
});

test("journey stages project the same sequential state and current target as their nodes", () => {
  const states = gamePathNodeStates(unit, ["film-room"]);
  assert.equal(gamePathStageState(unit.nodes.slice(0, 2), states), "current");
  assert.equal(gamePathStageTarget(unit.nodes.slice(0, 2), states)?.id, "field-read");
  assert.equal(gamePathStageState(unit.nodes.slice(2), states), "locked");
  assert.equal(gamePathStageTarget(unit.nodes.slice(0, 1), states)?.id, "film-room");
});
