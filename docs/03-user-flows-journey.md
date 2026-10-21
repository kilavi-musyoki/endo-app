# User Flows and Journey Map

**Status:** Draft; screens are conceptual, not implemented.

## Primary journey

1. Discover app and read purpose/limits.
2. Review privacy notice and consent; choose optional preferences.
3. Create account or continue with an approved low-friction option (TBD).
4. See a short explanation and optionally add cycle history.
5. Reach home: log symptom, record period, view history, prepare report, or read education.
6. Review and edit entries over time.
7. Select a date range, preview report, export, and choose whether to share outside the app.

## Navigation proposal

`Home` → `Log` / `Cycle` / `History` / `Prepare report` / `Learn` / `Settings & privacy`.

Keep urgent guidance easy to find but avoid app-generated triage conclusions. The specific emergency content must be clinically reviewed and localized.

## Core flows

### Onboarding

Welcome → purpose and non-diagnostic boundary → privacy and consent → age/eligibility handling (TBD) → account/setup → optional cycle setup → home. Allow user to leave without completing sensitive setup. Consent must not be bundled with optional research consent.

### Logging

Home → choose period or symptom → concise form → validation → save confirmation → history. Errors preserve entered content and explain how to correct it.

### Report

History → choose date range → preview content and data gaps → edit/confirm → generate → save/share using device controls. No automatic transmission to a clinic in MVP.

### Authentication and recovery

Entry → authenticate → app. Expired session returns to sign-in without discarding a safe local draft. Recovery must avoid revealing whether a phone/email is registered. Exact method TBD.

## Failure and empty states

- No entries: explain how to start; do not imply the user needs a minimum history.
- Offline: state whether the current action is saved locally or unavailable; never claim sync until confirmed.
- Save/export failure: explain status and retry; avoid duplicate records on retry.
- Permission denied: explain the feature consequence and offer a manual alternative.
- Missing data: identify the gap in the report, not infer absence of symptoms.
