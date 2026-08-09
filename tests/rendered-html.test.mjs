import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Sports IQ application shell and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Sports IQ — Learn the Game\. See It Differently\.<\/title>/i);
  assert.match(html, /Building your playbook/);
  assert.match(html, /og:image/);
  assert.match(html, /\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("client includes the complete first-run learning experience", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /LEARN THE GAME/);
  assert.match(source, /SEE IT DIFFERENTLY/);
  assert.match(source, /Build my playbook/);
  assert.match(source, /Progress saves on this device/);
});

test("content model covers the requested sports and per-sport pathways", async () => {
  const source = await readFile(new URL("../app/learning-data.ts", import.meta.url), "utf8");
  for (const sport of [
    "Tackle Football", "Flag Football", "Basketball", "Soccer", "Volleyball", "Baseball", "Softball",
    "Ice Hockey", "Lacrosse", "Rugby", "Field Hockey", "Water Polo", "Cricket",
  ]) assert.match(source, new RegExp(`name: "${sport}"`));

  for (const level of ["Rookie", "Starter", "Playmaker", "All-Star", "Elite", "Pro"]) {
    assert.match(source, new RegExp(`"${level}"`));
  }
  for (const experience of ["new", "basics", "casual", "competitive", "expert"]) {
    assert.match(source, new RegExp(`value: "${experience}"`));
  }
  assert.match(source, /remediation: remediationPlayers/);
  assert.match(source, /pathway: "position"/);
  assert.match(source, /type: "ordering"/);
  assert.match(source, /type: "multi"/);
  assert.match(source, /type: "hotspot"/);
  assert.match(source, /Women’s Tackle \(WNFC\)/);
  assert.match(source, /id: "flag-football"/);
  assert.match(source, /distinct non-tackle discipline/);
});

test("football contains every major position group from the product brief", async () => {
  const source = await readFile(new URL("../app/learning-data.ts", import.meta.url), "utf8");
  for (const position of [
    "Quarterback", "Running Back", "Fullback", "Wide Receiver", "Tight End",
    "Left Tackle", "Left Guard", "Center", "Right Guard", "Right Tackle",
    "Defensive Tackle", "Defensive End", "Inside Linebacker", "Outside Linebacker",
    "Cornerback", "Safety", "Kicker", "Punter", "Long Snapper", "Returner",
  ]) assert.match(source, new RegExp(`name: "${position}"`));
});

test("intro quizzes use explicit, unambiguous rules contexts", async () => {
  const source = await readFile(new URL("../app/learning-data.ts", import.meta.url), "utf8");
  assert.match(source, /introQuestions:/);
  assert.match(source, /11 players from each team \(22 players total\)/);
  assert.match(source, /including the goalkeeper/);
  assert.match(source, /5-on-5 and 7-on-7 are common/);
  assert.match(source, /standard indoor volleyball/);
  assert.match(source, /standard fastpitch softball/);
  assert.match(source, /men’s field lacrosse/);
  assert.match(source, /rugby union/);
  assert.doesNotMatch(source, /const otherSports/);
  assert.doesNotMatch(source, /Which statement correctly describes a standard/);
});

test("age paths meaningfully adapt the learning experience", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  for (const age of ["7-9", "10-12", "13-15", "16-17", "18+"]) {
    assert.match(source, new RegExp(`value: "${age.replace("+", "\\+")}"`));
  }
  assert.match(source, /fewer choices, and no timer/);
  assert.match(source, /seconds: null/);
  assert.match(source, /return band \? band\.seconds : 35/);
  assert.doesNotMatch(source, /\?\.seconds \?\? 35/);
  assert.match(source, /value: "10-12"[\s\S]*?seconds: 60/);
  assert.match(source, /value: "13-15"[\s\S]*?seconds: 45/);
  assert.match(source, /value: "16-17"[\s\S]*?seconds: 35/);
  assert.match(source, /value: "18\+"[\s\S]*?seconds: 30/);
  assert.match(source, /challengeSeconds !== null/);
  assert.match(source, /options\.length > 3/);
  assert.match(source, /challengeSeconds/);
  assert.match(source, /play-visual/);
  assert.match(source, /PLAYER_RANKS/);
  assert.match(source, /avatarMark/);
  assert.match(source, /soundOn/);
  assert.match(source, /ageBandConfirmed/);
  assert.match(source, /ONE-TIME PLAYBOOK UPDATE/);
  assert.match(source, /Check my answer/);
  assert.match(source, /COACH’S TIP/);
  assert.doesNotMatch(source, /window\.alert\(currentChallenge\.hint/);
  assert.match(source, /challenge\.youngPrompt/);
  assert.match(source, /challenge\.youngExplanation/);
});

test("players can choose from twenty-two interleaved diverse animated mini characters and understand sound controls", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.equal([...source.matchAll(/src: "\/avatars\/avatar-\d{2}\.png"/g)].length, 22);
  assert.match(source, /avatar-16[\s\S]*avatar-05[\s\S]*avatar-20[\s\S]*avatar-01[\s\S]*avatar-18/);
  assert.match(source, /Choose your mini character/);
  assert.match(source, /SFX/);
  assert.match(source, /answer feedback sounds/);
  assert.doesNotMatch(source, />[♪♩]</);
  assert.match(styles, /@keyframes avatar-idle/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("mobile app shares learning data and adapts across iOS, Android, phones, and tablets", async () => {
  const source = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  const config = await readFile(new URL("../mobile/app.json", import.meta.url), "utf8");
  const packageSource = await readFile(new URL("../mobile/package.json", import.meta.url), "utf8");

  assert.match(source, /from "\.\.\/app\/learning-data"/);
  assert.equal([...source.matchAll(/require\("\.\/assets\/avatars\/avatar-\d{2}\.png"\)/g)].length, 22);
  assert.match(source, /avatar-16[\s\S]*avatar-05[\s\S]*avatar-20[\s\S]*avatar-01[\s\S]*avatar-18/);
  assert.match(source, /useWindowDimensions/);
  assert.match(source, /width >= 720/);
  assert.match(source, /seconds: null/);
  for (const seconds of [60, 45, 35, 30]) assert.match(source, new RegExp(`seconds: ${seconds}`));
  assert.match(source, /useAudioPlayer/);
  assert.match(source, /AsyncStorage/);
  assert.match(config, /"supportsTablet": true/);
  assert.match(config, /"package": "com\.ammorgan\.sportsiq"/);
  assert.match(packageSource, /"expo": "~57\.0\.8"/);
});
