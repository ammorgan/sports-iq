/* eslint-disable @typescript-eslint/no-require-imports */
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ReactNode } from "react";
import { Image, ImageBackground, type ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import { gamePathNodeStates, gamePathProgress, gamePathStageState, gamePathStageTarget, type GamePathNodeKind, type GamePathUnit } from "../app/game-path";
import type { LearningModule } from "../app/learning-data";

const ICONS: Record<GamePathNodeKind, keyof typeof MaterialCommunityIcons.glyphMap> = {
  film: "movie-play-outline",
  audio: "headphones",
  "field-read": "map-marker-path",
  match: "puzzle-outline",
  scenario: "strategy",
  review: "refresh",
  checkpoint: "clipboard-check-outline",
  boss: "shield-star-outline",
};

const NODE_POSITIONS = [
  { x: 51, y: 10 },
  { x: 36, y: 21 },
  { x: 62, y: 32 },
  { x: 37, y: 43 },
  { x: 63, y: 54 },
  { x: 37, y: 65 },
  { x: 62, y: 76 },
  { x: 48, y: 89 },
];

const LOCKER_STAGES: Array<{
  id: "watch" | "build" | "call";
  label: string;
  note: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  kinds: GamePathNodeKind[];
}> = [
  { id: "watch", label: "WATCH THE PLAY", note: "See how it works", icon: "movie-play-outline", kinds: ["film", "audio"] },
  { id: "build", label: "BUILD THE PLAY", note: "Put it together", icon: "map-marker-path", kinds: ["field-read", "match"] },
  { id: "call", label: "MAKE THE CALL", note: "Choose in game time", icon: "strategy", kinds: ["scenario", "review", "checkpoint"] },
];

type GamePathMapMobileProps = {
  unit: GamePathUnit;
  completionIds: string[];
  avatarSource: ImageSourcePropType;
  sportColor: string;
  onStart: (module: LearningModule) => void;
  variant?: "classic" | "locker";
  onChoosePositionPath?: () => void;
  onNavigateHome?: () => void;
  onNavigatePlayer?: () => void;
  filmPreview?: ReactNode;
};

function LockerGamePathMobile({
  unit,
  completionIds,
  avatarSource,
  onStart,
  onChoosePositionPath,
  onNavigateHome,
  onNavigatePlayer,
  filmPreview,
}: GamePathMapMobileProps) {
  const states = gamePathNodeStates(unit, completionIds);
  const progress = gamePathProgress(unit, completionIds);
  const activeNode = progress.currentNode ?? unit.nodes.at(-1) ?? null;
  const gameDayNode = unit.nodes.find((node) => node.kind === "boss") ?? unit.nodes.at(-1) ?? null;
  const gameDayState = gameDayNode ? states.get(gameDayNode.id) ?? "locked" : "locked";

  return <View style={styles.lockerShell}>
    <View style={styles.lockerHeading}>
      <View style={styles.lockerSportIcon}><MaterialCommunityIcons name="football" size={31} color="#f7c653" /></View>
      <View style={styles.lockerHeadingCopy}><Text numberOfLines={1} adjustsFontSizeToFit style={styles.lockerSportTitle}>TACKLE FOOTBALL</Text><Text style={styles.lockerSeason}>ROOKIE SEASON</Text></View>
      <Text style={styles.lockerCount}>{progress.completed} OF {progress.total}</Text>
      <View accessible accessibilityLabel={`${progress.completed} of ${progress.total} reps complete`} style={styles.lockerProgressDots}>
        {unit.nodes.map((node) => {
          const state = states.get(node.id) ?? "locked";
          return <View key={node.id} style={[styles.lockerProgressDot, state === "complete" && styles.lockerProgressDotComplete, state === "current" && styles.lockerProgressDotCurrent]} />;
        })}
      </View>
    </View>

    <ImageBackground source={require("./assets/backgrounds/game-path-football-locker.jpg")} resizeMode="cover" style={styles.lockerScene} imageStyle={styles.lockerSceneImage}>
      {gameDayNode && <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${gameDayState === "locked" ? "Locked" : gameDayState === "complete" ? "Practice" : "Start"}: Game Day`}
        accessibilityState={{ disabled: gameDayState === "locked" }}
        disabled={gameDayState === "locked"}
        onPress={() => onStart(gameDayNode.module)}
        style={({ pressed }) => [styles.lockerGameDay, gameDayState === "current" && styles.lockerStageCurrent, gameDayState === "complete" && styles.lockerStageComplete, gameDayState === "locked" && styles.lockerStageLocked, pressed && gameDayState !== "locked" && styles.pressed]}
      >
        <MaterialCommunityIcons name={gameDayState === "locked" ? "lock-outline" : gameDayState === "complete" ? "check-bold" : "shield-star-outline"} size={28} color="white" />
        <Text style={styles.lockerGameDayText}>GAME DAY</Text>
      </Pressable>}

      <View style={styles.lockerStations}>
        {LOCKER_STAGES.map((stage) => {
          const nodes = unit.nodes.filter((node) => stage.kinds.includes(node.kind));
          const state = gamePathStageState(nodes, states);
          const target = gamePathStageTarget(nodes, states);
          return <Pressable
            key={stage.id}
            accessibilityRole="button"
            accessibilityLabel={`${state === "locked" ? "Locked" : state === "complete" ? "Practice" : "Continue"}: ${stage.label}`}
            accessibilityState={{ disabled: state === "locked", selected: state === "current" }}
            disabled={state === "locked" || !target}
            onPress={() => target && onStart(target.module)}
            style={({ pressed }) => [styles.lockerStation, stage.id === "watch" && styles.lockerStationWatch, stage.id === "build" && styles.lockerStationBuild, state === "current" && styles.lockerStageCurrent, state === "complete" && styles.lockerStageComplete, state === "locked" && styles.lockerStageLocked, pressed && state !== "locked" && styles.pressed]}
          >
            <MaterialCommunityIcons name={state === "complete" ? "check-bold" : state === "locked" ? "lock-outline" : stage.icon} size={30} color={state === "current" ? "#f7c653" : "white"} />
            <Text style={styles.lockerStationTitle}>{stage.label}</Text>
            <Text style={styles.lockerStationNote}>{state === "locked" ? "Finish the stage before" : state === "complete" ? "Stage cleared" : stage.note}</Text>
          </Pressable>;
        })}
      </View>

      <Image source={avatarSource} resizeMode="contain" style={styles.lockerCoach} />

      {activeNode && <View style={styles.lockerConsole}>
        <Text style={styles.lockerConsoleKicker}>{progress.currentNode ? "NEXT REP" : "SEASON COMPLETE"}</Text>
        <Text style={styles.lockerConsoleTitle}>{progress.currentNode?.title ?? "PRACTICE GAME DAY"}</Text>
        <Pressable accessibilityRole="button" onPress={() => onStart(activeNode.module)} style={({ pressed }) => [styles.lockerPlayButton, pressed && styles.pressed]}>
          <Text style={styles.lockerPlayButtonText}>{progress.currentNode ? "ENTER THE FIELD" : "PLAY AGAIN"}</Text>
          <MaterialCommunityIcons name="arrow-right-bold" size={23} color="#170b45" />
        </Pressable>
      </View>}
    </ImageBackground>

    {filmPreview && <View style={styles.lockerFilmPreview}>{filmPreview}</View>}

    <View style={styles.lockerPathSwitch}>
      <View accessibilityRole="button" accessibilityState={{ selected: true }} style={[styles.lockerPathButton, styles.lockerPathButtonActive]}><MaterialCommunityIcons name="map-marker-path" size={25} color="#f7c653" /><View style={styles.lockerPathCopy}><Text style={styles.lockerPathTitle}>LEARN THE GAME</Text><Text style={styles.lockerPathNote}>Rookie Season journey</Text></View><MaterialCommunityIcons name="check-bold" size={22} color="#f7c653" /></View>
      {onChoosePositionPath && <Pressable accessibilityRole="button" onPress={onChoosePositionPath} style={({ pressed }) => [styles.lockerPathButton, pressed && styles.pressed]}><MaterialCommunityIcons name="strategy" size={25} color="#f7c653" /><View style={styles.lockerPathCopy}><Text style={styles.lockerPathTitle}>POSITION IQ</Text><Text style={styles.lockerPathNote}>Train a football role</Text></View><MaterialCommunityIcons name="arrow-right-bold" size={22} color="white" /></Pressable>}
    </View>

    {(onNavigateHome || onNavigatePlayer) && <View accessibilityRole="tablist" style={styles.lockerNav}>
      <Pressable accessibilityRole="tab" onPress={onNavigateHome} style={styles.lockerNavButton}><MaterialCommunityIcons name="home-outline" size={27} color="rgba(255,255,255,.68)" /><Text style={styles.lockerNavText}>HOME</Text></Pressable>
      <Pressable accessibilityRole="tab" accessibilityState={{ selected: true }} onPress={onNavigateHome} style={[styles.lockerNavButton, styles.lockerNavButtonActive]}><MaterialCommunityIcons name="view-grid-outline" size={27} color="#f7c653" /><Text style={[styles.lockerNavText, styles.lockerNavTextActive]}>SPORTS</Text></Pressable>
      <Pressable accessibilityRole="tab" onPress={onNavigatePlayer} style={styles.lockerNavButton}><MaterialCommunityIcons name="account-outline" size={27} color="rgba(255,255,255,.68)" /><Text style={styles.lockerNavText}>PLAYER</Text></Pressable>
    </View>}
  </View>;
}

function ClassicGamePathMobile({ unit, completionIds, avatarSource, sportColor, onStart }: GamePathMapMobileProps) {
  const states = gamePathNodeStates(unit, completionIds);
  const progress = gamePathProgress(unit, completionIds);
  const activeNode = progress.currentNode ?? unit.nodes.at(-1) ?? null;
  const activeIndex = activeNode ? unit.nodes.findIndex((node) => node.id === activeNode.id) : 0;
  const activePosition = NODE_POSITIONS[activeIndex] ?? NODE_POSITIONS[0];

  return <View style={styles.shell}>
    <View style={styles.heading}>
      <View style={styles.headingCopy}><Text style={styles.kicker}>UNIT 1 · YOUR NEXT DRIVE</Text><Text style={styles.title}>{unit.title}</Text><Text style={styles.objective}>{unit.objective}</Text></View>
      <View style={styles.count}><Text style={styles.countValue}>{progress.completed}/{progress.total}</Text><Text style={styles.countLabel}>NODES</Text></View>
    </View>
    <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress.percent}%` }]} /></View>
    <ImageBackground source={require("./assets/backgrounds/game-path-football-arena.webp")} resizeMode="cover" style={styles.arena} imageStyle={styles.arenaImage}>
      <View style={[styles.coach, activePosition.x > 50 ? styles.coachLeft : styles.coachRight, { top: `${Math.min(78, activePosition.y + 3)}%` }]} pointerEvents="none">
        <Image source={avatarSource} resizeMode="contain" style={styles.coachAvatar} />
        <View style={styles.coachBubble}><Text style={styles.coachLabel}>{progress.currentNode ? "YOUR NEXT REP" : "UNIT CLEARED"}</Text><Text style={styles.coachValue}>{progress.currentNode?.title ?? "GAME DAY READY"}</Text></View>
      </View>
      {unit.nodes.map((node, index) => {
        const position = NODE_POSITIONS[index] ?? { x: index % 2 ? 37 : 63, y: 10 + index * 10 };
        const state = states.get(node.id) ?? "locked";
        const complete = state === "complete";
        const locked = state === "locked";
        const current = state === "current";
        return <View key={node.id} style={[styles.stop, { left: `${position.x}%`, top: `${position.y}%` }]}>
          <Pressable accessibilityRole="button" accessibilityLabel={`${complete ? "Practice" : current ? "Start" : "Locked"}: ${node.title}`} accessibilityState={{ disabled: locked }} disabled={locked} onPress={() => onStart(node.module)} style={({ pressed }) => [styles.node, complete && styles.nodeComplete, locked && styles.nodeLocked, current && styles.nodeCurrent, current && { backgroundColor: sportColor }, pressed && !locked && styles.nodePressed]}>
            <MaterialCommunityIcons name={complete ? "check-bold" : locked ? "lock-outline" : ICONS[node.kind]} size={current ? 34 : 29} color="white" />
          </Pressable>
          {!locked && <View style={[styles.nodeLabel, current && styles.nodeLabelCurrent]}><Text style={styles.nodeStatus}>{complete ? "CLEARED" : "PLAY NEXT"}</Text><Text style={styles.nodeTitle}>{node.title}</Text>{current && <Text style={styles.nodeDescription}>{node.description}</Text>}</View>}
        </View>;
      })}
    </ImageBackground>
    {activeNode && <Pressable accessibilityRole="button" onPress={() => onStart(activeNode.module)} style={({ pressed }) => [styles.playButton, pressed && styles.nodePressed]}><Text style={styles.playButtonText}>{progress.currentNode ? "PLAY NEXT REP" : "PRACTICE GAME DAY"}</Text><MaterialCommunityIcons name={ICONS[activeNode.kind]} size={24} color="#1a104a" /></Pressable>}
  </View>;
}

export function GamePathMapMobile(props: GamePathMapMobileProps) {
  return props.variant === "locker" ? <LockerGamePathMobile {...props} /> : <ClassicGamePathMobile {...props} />;
}

const styles = StyleSheet.create({
  lockerShell: { width: "100%", maxWidth: 680, alignSelf: "center", overflow: "hidden", borderWidth: 1, borderColor: "rgba(247,198,83,.52)", borderRadius: 30, backgroundColor: "#0b072d" },
  lockerHeading: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 9, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 11, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,.14)", backgroundColor: "#110b42" },
  lockerSportIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#9d64ff", borderRadius: 14, backgroundColor: "#160f4d" },
  lockerHeadingCopy: { flex: 1 },
  lockerSportTitle: { color: "white", fontSize: 20, fontWeight: "900", letterSpacing: -.9, lineHeight: 22 },
  lockerSeason: { marginTop: 4, color: "#f7c653", fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  lockerCount: { alignSelf: "flex-end", paddingBottom: 2, color: "rgba(255,255,255,.78)", fontSize: 9, fontWeight: "900", letterSpacing: .7 },
  lockerProgressDots: { width: "100%", flexDirection: "row", gap: 5, paddingLeft: 53 },
  lockerProgressDot: { flex: 1, height: 6, borderWidth: 1, borderColor: "rgba(255,255,255,.38)", borderRadius: 99, backgroundColor: "rgba(255,255,255,.12)" },
  lockerProgressDotComplete: { borderColor: "white", backgroundColor: "#39a672" },
  lockerProgressDotCurrent: { borderColor: "white", backgroundColor: "#f7c653" },
  lockerScene: { position: "relative", width: "100%", minHeight: 593, overflow: "hidden" },
  lockerSceneImage: { opacity: .96 },
  lockerGameDay: { position: "absolute", zIndex: 3, top: 89, left: "50%", width: 142, minHeight: 64, alignItems: "center", justifyContent: "center", gap: 3, marginLeft: -71, borderWidth: 2, borderColor: "#f7c653", borderRadius: 19, backgroundColor: "rgba(12,8,49,.9)", shadowColor: "#030218", shadowOffset: { width: 0, height: 8 }, shadowOpacity: .5, shadowRadius: 12, elevation: 6 },
  lockerGameDayText: { color: "white", fontSize: 10, fontWeight: "900", letterSpacing: .8 },
  lockerStations: { position: "absolute", zIndex: 6, top: 178, left: 9, right: 9, flexDirection: "row", alignItems: "flex-start", gap: 7 },
  lockerStation: { flex: 1, minHeight: 124, alignItems: "center", justifyContent: "center", gap: 5, paddingHorizontal: 5, paddingVertical: 10, borderWidth: 2, borderColor: "#7a4cdb", borderRadius: 18, backgroundColor: "rgba(12,8,49,.92)", shadowColor: "#030218", shadowOffset: { width: 0, height: 9 }, shadowOpacity: .5, shadowRadius: 12, elevation: 7 },
  lockerStationWatch: { zIndex: 6, elevation: 12 },
  lockerStationBuild: { marginTop: 24 },
  lockerStageCurrent: { borderColor: "white", borderWidth: 3, backgroundColor: "rgba(30,14,91,.96)", shadowColor: "#8f55ff", shadowOpacity: .9, shadowRadius: 13, elevation: 10 },
  lockerStageComplete: { borderColor: "#b7f0d2", backgroundColor: "rgba(24,91,64,.95)" },
  lockerStageLocked: { borderColor: "rgba(255,255,255,.4)", opacity: .76 },
  lockerStationTitle: { color: "white", fontSize: 10, lineHeight: 11, fontWeight: "900", textAlign: "center" },
  lockerStationNote: { color: "rgba(255,255,255,.7)", fontSize: 8, lineHeight: 10, fontWeight: "700", textAlign: "center" },
  lockerCoach: { position: "absolute", zIndex: 5, bottom: 195, left: -82, width: "66%", height: 340, transform: [{ scale: 1.35 }] },
  lockerConsole: { position: "absolute", zIndex: 7, right: 10, bottom: 70, left: 10, minHeight: 138, justifyContent: "center", padding: 11, borderWidth: 2, borderColor: "#f7c653", borderRadius: 21, backgroundColor: "rgba(12,8,49,.96)", shadowColor: "#7c3aed", shadowOffset: { width: 0, height: 7 }, shadowOpacity: .8, shadowRadius: 8, elevation: 11 },
  lockerConsoleKicker: { color: "#f7c653", fontSize: 8, fontWeight: "900", letterSpacing: .8, textAlign: "center" },
  lockerConsoleTitle: { marginTop: 3, marginBottom: 10, color: "white", fontSize: 18, lineHeight: 19, fontWeight: "900", textAlign: "center" },
  lockerPlayButton: { minHeight: 55, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 3, borderColor: "white", borderRadius: 17, backgroundColor: "#f7c653" },
  lockerPlayButtonText: { color: "#170b45", fontSize: 11, fontWeight: "900", letterSpacing: .35 },
  lockerPathSwitch: { gap: 10, padding: 13, backgroundColor: "#0b072d" },
  lockerFilmPreview: { paddingHorizontal: 13, paddingTop: 13, backgroundColor: "#0b072d" },
  lockerPathButton: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 2, borderColor: "rgba(255,255,255,.2)", borderRadius: 20, backgroundColor: "#17104d" },
  lockerPathButtonActive: { borderColor: "rgba(247,198,83,.62)" },
  lockerPathCopy: { flex: 1, gap: 3 },
  lockerPathTitle: { color: "white", fontSize: 12, fontWeight: "900", letterSpacing: .3 },
  lockerPathNote: { color: "rgba(255,255,255,.68)", fontSize: 9 },
  lockerNav: { height: 69, flexDirection: "row", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,.15)", backgroundColor: "#0c0831" },
  lockerNavButton: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  lockerNavButtonActive: { backgroundColor: "rgba(255,255,255,.07)" },
  lockerNavText: { color: "rgba(255,255,255,.65)", fontSize: 8, fontWeight: "900", letterSpacing: .5 },
  lockerNavTextActive: { color: "#f7c653" },
  pressed: { transform: [{ scale: .97 }], opacity: .92 },

  shell: { width: "100%", marginTop: 22, marginBottom: 34 },
  heading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12, paddingHorizontal: 4, marginBottom: 12 },
  headingCopy: { flex: 1 },
  kicker: { color: "#f7c653", fontSize: 9, fontWeight: "900", letterSpacing: 1.1 },
  title: { marginTop: 5, color: "white", fontSize: 34, lineHeight: 35, fontWeight: "900", letterSpacing: -1.5 },
  objective: { marginTop: 5, color: "rgba(255,255,255,.74)", fontFamily: "Georgia", fontSize: 12, lineHeight: 17 },
  count: { width: 66, height: 66, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(255,255,255,.25)", borderRadius: 20, backgroundColor: "rgba(12,8,49,.78)" },
  countValue: { color: "#f7c653", fontSize: 18, fontWeight: "900" },
  countLabel: { marginTop: 1, color: "rgba(255,255,255,.72)", fontSize: 7, fontWeight: "900", letterSpacing: 1 },
  progressTrack: { height: 8, marginHorizontal: 4, marginBottom: 12, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,.18)", borderRadius: 999, backgroundColor: "rgba(9,6,38,.72)" },
  progressFill: { height: "100%", borderRadius: 999, backgroundColor: "#f7c653" },
  arena: { position: "relative", width: "100%", height: 1180, overflow: "hidden" },
  arenaImage: { borderWidth: 2, borderColor: "rgba(247,198,83,.66)", borderRadius: 34 },
  stop: { position: "absolute", zIndex: 4, width: 120, alignItems: "center", transform: [{ translateX: -60 }, { translateY: -48 }] },
  node: { width: 74, height: 74, alignItems: "center", justifyContent: "center", borderWidth: 5, borderColor: "#f7c653", borderRadius: 37, backgroundColor: "#100b3c", shadowColor: "#000", shadowOffset: { width: 0, height: 9 }, shadowOpacity: .42, shadowRadius: 9, elevation: 8 },
  nodeCurrent: { width: 88, height: 88, borderWidth: 6, borderColor: "white", borderRadius: 44, shadowColor: "#8f55ff", shadowOpacity: .9, shadowRadius: 15, elevation: 13 },
  nodeComplete: { borderColor: "white", backgroundColor: "#2d8058" },
  nodeLocked: { borderColor: "#68738e", backgroundColor: "#242741", opacity: .72 },
  nodePressed: { transform: [{ scale: .95 }] },
  nodeLabel: { minWidth: 116, maxWidth: 150, alignItems: "center", gap: 1, marginTop: 6, paddingHorizontal: 8, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(255,255,255,.2)", borderRadius: 12, backgroundColor: "rgba(8,5,35,.88)" },
  nodeLabelCurrent: { minWidth: 148, borderColor: "#f7c653" },
  nodeStatus: { color: "#f7c653", fontSize: 7, fontWeight: "900", letterSpacing: .8 },
  nodeTitle: { color: "white", fontSize: 10, fontWeight: "900", textAlign: "center" },
  nodeDescription: { marginTop: 2, color: "rgba(255,255,255,.7)", fontFamily: "Georgia", fontSize: 8, lineHeight: 11, textAlign: "center" },
  coach: { position: "absolute", zIndex: 6, width: 128, alignItems: "center" },
  coachLeft: { left: 5 },
  coachRight: { right: 5 },
  coachAvatar: { width: 118, height: 142 },
  coachBubble: { minWidth: 112, marginTop: -12, paddingHorizontal: 9, paddingVertical: 7, borderWidth: 2, borderColor: "#f7c653", borderRadius: 13, backgroundColor: "rgba(10,6,42,.94)" },
  coachLabel: { color: "white", fontSize: 7, fontWeight: "900", letterSpacing: .8, textAlign: "center" },
  coachValue: { marginTop: 2, color: "#f7c653", fontSize: 9, fontWeight: "900", textAlign: "center" },
  playButton: { zIndex: 8, width: "88%", minHeight: 64, alignSelf: "center", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: -22, borderWidth: 4, borderColor: "white", borderRadius: 22, backgroundColor: "#f7c653", shadowColor: "#7c3aed", shadowOffset: { width: 0, height: 7 }, shadowOpacity: .8, shadowRadius: 0, elevation: 12 },
  playButtonText: { color: "#1a104a", fontSize: 15, fontWeight: "900", letterSpacing: .5 },
});
