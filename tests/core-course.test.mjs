import assert from "node:assert/strict";
import test from "node:test";
import { CORE_COURSES,coreModulesForSport } from "../app/courses/index.ts";
import { CORE_SPORT_IDS,courseModuleStates } from "../app/core-course.ts";
import { FORMATIONS,FORMATION_EXERCISES,formationTargets } from "../app/course-formations.ts";
import { FEATURED_SPORTS,SPORTS,challengesForAge,generalModulesForSport,learningModulePathsForSport,sportProgressSummary } from "../app/learning-data.ts";
import { moduleGuideFor } from "../app/module-guides.ts";
import { CONTENT_SOURCES } from "../app/content-registry.ts";
import { canStartLearningModule } from "../app/product-governance.ts";
import { isChallengeAnswerCorrect,hasRecoveredCoreLesson,coreRetryChallenge,formattedCorrectAnswer } from "../app/exercise-engine.ts";

test("the release exposes exactly the requested five sports while retaining the hidden catalog",()=>{
  assert.deepEqual(FEATURED_SPORTS.map((sport)=>sport.id),["football","basketball","baseball","soccer","volleyball"]);
  assert.equal(SPORTS.length,24);
  assert.equal(SPORTS.some((sport)=>sport.id==="flag-football"),true);
});

test("each sport has ten authored sections with teaching, practice and application",()=>{
  const ids=new Set();
  const sources=new Set(CONTENT_SOURCES.map((source)=>source.id));
  for(const sport of FEATURED_SPORTS){
    const modules=generalModulesForSport(sport);
    assert.equal(modules.filter((entry)=>entry.checkpoint).length,10);
    const authored=CORE_COURSES.find((course)=>course.sportId===sport.id);
    for(let section=0;section<10;section++){
      const entries=modules.filter((entry)=>entry.courseSection===section);
      assert.deepEqual(entries.filter((entry)=>!entry.checkpoint).map((entry)=>entry.id),authored.sections[section].unitIds.map((id)=>`rq-${sport.id}-${id}`));
      assert.ok(entries.filter((entry)=>!entry.checkpoint).length>=3);
      assert.equal(entries.at(-1).checkpoint,true);
    }
    for(const learningModule of modules){
      assert.equal(ids.has(learningModule.id),false);ids.add(learningModule.id);
      assert.match(learningModule.id,/^[a-z0-9-]{1,80}$/);
      assert.ok(learningModule.ruleContext);
      learningModule.sourceIds.forEach((id)=>assert.equal(sources.has(id),true,id));
      const guide=moduleGuideFor(learningModule,sport,"7-9");
      if(learningModule.checkpoint)assert.equal(guide,undefined);
      else{
        assert.equal(guide.lessons.length,1);
        assert.equal(guide.lessons[0].terms.length,authored.units.find((unit)=>learningModule.id.endsWith(`-${unit.slug}`)).terms.length);
        for(const type of ["cards","blank","match","scenario","ordering"])assert.equal(learningModule.challenges.some((challenge)=>challenge.type===type),true);
      }
      assert.deepEqual(challengesForAge(learningModule,"7-9"),challengesForAge(learningModule,"18+"),"Age cannot truncate the knowledge path");
      for(const challenge of learningModule.challenges){
        assert.equal(ids.has(challenge.id),false);ids.add(challenge.id);
        const expected=Array.isArray(challenge.correct)?challenge.correct:[challenge.correct];
        assert.equal(isChallengeAnswerCorrect(challenge,expected),true);
        assert.equal(isChallengeAnswerCorrect(challenge,[]),false);
        assert.equal(new Set(challenge.options).size,challenge.options.length);
        assert.ok(challenge.explanation.trim());
      }
    }
  }
});

test("role diagrams use real roles, unambiguous target letters, and matching web/native data",()=>{
  for(const [key,exercise] of Object.entries(FORMATION_EXERCISES)){
    const players=FORMATIONS[exercise.kind].players;
    const targets=formationTargets(exercise);
    assert.equal(new Set(targets.map((target)=>target.role)).size,3,key);
    for(const target of targets)assert.equal(players.filter((player)=>player.role===target.role).length,1,key);
    const [sport,...slug]=key.split(":");
    const lesson=coreModulesForSport(sport).find((entry)=>entry.id===`rq-${sport}-${slug.join(":")}`);
    const challenge=lesson.challenges.find((entry)=>entry.type==="formation");
    assert.equal(targets.find((target)=>target.label===challenge.correct).role,exercise.targetRole);
    assert.equal(challenge.remediation.type,"formation");
    assert.equal(challenge.remediation.formation,exercise);
  }
});

test("sparse or legacy receipts cannot skip a course prerequisite",()=>{
  for(const sport of FEATURED_SPORTS){
    const modules=coreModulesForSport(sport.id);
    const saved=["fb-fundamentals-field",modules[0].id,modules[9].id];
    const states=courseModuleStates(modules,saved);
    assert.equal(states[0],"complete");assert.equal(states[1],"current");assert.equal(states[9],"locked");
    const summary=sportProgressSummary(sport,"18+",saved);
    assert.equal(summary.completedModules,1);
    const paths=learningModulePathsForSport(sport,"18+");
    assert.equal(canStartLearningModule({moduleId:modules[9].id,modulePaths:paths,completedModuleIds:saved}),false);
    assert.equal(canStartLearningModule({moduleId:modules[1].id,modulePaths:paths,completedModuleIds:saved}),true);
    assert.equal(courseModuleStates(modules,modules.map((entry)=>entry.id)).every((state)=>state==="complete"),true);
  }
});

test("matching grades connections, sequencing grades order, and recovery requires success",()=>{
  const lesson=coreModulesForSport("basketball")[0];
  const match=lesson.challenges.find((challenge)=>challenge.type==="match");
  assert.equal(isChallengeAnswerCorrect(match,[...match.correct].reverse()),true);
  const mixed=match.pairs.map((pair,index)=>`${pair.left}::${match.pairs[(index+1)%3].right}`);
  assert.equal(isChallengeAnswerCorrect(match,mixed),false);
  const order=lesson.challenges.find((challenge)=>challenge.type==="ordering");
  assert.equal(isChallengeAnswerCorrect(order,[...order.correct].reverse()),false);
  assert.equal(isChallengeAnswerCorrect(order,[order.correct[0],order.correct[0],order.correct[0]]),false);
  const results=lesson.challenges.map((challenge)=>({conceptId:challenge.conceptId,correct:challenge!==order}));
  assert.equal(hasRecoveredCoreLesson(lesson.challenges,results),false);
  assert.equal(hasRecoveredCoreLesson(lesson.challenges,[...results,{conceptId:order.conceptId,correct:true}]),true);
});

test("repeated retries keep short sport questions and preserve the exercise format",()=>{
 for(const course of CORE_COURSES)for(const lesson of coreModulesForSport(course.sportId)){
  for(const challenge of lesson.challenges){
   const first=coreRetryChallenge(challenge,100);
   const second=coreRetryChallenge(first,101);
   assert.notEqual(first.id,second.id);
   assert.equal(second.remediation,undefined);
   assert.equal(second.conceptId,challenge.conceptId);
   assert.equal(second.type,first.type);
   assert.doesNotMatch(second.prompt,/Coach feedback:|Now make the read again/);
   assert.ok(second.prompt.split(/\s+/).length<=24);
   assert.doesNotMatch(formattedCorrectAnswer(challenge),/::/);
  }
 }
});

test("advanced courses contain sport-specific decisions rather than harder vocabulary alone",()=>{
  const expectations={football:["Rotation","Hot answer","Progression"],basketball:["Tag","Counter","Clock management"],baseball:["Spray chart","Three-batter minimum","Walk-off"],soccer:["Rest defense","Overload","Set play"],volleyball:["5-1 offense","6-2 offense","Tool the block"]};
  for(const course of CORE_COURSES){
    assert.equal(CORE_SPORT_IDS.includes(course.sportId),true);
    const terms=course.units.slice(12).flatMap((unit)=>unit.terms.map(([term])=>term));
    expectations[course.sportId].forEach((term)=>assert.equal(terms.includes(term),true,term));
  }
});
