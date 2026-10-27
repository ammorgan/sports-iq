import {CORE_COURSES} from "../app/courses/index.ts";
import {COURSE_CHECKPOINTS} from "../app/course-checkpoints.ts";
import {COURSE_FACTS} from "../app/course-facts.ts";
import {FORMATION_EXERCISES} from "../app/course-formations.ts";

const names={football:"Football",basketball:"Basketball",baseball:"Baseball",soccer:"Soccer",volleyball:"Volleyball"};
for(const course of CORE_COURSES){
 console.log(`\n### ${names[course.sportId]}\n\nRule context: ${course.rules}\n`);
 for(const [sectionIndex,section] of course.sections.entries()){
  console.log(`\n#### ${sectionIndex+1}. ${section.title}\n\nOutcome: ${section.outcome}\n`);
  for(const unit of course.units.filter((entry)=>section.unitIds.includes(entry.slug))){
   console.log(`- **${unit.title}** — ${unit.goal}\n  - Teach: ${unit.terms.map(([term,meaning])=>`${term}: ${meaning}`).join(" ")}\n  - Apply: ${unit.decisions.map((decision)=>decision.prompt).join(" ")}\n`);
   const key=`${course.sportId}:${unit.slug}`;
   if(COURSE_FACTS[key])console.log(`  - Rule teaching: ${COURSE_FACTS[key].teach}\n`);
   if(FORMATION_EXERCISES[key])console.log(`  - Visual practice: identify the ${FORMATION_EXERCISES[key].roleName} in an example alignment. Teach the labeled layout before testing.\n`);
  }
  const check=COURSE_CHECKPOINTS[course.sportId][sectionIndex];
  console.log(`Game Day transfer: ${check.prompt}\n\nExpected reasoning: ${check.why}\n`);
 }
}
