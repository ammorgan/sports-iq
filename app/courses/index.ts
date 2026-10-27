import { compileCourse, type CoreSportId } from "../core-course.ts";
import { footballCourse } from "./football.ts";
import { basketballCourse } from "./basketball.ts";
import { baseballCourse } from "./baseball.ts";
import { soccerCourse } from "./soccer.ts";
import { volleyballCourse } from "./volleyball.ts";
import { expandCourse } from "./expand-course.ts";

export const CORE_COURSES = [footballCourse, basketballCourse, baseballCourse, soccerCourse, volleyballCourse].map(expandCourse);
const courseModules = new Map(CORE_COURSES.map((course) => [course.sportId, compileCourse(course)]));
export function coreModulesForSport(sportId: string) { return courseModules.get(sportId as CoreSportId); }
export function coreSectionsForSport(sportId: string) { return CORE_COURSES.find((course)=>course.sportId===sportId)?.sections ?? []; }
export function coreUnitForModule(moduleId: string) {
  for (const course of CORE_COURSES) {
    const unit = course.units.find((entry) => moduleId === `rq-${course.sportId}-${entry.slug}`);
    if (unit) return unit;
  }
  return undefined;
}
