# Database Schema and Data Dictionary

**Status:** Conceptual model only. This is not a migration or production schema.

The prototype currently persists the following user-entered data in browser `localStorage`. This is not encrypted storage and must not be used with real health information.

## Candidate entities

| Entity | Purpose | Candidate fields | Notes |
|---|---|---|---|
| User | Account and settings | id, created_at, locale, timezone, account_status | Avoid collecting legal name or birth date unless justified. |
| ConsentRecord | Consent history | id, user_id, purpose, notice_version, choice, timestamp | Separate core service consent from optional research/communications. |
| CycleRecord | Period/cycle entries | id, user_id, start_date, end_date, flow_level, period_start_marked, period_end_marked, pads_or_tampons, soaked_within_hour, large_clots, created_at, updated_at | Prototype derives cycle lengths only from dates explicitly marked by the user; it makes no clinical range comparison. |
| SymptomEntry | User-reported symptom | id, user_id, occurred_at/date, symptom_type, pain_score, location, pain_timing, pain_context, bleeding_between_periods, blood_in_stool, blood_in_urine, mood, impact, medication_response, note, timestamps | Optional fields; note is sensitive free text and should be minimized. |
| UserProfile (optional) | Optional user-provided report details | age, age_at_first_period, pregnancies, trying_to_conceive, months_trying, family_history, known_conditions | Optional and sensitive; kept blank unless user enters data. |
| CareContact (prototype only) | User-maintained care contact | name, type, county_or_town, services, clinician, specialty, phone, hours, booking_link, map_link, cost_range, insurance | Stored locally; not verified by the app or a provider directory. |
| ReportRecord (optional) | Export audit/metadata | id, user_id, date_range, generated_at, template_version | Avoid retaining report contents unless needed. |
| EducationArticle | Reviewed content | id, locale, title, body, reviewer, reviewed_at, version | Content publication requires clinical approval. |

## Relationships and constraints

- One user may have many consent, cycle, and symptom records.
- Use opaque internal identifiers; never expose sequential IDs as authorization.
- All user-owned records require owner-scoped access checks.
- Validate date ranges and enumerated fields server-side; support correction.
- Define deletion behavior, backup expiry, and audit retention before implementation.
- Encrypt sensitive content at rest and in transit according to approved architecture.

## Data definitions

- `pain_score`: integer (0-10) on an anchored scale representing overall peak pain.
- `pain_details`: array of discrete pain vectors specifying anatomical location (`pelvis`, `lower_back`, `lower_abdomen`, `thighs`, `legs`, `rectum`, `bladder`, `chest_ribs`, `generalized`), localized magnitude (0-10), and pain qualities (`cramping`, `sharp_stabbing`, `burning`, `dull_aching`, `throbbing`, `shooting_electric`, `heaviness_pressure`).
- `symptoms`: multi-select array containing standardized symptom keys categorized by biological domain (pelvic/cycle, digestive, urinary, neuromuscular, systemic/mood) alongside client-persisted user custom tags (`custom_<timestamp>`).
- `flow_level`: controlled vocabulary whose wording is user-tested (`none`, `spotting`, `light`, `medium`, `heavy`).
- `cycle_relation`: optional user-reported relation to period; not an inferred diagnosis.
- `impact`: optional multi-select or single choice about daily activities (`none`, `mild_interference`, `missed_school_work`, `bed_rest`).
- `note`: optional free text; sensitive and potentially identifying. Keep optional and client-side.
- `pain_timing` and `pain_context`: user-selected time/activity labels; they are not interpreted as evidence of a condition.
- `cycle_lengths` and recent averages in the prototype are descriptive summaries of explicitly marked dates, not fixed normal ranges, thresholds, or clinical assessments.

## Indexing and migrations

Candidate indexes: `(user_id, occurred_at)` for symptom history and `(user_id, start_date)` for cycle history. Add constraints only after handling irregular/partial dates. Use versioned migrations with backup and rollback plans; never silently rewrite user-entered clinical history.
