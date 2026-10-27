import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("all web tabs, primers, position lessons and results share the game skin", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  for (const shell of ["dashboard-shell", "sport-shell", "lesson-shell", "primer-shell", "results-shell"]) {
    assert.match(source, new RegExp(`${shell}[^\\n]*repquest-game`), shell);
  }
  assert.doesNotMatch(source, /coreCourse \? <ExerciseChoices/);
  assert.doesNotMatch(source, /coreCourse \? "quest-lesson"/);
  assert.match(source, /quest-course-node--\$\{state\}/);
  assert.match(source, /Lesson complete!/);
  assert.doesNotMatch(source, /onToggleTheme|Where this lesson comes from|lesson-sources/);
});

test("both clients use bidirectional matching and the shared answer renderer for both tracks", async () => {
  for (const path of ["../app/exercise-choices.tsx", "../mobile/ExerciseChoices.tsx"]) {
    const source = await readFile(new URL(path, import.meta.url), "utf8");
    assert.match(source, /selectMatchingItem/);
    assert.doesNotMatch(source, /disabled \|\| !left|else if\(left\)/);
    assert.match(source, /type\s*===\s*"multi"/);
  }
  const native = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(native, /coreCourse \? <ExerciseChoicesMobile|lessonSources|RULE REFERENCES|QuestionVisual/);
  assert.match(native, /positionNodeCurrent/);
  assert.match(native, /surface: "#241b36"/);
});
