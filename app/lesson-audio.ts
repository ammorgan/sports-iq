import type { BeginnerLesson } from "./beginner-guides";

export const LESSON_AUDIO_AGE_BAND = "7-9";
// Keep narration hidden until the production OpenAI voices are generated and approved.
export const VOICE_NARRATION_ENABLED = false;
export const LESSON_AUDIO_MODEL = "gpt-4o-mini-tts";
export const LESSON_AUDIO_VOICES = ["marin", "cedar"] as const;
export const LESSON_AUDIO_RESPONSE_FORMAT = "mp3";
export const LESSON_AUDIO_INSTRUCTIONS = [
  "Speak like a warm, upbeat youth sports coach.",
  "Sound natural, clear, patient, and encouraging without sounding childish.",
  "Use short pauses between ideas and gently emphasize the key sports terms.",
].join(" ");

export type LessonAudioVoice = (typeof LESSON_AUDIO_VOICES)[number];

export function firstSentence(text: string) {
  return text.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() ?? text;
}

export function lessonAudioKey(moduleId: string, ageBand: string, lessonIndex: number, voice: LessonAudioVoice) {
  return `${moduleId}:${ageBand}:${lessonIndex}:${voice}`;
}

export function lessonAudioSynthesisInput({
  instructions,
  model,
  responseFormat,
  text,
  voice,
}: {
  instructions: string;
  model: string;
  responseFormat: string;
  text: string;
  voice: LessonAudioVoice;
}) {
  return JSON.stringify({ instructions, model, responseFormat, text, voice });
}

export function lessonAudioFileName(voice: LessonAudioVoice, contentHash: string) {
  return `${voice}-${contentHash.slice(0, 20)}.mp3`;
}

export function lessonNarrationText(lesson: BeginnerLesson, ageBand: string) {
  const isEarlyReader = ageBand === LESSON_AUDIO_AGE_BAND;
  const terms = isEarlyReader ? lesson.terms?.slice(0, 2) : lesson.terms;
  const isEarlyWordLesson = isEarlyReader && lesson.eyebrow === "WORDS TO KNOW";
  const title = isEarlyWordLesson ? "Two words help you play." : lesson.title;
  const body = isEarlyWordLesson ? "Listen to them, then play." : isEarlyReader ? firstSentence(lesson.body) : lesson.body;
  const text = [title, body, ...(terms ?? []).map((item) => `${item.term}. ${isEarlyReader ? firstSentence(item.meaning) : item.meaning}`)].join(". ");

  return { body, terms, text, title };
}
