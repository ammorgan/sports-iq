export type CoachVoice = "marin" | "cedar";

export type AvatarProfile = {
  id: string;
  name: string;
  narrationVoice: CoachVoice;
};

export const DEFAULT_AVATAR_ID = "avatar-01";

export const AVATAR_PROFILES = [
  { id: "avatar-16", name: "Courage", narrationVoice: "marin" },
  { id: "avatar-05", name: "Bravery", narrationVoice: "cedar" },
  { id: "avatar-20", name: "Grace", narrationVoice: "marin" },
  { id: "avatar-01", name: "Confidence", narrationVoice: "cedar" },
  { id: "avatar-18", name: "Joy", narrationVoice: "marin" },
  { id: "avatar-10", name: "Strength", narrationVoice: "marin" },
  { id: "avatar-03", name: "Hope", narrationVoice: "cedar" },
  { id: "avatar-17", name: "Resilience", narrationVoice: "cedar" },
  { id: "avatar-08", name: "Kindness", narrationVoice: "marin" },
  { id: "avatar-21", name: "Wisdom", narrationVoice: "cedar" },
  { id: "avatar-06", name: "Belief", narrationVoice: "marin" },
  { id: "avatar-22", name: "Purpose", narrationVoice: "cedar" },
  { id: "avatar-11", name: "Creativity", narrationVoice: "marin" },
  { id: "avatar-19", name: "Patience", narrationVoice: "cedar" },
  { id: "avatar-02", name: "Peace", narrationVoice: "marin" },
  { id: "avatar-15", name: "Determination", narrationVoice: "cedar" },
  { id: "avatar-04", name: "Growth", narrationVoice: "marin" },
  { id: "avatar-12", name: "Spirit", narrationVoice: "marin" },
  { id: "avatar-07", name: "Leadership", narrationVoice: "cedar" },
  { id: "avatar-14", name: "Focus", narrationVoice: "marin" },
  { id: "avatar-09", name: "Grit", narrationVoice: "cedar" },
  { id: "avatar-13", name: "Unity", narrationVoice: "cedar" },
] as const satisfies readonly AvatarProfile[];

export function avatarProfileFor(id: string): AvatarProfile {
  return AVATAR_PROFILES.find((avatar) => avatar.id === id)
    ?? AVATAR_PROFILES.find((avatar) => avatar.id === DEFAULT_AVATAR_ID)!;
}

export function coachVoiceForAvatar(id: string): CoachVoice {
  return avatarProfileFor(id).narrationVoice;
}
