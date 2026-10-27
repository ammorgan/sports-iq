import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  LESSON_AUDIO_AGE_BAND,
  LESSON_AUDIO_INSTRUCTIONS,
  LESSON_AUDIO_MODEL,
  LESSON_AUDIO_RESPONSE_FORMAT,
  LESSON_AUDIO_VOICES,
  lessonAudioFileName,
  lessonAudioKey,
  lessonAudioSynthesisInput,
  lessonNarrationText,
} from "../app/lesson-audio.ts";
import { generalModulesForSport, positionModulesForSport, SPORTS } from "../app/learning-data.ts";
import { moduleGuideFor } from "../app/module-guides.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const webAudioDirectory = join(root, "public", "lesson-audio");
const mobileAudioDirectory = join(root, "mobile", "assets", "lesson-audio");
const webManifestPath = join(root, "app", "generated-lesson-audio.ts");
const mobileManifestPath = join(root, "mobile", "generated-lesson-audio-assets.ts");
const model = process.env.REPQUEST_TTS_MODEL || LESSON_AUDIO_MODEL;
const previewVoices = LESSON_AUDIO_VOICES;
const previewText = "Welcome to RepQuest. Today, we are learning how to find the end zone. Take your time, trust what you see, and remember: every mistake helps build your game IQ. Ready? Let's make the play.";
const concurrency = Math.max(1, Math.min(8, Number(process.env.REPQUEST_TTS_CONCURRENCY || 4)));

function parseEnv(text) {
  const values = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const name = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    values[name] = value;
  }
  return values;
}

async function loadApiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  try {
    const values = parseEnv(await readFile(join(root, ".env.local"), "utf8"));
    if (values.OPENAI_API_KEY) return values.OPENAI_API_KEY;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  throw new Error("OPENAI_API_KEY is not configured. Use the secure local key setup first.");
}

function contentHash(text) {
  return createHash("sha256").update(text).digest("hex");
}

function buildCatalog() {
  const entries = [];
  for (const sport of SPORTS) {
    const modules = [
      ...generalModulesForSport(sport),
      ...positionModulesForSport(sport, LESSON_AUDIO_AGE_BAND),
    ];
    for (const learningModule of modules) {
      const guide = moduleGuideFor(learningModule, sport, LESSON_AUDIO_AGE_BAND);
      if (!guide) continue;
      guide.lessons.forEach((lesson, lessonIndex) => {
        const narration = lessonNarrationText(lesson, LESSON_AUDIO_AGE_BAND);
        const textHash = contentHash(narration.text);
        for (const selectedVoice of LESSON_AUDIO_VOICES) {
          const synthesisHash = contentHash(lessonAudioSynthesisInput({
            instructions: LESSON_AUDIO_INSTRUCTIONS,
            model,
            responseFormat: LESSON_AUDIO_RESPONSE_FORMAT,
            text: narration.text,
            voice: selectedVoice,
          }));
          entries.push({
            fileName: lessonAudioFileName(selectedVoice, synthesisHash),
            key: lessonAudioKey(learningModule.id, LESSON_AUDIO_AGE_BAND, lessonIndex, selectedVoice),
            synthesisHash,
            text: narration.text,
            textHash,
            voice: selectedVoice,
          });
        }
      });
    }
  }
  return entries.sort((left, right) => left.key.localeCompare(right.key));
}

async function validExistingFile(fileName) {
  try {
    return (await stat(join(webAudioDirectory, fileName))).size > 1_000;
  } catch {
    return false;
  }
}

const wait = (milliseconds) => new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));

async function requestSpeech(apiKey, input, selectedVoice, attempt = 1) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input,
      instructions: LESSON_AUDIO_INSTRUCTIONS,
      model,
      response_format: LESSON_AUDIO_RESPONSE_FORMAT,
      voice: selectedVoice,
    }),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    const retryable = response.status >= 500 || (response.status === 429 && !detail.includes("insufficient_quota"));
    if (retryable && attempt < 4) {
      await wait(750 * 2 ** (attempt - 1));
      return requestSpeech(apiKey, input, selectedVoice, attempt + 1);
    }
    throw new Error(`Speech generation failed (${response.status}): ${detail}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function mapWithConcurrency(items, worker) {
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex];
      nextIndex += 1;
      await worker(item);
    }
  });
  await Promise.all(workers);
}

function renderWebManifest(entries, generatedAt) {
  const rows = entries.map((entry) => `  ${JSON.stringify(entry.key)}: { aiGenerated: true, fileName: ${JSON.stringify(entry.fileName)}, generatedAt: ${JSON.stringify(generatedAt)}, model: ${JSON.stringify(model)}, provider: "openai", synthesisHash: ${JSON.stringify(entry.synthesisHash)}, textHash: ${JSON.stringify(entry.textHash)}, voice: ${JSON.stringify(entry.voice)} },`).join("\n");
  return `// Generated by scripts/generate-lesson-audio.mjs. Do not edit by hand.\nexport type LessonAudioEntry = {\n  aiGenerated: true;\n  fileName: string;\n  generatedAt: string;\n  model: string;\n  provider: "openai";\n  synthesisHash: string;\n  textHash: string;\n  voice: string;\n};\n\nexport const LESSON_AUDIO_MANIFEST: Readonly<Record<string, LessonAudioEntry>> = {\n${rows}\n};\n\nexport function lessonAudioEntryFor(key: string) {\n  return LESSON_AUDIO_MANIFEST[key];\n}\n\nexport function webLessonAudioUrl(entry: LessonAudioEntry) {\n  return \`/lesson-audio/\${entry.fileName}\`;\n}\n`;
}

function renderMobileManifest(entries) {
  const rows = entries.map((entry) => `  ${JSON.stringify(entry.key)}: require(${JSON.stringify(`./assets/lesson-audio/${entry.fileName}`)}),`).join("\n");
  return `// Generated by scripts/generate-lesson-audio.mjs. Do not edit by hand.\nimport type { AudioSource } from "expo-audio";\n\nexport const MOBILE_LESSON_AUDIO_ASSETS: Readonly<Record<string, AudioSource>> = {\n${rows}\n};\n\nexport function mobileLessonAudioAssetFor(key: string) {\n  return MOBILE_LESSON_AUDIO_ASSETS[key];\n}\n`;
}

async function writeAtomically(path, contents) {
  const temporaryPath = `${path}.next`;
  await writeFile(temporaryPath, contents);
  await rename(temporaryPath, path);
}

async function main() {
  const entries = buildCatalog();
  const uniqueByFile = [...new Map(entries.map((entry) => [entry.fileName, entry])).values()];
  if (process.argv.includes("--dry-run")) {
    console.log(`Catalog contains ${entries.length} lesson references and ${uniqueByFile.length} unique clips.`);
    return;
  }

  const apiKey = await loadApiKey();
  if (process.argv.includes("--preview-voices")) {
    const previewDirectory = join(root, ".audit", "voice-previews");
    await mkdir(previewDirectory, { recursive: true });
    for (const selectedVoice of previewVoices) {
      const audio = await requestSpeech(apiKey, previewText, selectedVoice);
      if (audio.length <= 1_000) throw new Error(`The ${selectedVoice} preview was unexpectedly small.`);
      await writeFile(join(previewDirectory, `${selectedVoice}.mp3`), audio);
      console.log(`Generated ${selectedVoice} preview with ${model} (${audio.length} bytes).`);
    }
    return;
  }
  if (process.argv.includes("--sample")) {
    const audio = await requestSpeech(apiKey, uniqueByFile[0].text, uniqueByFile[0].voice);
    if (audio.length <= 1_000) throw new Error("The sample narration was unexpectedly small.");
    console.log(`Sample narration succeeded with ${model}/${uniqueByFile[0].voice} (${audio.length} bytes).`);
    return;
  }

  const missing = [];
  for (const entry of uniqueByFile) if (!(await validExistingFile(entry.fileName))) missing.push(entry);

  const temporaryDirectory = await mkdtemp(join(tmpdir(), "repquest-lesson-audio-"));
  try {
    console.log(`Preparing ${entries.length} lesson references (${uniqueByFile.length} unique clips, ${missing.length} to generate).`);
    await mapWithConcurrency(missing, async (entry) => {
      const audio = await requestSpeech(apiKey, entry.text, entry.voice);
      if (audio.length <= 1_000) throw new Error(`Generated audio was unexpectedly small for ${entry.key}.`);
      await writeFile(join(temporaryDirectory, entry.fileName), audio);
      console.log(`Generated ${entry.fileName}`);
    });

    const missingFileNames = new Set(missing.map((entry) => entry.fileName));
    await mkdir(webAudioDirectory, { recursive: true });
    await mkdir(mobileAudioDirectory, { recursive: true });
    for (const entry of uniqueByFile) {
      const generatedPath = join(temporaryDirectory, entry.fileName);
      if (missingFileNames.has(entry.fileName)) await copyFile(generatedPath, join(webAudioDirectory, entry.fileName));
      await copyFile(join(webAudioDirectory, entry.fileName), join(mobileAudioDirectory, entry.fileName));
    }

    const generatedAt = new Date().toISOString();
    await writeAtomically(webManifestPath, renderWebManifest(entries, generatedAt));
    await writeAtomically(mobileManifestPath, renderMobileManifest(entries));
    console.log(`Bundled ${uniqueByFile.length} narration clips for web and mobile using ${model} with ${LESSON_AUDIO_VOICES.join(" and ")}.`);
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
}

await main();
