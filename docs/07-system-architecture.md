# System Architecture and Technical Design

**Status:** Proposed logical architecture; no stack or deployment has been selected. No software is currently implemented.

## Logical components

```text
User browser / installable PWA
          | HTTPS
          v
Application API (identity, consent, symptom entries, report generation)
          | least-privilege data access
          v
Relational database (encrypted sensitive records)

Optional later services: verified facility directory, notification provider,
telehealth partner. Each requires separate review and user-facing consent.
```

## Candidate stack

The concept plan suggests a React or Flutter mobile-first client, Node.js or Python API, and PostgreSQL. These are options, not decisions. Prefer a maintainable PWA and a supported relational database after team skills, hosting, data residency, offline needs, and security requirements are assessed. Record the final choice in ADRs before implementation.

## Trust boundaries

- User device ↔ internet/API.
- API ↔ database and backup storage.
- App ↔ external identity, maps, messaging, analytics, or hosting providers.
- User-controlled report ↔ device export/share destination.

Minimize external services. No third-party analytics or AI processing is approved by this baseline.

## Data flow

User enters data → client validates format → authenticated API stores data → user reviews history → user selects report range → server or client builds report → user previews and exports. Exact report-generation location is TBD after threat and privacy review. Avoid logging payloads.

## Deployment topology (TBD)

Separate development, staging, and production environments; isolate credentials and data. Use managed TLS, encrypted storage, least-privilege service identities, monitored backups, and documented restore procedures. Hosting provider, region, CI/CD, and scaling targets require a recorded decision.

## Quality attributes

Privacy by default, clear consent, mobile responsiveness, low bandwidth, reliable save behavior, accessibility, maintainability, and recoverability. Quantitative availability/latency targets are TBD before pilot.
