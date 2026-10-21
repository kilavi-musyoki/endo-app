# Product Requirements Document

**Status:** Draft / concept baseline  
**Product:** Endometriosis Care Companion (working name)  
**Initial context:** Kenya; English first, Swahili planned  
**Source:** Project plan dated 10 October 2026 and product discussion

## Problem

People with painful or disruptive periods may have difficulty describing symptom patterns and preparing for a clinical visit. Symptoms can be normalized or poorly documented. The product should make symptom logging easier and help users communicate their experience to a clinician.

## Product objective

Provide a private, accessible way to record cycle and related symptoms and create a user-reviewed summary for a healthcare conversation. The app supports awareness and care seeking; it does not diagnose endometriosis.

## Users

- People who menstruate and want to understand or document symptoms.
- Clinicians who may review a summary the user chooses to share.
- Later stakeholders: facilities, community health workers, and approved researchers, subject to separate scope and governance.

## MVP scope

1. Clear onboarding, privacy explanation, and consent.
2. Cycle period start/end and flow logging.
3. Pain score, location, timing, and effect on daily activities.
4. Optional related symptoms, including bowel or bladder pain, pain during sex, fatigue, nausea, bloating, and heavy bleeding.
5. User-editable cycle and symptom history.
6. User-generated clinician summary for a selected date range.
7. Clinician-reviewed educational content and general care-seeking guidance.

## Out of scope for MVP

Diagnosis, probability estimates, automated risk scoring, medication advice, emergency triage beyond clinician-approved general signposting, facility directory, appointment booking, telehealth, peer community, research dashboard, advertising, and monetizing personal data.

## Functional requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-01 | User can create and manage an account or use a clinically/privacy-approved alternative. | Account and recovery flows are documented; no sensitive details appear in notifications. Exact auth method TBD. |
| FR-02 | User can record period dates and flow. | Entries can be created, edited, and deleted; dates are validated and shown in the user's local date context. |
| FR-03 | User can record pain and its context. | Score scale and labels are explained; location, timing, and daily-life impact can be skipped or edited. |
| FR-04 | User can record related symptoms. | Sensitive items are optional, neutral, and skippable. |
| FR-05 | User can review and correct their history. | Entries are presented chronologically and can be corrected or removed. |
| FR-06 | User can generate a clinician summary. | User previews and confirms the date range and contents before export or sharing. |
| FR-07 | User can read health education. | Content has named clinical reviewer and review date before publication. |
| FR-08 | App explains its limits. | No screen implies diagnosis or that absence of a flag excludes disease. |
| NFR-01 | App protects sensitive data. | Threat model, access controls, encryption approach, retention, and deletion are documented before pilot. |
| NFR-02 | App works on common mobile browsers. | Supported browser/device matrix is selected and checked before release. |
| NFR-03 | App is accessible. | Keyboard, screen-reader, contrast, text resize, and understandable error states are included in QA. |

## Success measures

Measure usability and user control first: onboarding completion, logging completion time, entries corrected, summaries generated, user-reported usefulness, and ability to complete tasks with assistive technology. Do not present engagement as clinical benefit. Clinical outcomes and screening accuracy require a separate approved validation study.

## Open decisions

- Product name and accountable product owner.
- Account model, supported ages, guardian/assent approach, and data residency.
- Final clinical questionnaire and exact summary fields.
- Whether offline storage is in MVP and how local device data is protected.
- Technology stack, hosting, budget, and release dates.
- Local legal, clinical-device, privacy, and research requirements.
