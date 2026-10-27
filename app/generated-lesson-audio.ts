export type LessonAudioEntry = {
  aiGenerated: true;
  fileName: string;
  generatedAt: string;
  model: string;
  provider: "openai";
  synthesisHash: string;
  textHash: string;
  voice: string;
};

export const LESSON_AUDIO_MANIFEST: Readonly<Record<string, LessonAudioEntry>> = {};

export function lessonAudioEntryFor(key: string) {
  return LESSON_AUDIO_MANIFEST[key];
}

export function webLessonAudioUrl(entry: LessonAudioEntry) {
  return `/lesson-audio/${entry.fileName}`;
}
