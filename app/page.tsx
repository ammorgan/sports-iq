"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
};

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? "logo--compact" : ""}`} aria-label="Sports IQ">
      <span>SPORTS</span><strong>IQ</strong>
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

  useEffect(() => {
    const saved = window.localStorage.getItem(PLAYER_KEY);
    if (saved) {
      try { setPlayer({ ...DEFAULT_PLAYER, ...JSON.parse(saved) }); } catch { /* use a fresh profile */ }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
  }, [hydrated, player]);

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

  const prepareChallenge = (challenge: Challenge): Challenge => ({
    ...challenge,
    options: shuffle(challenge.options),
  });

  const startModule = useCallback((module: LearningModule) => {
    const mastery = player.sports[module.sportId]?.mastery ?? {};
    const prepared = module.challenges.map((challenge, index) => ({
      challenge: prepareChallenge(challenge),
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
    setSessionXp(0);
    setSessionMistakes(0);
    setSessionStreak(0);
    setSessionResults([]);
    setMissedConcepts([]);
    setRecoveredConcepts([]);
    setSummary(null);
    setScreen("module");
  }, [player.sports]);

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
    checkAnswer([answer]);
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
  };

  const currentSportModules = moduleList(selectedSport);
  const footballFundamentalsDone = FOOTBALL_MODULES.filter((module) => module.level === 0)
    .every((module) => sportProgress.completedModules.includes(module.id));
  const positionsUnlocked = sportProgress.experience !== "new" || footballFundamentalsDone || selectedSport.id !== "football" && sportProgress.completedModules.length > 0;

  const nextModule = useMemo(() => {
    const modules = moduleList(selectedSport);
    if (sportProgress.experience === "new") return modules.find((module) => !sportProgress.completedModules.includes(module.id));
    return modules.find((module) => module.level >= 1 && !sportProgress.completedModules.includes(module.id)) ?? modules[0];
  }, [selectedSport, sportProgress.completedModules, sportProgress.experience]);

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
          <span className="eyebrow"><i /> YOUR SPORTS IQ STARTS HERE</span>
          <h1>LEARN THE GAME.<br /><em>SEE IT DIFFERENTLY.</em></h1>
          <p>Rules, reads, responsibilities, and strategy—built into short sessions that meet you at your level.</p>
          <form onSubmit={(event) => {
            event.preventDefault();
            if (profileDraft.trim()) setPlayer((current) => ({ ...current, profileName: profileDraft.trim() }));
          }}>
            <label htmlFor="player-name">WHAT SHOULD WE CALL YOU?</label>
            <div><input id="player-name" value={profileDraft} onChange={(event) => setProfileDraft(event.target.value)} placeholder="Your first name" autoFocus /><button type="submit" disabled={!profileDraft.trim()}>Build my playbook <span>→</span></button></div>
          </form>
          <small>No account required for this preview. Progress saves on this device.</small>
        </div>
        <aside className="welcome-board" aria-label="Sports IQ learning preview">
          <span>YOUR FIRST DRIVE</span>
          <div className="welcome-step done"><b>01</b><p><strong>Choose a sport</strong><small>Start where you are</small></p></div>
          <div className="welcome-step"><b>02</b><p><strong>Make the read</strong><small>Learn through decisions</small></p></div>
          <div className="welcome-step"><b>03</b><p><strong>Master the concept</strong><small>Build real game IQ</small></p></div>
        </aside>
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
          <div className="variant-picker" aria-label="Sport format">
            {selectedSport.variants.map((variant) => <button key={variant} className={variantChoice === variant ? "active" : ""} onClick={() => setVariantChoice(variant)} aria-pressed={variantChoice === variant}>{variant}</button>)}
          </div>
          <div className="experience-list">
            {EXPERIENCE_OPTIONS.map((option, index) => (
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
      : currentChallenge.type === "ordering" ? selectedAnswers.length === currentChallenge.options.length : false;
    return (
      <main className={`lesson-shell ${player.darkMode ? "dark" : ""}`}>
        <header className="lesson-header">
          <button className="brand-button" onClick={() => setScreen("sport")} aria-label="Exit module"><Logo compact /></button>
          <div className="lesson-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="lesson-counters"><span>XP <strong>{sessionXp}</strong></span><span>STREAK <strong>{sessionStreak}×</strong></span><span>MISTAKES <strong>{sessionMistakes}</strong></span></div>
        </header>
        <section className="challenge-stage" aria-live="polite">
          <div className="challenge-heading">
            <div><span>{currentChallenge.label}</span><small>{activeModule.title} · {challengeIndex + 1} of {queue.length}</small></div>
            <button className="hint-button" onClick={() => window.alert(currentChallenge.hint ?? "Look for the option that best supports the team’s immediate objective.")}>Need a hint?</button>
          </div>
          <h1>{currentChallenge.prompt}</h1>

          {currentChallenge.type === "hotspot" && <div className="field-diagram" aria-hidden="true"><div className="end-zone">END ZONE</div><i /><i /><i /><div className="end-zone">END ZONE</div></div>}

          <div className={`challenge-options challenge-options--${currentChallenge.type}`} role="group" aria-label="Answer choices">
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

          {!feedback && (currentChallenge.type === "multi" || currentChallenge.type === "ordering") && (
            <div className="check-row">
              {currentChallenge.type === "ordering" && <button className="text-button" onClick={() => setSelectedAnswers([])}>Reset order</button>}
              <button className="primary-button primary-button--small" disabled={!isCheckable} onClick={() => checkAnswer(selectedAnswers)}>Check my read <span>→</span></button>
            </div>
          )}

          {feedback && (
            <div className={`feedback-card ${feedback.correct ? "feedback-card--correct" : "feedback-card--wrong"}`}>
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
        <AppHeader player={player} active="learn" onNavigate={(tab) => { setDashboardTab(tab); setScreen("dashboard"); }} onHome={navigateHome} onToggleTheme={() => setPlayer((current) => ({ ...current, darkMode: !current.darkMode }))} />
        <section className="sport-hero" style={{ "--sport-color": selectedSport.color, "--sport-soft": selectedSport.softColor } as React.CSSProperties}>
          <button className="back-link" onClick={navigateHome}>← All sports</button>
          <div className="sport-title-row"><div className="sport-mark sport-mark--xl">{selectedSport.mark}</div><div><span>{sportProgress.variant ?? selectedSport.variants[0]} PATH</span><h1>{selectedSport.name}</h1><p>{sportProgress.experience === "new" ? "Start with the fundamentals, then unlock position-specific reads." : "Your placement opens Rookie and position-specific learning."}</p></div></div>
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
            <div className="positions-grid-section"><div className="section-heading"><span>CHOOSE YOUR ROOM</span><h2>Position IQ pathways</h2><p>Every major role has its own reads, responsibilities, and progression.</p></div>{Object.entries(groupedPositions).map(([group, positions]) => <div className="position-group" key={group}><h3>{group}</h3><div>{positions.map((position) => { const module = buildPositionModule(selectedSport, position); const done = sportProgress.completedModules.includes(module.id); return <button key={position.name} onClick={() => setSelectedPosition(position)}><span>{done ? "✓" : position.name.slice(0, 2).toUpperCase()}</span><strong>{position.name}</strong><small>{done ? "MODULE COMPLETE" : "VIEW PATH"}</small></button>; })}</div></div>)}</div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className={`dashboard-shell ${player.darkMode ? "dark" : ""}`}>
      <AppHeader player={player} active={dashboardTab} onNavigate={setDashboardTab} onHome={navigateHome} onToggleTheme={() => setPlayer((current) => ({ ...current, darkMode: !current.darkMode }))} />
      {dashboardTab === "learn" && <DashboardLearn player={player} onChooseSport={chooseSport} onContinue={() => {
        const started = SPORTS.find((sport) => player.sports[sport.id]?.experience) ?? SPORTS[0]; chooseSport(started);
      }} />}
      {dashboardTab === "progress" && <ProgressDashboard player={player} strongest={strongest} weakest={weakest} onChooseSport={chooseSport} />}
      {dashboardTab === "badges" && <BadgesDashboard player={player} />}
      {dashboardTab === "profile" && <ProfileDashboard player={player} onSaveName={(name) => setPlayer((current) => ({ ...current, profileName: name }))} onReset={() => {
        if (window.confirm("Reset all Sports IQ progress saved on this device? This cannot be undone.")) setPlayer({ ...DEFAULT_PLAYER, profileName: player.profileName, darkMode: player.darkMode });
      }} />}
    </main>
  );
}

function AppHeader({ player, active, onNavigate, onHome, onToggleTheme }: { player: Player; active: "learn" | "progress" | "badges" | "profile"; onNavigate: (tab: "learn" | "progress" | "badges" | "profile") => void; onHome: () => void; onToggleTheme: () => void }) {
  return <header className="app-header"><button className="brand-button" onClick={onHome}><Logo compact /></button><nav aria-label="Main navigation"><button className={active === "learn" ? "active" : ""} onClick={() => onNavigate("learn")}>Learn</button><button className={active === "progress" ? "active" : ""} onClick={() => onNavigate("progress")}>Progress</button><button className={active === "badges" ? "active" : ""} onClick={() => onNavigate("badges")}>Badges</button></nav><div className="header-stats"><button className="streak-pill" onClick={() => onNavigate("progress")}><span>◆</span><strong>{player.streak}</strong><small>DAY STREAK</small></button><button className="xp-pill" onClick={() => onNavigate("progress")}><span>XP</span><strong>{player.totalXp.toLocaleString()}</strong></button><button className="theme-button" onClick={onToggleTheme} aria-label="Toggle dark mode">{player.darkMode ? "☀" : "◐"}</button><button className="avatar-button" onClick={() => onNavigate("profile")} aria-label="Open profile">{player.profileName.slice(0, 1).toUpperCase()}</button></div></header>;
}

function DashboardLearn({ player, onChooseSport, onContinue }: { player: Player; onChooseSport: (sport: Sport) => void; onContinue: () => void }) {
  const startedSports = SPORTS.filter((sport) => player.sports[sport.id]?.experience);
  const continueSport = startedSports.sort((a, b) => (player.sports[b.id]?.xp ?? 0) - (player.sports[a.id]?.xp ?? 0))[0];
  const dailyPercent = Math.min(100, (player.dailyXp / DAILY_GOAL) * 100);
  return <>
    <section className="dashboard-hero"><div><span className="eyebrow"><i /> PLAYBOOK READY</span><h1>GOOD TO SEE YOU,<br /><em>{player.profileName.toUpperCase()}.</em></h1><p>{continueSport ? "Keep building the reads that turn knowledge into game IQ." : "Choose your first sport and start playing in under a minute."}</p></div><aside className="daily-card"><div><span>DAILY GOAL</span><strong>{Math.min(player.dailyXp, DAILY_GOAL)} <small>/ {DAILY_GOAL} XP</small></strong><i><b style={{ width: `${dailyPercent}%` }} /></i><p>{dailyPercent >= 100 ? "Goal complete. Nice work today." : `${DAILY_GOAL - Math.min(player.dailyXp, DAILY_GOAL)} XP to keep your streak moving.`}</p></div><div className="daily-ring" style={{ "--daily-progress": `${dailyPercent}%` } as React.CSSProperties}>{Math.round(dailyPercent)}%</div></aside></section>
    {continueSport && <section className="continue-card" style={{ "--sport-color": continueSport.color, "--sport-soft": continueSport.softColor } as React.CSSProperties}><div className="sport-mark">{continueSport.mark}</div><div><span>CONTINUE LEARNING</span><h2>{continueSport.name}</h2><p>{player.sports[continueSport.id].completedModules.length ? "Your next lesson is ready." : "Your personalized path is ready to begin."}</p></div><div className="continue-progress"><strong>{player.sports[continueSport.id].xp} XP</strong><i><b style={{ width: `${Math.min(100, player.sports[continueSport.id].completedModules.length * 18)}%` }} /></i></div><button className="primary-button primary-button--small" onClick={onContinue}>Continue <span>→</span></button></section>}
    <section className="sports-hub"><div className="section-heading"><span>CHOOSE YOUR ARENA</span><h2>{startedSports.length ? "Keep learning—or add a new sport." : "What do you want to understand?"}</h2><p>Experience and mastery are tracked independently for every sport.</p></div><div className="sport-card-grid">{SPORTS.map((sport) => { const progress = player.sports[sport.id]; const started = !!progress?.experience; const modules = moduleList(sport); const percent = started ? Math.min(100, Math.round((progress.completedModules.length / (modules.length + sport.positions.length)) * 100)) : 0; return <article className="sport-card" key={sport.id} style={{ "--sport-color": sport.color, "--sport-soft": sport.softColor } as React.CSSProperties}><div className="sport-card-top"><div className="sport-mark">{sport.mark}</div><span>{started ? `${percent}%` : "NEW"}</span></div><h3>{sport.name}</h3><p>{sport.variants.slice(0, 3).join(" · ")}</p><div className="sport-card-progress"><i><b style={{ width: `${percent}%` }} /></i><span>{started ? `${progress.xp} XP · ${progress.completedModules.length} modules` : `${sport.positions.length} position paths`}</span></div><button onClick={() => onChooseSport(sport)}>{started ? "Continue path" : "Start sport"}<span>→</span></button></article>; })}</div></section>
  </>;
}

function ProgressDashboard({ player, strongest, weakest, onChooseSport }: { player: Player; strongest: Array<{ sportId: string; conceptId: string; mastery: Mastery }>; weakest: Array<{ sportId: string; conceptId: string; mastery: Mastery }>; onChooseSport: (sport: Sport) => void }) {
  const started = SPORTS.filter((sport) => player.sports[sport.id]?.experience);
  const modules = Object.values(player.sports).reduce((sum, sport) => sum + sport.completedModules.length, 0);
  const attempts = Object.values(player.sports).flatMap((sport) => Object.values(sport.mastery));
  const accuracy = attempts.length ? Math.round((attempts.reduce((sum, item) => sum + item.correct, 0) / attempts.reduce((sum, item) => sum + item.attempts, 0)) * 100) : 0;
  return <section className="dashboard-page"><div className="section-heading"><span>YOUR SEASON</span><h1>Progress that means something.</h1><p>Mastery reflects what you understand—not how fast you clicked through.</p></div><div className="big-stat-grid"><div><span>TOTAL XP</span><strong>{player.totalXp.toLocaleString()}</strong><small>Across {started.length} sports</small></div><div><span>MODULES</span><strong>{modules}</strong><small>Completed sessions</small></div><div><span>ACCURACY</span><strong>{accuracy}%</strong><small>All-time answers</small></div><div><span>STREAK</span><strong>{player.streak}</strong><small>Consecutive days</small></div></div><div className="progress-columns"><div className="progress-panel"><span>SPORTS IN PROGRESS</span>{started.length ? started.map((sport) => { const progress = player.sports[sport.id]; return <button key={sport.id} onClick={() => onChooseSport(sport)}><div className="sport-mark" style={{ "--sport-color": sport.color, "--sport-soft": sport.softColor } as React.CSSProperties}>{sport.mark}</div><div><strong>{sport.name}</strong><small>{progress.xp} XP · {progress.completedModules.length} complete</small></div><span>→</span></button>; }) : <p>Choose a sport to begin your first path.</p>}</div><div className="mastery-panel"><div><span>STRONGEST CONCEPTS</span>{strongest.length ? strongest.map((item) => <p key={item.conceptId}><b>✓</b>{item.conceptId.replaceAll("-", " ")}<small>{masteryLabel(item.mastery)}</small></p>) : <p>Complete a module to reveal strengths.</p>}</div><div><span>FOCUS NEXT</span>{weakest.length ? weakest.map((item) => <p key={item.conceptId}><b>↗</b>{item.conceptId.replaceAll("-", " ")}<small>{masteryLabel(item.mastery)}</small></p>) : <p>No weak concepts recorded yet.</p>}</div></div></div>{player.recentActivity.length > 0 && <div className="recent-panel"><span>RECENT ACTIVITY</span>{player.recentActivity.map((item, index) => <div key={`${item.title}-${index}`}><strong>{item.title}</strong><p>{item.detail}</p><small>{item.date}</small></div>)}</div>}</section>;
}

function BadgesDashboard({ player }: { player: Player }) {
  return <section className="dashboard-page"><div className="section-heading"><span>TROPHY ROOM</span><h1>Earned through real progress.</h1><p>Locked achievements stay visible so you always know what you’re chasing.</p></div><div className="badge-grid">{BADGES.map((badge) => { const earned = player.badges.includes(badge.id); return <article className={earned ? "earned" : "locked"} key={badge.id}><div>{earned ? badge.mark : "?"}</div><span>{earned ? "EARNED" : "LOCKED"}</span><h2>{badge.name}</h2><p>{badge.description}</p></article>; })}</div></section>;
}

function ProfileDashboard({ player, onSaveName, onReset }: { player: Player; onSaveName: (name: string) => void; onReset: () => void }) {
  const [name, setName] = useState(player.profileName);
  return <section className="dashboard-page"><div className="section-heading"><span>PLAYER PROFILE</span><h1>Your Sports IQ identity.</h1><p>Progress currently saves privately on this device.</p></div><div className="profile-layout"><div className="profile-card"><div className="profile-avatar">{player.profileName.slice(0, 1).toUpperCase()}</div><h2>{player.profileName}</h2><p>{player.totalXp.toLocaleString()} XP · {player.badges.length} badges · {Object.keys(player.sports).length} sports</p></div><form onSubmit={(event) => { event.preventDefault(); if (name.trim()) onSaveName(name.trim()); }}><label htmlFor="profile-name">DISPLAY NAME</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} /><button className="primary-button primary-button--small" type="submit">Save profile <span>→</span></button><hr /><span>DEVICE DATA</span><p>Your experience choices, mastery, XP, badges, and streak are stored in this browser for the current preview.</p><button className="danger-button" type="button" onClick={onReset}>Reset all progress</button></form></div></section>;
}
