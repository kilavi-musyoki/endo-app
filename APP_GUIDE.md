# EndoCare Companion: App Guide

**Status:** Interactive prototype, version 0.1.0 (Hackathon Preview). This guide describes the current repository implementation as of October 2026. The app is not a clinical product and is not ready for real health information.

## What the app is for

EndoCare Companion is a mobile-first prototype for keeping a personal record of period-related symptoms and preparing a user-controlled summary for a conversation with a health professional. The user enters observations; the app organizes them by date and can print a report.

The app does **not** diagnose endometriosis or another condition, rule conditions out, estimate risk or likelihood, recommend treatment, or triage symptoms. A recorded symptom, pain score, calculation, or report is not a clinical assessment. Missing entries mean “not recorded,” not “symptom absent.” The product copy and any future health guidance need qualified clinical review.

> **Do not enter real health information in this prototype.** Records are stored in browser `localStorage` without encryption. The PIN screen is only a convenience barrier and does not secure the stored data.

## Getting started and data modes

On first opening, an onboarding dialog explains the prototype and asks the user to acknowledge that they will not enter real health information. This is an acknowledgement for prototype use, not a consent process, research approval, or legal notice. The acknowledgement is remembered in this browser until app data is deleted.

The app initially creates a three-month synthetic demo dataset when it first loads and there are no saved entries, unless the user has already chosen a fresh empty log. Demo entries are fictional and intended only to preview the interface. A banner in the header indicates whether demo mode is active:

- **Clear / Start Fresh** removes the active demo or test entries and switches to an empty log. When a synthetic test profile is active, it also removes that synthetic profile and returns profile details to the default; otherwise it does not delete profile details, contacts, or other stored settings.
- **Load Demo Data** replaces the current entries with the synthetic sample. It does not represent a merge.
- **Delete All My Data** in Settings clears all app-specific local-storage keys, including entries, profile, contacts, custom symptoms, and onboarding state, then reloads the app. As a consequence, onboarding and the initial demo behavior can happen again.

The user can also add, edit (by saving again on the same date), and delete daily entries. Each date has at most one entry; saving another entry for that date updates the existing one.

## Main areas

The responsive navigation has four areas. It appears as a fixed bottom bar on mobile and a left rail on desktop:

### Timeline & Trends

This is the home view. It shows a recent personal summary, a strip for the last 30 calendar days, and the saved entries. Calendar days with entries can be selected; filters show all entries, period days (flow other than “none”), or entries with an overall pain score of 7 or higher. These are display filters, not clinical thresholds or alerts. Individual entries can be deleted.

The summary includes the number of user-marked period starts, average pain on logged period-flow days, highest logged pain score, and days marked as missed work/school or bed rest. It also shows descriptive averages for up to three recent completed user-marked cycles (see “Calculations and report” below). A chart plots each recorded daily pain score by date for the last 30 days, with a table alternative. It leaves unrecorded dates blank and does not interpolate values or add urgency zones. The chart cannot determine how urgently someone should seek care or when they should visit a clinician. The view also reminds users that a log is a record, not an assessment, and links to the report.

### Daily Log

One entry represents one calendar date. New entries open in **Quick log**, which records menstrual flow, overall pain, impact on the day, and an optional note. **Detailed log** exposes the full set of optional fields below. Existing entries open in Detailed log when edited. Both modes save to the same date-based entry. Quick logs do not add a default pain location behind the scenes.

These fields are available in Detailed log:

| Area | What the user can record |
|---|---|
| Date and flow | Date; flow as none/not on period, spotting, light, medium, or heavy. |
| Bleeding details | Optional period-start and period-end markers; number of pads or tampons used; whether a pad or tampon was soaked in under an hour; large clots; and bleeding between periods. Yes/no details can be left as “not recorded.” |
| Pain | An overall 0–10 score, optional timing (before, during, or after a period, mid-cycle, ongoing/constant, or another time), and optional contexts (sex/intimacy, bowel movement, urination, or exercise). |
| Pain locations and qualities | One or more locations: pelvic area, lower back, lower abdomen, thighs, legs, rectal area, bladder area, ribs/chest, or generalized. Each selected location can have its own 0–10 magnitude and one or more qualities: cramping/spasms, sharp/stabbing, burning/hot, dull/deep ache, throbbing/pulsing, shooting/electric, or heaviness/pressure. |
| Other optional details | Blood in stool; blood in urine; mood changes (low mood, anxious, irritable, or another mood change). These questions can be left unanswered. |
| Impact | None/no disruption, mild interference, missed work or school, or bed rest. |
| Associated symptoms | Optional selections for pain during bowel movements, painful urination, pain with intimacy, heavy bleeding with large clots, bloating, nausea/vomiting, fatigue, mid-cycle pain, constipation/diarrhea, leg weakness/numbness/sciatica, lower-back stiffness/ache, and brain fog/concentration trouble. Users can add and remove their own named symptom tags. |
| Medication and notes | Whether pain medication was taken and, if so, whether it helped, helped somewhat, or did not help; optional free-text notes. The app does not identify a medicine or advise on its use. |

Detailed-log sensitive fields are optional and described as helping users record their own experience, not assess a condition. Medication names are free text with no suggested medicines. Free-text notes may contain identifying or especially sensitive details, so avoid entering real details in this prototype.

### Doctor Report

The user-prepared report can be filtered to the last 30 days, last 90 days (the default), or all saved history. It shows recorded-entry counts, descriptive overall and period pain summaries, cycle information, location-specific pain scores and qualities, symptom frequencies, medication names and responses, and a detailed card for each day in the selected range. Missing dates are unknown, not symptom-free. Optional profile details appear in a separate group with a reminder to review sensitive details before sharing. **Print / Export PDF** opens the browser print dialog; users can choose a PDF printer if their device offers one. Printing or exporting creates a separate copy that is outside the app’s local-storage deletion controls. The report is not a standardized or clinician-reviewed document; review it before sharing.

Depending on the selected range and available data, the report includes:

- display name or pseudonym (otherwise “Not provided”) and optional profile details;
- observation date range and user-marked period starts/ends and calculated cycle lengths;
- descriptive averages across up to three recent completed marked cycles;
- period-day average pain, peak pain, number of recorded days with pain at least 7, and number of days marked missed work/school or bed rest;
- pain location counts, average and peak location magnitude, and selected pain qualities;
- date-by-date observations, including flow, pain score, bleeding details, timing/context, blood in stool/urine, mood, symptoms, and notes;
- symptom frequencies and reported pain-medication response.

This is a summary of entries, not a diagnosis, recommendation, or clinician-reviewed assessment. It can include incomplete history. Review it before sharing; the user controls printing and sharing.

### Care & Education

The page displays a notice that clinical guidance is pending qualified review. Thresholds and emergency instructions are not supplied as guidance. The app does not assess or triage symptoms.

The contacts card first displays four fixed phone listings confirmed by the project owner: African Centre for Endometriosis (0799500555), The Karen Hospital Nyeri (0727547212), Marie Stopes Kenya, Nyeri (+254800720005), and Nyeri County Referral Hospital (0724249693). Each has a verified badge and a tap-to-call button. The app does not independently check for later changes. These entries are always shown and are separate from a user's saved contacts.

The “My contacts” section lets a user keep their own contacts in this browser. Required fields are facility/clinician name, type, county or town, and services offered. Optional fields are clinician name, specialty, phone, hours, booking/information link, map link, cost range, and insurance accepted. Contacts can be removed. Web links are accepted only with `http` or `https` schemes. The app does not independently verify contact details, search a directory, determine distance, or access device location.

## Header and Settings

The header provides:

- a switch between English and Kiswahili interface strings;
- Settings;
- a convenience lock screen; and
- the demo-data status and load/clear control.

Settings allow the user to store a display name or pseudonym and optional report history: age, age at first period, number of pregnancies, whether currently trying to conceive (and months, when yes), family history of endometriosis in mother or sister (yes/no/unsure/prefer not to say), and known conditions. These details are optional and are included in the report when provided.

The Settings screen also allows changing the four-digit PIN, deleting all local app data, and viewing the prototype version/privacy notice. The lock screen starts with demo PIN `1234`; a changed PIN is saved with the profile. This PIN is stored in local browser data and is not encryption, authentication, or a security boundary. The app is a browser prototype and does not provide user accounts, cloud sync, server backups, or secure multi-user access.

## Calculations and interpretation limits

The app calculates descriptive summaries from saved entries. It does not compare values with medical norms or apply a validated scoring rule.

- Period days for summary calculations are entries whose flow is not `none`.
- Cycle length is the number of calendar days between two consecutively user-marked period starts. A period end is paired to a marked start when it falls after that start and before the next start. An incomplete cycle has no completed cycle length.
- The recent baseline uses up to the three most recent cycles with both a period end and a cycle length. Average period pain for each such cycle uses entries in that marked date span with non-`none` flow. The app averages those cycle values and displays a decimal rounded to one place.
- Report pain summaries, symptom counts, location counts, and medication response counts are aggregations of recorded entries. They do not infer symptoms on unlogged days.
- A high-pain filter or count at 7+ is only a grouping of the user’s chosen score; it is not a warning threshold, score, or medical finding.

If dates or markers are missing or entered incorrectly, summaries may be incomplete or misleading. Users can correct entries before using or printing a report.

## Synthetic multi-user test fixtures

`src/data/threeUserSyntheticFixtures.ts` exports three fictional profile-and-entry fixtures for UI and report testing. Each fixture has a complete profile object and 90 daily records with every `LogEntry` field explicitly populated, covering 2026-07-24 through 2026-10-21. The records are invented for interface coverage and are not derived from real patients, a clinical study, or medical reference ranges. Scenario names describe recorded-value patterns only; they do not label anyone normal, moderate, critical, or urgent.

To load one, open **Settings** and go to **Synthetic test data**, choose a scenario, and confirm replacement of the current entries and profile details. Only one profile is active at a time. To remove it, choose **Clear active test data** in Settings and confirm; this removes its entries and synthetic profile and returns to an empty log. The header’s **Clear / Start Fresh** action is also available. Loading another scenario replaces the currently active test data. These controls are for fictional prototype testing and should not be used with real health data.

## Data storage, privacy, and safety

All current app data is stored in this browser’s `localStorage` on this device. This includes symptom entries, profile details, PIN, custom symptom labels, care contacts, demo-mode state, and onboarding acknowledgement. There is no implemented account or server data store. The prototype does not provide encryption at rest, backups, access auditing, data portability controls, or protection against someone with access to the browser/device. Clearing browser storage also removes locally stored app data. Printed/exported reports and screenshots are separate copies.

Daily entries keep the overall pain score separate from each selected location’s score. In Detailed log, a medication name is optional free text and saved only when a user records that pain medication was taken. The form does not suggest medicines.

Do not use production health information in development, screenshots, test data, logs, or prompts. The demo dataset is synthetic. No analytics, advertising, third-party AI, or health-data sharing integration is implemented in this prototype.

The project has not established clinical validation, clinician approval, privacy or security review, research ethics approval, legal consent, regulatory compliance, or production readiness. Requirements concerning minors, hosting location, and Kenyan legal/regulatory review remain unresolved and require qualified local advisers. Do not rely on this app for urgent decisions; it contains no reviewed emergency instructions.

## Technology and local development

The prototype uses React 18, TypeScript, Vite, Tailwind CSS, and Lucide icons. Its code is under `src/`; there is no production backend or API. Translations are held in `src/locales/en.ts` and `src/locales/sw.ts`, with interface state managed by the i18n context. Browser persistence is handled in `src/services/storageService.ts`.

With Node.js and npm installed, run from the repository root:

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` runs TypeScript project checks and produces a Vite build. A successful build only confirms that the code compiles; it does not establish clinical safety, privacy, security, accessibility, or regulatory compliance. No backend, deployment service, or production data flow has been selected.

## What is not active or not established

- No diagnosis, risk/probability estimate, exclusion, clinical score, triage, treatment advice, or emergency alert.
- No published clinical education guidance; the area is explicitly pending qualified review.
- No verified facility/clinician directory or automatic location service.
- No production account, cloud sync, API, database, encrypted storage, secure PIN protection, analytics, or third-party AI integration.
- No formal clinical validation, privacy/security review, legal or research consent process, or compliance determination.

These are not implied features. Any future change that adds health interpretation or user-data processing requires updated requirements, documented architecture decisions, appropriate qualified review, privacy approval, and updated documentation before it is described as available.

## Related project documents

- [Project overview and setup](README.md)
- [Documentation index](docs/README.md)
- [Product requirements](docs/01-product-requirements.md)
- [UI/UX specification](docs/06-ui-ux-specification.md)
- [As-built UI guide](docs/21-ui-guide.md)
- [UI/UX audit and redesign](docs/22-ui-ux-audit-and-redesign.md)
- [System architecture proposal](docs/07-system-architecture.md)
- [Architecture decision records](docs/08-architecture-decisions.md)
- [Data schema and dictionary](docs/09-data-schema-dictionary.md)
- [Security, privacy, and compliance](docs/11-security-privacy-compliance.md)
- [Requirements traceability](docs/17-requirements-traceability.md)
- [Persistent coding and product boundaries](AGENTS.md)
