import {d,type CourseDecision} from "../core-course.ts";
// More than one reasonable-looking action; the stated situation determines
// the useful answer. These are taught decisions, not professional certification.
export const ADVANCED_DECISIONS:Record<string,CourseDecision[]>={
 "football:coverage-adjustments":[
  d("The flat defender sinks under the deep route. The short route is open. Which high-low response fits?","Take the short route","Force the deep route","Wait on the deep route","The defender's drop removes the deeper window and leaves the short level available."),
  d("Two safeties show deep. After the snap, one rotates down and three defenders cover deep thirds. Which zone appears?","Cover 3","Cover 2","Cover 0","Count the actual deep responsibilities after the rotation, not just the starting safeties."),
 ],
 "football:game-management":[
  d("Your team trails by 4 with one play left. Which scoring result can win in regulation?","A touchdown","A field goal","A safety score","A touchdown adds six. Three points or two points cannot overcome a four-point deficit."),
  d("Your offense leads late and the next safe kneel ends the game. Which choice protects the win?","Kneel with ball security","Try a sideline pass","Seek an extra rushing yard","When a legal kneel safely ends the game, a pass or unnecessary gain adds risk without needed value."),
 ],
 "basketball:advanced-coverages":[
  d("The low helper tags the roll. A second defender covers the corner, leaving the wing open. Where is the new opening?","The wing","The corner","The roller","The first help does not guarantee a corner pass. Read the next rotation and use the space it leaves."),
  d("A switch puts a strong big on your guard far from the basket. Must the guard drive immediately?","No, read space and help","Yes, attack every switch","No, pass backward every time","A mismatch is only potential. Spacing, the defender's movement, and help determine whether to attack."),
 ],
 "basketball:late-game":[
  d("You trail by 3 with time for only one made field goal. Which shot value can tie?","Three points","Two points","One point","A three ties this stated situation. A quick two only makes sense if another possession remains possible."),
  d("You lead by 1 with 10 game-clock seconds and 16 shot-clock seconds. Must you shoot before regulation ends?","No","Yes, within 6 seconds","Only outside the arc","There is more shot-clock time than game time. Keep possession legally; the opponent may try to foul."),
 ],
 "baseball:final-inning":[
  d("Tie game, bottom of the ninth, bases loaded, one out. A routine force at home is available. Which base prevents the winning run?","Home","First","Second","A force at home retires the lead runner before the winning run scores. The available out and timing matter."),
  d("A run crosses home before a third-out tag at second. The runner at second was not forced. Can that run count?","Yes, subject to other scoring rules","No, every third out erases runs","Only after extra innings","A non-force tag can be a timing play. A run before it may count unless another scoring exception applies."),
 ],
 "baseball:bullpen-and-matchups":[
  d("An MLB reliever finishes the inning after one batter and is replaced before the next inning. Is that normally allowed?","Yes","No, three batters always","Only if a run scored","Finishing the half-inning satisfies the minimum for removal. Returning next inning would keep the three-batter requirement active."),
 ],
 "soccer:advanced-buildup":[
  d("A striker covers your goalkeeper's direct pass to midfield. A center back is free to connect there. What can unlock midfield?","Pass through the center back","Force the covered direct pass","Dribble into the striker","A third-player connection uses a free intermediate teammate to reach a blocked destination."),
  d("Both fullbacks advance and possession is lost. Which prepared structure can protect the counter?","Rest defense behind the ball","Both wingers beyond the forwards","Every midfielder inside the box","Rest defense keeps useful cover during the attack so the next turnover is not undefended."),
 ],
 "soccer:manage-the-match":[
  d("Your team leads late and wins possession near the touchline. A safe supporting pass is open. What can help control the game?","Keep the ball with support","Force a crowded central pass","Send every defender forward","A safe connection can reduce the opponent's time on the ball without creating a needless central turnover."),
 ],
 "volleyball:systems-and-rotations":[
  d("In a 5-1, the only setter rotates to the front row. Can the setter still run the offense?","Yes","No, a second setter must enter","Only after a timeout","The same setter organizes every rotation in a 5-1. Front-row status changes available attacking and blocking jobs."),
  d("A back-row setter jumps near the net and sends a ball over entirely above net height. What rule needs checking?","Illegal back-row attack","Only service order","Only the libero's jersey","A back-row player cannot complete an attack above net height from a front-zone takeoff. A jump set does not remove that restriction."),
 ],
 "volleyball:close-the-match":[
  d("The libero finger-sets from the front zone. Can a teammate finish that ball entirely above the net?","No","Yes, from every location","Only from the left side","That libero set creates an attack restriction. An overhand finger set from behind the front zone is treated differently."),
 ],
};
