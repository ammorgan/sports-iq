import assert from "node:assert/strict";
import test from "node:test";
import { selectMatchingItem } from "../app/exercise-engine.ts";

test("matching can begin on either side and always stores left-to-right pairs", () => {
  for (const first of ["left", "right"]) {
    const start = selectMatchingItem([], null, first, first === "left" ? "Center" : "Snaps the ball");
    assert.deepEqual(start.selected, []);
    const finish = selectMatchingItem(start.selected, start.pending, first === "left" ? "right" : "left", first === "left" ? "Snaps the ball" : "Center");
    assert.deepEqual(finish, { selected: ["Center::Snaps the ball"], pending: null });
  }
});

test("matching allows changing a pending choice, canceling it, and replacing pairs", () => {
  let state = selectMatchingItem([], null, "right", "Snaps the ball");
  state = selectMatchingItem(state.selected, state.pending, "right", "Catches passes");
  assert.deepEqual(state.pending, { side: "right", value: "Catches passes" });
  state = selectMatchingItem(state.selected, state.pending, "right", "Catches passes");
  assert.equal(state.pending, null);
  state = selectMatchingItem(["Center::Snaps the ball", "Receiver::Catches passes"], null, "right", "Snaps the ball");
  state = selectMatchingItem(state.selected, state.pending, "left", "Receiver");
  assert.deepEqual(state.selected, ["Receiver::Snaps the ball"]);
  assert.equal(state.pending, null);
});
