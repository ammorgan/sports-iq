/* eslint-disable @typescript-eslint/no-require-imports */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudioPlayer } from "expo-audio";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
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
import { buildSportIntroModule, SPORTS, type Challenge, type Sport } from "../app/learning-data";

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
  { id: "avatar-01", name: "Ace", source: require("./assets/avatars/avatar-01.png") },
  { id: "avatar-02", name: "Sky", source: require("./assets/avatars/avatar-02.png") },
  { id: "avatar-03", name: "Blaze", source: require("./assets/avatars/avatar-03.png") },
  { id: "avatar-04", name: "Nova", source: require("./assets/avatars/avatar-04.png") },
  { id: "avatar-05", name: "Dash", source: require("./assets/avatars/avatar-05.png") },
  { id: "avatar-06", name: "Rally", source: require("./assets/avatars/avatar-06.png") },
  { id: "avatar-07", name: "Power", source: require("./assets/avatars/avatar-07.png") },
  { id: "avatar-08", name: "Scout", source: require("./assets/avatars/avatar-08.png") },
  { id: "avatar-09", name: "Jet", source: require("./assets/avatars/avatar-09.png") },
  { id: "avatar-10", name: "Wheels", source: require("./assets/avatars/avatar-10.png") },
  { id: "avatar-11", name: "Remix", source: require("./assets/avatars/avatar-11.png") },
  { id: "avatar-12", name: "Spark", source: require("./assets/avatars/avatar-12.png") },
  { id: "avatar-13", name: "Clutch", source: require("./assets/avatars/avatar-13.png") },
  { id: "avatar-14", name: "Flash", source: require("./assets/avatars/avatar-14.png") },
  { id: "avatar-15", name: "Stride", source: require("./assets/avatars/avatar-15.png") },
  { id: "avatar-16", name: "Courage", source: require("./assets/avatars/avatar-16.png") },
  { id: "avatar-17", name: "Titan", source: require("./assets/avatars/avatar-17.png") },
  { id: "avatar-18", name: "Pulse", source: require("./assets/avatars/avatar-18.png") },
  { id: "avatar-19", name: "Anchor", source: require("./assets/avatars/avatar-19.png") },
  { id: "avatar-20", name: "Rise", source: require("./assets/avatars/avatar-20.png") },
  { id: "avatar-21", name: "Orbit", source: require("./assets/avatars/avatar-21.png") },
];

type AgeBand = "7-9" | "10-12" | "13-15" | "16-17" | "18+";
type Screen = "home" | "sport" | "quiz" | "result" | "profile";
type Profile = {
  name: string;
  ageBand: AgeBand;
  avatarId: string;
  soundOn: boolean;
  xp: number;
  completedSports: string[];
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
};
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

function Logo() {
  return <View style={styles.logo}><Text style={styles.logoSports}>SPORTS</Text><Text style={styles.logoIq}>IQ</Text></View>;
}

function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && !disabled && styles.pressed, disabled && styles.disabled]}><Text style={styles.primaryButtonText}>{label}</Text><Text style={styles.primaryArrow}>→</Text></Pressable>;
}

function AvatarPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return <View><Text style={styles.fieldLabel}>CHOOSE YOUR MINI CHARACTER</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarList}>{AVATARS.map((avatar) => <Pressable key={avatar.id} accessibilityRole="button" accessibilityLabel={`Choose ${avatar.name}`} accessibilityState={{ selected: value === avatar.id }} onPress={() => onChange(avatar.id)} style={[styles.avatarChoice, value === avatar.id && styles.avatarChoiceActive]}><MiniCharacter id={avatar.id} size={74} /><Text style={styles.avatarName}>{avatar.name}</Text>{value === avatar.id && <View style={styles.avatarCheck}><Text style={styles.avatarCheckText}>✓</Text></View>}</Pressable>)}</ScrollView></View>;
}

function adaptChallenge(challenge: Challenge, ageBand: AgeBand): Challenge {
  const expected = Array.isArray(challenge.correct) ? challenge.correct : [challenge.correct];
  const options = ageBand === "7-9" && challenge.options.length > 3
    ? [...expected, ...challenge.options.filter((option) => !expected.includes(option)).slice(0, 3 - expected.length)]
    : challenge.options;
  return {
    ...challenge,
    prompt: ageBand === "7-9" ? challenge.youngPrompt ?? challenge.prompt : challenge.prompt,
    explanation: ageBand === "7-9" ? challenge.youngExplanation ?? challenge.explanation : challenge.explanation,
    options,
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
  const [variant, setVariant] = useState(SPORTS[0].variants[0]);
  const [quiz, setQuiz] = useState<Challenge[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
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
          const next = { ...DEFAULT_PROFILE, ...parsed, avatarId };
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
    setVariant(nextSport.variants[0]);
    setScreen("sport");
  };

  const startQuiz = () => {
    const learningModule = buildSportIntroModule(sport);
    setQuiz(learningModule.challenges.map((challenge) => adaptChallenge(challenge, profile.ageBand)));
    setQuestionIndex(0);
    setSelected(null);
    setFeedback(null);
    setSeconds(AGE_BANDS.find((band) => band.value === profile.ageBand)?.seconds ?? null);
    setCorrectCount(0);
    setQuizXp(0);
    setScreen("quiz");
  };

  const checkAnswer = () => {
    if (!question || !selected || feedback) return;
    const expected = Array.isArray(question.correct) ? question.correct : [question.correct];
    const correct = expected.includes(selected);
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
      setSelected(null);
      setFeedback(null);
      setSeconds(AGE_BANDS.find((band) => band.value === profile.ageBand)?.seconds ?? null);
      return;
    }
    const earned = quizXp + 35;
    setProfile((current) => ({
      ...current,
      xp: current.xp + earned,
      completedSports: current.completedSports.includes(sport.id) ? current.completedSports : [...current.completedSports, sport.id],
    }));
    setQuizXp(earned);
    setScreen("result");
  };

  const saveProfile = () => {
    if (!draftName.trim()) return;
    setProfile((current) => ({ ...current, name: draftName.trim(), ageBand: draftAge, avatarId: draftAvatar }));
    setScreen("home");
  };

  if (!loaded) return <SafeAreaView style={styles.loading}><Logo /><Text style={styles.loadingText}>BUILDING YOUR PLAYBOOK…</Text></SafeAreaView>;

  if (!profile.name) {
    return <SafeAreaView style={styles.safe}><StatusBar style="dark" /><ScrollView contentContainerStyle={[styles.onboarding, isTablet && styles.onboardingTablet]} keyboardShouldPersistTaps="handled"><View style={styles.onboardingCopy}><Logo /><Text style={styles.kicker}>13 SPORTS · ONE PLAYBOOK · YOUR PACE</Text><Text style={[styles.displayTitle, isTablet && styles.displayTitleTablet]}>LEARN THE GAME.{"\n"}<Text style={styles.tealText}>SEE IT DIFFERENTLY.</Text></Text><Text style={styles.lede}>Pick a sport. Make the call. Learn why it works. Build real game knowledge in short, animated challenges.</Text><Text style={styles.fieldLabel}>CHOOSE YOUR AGE PATH</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ageList}>{AGE_BANDS.map((band) => <Pressable key={band.value} onPress={() => setDraftAge(band.value)} style={[styles.ageChoice, draftAge === band.value && styles.ageChoiceActive]}><Text style={[styles.ageValue, draftAge === band.value && styles.choiceTextActive]}>{band.value}</Text><Text style={[styles.ageTitle, draftAge === band.value && styles.choiceTextActive]}>{band.title}</Text><Text style={[styles.ageNote, draftAge === band.value && styles.choiceTextActive]}>{band.note}</Text></Pressable>)}</ScrollView><AvatarPicker value={draftAvatar} onChange={setDraftAvatar} /><Text style={styles.fieldLabel}>WHAT SHOULD WE CALL YOU?</Text><TextInput accessibilityLabel="Player name" value={draftName} onChangeText={setDraftName} placeholder="Your first name" placeholderTextColor="#89919a" style={styles.nameInput} returnKeyType="done" onSubmitEditing={createProfile} /><PrimaryButton label="BUILD MY PLAYBOOK" onPress={createProfile} disabled={!draftName.trim()} /><Text style={styles.privacyNote}>No account required. Progress saves on this device.</Text></View>{isTablet && <View style={styles.onboardingArena}><Text style={styles.arenaLabel}>YOUR FIRST MISSION</Text><View style={styles.squad}><MiniCharacter id="avatar-01" size={152} animated /><MiniCharacter id="avatar-10" size={162} animated /><MiniCharacter id="avatar-15" size={152} animated /></View>{["Choose a sport", "Make the read", "Master the concept"].map((step, index) => <View key={step} style={styles.missionStep}><View style={[styles.stepNumber, index === 0 && styles.stepNumberActive]}><Text style={styles.stepNumberText}>0{index + 1}</Text></View><Text style={styles.missionText}>{step}</Text></View>)}</View>}</ScrollView></SafeAreaView>;
  }

  const header = <View style={styles.header}><Pressable onPress={() => setScreen("home")}><Logo /></Pressable><View style={styles.headerActions}><View style={styles.xpPill}><Text style={styles.xpLabel}>XP</Text><Text style={styles.xpValue}>{profile.xp}</Text></View><Pressable accessibilityLabel={`${profile.soundOn ? "Turn off" : "Turn on"} answer feedback sounds`} onPress={() => setProfile((current) => ({ ...current, soundOn: !current.soundOn }))} style={[styles.sfxButton, profile.soundOn && styles.sfxButtonActive]}><Text style={styles.sfxText}>SFX {profile.soundOn ? "ON" : "OFF"}</Text></Pressable><Pressable accessibilityLabel="Open profile" onPress={() => { setDraftName(profile.name); setDraftAge(profile.ageBand); setDraftAvatar(profile.avatarId); setScreen("profile"); }} style={styles.headerAvatar}><MiniCharacter id={profile.avatarId} size={52} /></Pressable></View></View>;

  if (screen === "quiz" && question) {
    const expected = Array.isArray(question.correct) ? question.correct : [question.correct];
    return <SafeAreaView style={styles.safe}><StatusBar style="dark" /><View style={styles.quizHeader}><Pressable onPress={() => setScreen("sport")}><Text style={styles.exitText}>← EXIT LESSON</Text></Pressable><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${((questionIndex + (feedback ? 1 : 0)) / quiz.length) * 100}%` }]} /></View><Text style={styles.questionCount}>{questionIndex + 1}/{quiz.length}</Text></View><ScrollView contentContainerStyle={[styles.quizContent, isTablet && styles.quizContentTablet]}><View style={styles.quizMeta}><View><Text style={styles.kicker}>{question.label}</Text><Text style={styles.quizSport}>{sport.name} · {variant}</Text></View>{seconds !== null && <View style={[styles.timer, seconds <= 10 && styles.timerLow]}><Text style={[styles.timerValue, seconds <= 10 && styles.timerValueLow]}>{seconds}</Text><Text style={styles.timerLabel}>SEC</Text></View>}</View><Text style={[styles.questionTitle, isTablet && styles.questionTitleTablet]}>{question.prompt}</Text><Text style={styles.answerInstruction}>Choose one answer, then check your call.</Text><View style={[styles.answerGrid, isTablet && styles.answerGridTablet]}>{question.options.map((option, index) => { const isSelected = selected === option; const isCorrect = !!feedback && expected.includes(option); const isWrong = !!feedback && isSelected && !expected.includes(option); return <Pressable key={option} disabled={!!feedback} onPress={() => setSelected(option)} style={({ pressed }) => [styles.answerCard, isSelected && styles.answerSelected, isCorrect && styles.answerCorrect, isWrong && styles.answerWrong, pressed && !feedback && styles.pressed]}><View style={styles.answerLetter}><Text style={styles.answerLetterText}>{String.fromCharCode(65 + index)}</Text></View><Text style={styles.answerText}>{option}</Text>{isCorrect && <Text style={styles.answerMark}>✓</Text>}{isWrong && <Text style={styles.answerMark}>×</Text>}</Pressable>; })}</View>{!feedback ? <PrimaryButton label="CHECK MY ANSWER" onPress={checkAnswer} disabled={!selected} /> : <View style={[styles.feedback, feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong]}><Text style={styles.feedbackLabel}>{feedback.correct ? "THAT’S THE RIGHT CALL" : feedback.timedOut ? "TIME’S UP — LET’S LEARN IT" : "LET’S READ IT AGAIN"}</Text><Text style={styles.feedbackText}>{question.explanation}</Text>{!feedback.correct && <Text style={styles.correctAnswer}>Correct answer: {expected.join(" · ")}</Text>}<PrimaryButton label={questionIndex === quiz.length - 1 ? "FINISH MISSION" : "NEXT QUESTION"} onPress={advance} /></View>}</ScrollView></SafeAreaView>;
  }

  if (screen === "result") {
    return <SafeAreaView style={styles.safe}><StatusBar style="dark" /><ScrollView contentContainerStyle={styles.resultContent}><MiniCharacter id={profile.avatarId} size={190} animated /><Text style={styles.kicker}>MISSION COMPLETE</Text><Text style={styles.resultTitle}>YOU’RE SEEING THE{`\n`}GAME BETTER.</Text><View style={styles.xpAward}><Text style={styles.xpAwardLabel}>XP EARNED</Text><Text style={styles.xpAwardValue}>+{quizXp}</Text></View><View style={styles.resultStats}><View><Text style={styles.resultStatValue}>{correctCount}/{quiz.length}</Text><Text style={styles.resultStatLabel}>CORRECT</Text></View><View><Text style={styles.resultStatValue}>{Math.round((correctCount / Math.max(1, quiz.length)) * 100)}%</Text><Text style={styles.resultStatLabel}>ACCURACY</Text></View></View><PrimaryButton label="CHOOSE ANOTHER SPORT" onPress={() => setScreen("home")} /><Pressable onPress={() => setScreen("sport")}><Text style={styles.secondaryLink}>Practice {sport.name} again</Text></Pressable></ScrollView></SafeAreaView>;
  }

  if (screen === "profile") {
    return <SafeAreaView style={styles.safe}><StatusBar style="dark" />{header}<ScrollView contentContainerStyle={[styles.page, { width: contentWidth }]}><Pressable onPress={() => setScreen("home")}><Text style={styles.backLink}>← HOME</Text></Pressable><View style={[styles.profileLayout, isTablet && styles.profileLayoutTablet]}><View style={styles.playerCard}><Text style={styles.kicker}>PLAYER PROFILE</Text><View style={styles.profileCharacter}><MiniCharacter id={draftAvatar} size={190} animated /></View><Text style={styles.playerName}>{draftName || profile.name}</Text><Text style={styles.playerStats}>{profile.xp} XP · {profile.completedSports.length} sports completed</Text><View style={styles.playerStripe}><Text style={styles.playerStripeText}>{draftAge}</Text><Text style={styles.playerStripeText}>SPORTS IQ</Text></View></View><View style={styles.profileForm}><Text style={styles.fieldLabel}>DISPLAY NAME</Text><TextInput value={draftName} onChangeText={setDraftName} style={styles.nameInput} /><Text style={styles.fieldLabel}>AGE PATH</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.compactAgeList}>{AGE_BANDS.map((band) => <Pressable key={band.value} onPress={() => setDraftAge(band.value)} style={[styles.compactAge, draftAge === band.value && styles.compactAgeActive]}><Text style={[styles.compactAgeText, draftAge === band.value && styles.choiceTextActive]}>{band.value}</Text></Pressable>)}</ScrollView><AvatarPicker value={draftAvatar} onChange={setDraftAvatar} /><PrimaryButton label="SAVE PLAYER CARD" onPress={saveProfile} disabled={!draftName.trim()} /></View></View></ScrollView></SafeAreaView>;
  }

  if (screen === "sport") {
    return <SafeAreaView style={styles.safe}><StatusBar style="dark" />{header}<ScrollView contentContainerStyle={[styles.page, { width: contentWidth }]}><Pressable onPress={() => setScreen("home")}><Text style={styles.backLink}>← ALL SPORTS</Text></Pressable><View style={styles.sportHero}><View style={[styles.sportMarkLarge, { backgroundColor: sport.softColor, borderColor: sport.color }]}><Text style={[styles.sportMarkTextLarge, { color: sport.color }]}>{sport.mark}</Text></View><View style={styles.sportHeroCopy}><Text style={[styles.kicker, { color: sport.color }]}>CHOOSE YOUR FORMAT</Text><Text style={styles.sportTitle}>{sport.name}</Text><Text style={styles.sportNote}>{sport.pathNote ?? "Learn the rules, positions, and game decisions that matter."}</Text></View></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.variantList}>{sport.variants.map((item) => <Pressable key={item} onPress={() => setVariant(item)} style={[styles.variantChip, variant === item && { backgroundColor: sport.color, borderColor: sport.color }]}><Text style={[styles.variantText, variant === item && styles.choiceTextActive]}>{item}</Text></Pressable>)}</ScrollView><View style={styles.lessonCard}><Text style={styles.kicker}>FUNDAMENTALS · 4 QUESTIONS</Text><Text style={styles.lessonTitle}>Learn the shape of the game</Text><Text style={styles.lessonText}>One clearly scoped rules question at a time. Your {profile.ageBand} path uses {agePath.seconds === null ? "no timer" : `${agePath.seconds} seconds per question`}.</Text><PrimaryButton label="START MISSION" onPress={startQuiz} /></View></ScrollView></SafeAreaView>;
  }

  return <SafeAreaView style={styles.safe}><StatusBar style="dark" />{header}<ScrollView contentContainerStyle={[styles.page, { width: contentWidth }]}><View style={[styles.homeHero, isTablet && styles.homeHeroTablet]}><View style={styles.homeHeroCopy}><Text style={styles.kicker}>{agePath.title.toUpperCase()} · AGES {profile.ageBand}</Text><Text style={[styles.homeTitle, isTablet && styles.homeTitleTablet]}>GOOD TO SEE YOU,{"\n"}<Text style={styles.tealText}>{profile.name.toUpperCase()}.</Text></Text><Text style={styles.lede}>Choose an arena, make the call, and build real game IQ in a few focused minutes.</Text><View style={styles.heroChips}><Text style={styles.heroChip}>QUICK SESSIONS</Text><Text style={styles.heroChip}>REAL GAME READS</Text><Text style={styles.heroChip}>13 SPORTS</Text></View></View><View style={styles.homePlayer}><MiniCharacter id={profile.avatarId} size={isTablet ? 230 : 165} animated /><Text style={styles.gameReady}>GAME READY</Text></View></View><View style={styles.sectionHeading}><Text style={styles.kicker}>CHOOSE YOUR ARENA</Text><Text style={styles.sectionTitle}>Which game do you want to unlock?</Text><Text style={styles.sectionCopy}>Tackle and flag football are separate. Every sport has its own clearly labeled rules context.</Text></View><View style={styles.sportGrid}>{SPORTS.map((item) => { const complete = profile.completedSports.includes(item.id); return <Pressable key={item.id} onPress={() => openSport(item)} style={({ pressed }) => [styles.sportCard, { width: cardWidth }, pressed && styles.pressed]}><View style={styles.sportCardTop}><View style={[styles.sportMark, { backgroundColor: item.softColor }]}><Text style={[styles.sportMarkText, { color: item.color }]}>{item.mark}</Text></View><Text style={[styles.statusChip, { color: item.color, backgroundColor: item.softColor }]}>{complete ? "COMPLETE" : "NEW"}</Text></View><Text style={styles.sportCardTitle}>{item.name}</Text><Text style={styles.sportCardFormats} numberOfLines={2}>{item.variants.slice(0, 3).join(" · ")}</Text><View style={styles.sportCardFooter}><Text style={styles.enterText}>{complete ? "PRACTICE AGAIN" : "ENTER ARENA"}</Text><Text style={styles.enterArrow}>→</Text></View></Pressable>; })}</View></ScrollView></SafeAreaView>;
}

export default function App() {
  return <SafeAreaProvider><SportsIQApp /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
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
  avatarList: { gap: 7, paddingVertical: 2, paddingHorizontal: 2, paddingBottom: 12 },
  avatarChoice: { width: 86, height: 104, alignItems: "center", justifyContent: "flex-end", paddingBottom: 7, overflow: "hidden", borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface },
  avatarChoiceActive: { borderColor: COLORS.teal, backgroundColor: "#e6f0ed", transform: [{ translateY: -2 }] },
  avatarName: { color: COLORS.muted, fontSize: 7, fontWeight: "900", letterSpacing: 0.6, textTransform: "uppercase" },
  avatarCheck: { position: "absolute", top: 5, right: 5, width: 18, height: 18, alignItems: "center", justifyContent: "center", borderRadius: 9, backgroundColor: COLORS.teal },
  avatarCheckText: { color: "white", fontSize: 10, fontWeight: "900" },
  nameInput: { minHeight: 54, paddingHorizontal: 15, borderWidth: 2, borderColor: COLORS.navy, backgroundColor: COLORS.surface, color: COLORS.navy, fontSize: 16, fontWeight: "700", marginBottom: 10 },
  primaryButton: { minHeight: 54, maxWidth: 480, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 17, borderWidth: 2, borderColor: COLORS.navy, backgroundColor: COLORS.gold, shadowColor: COLORS.navy, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
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
  headerActions: { flexDirection: "row", alignItems: "center", gap: 7 },
  xpPill: { height: 38, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 9, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface },
  xpLabel: { padding: 4, backgroundColor: "#f4e4bf", color: COLORS.navy, fontSize: 7, fontWeight: "900" },
  xpValue: { color: COLORS.navy, fontSize: 11, fontWeight: "900" },
  sfxButton: { height: 38, alignItems: "center", justifyContent: "center", paddingHorizontal: 9, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface },
  sfxButtonActive: { borderColor: COLORS.teal },
  sfxText: { color: COLORS.teal, fontSize: 7, fontWeight: "900", letterSpacing: 0.6 },
  headerAvatar: { width: 42, height: 42, alignItems: "center", justifyContent: "flex-end", overflow: "hidden", borderWidth: 2, borderColor: COLORS.teal, borderRadius: 21, backgroundColor: "#e2eeea" },
  page: { alignSelf: "center", padding: 18, paddingBottom: 70 },
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
  sportGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  sportCard: { minHeight: 220, padding: 16, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface },
  sportCardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  sportMark: { width: 50, height: 50, alignItems: "center", justifyContent: "center" },
  sportMarkText: { fontSize: 13, fontWeight: "900" },
  statusChip: { paddingHorizontal: 6, paddingVertical: 5, fontSize: 7, fontWeight: "900", letterSpacing: 0.6 },
  sportCardTitle: { color: COLORS.navy, fontSize: 19, fontWeight: "900", letterSpacing: -0.7, marginTop: 18 },
  sportCardFormats: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 11, lineHeight: 16, marginTop: 5 },
  sportCardFooter: { marginTop: "auto", paddingTop: 13, borderTopWidth: 1, borderTopColor: COLORS.line, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  enterText: { color: COLORS.navy, fontSize: 8, fontWeight: "900", letterSpacing: 0.6 },
  enterArrow: { color: COLORS.navy, fontSize: 18, fontWeight: "900" },
  backLink: { color: COLORS.muted, fontSize: 9, fontWeight: "900", letterSpacing: 0.6, paddingVertical: 12 },
  sportHero: { flexDirection: "row", alignItems: "center", gap: 20, paddingVertical: 24 },
  sportMarkLarge: { width: 82, height: 82, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  sportMarkTextLarge: { fontSize: 22, fontWeight: "900" },
  sportHeroCopy: { flex: 1 },
  sportTitle: { color: COLORS.navy, fontSize: 43, fontWeight: "900", letterSpacing: -2.7, lineHeight: 46 },
  sportNote: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 13, lineHeight: 19, marginTop: 6 },
  variantList: { gap: 7, paddingVertical: 10 },
  variantChip: { minHeight: 38, justifyContent: "center", paddingHorizontal: 13, borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, backgroundColor: COLORS.surface },
  variantText: { color: COLORS.navy, fontSize: 9, fontWeight: "800" },
  lessonCard: { maxWidth: 650, padding: 22, marginTop: 24, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, shadowColor: COLORS.navy, shadowOffset: { width: 6, height: 6 }, shadowOpacity: 0.12, shadowRadius: 0 },
  lessonTitle: { color: COLORS.navy, fontSize: 27, fontWeight: "900", letterSpacing: -1.2, marginBottom: 7 },
  lessonText: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 14, lineHeight: 21, marginBottom: 22 },
  quizHeader: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  exitText: { color: COLORS.muted, fontSize: 8, fontWeight: "900", letterSpacing: 0.5 },
  progressTrack: { flex: 1, height: 7, overflow: "hidden", backgroundColor: COLORS.surface2 },
  progressFill: { height: "100%", backgroundColor: COLORS.teal },
  questionCount: { color: COLORS.muted, fontSize: 9, fontWeight: "900" },
  quizContent: { width: "100%", maxWidth: 780, alignSelf: "center", padding: 20, paddingBottom: 70 },
  quizContentTablet: { paddingTop: 45 },
  quizMeta: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  quizSport: { color: COLORS.muted, fontSize: 10 },
  timer: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.gold, borderRadius: 26, backgroundColor: COLORS.surface },
  timerLow: { borderColor: COLORS.coral },
  timerValue: { color: COLORS.navy, fontSize: 16, fontWeight: "900" },
  timerValueLow: { color: COLORS.coral },
  timerLabel: { color: COLORS.muted, fontSize: 6, fontWeight: "900" },
  questionTitle: { color: COLORS.navy, fontSize: 34, fontWeight: "900", letterSpacing: -1.8, lineHeight: 38, marginTop: 27, marginBottom: 9 },
  questionTitleTablet: { fontSize: 47, lineHeight: 51, letterSpacing: -2.7 },
  answerInstruction: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, marginBottom: 18 },
  answerGrid: { gap: 9, marginBottom: 20 },
  answerGridTablet: { flexDirection: "row", flexWrap: "wrap" },
  answerCard: { minHeight: 78, flex: 1, minWidth: 280, flexDirection: "row", alignItems: "center", gap: 13, padding: 14, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface },
  answerSelected: { borderColor: COLORS.teal, borderWidth: 2, backgroundColor: "#edf4f1" },
  answerCorrect: { borderColor: COLORS.green, borderWidth: 2, backgroundColor: "#edf5ef" },
  answerWrong: { borderColor: COLORS.coral, borderWidth: 2, backgroundColor: "#faefeb" },
  answerLetter: { width: 35, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: COLORS.surface2 },
  answerLetterText: { color: COLORS.navy, fontSize: 11, fontWeight: "900" },
  answerText: { flex: 1, color: COLORS.navy, fontSize: 14, fontWeight: "800", lineHeight: 19 },
  answerMark: { color: COLORS.green, fontSize: 22, fontWeight: "900" },
  feedback: { padding: 18, borderLeftWidth: 5, marginTop: 8, gap: 8 },
  feedbackCorrect: { borderLeftColor: COLORS.green, backgroundColor: "#eaf3ed" },
  feedbackWrong: { borderLeftColor: COLORS.coral, backgroundColor: "#f8ece8" },
  feedbackLabel: { color: COLORS.navy, fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },
  feedbackText: { color: COLORS.navy, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 15, lineHeight: 22, marginBottom: 3 },
  correctAnswer: { color: COLORS.coral, fontSize: 11, fontWeight: "800", marginBottom: 10 },
  resultContent: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: COLORS.paper },
  resultTitle: { color: COLORS.navy, fontSize: 38, fontWeight: "900", letterSpacing: -2.5, lineHeight: 37, textAlign: "center", marginBottom: 20 },
  xpAward: { width: 210, alignItems: "center", padding: 17, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, marginBottom: 18 },
  xpAwardLabel: { color: COLORS.teal, fontSize: 8, fontWeight: "900", letterSpacing: 1.1 },
  xpAwardValue: { color: COLORS.navy, fontSize: 44, fontWeight: "900" },
  resultStats: { width: 260, flexDirection: "row", justifyContent: "space-around", marginBottom: 25 },
  resultStatValue: { color: COLORS.navy, fontSize: 26, fontWeight: "900", textAlign: "center" },
  resultStatLabel: { color: COLORS.muted, fontSize: 7, fontWeight: "900", letterSpacing: 0.8, textAlign: "center" },
  secondaryLink: { color: COLORS.teal, fontSize: 10, fontWeight: "900", marginTop: 22, textDecorationLine: "underline" },
  profileLayout: { gap: 16, marginTop: 10 },
  profileLayoutTablet: { flexDirection: "row", alignItems: "flex-start" },
  playerCard: { flex: 0.75, alignItems: "center", padding: 25, overflow: "hidden", borderTopWidth: 7, borderTopColor: COLORS.teal, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface },
  profileCharacter: { width: 178, height: 178, alignItems: "center", justifyContent: "flex-end", overflow: "hidden", borderWidth: 2, borderColor: COLORS.teal, borderRadius: 89, backgroundColor: "#e6f0ed" },
  playerName: { color: COLORS.navy, fontSize: 29, fontWeight: "900", marginTop: 15 },
  playerStats: { color: COLORS.muted, fontFamily: Platform.select({ ios: "Georgia", default: "serif" }), fontSize: 12, marginTop: 6, textAlign: "center" },
  playerStripe: { width: "100%", flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: COLORS.navy, marginTop: 25 },
  playerStripeText: { color: "white", fontSize: 7, fontWeight: "900", letterSpacing: 0.8 },
  profileForm: { flex: 1.25, padding: 22, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface },
  compactAgeList: { gap: 7, paddingBottom: 14 },
  compactAge: { minWidth: 57, minHeight: 42, alignItems: "center", justifyContent: "center", paddingHorizontal: 9, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface2 },
  compactAgeActive: { borderColor: COLORS.teal, backgroundColor: COLORS.teal },
  compactAgeText: { color: COLORS.navy, fontSize: 9, fontWeight: "900" },
});
