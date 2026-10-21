# Operations and Incident Response Runbook

**Status:** Prepared as a template; no live service or on-call team exists.

## Monitoring principles

Monitor availability, latency, errors, storage, backup completion, and security events. Do not include symptom text, cycle dates, report contents, or other health payloads in logs or alert messages. Define thresholds and responsible contacts before launch.

## Incident severity (proposed)

- **SEV-1:** suspected exposure of sensitive data, unauthorized access at scale, or prolonged critical outage.
- **SEV-2:** material user impact or suspected limited compromise.
- **SEV-3:** localized defect with workaround and no known sensitive-data exposure.

Severity definitions and notification timelines require local legal and operational review.

## Response steps

1. Protect users and contain the issue; restrict access or disable affected feature if needed.
2. Notify the incident lead and preserve relevant security evidence without copying health payloads unnecessarily.
3. Assess data/services affected, duration, and possible exposure with security/privacy leads.
4. Follow approved legal/regulatory and user-notification process; do not improvise timelines.
5. Restore from verified backups or roll back safely; prioritize integrity of user records.
6. Document timeline, decisions, impact, remediation, and lessons learned.

## Recovery and backup

Define recovery time and recovery point objectives before pilot. Encrypt backups, restrict access, monitor completion, test restoration periodically, and document backup expiry/deletion. A backup is not verified until restore is exercised.

## Contacts and service details (TBD)

Incident lead, technical owner, privacy contact, clinical adviser, hosting support, legal contact, service dashboard, backup location, escalation channel, and approved user communication templates must be filled before production.
