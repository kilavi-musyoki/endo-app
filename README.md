# Endometriosis Care Companion

A mobile-first prototype for recording menstrual and related symptoms and preparing a user-controlled summary for a healthcare conversation. It does not diagnose, rule out, score, or triage a condition.

## Current prototype

- Daily symptom and flow logs, including optional pain context, bleeding details, and notes.
- Optional profile history fields; sensitive fields can be left blank.
- Cycle dates and up-to-three-cycle descriptive averages when the user explicitly marks period starts and ends. The app does not compare these averages with clinical ranges.
- Printable clinician summary, including user-entered history and daily observations.
- Four fixed care contact phone listings confirmed by the project owner, plus a local list for contacts the user chooses to save. The app does not independently check for later changes; personal contact location is entered manually and device location is not accessed.
- English and Kiswahili interface strings, a convenience PIN screen, synthetic demo data, and local data deletion.
- First-use onboarding explains prototype limits and offers an optional display name or pseudonym; sensitive health-history fields are not required to start.

The app stores data in browser `localStorage`. The PIN does not encrypt it. This prototype is for review with synthetic demo data; **do not enter real health information**. Deleting data removes it from this browser storage, but does not secure exported reports or other copies.

## Clinical and directory review status

The draft guide's thresholds, point scoring, result bands, and override are not active. Clinical education and emergency instructions are hidden pending qualified clinical review. The four fixed contact listings are marked as confirmed by the project owner; the app does not independently verify ongoing accuracy. User contacts remain user-maintained. No clinician approval, clinical validation, privacy/security review, or Kenya regulatory compliance is claimed.

## Development

The prototype uses React, Vite, TypeScript, and Tailwind CSS.

```bash
npm install
npm run dev
npm run build
```

The `build` script runs TypeScript project checks and the Vite production build.

## Project documentation

See [`docs/`](docs/README.md) for requirements, privacy and safety constraints, architecture decisions, and traceability. See [`AGENTS.md`](AGENTS.md) for persistent project instructions.

For a detailed description of current screens, see [`docs/21-ui-guide.md`](docs/21-ui-guide.md). For the recent audit findings, implemented UI changes, and remaining review needs, see [`docs/22-ui-ux-audit-and-redesign.md`](docs/22-ui-ux-audit-and-redesign.md).
