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

test("server-renders the RepQuest application shell and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>RepQuest — Learn the Game\. Build Your IQ\.<\/title>/i);
  assert.match(html, /Building your playbook/);
  assert.match(html, /og:image/);
  assert.match(html, /\/repquest-logo\.png/);
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
  assert.match(source, /remediation: remediationPlayers/);
  assert.match(source, /pathway: "position"/);
  assert.match(source, /type: "ordering"/);
  assert.match(source, /type: "multi"/);
  assert.match(source, /type: "hotspot"/);
  assert.match(source, /variants: \["Women’s Tackle", "Men’s Tackle", "Youth Tackle"\]/);
  assert.doesNotMatch(source, /WNFC/);
  assert.match(source, /id: "flag-football"/);
  assert.match(source, /distinct non-tackle discipline/);
});

test("beginner paths teach positions before specialized Position IQ", async () => {
  const data = await readFile(new URL("../app/learning-data.ts", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  assert.match(data, /title: `Meet the \$\{pathName\}`/);
  assert.match(data, /generalModulesForSport/);
  assert.match(page, /const positionsUnlocked = currentSportModules\.every/);
  assert.match(mobile, /const positionsUnlocked = generalModules\.every/);
  assert.match(page, /Start here ·/);
  assert.match(mobile, /START HERE/);
});

test("every sport gets a beginner-first playbook before its general quiz", async () => {
  const guideSource = await readFile(new URL("../app/beginner-guides.ts", import.meta.url), "utf8");
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const mobileSource = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");

  assert.equal([...guideSource.matchAll(/^ {4}welcome:/gm)].length, 23);
  assert.match(guideSource, /No combat-sports knowledge is assumed/);
  assert.match(guideSource, /Striking means legal punches, kicks, knees/);
  assert.match(guideSource, /Grappling means clinching, takedowns, positional control/);
  assert.match(pageSource, /screen, setScreen.*"primer"/s);
  assert.match(mobileSource, /type Screen = .*"primer"/);
  assert.match(pageSource, /TRY THE QUICK CHECK|Try the quick check/);
  assert.match(mobileSource, /TRY THE QUICK CHECK/);
});

test("sport snapshots use real short-form video instead of dot animations", async () => {
  const clips = await readFile(new URL("../app/sport-clips.ts", import.meta.url), "utf8");
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const mobileSource = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");

  assert.equal([...clips.matchAll(/: pexels\(/g)].length, 18);
  assert.equal([...clips.matchAll(/localCreativeCommonsClip\(/g)].length, 2);
  assert.match(clips, /const pexels[\s\S]*durationSeconds: 8/);
  assert.match(clips, /reviewStatus: verified \? "verified" : "needs-review"/);
  assert.match(clips, /clip\?\.reviewStatus === "verified"/);
  assert.match(clips, /softball: pexels\(4937706/);
  assert.match(clips, /lacrosse: localCreativeCommonsClip\("\/sport-clips\/lacrosse\.mp4"/);
  assert.match(clips, /"field-hockey": localCreativeCommonsClip\("\/sport-clips\/field-hockey\.mp4"/);
  assert.doesNotMatch(clips, /DVIDS|dvidshub|d34w7g4gy10iej/i);
  assert.doesNotMatch(clips, /^\s{2}(?:mma|wrestling):/m);
  assert.match(pageSource, /<video/);
  assert.match(mobileSource, /<VideoView/);
  assert.doesNotMatch(pageSource, /motion-dot|motion-ball/);
  assert.doesNotMatch(mobileSource, /motionPlayer|motionBall|motionTarget/);
});

test("pilot curriculum is source-backed and teaches before every check", async () => {
  const registry = await readFile(new URL("../app/content-registry.ts", import.meta.url), "utf8");
  const guides = await readFile(new URL("../app/module-guides.ts", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  for (const authority of ["NFL Football Operations", "International Federation of American Football", "FIBA", "The International Football Association Board", "Association of Boxing Commissions and Combative Sports"]) assert.match(registry, new RegExp(authority));
  assert.equal([...registry.matchAll(/reviewedOn: "2026-08-10"/g)].length, 5);
  assert.match(guides, /module\.pathway === "position"/);
  assert.match(guides, /fb-fundamentals-score/);
  assert.match(guides, /positionGroupLessons/);
  assert.match(page, /moduleGuideFor\(module, moduleSport, effectiveAge\)/);
  assert.match(mobile, /moduleGuideFor\(learningModule, sport, profile\.ageBand\)/);
});

test("home keeps all 23 detailed sport paths visible and accessible", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  assert.match(page, /ALL \{SPORTS\.length\} SPORTS/);
  assert.match(page, /GREAT PLACES TO START/);
  assert.match(page, /EXPLORE 18 MORE SPORTS/);
  assert.doesNotMatch(page, /showAllSports/);
  assert.doesNotMatch(mobile, /showAllSports/);
  assert.doesNotMatch(page, /function SportTicker/);
  assert.match(layout, /Skip to main content/);
  assert.match(page, /aria-current=/);
  assert.match(styles, /\.skip-link:focus/);
  assert.match(mobile, /accessibilityLiveRegion="polite"/);
  assert.match(mobile, /accessibilityState=\{\{ selected: isSelected/);
});

test("privacy and terms are visible before account setup", async () => {
  const gate = await readFile(new URL("../app/privacy-gate.tsx", import.meta.url), "utf8");
  const privacy = await readFile(new URL("../app/privacy/page.tsx", import.meta.url), "utf8");
  const terms = await readFile(new URL("../app/terms/page.tsx", import.meta.url), "utf8");
  assert.match(gate, /href="\/privacy"/);
  assert.match(gate, /href="\/terms"/);
  assert.match(privacy, /Children under 13/);
  assert.match(privacy, /legal review/);
  assert.match(terms, /Educational scope and sports safety/);
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
  const learningData = await readFile(new URL("../app/learning-data.ts", import.meta.url), "utf8");
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
  assert.match(source, /function RoundClock/);
  assert.match(learningData, /options\.length > 2/);
  assert.match(source, /ageAppropriateChallenges/);
  assert.match(source, /onExpire=\{\(\) => checkAnswer\(\[\]\)\}/);
  assert.match(source, /play-visual/);
  assert.match(source, /PLAYER_RANKS/);
  assert.match(source, /avatarMark/);
  assert.match(source, /Change age path/);
  assert.match(source, /ageBandConfirmed/);
  assert.match(source, /ONE-TIME PLAYBOOK UPDATE/);
  assert.doesNotMatch(source, /screen === "experience"|setScreen\("experience"\)|EXPERIENCE_OPTIONS/);
  assert.match(source, /Check my answer/);
  assert.match(source, /COACH’S TIP/);
  assert.doesNotMatch(source, /window\.alert\(currentChallenge\.hint/);
  assert.match(source, /challenge\.youngPrompt/);
  assert.match(source, /challenge\.youngExplanation/);
});

test("players get diverse avatars, sport icons, the image logo, and no premature sound control", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.equal([...source.matchAll(/src: "\/avatars\/avatar-\d{2}\.png"/g)].length, 22);
  assert.match(source, /avatar-16[\s\S]*avatar-05[\s\S]*avatar-20[\s\S]*avatar-01[\s\S]*avatar-18/);
  assert.match(source, /CHOOSE YOUR AVATAR/);
  assert.match(source, /SPORT_GLYPHS/);
  assert.match(source, /RepQuest logo/);
  assert.match(styles, /url\("\/repquest-logo\.png"\)/);
  assert.doesNotMatch(source, /SFX|answer feedback sounds|soundOn/);
  assert.doesNotMatch(styles, /sound-button/);
  assert.doesNotMatch(source, />[♪♩]</);
  assert.match(styles, /@keyframes avatar-idle/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("mobile app shares learning data and adapts across iOS, Android, phones, and tablets", async () => {
  const source = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  const config = await readFile(new URL("../mobile/app.json", import.meta.url), "utf8");
  const iosInfo = await readFile(new URL("../mobile/ios/SportsIQ/Info.plist", import.meta.url), "utf8");
  const packageSource = await readFile(new URL("../mobile/package.json", import.meta.url), "utf8");

  assert.match(source, /from "\.\.\/app\/learning-data"/);
  assert.equal([...source.matchAll(/require\("\.\/assets\/avatars-clean\/avatar-\d{2}\.png"\)/g)].length, 22);
  assert.match(source, /avatar-16[\s\S]*avatar-05[\s\S]*avatar-20[\s\S]*avatar-01[\s\S]*avatar-18/);
  assert.match(source, /useWindowDimensions/);
  assert.match(source, /function Logo\(\{ size = 56/);
  assert.match(source, /screen === "profile"/);
  assert.match(source, /assets\/sport-clips\/lacrosse\.mp4/);
  assert.match(source, /assets\/sport-clips\/field-hockey\.mp4/);
  assert.match(source, /width >= 720/);
  assert.match(source, /seconds: null/);
  for (const seconds of [60, 45, 35, 30]) assert.match(source, new RegExp(`seconds: ${seconds}`));
  assert.match(source, /useAudioPlayer/);
  assert.match(source, /AsyncStorage/);
  assert.match(source, /positionModuleId/);
  assert.match(config, /"supportsTablet": true/);
  assert.match(config, /"name": "RepQuest"/);
  assert.match(iosInfo, /<key>CFBundleDisplayName<\/key>\s*<string>RepQuest<\/string>/);
  assert.match(config, /"package": "com\.ammorgan\.sportsiq"/);
  assert.match(packageSource, /"expo": "~55\.0\.28"/);
});

test("privacy gate, consent model, bot protection, and leaderboard are youth-safe by default", async () => {
  const gate = await readFile(new URL("../app/privacy-gate.tsx", import.meta.url), "utf8");
  const schema = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");
  const leaderboard = await readFile(new URL("../app/api/leaderboard/route.ts", import.meta.url), "utf8");
  const verifyHuman = await readFile(new URL("../app/api/privacy/verify-human/route.ts", import.meta.url), "utf8");

  assert.match(gate, /save only the range—not a birthday/i);
  assert.match(gate, /does not ask for the child’s email or name/i);
  assert.match(gate, /Play privately on this device/);
  assert.match(schema, /isChildAccount/);
  assert.match(schema, /parentalConsents/);
  assert.match(schema, /leaderboardOptIn/);
  assert.match(leaderboard, /p\.is_child_account = 0/);
  assert.match(leaderboard, /p\.leaderboard_opt_in = 1/);
  assert.match(verifyHuman, /siteverify/);
  assert.match(verifyHuman, /TURNSTILE_SECRET_KEY/);
});

test("code-quality guardrails reject unused flow code and keep metadata static", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const learningData = await readFile(new URL("../app/learning-data.ts", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const accountConfig = await readFile(new URL("../app/api/account/config/route.ts", import.meta.url), "utf8");
  const tsconfig = await readFile(new URL("../tsconfig.json", import.meta.url), "utf8");
  const mobileTsconfig = await readFile(new URL("../mobile/tsconfig.json", import.meta.url), "utf8");

  assert.doesNotMatch(page, /ExperienceLevel|EXPERIENCE_OPTIONS|saveExperience|variantChoice/);
  assert.doesNotMatch(learningData, /ExperienceLevel|EXPERIENCE_OPTIONS/);
  assert.doesNotMatch(layout, /next\/headers|generateMetadata/);
  assert.match(layout, /export const metadata/);
  assert.match(accountConfig, /turnstileSiteKey && runtime\.TURNSTILE_SECRET_KEY/);
  assert.match(tsconfig, /"noUnusedLocals": true/);
  assert.match(tsconfig, /"noUnusedParameters": true/);
  assert.match(mobileTsconfig, /"noUnusedLocals": true/);

  for (const unusedPath of [
    "../app/chatgpt-auth.ts",
    "../db/index.ts",
    "../public/file.svg",
    "../public/globe.svg",
    "../public/window.svg",
    "../mobile/assets/avatars/avatar-01.png",
  ]) {
    await assert.rejects(readFile(new URL(unusedPath, import.meta.url)));
  }
});
