# Release, Change, and Maintenance Log

**Status:** Initial planning entry. No software releases have been made.

## Release history

| Version/date | Change | Evidence/approvals | Status |
|---|---|---|---|
| Planning baseline / 2026-10-16 | Created draft documentation from the project plan and product discussion. | No implementation, clinical validation, or compliance review implied. | Draft |
| v0.1.0-prototype / 2026-10-16 | Initial interactive prototype with daily logs, printable report, bilingual interface strings, convenience PIN, synthetic demo data, and unreviewed clinical content. | Historical entry; prior DPA-compliance wording and clinical-content claims were not evidence of review or compliance. | Superseded |
| Prototype update / 2026-10-21 | Added optional structured profile and daily-log fields, explicit period start/end dates, descriptive recent-cycle averages, expanded report observations, and a user-maintained local care-contact list. Removed active readiness scoring and user-facing unreviewed emergency/education content. Added prototype-only data warning and acknowledgement. | `npm run build` passed using Vite's runner config loader. TypeScript project build passed. No clinical, privacy, security, legal, usability, or accessibility review claimed. | Prototype update |

## Change process

For each release, record user-visible changes, schema/API changes, security/privacy impact, clinical-copy review, migration/rollback notes, known issues, and support instructions. Breaking changes require explicit migration and user communication plans.

## Maintenance register

| Item | Owner | Priority | Review date | Status |
|---|---|---|---|---|
| Select and record application stack | TBD | High | TBD | Open |
| Review consent, minors, privacy, and local regulatory requirements | TBD | High | Before pilot | Open |
| Define clinical questionnaire and report with adviser | TBD | High | Before build | Open |
| Select hosting region and data retention approach | TBD | High | Before data storage | Open |
| Conduct competitor and user research | TBD | Medium | Discovery | Open |

Update dependency versions through reviewed changes; track security advisories, unsupported packages, and technical debt. Do not claim a release is compliant or clinically validated based only on a deployment.
