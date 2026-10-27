"use client";
import { useState } from "react";
import MdiReact from "@mdi/react";
import { mdiArrowLeft, mdiArrowRight, mdiCheckBold, mdiFlagOutline, mdiLockOutline, mdiPlay, mdiStar, mdiTrophyOutline } from "@mdi/js";
import { courseModuleStates } from "./core-course";
import { coreSectionsForSport } from "./courses";
import type { LearningModule, Sport } from "./learning-data";
import Image from "next/image";
const Icon = ((MdiReact as unknown as { Icon?: typeof MdiReact }).Icon ?? MdiReact) as typeof MdiReact;

export function CourseMap({ sport, modules, completedIds, avatarSrc, onStart, onBack, onPositions }: {
  sport: Sport; modules: LearningModule[]; completedIds: string[]; avatarSrc: string;
  onStart: (module: LearningModule) => void; onBack: () => void; onPositions: () => void;
}) {
  const states = courseModuleStates(modules, completedIds);
  const currentIndex = states.indexOf("current");
  const active = modules[currentIndex] ?? modules.at(-1)!;
  const completed = states.filter((state) => state === "complete").length;
  const [openSection, setOpenSection] = useState(active.courseSection ?? 0);
  return <section className="quest-course">
    <div className="quest-course-top"><button type="button" className="quest-back" onClick={onBack}><Icon path={mdiArrowLeft} size={1} />Sports</button><span>{completed}/{modules.length} lessons complete</span></div>
    <div className="quest-course-title"><span>YOUR {sport.name === "Tackle Football" ? "FOOTBALL" : sport.name.toUpperCase()} JOURNEY</span><h1>One rep. One new skill.</h1><p>Start simple. Build toward smarter game decisions.</p></div>
    <div className="quest-track-switch"><button type="button" className="active" aria-current="page"><Icon path={mdiFlagOutline} size={1} /><span>Learn the game<small>From your first play to advanced reads</small></span><Icon path={mdiCheckBold} size={.8} /></button><button type="button" onClick={onPositions}><Icon path={mdiStar} size={1} /><span>Position training<small>Choose a role anytime</small></span><Icon path={mdiArrowRight} size={.8} /></button></div>
    <div className="quest-coach-line"><Image src={avatarSrc} alt="Your avatar coach" width={100} height={132} unoptimized /><div><strong>{completed ? "Ready for your next rep?" : "New here? You’re in the right place."}</strong><span>{active.description}</span></div></div>
    <div className="quest-sections">{coreSectionsForSport(sport.id).map((section, sectionIndex) => {
      const entries = modules.map((module, index) => ({ module, state: states[index] })).filter(({module}) => module.courseSection === sectionIndex);
      const allDone = entries.every(({state}) => state === "complete");
      const sectionCurrent = active.courseSection === sectionIndex;
      const expanded = openSection === sectionIndex;
      return <section className={`quest-section ${sectionCurrent ? "quest-section--current" : ""}`} key={section.title}>
        <button type="button" className="quest-section-banner" onClick={() => setOpenSection(expanded ? -1 : sectionIndex)} aria-expanded={expanded} aria-controls={`section-${sectionIndex}`}><span className="quest-section-number">{allDone ? <Icon path={mdiCheckBold} size={.9} /> : sectionIndex + 1}</span><span><small>{sectionIndex === 0 ? "BEGINNER" : sectionIndex === 9 ? "ADVANCED" : `STAGE ${sectionIndex + 1}`}</small><strong>{section.title}</strong></span><span>{expanded ? "−" : "+"}</span></button>
        {expanded && <div id={`section-${sectionIndex}`} className="quest-section-content"><p>{section.outcome}</p><div className="quest-node-trail">{entries.map(({module, state}, nodeIndex) => <div className={`quest-course-node quest-course-node--${state}`} key={module.id} style={{ marginLeft: `${[0, 24, -24, 0][nodeIndex % 4]}%` }}>
          <button type="button" disabled={state === "locked"} aria-current={state === "current" ? "step" : undefined} aria-label={`${state === "locked" ? "Locked" : state === "complete" ? "Practice" : "Start"}: ${module.title}`} onClick={() => onStart(module)}><Icon path={state === "complete" ? mdiCheckBold : state === "locked" ? mdiLockOutline : module.checkpoint ? mdiTrophyOutline : mdiPlay} size={1.5} /></button><strong>{module.checkpoint ? "Game day" : module.title}</strong>{state === "current" && <small>PLAY NEXT</small>}
        </div>)}</div></div>}
      </section>;
    })}</div>
    <div className="quest-continue"><div><small>{currentIndex < 0 ? "PATH COMPLETE" : "YOUR NEXT LESSON"}</small><strong>{active.title}</strong></div><button type="button" onClick={() => onStart(active)}>{currentIndex < 0 ? "Practice" : completed ? "Continue" : "Let’s play"}<Icon path={mdiArrowRight} size={1} /></button></div>
  </section>;
}
