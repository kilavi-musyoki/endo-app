# UI/UX Design Specification

**Status:** Proposed product principles. The current prototype has a separate as-built responsive interface documented in [UI Guide](21-ui-guide.md) and [UI/UX Audit](22-ui-ux-audit-and-redesign.md). Neither document is a release design approval.

## Design goals

- Calm, discreet, respectful, mobile-first, low-data, and understandable.
- Make logging quick without pressuring users to track every day.
- Keep control with the user, especially for sensitive questions and sharing.
- Show user-reported data separately from educational information.

## Proposed screens

1. Welcome, purpose, and limitations.
2. Consent and privacy choices.
3. Home and quick actions.
4. Period entry and cycle history.
5. Symptom entry (pain, timing, location, impact, optional notes).
6. History/timeline with edit and delete actions.
7. Report date-range selection and preview.
8. Education article.
9. Settings: privacy, account, notification preferences, export/deletion.

## Visual system (TBD)

Choose color tokens with adequate contrast and avoid relying on color alone to express severity. Use readable system-friendly type, generous touch targets, clear headings, and familiar date/time formats. Do not use stigmatizing, alarmist, or infantilizing imagery. Record final color, type, spacing, and component tokens here after design review.

## Interaction and content rules

- Use plain language and explain scales before use. Pain-scale anchors require clinical/user review.
- Make sensitive questions skippable and avoid requiring sexual or fertility details to use core tracking.
- Show save state; preserve inputs after validation or network errors.
- Confirm destructive actions and provide undo when feasible.
- Provide text alternatives for icons, visible focus, keyboard support, screen-reader labels, and scalable text.
- Avoid health details in push/SMS preview text; notification defaults and consent are TBD.

## Responsive and accessibility requirements

Design for narrow phone screens first; support tablet and desktop without hiding essential actions. Support keyboard-only use, screen readers, browser zoom/text resizing, high contrast, reduced motion, clear validation, and accessible chart alternatives. Select a conformance target before release and test with users with disabilities.
