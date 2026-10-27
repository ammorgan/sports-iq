import { COURSE_SECTIONS, type CoreCourse, type CoreSportId, type CourseSection } from "../core-course.ts";
import { footballExtra } from "./football-extra.ts";
import { basketballExtra } from "./basketball-extra.ts";
import { baseballExtra } from "./baseball-extra.ts";
import { soccerExtra } from "./soccer-extra.ts";
import { volleyballExtra } from "./volleyball-extra.ts";
import { ADVANCED_DECISIONS } from "./advanced-decisions.ts";

// Stable section and unit IDs, rather than a fixed number of lessons per stage.
// New lessons can be inserted without a database migration or renumbering receipts.
const sectionIds = ["meet","action","rules","attack","defend","skills","team","reads","pressure","advanced"];
const extras = {football:footballExtra,basketball:basketballExtra,baseball:baseballExtra,soccer:soccerExtra,volleyball:volleyballExtra};
const layout:Record<CoreSportId,string[][]> = {
 football:[
  ["meet-the-game","field-and-players","points-and-downs"],
  ["field-and-snap","runs-and-passes","game-clock"],
  ["safety-and-tries","flags-and-kicks","change-of-possession"],
  ["offensive-roles","quarterback-role","center-role","guard-roles","tackle-roles","back-roles","receiver-role","tight-end-role"],
  ["defensive-front","inside-linebacker-role","outside-linebacker-role","cornerback-role","safety-role","defensive-roles"],
  ["catch-and-carry","routes-and-space","blocking-and-gaps"],
  ["team-communication","run-teamwork","kicking-roles","special-teams-and-support"],
  ["down-distance","coverage-basics","man-and-motion"],
  ["run-pass-reads","pressure-and-protection","red-zone"],
  ["coverage-adjustments","high-low-tradeoff","game-management"],
 ],
 basketball:[
  ["meet-the-game","court-and-lineup","court-and-points","scoreboard"],
  ["one-possession","dribble-and-pivot","double-dribble"],
  ["boundaries-and-fouls","free-throws-and-bonus","clock-and-restarts"],
  ["five-roles","point-guard","shooting-guard","small-forward","power-forward","center"],
  ["on-ball-defense","off-ball-defense","defense-and-rebounding","transition-defense"],
  ["passing-and-catching","passing-options","finishing-and-shooting","shooting-space"],
  ["give-and-go","legal-screens","spacing-and-screens","team-defense"],
  ["transition","pick-and-roll-reads","pressure-and-shot-value","zone-attack"],
  ["screen-defense","inbound-play","weak-side-rotation"],
  ["advanced-coverages","possession-planning","late-game","pro-game-plan"],
 ],
 baseball:[
  ["meet-the-game","field-and-team","diamond-and-outs","hits-and-runs"],
  ["batting-order","pitch-and-count","walks-and-strikeouts","ball-in-play"],
  ["fair-foul-and-catches","force-and-tag","runs-and-innings"],
  ["batter-role","base-runner-role","designated-hitter"],
  ["pitcher-role","catcher-role","first-base-role","second-base-role","shortstop-role","third-base-role","left-field-role","center-field-role","right-field-role"],
  ["hit-with-a-plan","field-and-throw","running-and-tagging"],
  ["pitcher-catcher","infield-teamwork","outfield-relays"],
  ["situational-defense","count-and-pitch-plan","steals-and-pressure"],
  ["bunt-and-foul-tip","infield-fly","base-out-plan"],
  ["advanced-positioning","bullpen-and-matchups","final-inning"],
 ],
 soccer:[
  ["meet-the-game","pitch-and-teams","teams-and-time","score-and-result"],
  ["kickoff-and-ball-out","one-attack","restarts"],
  ["fouls-and-cards","free-kicks-and-penalties","offside-first-look"],
  ["team-roles","striker-role","winger-role","attacking-midfielder","central-midfielder"],
  ["goalkeeper-role","center-back-role","fullback-role","holding-midfielder"],
  ["first-touch","receiving-body-shape","passing-and-support","shooting-choice","defending-and-finishing","defending-one-on-one"],
  ["combination-play","width-and-depth","team-shape","defensive-lines"],
  ["transition","break-the-lines","pressing-triggers"],
  ["counterattack-balance","switch-and-overload","press-escape"],
  ["advanced-buildup","set-plays","manage-the-match"],
 ],
 volleyball:[
  ["meet-the-game","court-and-six","court-and-players"],
  ["rally-and-whistle","three-contacts","serve-and-score"],
  ["rotation-spots","rotation","serve-faults","legal-contacts","net-and-centerline"],
  ["specialist-roles","setter-role","outside-hitter-role","opposite-role","server-role"],
  ["middle-blocker-role","libero-role","defensive-specialist-role","front-and-back-roles"],
  ["forearm-pass","serve-receive","setting-and-attack","attack-options","dig-and-cover"],
  ["three-contact-teamwork","serve-receive-shape","block-and-dig","block-and-defense"],
  ["read-the-setter","serve-with-purpose","transition-attack"],
  ["out-of-system","read-the-block","advanced-attack-reads"],
  ["systems-and-rotations","rotation-game-plan","close-the-match"],
 ],
};
export function expandCourse(base:CoreCourse):CoreCourse {
 const authored=[...base.units,...extras[base.sportId]];
 const byId=new Map(authored.map((unit)=>[unit.slug,unit]));
 if(byId.size!==authored.length)throw new Error(`Duplicate unit in ${base.sportId}`);
 const placed=layout[base.sportId].flat();
 if(new Set(placed).size!==placed.length || placed.length!==authored.length)throw new Error(`Incomplete layout in ${base.sportId}`);
 const sections:CourseSection[]=layout[base.sportId].map((unitIds,index)=>({id:sectionIds[index],title:COURSE_SECTIONS[index].title,outcome:COURSE_SECTIONS[index].outcome,unitIds}));
 if(base.sportId==="baseball") {sections[3].title="Batting and running roles";sections[4].title="Meet the nine defenders";}
 if(base.sportId==="volleyball") {sections[3].title="Build the attack";sections[4].title="Meet the defending roles";}
 return {...base,sections,units:placed.map((id)=>{
  const unit=byId.get(id);if(!unit)throw new Error(`Unknown unit ${base.sportId}/${id}`);
  return {...unit,decisions:[...unit.decisions,...(ADVANCED_DECISIONS[`${base.sportId}:${id}`]??[])]};
 })};
}
