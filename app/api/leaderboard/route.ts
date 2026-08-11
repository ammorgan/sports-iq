import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

type LeaderRow = { playerId: string; alias: string; avatarId: string; xp: number };

export async function GET() {
  const runtime = env as unknown as { DB?: D1Database };
  if (!runtime.DB) {
    return Response.json({ entries: [], status: "setup" }, { headers: { "Cache-Control": "no-store" } });
  }

  let result: D1Result<LeaderRow>;
  try {
    result = await runtime.DB.prepare(`
      SELECT
        p.id AS playerId,
        p.public_alias AS alias,
        p.avatar_id AS avatarId,
        COALESCE(SUM(s.xp), 0) AS xp
      FROM player_profiles AS p
      INNER JOIN accounts AS a ON a.id = p.owner_account_id
      LEFT JOIN sport_progress AS s ON s.player_id = p.id
      WHERE p.leaderboard_opt_in = 1
        AND p.is_child_account = 0
        AND p.deleted_at IS NULL
        AND a.deleted_at IS NULL
        AND a.status = 'active'
        AND p.public_alias IS NOT NULL
        AND LENGTH(TRIM(p.public_alias)) BETWEEN 2 AND 24
      GROUP BY p.id, p.public_alias, p.avatar_id
      ORDER BY xp DESC, p.created_at ASC
      LIMIT 50
    `).all<LeaderRow>();
  } catch (error) {
    // Fresh local previews can have the D1 binding before migrations are applied.
    const message = error instanceof Error ? error.message : "Unknown D1 error";
    if (!message.includes("no such table")) console.error("[leaderboard] Query failed:", message);
    return Response.json({ entries: [], status: "setup" }, { headers: { "Cache-Control": "no-store" } });
  }

  const entries = (result.results ?? []).map((entry, index) => ({
    rank: index + 1,
    alias: entry.alias,
    avatarId: entry.avatarId,
    xp: Number(entry.xp) || 0,
  }));

  return Response.json({ entries, status: "ready" }, {
    headers: {
      "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
