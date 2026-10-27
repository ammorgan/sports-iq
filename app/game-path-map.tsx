"use client";

import MdiReact from "@mdi/react";
import {
  mdiAccountOutline,
  mdiArrowRightBold,
  mdiCheckBold,
  mdiClipboardCheckOutline,
  mdiFootball,
  mdiHeadphones,
  mdiHomeOutline,
  mdiLockOutline,
  mdiMapMarkerPath,
  mdiMoviePlayOutline,
  mdiPuzzleOutline,
  mdiRefresh,
  mdiShieldStarOutline,
  mdiStrategy,
  mdiViewGridOutline,
} from "@mdi/js";
import type { CSSProperties, ReactNode } from "react";
import { gamePathNodeStates, gamePathProgress, gamePathStageState, gamePathStageTarget, type GamePathNodeKind, type GamePathUnit } from "./game-path";
import type { LearningModule } from "./learning-data";

// @mdi/react ships CommonJS. Vinext exposes that bundle as a namespace object,
// while TypeScript models its default export as the component itself.
const Icon = ((MdiReact as unknown as { Icon?: typeof MdiReact }).Icon ?? MdiReact) as typeof MdiReact;

const ICONS: Record<GamePathNodeKind, string> = {
  film: mdiMoviePlayOutline,
  audio: mdiHeadphones,
  "field-read": mdiMapMarkerPath,
  match: mdiPuzzleOutline,
  scenario: mdiStrategy,
  review: mdiRefresh,
  checkpoint: mdiClipboardCheckOutline,
  boss: mdiShieldStarOutline,
};

const NODE_POSITIONS = [
  { x: 51, y: 15 },
  { x: 39, y: 25 },
  { x: 60, y: 36 },
  { x: 39, y: 48 },
  { x: 62, y: 60 },
  { x: 39, y: 72 },
  { x: 60, y: 83 },
  { x: 48, y: 93 },
];

const LOCKER_STAGES: Array<{
  id: "watch" | "build" | "call";
  label: string;
  note: string;
  icon: string;
  kinds: GamePathNodeKind[];
}> = [
  { id: "watch", label: "WATCH THE PLAY", note: "See how it works", icon: mdiMoviePlayOutline, kinds: ["film", "audio"] },
  { id: "build", label: "BUILD THE PLAY", note: "Put the pieces together", icon: mdiMapMarkerPath, kinds: ["field-read", "match"] },
  { id: "call", label: "MAKE THE CALL", note: "Choose in game time", icon: mdiStrategy, kinds: ["scenario", "review", "checkpoint"] },
];

type PathStyle = CSSProperties & { "--node-x": string; "--node-y": string; "--path-color": string };

type GamePathMapProps = {
  unit: GamePathUnit;
  completionIds: string[];
  avatarSrc: string;
  sportColor: string;
  onStart: (module: LearningModule) => void;
  variant?: "classic" | "locker";
  onChoosePositionPath?: () => void;
  onNavigateHome?: () => void;
  onNavigatePlayer?: () => void;
  filmPreview?: ReactNode;
};

function LockerGamePath({
  unit,
  completionIds,
  avatarSrc,
  onStart,
  onChoosePositionPath,
  onNavigateHome,
  onNavigatePlayer,
  filmPreview,
}: GamePathMapProps) {
  const states = gamePathNodeStates(unit, completionIds);
  const progress = gamePathProgress(unit, completionIds);
  const activeNode = progress.currentNode ?? unit.nodes.at(-1) ?? null;
  const gameDayNode = unit.nodes.find((node) => node.kind === "boss") ?? unit.nodes.at(-1) ?? null;
  const gameDayState = gameDayNode ? states.get(gameDayNode.id) ?? "locked" : "locked";

  return <section className="locker-journey" aria-labelledby={`${unit.id}-title`}>
    <header className="locker-journey-heading">
      <div className="locker-sport-icon" aria-hidden="true"><Icon path={mdiFootball} size={1.45} /></div>
      <div className="locker-heading-copy"><span>TACKLE FOOTBALL</span><h2 id={`${unit.id}-title`}>ROOKIE SEASON</h2></div>
      <strong className="locker-count">{progress.completed} OF {progress.total}</strong>
      <div className="locker-progress-dots" aria-label={`${progress.completed} of ${progress.total} reps complete`}>
        {unit.nodes.map((node) => <i key={node.id} className={`locker-progress-dot locker-progress-dot--${states.get(node.id) ?? "locked"}`} />)}
      </div>
    </header>

    <div className="locker-scene">
      {gameDayNode && <button
        type="button"
        className={`locker-game-day locker-stage--${gameDayState}`}
        disabled={gameDayState === "locked"}
        onClick={() => onStart(gameDayNode.module)}
        aria-label={`${gameDayState === "locked" ? "Locked" : gameDayState === "complete" ? "Practice" : "Start"}: Game Day`}
      >
        <Icon path={gameDayState === "locked" ? mdiLockOutline : gameDayState === "complete" ? mdiCheckBold : mdiShieldStarOutline} size={1.2} />
        <span>GAME DAY</span>
      </button>}

      <div className="locker-stations" aria-label="Rookie Season training stages">
        {LOCKER_STAGES.map((stage) => {
          const nodes = unit.nodes.filter((node) => stage.kinds.includes(node.kind));
          const state = gamePathStageState(nodes, states);
          const target = gamePathStageTarget(nodes, states);
          return <button
            type="button"
            key={stage.id}
            className={`locker-station locker-station--${stage.id} locker-stage--${state}`}
            disabled={state === "locked" || !target}
            onClick={() => target && onStart(target.module)}
            aria-current={state === "current" ? "step" : undefined}
            aria-label={`${state === "locked" ? "Locked" : state === "complete" ? "Practice" : "Continue"}: ${stage.label}`}
          >
            <Icon path={state === "complete" ? mdiCheckBold : state === "locked" ? mdiLockOutline : stage.icon} size={1.35} />
            <strong>{stage.label}</strong>
            <small>{state === "locked" ? "Finish the stage before" : state === "complete" ? "Stage cleared" : stage.note}</small>
          </button>;
        })}
      </div>

      <div className="locker-coach" aria-hidden="true"><span style={{ backgroundImage: `url(${avatarSrc})` }} /></div>
      <div className="locker-coach-callout"><span>YOUR NEXT REP</span><strong>{activeNode?.title ?? "Game Day"}</strong><small>Watch. Choose. See why.</small></div>

      {activeNode && <div className="locker-console">
        <span>{progress.currentNode ? "NEXT REP" : "SEASON COMPLETE"}</span>
        <strong>{progress.currentNode?.title ?? "PRACTICE GAME DAY"}</strong>
        <button type="button" onClick={() => onStart(activeNode.module)}>
          {progress.currentNode ? "ENTER THE FIELD" : "PLAY AGAIN"}
          <Icon path={mdiArrowRightBold} size={1} aria-hidden="true" />
        </button>
      </div>}
    </div>

    {filmPreview && <div className="locker-film-preview">{filmPreview}</div>}

    <div className="locker-path-switch">
      <button type="button" className="locker-learn-active" aria-current="page"><Icon path={mdiMapMarkerPath} size={1} /><span><strong>LEARN THE GAME</strong><small>Rookie Season journey</small></span><Icon path={mdiCheckBold} size={.85} /></button>
      {onChoosePositionPath && <button type="button" onClick={onChoosePositionPath}><Icon path={mdiStrategy} size={1} /><span><strong>POSITION IQ</strong><small>Train a football role</small></span><Icon path={mdiArrowRightBold} size={.85} /></button>}
    </div>

    {(onNavigateHome || onNavigatePlayer) && <nav className="locker-mobile-nav" aria-label="Youth navigation">
      <button type="button" onClick={onNavigateHome}><Icon path={mdiHomeOutline} size={1.1} /><span>HOME</span></button>
      <button type="button" className="active" onClick={onNavigateHome}><Icon path={mdiViewGridOutline} size={1.1} /><span>SPORTS</span></button>
      <button type="button" onClick={onNavigatePlayer}><Icon path={mdiAccountOutline} size={1.1} /><span>PLAYER</span></button>
    </nav>}
  </section>;
}

function ClassicGamePath({ unit, completionIds, avatarSrc, sportColor, onStart }: GamePathMapProps) {
  const states = gamePathNodeStates(unit, completionIds);
  const progress = gamePathProgress(unit, completionIds);
  const activeNode = progress.currentNode ?? unit.nodes.at(-1) ?? null;
  const activeIndex = activeNode ? unit.nodes.findIndex((node) => node.id === activeNode.id) : 0;
  const activePosition = NODE_POSITIONS[activeIndex] ?? NODE_POSITIONS[0];

  return <section className="game-path" style={{ "--path-color": sportColor } as CSSProperties} aria-labelledby={`${unit.id}-title`}>
    <header className="game-path-heading">
      <div><span>UNIT 1 · YOUR NEXT DRIVE</span><h2 id={`${unit.id}-title`}>{unit.title}</h2><p>{unit.objective}</p></div>
      <div className="game-path-count" aria-label={`${progress.completed} of ${progress.total} path nodes complete`}><strong>{progress.completed}/{progress.total}</strong><span>NODES</span></div>
    </header>
    <div className="game-path-progress" aria-hidden="true"><i style={{ width: `${progress.percent}%` }} /></div>
    <div className="game-path-arena">
      <div className={`game-path-coach ${activePosition.x > 50 ? "game-path-coach--left" : "game-path-coach--right"}`} style={{ top: `${Math.min(82, activePosition.y + 3)}%` }}>
        <span className="game-path-coach-avatar" style={{ backgroundImage: `url(${avatarSrc})` }} aria-hidden="true" />
        <span className="game-path-coach-callout">{progress.currentNode ? <>YOUR NEXT REP<br /><strong>{progress.currentNode.title}</strong></> : <>UNIT CLEARED<br /><strong>GAME DAY READY</strong></>}</span>
      </div>
      {unit.nodes.map((node, index) => {
        const position = NODE_POSITIONS[index] ?? { x: index % 2 ? 39 : 61, y: 15 + (index * 10) };
        const state = states.get(node.id) ?? "locked";
        const style = { "--node-x": `${position.x}%`, "--node-y": `${position.y}%`, "--path-color": sportColor } as PathStyle;
        return <div className={`game-path-stop game-path-stop--${state}`} style={style} key={node.id}>
          <button type="button" disabled={state === "locked"} onClick={() => onStart(node.module)} aria-label={`${state === "complete" ? "Practice" : state === "current" ? "Start" : "Locked"}: ${node.title}`} aria-current={state === "current" ? "step" : undefined}>
            <Icon path={state === "complete" ? mdiCheckBold : state === "locked" ? mdiLockOutline : ICONS[node.kind]} size={1.35} aria-hidden="true" />
          </button>
          <div><span>{state === "complete" ? "CLEARED" : state === "current" ? "PLAY NEXT" : "LOCKED"}</span><strong>{node.title}</strong><small>{node.description}</small></div>
        </div>;
      })}
    </div>
    {activeNode && <button type="button" className="game-path-play" onClick={() => onStart(activeNode.module)}>{progress.currentNode ? "PLAY NEXT REP" : "PRACTICE GAME DAY"}<Icon path={ICONS[activeNode.kind]} size={1} aria-hidden="true" /></button>}
  </section>;
}

export function GamePathMap(props: GamePathMapProps) {
  return props.variant === "locker" ? <LockerGamePath {...props} /> : <ClassicGamePath {...props} />;
}
