import type { CoreSportId } from "./core-course.ts";
export type FormationKind="football-offense"|"football-defense"|"basketball"|"baseball"|"soccer"|"volleyball";
export type FormationPlayer={role:string;x:number;y:number};
export type FormationSpec={title:string;orientation:string;players:FormationPlayer[];note:string};
export const FORMATIONS:Record<FormationKind,FormationSpec>={
 "football-offense":{title:"Offense before the snap",orientation:"Attack toward the top",note:"One example alignment. Left and right are from the offense's view.",players:[
  {role:"LT",x:25,y:42},{role:"LG",x:37,y:42},{role:"C",x:50,y:42},{role:"RG",x:63,y:42},{role:"RT",x:75,y:42},
  {role:"QB",x:50,y:63},{role:"RB",x:50,y:85},{role:"TE",x:87,y:42},{role:"WR",x:10,y:42},{role:"Slot",x:17,y:59},{role:"Wide",x:90,y:61}]},
 "football-defense":{title:"Defense before the snap",orientation:"Offense approaches from the bottom",note:"An example 4-3 front. Assignments and alignments vary by call.",players:[
  {role:"DE",x:20,y:70},{role:"DT",x:40,y:70},{role:"Nose",x:60,y:70},{role:"End",x:80,y:70},
  {role:"OLB",x:23,y:47},{role:"ILB",x:50,y:47},{role:"Will",x:77,y:47},{role:"CB",x:8,y:30},{role:"Corner",x:92,y:30},{role:"S",x:36,y:15},{role:"Deep",x:68,y:15}]},
 basketball:{title:"Five roles on offense",orientation:"Attack the basket at the top",note:"A simple example, not fixed locations. Modern players exchange jobs.",players:[
  {role:"PG",x:50,y:80},{role:"SG",x:84,y:60},{role:"SF",x:16,y:60},{role:"PF",x:24,y:30},{role:"C",x:62,y:22}]},
 baseball:{title:"Nine fielding positions",orientation:"Looking out from home plate at the bottom",note:"Typical starting areas; fielders adjust to the hitter and situation.",players:[
  {role:"P",x:50,y:65},{role:"C",x:50,y:90},{role:"1B",x:80,y:63},{role:"2B",x:68,y:44},{role:"SS",x:32,y:44},{role:"3B",x:20,y:63},{role:"LF",x:16,y:21},{role:"CF",x:50,y:13},{role:"RF",x:84,y:21}]},
 soccer:{title:"An example 4-3-3",orientation:"Attack the goal at the top",note:"One team shown. The formation is a starting shape, not fixed standing spots.",players:[
  {role:"GK",x:50,y:90},{role:"LB",x:12,y:69},{role:"CB",x:37,y:72},{role:"Other CB",x:63,y:72},{role:"RB",x:88,y:69},
  {role:"6",x:50,y:56},{role:"8",x:26,y:40},{role:"10",x:73,y:40},{role:"LW",x:15,y:16},{role:"ST",x:50,y:14},{role:"RW",x:85,y:16}]},
 volleyball:{title:"Example playing jobs after the serve",orientation:"Net at the top; your team is below it",note:"These are playing jobs, not the starting rotation. The libero is a different-color back-row player.",players:[
  {role:"OH",x:15,y:23},{role:"MB",x:50,y:23},{role:"OPP",x:85,y:23},{role:"DS",x:15,y:68},{role:"L",x:50,y:80},{role:"S",x:85,y:62}]},
};
export type FormationExercise={kind:FormationKind;targetRole:string;roleName:string;alternatives:[string,string];why:string};
const f=(kind:FormationKind,targetRole:string,roleName:string,a:string,b:string,why:string):FormationExercise=>({kind,targetRole,roleName,alternatives:[a,b],why});
// Authored links make visual meaning explicit. The engine does not guess roles
// from a photograph, a player's height, shirt color, or physical appearance.
export const FORMATION_EXERCISES:Partial<Record<`${CoreSportId}:${string}`,FormationExercise>>={
 "football:center-role":f("football-offense","C","center","QB","WR","The center is in the middle of the five offensive linemen and starts over the ball."),
 "football:quarterback-role":f("football-offense","QB","quarterback","C","TE","This quarterback starts behind the center in shotgun."),
 "football:guard-roles":f("football-offense","LG","left guard","QB","RB","From the offense's view, the left guard is immediately left of the center."),
 "football:tackle-roles":f("football-offense","RT","right tackle","C","QB","The right tackle is outside the right guard, not the attached tight end."),
 "football:back-roles":f("football-offense","RB","running back","QB","Wide","This running back starts deeper behind the quarterback. Other alignments are possible."),
 "football:receiver-role":f("football-offense","WR","wide receiver","C","RB","This wide receiver begins outside the main offensive line."),
 "football:tight-end-role":f("football-offense","TE","attached tight end","RT","QB","The attached tight end is beside the offensive tackle."),
 "football:inside-linebacker-role":f("football-defense","ILB","inside linebacker","DT","S","The inside linebacker is behind the middle of the defensive front."),
 "football:outside-linebacker-role":f("football-defense","OLB","outside linebacker","DE","S","In this off-ball example, the outside linebacker is behind and outside the defensive front."),
 "football:defensive-front":f("football-defense","DT","interior defensive lineman","CB","ILB","An interior defensive lineman works near the middle of the front."),
 "football:cornerback-role":f("football-defense","CB","cornerback","OLB","S","This cornerback starts outside near the receiver's area."),
 "football:safety-role":f("football-defense","S","deep safety","DT","OLB","This safety is deeper than the front and linebackers, protecting space behind them."),
 "basketball:point-guard":f("basketball","PG","point guard","C","PF","This example places the point guard above the other attackers to organize the action."),
 "basketball:shooting-guard":f("basketball","SG","shooting guard","PG","C","The shooting guard is the right-side perimeter player in this example."),
 "basketball:small-forward":f("basketball","SF","small forward","PG","C","The small forward occupies the left wing in this example."),
 "basketball:power-forward":f("basketball","PF","power forward","PG","SG","The power forward is in the left frontcourt area in this example."),
 "basketball:center":f("basketball","C","center","PG","SF","The center is near the basket in this example. Real centers can play elsewhere too."),
 "baseball:pitcher-role":f("baseball","P","pitcher","C","SS","The pitcher works from the mound between home plate and second base."),
 "baseball:catcher-role":f("baseball","C","catcher","P","1B","The catcher starts behind home plate at the bottom of this view."),
 "baseball:first-base-role":f("baseball","1B","first baseman","3B","RF","First base is on the right side when looking out from home plate."),
 "baseball:second-base-role":f("baseball","2B","second baseman","SS","CF","The second baseman normally begins between first and second, not on second itself."),
 "baseball:shortstop-role":f("baseball","SS","shortstop","2B","LF","Shortstop begins between second and third in this example."),
 "baseball:third-base-role":f("baseball","3B","third baseman","1B","LF","Third base is on the left side when looking out from home plate."),
 "baseball:left-field-role":f("baseball","LF","left fielder","RF","SS","Left field is the deep left side from home plate's view."),
 "baseball:center-field-role":f("baseball","CF","center fielder","P","2B","Center field is the deep middle of the outfield."),
 "baseball:right-field-role":f("baseball","RF","right fielder","LF","1B","Right field is the deep right side from home plate's view."),
 "soccer:goalkeeper-role":f("soccer","GK","goalkeeper","CB","6","The goalkeeper starts nearest the team's own goal in this example."),
 "soccer:center-back-role":f("soccer","CB","center back","8","ST","Center backs occupy the central defensive line ahead of the goalkeeper."),
 "soccer:fullback-role":f("soccer","LB","left back","LW","CB","The left back is the wide left defender in this example."),
 "soccer:holding-midfielder":f("soccer","6","holding midfielder","10","ST","The holding midfielder sits between the back line and the more advanced midfielders."),
 "soccer:central-midfielder":f("soccer","8","number 8 midfielder","GK","LW","The number 8 is a linking central midfielder. The number names a role here, not a required shirt."),
 "soccer:attacking-midfielder":f("soccer","10","attacking midfielder","6","RB","This example places the attacking midfielder ahead of the holding midfielder."),
 "soccer:striker-role":f("soccer","ST","striker","CB","8","The striker leads the central attack nearest the opponent's goal in this example."),
 "soccer:winger-role":f("soccer","LW","left winger","LB","6","The left winger is higher up the same side as the left back."),
 "volleyball:setter-role":f("volleyball","S","setter","L","MB","This example puts the setter in the right backcourt, ready to organize second contact."),
 "volleyball:outside-hitter-role":f("volleyball","OH","outside hitter","MB","S","The outside hitter attacks from the left in this example."),
 "volleyball:opposite-role":f("volleyball","OPP","opposite hitter","OH","L","The opposite is the right-side attacking option here."),
 "volleyball:middle-blocker-role":f("volleyball","MB","middle blocker","OH","L","The middle blocker is near the middle of the net."),
 "volleyball:libero-role":f("volleyball","L","libero","S","MB","The differently colored back-row player represents the libero, not a front-row blocker."),
 "volleyball:defensive-specialist-role":f("volleyball","DS","defensive specialist","L","OPP","The DS is the left-back player in this example and uses the team's normal jersey color."),
};
export function formationTargets(exercise:FormationExercise) {
 // Rotate the target letter by role, so A is not always correct.
 const roles=[exercise.targetRole,...exercise.alternatives];
 const shift=exercise.targetRole.length%3;
 return roles.map((_,index)=>({label:["A","B","C"][index],role:roles[(index+shift)%3]}));
}
export function formationExerciseForModule(id:string) {
 const [,sport,...slug]=id.split("-");
 return FORMATION_EXERCISES[`${sport}:${slug.join("-")}` as keyof typeof FORMATION_EXERCISES];
}
