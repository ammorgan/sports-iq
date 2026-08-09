import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Sports IQ experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Sports IQ — Know More Than the Score<\/title>/i);
  assert.match(html, /HOW DEEP DOES YOUR/);
  assert.match(html, /SPORTS KNOWLEDGE/);
  assert.match(html, /Start the challenge/);
  assert.match(html, /All Sports/);
  assert.match(html, /Pro Leagues/);
  assert.match(html, /College Sports/);
  assert.match(html, /Legends &amp; Records/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("every category can supply a full ten-question round", async () => {
  const source = await readFile(new URL("../app/questions.ts", import.meta.url), "utf8");
  for (const category of ["pro", "college", "legends"]) {
    const matches = source.match(new RegExp(`category: "${category}"`, "g")) ?? [];
    assert.ok(matches.length >= 10, `${category} has only ${matches.length} questions`);
  }
});
