import type { CourseDecision,CoreSportId } from "./core-course.ts";
const c=(prompt:string,answer:string,a:string,b:string,why:string):CourseDecision=>({prompt,answer,others:[a,b],why});

// New situations test transfer at each stage, rather than repeating a lesson's
// wording and treating question volume as a measure of difficulty.
const original:Record<CoreSportId,CourseDecision[]>={
  football:[
    c("A blue player carries the ball toward the red team's end zone. Which unit is blue using?","Offense","Defense","Punt coverage","The unit with the ball is the offense, regardless of its uniform color."),
    c("It is fourth and 3. The offense gains only 2 yards. Who normally gets the next possession?","The other team","The same offense","The kicking team only","Failing to reach the line to gain on fourth down gives the opponent the ball."),
    c("A receiver breaks toward the sideline on a short route. Which area is the receiver entering?","The flat","The deep middle","The interior gap","The flat is the short outside space. A receiver's route must be connected to the defenders there."),
    c("A player is listed as an outside linebacker. Does that name alone tell you whether the player rushes or covers?","The call decides","Yes, always rush","Yes, always cover","Outside linebackers can have different responsibilities. Learn alignment, scheme, and the actual call."),
    c("Two safeties show deep before the snap. What is still needed to identify the coverage?","See their post-snap jobs","Count offensive receivers only","Read the scoreboard only","The pre-snap shell narrows possibilities. Rotation and route responsibility confirm what the defense plays."),
    c("Your first route is covered and the assigned checkdown is open. What fits the called progression?","Use the checkdown","Force the first route","Wait for the first route only","The progression gives a planned next answer. An open checkdown can preserve the possession when the first read closes."),
  ],
  basketball:[
    c("Red misses a shot. Blue controls the rebound. Which team is now on offense?","Blue","Red","Neither until a timeout","The team controlling the ball becomes the offense. The other team must switch to defense."),
    c("A shooter touches the three-point line at takeoff and makes the shot. How many points is that field goal?","Two","Three","One","A player on the arc is in the two-point area. The shot needs to be released from beyond it for three."),
    c("The shot misses. An opponent stands between you and the rim. What helps before chasing the rebound?","Establish legal position","Grab the opponent's arm","Push through the opponent","Rebounding begins with positioning. A legal box out creates space without holding or pushing."),
    c("A defender steps away from your teammate to stop your drive. What advantage may that create?","A pass to that teammate","A second dribble after stopping","An automatic shooting foul","Helping on the drive can leave another attacker open. Look for the pass the help creates."),
    c("A screen draws both defenders to you. Your screener has space in the middle. Which pass uses that space?","Pass to the short roll","Pass into the trap","Hold for the same screen","The short roll can give the offense an extra decision maker behind the two defenders on the ball."),
    c("A weak-side defender tags the roller. Your corner teammate is open. Which read attacks the help?","Pass to the corner","Throw into the tag","Restart the same trapped dribble","Tagging the roll can expose the corner. The passer reads the next rotation before delivering the ball."),
  ],
  baseball:[
    c("There are two outs. A fielder catches the batter's fly ball. What happens next?","The teams change jobs","The batter goes to first","The same team gets another out","The catch is the third out, ending the half-inning."),
    c("A runner is forced to second. The fielder controls the ball on second before the runner arrives. What is the result?","Out","Safe without a tag","A walk","A force can be completed by touching the required base with control of the ball before the runner arrives."),
    c("A runner leaves before a caught fly is first touched. What must the runner do before advancing legally?","Retouch the starting base","Touch the next base twice","Wait only at the next base","The runner must correct the early departure by retouching the starting base under the tag-up rules."),
    c("A ball reaches the deep outfield. The direct throw home is too far. Who connects the throw?","The relay defender","The on-deck batter","The home-plate umpire","A relay defender provides an intermediate target for a long throw."),
    c("With two outs, first base is a sure third out and a throw home is risky. Which play usually ends the threat?","Throw to first","Force the throw home","Hold the ball","The routine third out ends the half-inning, so a risky play home is often unnecessary."),
    c("An MLB reliever faces one batter to end the inning, then returns. What minimum normally remains?","Face two more batters","Face none automatically","Pitch one complete inning","A pitcher who returns for the next inning still has to reach the three-batter total unless an exception applies."),
  ],
  soccer:[
    c("A shot touches the goal line but the whole ball has not crossed it. Is a goal scored?","No","Yes","Only if a forward shoots","The whole ball must cross the goal line between the posts and under the crossbar for a goal."),
    c("A player receives directly from a throw-in beyond the second-last opponent. Can that direct receipt be offside?","No","Yes, always","Only after halftime","The offside law excludes direct receipt from a throw-in, goal kick, or corner kick."),
    c("You see pressure behind your right shoulder before receiving. What can your first touch use?","Space away from pressure","The defender's feet","The same blocked space","Scanning lets the first touch prepare a useful action away from pressure."),
    c("Your first defender presses the ball. Why should teammates move together behind that player?","To close the next passes","To create a throw-in","To move every player forward","Pressure works when supporting players limit the next options and protect space."),
    c("The opponent takes a heavy touch, but your team is too far away to support you. What is safer?","Delay and recover shape","Press alone at full speed","Turn away from the ball","A trigger is useful only with support. Delaying can give teammates time to recover."),
    c("Your goalkeeper draws a forward's press and a center back becomes free. What does the build-up now offer?","The spare player","A guaranteed long-ball goal","An extra substitution","Drawing pressure can free a teammate. The next pass should use that advantage while protecting against a turnover."),
  ],
  volleyball:[
    c("A served ball lands on your end line untouched. Which team wins the rally?","The serving team","The receiving team","Neither; replay it","A boundary line belongs to the court. A serve landing on it is in."),
    c("Your team is receiving at 24-24 and wins the rally. What happens?","Point, rotation, and serve","Point with no rotation","Serve with no point","The team gains a point and the serve, then rotates. The set still needs a two-point margin."),
    c("A teammate's attack rebounds from the block toward you. Which team action are you providing?","Attack coverage","Serve receive","A new rotation","Attack coverage prepares teammates to recover balls coming off the block."),
    c("Your setter takes the first dig. What keeps the three-contact plan organized?","The backup takes second contact","The setter always touches again","Everyone waits for a whistle","An agreed backup setting role keeps the rally organized when the setter handles the first ball."),
    c("A pass pulls the setter away from the net. What should the block prepare for?","The remaining hittable options","Every quick option equally","An automatic dead ball","A poor pass reduces some quick combinations. Defenders still read the set rather than assuming one outcome."),
    c("The opponent's middle blocker commits early. Your outside hitter has one blocker. What has the setter created?","A useful outside matchup","An automatic point","A fourth team hit","Moving a blocker can improve a matchup. A useful set and the hitter's next read still decide the attack."),
  ],
};

export const COURSE_CHECKPOINTS:Record<CoreSportId,CourseDecision[]>={
 football:[original.football[0],
  c("The second quarter just ended. Which part of the game comes next?","Halftime","Overtime","The fourth quarter","Halftime follows the first two quarters."),original.football[1],
  c("The middle offensive lineman sends the ball backward, then blocks. Which role is this?","Center","Tight end","Right tackle","The center starts the play with the snap, then carries out the blocking job."),original.football[3],original.football[2],
  c("A run flows outside but the defense leaves an inside lane. What may the runner read?","A cutback chance","An automatic first down","A required punt","Read the blocking and available space before cutting back."),original.football[4],
  c("Near the goal line, the first passing window closes. What is the useful next step?","Use the next read","Force the closed window","Ignore the deep defender","Limited space makes timing and possession important. Follow the called progression."),original.football[5]],
 basketball:[original.basketball[0],
  c("You dribbled, picked the ball up, and are now holding it. What is normally legal next?","Pass or shoot","Dribble again","Run while holding it","Ending the dribble leaves passing, shooting, and legal pivoting as options."),original.basketball[1],
  c("Your center catches near the basket and a second defender comes. What opening may appear?","An open teammate","An extra legal step","An automatic free throw","Help defense can open a pass. A center's job includes reading it."),original.basketball[2],
  c("A defender's hands close a direct pass. What can the passer change?","The passing angle","The court boundary","The number of teammates","A pivot, fake, or different passing angle may create a clear lane."),original.basketball[3],original.basketball[4],
  c("A trap stops your dribble. A safety outlet has space. Which choice protects possession?","Pass to the outlet","Force the same dribble","Jump without a target","A planned outlet lets the team escape pressure without a forced pass."),original.basketball[5]],
 baseball:[
  c("The pitcher and catcher are in position with the other fielders. How many defenders form the standard team?","Nine","Eight","Ten","Pitcher and catcher are included in the nine fielding positions."),original.baseball[0],original.baseball[1],
  c("The DH is listed to bat for the pitcher. Does that create a tenth fielding position?","No","Yes","Only with bases loaded","The designated hitter changes the batting assignment, not the nine defenders."),
  c("A grounder goes to third with no runners. Which teammate usually finishes the routine out?","The first baseman","The left fielder","The catcher","The third baseman commonly throws to first to retire the batter-runner."),original.baseball[2],original.baseball[3],original.baseball[4],
  c("With two strikes, the batter bunts foul. What is the result?","Strikeout","Another pitch with no change","A walk","A foul bunt with two strikes is strike three, unlike a normal uncaught foul."),original.baseball[5]],
 soccer:[original.soccer[0],
  c("A ball is still partly above the touchline. Should players assume a throw-in?","No, keep playing","Yes, stop immediately","Only the goalkeeper continues","The whole ball must cross the boundary to go out."),original.soccer[1],
  c("A striker has a defender behind and teammates arriving. What can help the attack connect?","Hold up and pass","Turn blindly into pressure","Leave the field","Protecting the ball can give supporting teammates time to join."),
  c("A center back challenges the attacker. What can the other center back provide?","Cover behind","The same challenge beside them","An extra goalkeeper","Challenge and cover share the danger instead of leaving the space behind empty."),original.soccer[2],original.soccer[3],original.soccer[4],
  c("The opponent crowds your right side. Your left winger has space. What may use that space?","Switch play","Force the crowded right side","Send every player right","Moving the ball to the opposite side can use an opening created by pressure."),original.soccer[5]],
 volleyball:[original.volleyball[0],
  c("A team sends a legal ball over on its second contact. Is a third contact always required?","No","Yes","Only after a serve","A team may return the ball before using all three hits."),original.volleyball[1],
  c("The setter digs the first ball and cannot set the next one normally. Who should organize the second contact?","The agreed backup setter","The setter again automatically","The server outside court","The team needs a backup setting plan when the setter handles first contact."),
  c("A different-jersey back-row specialist moves toward a block. What restriction applies?","The libero cannot block","The libero must block","The libero gets four contacts","The libero's special role excludes blocking and attempting to block."),original.volleyball[2],original.volleyball[3],original.volleyball[4],
  c("A poor pass removes the quick attack. What should the setter choose?","An available hittable option","The unreachable quick set","An extra fourth contact","An out-of-system plan uses the control and hitters still available."),original.volleyball[5]],
};
