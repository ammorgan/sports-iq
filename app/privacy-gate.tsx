"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createLegalAcceptance, type LegalAcceptance } from "./product-governance";

export type PrivacyAgeBand = "7-9" | "10-12" | "13-15" | "16-17" | "18+";
export type AccountKind = "guest" | "self" | "child";
export type ConsentState = "local-only" | "not-required" | "pending" | "verified";

type Provider = "apple" | "google" | "facebook" | "email";
type ProviderConfig = { ready: boolean; url: string | null };
type AccountConfig = {
  providers: Record<Provider, ProviderConfig>;
  parentConsent: ProviderConfig;
  turnstileSiteKey: string | null;
  mode: "configured" | "setup";
};

type TurnstileApi = {
  render(container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; theme: "light" }): string;
  remove(widgetId: string): void;
  reset(widgetId?: string): void;
};

declare global {
  interface Window { turnstile?: TurnstileApi }
}

const AGE_CHOICES: Array<{ value: PrivacyAgeBand; label: string; title: string; note: string }> = [
  { value: "7-9", label: "AGES 6–9", title: "Play & Discover", note: "Simple words · time to think" },
  { value: "10-12", label: "AGES 10–12", title: "Build the Basics", note: "Guided practice · your pace" },
  { value: "13-15", label: "AGES 13–15", title: "Read the Game", note: "Build knowledge · your pace" },
  { value: "16-17", label: "AGES 16–17", title: "Compete & Lead", note: "Practice decisions · your pace" },
  { value: "18+", label: "AGES 18+", title: "Full Game IQ", note: "New fans and experienced players" },
];

const PROVIDERS: Array<{ id: Provider; label: string; mark: string }> = [
  { id: "apple", label: "Continue with Apple", mark: "●" },
  { id: "google", label: "Continue with Google", mark: "G" },
  { id: "facebook", label: "Continue with Facebook", mark: "f" },
  { id: "email", label: "Create an account", mark: "@" },
];

const EMPTY_CONFIG: AccountConfig = {
  providers: {
    apple: { ready: false, url: null },
    google: { ready: false, url: null },
    facebook: { ready: false, url: null },
    email: { ready: false, url: null },
  },
  parentConsent: { ready: false, url: null },
  turnstileSiteKey: null,
  mode: "setup",
};

export function PrivacyGate({ onContinue }: {
  onContinue: (result: { ageBand: PrivacyAgeBand; accountKind: AccountKind; consentState: ConsentState; legalAcceptance: LegalAcceptance }) => void;
}) {
  const [step, setStep] = useState<"age" | "account">("age");
  const [ageBand, setAgeBand] = useState<PrivacyAgeBand | null>(null);
  const [config, setConfig] = useState<AccountConfig>(EMPTY_CONFIG);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [humanToken, setHumanToken] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const turnstileHost = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const isChild = ageBand === "7-9" || ageBand === "10-12";

  useEffect(() => {
    if (step !== "account" || configLoaded) return;
    let cancelled = false;
    fetch("/api/account/config", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((next: AccountConfig) => { if (!cancelled) setConfig(next); })
      .catch(() => { if (!cancelled) setConfig(EMPTY_CONFIG); })
      .finally(() => { if (!cancelled) setConfigLoaded(true); });
    return () => { cancelled = true; };
  }, [configLoaded, step]);

  useEffect(() => {
    if (step !== "account" || !config.turnstileSiteKey || !turnstileHost.current || widgetId.current) return;
    const renderWidget = () => {
      if (!window.turnstile || !turnstileHost.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(turnstileHost.current, {
        sitekey: config.turnstileSiteKey as string,
        callback: setHumanToken,
        "expired-callback": () => setHumanToken(""),
        theme: "light",
      });
    };
    const existing = document.querySelector<HTMLScriptElement>("script[data-sports-iq-turnstile]");
    if (existing) {
      const poll = window.setInterval(() => { if (window.turnstile) { window.clearInterval(poll); renderWidget(); } }, 100);
      return () => window.clearInterval(poll);
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.sportsIqTurnstile = "true";
    script.addEventListener("load", renderWidget);
    document.head.appendChild(script);
    return () => script.removeEventListener("load", renderWidget);
  }, [config.turnstileSiteKey, step]);

  const openVerified = async (url: string | null) => {
    if (!url || !humanToken) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/privacy/verify-human", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: humanToken }),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Please try the human check again.");
      window.location.assign(url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not verify this request.");
      setHumanToken("");
      window.turnstile?.reset(widgetId.current);
    } finally {
      setBusy(false);
    }
  };

  const returnToAge = () => {
    if (widgetId.current) window.turnstile?.remove(widgetId.current);
    widgetId.current = undefined;
    setHumanToken("");
    setMessage("");
    setStep("age");
  };

  if (step === "age") {
    return (
      <main className="privacy-gate">
        <section className="privacy-stage">
          <div className="privacy-logo"><span>REP</span><strong>QUEST</strong></div>
          <span className="privacy-kicker">FIRST, SET THE RIGHT PLAYBOOK</span>
          <h1>How old is the<br /><em>player?</em></h1>
          <p>An adult or the player should choose the real age range. We save only the range—not a birthday.</p>
          <div className="privacy-age-grid">
            {AGE_CHOICES.map((choice) => <button type="button" key={choice.value} className={ageBand === choice.value ? "active" : ""} onClick={() => setAgeBand(choice.value)} aria-pressed={ageBand === choice.value}><span>{choice.label}</span><strong>{choice.title}</strong><small>{choice.note}</small><i>{ageBand === choice.value ? "✓" : "→"}</i></button>)}
          </div>
          <label className="privacy-acceptance"><input type="checkbox" checked={legalAccepted} onChange={(event) => setLegalAccepted(event.target.checked)} /><span>I am the player or responsible adult. I have read the <Link href="/privacy">Privacy Notice</Link> and agree to the <Link href="/terms">Terms of Use</Link>.</span></label>
          <button className="privacy-primary" disabled={!ageBand || !legalAccepted} onClick={() => setStep("account")}>Continue <span>→</span></button>
          <small className="privacy-footnote">Age sets reading support. Your progress builds game knowledge.</small>
          <nav className="privacy-legal-links" aria-label="Legal"><Link href="/privacy">Privacy Notice</Link><Link href="/terms">Terms of Use</Link></nav>
        </section>
        <aside className="privacy-art" aria-hidden="true"><div className="privacy-orbit"><i /><i /><i /></div><strong>LEARN</strong><span>PLAY</span><b>GROW</b></aside>
      </main>
    );
  }

  return (
    <main className="privacy-gate">
      <section className="privacy-stage privacy-stage--account">
        <button className="privacy-back" onClick={returnToAge}>← Change age</button>
        <div className="privacy-logo"><span>REP</span><strong>QUEST</strong></div>
        {isChild ? <>
          <span className="privacy-kicker">A GROWN-UP OWNS THIS ACCOUNT</span>
          <h1>Parent<br /><em>handoff.</em></h1>
          <p>For players under 13, RepQuest does not ask for the child’s email or name. A parent can create and manage the account, consent, review data, or delete it.</p>
          {config.parentConsent.ready ? <>
            <div ref={turnstileHost} className="turnstile-slot" aria-label="Human verification" />
            <button className="privacy-provider privacy-provider--parent" disabled={!humanToken || busy} onClick={() => openVerified(config.parentConsent.url)}><span>★</span><strong>Parent setup & consent</strong><small>Adult information only</small></button>
          </> : <div className="privacy-setup-note"><strong>PARENT ACCOUNTS ARE IN SAFE SETUP MODE</strong><span>The game will not collect family information until secure sign-in, consent delivery, and bot protection keys are connected.</span></div>}
          <button className="privacy-primary" onClick={() => onContinue({ ageBand: ageBand as PrivacyAgeBand, accountKind: "child", consentState: "local-only", legalAcceptance: createLegalAcceptance() })}>Play privately on this device <span>→</span></button>
          <small className="privacy-footnote">Device play stays on this device. This acknowledgement does not create an online child account or replace verifiable parental consent.</small>
        </> : <>
          <span className="privacy-kicker">SAVE YOUR PROGRESS ANYWHERE</span>
          <h1>Choose how<br /><em>you’ll play.</em></h1>
          <p>Sign in to sync progress across web and mobile, or keep playing privately on this device.</p>
          {config.mode === "configured" && <div ref={turnstileHost} className="turnstile-slot" aria-label="Human verification" />}
          <div className="privacy-provider-grid">
            {PROVIDERS.map((provider) => {
              const ready = config.providers[provider.id].ready;
              return <button key={provider.id} className="privacy-provider" disabled={!ready || !humanToken || busy} onClick={() => openVerified(config.providers[provider.id].url)}><span>{provider.mark}</span><strong>{provider.label}</strong><small>{ready ? "Ready after human check" : "Secure setup required"}</small></button>;
            })}
          </div>
          {config.mode === "setup" && <div className="privacy-setup-note"><strong>ONLINE ACCOUNTS ARE IN SAFE SETUP MODE</strong><span>Apple, Google, Facebook, email, and CAPTCHA controls are built into this flow but stay off until the provider keys are connected.</span></div>}
          {message && <p className="privacy-error" role="alert">{message}</p>}
          <button className="privacy-primary" onClick={() => onContinue({ ageBand: ageBand as PrivacyAgeBand, accountKind: "guest", consentState: "not-required", legalAcceptance: createLegalAcceptance() })}>Continue without an account <span>→</span></button>
          <small className="privacy-footnote">Guest progress stays on this device. You can connect an account later.</small>
        </>}
        <nav className="privacy-legal-links" aria-label="Legal"><Link href="/privacy">Privacy Notice</Link><Link href="/terms">Terms of Use</Link></nav>
      </section>
      <aside className="privacy-art privacy-art--account" aria-hidden="true"><div className="privacy-shield">✓</div><strong>SAFE</strong><span>YOUR PACE</span><b>YOUR PLAYBOOK</b></aside>
    </main>
  );
}
