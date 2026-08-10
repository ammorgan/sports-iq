import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

type RuntimeEnv = Record<string, string | undefined>;

export async function POST(request: Request) {
  const runtime = env as unknown as RuntimeEnv;
  const secret = runtime.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return Response.json({ ok: false, error: "Human verification is not configured." }, { status: 503 });
  }

  let token = "";
  try {
    const body = await request.json() as { token?: unknown };
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!token || token.length > 4096) {
    return Response.json({ ok: false, error: "Complete the human check first." }, { status: 400 });
  }

  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  const forwarded = request.headers.get("CF-Connecting-IP");
  if (forwarded) form.set("remoteip", forwarded);

  let result: { success?: boolean; "error-codes"?: string[] };
  try {
    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    result = await verification.json() as typeof result;
  } catch {
    return Response.json({ ok: false, error: "Human verification is temporarily unavailable." }, { status: 502 });
  }

  if (!result.success) {
    return Response.json({ ok: false, error: "Human verification failed. Please try again." }, { status: 403 });
  }

  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
