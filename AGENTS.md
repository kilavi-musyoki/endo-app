# Project instructions for AI coding agents

## Project context

This repository is for a proposed mobile-first endometriosis symptom-tracking and care-linking web app. Read `README.md` and relevant files under `docs/` before implementing. The current repository is documentation-only; no production stack or product behavior has been confirmed.

## Health-product boundaries

- The app supports tracking and clinician conversations; it must not diagnose, exclude, or claim to detect endometriosis.
- Treat any symptom flag as a prompt to seek professional review, never as a probability or diagnosis, unless a formally reviewed and validated product specification later authorizes a specific claim.
- Do not invent clinical thresholds, treatment recommendations, emergency triage logic, or medical content. Require qualified clinical review.
- Use neutral, inclusive, plain language. Make sensitive questions optional and explain why they are asked.
- Never use production health information in development, examples, screenshots, logs, tests, or prompts.

## Privacy and security

- Health and reproductive information is highly sensitive. Minimize collection, access, retention, and disclosure.
- Do not add analytics, advertising trackers, third-party AI services, or data sharing without an explicit reviewed requirement and privacy approval.
- Keep secrets out of source control. Follow least privilege and secure defaults.
- Treat minors, consent, research use, hosting location, and applicable Kenyan requirements as unresolved until reviewed by qualified local advisers.

## Implementation discipline

- Check the current code and docs before selecting frameworks, packages, database schemas, API conventions, or deployment services.
- Keep decisions in ADRs. Mark assumptions and unresolved items clearly; do not describe proposals as shipped behavior.
- Keep user-facing copy understandable, accessible, and non-alarming.
- Update documentation with behavior changes and keep requirements traceability current.
- Do not claim tests, security review, clinical validation, or regulatory compliance unless evidence is recorded.

## Definition of done

A change is complete when its acceptance criteria are addressed, relevant privacy and clinical boundaries are preserved, documentation is updated, and applicable checks have been run and reported. If no code exists yet, do not fabricate build or test commands.
