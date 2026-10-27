export type GovernanceAgeBand = "7-9" | "10-12" | "13-15" | "16-17" | "18+";
export type GovernanceAccountKind = "guest" | "self" | "child";

export const LEGAL_VERSIONS = {
  privacy: "2026-08-11",
  terms: "2026-08-11",
  measurement: "2026-08-11",
} as const;

export type LegalAcceptance = {
  privacyVersion: string;
  termsVersion: string;
  acceptedAt: string;
  actor: "player-or-responsible-adult";
  scope: "local-beta";
};

export function createLegalAcceptance(now = new Date()): LegalAcceptance {
  return {
    privacyVersion: LEGAL_VERSIONS.privacy,
    termsVersion: LEGAL_VERSIONS.terms,
    acceptedAt: now.toISOString(),
    actor: "player-or-responsible-adult",
    scope: "local-beta",
  };
}

export type MeasurementPreference = "essential-only" | "product-improvement";

export const PRODUCT_EVENT_NAMES = [
  "sport_opened",
  "module_started",
  "lesson_viewed",
  "question_answered",
  "concept_recovered",
  "module_completed",
  "progression_blocked",
  "video_played",
  "video_failed",
  "progress_reset",
] as const;

export type ProductEventName = typeof PRODUCT_EVENT_NAMES[number];
export type ProductEventOutcome = "correct" | "incorrect" | "completed" | "practice" | "failed" | "abandoned";
export type ProductEvent = {
  schemaVersion: 1;
  name: ProductEventName;
  occurredAt: string;
  surface: "web" | "mobile";
  ageBand: GovernanceAgeBand;
  sportId?: string;
  moduleId?: string;
  outcome?: ProductEventOutcome;
  step?: number;
  totalSteps?: number;
};

const EVENT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
export const MAX_LOCAL_PRODUCT_EVENTS = 200;
const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,79}$/;

export function isUnder13(ageBand: GovernanceAgeBand) {
  return ageBand === "7-9" || ageBand === "10-12";
}

export function canCollectProductMeasurement(input: {
  ageBand: GovernanceAgeBand;
  accountKind: GovernanceAccountKind;
  preference: MeasurementPreference;
}) {
  return !isUnder13(input.ageBand) && input.accountKind !== "child" && input.preference === "product-improvement";
}

function safeId(value?: string) {
  return value && SAFE_ID.test(value) ? value : undefined;
}

export function pruneProductEvents(events: ProductEvent[], now = new Date()) {
  const cutoff = now.getTime() - EVENT_RETENTION_MS;
  const currentTime = now.getTime();
  return events.filter((event) => {
    const occurredAt = Date.parse(event.occurredAt);
    return Number.isFinite(occurredAt) && occurredAt >= cutoff && occurredAt <= currentTime;
  }).slice(-MAX_LOCAL_PRODUCT_EVENTS);
}

export function appendProductEvent(
  events: ProductEvent[],
  input: Omit<ProductEvent, "schemaVersion" | "occurredAt"> & { occurredAt?: string },
  policy: { accountKind: GovernanceAccountKind; preference: MeasurementPreference },
  now = new Date(),
) {
  if (!canCollectProductMeasurement({ ageBand: input.ageBand, ...policy })) return events;
  if (!PRODUCT_EVENT_NAMES.includes(input.name)) return events;
  const occurredAt = input.occurredAt ?? now.toISOString();
  if (!Number.isFinite(Date.parse(occurredAt))) return events;

  const next: ProductEvent = {
    schemaVersion: 1,
    name: input.name,
    occurredAt,
    surface: input.surface,
    ageBand: input.ageBand,
    sportId: safeId(input.sportId),
    moduleId: safeId(input.moduleId),
    outcome: input.outcome,
    step: Number.isInteger(input.step) && (input.step as number) >= 0 ? input.step : undefined,
    totalSteps: Number.isInteger(input.totalSteps) && (input.totalSteps as number) > 0 ? input.totalSteps : undefined,
  };
  return [...pruneProductEvents(events, now), next].slice(-MAX_LOCAL_PRODUCT_EVENTS);
}

export type CompletionReceipt = {
  moduleId: string;
  sportId: string;
  firstCompletedAt: string;
  xpAwarded: number;
  bestCorrect: number;
  questionCount: number;
};

export function canStartLearningModule(input: {
  moduleId: string;
  modulePaths: Array<{ id: string; moduleIds: string[] }>;
  completedModuleIds: string[];
}) {
  const completed = new Set(input.completedModuleIds);
  const path = input.modulePaths.find((candidate) => candidate.moduleIds.includes(input.moduleId));
  if (!path) return false;
  const moduleIndex = path.moduleIds.indexOf(input.moduleId);
  return path.moduleIds.slice(0, moduleIndex).every((id) => completed.has(id));
}

export function calculateCompletionAward(input: {
  answerXp: number;
  completionBonus: number;
  perfectBonus: number;
  alreadyCompleted: boolean;
}) {
  if (input.alreadyCompleted) return { xpAwarded: 0, bonusAwarded: 0, firstCompletion: false };
  const answerXp = Math.max(0, Math.min(500, Math.round(input.answerXp)));
  const completionBonus = Math.max(0, Math.min(100, Math.round(input.completionBonus)));
  const perfectBonus = Math.max(0, Math.min(100, Math.round(input.perfectBonus)));
  return {
    xpAwarded: answerXp + completionBonus + perfectBonus,
    bonusAwarded: completionBonus + perfectBonus,
    firstCompletion: true,
  };
}

export function completedRequiredQuestions(requiredQuestionIds: string[], answeredQuestionIds: string[]) {
  if (requiredQuestionIds.length === 0) return false;
  const answered = new Set(answeredQuestionIds);
  return requiredQuestionIds.every((id) => answered.has(id));
}

export function buildLocalDataExport<T>(surface: "web" | "mobile", profile: T, now = new Date()) {
  return {
    exportVersion: 1,
    exportedAt: now.toISOString(),
    surface,
    storage: "local-device",
    profile,
  };
}
