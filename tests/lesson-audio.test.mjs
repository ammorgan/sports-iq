import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { AVATAR_PROFILES, coachVoiceForAvatar } from "../app/avatar-catalog.ts";
import {
  LESSON_AUDIO_INSTRUCTIONS,
  LESSON_AUDIO_MODEL,
  LESSON_AUDIO_VOICES,
  VOICE_NARRATION_ENABLED,
  lessonAudioFileName,
  lessonAudioKey,
  lessonAudioSynthesisInput,
} from "../app/lesson-audio.ts";

test("voice narration stays hidden until the production recordings are approved", () => {
  assert.equal(VOICE_NARRATION_ENABLED, false);
});

const CEDAR_AVATAR_IDS = [
  "avatar-01",
  "avatar-03",
  "avatar-05",
  "avatar-07",
  "avatar-09",
  "avatar-13",
  "avatar-15",
  "avatar-17",
  "avatar-19",
  "avatar-21",
  "avatar-22",
];

const MARIN_AVATAR_IDS = [
  "avatar-02",
  "avatar-04",
  "avatar-06",
  "avatar-08",
  "avatar-10",
  "avatar-11",
  "avatar-12",
  "avatar-14",
  "avatar-16",
  "avatar-18",
  "avatar-20",
];

test("all avatar metadata resolves to the explicitly assigned coach voice", () => {
  assert.equal(AVATAR_PROFILES.length, 22);
  assert.deepEqual(new Set(LESSON_AUDIO_VOICES), new Set(["marin", "cedar"]));

  const profilesById = new Map(AVATAR_PROFILES.map((profile) => [profile.id, profile]));
  assert.equal(profilesById.size, AVATAR_PROFILES.length, "avatar IDs must remain unique");

  for (const id of CEDAR_AVATAR_IDS) {
    const profile = profilesById.get(id);
    assert.ok(profile, `${id} must remain in the shared avatar catalog`);
    assert.equal(profile.narrationVoice, "cedar", `${id} must keep its explicit Cedar assignment`);
    assert.equal(coachVoiceForAvatar(id), "cedar");
  }

  for (const id of MARIN_AVATAR_IDS) {
    const profile = profilesById.get(id);
    assert.ok(profile, `${id} must remain in the shared avatar catalog`);
    assert.equal(profile.narrationVoice, "marin", `${id} must keep its explicit Marin assignment`);
    assert.equal(coachVoiceForAvatar(id), "marin");
  }

  assert.deepEqual(
    new Set([...CEDAR_AVATAR_IDS, ...MARIN_AVATAR_IDS]),
    new Set(AVATAR_PROFILES.map((profile) => profile.id)),
    "the voice assignment must cover the complete avatar catalog exactly once",
  );
  assert.equal(coachVoiceForAvatar("missing-avatar"), "cedar", "unknown saved IDs must use the default avatar's voice");
});

test("lesson audio keys distinguish Marin and Cedar for the same lesson", () => {
  assert.equal(
    lessonAudioKey("fb-path-see-the-field", "7-9", 2, "marin"),
    "fb-path-see-the-field:7-9:2:marin",
  );
  assert.equal(
    lessonAudioKey("fb-path-see-the-field", "7-9", 2, "cedar"),
    "fb-path-see-the-field:7-9:2:cedar",
  );
  assert.notEqual(
    lessonAudioKey("fb-path-see-the-field", "7-9", 2, "marin"),
    lessonAudioKey("fb-path-see-the-field", "7-9", 2, "cedar"),
  );
});

test("the synthesis identity changes for every input that can change rendered audio", () => {
  assert.equal(LESSON_AUDIO_MODEL, "gpt-4o-mini-tts");
  assert.ok(LESSON_AUDIO_INSTRUCTIONS.trim().length > 20);

  const base = {
    model: LESSON_AUDIO_MODEL,
    voice: "marin",
    instructions: LESSON_AUDIO_INSTRUCTIONS,
    responseFormat: "mp3",
    text: "See the field, then make the play.",
  };
  const canonical = lessonAudioSynthesisInput(base);

  assert.equal(canonical, lessonAudioSynthesisInput({ ...base }));
  assert.deepEqual(JSON.parse(canonical), base);
  assert.notEqual(canonical, lessonAudioSynthesisInput({ ...base, voice: "cedar" }));
  assert.notEqual(canonical, lessonAudioSynthesisInput({ ...base, model: `${LESSON_AUDIO_MODEL}-next` }));
  assert.notEqual(canonical, lessonAudioSynthesisInput({ ...base, instructions: `${LESSON_AUDIO_INSTRUCTIONS} Pause.` }));
  assert.notEqual(canonical, lessonAudioSynthesisInput({ ...base, responseFormat: "wav" }));
  assert.notEqual(canonical, lessonAudioSynthesisInput({ ...base, text: `${base.text} Ready?` }));
});

test("voice-aware filenames cannot collide when narration text is shared", () => {
  const contentHash = "a".repeat(64);
  const marin = lessonAudioFileName("marin", contentHash);
  const cedar = lessonAudioFileName("cedar", contentHash);

  assert.equal(marin, `marin-${"a".repeat(20)}.mp3`);
  assert.equal(cedar, `cedar-${"a".repeat(20)}.mp3`);
  assert.notEqual(marin, cedar);
});

test("the offline generator emits and requests both voice variants without a client runtime call", async () => {
  const generator = await readFile(new URL("../scripts/generate-lesson-audio.mjs", import.meta.url), "utf8");

  assert.match(generator, /for \(const selectedVoice of LESSON_AUDIO_VOICES\)/);
  assert.match(generator, /contentHash\(lessonAudioSynthesisInput\(/);
  assert.match(generator, /lessonAudioFileName\(selectedVoice, synthesisHash\)/);
  assert.match(generator, /lessonAudioKey\([\s\S]*?selectedVoice\)/);
  assert.match(generator, /requestSpeech\(apiKey, entry\.text, entry\.voice\)/);
  assert.doesNotMatch(generator, /tts-1-hd|REPQUEST_TTS_VOICE|\bnova\b/);
});
