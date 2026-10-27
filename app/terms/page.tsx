import Link from "next/link";
import { LEGAL_VERSIONS } from "../product-governance";

export const metadata = { title: "Terms of Use — RepQuest" };

export default function TermsOfUse() {
  return <main className="legal-shell"><article className="legal-card">
    <Link href="/" className="legal-back">← Back to RepQuest</Link>
    <span className="legal-kicker">REPQUEST LEGAL</span>
    <h1>Terms of Use</h1>
    <p className="legal-updated">Beta draft · Version {LEGAL_VERSIONS.terms} · Effective August 11, 2026</p>
    <div className="legal-alert"><strong>Beta terms</strong><span>These terms describe the current preview. Final operator identity, contact information, dispute terms, and jurisdiction must be completed and reviewed by counsel before public launch.</span></div>

    <h2>Using RepQuest</h2>
    <p>RepQuest provides educational sports lessons and games. By using the service, an adult user—or a parent or guardian acting for a minor—agrees to these terms and the Privacy Notice. If you do not agree, do not use the service.</p>

    <h2>Eligibility and family accounts</h2>
    <p>Players must be at least 7. A parent or guardian must approve use by a minor where required. A player under 13 may not create or control an online account; the responsible adult must complete any future account and consent flow. Users must provide accurate age-path and account information.</p>

    <h2>Educational scope and sports safety</h2>
    <p>RepQuest teaches general sports concepts and does not replace qualified coaching, medical advice, league rules, supervision, or safety equipment. Rules vary by league and can change. Users should follow their governing body, coach, facility, and health professional before participating.</p>

    <h2>Accounts</h2>
    <p>Online account creation is disabled during secure setup. When enabled, users are responsible for account security and activity. RepQuest may suspend access needed to protect users, investigate abuse, comply with law, or maintain service integrity. Users will be able to request full account deletion.</p>

    <h2>Acceptable use</h2>
    <p>Do not misuse the service, bypass security, automate fake accounts or XP, impersonate others, upload harmful material, interfere with another user, reverse engineer protected services where prohibited, or use RepQuest unlawfully. Public child profiles, messaging, and user-submitted content are not part of the beta.</p>

    <h2>XP and game features</h2>
    <p>XP, badges, streaks, ranks, and leaderboard positions have no cash value and may be corrected when earned through errors or abuse. XP is awarded once for a module’s first valid completion. Replaying a completed module can improve mastery but does not create repeat completion XP. Features and progression thresholds may change as the curriculum improves.</p>

    <h2>Privacy choices and product measurement</h2>
    <p>Product-improvement measurement is optional, off by default, and unavailable to under-13 players in the beta. Eligible users can change that choice in the Privacy Center. Deleting a local profile removes its local progress, legal acknowledgement, and optional measurement history from that device.</p>

    <h2>Content and intellectual property</h2>
    <p>RepQuest software, branding, original curriculum, graphics, and game design are protected by applicable law. Third-party media remains subject to its source license and attribution. Users receive a personal, limited, revocable right to use the service for learning.</p>

    <h2>Availability and changes</h2>
    <p>The beta is provided for testing and may contain errors, lose local progress, or be unavailable. RepQuest may revise content, features, or these terms. Material changes will be identified by an updated effective date and any notice required by law.</p>

    <h2>Disclaimer and liability</h2>
    <p>To the extent permitted by law, the beta is provided “as is” without warranties. Final warranty disclaimers, liability limits, governing law, and dispute terms must be supplied by counsel for the operating business and applicable launch regions.</p>

    <h2>Contact</h2>
    <p>A monitored support email, privacy email, legal business name, and mailing address must be published here before account registration is enabled.</p>

    <p className="legal-disclaimer">This beta draft is product copy, not legal advice.</p>
    <footer><Link href="/privacy">Privacy Notice</Link><Link href="/">Play RepQuest</Link></footer>
  </article></main>;
}
