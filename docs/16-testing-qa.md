# Testing and Quality Assurance Plan

**Status:** Planned; no implementation or test suite exists yet.

## Test layers

- **Unit:** date handling, input validation, report aggregation, consent state, access policy helpers.
- **Integration:** account/session behavior, owner-scoped data access, create/edit/delete, export generation, deletion workflow.
- **End-to-end:** onboarding, period entry, symptom logging, history correction, report preview/export, settings, failure recovery.
- **Security:** authentication/recovery, authorization, rate limits, injection, secret handling, sensitive logging, dependency review.
- **Accessibility:** keyboard, focus, screen reader, contrast, text scaling, reduced motion, chart alternatives, readable errors.
- **Compatibility/performance:** agreed mobile browsers and low-bandwidth conditions; define targets before pilot.
- **Usability/safety:** comprehension of app limits, optionality of sensitive questions, report usefulness, potential false reassurance or alarm.

## Test data

Use synthetic records only. Avoid realistic combinations that could identify a real person. Keep test and production environments separated; do not import pilot data into developer laptops.

## Release evidence

Record version, environment, test date, scope, result, known issues, reviewer, and remediation. High-severity privacy/security failures and unresolved critical clinical wording block release. Accessibility and user comprehension findings must be reviewed, not just automated scores.

## Test case conventions

Use stable IDs such as `TC-LOG-001`, link to requirement IDs, and include preconditions, steps, expected behavior, and evidence. Detailed cases should be added when the implementation is selected.
