"use client";
import { FORMATIONS,formationTargets,type FormationExercise } from "./course-formations";

// An interactive data diagram, not a photograph or a decorative background.
// Coordinates and role labels are shared with the native learning exercise.
export function FormationBoard({exercise,selected,onSelect,reveal,disabled,teaching=false}:{exercise:FormationExercise;selected?:string[];onSelect?:(values:string[])=>void;reveal?:boolean;disabled?:boolean;teaching?:boolean}) {
 const spec=FORMATIONS[exercise.kind],targets=formationTargets(exercise);
 return <figure className={`formation-diagram formation-diagram--${exercise.kind}`}>
  <figcaption><strong>{spec.title}</strong><span>{spec.orientation}</span></figcaption>
  <div className="formation-grid" role="group" aria-label={spec.title}>
   <div className="formation-landmark" aria-hidden="true">{exercise.kind.startsWith("football")?"UPFIELD":exercise.kind==="volleyball"?"NET":exercise.kind==="baseball"?"OUTFIELD":exercise.kind==="basketball"?"BASKET":"OPPONENT'S GOAL"}</div>
   {spec.players.map((player)=>{
    const target=targets.find((entry)=>entry.role===player.role);
    const content=teaching?player.role:target?.label??player.role;
    const description=teaching?`${player.role}: ${player.role===exercise.targetRole?exercise.roleName:"example position"}`:target?`Player ${target.label}, ${player.x<34?"left":player.x>66?"right":"middle"}, ${player.y<34?"top":player.y>66?"bottom":"central"} area`:player.role;
    return target&&!teaching?<button type="button" key={player.role} className={`formation-player formation-target ${player.role==="L"?"formation-libero":""} ${selected?.includes(target.label)?"selected":""} ${reveal&&player.role===exercise.targetRole?"correct":""}`} disabled={disabled} aria-label={description} aria-pressed={selected?.includes(target.label)} onClick={()=>onSelect?.([target.label])} style={{left:`${player.x}%`,top:`${player.y}%`}}>{content}</button>:<span key={player.role} className={`formation-player ${player.role==="L"?"formation-libero":""} ${teaching&&player.role===exercise.targetRole?"formation-focus":""}`} aria-label={description} style={{left:`${player.x}%`,top:`${player.y}%`}}>{content}</span>;
   })}
  </div>
  {teaching&&<p className="formation-teaching"><strong>{exercise.roleName}:</strong> {exercise.why}</p>}
  <p>{spec.note}</p>
  {!teaching&&<p>A, B, and C mark choices, not shirt numbers.</p>}
 </figure>;
}
