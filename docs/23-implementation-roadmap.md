# EndoCare Companion Implementation Roadmap

**Created:** 2026-10-21  
**Status:** Proposed phase plan; implementation has not started under this roadmap.  
**Basis:** Comparison of the pasted *Endometriosis Early-Detection App Knowledge & Data-Entry Guide* with the current prototype, [App Guide](../APP_GUIDE.md), [UI/UX Audit](22-ui-ux-audit-and-redesign.md), and [Requirements Traceability](17-requirements-traceability.md).

## Guardrails for every phase

- The prototype supports recording observations and preparing a user-controlled summary. It must not diagnose, rule out, estimate likelihood, recommend treatment, or triage symptoms.
- The pasted guide is explicitly a draft for clinical review. Its medical ranges, scoring weights, output wording, overrides, and emergency rules are not approved product requirements.
- Do not implement clinical interpretation or emergency messages until a qualified gynecologist has reviewed the complete specification and the product owner has approved the intended scope and language.
- Keep new sensitive fields optional, explain why each is asked, and collect only what is justified. Do not use real health data in examples, screenshots, test fixtures, logs, or prompts.
- Local browser storage is not encrypted. Do not present the current app as suitable for real health information or production use.
- Preserve missing data as “not recorded”; never infer an absent symptom from a blank date.
- For each phase, update the App Guide and traceability matrix, record decisions in an ADR when architecture or product behavior changes, and report only checks that were actually run.

## Phase 0 — Scope, requirements, and clinical/privacy gates

**Objective:** Convert the guide into an approved, traceable specification before expanding beyond current tracking.

**Work:**

1. Separate requirements into: personal tracking, descriptive calculations, provider linking, clinical decision support, emergency guidance, and production/privacy readiness.
2. Reconcile ambiguities in the draft: adult versus adolescent ranges; “more than 9 days” versus the listed usual variability; the cycle window used for points; counting a symptom once per cycle; period length; age-specific fertility timing; and the meaning of “two cycles in a row.”
3. Identify every new sensitive field, its purpose, optionality, retention, report visibility, and deletion behavior. Decide whether clot categories and timing of blood observations are necessary additions.
4. Obtain product-owner decisions on whether the product remains a tracking companion or is intended to provide clinically reviewed decision support. Keep the existing non-diagnostic scope until a formal change is approved.
5. Arrange qualified clinical review for clinical requirements and qualified Kenyan privacy/legal advice for consent, minors, research, hosting, and applicable obligations.
6. Create or update ADRs and map every accepted requirement to UI, data model, calculation, report, and verification evidence.

**Acceptance criteria:**

- Every guide item is marked as implemented, partial, deferred, rejected, or awaiting review in traceability.
- No draft threshold, point weight, triage instruction, or result message is described as approved.
- Required clinical and privacy reviewers, approval evidence, and unresolved decisions are recorded.

**Gate:** Phase 4 cannot begin until its clinical specification and language receive qualified review and explicit product approval. Production data handling cannot begin until Phase 5 review is complete.

## Phase 1 — Tracking-field reconciliation

**Objective:** Complete only approved, optional data-entry gaps without adding interpretation.

**Candidate work after Phase 0 decisions:**

1. Review whether the current large-clot yes/no input should remain or become “none / small / large.”
2. Decide whether blood-in-stool and blood-in-urine observations need an explicit time association with a period. Keep the answer optional.
3. Decide whether impact should include a distinct “missed activities” value beyond the current impact options.
4. Confirm that start/end markers, profile fields, pain locations/timing/context, medication response, symptoms, and notes match the accepted field inventory.
5. Review labels and help text for plain language, inclusiveness, Kiswahili translation, and a clear purpose for sensitive questions.
6. If the data model changes, version local records and provide a safe migration or backward-compatible read path; preserve existing local entries.

**Acceptance criteria:**

- An approved field-by-field matrix maps the guide to the UI and stored data.
- Sensitive questions are optional, clearly labeled, and have accessible controls and error states.
- Existing records still load; new and edited records save and render in the timeline/report.
- Synthetic fixtures verify null, yes/no, and skipped-answer states without real health details.

**Dependencies:** Phase 0 field-purpose and data-minimization decisions. This phase does not add thresholds or alerts.

## Phase 2 — Descriptive cycle and report improvements

**Objective:** Make user-entered dates and observations easier to review without classifying them as normal or abnormal.

**Work:**

1. Specify and implement a descriptive period-duration calculation from explicitly marked start/end dates, if approved. Show how incomplete, overlapping, reversed, or missing markers are handled.
2. Retain the current cycle-length calculation from successive explicitly marked starts; explain that it is descriptive and depends on the user’s markers.
3. If adding a daily pain chart to the timeline or report, provide a readable text/table equivalent, clear dates, no interpolation across missing days, and a useful print layout. Charts must remain descriptive and must not classify urgency or care timing without the Phase 4 clinical gate.
4. Decide whether the internally calculated count of recorded pain scores at 7+ belongs in the report. If shown, label it as a count of user-entered values, not a warning or clinical threshold.
5. Ensure report includes the requested profile and daily observations, date prepared, and a visible user-prepared/non-diagnostic notice. Make clear that browser print/PDF creates a separate copy.
6. Test date boundaries, missing entries, empty history, partial cycles, and report ranges with fictional records.

**Acceptance criteria:**

- Date calculations use only explicit markers and have documented edge-case behavior.
- No blank day is treated as a symptom-free day; no clinical normal range or interpretation appears.
- Chart information remains available to screen-reader and print users as a text/table alternative.
- Report contents and print layout are manually reviewed at supported viewport and paper sizes.

**Dependencies:** Phase 0 definition of descriptive outputs. Any health interpretation remains out of scope.

## Phase 3 — Care-linking capability

**Objective:** Decide whether the prototype should remain a personal contact list or grow into a facility directory.

**Work:**

1. Keep the current personal, manually entered contact list clearly labeled unverified unless a vetted directory source is approved.
2. Before building a directory, identify an authoritative source, provider verification process, refresh cadence, correction/removal workflow, ownership, and operational capacity.
3. Define service categories and required contact fields; distinguish “user-entered” from “verified by source” and show verification date/source.
4. Treat map pins, user distance, and device location as separate features. Specify opt-in permission, manual-location alternative, data minimization, retention, and behavior if permission is denied.
5. Do not add public ratings/reviews without moderation policy, reporting/escalation paths, abuse handling, and responsible ownership.
6. Validate URLs and present contact details as information to confirm, not a recommendation or guarantee.

**Acceptance criteria:**

- No listing is called verified unless the verification source and date are available.
- Location is never accessed without an explicit permission flow; manual location remains available.
- Review/rating content is not enabled without an approved moderation design.
- Contact deletion and any location data handling are documented and verified.

**Dependencies:** Directory source and operational ownership; privacy review before location or third-party data is introduced.

## Phase 4 — Clinically reviewed decision support (gated)

**Objective:** Implement the draft ranges, baseline comparisons, points, result levels, and emergency messages only if the product is formally authorized to do so.

**Pre-implementation package:**

1. A qualified gynecologist reviews and signs off each threshold, score weight, cycle-counting rule, override, result message, and emergency instruction.
2. Resolve conflicts and edge cases from Phase 0, including age groups, incomplete cycles, repeated symptoms, cycle boundaries, time association, data quality, and cases with missing answers.
3. Review language so it does not falsely reassure, diagnose, imply certainty, or encourage delay in care. Approve translations as well as English copy.
4. Define rule versioning, auditability, how changed rules affect past reports, and how users see which approved rule set was used.
5. Specify safe failure behavior when insufficient or inconsistent data exists. A score must never be silently produced from missing inputs.

**Implementation only after approval:**

- Build a deterministic, versioned rules module separated from storage and display components.
- Show the reviewed disclaimer with every result and retain an accessible route to a health professional.
- Keep “result” and emergency behavior distinct; implement urgent messages only exactly as approved, with no inferred emergency detection beyond the approved inputs.
- Add synthetic unit and interaction scenarios for each approved rule, boundary value, missing-data case, override, and emergency case. Do not use real patient histories.

**Acceptance criteria:**

- Each output is traceable to an approved rule version and signed-off wording.
- All approved synthetic scenarios pass, including edge cases and unavailable data.
- The UI never presents a probability or diagnosis and does not describe a low result as proof that the user is fine.
- Clinical sign-off is recorded; usability checks alone do not count as clinical validation.

**Gate:** Without written clinical approval, this phase stays deferred and no score, result band, or emergency alert is added.

## Phase 5 — Privacy, security, and legal readiness

**Objective:** Decide whether and how the app could ever handle real health information.

**Work:**

1. Complete data-flow mapping, threat modeling, data minimization, retention/deletion, user access, export, backup, breach, and incident requirements.
2. Select an approved storage, encryption/key-management, authentication, and hosting architecture. The current browser PIN and `localStorage` are not sufficient security controls.
3. Define consent and user notices; resolve age/minor handling, research use, data-controller/processor roles, hosting location, and Kenyan legal obligations with qualified local advisers.
4. Review third-party services and prohibit analytics, advertising, AI processing, or data sharing unless explicitly required, privacy-reviewed, and approved.
5. Verify deletion across active storage, backups, logs, and exported copies where technically possible; explain copies outside app control.

**Acceptance criteria:**

- Security/privacy decisions and unresolved risks are recorded in ADRs and updated threat/privacy documents.
- A qualified security/privacy review has evidence and findings are addressed or explicitly accepted by the responsible owner.
- The app makes no claim of encryption, compliance, or production readiness without evidence.
- Real health data remains prohibited until the responsible reviewers authorize the environment and process.

**Dependencies:** Qualified Kenyan legal/privacy advice and a selected production architecture. This phase is not satisfied by changing the PIN screen.

## Phase 6 — Release readiness and ongoing review

**Objective:** Verify the complete approved product before any pilot or release.

**Work:**

- Complete English/Kiswahili translation and qualified language review.
- Run supported-browser/device checks, keyboard-only and screen-reader checks, 320px and zoom/reflow checks, contrast/target-size review, and print/PDF review.
- Conduct moderated usability studies with synthetic or properly approved research data and appropriate ethics/consent processes.
- Run approved functional, data migration, deletion, security, and clinical synthetic test suites.
- Prepare operating ownership for directory updates, clinical content changes, support, incidents, and rule revisions.
- Update README, App Guide, UI Guide, traceability, testing/QA, operations, and release log with evidence. Avoid claims not supported by that evidence.

**Acceptance criteria:**

- Every release requirement has a verified result or an explicitly accepted limitation.
- Accessibility, clinical, privacy/security, legal, and operational reviews have documented owners and outcomes.
- No production use begins while a critical review or safety blocker remains open.

## Suggested sequencing

| Order | Phase | Can proceed now? | Main blocker |
|---:|---|---|---|
| 0 | Scope, requirements, and review gates | Yes | Reviewer and product-owner availability |
| 1 | Tracking-field reconciliation | After Phase 0 decisions | Data-minimization and field-purpose decisions |
| 2 | Descriptive calculations and report | After Phase 0 definitions | Date/calculation and report-content decisions |
| 3 | Care-linking | Discovery can proceed | Verified source, ownership, and location/privacy decisions |
| 4 | Clinical decision support | No | Written qualified clinical approval |
| 5 | Privacy/security/legal readiness | Design discovery can proceed | Qualified advice and architecture decisions |
| 6 | Release readiness | Later | Depends on approved implementation and all reviews |

## Current starting point

The current prototype already covers most basic input categories, descriptive cycle summaries, a user-prepared report, a personal unverified contact list, onboarding disclosure, and local deletion. Start with Phase 0 traceability and decisions; avoid rebuilding these existing parts. The guide’s clinical scoring and urgent-care instructions are intentionally absent and remain gated.
