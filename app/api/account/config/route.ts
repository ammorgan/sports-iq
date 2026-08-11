import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

type RuntimeEnv = Record<string, string | undefined>;

export async function GET() {
  const runtime = env as unknown as RuntimeEnv;
  const turnstileSiteKey = runtime.TURNSTILE_SITE_KEY;
  const turnstileReady = Boolean(turnstileSiteKey && runtime.TURNSTILE_SECRET_KEY);
  const providerUrls = {
    apple: runtime.SPORTS_IQ_AUTH_APPLE_URL,
    google: runtime.SPORTS_IQ_AUTH_GOOGLE_URL,
    facebook: runtime.SPORTS_IQ_AUTH_FACEBOOK_URL,
    email: runtime.SPORTS_IQ_AUTH_EMAIL_URL,
  };

  return Response.json({
    providers: Object.fromEntries(
      Object.entries(providerUrls).map(([provider, url]) => [provider, { ready: Boolean(url && turnstileReady), url: url ?? null }]),
    ),
    parentConsent: {
      ready: Boolean(runtime.SPORTS_IQ_PARENT_CONSENT_URL && turnstileReady),
      url: runtime.SPORTS_IQ_PARENT_CONSENT_URL ?? null,
    },
    turnstileSiteKey: turnstileReady ? turnstileSiteKey : null,
    mode: turnstileReady ? "configured" : "setup",
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
