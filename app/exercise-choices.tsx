"use client";
import { useState } from "react";
import type { Challenge } from "./learning-data";
import MdiReact from "@mdi/react";
import { mdiAccountArrowRightOutline,mdiAccountArrowRight,mdiShieldAccountOutline,mdiAccountGroupOutline,mdiBullseyeArrow,mdiTimerOutline,mdiArrowRightBoldCircleOutline,mdiMapMarkerOutline,mdiRoutes,mdiWhistleOutline,mdiStrategy,mdiStarOutline } from "@mdi/js";
import { conceptIcon } from "./concept-icons";
import { FormationBoard } from "./formation-board";
import { matchingRightOptions, selectMatchingItem, type MatchingSelection, type MatchingSide } from "./exercise-engine";
const Icon = ((MdiReact as unknown as { Icon?: typeof MdiReact }).Icon ?? MdiReact) as typeof MdiReact;
const CARD_ICONS:Record<string,string>={"account-arrow-right-outline":mdiAccountArrowRightOutline,"account-arrow-right":mdiAccountArrowRight,"shield-account-outline":mdiShieldAccountOutline,"account-group-outline":mdiAccountGroupOutline,"bullseye-arrow":mdiBullseyeArrow,"timer-outline":mdiTimerOutline,"arrow-right-bold-circle-outline":mdiArrowRightBoldCircleOutline,"map-marker-outline":mdiMapMarkerOutline,routes:mdiRoutes,"whistle-outline":mdiWhistleOutline,strategy:mdiStrategy,"star-outline":mdiStarOutline};
function CardIcon({term}:{term:string}) {
  return <Icon path={CARD_ICONS[conceptIcon(term)]} size={1.7} aria-hidden="true" />;
}

export function ExerciseChoices({ challenge, selected, onSelect, disabled, reveal }: {
  challenge: Challenge; selected: string[]; onSelect: (values: string[]) => void; disabled: boolean; reveal?: boolean;
}) {
  const [pending, setPending] = useState<MatchingSelection>(null);
  const expected = Array.isArray(challenge.correct) ? challenge.correct : [challenge.correct];
  if(challenge.type==="formation"&&challenge.formation)return <><FormationBoard exercise={challenge.formation} selected={selected} onSelect={onSelect} disabled={disabled} reveal={reveal}/><div className="quest-word-bank">{challenge.options.map((option)=><button type="button" key={option} aria-pressed={selected.includes(option)} disabled={disabled} className={selected.includes(option)?"selected":""} onClick={()=>onSelect([option])}>Player {option}</button>)}</div></>;
  if (challenge.type === "match" && challenge.pairs) {
    const pairs = challenge.pairs;
    const rights = matchingRightOptions(challenge);
    const pick = (side: MatchingSide, value: string) => {
      if (disabled) return;
      const next = selectMatchingItem(selected, pending, side, value);
      onSelect(next.selected); setPending(next.pending);
    };
    return <div className="quest-match" aria-label="Match terms to meanings"><div>{pairs.map((pair) => {
      const match = selected.find((entry) => entry.startsWith(`${pair.left}::`));
      const active = pending?.side === "left" && pending.value === pair.left;
      return <button type="button" key={pair.left} disabled={disabled} aria-pressed={active} className={`${active ? "selected" : ""} ${match ? "paired" : ""} ${reveal && match ? expected.includes(match) ? "correct" : "wrong" : ""}`} onClick={() => pick("left", pair.left)}>{pair.left}{match && <small>Pair {selected.indexOf(match) + 1}</small>}</button>;
    })}</div><div>{rights.map((right) => {
      const match = selected.find((entry) => entry.endsWith(`::${right}`));
      const active = pending?.side === "right" && pending.value === right;
      return <button type="button" key={right} disabled={disabled} aria-pressed={active} className={`${active ? "selected" : ""} ${match ? "paired" : ""} ${reveal && match ? expected.includes(match) ? "correct" : "wrong" : ""}`} onClick={() => pick("right", right)}>{right}{match && <small>Pair {selected.indexOf(match) + 1}</small>}</button>;
    })}</div><p aria-live="polite">{pending ? `Selected: ${pending.value.replace(/[.!?]+$/, "")}. Now choose its match on the other side.` : "Tap either side to start. Tap a paired item to change its match."}</p></div>;
  }
  if (challenge.type === "blank") return <div className="quest-blank"><p>{(challenge.sentence ?? "The word is _____.").split("_____")[0]}<strong>{selected[0] ?? "…"}</strong>{(challenge.sentence ?? "").split("_____")[1]}</p><div className="quest-word-bank">{challenge.options.map((option) => <button type="button" key={option} disabled={disabled} aria-pressed={selected.includes(option)} className={selected.includes(option) ? "selected" : ""} onClick={() => onSelect(selected.includes(option) ? [] : [option])}>{option}</button>)}</div></div>;
  if (challenge.type === "ordering") return <div className="quest-sequence"><div className="quest-picked-sequence" aria-live="polite">{selected.length ? selected.map((value,index) => <button type="button" disabled={disabled} key={value} onClick={() => onSelect(selected.filter((entry) => entry !== value))}><small>{index + 1}</small>{value}</button>) : <p>Your sequence goes here.</p>}</div><div className="quest-word-bank">{challenge.options.map((option) => <button type="button" key={option} disabled={disabled || selected.includes(option)} onClick={() => onSelect([...selected,option])}>{option}</button>)}</div></div>;
  return <div className={`quest-answer-cards ${challenge.type === "cards" ? "quest-answer-cards--visual" : ""}`}>{challenge.options.map((option,index) => <button type="button" key={option} disabled={disabled} aria-pressed={selected.includes(option)} className={`${selected.includes(option) ? "selected" : ""} ${reveal && expected.includes(option) ? "correct" : ""} ${reveal && selected.includes(option) && !expected.includes(option) ? "wrong" : ""}`} onClick={() => onSelect(challenge.type === "multi" ? selected.includes(option) ? selected.filter((value) => value !== option) : [...selected, option] : [option])}>{challenge.type === "cards" ? <CardIcon term={option} /> : <span>{index + 1}</span>}<strong>{option}</strong></button>)}</div>;
}
