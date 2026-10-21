# Threat Model and Abuse-Case Register

**Status:** Initial high-level model; update after architecture and data-flow decisions.

## Assets

Health entries, cycle history, free-text notes, identity/contact details, consent records, generated reports, credentials, encryption keys, backups, and user trust.

## Trust boundaries / attack surface

Browser and shared devices; network/API; authentication and recovery; database/backups; report export/share; third-party hosting or notification services; staff/support access; future clinic integrations.

## Threat register

| Scenario | Impact | Initial mitigation / verification |
|---|---|---|
| Shared or stolen phone exposes app or notifications | Sensitive disclosure | Neutral notification text, session/device controls, clear sign-out; test shared-device scenarios. |
| Account takeover through weak recovery | Full health-history exposure | Secure recovery, rate limiting, generic responses, session revocation; test abuse cases. |
| Insecure direct object reference exposes another user's records | Cross-user disclosure/modification | Server-side owner authorization on every request; automated authorization checks. |
| Logs, analytics, or crash reports capture symptom data | Uncontrolled disclosure | Payload redaction, minimal telemetry, vendor review; inspect logs with synthetic data. |
| Malicious or mistaken report sharing | Disclosure beyond intended recipient | Preview, explicit user action, clear date/content, no auto-send; usability test. |
| Offline cache persists on shared device | Local disclosure | Decide whether offline data is needed; protect/expire local storage; test logout and device loss. |
| Staff or researcher misuses access | Internal misuse | Least privilege, approvals, audit trails, separation of research consent; access review. |
| False reassurance or alarming screen | Delayed/overuse of care | No diagnosis or exclusion, clinician-reviewed wording, accessibility/usability review. |
| Data loss or ransomware | Loss of records and service | Encrypted backups, restore drills, least privilege, incident plan. |

## Abuse cases

- Attacker enumerates accounts or records.
- User or staff member exports another person's history.
- External service receives sensitive fields without consent.
- A misleading score is used as diagnosis or marketing claim.
- Research data is re-identified or reused beyond consent.

## Security tests before pilot

Authorization and session tests, input validation, dependency review, secret scanning, transport/storage configuration review, log inspection, export boundary testing, and backup restore exercise. Define responsible owner and evidence for each test before release.
