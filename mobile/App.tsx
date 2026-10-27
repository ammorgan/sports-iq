/* eslint-disable @typescript-eslint/no-require-imports */
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAudioPlayer, useAudioPlayerStatus, type AudioSource } from "expo-audio";
import * as Speech from "expo-speech";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  AccessibilityInfo,
  Alert,
  Easing,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  Pressable,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AVATAR_PROFILES, coachVoiceForAvatar, type CoachVoice } from "../app/avatar-catalog";
import { VOICE_NARRATION_ENABLED, firstSentence, lessonAudioKey, lessonNarrationText } from "../app/lesson-audio";
import {
  arrangeChallengeOptions,
  challengesForAge,
  generalModulesForSport,
  learningModulePathsForSport,
  migrateCompletedModuleIds,
  positionAbbreviation,
  positionModulesForPosition,
  remediationChallengeFor,
  sportProgressSummary,
  FEATURED_SPORTS as SPORTS,
  type Challenge,
  type LearningModule,
  type Position,
  type Sport,
} from "../app/learning-data";
import { moduleGuideFor } from "../app/module-guides";
import { mobileLessonAudioAssetFor } from "./generated-lesson-audio-assets";
import {
  appendProductEvent,
  buildLocalDataExport,
  calculateCompletionAward,
  canStartLearningModule,
  completedRequiredQuestions,
  createLegalAcceptance,
  LEGAL_VERSIONS,
  type CompletionReceipt,
  type LegalAcceptance,
  type MeasurementPreference,
  type ProductEvent,
  type ProductEventName,
  type ProductEventOutcome,
  pruneProductEvents,
} from "../app/product-governance";
import { CourseMapMobile } from "./CourseMap";
import { ExerciseChoicesMobile } from "./ExerciseChoices";
import { isChallengeAnswerCorrect, hasRecoveredCoreLesson, exerciseInstruction, formattedCorrectAnswer, coreRetryChallenge } from "../app/exercise-engine";
import { formationExerciseForModule } from "../app/course-formations";
import { FormationBoardMobile } from "./FormationBoard";

const COLORS = {
  navy: "#f7f0ff",
  ink: "#24123c",
  navy2: "#352349",
  paper: "#151027",
  surface: "#241b36",
  surface2: "#322541",
  teal: "#cfadff",
  gold: "#f5c64f",
  coral: "#f0a993",
  green: "#7fe0b4",
  muted: "#c9bdd9",
  line: "#51415f",
};

// Metro must see literal require calls at build time, so only the avatar metadata is shared.
const AVATAR_SOURCES: Readonly<Record<string, ImageSourcePropType>> = {
  "avatar-01": require("./assets/avatars-clean/avatar-01.png"),
  "avatar-02": require("./assets/avatars-clean/avatar-02.png"),
  "avatar-03": require("./assets/avatars-clean/avatar-03.png"),
  "avatar-04": require("./assets/avatars-clean/avatar-04.png"),
  "avatar-05": require("./assets/avatars-clean/avatar-05.png"),
  "avatar-06": require("./assets/avatars-clean/avatar-06.png"),
  "avatar-07": require("./assets/avatars-clean/avatar-07.png"),
  "avatar-08": require("./assets/avatars-clean/avatar-08.png"),
  "avatar-09": require("./assets/avatars-clean/avatar-09.png"),
  "avatar-10": require("./assets/avatars-clean/avatar-10.png"),
  "avatar-11": require("./assets/avatars-clean/avatar-11.png"),
  "avatar-12": require("./assets/avatars-clean/avatar-12.png"),
  "avatar-13": require("./assets/avatars-clean/avatar-13.png"),
  "avatar-14": require("./assets/avatars-clean/avatar-14.png"),
  "avatar-15": require("./assets/avatars-clean/avatar-15.png"),
  "avatar-16": require("./assets/avatars-clean/avatar-16.png"),
  "avatar-17": require("./assets/avatars-clean/avatar-17.png"),
  "avatar-18": require("./assets/avatars-clean/avatar-18.png"),
  "avatar-19": require("./assets/avatars-clean/avatar-19.png"),
  "avatar-20": require("./assets/avatars-clean/avatar-20.png"),
  "avatar-21": require("./assets/avatars-clean/avatar-21.png"),
  "avatar-22": require("./assets/avatars-clean/avatar-22.png"),
};

const AVATARS: Array<{ id: string; name: string; source: ImageSourcePropType }> = AVATAR_PROFILES.map((avatar) => ({
  id: avatar.id,
  name: avatar.name,
  source: AVATAR_SOURCES[avatar.id],
}));

type AgeBand = "7-9" | "10-12" | "13-15" | "16-17" | "18+";
type AccountKind = "guest" | "self" | "child";
type ConsentState = "local-only" | "not-required" | "pending" | "verified";
type Screen = "home" | "sport" | "primer" | "quiz" | "result" | "profile" | "league" | "legal";
type LegalDocumentKind = "privacy" | "terms";
type Pathway = "general" | "position";
type Profile = {
  name: string;
  ageBand: AgeBand;
  avatarId: string;
  xp: number;
  completedSports: string[];
  completedModules: string[];
  privacyGateComplete: boolean;
  accountKind: AccountKind;
  consentState: ConsentState;
  legalAcceptance: LegalAcceptance | null;
  measurementPreference: MeasurementPreference;
  productEvents: ProductEvent[];
  completionReceipts: Record<string, CompletionReceipt>;
};

const AGE_BANDS: Array<{ value: AgeBand; title: string; note: string; seconds: number | null }> = [
  { value: "7-9", title: "Play & Discover", note: "Simple words, time to think", seconds: null },
  { value: "10-12", title: "Build the Basics", note: "Guided practice, your pace", seconds: 60 },
  { value: "13-15", title: "Read the Game", note: "Build knowledge, your pace", seconds: 45 },
  { value: "16-17", title: "Compete & Lead", note: "Practice decisions, your pace", seconds: 35 },
  { value: "18+", title: "Full Game IQ", note: "For new fans and experienced players", seconds: 30 },
];

const DEFAULT_PROFILE: Profile = {
  name: "",
  ageBand: "10-12",
  avatarId: "avatar-01",
  xp: 0,
  completedSports: [],
  completedModules: [],
  privacyGateComplete: false,
  accountKind: "guest",
  consentState: "not-required",
  legalAcceptance: null,
  measurementPreference: "essential-only",
  productEvents: [],
  completionReceipts: {},
};
const XP_MILESTONES = [
  { name: "Rookie Reader", xp: 0 },
  { name: "Game Scout", xp: 300 },
  { name: "Field General", xp: 800 },
  { name: "Sports Scholar", xp: 1600 },
  { name: "Arena Elite", xp: 3000 },
];
const STORAGE_KEY = "sports-iq-mobile-profile-v1";

function avatarFor(id: string) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}

function MiniCharacter({ id, size = 120, animated = false }: { id: string; size?: number; animated?: boolean }) {
  const [bob] = useState(() => new Animated.Value(0));
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!animated || reduceMotion) { bob.setValue(0); return; }
    const motion = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: -7, duration: 1050, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1050, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    motion.start();
    return () => motion.stop();
  }, [animated, bob, reduceMotion]);

  return <Animated.Image source={avatarFor(id).source} resizeMode="contain" style={{ width: size, height: size, transform: [{ translateY: bob }] }} />;
}

function GameAvatar({ id, size, animated = false }: { id: string; size: number; animated?: boolean }) {
  return <MiniCharacter id={id} size={size} animated={animated} />;
}

function Logo({ size = 56 }: { size?: number }) {
  return <Image accessibilityLabel="RepQuest logo" source={require("./assets/repquest-logo-ui.png")} resizeMode="cover" style={[styles.logo, { width: size, height: size, borderRadius: Math.round(size * 0.28) }]} />;
}

function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={() => onPress()} style={({ pressed }) => [styles.primaryButton, pressed && !disabled && styles.pressed, disabled && styles.disabled]}><Text style={styles.primaryButtonText}>{label}</Text><Text aria-hidden style={styles.primaryArrow}>→</Text></Pressable>;
}

const cachedNaturalVoiceIds: Partial<Record<CoachVoice, string | null>> = {};

function mobileSpeechVoiceScore(voice: Speech.Voice, coachVoice: CoachVoice) {
  const name = voice.name.toLowerCase();
  let score = voice.language.toLowerCase() === "en-us" ? 40 : voice.language.toLowerCase().startsWith("en") ? 20 : -100;
  if (voice.quality === Speech.VoiceQuality.Enhanced) score += 80;
  if (/premium|enhanced|natural|neural/.test(name)) score += 70;
  const preferredNames = coachVoice === "marin"
    ? /ava|samantha|allison|aria|jenny|karen|moira|victoria|google us english/
    : /aaron|alex|daniel|jamie|rishi|tom|gordon|google us english/;
  if (preferredNames.test(name)) score += 45;
  if (/compact|novelty|whisper|zarvox/.test(name)) score -= 60;
  return score;
}

async function preferredMobileVoice(coachVoice: CoachVoice) {
  if (Object.prototype.hasOwnProperty.call(cachedNaturalVoiceIds, coachVoice)) return cachedNaturalVoiceIds[coachVoice] ?? undefined;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const voice = voices
      .filter((item) => item.language.toLowerCase().startsWith("en"))
      .sort((left, right) => mobileSpeechVoiceScore(right, coachVoice) - mobileSpeechVoiceScore(left, coachVoice))[0];
    cachedNaturalVoiceIds[coachVoice] = voice?.identifier ?? null;
    return cachedNaturalVoiceIds[coachVoice] ?? undefined;
  } catch {
    cachedNaturalVoiceIds[coachVoice] = null;
    return undefined;
  }
}

function HearButton({ text, label, coachVoice, audioSource }: { text: string; label: string; coachVoice: CoachVoice; audioSource?: AudioSource }) {
  const [speaking, setSpeaking] = useState(false);
  const audioPlayer = useAudioPlayer(audioSource ?? null);
  const audioStatus = useAudioPlayerStatus(audioPlayer);
  const isPlaying = audioSource ? audioStatus.playing : speaking;

  const speak = async () => {
    await Speech.stop();
    if (audioSource) {
      if (audioStatus.playing) {
        audioPlayer.pause();
        return;
      }
      if (audioStatus.currentTime > 0) await audioPlayer.seekTo(0);
      audioPlayer.play();
      return;
    }
    if (speaking) {
      setSpeaking(false);
      return;
    }
    const voice = await preferredMobileVoice(coachVoice);
    Speech.speak(text, {
      language: "en-US",
      voice,
      rate: coachVoice === "marin" ? 0.92 : 0.9,
      pitch: coachVoice === "marin" ? 1.02 : 0.96,
      volume: 1,
      onStart: () => setSpeaking(true),
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };
  return <Pressable accessibilityRole="button" accessibilityLabel={isPlaying ? "Stop narration" : audioSource ? `${label}. AI-generated voice.` : label} accessibilityState={{ selected: isPlaying }} onPress={() => { void speak(); }} style={({ pressed }) => [styles.hearButton, pressed && styles.pressed]}><MaterialCommunityIcons name={isPlaying ? "stop" : "volume-high"} size={22} color="white" /><View style={styles.hearButtonCopy}><Text style={styles.hearButtonText}>{isPlaying ? "STOP READING" : label}</Text>{audioSource && <Text style={styles.hearButtonDisclosure}>AI VOICE</Text>}</View></Pressable>;
}

function BackButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Back to ${label.toLowerCase()}`} onPress={onPress} style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}><View style={styles.backButtonIcon}><MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.ink} /></View><Text style={styles.backButtonText}>{label}</Text></Pressable>;
}

function FeedbackCoach({ avatarId, correct, timedOut = false }: { avatarId: string; correct: boolean; timedOut?: boolean }) {
  return <View style={[styles.feedbackCoach, correct ? styles.feedbackCoachCorrect : styles.feedbackCoachTry]}>
    <View style={styles.feedbackCoachCharacter}><MiniCharacter id={avatarId} size={92} animated /></View>
    <View style={styles.feedbackCoachBubble}><Text style={styles.feedbackCoachTitle}>{correct ? "GREAT READ!" : timedOut ? "TIME TO LEARN!" : "GOOD TRY!"}</Text><Text style={styles.feedbackCoachText}>{correct ? "You made the right decision!" : "Getting it wrong is part of getting better. Let’s learn it together."}</Text></View>
  </View>;
}

function QuizTimer({ duration, paused, onExpire }: { duration: number | null; paused: boolean; onExpire: () => void }) {
  const [seconds, setSeconds] = useState(duration);
  const expireRef = useRef(onExpire);

  useEffect(() => { expireRef.current = onExpire; }, [onExpire]);
  useEffect(() => {
    if (duration === null || paused) return;
    const timer = setInterval(() => setSeconds((current) => current === null ? null : Math.max(0, current - 1)), 1000);
    return () => clearInterval(timer);
  }, [duration, paused]);
  useEffect(() => {
    if (seconds === 0 && !paused) expireRef.current();
  }, [paused, seconds]);

  if (seconds === null) return null;
  return <View accessible accessibilityLabel={`${seconds} seconds remaining`} style={[styles.timer, seconds <= 10 && styles.timerLow]}><Text style={[styles.timerValue, seconds <= 10 && styles.timerValueLow]}>{seconds}</Text><Text style={styles.timerLabel}>SEC</Text></View>;
}

function MobileLegalDocument({ kind, onBack }: { kind: LegalDocumentKind; onBack: () => void }) {
  const privacy = kind === "privacy";
  return <SafeAreaView style={styles.privacySafe}><StatusBar style="light" /><ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.privacyBackground}><ScrollView contentContainerStyle={styles.mobileLegalPage}><View style={styles.mobileLegalCard}>
    <Pressable onPress={onBack}><Text style={styles.privacyBack}>← BACK</Text></Pressable>
    <Logo />
    <Text style={styles.privacyKicker}>{privacy ? "REPQUEST PRIVACY" : "REPQUEST LEGAL"}</Text>
    <Text style={styles.mobileLegalTitle}>{privacy ? "PRIVACY NOTICE" : "TERMS OF USE"}</Text>
    <Text style={styles.mobileLegalUpdated}>BETA DRAFT · VERSION {privacy ? LEGAL_VERSIONS.privacy : LEGAL_VERSIONS.terms}</Text>
    {privacy ? <>
      <Text style={styles.mobileLegalHeading}>LOCAL BETA DATA</Text><Text style={styles.mobileLegalBody}>RepQuest stores the broad age path, avatar, local display name or “Player,” XP, progress, badges, legal versions, and preferences on this device. The beta does not need an exact birthday.</Text>
      <Text style={styles.mobileLegalHeading}>PLAYERS UNDER 13</Text><Text style={styles.mobileLegalBody}>No child email or legal name is requested. Child play is local and private. Online child accounts stay disabled until parent notice, verified consent, access, deletion, retention, and security controls are operational.</Text>
      <Text style={styles.mobileLegalHeading}>PRODUCT MEASUREMENT</Text><Text style={styles.mobileLegalBody}>Optional product-improvement measurement is off by default and unavailable under 13. Eligible players may store coarse gameplay events for up to 30 days and 200 events. Events exclude names, email, exact age, answer text, advertising IDs, location, and device IDs.</Text>
      <Text style={styles.mobileLegalHeading}>YOUR CHOICES</Text><Text style={styles.mobileLegalBody}>The Privacy Center lets you export data, reset learning progress, turn optional measurement off, or delete the complete local profile immediately from this device. RepQuest does not sell personal information or put child profiles on public leaderboards.</Text>
      <Text style={styles.mobileLegalHeading}>BETA NOTICE</Text><Text style={styles.mobileLegalBody}>Online accounts are not active. Final operator contact details, vendor disclosures, and legal review are required before public account registration.</Text>
    </> : <>
      <Text style={styles.mobileLegalHeading}>USING REPQUEST</Text><Text style={styles.mobileLegalBody}>RepQuest is an educational sports game for players age 7 and older. An adult user—or a parent or guardian acting for a minor—accepts these terms and the Privacy Notice for local beta use.</Text>
      <Text style={styles.mobileLegalHeading}>SPORTS SAFETY</Text><Text style={styles.mobileLegalBody}>Lessons do not replace qualified coaching, medical advice, league rules, supervision, or safety equipment. Follow the governing body, coach, facility, and health professional before participating.</Text>
      <Text style={styles.mobileLegalHeading}>FAIR PROGRESSION</Text><Text style={styles.mobileLegalBody}>XP and game ranks have no cash value. XP is awarded once for a module’s first valid completion. Practice can improve mastery but does not create repeat completion XP.</Text>
      <Text style={styles.mobileLegalHeading}>ACCEPTABLE USE</Text><Text style={styles.mobileLegalBody}>Do not bypass security, automate fake accounts or XP, impersonate others, interfere with users or the service, or use RepQuest unlawfully. Online accounts and public child profiles are disabled in the beta.</Text>
      <Text style={styles.mobileLegalHeading}>BETA NOTICE</Text><Text style={styles.mobileLegalBody}>The beta may contain errors or lose local progress. Final operator identity, contact, dispute, liability, and jurisdiction terms require counsel review before public launch.</Text>
    </>}
    <Text style={styles.mobileLegalDisclaimer}>Product copy only—not legal advice.</Text>
  </View></ScrollView></ImageBackground></SafeAreaView>;
}

function MobilePrivacyGate({ onContinue }: { onContinue: (result: { ageBand: AgeBand; accountKind: AccountKind; consentState: ConsentState; legalAcceptance: LegalAcceptance }) => void }) {
  const [ageBand, setAgeBand] = useState<AgeBand | null>(null);
  const [step, setStep] = useState<"age" | "account">("age");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [legalView, setLegalView] = useState<LegalDocumentKind | null>(null);
  const isChild = ageBand === "7-9" || ageBand === "10-12";

  if (legalView) return <MobileLegalDocument kind={legalView} onBack={() => setLegalView(null)} />;

  return <SafeAreaView style={styles.privacySafe}><StatusBar style="light" /><ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.privacyBackground}><ScrollView contentContainerStyle={styles.privacyPage}>
    <View style={styles.privacyCard}>
      {step === "account" && <Pressable onPress={() => setStep("age")}><Text style={styles.privacyBack}>← CHANGE AGE</Text></Pressable>}
      <Logo />
      {step === "age" ? <>
        <Text style={styles.privacyKicker}>FIRST, SET THE RIGHT PLAYBOOK</Text>
        <Text style={styles.privacyTitle}>HOW OLD IS{`\n`}THE <Text style={styles.privacyTitleAccent}>PLAYER?</Text></Text>
        <Text style={styles.privacyCopy}>An adult or the player should choose the real age range. We save the range—not a birthday.</Text>
        <View style={styles.privacyAgeGrid}>{AGE_BANDS.map((band) => <Pressable accessibilityRole="button" accessibilityState={{ selected: ageBand === band.value }} accessibilityLabel={`Ages ${band.value === "7-9" ? "6–9" : band.value}, ${band.title}. ${band.note}`} key={band.value} onPress={() => setAgeBand(band.value)} style={[styles.privacyAgeCard, ageBand === band.value && styles.privacyAgeCardActive]}><Text style={[styles.privacyAgeValue, ageBand === band.value && styles.privacyChoiceActive]}>AGES {band.value === "7-9" ? "6–9" : band.value}</Text><Text style={[styles.privacyAgeTitle, ageBand === band.value && styles.privacyChoiceActive]}>{band.title}</Text><Text style={[styles.privacyAgeNote, ageBand === band.value && styles.privacyChoiceActive]}>{band.note}</Text><Text style={[styles.privacyAgeArrow, ageBand === band.value && styles.privacyChoiceActive]}>{ageBand === band.value ? "✓" : "→"}</Text></Pressable>)}</View>
        <View style={styles.mobileLegalLinks}><Pressable onPress={() => setLegalView("privacy")}><Text style={styles.mobileLegalLink}>PRIVACY NOTICE</Text></Pressable><Pressable onPress={() => setLegalView("terms")}><Text style={styles.mobileLegalLink}>TERMS OF USE</Text></Pressable></View>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: legalAccepted }} onPress={() => setLegalAccepted((accepted) => !accepted)} style={styles.mobileLegalAcceptance}><View style={[styles.mobileLegalCheck, legalAccepted && styles.mobileLegalCheckActive]}><Text style={styles.mobileLegalCheckText}>{legalAccepted ? "✓" : ""}</Text></View><Text style={styles.mobileLegalAcceptanceText}>I am the player or responsible adult. I have read the Privacy Notice and agree to the Terms of Use.</Text></Pressable>
        <PrimaryButton label="CONTINUE" onPress={() => setStep("account")} disabled={!ageBand || !legalAccepted} />
        <Text style={styles.privacyFine}>Age helps us support reading. Core lessons are untimed, and knowledge builds along the path.</Text>
      </> : isChild ? <>
        <Text style={styles.privacyKicker}>A GROWN-UP OWNS THIS ACCOUNT</Text>
        <Text style={styles.privacyTitle}>PARENT{`\n`}<Text style={styles.privacyTitleAccent}>HANDOFF.</Text></Text>
        <Text style={styles.privacyCopy}>RepQuest will not ask for the child’s email or legal name. Parent accounts and consent stay off until secure sign-in, consent delivery, and bot protection are connected.</Text>
        <View style={styles.privacySetup}><MaterialCommunityIcons name="shield-check" size={24} color="#6547c7" /><View style={styles.privacySetupCopy}><Text style={styles.privacySetupTitle}>PARENT SETUP · SAFE MODE</Text><Text style={styles.privacySetupText}>No family information is collected in this preview.</Text></View></View>
        <PrimaryButton label="PLAY PRIVATELY ON THIS DEVICE" onPress={() => onContinue({ ageBand: ageBand as AgeBand, accountKind: "child", consentState: "local-only", legalAcceptance: createLegalAcceptance() })} />
        <Text style={styles.privacyFine}>Device play does not create an online child account. This acknowledgement is not parental consent for online collection.</Text>
      </> : <>
        <Text style={styles.privacyKicker}>SAVE YOUR PROGRESS ANYWHERE</Text>
        <Text style={styles.privacyTitle}>CHOOSE HOW{`\n`}<Text style={styles.privacyTitleAccent}>YOU’LL PLAY.</Text></Text>
        <Text style={styles.privacyCopy}>Secure account buttons are ready for provider keys. They stay disabled until Apple, Google, Facebook, email, and CAPTCHA are connected.</Text>
        <View style={styles.privacyProviders}>{[["apple", "Apple"], ["google", "Google"], ["facebook", "Facebook"], ["email-outline", "Email"]].map(([icon, label]) => <View key={label} style={styles.privacyProvider}><MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} size={21} color={COLORS.muted} /><View><Text style={styles.privacyProviderName}>CONTINUE WITH {label.toUpperCase()}</Text><Text style={styles.privacyProviderStatus}>SECURE SETUP REQUIRED</Text></View></View>)}</View>
        <PrimaryButton label="CONTINUE WITHOUT AN ACCOUNT" onPress={() => onContinue({ ageBand: ageBand as AgeBand, accountKind: "guest", consentState: "not-required", legalAcceptance: createLegalAcceptance() })} />
        <Text style={styles.privacyFine}>Guest progress stays on this device. Connect an account later.</Text>
      </>}
    </View>
  </ScrollView></ImageBackground></SafeAreaView>;
}

function AvatarPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return <View><Text style={styles.fieldLabel}>CHOOSE YOUR AVATAR</Text><Text style={styles.avatarHint}>Pick a strength to carry into every game.</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarList}>{AVATARS.map((avatar) => { const isSelected = value === avatar.id; return <Pressable key={avatar.id} accessibilityRole="button" accessibilityLabel={`Choose ${avatar.name}`} accessibilityState={{ selected: isSelected }} onPress={() => onChange(avatar.id)} style={[styles.avatarChoice, isSelected && styles.avatarChoiceActive]}><MiniCharacter id={avatar.id} size={112} /><Text style={[styles.avatarName, isSelected && styles.avatarNameActive]}>{avatar.name}</Text>{isSelected && <View style={styles.avatarCheck}><Text style={styles.avatarCheckText}>✓</Text></View>}</Pressable>; })}</ScrollView></View>;
}

function adaptChallenge(challenge: Challenge, ageBand: AgeBand, questionIndex: number, sequenceKey: string): Challenge {
  const youngerPath = ageBand === "7-9" || ageBand === "10-12";
  return {
    ...challenge,
    prompt: youngerPath ? challenge.youngPrompt ?? challenge.prompt : challenge.prompt,
    explanation: youngerPath ? challenge.youngExplanation ?? challenge.explanation : challenge.explanation,
    options: arrangeChallengeOptions(challenge, ageBand, questionIndex, sequenceKey),
  };
}

function RepQuestApp() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 720;
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [draftName, setDraftName] = useState("");
  const [draftAge, setDraftAge] = useState<AgeBand>("10-12");
  const [draftAvatar, setDraftAvatar] = useState("avatar-01");
  const [screen, setScreen] = useState<Screen>("home");
  const [legalDocument, setLegalDocument] = useState<LegalDocumentKind>("privacy");
  const [sport, setSport] = useState<Sport>(SPORTS[0]);
  const [pathway, setPathway] = useState<Pathway>("general");
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [quiz, setQuiz] = useState<Challenge[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; timedOut?: boolean } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizXp, setQuizXp] = useState(0);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);
  const [coreResults,setCoreResults] = useState<Array<{conceptId:string;correct:boolean}>>([]);
  const [lastRunPractice, setLastRunPractice] = useState(false);
  const [primerIndex, setPrimerIndex] = useState(0);
  const quizScrollRef=useRef<ScrollView>(null);
  useEffect(()=>{if(screen==="quiz")quizScrollRef.current?.scrollTo({y:0,animated:false});},[screen,questionIndex]);

  const contentWidth = Math.min(width, 1080);
  const cardWidth = contentWidth - 32;
  const agePath = AGE_BANDS.find((band) => band.value === profile.ageBand) ?? AGE_BANDS[1];
  const coachVoice = coachVoiceForAvatar(profile.avatarId);
  const question = quiz[questionIndex];

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<Profile>;
          const avatarId = AVATARS.some((avatar) => avatar.id === parsed.avatarId) ? parsed.avatarId as string : DEFAULT_PROFILE.avatarId;
          const savedAgeBand = parsed.ageBand ?? DEFAULT_PROFILE.ageBand;
          const isChildProfile = parsed.accountKind === "child" || savedAgeBand === "7-9" || savedAgeBand === "10-12";
          const next: Profile = {
            ...DEFAULT_PROFILE,
            name: isChildProfile ? "Player" : parsed.name ?? DEFAULT_PROFILE.name,
            ageBand: savedAgeBand,
            avatarId,
            xp: parsed.xp ?? DEFAULT_PROFILE.xp,
            completedSports: parsed.completedSports ?? DEFAULT_PROFILE.completedSports,
            completedModules: migrateCompletedModuleIds(parsed.completedModules ?? DEFAULT_PROFILE.completedModules),
            privacyGateComplete: parsed.privacyGateComplete ?? DEFAULT_PROFILE.privacyGateComplete,
            accountKind: isChildProfile ? "child" : parsed.accountKind ?? DEFAULT_PROFILE.accountKind,
            consentState: isChildProfile ? "local-only" : parsed.consentState ?? DEFAULT_PROFILE.consentState,
            legalAcceptance: parsed.legalAcceptance ?? null,
            measurementPreference: !isChildProfile && parsed.measurementPreference === "product-improvement" ? "product-improvement" : "essential-only",
            productEvents: !isChildProfile && parsed.measurementPreference === "product-improvement" && Array.isArray(parsed.productEvents) ? pruneProductEvents(parsed.productEvents) : [],
            completionReceipts: parsed.completionReceipts ?? {},
          };
          setProfile(next);
          setDraftName(next.name);
          setDraftAge(next.ageBand);
          setDraftAvatar(next.avatarId);
        } catch { /* start fresh */ }
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [loaded, profile]);

  const recordProductEvent = (name: ProductEventName, dimensions: { sportId?: string; moduleId?: string; outcome?: ProductEventOutcome; step?: number; totalSteps?: number } = {}) => {
    setProfile((current) => {
      const productEvents = appendProductEvent(current.productEvents, {
        name,
        surface: "mobile",
        ageBand: current.ageBand,
        ...dimensions,
      }, { accountKind: current.accountKind, preference: current.measurementPreference });
      return productEvents === current.productEvents ? current : { ...current, productEvents };
    });
  };

  const createProfile = () => {
    if (!draftName.trim()) return;
    setProfile((current) => ({ ...current, name: draftName.trim(), ageBand: draftAge, avatarId: draftAvatar }));
  };

  const openSport = (nextSport: Sport) => {
    setSport(nextSport);
    setPathway("general");
    setSelectedPosition(null);
    recordProductEvent("sport_opened", { sportId: nextSport.id });
    setScreen("sport");
  };

  const sportCard = (item: Sport) => {
    const summary = sportProgressSummary(item, profile.ageBand, profile.completedModules);
    const percent = summary.percent;
    const progressLabel = summary.completedModules === 0 ? "Not started" : summary.completedModules === summary.totalModules ? "Complete" : `${summary.completedModules}/${summary.totalModules} missions`;
    return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Open ${item.name}, ${progressLabel}`} onPress={() => openSport(item)} style={({ pressed }) => [styles.sportCard, styles.sportCardSimple, styles.questSportCard, { width: cardWidth }, pressed && styles.gameCardPressed]}>
      <View style={styles.sportCardSimpleTop}><View style={[styles.sportMark, styles.sportMarkSimple, { borderColor: item.color }]}><MaterialCommunityIcons name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={39} color={item.color} /></View>{summary.completedModules === summary.totalModules && <View style={[styles.sportCompleteBadge, { backgroundColor: item.color }]}><Text style={styles.sportCompleteBadgeText}>✓</Text></View>}</View>
      <Text style={[styles.sportCardSimpleTitle,styles.questSportTitle]}>{item.name}</Text>
      <View style={styles.sportCardSimpleBottom}><View style={styles.sportProgressCopy}><Text style={[styles.sportProgressLabel, { color: item.color }]}>{progressLabel}</Text><View style={styles.sportProgressTrack}><View style={[styles.sportProgressFill, { width: `${percent}%`, backgroundColor: item.color }]} /></View></View><View style={[styles.sportArrowButton, { backgroundColor: item.color }]}><Text style={styles.sportArrowButtonText}>→</Text></View></View>
    </Pressable>;
  };

  const startModule = (learningModule: LearningModule) => {
    const moduleSport = SPORTS.find((item) => item.id === learningModule.sportId);
    if (!moduleSport) return;
    const modulePaths = learningModulePathsForSport(moduleSport, profile.ageBand);
    if (!canStartLearningModule({ moduleId: learningModule.id, modulePaths, completedModuleIds: profile.completedModules })) {
      recordProductEvent("progression_blocked", { sportId: learningModule.sportId, moduleId: learningModule.id, outcome: "failed" });
      return;
    }
    setActiveModule(learningModule);
    const ageAppropriateChallenges = challengesForAge(learningModule, profile.ageBand);
    setQuiz(ageAppropriateChallenges.map((challenge, index) => adaptChallenge(challenge, profile.ageBand, index, learningModule.id)));
    setQuestionIndex(0);
    setSelected([]);
    setFeedback(null);
    setCorrectCount(0);
    setQuizXp(0);
    setAnsweredQuestionIds([]);
    setCoreResults([]);
    setLastRunPractice(profile.completedModules.includes(learningModule.id));
    setPrimerIndex(0);
    const guide = moduleGuideFor(learningModule, moduleSport, profile.ageBand);
    const hasPrimer = Boolean(guide);
    recordProductEvent("module_started", { sportId: learningModule.sportId, moduleId: learningModule.id });
    if (guide) recordProductEvent("lesson_viewed", { sportId: learningModule.sportId, moduleId: learningModule.id, step: 1, totalSteps: guide.lessons.length });
    setScreen(hasPrimer ? "primer" : "quiz");
  };


  const checkAnswer = (answers = selected, timedOut = false) => {
    if (!question || (!timedOut && answers.length === 0) || feedback) return;
    const correct = !timedOut && isChallengeAnswerCorrect(question,answers);
    setCoreResults((current)=>[...current,{conceptId:question.conceptId,correct}]);
    setFeedback({ correct, timedOut });
    setAnsweredQuestionIds((current) => current.includes(question.id) ? current : [...current, question.id]);
    if (correct) {
      setCorrectCount((count) => count + 1);
      setQuizXp((xp) => xp + question.xp);
    } else if ((!question.id.includes("-remediate") && !question.id.includes("-retry-")) || activeModule?.coreCourse) {
      const baseReplay = question.remediation ?? remediationChallengeFor(question, profile.ageBand);
      const replay = activeModule?.coreCourse ? coreRetryChallenge(question,quiz.length) : baseReplay;
      setQuiz((current) => current.some((item) => item.id === replay.id)
        ? current
        : [...current, adaptChallenge(replay, profile.ageBand, current.length, `${activeModule?.id}:replay`)]);
    }
    recordProductEvent("question_answered", { sportId: activeModule?.sportId, moduleId: activeModule?.id, outcome: correct ? "correct" : "incorrect", step: questionIndex + 1, totalSteps: quiz.length });
  };

  const advance = () => {
    if (questionIndex < quiz.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelected([]);
      setFeedback(null);
      return;
    }
    if (activeModule?.coreCourse && !hasRecoveredCoreLesson(activeModule.challenges,coreResults)) return;
    if (!activeModule || !completedRequiredQuestions(quiz.map((item) => item.id), answeredQuestionIds)) return;
    const alreadyCompleted = profile.completedModules.includes(activeModule.id);
    const award = calculateCompletionAward({ answerXp: quizXp, completionBonus: 35, perfectBonus: correctCount === quiz.length ? 50 : 0, alreadyCompleted });
    setProfile((current) => {
      const currentAlreadyCompleted = current.completedModules.includes(activeModule.id);
      const currentAward = calculateCompletionAward({ answerXp: quizXp, completionBonus: 35, perfectBonus: correctCount === quiz.length ? 50 : 0, alreadyCompleted: currentAlreadyCompleted });
      return {
        ...current,
        xp: current.xp + currentAward.xpAwarded,
        completedSports: current.completedSports.includes(sport.id) ? current.completedSports : [...current.completedSports, sport.id],
        completedModules: currentAlreadyCompleted ? current.completedModules : [...current.completedModules, activeModule.id],
        completionReceipts: currentAlreadyCompleted ? current.completionReceipts : {
          ...current.completionReceipts,
          [activeModule.id]: {
            moduleId: activeModule.id,
            sportId: activeModule.sportId,
            firstCompletedAt: new Date().toISOString(),
            xpAwarded: currentAward.xpAwarded,
            bestCorrect: correctCount,
            questionCount: quiz.length,
          },
        },
      };
    });
    setLastRunPractice(!award.firstCompletion);
    setQuizXp(award.xpAwarded);
    recordProductEvent("module_completed", { sportId: activeModule.sportId, moduleId: activeModule.id, outcome: award.firstCompletion ? "completed" : "practice", step: quiz.length, totalSteps: quiz.length });
    setScreen("result");
  };

  const saveProfile = () => {
    const childProfile = profile.accountKind === "child" || profile.ageBand === "7-9" || profile.ageBand === "10-12";
    if (!childProfile && !draftName.trim()) return;
    setProfile((current) => ({ ...current, name: childProfile ? "Player" : draftName.trim(), avatarId: draftAvatar }));
    setScreen("home");
  };

  const exportLocalData = async () => {
    await Share.share({ title: "RepQuest data export", message: JSON.stringify(buildLocalDataExport("mobile", profile), null, 2) });
  };

  const resetLearningProgress = () => Alert.alert("Reset learning progress?", "Your player card and privacy choices will stay.", [
    { text: "Cancel", style: "cancel" },
    { text: "Reset", style: "destructive", onPress: () => setProfile((current) => ({ ...current, xp: 0, completedSports: [], completedModules: [], completionReceipts: {} })) },
  ]);

  const deleteLocalProfile = () => Alert.alert("Delete local profile?", "This removes the player card, progress, privacy choices, and optional measurement history from this device.", [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: () => {
      void AsyncStorage.removeItem(STORAGE_KEY);
      setProfile(DEFAULT_PROFILE);
      setDraftName("");
      setScreen("home");
    } },
  ]);

  if (!loaded) return <SafeAreaView style={styles.loading}><Logo /><Text style={styles.loadingText}>BUILDING YOUR PLAYBOOK…</Text></SafeAreaView>;

  if (!profile.privacyGateComplete) {
    return <MobilePrivacyGate onContinue={({ ageBand, accountKind, consentState, legalAcceptance }) => {
      setDraftAge(ageBand);
      setDraftName("Player");
      setProfile((current) => ({ ...current, name: "Player", ageBand, privacyGateComplete: true, accountKind, consentState, legalAcceptance, measurementPreference: "essential-only", productEvents: [] }));
    }} />;
  }

  if (!profile.name) {
    return <SafeAreaView style={styles.safe}><StatusBar style="light" /><ScrollView contentContainerStyle={[styles.onboarding, isTablet && styles.onboardingTablet]} keyboardShouldPersistTaps="handled"><View style={styles.onboardingCopy}><Logo /><Text style={styles.kicker}>{SPORTS.length} SPORTS · ONE PLAYBOOK · YOUR PACE</Text><Text style={[styles.displayTitle, isTablet && styles.displayTitleTablet]}>LEARN THE GAME.{"\n"}<Text style={styles.tealText}>SEE IT DIFFERENTLY.</Text></Text><Text style={styles.lede}>Pick a sport. Make the call. Learn why it works. Build real game knowledge in short, animated challenges.</Text><Text style={styles.fieldLabel}>CHOOSE YOUR AGE PATH</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ageList}>{AGE_BANDS.map((band) => <Pressable key={band.value} onPress={() => setDraftAge(band.value)} style={[styles.ageChoice, draftAge === band.value && styles.ageChoiceActive]}><Text style={[styles.ageValue, draftAge === band.value && styles.choiceTextActive]}>{band.value}</Text><Text style={[styles.ageTitle, draftAge === band.value && styles.choiceTextActive]}>{band.title}</Text><Text style={[styles.ageNote, draftAge === band.value && styles.choiceTextActive]}>{band.note}</Text></Pressable>)}</ScrollView><AvatarPicker value={draftAvatar} onChange={setDraftAvatar} /><Text style={styles.fieldLabel}>WHAT SHOULD WE CALL YOU?</Text><TextInput accessibilityLabel="Player name" value={draftName} onChangeText={setDraftName} placeholder="Your first name" placeholderTextColor="#89919a" style={styles.nameInput} returnKeyType="done" onSubmitEditing={createProfile} /><PrimaryButton label="BUILD MY PLAYBOOK" onPress={createProfile} disabled={!draftName.trim()} /><Text style={styles.privacyNote}>No account required. Progress saves on this device.</Text></View>{isTablet && <View style={styles.onboardingArena}><Text style={styles.arenaLabel}>YOUR FIRST MISSION</Text><View style={styles.squad}><MiniCharacter id="avatar-01" size={152} animated /><MiniCharacter id="avatar-10" size={162} animated /><MiniCharacter id="avatar-15" size={152} animated /></View>{["Choose a sport", "Make the read", "Master the concept"].map((step, index) => <View key={step} style={styles.missionStep}><View style={[styles.stepNumber, index === 0 && styles.stepNumberActive]}><Text style={styles.stepNumberText}>0{index + 1}</Text></View><Text style={styles.missionText}>{step}</Text></View>)}</View>}</ScrollView></SafeAreaView>;
  }

  const gameChrome = screen === "home" || screen === "sport" || screen === "profile" || screen === "league";
  const header = <View style={[styles.header, gameChrome && styles.headerGame]}><Pressable accessibilityLabel="Return to RepQuest home" onPress={() => setScreen("home")}><Logo /></Pressable><View style={styles.headerActions}><Pressable accessibilityLabel="Open XP league" onPress={() => setScreen("league")} style={[styles.leagueButton, gameChrome && styles.leagueButtonGame]}><MaterialCommunityIcons name="trophy-variant" size={18} color={gameChrome ? COLORS.gold : COLORS.teal} /></Pressable><Pressable accessibilityLabel="Open XP league" onPress={() => setScreen("league")} style={[styles.xpPill, gameChrome && styles.xpPillGame]}><Text style={styles.xpLabel}>XP</Text><Text style={[styles.xpValue, gameChrome && styles.xpValueGame]}>{profile.xp}</Text></Pressable>{/* Sound controls stay hidden until RepQuest has a complete audio experience. */}<Pressable accessibilityLabel="Open profile" onPress={() => { setDraftName(profile.name); setDraftAge(profile.ageBand); setDraftAvatar(profile.avatarId); setScreen("profile"); }} style={[styles.headerAvatar, gameChrome && styles.headerAvatarGame]}><GameAvatar id={profile.avatarId} size={42} /></Pressable></View></View>;

  if (screen === "primer" && activeModule) {
    const guide = moduleGuideFor(activeModule, sport, profile.ageBand);
    const lesson = guide?.lessons[primerIndex];
    if (guide && lesson) {
      const isLast = primerIndex === guide.lessons.length - 1;
      const isEarlyReader = profile.ageBand === "7-9";
      const narration = lessonNarrationText(lesson, profile.ageBand);
      const lessonTerms = narration.terms;
      const lessonTitle = narration.title;
      const coachingSteps = activeModule.pathway === "position" && lessonTitle.includes(" · ") ? lessonTitle.split(" · ") : [];
      const lessonBody = narration.body;
      const lessonAudio = narration.text;
      const lessonAudioSource = VOICE_NARRATION_ENABLED
        ? mobileLessonAudioAssetFor(lessonAudioKey(activeModule.id, profile.ageBand, primerIndex, coachVoice))
        : undefined;
      return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />
        <View style={[styles.quizHeader, styles.quizHeaderGame]}><BackButton label="PATH" onPress={() => setScreen("sport")} /><View style={styles.primerHeaderDots}>{guide.lessons.map((_, index) => <View key={index} style={[styles.primerHeaderDot, index <= primerIndex && { backgroundColor: "#7350b4" }]} />)}</View><Text style={[styles.questionCount, styles.questionCountGame]}>{primerIndex + 1}/{guide.lessons.length}</Text></View>
        <ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.gameFlowBackground}>
          <ScrollView contentContainerStyle={[styles.primerContent, isTablet && styles.quizContentTablet]}>
            <View style={[styles.primerStage, isEarlyReader && styles.primerStageEarly, styles.questPrimerStage]}>
              <View style={[styles.primerMark, { backgroundColor: "#7350b4" }]}><MaterialCommunityIcons name={sport.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={44} color="white" /></View>
              <Text style={[styles.primerKicker, { color: COLORS.teal }]}>{lesson.eyebrow}</Text>
              <Text style={[styles.primerSport,styles.questLightCopy]}>{sport.name} · {activeModule.coreCourse ? "Learn, then play" : isEarlyReader ? "Read and play" : "Beginner playbook"}</Text>
              <Text style={[styles.primerTitle, isTablet && styles.questionTitleTablet, isEarlyReader && styles.primerTitleEarly, styles.questQuestionTitle]}>{coachingSteps.length ? "Make your next decision" : lessonTitle}</Text>
              {VOICE_NARRATION_ENABLED && isEarlyReader && <HearButton text={lessonAudio} label="HEAR THIS LESSON" coachVoice={coachVoice} audioSource={lessonAudioSource} />}
              <Text style={[styles.primerBody, isEarlyReader && styles.primerBodyEarly, styles.questPrimerBody]}>{lessonBody}</Text>
              {coachingSteps.length > 0 && <View style={styles.coachingSteps}>{coachingSteps.map((step,index) => <View key={step} style={styles.coachingStep}><Text style={styles.coachingStepNumber}>{index+1}</Text><Text style={styles.coachingStepText}>{step}</Text></View>)}</View>}
              {lessonTerms && <View style={styles.primerTerms}>{lessonTerms.map((item) => <View key={item.term} style={[styles.primerTerm, isEarlyReader && styles.primerTermEarly, { borderLeftColor: sport.color }, styles.questPrimerTerm]}><Text style={[styles.primerTermName, isEarlyReader && styles.primerTermNameEarly, styles.questTermTitle]}>{item.term}</Text><Text style={[styles.primerTermMeaning, isEarlyReader && styles.primerTermMeaningEarly, styles.questPrimerBody]}>{isEarlyReader ? firstSentence(item.meaning) : item.meaning}</Text></View>)}</View>}
              {formationExerciseForModule(activeModule.id) && <FormationBoardMobile exercise={formationExerciseForModule(activeModule.id)!} teaching />}
              <View style={styles.primerCoach}><GameAvatar id={profile.avatarId} size={98} animated /><View style={styles.primerCoachBubble}><Text style={styles.primerCoachTitle}>{primerIndex === 0 ? "START HERE" : isLast ? "READY TO PLAY" : "YOU’VE GOT THIS"}</Text><Text style={styles.primerCoachText}>{isEarlyReader ? isLast ? "Pick an answer. Mistakes help us learn!" : VOICE_NARRATION_ENABLED ? "Tap Hear. Then tap Next." : "Look at the picture. Then tap Next." : primerIndex === 0 ? guide.welcome : isLast ? "The quiz checks what this playbook just taught. It is always okay to learn from a miss." : "Take your time. The words will make more sense each time you see the sport."}</Text></View></View>
              <View style={styles.primerActions}>{primerIndex > 0 && <Pressable onPress={() => setPrimerIndex((index) => index - 1)}><Text style={styles.primerPrevious}>← {isEarlyReader ? "BACK" : "PREVIOUS"}</Text></Pressable>}<View style={styles.primerPrimary}><PrimaryButton label={isEarlyReader ? isLast ? "PLAY" : "NEXT" : isLast ? "LET’S TRY IT" : "KEEP LEARNING"} onPress={() => { if (isLast) setScreen("quiz"); else { recordProductEvent("lesson_viewed", { sportId: activeModule.sportId, moduleId: activeModule.id, step: primerIndex + 2, totalSteps: guide.lessons.length }); setPrimerIndex((index) => index + 1); } }} /></View></View>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>;
    }
  }

  if (screen === "quiz" && question) {
    const expected = Array.isArray(question.correct) ? question.correct : [question.correct];
    const showFeedbackCoach = profile.ageBand === "7-9" || profile.ageBand === "10-12";
    const isEarlyReader = profile.ageBand === "7-9";
    const selectionComplete = question.type === "match" ? selected.length === question.pairs?.length : question.type === "multi" || question.type === "ordering" ? selected.length === expected.length : selected.length === 1;
    const spokenQuestion = `${question.prompt}. ${question.options.map((option, index) => `Choice ${index + 1}. ${option}`).join(". ")}`;
    return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />
      <View style={[styles.quizHeader, styles.quizHeaderGame]}><BackButton label="PATH" onPress={() => setScreen("sport")} /><View style={[styles.progressTrack, styles.progressTrackGame]}><View style={[styles.progressFill, { width: `${((questionIndex + (feedback ? 1 : 0)) / quiz.length) * 100}%`, backgroundColor: sport.color }]} /></View><Text style={[styles.questionCount, styles.questionCountGame]}>{questionIndex + 1}/{quiz.length}</Text></View>
      <ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.gameFlowBackground}>
      <ScrollView ref={quizScrollRef} onContentSizeChange={()=>{if(feedback)quizScrollRef.current?.scrollToEnd({animated:false});}} contentContainerStyle={[styles.quizContent, isTablet && styles.quizContentTablet, styles.questScrollPadding]}>
        <View style={[styles.quizStage, isEarlyReader && styles.quizStageEarly, styles.questQuizStage]}>
        <View style={styles.quizMeta}><View><View style={[styles.interactionBadge, { backgroundColor: "#7350b4" }]}><Text style={styles.interactionBadgeText}>{question.type === "multi" ? "PICK THE TEAM" : question.type === "ordering" ? "BUILD THE SEQUENCE" : "MAKE THE CALL"}</Text></View><Text style={styles.quizSport}>{sport.name}{activeModule?.position ? ` · ${activeModule.position}` : ""}</Text></View><QuizTimer key={question.id} duration={activeModule?.coreCourse ? null : agePath.seconds} paused={!!feedback} onExpire={() => checkAnswer([], true)} /></View>
        <View style={styles.questCoachLine}><GameAvatar id={profile.avatarId} size={88} /><View style={styles.questCoachBubble}><Text accessibilityRole="header" style={[styles.questCoachCopy,styles.questCoachQuestion]}>{question.prompt}</Text></View></View>
        {question.instruction && <Text style={styles.questInstruction}>{question.instruction}</Text>}
        {VOICE_NARRATION_ENABLED && isEarlyReader && <HearButton text={spokenQuestion} label="HEAR THE QUESTION" coachVoice={coachVoice} />}
        <Text style={[styles.answerInstruction, isEarlyReader && styles.answerInstructionEarly, styles.questLightCopy]}>{exerciseInstruction(question)}</Text>
        <ExerciseChoicesMobile key={question.id} challenge={question} selected={selected} onSelect={(values) => { setSelected(values); if (isEarlyReader && !activeModule?.coreCourse && !["multi", "ordering", "match"].includes(question.type)) checkAnswer(values); }} disabled={!!feedback} reveal={!!feedback} />

        {feedback && <View accessibilityLiveRegion="polite" accessible style={[styles.feedback, isEarlyReader && styles.feedbackEarly, feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong, styles.questFeedback]}>{showFeedbackCoach && <FeedbackCoach avatarId={profile.avatarId} correct={feedback.correct} timedOut={feedback.timedOut} />}<Text style={[styles.feedbackLabel,styles.questLightCopy]}>{isEarlyReader ? feedback.correct ? "GREAT JOB!" : "GOOD TRY!" : feedback.correct ? "THAT’S THE RIGHT CALL" : feedback.timedOut ? "TIME’S UP — LET’S LEARN IT" : "LET’S LEARN THIS ONE"}</Text><Text style={[styles.feedbackText,styles.questFeedbackText]}>{question.explanation}</Text>{!feedback.correct && <><Text style={[styles.correctAnswer,styles.questLightCopy]}>{isEarlyReader ? "Answer" : "Correct answer"}: {formattedCorrectAnswer(question)}</Text><Text style={[styles.replayNotice,styles.questLightCopy]}>You’ll try this again before the lesson ends.</Text></>}{VOICE_NARRATION_ENABLED && isEarlyReader && <HearButton text={`${feedback.correct ? "Great job." : "Good try."} ${question.explanation}`} label="HEAR WHY" coachVoice={coachVoice} />}<PrimaryButton label={isEarlyReader ? questionIndex === quiz.length - 1 ? "DONE" : "NEXT" : questionIndex === quiz.length - 1 ? "FINISH MISSION" : "NEXT QUESTION"} onPress={advance} /></View>}
        </View>
      </ScrollView>
      {!feedback && <View style={styles.questCheckDock}><PrimaryButton label={question.type === "ordering" ? "CHECK MY ORDER" : "CHECK MY ANSWER"} onPress={checkAnswer} disabled={!selectionComplete}/></View>}
      </ImageBackground>
    </SafeAreaView>;
  }

  if (screen === "result") {
    return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" /><ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.gameFlowBackground}><ScrollView contentContainerStyle={styles.resultContent}><View style={styles.resultStage}><View style={[styles.resultBadge, { backgroundColor: "#7350b4" }]}><MaterialCommunityIcons name={lastRunPractice ? "check-decagram" : "trophy-award"} size={27} color="white" /></View><GameAvatar id={profile.avatarId} size={140} animated /><Text style={styles.kicker}>{activeModule?.position ? `${activeModule.position.toUpperCase()} IQ` : sport.name.toUpperCase()} · {lastRunPractice ? "PRACTICE COMPLETE" : "MISSION COMPLETE"}</Text><Text style={styles.resultTitle}>{lastRunPractice ? <>Another rep.{`\n`}More confidence.</> : <>Lesson complete!{`\n`}Keep building your game.</>}</Text><View style={styles.xpAward}><Text style={styles.xpAwardLabel}>{lastRunPractice ? "MASTERY UPDATED" : "XP EARNED"}</Text><Text style={styles.xpAwardValue}>{lastRunPractice ? "✓" : `+${quizXp}`}</Text>{lastRunPractice && <Text style={styles.practiceNote}>XP is awarded once per mission so progress stays fair.</Text>}</View><View style={styles.resultStats}><View><Text style={styles.resultStatValue}>{correctCount}/{quiz.length}</Text><Text style={styles.resultStatLabel}>CORRECT</Text></View><View><Text style={styles.resultStatValue}>{Math.round((correctCount / Math.max(1, quiz.length)) * 100)}%</Text><Text style={styles.resultStatLabel}>ACCURACY</Text></View></View><PrimaryButton label={`CONTINUE ${activeModule?.position ? activeModule.position.toUpperCase() : sport.name.toUpperCase()} PATH`} onPress={() => setScreen("sport")} /><Pressable onPress={() => setScreen("home")}><Text style={styles.secondaryLink}>Choose another sport</Text></Pressable></View></ScrollView></ImageBackground></SafeAreaView>;
  }

  if (screen === "league") {
    const isChild = profile.accountKind === "child" || profile.ageBand === "7-9" || profile.ageBand === "10-12";
    const nextMilestone = XP_MILESTONES.find((milestone) => milestone.xp > profile.xp);
    return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />{header}<ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.gameFlowBackground}><ScrollView contentContainerStyle={[styles.page, styles.gameFlowPage, { width: contentWidth }]}>
      <BackButton label="HOME" onPress={() => setScreen("home")} />
      <View style={styles.leagueHero}><View><Text style={styles.leagueKicker}>XP LEAGUE</Text><Text style={styles.leagueTitle}>CLIMB BY{`\n`}LEARNING.</Text><Text style={styles.leagueCopy}>Finish missions. Build real game knowledge. Earn your place.</Text></View><MaterialCommunityIcons name="trophy-variant" size={78} color={COLORS.gold} /></View>
      <View style={styles.leagueSafety}><MaterialCommunityIcons name="shield-check" size={26} color={COLORS.teal} /><View style={styles.leagueSafetyCopy}><Text style={styles.leagueSafetyTitle}>{isChild ? "PRIVATE YOUTH LEAGUE" : "ALIAS-ONLY PUBLIC LEAGUE"}</Text><Text style={styles.leagueSafetyText}>{isChild ? "Players under 13 stay off the public board. Beat your own XP milestones." : "Only opted-in players age 13+ appear. No legal names, ages, email, messages, or followers."}</Text></View></View>
      <View style={styles.leagueScore}><GameAvatar id={profile.avatarId} size={150} animated /><Text style={styles.leagueScoreLabel}>YOUR SCORE</Text><Text style={styles.leagueScoreValue}>{profile.xp.toLocaleString()} XP</Text><Text style={styles.leagueScoreNext}>{nextMilestone ? `${nextMilestone.xp - profile.xp} XP to ${nextMilestone.name}` : "Top milestone reached"}</Text></View>
      <View style={styles.mobileLeagueBoard}><Text style={styles.mobileLeagueBoardTitle}>{isChild ? "YOUR PRIVATE CLIMB" : "PUBLIC LEAGUE"}</Text>{isChild ? XP_MILESTONES.map((milestone, index) => { const reached = profile.xp >= milestone.xp; return <View key={milestone.name} style={[styles.milestoneRow, reached && styles.milestoneRowReached]}><View style={[styles.milestoneRank, reached && styles.milestoneRankReached]}><Text style={styles.milestoneRankText}>{reached ? "✓" : index + 1}</Text></View><View style={styles.milestoneCopy}><Text style={styles.milestoneName}>{milestone.name}</Text><Text style={styles.milestoneXp}>{milestone.xp.toLocaleString()} XP</Text></View><Text style={[styles.milestoneStatus, reached && styles.milestoneStatusReached]}>{reached ? "CLEARED" : `${Math.max(0, milestone.xp - profile.xp)} TO GO`}</Text></View>; }) : <View style={styles.leagueEmpty}><MaterialCommunityIcons name="account-group" size={42} color={COLORS.teal} /><Text style={styles.leagueEmptyTitle}>READY FOR THE FIRST PLAYERS</Text><Text style={styles.leagueEmptyText}>Connect a secure account to opt in when provider keys go live. Guest XP remains private.</Text></View>}</View>
    </ScrollView></ImageBackground></SafeAreaView>;
  }

  if (screen === "legal") return <MobileLegalDocument kind={legalDocument} onBack={() => setScreen("profile")} />;

  if (screen === "profile") {
    return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />{header}<ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.gameFlowBackground}><ScrollView contentContainerStyle={[styles.page, styles.gameFlowPage, { width: contentWidth }]}>
      <BackButton label="HOME" onPress={() => setScreen("home")} />
      <View style={[styles.profileLayout, isTablet && styles.profileLayoutTablet]}>
        <View style={styles.playerCard}><Text style={styles.kicker}>YOUR AVATAR</Text><View style={styles.profileCharacter}><GameAvatar id={draftAvatar} size={190} animated /></View><Text style={styles.playerName}>{profile.accountKind === "child" || profile.ageBand === "7-9" || profile.ageBand === "10-12" ? "Player" : draftName || profile.name}</Text><Text style={styles.playerStats}>{profile.xp} XP · {profile.completedModules.length} missions complete</Text><View style={styles.playerStripe}><Text style={styles.playerStripeText}>{profile.ageBand === "7-9" ? "6–9" : profile.ageBand}</Text><Text style={styles.playerStripeText}>REPQUEST</Text></View></View>
        <View style={styles.profileForm}>
          <Text style={styles.profileTitle}>MY PROFILE</Text>
          {profile.accountKind !== "child" && profile.ageBand !== "7-9" && profile.ageBand !== "10-12" && <><Text style={styles.fieldLabel}>DISPLAY NAME</Text><TextInput value={draftName} onChangeText={setDraftName} style={styles.nameInput} /></>}
          <Text style={styles.fieldLabel}>AGE PATH</Text>
          <View style={styles.lockedAge}><Text style={styles.lockedAgeValue}>{profile.ageBand === "7-9" ? "6–9" : profile.ageBand}</Text><Text style={styles.lockedAgeText}>Sets reading support. Knowledge grows as you play.</Text><Pressable accessibilityRole="button" onPress={() => { setProfile((current) => ({ ...current, privacyGateComplete: false, measurementPreference: "essential-only", productEvents: [] })); setScreen("home"); }} style={styles.changeAgeButton}><Text style={styles.changeAgeButtonText}>CHANGE</Text></Pressable></View>
          <AvatarPicker value={draftAvatar} onChange={setDraftAvatar} />
          <PrimaryButton label="SAVE PROFILE" onPress={saveProfile} disabled={profile.accountKind !== "child" && profile.ageBand !== "7-9" && profile.ageBand !== "10-12" && !draftName.trim()} />
          <View style={styles.mobilePrivacyCenter}>
            <Text style={styles.mobilePrivacyTitle}>PRIVACY CENTER</Text>
            <Text style={styles.mobilePrivacyCopy}>{profile.accountKind === "child" ? "Private child path. No child email, legal name, public leaderboard entry, or product-improvement analytics are collected." : "Progress stays on this device during the beta. Optional product measurement is off unless you choose it."}</Text>
            <View style={styles.mobileIntegrityNote}><Text style={styles.mobileIntegrityTitle}>PROGRESS INTEGRITY</Text><Text style={styles.mobileIntegrityText}>XP is awarded on the first completion only. Practice builds mastery without farming XP.</Text></View>
            <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: profile.measurementPreference === "product-improvement", disabled: profile.accountKind === "child" }} disabled={profile.accountKind === "child"} onPress={() => setProfile((current) => ({ ...current, measurementPreference: current.measurementPreference === "product-improvement" ? "essential-only" : "product-improvement", productEvents: current.measurementPreference === "product-improvement" ? [] : current.productEvents }))} style={[styles.mobileMeasurementChoice, profile.accountKind === "child" && styles.disabled]}><View style={[styles.mobileLegalCheck, profile.measurementPreference === "product-improvement" && styles.mobileLegalCheckActive]}><Text style={styles.mobileLegalCheckText}>{profile.measurementPreference === "product-improvement" ? "✓" : ""}</Text></View><View style={styles.mobileMeasurementCopy}><Text style={styles.mobileMeasurementTitle}>HELP IMPROVE REPQUEST</Text><Text style={styles.mobileMeasurementText}>{profile.accountKind === "child" ? "Unavailable for players under 13." : "Keep coarse gameplay events for 30 days. No name, email, exact age, answers, ad ID, location, or device ID."}</Text></View></Pressable>
            <View style={styles.mobilePrivacyActions}><Pressable onPress={() => void exportLocalData()} style={styles.mobilePrivacyButton}><Text style={styles.mobilePrivacyButtonText}>EXPORT MY DATA</Text></Pressable><Pressable onPress={() => { setLegalDocument("privacy"); setScreen("legal"); }} style={styles.mobilePrivacyButton}><Text style={styles.mobilePrivacyButtonText}>PRIVACY NOTICE</Text></Pressable><Pressable onPress={() => { setLegalDocument("terms"); setScreen("legal"); }} style={styles.mobilePrivacyButton}><Text style={styles.mobilePrivacyButtonText}>TERMS OF USE</Text></Pressable></View>
            <Text style={styles.mobileLegalVersion}>LEGAL VERSIONS · {profile.legalAcceptance?.privacyVersion ?? "LEGACY"} / {profile.legalAcceptance?.termsVersion ?? "LEGACY"}</Text>
            <Pressable onPress={resetLearningProgress} style={styles.mobileDangerButton}><Text style={styles.mobileDangerButtonText}>RESET LEARNING PROGRESS</Text></Pressable>
            <Pressable onPress={deleteLocalProfile} style={[styles.mobileDangerButton, styles.mobileDangerButtonStrong]}><Text style={[styles.mobileDangerButtonText, styles.mobileDangerButtonStrongText]}>DELETE LOCAL PROFILE</Text></Pressable>
          </View>
        </View>
      </View>
    </ScrollView></ImageBackground></SafeAreaView>;
  }

  if (screen === "sport") {
    const groupedPositions = sport.positions.reduce<Record<string, Position[]>>((groups, position) => {
      groups[position.group] = [...(groups[position.group] ?? []), position]; return groups;
    }, {});
    const generalModules = generalModulesForSport(sport);
    const selectedPositionModules = selectedPosition ? positionModulesForPosition(sport, selectedPosition, profile.ageBand) : [];
    const positionModule = selectedPositionModules[0];
    const completedPositionCount = sport.positions.filter((position) => positionModulesForPosition(sport, position, profile.ageBand).every((module) => profile.completedModules.includes(module.id))).length;

    return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />{header}<ScrollView contentContainerStyle={[styles.questCoursePage,{width:contentWidth}]}>
      {pathway === "general" ? <CourseMapMobile key={sport.id} sport={sport} modules={generalModules} completedIds={profile.completedModules} avatarSource={avatarFor(profile.avatarId).source} onStart={startModule} onBack={() => setScreen("home")} onPositions={() => setPathway("position")} />
      : <View><BackButton label="GAME PATH" onPress={() => {setPathway("general");setSelectedPosition(null);}} />
        {selectedPosition && positionModule ? <View style={styles.positionDetail}>
        <BackButton label="ALL PATHS" onPress={() => setSelectedPosition(null)} />
        <View style={styles.positionHero}><View style={styles.positionHeroBadge}><Text style={styles.positionHeroInitials}>{positionAbbreviation(selectedPosition)}</Text></View><View style={styles.positionHeroCopy}><Text style={styles.positionHeroGroup}>{selectedPosition.group.toUpperCase()} · {selectedPositionModules.length} LEVEL{selectedPositionModules.length === 1 ? "" : "S"}</Text><Text style={styles.positionHeroTitle}>{selectedPosition.name} IQ</Text><Text style={styles.positionHeroText}>Learn the role. Practice the decisions. Build your game.</Text></View></View>
        <View style={styles.roadmap}><Text style={styles.roadmapTitle}>YOUR NEXT GOOD REP</Text>
          <View style={styles.positionTrail}>{selectedPositionModules.map((module, index) => {
            const complete = profile.completedModules.includes(module.id);
            const unlocked = complete || index === 0 || profile.completedModules.includes(selectedPositionModules[index - 1].id);
            return <View key={module.id} style={[styles.positionStep, { marginLeft: [0, 60, -60, 0][index % 4] }]}>
              <Pressable accessibilityRole="button" accessibilityLabel={`${complete ? "Practice" : unlocked ? "Start" : "Locked"}: ${module.title}`} accessibilityState={{ disabled: !unlocked }} disabled={!unlocked} onPress={() => startModule(module)} style={({ pressed }) => [styles.positionNode, complete ? styles.positionNodeComplete : !unlocked ? styles.positionNodeLocked : styles.positionNodeCurrent, pressed && styles.pressed]}>
                <MaterialCommunityIcons name={complete ? "check-bold" : unlocked ? "play" : "lock-outline"} size={30} color={unlocked && !complete ? COLORS.ink : COLORS.navy} />
              </Pressable>
              <Text style={styles.positionStepTitle}>{module.title}</Text>
              <Text style={styles.positionStepLabel}>{complete ? "CLEARED" : unlocked ? "PLAY NEXT" : "FINISH THE STEP ABOVE"}</Text>
            </View>;
          })}</View>
        </View>
      </View> : <View style={styles.positionRoom}>
        <View style={styles.positionRoomHeading}><View style={{flex:1}}><Text style={[styles.kicker, { color: COLORS.teal }]}>POSITION TRAINING</Text><Text style={styles.sectionTitle}>{sport.pathQuestion ?? "Who are you on the field?"}</Text><Text style={styles.sectionCopy}>CHOOSE ANY ROLE NOW. Learn the job, then make the play.</Text></View><View style={[styles.roomProgress, { borderColor: COLORS.teal }]}><Text style={[styles.roomProgressValue, { color: COLORS.teal }]}>{completedPositionCount}/{sport.positions.length}</Text><Text style={styles.roomProgressLabel}>ROOMS CLEARED</Text></View></View>
        {Object.entries(groupedPositions).map(([group, positions]) => <View key={group} style={styles.positionGroup}><View style={styles.positionGroupHeading}><View style={[styles.positionGroupDot, { backgroundColor: "#7350b4" }]} /><Text style={styles.positionGroupTitle}>{group.toUpperCase()}</Text><Text style={styles.positionGroupCount}>{positions.length} ROLES</Text></View><View style={styles.positionGrid}>{positions.map((position) => { const modules = positionModulesForPosition(sport, position, profile.ageBand); const completeCount = modules.filter((module) => profile.completedModules.includes(module.id)).length; const done = completeCount === modules.length; const initials = positionAbbreviation(position); return <Pressable key={position.name} onPress={() => setSelectedPosition(position)} style={({ pressed }) => [styles.positionCard, { borderColor: COLORS.line }, pressed && styles.pressed]}><View style={styles.positionCardTop}><View style={[styles.positionBadge, { backgroundColor: COLORS.surface2 }]}><Text style={[styles.positionBadgeText, { color: COLORS.teal }]}>{done ? "✓" : initials}</Text></View><Text style={[styles.positionStatus, done && { color: COLORS.green }]}>{done ? "CLEARED" : completeCount ? `${completeCount}/${modules.length}` : "FIRST XP"}</Text></View><Text style={styles.positionName}>{position.name}</Text><Text style={styles.positionFocus} numberOfLines={3}>Learn to {position.focus}.</Text><View style={styles.positionEnter}><Text style={[styles.positionEnterText, { color: COLORS.teal }]}>{done ? "PRACTICE PATH" : "ENTER ROOM"}</Text><Text style={[styles.positionEnterArrow, { color: COLORS.teal }]}>→</Text></View></Pressable>; })}</View></View>)}
      </View>}
      </View>}
    </ScrollView></SafeAreaView>;
  }

  return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />{header}<ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.homeBackground}><ScrollView contentContainerStyle={[styles.page, styles.homePage, { width: contentWidth }]}>
    <View style={[styles.homeGuide, isTablet && styles.homeGuideTablet]}>
      <View style={styles.homeGuideCopy}>
        <Text style={styles.homeGuideKicker}>HI, {profile.name.toUpperCase()} · AGES {profile.ageBand === "7-9" ? "6–9" : profile.ageBand}</Text>
        <Text style={[styles.homeGuideTitle, isTablet && styles.homeGuideTitleTablet]}>PICK A SPORT</Text>
        <View style={styles.homeStep}><View style={styles.homeStepNumber}><Text style={styles.homeStepNumberText}>1</Text></View><Text style={styles.homeStepText}>TAP TO START</Text></View>
      </View>
      <View style={styles.homeGuidePlayer}><GameAvatar id={profile.avatarId} size={isTablet ? 150 : 118} animated /></View>
    </View>
    <Text accessibilityRole="header" style={styles.sportsCatalogTitle}>ALL {SPORTS.length} SPORTS</Text>
    <Text style={styles.sportsCatalogNote}>START WITH ONE. BUILD YOUR GAME.</Text>
    <View style={styles.sportGrid}>{SPORTS.map(sportCard)}</View>
  </ScrollView></ImageBackground></SafeAreaView>;
}

export default function App() {
  return <SafeAreaProvider><RepQuestApp /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  homeSafe: { backgroundColor: "#100b3d" },
  homeBackground: { flex: 1 },
  gameFlowBackground: { flex: 1 },
  gameFlowPage: { paddingTop: 10 },
  questSportCard: { minHeight:150,backgroundColor:"#241b40",borderWidth:2,borderColor:"#56437d",borderBottomWidth:6,borderBottomColor:"#0c071b",borderRadius:25,padding:18 },
  questSportTitle: { color:"white",fontSize:24,lineHeight:29 },
  questLightCopy: { color:"#c9bfdc" },
  questPrimerStage: { backgroundColor:"#151027",borderColor:"#49395e" },
  questPrimerBody: { color:"#d5c9e5",fontSize:16,lineHeight:24,fontFamily:Platform.select({ios:"System",default:"sans-serif"}) },
  questPrimerTerm: { backgroundColor:"#241b36",borderLeftColor:"#b18af3" },
  questTermTitle: { color:"white",fontSize:17,lineHeight:23 },
  questCoursePage: { alignSelf:"center", paddingBottom:35, backgroundColor:"#100c29" },
  questQuizStage: { backgroundColor:"#151027", borderColor:"#3f3053", borderWidth:0, padding:18, borderRadius:20 },
  questScrollPadding:{paddingBottom:130},questCheckDock:{position:"absolute",bottom:0,left:0,right:0,padding:16,borderTopWidth:1,borderTopColor:"#473357",backgroundColor:"#151027"},
  coachingSteps:{gap:16,marginTop:16},coachingStep:{flexDirection:"row",alignItems:"flex-start",gap:12},coachingStepNumber:{width:30,height:30,borderRadius:10,backgroundColor:COLORS.surface2,color:COLORS.teal,fontSize:16,lineHeight:30,fontWeight:"800",textAlign:"center"},coachingStepText:{flex:1,color:COLORS.navy,fontSize:17,lineHeight:25},
  questCoachQuestion:{fontSize:21,lineHeight:28,fontWeight:"800",color:"#f5edff"},
  questQuestionTitle: { color:"white", fontSize:27, lineHeight:34 },
  questCoachLine: { flexDirection:"row", alignItems:"center", gap:8, marginBottom:15 },
  questCoachBubble: { flex:1, padding:14, borderWidth:2, borderColor:"#4b3e60", borderRadius:18, backgroundColor:"#241b35" },
  questCoachCopy: { color:"#ded1ed", fontSize:15, lineHeight:21, fontWeight:"700" },
  questInstruction: { color:"#ede4fb", fontSize:18, lineHeight:27, padding:18, marginVertical:18, borderWidth:2, borderColor:"#49395e", backgroundColor:"#241b36", borderRadius:18 },
  questFeedback: { backgroundColor:"#241b35", borderColor:"#816098" },
  questFeedbackText: { color:"#eadff7", fontSize:16, lineHeight:24 },
  youthJourneyFrame: { flex: 1, backgroundColor: "#090622" },
  lockerJourneyPage: { alignSelf: "center", paddingBottom: 91, backgroundColor: "#090622" },
  youthBottomNav: { position: "absolute", right: 0, bottom: 0, left: 0, height: 72, flexDirection: "row", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,.15)", backgroundColor: "#0c0831" },
  youthBottomNavButton: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  youthBottomNavButtonActive: { backgroundColor: "rgba(255,255,255,.07)" },
  youthBottomNavText: { color: "rgba(255,255,255,.65)", fontSize: 8, fontWeight: "900", letterSpacing: .5 },
  youthBottomNavTextActive: { color: COLORS.gold },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 22, backgroundColor: COLORS.paper },
  loadingText: { color: COLORS.muted, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  logo: { backgroundColor: "#100b3d", shadowColor: "#09051f", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
  onboarding: { flexGrow: 1, padding: 22, gap: 28, backgroundColor: COLORS.paper },
  onboardingTablet: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 65, paddingHorizontal: 55 },
  onboardingCopy: { width: "100%", maxWidth: 680 },
  kicker: { color: COLORS.teal, fontSize: 9, fontWeight: "900", letterSpacing: 1.5, marginBottom: 9 },
  displayTitle: { color: COLORS.navy, fontSize: 47, fontWeight: "900", letterSpacing: -3.4, lineHeight: 43, marginTop: 24 },
  displayTitleTablet: { fontSize: 72, lineHeight: 65, letterSpacing: -5 },
  tealText: { color: COLORS.teal },
  lede: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 17, lineHeight: 25, marginVertical: 18, maxWidth: 620 },
  fieldLabel: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 1.3, marginTop: 20, marginBottom: 9 },
  ageList: { gap: 8, paddingBottom: 12 },
  ageChoice: { width: 150, minHeight: 114, padding: 13, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface },
  ageChoiceActive: { borderColor: COLORS.teal, backgroundColor: COLORS.teal, transform: [{ translateY: -2 }] },
  ageValue: { color: COLORS.teal, fontSize: 11, fontWeight: "900", marginBottom: 11 },
  ageTitle: { color: COLORS.navy, fontSize: 14, fontWeight: "900", marginBottom: 5 },
  ageNote: { color: COLORS.muted, fontSize: 10, lineHeight: 14 },
  choiceTextActive: { color: "white" },
  avatarHint: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, marginBottom: 10 },
  avatarList: { gap: 10, paddingVertical: 4, paddingHorizontal: 3, paddingBottom: 16 },
  avatarChoice: { width: 126, height: 150, alignItems: "center", justifyContent: "flex-end", paddingBottom: 10, overflow: "hidden", borderWidth: 2, borderColor: COLORS.line, borderRadius: 22, backgroundColor: COLORS.surface },
  avatarChoiceActive: { borderColor: COLORS.teal, borderWidth: 3, backgroundColor: COLORS.surface, transform: [{ translateY: -3 }, { scale: 1.02 }] },
  avatarName: { color: COLORS.muted, fontSize: 10, fontWeight: "900", letterSpacing: 0.7, textTransform: "uppercase" },
  avatarNameActive: { color: COLORS.teal },
  avatarCheck: { position: "absolute", top: 8, right: 8, width: 26, height: 26, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: COLORS.teal },
  avatarCheckText: { color: COLORS.ink, fontSize: 15, fontWeight: "900" },
  nameInput: { minHeight: 54, paddingHorizontal: 15, borderWidth: 2, borderColor: COLORS.navy, borderRadius: 18, backgroundColor: COLORS.surface, color: COLORS.navy, fontSize: 16, fontWeight: "700", marginBottom: 10 },
  primaryButton: { minHeight: 54, maxWidth: 480, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, borderRadius: 18, backgroundColor: COLORS.gold, shadowColor: "#0d0818", shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
  primaryButtonText: { color: COLORS.ink, fontSize: 11, fontWeight: "900", letterSpacing: 0.7 },
  primaryArrow: { color: COLORS.ink, fontSize: 21, fontWeight: "800" },
  hearButton: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, alignSelf: "flex-start", paddingHorizontal: 17, marginTop: 14, marginBottom: 3, borderRadius: 18, backgroundColor: "#6547c7", shadowColor: "#0d0818", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 9, elevation: 4 },
  hearButtonCopy: { alignItems: "flex-start", gap: 1 },
  hearButtonText: { color: "white", fontSize: 12, fontWeight: "900", letterSpacing: 0.55 },
  hearButtonDisclosure: { color: "#e9e2ff", fontSize: 8, fontWeight: "800", letterSpacing: 0.8 },
  pressed: { transform: [{ translateX: 2 }, { translateY: 2 }], opacity: 0.9 },
  disabled: { opacity: 0.42 },
  privacyNote: { color: COLORS.muted, fontSize: 10, marginTop: 13 },
  onboardingArena: { width: 370, padding: 28, borderWidth: 2, borderColor: COLORS.navy, backgroundColor: "#1f5452", shadowColor: "#0d0818", shadowOffset: { width: 12, height: 12 }, shadowOpacity: 1, shadowRadius: 0 },
  arenaLabel: { alignSelf: "flex-start", padding: 7, backgroundColor: COLORS.gold, color: COLORS.ink, fontSize: 8, fontWeight: "900", letterSpacing: 1.1 },
  squad: { height: 150, flexDirection: "row", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", marginVertical: 8 },
  missionStep: { flexDirection: "row", alignItems: "center", gap: 15, paddingVertical: 16, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,.22)" },
  stepNumber: { width: 43, height: 43, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,.4)", borderRadius: 22 },
  stepNumberActive: { backgroundColor: COLORS.gold },
  stepNumberText: { color: "white", fontSize: 10, fontWeight: "900" },
  missionText: { color: "white", fontSize: 16, fontWeight: "800" },
  header: { minHeight: 62, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.line, backgroundColor: "rgba(246,243,235,.97)" },
  headerGame: { borderBottomColor: "rgba(255,255,255,.14)", backgroundColor: "#100b3d" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 7 },
  xpPill: { height: 38, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 9, borderWidth: 1, borderColor: COLORS.line, borderRadius: 19, backgroundColor: COLORS.surface },
  xpPillGame: { borderColor: "rgba(255,255,255,.2)", backgroundColor: "rgba(255,255,255,.1)" },
  xpLabel: { padding: 4, backgroundColor: "#f4e4bf", color: COLORS.ink, fontSize: 7, fontWeight: "900" },
  xpValue: { color: COLORS.navy, fontSize: 11, fontWeight: "900" },
  xpValueGame: { color: "white" },
  headerAvatar: { width: 46, height: 46, alignItems: "center", justifyContent: "center", overflow: "hidden", borderWidth: 2, borderColor: COLORS.teal, borderRadius: 23, backgroundColor: "#e2eeea" },
  headerAvatarGame: { borderColor: COLORS.gold, backgroundColor: "#34276f" },
  page: { alignSelf: "center", padding: 18, paddingBottom: 70 },
  homePage: { paddingTop: 14 },
  homeGuide: { minHeight: 150, flexDirection: "row", alignItems: "center", overflow: "hidden", paddingLeft: 20, marginBottom: 21, borderWidth: 1, borderColor: "rgba(255,255,255,.22)", borderRadius: 28, backgroundColor: "rgba(38,25,105,.82)", shadowColor: "#08051f", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 18, elevation: 8 },
  homeGuideTablet: { minHeight: 190, paddingLeft: 34 },
  homeGuideCopy: { zIndex: 2, flex: 1 },
  homeGuideKicker: { color: COLORS.gold, fontSize: 8, fontWeight: "900", letterSpacing: 1.15, marginBottom: 7 },
  homeGuideTitle: { color: "white", fontSize: 38, fontWeight: "900", letterSpacing: -2.4, lineHeight: 40 },
  homeGuideTitleTablet: { fontSize: 58, lineHeight: 61, letterSpacing: -3.6 },
  homeStep: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 11 },
  homeStepNumber: { width: 25, height: 25, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: COLORS.gold },
  homeStepNumberText: { color: COLORS.navy, fontSize: 9, fontWeight: "900" },
  homeStepText: { color: "rgba(255,255,255,.75)", fontSize: 7, fontWeight: "900", letterSpacing: 0.9 },
  homeGuidePlayer: { width: 126, height: 150, alignItems: "center", justifyContent: "flex-end", overflow: "hidden", borderTopLeftRadius: 72, borderBottomLeftRadius: 72, backgroundColor: "transparent" },
  sectionTitle: { color: COLORS.navy, fontSize: 31, fontWeight: "900", letterSpacing: -1.7, marginBottom: 7 },
  sectionCopy: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 13, lineHeight: 19 },
  sportGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, justifyContent: "center" },
  sportsCatalogTitle: { marginTop: 4, color: "white", fontSize: 24, fontWeight: "900", letterSpacing: -0.7 },
  sportsCatalogNote: { marginTop: 5, marginBottom: 14, color: "rgba(255,255,255,.72)", fontSize: 9, fontWeight: "900", letterSpacing: 0.8 },
  sportCard: { minHeight: 220, padding: 16, borderWidth: 1, borderTopWidth: 5, borderColor: COLORS.line, backgroundColor: COLORS.surface, shadowColor: "#0d0818", shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.1, shadowRadius: 0 },
  sportCardSimple: { minHeight: 178, padding: 14, overflow: "hidden", borderWidth: 0, borderTopWidth: 0, borderRadius: 24, shadowColor: "#08051f", shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.32, shadowRadius: 14, elevation: 7 },
  sportCardSimpleTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  sportMarkSimple: { width: 66, height: 66, borderWidth: 0, borderRadius: 33, backgroundColor: "rgba(255,255,255,.82)", shadowColor: "#0d0818", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 7, elevation: 3 },
  sportCompleteBadge: { width: 25, height: 25, alignItems: "center", justifyContent: "center", borderRadius: 13 },
  sportCompleteBadgeText: { color: "white", fontSize: 12, fontWeight: "900" },
  sportCardSimpleTitle: { flex: 1, color: COLORS.navy, fontSize: 17, fontWeight: "900", letterSpacing: -0.55, lineHeight: 19, marginTop: 11 },
  sportCardSimpleBottom: { flexDirection: "row", alignItems: "center", gap: 9, marginTop: "auto" },
  sportProgressCopy: { flex: 1, gap: 5 },
  sportProgressLabel: { fontSize: 8, fontWeight: "900", letterSpacing: 0.2 },
  sportProgressTrack: { flex: 1, height: 5, overflow: "hidden", backgroundColor: "rgba(255,255,255,.75)" },
  sportProgressFill: { height: "100%" },
  sportArrowButton: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 16 },
  sportArrowButtonText: { color: "white", fontSize: 17, fontWeight: "900" },
  gameCardPressed: { transform: [{ scale: 0.97 }], opacity: 0.94 },
  sportMark: { width: 62, height: 62, alignItems: "center", justifyContent: "center", borderWidth: 2, backgroundColor: COLORS.surface },
  backButton: { alignSelf: "flex-start", minHeight: 48, flexDirection: "row", alignItems: "center", gap: 9, paddingRight: 14, marginVertical: 6, borderRadius: 24, backgroundColor: COLORS.surface, shadowColor: "#0d0818", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.13, shadowRadius: 7, elevation: 3 },
  backButtonIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 24, backgroundColor: COLORS.gold },
  backButtonText: { color: COLORS.navy, fontSize: 11, fontWeight: "900", letterSpacing: 0.75 },
  backButtonPressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
  sportHero: { flexDirection: "row", alignItems: "center", gap: 20, paddingVertical: 24 },
  sportHeroGame: { position: "relative", overflow: "hidden", minHeight: 245, paddingHorizontal: 22, marginTop: 4, borderRadius: 30, shadowColor: "#09051f", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.34, shadowRadius: 18, elevation: 7 },
  sportStartNow: { marginTop: 14, marginBottom: 4 },
  heroOrb: { position: "absolute", width: 170, height: 170, borderWidth: 34, borderColor: "rgba(255,255,255,.11)", borderRadius: 85 },
  heroOrbOne: { top: -82, right: -38 },
  heroOrbTwo: { bottom: -110, left: 52 },
  sportMarkLarge: { width: 82, height: 82, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  sportMarkHero: { zIndex: 2, width: 92, height: 92, borderRadius: 28, transform: [{ rotate: "-5deg" }], backgroundColor: COLORS.gold, borderColor: "rgba(255,255,255,.75)", shadowColor: "#0d0818", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.27, shadowRadius: 12 },
  sportHeroCopy: { flex: 1 },
  sportHeroKicker: { color: "rgba(255,255,255,.8)", fontSize: 8, fontWeight: "900", letterSpacing: 1.4, marginBottom: 7 },
  sportTitle: { color: COLORS.navy, fontSize: 43, fontWeight: "900", letterSpacing: -2.7, lineHeight: 46 },
  sportTitleLight: { color: "white", textShadowColor: "rgba(18,35,59,.32)", textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 },
  sportNoteLight: { maxWidth: 700, color: "rgba(255,255,255,.9)", fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, lineHeight: 18, marginTop: 6 },
  heroScoreRow: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 16 },
  heroScorePill: { minWidth: 78, paddingHorizontal: 10, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(255,255,255,.35)", borderRadius: 14, backgroundColor: "rgba(18,35,59,.22)" },
  heroScoreValue: { color: COLORS.gold, fontSize: 15, fontWeight: "900" },
  heroScoreLabel: { color: "white", fontSize: 6, fontWeight: "900", letterSpacing: 0.65, marginTop: 2 },
  lessonTitle: { color: COLORS.navy, fontSize: 27, fontWeight: "900", letterSpacing: -1.2, marginBottom: 7 },
  lessonText: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 14, lineHeight: 21, marginBottom: 22 },
  pathTabs: { flexDirection: "column", gap: 12, marginTop: 19, marginBottom: 20 },
  pathTabsPhone: { gap: 10, marginBottom: 16 },
  pathTab: { width: "100%", minHeight: 88, flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 2, borderColor: "rgba(255,255,255,.45)", borderRadius: 22, backgroundColor: "rgba(255,255,255,.94)", shadowColor: "#09051f", shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
  pathTabPhone: { minHeight: 74, gap: 10, padding: 12, borderRadius: 20 },
  pathTabActive: { backgroundColor: "#fffaf0", shadowOpacity: 0.32 },
  pathTabNumber: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: COLORS.surface2 },
  pathTabNumberPhone: { width: 40, height: 40, borderRadius: 20 },
  pathTabNumberText: { color: COLORS.navy, fontSize: 10, fontWeight: "900" },
  pathTabCopy: { flex: 1 },
  pathTabTitle: { color: COLORS.navy, fontSize: 11, fontWeight: "900", letterSpacing: 0.5 },
  pathTabTitlePhone: { fontSize: 12, letterSpacing: 0.3 },
  pathTabNote: { color: COLORS.muted, fontSize: 9, lineHeight: 13, marginTop: 4 },
  pathTabNotePhone: { fontSize: 9, lineHeight: 13, marginTop: 3 },
  pathTabArrow: { color: COLORS.navy, fontSize: 20, fontWeight: "900" },
  missionCard: { maxWidth: 760, padding: 22, borderRadius: 26, backgroundColor: COLORS.surface, shadowColor: "#09051f", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.27, shadowRadius: 16, elevation: 6 },
  missionCardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  missionCardCopy: { flex: 1 },
  xpBurst: { width: 61, height: 61, alignItems: "center", justifyContent: "center", borderRadius: 31, transform: [{ rotate: "5deg" }], borderWidth: 2, borderColor: COLORS.navy },
  xpBurstValue: { color: "white", fontSize: 13, fontWeight: "900" },
  xpBurstLabel: { color: "rgba(255,255,255,.8)", fontSize: 6, fontWeight: "900" },
  positionRoom: { padding: 16, paddingBottom: 30, borderRadius: 28, backgroundColor: COLORS.paper, shadowColor: "#09051f", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.24, shadowRadius: 16, elevation: 5 },
  positionRoomHeading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 14, marginTop: 10, marginBottom: 26 },
  roomProgress: { minWidth: 94, alignItems: "center", padding: 11, borderWidth: 2, borderRadius: 18, backgroundColor: COLORS.surface },
  roomProgressValue: { fontSize: 20, fontWeight: "900" },
  roomProgressLabel: { color: COLORS.muted, fontSize: 11, fontWeight: "900", letterSpacing: 0.6 },
  positionGroup: { marginBottom: 27 },
  positionGroupHeading: { flexDirection: "row", alignItems: "center", gap: 8, paddingBottom: 9, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  positionGroupDot: { width: 10, height: 10, transform: [{ rotate: "45deg" }] },
  positionGroupTitle: { color: COLORS.navy, fontSize: 11, fontWeight: "900", letterSpacing: 0.85 },
  positionGroupCount: { color: COLORS.muted, fontSize: 11, fontWeight: "900", marginLeft: "auto" },
  positionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingTop: 10 },
  positionCard: { width: "48%", minHeight: 190, padding: 14, borderWidth: 2, borderBottomWidth: 6, borderColor: COLORS.line, borderBottomColor:"#0d0818", borderRadius: 22, backgroundColor: COLORS.surface, shadowColor: "#0d0818", shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 3 },
  positionCardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  positionBadge: { minWidth: 45, height: 45, alignItems: "center", justifyContent: "center", paddingHorizontal: 7, borderRadius: 15, transform: [{ rotate: "-3deg" }] },
  positionBadgeText: { color: "white", fontSize: 11, fontWeight: "900" },
  positionStatus: { color: COLORS.coral, fontSize: 11, fontWeight: "900", letterSpacing: 0.5 },
  positionName: { color: COLORS.navy, fontSize: 17, fontWeight: "900", letterSpacing: -0.5, marginTop: 14 },
  positionFocus: { color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  positionEnter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.line },
  positionEnterText: { fontSize: 11, fontWeight: "900", letterSpacing: 0.55 },
  positionEnterArrow: { fontSize: 17, fontWeight: "900" },
  positionDetail: { maxWidth: 820, padding: 14, paddingBottom: 30, borderRadius: 28, backgroundColor: COLORS.paper, shadowColor: "#09051f", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.24, shadowRadius: 16, elevation: 5 },
  positionHero: { backgroundColor: COLORS.surface, position: "relative", overflow: "hidden", flexDirection: "row", alignItems: "center", gap: 16, padding: 20, borderRadius: 24 },
  positionHeroBadge: { width: 72, height: 72, alignItems: "center", justifyContent: "center", borderRadius: 36, borderWidth: 3, borderColor: COLORS.gold, backgroundColor: COLORS.surface },
  positionHeroInitials: { color:COLORS.teal, fontSize: 18, fontWeight: "900" },
  positionHeroCopy: { flex: 1 },
  positionHeroGroup: { color: COLORS.gold, fontSize: 8, fontWeight: "900", letterSpacing: 1.1 },
  positionHeroTitle: { color: "white", fontSize: 33, fontWeight: "900", letterSpacing: -1.8, marginTop: 3 },
  positionHeroText: { color: "rgba(255,255,255,.88)", fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, lineHeight: 18, marginTop: 5 },
  readBoard: { padding: 18, marginTop: 10, borderRadius: 22, backgroundColor: COLORS.navy },
  readBoardKicker: { color: COLORS.gold, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  readBoardGrid: { flexDirection: "row", gap: 8, marginTop: 12 },
  readBoardItem: { flex: 1, minHeight: 75, padding: 10, borderWidth: 1, borderColor: "rgba(255,255,255,.2)", borderRadius: 14, backgroundColor: COLORS.navy2 },
  readBoardNumber: { fontSize: 12, fontWeight: "900" },
  readBoardLabel: { color: "white", fontSize: 9, fontWeight: "800", lineHeight: 13, marginTop: 5 },
  positionMissionCard: { maxWidth: 820, marginTop: 14 },
  positionTrail: { alignItems:"center",gap:32,paddingVertical:24 },
  positionStep: { width:190,alignItems:"center",gap:12 },
  positionNode: { width:82,height:76,alignItems:"center",justifyContent:"center",borderWidth:3,borderBottomWidth:8,borderRadius:32,borderColor:"#af8de5",borderBottomColor:"#3b215f",backgroundColor:"#7350b4" },
  positionNodeCurrent: { borderColor:"#fff0b0",borderBottomColor:"#9e6f25",backgroundColor:COLORS.gold },
  positionNodeComplete: { borderColor:"#a7e8cd",borderBottomColor:"#184b3c",backgroundColor:"#327b65" },
  positionNodeLocked: { borderColor:"#544867",borderBottomColor:"#161021",backgroundColor:"#2c243a" },
  positionStepTitle: { color:COLORS.navy,fontSize:16,lineHeight:22,fontWeight:"800",textAlign:"center" },
  positionStepLabel: { color:COLORS.gold,fontSize:10,fontWeight:"800",textAlign:"center" },
  roadmap: { marginTop: 27 },
  roadmapTitle: { color: COLORS.navy, fontSize: 10, fontWeight: "900", letterSpacing: 0.9, marginBottom: 5 },
  quizHeader: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  quizHeaderGame: { borderBottomColor: "rgba(255,255,255,.14)", backgroundColor: "#100b3d" },
  progressTrack: { flex: 1, height: 7, overflow: "hidden", backgroundColor: COLORS.surface2 },
  progressTrackGame: { height: 9, borderRadius: 5, backgroundColor: "rgba(255,255,255,.18)" },
  progressFill: { height: "100%", backgroundColor: COLORS.teal },
  questionCount: { color: COLORS.muted, fontSize: 11, fontWeight: "900" },
  questionCountGame: { color: "white" },
  quizContent: { width: "100%", maxWidth: 780, alignSelf: "center", padding: 20, paddingBottom: 70 },
  quizContentTablet: { paddingTop: 45 },
  quizStage: { padding: 20, borderRadius: 28, backgroundColor: COLORS.surface, shadowColor: "#09051f", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 18, elevation: 7 },
  quizStageEarly: { padding: 16, borderWidth: 3, borderColor: "rgba(255,255,255,.42)" },
  quizMeta: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  interactionBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, marginBottom: 9, borderRadius: 12, transform: [{ rotate: "-1deg" }] },
  interactionBadgeText: { color: "white", fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  quizSport: { color: COLORS.muted, fontSize: 10 },
  timer: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.gold, borderRadius: 26, backgroundColor: COLORS.surface },
  timerLow: { borderColor: COLORS.coral },
  timerValue: { color: COLORS.navy, fontSize: 16, fontWeight: "900" },
  timerValueLow: { color: COLORS.coral },
  timerLabel: { color: COLORS.muted, fontSize: 6, fontWeight: "900" },
  questionTitle: { color: COLORS.navy, fontSize: 34, fontWeight: "900", letterSpacing: -1.8, lineHeight: 38, marginTop: 27, marginBottom: 9 },
  questionTitleEarly: { fontSize: 31, lineHeight: 34, letterSpacing: -1.4, textAlign: "center" },
  questionTitleTablet: { fontSize: 47, lineHeight: 51, letterSpacing: -2.7 },
  answerInstruction: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, marginBottom: 18 },
  answerInstructionEarly: { color: COLORS.navy, fontFamily: Platform.select({ ios: "System", default: "sans-serif" }), fontSize: 14, fontWeight: "900", textAlign: "center", marginTop: 13 },
  orderStrip: { padding: 13, marginTop: -6, marginBottom: 15, borderWidth: 1, borderColor: COLORS.gold, borderRadius: 16, backgroundColor: "#fff6df" },
  orderStripLabel: { color: COLORS.coral, fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  orderStripValue: { color: COLORS.navy, fontSize: 10, fontWeight: "800", lineHeight: 16, marginTop: 6, paddingRight: 45 },
  resetOrder: { position: "absolute", right: 0, bottom: 0, color: COLORS.teal, fontSize: 8, fontWeight: "900", textDecorationLine: "underline" },
  answerGrid: { gap: 9, marginBottom: 20 },
  answerGridTablet: { flexDirection: "row", flexWrap: "wrap" },
  answerCard: { minHeight: 78, flex: 1, minWidth: 280, flexDirection: "row", alignItems: "center", gap: 13, padding: 14, borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, backgroundColor: COLORS.surface, shadowColor: "#0d0818", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.09, shadowRadius: 8, elevation: 2 },
  answerCardEarly: { minHeight: 105, minWidth: 0, padding: 16, borderWidth: 3, borderRadius: 24 },
  answerSelected: { borderColor: COLORS.teal, borderWidth: 2, backgroundColor: "#254237" },
  answerCorrect: { borderColor: COLORS.green, borderWidth: 2, backgroundColor: "#edf5ef" },
  answerWrong: { borderColor: COLORS.coral, borderWidth: 2, backgroundColor: "#faefeb" },
  answerLetter: { width: 35, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: COLORS.surface2 },
  answerLetterEarly: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.surface2 },
  answerLetterSelected: { backgroundColor: COLORS.teal },
  answerLetterText: { color: COLORS.navy, fontSize: 11, fontWeight: "900" },
  answerLetterTextEarly: { fontSize: 16 },
  answerLetterTextSelected: { color: "white" },
  answerText: { flex: 1, color: COLORS.navy, fontSize: 14, fontWeight: "800", lineHeight: 19 },
  answerTextEarly: { fontSize: 17, lineHeight: 23 },
  answerMark: { color: COLORS.green, fontSize: 22, fontWeight: "900" },
  feedback: { padding: 18, borderLeftWidth: 5, marginTop: 8, gap: 8, borderRadius: 20 },
  feedbackEarly: { padding: 14, borderLeftWidth: 0, borderWidth: 3, borderColor: COLORS.gold, borderRadius: 26 },
  feedbackCorrect: { borderLeftColor: COLORS.green, backgroundColor: "#eaf3ed" },
  feedbackWrong: { borderLeftColor: COLORS.coral, backgroundColor: "#f8ece8" },
  feedbackLabel: { color: COLORS.navy, fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },
  feedbackText: { color: COLORS.navy, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 15, lineHeight: 22, marginBottom: 3 },
  replayNotice: { color: COLORS.teal, fontSize: 10, fontWeight: "900", lineHeight: 15, marginTop: 2 },
  feedbackCoach: { flexDirection: "row", alignItems: "center", gap: 8, overflow: "hidden", padding: 9, marginBottom: 6, borderRadius: 18 },
  feedbackCoachCorrect: { backgroundColor: "rgba(76,129,100,.12)" },
  feedbackCoachTry: { backgroundColor: "rgba(230,173,73,.18)" },
  feedbackCoachCharacter: { width: 82, height: 82, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  feedbackCoachBubble: { flex: 1 },
  feedbackCoachTitle: { color: COLORS.navy, fontSize: 13, fontWeight: "900", letterSpacing: 0.5 },
  feedbackCoachText: { color: COLORS.navy, fontSize: 11, lineHeight: 16, marginTop: 3 },
  correctAnswer: { color: COLORS.coral, fontSize: 11, fontWeight: "800", marginBottom: 10 },
  resultContent: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  resultStage: { borderWidth:2,borderColor:COLORS.line, width: "100%", maxWidth: 560, alignItems: "center", padding: 26, borderRadius: 32, backgroundColor: COLORS.surface, shadowColor: "#09051f", shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 8 },
  resultBadge: { position: "absolute", top: 18, right: 18, width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 18, transform: [{ rotate: "7deg" }] },
  resultTitle: { color: COLORS.navy, fontSize: 28, fontWeight: "900", letterSpacing: -0.6, lineHeight: 35, textAlign: "center", marginBottom: 20 },
  xpAward: { width: 210, alignItems: "center", padding: 17, borderWidth: 1, borderColor: COLORS.line, borderRadius: 22, backgroundColor: COLORS.surface2, marginBottom: 18 },
  xpAwardLabel: { color: COLORS.teal, fontSize: 11, fontWeight: "900", letterSpacing: 1.1 },
  xpAwardValue: { color: COLORS.navy, fontSize: 44, fontWeight: "900" },
  resultStats: { width: 260, flexDirection: "row", justifyContent: "space-around", marginBottom: 25 },
  resultStatValue: { color: COLORS.navy, fontSize: 26, fontWeight: "900", textAlign: "center" },
  resultStatLabel: { color: COLORS.muted, fontSize: 11, fontWeight: "900", letterSpacing: 0.8, textAlign: "center" },
  secondaryLink: { color: COLORS.teal, fontSize: 11, fontWeight: "900", marginTop: 22, textDecorationLine: "underline" },
  profileLayout: { gap: 16, marginTop: 10 },
  profileLayoutTablet: { flexDirection: "row", alignItems: "flex-start" },
  playerCard: { flex: 0.75, alignItems: "center", padding: 25, overflow: "hidden", borderWidth: 0, borderRadius: 28, backgroundColor: COLORS.surface2, shadowColor: "#0d0818", shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 5 },
  profileCharacter: { width: 178, height: 178, alignItems: "center", justifyContent: "flex-end", overflow: "hidden", borderWidth: 2, borderColor: COLORS.teal, borderRadius: 89, backgroundColor: COLORS.surface },
  playerName: { color: COLORS.navy, fontSize: 29, fontWeight: "900", marginTop: 15 },
  playerStats: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, marginTop: 6, textAlign: "center" },
  playerStripe: { width: "100%", flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: COLORS.ink, marginTop: 25 },
  playerStripeText: { color: "white", fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  profileForm: { flex: 1.25, padding: 22, borderWidth: 0, borderRadius: 28, backgroundColor: COLORS.surface, shadowColor: "#0d0818", shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 4 },
  profileTitle: { color: COLORS.navy, fontSize: 27, fontWeight: "900", letterSpacing: -1.2, marginBottom: 8 },
  leagueButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.line, borderRadius: 19, backgroundColor: COLORS.surface },
  leagueButtonGame: { borderColor: "rgba(255,255,255,.22)", backgroundColor: "rgba(255,255,255,.12)" },
  privacySafe: { flex: 1, backgroundColor: "#100b3d" },
  privacyBackground: { flex: 1 },
  privacyPage: { flexGrow: 1, justifyContent: "center", padding: 18 },
  privacyCard: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 22, borderRadius: 30, backgroundColor: COLORS.surface, shadowColor: "#09051f", shadowOffset: { width: 0, height: 13 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 9 },
  privacyBack: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 0.8, marginBottom: 17 },
  privacyKicker: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 1.15, marginTop: 24 },
  privacyTitle: { color: COLORS.navy, fontSize: 43, fontWeight: "900", letterSpacing: -2.8, lineHeight: 40, marginTop: 9 },
  privacyTitleAccent: { color: COLORS.teal },
  privacyCopy: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 13, lineHeight: 19, marginTop: 11, marginBottom: 17 },
  privacyAgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  privacyAgeCard: { width: "48%", minHeight: 128, padding: 13, borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, backgroundColor: COLORS.surface },
  privacyAgeCardActive: { borderWidth: 2, borderColor: COLORS.teal, backgroundColor: COLORS.surface2 },
  privacyAgeValue: { color: COLORS.teal, fontSize: 7, fontWeight: "900", letterSpacing: 0.75 },
  privacyAgeTitle: { color: COLORS.navy, fontSize: 14, fontWeight: "900", marginTop: 10 },
  privacyAgeNote: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 9, lineHeight: 13, marginTop: 4 },
  privacyAgeArrow: { color: COLORS.teal, fontSize: 18, fontWeight: "900", marginTop: "auto" },
  privacyChoiceActive: { color: COLORS.navy },
  privacyFine: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 9, lineHeight: 14, marginTop: 13 },
  privacySetup: { flexDirection: "row", alignItems: "center", gap: 11, padding: 14, marginBottom: 17, borderLeftWidth: 4, borderLeftColor: "#6547c7", borderRadius: 14, backgroundColor: COLORS.surface2 },
  privacySetupCopy: { flex: 1 },
  privacySetupTitle: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 0.65 },
  privacySetupText: { color: COLORS.muted, fontSize: 10, lineHeight: 14, marginTop: 3 },
  privacyProviders: { gap: 8, marginBottom: 17 },
  privacyProvider: { flexDirection: "row", alignItems: "center", gap: 11, minHeight: 54, padding: 11, borderWidth: 1, borderColor: COLORS.line, borderRadius: 16, backgroundColor: COLORS.surface2, opacity: 0.58 },
  privacyProviderName: { color: COLORS.navy, fontSize: 8, fontWeight: "900" },
  privacyProviderStatus: { color: COLORS.muted, fontSize: 6, fontWeight: "800", marginTop: 3 },
  motionPreview: { padding: 15, marginTop: 14, borderWidth: 2, borderRadius: 25, backgroundColor: COLORS.surface, shadowColor: "#09051f", shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.22, shadowRadius: 14, elevation: 5 },
  motionCopy: { marginBottom: 10 },
  motionKicker: { fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  motionTitle: { color: COLORS.navy, fontSize: 17, fontWeight: "900", marginTop: 3 },
  motionText: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 11, lineHeight: 16, marginTop: 3 },
  motionVideoFrame: { position: "relative", width: "100%", aspectRatio: 16 / 9, overflow: "hidden", borderRadius: 18, backgroundColor: COLORS.navy },
  motionVideo: { width: "100%", height: "100%" },
  motionVideoControl: { position: "absolute", right: 10, bottom: 10, width: 38, height: 38, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,.45)", borderRadius: 19, backgroundColor: "rgba(9,5,31,.72)" },
  motionCredit: { marginTop: 7, color: COLORS.muted, fontSize: 7, fontWeight: "900", letterSpacing: 0.65, textAlign: "right" },
  motionVideoPlaceholder: { minHeight: 140, alignItems: "center", justifyContent: "center", padding: 22, borderWidth: 2, borderColor: "rgba(18,35,59,.12)", borderStyle: "dashed", borderRadius: 18, backgroundColor: "rgba(255,255,255,.68)" },
  motionVideoPlaceholderTitle: { marginTop: 8, color: COLORS.navy, fontSize: 14, fontWeight: "900" },
  motionVideoPlaceholderText: { maxWidth: 300, marginTop: 4, color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 10, lineHeight: 15, textAlign: "center" },
  primerHeaderDots: { flex: 1, maxWidth: 220, flexDirection: "row", gap: 6, marginHorizontal: 12 },
  primerHeaderDot: { flex: 1, height: 6, borderRadius: 99, backgroundColor: "rgba(255,255,255,.22)" },
  primerContent: { flexGrow: 1, alignItems: "center", paddingHorizontal: 14, paddingTop: 22, paddingBottom: 48 },
  primerStage: { width: "100%", maxWidth: 760, padding: 22, borderWidth: 2, borderColor: "rgba(255,255,255,.2)", borderRadius: 30, backgroundColor: COLORS.surface, shadowColor: "#09051f", shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.35, shadowRadius: 24, elevation: 8 },
  primerStageEarly: { padding: 17, borderWidth: 3, borderColor: "rgba(255,255,255,.42)" },
  primerMark: { width: 78, height: 78, alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: "white", borderRadius: 24, transform: [{ rotate: "-3deg" }], shadowColor: "#0d0818", shadowOffset: { width: 5, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  primerKicker: { marginTop: 24, fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  primerSport: { marginTop: 3, color: COLORS.muted, fontSize: 11, fontWeight: "800" },
  primerTitle: { marginTop: 15, color: COLORS.navy, fontSize: 34, fontWeight: "900", letterSpacing: -1.6, lineHeight: 37 },
  primerTitleEarly: { fontSize: 31, lineHeight: 33, letterSpacing: -1.3 },
  primerBody: { marginTop: 14, color: "#4e5964", fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 16, lineHeight: 25 },
  primerBodyEarly: { color: COLORS.navy, fontFamily: Platform.select({ ios: "System", default: "sans-serif" }), fontSize: 17, fontWeight: "700", lineHeight: 24 },
  primerTerms: { gap: 9, marginTop: 21 },
  primerTerm: { padding: 13, borderLeftWidth: 5, borderRadius: 13, backgroundColor: COLORS.surface, shadowColor: "#0d0818", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 7, elevation: 2 },
  primerTermEarly: { minHeight: 92, justifyContent: "center", padding: 15, borderLeftWidth: 8, borderWidth: 2 },
  primerTermName: { color: COLORS.navy, fontSize: 13, fontWeight: "900" },
  primerTermNameEarly: { fontSize: 18 },
  primerTermMeaning: { marginTop: 4, color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, lineHeight: 18 },
  primerTermMeaningEarly: { color: COLORS.navy, fontFamily: Platform.select({ ios: "System", default: "sans-serif" }), fontSize: 14, lineHeight: 20 },
  primerCoach: { flexDirection: "row", alignItems: "flex-end", marginTop: 22 },
  primerCoachBubble: { flex: 1, marginBottom: 7, marginLeft: -5, padding: 13, borderWidth: 2, borderColor: "rgba(18,35,59,.12)", borderRadius: 18, borderBottomLeftRadius: 5, backgroundColor: COLORS.surface },
  primerCoachTitle: { color: COLORS.teal, fontSize: 9, fontWeight: "900", letterSpacing: 0.8 },
  primerCoachText: { marginTop: 4, color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, lineHeight: 18 },
  primerActions: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 15, marginTop: 20 },
  primerPrevious: { color: COLORS.navy, fontSize: 10, fontWeight: "900", textDecorationLine: "underline" },
  primerPrimary: { flex: 1, maxWidth: 390 },
  leagueHero: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 22, borderRadius: 28, backgroundColor: "rgba(18,35,59,.9)" },
  leagueKicker: { color: COLORS.gold, fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  leagueTitle: { color: "white", fontSize: 38, fontWeight: "900", letterSpacing: -2.4, lineHeight: 36, marginTop: 6 },
  leagueCopy: { maxWidth: 260, color: "rgba(255,255,255,.72)", fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 11, lineHeight: 16, marginTop: 7 },
  leagueSafety: { flexDirection: "row", alignItems: "center", gap: 11, padding: 14, marginTop: 12, borderRadius: 18, backgroundColor: COLORS.surface },
  leagueSafetyCopy: { flex: 1 },
  leagueSafetyTitle: { color: COLORS.teal, fontSize: 11, fontWeight: "900", letterSpacing: 0.75 },
  leagueSafetyText: { color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 3 },
  leagueScore: { alignItems: "center", padding: 20, marginTop: 12, borderRadius: 28, backgroundColor: COLORS.surface },
  leagueScoreLabel: { color: COLORS.teal, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  leagueScoreValue: { color: COLORS.navy, fontSize: 36, fontWeight: "900", letterSpacing: -1.8, marginTop: 3 },
  leagueScoreNext: { color: COLORS.muted, fontSize: 14, marginTop: 4 },
  mobileLeagueBoard: { padding: 15, marginTop: 12, marginBottom: 40, borderRadius: 28, backgroundColor: COLORS.surface },
  mobileLeagueBoardTitle: { color: COLORS.teal, fontSize: 11, fontWeight: "900", letterSpacing: 1, marginBottom: 9 },
  milestoneRow: { borderRadius:14, minHeight: 64, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: COLORS.line, opacity: 1 },
  milestoneRowReached: { opacity: 1, backgroundColor: "#254237" },
  milestoneRank: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: COLORS.surface2 },
  milestoneRankReached: { backgroundColor: "#53308d" },
  milestoneRankText: { color: "white", fontSize: 10, fontWeight: "900" },
  milestoneCopy: { flex: 1 },
  milestoneName: { color: COLORS.navy, fontSize: 16, fontWeight: "900" },
  milestoneXp: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  milestoneStatus: { color: COLORS.muted, fontSize: 11, fontWeight: "900" },
  milestoneStatusReached: { color: COLORS.teal },
  leagueEmpty: { alignItems: "center", padding: 34, borderWidth: 1, borderStyle: "dashed", borderColor: COLORS.line, borderRadius: 20 },
  leagueEmptyTitle: { color: COLORS.navy, fontSize: 10, fontWeight: "900", letterSpacing: 0.7, marginTop: 12 },
  leagueEmptyText: { color: COLORS.muted, fontSize: 15, lineHeight: 23, textAlign: "center", marginTop: 6 },
  lockedAge: { flexDirection: "row", alignItems: "center", gap: 10, padding: 11, marginBottom: 12, borderRadius: 16, backgroundColor: COLORS.surface2 },
  lockedAgeValue: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.teal, color: COLORS.ink, fontSize: 10, fontWeight: "900" },
  lockedAgeText: { flex: 1, color: COLORS.muted, fontSize: 9, lineHeight: 13 },
  changeAgeButton: { paddingHorizontal: 10, paddingVertical: 9, borderWidth: 1, borderColor: COLORS.teal, borderRadius: 11, backgroundColor: COLORS.surface },
  changeAgeButtonText: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 0.5 },
  mobileLegalLinks: { flexDirection: "row", gap: 16, marginBottom: 12 },
  mobileLegalLink: { color: COLORS.teal, fontSize: 9, fontWeight: "900", textDecorationLine: "underline" },
  mobileLegalAcceptance: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: COLORS.line, borderRadius: 14, backgroundColor: COLORS.surface },
  mobileLegalCheck: { width: 22, height: 22, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.teal, borderRadius: 6, backgroundColor: COLORS.surface },
  mobileLegalCheckActive: { backgroundColor: "#6547c7" },
  mobileLegalCheckText: { color: "white", fontSize: 13, fontWeight: "900" },
  mobileLegalAcceptanceText: { flex: 1, color: COLORS.muted, fontSize: 10, lineHeight: 15 },
  mobileLegalPage: { flexGrow: 1, width: "100%", maxWidth: 760, alignSelf: "center", padding: 16 },
  mobileLegalCard: { padding: 21, borderRadius: 28, backgroundColor: COLORS.surface },
  mobileLegalTitle: { color: COLORS.navy, fontSize: 34, fontWeight: "900", letterSpacing: -1.8, lineHeight: 36, marginTop: 8 },
  mobileLegalUpdated: { color: COLORS.muted, fontSize: 8, fontWeight: "800", letterSpacing: 0.6, marginTop: 7, marginBottom: 4 },
  mobileLegalHeading: { color: COLORS.teal, fontSize: 9, fontWeight: "900", letterSpacing: 0.9, marginTop: 20 },
  mobileLegalBody: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, lineHeight: 19, marginTop: 5 },
  mobileLegalDisclaimer: { color: COLORS.muted, fontSize: 9, lineHeight: 14, marginTop: 26, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.line },
  practiceNote: { maxWidth: 250, marginTop: 6, color: COLORS.muted, fontSize: 10, lineHeight: 14, textAlign: "center" },
  mobilePrivacyCenter: { gap: 11, marginTop: 22, padding: 15, borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, backgroundColor: COLORS.surface2 },
  mobilePrivacyTitle: { color: COLORS.teal, fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  mobilePrivacyCopy: { color: COLORS.muted, fontSize: 11, lineHeight: 16 },
  mobileIntegrityNote: { gap: 4, padding: 12, borderLeftWidth: 5, borderLeftColor: COLORS.gold, borderRadius: 12, backgroundColor: COLORS.surface },
  mobileIntegrityTitle: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 0.8 },
  mobileIntegrityText: { color: COLORS.muted, fontSize: 10, lineHeight: 14 },
  mobileMeasurementChoice: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 12, borderWidth: 1, borderColor: COLORS.line, borderRadius: 14, backgroundColor: COLORS.surface },
  mobileMeasurementCopy: { flex: 1, gap: 3 },
  mobileMeasurementTitle: { color: COLORS.navy, fontSize: 9, fontWeight: "900" },
  mobileMeasurementText: { color: COLORS.muted, fontSize: 9, lineHeight: 13 },
  mobilePrivacyActions: { gap: 7 },
  mobilePrivacyButton: { minHeight: 43, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.teal, borderRadius: 12, backgroundColor: COLORS.surface },
  mobilePrivacyButtonText: { color: COLORS.teal, fontSize: 9, fontWeight: "900", letterSpacing: 0.5 },
  mobileLegalVersion: { color: COLORS.muted, fontSize: 8, lineHeight: 12 },
  mobileDangerButton: { minHeight: 43, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.coral, borderRadius: 12, backgroundColor: COLORS.surface },
  mobileDangerButtonStrong: { backgroundColor: COLORS.coral },
  mobileDangerButtonText: { color: COLORS.coral, fontSize: 9, fontWeight: "900" },
  mobileDangerButtonStrongText: { color: COLORS.ink },
});
