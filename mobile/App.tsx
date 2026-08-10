/* eslint-disable @typescript-eslint/no-require-imports */
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAudioPlayer } from "expo-audio";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { arrangeChallengeOptions, buildPositionModule, buildSportIntroModule, SPORTS, type Challenge, type LearningModule, type Position, type Sport } from "../app/learning-data";

const COLORS = {
  navy: "#12233b",
  navy2: "#1b3451",
  paper: "#f6f3eb",
  surface: "#fffdf7",
  surface2: "#ece9e1",
  teal: "#3b7f79",
  gold: "#e6ad49",
  coral: "#c96b51",
  green: "#4c8164",
  muted: "#68717a",
  line: "rgba(18,35,59,0.16)",
};

const AVATARS: Array<{ id: string; name: string; source: ImageSourcePropType }> = [
  { id: "avatar-16", name: "Courage", source: require("./assets/avatars-clean/avatar-16.png") },
  { id: "avatar-05", name: "Bravery", source: require("./assets/avatars-clean/avatar-05.png") },
  { id: "avatar-20", name: "Grace", source: require("./assets/avatars-clean/avatar-20.png") },
  { id: "avatar-01", name: "Confidence", source: require("./assets/avatars-clean/avatar-01.png") },
  { id: "avatar-18", name: "Joy", source: require("./assets/avatars-clean/avatar-18.png") },
  { id: "avatar-10", name: "Strength", source: require("./assets/avatars-clean/avatar-10.png") },
  { id: "avatar-03", name: "Hope", source: require("./assets/avatars-clean/avatar-03.png") },
  { id: "avatar-17", name: "Resilience", source: require("./assets/avatars-clean/avatar-17.png") },
  { id: "avatar-08", name: "Kindness", source: require("./assets/avatars-clean/avatar-08.png") },
  { id: "avatar-21", name: "Wisdom", source: require("./assets/avatars-clean/avatar-21.png") },
  { id: "avatar-06", name: "Belief", source: require("./assets/avatars-clean/avatar-06.png") },
  { id: "avatar-22", name: "Purpose", source: require("./assets/avatars-clean/avatar-22.png") },
  { id: "avatar-11", name: "Creativity", source: require("./assets/avatars-clean/avatar-11.png") },
  { id: "avatar-19", name: "Patience", source: require("./assets/avatars-clean/avatar-19.png") },
  { id: "avatar-02", name: "Peace", source: require("./assets/avatars-clean/avatar-02.png") },
  { id: "avatar-15", name: "Determination", source: require("./assets/avatars-clean/avatar-15.png") },
  { id: "avatar-04", name: "Growth", source: require("./assets/avatars-clean/avatar-04.png") },
  { id: "avatar-12", name: "Spirit", source: require("./assets/avatars-clean/avatar-12.png") },
  { id: "avatar-07", name: "Leadership", source: require("./assets/avatars-clean/avatar-07.png") },
  { id: "avatar-14", name: "Focus", source: require("./assets/avatars-clean/avatar-14.png") },
  { id: "avatar-09", name: "Grit", source: require("./assets/avatars-clean/avatar-09.png") },
  { id: "avatar-13", name: "Unity", source: require("./assets/avatars-clean/avatar-13.png") },
];

type AgeBand = "7-9" | "10-12" | "13-15" | "16-17" | "18+";
type AccountKind = "guest" | "self" | "child";
type ConsentState = "local-only" | "not-required" | "pending" | "verified";
type Screen = "home" | "sport" | "quiz" | "result" | "profile" | "league";
type Pathway = "general" | "position";
type Profile = {
  name: string;
  ageBand: AgeBand;
  avatarId: string;
  soundOn: boolean;
  xp: number;
  completedSports: string[];
  completedModules: string[];
  privacyGateComplete: boolean;
  accountKind: AccountKind;
  consentState: ConsentState;
};

const AGE_BANDS: Array<{ value: AgeBand; title: string; note: string; seconds: number | null }> = [
  { value: "7-9", title: "Play & Discover", note: "More visuals, 3 choices, no timer", seconds: null },
  { value: "10-12", title: "Build the Basics", note: "Clear explanations, 60 seconds", seconds: 60 },
  { value: "13-15", title: "Read the Game", note: "Game language, 45 seconds", seconds: 45 },
  { value: "16-17", title: "Compete & Lead", note: "Deeper tactics, 35 seconds", seconds: 35 },
  { value: "18+", title: "Full Sports IQ", note: "Complete detail, 30 seconds", seconds: 30 },
];

const DEFAULT_PROFILE: Profile = {
  name: "",
  ageBand: "10-12",
  avatarId: "avatar-01",
  soundOn: true,
  xp: 0,
  completedSports: [],
  completedModules: [],
  privacyGateComplete: false,
  accountKind: "guest",
  consentState: "not-required",
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

  useEffect(() => {
    if (!animated) return;
    const motion = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: -7, duration: 1050, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1050, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    motion.start();
    return () => motion.stop();
  }, [animated, bob]);

  return <Animated.Image source={avatarFor(id).source} resizeMode="contain" style={{ width: size, height: size, transform: [{ translateY: bob }] }} />;
}

function GameAvatar({ id, size, animated = false }: { id: string; size: number; animated?: boolean }) {
  return <MiniCharacter id={id} size={size} animated={animated} />;
}

function Logo() {
  return <View style={styles.logo}><Text style={styles.logoSports}>SPORTS</Text><Text style={styles.logoIq}>IQ</Text></View>;
}

function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && !disabled && styles.pressed, disabled && styles.disabled]}><Text style={styles.primaryButtonText}>{label}</Text><Text style={styles.primaryArrow}>→</Text></Pressable>;
}

function BackButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Back to ${label.toLowerCase()}`} onPress={onPress} style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}><View style={styles.backButtonIcon}><MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.navy} /></View><Text style={styles.backButtonText}>{label}</Text></Pressable>;
}

function QuestionVisual({ question, sport }: { question: Challenge; sport: Sport }) {
  const visualType = question.type === "ordering" ? "sequence"
    : question.conceptId.includes("team-size") || question.id.includes("players") ? "players"
      : question.conceptId.includes("playing-area") || question.conceptId.includes("field") || question.type === "hotspot" ? "arena"
        : question.conceptId.includes("scor") ? "score"
          : question.conceptId.includes("clock") || question.conceptId.includes("format") ? "clock"
            : "decision";
  return <View accessibilityLabel={`Visual clue for ${question.prompt}`} style={[styles.questionVisual, { backgroundColor: sport.softColor, borderColor: sport.color }]}>
    <View style={[styles.questionVisualSport, { backgroundColor: sport.color }]}><MaterialCommunityIcons name={sport.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={34} color="white" /></View>
    {visualType === "players" && <View style={styles.visualPlayerRow}>{[0, 1, 2].map((item) => <MaterialCommunityIcons key={item} name="account" size={35} color={sport.color} />)}<Text style={[styles.visualQuestionMark, { color: sport.color }]}>?</Text></View>}
    {visualType === "arena" && <View style={[styles.visualArena, { borderColor: sport.color }]}><View style={[styles.visualArenaLine, { backgroundColor: sport.color }]} /><View style={[styles.visualArenaDot, { backgroundColor: sport.color }]} /></View>}
    {visualType === "score" && <View style={[styles.visualScoreboard, { backgroundColor: COLORS.navy }]}><Text style={styles.visualScoreLabel}>POINTS</Text><Text style={[styles.visualScoreValue, { color: COLORS.gold }]}>?</Text></View>}
    {visualType === "clock" && <MaterialCommunityIcons name="timer-outline" size={68} color={sport.color} />}
    {visualType === "sequence" && <View style={styles.visualSequence}>{[1, 2, 3].map((step) => <View key={step} style={styles.visualSequenceStep}><View style={[styles.visualSequenceCircle, { backgroundColor: sport.color }]}><Text style={styles.visualSequenceNumber}>{step}</Text></View>{step < 3 && <MaterialCommunityIcons name="chevron-right" size={20} color={sport.color} />}</View>)}</View>}
    {visualType === "decision" && <MaterialCommunityIcons name="head-lightbulb-outline" size={64} color={sport.color} />}
  </View>;
}

function FeedbackCoach({ correct, timedOut = false }: { correct: boolean; timedOut?: boolean }) {
  return <View style={[styles.feedbackCoach, correct ? styles.feedbackCoachCorrect : styles.feedbackCoachTry]}>
    <View style={styles.feedbackCoachCharacter}><MiniCharacter id={correct ? "avatar-12" : "avatar-16"} size={92} animated /></View>
    <View style={styles.feedbackCoachBubble}><Text style={styles.feedbackCoachTitle}>{correct ? "GREAT READ!" : timedOut ? "TIME TO LEARN!" : "GOOD TRY!"}</Text><Text style={styles.feedbackCoachText}>{correct ? "You spotted the clue!" : "Getting it wrong is part of getting better. Let’s learn it together."}</Text></View>
  </View>;
}

function MobilePrivacyGate({ onContinue }: { onContinue: (result: { ageBand: AgeBand; accountKind: AccountKind; consentState: ConsentState }) => void }) {
  const [ageBand, setAgeBand] = useState<AgeBand | null>(null);
  const [step, setStep] = useState<"age" | "account">("age");
  const isChild = ageBand === "7-9" || ageBand === "10-12";

  return <SafeAreaView style={styles.privacySafe}><StatusBar style="light" /><ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.privacyBackground}><ScrollView contentContainerStyle={styles.privacyPage}>
    <View style={styles.privacyCard}>
      {step === "account" && <Pressable onPress={() => setStep("age")}><Text style={styles.privacyBack}>← CHANGE AGE</Text></Pressable>}
      <Logo />
      {step === "age" ? <>
        <Text style={styles.privacyKicker}>FIRST, SET THE RIGHT PLAYBOOK</Text>
        <Text style={styles.privacyTitle}>HOW OLD IS{`\n`}THE <Text style={styles.privacyTitleAccent}>PLAYER?</Text></Text>
        <Text style={styles.privacyCopy}>An adult or the player should choose the real age range. We save the range—not a birthday.</Text>
        <View style={styles.privacyAgeGrid}>{AGE_BANDS.map((band) => <Pressable key={band.value} onPress={() => setAgeBand(band.value)} style={[styles.privacyAgeCard, ageBand === band.value && styles.privacyAgeCardActive]}><Text style={[styles.privacyAgeValue, ageBand === band.value && styles.privacyChoiceActive]}>AGES {band.value}</Text><Text style={[styles.privacyAgeTitle, ageBand === band.value && styles.privacyChoiceActive]}>{band.title}</Text><Text style={[styles.privacyAgeNote, ageBand === band.value && styles.privacyChoiceActive]}>{band.note}</Text><Text style={[styles.privacyAgeArrow, ageBand === band.value && styles.privacyChoiceActive]}>{ageBand === band.value ? "✓" : "→"}</Text></Pressable>)}</View>
        <PrimaryButton label="CONTINUE" onPress={() => setStep("account")} disabled={!ageBand} />
        <Text style={styles.privacyFine}>Age controls reading, visuals, and timer. Sport experience controls difficulty.</Text>
      </> : isChild ? <>
        <Text style={styles.privacyKicker}>A GROWN-UP OWNS THIS ACCOUNT</Text>
        <Text style={styles.privacyTitle}>PARENT{`\n`}<Text style={styles.privacyTitleAccent}>HANDOFF.</Text></Text>
        <Text style={styles.privacyCopy}>Sports IQ will not ask for the child’s email or legal name. Parent accounts and consent stay off until secure sign-in, consent delivery, and bot protection are connected.</Text>
        <View style={styles.privacySetup}><MaterialCommunityIcons name="shield-check" size={24} color="#6547c7" /><View style={styles.privacySetupCopy}><Text style={styles.privacySetupTitle}>PARENT SETUP · SAFE MODE</Text><Text style={styles.privacySetupText}>No family information is collected in this preview.</Text></View></View>
        <PrimaryButton label="PLAY PRIVATELY ON THIS DEVICE" onPress={() => onContinue({ ageBand: ageBand as AgeBand, accountKind: "child", consentState: "local-only" })} />
        <Text style={styles.privacyFine}>Device play does not create an online child account.</Text>
      </> : <>
        <Text style={styles.privacyKicker}>SAVE YOUR PROGRESS ANYWHERE</Text>
        <Text style={styles.privacyTitle}>CHOOSE HOW{`\n`}<Text style={styles.privacyTitleAccent}>YOU’LL PLAY.</Text></Text>
        <Text style={styles.privacyCopy}>Secure account buttons are ready for provider keys. They stay disabled until Apple, Google, Facebook, email, and CAPTCHA are connected.</Text>
        <View style={styles.privacyProviders}>{[["apple", "Apple"], ["google", "Google"], ["facebook", "Facebook"], ["email-outline", "Email"]].map(([icon, label]) => <View key={label} style={styles.privacyProvider}><MaterialCommunityIcons name={icon as keyof typeof MaterialCommunityIcons.glyphMap} size={21} color={COLORS.muted} /><View><Text style={styles.privacyProviderName}>CONTINUE WITH {label.toUpperCase()}</Text><Text style={styles.privacyProviderStatus}>SECURE SETUP REQUIRED</Text></View></View>)}</View>
        <PrimaryButton label="CONTINUE WITHOUT AN ACCOUNT" onPress={() => onContinue({ ageBand: ageBand as AgeBand, accountKind: "guest", consentState: "not-required" })} />
        <Text style={styles.privacyFine}>Guest progress stays on this device. Connect an account later.</Text>
      </>}
    </View>
  </ScrollView></ImageBackground></SafeAreaView>;
}

function SportMotionPreviewMobile({ sport }: { sport: Sport }) {
  const [travel] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const motion = Animated.loop(Animated.sequence([
      Animated.timing(travel, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(travel, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    motion.start();
    return () => motion.stop();
  }, [travel]);
  const translateX = travel.interpolate({ inputRange: [0, 1], outputRange: [0, 125] });
  const translateY = travel.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  return <View style={[styles.motionPreview, { borderColor: sport.color, backgroundColor: sport.softColor }]}><View style={styles.motionCopy}><Text style={[styles.motionKicker, { color: sport.color }]}>6-SECOND SPORT SNAPSHOT</Text><Text style={styles.motionTitle}>See how {sport.name} moves</Text><Text style={styles.motionText}>Create space. Support the play. Move toward the target.</Text></View><View style={[styles.motionField, { borderColor: sport.color }]}><View style={[styles.motionCenterLine, { backgroundColor: sport.color }]} />{[[16, 18], [62, 66], [118, 24], [184, 62]].map(([left, top], index) => <View key={index} style={[styles.motionPlayer, { left, top, backgroundColor: index > 1 ? COLORS.gold : sport.color }]} />)}<Animated.View style={[styles.motionBall, { transform: [{ translateX }, { translateY }] }]}><Text style={[styles.motionBallText, { color: sport.color }]}>{sport.mark}</Text></Animated.View><Text style={styles.motionTarget}>★</Text></View></View>;
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

function SportsIQApp() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 720;
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [draftName, setDraftName] = useState("");
  const [draftAge, setDraftAge] = useState<AgeBand>("10-12");
  const [draftAvatar, setDraftAvatar] = useState("avatar-01");
  const [screen, setScreen] = useState<Screen>("home");
  const [sport, setSport] = useState<Sport>(SPORTS[0]);
  const [pathway, setPathway] = useState<Pathway>("general");
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [quiz, setQuiz] = useState<Challenge[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; timedOut?: boolean } | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizXp, setQuizXp] = useState(0);
  const correctSound = useAudioPlayer(require("./assets/sounds/correct.wav"));
  const incorrectSound = useAudioPlayer(require("./assets/sounds/incorrect.wav"));

  const contentWidth = Math.min(width, 1080);
  const cardWidth = isTablet ? (contentWidth - 72) / 3 : (contentWidth - 52) / 2;
  const agePath = AGE_BANDS.find((band) => band.value === profile.ageBand) ?? AGE_BANDS[1];
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
            soundOn: parsed.soundOn ?? DEFAULT_PROFILE.soundOn,
            xp: parsed.xp ?? DEFAULT_PROFILE.xp,
            completedSports: parsed.completedSports ?? DEFAULT_PROFILE.completedSports,
            completedModules: parsed.completedModules ?? DEFAULT_PROFILE.completedModules,
            privacyGateComplete: parsed.privacyGateComplete ?? DEFAULT_PROFILE.privacyGateComplete,
            accountKind: parsed.accountKind ?? DEFAULT_PROFILE.accountKind,
            consentState: parsed.consentState ?? DEFAULT_PROFILE.consentState,
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

  useEffect(() => {
    if (screen !== "quiz" || feedback || !question) return;
    if (AGE_BANDS.find((band) => band.value === profile.ageBand)?.seconds === null) return;
    const timer = setInterval(() => setSeconds((current) => {
      if (current === null) return null;
      if (current <= 1) {
        setFeedback({ correct: false, timedOut: true });
        if (profile.soundOn) incorrectSound.play();
        return 0;
      }
      return current - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [screen, questionIndex, feedback, profile.ageBand, profile.soundOn, question, incorrectSound]);

  const playAnswerSound = async (correct: boolean) => {
    if (!profile.soundOn) return;
    const player = correct ? correctSound : incorrectSound;
    try {
      await player.seekTo(0);
      player.play();
    } catch { /* sound is an enhancement */ }
  };

  const createProfile = () => {
    if (!draftName.trim()) return;
    setProfile((current) => ({ ...current, name: draftName.trim(), ageBand: draftAge, avatarId: draftAvatar }));
  };

  const openSport = (nextSport: Sport) => {
    setSport(nextSport);
    setPathway("general");
    setSelectedPosition(null);
    setScreen("sport");
  };

  const startModule = (learningModule: LearningModule) => {
    setActiveModule(learningModule);
    setQuiz(learningModule.challenges.map((challenge, index) => adaptChallenge(challenge, profile.ageBand, index, learningModule.id)));
    setQuestionIndex(0);
    setSelected([]);
    setFeedback(null);
    setSeconds(AGE_BANDS.find((band) => band.value === profile.ageBand)?.seconds ?? null);
    setCorrectCount(0);
    setQuizXp(0);
    setScreen("quiz");
  };

  const chooseOption = (option: string) => {
    if (!question || feedback) return;
    if (question.type === "multi") {
      setSelected((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
      return;
    }
    if (question.type === "ordering") {
      setSelected((current) => current.includes(option) ? current : [...current, option]);
      return;
    }
    setSelected([option]);
  };

  const checkAnswer = () => {
    if (!question || selected.length === 0 || feedback) return;
    const expected = Array.isArray(question.correct) ? question.correct : [question.correct];
    const correct = question.type === "ordering"
      ? expected.length === selected.length && expected.every((answer, index) => selected[index] === answer)
      : expected.length === selected.length && expected.every((answer) => selected.includes(answer));
    setFeedback({ correct });
    if (correct) {
      setCorrectCount((count) => count + 1);
      setQuizXp((xp) => xp + question.xp);
    }
    playAnswerSound(correct);
  };

  const advance = () => {
    if (questionIndex < quiz.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelected([]);
      setFeedback(null);
      setSeconds(AGE_BANDS.find((band) => band.value === profile.ageBand)?.seconds ?? null);
      return;
    }
    const earned = quizXp + 35;
    setProfile((current) => ({
      ...current,
      xp: current.xp + earned,
      completedSports: current.completedSports.includes(sport.id) ? current.completedSports : [...current.completedSports, sport.id],
      completedModules: activeModule && !current.completedModules.includes(activeModule.id) ? [...current.completedModules, activeModule.id] : current.completedModules,
    }));
    setQuizXp(earned);
    setScreen("result");
  };

  const saveProfile = () => {
    if (profile.accountKind !== "child" && !draftName.trim()) return;
    setProfile((current) => ({ ...current, name: current.accountKind === "child" ? "Player" : draftName.trim(), avatarId: draftAvatar }));
    setScreen("home");
  };

  if (!loaded) return <SafeAreaView style={styles.loading}><Logo /><Text style={styles.loadingText}>BUILDING YOUR PLAYBOOK…</Text></SafeAreaView>;

  if (!profile.privacyGateComplete) {
    return <MobilePrivacyGate onContinue={({ ageBand, accountKind, consentState }) => {
      setDraftAge(ageBand);
      setDraftName("Player");
      setProfile((current) => ({ ...current, name: "Player", ageBand, privacyGateComplete: true, accountKind, consentState }));
    }} />;
  }

  if (!profile.name) {
    return <SafeAreaView style={styles.safe}><StatusBar style="dark" /><ScrollView contentContainerStyle={[styles.onboarding, isTablet && styles.onboardingTablet]} keyboardShouldPersistTaps="handled"><View style={styles.onboardingCopy}><Logo /><Text style={styles.kicker}>{SPORTS.length} SPORTS · ONE PLAYBOOK · YOUR PACE</Text><Text style={[styles.displayTitle, isTablet && styles.displayTitleTablet]}>LEARN THE GAME.{"\n"}<Text style={styles.tealText}>SEE IT DIFFERENTLY.</Text></Text><Text style={styles.lede}>Pick a sport. Make the call. Learn why it works. Build real game knowledge in short, animated challenges.</Text><Text style={styles.fieldLabel}>CHOOSE YOUR AGE PATH</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ageList}>{AGE_BANDS.map((band) => <Pressable key={band.value} onPress={() => setDraftAge(band.value)} style={[styles.ageChoice, draftAge === band.value && styles.ageChoiceActive]}><Text style={[styles.ageValue, draftAge === band.value && styles.choiceTextActive]}>{band.value}</Text><Text style={[styles.ageTitle, draftAge === band.value && styles.choiceTextActive]}>{band.title}</Text><Text style={[styles.ageNote, draftAge === band.value && styles.choiceTextActive]}>{band.note}</Text></Pressable>)}</ScrollView><AvatarPicker value={draftAvatar} onChange={setDraftAvatar} /><Text style={styles.fieldLabel}>WHAT SHOULD WE CALL YOU?</Text><TextInput accessibilityLabel="Player name" value={draftName} onChangeText={setDraftName} placeholder="Your first name" placeholderTextColor="#89919a" style={styles.nameInput} returnKeyType="done" onSubmitEditing={createProfile} /><PrimaryButton label="BUILD MY PLAYBOOK" onPress={createProfile} disabled={!draftName.trim()} /><Text style={styles.privacyNote}>No account required. Progress saves on this device.</Text></View>{isTablet && <View style={styles.onboardingArena}><Text style={styles.arenaLabel}>YOUR FIRST MISSION</Text><View style={styles.squad}><MiniCharacter id="avatar-01" size={152} animated /><MiniCharacter id="avatar-10" size={162} animated /><MiniCharacter id="avatar-15" size={152} animated /></View>{["Choose a sport", "Make the read", "Master the concept"].map((step, index) => <View key={step} style={styles.missionStep}><View style={[styles.stepNumber, index === 0 && styles.stepNumberActive]}><Text style={styles.stepNumberText}>0{index + 1}</Text></View><Text style={styles.missionText}>{step}</Text></View>)}</View>}</ScrollView></SafeAreaView>;
  }

  const gameChrome = screen === "home" || screen === "sport" || screen === "league";
  const header = <View style={[styles.header, gameChrome && styles.headerGame]}><Pressable onPress={() => setScreen("home")}><Logo /></Pressable><View style={styles.headerActions}><Pressable accessibilityLabel="Open XP league" onPress={() => setScreen("league")} style={[styles.leagueButton, gameChrome && styles.leagueButtonGame]}><MaterialCommunityIcons name="trophy-variant" size={18} color={gameChrome ? COLORS.gold : COLORS.teal} /></Pressable><Pressable accessibilityLabel="Open XP league" onPress={() => setScreen("league")} style={[styles.xpPill, gameChrome && styles.xpPillGame]}><Text style={styles.xpLabel}>XP</Text><Text style={[styles.xpValue, gameChrome && styles.xpValueGame]}>{profile.xp}</Text></Pressable><Pressable accessibilityLabel={`${profile.soundOn ? "Turn off" : "Turn on"} answer feedback sounds`} onPress={() => setProfile((current) => ({ ...current, soundOn: !current.soundOn }))} style={[styles.sfxButton, profile.soundOn && styles.sfxButtonActive, gameChrome && styles.sfxButtonGame]}><MaterialCommunityIcons name={profile.soundOn ? "volume-high" : "volume-off"} size={18} color={gameChrome ? "white" : profile.soundOn ? COLORS.teal : COLORS.muted} /></Pressable><Pressable accessibilityLabel="Open profile" onPress={() => { setDraftName(profile.name); setDraftAge(profile.ageBand); setDraftAvatar(profile.avatarId); setScreen("profile"); }} style={[styles.headerAvatar, gameChrome && styles.headerAvatarGame]}><GameAvatar id={profile.avatarId} size={42} /></Pressable></View></View>;

  if (screen === "quiz" && question) {
    const expected = Array.isArray(question.correct) ? question.correct : [question.correct];
    const instruction = question.type === "multi"
      ? `Choose ${expected.length}`
      : question.type === "ordering"
        ? "Tap in order"
        : "Choose one";
    const showFeedbackCoach = profile.ageBand === "7-9" || profile.ageBand === "10-12";
    const selectionComplete = question.type === "multi" || question.type === "ordering" ? selected.length === expected.length : selected.length === 1;
    return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />
      <View style={[styles.quizHeader, styles.quizHeaderGame]}><BackButton label="PATH" onPress={() => setScreen("sport")} /><View style={[styles.progressTrack, styles.progressTrackGame]}><View style={[styles.progressFill, { width: `${((questionIndex + (feedback ? 1 : 0)) / quiz.length) * 100}%`, backgroundColor: sport.color }]} /></View><Text style={[styles.questionCount, styles.questionCountGame]}>{questionIndex + 1}/{quiz.length}</Text></View>
      <ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.gameFlowBackground}>
      <ScrollView contentContainerStyle={[styles.quizContent, isTablet && styles.quizContentTablet]}>
        <View style={styles.quizStage}>
        <View style={styles.quizMeta}><View><View style={[styles.interactionBadge, { backgroundColor: sport.color }]}><Text style={styles.interactionBadgeText}>{question.type === "multi" ? "PICK THE TEAM" : question.type === "ordering" ? "BUILD THE SEQUENCE" : "MAKE THE CALL"}</Text></View><Text style={styles.quizSport}>{sport.name}{activeModule?.position ? ` · ${activeModule.position}` : ""}</Text></View>{seconds !== null && <View style={[styles.timer, seconds <= 10 && styles.timerLow]}><Text style={[styles.timerValue, seconds <= 10 && styles.timerValueLow]}>{seconds}</Text><Text style={styles.timerLabel}>SEC</Text></View>}</View>
        <QuestionVisual question={question} sport={sport} />
        <Text style={[styles.questionTitle, isTablet && styles.questionTitleTablet]}>{question.prompt}</Text>
        <Text style={styles.answerInstruction}>{instruction}</Text>
        {question.type === "ordering" && selected.length > 0 && !feedback && <View style={styles.orderStrip}><Text style={styles.orderStripLabel}>YOUR ORDER</Text><Text style={styles.orderStripValue}>{selected.map((item, index) => `${index + 1}. ${item}`).join("  →  ")}</Text><Pressable onPress={() => setSelected([])}><Text style={styles.resetOrder}>RESET</Text></Pressable></View>}
        <View style={[styles.answerGrid, isTablet && styles.answerGridTablet]}>{question.options.map((option, index) => { const isSelected = selected.includes(option); const selectedOrder = selected.indexOf(option); const isCorrect = !!feedback && expected.includes(option); const isWrong = !!feedback && isSelected && !expected.includes(option); return <Pressable key={option} disabled={!!feedback} onPress={() => chooseOption(option)} style={({ pressed }) => [styles.answerCard, isSelected && styles.answerSelected, isCorrect && styles.answerCorrect, isWrong && styles.answerWrong, pressed && !feedback && styles.pressed]}><View style={[styles.answerLetter, isSelected && styles.answerLetterSelected]}><Text style={[styles.answerLetterText, isSelected && styles.answerLetterTextSelected]}>{question.type === "ordering" && isSelected ? selectedOrder + 1 : String.fromCharCode(65 + index)}</Text></View><Text style={styles.answerText}>{option}</Text>{isCorrect && <Text style={styles.answerMark}>✓</Text>}{isWrong && <Text style={styles.answerMark}>×</Text>}</Pressable>; })}</View>
        {!feedback ? <PrimaryButton label={question.type === "ordering" ? "LOCK IN MY ORDER" : question.type === "multi" ? "CHECK MY PICKS" : "CHECK MY ANSWER"} onPress={checkAnswer} disabled={!selectionComplete} /> : <View style={[styles.feedback, feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong]}>{showFeedbackCoach && <FeedbackCoach correct={feedback.correct} timedOut={feedback.timedOut} />}<Text style={styles.feedbackLabel}>{feedback.correct ? "THAT’S THE RIGHT CALL" : feedback.timedOut ? "TIME’S UP — LET’S LEARN IT" : "LET’S LEARN THIS ONE"}</Text><Text style={styles.feedbackText}>{question.explanation}</Text>{!feedback.correct && <Text style={styles.correctAnswer}>Correct answer: {expected.join(question.type === "ordering" ? " → " : " · ")}</Text>}<PrimaryButton label={questionIndex === quiz.length - 1 ? "FINISH MISSION" : "NEXT QUESTION"} onPress={advance} /></View>}
        </View>
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>;
  }

  if (screen === "result") {
    return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" /><ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.gameFlowBackground}><ScrollView contentContainerStyle={styles.resultContent}><View style={styles.resultStage}><View style={[styles.resultBadge, { backgroundColor: sport.color }]}><MaterialCommunityIcons name="trophy-award" size={27} color="white" /></View><GameAvatar id={profile.avatarId} size={190} animated /><Text style={styles.kicker}>{activeModule?.position ? `${activeModule.position.toUpperCase()} IQ` : sport.name.toUpperCase()} · MISSION COMPLETE</Text><Text style={styles.resultTitle}>YOU’RE SEEING THE{`\n`}GAME BETTER.</Text><View style={styles.xpAward}><Text style={styles.xpAwardLabel}>XP EARNED</Text><Text style={styles.xpAwardValue}>+{quizXp}</Text></View><View style={styles.resultStats}><View><Text style={styles.resultStatValue}>{correctCount}/{quiz.length}</Text><Text style={styles.resultStatLabel}>CORRECT</Text></View><View><Text style={styles.resultStatValue}>{Math.round((correctCount / Math.max(1, quiz.length)) * 100)}%</Text><Text style={styles.resultStatLabel}>ACCURACY</Text></View></View><PrimaryButton label={`CONTINUE ${activeModule?.position ? activeModule.position.toUpperCase() : sport.name.toUpperCase()} PATH`} onPress={() => setScreen("sport")} /><Pressable onPress={() => setScreen("home")}><Text style={styles.secondaryLink}>Choose another sport</Text></Pressable></View></ScrollView></ImageBackground></SafeAreaView>;
  }

  if (screen === "league") {
    const isChild = profile.accountKind === "child" || profile.ageBand === "7-9" || profile.ageBand === "10-12";
    const nextMilestone = XP_MILESTONES.find((milestone) => milestone.xp > profile.xp);
    return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />{header}<ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.gameFlowBackground}><ScrollView contentContainerStyle={[styles.page, styles.gameFlowPage, { width: contentWidth }]}>
      <BackButton label="HOME" onPress={() => setScreen("home")} />
      <View style={styles.leagueHero}><View><Text style={styles.leagueKicker}>XP LEAGUE</Text><Text style={styles.leagueTitle}>CLIMB BY{`\n`}LEARNING.</Text><Text style={styles.leagueCopy}>Finish missions. Build real Sports IQ. Earn your place.</Text></View><MaterialCommunityIcons name="trophy-variant" size={78} color={COLORS.gold} /></View>
      <View style={styles.leagueSafety}><MaterialCommunityIcons name="shield-check" size={26} color={COLORS.teal} /><View style={styles.leagueSafetyCopy}><Text style={styles.leagueSafetyTitle}>{isChild ? "PRIVATE YOUTH LEAGUE" : "ALIAS-ONLY PUBLIC LEAGUE"}</Text><Text style={styles.leagueSafetyText}>{isChild ? "Players under 13 stay off the public board. Beat your own XP milestones." : "Only opted-in players age 13+ appear. No legal names, ages, email, messages, or followers."}</Text></View></View>
      <View style={styles.leagueScore}><GameAvatar id={profile.avatarId} size={150} animated /><Text style={styles.leagueScoreLabel}>YOUR SCORE</Text><Text style={styles.leagueScoreValue}>{profile.xp.toLocaleString()} XP</Text><Text style={styles.leagueScoreNext}>{nextMilestone ? `${nextMilestone.xp - profile.xp} XP to ${nextMilestone.name}` : "Top milestone reached"}</Text></View>
      <View style={styles.mobileLeagueBoard}><Text style={styles.mobileLeagueBoardTitle}>{isChild ? "YOUR PRIVATE CLIMB" : "PUBLIC LEAGUE"}</Text>{isChild ? XP_MILESTONES.map((milestone, index) => { const reached = profile.xp >= milestone.xp; return <View key={milestone.name} style={[styles.milestoneRow, reached && styles.milestoneRowReached]}><View style={[styles.milestoneRank, reached && styles.milestoneRankReached]}><Text style={styles.milestoneRankText}>{reached ? "✓" : index + 1}</Text></View><View style={styles.milestoneCopy}><Text style={styles.milestoneName}>{milestone.name}</Text><Text style={styles.milestoneXp}>{milestone.xp.toLocaleString()} XP</Text></View><Text style={[styles.milestoneStatus, reached && styles.milestoneStatusReached]}>{reached ? "CLEARED" : `${Math.max(0, milestone.xp - profile.xp)} TO GO`}</Text></View>; }) : <View style={styles.leagueEmpty}><MaterialCommunityIcons name="account-group" size={42} color={COLORS.teal} /><Text style={styles.leagueEmptyTitle}>READY FOR THE FIRST PLAYERS</Text><Text style={styles.leagueEmptyText}>Connect a secure account to opt in when provider keys go live. Guest XP remains private.</Text></View>}</View>
    </ScrollView></ImageBackground></SafeAreaView>;
  }

  if (screen === "profile") {
    return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />{header}<ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.gameFlowBackground}><ScrollView contentContainerStyle={[styles.page, styles.gameFlowPage, { width: contentWidth }]}>
      <BackButton label="HOME" onPress={() => setScreen("home")} />
      <View style={[styles.profileLayout, isTablet && styles.profileLayoutTablet]}>
        <View style={styles.playerCard}><Text style={styles.kicker}>YOUR AVATAR</Text><View style={styles.profileCharacter}><GameAvatar id={draftAvatar} size={190} animated /></View><Text style={styles.playerName}>{profile.accountKind === "child" ? "Player" : draftName || profile.name}</Text><Text style={styles.playerStats}>{profile.xp} XP · {profile.completedModules.length} missions complete</Text><View style={styles.playerStripe}><Text style={styles.playerStripeText}>{profile.ageBand}</Text><Text style={styles.playerStripeText}>SPORTS IQ</Text></View></View>
        <View style={styles.profileForm}><Text style={styles.profileTitle}>MY PROFILE</Text>{profile.accountKind !== "child" && <><Text style={styles.fieldLabel}>DISPLAY NAME</Text><TextInput value={draftName} onChangeText={setDraftName} style={styles.nameInput} /></>}<Text style={styles.fieldLabel}>AGE PATH</Text><View style={styles.lockedAge}><Text style={styles.lockedAgeValue}>{profile.ageBand}</Text><Text style={styles.lockedAgeText}>Set during age check · locked for the learning path</Text></View><AvatarPicker value={draftAvatar} onChange={setDraftAvatar} /><PrimaryButton label="SAVE PROFILE" onPress={saveProfile} disabled={profile.accountKind !== "child" && !draftName.trim()} /></View>
      </View>
    </ScrollView></ImageBackground></SafeAreaView>;
  }

  if (screen === "sport") {
    const groupedPositions = sport.positions.reduce<Record<string, Position[]>>((groups, position) => {
      groups[position.group] = [...(groups[position.group] ?? []), position];
      return groups;
    }, {});
    const generalModule = buildSportIntroModule(sport);
    const positionModule = selectedPosition ? buildPositionModule(sport, selectedPosition) : null;
    const completedPositionCount = sport.positions.filter((position) => profile.completedModules.includes(buildPositionModule(sport, position).id)).length;
    const completedMissionCount = completedPositionCount + (profile.completedModules.includes(generalModule.id) ? 1 : 0);
    const pathPercent = Math.round((completedMissionCount / (sport.positions.length + 1)) * 100);
    const pathLabel = sport.pathLabel ?? "POSITION";
    return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />{header}<ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.gameFlowBackground}><ScrollView contentContainerStyle={[styles.page, styles.gameFlowPage, { width: contentWidth }]}>
      <BackButton label="SPORTS" onPress={() => setScreen("home")} />
      <View style={[styles.sportHero, styles.sportHeroGame, { backgroundColor: sport.color }]}><View style={[styles.heroOrb, styles.heroOrbOne]} /><View style={[styles.heroOrb, styles.heroOrbTwo]} /><View style={[styles.sportMarkLarge, styles.sportMarkHero]}><MaterialCommunityIcons name={sport.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={43} color={COLORS.navy} /></View><View style={styles.sportHeroCopy}><Text style={styles.sportHeroKicker}>YOUR SPORT ARENA</Text><Text style={[styles.sportTitle, styles.sportTitleLight]}>{sport.name}</Text><Text style={styles.sportNoteLight}>{sport.pathNote ?? "Learn the rules, positions, and game decisions that matter."}</Text><View style={styles.heroScoreRow}><View style={styles.heroScorePill}><Text style={styles.heroScoreValue}>{sport.positions.length}</Text><Text style={styles.heroScoreLabel}>{pathLabel} ROOMS</Text></View><View style={styles.heroScorePill}><Text style={styles.heroScoreValue}>{pathPercent}%</Text><Text style={styles.heroScoreLabel}>{pathLabel} IQ</Text></View><View style={styles.heroScorePill}><Text style={styles.heroScoreValue}>{agePath.seconds ?? "∞"}</Text><Text style={styles.heroScoreLabel}>{agePath.seconds === null ? "NO TIMER" : "SEC / READ"}</Text></View></View></View></View>
      <SportMotionPreviewMobile sport={sport} />

      <View style={styles.pathTabs}>
        <Pressable onPress={() => { setPathway("general"); setSelectedPosition(null); }} style={[styles.pathTab, pathway === "general" && styles.pathTabActive, pathway === "general" && { borderColor: sport.color }]}><View style={[styles.pathTabNumber, pathway === "general" && { backgroundColor: sport.color }]}><Text style={[styles.pathTabNumberText, pathway === "general" && styles.choiceTextActive]}>01</Text></View><View style={styles.pathTabCopy}><Text style={[styles.pathTabTitle, pathway === "general" && { color: sport.color }]}>GENERAL SPORT IQ</Text><Text style={styles.pathTabNote}>Rules, scoring & game shape</Text></View><Text style={styles.pathTabArrow}>→</Text></Pressable>
        <Pressable onPress={() => setPathway("position")} style={[styles.pathTab, pathway === "position" && styles.pathTabActive, pathway === "position" && { borderColor: sport.color }]}><View style={[styles.pathTabNumber, pathway === "position" && { backgroundColor: sport.color }]}><Text style={[styles.pathTabNumberText, pathway === "position" && styles.choiceTextActive]}>02</Text></View><View style={styles.pathTabCopy}><Text style={[styles.pathTabTitle, pathway === "position" && { color: sport.color }]}>{pathLabel} IQ</Text><Text style={styles.pathTabNote}>{completedPositionCount}/{sport.positions.length} rooms cleared</Text></View><Text style={styles.pathTabArrow}>→</Text></Pressable>
      </View>

      {pathway === "general" ? <View style={[styles.missionCard, { borderTopColor: sport.color }]}><View style={styles.missionCardTop}><View><Text style={[styles.kicker, { color: sport.color }]}>LEVEL 1 · FUNDAMENTALS</Text><Text style={styles.lessonTitle}>{generalModule.title}</Text></View><View style={[styles.xpBurst, { backgroundColor: sport.color }]}><Text style={styles.xpBurstValue}>+75</Text><Text style={styles.xpBurstLabel}>XP</Text></View></View><Text style={styles.lessonText}>Learn the shape of the game through {generalModule.challenges.length} quick calls. Your {profile.ageBand} path uses {agePath.seconds === null ? "no timer" : `${agePath.seconds} seconds per question`}.</Text><View style={styles.missionChips}><Text style={styles.missionChip}>RULES READ</Text><Text style={styles.missionChip}>ARENA IQ</Text><Text style={styles.missionChip}>{generalModule.estimatedMinutes} MIN</Text></View><PrimaryButton label={profile.completedModules.includes(generalModule.id) ? "PLAY FUNDAMENTALS AGAIN" : "START FUNDAMENTALS"} onPress={() => startModule(generalModule)} /></View>
      : selectedPosition && positionModule ? <View style={styles.positionDetail}>
        <BackButton label="ALL PATHS" onPress={() => setSelectedPosition(null)} />
        <View style={[styles.positionHero, { backgroundColor: sport.color }]}><View style={styles.positionHeroBadge}><Text style={[styles.positionHeroInitials, { color: sport.color }]}>{selectedPosition.name.split(" ").map((part) => part[0]).join("").slice(0, 3)}</Text></View><View style={styles.positionHeroCopy}><Text style={styles.positionHeroGroup}>{selectedPosition.group.toUpperCase()} · LEVEL 1</Text><Text style={styles.positionHeroTitle}>{selectedPosition.name} IQ</Text><Text style={styles.positionHeroText}>Learn to {selectedPosition.focus} through real reads, responsibilities, and decisions.</Text></View></View>
        <View style={styles.readBoard}><Text style={styles.readBoardKicker}>YOUR FIRST GAME READS</Text><View style={styles.readBoardGrid}>{positionModule.challenges.slice(0, 3).map((challenge, index) => <View key={challenge.id} style={styles.readBoardItem}><Text style={[styles.readBoardNumber, { color: sport.color }]}>0{index + 1}</Text><Text style={styles.readBoardLabel}>{challenge.label}</Text></View>)}</View></View>
        <View style={[styles.missionCard, styles.positionMissionCard, { borderTopColor: sport.color }]}><View style={styles.missionCardTop}><View style={styles.missionCardCopy}><Text style={[styles.kicker, { color: sport.color }]}>ROOKIE MISSION · {positionModule.challenges.length} INTERACTIONS</Text><Text style={styles.lessonTitle}>{positionModule.title}</Text></View><View style={[styles.xpBurst, { backgroundColor: sport.color }]}><Text style={styles.xpBurstValue}>+100</Text><Text style={styles.xpBurstLabel}>XP</Text></View></View><Text style={styles.lessonText}>{positionModule.description}</Text><View style={styles.missionChips}><Text style={styles.missionChip}>MAKE THE CALL</Text><Text style={styles.missionChip}>MULTI-PICK</Text><Text style={styles.missionChip}>TAP IN ORDER</Text></View><PrimaryButton label={profile.completedModules.includes(positionModule.id) ? "PRACTICE THIS POSITION" : "ENTER POSITION MISSION"} onPress={() => startModule(positionModule)} /></View>
        <View style={styles.roadmap}><Text style={styles.roadmapTitle}>YOUR POSITION ROADMAP</Text>{["Situational Responsibilities", "Reads & Adjustments", "Position Mastery"].map((title, index) => <View key={title} style={styles.roadmapStep}><View style={styles.roadmapLine} /><View style={styles.roadmapLock}><Text style={styles.roadmapLockText}>0{index + 2}</Text></View><View style={styles.roadmapCopy}><Text style={styles.roadmapStepTitle}>{title}</Text><Text style={styles.roadmapStepNote}>{index === 0 ? "STARTER" : index === 1 ? "PLAYMAKER" : "ALL-STAR"} · COMING NEXT</Text></View><Text style={styles.lockMark}>◆</Text></View>)}</View>
      </View>
      : <View style={styles.positionRoom}>
        <View style={styles.positionRoomHeading}><View><Text style={[styles.kicker, { color: sport.color }]}>CHOOSE YOUR {pathLabel} ROOM</Text><Text style={styles.sectionTitle}>{sport.pathQuestion ?? "Who are you on the field?"}</Text><Text style={styles.sectionCopy}>Each path has its own keys, reads, responsibilities, and game decisions.</Text></View><View style={[styles.roomProgress, { borderColor: sport.color }]}><Text style={[styles.roomProgressValue, { color: sport.color }]}>{completedPositionCount}/{sport.positions.length}</Text><Text style={styles.roomProgressLabel}>ROOMS CLEARED</Text></View></View>
        {Object.entries(groupedPositions).map(([group, positions], groupIndex) => <View key={group} style={styles.positionGroup}><View style={styles.positionGroupHeading}><View style={[styles.positionGroupDot, { backgroundColor: sport.color }]} /><Text style={styles.positionGroupTitle}>{group.toUpperCase()}</Text><Text style={styles.positionGroupCount}>{positions.length} ROLES</Text></View><View style={styles.positionGrid}>{positions.map((position, index) => { const positionLearningModule = buildPositionModule(sport, position); const done = profile.completedModules.includes(positionLearningModule.id); const initials = position.name.split(" ").map((part) => part[0]).join("").slice(0, 3); return <Pressable key={position.name} onPress={() => setSelectedPosition(position)} style={({ pressed }) => [styles.positionCard, { borderTopColor: groupIndex % 2 === 0 ? sport.color : COLORS.gold }, pressed && styles.pressed]}><View style={styles.positionCardTop}><View style={[styles.positionBadge, { backgroundColor: index % 2 === 0 ? sport.color : sport.softColor }]}><Text style={[styles.positionBadgeText, index % 2 !== 0 && { color: sport.color }]}>{done ? "✓" : initials}</Text></View><Text style={[styles.positionStatus, done && { color: COLORS.green }]}>{done ? "CLEARED" : "+100 XP"}</Text></View><Text style={styles.positionName}>{position.name}</Text><Text style={styles.positionFocus} numberOfLines={3}>Learn to {position.focus}.</Text><View style={styles.positionEnter}><Text style={[styles.positionEnterText, { color: sport.color }]}>{done ? "PRACTICE PATH" : "ENTER ROOM"}</Text><Text style={[styles.positionEnterArrow, { color: sport.color }]}>→</Text></View></Pressable>; })}</View></View>)}
      </View>}
    </ScrollView></ImageBackground></SafeAreaView>;
  }

  return <SafeAreaView style={[styles.safe, styles.homeSafe]}><StatusBar style="light" />{header}<ImageBackground source={require("./assets/backgrounds/home-arena-purple.png")} resizeMode="cover" style={styles.homeBackground}><ScrollView contentContainerStyle={[styles.page, styles.homePage, { width: contentWidth }]}>
    <View style={[styles.homeGuide, isTablet && styles.homeGuideTablet]}>
      <View style={styles.homeGuideCopy}>
        <Text style={styles.homeGuideKicker}>HI, {profile.name.toUpperCase()} · AGES {profile.ageBand}</Text>
        <Text style={[styles.homeGuideTitle, isTablet && styles.homeGuideTitleTablet]}>PICK A SPORT</Text>
        <View style={styles.homeStep}><View style={styles.homeStepNumber}><Text style={styles.homeStepNumberText}>1</Text></View><Text style={styles.homeStepText}>TAP TO START</Text></View>
      </View>
      <View style={styles.homeGuidePlayer}><GameAvatar id={profile.avatarId} size={isTablet ? 150 : 118} animated /></View>
    </View>
    <View style={styles.sportGrid}>{SPORTS.map((item) => {
      const missionIds = [buildSportIntroModule(item).id, ...item.positions.map((position) => buildPositionModule(item, position).id)];
      const completedMissions = missionIds.filter((id) => profile.completedModules.includes(id)).length;
      const percent = Math.round((completedMissions / missionIds.length) * 100);
      const progressLabel = completedMissions === 0 ? "Not started" : completedMissions === missionIds.length ? "Complete" : `${completedMissions}/${missionIds.length} missions`;
      return <Pressable key={item.id} accessibilityLabel={`Open ${item.name}, ${progressLabel}`} onPress={() => openSport(item)} style={({ pressed }) => [styles.sportCard, styles.sportCardSimple, { width: cardWidth, backgroundColor: item.softColor }, pressed && styles.gameCardPressed]}>
        <View style={styles.sportCardSimpleTop}><View style={[styles.sportMark, styles.sportMarkSimple, { borderColor: item.color }]}><MaterialCommunityIcons name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={39} color={item.color} /></View>{completedMissions === missionIds.length && <View style={[styles.sportCompleteBadge, { backgroundColor: item.color }]}><Text style={styles.sportCompleteBadgeText}>✓</Text></View>}</View>
        <Text style={styles.sportCardSimpleTitle}>{item.name}</Text>
        <View style={styles.sportCardSimpleBottom}><View style={styles.sportProgressCopy}><Text style={[styles.sportProgressLabel, { color: item.color }]}>{progressLabel}</Text><View style={styles.sportProgressTrack}><View style={[styles.sportProgressFill, { width: `${percent}%`, backgroundColor: item.color }]} /></View></View><View style={[styles.sportArrowButton, { backgroundColor: item.color }]}><Text style={styles.sportArrowButtonText}>→</Text></View></View>
      </Pressable>;
    })}</View>
  </ScrollView></ImageBackground></SafeAreaView>;
}

export default function App() {
  return <SafeAreaProvider><SportsIQApp /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  homeSafe: { backgroundColor: "#100b3d" },
  homeBackground: { flex: 1 },
  gameFlowBackground: { flex: 1 },
  gameFlowPage: { paddingTop: 10 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 22, backgroundColor: COLORS.paper },
  loadingText: { color: COLORS.muted, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  logo: { flexDirection: "row", alignItems: "stretch", transform: [{ skewX: "-7deg" }] },
  logoSports: { backgroundColor: COLORS.navy, color: COLORS.surface, fontSize: 14, fontWeight: "900", paddingHorizontal: 10, paddingVertical: 9, letterSpacing: -0.5 },
  logoIq: { backgroundColor: COLORS.gold, color: COLORS.navy, fontSize: 18, fontWeight: "900", paddingHorizontal: 9, paddingVertical: 7 },
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
  avatarChoice: { width: 126, height: 150, alignItems: "center", justifyContent: "flex-end", paddingBottom: 10, overflow: "hidden", borderWidth: 2, borderColor: COLORS.line, borderRadius: 22, backgroundColor: "white" },
  avatarChoiceActive: { borderColor: COLORS.teal, borderWidth: 3, backgroundColor: "white", transform: [{ translateY: -3 }, { scale: 1.02 }] },
  avatarName: { color: COLORS.muted, fontSize: 10, fontWeight: "900", letterSpacing: 0.7, textTransform: "uppercase" },
  avatarNameActive: { color: COLORS.teal },
  avatarCheck: { position: "absolute", top: 8, right: 8, width: 26, height: 26, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: COLORS.teal },
  avatarCheckText: { color: "white", fontSize: 15, fontWeight: "900" },
  nameInput: { minHeight: 54, paddingHorizontal: 15, borderWidth: 2, borderColor: COLORS.navy, borderRadius: 18, backgroundColor: COLORS.surface, color: COLORS.navy, fontSize: 16, fontWeight: "700", marginBottom: 10 },
  primaryButton: { minHeight: 54, maxWidth: 480, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, borderRadius: 18, backgroundColor: COLORS.gold, shadowColor: COLORS.navy, shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
  primaryButtonText: { color: COLORS.navy, fontSize: 10, fontWeight: "900", letterSpacing: 0.7 },
  primaryArrow: { color: COLORS.navy, fontSize: 21, fontWeight: "800" },
  pressed: { transform: [{ translateX: 2 }, { translateY: 2 }], opacity: 0.9 },
  disabled: { opacity: 0.42 },
  privacyNote: { color: COLORS.muted, fontSize: 10, marginTop: 13 },
  onboardingArena: { width: 370, padding: 28, borderWidth: 2, borderColor: COLORS.navy, backgroundColor: "#1f5452", shadowColor: COLORS.navy, shadowOffset: { width: 12, height: 12 }, shadowOpacity: 1, shadowRadius: 0 },
  arenaLabel: { alignSelf: "flex-start", padding: 7, backgroundColor: COLORS.gold, color: COLORS.navy, fontSize: 8, fontWeight: "900", letterSpacing: 1.1 },
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
  xpLabel: { padding: 4, backgroundColor: "#f4e4bf", color: COLORS.navy, fontSize: 7, fontWeight: "900" },
  xpValue: { color: COLORS.navy, fontSize: 11, fontWeight: "900" },
  xpValueGame: { color: "white" },
  sfxButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.line, borderRadius: 19, backgroundColor: COLORS.surface },
  sfxButtonActive: { borderColor: COLORS.teal },
  sfxButtonGame: { borderColor: "rgba(255,255,255,.2)", backgroundColor: "rgba(255,255,255,.1)" },
  sfxText: { color: COLORS.teal, fontSize: 7, fontWeight: "900", letterSpacing: 0.6 },
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
  homeHero: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 38 },
  homeHeroTablet: { gap: 65, paddingVertical: 70 },
  homeHeroCopy: { flex: 1 },
  homeTitle: { color: COLORS.navy, fontSize: 38, fontWeight: "900", letterSpacing: -2.5, lineHeight: 35 },
  homeTitleTablet: { fontSize: 68, lineHeight: 60, letterSpacing: -4.8 },
  homePlayer: { width: 155, alignItems: "center", justifyContent: "flex-end", overflow: "hidden", borderWidth: 1, borderColor: COLORS.teal, backgroundColor: "#e4eeea" },
  gameReady: { width: "100%", paddingVertical: 6, backgroundColor: COLORS.navy, color: "white", fontSize: 7, fontWeight: "900", letterSpacing: 1, textAlign: "center" },
  heroChips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 14 },
  heroChip: { padding: 7, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, color: COLORS.teal, fontSize: 7, fontWeight: "900" },
  sectionHeading: { marginTop: 12, marginBottom: 24 },
  sectionTitle: { color: COLORS.navy, fontSize: 31, fontWeight: "900", letterSpacing: -1.7, marginBottom: 7 },
  sectionCopy: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 13, lineHeight: 19 },
  sportGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, justifyContent: "center" },
  sportCard: { minHeight: 220, padding: 16, borderWidth: 1, borderTopWidth: 5, borderColor: COLORS.line, backgroundColor: COLORS.surface, shadowColor: COLORS.navy, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.1, shadowRadius: 0 },
  sportCardSimple: { minHeight: 178, padding: 14, overflow: "hidden", borderWidth: 0, borderTopWidth: 0, borderRadius: 24, shadowColor: "#08051f", shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.32, shadowRadius: 14, elevation: 7 },
  sportCardSimpleTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  sportMarkSimple: { width: 66, height: 66, borderWidth: 0, borderRadius: 33, backgroundColor: "rgba(255,255,255,.82)", shadowColor: COLORS.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 7, elevation: 3 },
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
  sportCardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  sportMark: { width: 62, height: 62, alignItems: "center", justifyContent: "center", borderWidth: 2, backgroundColor: COLORS.surface },
  sportIcon: { fontSize: 28, lineHeight: 32 },
  sportMarkText: { fontSize: 7, fontWeight: "900", letterSpacing: 0.8, marginTop: 1 },
  statusChip: { paddingHorizontal: 6, paddingVertical: 5, fontSize: 7, fontWeight: "900", letterSpacing: 0.6 },
  sportCardTitle: { color: COLORS.navy, fontSize: 19, fontWeight: "900", letterSpacing: -0.7, marginTop: 18 },
  sportCardFormats: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 11, lineHeight: 16, marginTop: 5 },
  sportCardFooter: { marginTop: "auto", paddingTop: 13, borderTopWidth: 1, borderTopColor: COLORS.line, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  enterText: { color: COLORS.navy, fontSize: 8, fontWeight: "900", letterSpacing: 0.6 },
  enterArrow: { color: COLORS.navy, fontSize: 18, fontWeight: "900" },
  backLink: { color: COLORS.muted, fontSize: 9, fontWeight: "900", letterSpacing: 0.6, paddingVertical: 12 },
  backButton: { alignSelf: "flex-start", minHeight: 48, flexDirection: "row", alignItems: "center", gap: 9, paddingRight: 14, marginVertical: 6, borderRadius: 24, backgroundColor: COLORS.surface, shadowColor: COLORS.navy, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.13, shadowRadius: 7, elevation: 3 },
  backButtonIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 24, backgroundColor: COLORS.gold },
  backButtonText: { color: COLORS.navy, fontSize: 9, fontWeight: "900", letterSpacing: 0.75 },
  backButtonPressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
  sportHero: { flexDirection: "row", alignItems: "center", gap: 20, paddingVertical: 24 },
  sportHeroGame: { position: "relative", overflow: "hidden", minHeight: 245, paddingHorizontal: 22, marginTop: 4, borderRadius: 30, shadowColor: "#09051f", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.34, shadowRadius: 18, elevation: 7 },
  heroOrb: { position: "absolute", width: 170, height: 170, borderWidth: 34, borderColor: "rgba(255,255,255,.11)", borderRadius: 85 },
  heroOrbOne: { top: -82, right: -38 },
  heroOrbTwo: { bottom: -110, left: 52 },
  sportMarkLarge: { width: 82, height: 82, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  sportMarkTextLarge: { fontSize: 22, fontWeight: "900" },
  sportMarkHero: { zIndex: 2, width: 92, height: 92, borderRadius: 28, transform: [{ rotate: "-5deg" }], backgroundColor: COLORS.gold, borderColor: "rgba(255,255,255,.75)", shadowColor: COLORS.navy, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.27, shadowRadius: 12 },
  sportHeroIcon: { fontSize: 39, lineHeight: 44 },
  sportMarkHeroText: { color: COLORS.navy, fontSize: 9, fontWeight: "900", letterSpacing: 1.1 },
  sportHeroCopy: { flex: 1 },
  sportHeroKicker: { color: "rgba(255,255,255,.8)", fontSize: 8, fontWeight: "900", letterSpacing: 1.4, marginBottom: 7 },
  sportTitle: { color: COLORS.navy, fontSize: 43, fontWeight: "900", letterSpacing: -2.7, lineHeight: 46 },
  sportTitleLight: { color: "white", textShadowColor: "rgba(18,35,59,.32)", textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 },
  sportNote: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 13, lineHeight: 19, marginTop: 6 },
  sportNoteLight: { maxWidth: 700, color: "rgba(255,255,255,.9)", fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, lineHeight: 18, marginTop: 6 },
  heroScoreRow: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 16 },
  heroScorePill: { minWidth: 78, paddingHorizontal: 10, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(255,255,255,.35)", borderRadius: 14, backgroundColor: "rgba(18,35,59,.22)" },
  heroScoreValue: { color: COLORS.gold, fontSize: 15, fontWeight: "900" },
  heroScoreLabel: { color: "white", fontSize: 6, fontWeight: "900", letterSpacing: 0.65, marginTop: 2 },
  variantList: { gap: 7, paddingVertical: 10 },
  variantChip: { minHeight: 38, justifyContent: "center", paddingHorizontal: 13, borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, backgroundColor: COLORS.surface },
  variantText: { color: COLORS.navy, fontSize: 9, fontWeight: "800" },
  lessonCard: { maxWidth: 650, padding: 22, marginTop: 24, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, shadowColor: COLORS.navy, shadowOffset: { width: 6, height: 6 }, shadowOpacity: 0.12, shadowRadius: 0 },
  lessonTitle: { color: COLORS.navy, fontSize: 27, fontWeight: "900", letterSpacing: -1.2, marginBottom: 7 },
  lessonText: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 14, lineHeight: 21, marginBottom: 22 },
  pathTabs: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 19, marginBottom: 20 },
  pathTab: { minWidth: 260, flex: 1, minHeight: 88, flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 2, borderColor: "rgba(255,255,255,.45)", borderRadius: 22, backgroundColor: "rgba(255,255,255,.94)", shadowColor: "#09051f", shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
  pathTabActive: { backgroundColor: "#fffaf0", transform: [{ scale: 1.015 }], shadowOpacity: 0.32 },
  pathTabNumber: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: COLORS.surface2 },
  pathTabNumberText: { color: COLORS.navy, fontSize: 10, fontWeight: "900" },
  pathTabCopy: { flex: 1 },
  pathTabTitle: { color: COLORS.navy, fontSize: 11, fontWeight: "900", letterSpacing: 0.5 },
  pathTabNote: { color: COLORS.muted, fontSize: 9, marginTop: 4 },
  pathTabArrow: { color: COLORS.navy, fontSize: 20, fontWeight: "900" },
  missionCard: { maxWidth: 760, padding: 22, borderRadius: 26, backgroundColor: "rgba(255,253,247,.97)", shadowColor: "#09051f", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.27, shadowRadius: 16, elevation: 6 },
  missionCardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  missionCardCopy: { flex: 1 },
  xpBurst: { width: 61, height: 61, alignItems: "center", justifyContent: "center", borderRadius: 31, transform: [{ rotate: "5deg" }], borderWidth: 2, borderColor: COLORS.navy },
  xpBurstValue: { color: "white", fontSize: 13, fontWeight: "900" },
  xpBurstLabel: { color: "rgba(255,255,255,.8)", fontSize: 6, fontWeight: "900" },
  missionChips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: -7, marginBottom: 20 },
  missionChip: { paddingHorizontal: 8, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface2, color: COLORS.navy, fontSize: 7, fontWeight: "900", letterSpacing: 0.5 },
  positionRoom: { padding: 16, paddingBottom: 30, borderRadius: 28, backgroundColor: "rgba(255,253,247,.95)", shadowColor: "#09051f", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.24, shadowRadius: 16, elevation: 5 },
  positionRoomHeading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 14, marginTop: 10, marginBottom: 26 },
  roomProgress: { minWidth: 94, alignItems: "center", padding: 11, borderWidth: 2, borderRadius: 18, backgroundColor: COLORS.surface },
  roomProgressValue: { fontSize: 20, fontWeight: "900" },
  roomProgressLabel: { color: COLORS.muted, fontSize: 6, fontWeight: "900", letterSpacing: 0.6 },
  positionGroup: { marginBottom: 27 },
  positionGroupHeading: { flexDirection: "row", alignItems: "center", gap: 8, paddingBottom: 9, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  positionGroupDot: { width: 10, height: 10, transform: [{ rotate: "45deg" }] },
  positionGroupTitle: { color: COLORS.navy, fontSize: 11, fontWeight: "900", letterSpacing: 0.85 },
  positionGroupCount: { color: COLORS.muted, fontSize: 7, fontWeight: "900", marginLeft: "auto" },
  positionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingTop: 10 },
  positionCard: { width: "48%", minHeight: 204, padding: 14, borderWidth: 2, borderColor: "rgba(18,35,59,.08)", borderRadius: 22, backgroundColor: COLORS.surface, shadowColor: COLORS.navy, shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.13, shadowRadius: 10, elevation: 3 },
  positionCardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  positionBadge: { minWidth: 45, height: 45, alignItems: "center", justifyContent: "center", paddingHorizontal: 7, borderRadius: 15, transform: [{ rotate: "-3deg" }] },
  positionBadgeText: { color: "white", fontSize: 11, fontWeight: "900" },
  positionStatus: { color: COLORS.coral, fontSize: 7, fontWeight: "900", letterSpacing: 0.5 },
  positionName: { color: COLORS.navy, fontSize: 17, fontWeight: "900", letterSpacing: -0.5, marginTop: 14 },
  positionFocus: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 10, lineHeight: 15, marginTop: 5 },
  positionEnter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.line },
  positionEnterText: { fontSize: 7, fontWeight: "900", letterSpacing: 0.55 },
  positionEnterArrow: { fontSize: 17, fontWeight: "900" },
  positionDetail: { maxWidth: 820, padding: 14, paddingBottom: 30, borderRadius: 28, backgroundColor: "rgba(255,253,247,.95)", shadowColor: "#09051f", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.24, shadowRadius: 16, elevation: 5 },
  positionHero: { position: "relative", overflow: "hidden", flexDirection: "row", alignItems: "center", gap: 16, padding: 20, borderRadius: 24 },
  positionHeroBadge: { width: 72, height: 72, alignItems: "center", justifyContent: "center", borderRadius: 36, borderWidth: 3, borderColor: COLORS.gold, backgroundColor: "white" },
  positionHeroInitials: { fontSize: 18, fontWeight: "900" },
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
  roadmap: { marginTop: 27 },
  roadmapTitle: { color: COLORS.navy, fontSize: 10, fontWeight: "900", letterSpacing: 0.9, marginBottom: 5 },
  roadmapStep: { position: "relative", minHeight: 77, flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 10 },
  roadmapLine: { position: "absolute", left: 21, top: -14, bottom: 44, width: 2, backgroundColor: COLORS.line },
  roadmapLock: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 22, borderWidth: 2, borderColor: COLORS.line, backgroundColor: COLORS.surface2 },
  roadmapLockText: { color: COLORS.muted, fontSize: 9, fontWeight: "900" },
  roadmapCopy: { flex: 1 },
  roadmapStepTitle: { color: COLORS.navy, fontSize: 14, fontWeight: "900" },
  roadmapStepNote: { color: COLORS.muted, fontSize: 7, fontWeight: "900", letterSpacing: 0.6, marginTop: 4 },
  lockMark: { color: COLORS.line, fontSize: 13 },
  quizHeader: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  quizHeaderGame: { borderBottomColor: "rgba(255,255,255,.14)", backgroundColor: "#100b3d" },
  exitText: { color: COLORS.muted, fontSize: 8, fontWeight: "900", letterSpacing: 0.5 },
  progressTrack: { flex: 1, height: 7, overflow: "hidden", backgroundColor: COLORS.surface2 },
  progressTrackGame: { height: 9, borderRadius: 5, backgroundColor: "rgba(255,255,255,.18)" },
  progressFill: { height: "100%", backgroundColor: COLORS.teal },
  questionCount: { color: COLORS.muted, fontSize: 9, fontWeight: "900" },
  questionCountGame: { color: "white" },
  quizContent: { width: "100%", maxWidth: 780, alignSelf: "center", padding: 20, paddingBottom: 70 },
  quizContentTablet: { paddingTop: 45 },
  quizStage: { padding: 20, borderRadius: 28, backgroundColor: "rgba(255,253,247,.97)", shadowColor: "#09051f", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 18, elevation: 7 },
  quizMeta: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  questionVisual: { minHeight: 126, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 18, overflow: "hidden", padding: 16, marginTop: 18, borderWidth: 2, borderRadius: 24 },
  questionVisualSport: { position: "absolute", left: 12, top: 12, width: 50, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 17, transform: [{ rotate: "-5deg" }] },
  visualPlayerRow: { flexDirection: "row", alignItems: "center", marginLeft: 42 },
  visualQuestionMark: { fontSize: 39, fontWeight: "900", marginLeft: 8 },
  visualArena: { width: 154, height: 82, alignItems: "center", justifyContent: "center", borderWidth: 3, borderRadius: 12 },
  visualArenaLine: { width: 3, height: "100%" },
  visualArenaDot: { position: "absolute", width: 18, height: 18, borderRadius: 9 },
  visualScoreboard: { width: 122, height: 78, alignItems: "center", justifyContent: "center", borderRadius: 15 },
  visualScoreLabel: { color: "white", fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  visualScoreValue: { fontSize: 36, fontWeight: "900", lineHeight: 40 },
  visualSequence: { flexDirection: "row", alignItems: "center", marginLeft: 40 },
  visualSequenceStep: { flexDirection: "row", alignItems: "center" },
  visualSequenceCircle: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21 },
  visualSequenceNumber: { color: "white", fontSize: 15, fontWeight: "900" },
  interactionBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, marginBottom: 9, borderRadius: 12, transform: [{ rotate: "-1deg" }] },
  interactionBadgeText: { color: "white", fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  quizSport: { color: COLORS.muted, fontSize: 10 },
  timer: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.gold, borderRadius: 26, backgroundColor: COLORS.surface },
  timerLow: { borderColor: COLORS.coral },
  timerValue: { color: COLORS.navy, fontSize: 16, fontWeight: "900" },
  timerValueLow: { color: COLORS.coral },
  timerLabel: { color: COLORS.muted, fontSize: 6, fontWeight: "900" },
  questionTitle: { color: COLORS.navy, fontSize: 34, fontWeight: "900", letterSpacing: -1.8, lineHeight: 38, marginTop: 27, marginBottom: 9 },
  questionTitleTablet: { fontSize: 47, lineHeight: 51, letterSpacing: -2.7 },
  answerInstruction: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, marginBottom: 18 },
  orderStrip: { padding: 13, marginTop: -6, marginBottom: 15, borderWidth: 1, borderColor: COLORS.gold, borderRadius: 16, backgroundColor: "#fff6df" },
  orderStripLabel: { color: COLORS.coral, fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  orderStripValue: { color: COLORS.navy, fontSize: 10, fontWeight: "800", lineHeight: 16, marginTop: 6, paddingRight: 45 },
  resetOrder: { position: "absolute", right: 0, bottom: 0, color: COLORS.teal, fontSize: 8, fontWeight: "900", textDecorationLine: "underline" },
  answerGrid: { gap: 9, marginBottom: 20 },
  answerGridTablet: { flexDirection: "row", flexWrap: "wrap" },
  answerCard: { minHeight: 78, flex: 1, minWidth: 280, flexDirection: "row", alignItems: "center", gap: 13, padding: 14, borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, backgroundColor: COLORS.surface, shadowColor: COLORS.navy, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.09, shadowRadius: 8, elevation: 2 },
  answerSelected: { borderColor: COLORS.teal, borderWidth: 2, backgroundColor: "#edf4f1" },
  answerCorrect: { borderColor: COLORS.green, borderWidth: 2, backgroundColor: "#edf5ef" },
  answerWrong: { borderColor: COLORS.coral, borderWidth: 2, backgroundColor: "#faefeb" },
  answerLetter: { width: 35, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: COLORS.surface2 },
  answerLetterSelected: { backgroundColor: COLORS.teal },
  answerLetterText: { color: COLORS.navy, fontSize: 11, fontWeight: "900" },
  answerLetterTextSelected: { color: "white" },
  answerText: { flex: 1, color: COLORS.navy, fontSize: 14, fontWeight: "800", lineHeight: 19 },
  answerMark: { color: COLORS.green, fontSize: 22, fontWeight: "900" },
  feedback: { padding: 18, borderLeftWidth: 5, marginTop: 8, gap: 8, borderRadius: 20 },
  feedbackCorrect: { borderLeftColor: COLORS.green, backgroundColor: "#eaf3ed" },
  feedbackWrong: { borderLeftColor: COLORS.coral, backgroundColor: "#f8ece8" },
  feedbackLabel: { color: COLORS.navy, fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },
  feedbackText: { color: COLORS.navy, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 15, lineHeight: 22, marginBottom: 3 },
  feedbackCoach: { flexDirection: "row", alignItems: "center", gap: 8, overflow: "hidden", padding: 9, marginBottom: 6, borderRadius: 18 },
  feedbackCoachCorrect: { backgroundColor: "rgba(76,129,100,.12)" },
  feedbackCoachTry: { backgroundColor: "rgba(230,173,73,.18)" },
  feedbackCoachCharacter: { width: 82, height: 82, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  feedbackCoachBubble: { flex: 1 },
  feedbackCoachTitle: { color: COLORS.navy, fontSize: 13, fontWeight: "900", letterSpacing: 0.5 },
  feedbackCoachText: { color: COLORS.navy, fontSize: 11, lineHeight: 16, marginTop: 3 },
  correctAnswer: { color: COLORS.coral, fontSize: 11, fontWeight: "800", marginBottom: 10 },
  resultContent: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  resultStage: { width: "100%", maxWidth: 560, alignItems: "center", padding: 26, borderRadius: 32, backgroundColor: "rgba(255,253,247,.97)", shadowColor: "#09051f", shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.34, shadowRadius: 20, elevation: 8 },
  resultBadge: { position: "absolute", top: 18, right: 18, width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 18, transform: [{ rotate: "7deg" }] },
  resultTitle: { color: COLORS.navy, fontSize: 38, fontWeight: "900", letterSpacing: -2.5, lineHeight: 37, textAlign: "center", marginBottom: 20 },
  xpAward: { width: 210, alignItems: "center", padding: 17, borderWidth: 1, borderColor: COLORS.line, borderRadius: 22, backgroundColor: "#f4edff", marginBottom: 18 },
  xpAwardLabel: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 1.1 },
  xpAwardValue: { color: COLORS.navy, fontSize: 44, fontWeight: "900" },
  resultStats: { width: 260, flexDirection: "row", justifyContent: "space-around", marginBottom: 25 },
  resultStatValue: { color: COLORS.navy, fontSize: 26, fontWeight: "900", textAlign: "center" },
  resultStatLabel: { color: COLORS.muted, fontSize: 7, fontWeight: "900", letterSpacing: 0.8, textAlign: "center" },
  secondaryLink: { color: COLORS.teal, fontSize: 10, fontWeight: "900", marginTop: 22, textDecorationLine: "underline" },
  profileLayout: { gap: 16, marginTop: 10 },
  profileLayoutTablet: { flexDirection: "row", alignItems: "flex-start" },
  playerCard: { flex: 0.75, alignItems: "center", padding: 25, overflow: "hidden", borderWidth: 0, borderRadius: 28, backgroundColor: "#eee7ff", shadowColor: COLORS.navy, shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.16, shadowRadius: 16, elevation: 5 },
  profileCharacter: { width: 178, height: 178, alignItems: "center", justifyContent: "flex-end", overflow: "hidden", borderWidth: 2, borderColor: COLORS.teal, borderRadius: 89, backgroundColor: "white" },
  playerName: { color: COLORS.navy, fontSize: 29, fontWeight: "900", marginTop: 15 },
  playerStats: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, marginTop: 6, textAlign: "center" },
  playerStripe: { width: "100%", flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: COLORS.navy, marginTop: 25 },
  playerStripeText: { color: "white", fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  profileForm: { flex: 1.25, padding: 22, borderWidth: 0, borderRadius: 28, backgroundColor: COLORS.surface, shadowColor: COLORS.navy, shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4 },
  profileTitle: { color: COLORS.navy, fontSize: 27, fontWeight: "900", letterSpacing: -1.2, marginBottom: 8 },
  compactAgeList: { gap: 7, paddingBottom: 14 },
  compactAge: { minWidth: 57, minHeight: 42, alignItems: "center", justifyContent: "center", paddingHorizontal: 9, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface2 },
  compactAgeActive: { borderColor: COLORS.teal, backgroundColor: COLORS.teal },
  compactAgeText: { color: COLORS.navy, fontSize: 9, fontWeight: "900" },
  leagueButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.line, borderRadius: 19, backgroundColor: COLORS.surface },
  leagueButtonGame: { borderColor: "rgba(255,255,255,.22)", backgroundColor: "rgba(255,255,255,.12)" },
  privacySafe: { flex: 1, backgroundColor: "#100b3d" },
  privacyBackground: { flex: 1 },
  privacyPage: { flexGrow: 1, justifyContent: "center", padding: 18 },
  privacyCard: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 22, borderRadius: 30, backgroundColor: "rgba(255,253,247,.98)", shadowColor: "#09051f", shadowOffset: { width: 0, height: 13 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 9 },
  privacyBack: { color: "#6547c7", fontSize: 8, fontWeight: "900", letterSpacing: 0.8, marginBottom: 17 },
  privacyKicker: { color: "#6547c7", fontSize: 8, fontWeight: "900", letterSpacing: 1.15, marginTop: 24 },
  privacyTitle: { color: COLORS.navy, fontSize: 43, fontWeight: "900", letterSpacing: -2.8, lineHeight: 40, marginTop: 9 },
  privacyTitleAccent: { color: "#6547c7" },
  privacyCopy: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 13, lineHeight: 19, marginTop: 11, marginBottom: 17 },
  privacyAgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  privacyAgeCard: { width: "48%", minHeight: 128, padding: 13, borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, backgroundColor: COLORS.surface },
  privacyAgeCardActive: { borderWidth: 2, borderColor: "#6547c7", backgroundColor: "#eee9fa" },
  privacyAgeValue: { color: "#6547c7", fontSize: 7, fontWeight: "900", letterSpacing: 0.75 },
  privacyAgeTitle: { color: COLORS.navy, fontSize: 14, fontWeight: "900", marginTop: 10 },
  privacyAgeNote: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 9, lineHeight: 13, marginTop: 4 },
  privacyAgeArrow: { color: "#6547c7", fontSize: 18, fontWeight: "900", marginTop: "auto" },
  privacyChoiceActive: { color: "#3f288e" },
  privacyFine: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 9, lineHeight: 14, marginTop: 13 },
  privacySetup: { flexDirection: "row", alignItems: "center", gap: 11, padding: 14, marginBottom: 17, borderLeftWidth: 4, borderLeftColor: "#6547c7", borderRadius: 14, backgroundColor: "#eee9fa" },
  privacySetupCopy: { flex: 1 },
  privacySetupTitle: { color: "#6547c7", fontSize: 8, fontWeight: "900", letterSpacing: 0.65 },
  privacySetupText: { color: COLORS.muted, fontSize: 10, lineHeight: 14, marginTop: 3 },
  privacyProviders: { gap: 8, marginBottom: 17 },
  privacyProvider: { flexDirection: "row", alignItems: "center", gap: 11, minHeight: 54, padding: 11, borderWidth: 1, borderColor: COLORS.line, borderRadius: 16, backgroundColor: COLORS.surface2, opacity: 0.58 },
  privacyProviderName: { color: COLORS.navy, fontSize: 8, fontWeight: "900" },
  privacyProviderStatus: { color: COLORS.muted, fontSize: 6, fontWeight: "800", marginTop: 3 },
  motionPreview: { padding: 15, marginTop: 14, borderWidth: 2, borderRadius: 25, backgroundColor: COLORS.surface, shadowColor: "#09051f", shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.22, shadowRadius: 14, elevation: 5 },
  motionCopy: { marginBottom: 10 },
  motionKicker: { fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  motionTitle: { color: COLORS.navy, fontSize: 17, fontWeight: "900", marginTop: 3 },
  motionText: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 10, marginTop: 3 },
  motionField: { position: "relative", height: 98, overflow: "hidden", borderWidth: 2, borderRadius: 18, backgroundColor: "rgba(255,255,255,.65)" },
  motionCenterLine: { position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, opacity: 0.25 },
  motionPlayer: { position: "absolute", width: 18, height: 18, borderWidth: 3, borderColor: "white", borderRadius: 9 },
  motionBall: { position: "absolute", left: 76, top: 48, width: 29, height: 29, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: "white", shadowColor: COLORS.navy, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 },
  motionBallText: { fontSize: 7, fontWeight: "900" },
  motionTarget: { position: "absolute", right: 10, top: 30, color: COLORS.gold, fontSize: 26 },
  leagueHero: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 22, borderRadius: 28, backgroundColor: "rgba(18,35,59,.9)" },
  leagueKicker: { color: COLORS.gold, fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  leagueTitle: { color: "white", fontSize: 38, fontWeight: "900", letterSpacing: -2.4, lineHeight: 36, marginTop: 6 },
  leagueCopy: { maxWidth: 260, color: "rgba(255,255,255,.72)", fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 11, lineHeight: 16, marginTop: 7 },
  leagueSafety: { flexDirection: "row", alignItems: "center", gap: 11, padding: 14, marginTop: 12, borderRadius: 18, backgroundColor: "rgba(255,253,247,.96)" },
  leagueSafetyCopy: { flex: 1 },
  leagueSafetyTitle: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 0.75 },
  leagueSafetyText: { color: COLORS.muted, fontSize: 10, lineHeight: 14, marginTop: 3 },
  leagueScore: { alignItems: "center", padding: 20, marginTop: 12, borderRadius: 28, backgroundColor: "rgba(255,253,247,.97)" },
  leagueScoreLabel: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  leagueScoreValue: { color: COLORS.navy, fontSize: 36, fontWeight: "900", letterSpacing: -1.8, marginTop: 3 },
  leagueScoreNext: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 10, marginTop: 4 },
  mobileLeagueBoard: { padding: 15, marginTop: 12, marginBottom: 40, borderRadius: 28, backgroundColor: "rgba(255,253,247,.97)" },
  mobileLeagueBoardTitle: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 1, marginBottom: 9 },
  milestoneRow: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: COLORS.line, opacity: 0.55 },
  milestoneRowReached: { opacity: 1, backgroundColor: "#edf4f1" },
  milestoneRank: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: COLORS.surface2 },
  milestoneRankReached: { backgroundColor: COLORS.teal },
  milestoneRankText: { color: "white", fontSize: 10, fontWeight: "900" },
  milestoneCopy: { flex: 1 },
  milestoneName: { color: COLORS.navy, fontSize: 12, fontWeight: "900" },
  milestoneXp: { color: COLORS.muted, fontSize: 8, marginTop: 2 },
  milestoneStatus: { color: COLORS.muted, fontSize: 7, fontWeight: "900" },
  milestoneStatusReached: { color: COLORS.teal },
  leagueEmpty: { alignItems: "center", padding: 34, borderWidth: 1, borderStyle: "dashed", borderColor: COLORS.line, borderRadius: 20 },
  leagueEmptyTitle: { color: COLORS.navy, fontSize: 10, fontWeight: "900", letterSpacing: 0.7, marginTop: 12 },
  leagueEmptyText: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 6 },
  lockedAge: { flexDirection: "row", alignItems: "center", gap: 10, padding: 11, marginBottom: 12, borderRadius: 16, backgroundColor: COLORS.surface2 },
  lockedAgeValue: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.teal, color: "white", fontSize: 10, fontWeight: "900" },
  lockedAgeText: { flex: 1, color: COLORS.muted, fontSize: 9, lineHeight: 13 },
});
