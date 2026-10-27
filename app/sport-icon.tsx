import MdiReact from "@mdi/react";
import {mdiFootball,mdiBasketball,mdiBaseball,mdiSoccer,mdiVolleyball,mdiTrophyOutline} from "@mdi/js";
const Icon = ((MdiReact as unknown as { Icon?: typeof MdiReact }).Icon ?? MdiReact) as typeof MdiReact;
const paths:Record<string,string>={football:mdiFootball,basketball:mdiBasketball,baseball:mdiBaseball,soccer:mdiSoccer,volleyball:mdiVolleyball};
export function SportGlyph({id,name}:{id:string;name:string}){
  return <span className="sport-glyph" role="img" aria-label={`${name} icon`}><Icon path={paths[id]??mdiTrophyOutline} size={1.8} aria-hidden="true" /></span>;
}
