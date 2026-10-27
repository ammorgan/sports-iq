import type { LearningModule } from "./learning-data";

export type GamePathNodeKind =
  | "film"
  | "audio"
  | "field-read"
  | "match"
  | "scenario"
  | "review"
  | "checkpoint"
  | "boss";

export type GamePathNode = {
  id: string;
  kind: GamePathNodeKind;
  title: string;
  shortLabel: string;
  description: string;
  module: LearningModule;
  required?: boolean;
  legacyCompletionIds?: string[];
};

export type GamePathUnit = {
  id: string;
  sportId: string;
  track: "general" | "position";
  position?: string;
  title: string;
  objective: string;
  nodes: GamePathNode[];
};

export type GamePathNodeState = "complete" | "current" | "locked";

const SHORT_LABELS: Record<GamePathNodeKind, string> = {
  film: "FILM ROOM",
  audio: "COACH AUDIO",
  "field-read": "FIELD READ",
  match: "MATCH-UP",
  scenario: "PLAY CALL",
  review: "FILM REVIEW",
  checkpoint: "CHECKPOINT",
  boss: "GAME DAY",
};

export function gamePathUnitFromContent(path: {
  id: string;
  sportId: string;
  pathway: "general" | "position";
  position?: string;
  title: string;
  summary: string;
  nodes: Array<{
    id: string;
    kind: GamePathNodeKind;
    title: string;
    summary: string;
    module: LearningModule;
    legacyCompletionIds?: string[];
  }>;
}): GamePathUnit {
  return {
    id: path.id,
    sportId: path.sportId,
    track: path.pathway,
    position: path.position,
    title: path.title,
    objective: path.summary,
    nodes: path.nodes.map((node) => ({
      id: node.id,
      kind: node.kind,
      title: node.title,
      shortLabel: SHORT_LABELS[node.kind],
      description: node.summary,
      module: node.module,
      legacyCompletionIds: node.legacyCompletionIds,
    })),
  };
}

function completedNodeIds(unit: GamePathUnit, completionIds: string[]) {
  const completed = new Set(completionIds);
  return new Set(unit.nodes.filter((node) =>
    completed.has(node.id)
    || completed.has(node.module.id)
    || node.legacyCompletionIds?.some((id) => completed.has(id)),
  ).map((node) => node.id));
}

export function gamePathNodeStates(unit: GamePathUnit, completionIds: string[]) {
  const completed = completedNodeIds(unit, completionIds);
  const states = new Map<string, GamePathNodeState>();
  let progressionGapFound = false;

  unit.nodes.forEach((node) => {
    if (!progressionGapFound && completed.has(node.id)) {
      states.set(node.id, "complete");
      return;
    }
    if (!progressionGapFound) {
      states.set(node.id, "current");
      progressionGapFound = true;
      return;
    }
    states.set(node.id, "locked");
  });

  return states;
}

export function gamePathProgress(unit: GamePathUnit, completionIds: string[]) {
  const states = gamePathNodeStates(unit, completionIds);
  const completed = [...states.values()].filter((state) => state === "complete").length;
  const total = unit.nodes.length;
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    currentNode: unit.nodes.find((node) => states.get(node.id) === "current") ?? null,
  };
}

export function gamePathStageState(nodes: GamePathNode[], states: Map<string, GamePathNodeState>): GamePathNodeState {
  if (nodes.length > 0 && nodes.every((node) => states.get(node.id) === "complete")) return "complete";
  if (nodes.some((node) => states.get(node.id) === "current")) return "current";
  return "locked";
}

export function gamePathStageTarget(nodes: GamePathNode[], states: Map<string, GamePathNodeState>) {
  return nodes.find((node) => states.get(node.id) === "current")
    ?? [...nodes].reverse().find((node) => states.get(node.id) === "complete")
    ?? nodes[0];
}

export function gamePathModules(unit: GamePathUnit) {
  return unit.nodes.map((node) => node.module);
}

export function migrateGamePathCompletionIds(units: GamePathUnit[], completionIds: string[]) {
  const migrated = new Set(completionIds);
  units.forEach((unit) => unit.nodes.forEach((node) => {
    if (node.legacyCompletionIds?.some((legacyId) => migrated.has(legacyId))) migrated.add(node.id);
  }));
  return [...migrated];
}
