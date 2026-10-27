// Existing MDI assets provide consistent, non-photographic learning cards.
export function conceptIcon(term: string): string {
  const text = term.toLowerCase();
  if (/quarterback|passer|pitcher/.test(text)) return "account-arrow-right-outline";
  if (/offense|attacker|forward|hitter|batter/.test(text)) return "account-arrow-right";
  if (/defen|block|goalkeeper|catcher/.test(text)) return "shield-account-outline";
  if (/team|battery|linebacker|wing|guard|midfielder|big/.test(text)) return "account-group-outline";
  if (/goal|basket|touchdown|end zone|finish|shot|point|run$/.test(text)) return "bullseye-arrow";
  if (/clock|time|inning|rally|down|quarter|count/.test(text)) return "timer-outline";
  if (/pass|throw|pitch|serve|snap|handoff/.test(text)) return "arrow-right-bold-circle-outline";
  if (/field|court|line|paint|base|zone|area|gap|space|width|depth|edge/.test(text)) return "map-marker-outline";
  if (/cut|route|dribble|roll|approach|rotation|transition|overlap/.test(text)) return "routes";
  if (/foul|card|out|violation|error|restriction/.test(text)) return "whistle-outline";
  if (/read|scan|plan|scout|coverage|system|counter|adjust|leverage|matchup/.test(text)) return "strategy";
  return "star-outline";
}
