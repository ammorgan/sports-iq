export type SportClip = {
  videoUrl: string;
  sourceUrl: string;
  sourceName: string;
  cue: string;
  startSeconds?: number;
  durationSeconds: number;
  licenseName: string;
  licenseUrl: string;
  publishedOn?: string;
  reviewedOn: string;
  reviewStatus: "verified" | "needs-review";
};

const pexels = (id: number, sourceUrl: string, cue: string, verified = false, startSeconds = 0, publishedOn?: string, reviewedOn = "2026-08-10", durationSeconds = 8): SportClip => ({
  videoUrl: `https://www.pexels.com/download/video/${id}/`,
  sourceUrl,
  sourceName: "Pexels",
  cue,
  startSeconds,
  durationSeconds,
  licenseName: "Pexels License",
  licenseUrl: "https://www.pexels.com/license/",
  publishedOn,
  reviewedOn,
  reviewStatus: verified ? "verified" : "needs-review",
});

const localCreativeCommonsClip = (videoUrl: string, sourceUrl: string, sourceName: string, cue: string, verified = false): SportClip => ({
  videoUrl,
  sourceUrl,
  sourceName,
  cue,
  durationSeconds: 8,
  licenseName: "Creative Commons Attribution 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
  reviewedOn: "2026-08-10",
  reviewStatus: verified ? "verified" : "needs-review",
});

// Only add clips after the linked source page has been checked for both the
// correct sport and reusable rights. Pexels clips use the Pexels license:
// https://www.pexels.com/license/. Local clips are attributed below and in
// README.md; they were trimmed, resized, and muted from CC BY 3.0 originals.
export const SPORT_CLIPS: Partial<Record<string, SportClip>> = {
  football: pexels(34396408, "https://www.pexels.com/video/exciting-american-football-gameplay-outdoors-34396408/", "Watch how the play starts together, then spreads across the field.", true, 0, "2025-10-22", "2026-08-16"),
  "flag-football": {
    videoUrl: "",
    sourceUrl: "https://www.youtube.com/watch?v=QYwRDtRjzrM",
    sourceName: "USA Football · CC BY 3.0 · 8-second excerpt",
    cue: "Watch the runner change direction, then see the defender end the play by pulling a flag.",
    startSeconds: 5,
    durationSeconds: 8,
    licenseName: "Creative Commons Attribution 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    publishedOn: "2023-10-16",
    reviewedOn: "2026-08-16",
    reviewStatus: "needs-review",
  },
  basketball: pexels(19570050, "https://www.pexels.com/video/a-group-of-people-playing-basketball-at-night-19570050/", "Watch the ball handler create space, then follow the shot to the rim.", true, 0, "2023-12-24", "2026-08-16"),
  soccer: pexels(33831187, "https://www.pexels.com/video/dynamic-soccer-match-on-sunny-day-field-33831187/", "Follow the ball, then notice how teammates move into passing space.", true, 0, "2025-09-15", "2026-08-16"),
  volleyball: pexels(33088228, "https://www.pexels.com/video/energetic-outdoor-volleyball-match-in-action-33088228/", "Track the ball over the net and notice how teammates spread to cover the court.", true, 0, "2025-07-20", "2026-08-16"),
  baseball: pexels(33853229, "https://www.pexels.com/video/exciting-night-baseball-game-under-stadium-lights-33853229/", "Watch the pitcher start the play, then follow the batter and fielders.", true, 0, "2025-09-15", "2026-08-16"),
  softball: pexels(34224893, "https://www.pexels.com/video/jakarta-softball-game-against-urban-skyline-34224893/", "Notice the pitcher, batter, catcher, and fielders react together on the diamond.", true, 0, "2025-10-09", "2026-08-16"),
  hockey: pexels(37130593, "https://www.pexels.com/video/exciting-ice-hockey-game-in-indoor-arena-37130593/", "Track the puck as the skaters attack and the goalie protects the net.", true, 0, "2026-04-17", "2026-08-16"),
  lacrosse: localCreativeCommonsClip("", "https://commons.wikimedia.org/wiki/File:National_Lacrosse_League-_Colorado_Mammoth%27s_Drew_Westervelt_Scores_Amazing_Dunk_Goal!.webm", "NLL · CC BY 3.0 · edited", "This is indoor box lacrosse: watch players carry and pass with their sticks, then attack the goal."),
  rugby: pexels(38212185, "https://www.pexels.com/video/exciting-rugby-match-on-sunny-day-38212185/", "Watch the tackle area, then notice teammates spread into support.", true, 0, "2026-06-21", "2026-08-16"),
  "field-hockey": localCreativeCommonsClip("/sport-clips/field-hockey.mp4", "https://commons.wikimedia.org/wiki/File:Field_Hockey_vs_Shenandoah_Highlights.webm", "Stevenson Mustangs · CC BY 3.0 · edited", "Track the ball along the turf as players use the flat side of the stick to pass and attack the goal.", true),
  "water-polo": pexels(9424522, "https://www.pexels.com/video/drone-footage-of-people-playing-water-polo-9424522/", "Notice the passing shape around the goal while every player stays afloat."),
  cricket: pexels(36088018, "https://www.pexels.com/video/intense-cricket-match-action-on-sunny-day-36088018/", "Watch the bowler deliver, the batter respond, and the fielders react.", true, 0, "2026-02-11", "2026-08-16", 7),
  tennis: pexels(34963195, "https://www.pexels.com/video/aerial-view-of-tennis-match-on-clay-court-34963195/", "Follow the full-court rally and notice how each player recovers after a shot.", true, 0, "2025-11-28", "2026-08-16"),
  "track-field": pexels(31229039, "https://www.pexels.com/video/athletes-sprinting-on-outdoor-track-in-daylight-31229039/", "Watch the sprinters hold their lanes and drive all the way through the finish.", true, 7, "2025-03-21", "2026-08-16"),
  swimming: pexels(34394019, "https://www.pexels.com/video/outdoor-competitive-swimming-event-34394019/", "Watch the start, the dive, and each swimmer race inside a marked lane.", true, 11, "2025-10-26", "2026-08-16"),
  gymnastics: pexels(6573038, "https://www.pexels.com/video/a-woman-executing-a-gymnastic-exhibition-at-the-gym-6573038/", "Watch how the athlete connects skills and controls the landing."),
  pickleball: pexels(37318760, "https://www.pexels.com/video/outdoor-pickleball-match-at-shopping-mall-37318760/", "Notice the compact court, paddles, and quick exchange across the low net.", true, 0, "2026-04-30", "2026-08-16"),
  badminton: pexels(35427621, "https://www.pexels.com/video/exciting-indoor-badminton-match-in-progress-35427621/", "Track the shuttle through the doubles rally and watch each pair recover its court shape.", true, 0, "2025-12-31", "2026-08-16"),
  golf: pexels(29108310, "https://www.pexels.com/video/golf-swing-on-a-sunny-course-day-29108310/", "Watch the setup, swing, contact, and balanced finish.", true, 5, "2024-10-31", "2026-08-16"),
  cycling: pexels(32892563, "https://www.pexels.com/video/cycling-race-on-scenic-road-32892563/", "Watch how road racers use the group to save energy and hold position.", true, 0, "2025-07-06", "2026-08-16"),
  mma: pexels(38631562, "https://www.pexels.com/video/intense-mixed-martial-arts-sparring-session-38631562/", "This clip shows MMA striking practice: watch distance, defense, and a legal attack. The lesson also teaches grappling.", true, 0, "2026-07-19", "2026-08-16"),
  bowling: pexels(16021857, "https://www.pexels.com/video/a-man-is-bowling-in-a-bowling-alley-16021857/", "Watch the approach, smooth release, and the ball roll toward all ten pins.", true, 0, "2023-03-22", "2026-08-16", 6),
  // Wrestling remains intentionally unmapped until footage clearly shows the
  // named discipline and its reuse rights have been verified. Pro wrestling,
  // arm wrestling, judo, and generic martial arts are not substitutes.
};

export function sportClipFor(sportId: string) {
  const clip = SPORT_CLIPS[sportId];
  return clip?.reviewStatus === "verified" ? clip : undefined;
}

export function sportClipReviewFor(sportId: string) {
  return SPORT_CLIPS[sportId];
}
