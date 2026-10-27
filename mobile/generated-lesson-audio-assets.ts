import type { AudioSource } from "expo-audio";

export const MOBILE_LESSON_AUDIO_ASSETS: Readonly<Record<string, AudioSource>> = {};

export function mobileLessonAudioAssetFor(key: string) {
  return MOBILE_LESSON_AUDIO_ASSETS[key];
}
