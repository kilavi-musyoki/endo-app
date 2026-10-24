# Architecture Decision Records

**Status:** Initial proposals; no technical choice is approved for implementation yet.

## ADR-001: Begin with a mobile-first web experience

- **Status:** Proposed
- **Context:** Initial users are expected to use phones; the concept prioritizes one codebase and accessible reach.
- **Decision:** Evaluate a Progressive Web App for the MVP before committing to a native Android app.
- **Alternatives:** Native Android first; cross-platform native framework; responsive website without installation features.
- **Trade-offs:** PWA may simplify reach and distribution but browser/device behavior and offline storage need verification.
- **Consequences:** Confirm browser support, offline requirements, and device privacy before implementation.

## ADR-002: Use a relational data store if a server-backed MVP is approved

- **Status:** Proposed
- **Context:** Cycle records, symptom entries, consent, and report metadata have structured relationships.
- **Decision:** Assess PostgreSQL or an equivalent maintained relational database.
- **Alternatives:** Local-only storage; document database; managed health platform.
- **Trade-offs:** Server persistence supports account recovery and synchronization but raises data-protection and breach impact.
- **Consequences:** Minimize fields, define retention/deletion, and review hosting region before storing real data.

## ADR-003: No diagnostic AI in the MVP

- **Status:** Proposed baseline
- **Context:** The project plan describes symptom tracking and a draft transparent rule set, not a validated model.
- **Decision:** MVP provides tracking and user-controlled summaries; any future flags require clinical review and validation.
- **Alternatives:** Black-box model; rule-based flag in initial launch.
- **Trade-offs:** Avoids unsupported diagnostic claims; does not provide automated screening in the first version.
- **Consequences:** No ML service, training-data collection, risk score, or diagnostic accuracy claim in MVP.

## ADR-004: Keep report sharing user-initiated

- **Status:** Proposed
- **Context:** Health information is sensitive and clinicians may not be integrated with the app.
- **Decision:** User previews and exports a report; automatic facility transmission is deferred.
- **Alternatives:** Direct integrations or appointment request with attachment.
- **Trade-offs:** Adds a manual user step but preserves control and reduces integration/data-sharing complexity.
- **Consequences:** Report must clearly state its date range, source, and missing data.

## ADR-005: Prototype and PWA baseline with modular storage adapter

- **Status:** Accepted (Hackathon / MVP Prototype Baseline)
- **Context:** An interactive prototype is required for demonstrations, clinical review, and hackathon presentation while providing an extensible code structure.
- **Decision:** Build the frontend using Vite + React + TypeScript + Tailwind CSS with a pluggable `StorageService` adapter. The initial implementation uses local-first browser storage and synthetic demo seed data, allowing future replacement with PostgreSQL/Supabase or REST backend without rewriting UI components.
- **Alternatives:** Static wireframes; native mobile app; backend-first monolithic API.
- **Trade-offs:** Enables rapid presentation and local zero-dependency testing, but requires a subsequent backend integration step for multi-device sync and server-side encryption.
- **Consequences:** Codebase adheres to strict non-diagnostic health boundaries, includes English and Swahili localization dictionaries, and allows immediate local launch via `npm run dev`.

## ADR-006: Keep symptom interpretation inactive until qualified approval

- **Status:** Accepted (prototype behavior)
- **Date:** 2026-10-21
- **Context:** The supplied knowledge guide labels its ranges, score, messages, and emergency logic as drafts awaiting clinician review. Project instructions prohibit unreviewed clinical thresholds and triage behavior.
- **Decision:** The prototype may collect and display user-entered observations and descriptive averages. It does not compare them with clinical ranges, calculate care-risk points, assign result levels, or trigger emergency advice. Clinical educational content and unverified emergency contacts are withheld from the user interface.
- **Consequences:** Re-enable interpretation only after a qualified clinician and applicable privacy/regulatory reviewers approve a versioned specification and user-facing wording. No probability or diagnosis claim is authorized by this ADR.

## ADR-007: Keep care contacts user-maintained and local

- **Status:** Accepted (prototype behavior)
- **Date:** 2026-10-21
- **Context:** No verified provider dataset, directory partner, mapping service, or location permission design is available.
- **Decision:** Users may save their own care contacts in browser storage with manually entered town/county and service/contact details. Listings are labeled unverified. The prototype does not request device location, calculate distance, publish ratings, or claim registration verification.
- **Consequences:** A populated or searchable provider directory requires verified source data, local review, a moderation plan, and privacy approval.

## ADR-008: Visualize recorded pain without inferring urgency

- **Status:** Accepted (prototype behavior)
- **Date:** 2026-10-21
- **Context:** A request asked for a timeline visualization that indicates how urgently a user should visit a doctor. The prototype has no clinically reviewed or approved rules for care timing, and project instructions prohibit inventing clinical thresholds or triage logic.
- **Decision:** The timeline may plot user-entered daily pain scores over the most recent 30 days as dated points, with an equivalent data table. It does not connect points across missing dates, set urgency zones, generate a risk score, or recommend when to seek care. The UI states this limitation and invites users with concerns to discuss their records with a health professional.
- **Consequences:** A clinically interpreted urgency feature remains deferred to ADR-006’s approval gate and the Phase 4 review process. The descriptive chart is not a substitute for medical advice or an urgent-care decision.

## ADR-009: Use a minimal, optional first-run profile step

- **Status:** Accepted (prototype behavior)
- **Date:** 2026-10-22
- **Context:** The first-run dialog previously asked only for acknowledgement and could cause the document to scroll while focusing its checkbox. The product asks for minimal collection, optional sensitive questions, and a clear local-storage warning.
- **Decision:** Present a two-step first-run flow: prototype boundary and acknowledgement, then an optional display name or pseudonym. Do not require health-history details to enter the app. Keep other profile questions optional in Settings, preserve the prototype warning, and mount the dialog at the document level to keep it positioned relative to the viewport.
- **Consequences:** A supplied display name is stored in this browser and may appear on reports; the first-run copy advises fictional data only. The flow is not formal consent or an account-creation process. Revisit the collected fields and copy after privacy review.

## ADR-010: Show owner-confirmed care phone listings separately from personal contacts

- **Status:** Accepted (prototype behavior)
- **Date:** 2026-10-24
- **Context:** The user requested four phone listings always visible on the Care & Education page, alongside a personal list users can add to, and confirmed the details were verified.
- **Decision:** Show the supplied name/phone pairs as fixed tap-to-call listings above the user's browser-local contacts, with a professional verified badge. Attribute verification to the project owner and state that the app does not independently check for later changes.
- **Consequences:** The fixed listings do not use the editable contact storage and remain visible when a user adds or removes personal contacts. The app does not maintain a verification date or guarantee ongoing accuracy.

## Decision process

Replace proposal status with accepted/rejected, owner, date, and review triggers when stakeholders decide. Add one ADR per consequential change.
