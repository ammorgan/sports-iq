export type ContentSource = {
  id: string;
  sportId: string;
  authority: string;
  title: string;
  ruleset: string;
  url: string;
  reviewedOn: string;
  reviewDueOn: string;
};

export const PILOT_SPORT_IDS = ["football", "flag-football", "basketball", "soccer", "mma"] as const;

export const CONTENT_SOURCES: ContentSource[] = [
  {
    id: "nfl-2025-rules",
    sportId: "football",
    authority: "NFL Football Operations",
    title: "2025 NFL Rulebook",
    ruleset: "Professional 11-player tackle football",
    url: "https://operations.nfl.com/rules-officiating/2025-nfl-rulebook/",
    reviewedOn: "2026-08-10",
    reviewDueOn: "2027-02-10",
  },
  {
    id: "ifaf-flag-rules",
    sportId: "flag-football",
    authority: "International Federation of American Football",
    title: "IFAF Flag Football Rules",
    ruleset: "International 5-on-5 flag football; variant differences are labeled",
    url: "https://www.americanfootball.sport/ifaf-rules/",
    reviewedOn: "2026-08-10",
    reviewDueOn: "2027-02-10",
  },
  {
    id: "fiba-2024-rules",
    sportId: "basketball",
    authority: "FIBA",
    title: "Official Basketball Rules 2024",
    ruleset: "International basketball; NBA, WNBA, NCAA, and youth differences are labeled",
    url: "https://refereeing.fiba.basketball/en/rules",
    reviewedOn: "2026-08-10",
    reviewDueOn: "2027-02-10",
  },
  {
    id: "ifab-2026-laws",
    sportId: "soccer",
    authority: "The International Football Association Board",
    title: "Laws of the Game 2026/27",
    ruleset: "Association football",
    url: "https://www.theifab.com/laws/latest/",
    reviewedOn: "2026-08-10",
    reviewDueOn: "2027-02-10",
  },
  {
    id: "abc-unified-mma",
    sportId: "mma",
    authority: "Association of Boxing Commissions and Combative Sports",
    title: "Unified Rules of Mixed Martial Arts",
    ruleset: "Professional unified-rules MMA; amateur differences are labeled",
    url: "https://www.abcboxing.com/unified-rules/",
    reviewedOn: "2026-08-10",
    reviewDueOn: "2027-02-10",
  },
];

export function sourcesForSport(sportId: string) {
  return CONTENT_SOURCES.filter((source) => source.sportId === sportId);
}
