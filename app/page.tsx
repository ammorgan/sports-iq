"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BADGES,
  arrangeChallengeOptions,
  buildPositionModule,
  generalModulesForSport,
  LEVELS,
  positionModuleId,
  SPORTS,
  type Challenge,
  type LearningModule,
  type Position,
  type Sport,
} from "./learning-data";
import { beginnerGuideFor } from "./beginner-guides";
import { sportClipFor } from "./sport-clips";
import { PrivacyGate, type AccountKind, type ConsentState } from "./privacy-gate";

const PLAYER_KEY = "sports-iq-learning-profile-v1";
const DAILY_GOAL = 100;

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
};
type SessionResult = { conceptId: string; correct: boolean; remediation: boolean };
type ModuleSummary = {
  module: LearningModule;
  xp: number;
  bonus: number;
  correct: number;
  total: number;
  mastered: string[];
  practice: string[];
  newBadges: string[];
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
  avatarMark: "avatar-01",
  accentColor: "#3b7f79",
  ageBand: "10-12",
  ageBandConfirmed: false,
  privacyGateComplete: false,
  accountKind: "guest",
  consentState: "not-required",
};

const AGE_BANDS: Array<{ value: AgeBand; label: string; title: string; note: string; seconds: number | null }> = [
  { value: "7-9", label: "AGES 7–9", title: "Play & Discover", note: "More visuals, fewer choices, and no timer.", seconds: null },
  { value: "10-12", label: "AGES 10–12", title: "Build the Basics", note: "Clear explanations and game-like decisions.", seconds: 60 },
  { value: "13-15", label: "AGES 13–15", title: "Read the Game", note: "Full scenarios, strategy, and position reads.", seconds: 45 },
  { value: "16-17", label: "AGES 16–17", title: "Compete & Lead", note: "Faster pacing and deeper tactical language.", seconds: 35 },
  { value: "18+", label: "AGES 18+", title: "Full Game IQ", note: "Complete detail for adults, athletes, and coaches.", seconds: 30 },
];

function timeLimitForAge(ageBand: AgeBand) {
  const band = AGE_BANDS.find((item) => item.value === ageBand);
  return band ? band.seconds : 35;
}

const AVATARS = [
  { id: "avatar-16", name: "Courage", src: "/avatars/avatar-16.png" },
  { id: "avatar-05", name: "Bravery", src: "/avatars/avatar-05.png" },
  { id: "avatar-20", name: "Grace", src: "/avatars/avatar-20.png" },
  { id: "avatar-01", name: "Confidence", src: "/avatars/avatar-01.png" },
  { id: "avatar-18", name: "Joy", src: "/avatars/avatar-18.png" },
  { id: "avatar-10", name: "Strength", src: "/avatars/avatar-10.png" },
  { id: "avatar-03", name: "Hope", src: "/avatars/avatar-03.png" },
  { id: "avatar-17", name: "Resilience", src: "/avatars/avatar-17.png" },
  { id: "avatar-08", name: "Kindness", src: "/avatars/avatar-08.png" },
  { id: "avatar-21", name: "Wisdom", src: "/avatars/avatar-21.png" },
  { id: "avatar-06", name: "Belief", src: "/avatars/avatar-06.png" },
  { id: "avatar-22", name: "Purpose", src: "/avatars/avatar-22.png" },
  { id: "avatar-11", name: "Creativity", src: "/avatars/avatar-11.png" },
  { id: "avatar-19", name: "Patience", src: "/avatars/avatar-19.png" },
  { id: "avatar-02", name: "Peace", src: "/avatars/avatar-02.png" },
  { id: "avatar-15", name: "Determination", src: "/avatars/avatar-15.png" },
  { id: "avatar-04", name: "Growth", src: "/avatars/avatar-04.png" },
  { id: "avatar-12", name: "Spirit", src: "/avatars/avatar-12.png" },
  { id: "avatar-07", name: "Leadership", src: "/avatars/avatar-07.png" },
  { id: "avatar-14", name: "Focus", src: "/avatars/avatar-14.png" },
  { id: "avatar-09", name: "Grit", src: "/avatars/avatar-09.png" },
  { id: "avatar-13", name: "Unity", src: "/avatars/avatar-13.png" },
] as const;
const PLAYER_COLORS = ["#3b7f79", "#b85f45", "#59739a", "#6b64a2", "#9a6c36", "#4b7a58"];
const PLAYER_RANKS = [
  { name: "Rookie Reader", xp: 0, mark: "01" },
  { name: "Game Scout", xp: 300, mark: "02" },
  { name: "Field General", xp: 800, mark: "03" },
  { name: "Sports Scholar", xp: 1600, mark: "04" },
  { name: "Arena Elite", xp: 3000, mark: "05" },
];

const SPORT_GLYPHS: Record<string, string> = {
  football: "🏈",
  "flag-football": "🚩",
  basketball: "🏀",
  soccer: "⚽",
  volleyball: "🏐",
  baseball: "⚾",
  softball: "🥎",
  hockey: "🏒",
  lacrosse: "🥍",
  rugby: "🏉",
  "field-hockey": "🏑",
  "water-polo": "🤽",
  cricket: "🏏",
  tennis: "🎾",
  "track-field": "🏃",
  swimming: "🏊",
  gymnastics: "🤸",
  pickleball: "🏓",
  badminton: "🏸",
  golf: "⛳",
  cycling: "🚴",
  mma: "🥊",
  wrestling: "🤼",
};

function Logo({ compact = false }: { compact?: boolean }) {
  return <span className={`logo ${compact ? "logo--compact" : ""}`} role="img" aria-label="RepQuest logo" />;
}

function SportIcon({ sport }: { sport: Sport }) {
  return <span className="sport-glyph" role="img" aria-label={`${sport.name} icon`}>{SPORT_GLYPHS[sport.id] ?? "🏅"}</span>;
}

function avatarFor(id: string) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
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

function SportTicker() {
  const tickerSports = [...SPORTS, ...SPORTS];
  return (
    <div className="sport-ticker" aria-label="Sports available to learn">
      <div className="sport-ticker-track">
        {tickerSports.map((sport, index) => (
          <span key={`${sport.id}-${index}`} aria-hidden={index >= SPORTS.length}>
            <b style={{ "--ticker-color": sport.color } as React.CSSProperties}><SportIcon sport={sport} /></b>
            {sport.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function SportMotionPreview({ sport }: { sport: Sport }) {
  const clip = sportClipFor(sport.id);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const start = clip?.startSeconds ?? 0;
  const end = start + (clip?.durationSeconds ?? 8);

  const beginClip = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = start;
    void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const toggleClip = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { video.pause(); setPlaying(false); }
  };

  return (
    <div className="sport-motion-preview" style={{ "--sport-color": sport.color, "--sport-soft": sport.softColor } as React.CSSProperties} aria-label={`${sport.name} game film preview`}>
      <div className="motion-preview-copy"><span>{clip ? `${clip.durationSeconds}-SECOND GAME CLIP` : "GAME FILM"}</span><strong>See how {sport.name} is played</strong><small>{clip ? clip.cue : `We are reviewing an accurate ${sport.name} clip before adding it here. RepQuest will never show the wrong sport just to fill the space.`}</small></div>
      {clip && !videoFailed ? <div className="sport-video-frame">
        <video
          ref={videoRef}
          src={clip.videoUrl}
          muted
          playsInline
          autoPlay
          preload="metadata"
          onLoadedMetadata={beginClip}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(event) => { if (event.currentTarget.currentTime >= end) beginClip(); }}
          onError={() => setVideoFailed(true)}
          aria-label={`${clip.durationSeconds}-second clip showing ${sport.name} in action`}
        />
        <button type="button" className="sport-video-control" onClick={toggleClip} aria-label={playing ? "Pause game clip" : "Play game clip"}>{playing ? "Ⅱ" : "▶"}</button>
      </div> : <div className="sport-video-placeholder" role="status"><SportIcon sport={sport} /><strong>{videoFailed ? "CLIP UNAVAILABLE" : "CLIP IN REVIEW"}</strong><small>{videoFailed ? "The video could not load. Try again when your connection is stronger." : "Accuracy comes before filling the space."}</small></div>}
      {clip && <a className="sport-video-credit" href={clip.sourceUrl} target="_blank" rel="noreferrer">Footage: {clip.sourceName}</a>}
    </div>
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
          setPlayer({ ...DEFAULT_PLAYER, ...parsed, profileName: isChildProfile ? "Player" : parsed.profileName, avatarMark });
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
    const mastery = player.sports[module.sportId]?.mastery ?? {};
    const effectiveAge = ageOverride ?? player.ageBand;
    const ageAppropriateChallenges = effectiveAge === "7-9"
      ? module.challenges.filter((challenge) => !["multi", "ordering"].includes(challenge.type)).slice(0, 4)
      : module.challenges;
    const prepared = ageAppropriateChallenges.map((challenge, index) => ({
      challenge: prepareChallenge(challenge, effectiveAge, index, module.id),
      index,
      score: mastery[challenge.conceptId]?.attempts
        ? mastery[challenge.conceptId].correct / mastery[challenge.conceptId].attempts
        : 1,
    })).sort((a, b) => a.score - b.score || a.index - b.index).map(({ challenge }) => challenge);

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
    setMissedConcepts([]);
    setRecoveredConcepts([]);
    setSummary(null);
    setPrimerIndex(0);
    const moduleSport = SPORTS.find((sport) => sport.id === module.sportId);
    const isFirstGeneralModule = module.pathway === "general" && moduleSport && moduleList(moduleSport)[0]?.id === module.id;
    setScreen(isFirstGeneralModule ? "primer" : "module");
  }, [player.sports, player.ageBand, prepareChallenge]);

  const checkAnswer = (answers: string[]) => {
    if (!currentChallenge || feedback) return;
    const expected = Array.isArray(currentChallenge.correct) ? currentChallenge.correct : [currentChallenge.correct];
    const correct = currentChallenge.type === "ordering"
      ? expected.every((value, index) => answers[index] === value)
      : expected.length === answers.length && expected.every((value) => answers.includes(value));
    const remediation = currentChallenge.id.includes("remediate");

    if (correct) {
      const streakBonus = Math.min(sessionStreak * 2, 10);
      setSessionXp((value) => value + currentChallenge.xp + streakBonus);
      setSessionStreak((value) => value + 1);
      if (missedConcepts.includes(currentChallenge.conceptId)) {
        setRecoveredConcepts((items) => items.includes(currentChallenge.conceptId) ? items : [...items, currentChallenge.conceptId]);
      }
    } else {
      setSessionMistakes((value) => value + 1);
      setSessionStreak(0);
      setMissedConcepts((items) => items.includes(currentChallenge.conceptId) ? items : [...items, currentChallenge.conceptId]);
      if (currentChallenge.remediation && !queue.some((item) => item.id === currentChallenge.remediation?.id)) {
        setQueue((items) => [...items, prepareChallenge(currentChallenge.remediation as Challenge)]);
      }
    }

    setSessionResults((items) => [...items, { conceptId: currentChallenge.conceptId, correct, remediation }]);
    setFeedback({ correct, answer: expected.join(" → ") });
  };

  const toggleAnswer = (answer: string) => {
    if (!currentChallenge || feedback) return;
    if (currentChallenge.type === "ordering") {
      setSelectedAnswers((items) => items.includes(answer) ? items : [...items, answer]);
      return;
    }
    if (currentChallenge.type === "multi") {
      setSelectedAnswers((items) => items.includes(answer) ? items.filter((item) => item !== answer) : [...items, answer]);
      return;
    }
    setSelectedAnswers([answer]);
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
    if (!activeModule) return;
    const perfectBonus = sessionMistakes === 0 ? 50 : 0;
    const completionBonus = 35;
    const bonus = perfectBonus + completionBonus;
    const totalEarned = sessionXp + bonus;
    const uniqueResults = new Map<string, SessionResult[]>();
    sessionResults.forEach((result) => uniqueResults.set(result.conceptId, [...(uniqueResults.get(result.conceptId) ?? []), result]));
    const mastered = [...uniqueResults.entries()].filter(([conceptId, results]) =>
      results.some((item) => item.correct) && (!missedConcepts.includes(conceptId) || recoveredConcepts.includes(conceptId)))
      .map(([conceptId]) => conceptId);
    const practice = [...new Set(missedConcepts.filter((concept) => !recoveredConcepts.includes(concept)))];
    const newBadgeIds: string[] = [];

    setPlayer((current) => {
      const priorSport = current.sports[activeModule.sportId] ?? emptySportProgress();
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
        totalXp: current.totalXp + totalEarned,
        streak: nextStreak,
        lastPlayed: today,
        dailyDate: today,
        dailyXp: baseDailyXp + totalEarned,
        badges: [...badges],
        sports: {
          ...current.sports,
          [activeModule.sportId]: {
            ...priorSport,
            xp: priorSport.xp + totalEarned,
            completedModules: completed,
            mastery: nextMastery,
          },
        },
        recentActivity: [
          { title: activeModule.title, detail: `+${totalEarned} XP · ${sessionResults.filter((item) => item.correct).length}/${sessionResults.length} correct`, date: today },
          ...current.recentActivity,
        ].slice(0, 6),
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
    });
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
  const positionsUnlocked = currentSportModules.every((learningModule) =>
    sportProgress.completedModules.includes(learningModule.id));

  const nextModule = currentSportModules.find(
    (learningModule) => !sportProgress.completedModules.includes(learningModule.id),
  ) ?? currentSportModules[0];

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
    return <PrivacyGate onContinue={({ ageBand, accountKind, consentState }) => {
      setAgeChoice(ageBand);
      setPlayer((current) => ({
        ...current,
        profileName: current.profileName || "Player",
        ageBand,
        ageBandConfirmed: true,
        privacyGateComplete: true,
        accountKind,
        consentState,
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
            <div><span>WANT TO PLAY FIRST?</span><strong>{timeLimitForAge(ageChoice) === null ? "Jump into a relaxed sports challenge—no timer." : `Jump into a ${timeLimitForAge(ageChoice)}-second sports challenge.`}</strong></div>
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
    const guide = beginnerGuideFor(activeModule.sportId);
    const lesson = guide?.lessons[primerIndex];
    if (guide && lesson) {
      const isLast = primerIndex === guide.lessons.length - 1;
      return (
        <main className={`primer-shell ${player.darkMode ? "dark" : ""}`} style={{ "--sport-color": selectedSport.color, "--sport-soft": selectedSport.softColor } as React.CSSProperties}>
          <header className="primer-header">
            <button className="lesson-exit-button" onClick={() => setScreen("sport")}><span>←</span> Back to path</button>
            <Logo compact />
            <span>{primerIndex + 1} / {guide.lessons.length}</span>
          </header>
          <section className="primer-stage">
            <div className="primer-progress" aria-label={`Beginner lesson ${primerIndex + 1} of ${guide.lessons.length}`}>
              {guide.lessons.map((_, index) => <i key={index} className={index <= primerIndex ? "active" : ""} />)}
            </div>
            <div className="primer-card">
              <div className="primer-sport-mark" aria-hidden="true"><SportIcon sport={selectedSport} /></div>
              <div className="primer-copy">
                <span>{lesson.eyebrow}</span>
                <small>{selectedSport.name} · Beginner playbook</small>
                <h1>{lesson.title}</h1>
                <p>{lesson.body}</p>
                {lesson.terms && <div className="primer-terms">{lesson.terms.map((item) => <article key={item.term}><strong>{item.term}</strong><span>{item.meaning}</span></article>)}</div>}
              </div>
              <div className="primer-coach">
                <AvatarImage id="avatar-12" />
                <p><strong>{primerIndex === 0 ? "START HERE" : isLast ? "READY FOR A REP" : "YOU’VE GOT THIS"}</strong>{primerIndex === 0 ? guide.welcome : isLast ? "The quiz checks what this playbook just taught. It is always okay to learn from a miss." : "Take your time. The words will make more sense each time you see the sport."}</p>
              </div>
            </div>
            <div className="primer-actions">
              {primerIndex > 0 && <button className="text-button" onClick={() => setPrimerIndex((index) => index - 1)}>← Previous</button>}
              <button className="primary-button" onClick={() => isLast ? setScreen("module") : setPrimerIndex((index) => index + 1)}>{isLast ? "Try the quick check" : "Keep learning"}<span>→</span></button>
            </div>
          </section>
        </main>
      );
    }
  }

  if (screen === "module" && activeModule && currentChallenge) {
    const progress = ((challengeIndex + (feedback ? 1 : 0)) / queue.length) * 100;
    const isCheckable = currentChallenge.type === "multi"
      ? selectedAnswers.length > 0
      : currentChallenge.type === "ordering" ? selectedAnswers.length === currentChallenge.options.length : selectedAnswers.length === 1;
    const answerInstruction = currentChallenge.type === "multi"
      ? "Choose every answer that fits, then check your answer."
      : currentChallenge.type === "ordering"
        ? "Choose each answer in the right order, then check your answer."
        : "Choose one answer, then check your answer.";
    const exitModule = () => {
      const hasSessionWork = challengeIndex > 0 || !!feedback || selectedAnswers.length > 0;
      if (!hasSessionWork || window.confirm("Leave this lesson? Your answers in this session won’t be saved.")) setScreen("sport");
    };
    return (
      <main className={`lesson-shell ${player.ageBand === "7-9" ? "lesson-shell--young" : ""} ${player.darkMode ? "dark" : ""}`}>
        <header className="lesson-header">
          <button className="lesson-exit-button" onClick={exitModule}><span>←</span> Exit lesson</button>
          <div className="lesson-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="lesson-counters"><span>XP <strong>{sessionXp}</strong></span><span>STREAK <strong>{sessionStreak}×</strong></span><span>MISTAKES <strong>{sessionMistakes}</strong></span></div>
        </header>
        <section className="challenge-stage">
          {feedback?.correct && <div className="xp-burst" key={`xp-${challengeIndex}`}>+{currentChallenge.xp + Math.min(Math.max(0, sessionStreak - 1) * 2, 10)} XP</div>}
          <div className="challenge-heading">
            <div><span>{currentChallenge.label}</span><small>{activeModule.title} · {challengeIndex + 1} of {queue.length}</small></div>
            <div className="challenge-tools"><RoundClock key={currentChallenge.id} duration={timeLimitForAge(player.ageBand)} paused={!!feedback} onExpire={() => checkAnswer([])} />{sessionStreak >= 2 && <strong className="combo-chip">{sessionStreak}× COMBO</strong>}<button className="hint-button" onClick={() => setHintVisible((visible) => !visible)} aria-expanded={hintVisible} aria-controls="challenge-hint">{hintVisible ? "Hide hint" : "Need a hint?"}</button></div>
          </div>
          {hintVisible && <div className="hint-panel" id="challenge-hint" role="note"><strong>COACH’S TIP</strong><span>{currentChallenge.hint ?? "Look for the option that best supports the team’s immediate objective."}</span></div>}
          <h1>{currentChallenge.prompt}</h1>

          {(player.ageBand === "7-9" || currentChallenge.type === "hotspot" || currentChallenge.type === "scenario") && <div className="play-visual" aria-label={`Animated ${activeModule.sportId} game situation`}><span>READ THE SPACE</span><div className="play-zone">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}<b /></div><small>Watch the movement, then make the call.</small></div>}

          <p className="answer-instruction" id="answer-instruction">{answerInstruction}</p>
          <div className={`challenge-options challenge-options--${currentChallenge.type}`} role="group" aria-label="Answer choices" aria-describedby="answer-instruction">
            {currentChallenge.options.map((option, index) => {
              const selected = selectedAnswers.includes(option);
              const expected = Array.isArray(currentChallenge.correct) ? currentChallenge.correct : [currentChallenge.correct];
              const revealCorrect = feedback && expected.includes(option);
              const revealWrong = feedback && selected && !expected.includes(option);
              return (
                <button key={option} className={`${selected ? "selected" : ""} ${revealCorrect ? "correct" : ""} ${revealWrong ? "wrong" : ""}`} onClick={() => toggleAnswer(option)} disabled={!!feedback}>
                  <span>{currentChallenge.type === "ordering" ? selected ? selectedAnswers.indexOf(option) + 1 : "·" : String.fromCharCode(65 + index)}</span><strong>{option}</strong>{revealCorrect && <i>✓</i>}{revealWrong && <i>×</i>}
                </button>
              );
            })}
          </div>

          {!feedback && (
            <div className="check-row">
              {currentChallenge.type === "ordering" && <button className="text-button" onClick={() => setSelectedAnswers([])}>Reset order</button>}
              <button className="primary-button primary-button--small" disabled={!isCheckable} onClick={() => checkAnswer(selectedAnswers)}>Check my answer <span>→</span></button>
            </div>
          )}

          {feedback && (
            <div ref={feedbackRef} className={`feedback-card ${feedback.correct ? "feedback-card--correct" : "feedback-card--wrong"}`} role="status" aria-live="polite">
              {feedback.correct && <div className="feedback-sparks" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>}
              <div className="feedback-mark">{feedback.correct ? "✓" : "↗"}</div>
              <div><span>{feedback.correct ? missedConcepts.includes(currentChallenge.conceptId) ? "CONCEPT RECOVERED" : "THAT’S THE RIGHT CALL" : "LET’S READ IT AGAIN"}</span><p>{currentChallenge.explanation}</p>{!feedback.correct && <small>Correct answer: {feedback.answer}</small>}</div>
              <button className="next-button" onClick={nextChallenge}>{challengeIndex === queue.length - 1 ? "Finish module" : "Continue"}<span>→</span></button>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (screen === "results" && summary) {
    const accuracy = Math.round((summary.correct / Math.max(1, summary.total)) * 100);
    return (
      <main className={`results-shell ${player.darkMode ? "dark" : ""}`}>
        <section className="module-complete-card">
          <div className="result-celebration" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} />)}</div>
          <div className="result-player" style={{ "--player-color": player.accentColor } as React.CSSProperties}><AvatarImage id={player.avatarMark} /></div>
          <Logo compact />
          <span className="eyebrow">MODULE COMPLETE</span>
          <h1>YOU’RE SEEING<br /><em>THE FIELD BETTER.</em></h1>
          <div className="xp-award"><span>XP EARNED</span><strong>+{summary.xp}</strong><small>Includes +{summary.bonus} completion bonus</small></div>
          <div className="result-stats"><div><strong>{summary.correct}/{summary.total}</strong><span>CORRECT</span></div><div><strong>{accuracy}%</strong><span>ACCURACY</span></div><div><strong>{player.streak}</strong><span>DAY STREAK</span></div></div>
          <div className="concept-results">
            <div><span>MASTERED</span>{summary.mastered.length ? summary.mastered.map((concept) => <p key={concept}>✓ {concept.replaceAll("-", " ")}</p>) : <p>Keep building reps</p>}</div>
            <div><span>NEEDS PRACTICE</span>{summary.practice.length ? summary.practice.map((concept) => <p key={concept}>• {concept.replaceAll("-", " ")}</p>) : <p>Nothing right now—great read.</p>}</div>
          </div>
          {summary.newBadges.length > 0 && <div className="badge-unlock"><span>BADGE UNLOCKED</span><strong>{BADGES.find((badge) => badge.id === summary.newBadges[0])?.name}</strong></div>}
          <button className="primary-button" onClick={() => setScreen("sport")}>Continue {summary.module.position ?? selectedSport.name} path <span>→</span></button>
          <button className="text-button" onClick={() => setScreen("dashboard")}>Choose another sport</button>
        </section>
      </main>
    );
  }

  if (screen === "sport") {
    const groupedPositions = selectedSport.positions.reduce<Record<string, Position[]>>((groups, position) => {
      groups[position.group] = [...(groups[position.group] ?? []), position];
      return groups;
    }, {});
    const selectedPositionModule = selectedPosition ? buildPositionModule(selectedSport, selectedPosition) : null;
    const totalModules = currentSportModules.length + selectedSport.positions.length;
    const progressPercent = Math.min(100, Math.round((sportProgress.completedModules.length / totalModules) * 100));

    return (
      <main className={`sport-shell ${player.darkMode ? "dark" : ""}`} style={{ "--sport-color": selectedSport.color, "--sport-soft": selectedSport.softColor } as React.CSSProperties}>
        <AppHeader player={player} active="learn" onNavigate={(tab) => { setDashboardTab(tab); setScreen("dashboard"); }} onHome={navigateHome} onToggleTheme={() => setPlayer((current) => ({ ...current, darkMode: !current.darkMode }))} />
        <section className="sport-hero" style={{ "--sport-color": selectedSport.color, "--sport-soft": selectedSport.softColor } as React.CSSProperties}>
          <button className="back-link" onClick={navigateHome}>← All sports</button>
          <div className="sport-title-row"><div className="sport-mark sport-mark--xl"><SportIcon sport={selectedSport} /></div><div><span>YOUR SPORT ARENA</span><h1>{selectedSport.name}</h1><p>{selectedSport.pathNote ?? "Learn the rules, positions, and game decisions that matter."}</p></div></div>
          <button className="primary-button sport-start-button" onClick={() => startModule(nextModule)}>{sportProgress.completedModules.includes(nextModule.id) ? "Practice fundamentals" : `Start here · ${nextModule.title}`} <span>→</span></button>
          <SportMotionPreview key={selectedSport.id} sport={selectedSport} />
          <div className="sport-summary"><div><strong>{progressPercent}%</strong><span>SPORT PROGRESS</span></div><div><strong>{sportProgress.xp}</strong><span>XP EARNED</span></div><div><strong>{LEVELS[Math.min(5, Math.floor(sportProgress.completedModules.length / 3))]}</strong><span>CURRENT LEVEL</span></div></div>
        </section>
        <section className="path-content">
          <div className="path-tabs"><button className={pathway === "general" ? "active" : ""} onClick={() => { setPathway("general"); setSelectedPosition(null); }}>General Sport IQ <span>{Math.round((sportProgress.completedModules.filter((id) => currentSportModules.some((module) => module.id === id)).length / currentSportModules.length) * 100)}%</span></button><button className={pathway === "position" ? "active" : ""} onClick={() => setPathway("position")}>Position IQ <span>{positionsUnlocked ? "OPEN" : "LOCKED"}</span></button></div>

          {pathway === "general" ? (
            <div className="map-layout">
              <div className="learning-map">
                <div className="map-heading"><span>YOUR PATH</span><h2>Fundamentals</h2></div>
                {currentSportModules.map((module, index) => {
                  const complete = sportProgress.completedModules.includes(module.id);
                  const previousComplete = index === 0 || sportProgress.completedModules.includes(currentSportModules[index - 1].id);
                  const unlocked = previousComplete;
                  return <div className="map-node-wrap" key={module.id}><div className={`map-line ${complete ? "complete" : ""}`} />
                    <button className={`map-node ${complete ? "complete" : ""} ${!unlocked ? "locked" : ""} ${nextModule?.id === module.id ? "current" : ""}`} onClick={() => unlocked && startModule(module)} disabled={!unlocked}>
                      <span>{complete ? "✓" : !unlocked ? "·" : index + 1}</span><div><small>{module.level === 0 ? "FUNDAMENTALS" : `LEVEL ${module.level} · ${LEVELS[module.level - 1]}`}</small><strong>{module.title}</strong><p>{module.description}</p></div><em>{complete ? "+ DONE" : `${module.estimatedMinutes} MIN`}</em>
                    </button>
                  </div>;
                })}
                {selectedSport.id === "football" && <><div className="map-node-wrap"><div className="map-line" /><div className="map-node locked"><span>·</span><div><small>LEVEL 2 · STARTER</small><strong>Situational Football</strong><p>Personnel, formations, common penalties, and simple strategy.</p></div><em>LOCKED</em></div></div><div className="map-node-wrap"><div className="map-line" /><div className="map-node locked"><span>·</span><div><small>LEVEL 3 · PLAYMAKER</small><strong>Reads & Adjustments</strong><p>Coverage recognition, matchup concepts, and assignments.</p></div><em>LOCKED</em></div></div></>}
              </div>
              <aside className="path-sidebar"><span>NEXT UP</span><h3>{nextModule?.title ?? "Position IQ"}</h3><p>{nextModule?.description ?? "Choose a position and begin a focused learning path."}</p>{nextModule && <button className="primary-button primary-button--small" onClick={() => startModule(nextModule)}>Continue learning <span>→</span></button>}<div className="goal-mini"><div><strong>{Math.min(player.dailyXp, DAILY_GOAL)}/{DAILY_GOAL}</strong><span>DAILY XP</span></div><i><b style={{ width: `${Math.min(100, player.dailyXp)}%` }} /></i></div></aside>
            </div>
          ) : !positionsUnlocked ? (
            <div className="locked-path"><span>POSITION IQ</span><h2>Meet the game first.</h2><p>Finish the beginner path—including Meet the Positions—before choosing a specialized role.</p><button className="primary-button" onClick={() => { setPathway("general"); startModule(nextModule); }}>Continue beginner path <span>→</span></button></div>
          ) : selectedPosition && selectedPositionModule ? (
            <div className="position-detail"><button className="back-link" onClick={() => setSelectedPosition(null)}>← All positions</button><div className="position-hero"><span>{selectedPosition.group}</span><h2>{selectedPosition.name} IQ</h2><p>Learn to {selectedPosition.focus} through reads, responsibilities, and decisions.</p></div><div className="position-module-card"><div><small>LEVEL 1 · ROOKIE</small><strong>{selectedPositionModule.title}</strong><p>{selectedPositionModule.description}</p><span>{selectedPositionModule.challenges.length} interactions · {selectedPositionModule.estimatedMinutes} min</span></div><button className="primary-button primary-button--small" onClick={() => startModule(selectedPositionModule)}>{sportProgress.completedModules.includes(selectedPositionModule.id) ? "Practice again" : "Start module"}<span>→</span></button></div><div className="future-modules"><div><span>02</span><strong>Situational Responsibilities</strong><small>STARTER · LOCKED</small></div><div><span>03</span><strong>Reads & Adjustments</strong><small>PLAYMAKER · LOCKED</small></div><div><span>04</span><strong>Position Mastery</strong><small>ALL-STAR · LOCKED</small></div></div></div>
          ) : (
            <div className="positions-grid-section"><div className="section-heading"><span>CHOOSE YOUR ROOM</span><h2>Position IQ pathways</h2><p>Every major role has its own reads, responsibilities, and progression.</p></div>{Object.entries(groupedPositions).map(([group, positions]) => <div className="position-group" key={group}><h3>{group}</h3><div>{positions.map((position) => { const done = sportProgress.completedModules.includes(positionModuleId(selectedSport.id, position.name)); return <button key={position.name} onClick={() => setSelectedPosition(position)}><span>{done ? "✓" : position.name.slice(0, 2).toUpperCase()}</span><strong>{position.name}</strong><small>{done ? "MODULE COMPLETE" : "VIEW PATH"}</small></button>; })}</div></div>)}</div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className={`dashboard-shell ${player.darkMode ? "dark" : ""}`}>
      <AppHeader player={player} active={dashboardTab} onNavigate={setDashboardTab} onHome={navigateHome} onToggleTheme={() => setPlayer((current) => ({ ...current, darkMode: !current.darkMode }))} />
      {dashboardTab === "learn" && <DashboardLearn player={player} onChooseSport={chooseSport} onContinue={() => {
        const started = SPORTS.find((sport) => player.sports[sport.id]) ?? SPORTS[0]; chooseSport(started);
      }} />}
      {dashboardTab === "progress" && <ProgressDashboard player={player} strongest={strongest} weakest={weakest} onChooseSport={chooseSport} />}
      {dashboardTab === "league" && <LeaderboardDashboard player={player} />}
      {dashboardTab === "badges" && <BadgesDashboard player={player} />}
      {dashboardTab === "profile" && <ProfileDashboard player={player} onUpdateIdentity={(updates) => setPlayer((current) => ({ ...current, ...updates, ageBandConfirmed: true }))} onChangeAge={() => {
        setAgeChoice(player.ageBand);
        setPlayer((current) => ({ ...current, ageBandConfirmed: false }));
      }} onReset={() => {
        if (window.confirm("Reset all RepQuest progress saved on this device? This cannot be undone.")) setPlayer({ ...DEFAULT_PLAYER, profileName: player.profileName, darkMode: player.darkMode, avatarMark: player.avatarMark, accentColor: player.accentColor, ageBand: player.ageBand, ageBandConfirmed: true, privacyGateComplete: true, accountKind: player.accountKind, consentState: player.consentState });
      }} />}
    </main>
  );
}

function AppHeader({ player, active, onNavigate, onHome, onToggleTheme }: { player: Player; active: DashboardTab; onNavigate: (tab: DashboardTab) => void; onHome: () => void; onToggleTheme: () => void }) {
  return <header className="app-header"><button className="brand-button" onClick={onHome} aria-label="Return to RepQuest home"><Logo compact /></button><nav aria-label="Main navigation"><button className={active === "learn" ? "active" : ""} onClick={() => onNavigate("learn")}><span aria-hidden="true">⌂</span><small>Learn</small></button><button className={active === "progress" ? "active" : ""} onClick={() => onNavigate("progress")}><span aria-hidden="true">↗</span><small>Progress</small></button><button className={active === "league" ? "active" : ""} onClick={() => onNavigate("league")}><span aria-hidden="true">♛</span><small>League</small></button><button className={active === "badges" ? "active" : ""} onClick={() => onNavigate("badges")}><span aria-hidden="true">★</span><small>Badges</small></button></nav><div className="header-stats"><button className="streak-pill" onClick={() => onNavigate("progress")}><span>◆</span><strong>{player.streak}</strong><small>DAY STREAK</small></button><button className="xp-pill" onClick={() => onNavigate("league")} aria-label={`Open XP league, ${player.totalXp.toLocaleString()} XP`}><span>XP</span><strong>{player.totalXp.toLocaleString()}</strong></button>{/* Sound controls stay hidden until RepQuest has a complete audio experience. */}<button className="theme-button" onClick={onToggleTheme} aria-label="Toggle dark mode">{player.darkMode ? "☀" : "◐"}</button><button className="avatar-button" style={{ "--player-color": player.accentColor } as React.CSSProperties} onClick={() => onNavigate("profile")} aria-label={`Open ${player.profileName}'s profile`}><AvatarImage id={player.avatarMark} /></button></div></header>;
}

function DashboardLearn({ player, onChooseSport, onContinue }: { player: Player; onChooseSport: (sport: Sport) => void; onContinue: () => void }) {
  const startedSports = SPORTS.filter((sport) => player.sports[sport.id]);
  const continueSport = [...startedSports].sort((a, b) => (player.sports[b.id]?.xp ?? 0) - (player.sports[a.id]?.xp ?? 0))[0];
  const dailyPercent = Math.min(100, (player.dailyXp / DAILY_GOAL) * 100);
  const spotlightSport = SPORTS[new Date().getDate() % SPORTS.length];
  const agePath = AGE_BANDS.find((band) => band.value === player.ageBand) ?? AGE_BANDS[1];
  return <>
    <section className="mobile-game-guide" aria-label="Choose a sport">
      <div><span>HI, {player.profileName.toUpperCase()} · AGES {player.ageBand}</span><h1>PICK A SPORT</h1><p><b>1</b> TAP TO START</p></div>
      <div className="mobile-guide-player"><AvatarImage id={player.avatarMark} /></div>
    </section>
    <section className="dashboard-hero"><div><span className="eyebrow"><i /> {agePath.title.toUpperCase()} PATH · {agePath.label}</span><h1>GOOD TO SEE YOU,<br /><em>{player.profileName.toUpperCase()}.</em></h1><p>{continueSport ? "Your next sports mission is ready. Make the reads, earn the XP, and keep building real game IQ." : "Choose your first arena and start making game decisions in under a minute."}</p><div className="hero-chips"><span>QUICK SESSIONS</span><span>REAL GAME READS</span><span>{SPORTS.length} SPORTS</span></div></div><aside className="daily-card"><div className="hero-player" style={{ "--player-color": player.accentColor } as React.CSSProperties}><AvatarImage id={player.avatarMark} /><span>GAME READY</span></div><div><span>TODAY’S MISSION</span><strong>{Math.min(player.dailyXp, DAILY_GOAL)} <small>/ {DAILY_GOAL} XP</small></strong><i><b style={{ width: `${dailyPercent}%` }} /></i><p>{dailyPercent >= 100 ? "Mission complete. You showed up and leveled up." : `${DAILY_GOAL - Math.min(player.dailyXp, DAILY_GOAL)} XP to keep your streak moving.`}</p></div><div className="daily-ring" style={{ "--daily-progress": `${dailyPercent}%` } as React.CSSProperties}>{Math.round(dailyPercent)}%</div></aside></section>
    <SportTicker />
    <section className="daily-spotlight" style={{ "--sport-color": spotlightSport.color, "--sport-soft": spotlightSport.softColor } as React.CSSProperties}><div className="spotlight-orbit" aria-hidden="true"><i /><i /><i /></div><div className="sport-mark"><SportIcon sport={spotlightSport} /></div><div><span>DAILY SPORT SPOTLIGHT</span><h2>Can you make the call in {spotlightSport.name}?</h2><p>A quick mission built for your {agePath.title} path.</p></div><button className="primary-button primary-button--small" onClick={() => onChooseSport(spotlightSport)}>Enter mission <span>→</span></button></section>
    {continueSport && <section className="continue-card" style={{ "--sport-color": continueSport.color, "--sport-soft": continueSport.softColor } as React.CSSProperties}><div className="sport-mark"><SportIcon sport={continueSport} /></div><div><span>CONTINUE LEARNING</span><h2>{continueSport.name}</h2><p>{player.sports[continueSport.id].completedModules.length ? "Your next lesson is ready." : "Your personalized path is ready to begin."}</p></div><div className="continue-progress"><strong>{player.sports[continueSport.id].xp} XP</strong><i><b style={{ width: `${Math.min(100, player.sports[continueSport.id].completedModules.length * 18)}%` }} /></i></div><button className="primary-button primary-button--small" onClick={onContinue}>Continue <span>→</span></button></section>}
    <section className="sports-hub"><div className="section-heading"><span>CHOOSE YOUR ARENA</span><h2>{startedSports.length ? "Keep learning—or add a new sport." : "Which game do you want to unlock?"}</h2><p>Explore rules, positions, and strategy. Every sport keeps its own level and progress.</p></div><div className="sport-card-grid">{SPORTS.map((sport, index) => { const progress = player.sports[sport.id]; const started = !!progress; const moduleCount = moduleList(sport).length + sport.positions.length; const percent = started ? Math.min(100, Math.round((progress.completedModules.length / moduleCount) * 100)) : 0; return <article className="sport-card" key={sport.id} style={{ "--sport-color": sport.color, "--sport-soft": sport.softColor, "--card-index": index } as React.CSSProperties}><div className="sport-card-top"><div className="sport-mark"><SportIcon sport={sport} /></div><span>{started ? `${percent}%` : "NEW"}</span></div><h3>{sport.name}</h3><p>{sport.variants.slice(0, 3).join(" · ")}</p><div className="sport-card-progress"><i><b style={{ width: `${percent}%` }} /></i><span>{started ? `${progress.xp} XP · ${progress.completedModules.length} modules` : `${sport.positions.length} position paths`}</span></div><button onClick={() => onChooseSport(sport)}>{started ? "Continue path" : "Enter arena"}<span>→</span></button></article>; })}</div></section>
  </>;
}

function ProgressDashboard({ player, strongest, weakest, onChooseSport }: { player: Player; strongest: Array<{ sportId: string; conceptId: string; mastery: Mastery }>; weakest: Array<{ sportId: string; conceptId: string; mastery: Mastery }>; onChooseSport: (sport: Sport) => void }) {
  const started = SPORTS.filter((sport) => player.sports[sport.id]);
  const modules = Object.values(player.sports).reduce((sum, sport) => sum + sport.completedModules.length, 0);
  const attempts = Object.values(player.sports).flatMap((sport) => Object.values(sport.mastery));
  const accuracy = attempts.length ? Math.round((attempts.reduce((sum, item) => sum + item.correct, 0) / attempts.reduce((sum, item) => sum + item.attempts, 0)) * 100) : 0;
  const rank = playerRank(player.totalXp);
  const rankIndex = PLAYER_RANKS.findIndex((item) => item.name === rank.name);
  const nextRank = PLAYER_RANKS[rankIndex + 1];
  return <section className="dashboard-page"><div className="section-heading"><span>YOUR SEASON</span><h1>Progress that means something.</h1><p>Mastery reflects what you understand—not how fast you clicked through.</p></div><div className="league-ladder"><div><span>YOUR SAFE LEAGUE</span><h2>{rank.name}</h2><p>Compete against milestones—not strangers. No public names, messages, or rankings.</p></div><div className="rank-track">{PLAYER_RANKS.map((item) => <div key={item.name} className={player.totalXp >= item.xp ? "reached" : ""}><i>{item.mark}</i><span>{item.name}</span><small>{item.xp} XP</small></div>)}</div>{nextRank && <strong>{nextRank.xp - player.totalXp} XP TO {nextRank.name.toUpperCase()}</strong>}</div><div className="big-stat-grid"><div><span>TOTAL XP</span><strong>{player.totalXp.toLocaleString()}</strong><small>Across {started.length} sports</small></div><div><span>MODULES</span><strong>{modules}</strong><small>Completed sessions</small></div><div><span>ACCURACY</span><strong>{accuracy}%</strong><small>All-time answers</small></div><div><span>STREAK</span><strong>{player.streak}</strong><small>Consecutive days</small></div></div><div className="progress-columns"><div className="progress-panel"><span>SPORTS IN PROGRESS</span>{started.length ? started.map((sport) => { const progress = player.sports[sport.id]; return <button key={sport.id} onClick={() => onChooseSport(sport)}><div className="sport-mark" style={{ "--sport-color": sport.color, "--sport-soft": sport.softColor } as React.CSSProperties}><SportIcon sport={sport} /></div><div><strong>{sport.name}</strong><small>{progress.xp} XP · {progress.completedModules.length} complete</small></div><span>→</span></button>; }) : <p>Choose a sport to begin your first path.</p>}</div><div className="mastery-panel"><div><span>STRONGEST CONCEPTS</span>{strongest.length ? strongest.map((item) => <p key={item.conceptId}><b>✓</b>{item.conceptId.replaceAll("-", " ")}<small>{masteryLabel(item.mastery)}</small></p>) : <p>Complete a module to reveal strengths.</p>}</div><div><span>FOCUS NEXT</span>{weakest.length ? weakest.map((item) => <p key={item.conceptId}><b>↗</b>{item.conceptId.replaceAll("-", " ")}<small>{masteryLabel(item.mastery)}</small></p>) : <p>No weak concepts recorded yet.</p>}</div></div></div>{player.recentActivity.length > 0 && <div className="recent-panel"><span>RECENT ACTIVITY</span>{player.recentActivity.map((item, index) => <div key={`${item.title}-${index}`}><strong>{item.title}</strong><p>{item.detail}</p><small>{item.date}</small></div>)}</div>}</section>;
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
  return <section className="dashboard-page"><div className="section-heading"><span>TROPHY ROOM</span><h1>Earned through real progress.</h1><p>Badges and player titles unlock as your sports knowledge grows.</p></div><div className="title-locker"><span>PLAYER TITLES</span><div>{PLAYER_RANKS.map((rank) => { const unlocked = player.totalXp >= rank.xp; return <article key={rank.name} className={unlocked ? "unlocked" : "locked"}><i>{unlocked ? rank.mark : "?"}</i><div><small>{unlocked ? "UNLOCKED" : `${rank.xp} XP`}</small><strong>{rank.name}</strong></div></article>; })}</div></div><div className="badge-grid">{BADGES.map((badge) => { const earned = player.badges.includes(badge.id); return <article className={earned ? "earned" : "locked"} key={badge.id}><div>{earned ? badge.mark : "?"}</div><span>{earned ? "EARNED" : "LOCKED"}</span><h2>{badge.name}</h2><p>{badge.description}</p></article>; })}</div></section>;
}

function ProfileDashboard({ player, onUpdateIdentity, onChangeAge, onReset }: { player: Player; onUpdateIdentity: (updates: Pick<Player, "profileName" | "avatarMark" | "accentColor">) => void; onChangeAge: () => void; onReset: () => void }) {
  const isChild = player.accountKind === "child" || player.ageBand === "7-9" || player.ageBand === "10-12";
  const [name, setName] = useState(isChild ? "Player" : player.profileName);
  const [avatarMark, setAvatarMark] = useState(player.avatarMark);
  const [accentColor, setAccentColor] = useState(player.accentColor);
  const rank = playerRank(player.totalXp);
  return <section className="dashboard-page"><div className="section-heading"><span>PLAYER PROFILE</span><h1>Your RepQuest identity.</h1><p>Make the playbook yours. Your age path changes pacing and presentation—not what sports you can explore.</p></div><div className="profile-layout"><div className="profile-card" style={{ "--player-color": accentColor } as React.CSSProperties}><span className="player-card-rank">{rank.name}</span><div className="profile-avatar"><AvatarImage id={avatarMark} /></div><h2>{isChild ? "Player" : name || player.profileName}</h2><p>{player.totalXp.toLocaleString()} XP · {player.badges.length} badges · {Object.keys(player.sports).length} sports</p><div className="player-card-stripe"><span>{player.ageBand}</span><span>{rank.mark}</span><span>REPQUEST</span></div></div><form onSubmit={(event) => { event.preventDefault(); if (isChild || name.trim()) onUpdateIdentity({ profileName: isChild ? "Player" : name.trim(), avatarMark, accentColor }); }}>{!isChild && <><label htmlFor="profile-name">DISPLAY NAME</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} /></>}<span>AGE PATH</span><div className="profile-age-locked"><strong>{player.ageBand}</strong><span>Controls question language and timers on this device.</span><button type="button" onClick={onChangeAge}>Change age path</button></div><AvatarPicker value={avatarMark} onChange={setAvatarMark} /><span>TEAM COLOR</span><div className="color-options">{PLAYER_COLORS.map((color) => <button type="button" key={color} className={accentColor === color ? "active" : ""} style={{ background: color }} onClick={() => setAccentColor(color)} aria-label={`Choose team color ${color}`} aria-pressed={accentColor === color} />)}</div><button className="primary-button primary-button--small" type="submit">Save player card <span>→</span></button><hr /><span>ACCOUNT & PRIVACY</span><p>{isChild ? "Child path · private device play. No child email, legal name, or public leaderboard profile is stored online." : player.accountKind === "guest" ? "Guest path · progress is currently saved on this device." : "Signed-in path · progress can sync across devices."}</p><button className="danger-button" type="button" onClick={onReset}>Reset all progress</button></form></div></section>;
}
