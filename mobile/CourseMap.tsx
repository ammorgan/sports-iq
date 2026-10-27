import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { courseModuleStates } from "../app/core-course";
import { coreSectionsForSport } from "../app/courses";
import type { LearningModule, Sport } from "../app/learning-data";

export function CourseMapMobile({ sport, modules, completedIds, avatarSource, onStart, onBack, onPositions }: {
  sport: Sport; modules: LearningModule[]; completedIds: string[]; avatarSource: ImageSourcePropType;
  onStart: (module: LearningModule) => void; onBack: () => void; onPositions: () => void;
}) {
  const states = courseModuleStates(modules, completedIds);
  const currentIndex = states.indexOf("current");
  const active = modules[currentIndex] ?? modules[modules.length - 1];
  const [openSection,setOpenSection] = useState(active.courseSection ?? 0);
  const completed = states.filter((state) => state === "complete").length;
  return <View style={s.shell}>
    <View style={s.top}><Pressable accessibilityRole="button" onPress={onBack} style={s.back}><MaterialCommunityIcons name="arrow-left" size={22} color="#e2d5f7" /><Text style={s.backText}>Sports</Text></Pressable><Text style={s.count}>{completed}/{modules.length} lessons complete</Text></View>
    <Text style={s.eyebrow}>YOUR {sport.name.toUpperCase()} JOURNEY</Text><Text style={s.title}>One rep. One new skill.</Text><Text style={s.lede}>Start simple. Build toward smarter game decisions.</Text>
    <View style={s.tracks}><View style={[s.track,s.trackActive]}><MaterialCommunityIcons name="flag-outline" size={24} color="#d3adff" /><View style={s.trackCopy}><Text style={s.trackTitle}>Learn the game</Text><Text style={s.trackNote}>From your first play to advanced reads</Text></View><MaterialCommunityIcons name="check-bold" size={21} color="#d3adff" /></View><Pressable accessibilityRole="button" onPress={onPositions} style={s.track}><MaterialCommunityIcons name="star-outline" size={24} color="#d3adff" /><View style={s.trackCopy}><Text style={s.trackTitle}>Position training</Text><Text style={s.trackNote}>Choose a role anytime</Text></View><MaterialCommunityIcons name="arrow-right" size={21} color="#d3adff" /></Pressable></View>
    <View style={s.coach}><Image source={avatarSource} style={s.avatar} resizeMode="contain" /><View style={s.bubble}><Text style={s.bubbleTitle}>{completed ? "Ready for your next rep?" : "New here? You’re in the right place."}</Text><Text style={s.bubbleText}>{active.description}</Text></View></View>
    <Pressable accessibilityRole="button" onPress={() => onStart(active)} style={({pressed}) => [s.continue,pressed&&s.pressed]}><View style={s.trackCopy}><Text style={s.continueLabel}>{currentIndex<0 ? "PATH COMPLETE" : "YOUR NEXT LESSON"}</Text><Text style={s.continueTitle}>{active.title}</Text></View><Text style={s.continueText}>{currentIndex<0 ? "Practice" : completed ? "Continue" : "Let’s play"}</Text><MaterialCommunityIcons name="arrow-right" size={23} color="#28143f" /></Pressable>
    {coreSectionsForSport(sport.id).map((section,sectionIndex) => {
      const entries = modules.map((module,index) => ({module,state:states[index]})).filter(({module}) => module.courseSection === sectionIndex);
      const allDone = entries.every(({state}) => state === "complete");
      const expanded = openSection === sectionIndex;
      return <View key={section.title} style={s.section}>
        <Pressable accessibilityRole="button" accessibilityState={{expanded}} accessibilityLabel={`${section.title}, ${allDone ? "complete" : expanded ? "open" : "view stage"}`} onPress={() => setOpenSection(expanded ? -1 : sectionIndex)} style={[s.banner,active.courseSection === sectionIndex && s.bannerCurrent]}><View style={s.number}><Text style={s.numberText}>{allDone ? "✓" : sectionIndex + 1}</Text></View><View style={s.trackCopy}><Text style={s.stageLabel}>{sectionIndex === 0 ? "BEGINNER" : sectionIndex === 9 ? "ADVANCED" : `STAGE ${sectionIndex+1}`}</Text><Text style={s.sectionTitle}>{section.title}</Text></View><Text style={s.expand}>{expanded ? "−" : "+"}</Text></Pressable>
        {expanded && <View><Text style={s.outcome}>{section.outcome}</Text><View style={s.trail}>{entries.map(({module,state},index) => <View key={module.id} style={[s.nodeWrap,{alignSelf:index%4===1 ? "flex-end" : index%4===2 ? "flex-start" : "center"}]}><Pressable accessibilityRole="button" accessibilityState={{disabled:state==="locked",selected:state==="current"}} accessibilityLabel={`${state === "locked" ? "Locked" : state === "complete" ? "Practice" : "Start"}: ${module.title}`} disabled={state==="locked"} onPress={() => onStart(module)} style={({pressed}) => [s.node,state==="current" && s.nodeCurrent,state==="complete" && s.nodeComplete,state==="locked" && s.nodeLocked,pressed && s.pressed]}><MaterialCommunityIcons name={state==="complete" ? "check-bold" : state==="locked" ? "lock-outline" : module.checkpoint ? "trophy-outline" : "play"} size={36} color={state==="current" ? "#28143f" : "#e8dcf7"} /></Pressable><Text style={[s.nodeTitle,state==="locked" && s.muted]}>{module.checkpoint ? "Game day" : module.title}</Text>{state==="current" && <Text style={s.playNext}>PLAY NEXT</Text>}</View>)}</View></View>}
      </View>;
    })}

  </View>;
}
const s=StyleSheet.create({
  shell:{width:"100%",maxWidth:620,alignSelf:"center",paddingHorizontal:16,paddingTop:10,paddingBottom:30},
  top:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:20},back:{minHeight:44,flexDirection:"row",alignItems:"center",gap:7},backText:{color:"#e2d5f7",fontSize:14,fontWeight:"700"},count:{color:"#baafcd",fontSize:11},
  eyebrow:{color:"#c3a1ff",fontSize:11,fontWeight:"800",letterSpacing:1},title:{color:"white",fontSize:32,lineHeight:36,fontWeight:"900",letterSpacing:-1,marginTop:10},lede:{color:"#c4bddb",fontSize:15,lineHeight:22,marginTop:8,marginBottom:20},
  tracks:{gap:10},track:{minHeight:68,flexDirection:"row",alignItems:"center",gap:12,padding:14,borderWidth:2,borderColor:"#50416d",borderRadius:17,backgroundColor:"#211839"},trackActive:{borderColor:"#b08bf4",backgroundColor:"#352353"},trackCopy:{flex:1,gap:4},trackTitle:{color:"white",fontSize:16,fontWeight:"800"},trackNote:{color:"#c9bfdc",fontSize:12,lineHeight:17},
  coach:{flexDirection:"row",alignItems:"center",gap:8,minHeight:145},avatar:{width:90,height:135},bubble:{flex:1,gap:7,padding:14,borderWidth:2,borderColor:"#52416e",borderRadius:18,backgroundColor:"#211839"},bubbleTitle:{color:"white",fontSize:15,fontWeight:"800",lineHeight:20},bubbleText:{color:"#c9bfdc",fontSize:13,lineHeight:18},
  section:{marginBottom:15},banner:{flexDirection:"row",alignItems:"center",gap:14,minHeight:80,padding:15,borderWidth:2,borderColor:"#51406d",borderBottomWidth:6,borderRadius:20,backgroundColor:"#241b3e"},bannerCurrent:{backgroundColor:"#53308d",borderColor:"#a17bdb"},number:{width:39,height:39,alignItems:"center",justifyContent:"center",borderRadius:13,backgroundColor:"#160e2c"},numberText:{color:"#f7cf61",fontSize:18,fontWeight:"900"},stageLabel:{color:"#cbbbe3",fontSize:10,fontWeight:"800",letterSpacing:1},sectionTitle:{color:"white",fontSize:19,fontWeight:"800"},expand:{color:"white",fontSize:24},outcome:{color:"#c7bddc",fontSize:14,lineHeight:21,margin:16},trail:{gap:24,paddingHorizontal:30,paddingBottom:25},nodeWrap:{width:150,alignItems:"center",gap:10},node:{width:78,height:78,alignItems:"center",justifyContent:"center",borderRadius:33,borderWidth:3,borderBottomWidth:9,borderColor:"#af8de5",backgroundColor:"#7350b4"},nodeCurrent:{width:89,height:88,backgroundColor:"#f4c44f",borderColor:"#ffeaa2",borderBottomColor:"#9e6f25"},nodeComplete:{backgroundColor:"#327b65",borderColor:"#a7e8cd",borderBottomColor:"#184b3c"},nodeLocked:{backgroundColor:"#2c243a",borderColor:"#544867",borderBottomColor:"#161021"},nodeTitle:{color:"#eee8f8",fontSize:14,fontWeight:"700",textAlign:"center"},muted:{color:"#a79ab9"},playNext:{color:"#f7cf61",fontSize:10,fontWeight:"900",letterSpacing:1},
  continue:{minHeight:85,flexDirection:"row",alignItems:"center",gap:12,padding:17,marginTop:0,marginBottom:24,borderRadius:20,borderBottomWidth:6,borderColor:"#9c7428",backgroundColor:"#f5c64f"},continueLabel:{color:"#5b4224",fontSize:9,fontWeight:"900",letterSpacing:.8},continueTitle:{color:"#28143f",fontSize:15,fontWeight:"800"},continueText:{color:"#28143f",fontSize:15,fontWeight:"900"},pressed:{transform:[{translateY:3}],opacity:.9},
});
