import Link from "next/link";

export const metadata = { title: "Privacy Notice — RepQuest" };

export default function PrivacyNotice() {
  return <main className="legal-shell"><article className="legal-card">
    <Link href="/" className="legal-back">← Back to RepQuest</Link>
    <span className="legal-kicker">REPQUEST PRIVACY</span>
    <h1>Privacy Notice</h1>
    <p className="legal-updated">Beta draft · Effective August 10, 2026</p>
    <div className="legal-alert"><strong>Beta notice</strong><span>Online accounts are not active yet. Guest progress is currently stored on the player’s device. This notice must receive legal review and final operator contact details before public launch.</span></div>

    <h2>What RepQuest is</h2>
    <p>RepQuest is a sports-learning game for players age 7 and older. The experience changes by age range so lessons use appropriate reading levels, visuals, answer choices, and timers.</p>

    <h2>Information used in the current beta</h2>
    <p>For guest play, RepQuest stores a display name or “Player,” broad age range, avatar choice, XP, quiz progress, badges, and preferences in local device storage. The beta does not need an exact birth date. Clearing app or browser storage may remove this progress.</p>

    <h2>Accounts and future collection</h2>
    <p>When secure accounts are enabled, RepQuest may process an adult account holder’s email address, authentication-provider identifier, consent records, learner alias, broad age path, progress, XP, and security data needed to prevent abuse. This notice will be updated before that collection begins and will identify every service provider used.</p>

    <h2>Children under 13</h2>
    <p>A parent or guardian must own and manage an online account for a player under 13. RepQuest will not request the child’s email address or legal name. Online child accounts will remain disabled until parental notice, verifiable parental consent, access, deletion, retention, and security controls are operational. A child may use local-only guest play without creating an online account.</p>

    <h2>How information is used</h2>
    <ul><li>Provide lessons and save progress.</li><li>Adapt language and pacing to a broad age path.</li><li>Award XP, badges, and private milestones.</li><li>Secure accounts and prevent fraud when online accounts launch.</li><li>Improve reliability and learning quality using privacy-minimized analytics when disclosed.</li></ul>

    <h2>Sharing and selling</h2>
    <p>RepQuest does not sell personal information. Child profiles are not placed on public leaderboards. When service providers are added, they will be limited to performing defined functions such as hosting, authentication, consent, security, or diagnostics under appropriate agreements.</p>

    <h2>Retention, choices, and deletion</h2>
    <p>Local guest data remains until the player resets progress, clears storage, or removes the app. Before accounts launch, RepQuest must provide in-app account deletion and a public web deletion-request path. Parents must be able to review or delete a child profile and revoke consent.</p>

    <h2>Security</h2>
    <p>RepQuest is designed to use encrypted connections, managed authentication, server-side access controls, limited collection, rate limits, and audited administrative access. No system can guarantee absolute security.</p>

    <h2>Changes and contact</h2>
    <p>Material changes will be posted here with a new effective date and, when required, direct notice or renewed consent. Final business identity, mailing address, and monitored privacy contact must be added before public account registration is enabled.</p>

    <p className="legal-disclaimer">This beta draft is product copy, not legal advice. Counsel should review it against the final data map, vendors, jurisdictions, and store disclosures.</p>
    <footer><Link href="/terms">Terms of Use</Link><Link href="/">Play RepQuest</Link></footer>
  </article></main>;
}
