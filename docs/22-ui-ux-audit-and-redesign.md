# EndoCare Companion UI/UX Audit and Redesign

**Review date:** 2026-10-21  
**Scope:** Existing React prototype UI, visible copy, interaction patterns, and local browser experience.  
**Status:** Redesign changes implemented in the prototype. This is a product usability review, not clinical validation, security review, or WCAG conformance assessment.

## Product boundary

The app supports personal symptom tracking and user-controlled preparation for a conversation with a health professional. It must not diagnose, exclude, score risk, recommend treatment, or triage symptoms. The current prototype stores sensitive information in browser `localStorage` without encryption. Do not enter real health information. Example and browser-check data must be fictional.

## Audit findings and disposition

| Priority | Finding | Change made | Remaining work |
|---|---|---|---|
| P0 | “Private”, “confidential”, or secure-sounding status could imply protected health storage; the PIN is not a security boundary. | Header, onboarding, settings, and lock copy now state that data stays in this browser without encryption and the PIN is only a convenience lock. | Replace local storage with a reviewed privacy/security design before real health data is considered. |
| P0 | Symptom summaries, red visual emphasis, and professional-sounding report labels risk being read as an assessment. | Reframed the report as a user-prepared summary; removed faux standardized/consultation headings and anonymous-patient identity; removed an automatically derived pain-severity descriptor; clarified missing dates and high-score filters as recorded values only. | Clinical review of all fields, pain scale anchors, calculations, report copy, and user comprehension. |
| P1 | Mobile-focused narrow content and fixed bottom controls did not use larger screens effectively. | Added a desktop left navigation rail, expanded content widths, responsive header, safe-area spacing, and hides mobile navigation while a form field is focused. | Verify at 320 CSS px, zoom/reflow, landscape, and target devices. |
| P1 | Dense daily entry and timeline cards made long screens difficult to scan. | Grouped optional timing, bleeding details, pain detail, symptom selection, and notes into expandable sections; timeline observations are collapsed until requested. | Usability sessions with varied reading, mobility, and cognitive access needs. |
| P1 | Destructive demo replacement and care-contact removal lacked clear confirmation. | Loading demo data asks before replacing current entries; contact removal offers a confirm/cancel state; settings data deletion explains the local scope and requires confirmation. | Verify browser-specific deletion behavior and explain separately stored print/export copies. |
| P1 | Small controls, incomplete labels, and weak keyboard flows made touch and assistive use uncertain. | Increased many targets, added navigation names/current state, visible focus styling, dialog naming/focus handling, field labels, slider names/value descriptions, and reduced-motion styling. | Conduct keyboard-only and screen-reader audits; manually confirm target geometry, contrast, zoom, and focus return for every overlay. |
| P2 | Thin text and closely packed content reduced legibility. | Raised selected tiny text styles, improved spacing and neutral contrast, used stronger borders and less saturated states. | Measure color contrast and test translated text expansion on supported devices. |
| P2 | Kiswahili labels and report summaries were partly hard-coded in English. | Localized more navigation, settings, report-range, and metric labels. | Remaining source strings are not fully translated; arrange qualified language review before broad use. |

## Implemented visual system

- **Canvas:** warm off-white and stone neutrals.
- **Brand:** muted plum/rose; slate for primary text; amber for review notices and selected contextual emphasis.
- **Layout:** mobile bottom navigation; desktop left rail; responsive centered content with page-specific maximum widths.
- **Controls:** minimum 44 CSS-pixel height on many primary touch controls, visible keyboard focus, text labels alongside icons, and semantic pressed/current state where applicable.
- **Motion:** reduced-motion preference disables nonessential animations and smooth scrolling.
- **Reading:** white or warm-neutral cards, clear section headings, less reliance on color, readable helper copy, and expandable optional content.
- **Print:** report action chrome is hidden; tables and headings have print rules, but final print pagination remains unverified.

These are implementation choices for the current prototype; they do not establish a final brand system or accessibility conformance.

## Current screen behavior

1. **Shared shell:** sticky header with prototype and local-storage disclosures, language toggle, settings, and convenience lock. On mobile, four destinations sit in a fixed bottom bar; on desktop they appear in a left rail.
2. **Timeline & Trends:** recorded-value summaries, recent calendar strip, non-clinical filters, and entries that expand to show observation detail. An empty state links to logging and the fictional demo set.
3. **Daily Log:** date-based entry form. Core fields are shown first; optional details can be opened when useful. Sensitive fields remain optional. Numeric score and symptoms are presented as user-recorded information.
4. **Doctor Report:** user-selected range and browser print action, followed by profile and recorded-history summaries. The report warns that it can be incomplete and should be reviewed before sharing.
5. **Care & Education:** guidance remains pending qualified review. Contacts are manually entered and explicitly unverified; no directory or location matching is implied.
6. **Settings / onboarding / lock:** named dialogs explain prototype storage limits, optional profile data, destructive deletion, and PIN limitations.

For the full field-by-field interface description, see [UI Guide](21-ui-guide.md). For data semantics and calculation limits, see [App Guide](../APP_GUIDE.md).

## Verification recorded

- `npm run build` completed successfully on 2026-10-21 (`tsc -b` and Vite production build).
- Browser review used the local prototype and fictional built-in demo records. Desktop and narrow/mobile layouts were inspected visually. No real health information was entered.
- Manual checks confirmed optional log disclosure behavior, saving a fictional entry and seeing it in history, report-range recalculation, English/Kiswahili switching, settings deletion confirmation/cancel, and incorrect/correct demo PIN responses. The temporary entry was cleared and the synthetic demo set was restored.
- These checks do not substitute for automated, assistive-technology, device-matrix, print, or clinical testing.

## Remaining audit recommendations

### Before any real-world pilot

- Obtain qualified clinical review for every health field, scale anchor, summary, and user-facing health statement. Keep all clinical thresholds, emergency triage, and treatment guidance out until specifically reviewed and authorized.
- Complete privacy/security architecture, threat review, consent/research/age decisions, Kenyan legal and hosting advice, and deletion/retention requirements. The current local prototype is unsuitable for real health information.
- Establish supported devices and viewport matrix, then test 320px width, larger text, browser zoom, landscape, keyboard overlap, print output, and supported browsers.
- Test with keyboard-only use and screen readers (including labels, group structure, state announcements, focus order, dialog focus restoration, and dynamic save/error announcements).
- Measure text and control contrast; verify selected and error states without color; review touch target size and spacing.
- Complete English/Kiswahili translation, plain-language and inclusive-language review, and test long translated strings.
- Conduct moderated usability sessions with diverse users, including people with disabilities, focusing on optional sensitive fields, logging burden, empty-history meaning, report sharing, and deletion.

### Before presenting the prototype

- Keep the first-run acknowledgement and persistent local-storage warning visible and understandable.
- Use only fictional demo data in screenshots, recordings, logs, and test environments.
- Label all sample contacts as fictional and never present them as providers users can rely on.
- Show the report boundary prominently and invite review before printing or sharing.

