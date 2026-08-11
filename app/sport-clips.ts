export type SportClip = {
  videoUrl: string;
  sourceUrl: string;
  sourceName: string;
  cue: string;
  startSeconds?: number;
  durationSeconds: number;
  licenseName: string;
  licenseUrl: string;
  reviewedOn: string;
  reviewStatus: "verified" | "needs-review";
};

const pexels = (id: number, sourceUrl: string, cue: string, verified = false, startSeconds = 0): SportClip => ({
  videoUrl: `https://www.pexels.com/download/video/${id}/`,
  sourceUrl,
  sourceName: "Pexels",
  cue,
  startSeconds,
  durationSeconds: 8,
  licenseName: "Pexels License",
  licenseUrl: "https://www.pexels.com/license/",
  reviewedOn: "2026-08-10",
  reviewStatus: verified ? "verified" : "needs-review",
});

const localCreativeCommonsClip = (videoUrl: string, sourceUrl: string, sourceName: string, cue: string): SportClip => ({
  videoUrl,
  sourceUrl,
  sourceName,
  cue,
  durationSeconds: 8,
  licenseName: "Creative Commons Attribution 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
  reviewedOn: "2026-08-10",
  reviewStatus: "verified",
});

// Only add clips after the linked source page has been checked for both the
// correct sport and reusable rights. Pexels clips use the Pexels license:
// https://www.pexels.com/license/. Local clips are attributed below and in
// README.md; they were trimmed, resized, and muted from CC BY 3.0 originals.
export const SPORT_CLIPS: Partial<Record<string, SportClip>> = {
  football: pexels(34396408, "https://www.pexels.com/video/exciting-american-football-gameplay-outdoors-34396408/", "Watch how the play starts together, then spreads across the field.", true),
  basketball: pexels(5275203, "https://www.pexels.com/video/guys-playing-a-basketball-game-5275203/", "Watch players pass, cut, and create room near the basket.", true),
  soccer: pexels(15448993, "https://www.pexels.com/video/football-players-kicking-the-ball-during-a-match-15448993/", "Follow the ball, then notice how teammates move into passing space.", true),
  volleyball: pexels(6216952, "https://www.pexels.com/video/people-playing-volleyball-6216952/", "Look for the pass-set-attack rhythm before the ball crosses the net."),
  baseball: pexels(33930470, "https://www.pexels.com/video/dynamic-nighttime-baseball-game-action-scene-33930470/", "Watch the pitch begin the action and the field react after contact."),
  softball: pexels(4937706, "https://www.pexels.com/video/baseball-softball-aerial-footage-4937706/", "Notice the diamond, pitcher, batter, and fielders moving together after the ball is put in play."),
  hockey: pexels(6338350, "https://www.pexels.com/video/men-playing-ice-hockey-6338350/", "Track the puck and notice how quickly attack becomes defense."),
  lacrosse: localCreativeCommonsClip("/sport-clips/lacrosse.mp4", "https://commons.wikimedia.org/wiki/File:National_Lacrosse_League-_Colorado_Mammoth%27s_Drew_Westervelt_Scores_Amazing_Dunk_Goal!.webm", "NLL · CC BY 3.0 · edited", "This is indoor box lacrosse: watch players carry and pass with their sticks, then attack the goal."),
  rugby: pexels(32469703, "https://www.pexels.com/video/professional-rugby-match-at-large-stadium-32469703/", "Watch the support runners stay behind the ball carrier for a legal pass."),
  "field-hockey": localCreativeCommonsClip("/sport-clips/field-hockey.mp4", "https://commons.wikimedia.org/wiki/File:Field_Hockey_vs_Shenandoah_Highlights.webm", "Stevenson Mustangs · CC BY 3.0 · edited", "Track the ball along the turf as players use the flat side of the stick to pass and attack the goal."),
  "water-polo": pexels(9424522, "https://www.pexels.com/video/drone-footage-of-people-playing-water-polo-9424522/", "Notice the passing shape around the goal while every player stays afloat."),
  cricket: pexels(36088018, "https://www.pexels.com/video/intense-cricket-match-action-on-sunny-day-36088018/", "Watch the bowler deliver, the batter respond, and the fielders react."),
  tennis: pexels(10378830, "https://www.pexels.com/video/tennis-players-playing-match-10378830/", "Follow the rally and watch each player recover toward open court."),
  "track-field": pexels(37253080, "https://www.pexels.com/video/exciting-track-and-field-race-at-outdoor-stadium-37253080/", "Watch the start, lane discipline, and sprint through the finish."),
  swimming: pexels(8050157, "https://www.pexels.com/video/people-doing-swimming-8050157/", "Look for body rhythm, breathing, and each swimmer's line through the water."),
  gymnastics: pexels(6573038, "https://www.pexels.com/video/a-woman-executing-a-gymnastic-exhibition-at-the-gym-6573038/", "Watch how the athlete connects skills and controls the landing."),
  pickleball: pexels(32041192, "https://www.pexels.com/video/aerial-pickleball-match-on-blue-court-32041192/", "Notice the smaller court, short paddles, and movement toward the kitchen line."),
  badminton: pexels(35427621, "https://www.pexels.com/video/exciting-indoor-badminton-match-in-progress-35427621/", "Track the shuttle and watch players recover to a central base."),
  golf: pexels(29108310, "https://www.pexels.com/video/golf-swing-on-a-sunny-course-day-29108310/", "Watch the setup, swing, contact, and balanced finish."),
  cycling: pexels(32892563, "https://www.pexels.com/video/cycling-race-on-scenic-road-32892563/", "Watch how riders use the group to save energy and hold position."),
  // MMA and wrestling remain intentionally unmapped until footage clearly shows
  // the named sport and its reuse rights have been verified. Generic sparring or
  // ring training is not an acceptable substitute for either discipline.
};

export function sportClipFor(sportId: string) {
  const clip = SPORT_CLIPS[sportId];
  return clip?.reviewStatus === "verified" ? clip : undefined;
}

export function sportClipReviewFor(sportId: string) {
  return SPORT_CLIPS[sportId];
}
