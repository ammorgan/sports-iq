"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BADGES,
  arrangeChallengeOptions,
  challengesForAge,
  generalModulesForSport,
  learningModulePathsForSport,
  migrateCompletedModuleIds,
  positionAbbreviation,
  positionModulesForPosition,
  remediationChallengeFor,
  FEATURED_SPORTS as SPORTS,
  sportProgressSummary,
  type Challenge,
  type LearningModule,
  type Position,
  type Sport,
} from "./learning-data";
import { AVATAR_PROFILES, DEFAULT_AVATAR_ID, coachVoiceForAvatar, type CoachVoice } from "./avatar-catalog";
import { lessonAudioEntryFor, webLessonAudioUrl } from "./generated-lesson-audio";
import { VOICE_NARRATION_ENABLED, firstSentence, lessonAudioKey, lessonNarrationText } from "./lesson-audio";
import { moduleGuideFor } from "./module-guides";
import { SportGlyph } from "./sport-icon";
import { CourseMap } from "./course-map";
import { ExerciseChoices } from "./exercise-choices";
import { learningConceptLabel } from "./learning-labels";
import { isChallengeAnswerCorrect, hasRecoveredCoreLesson, exerciseInstruction, formattedCorrectAnswer, coreRetryChallenge } from "./exercise-engine";
import { formationExerciseForModule } from "./course-formations";
import { FormationBoard } from "./formation-board";
import { PrivacyGate, type AccountKind, type ConsentState } from "./privacy-gate";
import {
  appendProductEvent,
  buildLocalDataExport,
  calculateCompletionAward,
  canStartLearningModule,
  completedRequiredQuestions,
  type CompletionReceipt,
  type LegalAcceptance,
  type MeasurementPreference,
  type ProductEvent,
  type ProductEventName,
  type ProductEventOutcome,
  pruneProductEvents,
} from "./product-governance";

const PLAYER_KEY = "sports-iq-learning-profile-v1";

type AgeBand = "7-9" | "10-12" | "13-15" | "16-17" | "18+";
type DashboardTab = "learn" | "progress" | "league" | "badges" | "profile";

type Mastery = { attempts: number; correct: number; recovered: boolean };
type SportProgress = {
  xp: number;
  completedModules: string[];
  mastery: Record<string, Mastery>;
};
type Player = {
  profileName: string;
  totalXp: number;
  streak: number;
  lastPlayed: string | null;
  dailyDate: string;
  dailyXp: number;
  badges: string[];
  sports: Record<string, SportProgress>;
  recentActivity: Array<{ title: string; detail: string; date: string }>;
  darkMode: boolean;
  avatarMark: string;
  accentColor: string;
  ageBand: AgeBand;
  ageBandConfirmed: boolean;
  privacyGateComplete: boolean;
  accountKind: AccountKind;
  consentState: ConsentState;
  legalAcceptance: LegalAcceptance | null;
  measurementPreference: MeasurementPreference;
  productEvents: ProductEvent[];
  completionReceipts: Record<string, CompletionReceipt>;
};
type SessionResult = { challengeId: string; conceptId: string; correct: boolean; remediation: boolean };
type ModuleSummary = {
  module: LearningModule;
  xp: number;
  bonus: number;
  correct: number;
  total: number;
  mastered: string[];
  practice: string[];
  newBadges: string[];
  practiceRun: boolean;
};

const DEFAULT_PLAYER: Player = {
  profileName: "",
  totalXp: 0,
  streak: 0,
  lastPlayed: null,
  dailyDate: new Date().toISOString().slice(0, 10),
  dailyXp: 0,
  badges: [],
  sports: {},
  recentActivity: [],
  darkMode: false,
  avatarMark: DEFAULT_AVATAR_ID,
  accentColor: "#3b7f79",
  ageBand: "10-12",
  ageBandConfirmed: false,
  privacyGateComplete: false,
  accountKind: "guest",
  consentState: "not-required",
  legalAcceptance: null,
  measurementPreference: "essential-only",
  productEvents: [],
  completionReceipts: {},
};

const AGE_BANDS: Array<{ value: AgeBand; label: string; title: string; note: string; seconds: number | null }> = [
  { value: "7-9", label: "AGES 6–9", title: "Play & Discover", note: "Simple words and time to think.", seconds: null },
  { value: "10-12", label: "AGES 10–12", title: "Build the Basics", note: "Clear explanations and game-like decisions.", seconds: 60 },
  { value: "13-15", label: "AGES 13–15", title: "Read the Game", note: "Full scenarios, strategy, and position reads.", seconds: 45 },
  { value: "16-17", label: "AGES 16–17", title: "Compete & Lead", note: "Practice game decisions at your pace.", seconds: 35 },
  { value: "18+", label: "AGES 18+", title: "Full Game IQ", note: "Complete detail for adults, athletes, and coaches.", seconds: 30 },
];

function timeLimitForAge(ageBand: AgeBand) {
  const band = AGE_BANDS.find((item) => item.value === ageBand);
  return band ? band.seconds : 35;
}

const AVATARS = AVATAR_PROFILES.map((avatar) => ({
  ...avatar,
  src: `/avatars/${avatar.id}.png`,
}));
const PLAYER_COLORS = ["#3b7f79", "#b85f45", "#59739a", "#6b64a2", "#9a6c36", "#4b7a58"];
const PLAYER_RANKS = [
  { name: "Rookie Reader", xp: 0, mark: "01" },
  { name: "Game Scout", xp: 300, mark: "02" },
  { name: "Field General", xp: 800, mark: "03" },
  { name: "Sports Scholar", xp: 1600, mark: "04" },
  { name: "Arena Elite", xp: 3000, mark: "05" },
];


function Logo({ compact = false }: { compact?: boolean }) {
  return <span className={`logo ${compact ? "logo--compact" : ""}`} role="img" aria-label="RepQuest logo" />;
}

function SportIcon({ sport }: { sport: Sport }) {
  return <SportGlyph id={sport.id} name={sport.name} />;
}

function speechVoiceScore(voice: SpeechSynthesisVoice, coachVoice: CoachVoice) {
  const name = voice.name.toLowerCase();
  let score = voice.lang.toLowerCase() === "en-us" ? 40 : voice.lang.toLowerCase().startsWith("en") ? 20 : -100;
  if (/premium|enhanced|natural|neural/.test(name)) score += 70;
  const voiceNameMatch = coachVoice === "marin"
    ? /ava|samantha|allison|aria|jenny|victoria|karen|moira|tessa|female/
    : /aaron|alex|arthur|daniel|fred|gordon|matthew|oliver|rishi|ryan|thomas|tom|male/;
  if (voiceNameMatch.test(name)) score += 45;
  if (voice.default) score += 12;
  if (voice.localService) score += 6;
  if (/compact|novelty|whisper|zarvox/.test(name)) score -= 60;
  return score;
}

function preferredBrowserVoice(voices: SpeechSynthesisVoice[], coachVoice: CoachVoice) {
  return [...voices]
    .filter((voice) => voice.lang.toLowerCase().startsWith("en"))
    .sort((left, right) => speechVoiceScore(right, coachVoice) - speechVoiceScore(left, coachVoice))[0];
}

function ReadAloudButton({ text, label, coachVoice, audioSrc, aiGenerated = false }: { text: string; label: string; coachVoice: CoachVoice; audioSrc?: string; aiGenerated?: boolean }) {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | undefined>(undefined);
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined);
  const utteranceRef = useRef<SpeechSynthesisUtterance | undefined>(undefined);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const speech = window.speechSynthesis;
    const updateVoice = () => { voiceRef.current = preferredBrowserVoice(speech.getVoices(), coachVoice); };
    updateVoice();
    speech.addEventListener?.("voiceschanged", updateVoice);
    return () => {
      speech.removeEventListener?.("voiceschanged", updateVoice);
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = undefined;
      }
      speech.cancel();
    };
  }, [coachVoice]);

  const speakWithDeviceVoice = () => {
    if (!("speechSynthesis" in window)) return;
    const speech = window.speechSynthesis;
    speech.cancel();
    const message = new SpeechSynthesisUtterance(text);
    message.lang = "en-US";
    message.rate = 0.92;
    message.pitch = 1;
    message.volume = 1;
    message.voice = voiceRef.current ?? preferredBrowserVoice(speech.getVoices(), coachVoice) ?? null;
    message.onstart = () => setSpeaking(true);
    message.onend = () => setSpeaking(false);
    message.onerror = () => setSpeaking(false);
    utteranceRef.current = message;
    speech.speak(message);
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSpeaking(false);
  };

  const speak = async () => {
    if (speaking) {
      stop();
      return;
    }
    window.speechSynthesis?.cancel();
    if (!audioSrc) {
      speakWithDeviceVoice();
      return;
    }

    const audio = new Audio(audioSrc);
    audio.preload = "auto";
    audio.onplay = () => setSpeaking(true);
    audio.onended = () => setSpeaking(false);
    audio.onerror = () => {
      audioRef.current = undefined;
      setSpeaking(false);
      speakWithDeviceVoice();
    };
    audioRef.current = audio;
    try {
      await audio.play();
    } catch {
      audioRef.current = undefined;
      speakWithDeviceVoice();
    }
  };
  return <button type="button" className="read-aloud-button" onClick={() => { void speak(); }} aria-label={speaking ? "Stop narration" : aiGenerated ? `${label}. AI-generated voice.` : label} aria-pressed={speaking}><span aria-hidden="true">{speaking ? "■" : "▶"}</span><span className="read-aloud-copy"><strong>{speaking ? "Stop reading" : label}</strong>{aiGenerated && <small>AI voice</small>}</span></button>;
}

function avatarFor(id: string) {
  return AVATARS.find((avatar) => avatar.id === id)
    ?? AVATARS.find((avatar) => avatar.id === DEFAULT_AVATAR_ID)!;
}

function AvatarImage({ id, className = "" }: { id: string; className?: string }) {
  const avatar = avatarFor(id);
  return <span className={`mini-character-image ${className}`} style={{ "--avatar-image": `url(${avatar.src})` } as React.CSSProperties} aria-hidden="true" />;
}

function AvatarPicker({ value, onChange, compact = false }: { value: string; onChange: (id: string) => void; compact?: boolean }) {
  return (
    <fieldset className={`mini-picker ${compact ? "mini-picker--compact" : ""}`} aria-label="Choose your avatar strength">
      <legend>CHOOSE YOUR AVATAR</legend>
      <div>
        {AVATARS.map((avatar) => (
          <button type="button" key={avatar.id} className={value === avatar.id ? "active" : ""} onClick={() => onChange(avatar.id)} aria-label={`Choose ${avatar.name}`} aria-pressed={value === avatar.id}>
            <AvatarImage id={avatar.id} />
            <span>{avatar.name}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function RoundClock({ duration, paused, onExpire }: { duration: number | null; paused: boolean; onExpire: () => void }) {
  const [seconds, setSeconds] = useState(duration);
  const expireRef = useRef(onExpire);

  useEffect(() => { expireRef.current = onExpire; }, [onExpire]);
  useEffect(() => {
    if (duration === null || paused) return;
    const timer = window.setInterval(() => setSeconds((current) => current === null ? null : Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [duration, paused]);
  useEffect(() => {
    if (seconds === 0 && !paused) expireRef.current();
  }, [paused, seconds]);

  if (seconds === null) return null;
  return <span className={`round-clock ${seconds <= 10 ? "round-clock--low" : ""}`} aria-label={`${seconds} seconds remaining`}>{seconds}<small>SEC</small></span>;
}

function isoDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function previousDay() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return isoDay(date);
}

function emptySportProgress(): SportProgress {
  return { xp: 0, completedModules: [], mastery: {} };
}

function masteryLabel(record?: Mastery) {
  if (!record?.attempts) return "New";
  const accuracy = record.correct / record.attempts;
  if (record.recovered || (record.attempts >= 2 && accuracy >= 0.8)) return "Mastered";
  if (accuracy >= 0.5) return "Practicing";
  return "Learning";
}

function playerRank(xp: number) {
  return [...PLAYER_RANKS].reverse().find((rank) => xp >= rank.xp) ?? PLAYER_RANKS[0];
}

function moduleList(sport: Sport) {
  return generalModulesForSport(sport);
}

export default function Home() {
  const [player, setPlayer] = useState<Player>(DEFAULT_PLAYER);
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState<"dashboard" | "sport" | "primer" | "module" | "results">("dashboard");
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("learn");
  const [selectedSportId, setSelectedSportId] = useState("football");
  const [pathway, setPathway] = useState<"general" | "position">("general");
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [profileDraft, setProfileDraft] = useState("");
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [queue, setQueue] = useState<Challenge[]>([]);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: string } | null>(null);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionMistakes, setSessionMistakes] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [requiredQuestionIds, setRequiredQuestionIds] = useState<string[]>([]);
  const [missedConcepts, setMissedConcepts] = useState<string[]>([]);
  const [recoveredConcepts, setRecoveredConcepts] = useState<string[]>([]);
  const [summary, setSummary] = useState<ModuleSummary | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [primerIndex, setPrimerIndex] = useState(0);
  const [quickSportId, setQuickSportId] = useState("football");
  const [ageChoice, setAgeChoice] = useState<AgeBand>("10-12");
  const [avatarChoice, setAvatarChoice] = useState(DEFAULT_PLAYER.avatarMark);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(PLAYER_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Player;
          const avatarMark = AVATARS.some((avatar) => avatar.id === parsed.avatarMark) ? parsed.avatarMark : DEFAULT_PLAYER.avatarMark;
          const savedAgeBand = parsed.ageBand ?? "10-12";
          const isChildProfile = parsed.accountKind === "child" || savedAgeBand === "7-9" || savedAgeBand === "10-12";
          setAgeChoice(savedAgeBand);
          setAvatarChoice(avatarMark);
          const sports = Object.fromEntries(Object.entries(parsed.sports ?? {}).map(([sportId, progress]) => [sportId, {
            ...progress,
            completedModules: migrateCompletedModuleIds(progress.completedModules ?? []),
          }]));
          setPlayer({
            ...DEFAULT_PLAYER,
            ...parsed,
            profileName: isChildProfile ? "Player" : parsed.profileName,
            avatarMark,
            sports,
            measurementPreference: !isChildProfile && parsed.measurementPreference === "product-improvement" ? "product-improvement" : "essential-only",
            productEvents: !isChildProfile && parsed.measurementPreference === "product-improvement" && Array.isArray(parsed.productEvents) ? pruneProductEvents(parsed.productEvents) : [],
            completionReceipts: parsed.completionReceipts ?? {},
            legalAcceptance: parsed.legalAcceptance ?? null,
          });
        } catch { /* use a fresh profile */ }
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
  }, [hydrated, player]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [screen, dashboardTab, challengeIndex, selectedSportId, player.profileName, player.ageBandConfirmed]);

  useEffect(() => {
    if (feedback) feedbackRef.current?.scrollIntoView({ block: "nearest", behavior: "auto" });
  }, [feedback]);

  const selectedSport = useMemo(
    () => SPORTS.find((sport) => sport.id === selectedSportId) ?? SPORTS[0],
    [selectedSportId],
  );
  const sportProgress = useMemo(
    () => player.sports[selectedSport.id] ?? emptySportProgress(),
    [player.sports, selectedSport.id],
  );
  const currentChallenge = queue[challengeIndex];

  const recordProductEvent = useCallback((name: ProductEventName, dimensions: { sportId?: string; moduleId?: string; outcome?: ProductEventOutcome; step?: number; totalSteps?: number } = {}) => {
    setPlayer((current) => {
      const productEvents = appendProductEvent(current.productEvents, {
        name,
        surface: "web",
        ageBand: current.ageBand,
        ...dimensions,
      }, { accountKind: current.accountKind, preference: current.measurementPreference });
      return productEvents === current.productEvents ? current : { ...current, productEvents };
    });
  }, []);

  const exportLocalData = () => {
    const payload = buildLocalDataExport("web", player);
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `repquest-data-${isoDay()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const navigateHome = () => {
    setScreen("dashboard");
    setDashboardTab("learn");
    setSelectedPosition(null);
  };

  const chooseSport = (sport: Sport) => {
    setSelectedSportId(sport.id);
    setSelectedPosition(null);
    setPathway("general");
    setPlayer((current) => {
      if (current.sports[sport.id]) return current;
      const nextSports = {
        ...current.sports,
        [sport.id]: emptySportProgress(),
      };
      const badges = new Set(current.badges);
      if (Object.keys(nextSports).length >= 3) badges.add("multi-sport");
      return { ...current, sports: nextSports, badges: [...badges] };
    });
    recordProductEvent("sport_opened", { sportId: sport.id });
    setScreen("sport");
  };

  const prepareChallenge = useCallback((challenge: Challenge, effectiveAge = player.ageBand, questionIndex = 0, sequenceKey = challenge.id): Challenge => {
    const isYoungPlayer = effectiveAge === "7-9";
    const explanation = isYoungPlayer
      ? challenge.youngExplanation ?? challenge.explanation.split(/(?<=[.!?])\s/)[0]
      : challenge.explanation;
    return {
      ...challenge,
      prompt: isYoungPlayer ? challenge.youngPrompt ?? challenge.prompt : challenge.prompt,
      explanation,
      hint: isYoungPlayer ? challenge.youngHint ?? challenge.hint : challenge.hint,
      options: arrangeChallengeOptions(challenge, effectiveAge, questionIndex, sequenceKey),
    };
  }, [player.ageBand]);

  const startModule = useCallback((module: LearningModule, ageOverride?: AgeBand) => {
    const moduleSport = SPORTS.find((sport) => sport.id === module.sportId);
    if (!moduleSport) return;
    const effectiveAge = ageOverride ?? player.ageBand;
    const modulePaths = learningModulePathsForSport(moduleSport, effectiveAge);
    const completedModuleIds = player.sports[module.sportId]?.completedModules ?? [];
    if (!canStartLearningModule({ moduleId: module.id, modulePaths, completedModuleIds })) {
      recordProductEvent("progression_blocked", { sportId: module.sportId, moduleId: module.id, outcome: "failed" });
      return;
    }
    const mastery = player.sports[module.sportId]?.mastery ?? {};
    const ageAppropriateChallenges = challengesForAge(module, effectiveAge);
    const prepared = ageAppropriateChallenges.map((challenge, index) => ({
      challenge: prepareChallenge(challenge, effectiveAge, index, module.id),
      index,
      score: mastery[challenge.conceptId]?.attempts
        ? mastery[challenge.conceptId].correct / mastery[challenge.conceptId].attempts
        : 1,
    })).sort((a, b) => module.coreCourse ? a.index - b.index : a.score - b.score || a.index - b.index).map(({ challenge }) => challenge);

    setActiveModule(module);
    setQueue(prepared);
    setChallengeIndex(0);
    setSelectedAnswers([]);
    setFeedback(null);
    setHintVisible(false);
    setSessionXp(0);
    setSessionMistakes(0);
    setSessionStreak(0);
    setSessionResults([]);
    setRequiredQuestionIds(prepared.map((challenge) => challenge.id));
    setMissedConcepts([]);
    setRecoveredConcepts([]);
    setSummary(null);
    setPrimerIndex(0);
    const guide = moduleGuideFor(module, moduleSport, effectiveAge);
    const hasPrimer = Boolean(guide);
    recordProductEvent("module_started", { sportId: module.sportId, moduleId: module.id });
    if (guide) recordProductEvent("lesson_viewed", { sportId: module.sportId, moduleId: module.id, step: 1, totalSteps: guide.lessons.length });
    setScreen(hasPrimer ? "primer" : "module");
  }, [player.sports, player.ageBand, prepareChallenge, recordProductEvent]);

  const checkAnswer = (answers: string[]) => {
    if (!currentChallenge || feedback) return;
    const correct = isChallengeAnswerCorrect(currentChallenge, answers);
    const remediation = currentChallenge.id.includes("remediate") || currentChallenge.id.includes("-retry-");

    if (correct) {
      const streakBonus = Math.min(sessionStreak * 2, 10);
      setSessionXp((value) => value + currentChallenge.xp + streakBonus);
      setSessionStreak((value) => value + 1);
      if (missedConcepts.includes(currentChallenge.conceptId)) {
        setRecoveredConcepts((items) => items.includes(currentChallenge.conceptId) ? items : [...items, currentChallenge.conceptId]);
        recordProductEvent("concept_recovered", { sportId: activeModule?.sportId, moduleId: activeModule?.id, outcome: "completed" });
      }
    } else {
      setSessionMistakes((value) => value + 1);
      setSessionStreak(0);
      setMissedConcepts((items) => items.includes(currentChallenge.conceptId) ? items : [...items, currentChallenge.conceptId]);
      if (!remediation || activeModule?.coreCourse) {
        const baseReplay = currentChallenge.remediation ?? remediationChallengeFor(currentChallenge, player.ageBand);
        const replay = activeModule?.coreCourse ? coreRetryChallenge(currentChallenge,queue.length) : baseReplay;
        if (!queue.some((item) => item.id === replay.id)) {
          setQueue((items) => [...items, prepareChallenge(replay, player.ageBand, items.length, `${activeModule?.id}:replay`)]);
        }
      }
    }

    setSessionResults((items) => [...items, { challengeId: currentChallenge.id, conceptId: currentChallenge.conceptId, correct, remediation }]);
    recordProductEvent("question_answered", { sportId: activeModule?.sportId, moduleId: activeModule?.id, outcome: correct ? "correct" : "incorrect", step: challengeIndex + 1, totalSteps: requiredQuestionIds.length });
    setFeedback({ correct, answer: formattedCorrectAnswer(currentChallenge) });
  };

  const startQuickPlay = () => {
    const sport = SPORTS.find((item) => item.id === quickSportId) ?? SPORTS[0];
    setPlayer((current) => ({
      ...current,
      profileName: profileDraft.trim() || "Player",
      avatarMark: avatarChoice,
      ageBand: ageChoice,
      ageBandConfirmed: true,
      sports: {
        ...current.sports,
        [sport.id]: current.sports[sport.id] ?? emptySportProgress(),
      },
    }));
    setSelectedSportId(sport.id);
    startModule(moduleList(sport)[0], ageChoice);
  };

  const finishModule = () => {
    if (activeModule?.coreCourse && !hasRecoveredCoreLesson(activeModule.challenges, sessionResults)) return;
    if (!activeModule) return;
    if (!completedRequiredQuestions(requiredQuestionIds, sessionResults.map((result) => result.challengeId))) return;
    const alreadyCompleted = player.sports[activeModule.sportId]?.completedModules.includes(activeModule.id) ?? false;
    const award = calculateCompletionAward({ answerXp: sessionXp, completionBonus: 35, perfectBonus: sessionMistakes === 0 ? 50 : 0, alreadyCompleted });
    const bonus = award.bonusAwarded;
    const totalEarned = award.xpAwarded;
    const uniqueResults = new Map<string, SessionResult[]>();
    sessionResults.forEach((result) => uniqueResults.set(result.conceptId, [...(uniqueResults.get(result.conceptId) ?? []), result]));
    const mastered = [...uniqueResults.entries()].filter(([conceptId, results]) =>
      results.some((item) => item.correct) && (!missedConcepts.includes(conceptId) || recoveredConcepts.includes(conceptId)))
      .map(([conceptId]) => conceptId);
    const practice = [...new Set(missedConcepts.filter((concept) => !recoveredConcepts.includes(concept)))];
    const newBadgeIds: string[] = [];

    setPlayer((current) => {
      const priorSport = current.sports[activeModule.sportId] ?? emptySportProgress();
      const currentAlreadyCompleted = priorSport.completedModules.includes(activeModule.id);
      const currentAward = calculateCompletionAward({ answerXp: sessionXp, completionBonus: 35, perfectBonus: sessionMistakes === 0 ? 50 : 0, alreadyCompleted: currentAlreadyCompleted });
      const completed = priorSport.completedModules.includes(activeModule.id)
        ? priorSport.completedModules
        : [...priorSport.completedModules, activeModule.id];
      const nextMastery = { ...priorSport.mastery };
      sessionResults.forEach((result) => {
        const prior = nextMastery[result.conceptId] ?? { attempts: 0, correct: 0, recovered: false };
        nextMastery[result.conceptId] = {
          attempts: prior.attempts + 1,
          correct: prior.correct + (result.correct ? 1 : 0),
          recovered: prior.recovered || (result.correct && missedConcepts.includes(result.conceptId)),
        };
      });

      const badges = new Set(current.badges);
      const award = (id: string) => {
        if (!badges.has(id)) newBadgeIds.push(id);
        badges.add(id);
      };
      award("first-steps");
      if (sessionMistakes === 0) award("perfect-drive");
      if (recoveredConcepts.length) award("comeback-kid");
      const moduleCount = Object.values(current.sports).reduce((sum, sport) => sum + sport.completedModules.length, 0) + (priorSport.completedModules.includes(activeModule.id) ? 0 : 1);
      if (moduleCount >= 10) award("iron-mind");

      const today = isoDay();
      const isNewDay = current.lastPlayed !== today;
      const nextStreak = !isNewDay ? current.streak : current.lastPlayed === previousDay() ? current.streak + 1 : 1;
      const baseDailyXp = current.dailyDate === today ? current.dailyXp : 0;

      return {
        ...current,
        totalXp: current.totalXp + currentAward.xpAwarded,
        streak: nextStreak,
        lastPlayed: today,
        dailyDate: today,
        dailyXp: baseDailyXp + currentAward.xpAwarded,
        badges: [...badges],
        sports: {
          ...current.sports,
          [activeModule.sportId]: {
            ...priorSport,
            xp: priorSport.xp + currentAward.xpAwarded,
            completedModules: completed,
            mastery: nextMastery,
          },
        },
        recentActivity: [
          { title: activeModule.title, detail: currentAward.firstCompletion ? `+${currentAward.xpAwarded} XP · ${sessionResults.filter((item) => item.correct).length}/${sessionResults.length} correct` : `Practice complete · ${sessionResults.filter((item) => item.correct).length}/${sessionResults.length} correct`, date: today },
          ...current.recentActivity,
        ].slice(0, 6),
        completionReceipts: currentAlreadyCompleted ? current.completionReceipts : {
          ...current.completionReceipts,
          [activeModule.id]: {
            moduleId: activeModule.id,
            sportId: activeModule.sportId,
            firstCompletedAt: new Date().toISOString(),
            xpAwarded: currentAward.xpAwarded,
            bestCorrect: sessionResults.filter((item) => item.correct).length,
            questionCount: requiredQuestionIds.length,
          },
        },
      };
    });

    setSummary({
      module: activeModule,
      xp: totalEarned,
      bonus,
      correct: sessionResults.filter((item) => item.correct).length,
      total: sessionResults.length,
      mastered,
      practice,
      newBadges: newBadgeIds,
      practiceRun: !award.firstCompletion,
    });
    recordProductEvent("module_completed", { sportId: activeModule.sportId, moduleId: activeModule.id, outcome: award.firstCompletion ? "completed" : "practice", step: requiredQuestionIds.length, totalSteps: requiredQuestionIds.length });
    setScreen("results");
  };

  const nextChallenge = () => {
    if (!feedback) return;
    if (challengeIndex >= queue.length - 1) {
      finishModule();
      return;
    }
    setChallengeIndex((index) => index + 1);
    setSelectedAnswers([]);
    setFeedback(null);
    setHintVisible(false);
  };

  const currentSportModules = useMemo(() => moduleList(selectedSport), [selectedSport]);

  const { strongest, weakest } = useMemo(() => {
    const allMastery = Object.entries(player.sports).flatMap(([sportId, progress]) =>
      Object.entries(progress.mastery).map(([conceptId, mastery]) => ({ sportId, conceptId, mastery })));
    return {
      strongest: [...allMastery].sort((a, b) => (b.mastery.correct / b.mastery.attempts) - (a.mastery.correct / a.mastery.attempts)).slice(0, 3),
      weakest: [...allMastery].filter((item) => masteryLabel(item.mastery) !== "Mastered")
        .sort((a, b) => (a.mastery.correct / a.mastery.attempts) - (b.mastery.correct / b.mastery.attempts)).slice(0, 3),
    };
  }, [player.sports]);

  if (!hydrated) return <main className="loading-screen"><Logo /><span>Building your playbook…</span></main>;

  if (!player.privacyGateComplete) {
    return <PrivacyGate onContinue={({ ageBand, accountKind, consentState, legalAcceptance }) => {
      setAgeChoice(ageBand);
      setPlayer((current) => ({
        ...current,
        profileName: current.profileName || "Player",
        ageBand,
        ageBandConfirmed: true,
        privacyGateComplete: true,
        accountKind,
        consentState,
        legalAcceptance,
        measurementPreference: "essential-only",
      }));
    }} />;
  }

  if (!player.profileName) {
    return (
      <main className={`welcome-screen ${player.darkMode ? "dark" : ""}`}>
        <div className="welcome-copy">
          <Logo />
          <div className="welcome-live"><span /> {SPORTS.length} SPORTS · ONE PLAYBOOK · YOUR PACE</div>
          <span className="eyebrow"><i /> YOUR REPQUEST STARTS HERE</span>
          <h1>LEARN THE GAME.<br /><em>SEE IT DIFFERENTLY.</em></h1>
          <p>Pick a sport. Make the call. Learn why it works. Build real game knowledge through short, interactive challenges.</p>
          <fieldset className="age-picker">
            <legend>CHOOSE YOUR AGE PATH</legend>
            <div>{AGE_BANDS.map((band) => <button type="button" key={band.value} className={ageChoice === band.value ? "active" : ""} onClick={() => setAgeChoice(band.value)} aria-pressed={ageChoice === band.value}><span>{band.label}</span><strong>{band.title}</strong></button>)}</div>
            <p>{AGE_BANDS.find((band) => band.value === ageChoice)?.note}</p>
          </fieldset>
          <AvatarPicker value={avatarChoice} onChange={setAvatarChoice} compact />
          <form onSubmit={(event) => {
            event.preventDefault();
            if (profileDraft.trim()) setPlayer((current) => ({ ...current, profileName: profileDraft.trim(), avatarMark: avatarChoice, ageBand: ageChoice, ageBandConfirmed: true }));
          }}>
            <label htmlFor="player-name">WHAT SHOULD WE CALL YOU?</label>
            <div><input id="player-name" value={profileDraft} onChange={(event) => setProfileDraft(event.target.value)} placeholder="Your first name" /><button type="submit" disabled={!profileDraft.trim()}>Build my playbook <span>→</span></button></div>
          </form>
          <small>No account required for this preview. Progress saves on this device.</small>
          <div className="quick-play-box">
            <div><span>WANT TO PLAY FIRST?</span><strong>Jump into a relaxed sports lesson—no timer.</strong></div>
            <select value={quickSportId} onChange={(event) => setQuickSportId(event.target.value)} aria-label="Choose a Quick Play sport">
              {SPORTS.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
            </select>
            <button type="button" onClick={startQuickPlay}>Quick Play <span>▶</span></button>
          </div>
        </div>
        <aside className="welcome-board" aria-label="RepQuest learning preview">
          <div className="board-pulse" aria-hidden="true"><i /><i /><i /></div>
          <span>YOUR FIRST MISSION</span>
          <div className="welcome-squad" aria-hidden="true"><AvatarImage id="avatar-01" /><AvatarImage id="avatar-10" /><AvatarImage id="avatar-15" /></div>
          <div className="welcome-step done"><b>01</b><p><strong>Choose a sport</strong><small>Start where you are</small></p></div>
          <div className="welcome-step"><b>02</b><p><strong>Make the read</strong><small>Learn through decisions</small></p></div>
          <div className="welcome-step"><b>03</b><p><strong>Master the concept</strong><small>Build real game IQ</small></p></div>
        </aside>
      </main>
    );
  }

  if (!player.ageBandConfirmed) {
    return (
      <main className={`onboarding-screen age-gate-screen ${player.darkMode ? "dark" : ""}`}>
        <header className="simple-header"><Logo compact /><span>ONE-TIME PLAYBOOK UPDATE</span></header>
        <section className="age-confirm-panel">
          <span className="eyebrow"><i /> BUILT FOR HOW YOU LEARN</span>
          <h1>Choose your<br /><em>age path.</em></h1>
          <p>This changes pacing, visuals, reading load, and answer complexity. It does not limit which sports or skill levels you can choose.</p>
          <div className="age-confirm-grid">{AGE_BANDS.map((band) => <button type="button" key={band.value} className={ageChoice === band.value ? "active" : ""} onClick={() => setAgeChoice(band.value)} aria-pressed={ageChoice === band.value}><span>{band.label}</span><strong>{band.title}</strong><small>{band.note}</small><i>{ageChoice === band.value ? "✓" : "→"}</i></button>)}</div>
          <button className="primary-button" onClick={() => setPlayer((current) => ({ ...current, ageBand: ageChoice, ageBandConfirmed: true }))}>Set my age path <span>→</span></button>
        </section>
      </main>
    );
  }

  if (screen === "primer" && activeModule) {
    const guide = moduleGuideFor(activeModule, selectedSport, player.ageBand);
    const lesson = guide?.lessons[primerIndex];
    if (guide && lesson) {
      const isLast = primerIndex === guide.lessons.length - 1;
      const isEarlyReader = player.ageBand === "7-9";
      const narration = lessonNarrationText(lesson, player.ageBand);
      const lessonTerms = narration.terms;
      const lessonTitle = narration.title;
      const coachingSteps = activeModule.pathway === "position" && lessonTitle.includes(" · ") ? lessonTitle.split(" · ") : [];
      const lessonBody = narration.body;
      const lessonAudio = narration.text;
      const lessonCoachVoice = coachVoiceForAvatar(player.avatarMark);
      const lessonAudioEntry = VOICE_NARRATION_ENABLED
        ? lessonAudioEntryFor(lessonAudioKey(activeModule.id, player.ageBand, primerIndex, lessonCoachVoice))
        : undefined;
      return (
        <main className={`primer-shell repquest-game quest-primer ${isEarlyReader ? "primer-shell--young" : ""}`} style={{ "--sport-color": selectedSport.color, "--sport-soft": selectedSport.softColor } as React.CSSProperties}>
          <header className="primer-header">
            <button className="lesson-exit-button" onClick={() => setScreen("sport")}><span>←</span> Back to path</button>
            <Logo compact />
            <span>{primerIndex + 1} / {guide.lessons.length}</span>
          </header>
          <section className="primer-stage">
            <div className="primer-progress" role="progressbar" aria-label={`Beginner lesson ${primerIndex + 1} of ${guide.lessons.length}`} aria-valuemin={1} aria-valuemax={guide.lessons.length} aria-valuenow={primerIndex + 1}>
              {guide.lessons.map((_, index) => <i aria-hidden="true" key={index} className={index <= primerIndex ? "active" : ""} />)}
            </div>
            <div className="primer-card">
              <div className="primer-sport-mark" aria-hidden="true"><SportIcon sport={selectedSport} /></div>
              <div className="primer-copy">
                <span>{lesson.eyebrow}</span>
                <small>{selectedSport.name} · {activeModule.coreCourse ? "Learn, then play" : isEarlyReader ? "Read and play" : "Beginner playbook"}</small>
                <h1>{coachingSteps.length ? "Make your next decision" : lessonTitle}</h1>
                {VOICE_NARRATION_ENABLED && isEarlyReader && <ReadAloudButton text={lessonAudio} label="Hear this lesson" coachVoice={lessonCoachVoice} audioSrc={lessonAudioEntry ? webLessonAudioUrl(lessonAudioEntry) : undefined} aiGenerated={!!lessonAudioEntry} />}
                <p>{lessonBody}</p>
                {coachingSteps.length > 0 && <ol className="quest-coaching-steps">{coachingSteps.map((step) => <li key={step}>{step}</li>)}</ol>}
                {lessonTerms && <div className="primer-terms">{lessonTerms.map((item) => <article key={item.term}><strong>{item.term}</strong><span>{isEarlyReader ? firstSentence(item.meaning) : item.meaning}</span></article>)}</div>}
                {formationExerciseForModule(activeModule.id) && <FormationBoard exercise={formationExerciseForModule(activeModule.id)!} teaching />}
              </div>
              <div className="primer-coach">
                <AvatarImage id={player.avatarMark} />
                <p><strong>{primerIndex === 0 ? "START HERE" : isLast ? "READY TO PLAY" : "YOU’VE GOT THIS"}</strong>{isEarlyReader ? isLast ? "Pick an answer. Mistakes help us learn!" : VOICE_NARRATION_ENABLED ? "Tap Hear. Then tap Next." : "Look at the picture. Then tap Next." : primerIndex === 0 ? guide.welcome : isLast ? "The quiz checks what this playbook just taught. It is always okay to learn from a miss." : "Take your time. The words will make more sense each time you see the sport."}</p>
              </div>
            </div>
            <div className="primer-actions">
              {primerIndex > 0 && <button className="text-button" onClick={() => setPrimerIndex((index) => index - 1)}>← Previous</button>}
              <button className="primary-button" onClick={() => { if (isLast) setScreen("module"); else { recordProductEvent("lesson_viewed", { sportId: activeModule.sportId, moduleId: activeModule.id, step: primerIndex + 2, totalSteps: guide.lessons.length }); setPrimerIndex((index) => index + 1); } }}>{isEarlyReader ? isLast ? "Play" : "Next" : isLast ? "Let’s try it" : "Keep learning"}<span>→</span></button>
            </div>
          </section>
        </main>
      );
    }
  }

  if (screen === "module" && activeModule && currentChallenge) {
    const isEarlyReader = player.ageBand === "7-9";
    const coachVoice = coachVoiceForAvatar(player.avatarMark);
    const progress = ((challengeIndex + (feedback ? 1 : 0)) / queue.length) * 100;
    const isCheckable = currentChallenge.type === "match"
      ? selectedAnswers.length === currentChallenge.pairs?.length
      : currentChallenge.type === "multi"
      ? selectedAnswers.length > 0
      : currentChallenge.type === "ordering" ? selectedAnswers.length === currentChallenge.options.length : selectedAnswers.length === 1;
    const spokenQuestion = `${currentChallenge.prompt}. ${currentChallenge.options.map((option, index) => `Choice ${index + 1}. ${option}`).join(". ")}`;
    const exitModule = () => {
      const hasSessionWork = challengeIndex > 0 || !!feedback || selectedAnswers.length > 0;
      if (!hasSessionWork || window.confirm("Leave this lesson? Your answers in this session won’t be saved.")) setScreen("sport");
    };
    return (
      <main className={`lesson-shell repquest-game quest-lesson ${isEarlyReader ? "lesson-shell--young" : ""}`}>
        <header className="lesson-header">
          <button className="lesson-exit-button" onClick={exitModule}><span>←</span> Exit lesson</button>
          <div className="lesson-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="lesson-counters"><span>XP <strong>{sessionXp}</strong></span>{!isEarlyReader && <><span>STREAK <strong>{sessionStreak}×</strong></span><span>MISTAKES <strong>{sessionMistakes}</strong></span></>}</div>
        </header>
        <section className="challenge-stage">
          {feedback?.correct && <div className="xp-burst" key={`xp-${challengeIndex}`}>+{currentChallenge.xp + Math.min(Math.max(0, sessionStreak - 1) * 2, 10)} XP</div>}
          <div className="challenge-heading">
            <div><span>{currentChallenge.label}</span><small>{activeModule.title} · {challengeIndex + 1} of {queue.length}</small></div>
            <div className="challenge-tools"><RoundClock key={currentChallenge.id} duration={activeModule.coreCourse ? null : timeLimitForAge(player.ageBand)} paused={!!feedback} onExpire={() => checkAnswer([])} />{!isEarlyReader && sessionStreak >= 2 && <strong className="combo-chip">{sessionStreak}× COMBO</strong>}<button className="hint-button" onClick={() => setHintVisible((visible) => !visible)} aria-expanded={hintVisible} aria-controls="challenge-hint">{isEarlyReader ? hintVisible ? "Hide help" : "Help" : hintVisible ? "Hide hint" : "Need a hint?"}</button></div>
          </div>
          {hintVisible && <div className="hint-panel" id="challenge-hint" role="note"><strong>COACH’S TIP</strong><span>{currentChallenge.hint ?? "Look for the option that best supports the team’s immediate objective."}</span></div>}
          <div className="quest-lesson-coach"><AvatarImage id={player.avatarMark} /><h1>{currentChallenge.prompt}</h1></div>
          {currentChallenge.instruction && <p className="quest-exercise-instruction">{currentChallenge.instruction}</p>}
          {VOICE_NARRATION_ENABLED && isEarlyReader && <ReadAloudButton text={spokenQuestion} label="Hear the question" coachVoice={coachVoice} />}

          <p className="answer-instruction" id="answer-instruction">{exerciseInstruction(currentChallenge)}</p>
          <ExerciseChoices key={currentChallenge.id} challenge={currentChallenge} selected={selectedAnswers} onSelect={(values) => { setSelectedAnswers(values); if (isEarlyReader && !activeModule.coreCourse && !["multi", "ordering", "match"].includes(currentChallenge.type)) checkAnswer(values); }} disabled={!!feedback} reveal={!!feedback} />


          {!feedback && (!isEarlyReader || activeModule.coreCourse) && (
            <div className="check-row">
              {currentChallenge.type === "ordering" && <button className="text-button" onClick={() => setSelectedAnswers([])}>Reset order</button>}
              <button className="primary-button primary-button--small" disabled={!isCheckable} onClick={() => checkAnswer(selectedAnswers)}>Check my answer <span>→</span></button>
            </div>
          )}

          {feedback && (
            <div ref={feedbackRef} className={`feedback-card ${feedback.correct ? "feedback-card--correct" : "feedback-card--wrong"}`} role="status" aria-live="polite">
              {feedback.correct && <div className="feedback-sparks" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>}
              <div className="feedback-mark">{feedback.correct ? "✓" : "↗"}</div>
              <div><span>{isEarlyReader ? feedback.correct ? "GREAT JOB!" : "GOOD TRY!" : feedback.correct ? missedConcepts.includes(currentChallenge.conceptId) ? "CONCEPT RECOVERED" : "THAT’S THE RIGHT CALL" : "LET’S READ IT AGAIN"}</span><p>{currentChallenge.explanation}</p>{!feedback.correct && <><p className="feedback-answer"><strong>{isEarlyReader ? "Answer" : "Correct answer"}:</strong> {feedback.answer}</p><p className="feedback-retry">You’ll try this again before the lesson ends.</p></>}{VOICE_NARRATION_ENABLED && isEarlyReader && <ReadAloudButton text={`${feedback.correct ? "Great job." : "Good try."} ${currentChallenge.explanation}`} label="Hear why" coachVoice={coachVoice} />}</div>
              <button className="next-button" onClick={nextChallenge}>{isEarlyReader ? challengeIndex === queue.length - 1 ? "Done" : "Next" : challengeIndex === queue.length - 1 ? "Finish module" : "Continue"}<span>→</span></button>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (screen === "results" && summary) {
    const accuracy = Math.round((summary.correct / Math.max(1, summary.total)) * 100);
    return (
      <main className="results-shell repquest-game">
        <section className="module-complete-card">
          <div className="result-celebration" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} />)}</div>
          <div className="result-player" style={{ "--player-color": player.accentColor } as React.CSSProperties}><AvatarImage id={player.avatarMark} /></div>
          <Logo compact />
          <span className="eyebrow">{summary.practiceRun ? "PRACTICE COMPLETE" : "MODULE COMPLETE"}</span>
          <h1>{summary.practiceRun ? <>Another rep.<br /><em>More confidence.</em></> : <>Lesson complete!<br /><em>Keep building your game.</em></>}</h1>
          <div className="xp-award"><span>{summary.practiceRun ? "MASTERY UPDATED" : "XP EARNED"}</span><strong>{summary.practiceRun ? "✓" : `+${summary.xp}`}</strong><small>{summary.practiceRun ? "XP is awarded once per module so progression stays fair." : `Includes +${summary.bonus} completion bonus`}</small></div>
          <div className="result-stats"><div><strong>{summary.correct}/{summary.total}</strong><span>CORRECT</span></div><div><strong>{accuracy}%</strong><span>ACCURACY</span></div><div><strong>{player.streak}</strong><span>DAY STREAK</span></div></div>
          <details className="concept-results-disclosure"><summary>{summary.practice.length ? "Skills to practice next" : "See the skills you practiced"}</summary><div className="concept-results">
            <div><span>PRACTICED</span>{summary.mastered.length ? [...new Set(summary.mastered.map((concept) => learningConceptLabel(concept,[summary.module])))].map((label) => <p key={label}>✓ {label}</p>) : <p>Keep building reps</p>}</div>
            <div><span>KEEP PRACTICING</span>{summary.practice.length ? summary.practice.map((concept) => <p key={concept}>• {learningConceptLabel(concept,[summary.module])}</p>) : <p>You worked through every skill.</p>}</div>
          </div></details>
          {summary.newBadges.length > 0 && <div className="badge-unlock"><span>BADGE UNLOCKED</span><strong>{BADGES.find((badge) => badge.id === summary.newBadges[0])?.name}</strong></div>}
          <div className="result-actions"><button className="primary-button" onClick={() => setScreen("sport")}>Continue {summary.module.position ?? selectedSport.name} path <span>→</span></button>
          <button className="text-button" onClick={() => setScreen("dashboard")}>Choose another sport</button></div>
        </section>
      </main>
    );
  }

  if (screen === "sport") {
    const groupedPositions = selectedSport.positions.reduce<Record<string, Position[]>>((groups, position) => {
      groups[position.group] = [...(groups[position.group] ?? []), position]; return groups;
    }, {});
    const selectedPositionModules = selectedPosition ? positionModulesForPosition(selectedSport, selectedPosition, player.ageBand) : [];
    const specializedPathTitle = "Position training";
    return <main className="sport-shell quest-shell repquest-game">
      <AppHeader player={player} active="learn" onNavigate={(tab) => { setDashboardTab(tab); setScreen("dashboard"); }} onHome={navigateHome} />
      {pathway === "general" ? <CourseMap key={selectedSport.id} sport={selectedSport} modules={currentSportModules} completedIds={sportProgress.completedModules} avatarSrc={avatarFor(player.avatarMark).src} onStart={startModule} onBack={navigateHome} onPositions={() => setPathway("position")} />
      : <section className="quest-position-path"><button type="button" className="quest-back" onClick={() => { setPathway("general"); setSelectedPosition(null); }}>← Back to the game path</button>
        {selectedPosition && selectedPositionModules.length ? <div className="position-detail">
          <button className="quest-back" onClick={() => setSelectedPosition(null)}>← All positions</button>
          <div className="position-hero"><span>{selectedPosition.group}</span><h2>{selectedPosition.name}</h2><p>Learn the role. Practice the decisions. Build your game.</p></div>
          <div className="quest-coach-line"><AvatarImage id={player.avatarMark} /><div><strong>Your {selectedPosition.name} journey</strong><span>Start at the next gold step. Revisit any cleared lesson.</span></div></div>
          <div className="quest-node-trail">{selectedPositionModules.map((positionModule, index) => {
            const complete = sportProgress.completedModules.includes(positionModule.id);
            const unlocked = complete || index === 0 || sportProgress.completedModules.includes(selectedPositionModules[index - 1].id);
            const state = complete ? "complete" : unlocked ? "current" : "locked";
            return <div className={`quest-course-node quest-course-node--${state}`} key={positionModule.id} style={{ marginLeft: `${[0, 24, -24, 0][index % 4]}%` }}>
              <button type="button" disabled={!unlocked} onClick={() => startModule(positionModule)} aria-label={`${complete ? "Practice" : unlocked ? "Start" : "Locked"}: ${positionModule.title}`}><span aria-hidden="true">{complete ? "✓" : unlocked ? "▶" : "◆"}</span></button>
              <strong>{positionModule.title}</strong><small>{complete ? "CLEARED" : unlocked ? "PLAY NEXT" : "FINISH THE STEP ABOVE"}</small>
            </div>;
          })}</div>
        </div> : <div className="positions-grid-section"><div className="section-heading"><span>{selectedSport.name.toUpperCase()}</span><h2>{specializedPathTitle}</h2><p>Choose any role now. Learn the job, then make the play.</p></div>{Object.entries(groupedPositions).map(([group, positions]) => <div className="position-group" key={group}><h3>{group}</h3><div>{positions.map((position) => { const modules = positionModulesForPosition(selectedSport, position, player.ageBand); const completeCount = modules.filter((module) => sportProgress.completedModules.includes(module.id)).length; const done = completeCount === modules.length; const abbreviation = positionAbbreviation(position); return <button key={position.name} onClick={() => setSelectedPosition(position)}><span>{done ? "✓" : abbreviation}</span><strong>{position.name}</strong><small>{done ? "PATH COMPLETE" : completeCount ? `${completeCount}/${modules.length} CLEARED` : "LET’S PLAY →"}</small></button>; })}</div></div>)}</div>}
      </section>}
    </main>;
  }

  return (
    <main className="dashboard-shell repquest-game">
      <AppHeader player={player} active={dashboardTab} onNavigate={setDashboardTab} onHome={navigateHome} />
      {dashboardTab === "learn" && <DashboardLearn player={player} onChooseSport={chooseSport} onContinue={() => {
        const started = SPORTS.find((sport) => sportProgressSummary(sport, player.ageBand, player.sports[sport.id]?.completedModules ?? []).started) ?? SPORTS[0]; chooseSport(started);
      }} />}
      {dashboardTab === "progress" && <ProgressDashboard player={player} strongest={strongest} weakest={weakest} onChooseSport={chooseSport} />}
      {dashboardTab === "league" && <LeaderboardDashboard player={player} />}
      {dashboardTab === "badges" && <BadgesDashboard player={player} />}
      {dashboardTab === "profile" && <ProfileDashboard player={player} onUpdateIdentity={(updates) => setPlayer((current) => ({ ...current, ...updates, ageBandConfirmed: true }))} onChangeAge={() => {
        setAgeChoice(player.ageBand);
        setPlayer((current) => ({ ...current, privacyGateComplete: false, measurementPreference: "essential-only", productEvents: [] }));
      }} onMeasurementChange={(measurementPreference) => setPlayer((current) => ({ ...current, measurementPreference, productEvents: measurementPreference === "essential-only" ? [] : current.productEvents }))} onExport={exportLocalData} onDelete={() => {
        if (window.confirm("Delete this local RepQuest profile and all progress from this browser? This cannot be undone.")) {
          window.localStorage.removeItem(PLAYER_KEY);
          setPlayer(DEFAULT_PLAYER);
          setScreen("dashboard");
        }
      }} onReset={() => {
        if (window.confirm("Reset learning progress on this device? Your privacy choices and player card will stay.")) setPlayer({ ...DEFAULT_PLAYER, profileName: player.profileName, darkMode: player.darkMode, avatarMark: player.avatarMark, accentColor: player.accentColor, ageBand: player.ageBand, ageBandConfirmed: true, privacyGateComplete: true, accountKind: player.accountKind, consentState: player.consentState, legalAcceptance: player.legalAcceptance, measurementPreference: player.measurementPreference, productEvents: player.productEvents });
      }} />}
    </main>
  );
}

function AppHeader({ player, active, onNavigate, onHome }: { player: Player; active: DashboardTab; onNavigate: (tab: DashboardTab) => void; onHome: () => void; }) {
  return <header className="app-header"><button className="brand-button" onClick={onHome} aria-label="Return to RepQuest home"><Logo compact /></button><nav aria-label="Main navigation"><button aria-current={active === "learn" ? "page" : undefined} className={active === "learn" ? "active" : ""} onClick={() => onNavigate("learn")}><span aria-hidden="true">⌂</span><small>Learn</small></button><button aria-current={active === "progress" ? "page" : undefined} className={active === "progress" ? "active" : ""} onClick={() => onNavigate("progress")}><span aria-hidden="true">↗</span><small>Progress</small></button><button aria-current={active === "league" ? "page" : undefined} className={active === "league" ? "active" : ""} onClick={() => onNavigate("league")}><span aria-hidden="true">♛</span><small>League</small></button><button aria-current={active === "badges" ? "page" : undefined} className={active === "badges" ? "active" : ""} onClick={() => onNavigate("badges")}><span aria-hidden="true">★</span><small>Badges</small></button></nav><div className="header-stats"><button className="streak-pill" onClick={() => onNavigate("progress")} aria-label={`Open progress, ${player.streak} day streak`}><span aria-hidden="true">◆</span><strong>{player.streak}</strong><small>DAY STREAK</small></button><button className="xp-pill" onClick={() => onNavigate("league")} aria-label={`Open XP league, ${player.totalXp.toLocaleString()} XP`}><span>XP</span><strong>{player.totalXp.toLocaleString()}</strong></button>{/* Sound controls stay hidden until RepQuest has a complete audio experience. */}<button className="avatar-button" style={{ "--player-color": player.accentColor } as React.CSSProperties} onClick={() => onNavigate("profile")} aria-label={`Open ${player.profileName}'s profile`}><AvatarImage id={player.avatarMark} /></button></div></header>;
}

function DashboardLearn({ player, onChooseSport, onContinue }: { player: Player; onChooseSport: (sport: Sport) => void; onContinue: () => void }) {
  const started = SPORTS.find((sport) => sportProgressSummary(sport, player.ageBand, player.sports[sport.id]?.completedModules ?? []).started);
  return <div className="quest-home">
    <section className="quest-home-welcome"><div><span>YOUR NEXT GOOD REP</span><h1>What will you play?</h1><p>Five sports. Start from zero. Keep getting better.</p></div><AvatarImage id={player.avatarMark} /></section>
    {started && <button type="button" className="quest-home-resume" onClick={onContinue}><span>Keep going<strong>{started.name}</strong></span><b>Continue →</b></button>}
    <div className="quest-sport-library">{SPORTS.map((sport,index) => {
      const progress = sportProgressSummary(sport, player.ageBand, player.sports[sport.id]?.completedModules ?? []);
      return <button type="button" key={sport.id} className="quest-sport-choice" onClick={() => onChooseSport(sport)} style={{"--card-index":index} as React.CSSProperties} aria-label={`${progress.started ? "Continue" : "Start"} ${sport.name}`}><SportIcon sport={sport} /><span><strong>{sport.name}</strong><small>{progress.started ? `${progress.completedModules} lessons complete` : "New to you? Start here."}</small></span><b aria-hidden="true">→</b></button>;
    })}</div>
    <p className="quest-home-note">Learn a little. Try it. Come back stronger.</p>
  </div>;
}

function ProgressDashboard({ player, strongest, weakest, onChooseSport }: { player: Player; strongest: Array<{ sportId: string; conceptId: string; mastery: Mastery }>; weakest: Array<{ sportId: string; conceptId: string; mastery: Mastery }>; onChooseSport: (sport: Sport) => void }) {
  const started = SPORTS.filter((sport) => player.sports[sport.id]);
  const modules = Object.values(player.sports).reduce((sum, sport) => sum + sport.completedModules.length, 0);
  const attempts = Object.values(player.sports).flatMap((sport) => Object.values(sport.mastery));
  const accuracy = attempts.length ? Math.round((attempts.reduce((sum, item) => sum + item.correct, 0) / attempts.reduce((sum, item) => sum + item.attempts, 0)) * 100) : 0;
  const rank = playerRank(player.totalXp);
  const rankIndex = PLAYER_RANKS.findIndex((item) => item.name === rank.name);
  const nextRank = PLAYER_RANKS[rankIndex + 1];
  return <section className="dashboard-page"><div className="section-heading"><span>YOUR SEASON</span><h1>Look how far you’ve come.</h1><p>See your wins. Find your next skill.</p></div><div className="league-ladder"><div><span>YOUR SAFE LEAGUE</span><h2>{rank.name}</h2><p>Compete against milestones—not strangers. No public names, messages, or rankings.</p></div><div className="rank-track">{PLAYER_RANKS.map((item) => <div key={item.name} className={player.totalXp >= item.xp ? "reached" : ""}><i>{item.mark}</i><span>{item.name}</span><small>{item.xp} XP</small></div>)}</div>{nextRank && <strong>{nextRank.xp - player.totalXp} XP TO {nextRank.name.toUpperCase()}</strong>}</div><div className="big-stat-grid"><div><span>TOTAL XP</span><strong>{player.totalXp.toLocaleString()}</strong><small>Across {started.length} sports</small></div><div><span>MODULES</span><strong>{modules}</strong><small>Completed sessions</small></div><div><span>ACCURACY</span><strong>{accuracy}%</strong><small>All-time answers</small></div><div><span>STREAK</span><strong>{player.streak}</strong><small>Consecutive days</small></div></div><div className="progress-columns"><div className="progress-panel"><span>SPORTS IN PROGRESS</span>{started.length ? started.map((sport) => { const progress = player.sports[sport.id]; return <button key={sport.id} onClick={() => onChooseSport(sport)}><div className="sport-mark" style={{ "--sport-color": sport.color, "--sport-soft": sport.softColor } as React.CSSProperties}><SportIcon sport={sport} /></div><div><strong>{sport.name}</strong><small>{progress.xp} XP · {progress.completedModules.length} complete</small></div><span>→</span></button>; }) : <p>Choose a sport to begin your first path.</p>}</div><div className="mastery-panel"><div><span>STRONGEST CONCEPTS</span>{strongest.length ? strongest.map((item) => <p key={item.conceptId}><b>✓</b>{learningConceptLabel(item.conceptId,generalModulesForSport(SPORTS.find((sport) => sport.id === item.sportId) ?? SPORTS[0]))}<small>{masteryLabel(item.mastery)}</small></p>) : <p>Complete a module to reveal strengths.</p>}</div><div><span>FOCUS NEXT</span>{weakest.length ? weakest.map((item) => <p key={item.conceptId}><b>↗</b>{learningConceptLabel(item.conceptId,generalModulesForSport(SPORTS.find((sport) => sport.id === item.sportId) ?? SPORTS[0]))}<small>{masteryLabel(item.mastery)}</small></p>) : <p>No weak concepts recorded yet.</p>}</div></div></div>{player.recentActivity.length > 0 && <div className="recent-panel"><span>RECENT ACTIVITY</span>{player.recentActivity.map((item, index) => <div key={`${item.title}-${index}`}><strong>{item.title}</strong><p>{item.detail}</p><small>{item.date}</small></div>)}</div>}</section>;
}

type LeaderboardEntry = { rank: number; alias: string; avatarId: string; xp: number };

function LeaderboardDashboard({ player }: { player: Player }) {
  const isChild = player.accountKind === "child" || player.ageBand === "7-9" || player.ageBand === "10-12";
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "setup" | "error">(isChild ? "ready" : "loading");
  const nextRank = PLAYER_RANKS.find((rank) => rank.xp > player.totalXp);

  useEffect(() => {
    if (isChild) return;
    fetch("/api/leaderboard")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result: { entries?: LeaderboardEntry[]; status?: "ready" | "setup" }) => {
        setEntries(result.entries ?? []);
        setStatus(result.status ?? "ready");
      })
      .catch(() => setStatus("error"));
  }, [isChild]);

  return <section className="dashboard-page league-page">
    <div className="section-heading"><span>XP LEAGUE</span><h1>Climb by learning.</h1><p>XP rewards completed lessons and better reads. There are no messages, follower counts, or pay-to-win boosts.</p></div>
    <div className="league-safety-banner"><span>◆</span><div><strong>{isChild ? "PRIVATE YOUTH LEAGUE" : "ALIAS-ONLY PUBLIC LEAGUE"}</strong><p>{isChild ? "Players under 13 never appear on the public board. Your challenge is to beat your next personal milestone." : "Only opted-in players age 13+ can appear. The board shows an alias, avatar, and XP—never an email, age, or legal name."}</p></div></div>
    <div className="league-layout">
      <aside className="league-player-card" style={{ "--player-color": player.accentColor } as React.CSSProperties}><span>YOUR SCORE</span><AvatarImage id={player.avatarMark} /><strong>{player.totalXp.toLocaleString()}</strong><small>TOTAL XP</small><div><b style={{ width: `${nextRank ? Math.min(100, player.totalXp / nextRank.xp * 100) : 100}%` }} /></div><p>{nextRank ? `${nextRank.xp - player.totalXp} XP to ${nextRank.name}` : "Top milestone reached"}</p></aside>
      {isChild ? <div className="milestone-league"><span>YOUR PRIVATE CLIMB</span>{PLAYER_RANKS.map((rank, index) => <article key={rank.name} className={player.totalXp >= rank.xp ? "reached" : ""}><i>{player.totalXp >= rank.xp ? "✓" : index + 1}</i><div><strong>{rank.name}</strong><small>{rank.xp.toLocaleString()} XP</small></div><b>{player.totalXp >= rank.xp ? "CLEARED" : `${Math.max(0, rank.xp - player.totalXp)} TO GO`}</b></article>)}</div>
        : <div className="public-leaderboard"><div className="leaderboard-title"><span>TOP PLAYERS</span><small>Updates every few minutes</small></div>{status === "loading" && <p className="leaderboard-empty">Loading the league…</p>}{status === "setup" && <p className="leaderboard-empty">The public league is ready for the first opted-in account. Guest XP remains private.</p>}{status === "error" && <p className="leaderboard-empty">The league could not load right now. Your XP is still safe.</p>}{status === "ready" && entries.length === 0 && <p className="leaderboard-empty">No players have opted in yet. Be the first when secure accounts go live.</p>}{entries.map((entry) => <article key={`${entry.rank}-${entry.alias}`}><i>{entry.rank <= 3 ? ["★", "◆", "●"][entry.rank - 1] : entry.rank}</i><AvatarImage id={entry.avatarId} /><div><strong>{entry.alias}</strong><small>REPQUEST PLAYER</small></div><b>{entry.xp.toLocaleString()} XP</b></article>)}</div>}
    </div>
  </section>;
}

function BadgesDashboard({ player }: { player: Player }) {
  return <section className="dashboard-page"><div className="section-heading"><span>TROPHY ROOM</span><h1>Your trophy room.</h1><p>Keep learning to unlock your next reward.</p></div><div className="title-locker"><span>PLAYER TITLES</span><div>{PLAYER_RANKS.map((rank) => { const unlocked = player.totalXp >= rank.xp; return <article key={rank.name} className={unlocked ? "unlocked" : "locked"}><i>{unlocked ? rank.mark : "?"}</i><div><small>{unlocked ? "UNLOCKED" : `${rank.xp} XP`}</small><strong>{rank.name}</strong></div></article>; })}</div></div><div className="badge-grid">{BADGES.map((badge) => { const earned = player.badges.includes(badge.id); return <article className={earned ? "earned" : "locked"} key={badge.id}><div>{earned ? badge.mark : "?"}</div><span>{earned ? "EARNED" : "LOCKED"}</span><h2>{badge.name}</h2><p>{badge.description}</p></article>; })}</div></section>;
}

function ProfileDashboard({ player, onUpdateIdentity, onChangeAge, onMeasurementChange, onExport, onReset, onDelete }: {
  player: Player;
  onUpdateIdentity: (updates: Pick<Player, "profileName" | "avatarMark" | "accentColor">) => void;
  onChangeAge: () => void;
  onMeasurementChange: (preference: MeasurementPreference) => void;
  onExport: () => void;
  onReset: () => void;
  onDelete: () => void;
}) {
  const isChild = player.accountKind === "child" || player.ageBand === "7-9" || player.ageBand === "10-12";
  const [name, setName] = useState(isChild ? "Player" : player.profileName);
  const [avatarMark, setAvatarMark] = useState(player.avatarMark);
  const [accentColor, setAccentColor] = useState(player.accentColor);
  const rank = playerRank(player.totalXp);
  return <section className="dashboard-page"><div className="section-heading"><span>PLAYER PROFILE</span><h1>Make it your game.</h1><p>Choose your avatar. Keep building your story.</p></div><div className="profile-layout"><div className="profile-card" style={{ "--player-color": accentColor } as React.CSSProperties}><span className="player-card-rank">{rank.name}</span><div className="profile-avatar"><AvatarImage id={avatarMark} /></div><h2>{isChild ? "Player" : name || player.profileName}</h2><p>{player.totalXp.toLocaleString()} XP · {player.badges.length} badges · {Object.keys(player.sports).length} sports</p><div className="player-card-stripe"><span>{player.ageBand === "7-9" ? "6–9" : player.ageBand}</span><span>{rank.mark}</span><span>REPQUEST</span></div></div><form onSubmit={(event) => { event.preventDefault(); if (isChild || name.trim()) onUpdateIdentity({ profileName: isChild ? "Player" : name.trim(), avatarMark, accentColor }); }}>{!isChild && <><label htmlFor="profile-name">DISPLAY NAME</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} /></>}<span>AGE PATH</span><div className="profile-age-locked"><strong>{player.ageBand === "7-9" ? "6–9" : player.ageBand}</strong><span>Sets reading support. Knowledge grows as you play.</span><button type="button" onClick={onChangeAge}>Change age path</button></div><AvatarPicker value={avatarMark} onChange={setAvatarMark} /><span>TEAM COLOR</span><div className="color-options">{PLAYER_COLORS.map((color) => <button type="button" key={color} className={accentColor === color ? "active" : ""} style={{ background: color }} onClick={() => setAccentColor(color)} aria-label={`Choose team color ${color}`} aria-pressed={accentColor === color} />)}</div><button className="primary-button primary-button--small" type="submit">Save player card <span>→</span></button><hr /><span>PRIVACY CENTER</span><div className="privacy-center-panel"><strong>{isChild ? "PRIVATE CHILD PATH" : "LOCAL BETA PROFILE"}</strong><p>{isChild ? "No child email, legal name, public leaderboard entry, or product-improvement analytics are collected." : "Progress is stored on this device. Optional product measurement is off unless you choose it below."}</p><div className="integrity-note"><b>PROGRESS INTEGRITY</b><span>XP is awarded on the first completion only. Practice attempts improve mastery without farming XP.</span></div><div className="measurement-choice"><input id="product-measurement" type="checkbox" checked={!isChild && player.measurementPreference === "product-improvement"} disabled={isChild} onChange={(event) => onMeasurementChange(event.target.checked ? "product-improvement" : "essential-only")} /><label htmlFor="product-measurement"><b>Help improve RepQuest</b><small>{isChild ? "Unavailable for players under 13." : "Store coarse gameplay events for up to 30 days. No name, email, exact age, answer text, advertising ID, or device ID."}</small></label></div><div className="privacy-action-grid"><button type="button" onClick={onExport}>Export my data</button><a href="/privacy">Privacy Notice</a><a href="/terms">Terms of Use</a></div><small className="legal-version">Accepted privacy/terms versions: {player.legalAcceptance?.privacyVersion ?? "legacy local profile"} / {player.legalAcceptance?.termsVersion ?? "legacy local profile"}</small></div><button className="danger-button" type="button" onClick={onReset}>Reset learning progress</button><button className="danger-button danger-button--strong" type="button" onClick={onDelete}>Delete local profile</button></form></div></section>;
}
