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
    "Bowling",
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
  assert.doesNotMatch(source, new RegExp(["WN", "FC"].join("")));
  assert.match(source, /id: "flag-football"/);
  assert.match(source, /distinct non-tackle discipline/);
});

test("players can choose Position IQ immediately and still receive a role primer", async () => {
  const data = await readFile(new URL("../app/learning-data.ts", import.meta.url), "utf8");
  const guides = await readFile(new URL("../app/module-guides.ts", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  assert.match(data, /title: `Meet the \$\{pathName\}`/);
  assert.match(data, /generalModulesForSport/);
  assert.match(guides, /function positionLesson/);
  assert.doesNotMatch(page, /positionsUnlocked/);
  assert.doesNotMatch(mobile, /positionsUnlocked/);
  assert.match(page, /Choose any role now/);
  assert.match(mobile, /CHOOSE ANY ROLE NOW/);
  assert.match(page, /<CourseMap /);
  assert.match(mobile, /<CourseMapMobile /);
});

test("every sport gets a beginner-first playbook before its general quiz", async () => {
  const guideSource = await readFile(new URL("../app/beginner-guides.ts", import.meta.url), "utf8");
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const mobileSource = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");

  assert.equal([...guideSource.matchAll(/^ {4}welcome:/gm)].length, 24);
  assert.match(guideSource, /No combat-sports knowledge is assumed/);
  assert.match(guideSource, /Striking means legal punches, kicks, knees/);
  assert.match(guideSource, /Grappling means clinching, takedowns, positional control/);
  assert.match(pageSource, /screen, setScreen.*"primer"/s);
  assert.match(mobileSource, /type Screen = .*"primer"/);
  assert.match(pageSource, /Let’s try it/);
  assert.match(mobileSource, /LET’S TRY IT/);
});

test("video playback is paused on both published app surfaces", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  for (const source of [page,mobile]) {
    assert.doesNotMatch(source, /SportMotionPreview|SportClipVideo|sportClipFor|<video|<VideoView|useVideoPlayer/);
  }
});

test("curriculum is source-backed and teaches before every check", async () => {
  const registry = await readFile(new URL("../app/content-registry.ts", import.meta.url), "utf8");
  const guides = await readFile(new URL("../app/module-guides.ts", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  for (const authority of ["NFL Football Operations", "International Federation of American Football", "FIBA", "The International Football Association Board", "Association of Boxing Commissions and Combative Sports", "United States Bowling Congress"]) assert.match(registry, new RegExp(authority));
  assert.equal([...registry.matchAll(/reviewedOn: "2026-08-10"/g)].length, 5);
  assert.match(registry, /reviewedOn: "2026-08-16"/);
  assert.match(guides, /module\.pathway === "position"/);
  assert.match(guides, /fb-fundamentals-score/);
  assert.match(guides, /positionGroupLessons/);
  assert.match(page, /moduleGuideFor\(module, moduleSport, effectiveAge\)/);
  assert.match(mobile, /moduleGuideFor\(learningModule, moduleSport, profile\.ageBand\)/);
});

test("both homes publish the same five-sport library", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  for (const source of [page,mobile]) assert.match(source, /FEATURED_SPORTS as SPORTS/);
  assert.match(page, /quest-sport-library/);
  assert.match(mobile, /SPORTS.map\(sportCard\)/);
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /Skip to main content/);
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

test("privacy operations, progression integrity, and measurement are shared by web and mobile", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const gate = await readFile(new URL("../app/privacy-gate.tsx", import.meta.url), "utf8");
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  const schema = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");
  const operations = await readFile(new URL("../docs/PRIVACY_PROGRESS_MEASUREMENT_OPERATIONS.md", import.meta.url), "utf8");

  assert.match(gate, /legalAccepted/);
  assert.match(page, /Export my data/);
  assert.match(page, /Delete local profile/);
  assert.match(mobile, /EXPORT MY DATA/);
  assert.match(mobile, /DELETE LOCAL PROFILE/);
  assert.match(page, /calculateCompletionAward/);
  assert.match(mobile, /calculateCompletionAward/);
  assert.match(page, /canStartLearningModule/);
  assert.match(mobile, /canStartLearningModule/);
  assert.match(page, /completedRequiredQuestions/);
  assert.match(mobile, /completedRequiredQuestions/);
  assert.match(mobile, /measurementPreference: "essential-only", productEvents: \[\]/);
  assert.match(schema, /moduleCompletions/);
  assert.match(schema, /legalAcceptances/);
  assert.match(schema, /dataExportRequests/);
  assert.match(schema, /productMetricsDaily/);
  assert.match(operations, /First valid module completion rate/);
});

test("football contains every major position group from the product brief", async () => {
  const source = await readFile(new URL("../app/learning-data.ts", import.meta.url), "utf8");
  for (const position of [
    "Quarterback", "Running Back", "Fullback", "Wide Receiver", "Tight End",
    "Left Tackle", "Left Guard", "Center", "Right Guard", "Right Tackle",
    "Defensive Tackle", "Defensive End", "Inside Linebacker", "Outside Linebacker",
    "Cornerback", "Safety", "Kicker", "Punter", "Long Snapper", "Returner",
  ]) assert.match(source, new RegExp(`name: "${position}"`));
  for (const [position, abbreviation] of [
    ["Quarterback", "QB"], ["Fullback", "FB"],
    ["Left Tackle", "LT"], ["Left Guard", "LG"], ["Center", "C"],
    ["Right Guard", "RG"], ["Right Tackle", "RT"],
    ["Inside Linebacker", "ILB"], ["Outside Linebacker", "OLB"],
  ]) assert.match(source, new RegExp(`name: "${position}", abbreviation: "${abbreviation}"`));
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
  assert.match(source, /Simple words and time to think/);
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
  assert.match(source, /quest-lesson-coach/);
  assert.doesNotMatch(source, /className="play-visual"/);
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

test("the early-reader path can be played with less reading", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const lessonAudio = await readFile(new URL("../app/lesson-audio.ts", import.meta.url), "utf8");
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  const packageSource = await readFile(new URL("../mobile/package.json", import.meta.url), "utf8");

  assert.match(page, /SpeechSynthesisUtterance/);
  assert.match(page, /preferredBrowserVoice/);
  assert.match(page, /message\.rate = 0\.92/);
  assert.match(page, /aria-pressed=\{speaking\}/);
  assert.match(page, /Hear this lesson/);
  assert.match(page, /onSelect=\{\(values\) => \{ setSelectedAnswers\(values\); if \(isEarlyReader[\s\S]*?checkAnswer\(values\)/);
  assert.match(mobile, /from "expo-speech"/);
  assert.match(mobile, /getAvailableVoicesAsync/);
  assert.match(mobile, /VoiceQuality\.Enhanced/);
  assert.match(mobile, /HEAR THE QUESTION/);
  assert.match(mobile, /onSelect=\{\(values\) => \{ setSelected\(values\); if \(isEarlyReader[\s\S]*?checkAnswer\(values\)/);
  assert.match(packageSource, /"expo-speech"/);
  assert.match(page, /slice\(0, 3\)/);
  assert.match(mobile, /isEarlyReader \? firstSentence\(item.meaning\) : item.meaning/);
  assert.match(lessonAudio, /Two words help you play/);
  assert.match(page, /lessonNarrationText/);
  assert.match(mobile, /lessonNarrationText/);
});

test("lesson narration is generated ahead of time without shipping the API key", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const lessonAudio = await readFile(new URL("../app/lesson-audio.ts", import.meta.url), "utf8");
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  const generator = await readFile(new URL("../scripts/generate-lesson-audio.mjs", import.meta.url), "utf8");
  const packageSource = await readFile(new URL("../package.json", import.meta.url), "utf8");

  assert.match(packageSource, /"audio:generate"/);
  assert.match(generator, /https:\/\/api\.openai\.com\/v1\/audio\/speech/);
  assert.match(lessonAudio, /gpt-4o-mini-tts/);
  assert.match(lessonAudio, /"marin"/);
  assert.match(lessonAudio, /"cedar"/);
  assert.match(generator, /LESSON_AUDIO_VOICES/);
  assert.match(generator, /lessonAudioSynthesisInput/);
  assert.match(generator, /\.env\.local/);
  assert.match(page, /lessonAudioEntryFor/);
  assert.match(page, /AI-generated voice/);
  assert.match(mobile, /mobileLessonAudioAssetFor/);
  assert.match(mobile, /AI VOICE/);
  assert.doesNotMatch(page, /OPENAI_API_KEY|api\.openai\.com/);
  assert.doesNotMatch(mobile, /OPENAI_API_KEY|api\.openai\.com/);
});

test("players get diverse avatars, sport icons, the image logo, and no premature sound control", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const avatarCatalog = await readFile(new URL("../app/avatar-catalog.ts", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.equal([...avatarCatalog.matchAll(/id: "avatar-\d{2}"/g)].length, 22);
  assert.match(avatarCatalog, /AVATAR_PROFILES/);
  assert.match(avatarCatalog, /narrationVoice/);
  assert.match(source, /AVATAR_PROFILES/);
  assert.match(source, /CHOOSE YOUR AVATAR/);
  assert.match(source, /SportGlyph/);
  assert.match(source, /RepQuest logo/);
  assert.match(styles, /url\("\/repquest-logo-ui\.png"\)/);
  assert.doesNotMatch(source, /SFX|answer feedback sounds|soundOn/);
  assert.doesNotMatch(styles, /sound-button/);
  assert.doesNotMatch(source, />[♪♩]</);
  assert.match(styles, /@keyframes avatar-idle/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("course and position choices are stacked and accessible on both surfaces", async () => {
  const web = await readFile(new URL("../app/course-map.tsx", import.meta.url), "utf8");
  const native = await readFile(new URL("../mobile/CourseMap.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(web, /Position training/);
  assert.match(native, /Position training/);
  assert.match(web, /aria-expanded/);
  assert.match(native, /accessibilityState/);
  assert.match(css, /\.quest-track-switch \{ display: grid; gap: 10px/);
});

test("mobile quiz buttons do not pass a native press event as the selected answer", async () => {
  const mobile = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  const learningData = await readFile(new URL("../app/learning-data.ts", import.meta.url), "utf8");

  assert.match(mobile, /function PrimaryButton[\s\S]*?onPress=\{\(\) => onPress\(\)\}/);
  assert.match(learningData, /options: \["The strong-side linebacker"[\s\S]*?correct: "The strong-side linebacker"/);
});

test("mobile app shares learning data and adapts across iOS, Android, phones, and tablets", async () => {
  const source = await readFile(new URL("../mobile/App.tsx", import.meta.url), "utf8");
  const avatarCatalog = await readFile(new URL("../app/avatar-catalog.ts", import.meta.url), "utf8");
  const config = await readFile(new URL("../mobile/app.json", import.meta.url), "utf8");
  const iosInfo = await readFile(new URL("../mobile/ios/SportsIQ/Info.plist", import.meta.url), "utf8");
  const packageSource = await readFile(new URL("../mobile/package.json", import.meta.url), "utf8");

  assert.match(source, /from "\.\.\/app\/learning-data"/);
  assert.equal([...source.matchAll(/require\("\.\/assets\/avatars-clean\/avatar-\d{2}\.png"\)/g)].length, 22);
  assert.equal([...avatarCatalog.matchAll(/id: "avatar-\d{2}"/g)].length, 22);
  assert.match(source, /AVATAR_PROFILES/);
  assert.match(source, /useWindowDimensions/);
  assert.match(source, /function Logo\(\{ size = 56/);
  assert.match(source, /assets\/repquest-logo-ui\.png/);
  assert.match(source, /screen === "profile"/);
  assert.doesNotMatch(source, /require\([^\n]*sport-clips/);
  assert.doesNotMatch(source, /assets\/sport-clips\/(?:flag-football|lacrosse)\.mp4/);
  assert.match(source, /width >= 720/);
  assert.match(source, /seconds: null/);
  for (const seconds of [60, 45, 35, 30]) assert.match(source, new RegExp(`seconds: ${seconds}`));
  assert.match(source, /useAudioPlayer/);
  assert.match(source, /AsyncStorage/);
  assert.match(source, /learningModulePathsForSport/);
  assert.match(source, /positionModulesForPosition/);
  assert.match(source, /sportProgressSummary/);
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
