import assert from "node:assert/strict";
import test from "node:test";

import {
  appendProductEvent,
  calculateCompletionAward,
  canStartLearningModule,
  completedRequiredQuestions,
  createLegalAcceptance,
  pruneProductEvents,
} from "../app/product-governance.ts";

test("child product measurement is off even if a client claims opt-in", () => {
  const events = appendProductEvent([], {
    name: "sport_opened",
    surface: "mobile",
    ageBand: "7-9",
    sportId: "football",
  }, { accountKind: "child", preference: "product-improvement" });
  assert.deepEqual(events, []);
});

test("opted-in older players produce only allowlisted coarse dimensions", () => {
  const events = appendProductEvent([], {
    name: "module_completed",
    surface: "web",
    ageBand: "18+",
    sportId: "football",
    moduleId: "football-foundations",
    outcome: "completed",
    step: 4,
    totalSteps: 4,
    occurredAt: "2026-08-11T12:00:00.000Z",
  }, { accountKind: "self", preference: "product-improvement" }, new Date("2026-08-11T12:00:00.000Z"));
  assert.equal(events.length, 1);
  assert.deepEqual(Object.keys(events[0]).sort(), ["ageBand", "moduleId", "name", "occurredAt", "outcome", "schemaVersion", "sportId", "step", "surface", "totalSteps"].sort());
});

test("general modules stay sequential while Position IQ remains an open parallel path", () => {
  const contract = { modulePaths: [{ id: "general", moduleIds: ["one", "two", "three"] }, { id: "quarterback", moduleIds: ["quarterback", "coverage"] }], completedModuleIds: ["one"] };
  assert.equal(canStartLearningModule({ ...contract, moduleId: "two" }), true);
  assert.equal(canStartLearningModule({ ...contract, moduleId: "three" }), false);
  assert.equal(canStartLearningModule({ ...contract, moduleId: "quarterback", completedModuleIds: [] }), true);
  assert.equal(canStartLearningModule({ ...contract, moduleId: "coverage", completedModuleIds: [] }), false);
  assert.equal(canStartLearningModule({ ...contract, moduleId: "unknown" }), false);
});

test("XP is awarded once and completion requires every planned question", () => {
  assert.deepEqual(calculateCompletionAward({ answerXp: 40, completionBonus: 35, perfectBonus: 50, alreadyCompleted: false }), { xpAwarded: 125, bonusAwarded: 85, firstCompletion: true });
  assert.deepEqual(calculateCompletionAward({ answerXp: 40, completionBonus: 35, perfectBonus: 50, alreadyCompleted: true }), { xpAwarded: 0, bonusAwarded: 0, firstCompletion: false });
  assert.equal(completedRequiredQuestions(["q1", "q2"], ["q1"]), false);
  assert.equal(completedRequiredQuestions(["q1", "q2"], ["q2", "q1", "remediation"]), true);
});

test("legal acknowledgement is versioned and local-beta scoped", () => {
  const acceptance = createLegalAcceptance(new Date("2026-08-11T12:00:00.000Z"));
  assert.equal(acceptance.scope, "local-beta");
  assert.equal(acceptance.privacyVersion, "2026-08-11");
  assert.equal(acceptance.termsVersion, "2026-08-11");
});

test("local product measurement is pruned to the 30-day retention window", () => {
  const now = new Date("2026-08-11T12:00:00.000Z");
  const event = (occurredAt) => ({ schemaVersion: 1, name: "sport_opened", occurredAt, surface: "web", ageBand: "18+" });
  assert.deepEqual(pruneProductEvents([event("2026-06-01T12:00:00.000Z"), event("2026-08-10T12:00:00.000Z"), event("2026-09-01T12:00:00.000Z")], now).map((item) => item.occurredAt), ["2026-08-10T12:00:00.000Z"]);
});
