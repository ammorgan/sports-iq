"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildRound,
  CATEGORY_LABELS,
  type GameCategory,
  type Question,
} from "./questions";

const ROUND_SIZE = 10;
const QUESTION_TIME = 20;
const BEST_SCORE_KEY = "sports-iq-best-score";
const CHOICE_KEYS = ["A", "B", "C", "D"];

type Screen = "home" | "game" | "results";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? "logo--compact" : ""}`} aria-label="Sports IQ">
      <span>SPORTS</span>
      <strong>IQ</strong>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [category, setCategory] = useState<GameCategory>("all");
  const [round, setRound] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentQuestion = round[questionIndex];
  const questionAnswered = selectedAnswer !== null;

  useEffect(() => {
    const storedBest = Number(window.localStorage.getItem(BEST_SCORE_KEY) ?? 0);
    if (Number.isFinite(storedBest)) setBestScore(storedBest);
  }, []);

  const startGame = useCallback(() => {
    setRound(buildRound(category, ROUND_SIZE));
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(QUESTION_TIME);
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
    setCopied(false);
    setScreen("game");
  }, [category]);

  const chooseAnswer = useCallback((answerIndex: number) => {
    if (!currentQuestion || selectedAnswer !== null || answerIndex < 0) return;

    setSelectedAnswer(answerIndex);
    if (answerIndex === currentQuestion.answer) {
      const points = 750 + timeLeft * 25 + streak * 75;
      setScore((value) => value + points);
      setCorrectAnswers((value) => value + 1);
      setStreak((value) => value + 1);
    } else {
      setStreak(0);
    }
  }, [currentQuestion, selectedAnswer, streak, timeLeft]);

  useEffect(() => {
    if (screen !== "game" || questionAnswered) return;
    if (timeLeft === 0) {
      setSelectedAnswer(-1);
      setStreak(0);
      return;
    }

    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [questionAnswered, screen, timeLeft]);

  const finishGame = useCallback(() => {
    setBestScore((currentBest) => {
      const nextBest = Math.max(currentBest, score);
      window.localStorage.setItem(BEST_SCORE_KEY, String(nextBest));
      return nextBest;
    });
    setScreen("results");
  }, [score]);

  const nextQuestion = useCallback(() => {
    if (!questionAnswered) return;
    if (questionIndex >= round.length - 1) {
      finishGame();
      return;
    }

    setQuestionIndex((value) => value + 1);
    setSelectedAnswer(null);
    setTimeLeft(QUESTION_TIME);
  }, [finishGame, questionAnswered, questionIndex, round.length]);

  useEffect(() => {
    if (screen !== "game") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const choiceIndex = ["1", "2", "3", "4", "a", "b", "c", "d"].indexOf(event.key.toLowerCase());
      if (choiceIndex >= 0) chooseAnswer(choiceIndex % 4);
      if (event.key === "Enter" && questionAnswered) nextQuestion();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chooseAnswer, nextQuestion, questionAnswered, screen]);

  const performance = useMemo(() => {
    const accuracy = round.length ? correctAnswers / round.length : 0;
    if (accuracy === 1) return { label: "Hall of Fame", note: "Perfect. No notes." };
    if (accuracy >= 0.8) return { label: "All-Star", note: "You know your arena." };
    if (accuracy >= 0.6) return { label: "Starter", note: "A strong showing." };
    return { label: "Prospect", note: "Run it back and level up." };
  }, [correctAnswers, round.length]);

  const copyResult = async () => {
    const text = `I scored ${score.toLocaleString()} in Sports IQ — ${correctAnswers}/${round.length} correct. Think you can beat me?`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (screen === "game" && currentQuestion) {
    const isCorrect = selectedAnswer === currentQuestion.answer;
    const progress = ((questionIndex + 1) / round.length) * 100;

    return (
      <main className="game-shell">
        <header className="game-header">
          <button className="brand-button" onClick={() => setScreen("home")} aria-label="Exit game and return home">
            <Logo compact />
          </button>
          <div className="scoreboard" aria-label={`Score ${score.toLocaleString()}, streak ${streak}`}>
            <span>SCORE <strong>{score.toLocaleString()}</strong></span>
            <i aria-hidden="true" />
            <span>STREAK <strong>{streak}×</strong></span>
          </div>
        </header>

        <section className="question-stage" aria-live="polite">
          <div className="progress-row">
            <div>
              <span>QUESTION</span>
              <strong>{String(questionIndex + 1).padStart(2, "0")} / {String(round.length).padStart(2, "0")}</strong>
            </div>
            <div className={`timer ${timeLeft <= 5 && !questionAnswered ? "timer--urgent" : ""}`} aria-label={`${timeLeft} seconds remaining`}>
              <span className="timer-ring" style={{ "--timer-progress": `${timeLeft / QUESTION_TIME}` } as React.CSSProperties}>
                {timeLeft}
              </span>
              <small>SECONDS</small>
            </div>
          </div>
          <div className="progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>

          <div className="question-meta">
            <span>{currentQuestion.sport}</span>
            <span>{currentQuestion.difficulty}</span>
          </div>
          <h1>{currentQuestion.prompt}</h1>

          <div className="answers" role="group" aria-label="Answer choices">
            {currentQuestion.choices.map((choice, index) => {
              const answerIsCorrect = questionAnswered && index === currentQuestion.answer;
              const answerIsWrong = questionAnswered && index === selectedAnswer && !isCorrect;
              return (
                <button
                  key={choice}
                  className={`answer ${answerIsCorrect ? "answer--correct" : ""} ${answerIsWrong ? "answer--wrong" : ""}`}
                  onClick={() => chooseAnswer(index)}
                  disabled={questionAnswered}
                  aria-label={`${CHOICE_KEYS[index]}: ${choice}`}
                >
                  <span>{CHOICE_KEYS[index]}</span>
                  <strong>{choice}</strong>
                  {answerIsCorrect && <em aria-label="Correct">✓</em>}
                  {answerIsWrong && <em aria-label="Incorrect">×</em>}
                </button>
              );
            })}
          </div>

          {questionAnswered && (
            <div className={`answer-reveal ${isCorrect ? "answer-reveal--correct" : ""}`}>
              <div>
                <span>{isCorrect ? "RIGHT CALL" : selectedAnswer === -1 ? "TIME EXPIRED" : "NOT THIS TIME"}</span>
                <p>{currentQuestion.fact}</p>
              </div>
              <button className="next-button" onClick={nextQuestion} autoFocus>
                {questionIndex === round.length - 1 ? "See results" : "Next question"}<span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (screen === "results") {
    const accuracy = round.length ? Math.round((correctAnswers / round.length) * 100) : 0;
    return (
      <main className="results-shell">
        <div className="results-card">
          <Logo compact />
          <span className="eyebrow">FINAL WHISTLE</span>
          <h1>{performance.label}</h1>
          <p className="results-note">{performance.note}</p>

          <div className="final-score">
            <small>FINAL SCORE</small>
            <strong>{score.toLocaleString()}</strong>
            {score >= bestScore && score > 0 && <span>NEW PERSONAL BEST</span>}
          </div>

          <div className="stat-grid">
            <div><strong>{correctAnswers}/{round.length}</strong><span>CORRECT</span></div>
            <div><strong>{accuracy}%</strong><span>ACCURACY</span></div>
            <div><strong>{bestScore.toLocaleString()}</strong><span>BEST SCORE</span></div>
          </div>

          <div className="results-actions">
            <button className="primary-button" onClick={startGame}>Play again <span aria-hidden="true">↻</span></button>
            <button className="secondary-button" onClick={copyResult}>{copied ? "Copied!" : "Copy result"}</button>
          </div>
          <button className="text-button" onClick={() => setScreen("home")}>Change game mode</button>
        </div>
      </main>
    );
  }

  return (
    <main className="home-shell">
      <header className="home-header">
        <Logo />
        <div className="best-score" aria-label={`Personal best ${bestScore.toLocaleString()}`}>
          <span>PERSONAL BEST</span>
          <strong>{bestScore.toLocaleString()}</strong>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><i /> THE ARENA IS OPEN</span>
          <h1>HOW DEEP DOES YOUR <em>SPORTS KNOWLEDGE</em> GO?</h1>
          <p>Ten questions. Twenty seconds each. One chance to prove you know the game beyond the scoreboard.</p>

          <fieldset className="mode-picker">
            <legend>CHOOSE YOUR GAME</legend>
            <div>
              {(Object.keys(CATEGORY_LABELS) as GameCategory[]).map((value) => (
                <button
                  key={value}
                  className={category === value ? "active" : ""}
                  onClick={() => setCategory(value)}
                  aria-pressed={category === value}
                >
                  {CATEGORY_LABELS[value]}
                </button>
              ))}
            </div>
          </fieldset>

          <button className="start-button" onClick={startGame}>
            Start the challenge <span aria-hidden="true">→</span>
          </button>
          <p className="keyboard-hint"><kbd>1</kbd>–<kbd>4</kbd> or <kbd>A</kbd>–<kbd>D</kbd> to answer <span>•</span> <kbd>Enter</kbd> to advance</p>
        </div>

        <aside className="game-card" aria-label="Game format">
          <span className="card-kicker">TODAY’S CHALLENGE</span>
          <div className="card-number">10</div>
          <h2>QUESTIONS<br />FOR THE GLORY</h2>
          <div className="card-stats">
            <div><strong>20</strong><span>SEC / QUESTION</span></div>
            <div><strong>4</strong><span>GAME MODES</span></div>
          </div>
          <div className="card-stripe"><span>TRIVIA • RECORDS • RIVALRIES • LEGENDS • </span></div>
        </aside>
      </section>

      <footer className="home-footer">
        <span>BUILT FOR FANS WHO KNOW</span>
        <div><i /> BASKETBALL <i /> FOOTBALL <i /> BASEBALL <i /> HOCKEY <i /> & MORE</div>
      </footer>
    </main>
  );
}
