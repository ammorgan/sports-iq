"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BADGES,
  buildPositionModule,
  buildSportIntroModule,
  EXPERIENCE_OPTIONS,
  FOOTBALL_MODULES,
  LEVELS,
  SPORTS,
  type Challenge,
  type ExperienceLevel,
  type LearningModule,
  type Position,
  type Sport,
} from "./learning-data";

const PLAYER_KEY = "sports-iq-learning-profile-v1";
const DAILY_GOAL = 100;

type AgeBand = "7-9" | "10-12" | "13-15" | "16-17" | "18+";

type Mastery = { attempts: number; correct: number; recovered: boolean };
type SportProgress = {
  experience?: ExperienceLevel;
  variant?: string;
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
  soundOn: boolean;
  avatarMark: string;
  accentColor: string;
  ageBand: AgeBand;
  ageBandConfirmed: boolean;
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
  soundOn: true,
  avatarMark: "avatar-01",
  accentColor: "#3b7f79",
  ageBand: "10-12",
  ageBandConfirmed: false,
};

const AGE_BANDS: Array<{ value: AgeBand; label: string; title: string; note: string; seconds: number | null }> = [
  { value: "7-9", label: "AGES 7–9", title: "Play & Discover", note: "More visuals, fewer choices, and no timer.", seconds: null },
  { value: "10-12", label: "AGES 10–12", title: "Build the Basics", note: "Clear explanations and game-like decisions.", seconds: 60 },
  { value: "13-15", label: "AGES 13–15", title: "Read the Game", note: "Full scenarios, strategy, and position reads.", seconds: 45 },
  { value: "16-17", label: "AGES 16–17", title: "Compete & Lead", note: "Faster pacing and deeper tactical language.", seconds: 35 },
  { value: "18+", label: "AGES 18+", title: "Full Sports IQ", note: "Complete detail for adults, athletes, and coaches.", seconds: 30 },
];

const YOUNG_EXPERIENCE_OPTIONS: typeof EXPERIENCE_OPTIONS = [
  { value: "new", title: "I’m just starting", note: "Teach me the basics step by step." },
  { value: "basics", title: "I know a little", note: "I know some rules and want to learn more." },
  { value: "competitive", title: "I play or coach", note: "Start me with real game situations." },
];

function timeLimitForAge(ageBand: AgeBand) {
  const band = AGE_BANDS.find((item) => item.value === ageBand);
  return band ? band.seconds : 35;
}

const AVATARS = [
  { id: "avatar-16", name: "Courage", src: "/avatars/avatar-16.png" },
  { id: "avatar-05", name: "Dash", src: "/avatars/avatar-05.png" },
  { id: "avatar-20", name: "Rise", src: "/avatars/avatar-20.png" },
  { id: "avatar-01", name: "Ace", src: "/avatars/avatar-01.png" },
  { id: "avatar-18", name: "Pulse", src: "/avatars/avatar-18.png" },
  { id: "avatar-10", name: "Wheels", src: "/avatars/avatar-10.png" },
  { id: "avatar-03", name: "Blaze", src: "/avatars/avatar-03.png" },
  { id: "avatar-17", name: "Titan", src: "/avatars/avatar-17.png" },
  { id: "avatar-08", name: "Scout", src: "/avatars/avatar-08.png" },
  { id: "avatar-21", name: "Orbit", src: "/avatars/avatar-21.png" },
  { id: "avatar-06", name: "Rally", src: "/avatars/avatar-06.png" },
  { id: "avatar-22", name: "Momentum", src: "/avatars/avatar-22.png" },
  { id: "avatar-11", name: "Remix", src: "/avatars/avatar-11.png" },
  { id: "avatar-19", name: "Anchor", src: "/avatars/avatar-19.png" },
  { id: "avatar-02", name: "Sky", src: "/avatars/avatar-02.png" },
  { id: "avatar-15", name: "Stride", src: "/avatars/avatar-15.png" },
  { id: "avatar-04", name: "Nova", src: "/avatars/avatar-04.png" },
  { id: "avatar-12", name: "Spark", src: "/avatars/avatar-12.png" },
  { id: "avatar-07", name: "Power", src: "/avatars/avatar-07.png" },
  { id: "avatar-14", name: "Flash", src: "/avatars/avatar-14.png" },
  { id: "avatar-09", name: "Jet", src: "/avatars/avatar-09.png" },
  { id: "avatar-13", name: "Clutch", src: "/avatars/avatar-13.png" },
] as const;
const PLAYER_COLORS = ["#3b7f79", "#b85f45", "#59739a", "#6b64a2", "#9a6c36", "#4b7a58"];
const PLAYER_RANKS = [
  { name: "Rookie Reader", xp: 0, mark: "01" },
  { name: "Game Scout", xp: 300, mark: "02" },
  { name: "Field General", xp: 800, mark: "03" },
  { name: "Sports Scholar", xp: 1600, mark: "04" },
  { name: "Arena Elite", xp: 3000, mark: "05" },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? "logo--compact" : ""}`} aria-label="Sports IQ">
      <span>SPORTS</span><strong>IQ</strong>
    </div>
  );
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
    <fieldset className={`mini-picker ${compact ? "mini-picker--compact" : ""}`} aria-label="Choose your mini character">
      <legend>CHOOSE YOUR MINI CHARACTER</legend>
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
            <b style={{ "--ticker-color": sport.color } as React.CSSProperties}>{sport.mark}</b>
            {sport.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function shuffle<T>(items: T[]): T[] {
  return [...items].map((item) => ({ item, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
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

function playFeedbackTone(correct: boolean) {
  try {
    const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const audio = new AudioContextClass();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = correct ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(correct ? 520 : 210, audio.currentTime);
    if (correct) oscillator.frequency.exponentialRampToValueAtTime(760, audio.currentTime + 0.13);
    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.2);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.21);
  } catch { /* sound is an optional enhancement */ }
}

function moduleList(sport: Sport) {
  return sport.id === "football" ? FOOTBALL_MODULES : [buildSportIntroModule(sport)];
}

export default function Home() {
  const [player, setPlayer] = useState<Player>(DEFAULT_PLAYER);
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState<"dashboard" | "experience" | "sport" | "module" | "results">("dashboard");
  const [dashboardTab, setDashboardTab] = useState<"learn" | "progress" | "badges" | "profile">("learn");
  const [selectedSportId, setSelectedSportId] = useState("football");
  const [pathway, setPathway] = useState<"general" | "position">("general");
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [experienceChoice, setExperienceChoice] = useState<ExperienceLevel>("new");
  const [variantChoice, setVariantChoice] = useState("General");
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
  const [challengeSeconds, setChallengeSeconds] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
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
          const football = parsed.sports?.football;
          if (football && (football.variant === "Women’s / Flag" || football.variant === "General")) {
            football.variant = "Women’s Tackle (WNFC)";
          }
          const avatarMark = AVATARS.some((avatar) => avatar.id === parsed.avatarMark) ? parsed.avatarMark : DEFAULT_PLAYER.avatarMark;
          setAgeChoice(parsed.ageBand ?? "10-12");
          setAvatarChoice(avatarMark);
          setPlayer({ ...DEFAULT_PLAYER, ...parsed, avatarMark });
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
    if (screen !== "module" || feedback) return;
    const timeLimit = timeLimitForAge(player.ageBand);
    const timerStart = window.setTimeout(() => setChallengeSeconds(timeLimit), 0);
    if (timeLimit === null) return () => window.clearTimeout(timerStart);
    const timer = window.setInterval(() => setChallengeSeconds((seconds) => seconds === null ? null : Math.max(0, seconds - 1)), 1000);
    return () => {
      window.clearTimeout(timerStart);
      window.clearInterval(timer);
    };
  }, [screen, challengeIndex, feedback, player.ageBand]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [screen, dashboardTab, challengeIndex, selectedSportId, player.profileName, player.ageBandConfirmed]);

  useEffect(() => {
    if (feedback) feedbackRef.current?.scrollIntoView({ block: "nearest", behavior: "auto" });
  }, [feedback]);

  const selectedSport = SPORTS.find((sport) => sport.id === selectedSportId) ?? SPORTS[0];
  const sportProgress = player.sports[selectedSport.id] ?? emptySportProgress();
  const currentChallenge = queue[challengeIndex];

  const navigateHome = () => {
    setScreen("dashboard");
    setDashboardTab("learn");
    setSelectedPosition(null);
  };

  const chooseSport = (sport: Sport) => {
    setSelectedSportId(sport.id);
    setVariantChoice(sport.variants[0]);
    setSelectedPosition(null);
    setPathway("general");
    if (!player.sports[sport.id]?.experience) {
      setExperienceChoice("new");
      setScreen("experience");
    } else {
      setScreen("sport");
    }
  };

  const saveExperience = () => {
    setPlayer((current) => {
      const previous = current.sports[selectedSport.id] ?? emptySportProgress();
      const nextSports = {
        ...current.sports,
        [selectedSport.id]: { ...previous, experience: experienceChoice, variant: variantChoice },
      };
      const badges = new Set(current.badges);
      if (Object.keys(nextSports).length >= 3) badges.add("multi-sport");
      return { ...current, sports: nextSports, badges: [...badges] };
    });
    setScreen("sport");
  };

  const prepareChallenge = useCallback((challenge: Challenge, effectiveAge = player.ageBand): Challenge => {
    let options = challenge.options;
    if (effectiveAge === "7-9" && !["multi", "ordering"].includes(challenge.type) && options.length > 3) {
      const expected = Array.isArray(challenge.correct) ? challenge.correct : [challenge.correct];
      const distractors = shuffle(options.filter((option) => !expected.includes(option))).slice(0, Math.max(0, 3 - expected.length));
      options = [...expected, ...distractors];
    }
    const isYoungPlayer = effectiveAge === "7-9";
    const explanation = isYoungPlayer
      ? challenge.youngExplanation ?? challenge.explanation.split(/(?<=[.!?])\s/)[0]
      : challenge.explanation;
    return {
      ...challenge,
      prompt: isYoungPlayer ? challenge.youngPrompt ?? challenge.prompt : challenge.prompt,
      explanation,
      hint: isYoungPlayer ? challenge.youngHint ?? challenge.hint : challenge.hint,
      options: shuffle(options),
    };
  }, [player.ageBand]);

  const startModule = useCallback((module: LearningModule, ageOverride?: AgeBand) => {
    const mastery = player.sports[module.sportId]?.mastery ?? {};
    const effectiveAge = ageOverride ?? player.ageBand;
    const prepared = module.challenges.map((challenge, index) => ({
      challenge: prepareChallenge(challenge, effectiveAge),
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
    setScreen("module");
  }, [player.sports, player.ageBand, prepareChallenge]);

  const checkAnswer = (answers: string[]) => {
    if (!currentChallenge || feedback) return;
    const expected = Array.isArray(currentChallenge.correct) ? currentChallenge.correct : [currentChallenge.correct];
    const correct = currentChallenge.type === "ordering"
      ? expected.every((value, index) => answers[index] === value)
      : expected.length === answers.length && expected.every((value) => answers.includes(value));
    const remediation = currentChallenge.id.includes("remediate");

    if (player.soundOn) playFeedbackTone(correct);

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
        [sport.id]: { ...(current.sports[sport.id] ?? emptySportProgress()), experience: "new", variant: sport.variants[0] },
      },
    }));
    setSelectedSportId(sport.id);
    setVariantChoice(sport.variants[0]);
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

  const currentSportModules = moduleList(selectedSport);
  const footballFundamentalsDone = FOOTBALL_MODULES.filter((module) => module.level === 0)
    .every((module) => sportProgress.completedModules.includes(module.id));
  const positionsUnlocked = sportProgress.experience !== "new" || footballFundamentalsDone || selectedSport.id !== "football" && sportProgress.completedModules.length > 0;

  const nextModule = sportProgress.experience === "new"
    ? currentSportModules.find((learningModule) => !sportProgress.completedModules.includes(learningModule.id))
    : currentSportModules.find((learningModule) => learningModule.level >= 1 && !sportProgress.completedModules.includes(learningModule.id)) ?? currentSportModules[0];

  const allMastery = Object.entries(player.sports).flatMap(([sportId, progress]) =>
    Object.entries(progress.mastery).map(([conceptId, mastery]) => ({ sportId, conceptId, mastery })));
  const strongest = [...allMastery].sort((a, b) => (b.mastery.correct / b.mastery.attempts) - (a.mastery.correct / a.mastery.attempts)).slice(0, 3);
  const weakest = [...allMastery].filter((item) => masteryLabel(item.mastery) !== "Mastered")
    .sort((a, b) => (a.mastery.correct / a.mastery.attempts) - (b.mastery.correct / b.mastery.attempts)).slice(0, 3);

  if (!hydrated) return <main className="loading-screen"><Logo /><span>Building your playbook…</span></main>;

  if (!player.profileName) {
    return (
      <main className={`welcome-screen ${player.darkMode ? "dark" : ""}`}>
        <div className="welcome-copy">
          <Logo />
          <div className="welcome-live"><span /> 13 SPORTS · ONE PLAYBOOK · YOUR PACE</div>
          <span className="eyebrow"><i /> YOUR SPORTS IQ STARTS HERE</span>
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
        <aside className="welcome-board" aria-label="Sports IQ learning preview">
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

  if (screen === "experience") {
    return (
      <main className={`onboarding-screen ${player.darkMode ? "dark" : ""}`}>
        <header className="simple-header"><button className="brand-button" onClick={navigateHome}><Logo compact /></button><button className="close-button" onClick={navigateHome} aria-label="Close onboarding">×</button></header>
        <section className="experience-panel">
          <div className="sport-mark sport-mark--large" style={{ "--sport-color": selectedSport.color, "--sport-soft": selectedSport.softColor } as React.CSSProperties}>{selectedSport.mark}</div>
          <span className="eyebrow">PERSONALIZE YOUR PATH</span>
          <h1>What is your experience with <em>{selectedSport.name}</em>?</h1>
          <p>Your level is stored for this sport only. You can be an expert here and a rookie somewhere else.</p>
          <div className="age-path-summary"><span>{AGE_BANDS.find((band) => band.value === player.ageBand)?.label}</span><strong>{AGE_BANDS.find((band) => band.value === player.ageBand)?.title}</strong><small>Age controls presentation. Your answer below controls sport difficulty.</small></div>
          <div className="variant-picker" aria-label="Playing format or division">
            {selectedSport.variants.map((variant) => <button key={variant} className={variantChoice === variant ? "active" : ""} onClick={() => setVariantChoice(variant)} aria-pressed={variantChoice === variant}>{variant}</button>)}
          </div>
          <div className="experience-list">
            {(player.ageBand === "7-9" ? YOUNG_EXPERIENCE_OPTIONS : EXPERIENCE_OPTIONS).map((option, index) => (
              <button key={option.value} className={experienceChoice === option.value ? "active" : ""} onClick={() => setExperienceChoice(option.value)} aria-pressed={experienceChoice === option.value}>
                <span>{String(index + 1).padStart(2, "0")}</span><div><strong>{option.title}</strong><small>{option.note}</small></div><i>✓</i>
              </button>
            ))}
          </div>
          <button className="primary-button" onClick={saveExperience}>Create my {selectedSport.name} path <span>→</span></button>
        </section>
      </main>
    );
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
      <main className={`lesson-shell ${player.darkMode ? "dark" : ""}`}>
        <header className="lesson-header">
          <button className="lesson-exit-button" onClick={exitModule}><span>←</span> Exit lesson</button>
          <div className="lesson-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="lesson-counters"><span>XP <strong>{sessionXp}</strong></span><span>STREAK <strong>{sessionStreak}×</strong></span><span>MISTAKES <strong>{sessionMistakes}</strong></span></div>
        </header>
        <section className="challenge-stage">
          {feedback?.correct && <div className="xp-burst" key={`xp-${challengeIndex}`}>+{currentChallenge.xp + Math.min(Math.max(0, sessionStreak - 1) * 2, 10)} XP</div>}
          <div className="challenge-heading">
            <div><span>{currentChallenge.label}</span><small>{activeModule.title} · {challengeIndex + 1} of {queue.length}</small></div>
            <div className="challenge-tools">{challengeSeconds !== null && <span className={`round-clock ${challengeSeconds <= 10 ? "round-clock--low" : ""}`} aria-label={`${challengeSeconds} seconds remaining`}>{challengeSeconds}<small>SEC</small></span>}{sessionStreak >= 2 && <strong className="combo-chip">{sessionStreak}× COMBO</strong>}<button className="hint-button" onClick={() => setHintVisible((visible) => !visible)} aria-expanded={hintVisible} aria-controls="challenge-hint">{hintVisible ? "Hide hint" : "Need a hint?"}</button></div>
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
          <button className="primary-button" onClick={() => setScreen("sport")}>Continue my path <span>→</span></button>
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
      <main className={`sport-shell ${player.darkMode ? "dark" : ""}`}>
        <AppHeader player={player} active="learn" onNavigate={(tab) => { setDashboardTab(tab); setScreen("dashboard"); }} onHome={navigateHome} onToggleTheme={() => setPlayer((current) => ({ ...current, darkMode: !current.darkMode }))} onToggleSound={() => setPlayer((current) => ({ ...current, soundOn: !current.soundOn }))} />
        <section className="sport-hero" style={{ "--sport-color": selectedSport.color, "--sport-soft": selectedSport.softColor } as React.CSSProperties}>
          <button className="back-link" onClick={navigateHome}>← All sports</button>
          <div className="sport-title-row"><div className="sport-mark sport-mark--xl">{selectedSport.mark}</div><div><span>{sportProgress.variant ?? selectedSport.variants[0]} PATH</span><h1>{selectedSport.name}</h1><p>{selectedSport.pathNote ?? (sportProgress.experience === "new" ? "Start with the fundamentals, then unlock position-specific reads." : "Your placement opens Rookie and position-specific learning.")}</p></div></div>
          <div className="sport-summary"><div><strong>{progressPercent}%</strong><span>SPORT PROGRESS</span></div><div><strong>{sportProgress.xp}</strong><span>XP EARNED</span></div><div><strong>{LEVELS[Math.min(5, Math.floor(sportProgress.completedModules.length / 3))]}</strong><span>CURRENT LEVEL</span></div></div>
        </section>
        <section className="path-content">
          <div className="path-tabs"><button className={pathway === "general" ? "active" : ""} onClick={() => { setPathway("general"); setSelectedPosition(null); }}>General Sport IQ <span>{Math.round((sportProgress.completedModules.filter((id) => currentSportModules.some((module) => module.id === id)).length / currentSportModules.length) * 100)}%</span></button><button className={pathway === "position" ? "active" : ""} onClick={() => setPathway("position")}>Position IQ <span>{positionsUnlocked ? "OPEN" : "LOCKED"}</span></button></div>

          {pathway === "general" ? (
            <div className="map-layout">
              <div className="learning-map">
                <div className="map-heading"><span>YOUR PATH</span><h2>{sportProgress.experience === "new" ? "Fundamentals" : "Rookie Placement"}</h2></div>
                {currentSportModules.map((module, index) => {
                  const complete = sportProgress.completedModules.includes(module.id);
                  const placedOut = sportProgress.experience !== "new" && module.level === 0;
                  const previousComplete = index === 0 || sportProgress.completedModules.includes(currentSportModules[index - 1].id);
                  const unlocked = placedOut || previousComplete || sportProgress.experience !== "new" && module.level >= 1;
                  return <div className="map-node-wrap" key={module.id}><div className={`map-line ${complete || placedOut ? "complete" : ""}`} />
                    <button className={`map-node ${complete ? "complete" : ""} ${!unlocked ? "locked" : ""} ${nextModule?.id === module.id ? "current" : ""}`} onClick={() => unlocked && startModule(module)} disabled={!unlocked}>
                      <span>{complete ? "✓" : placedOut ? "↗" : !unlocked ? "·" : index + 1}</span><div><small>{placedOut ? "PLACED OUT · AVAILABLE TO REVIEW" : module.level === 0 ? "FUNDAMENTALS" : `LEVEL ${module.level} · ${LEVELS[module.level - 1]}`}</small><strong>{module.title}</strong><p>{module.description}</p></div><em>{complete ? "+ DONE" : `${module.estimatedMinutes} MIN`}</em>
                    </button>
                  </div>;
                })}
                {selectedSport.id === "football" && <><div className="map-node-wrap"><div className="map-line" /><div className="map-node locked"><span>·</span><div><small>LEVEL 2 · STARTER</small><strong>Situational Football</strong><p>Personnel, formations, common penalties, and simple strategy.</p></div><em>LOCKED</em></div></div><div className="map-node-wrap"><div className="map-line" /><div className="map-node locked"><span>·</span><div><small>LEVEL 3 · PLAYMAKER</small><strong>Reads & Adjustments</strong><p>Coverage recognition, matchup concepts, and assignments.</p></div><em>LOCKED</em></div></div></>}
              </div>
              <aside className="path-sidebar"><span>NEXT UP</span><h3>{nextModule?.title ?? "Position IQ"}</h3><p>{nextModule?.description ?? "Choose a position and begin a focused learning path."}</p>{nextModule && <button className="primary-button primary-button--small" onClick={() => startModule(nextModule)}>Continue learning <span>→</span></button>}<div className="goal-mini"><div><strong>{Math.min(player.dailyXp, DAILY_GOAL)}/{DAILY_GOAL}</strong><span>DAILY XP</span></div><i><b style={{ width: `${Math.min(100, player.dailyXp)}%` }} /></i></div></aside>
            </div>
          ) : !positionsUnlocked ? (
            <div className="locked-path"><span>POSITION IQ</span><h2>Finish Fundamentals to unlock your position room.</h2><p>Complete the interactive basics first so position language and game situations have a strong foundation.</p><button className="primary-button" onClick={() => setPathway("general")}>Return to Fundamentals <span>→</span></button></div>
          ) : selectedPosition && selectedPositionModule ? (
            <div className="position-detail"><button className="back-link" onClick={() => setSelectedPosition(null)}>← All positions</button><div className="position-hero"><span>{selectedPosition.group}</span><h2>{selectedPosition.name} IQ</h2><p>Learn to {selectedPosition.focus} through reads, responsibilities, and decisions.</p></div><div className="position-module-card"><div><small>LEVEL 1 · ROOKIE</small><strong>{selectedPositionModule.title}</strong><p>{selectedPositionModule.description}</p><span>{selectedPositionModule.challenges.length} interactions · {selectedPositionModule.estimatedMinutes} min</span></div><button className="primary-button primary-button--small" onClick={() => startModule(selectedPositionModule)}>{sportProgress.completedModules.includes(selectedPositionModule.id) ? "Practice again" : "Start module"}<span>→</span></button></div><div className="future-modules"><div><span>02</span><strong>Situational Responsibilities</strong><small>STARTER · LOCKED</small></div><div><span>03</span><strong>Reads & Adjustments</strong><small>PLAYMAKER · LOCKED</small></div><div><span>04</span><strong>Position Mastery</strong><small>ALL-STAR · LOCKED</small></div></div></div>
          ) : (
            <div className="positions-grid-section"><div className="section-heading"><span>CHOOSE YOUR ROOM</span><h2>Position IQ pathways</h2><p>Every major role has its own reads, responsibilities, and progression.</p></div>{Object.entries(groupedPositions).map(([group, positions]) => <div className="position-group" key={group}><h3>{group}</h3><div>{positions.map((position) => { const positionModule = buildPositionModule(selectedSport, position); const done = sportProgress.completedModules.includes(positionModule.id); return <button key={position.name} onClick={() => setSelectedPosition(position)}><span>{done ? "✓" : position.name.slice(0, 2).toUpperCase()}</span><strong>{position.name}</strong><small>{done ? "MODULE COMPLETE" : "VIEW PATH"}</small></button>; })}</div></div>)}</div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className={`dashboard-shell ${player.darkMode ? "dark" : ""}`}>
      <AppHeader player={player} active={dashboardTab} onNavigate={setDashboardTab} onHome={navigateHome} onToggleTheme={() => setPlayer((current) => ({ ...current, darkMode: !current.darkMode }))} onToggleSound={() => setPlayer((current) => ({ ...current, soundOn: !current.soundOn }))} />
      {dashboardTab === "learn" && <DashboardLearn player={player} onChooseSport={chooseSport} onContinue={() => {
        const started = SPORTS.find((sport) => player.sports[sport.id]?.experience) ?? SPORTS[0]; chooseSport(started);
      }} />}
      {dashboardTab === "progress" && <ProgressDashboard player={player} strongest={strongest} weakest={weakest} onChooseSport={chooseSport} />}
      {dashboardTab === "badges" && <BadgesDashboard player={player} />}
      {dashboardTab === "profile" && <ProfileDashboard player={player} onUpdateIdentity={(updates) => setPlayer((current) => ({ ...current, ...updates, ageBandConfirmed: true }))} onReset={() => {
        if (window.confirm("Reset all Sports IQ progress saved on this device? This cannot be undone.")) setPlayer({ ...DEFAULT_PLAYER, profileName: player.profileName, darkMode: player.darkMode, soundOn: player.soundOn, avatarMark: player.avatarMark, accentColor: player.accentColor, ageBand: player.ageBand, ageBandConfirmed: true });
      }} />}
    </main>
  );
}

function AppHeader({ player, active, onNavigate, onHome, onToggleTheme, onToggleSound }: { player: Player; active: "learn" | "progress" | "badges" | "profile"; onNavigate: (tab: "learn" | "progress" | "badges" | "profile") => void; onHome: () => void; onToggleTheme: () => void; onToggleSound: () => void }) {
  return <header className="app-header"><button className="brand-button" onClick={onHome}><Logo compact /></button><nav aria-label="Main navigation"><button className={active === "learn" ? "active" : ""} onClick={() => onNavigate("learn")}>Learn</button><button className={active === "progress" ? "active" : ""} onClick={() => onNavigate("progress")}>Progress</button><button className={active === "badges" ? "active" : ""} onClick={() => onNavigate("badges")}>Badges</button></nav><div className="header-stats"><button className="streak-pill" onClick={() => onNavigate("progress")}><span>◆</span><strong>{player.streak}</strong><small>DAY STREAK</small></button><button className="xp-pill" onClick={() => onNavigate("progress")}><span>XP</span><strong>{player.totalXp.toLocaleString()}</strong></button><button className={`sound-button ${player.soundOn ? "active" : ""}`} onClick={onToggleSound} aria-label={`${player.soundOn ? "Turn off" : "Turn on"} answer feedback sounds`} title="Controls short correct and incorrect answer sounds"><span>SFX</span><strong>{player.soundOn ? "ON" : "OFF"}</strong></button><button className="theme-button" onClick={onToggleTheme} aria-label="Toggle dark mode">{player.darkMode ? "☀" : "◐"}</button><button className="avatar-button" style={{ "--player-color": player.accentColor } as React.CSSProperties} onClick={() => onNavigate("profile")} aria-label={`Open ${player.profileName}'s profile`}><AvatarImage id={player.avatarMark} /></button></div></header>;
}

function DashboardLearn({ player, onChooseSport, onContinue }: { player: Player; onChooseSport: (sport: Sport) => void; onContinue: () => void }) {
  const startedSports = SPORTS.filter((sport) => player.sports[sport.id]?.experience);
  const continueSport = startedSports.sort((a, b) => (player.sports[b.id]?.xp ?? 0) - (player.sports[a.id]?.xp ?? 0))[0];
  const dailyPercent = Math.min(100, (player.dailyXp / DAILY_GOAL) * 100);
  const spotlightSport = SPORTS[new Date().getDate() % SPORTS.length];
  const agePath = AGE_BANDS.find((band) => band.value === player.ageBand) ?? AGE_BANDS[1];
  return <>
    <section className="dashboard-hero"><div><span className="eyebrow"><i /> {agePath.title.toUpperCase()} PATH · {agePath.label}</span><h1>GOOD TO SEE YOU,<br /><em>{player.profileName.toUpperCase()}.</em></h1><p>{continueSport ? "Your next sports mission is ready. Make the reads, earn the XP, and keep building real game IQ." : "Choose your first arena and start making game decisions in under a minute."}</p><div className="hero-chips"><span>QUICK SESSIONS</span><span>REAL GAME READS</span><span>13 SPORTS</span></div></div><aside className="daily-card"><div className="hero-player" style={{ "--player-color": player.accentColor } as React.CSSProperties}><AvatarImage id={player.avatarMark} /><span>GAME READY</span></div><div><span>TODAY’S MISSION</span><strong>{Math.min(player.dailyXp, DAILY_GOAL)} <small>/ {DAILY_GOAL} XP</small></strong><i><b style={{ width: `${dailyPercent}%` }} /></i><p>{dailyPercent >= 100 ? "Mission complete. You showed up and leveled up." : `${DAILY_GOAL - Math.min(player.dailyXp, DAILY_GOAL)} XP to keep your streak moving.`}</p></div><div className="daily-ring" style={{ "--daily-progress": `${dailyPercent}%` } as React.CSSProperties}>{Math.round(dailyPercent)}%</div></aside></section>
    <SportTicker />
    <section className="daily-spotlight" style={{ "--sport-color": spotlightSport.color, "--sport-soft": spotlightSport.softColor } as React.CSSProperties}><div className="spotlight-orbit" aria-hidden="true"><i /><i /><i /></div><div className="sport-mark">{spotlightSport.mark}</div><div><span>DAILY SPORT SPOTLIGHT</span><h2>Can you make the call in {spotlightSport.name}?</h2><p>A quick mission built for your {agePath.title} path.</p></div><button className="primary-button primary-button--small" onClick={() => onChooseSport(spotlightSport)}>Enter mission <span>→</span></button></section>
    {continueSport && <section className="continue-card" style={{ "--sport-color": continueSport.color, "--sport-soft": continueSport.softColor } as React.CSSProperties}><div className="sport-mark">{continueSport.mark}</div><div><span>CONTINUE LEARNING</span><h2>{continueSport.name}</h2><p>{player.sports[continueSport.id].completedModules.length ? "Your next lesson is ready." : "Your personalized path is ready to begin."}</p></div><div className="continue-progress"><strong>{player.sports[continueSport.id].xp} XP</strong><i><b style={{ width: `${Math.min(100, player.sports[continueSport.id].completedModules.length * 18)}%` }} /></i></div><button className="primary-button primary-button--small" onClick={onContinue}>Continue <span>→</span></button></section>}
    <section className="sports-hub"><div className="section-heading"><span>CHOOSE YOUR ARENA</span><h2>{startedSports.length ? "Keep learning—or add a new sport." : "Which game do you want to unlock?"}</h2><p>Explore rules, positions, and strategy. Every sport keeps its own level and progress.</p></div><div className="sport-card-grid">{SPORTS.map((sport, index) => { const progress = player.sports[sport.id]; const started = !!progress?.experience; const modules = moduleList(sport); const percent = started ? Math.min(100, Math.round((progress.completedModules.length / (modules.length + sport.positions.length)) * 100)) : 0; return <article className="sport-card" key={sport.id} style={{ "--sport-color": sport.color, "--sport-soft": sport.softColor, "--card-index": index } as React.CSSProperties}><div className="sport-card-top"><div className="sport-mark">{sport.mark}</div><span>{started ? `${percent}%` : "NEW"}</span></div><h3>{sport.name}</h3><p>{sport.variants.slice(0, 3).join(" · ")}</p><div className="sport-card-progress"><i><b style={{ width: `${percent}%` }} /></i><span>{started ? `${progress.xp} XP · ${progress.completedModules.length} modules` : `${sport.positions.length} position paths`}</span></div><button onClick={() => onChooseSport(sport)}>{started ? "Continue path" : "Enter arena"}<span>→</span></button></article>; })}</div></section>
  </>;
}

function ProgressDashboard({ player, strongest, weakest, onChooseSport }: { player: Player; strongest: Array<{ sportId: string; conceptId: string; mastery: Mastery }>; weakest: Array<{ sportId: string; conceptId: string; mastery: Mastery }>; onChooseSport: (sport: Sport) => void }) {
  const started = SPORTS.filter((sport) => player.sports[sport.id]?.experience);
  const modules = Object.values(player.sports).reduce((sum, sport) => sum + sport.completedModules.length, 0);
  const attempts = Object.values(player.sports).flatMap((sport) => Object.values(sport.mastery));
  const accuracy = attempts.length ? Math.round((attempts.reduce((sum, item) => sum + item.correct, 0) / attempts.reduce((sum, item) => sum + item.attempts, 0)) * 100) : 0;
  const rank = playerRank(player.totalXp);
  const rankIndex = PLAYER_RANKS.findIndex((item) => item.name === rank.name);
  const nextRank = PLAYER_RANKS[rankIndex + 1];
  return <section className="dashboard-page"><div className="section-heading"><span>YOUR SEASON</span><h1>Progress that means something.</h1><p>Mastery reflects what you understand—not how fast you clicked through.</p></div><div className="league-ladder"><div><span>YOUR SAFE LEAGUE</span><h2>{rank.name}</h2><p>Compete against milestones—not strangers. No public names, messages, or rankings.</p></div><div className="rank-track">{PLAYER_RANKS.map((item) => <div key={item.name} className={player.totalXp >= item.xp ? "reached" : ""}><i>{item.mark}</i><span>{item.name}</span><small>{item.xp} XP</small></div>)}</div>{nextRank && <strong>{nextRank.xp - player.totalXp} XP TO {nextRank.name.toUpperCase()}</strong>}</div><div className="big-stat-grid"><div><span>TOTAL XP</span><strong>{player.totalXp.toLocaleString()}</strong><small>Across {started.length} sports</small></div><div><span>MODULES</span><strong>{modules}</strong><small>Completed sessions</small></div><div><span>ACCURACY</span><strong>{accuracy}%</strong><small>All-time answers</small></div><div><span>STREAK</span><strong>{player.streak}</strong><small>Consecutive days</small></div></div><div className="progress-columns"><div className="progress-panel"><span>SPORTS IN PROGRESS</span>{started.length ? started.map((sport) => { const progress = player.sports[sport.id]; return <button key={sport.id} onClick={() => onChooseSport(sport)}><div className="sport-mark" style={{ "--sport-color": sport.color, "--sport-soft": sport.softColor } as React.CSSProperties}>{sport.mark}</div><div><strong>{sport.name}</strong><small>{progress.xp} XP · {progress.completedModules.length} complete</small></div><span>→</span></button>; }) : <p>Choose a sport to begin your first path.</p>}</div><div className="mastery-panel"><div><span>STRONGEST CONCEPTS</span>{strongest.length ? strongest.map((item) => <p key={item.conceptId}><b>✓</b>{item.conceptId.replaceAll("-", " ")}<small>{masteryLabel(item.mastery)}</small></p>) : <p>Complete a module to reveal strengths.</p>}</div><div><span>FOCUS NEXT</span>{weakest.length ? weakest.map((item) => <p key={item.conceptId}><b>↗</b>{item.conceptId.replaceAll("-", " ")}<small>{masteryLabel(item.mastery)}</small></p>) : <p>No weak concepts recorded yet.</p>}</div></div></div>{player.recentActivity.length > 0 && <div className="recent-panel"><span>RECENT ACTIVITY</span>{player.recentActivity.map((item, index) => <div key={`${item.title}-${index}`}><strong>{item.title}</strong><p>{item.detail}</p><small>{item.date}</small></div>)}</div>}</section>;
}

function BadgesDashboard({ player }: { player: Player }) {
  return <section className="dashboard-page"><div className="section-heading"><span>TROPHY ROOM</span><h1>Earned through real progress.</h1><p>Badges and player titles unlock as your sports knowledge grows.</p></div><div className="title-locker"><span>PLAYER TITLES</span><div>{PLAYER_RANKS.map((rank) => { const unlocked = player.totalXp >= rank.xp; return <article key={rank.name} className={unlocked ? "unlocked" : "locked"}><i>{unlocked ? rank.mark : "?"}</i><div><small>{unlocked ? "UNLOCKED" : `${rank.xp} XP`}</small><strong>{rank.name}</strong></div></article>; })}</div></div><div className="badge-grid">{BADGES.map((badge) => { const earned = player.badges.includes(badge.id); return <article className={earned ? "earned" : "locked"} key={badge.id}><div>{earned ? badge.mark : "?"}</div><span>{earned ? "EARNED" : "LOCKED"}</span><h2>{badge.name}</h2><p>{badge.description}</p></article>; })}</div></section>;
}

function ProfileDashboard({ player, onUpdateIdentity, onReset }: { player: Player; onUpdateIdentity: (updates: Pick<Player, "profileName" | "avatarMark" | "accentColor" | "ageBand">) => void; onReset: () => void }) {
  const [name, setName] = useState(player.profileName);
  const [avatarMark, setAvatarMark] = useState(player.avatarMark);
  const [accentColor, setAccentColor] = useState(player.accentColor);
  const [ageBand, setAgeBand] = useState<AgeBand>(player.ageBand);
  const rank = playerRank(player.totalXp);
  return <section className="dashboard-page"><div className="section-heading"><span>PLAYER PROFILE</span><h1>Your Sports IQ identity.</h1><p>Make the playbook yours. Your age path changes pacing and presentation—not what sports you can explore.</p></div><div className="profile-layout"><div className="profile-card" style={{ "--player-color": accentColor } as React.CSSProperties}><span className="player-card-rank">{rank.name}</span><div className="profile-avatar"><AvatarImage id={avatarMark} /></div><h2>{name || player.profileName}</h2><p>{player.totalXp.toLocaleString()} XP · {player.badges.length} badges · {Object.keys(player.sports).length} sports</p><div className="player-card-stripe"><span>{ageBand}</span><span>{rank.mark}</span><span>SPORTS IQ</span></div></div><form onSubmit={(event) => { event.preventDefault(); if (name.trim()) onUpdateIdentity({ profileName: name.trim(), avatarMark, accentColor, ageBand }); }}><label htmlFor="profile-name">DISPLAY NAME</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} /><span>AGE PATH</span><div className="profile-age-options">{AGE_BANDS.map((band) => <button type="button" key={band.value} className={ageBand === band.value ? "active" : ""} onClick={() => setAgeBand(band.value)} aria-pressed={ageBand === band.value}>{band.value}</button>)}</div><AvatarPicker value={avatarMark} onChange={setAvatarMark} /><span>TEAM COLOR</span><div className="color-options">{PLAYER_COLORS.map((color) => <button type="button" key={color} className={accentColor === color ? "active" : ""} style={{ background: color }} onClick={() => setAccentColor(color)} aria-label={`Choose team color ${color}`} aria-pressed={accentColor === color} />)}</div><button className="primary-button primary-button--small" type="submit">Save player card <span>→</span></button><hr /><span>DEVICE DATA</span><p>Your experience choices, mastery, XP, badges, and streak are stored in this browser for the current preview.</p><button className="danger-button" type="button" onClick={onReset}>Reset all progress</button></form></div></section>;
}
