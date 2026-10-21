# EndoCare Companion UI Guide

**Status:** As-built description of the interactive prototype, version 0.1.0. It documents the current interface in `src/`; it is not a proposed final design or an accessibility certification. The interface supports tracking and preparing for a clinician conversation. It does not diagnose, score, recommend treatment, or triage symptoms.

## 1. Interface at a glance

The app is mobile-first and responsive. It uses a persistent header and four destinations:

1. **Timeline & Trends** — default landing view for recent summaries, calendar strip, filters, and saved entries.
2. **Daily Log** — a long, vertically scrolling form for one date.
3. **Doctor Report** — a date-filtered consultation summary with a print action.
4. **Care & Education** — review-status notice and a user-maintained contacts list.

On narrow viewports, navigation is a fixed bottom bar. At desktop widths, it becomes a viewport-fixed left rail, so it stays in place while the main content scrolls. If the navigation items exceed the viewport height, the rail can scroll internally. The Settings panel, onboarding dialog, and lock screen appear above the current page as overlays. The report also has a print layout.

## 2. Shared shell and visual language

### Header

The header stays at the top while the user scrolls. It contains the heart-pulse mark, app name, prototype badge, subtitle, language, Settings, and convenience-lock controls. A second row shows synthetic-demo/local-storage status and a button to switch between synthetic sample entries and an empty log.

The language button displays `SW` when the interface is currently English and `EN` when it is currently Kiswahili. Settings and lock controls have accessible names. A decorative mark beside the brand icon does not indicate secure storage or an account state.

The status row identifies synthetic demo data as fictional. The action button changes with the mode:

- Demo mode: **Clear / Start Fresh** opens a browser confirmation, then clears the entries and switches to an empty log.
- Empty/local mode: **Load Demo Data** asks before replacing current entries with the synthetic sample.

The status text is interface copy, not a claim that the storage is encrypted or confidential against device access.

### Main content and bottom navigation

The visual system uses warm off-white and stone backgrounds, muted plum/rose brand surfaces, and slate text. Content is grouped in white or warm-neutral cards with rounded corners, clear borders, and modest shadows. Content width expands on wider screens. Controls use larger touch targets, visible focus outlines, and reduced-motion styles.

On mobile, navigation is fixed to the bottom edge with four destinations and safe-area padding. On desktop it is fixed to the left edge of the viewport and can scroll internally if needed; the header and main content occupy the adjacent content column. The current destination is marked semantically and visually. Navigation is hidden for printing and while a mobile form field is focused to give the on-screen keyboard more room.

Page content generally includes extra bottom padding so the fixed navigation does not cover the last controls. The long daily form and the contacts list scroll within the page; the Settings panel itself has a maximum height and internal scrolling.

## 3. First-use and overlay states

### Onboarding dialog

On a browser without the onboarding marker, the app opens with a centered white dialog over a dark, blurred scrim. It contains the app/initiative label, welcome copy, three short feature points, a clinical-boundary banner, a checkbox acknowledging prototype-only use, and a primary start button. The start button remains disabled until the box is checked. Dismissing the dialog stores the acknowledgement in browser storage.

The acknowledgement says the user understands this is a prototype and will not enter real health information. It is not a formal consent or legal agreement.

### Settings panel

Settings is a centered modal over a dark translucent scrim, with a sticky title row and internal scrolling up to 90% of the dynamic viewport height. Sections are separated by thin borders. The panel contains display-name and optional profile fields, PIN controls, language status, synthetic test data, delete-data confirmation, and app/privacy information. The delete action first reveals Cancel and Yes, Delete controls. The modal supports Escape and keeps keyboard focus within the dialog.

The **Synthetic test data** section lists three fictional 90-day profiles, with a short description of what each scenario covers. Loading one asks for confirmation because it replaces the current entries and profile details. The active profile is identified in Settings, where **Clear active test data** also asks for confirmation and returns the app to an empty log. Loading another scenario replaces the currently active synthetic data. These are prototype test controls, not multi-user account features, and their patterns are not clinical categories.

Saving the display name or optional health history produces a brief “Saved” label. PIN validation errors and success appear as inline text below the update button. The interface does not navigate away when a profile field is saved.

### Discreet lock screen

The lock is a full-screen, near-black overlay with a centered lock icon, explanatory text, four PIN dots, and a numeric keypad with backspace. A correct four-digit PIN dismisses it; an incorrect PIN animates an error state and clears the entered digits. A footer says the lock is a prototype convenience feature and not encryption. The default demo PIN is displayed in the lock screen.

## 4. Timeline & Trends screen

The first card presents a “90-Day Symptom History” heading, a “Cycle & Pain Patterns” title, and the count of marked period starts. Below it are three compact summary metrics: average period-flow pain, peak pain score, and days marked as missed work/school or bed rest. A separate baseline card shows the count of completed marked cycles included, average cycle length, and average period pain, along with copy explaining the averages are descriptive and not a medical assessment.

The **Pain scores you recorded in the last 30 days** chart plots one point per recorded date on a 0–10 axis. It does not connect points across missing dates or use colored urgency zones. A table alternative lists the same dates and scores. The accompanying note says this record cannot determine urgency or when to seek care; it can be discussed with a health professional. When there are no recorded scores in the window, the chart shows a neutral empty state.

A boundary card describes the log as a record, not an assessment, and includes a button to open the report.

The **Last 30 Days** calendar strip is horizontally scrollable. Each date cell shows a weekday initial and day number. Logged period days use a rose-tinted surface; other logged dates use a neutral surface; unlogged dates are outlined with a dashed border. A small marker indicates period flow, a selected date, or a pain score of 7 or more. Only dates with entries can be selected. Selecting a date filters the feed to that date; **Show all** clears the selected-date view.

Three filter buttons control the feed:

- **All Logs** shows every entry and its count.
- **Period Days** shows entries whose flow is not “none.”
- **Pain ≥ 7** shows entries with an overall score of at least 7.

These labels simply expose the recorded values. In particular, the numeric filter is not a warning or a clinical threshold. If there are no matching rows, the feed shows a neutral empty-state card.

Each entry card shows date, a flow badge when the flow is non-none, a recorded pain score, and a delete control. The detail disclosure expands to show location-specific magnitudes/qualities, associated symptoms, impact, timing/context, bleeding details, other details, medication response, and personal notes. Deleting an entry asks for browser confirmation. A separate general empty state prompts the user to add a log or load the demo set.

## 5. Daily Log screen

The daily log is a vertically scrolling form inside a white card. The title row includes neutral introductory copy and a date input. When a saved date is loaded for editing, an “Editing entry for [date]” label is shown. Core flow and pain inputs appear first; optional groups can be expanded when useful. Form sections appear in this order:

### A. Flow and bleeding details

Five flow choices represent none, spotting, light, medium, and heavy flow. One is selected at a time. Optional bleeding details are collapsed by default and include period-start/end markers, pads/tampons count, and recorded yes/no/not-recorded observations. A note says these details do not trigger automated medical assessment.

### B. Timing and activity context

Optional timing and activity context use wrapping choice buttons inside a disclosure. The first group is timing (before, during, after period, mid-cycle, ongoing/constant, another time). The second is context (sex/intimacy, bowel movement, urination, exercise). Each allows multiple selections and displays a note that these optional details are not used to assess a condition.

### C. Overall pain score

A tinted card contains an icon, the pain label, a live number out of 10, and a large, touch-friendly horizontal slider from 0 to 10. The overall score is independent from the separate score recorded for each selected location. The scale caption identifies 0, 5, and 10 with short descriptions. This is a user-entered descriptor; it is not an app assessment.

### D. Other details

Optional details include two dropdowns—blood in stool and blood in urine—with not-recorded, yes, and no options. Mood changes are selected with wrapping multi-select buttons.

### E. Pain locations and detail

The uploaded front-and-back body illustrations provide selectable markers for corresponding body areas; each marker has an accessible name and keyboard control. Selected locations show a soft, circular glow with a dense center that fades outward. Glow size and opacity reflect the user-recorded location score and do not indicate medical urgency. The labeled location chips below the map remain an alternative. Selecting a location shows it as selected in the chips; adding a location starts its own score at 0. A separate remove button beside each selected chip lets the user unselect it directly. The expanded detail panel for the active location lets the user choose multiple pain qualities, adjust a location-specific 0–10 slider, remove the location, and press **Done** to close the detail panel. The default new-log location is pelvic area. Location scores do not change when the overall score changes.

### F. Daily impact

Four full-width choices appear in a two-column grid: no disruption, mild interference, missed work/school, or bed rest. The selected choice uses a tinted background, stronger border, and check icon.

### G. Medication and response

When **Pain Medication Taken?** is selected, the user can optionally type a medication name or choose a generic-name suggestion (paracetamol/acetaminophen, ibuprofen, naproxen, or aspirin), then record whether it helped. Suggestions are for recording only and are not treatment advice.

### H. Associated symptoms and custom tags

Symptom selection and notes are collapsed optional sections. The category selector offers all symptoms, pelvic/cycle, digestive/gut, urinary, nerve/muscle, energy/head, and custom tags. Each symptom has a text label and selected state. Custom tags have a remove action; **Add Custom Symptom** reveals a field plus Cancel and Add to My List buttons.

### H. Medication response and notes

A checkbox asks whether pain medication was taken. When checked, the user can optionally enter or choose a medication name and record whether it helped with yes, somewhat, or no. The form ends with an optional notes textarea and a full-width gradient save button. After saving, a success panel replaces the form briefly and the app returns to the timeline.

## 6. Doctor Report screen

The report begins with a responsive action panel containing the title/subtitle, a **Print / Export PDF** action, and a three-choice observation-window selector: **Last 30 days**, **Last 90 days (default)**, and **All history**. The current choice is shown with a filled brand color. Printing is disabled when the selected range has no entries. In the printed view the action panel and range selector are hidden.

The report sheet starts with a user-prepared title and review-before-sharing label, followed by the actual date span and number of entries. Optional profile details are grouped separately and carry a reminder to review sensitive information before sharing. The overview cards show entry count, average overall pain, average period pain when period-flow records exist, and highest recorded overall pain. Additional counts describe entries with a non-zero pain score and entries marked with any daily impact. Missing dates are explicitly described as unknown rather than symptom-free.

Further sections show descriptive cycle calculations and marked period dates, location-specific average/highest pain values and recorded qualities, associated-symptom frequency, medication response counts, and the three most frequently recorded medication names with their entry counts. Daily cards include the medication name and response for that date when recorded, as well as overall pain, flow, impact, location-specific scores and qualities, period markers, timing/context, associated symptoms, mood and bleeding observations, and notes. Empty sections use explicit messages. A range with no entries shows an empty state rather than zero-valued summaries. The document ends with the boundary that it is a user-entered record, may be incomplete, and is not a diagnosis or clinical assessment.

The print stylesheet removes the app header, navigation, buttons, and page padding, and keeps daily record cards together where page space allows. The browser print dialog controls the final paper or PDF output. Final print pagination and readability at different paper sizes still need review.

## 7. Care & Education screen

The first card has a heart/handshake icon, page title, and short subtitle. An amber warning card follows, with a shield-alert icon and a clear heading that clinical guidance is pending review. Its copy explains that symptom thresholds, emergency instructions, and facility details need qualified clinical and local review.

The contacts card begins with a title and verification/location caveat. **Add a care contact** expands an inline form; on wider screens the inputs form two columns, while narrow screens use one column. Facility/clinician name, type, location, and services are required. Clinician name, specialty, phone, hours, booking link, map link, cost range, and insurance are optional. The form ends with **Save contact**. Saved rows show the contact name/type/location, services, any optional details, and links. Booking and map links open separately in the browser. **Remove** opens an inline confirm/cancel choice before removing a contact from this browser.

This is a personal list, not a searchable or verified directory. The UI does not use device location or confirm whether a listed provider, service, fee, insurance, or contact detail is current.

## 8. Settings screen

Settings is a vertically scrolling panel divided into these sections:

1. **Display Name:** text input, note that a pseudonym can be used, and Save button.
2. **Optional health history:** explanatory text; age, age when periods began, pregnancies, family history; current trying-to-conceive choice; conditional months-trying field; known-conditions textarea; and save button.
3. **Change Privacy PIN:** current, new, and confirmation PIN fields; Update PIN button; inline validation/success text.
4. **Language:** reports the current language and points to the globe control in the header.
5. **Delete All My Data:** warning text, then a two-button confirmation state (Cancel / Yes, Delete).
6. **About:** version 0.1.0 (Hackathon Preview) and the local-storage/PIN notice.

The first five sections are operational settings. Language is switched in the header rather than in this panel. The panel’s delete function wipes local app data and reloads the page; it cannot delete printed or exported copies.

## 9. Interaction and visual conventions

- Single-choice inputs use filled backgrounds/borders to show selection; multi-choice pills can be toggled on and off.
- Primary actions generally span the card width and use a dark or brand-gradient background. Destructive actions use rose/red. Review notices use amber.
- Responsive type and spacing aim to keep controls legible on mobile and desktop. Icons support labels but are not intended to carry the entire meaning of major actions.
- Cards are separated by spacing rather than heavy dividers; inset forms use a light slate or brand tint.
- Hover, focus, and active states are styled in several controls; some controls also change scale or color on touch/press.
- The app uses browser-native date, number, select, print, and confirmation controls where applicable.
- Some copy changes with English/Kiswahili selection. Several labels and helper strings remain hard-coded in English, so the current Kiswahili interface is partial and should not be presented as a fully translated experience.

## 10. Accessibility and UI review notes

The current interface includes headings, labels, fieldsets/legends in several groups, state attributes on toggles, visible focus styles, and named dialogs. These are foundations, not an accessibility conformance claim. Items to verify include:

- keyboard navigation and visible focus for every interactive element, including icon-only header/delete controls;
- screen-reader names and selected-state announcements for all pill buttons and sliders;
- target size and spacing on small touch screens;
- text size, zoom/reflow, contrast, and color-independent indication of selected/error states;
- dialog focus management, escape/close behavior, and return of focus after overlays;
- language completeness, reading order, and support for translated text expansion;
- error prevention and correction for dates, numeric entries, contact links, and deletion;
- reduced-motion behavior for transitions and pulsing indicators;
- print layout pagination and readable output.

This section identifies review areas; it does not claim conformance with WCAG or any other accessibility standard.

## 11. Source map

| UI area | Main source |
|---|---|
| App shell, overlays, tab routing | `src/App.tsx` |
| Header actions and demo banner | `src/components/Header.tsx` |
| Responsive bottom bar / fixed desktop rail | `src/components/Navigation.tsx` |
| Daily log form | `src/components/DailyLogModal.tsx` |
| Timeline, calendar, filters, entry cards | `src/components/TimelineView.tsx` |
| Printable report | `src/components/ClinicianReportView.tsx` |
| Care notice | `src/components/EducationView.tsx` |
| Care-contact form/list | `src/components/CareContactsView.tsx` |
| Settings panel | `src/components/SettingsView.tsx` |
| First-run dialog | `src/components/OnboardingModal.tsx` |
| Convenience lock | `src/components/DiscreetLockModal.tsx` |
| Base and print styles | `src/index.css` |
| English and Kiswahili strings | `src/locales/en.ts`, `src/locales/sw.ts` |

For the wider product description, including data behavior and privacy limits, see the [App Guide](../APP_GUIDE.md). For proposed requirements and design decisions, see the [UI/UX specification](06-ui-ux-specification.md); proposals in that document are not necessarily shipped behavior.
