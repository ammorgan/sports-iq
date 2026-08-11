# RepQuest Account Setup

## Why “Secure setup required” appears

That message is intentional. The current beta has account-selection UI, but no production identity provider, authenticated session, cloud progress store, or parental-consent service is connected. `/api/account/config` disables every provider unless both Cloudflare Turnstile keys and a provider URL exist. A URL alone is not a complete authentication implementation.

Guest play is currently the only complete account mode. Its progress stays in local browser or app storage.

## Recommended production architecture

Choose one managed authentication/database platform that supports web and React Native, social OAuth, email verification, server-side sessions, and row-level access controls. Keep one adult account table and separate learner profiles. Child profiles belong to an adult account and do not contain a child email or legal name.

Required services:

1. **Managed authentication:** email/password or passwordless plus Apple, Google, and Facebook.
2. **Application database:** adult accounts, learner profiles, consent records, progress, mastery, XP ledger, and leaderboard opt-in.
3. **Bot protection:** Cloudflare Turnstile on web registration and risk-based native protections appropriate to iOS/Android.
4. **Parental consent provider/process:** verifiable consent, parent notice, audit trail, review, revocation, and deletion.
5. **Transactional email:** verification, password reset, parent notice, consent, and deletion confirmation.
6. **Monitoring and audit:** authentication failures, unusual XP writes, administrative access, and security alerts.

## Implementation sequence

### 1. Decide the operator and policies

- Establish the legal business/operator name, postal address, monitored support/privacy emails, launch regions, and retention schedule.
- Have counsel review the Privacy Notice, Terms, direct parent notice, and consent method.
- Complete an inventory of every data field and third-party SDK before configuring store privacy disclosures.

### 2. Create separate environments

- Create development, staging, and production projects with separate databases and credentials.
- Never put service-role/database administrator keys in Next.js client code, Expo `EXPO_PUBLIC_*` values, the app bundle, or Git.
- Store web/server secrets with the deployment platform and mobile build secrets with the build service.

### 3. Configure identity providers

- Register web and native redirect/callback URLs with Apple, Google, and Meta.
- Enable email verification and secure password-reset flows.
- Use Sign in with Apple when other third-party social sign-in is offered in the iOS app, subject to Apple’s current rules.
- Configure exact production domains and app identifiers; do not use wildcard production redirects.

### 4. Build the server-owned data model

- `adult_accounts`: identity provider user ID and adult contact details.
- `learner_profiles`: owner adult ID, alias, broad age band, child-account flag, avatar, preferences.
- `consent_records`: parent ID, child profile ID, policy/version, method, status, timestamps, revocation.
- `progress_events` and `mastery`: append-only learning events plus derived progress.
- `xp_ledger`: server-calculated awards with idempotency keys.
- `leaderboard_preferences`: 13+ eligibility and explicit opt-in.

Apply row-level policies so an authenticated adult can access only profiles they own. Administrative access must use a separate audited role. Never accept client-supplied ownership, child status, or XP totals as authoritative.

### 5. Build age and consent flows

- Determine the broad age path before collecting ordinary account data.
- For under 13, collect only the parent’s contact information needed to give direct notice and obtain consent.
- Do not create a usable cloud child profile until verifiable parental consent succeeds.
- Let a parent review data, revoke consent, and delete the child profile.
- Define what happens when a learner turns 13 and when an age-path change crosses the child boundary.

### 6. Integrate bot and abuse protection

The existing web code expects these server-side deployment bindings:

- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

The secret is used only by `/api/privacy/verify-human`. Turnstile should be one signal, not the only account protection. Add endpoint rate limits, email verification, breached-password protection when passwords are used, session rotation, and abuse monitoring.

### 7. Replace redirect-only provider configuration

The current optional variables are:

- `SPORTS_IQ_AUTH_APPLE_URL`
- `SPORTS_IQ_AUTH_GOOGLE_URL`
- `SPORTS_IQ_AUTH_FACEBOOK_URL`
- `SPORTS_IQ_AUTH_EMAIL_URL`
- `SPORTS_IQ_PARENT_CONSENT_URL`

These preserve the beta gate but should be replaced or renamed during the real RepQuest auth implementation. Each action must begin a provider SDK/OAuth flow, validate `state` and PKCE where applicable, handle the callback server-side, create a secure session, and load the correct adult/learner profile. A raw external URL is insufficient.

### 8. Add account lifecycle controls

- Sign out on all devices.
- Change email/password where applicable.
- Download or review stored data.
- In-app full account deletion.
- Public web deletion-request route for Google Play.
- Parent-controlled child-profile deletion and consent revocation.
- Defined deletion propagation and legally required retention exceptions.

### 9. Connect mobile

- Use the provider’s supported Expo/React Native flow and universal/app links.
- Store refresh/session tokens only in platform secure storage, not AsyncStorage.
- Ensure Apple, Google, and Facebook callbacks return to the correct build variant.
- Test on a physical iPhone and Android device, not only simulators.

### 10. Verify before enabling the buttons

- Authorization tests prove one account cannot read or modify another.
- Child account tests prove public leaderboard and social surfaces remain unavailable.
- Consent tests cover pending, verified, revoked, and deleted states.
- Security tests cover replayed callbacks, invalid state/PKCE, expired sessions, rate limits, and forged XP.
- Store privacy disclosures match the actual SDK and server data flow.
- Account deletion is verified end to end.

## Definition of account-ready

Do not change the UI from “Secure setup required” to “Ready” until sign-up, verification, session restore, progress sync, authorization, consent, deletion, legal notices, bot mitigation, and incident monitoring all pass in staging. The current safe-disable behavior is preferable to collecting family data through an incomplete system.
