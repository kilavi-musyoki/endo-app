# AI Development and Implementation Specification

**Status:** Proposed workflow; repository currently contains documentation only.

## Stack and folder structure

No framework, language, package manager, or folder structure is approved. Inspect the repository and record stack choice in an ADR before scaffolding. A possible structure after approval:

```text
src/        application code
tests/      automated checks
docs/       product and engineering documentation
```

Do not create scaffolding that implies a production stack has been selected.

## Implementation order

1. Resolve product, clinical, privacy, consent, and age-scope decisions.
2. Approve user flows, content, schema, architecture, and threat model.
3. Select stack and environments; establish secure defaults.
4. Build accessible navigation and consent/settings foundations.
5. Implement cycle and symptom records with edit/delete and owner authorization.
6. Implement history, report preview/export, and reviewed education.
7. Add observability without health payloads; document support and deletion processes.
8. Complete release gates and usability review before pilot.

## Coding rules

- Follow the selected language's formatter, linter, and type-checking conventions once selected.
- Validate on the server and use explicit schemas for stored and API data.
- Keep medical copy in versioned content files with reviewer metadata.
- Use synthetic fixtures only; never copy actual user entries into tests or screenshots.
- Avoid unnecessary third-party dependencies and external data processing.
- Update docs, ADRs, and traceability when behavior changes.

## Definition of done

Acceptance criteria are met; accessible and failure states are covered; privacy and authorization implications are reviewed; documentation and traceability are updated; applicable automated/manual checks are recorded; no unsupported clinical claims are introduced. A passing build is not evidence of clinical validity or legal compliance.
