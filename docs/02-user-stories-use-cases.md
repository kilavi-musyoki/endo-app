# User Stories and Use Cases

**Status:** Draft; personas are representative needs, not research findings.

## Personas

- **Maya, symptom tracker:** wants to notice patterns and describe painful periods clearly; may share a phone and have limited data access.
- **Amina, appointment preparer:** wants to remember dates, symptoms, and impact during a short clinical visit; controls what she shares.
- **Clinician reviewer:** wants a concise, dated history that distinguishes user-reported information from app-generated summaries.

Validate these needs with users and clinicians before treating them as established facts.

## User stories

- As a user, I want to log a symptom quickly so I can keep a useful record without a long daily form.
- As a user, I want to skip sensitive questions so I can use the app comfortably.
- As a user, I want to edit or delete an entry so my history reflects what I meant to record.
- As a user, I want to see symptoms alongside cycle dates so I can explain their timing.
- As a user, I want to preview a report before exporting it so I control what I disclose.
- As a user, I want plain-language explanations so I understand the app is not diagnosing me.
- As a user, I want discreet notification controls so health details are not exposed on a shared device.
- As a clinician, I want a report with date range, units, and user-reported labels so I can interpret it in context.

## Use cases

### UC-01: Record a period

**Precondition:** User is in the app. **Main flow:** Choose period start/end or mark today as a start; enter flow if desired; save; review the entry. **Alternatives:** Correct a date; leave flow blank; cancel. **Errors:** Invalid date order produces an inline explanation and preserves entered values.

### UC-02: Log pain or another symptom

**Main flow:** Choose symptom; enter score or description and timing/location/impact as applicable; save. **Alternatives:** Skip optional fields; add a note; edit/delete. **Safety:** No score is interpreted as a diagnosis. Any urgent care wording must be clinically approved and localized.

### UC-03: Prepare a clinician summary

**Main flow:** Select a date range; preview included entries and missing data; edit or deselect items if supported; export/download; decide independently whether to share. **Failure:** If export fails, show recovery guidance and do not lose the draft.

### UC-04: Manage privacy

User reviews consent, changes optional permissions, requests data export/deletion, and can sign out. Exact workflows depend on account and legal design.

## Edge cases

- Irregular, absent, or overlapping period dates; unknown dates; timezone changes.
- Shared device, lost connectivity, interrupted save, duplicate submission, or expired session.
- User enters no symptoms, stops tracking, or has a long gap in records.
- User is distressed by a question or result and needs to skip, exit, or find approved support guidance.
- User is under 18; handling remains blocked on qualified local review.
- User requests deletion while an export or sync is pending.
- Clinician receives a report with incomplete history; report must not imply completeness.
