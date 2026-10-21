# Security, Privacy, and Compliance Specification

**Status:** Requirements baseline; not legal advice or a compliance attestation.

## Data classification

- **Highly sensitive:** cycle, pain, sexual/reproductive symptoms, fertility information, free-text notes, reports, authentication/recovery data.
- **Sensitive operational:** consent choices, access/security logs, support requests.
- **Public:** approved general educational content.

## Privacy requirements

- Collect only fields necessary for a documented product purpose; review every field before release.
- Explain purpose, retention, sharing, and user choices in accessible language.
- Keep optional research consent separate from app use and clinical care.
- Give users access, correction, export, and deletion pathways subject to reviewed legal requirements.
- Do not sell health data, use it for ads, or share it with clinics automatically.
- Avoid health details in notifications, analytics, crash reports, and support tooling.
- Establish retention, backup expiry, breach handling, data-subject request, and vendor review processes.

## Security baseline

- TLS for network traffic; encryption at rest and managed key practices.
- Strong authentication, secure recovery, session expiry, optional device lock where safe.
- Owner-scoped authorization on every data operation; least privilege for staff and services.
- Secrets in a managed secret store; separate environment credentials.
- Dependency and infrastructure updates, code review, security testing, backups, and access audit.
- Redact sensitive fields from logs and error monitoring.

## Local review required

Before piloting in Kenya, qualified advisers must assess applicable data-protection obligations, controller/processor roles, registration requirements, hosting/data-transfer terms, software medical-device status, minors' consent/assent and safeguarding, and research approvals. The project plan references the Data Protection Act 2019, ODPC, PPB, and research ethics bodies; this document does not determine what obligations apply.

## Release gates

No live health data until privacy notice and consent are approved, data map and retention are documented, access controls are reviewed, vendors/hosting are assessed, incident and deletion processes exist, and applicable clinical/research/regulatory approvals are confirmed.
